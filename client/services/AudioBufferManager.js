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
    if (isAbsolute.test(path) || prefix === '/') return path;else return prefix + path;
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
      debug: false // if set to true, the service never "ready" to debug the view
    };

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

      if (directories !== null) this._fileSystem = this.require('file-system');
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
  }]);
  return AudioBufferManager;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, AudioBufferManager);

exports.default = AudioBufferManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvQnVmZmVyTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwibG9nIiwiZmxhdHRlbkxpc3RzIiwiYSIsInJldCIsImZ1biIsInZhbCIsIkFycmF5IiwiaXNBcnJheSIsImZvckVhY2giLCJwdXNoIiwiY2xvbmVQYXRoT2JqIiwidmFsdWUiLCJjbGFzc05hbWUiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJjbG9uZSIsImtleSIsInJlZ2V4cCIsImlzRmlsZVBhdGgiLCJzdHIiLCJ0ZXN0IiwiaXNEaXJTcGVjIiwib2JqIiwicGF0aCIsImRlY29tcG9zZVBhdGhPYmoiLCJwYXRoTGlzdCIsInJlZkxpc3QiLCJkaXJzIiwicmVmIiwiaW5kZXgiLCJpbmRleE9mIiwibGVuZ3RoIiwicG9wdWxhdGVSZWZMaXN0IiwibG9hZGVkT2JqTGlzdCIsIkVycm9yIiwiaSIsInJlZnMiLCJqIiwibCIsImNyZWF0ZU9iakZyb21QYXRoTGlzdCIsImNvbW1vblBhdGgiLCJzdWJQYXRoSW5kZXgiLCJzdWJQYXRoIiwic3Vic3RyaW5nIiwibm9kZXMiLCJzcGxpdCIsImRlcHRoIiwidW5kZWZpbmVkIiwicHJlZml4UGF0aHMiLCJwcmVmaXgiLCJpc0Fic29sdXRlIiwibWFwIiwiQXVkaW9CdWZmZXJNYW5hZ2VyIiwiZGVmYXVsdHMiLCJhc3NldHNEb21haW4iLCJmaWxlcyIsImRpcmVjdG9yaWVzIiwiYXVkaW9XcmFwVGFpbCIsInZpZXdQcmlvcml0eSIsImRlYnVnIiwidmlldyIsImRhdGEiLCJjb25maWd1cmUiLCJvcHRpb25zIiwiX2ZpbGVTeXN0ZW0iLCJyZXF1aXJlIiwic2hvdyIsImxvYWRGaWxlcyIsImxvYWREaXJlY3RvcmllcyIsInJlYWR5IiwiaGlkZSIsImRlZk9iaiIsInByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZGF0YU9iaiIsImxvYWRlciIsInNldEF1ZGlvQ29udGV4dCIsInNldFByb2dyZXNzUmF0aW8iLCJwcm9ncmVzc1BlckZpbGUiLCJwcm9ncmVzc0NhbGxiYWNrIiwiZSIsInRvdGFsUHJvZ3Jlc3MiLCJsb2FkIiwid3JhcEFyb3VuZEV4dGVudGlvbiIsInRoZW4iLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsImRpckRlZkxpc3QiLCJkaXJSZWZMaXN0IiwiZGVmIiwiZmlsZURlZk9iaiIsImdldExpc3QiLCJmaWxlUGF0aExpc3RMaXN0Iiwic3ViRGlyTGlzdCIsImRpclBhdGgiLCJmbGF0dGVuIiwic3ViRGlyIiwiaW5CdWZmZXIiLCJpbkxlbmd0aCIsIm91dExlbmd0aCIsIndyYXBBcm91bmRFeHRlbnNpb24iLCJzYW1wbGVSYXRlIiwib3V0QnVmZmVyIiwiY3JlYXRlQnVmZmVyIiwibnVtYmVyT2ZDaGFubmVscyIsImFycmF5Q2hEYXRhIiwiYXJyYXlPdXRDaERhdGEiLCJjaCIsImdldENoYW5uZWxEYXRhIiwiaWQiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7O0FBUUE7Ozs7Ozs7Ozs7OztBQVlBLElBQU1BLGFBQWEsOEJBQW5CO0FBQ0EsSUFBTUMsTUFBTSxxQkFBTSwwQ0FBTixDQUFaOztBQUVBLFNBQVNDLFlBQVQsQ0FBc0JDLENBQXRCLEVBQXlCO0FBQ3ZCLE1BQU1DLE1BQU0sRUFBWjtBQUNBLE1BQU1DLE1BQU0sU0FBTkEsR0FBTSxDQUFDQyxHQUFEO0FBQUEsV0FBU0MsTUFBTUMsT0FBTixDQUFjRixHQUFkLElBQXFCQSxJQUFJRyxPQUFKLENBQVlKLEdBQVosQ0FBckIsR0FBd0NELElBQUlNLElBQUosQ0FBU0osR0FBVCxDQUFqRDtBQUFBLEdBQVo7QUFDQUQsTUFBSUYsQ0FBSjtBQUNBLFNBQU9DLEdBQVA7QUFDRDs7QUFFRCxTQUFTTyxZQUFULENBQXNCQyxLQUF0QixFQUE2QjtBQUMzQixNQUFJLFFBQU9BLEtBQVAsdURBQU9BLEtB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QTNCLEVBQXNDbEUsSUFBdEM7QUFDRXlFLHlCQUFlekUsRUFBZixJQUFvQndFLFlBQVl4RSxLQUFJaUUsUUFBaEIsQ0FBcEI7QUFERjtBQUVEOztBQUVELGFBQU9JLFNBQVA7QUFDRDs7QUFFRDs7Ozt5QkFDS2pELEssRUFBb0I7QUFBQSxVQUFiSyxJQUFhLHVFQUFOLElBQU07O0FBQ3ZCLGFBQU8sS0FBS08sU0FBTCxDQUFlWixLQUFmLEVBQXNCSyxJQUF0QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozt3QkFNSW1ELEUsRUFBZ0I7QUFBQSxVQUFaL0YsR0FBWSx1RUFBTixJQUFNOztBQUNsQixVQUFNTSxNQUFNLEtBQUt1QyxJQUFMLENBQVVrRCxFQUFWLENBQVo7O0FBRUEsVUFBSXpGLE9BQVFOLFFBQVEsSUFBcEIsRUFDRSxPQUFPTSxJQUFJTixHQUFKLENBQVA7O0FBRUYsYUFBT00sR0FBUDtBQUNEOzs7OztBQUdILHlCQUFlMEYsUUFBZixDQUF3QmpILFVBQXhCLEVBQW9DcUQsa0JBQXBDOztrQkFFZUEsa0IiLCJmaWxlIjoiQXVkaW9CdWZmZXJNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IHsgU3VwZXJMb2FkZXIgfSBmcm9tICd3YXZlcy1sb2FkZXJzJztcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG4vKipcbiAqIEFQSSBvZiBhIGNvbXBsaWFudCB2aWV3IGZvciB0aGUgYGF1ZGlvLWJ1ZmZlci1tYW5hZ2VyYCBzZXJ2aWNlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBpbnRlcmZhY2UgQWJzdHJhY3RBdWRpb0J1ZmZlck1hbmFnZXJWaWV3XG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RWaWV3XG4gKiBAYWJzdHJhY3RcbiAqL1xuLyoqXG4gKiBVcGRhdGUgdGhlIHByb2dyZXNzIGJhciBvZiB0aGUgdmlldyB3aXRoIHRoZSBnaXZlbiByYXRpby5cbiAqXG4gKiBAbmFtZSBzZXRQcm9ncmVzc1JhdGlvXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0QXVkaW9CdWZmZXJNYW5hZ2VyVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSByYXRpbyAtIFByb2dyZXNzIHJhdGlvIG9mIHRoZSBsb2FkZWQgYXNzZXRzIChiZXR3ZWVuIDAgYW5kIDEpLlxuICovXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTphdWRpby1idWZmZXItbWFuYWdlcic7XG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3JrczpzZXJ2aWNlczphdWRpby1idWZmZXItbWFuYWdlcicpO1xuXG5mdW5jdGlvbiBmbGF0dGVuTGlzdHMoYSkge1xuICBjb25zdCByZXQgPSBbXTtcbiAgY29uc3QgZnVuID0gKHZhbCkgPT4gQXJyYXkuaXNBcnJheSh2YWwpID8gdmFsLmZvckVhY2goZnVuKSA6IHJldC5wdXNoKHZhbCk7XG4gIGZ1bihhKTtcbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gY2xvbmVQYXRoT2JqKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gdmFsdWUuY29uc3RydWN0b3IubmFtZTtcbiAgICBsZXQgY2xvbmUgPSBudWxsO1xuXG4gICAgaWYgKGNsYXNzTmFtZSA9PT0gJ09iamVjdCcpXG4gICAgICBjbG9uZSA9IHt9O1xuICAgIGVsc2UgaWYgKGNsYXNzTmFtZSA9PT0gJ0FycmF5JylcbiAgICAgIGNsb25lID0gW107XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgZm9yIChsZXQga2V5IGluIHZhbHVlKVxuICAgICAgY2xvbmVba2V5XSA9IGNsb25lUGF0aE9iaih2YWx1ZVtrZXldKTtcblxuICAgIHJldHVybiBjbG9uZTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuY29uc3QgcmVnZXhwID0gL1xcLlthLXpBLVowLTldezMsNH0kLztcblxuZnVuY3Rpb24gaXNGaWxlUGF0aChzdHIpIHtcbiAgcmV0dXJuICh0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyAmJiByZWdleHAudGVzdChzdHIpKTtcbn1cblxuZnVuY3Rpb24gaXNEaXJTcGVjKG9iaikge1xuICByZXR1cm4gKHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIHR5cGVvZiBvYmoucGF0aCA9PT0gJ3N0cmluZycpO1xufVxuXG5mdW5jdGlvbiBkZWNvbXBvc2VQYXRoT2JqKG9iaiwgcGF0aExpc3QsIHJlZkxpc3QsIGRpcnMgPSBmYWxzZSkge1xuICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgY29uc3QgdmFsdWUgPSBvYmpba2V5XTtcblxuICAgIGlmICgoIWRpcnMgJiYgaXNGaWxlUGF0aCh2YWx1ZSkpIHx8IChkaXJzICYmIGlzRGlyU3BlYyh2YWx1ZSkpKSB7XG4gICAgICBjb25zdCByZWYgPSB7IG9iaiwga2V5IH07XG4gICAgICBsZXQgaW5kZXggPSAtMTtcblxuICAgICAgaWYgKCFkaXJzKVxuICAgICAgICBpbmRleCA9IHBhdGhMaXN0LmluZGV4T2YodmFsdWUpO1xuXG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHBhdGhMaXN0LnB1c2godmFsdWUpO1xuXG4gICAgICAgIGluZGV4ID0gbGVuZ3RoIC0gMTtcbiAgICAgICAgcmVmTGlzdFtpbmRleF0gPSBbXTtcbiAgICAgIH1cblxuICAgICAgcmVmTGlzdFtpbmRleF0ucHVzaChyZWYpO1xuXG4gICAgICBvYmpba2V5XSA9IG51bGw7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBkZWNvbXBvc2VQYXRoT2JqKHZhbHVlLCBwYXRoTGlzdCwgcmVmTGlzdCwgZGlycyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlUmVmTGlzdChyZWZMaXN0LCBsb2FkZWRPYmpMaXN0KSB7XG4gIGNvbnN0IGxlbmd0aCA9IHJlZkxpc3QubGVuZ3RoO1xuXG4gIGlmIChsZW5ndGggIT09IGxvYWRlZE9iakxpc3QubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBbJHtTRVJWSUNFX0lEfV0gTG9hZGVkIEJ1ZmZlcnMgZG8gbm90IG1hdGNoIGZpbGUgZGVmaW5pb25gKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByZWZzID0gcmVmTGlzdFtpXTtcblxuICAgIGZvciAobGV0IGogPSAwLCBsID0gcmVmcy5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgIGNvbnN0IHJlZiA9IHJlZnNbal07XG4gICAgICBjb25zdCBvYmogPSByZWYub2JqO1xuICAgICAgY29uc3Qga2V5ID0gcmVmLmtleTtcblxuICAgICAgb2JqW2tleV0gPSBsb2FkZWRPYmpMaXN0W2ldO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVPYmpGcm9tUGF0aExpc3QocGF0aExpc3QsIGNvbW1vblBhdGgpIHtcbiAgbGV0IG9iaiA9IFtdO1xuXG4gIGZvciAobGV0IHBhdGggb2YgcGF0aExpc3QpIHtcbiAgICBsZXQgc3ViUGF0aEluZGV4ID0gcGF0aC5pbmRleE9mKGNvbW1vblBhdGgpO1xuXG4gICAgaWYgKHN1YlBhdGhJbmRleCA+PSAwKSB7XG4gICAgICBzdWJQYXRoSW5kZXggKz0gY29tbW9uUGF0aC5sZW5ndGg7XG5cbiAgICAgIGlmIChwYXRoW3N1YlBhdGhJbmRleF0gPT09ICcvJylcbiAgICAgICAgc3ViUGF0aEluZGV4Kys7XG5cbiAgICAgIGNvbnN0IHN1YlBhdGggPSBwYXRoLnN1YnN0cmluZyhzdWJQYXRoSW5kZXgpO1xuICAgICAgY29uc3Qgbm9kZXMgPSBzdWJQYXRoLnNwbGl0KCcvJyk7XG4gICAgICBjb25zdCBkZXB0aCA9IG5vZGVzLmxlbmd0aDtcbiAgICAgIGxldCByZWYgPSBvYmo7XG4gICAgICBsZXQgaTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGRlcHRoIC0gMTsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IG5vZGVzW2ldO1xuXG4gICAgICAgIGlmIChyZWZba2V5XSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgIHJlZltrZXldID0gW107XG5cbiAgICAgICAgcmVmID0gcmVmW2tleV07XG4gICAgICB9XG5cbiAgICAgIHJlZi5wdXNoKHBhdGgpO1xuICAgIH1cblxuICAgIC8vIHRyYW5zZm9ybSBlbXB0eSBhcnJheSB0byBvYmplY3RcbiAgICBpZiAob2JqLmxlbmd0aCA9PT0gMClcbiAgICAgIG9iaiA9IE9iamVjdC5hc3NpZ24oe30sIG9iaik7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiBwcmVmaXhQYXRocyhwYXRoTGlzdCwgcHJlZml4KSB7XG4gIC8vIHRlc3QgYWJzb2x1dGUgdXJscyAob3IgcHJvdG9jb2wgcmVsYXRpdmUpXG4gIGNvbnN0IGlzQWJzb2x1dGUgPSAvXmh0dHBzPzpcXC9cXC98XlxcL1xcLy9pO1xuXG4gIHBhdGhMaXN0ID0gcGF0aExpc3QubWFwKChwYXRoKSA9PiB7XG4gICAgaWYgKGlzQWJzb2x1dGUudGVzdChwYXRoKSB8fCBwcmVmaXggPT09ICcvJylcbiAgICAgIHJldHVybiBwYXRoO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBwcmVmaXggKyBwYXRoO1xuICB9KTtcblxuICByZXR1cm4gcGF0aExpc3Q7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnYXVkaW8tYnVmZmVyLW1hbmFnZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gcHJlbG9hZCBmaWxlcyBhbmQgc3RvcmUgdGhlbSBpbnRvIGJ1ZmZlcnNcbiAqIGJlZm9yZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBleHBlcmllbmNlLiBBdWRpbyBmaWxlcyB3aWxsIGJlIGNvbnZlcnRlZCBhbmRcbiAqIHN0b3JlZCBpbnRvIEF1ZGlvQnVmZmVyIG9iamVjdHMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gb3B0aW9ucy5hc3NldHNEb21haW4gLSBQcmVmaXggY29uY2F0ZW5hdGVkIHRvIGFsbFxuICogIGdpdmVuIHBhdGhzLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMuZmlsZXMgLSBEZWZpbml0aW9uIG9mIGZpbGVzIHRvIGxvYWQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5kaXJlY3RvcmllcyAtIERlZmluaXRpb24gb2YgZGlyZWN0b3JpZXMgdG8gbG9hZC5cbiAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gb3B0aW9ucy5kaXJlY3RvcmllcyAtIExpc3Qgb2YgZGlyZWN0b3JpZXMgdG8gbG9hZC5cbiAqIEBwYXJhbSB7U3RyaW5nfG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5GaWxlU3lzdGVtfkxpc3RDb25maWd9IFtvcHRpb25zLmRpcmVjdG9yaWVzPW51bGxdIC1cbiAqICBMb2FkIGFsbCB0aGUgZmlsZXMgaW4gcGFydGljdWxhciBkaXJlY3Rvcmllcy4gSWYgc2V0dGVkIHRoaXMgb3B0aW9uIHJlbGllc1xuICogIG9uIHRoZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkZpbGVTeXN0ZW19IHdoaWNoIGl0c2VsZiByZWxpZXMgb25cbiAqICBpdHMgc2VydmVyIGNvdW50ZXJwYXJ0LCB0aGUgYXVkaW8tYnVmZmVyLW1hbmFnZXIgY2FuIHRoZW4gbm8gbG9uZ2VyIGJlXG4gKiAgY29uc2lkZXJlZCBhcyBhIGNsaWVudC1vbmx5IHNlcnZpY2UuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIHJlcXVpcmUgYW5kIGNvbmZpZ3VyZSB0aGUgYGF1ZGlvLWJ1ZmZlci1tYW5hZ2VyYCBpbnNpZGUgdGhlIGV4cGVyaWVuY2VcbiAqIC8vIGNvbnN0cnVjdG9yXG4gKiAvLyBEZWZpbmluZyBhIHNpbmdsZSBhcnJheSBvZiBhdWRpbyBmaWxlcyByZXN1bHRzIGluIGEgc2luZ2xlXG4gKiAvLyBhcnJheSBvZiBhdWRpbyBidWZmZXJzIGFzc29jaWF0ZWQgdG8gdGhlIGlkZW50aWZpZXIgYGRlZmF1bHRgLlxuICpcbiAqIC8vIFRoZXJlIGFyZSB0d28gZGlmZmVyZW50IHdheXMgdG8gc3BlY2lmeSB0aGUgZmlsZXMgdG8gYmUgbG9hZGVkIGFuZCB0aGVcbiAqIC8vIGRhdGEgc3RydWN0dXJlIGluIHdoaWNoIHRoZSBsb2FkZWQgZGF0YSBvYmplY3RzIGFyZSBhcnJhbmdlZDpcbiAqIC8vXG4gKiAvLyAoMS4pIFdpdGggdGhlICdmaWxlcycgb3B0aW9uLCB0aGUgZmlsZXMgYW5kIHN0cnVjdHVyZSBhcmUgZGVmaW5lZCBieSBhblxuICogLy8gb2JqZWN0IG9mIGFueSBkZXB0aCB0aGF0IGNvbnRhaW5zIGZpbGUgcGF0aHMuIEFsbCBzcGVjaWZpZWQgZmlsZXMgYXJlXG4gKiAvLyBsb2FkZWQgYW5kIHRoZSBsb2FkZWQgZGF0YSBvYmplY3RzIGFyZSBzdG9yZWQgaW50byBhbiBvYmplY3Qgb2YgdGhlIHNhbWVcbiAqIC8vIHN0cnVjdHVyZSBhcyB0aGUgZGVmaW5pdGlvbiBvYmplY3QuXG4gKlxuICogdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLWJ1ZmZlci1tYW5hZ2VyJywgeyBmaWxlczogW1xuICogICAnc291bmRzL2RydW1zL2tpY2subXAzJyxcbiAqICAgJ3NvdW5kcy9kcnVtcy9zbmFyZS5tcDMnXG4gKiBdfSk7XG4gKlxuICogdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLWJ1ZmZlci1tYW5hZ2VyJywgeyBmaWxlczoge1xuICogICBraWNrOiAnc291bmRzL2tpY2tfNDRrSHoubXAzJyxcbiAqICAgc25hcmU6ICdzb3VuZHMvODA4c25hcmUubXAzJ1xuICogfX0pO1xuICpcbiAqIHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1idWZmZXItbWFuYWdlcicsIHsgZmlsZXM6IHtcbiAqICAgbGF0aW46IHtcbiAqICAgICBhdWRpbzogJ2xvb3BzL3NoZWlsYS1lLXJhc3BiZXJyeS5tcDMnLFxuICogICAgIG1hcmtlcnM6ICdsb29wcy9zaGVpbGEtZS1yYXNwYmVycnktbWFya2Vycy5qc29uJyxcbiAqICAgfSxcbiAqICAgamF6ejoge1xuICogICAgIGF1ZGlvOiAnbG9vcHMvbnVzc2JhdW0tc2h1ZmZsZS5tcDMnLFxuICogICAgIG1hcmtlcnM6ICdsb29wcy9udXNzYmF1bS1zaHVmZmxlLW1hcmtlcnMuanNvbicsXG4gKiAgIH0sXG4gKiB9fSk7XG4gKlxuICogdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLWJ1ZmZlci1tYW5hZ2VyJywgeyBmaWxlczoge1xuICogICBpbnN0cnVtZW50czogW1xuICogICAgICdzb3VuZHMvaW5zdHJ1bWVudHMva2lja180NGtIei5tcDMnLFxuICogICAgICdzb3VuZHMvaW5zdHJ1bWVudHMvODA4c25hcmUubXAzJ10sXG4gKiAgIGxvb3BzOiBbXG4gKiAgICAgJ3NvdW5kcy9sb29wcy9zaGVpbGEtZS1yYXNwYmVycnkubXAzJyxcbiAqICAgICAnc291bmRzL2xvb3BzL251c3NiYXVtLXNodWZmbGUubXAzJ10sXG4gKiB9fSk7XG4gKlxuICogLy8oMi4pIFRoZSAnZGlyZWN0b3JpZXMnIG9wdGlvbiBjYW4gYmUgdXNlZCB0byBsb2FkIHRoZSBmaWxlcyBvZiBhXG4gKiAvLyBnaXZlbiBkaXJlY3RvcnkuIEVhY2ggZGlyZWN0b3J5IGlzIHNwZWNpZmllZCBieSBhbiBvYmplY3QgdGhhdCBoYXMgYVxuICogLy8gcHJvcGVydHkgJ3BhdGgnIHdpdGggdGhlIGRpcmVjdG9yeSBwYXRoIGFuZCBvcHRpb25hbGx5IHRoZSBrZXlzXG4gKiAvLyAncmVjdXJzaXZlJyAoc3BlY2lmeWluZyB3aGV0aGVyIHRoZSBkaXJlY3RvcnkncyBzdWItZGlyZWN0b3JpZXMgYXJlXG4gKiAvLyBjb25zaWRlcmVkKSBhbmQgYSBrZXkgJ21hdGNoJyAoc3BlY2lmeWluZyBhIHJlZ2V4cCB0byBzZWxlY3QgdGhlIGZpbGVzXG4gKiAvLyBpbiB0aGUgZ2l2ZW4gZGlyZWN0b3J5KS5cbiAqXG4gKiAvLyBXaXRoIHRoZSBvcHRpb24gJ3JlY3Vyc2l2ZScgc2V0IHRvIGZhbHNlLCBhbGwgKG1hdGNoaW5nKSBmaWxlc1xuICogLy8gaW4gYSBnaXZlbiBkaXJlY3Rvcml5IGFyZSBsb2FkZWQgaW50byBhbiBhcnJheXMgb2Ygb2JqZWN0cyB3aXRob3V0XG4gKiAvLyBjb25zaWRlcmluZyBzdWItZGlyZWN0b3JpZXMuIFRoZSBhcnJheXMgb2YgbG9hZGVkIGRhdGEgb2JqZWN0cyBhcmVcbiAqIC8vIGFycmFuZ2VkIGluIHRoZSBzYW1lIGRhdGEgc3RydWN0dXJlIGFzIHRoZSBkZWZpbml0aW9uIG9iamVjdC5cbiAqXG4gKiB0aGlzLmF1ZGlvQnVmZmVyTWFuYWdlciA9IHRoaXMucmVxdWlyZSgnYXVkaW8tYnVmZmVyLW1hbmFnZXInLCB7XG4gKiAgIGRpcmVjdG9yaWVzOiB7XG4gKiAgICAgaW5zdHJ1bWVudHM6IHsgcGF0aDogJ3NvdW5kcy9pbnN0cnVtZW50cycsIHJlY3Vyc2l2ZTogZmFsc2UgfSxcbiAqICAgICBsb29wczogeyBwYXRoOiAnc291bmRzL2luc3RydW1lbnRzJywgcmVjdXJzaXZlOiBmYWxzZSB9LFxuICogICB9LFxuICogfSk7XG4gKlxuICogLy8gV2hlbiAncmVjdXJzaXZlJyBpcyBzZXQgdG8gdHJ1ZSwgYWxsIChtYXRjaGluZykgZmlsZXMgaW4gdGhlIGdpdmVuXG4gKiAvLyBkaXJlY3RvcmllcyBhbmQgdGhlaXIgc3ViLWRpcmVjdG9yaWVzIGFyZSBsb2FkZWQgYXMgYXJyYXlzIG9mIG9iamVjdHMuXG4gKiAvLyBXaXRoIHRoZSBvcHRpb24gJ2ZsYXR0ZW4nIHNldCB0byB0cnVlLCBhbGwgZmlsZXMgaW4gdGhlIGRlZmluZWQgZGlyZWN0b3J5XG4gKiAvLyBhbmQgaXRzIHN1Yi1kaXJlY3RvcmllcyBhcmUgbG9hZGVkIGludG8gYSBzaW5nbGUgYXJyYXkuIFdoZW4gdGhlIG9wdGlvblxuICogLy8gJ2ZsYXR0ZW4nIHNldCB0byBmYWxzZSwgdGhlIGZpbGVzIG9mIGVhY2ggc3ViLWRpcmVjdG9yeSBhcmUgYXNzZW1ibGVkXG4gKiAvLyBpbnRvIGFuIGFycmF5IGFuZCBhbGwgb2YgdGhlc2UgYXJyYXlzIGFyZSBhcnJhbmdlZCB0byBhIGRhdGEgc3RydWN0dXJlXG4gKiAvLyB0aGF0IHJlcHJvZHVjZXMgdGhlIHN1Yi1kaXJlY3RvcnkgdHJlZSBvZiB0aGUgZGVmaW5lZCBkaXJlY3Rvcmllcy5cbiAqIC8vIFRoZSByZXN1bHRpbmcgZGF0YSBzdHJ1Y3R1cmUgY29ycmVzcG9uZHMgdG8gdGhlIHN0cnVjdHVyZSBvZiB0aGVcbiAqIC8vIGRlZmluaXRpb24gb2JqZWN0IGV4dGVuZGVkIGJ5IHRoZSBkZWZpbmVkIHN1Yi1kaXJlY3RvcnkgdHJlZXMuXG4gKlxuICogLy8gVGhlIGZvbGxvd2luZyBvcHRpb24gcmVzdWx0cyBpbiBhIHNpbmdsZSBhcnJheSBvZiBwcmUtbG9hZGVkIGZpbGVzOlxuICogdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLWJ1ZmZlci1tYW5hZ2VyJywge1xuICogICBkaXJlY3Rvcmllczoge1xuICogICAgIHBhdGg6ICdzb3VuZHMnLFxuICogICAgIHJlY3Vyc2l2ZTogdHJ1ZSxcbiAqICAgICBmbGF0dGVuOiB0cnVlLFxuICogICAgIG1hdGNoOiAvXFwubXAzLyxcbiAqICAgfSxcbiAqIH0pO1xuICpcbiAqIC8vIFRoaXMgdmFyaWFudCByZXN1bHRzIGluIGEgZGF0YSBzdHJ1Y3R1cmUgdGhhdCByZXByb2R1Y2VzIHRoZVxuICogLy8gc3ViLWRpcmVjdG9yeSB0cmVlIG9mIHRoZSAnc291bmRzJyBkaXJlY3Rvcnk6XG4gKiB0aGlzLmF1ZGlvQnVmZmVyTWFuYWdlciA9IHRoaXMucmVxdWlyZSgnYXVkaW8tYnVmZmVyLW1hbmFnZXInLCB7XG4gKiAgIGRpcmVjdG9yaWVzOiB7XG4gKiAgICAgcGF0aDogJ3NvdW5kcycsXG4gKiAgICAgcmVjdXJzaXZlOiB0cnVlLFxuICogICAgIG1hdGNoOiAvXFwubXAzLyxcbiAqICAgfSxcbiAqIH0pO1xuICpcbiAqIC8vIFRoZSBsb2FkZWQgb2JqZWN0cyBjYW4gYmUgcmV0cmlldmVkIGFjY29yZGluZyB0byB0aGVpciBkZWZpbml0aW9uLCBhcyBmb3IgZXhhbXBsZSA6XG4gKiBjb25zdCBraWNrQnVmZmVyID0gdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIuZGF0YS5raWNrO1xuICogY29uc3QgYXVkaW9CdWZmZXIgPSB0aGlzLmF1ZGlvQnVmZmVyTWFuYWdlci5kYXRhLmxhdGluLmF1ZGlvO1xuICogY29uc3QgbWFya2VyQXJyYXkgPSB0aGlzLmF1ZGlvQnVmZmVyTWFuYWdlci5kYXRhLmphenoubWFya2VycztcbiAqIGNvbnN0IHNuYXJlQnVmZmVyID0gdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIuZGF0YS5pbnN0cnVtZW50c1sxXTtcbiAqIGNvbnN0IG51c3NiYXVtTG9vcCA9IHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyLmRhdGEubG9vcHNbMV07XG4gKi9cbmNsYXNzIEF1ZGlvQnVmZmVyTWFuYWdlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIGZhbHNlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgYXNzZXRzRG9tYWluOiAnJyxcbiAgICAgIGZpbGVzOiBudWxsLFxuICAgICAgZGlyZWN0b3JpZXM6IG51bGwsXG4gICAgICBhdWRpb1dyYXBUYWlsOiAwLFxuICAgICAgdmlld1ByaW9yaXR5OiA0LFxuICAgICAgZGVidWc6IGZhbHNlLCAvLyBpZiBzZXQgdG8gdHJ1ZSwgdGhlIHNlcnZpY2UgbmV2ZXIgXCJyZWFkeVwiIHRvIGRlYnVnIHRoZSB2aWV3XG4gICAgfTtcblxuICAgIHRoaXMudmlldyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBEYXRhIHN0cnVjdHVyZSBjb3JyZXBvbmRpbmcgdG8gdGhlIHN0cnVjdHVyZSBvZiByZXF1ZXN0ZWQgZmlsZXMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRhdGEgPSBbXTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcblxuICAgIGNvbnN0IGRpcmVjdG9yaWVzID0gdGhpcy5vcHRpb25zLmRpcmVjdG9yaWVzO1xuXG4gICAgaWYgKGRpcmVjdG9yaWVzICE9PSBudWxsKVxuICAgICAgdGhpcy5fZmlsZVN5c3RlbSA9IHRoaXMucmVxdWlyZSgnZmlsZS1zeXN0ZW0nKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmZpbGVzIHx8IHRoaXMub3B0aW9ucy5kaXJlY3Rvcmllcykge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5maWxlcylcbiAgICAgICAgdGhpcy5sb2FkRmlsZXModGhpcy5vcHRpb25zLmZpbGVzLCB0aGlzLnZpZXcpO1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRpcmVjdG9yaWVzKVxuICAgICAgICB0aGlzLmxvYWREaXJlY3Rvcmllcyh0aGlzLm9wdGlvbnMuZGlyZWN0b3JpZXMsIHRoaXMudmlldyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICByZWFkeSgpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnID09PSBmYWxzZSlcbiAgICAgIHN1cGVyLnJlYWR5KCk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZCBmaWxlcyBkZWZpbmVkIGFzIGEgc2V0IG9mIGZpbGUgcGF0aHMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZPYmogLSBEZWZpbml0aW9uIG9mIGZpbGVzIHRvIGxvYWRcbiAgICogQHJldHVybnMge1Byb21pc2V9IC0gUHJvbWlzZSByZXNvbHZlZCB3aXRoIHRoZSByZXN1bHRpbmcgZGF0YSBzdHJ1Y3R1cmVcbiAgICovXG4gIGxvYWRGaWxlcyhkZWZPYmosIHZpZXcgPSBudWxsKSB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCBwYXRoTGlzdCA9IFtdO1xuICAgICAgbGV0IHJlZkxpc3QgPSBbXTtcblxuICAgICAgaWYgKHR5cGVvZiBkZWZPYmogPT09ICdzdHJpbmcnKVxuICAgICAgICBkZWZPYmogPSBbZGVmT2JqXTtcblxuICAgICAgLy8gY3JlYXRlIGRhdGEgb2JqZWN0IGNvcHlpbmcgdGhlIHN0cmN1dHVyZSBvZiB0aGUgZmlsZSBkZWZpbmlvbiBvYmplY3RcbiAgICAgIGNvbnN0IGRhdGFPYmogPSBjbG9uZVBhdGhPYmooZGVmT2JqKTtcbiAgICAgIGRlY29tcG9zZVBhdGhPYmooZGF0YU9iaiwgcGF0aExpc3QsIHJlZkxpc3QsIGZhbHNlKTtcblxuICAgICAgLy8gcHJlZml4IHJlbGF0aXZlIHBhdGhzIHdpdGggYXNzZXRzRG9tYWluXG4gICAgICBwYXRoTGlzdCA9IHByZWZpeFBhdGhzKHBhdGhMaXN0LCB0aGlzLm9wdGlvbnMuYXNzZXRzRG9tYWluKTtcblxuICAgICAgbG9nKHBhdGhMaXN0LCByZWZMaXN0KTtcblxuICAgICAgLy8gbG9hZCBmaWxlc1xuICAgICAgaWYgKHBhdGhMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgbG9hZGVyID0gbmV3IFN1cGVyTG9hZGVyKCk7XG4gICAgICAgIGxvYWRlci5zZXRBdWRpb0NvbnRleHQoYXVkaW9Db250ZXh0KTtcblxuICAgICAgICBpZiAodmlldyAmJiB2aWV3LnNldFByb2dyZXNzUmF0aW8pIHtcbiAgICAgICAgICBjb25zdCBwcm9ncmVzc1BlckZpbGUgPSBwYXRoTGlzdC5tYXAoKCkgPT4gMCk7IC8vIHRyYWNrIGZpbGVzIGxvYWRpbmcgcHJvZ3Jlc3NcblxuICAgICAgICAgIGxvYWRlci5wcm9ncmVzc0NhbGxiYWNrID0gKGUpID0+IHtcbiAgICAgICAgICAgIHByb2dyZXNzUGVyRmlsZVtlLmluZGV4XSA9IGUudmFsdWU7XG5cbiAgICAgICAgICAgIGxldCB0b3RhbFByb2dyZXNzID0gMDtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9ncmVzc1BlckZpbGUubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgIHRvdGFsUHJvZ3Jlc3MgKz0gcHJvZ3Jlc3NQZXJGaWxlW2ldO1xuXG4gICAgICAgICAgICB0b3RhbFByb2dyZXNzIC89IHByb2dyZXNzUGVyRmlsZS5sZW5ndGg7XG5cbiAgICAgICAgICAgIHZpZXcuc2V0UHJvZ3Jlc3NSYXRpbyh0b3RhbFByb2dyZXNzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgbG9hZGVyXG4gICAgICAgICAgLmxvYWQocGF0aExpc3QsIHtcbiAgICAgICAgICAgIHdyYXBBcm91bmRFeHRlbnRpb246IHRoaXMub3B0aW9ucy5hdWRpb1dyYXBUYWlsLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oKGxvYWRlZE9iakxpc3QpID0+IHtcbiAgICAgICAgICAgIC8vIHBsYWNlIGxvYWRlZCBvYmplY3RzIChpLmUuIGF1ZGlvIGJ1ZmZlcnMgYW5kIGpzb24gZmlsZXMpIGludG8gdGhlIHN0cnVjdHVyZSBvZiB0aGUgZmlsZSBkZWZpbml0aW9uIG9iamVjdFxuICAgICAgICAgICAgcG9wdWxhdGVSZWZMaXN0KHJlZkxpc3QsIGxvYWRlZE9iakxpc3QpO1xuXG4gICAgICAgICAgICAvLyBtaXggbG9hZGVkIG9iamVjdHMgaW50byBkYXRhXG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuZGF0YSwgZGF0YU9iaik7XG4gICAgICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICAgICAgICByZXNvbHZlKGRhdGFPYmopO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgICByZXNvbHZlKFtdKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgZmlsZXMgZGVmaW5lZCBhcyBhIHNldCBvZiBkaXJlY3RvcnkgcGF0aHMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZPYmogLSBEZWZpbml0aW9uIG9mIGZpbGVzIHRvIGxvYWRcbiAgICogQHJldHVybnMge1Byb21pc2V9IC0gUHJvbWlzZSByZXNvbHZlZCB3aXRoIHRoZSByZXN1bHRpbmcgZGF0YSBzdHJ1Y3R1cmVcbiAgICovXG4gIGxvYWREaXJlY3RvcmllcyhkZWZPYmosIHZpZXcgPSBudWxsKSB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCBkaXJEZWZMaXN0ID0gW107XG4gICAgICBsZXQgZGlyUmVmTGlzdCA9IFtdO1xuXG4gICAgICAvLyBmb3IgdGhlIGNhc2UgdGhhdCBqdXN0IGEgZGlyZWN0b3J5IG9iamVjdCBpcyBnaXZlbiBhcyBkZWZpbml0aW9uLFxuICAgICAgLy8gd2UgaGF2ZSB0byB3cmFwIGl0IHRlbXBvcmFyaWx5IGludG8gYSBkdW1teSBvYmplY3RcbiAgICAgIGRlZk9iaiA9IHsgZGVmOiBkZWZPYmogfTtcblxuICAgICAgbGV0IGZpbGVEZWZPYmogPSBjbG9uZVBhdGhPYmooZGVmT2JqKTsgLy8gY2xvbmUgZGVmaW5pdGlvbiBvYmplY3RcblxuICAgICAgLy8gZGVjb21wb3NlIGRpcmVjdG9yeSBkZWZpbml0aW9uIGludG8gbGlzdCBvZiBkaXJlY3RvcnkgcGF0aHMgKHN0cmluZ3MpXG4gICAgICBkZWNvbXBvc2VQYXRoT2JqKGZpbGVEZWZPYmosIGRpckRlZkxpc3QsIGRpclJlZkxpc3QsIHRydWUpO1xuXG4gICAgICB0aGlzLl9maWxlU3lzdGVtLmdldExpc3QoZGlyRGVmTGlzdClcbiAgICAgICAgLnRoZW4oKGZpbGVQYXRoTGlzdExpc3QpID0+IHtcbiAgICAgICAgICBjb25zdCBzdWJEaXJMaXN0ID0gW107XG4gICAgICAgICAgY29uc3QgbGVuZ3RoID0gZmlsZVBhdGhMaXN0TGlzdC5sZW5ndGg7XG5cbiAgICAgICAgICAvLyBjcmVhdGUgc3ViIGRpcmVjdG9yeSBmaWxlIGRlZmluaXRpb25zIChsaXN0IG9mIGZpbGUgcGF0aHMgc3RydWN0dXJlZCBpbnRvIHN1YiBkaXJlY3RvcnkgdHJlZXMgZGVyaXZlZCBmcm9tIGZpbGUgcGF0aHMpXG4gICAgICAgICAgaWYgKGxlbmd0aCA9PT0gZGlyRGVmTGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgZGlyUGF0aCA9IGRpckRlZkxpc3RbaV0ucGF0aDtcbiAgICAgICAgICAgICAgY29uc3QgZmxhdHRlbiA9ICEhZGlyRGVmTGlzdFtpXS5mbGF0dGVuO1xuICAgICAgICAgICAgICBjb25zdCBwYXRoTGlzdCA9IGZpbGVQYXRoTGlzdExpc3RbaV07XG4gICAgICAgICAgICAgIGxldCBzdWJEaXIgPSBwYXRoTGlzdDtcblxuICAgICAgICAgICAgICBpZighZmxhdHRlbilcbiAgICAgICAgICAgICAgICBzdWJEaXIgPSBjcmVhdGVPYmpGcm9tUGF0aExpc3QocGF0aExpc3QsIGRpclBhdGgpO1xuXG4gICAgICAgICAgICAgIHN1YkRpckxpc3QucHVzaChzdWJEaXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByZXBsYWNlIGRpcmVjdG9yeSBwYXRocyBpbiBpbml0aWFsIGRlZmluaXRpb24gYnkgc3ViIGRpcmVjdG9yeSBmaWxlIGRlZmluaXRpb25zXG4gICAgICAgICAgICAvLyB0byBjcmVhdGUgYSBjb21wbGV0ZSBmaWxlIGRlZmluaXRpb24gb2JqZWN0XG4gICAgICAgICAgICBwb3B1bGF0ZVJlZkxpc3QoZGlyUmVmTGlzdCwgc3ViRGlyTGlzdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgWyR7U0VSVklDRV9JRH1dIENhbm5vdCByZXRyaWV2ZSBmaWxlIHBhdGhzIGZyb20gZGVmaW5lZCBkaXJlY3Rvcmllc2ApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHVud3JhcCBzdWJEaXIgZnJvbSBkdW1teSBvYmplY3RcbiAgICAgICAgICBmaWxlRGVmT2JqID0gZmlsZURlZk9iai5kZWY7XG5cbiAgICAgICAgICAvLyBsb2FkIGZpbGVzXG4gICAgICAgICAgdGhpcy5sb2FkRmlsZXMoZmlsZURlZk9iaiwgdmlldylcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4gcmVqZWN0KGVycm9yKSk7XG4gICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4gcmVqZWN0KGVycm9yKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiB3cmFwQXJvdW5kLCBjb3B5IHRoZSBiZWdpbmluZyBpbnB1dCBidWZmZXIgdG8gdGhlIGVuZCBvZiBhbiBvdXRwdXQgYnVmZmVyXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7YXJyYXlidWZmZXJ9IGluQnVmZmVyIHthcnJheWJ1ZmZlcn0gLSBUaGUgaW5wdXQgYnVmZmVyXG4gICAqIEByZXR1cm5zIHthcnJheWJ1ZmZlcn0gLSBUaGUgcHJvY2Vzc2VkIGJ1ZmZlciAod2l0aCBmcmFtZSBjb3BpZWQgZnJvbSB0aGUgYmVnaW5pbmcgdG8gdGhlIGVuZClcbiAgICovXG4gIF93cmFwQXJvdW5kKGluQnVmZmVyKSB7XG4gICAgY29uc3QgaW5MZW5ndGggPSBpbkJ1ZmZlci5sZW5ndGg7XG4gICAgY29uc3Qgb3V0TGVuZ3RoID0gaW5MZW5ndGggKyB0aGlzLm9wdGlvbnMud3JhcEFyb3VuZEV4dGVuc2lvbiAqIGluQnVmZmVyLnNhbXBsZVJhdGU7XG4gICAgY29uc3Qgb3V0QnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcihpbkJ1ZmZlci5udW1iZXJPZkNoYW5uZWxzLCBvdXRMZW5ndGgsIGluQnVmZmVyLnNhbXBsZVJhdGUpO1xuICAgIGxldCBhcnJheUNoRGF0YSwgYXJyYXlPdXRDaERhdGE7XG5cbiAgICBmb3IgKGxldCBjaCA9IDA7IGNoIDwgaW5CdWZmZXIubnVtYmVyT2ZDaGFubmVsczsgY2grKykge1xuICAgICAgYXJyYXlDaERhdGEgPSBpbkJ1ZmZlci5nZXRDaGFubmVsRGF0YShjaCk7XG4gICAgICBhcnJheU91dENoRGF0YSA9IG91dEJ1ZmZlci5nZXRDaGFubmVsRGF0YShjaCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5MZW5ndGg7IGkrKylcbiAgICAgICAgYXJyYXlPdXRDaERhdGFbaV0gPSBhcnJheUNoRGF0YVtpXTtcblxuICAgICAgZm9yIChsZXQgaSA9IGluTGVuZ3RoOyBpIDwgb3V0TGVuZ3RoOyBpKyspXG4gICAgICAgIGFycmF5T3V0Q2hEYXRhW2ldID0gYXJyYXlDaERhdGFbaSAtIGluTGVuZ3RoXTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0QnVmZmVyO1xuICB9XG5cbiAgLyoqIGRlcHJlY2F0ZWQgKi9cbiAgbG9hZChmaWxlcywgdmlldyA9IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkRmlsZXMoZmlsZXMsIHZpZXcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGEgbG9hZGVkIG9iamVjdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gT2JqZWN0IG9yIGdyb3VwIGlkZW50aWZpZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgLSBNZW1iZXIga2V5IGluIGdyb3VwLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gLSBSZXR1cm5zIHRoZSBsb2FkZWQgb2JqZWN0LlxuICAgKi9cbiAgZ2V0KGlkLCBrZXkgPSBudWxsKSB7XG4gICAgY29uc3Qgb2JqID0gdGhpcy5kYXRhW2lkXTtcblxuICAgIGlmIChvYmogJiYgKGtleSAhPT0gbnVsbCkpXG4gICAgICByZXR1cm4gb2JqW2tleV07XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIEF1ZGlvQnVmZmVyTWFuYWdlcik7XG5cbmV4cG9ydCBkZWZhdWx0IEF1ZGlvQnVmZmVyTWFuYWdlcjtcbiJdfQ==