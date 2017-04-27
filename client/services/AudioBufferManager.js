'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _wavesAudio = require('waves-audio');

var _wavesLoaders = require('waves-loaders');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * API of a compliant view for the `audio-buffer-manager` service.
 *
 * @memberof module:soundworks/client
 * @interface AbstractAudioBufferManagerView
 * @extends module:soundworks/client.AbstractView
 * @abstract
 */
/**
 * Update the progress bar of the view with the given ratio.
 *
 * @name setProgressRatio
 * @memberof module:soundworks/client.AbstractAudioBufferManagerView
 * @function
 * @abstract
 * @instance
 *
 * @param {Number} ratio - Progress ratio of the loaded assets (between 0 and 1).
 */

var SERVICE_ID = 'service:audio-buffer-manager';
var log = (0, _debug2.default)('soundworks:services:audio-buffer-manager');

function flattenLists(a) {
  var ret = [];
  var fun = function fun(val) {
    return Array.isArray(val) ? val.forEach(fun) : ret.push(val);
  };
  fun(a);
  return ret;
}

function clonePathObj(value) {
  if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
    var className = value.constructor.name;
    var clone = null;

    if (className === 'Object') clone = {};else if (className === 'Array') clone = [];else return value;

    for (var key in value) {
      clone[key] = clonePathObj(value[key]);
    }return clone;
  }

  return value;
}

var regexp = /\.[a-zA-Z0-9]{3,4}$/;

function isFilePath(str) {
  return typeof str === 'string' && regexp.test(str);
}

function isDirSpec(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) === 'object' && typeof obj.path === 'string';
}

function decomposePathObj(obj, pathList, refList) {
  var dirs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  for (var key in obj) {
    var value = obj[key];

    if (!dirs && isFilePath(value) || dirs && isDirSpec(value)) {
      var ref = { obj: obj, key: key };
      var index = -1;

      if (!dirs) index = pathList.indexOf(value);

      if (index === -1) {
        var length = pathList.push(value);

        index = length - 1;
        refList[index] = [];
      }

      refList[index].push(ref);

      obj[key] = null;
    } else if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
      decomposePathObj(value, pathList, refList, dirs);
    }
  }
}

function populateRefList(refList, loadedObjList) {
  var length = refList.length;

  if (length !== loadedObjList.length) {
    throw new Error('[' + SERVICE_ID + '] Loaded Buffers do not match file definion');
  }

  for (var i = 0; i < length; i++) {
    var refs = refList[i];

    for (var j = 0, l = refs.length; j < l; j++) {
      var ref = refs[j];
      var obj = ref.obj;
      var key = ref.key;

      obj[key] = loadedObjList[i];
    }
  }
}

function createObjFromPathList(pathList, commonPath) {
  var obj = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(pathList), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var path = _step.value;

      var subPathIndex = path.indexOf(commonPath);

      if (subPathIndex >= 0) {
        subPathIndex += commonPath.length;

        if (path[subPathIndex] === '/') subPathIndex++;

        var subPath = path.substring(subPathIndex);
        var nodes = subPath.split('/');
        var depth = nodes.length;
        var ref = obj;
        var i = void 0;

        for (i = 0; i < depth - 1; i++) {
          var key = nodes[i];

          if (ref[key] === undefined) ref[key] = [];

          ref = ref[key];
        }

        ref.push(path);
      }

      // transform empty array to object
      if (obj.length === 0) obj = (0, _assign2.default)({}, obj);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return obj;
}

function prefixPaths(pathList, prefix) {
  // test absolute urls (or protocol relative)
  var isAbsolute = /^https?:\/\/|^\/\//i;

  pathList = pathList.map(function (path) {
    if (isAbsolute.test(path) || path[0] === '/') return path;else return prefix + path;
  });

  return pathList;
}

/**
 * Interface for the client `'audio-buffer-manager'` service.
 *
 * This service allows to preload files and store them into buffers
 * before the beginning of the experience. Audio files will be converted and
 * stored into AudioBuffer objects.
 *
 * @param {Object} options
 * @param {Array<String>} options.assetsDomain - Prefix concatenated to all
 *  given paths.
 * @param {Object} options.files - Definition of files to load.
 * @param {Object} options.directories - Definition of directories to load.
 * @param {Array<String>} options.directories - List of directories to load.
 * @param {Boolean} [options.showProgress=true] - Display the progress bar
 *  in the view.
 * @param {String|module:soundworks/client.FileSystem~ListConfig} [options.directories=null] -
 *  Load all the files in particular directories. If setted this option relies
 *  on the {@link module:soundworks/client.FileSystem} which itself relies on
 *  its server counterpart, the audio-buffer-manager can then no longer be
 *  considered as a client-only service.
 *
 * @memberof module:soundworks/client
 * @example
 * // require and configure the `audio-buffer-manager` inside the experience
 * // constructor
 * // Defining a single array of audio files results in a single
 * // array of audio buffers associated to the identifier `default`.
 *
 * // There are two different ways to specify the files to be loaded and the
 * // data structure in which the loaded data objects are arranged:
 * //
 * // (1.) With the 'files' option, the files and structure are defined by an
 * // object of any depth that contains file paths. All specified files are
 * // loaded and the loaded data objects are stored into an object of the same
 * // structure as the definition object.
 *
 * this.audioBufferManager = this.require('audio-buffer-manager', { files: [
 *   'sounds/drums/kick.mp3',
 *   'sounds/drums/snare.mp3'
 * ]});
 *
 * this.audioBufferManager = this.require('audio-buffer-manager', { files: {
 *   kick: 'sounds/kick_44kHz.mp3',
 *   snare: 'sounds/808snare.mp3'
 * }});
 *
 * this.audioBufferManager = this.require('audio-buffer-manager', { files: {
 *   latin: {
 *     audio: 'loops/sheila-e-raspberry.mp3',
 *     markers: 'loops/sheila-e-raspberry-markers.json',
 *   },
 *   jazz: {
 *     audio: 'loops/nussbaum-shuffle.mp3',
 *     markers: 'loops/nussbaum-shuffle-markers.json',
 *   },
 * }});
 *
 * this.audioBufferManager = this.require('audio-buffer-manager', { files: {
 *   instruments: [
 *     'sounds/instruments/kick_44kHz.mp3',
 *     'sounds/instruments/808snare.mp3'],
 *   loops: [
 *     'sounds/loops/sheila-e-raspberry.mp3',
 *     'sounds/loops/nussbaum-shuffle.mp3'],
 * }});
 *
 * //(2.) The 'directories' option can be used to load the files of a
 * // given directory. Each directory is specified by an object that has a
 * // property 'path' with the directory path and optionally the keys
 * // 'recursive' (specifying whether the directory's sub-directories are
 * // considered) and a key 'match' (specifying a regexp to select the files
 * // in the given directory).
 *
 * // With the option 'recursive' set to false, all (matching) files
 * // in a given directoriy are loaded into an arrays of objects without
 * // considering sub-directories. The arrays of loaded data objects are
 * // arranged in the same data structure as the definition object.
 *
 * this.audioBufferManager = this.require('audio-buffer-manager', {
 *   directories: {
 *     instruments: { path: 'sounds/instruments', recursive: false },
 *     loops: { path: 'sounds/instruments', recursive: false },
 *   },
 * });
 *
 * // When 'recursive' is set to true, all (matching) files in the given
 * // directories and their sub-directories are loaded as arrays of objects.
 * // With the option 'flatten' set to true, all files in the defined directory
 * // and its sub-directories are loaded into a single array. When the option
 * // 'flatten' set to false, the files of each sub-directory are assembled
 * // into an array and all of these arrays are arranged to a data structure
 * // that reproduces the sub-directory tree of the defined directories.
 * // The resulting data structure corresponds to the structure of the
 * // definition object extended by the defined sub-directory trees.
 *
 * // The following option results in a single array of pre-loaded files:
 * this.audioBufferManager = this.require('audio-buffer-manager', {
 *   directories: {
 *     path: 'sounds',
 *     recursive: true,
 *     flatten: true,
 *     match: /\.mp3/,
 *   },
 * });
 *
 * // This variant results in a data structure that reproduces the
 * // sub-directory tree of the 'sounds' directory:
 * this.audioBufferManager = this.require('audio-buffer-manager', {
 *   directories: {
 *     path: 'sounds',
 *     recursive: true,
 *     match: /\.mp3/,
 *   },
 * });
 *
 * // The loaded objects can be retrieved according to their definition, as for example :
 * const kickBuffer = this.audioBufferManager.data.kick;
 * const audioBuffer = this.audioBufferManager.data.latin.audio;
 * const markerArray = this.audioBufferManager.data.jazz.markers;
 * const snareBuffer = this.audioBufferManager.data.instruments[1];
 * const nussbaumLoop = this.audioBufferManager.data.loops[1];
 */

var AudioBufferManager = function (_Service) {
  (0, _inherits3.default)(AudioBufferManager, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function AudioBufferManager() {
    (0, _classCallCheck3.default)(this, AudioBufferManager);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AudioBufferManager.__proto__ || (0, _getPrototypeOf2.default)(AudioBufferManager)).call(this, SERVICE_ID, false));

    var defaults = {
      assetsDomain: '',
      files: null,
      directories: null,
      audioWrapTail: 0,
      viewPriority: 4,
      debug: false };

    _this.view = null;

    /**
     * Data structure correponding to the structure of requested files.
     * @private
     */
    _this.data = [];

    _this.configure(defaults);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(AudioBufferManager, [{
    key: 'configure',
    value: function configure(options) {
      (0, _get3.default)(AudioBufferManager.prototype.__proto__ || (0, _getPrototypeOf2.default)(AudioBufferManager.prototype), 'configure', this).call(this, options);

      var directories = this.options.directories;

      if (directories !== null) {
        this._fileSystem = this.require('file-system');
      }
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)(AudioBufferManager.prototype.__proto__ || (0, _getPrototypeOf2.default)(AudioBufferManager.prototype), 'start', this).call(this);

      this.show();

      if (this.options.files || this.options.directories) {
        if (this.options.files) this.loadFiles(this.options.files, this.view);

        if (this.options.directories) this.loadDirectories(this.options.directories, this.view);
      } else {
        this.ready();
      }
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      (0, _get3.default)(AudioBufferManager.prototype.__proto__ || (0, _getPrototypeOf2.default)(AudioBufferManager.prototype), 'stop', this).call(this);
    }
  }, {
    key: 'ready',
    value: function ready() {
      if (this.options.debug === false) (0, _get3.default)(AudioBufferManager.prototype.__proto__ || (0, _getPrototypeOf2.default)(AudioBufferManager.prototype), 'ready', this).call(this);
    }

    /**
     * Load files defined as a set of file paths.
     * @param {Object} defObj - Definition of files to load
     * @returns {Promise} - Promise resolved with the resulting data structure
     */

  }, {
    key: 'loadFiles',
    value: function loadFiles(defObj) {
      var _this2 = this;

      var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var promise = new _promise2.default(function (resolve, reject) {
        var pathList = [];
        var refList = [];

        if (typeof defObj === 'string') defObj = [defObj];

        // create data object copying the strcuture of the file definion object
        var dataObj = clonePathObj(defObj);
        decomposePathObj(dataObj, pathList, refList, false);

        // prefix relative paths with assetsDomain
        pathList = prefixPaths(pathList, _this2.options.assetsDomain);

        log(pathList, refList);

        // load files
        if (pathList.length > 0) {
          var loader = new _wavesLoaders.SuperLoader();
          loader.setAudioContext(_wavesAudio.audioContext);

          if (view && view.setProgressRatio) {
            var progressPerFile = pathList.map(function () {
              return 0;
            }); // track files loading progress

            loader.progressCallback = function (e) {
              progressPerFile[e.index] = e.value;

              var totalProgress = 0;

              for (var i = 0; i < progressPerFile.length; i++) {
                totalProgress += progressPerFile[i];
              }totalProgress /= progressPerFile.length;

              view.setProgressRatio(totalProgress);
            };
          }

          loader.load(pathList, {
            wrapAroundExtention: _this2.options.audioWrapTail
          }).then(function (loadedObjList) {
            // place loaded objects (i.e. audio buffers and json files) into the structure of the file definition object
            populateRefList(refList, loadedObjList);

            // mix loaded objects into data
            (0, _assign2.default)(_this2.data, dataObj);
            _this2.ready();
            resolve(dataObj);
          }).catch(function (error) {
            reject(error);
            console.error(error);
          });
        } else {
          _this2.ready();
          resolve([]);
        }
      });

      return promise;
    }

    /**
     * Load files defined as a set of directory paths.
     * @param {Object} defObj - Definition of files to load
     * @returns {Promise} - Promise resolved with the resulting data structure
     */

  }, {
    key: 'loadDirectories',
    value: function loadDirectories(defObj) {
      var _this3 = this;

      var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var promise = new _promise2.default(function (resolve, reject) {
        var dirDefList = [];
        var dirRefList = [];

        // for the case that just a directory object is given as definition,
        // we have to wrap it temporarily into a dummy object
        defObj = { def: defObj };

        var fileDefObj = clonePathObj(defObj); // clone definition object

        // decompose directory definition into list of directory paths (strings)
        decomposePathObj(fileDefObj, dirDefList, dirRefList, true);

        _this3._fileSystem.getList(dirDefList).then(function (filePathListList) {
          var subDirList = [];
          var length = filePathListList.length;

          // create sub directory file definitions (list of file paths structured into sub directory trees derived from file paths)
          if (length === dirDefList.length) {
            for (var i = 0; i < length; i++) {
              var dirPath = dirDefList[i].path;
              var flatten = !!dirDefList[i].flatten;
              var pathList = filePathListList[i];
              var subDir = pathList;

              if (!flatten) subDir = createObjFromPathList(pathList, dirPath);

              subDirList.push(subDir);
            }

            // replace directory paths in initial definition by sub directory file definitions
            // to create a complete file definition object
            populateRefList(dirRefList, subDirList);
          } else {
            throw new Error('[' + SERVICE_ID + '] Cannot retrieve file paths from defined directories');
          }

          // unwrap subDir from dummy object
          fileDefObj = fileDefObj.def;

          // load files
          _this3.loadFiles(fileDefObj, view).then(function (data) {
            _this3.ready();
            resolve(data);
          }).catch(function (error) {
            return reject(error);
          });
        }).catch(function (error) {
          return reject(error);
        });
      });

      return promise;
    }

    /**
     * wrapAround, copy the begining input buffer to the end of an output buffer
     * @private
     * @param {arraybuffer} inBuffer {arraybuffer} - The input buffer
     * @returns {arraybuffer} - The processed buffer (with frame copied from the begining to the end)
     */

  }, {
    key: '_wrapAround',
    value: function _wrapAround(inBuffer) {
      var inLength = inBuffer.length;
      var outLength = inLength + this.options.wrapAroundExtension * inBuffer.sampleRate;
      var outBuffer = _wavesAudio.audioContext.createBuffer(inBuffer.numberOfChannels, outLength, inBuffer.sampleRate);
      var arrayChData = void 0,
          arrayOutChData = void 0;

      for (var ch = 0; ch < inBuffer.numberOfChannels; ch++) {
        arrayChData = inBuffer.getChannelData(ch);
        arrayOutChData = outBuffer.getChannelData(ch);

        for (var i = 0; i < inLength; i++) {
          arrayOutChData[i] = arrayChData[i];
        }for (var _i = inLength; _i < outLength; _i++) {
          arrayOutChData[_i] = arrayChData[_i - inLength];
        }
      }

      return outBuffer;
    }

    /** deprecated */

  }, {
    key: 'load',
    value: function load(files) {
      var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return this.loadFiles(files, view);
    }

    /**
     * Retrieve a loaded object.
     * @param {String} id - Object or group identifier.
     * @param {String} key - Member key in group.
     * @returns {Promise} - Returns the loaded object.
     */

  }, {
    key: 'get',
    value: function get(id) {
      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var obj = this.data[id];

      if (obj && key !== null) return obj[key];

      return obj;
    }

    /**
     * Retrieve a single audio buffer associated to a given id.
     * @param {String} id - Object identifier.
     * @param {Number} index - Audio buffer index (if array).
     * @returns {Promise} - Returns a single loaded audio buffer associated to the given id.
     */

  }, {
    key: 'getAudioBuffer',
    value: function getAudioBuffer() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      return this.audioBuffers[id][index];
    }

    /**
     * Retrieve an array of audio buffers associated to a given id.
     * @param {String} id - Object identifier.
     * @returns {Promise} - Returns an array of loaded audio buffers associated to the given id.
     */

  }, {
    key: 'getAudioBufferArray',
    value: function getAudioBufferArray() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';

      return this.audioBuffers[id];
    }
  }]);
  return AudioBufferManager;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, AudioBufferManager);

exports.default = AudioBufferManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvQnVmZmVyTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwibG9nIiwiZmxhdHRlbkxpc3RzIiwiYSIsInJldCIsImZ1biIsInZhbCIsIkFycmF5IiwiaXNBcnJheSIsImZvckVhY2giLCJwdXNoIiwiY2xvbmVQYXRoT2JqIiwidmFsdWUiLCJjbGFzc05hbWUiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJjbG9uZSIsImtleSIsInJlZ2V4cCIsImlzRmlsZVBhdGgiLCJzdHIiLCJ0ZXN0IiwiaXNEaXJTcGVjIiwib2JqIiwicGF0aCIsImRlY29tcG9zZVBhdGhPYmoiLCJwYXRoTGlzdCIsInJlZkxpc3QiLCJkaXJzIiwicmVmIiwiaW5kZXgiLCJpbmRleE9mIiwibGVuZ3RoIiwicG9wdWxhdGVSZWZMaXN0IiwibG9hZGVkT2JqTGlzdCIsIkVycm9yIiwiaSIsInJlZnMiLCJqIiwibCIsImNyZWF0ZU9iakZyb21QYXRoTGlzdCIsImNvbW1vblBhdGgiLCJzdWJQYXRoSW5kZXgiLCJzdWJQYXRoIiwic3Vic3RyaW5nIiwibm9kZXMiLCJzcGxpdCIsImRlcHRoIiwidW5kZWZpbmVkIiwicHJlZml4UGF0aHMiLCJwcmVmaXgiLCJpc0Fic29sdXRlIiwibWFwIiwiQXVkaW9CdWZmZXJNYW5hZ2VyIiwiZGVmYXVsdHMiLCJhc3NldHNEb21haW4iLCJmaWxlcyIsImRpcmVjdG9yaWVzIiwiYXVkaW9XcmFwVGFpbCIsInZpZXdQcmlvcml0eSIsImRlYnVnIiwidmlldyIsImRhdGEiLCJjb25maWd1cmUiLCJvcHRpb25zIiwiX2ZpbGVTeXN0ZW0iLCJyZXF1aXJlIiwic2hvdyIsImxvYWRGaWxlcyIsImxvYWREaXJlY3RvcmllcyIsInJlYWR5IiwiaGlkZSIsImRlZk9iaiIsInByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZGF0YU9iaiIsImxvYWRlciIsInNldEF1ZGlvQ29udGV4dCIsInNldFByb2dyZXNzUmF0aW8iLCJwcm9ncmVzc1BlckZpbGUiLCJwcm9ncmVzc0NhbGxiYWNrIiwiZSIsInRvdGFsUHJvZ3Jlc3MiLCJsb2FkIiwid3JhcEFyb3VuZEV4dGVudGlvbiIsInRoZW4iLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsImRpckRlZkxpc3QiLCJkaXJSZWZMaXN0IiwiZGVmIiwiZmlsZURlZk9iaiIsImdldExpc3QiLCJmaWxlUGF0aExpc3RMaXN0Iiwic3ViRGlyTGlzdCIsImRpclBhdGgiLCJmbGF0dGVuIiwic3ViRGlyIiwiaW5CdWZmZXIiLCJpbkxlbmd0aCIsIm91dExlbmd0aCIsIndyYXBBcm91bmRFeHRlbnNpb24iLCJzYW1wbGVSYXRlIiwib3V0QnVmZmVyIiwiY3JlYXRlQnVmZmVyIiwibnVtYmVyT2ZDaGFubmVscyIsImFycmF5Q2hEYXRhIiwiYXJyYXlPdXRDaERhdGEiLCJjaCIsImdldENoYW5uZWxEYXRhIiwiaWQiLCJhdWRpb0J1ZmZlcnMiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7Ozs7O0FBWUEsSUFBTUEsYUFBYSw4QkFBbkI7QUFDQSxJQUFNQyxNQUFNLHFCQUFNLDBDQUFOLENBQVo7O0FBRUEsU0FBU0MsWUFBVCxDQUFzQkMsQ0FBdEIsRUFBeUI7QUFDdkIsTUFBTUMsTUFBTSxFQUFaO0FBQ0EsTUFBTUMsTUFBTSxTQUFOQSxHQUFNLENBQUNDLEdBQUQ7QUFBQSxXQUFTQyxNQUFNQyxPQUFOLENBQWNGLEdBQWQsSUFBcUJBLElBQUlHLE9BQUosQ0FBWUosR0FBWixDQUFyQixHQUF3Q0QsSUFBSU0sSUFBSixDQUFTSixHQUFULENBQWpEO0FBQUEsR0FBWjtBQUNBRCxNQUFJRixDQUFKO0FBQ0EsU0FBT0MsR0FBUDtBQUNEOztBQUVELFNBQVNPLFlBQVQsQ0FBc0JDLEtBQXRCLEVBQTZCO0FBQzNCLE1B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SUFBSUEsS0FBSWlFLFFBQWIsRUFBdUJqRSxLQUFJa0UsU0FBM0IsRUFBc0NsRSxJQUF0QztBQUNFeUUseUJBQWV6RSxFQUFmLElBQW9Cd0UsWUFBWXhFLEtBQUlpRSxRQUFoQixDQUFwQjtBQURGO0FBRUQ7O0FBRUQsYUFBT0ksU0FBUDtBQUNEOztBQUVEOzs7O3lCQUNLakQsSyxFQUFvQjtBQUFBLFVBQWJLLElBQWEsdUVBQU4sSUFBTTs7QUFDdkIsYUFBTyxLQUFLTyxTQUFMLENBQWVaLEtBQWYsRUFBc0JLLElBQXRCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7O3dCQU1JbUQsRSxFQUFnQjtBQUFBLFVBQVovRixHQUFZLHVFQUFOLElBQU07O0FBQ2xCLFVBQU1NLE1BQU0sS0FBS3VDLElBQUwsQ0FBVWtELEVBQVYsQ0FBWjs7QUFFQSxVQUFJekYsT0FBUU4sUUFBUSxJQUFwQixFQUNFLE9BQU9NLElBQUlOLEdBQUosQ0FBUDs7QUFFRixhQUFPTSxHQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztxQ0FNMEM7QUFBQSxVQUEzQnlGLEVBQTJCLHVFQUF0QixTQUFzQjtBQUFBLFVBQVhsRixLQUFXLHVFQUFILENBQUc7O0FBQ3hDLGFBQU8sS0FBS21GLFlBQUwsQ0FBa0JELEVBQWxCLEVBQXNCbEYsS0FBdEIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7OzswQ0FLb0M7QUFBQSxVQUFoQmtGLEVBQWdCLHVFQUFYLFNBQVc7O0FBQ2xDLGFBQU8sS0FBS0MsWUFBTCxDQUFrQkQsRUFBbEIsQ0FBUDtBQUNEOzs7OztBQUdILHlCQUFlRSxRQUFmLENBQXdCbEgsVUFBeEIsRUFBb0NxRCxrQkFBcEM7O2tCQUVlQSxrQiIsImZpbGUiOiJBdWRpb0J1ZmZlck1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgeyBTdXBlckxvYWRlciB9IGZyb20gJ3dhdmVzLWxvYWRlcnMnO1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBfcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbi8qKlxuICogQVBJIG9mIGEgY29tcGxpYW50IHZpZXcgZm9yIHRoZSBgYXVkaW8tYnVmZmVyLW1hbmFnZXJgIHNlcnZpY2UuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGludGVyZmFjZSBBYnN0cmFjdEF1ZGlvQnVmZmVyTWFuYWdlclZpZXdcbiAqIEBleHRlbmRzIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFZpZXdcbiAqIEBhYnN0cmFjdFxuICovXG4vKipcbiAqIFVwZGF0ZSB0aGUgcHJvZ3Jlc3MgYmFyIG9mIHRoZSB2aWV3IHdpdGggdGhlIGdpdmVuIHJhdGlvLlxuICpcbiAqIEBuYW1lIHNldFByb2dyZXNzUmF0aW9cbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RBdWRpb0J1ZmZlck1hbmFnZXJWaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHJhdGlvIC0gUHJvZ3Jlc3MgcmF0aW8gb2YgdGhlIGxvYWRlZCBhc3NldHMgKGJldHdlZW4gMCBhbmQgMSkuXG4gKi9cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmF1ZGlvLWJ1ZmZlci1tYW5hZ2VyJztcbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnNlcnZpY2VzOmF1ZGlvLWJ1ZmZlci1tYW5hZ2VyJyk7XG5cbmZ1bmN0aW9uIGZsYXR0ZW5MaXN0cyhhKSB7XG4gIGNvbnN0IHJldCA9IFtdO1xuICBjb25zdCBmdW4gPSAodmFsKSA9PiBBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwuZm9yRWFjaChmdW4pIDogcmV0LnB1c2godmFsKTtcbiAgZnVuKGEpO1xuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBjbG9uZVBhdGhPYmoodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICBjb25zdCBjbGFzc05hbWUgPSB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgIGxldCBjbG9uZSA9IG51bGw7XG5cbiAgICBpZiAoY2xhc3NOYW1lID09PSAnT2JqZWN0JylcbiAgICAgIGNsb25lID0ge307XG4gICAgZWxzZSBpZiAoY2xhc3NOYW1lID09PSAnQXJyYXknKVxuICAgICAgY2xvbmUgPSBbXTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gdmFsdWUpXG4gICAgICBjbG9uZVtrZXldID0gY2xvbmVQYXRoT2JqKHZhbHVlW2tleV0pO1xuXG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5jb25zdCByZWdleHAgPSAvXFwuW2EtekEtWjAtOV17Myw0fSQvO1xuXG5mdW5jdGlvbiBpc0ZpbGVQYXRoKHN0cikge1xuICByZXR1cm4gKHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnICYmIHJlZ2V4cC50ZXN0KHN0cikpO1xufVxuXG5mdW5jdGlvbiBpc0RpclNwZWMob2JqKSB7XG4gIHJldHVybiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG9iai5wYXRoID09PSAnc3RyaW5nJyk7XG59XG5cbmZ1bmN0aW9uIGRlY29tcG9zZVBhdGhPYmoob2JqLCBwYXRoTGlzdCwgcmVmTGlzdCwgZGlycyA9IGZhbHNlKSB7XG4gIGZvciAobGV0IGtleSBpbiBvYmopIHtcbiAgICBjb25zdCB2YWx1ZSA9IG9ialtrZXldO1xuXG4gICAgaWYgKCghZGlycyAmJiBpc0ZpbGVQYXRoKHZhbHVlKSkgfHwgKGRpcnMgJiYgaXNEaXJTcGVjKHZhbHVlKSkpIHtcbiAgICAgIGNvbnN0IHJlZiA9IHsgb2JqLCBrZXkgfTtcbiAgICAgIGxldCBpbmRleCA9IC0xO1xuXG4gICAgICBpZiAoIWRpcnMpXG4gICAgICAgIGluZGV4ID0gcGF0aExpc3QuaW5kZXhPZih2YWx1ZSk7XG5cbiAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gcGF0aExpc3QucHVzaCh2YWx1ZSk7XG5cbiAgICAgICAgaW5kZXggPSBsZW5ndGggLSAxO1xuICAgICAgICByZWZMaXN0W2luZGV4XSA9IFtdO1xuICAgICAgfVxuXG4gICAgICByZWZMaXN0W2luZGV4XS5wdXNoKHJlZik7XG5cbiAgICAgIG9ialtrZXldID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGRlY29tcG9zZVBhdGhPYmoodmFsdWUsIHBhdGhMaXN0LCByZWZMaXN0LCBkaXJzKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcG9wdWxhdGVSZWZMaXN0KHJlZkxpc3QsIGxvYWRlZE9iakxpc3QpIHtcbiAgY29uc3QgbGVuZ3RoID0gcmVmTGlzdC5sZW5ndGg7XG5cbiAgaWYgKGxlbmd0aCAhPT0gbG9hZGVkT2JqTGlzdC5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFske1NFUlZJQ0VfSUR9XSBMb2FkZWQgQnVmZmVycyBkbyBub3QgbWF0Y2ggZmlsZSBkZWZpbmlvbmApO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHJlZnMgPSByZWZMaXN0W2ldO1xuXG4gICAgZm9yIChsZXQgaiA9IDAsIGwgPSByZWZzLmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgY29uc3QgcmVmID0gcmVmc1tqXTtcbiAgICAgIGNvbnN0IG9iaiA9IHJlZi5vYmo7XG4gICAgICBjb25zdCBrZXkgPSByZWYua2V5O1xuXG4gICAgICBvYmpba2V5XSA9IGxvYWRlZE9iakxpc3RbaV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU9iakZyb21QYXRoTGlzdChwYXRoTGlzdCwgY29tbW9uUGF0aCkge1xuICBsZXQgb2JqID0gW107XG5cbiAgZm9yIChsZXQgcGF0aCBvZiBwYXRoTGlzdCkge1xuICAgIGxldCBzdWJQYXRoSW5kZXggPSBwYXRoLmluZGV4T2YoY29tbW9uUGF0aCk7XG5cbiAgICBpZiAoc3ViUGF0aEluZGV4ID49IDApIHtcbiAgICAgIHN1YlBhdGhJbmRleCArPSBjb21tb25QYXRoLmxlbmd0aDtcblxuICAgICAgaWYgKHBhdGhbc3ViUGF0aEluZGV4XSA9PT0gJy8nKVxuICAgICAgICBzdWJQYXRoSW5kZXgrKztcblxuICAgICAgY29uc3Qgc3ViUGF0aCA9IHBhdGguc3Vic3RyaW5nKHN1YlBhdGhJbmRleCk7XG4gICAgICBjb25zdCBub2RlcyA9IHN1YlBhdGguc3BsaXQoJy8nKTtcbiAgICAgIGNvbnN0IGRlcHRoID0gbm9kZXMubGVuZ3RoO1xuICAgICAgbGV0IHJlZiA9IG9iajtcbiAgICAgIGxldCBpO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZGVwdGggLSAxOyBpKyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0gbm9kZXNbaV07XG5cbiAgICAgICAgaWYgKHJlZltrZXldID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgcmVmW2tleV0gPSBbXTtcblxuICAgICAgICByZWYgPSByZWZba2V5XTtcbiAgICAgIH1cblxuICAgICAgcmVmLnB1c2gocGF0aCk7XG4gICAgfVxuXG4gICAgLy8gdHJhbnNmb3JtIGVtcHR5IGFycmF5IHRvIG9iamVjdFxuICAgIGlmIChvYmoubGVuZ3RoID09PSAwKVxuICAgICAgb2JqID0gT2JqZWN0LmFzc2lnbih7fSwgb2JqKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbmZ1bmN0aW9uIHByZWZpeFBhdGhzKHBhdGhMaXN0LCBwcmVmaXgpIHtcbiAgLy8gdGVzdCBhYnNvbHV0ZSB1cmxzIChvciBwcm90b2NvbCByZWxhdGl2ZSlcbiAgY29uc3QgaXNBYnNvbHV0ZSA9IC9eaHR0cHM/OlxcL1xcL3xeXFwvXFwvL2k7XG5cbiAgcGF0aExpc3QgPSBwYXRoTGlzdC5tYXAoKHBhdGgpID0+IHtcbiAgICBpZiAoaXNBYnNvbHV0ZS50ZXN0KHBhdGgpIHx8IHBhdGhbMF0gPT09ICcvJylcbiAgICAgIHJldHVybiBwYXRoO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBwcmVmaXggKyBwYXRoO1xuICB9KTtcblxuICByZXR1cm4gcGF0aExpc3Q7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnYXVkaW8tYnVmZmVyLW1hbmFnZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gcHJlbG9hZCBmaWxlcyBhbmQgc3RvcmUgdGhlbSBpbnRvIGJ1ZmZlcnNcbiAqIGJlZm9yZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBleHBlcmllbmNlLiBBdWRpbyBmaWxlcyB3aWxsIGJlIGNvbnZlcnRlZCBhbmRcbiAqIHN0b3JlZCBpbnRvIEF1ZGlvQnVmZmVyIG9iamVjdHMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gb3B0aW9ucy5hc3NldHNEb21haW4gLSBQcmVmaXggY29uY2F0ZW5hdGVkIHRvIGFsbFxuICogIGdpdmVuIHBhdGhzLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMuZmlsZXMgLSBEZWZpbml0aW9uIG9mIGZpbGVzIHRvIGxvYWQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5kaXJlY3RvcmllcyAtIERlZmluaXRpb24gb2YgZGlyZWN0b3JpZXMgdG8gbG9hZC5cbiAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gb3B0aW9ucy5kaXJlY3RvcmllcyAtIExpc3Qgb2YgZGlyZWN0b3JpZXMgdG8gbG9hZC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvd1Byb2dyZXNzPXRydWVdIC0gRGlzcGxheSB0aGUgcHJvZ3Jlc3MgYmFyXG4gKiAgaW4gdGhlIHZpZXcuXG4gKiBAcGFyYW0ge1N0cmluZ3xtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuRmlsZVN5c3RlbX5MaXN0Q29uZmlnfSBbb3B0aW9ucy5kaXJlY3Rvcmllcz1udWxsXSAtXG4gKiAgTG9hZCBhbGwgdGhlIGZpbGVzIGluIHBhcnRpY3VsYXIgZGlyZWN0b3JpZXMuIElmIHNldHRlZCB0aGlzIG9wdGlvbiByZWxpZXNcbiAqICBvbiB0aGUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5GaWxlU3lzdGVtfSB3aGljaCBpdHNlbGYgcmVsaWVzIG9uXG4gKiAgaXRzIHNlcnZlciBjb3VudGVycGFydCwgdGhlIGF1ZGlvLWJ1ZmZlci1tYW5hZ2VyIGNhbiB0aGVuIG5vIGxvbmdlciBiZVxuICogIGNvbnNpZGVyZWQgYXMgYSBjbGllbnQtb25seSBzZXJ2aWNlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyByZXF1aXJlIGFuZCBjb25maWd1cmUgdGhlIGBhdWRpby1idWZmZXItbWFuYWdlcmAgaW5zaWRlIHRoZSBleHBlcmllbmNlXG4gKiAvLyBjb25zdHJ1Y3RvclxuICogLy8gRGVmaW5pbmcgYSBzaW5nbGUgYXJyYXkgb2YgYXVkaW8gZmlsZXMgcmVzdWx0cyBpbiBhIHNpbmdsZVxuICogLy8gYXJyYXkgb2YgYXVkaW8gYnVmZmVycyBhc3NvY2lhdGVkIHRvIHRoZSBpZGVudGlmaWVyIGBkZWZhdWx0YC5cbiAqXG4gKiAvLyBUaGVyZSBhcmUgdHdvIGRpZmZlcmVudCB3YXlzIHRvIHNwZWNpZnkgdGhlIGZpbGVzIHRvIGJlIGxvYWRlZCBhbmQgdGhlXG4gKiAvLyBkYXRhIHN0cnVjdHVyZSBpbiB3aGljaCB0aGUgbG9hZGVkIGRhdGEgb2JqZWN0cyBhcmUgYXJyYW5nZWQ6XG4gKiAvL1xuICogLy8gKDEuKSBXaXRoIHRoZSAnZmlsZXMnIG9wdGlvbiwgdGhlIGZpbGVzIGFuZCBzdHJ1Y3R1cmUgYXJlIGRlZmluZWQgYnkgYW5cbiAqIC8vIG9iamVjdCBvZiBhbnkgZGVwdGggdGhhdCBjb250YWlucyBmaWxlIHBhdGhzLiBBbGwgc3BlY2lmaWVkIGZpbGVzIGFyZVxuICogLy8gbG9hZGVkIGFuZCB0aGUgbG9hZGVkIGRhdGEgb2JqZWN0cyBhcmUgc3RvcmVkIGludG8gYW4gb2JqZWN0IG9mIHRoZSBzYW1lXG4gKiAvLyBzdHJ1Y3R1cmUgYXMgdGhlIGRlZmluaXRpb24gb2JqZWN0LlxuICpcbiAqIHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1idWZmZXItbWFuYWdlcicsIHsgZmlsZXM6IFtcbiAqICAgJ3NvdW5kcy9kcnVtcy9raWNrLm1wMycsXG4gKiAgICdzb3VuZHMvZHJ1bXMvc25hcmUubXAzJ1xuICogXX0pO1xuICpcbiAqIHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1idWZmZXItbWFuYWdlcicsIHsgZmlsZXM6IHtcbiAqICAga2ljazogJ3NvdW5kcy9raWNrXzQ0a0h6Lm1wMycsXG4gKiAgIHNuYXJlOiAnc291bmRzLzgwOHNuYXJlLm1wMydcbiAqIH19KTtcbiAqXG4gKiB0aGlzLmF1ZGlvQnVmZmVyTWFuYWdlciA9IHRoaXMucmVxdWlyZSgnYXVkaW8tYnVmZmVyLW1hbmFnZXInLCB7IGZpbGVzOiB7XG4gKiAgIGxhdGluOiB7XG4gKiAgICAgYXVkaW86ICdsb29wcy9zaGVpbGEtZS1yYXNwYmVycnkubXAzJyxcbiAqICAgICBtYXJrZXJzOiAnbG9vcHMvc2hlaWxhLWUtcmFzcGJlcnJ5LW1hcmtlcnMuanNvbicsXG4gKiAgIH0sXG4gKiAgIGpheno6IHtcbiAqICAgICBhdWRpbzogJ2xvb3BzL251c3NiYXVtLXNodWZmbGUubXAzJyxcbiAqICAgICBtYXJrZXJzOiAnbG9vcHMvbnVzc2JhdW0tc2h1ZmZsZS1tYXJrZXJzLmpzb24nLFxuICogICB9LFxuICogfX0pO1xuICpcbiAqIHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1idWZmZXItbWFuYWdlcicsIHsgZmlsZXM6IHtcbiAqICAgaW5zdHJ1bWVudHM6IFtcbiAqICAgICAnc291bmRzL2luc3RydW1lbnRzL2tpY2tfNDRrSHoubXAzJyxcbiAqICAgICAnc291bmRzL2luc3RydW1lbnRzLzgwOHNuYXJlLm1wMyddLFxuICogICBsb29wczogW1xuICogICAgICdzb3VuZHMvbG9vcHMvc2hlaWxhLWUtcmFzcGJlcnJ5Lm1wMycsXG4gKiAgICAgJ3NvdW5kcy9sb29wcy9udXNzYmF1bS1zaHVmZmxlLm1wMyddLFxuICogfX0pO1xuICpcbiAqIC8vKDIuKSBUaGUgJ2RpcmVjdG9yaWVzJyBvcHRpb24gY2FuIGJlIHVzZWQgdG8gbG9hZCB0aGUgZmlsZXMgb2YgYVxuICogLy8gZ2l2ZW4gZGlyZWN0b3J5LiBFYWNoIGRpcmVjdG9yeSBpcyBzcGVjaWZpZWQgYnkgYW4gb2JqZWN0IHRoYXQgaGFzIGFcbiAqIC8vIHByb3BlcnR5ICdwYXRoJyB3aXRoIHRoZSBkaXJlY3RvcnkgcGF0aCBhbmQgb3B0aW9uYWxseSB0aGUga2V5c1xuICogLy8gJ3JlY3Vyc2l2ZScgKHNwZWNpZnlpbmcgd2hldGhlciB0aGUgZGlyZWN0b3J5J3Mgc3ViLWRpcmVjdG9yaWVzIGFyZVxuICogLy8gY29uc2lkZXJlZCkgYW5kIGEga2V5ICdtYXRjaCcgKHNwZWNpZnlpbmcgYSByZWdleHAgdG8gc2VsZWN0IHRoZSBmaWxlc1xuICogLy8gaW4gdGhlIGdpdmVuIGRpcmVjdG9yeSkuXG4gKlxuICogLy8gV2l0aCB0aGUgb3B0aW9uICdyZWN1cnNpdmUnIHNldCB0byBmYWxzZSwgYWxsIChtYXRjaGluZykgZmlsZXNcbiAqIC8vIGluIGEgZ2l2ZW4gZGlyZWN0b3JpeSBhcmUgbG9hZGVkIGludG8gYW4gYXJyYXlzIG9mIG9iamVjdHMgd2l0aG91dFxuICogLy8gY29uc2lkZXJpbmcgc3ViLWRpcmVjdG9yaWVzLiBUaGUgYXJyYXlzIG9mIGxvYWRlZCBkYXRhIG9iamVjdHMgYXJlXG4gKiAvLyBhcnJhbmdlZCBpbiB0aGUgc2FtZSBkYXRhIHN0cnVjdHVyZSBhcyB0aGUgZGVmaW5pdGlvbiBvYmplY3QuXG4gKlxuICogdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLWJ1ZmZlci1tYW5hZ2VyJywge1xuICogICBkaXJlY3Rvcmllczoge1xuICogICAgIGluc3RydW1lbnRzOiB7IHBhdGg6ICdzb3VuZHMvaW5zdHJ1bWVudHMnLCByZWN1cnNpdmU6IGZhbHNlIH0sXG4gKiAgICAgbG9vcHM6IHsgcGF0aDogJ3NvdW5kcy9pbnN0cnVtZW50cycsIHJlY3Vyc2l2ZTogZmFsc2UgfSxcbiAqICAgfSxcbiAqIH0pO1xuICpcbiAqIC8vIFdoZW4gJ3JlY3Vyc2l2ZScgaXMgc2V0IHRvIHRydWUsIGFsbCAobWF0Y2hpbmcpIGZpbGVzIGluIHRoZSBnaXZlblxuICogLy8gZGlyZWN0b3JpZXMgYW5kIHRoZWlyIHN1Yi1kaXJlY3RvcmllcyBhcmUgbG9hZGVkIGFzIGFycmF5cyBvZiBvYmplY3RzLlxuICogLy8gV2l0aCB0aGUgb3B0aW9uICdmbGF0dGVuJyBzZXQgdG8gdHJ1ZSwgYWxsIGZpbGVzIGluIHRoZSBkZWZpbmVkIGRpcmVjdG9yeVxuICogLy8gYW5kIGl0cyBzdWItZGlyZWN0b3JpZXMgYXJlIGxvYWRlZCBpbnRvIGEgc2luZ2xlIGFycmF5LiBXaGVuIHRoZSBvcHRpb25cbiAqIC8vICdmbGF0dGVuJyBzZXQgdG8gZmFsc2UsIHRoZSBmaWxlcyBvZiBlYWNoIHN1Yi1kaXJlY3RvcnkgYXJlIGFzc2VtYmxlZFxuICogLy8gaW50byBhbiBhcnJheSBhbmQgYWxsIG9mIHRoZXNlIGFycmF5cyBhcmUgYXJyYW5nZWQgdG8gYSBkYXRhIHN0cnVjdHVyZVxuICogLy8gdGhhdCByZXByb2R1Y2VzIHRoZSBzdWItZGlyZWN0b3J5IHRyZWUgb2YgdGhlIGRlZmluZWQgZGlyZWN0b3JpZXMuXG4gKiAvLyBUaGUgcmVzdWx0aW5nIGRhdGEgc3RydWN0dXJlIGNvcnJlc3BvbmRzIHRvIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlXG4gKiAvLyBkZWZpbml0aW9uIG9iamVjdCBleHRlbmRlZCBieSB0aGUgZGVmaW5lZCBzdWItZGlyZWN0b3J5IHRyZWVzLlxuICpcbiAqIC8vIFRoZSBmb2xsb3dpbmcgb3B0aW9uIHJlc3VsdHMgaW4gYSBzaW5nbGUgYXJyYXkgb2YgcHJlLWxvYWRlZCBmaWxlczpcbiAqIHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1idWZmZXItbWFuYWdlcicsIHtcbiAqICAgZGlyZWN0b3JpZXM6IHtcbiAqICAgICBwYXRoOiAnc291bmRzJyxcbiAqICAgICByZWN1cnNpdmU6IHRydWUsXG4gKiAgICAgZmxhdHRlbjogdHJ1ZSxcbiAqICAgICBtYXRjaDogL1xcLm1wMy8sXG4gKiAgIH0sXG4gKiB9KTtcbiAqXG4gKiAvLyBUaGlzIHZhcmlhbnQgcmVzdWx0cyBpbiBhIGRhdGEgc3RydWN0dXJlIHRoYXQgcmVwcm9kdWNlcyB0aGVcbiAqIC8vIHN1Yi1kaXJlY3RvcnkgdHJlZSBvZiB0aGUgJ3NvdW5kcycgZGlyZWN0b3J5OlxuICogdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLWJ1ZmZlci1tYW5hZ2VyJywge1xuICogICBkaXJlY3Rvcmllczoge1xuICogICAgIHBhdGg6ICdzb3VuZHMnLFxuICogICAgIHJlY3Vyc2l2ZTogdHJ1ZSxcbiAqICAgICBtYXRjaDogL1xcLm1wMy8sXG4gKiAgIH0sXG4gKiB9KTtcbiAqXG4gKiAvLyBUaGUgbG9hZGVkIG9iamVjdHMgY2FuIGJlIHJldHJpZXZlZCBhY2NvcmRpbmcgdG8gdGhlaXIgZGVmaW5pdGlvbiwgYXMgZm9yIGV4YW1wbGUgOlxuICogY29uc3Qga2lja0J1ZmZlciA9IHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyLmRhdGEua2ljaztcbiAqIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIuZGF0YS5sYXRpbi5hdWRpbztcbiAqIGNvbnN0IG1hcmtlckFycmF5ID0gdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIuZGF0YS5qYXp6Lm1hcmtlcnM7XG4gKiBjb25zdCBzbmFyZUJ1ZmZlciA9IHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyLmRhdGEuaW5zdHJ1bWVudHNbMV07XG4gKiBjb25zdCBudXNzYmF1bUxvb3AgPSB0aGlzLmF1ZGlvQnVmZmVyTWFuYWdlci5kYXRhLmxvb3BzWzFdO1xuICovXG5jbGFzcyBBdWRpb0J1ZmZlck1hbmFnZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGFzc2V0c0RvbWFpbjogJycsXG4gICAgICBmaWxlczogbnVsbCxcbiAgICAgIGRpcmVjdG9yaWVzOiBudWxsLFxuICAgICAgYXVkaW9XcmFwVGFpbDogMCxcbiAgICAgIHZpZXdQcmlvcml0eTogNCxcbiAgICAgIGRlYnVnOiBmYWxzZSwgLy8gaWYgc2V0IHRvIHRydWUsIHRoZSBzZXJ2aWNlIG5ldmVyIFwicmVhZHlcIiB0byBkZWJ1ZyB0aGUgdmlld1xuICAgIH07XG5cbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRGF0YSBzdHJ1Y3R1cmUgY29ycmVwb25kaW5nIHRvIHRoZSBzdHJ1Y3R1cmUgb2YgcmVxdWVzdGVkIGZpbGVzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kYXRhID0gW107XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG5cbiAgICBjb25zdCBkaXJlY3RvcmllcyA9IHRoaXMub3B0aW9ucy5kaXJlY3RvcmllcztcblxuICAgIGlmIChkaXJlY3RvcmllcyAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fZmlsZVN5c3RlbSA9IHRoaXMucmVxdWlyZSgnZmlsZS1zeXN0ZW0nKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5maWxlcyB8fCB0aGlzLm9wdGlvbnMuZGlyZWN0b3JpZXMpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZmlsZXMpXG4gICAgICAgIHRoaXMubG9hZEZpbGVzKHRoaXMub3B0aW9ucy5maWxlcywgdGhpcy52aWV3KTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaXJlY3RvcmllcylcbiAgICAgICAgdGhpcy5sb2FkRGlyZWN0b3JpZXModGhpcy5vcHRpb25zLmRpcmVjdG9yaWVzLCB0aGlzLnZpZXcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgcmVhZHkoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZyA9PT0gZmFsc2UpXG4gICAgICBzdXBlci5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgZmlsZXMgZGVmaW5lZCBhcyBhIHNldCBvZiBmaWxlIHBhdGhzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmT2JqIC0gRGVmaW5pdGlvbiBvZiBmaWxlcyB0byBsb2FkXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSAtIFByb21pc2UgcmVzb2x2ZWQgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBsb2FkRmlsZXMoZGVmT2JqLCB2aWV3ID0gbnVsbCkge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgcGF0aExpc3QgPSBbXTtcbiAgICAgIGxldCByZWZMaXN0ID0gW107XG5cbiAgICAgIGlmICh0eXBlb2YgZGVmT2JqID09PSAnc3RyaW5nJylcbiAgICAgICAgZGVmT2JqID0gW2RlZk9ial07XG5cbiAgICAgIC8vIGNyZWF0ZSBkYXRhIG9iamVjdCBjb3B5aW5nIHRoZSBzdHJjdXR1cmUgb2YgdGhlIGZpbGUgZGVmaW5pb24gb2JqZWN0XG4gICAgICBjb25zdCBkYXRhT2JqID0gY2xvbmVQYXRoT2JqKGRlZk9iaik7XG4gICAgICBkZWNvbXBvc2VQYXRoT2JqKGRhdGFPYmosIHBhdGhMaXN0LCByZWZMaXN0LCBmYWxzZSk7XG5cbiAgICAgIC8vIHByZWZpeCByZWxhdGl2ZSBwYXRocyB3aXRoIGFzc2V0c0RvbWFpblxuICAgICAgcGF0aExpc3QgPSBwcmVmaXhQYXRocyhwYXRoTGlzdCwgdGhpcy5vcHRpb25zLmFzc2V0c0RvbWFpbik7XG5cbiAgICAgIGxvZyhwYXRoTGlzdCwgcmVmTGlzdCk7XG5cbiAgICAgIC8vIGxvYWQgZmlsZXNcbiAgICAgIGlmIChwYXRoTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBTdXBlckxvYWRlcigpO1xuICAgICAgICBsb2FkZXIuc2V0QXVkaW9Db250ZXh0KGF1ZGlvQ29udGV4dCk7XG5cbiAgICAgICAgaWYgKHZpZXcgJiYgdmlldy5zZXRQcm9ncmVzc1JhdGlvKSB7XG4gICAgICAgICAgY29uc3QgcHJvZ3Jlc3NQZXJGaWxlID0gcGF0aExpc3QubWFwKCgpID0+IDApOyAvLyB0cmFjayBmaWxlcyBsb2FkaW5nIHByb2dyZXNzXG5cbiAgICAgICAgICBsb2FkZXIucHJvZ3Jlc3NDYWxsYmFjayA9IChlKSA9PiB7XG4gICAgICAgICAgICBwcm9ncmVzc1BlckZpbGVbZS5pbmRleF0gPSBlLnZhbHVlO1xuXG4gICAgICAgICAgICBsZXQgdG90YWxQcm9ncmVzcyA9IDA7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvZ3Jlc3NQZXJGaWxlLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICB0b3RhbFByb2dyZXNzICs9IHByb2dyZXNzUGVyRmlsZVtpXTtcblxuICAgICAgICAgICAgdG90YWxQcm9ncmVzcyAvPSBwcm9ncmVzc1BlckZpbGUubGVuZ3RoO1xuXG4gICAgICAgICAgICB2aWV3LnNldFByb2dyZXNzUmF0aW8odG90YWxQcm9ncmVzcyk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWRlclxuICAgICAgICAgIC5sb2FkKHBhdGhMaXN0LCB7XG4gICAgICAgICAgICB3cmFwQXJvdW5kRXh0ZW50aW9uOiB0aGlzLm9wdGlvbnMuYXVkaW9XcmFwVGFpbCxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKChsb2FkZWRPYmpMaXN0KSA9PiB7XG4gICAgICAgICAgICAvLyBwbGFjZSBsb2FkZWQgb2JqZWN0cyAoaS5lLiBhdWRpbyBidWZmZXJzIGFuZCBqc29uIGZpbGVzKSBpbnRvIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGZpbGUgZGVmaW5pdGlvbiBvYmplY3RcbiAgICAgICAgICAgIHBvcHVsYXRlUmVmTGlzdChyZWZMaXN0LCBsb2FkZWRPYmpMaXN0KTtcblxuICAgICAgICAgICAgLy8gbWl4IGxvYWRlZCBvYmplY3RzIGludG8gZGF0YVxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmRhdGEsIGRhdGFPYmopO1xuICAgICAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgICAgICAgcmVzb2x2ZShkYXRhT2JqKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgICAgcmVzb2x2ZShbXSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGZpbGVzIGRlZmluZWQgYXMgYSBzZXQgb2YgZGlyZWN0b3J5IHBhdGhzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmT2JqIC0gRGVmaW5pdGlvbiBvZiBmaWxlcyB0byBsb2FkXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSAtIFByb21pc2UgcmVzb2x2ZWQgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBsb2FkRGlyZWN0b3JpZXMoZGVmT2JqLCB2aWV3ID0gbnVsbCkge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgZGlyRGVmTGlzdCA9IFtdO1xuICAgICAgbGV0IGRpclJlZkxpc3QgPSBbXTtcblxuICAgICAgLy8gZm9yIHRoZSBjYXNlIHRoYXQganVzdCBhIGRpcmVjdG9yeSBvYmplY3QgaXMgZ2l2ZW4gYXMgZGVmaW5pdGlvbixcbiAgICAgIC8vIHdlIGhhdmUgdG8gd3JhcCBpdCB0ZW1wb3JhcmlseSBpbnRvIGEgZHVtbXkgb2JqZWN0XG4gICAgICBkZWZPYmogPSB7IGRlZjogZGVmT2JqIH07XG5cbiAgICAgIGxldCBmaWxlRGVmT2JqID0gY2xvbmVQYXRoT2JqKGRlZk9iaik7IC8vIGNsb25lIGRlZmluaXRpb24gb2JqZWN0XG5cbiAgICAgIC8vIGRlY29tcG9zZSBkaXJlY3RvcnkgZGVmaW5pdGlvbiBpbnRvIGxpc3Qgb2YgZGlyZWN0b3J5IHBhdGhzIChzdHJpbmdzKVxuICAgICAgZGVjb21wb3NlUGF0aE9iaihmaWxlRGVmT2JqLCBkaXJEZWZMaXN0LCBkaXJSZWZMaXN0LCB0cnVlKTtcblxuICAgICAgdGhpcy5fZmlsZVN5c3RlbS5nZXRMaXN0KGRpckRlZkxpc3QpXG4gICAgICAgIC50aGVuKChmaWxlUGF0aExpc3RMaXN0KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3ViRGlyTGlzdCA9IFtdO1xuICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IGZpbGVQYXRoTGlzdExpc3QubGVuZ3RoO1xuXG4gICAgICAgICAgLy8gY3JlYXRlIHN1YiBkaXJlY3RvcnkgZmlsZSBkZWZpbml0aW9ucyAobGlzdCBvZiBmaWxlIHBhdGhzIHN0cnVjdHVyZWQgaW50byBzdWIgZGlyZWN0b3J5IHRyZWVzIGRlcml2ZWQgZnJvbSBmaWxlIHBhdGhzKVxuICAgICAgICAgIGlmIChsZW5ndGggPT09IGRpckRlZkxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGRpclBhdGggPSBkaXJEZWZMaXN0W2ldLnBhdGg7XG4gICAgICAgICAgICAgIGNvbnN0IGZsYXR0ZW4gPSAhIWRpckRlZkxpc3RbaV0uZmxhdHRlbjtcbiAgICAgICAgICAgICAgY29uc3QgcGF0aExpc3QgPSBmaWxlUGF0aExpc3RMaXN0W2ldO1xuICAgICAgICAgICAgICBsZXQgc3ViRGlyID0gcGF0aExpc3Q7XG5cbiAgICAgICAgICAgICAgaWYoIWZsYXR0ZW4pXG4gICAgICAgICAgICAgICAgc3ViRGlyID0gY3JlYXRlT2JqRnJvbVBhdGhMaXN0KHBhdGhMaXN0LCBkaXJQYXRoKTtcblxuICAgICAgICAgICAgICBzdWJEaXJMaXN0LnB1c2goc3ViRGlyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVwbGFjZSBkaXJlY3RvcnkgcGF0aHMgaW4gaW5pdGlhbCBkZWZpbml0aW9uIGJ5IHN1YiBkaXJlY3RvcnkgZmlsZSBkZWZpbml0aW9uc1xuICAgICAgICAgICAgLy8gdG8gY3JlYXRlIGEgY29tcGxldGUgZmlsZSBkZWZpbml0aW9uIG9iamVjdFxuICAgICAgICAgICAgcG9wdWxhdGVSZWZMaXN0KGRpclJlZkxpc3QsIHN1YkRpckxpc3QpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFske1NFUlZJQ0VfSUR9XSBDYW5ub3QgcmV0cmlldmUgZmlsZSBwYXRocyBmcm9tIGRlZmluZWQgZGlyZWN0b3JpZXNgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyB1bndyYXAgc3ViRGlyIGZyb20gZHVtbXkgb2JqZWN0XG4gICAgICAgICAgZmlsZURlZk9iaiA9IGZpbGVEZWZPYmouZGVmO1xuXG4gICAgICAgICAgLy8gbG9hZCBmaWxlc1xuICAgICAgICAgIHRoaXMubG9hZEZpbGVzKGZpbGVEZWZPYmosIHZpZXcpXG4gICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHJlamVjdChlcnJvcikpO1xuICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHJlamVjdChlcnJvcikpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogd3JhcEFyb3VuZCwgY29weSB0aGUgYmVnaW5pbmcgaW5wdXQgYnVmZmVyIHRvIHRoZSBlbmQgb2YgYW4gb3V0cHV0IGJ1ZmZlclxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge2FycmF5YnVmZmVyfSBpbkJ1ZmZlciB7YXJyYXlidWZmZXJ9IC0gVGhlIGlucHV0IGJ1ZmZlclxuICAgKiBAcmV0dXJucyB7YXJyYXlidWZmZXJ9IC0gVGhlIHByb2Nlc3NlZCBidWZmZXIgKHdpdGggZnJhbWUgY29waWVkIGZyb20gdGhlIGJlZ2luaW5nIHRvIHRoZSBlbmQpXG4gICAqL1xuICBfd3JhcEFyb3VuZChpbkJ1ZmZlcikge1xuICAgIGNvbnN0IGluTGVuZ3RoID0gaW5CdWZmZXIubGVuZ3RoO1xuICAgIGNvbnN0IG91dExlbmd0aCA9IGluTGVuZ3RoICsgdGhpcy5vcHRpb25zLndyYXBBcm91bmRFeHRlbnNpb24gKiBpbkJ1ZmZlci5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IG91dEJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoaW5CdWZmZXIubnVtYmVyT2ZDaGFubmVscywgb3V0TGVuZ3RoLCBpbkJ1ZmZlci5zYW1wbGVSYXRlKTtcbiAgICBsZXQgYXJyYXlDaERhdGEsIGFycmF5T3V0Q2hEYXRhO1xuXG4gICAgZm9yIChsZXQgY2ggPSAwOyBjaCA8IGluQnVmZmVyLm51bWJlck9mQ2hhbm5lbHM7IGNoKyspIHtcbiAgICAgIGFycmF5Q2hEYXRhID0gaW5CdWZmZXIuZ2V0Q2hhbm5lbERhdGEoY2gpO1xuICAgICAgYXJyYXlPdXRDaERhdGEgPSBvdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoY2gpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluTGVuZ3RoOyBpKyspXG4gICAgICAgIGFycmF5T3V0Q2hEYXRhW2ldID0gYXJyYXlDaERhdGFbaV07XG5cbiAgICAgIGZvciAobGV0IGkgPSBpbkxlbmd0aDsgaSA8IG91dExlbmd0aDsgaSsrKVxuICAgICAgICBhcnJheU91dENoRGF0YVtpXSA9IGFycmF5Q2hEYXRhW2kgLSBpbkxlbmd0aF07XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dEJ1ZmZlcjtcbiAgfVxuXG4gIC8qKiBkZXByZWNhdGVkICovXG4gIGxvYWQoZmlsZXMsIHZpZXcgPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMubG9hZEZpbGVzKGZpbGVzLCB2aWV3KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhIGxvYWRlZCBvYmplY3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIE9iamVjdCBvciBncm91cCBpZGVudGlmaWVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC0gTWVtYmVyIGtleSBpbiBncm91cC5cbiAgICogQHJldHVybnMge1Byb21pc2V9IC0gUmV0dXJucyB0aGUgbG9hZGVkIG9iamVjdC5cbiAgICovXG4gIGdldChpZCwga2V5ID0gbnVsbCkge1xuICAgIGNvbnN0IG9iaiA9IHRoaXMuZGF0YVtpZF07XG5cbiAgICBpZiAob2JqICYmIChrZXkgIT09IG51bGwpKVxuICAgICAgcmV0dXJuIG9ialtrZXldO1xuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhIHNpbmdsZSBhdWRpbyBidWZmZXIgYXNzb2NpYXRlZCB0byBhIGdpdmVuIGlkLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBPYmplY3QgaWRlbnRpZmllci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gQXVkaW8gYnVmZmVyIGluZGV4IChpZiBhcnJheSkuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSAtIFJldHVybnMgYSBzaW5nbGUgbG9hZGVkIGF1ZGlvIGJ1ZmZlciBhc3NvY2lhdGVkIHRvIHRoZSBnaXZlbiBpZC5cbiAgICovXG4gIGdldEF1ZGlvQnVmZmVyKGlkID0gJ2RlZmF1bHQnLCBpbmRleCA9IDApIHtcbiAgICByZXR1cm4gdGhpcy5hdWRpb0J1ZmZlcnNbaWRdW2luZGV4XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbiBhcnJheSBvZiBhdWRpbyBidWZmZXJzIGFzc29jaWF0ZWQgdG8gYSBnaXZlbiBpZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gT2JqZWN0IGlkZW50aWZpZXIuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSAtIFJldHVybnMgYW4gYXJyYXkgb2YgbG9hZGVkIGF1ZGlvIGJ1ZmZlcnMgYXNzb2NpYXRlZCB0byB0aGUgZ2l2ZW4gaWQuXG4gICAqL1xuICBnZXRBdWRpb0J1ZmZlckFycmF5KGlkID0gJ2RlZmF1bHQnKSB7XG4gICAgcmV0dXJuIHRoaXMuYXVkaW9CdWZmZXJzW2lkXTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBBdWRpb0J1ZmZlck1hbmFnZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBBdWRpb0J1ZmZlck1hbmFnZXI7XG4iXX0=