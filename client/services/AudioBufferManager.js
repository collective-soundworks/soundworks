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

// const regexp = /\.[a-zA-Z0-9]{3,4}$/;

// supported media formats + json
// https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats
var regexp = /\.(wav|mp3|mp4|aac|aif|aiff|ogg|webm|json)$/i;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvQnVmZmVyTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwibG9nIiwiZmxhdHRlbkxpc3RzIiwiYSIsInJldCIsImZ1biIsInZhbCIsIkFycmF5IiwiaXNBcnJheSIsImZvckVhY2giLCJwdXNoIiwiY2xvbmVQYXRoT2JqIiwidmFsdWUiLCJjbGFzc05hbWUiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJjbG9uZSIsImtleSIsInJlZ2V4cCIsImlzRmlsZVBhdGgiLCJzdHIiLCJ0ZXN0IiwiaXNEaXJTcGVjIiwib2JqIiwicGF0aCIsImRlY29tcG9zZVBhdGhPYmoiLCJwYXRoTGlzdCIsInJlZkxpc3QiLCJkaXJzIiwicmVmIiwiaW5kZXgiLCJpbmRleE9mIiwibGVuZ3RoIiwicG9wdWxhdGVSZWZMaXN0IiwibG9hZGVkT2JqTGlzdCIsIkVycm9yIiwiaSIsInJlZnMiLCJqIiwibCIsImNyZWF0ZU9iakZyb21QYXRoTGlzdCIsImNvbW1vblBhdGgiLCJzdWJQYXRoSW5kZXgiLCJzdWJQYXRoIiwic3Vic3RyaW5nIiwibm9kZXMiLCJzcGxpdCIsImRlcHRoIiwidW5kZWZpbmVkIiwicHJlZml4UGF0aHMiLCJwcmVmaXgiLCJpc0Fic29sdXRlIiwibWFwIiwiQXVkaW9CdWZmZXJNYW5hZ2VyIiwiZGVmYXVsdHMiLCJhc3NldHNEb21haW4iLCJmaWxlcyIsImRpcmVjdG9yaWVzIiwiYXVkaW9XcmFwVGFpbCIsInZpZXdQcmlvcml0eSIsImRlYnVnIiwidmlldyIsImRhdGEiLCJjb25maWd1cmUiLCJvcHRpb25zIiwiX2ZpbGVTeXN0ZW0iLCJyZXF1aXJlIiwic2hvdyIsImxvYWRGaWxlcyIsImxvYWREaXJlY3RvcmllcyIsInJlYWR5IiwiaGlkZSIsImRlZk9iaiIsInByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZGF0YU9iaiIsImxvYWRlciIsInNldEF1ZGlvQ29udGV4dCIsInNldFByb2dyZXNzUmF0aW8iLCJwcm9ncmVzc1BlckZpbGUiLCJwcm9ncmVzc0NhbGxiYWNrIiwiZSIsInRvdGFsUHJvZ3Jlc3MiLCJsb2FkIiwid3JhcEFyb3VuZEV4dGVudGlvbiIsInRoZW4iLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsImRpckRlZkxpc3QiLCJkaXJSZWZMaXN0IiwiZGVmIiwiZmlsZURlZk9iaiIsImdldExpc3QiLCJmaWxlUGF0aExpc3RMaXN0Iiwic3ViRGlyTGlzdCIsImRpclBhdGgiLCJmbGF0dGVuIiwic3ViRGlyIiwiaW5CdWZmZXIiLCJpbkxlbmd0aCIsIm91dExlbmd0aCIsIndyYXBBcm91bmRFeHRlbnNpb24iLCJzYW1wbGVSYXRlIiwib3V0QnVmZmVyIiwiY3JlYXRlQnVmZmVyIiwibnVtYmVyT2ZDaGFubmVscyIsImFycmF5Q2hEYXRhIiwiYXJyYXlPdXRDaERhdGEiLCJjaCIsImdldENoYW5uZWxEYXRhIiwiaWQiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7O0FBUUE7Ozs7Ozs7Ozs7OztBQVlBLElBQU1BLGFBQWEsOEJBQW5CO0FBQ0EsSUFBTUMsTUFBTSxxQkFBTSwwQ0FBTixDQUFaOztBQUVBLFNBQVNDLFlBQVQsQ0FBc0JDLENBQXRCLEVBQXlCO0FBQ3ZCLE1BQU1DLE1BQU0sRUFBWjtBQUNBLE1BQU1DLE1BQU0sU0FBTkEsR0FBTSxDQUFDQyxHQUFEO0FBQUEsV0FBU0MsTUFBTUMsT0FBTixDQUFjRixHQUFkLElBQXFCQSxJQUFJRyxPQUFKLENBQVlKLEdBQVosQ0FBckIsR0FBd0NELElBQUlNLElBQUosQ0FBU0osR0FBVCxDQUFqRDtBQUFBLEdBQVo7QUFDQUQsTUFBSUYsQ0FBSjtBQUNBLFNBQU9DLEdBQVA7QUFDRDs7QUFFRCxTQUFTTyxZQUFULENBQXNCQyxLQUF0QixFQUE2QjtBQUMzQixNQUFJLFFBQU9BLEtBQVAsdURBQU9BLEtB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QUF1QmpFLEtBQUlrRSxTQUEzQixFQUFzQ2xFLElBQXRDO0FBQ0V5RSx5QkFBZXpFLEVBQWYsSUFBb0J3RSxZQUFZeEUsS0FBSWlFLFFBQWhCLENBQXBCO0FBREY7QUFFRDs7QUFFRCxhQUFPSSxTQUFQO0FBQ0Q7O0FBRUQ7Ozs7eUJBQ0tqRCxLLEVBQW9CO0FBQUEsVUFBYkssSUFBYSx1RUFBTixJQUFNOztBQUN2QixhQUFPLEtBQUtPLFNBQUwsQ0FBZVosS0FBZixFQUFzQkssSUFBdEIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7d0JBTUltRCxFLEVBQWdCO0FBQUEsVUFBWi9GLEdBQVksdUVBQU4sSUFBTTs7QUFDbEIsVUFBTU0sTUFBTSxLQUFLdUMsSUFBTCxDQUFVa0QsRUFBVixDQUFaOztBQUVBLFVBQUl6RixPQUFRTixRQUFRLElBQXBCLEVBQ0UsT0FBT00sSUFBSU4sR0FBSixDQUFQOztBQUVGLGFBQU9NLEdBQVA7QUFDRDs7Ozs7QUFHSCx5QkFBZTBGLFFBQWYsQ0FBd0JqSCxVQUF4QixFQUFvQ3FELGtCQUFwQzs7a0JBRWVBLGtCIiwiZmlsZSI6IkF1ZGlvQnVmZmVyTWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCB7IFN1cGVyTG9hZGVyIH0gZnJvbSAnd2F2ZXMtbG9hZGVycyc7XG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuLyoqXG4gKiBBUEkgb2YgYSBjb21wbGlhbnQgdmlldyBmb3IgdGhlIGBhdWRpby1idWZmZXItbWFuYWdlcmAgc2VydmljZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAaW50ZXJmYWNlIEFic3RyYWN0QXVkaW9CdWZmZXJNYW5hZ2VyVmlld1xuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Vmlld1xuICogQGFic3RyYWN0XG4gKi9cbi8qKlxuICogVXBkYXRlIHRoZSBwcm9ncmVzcyBiYXIgb2YgdGhlIHZpZXcgd2l0aCB0aGUgZ2l2ZW4gcmF0aW8uXG4gKlxuICogQG5hbWUgc2V0UHJvZ3Jlc3NSYXRpb1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdEF1ZGlvQnVmZmVyTWFuYWdlclZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gcmF0aW8gLSBQcm9ncmVzcyByYXRpbyBvZiB0aGUgbG9hZGVkIGFzc2V0cyAoYmV0d2VlbiAwIGFuZCAxKS5cbiAqL1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6YXVkaW8tYnVmZmVyLW1hbmFnZXInO1xuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6c2VydmljZXM6YXVkaW8tYnVmZmVyLW1hbmFnZXInKTtcblxuZnVuY3Rpb24gZmxhdHRlbkxpc3RzKGEpIHtcbiAgY29uc3QgcmV0ID0gW107XG4gIGNvbnN0IGZ1biA9ICh2YWwpID0+IEFycmF5LmlzQXJyYXkodmFsKSA/IHZhbC5mb3JFYWNoKGZ1bikgOiByZXQucHVzaCh2YWwpO1xuICBmdW4oYSk7XG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIGNsb25lUGF0aE9iaih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9IHZhbHVlLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgbGV0IGNsb25lID0gbnVsbDtcblxuICAgIGlmIChjbGFzc05hbWUgPT09ICdPYmplY3QnKVxuICAgICAgY2xvbmUgPSB7fTtcbiAgICBlbHNlIGlmIChjbGFzc05hbWUgPT09ICdBcnJheScpXG4gICAgICBjbG9uZSA9IFtdO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgIGZvciAobGV0IGtleSBpbiB2YWx1ZSlcbiAgICAgIGNsb25lW2tleV0gPSBjbG9uZVBhdGhPYmoodmFsdWVba2V5XSk7XG5cbiAgICByZXR1cm4gY2xvbmU7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbi8vIGNvbnN0IHJlZ2V4cCA9IC9cXC5bYS16QS1aMC05XXszLDR9JC87XG5cbi8vIHN1cHBvcnRlZCBtZWRpYSBmb3JtYXRzICsganNvblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRNTC9TdXBwb3J0ZWRfbWVkaWFfZm9ybWF0c1xuY29uc3QgcmVnZXhwID0gL1xcLih3YXZ8bXAzfG1wNHxhYWN8YWlmfGFpZmZ8b2dnfHdlYm18anNvbikkL2k7XG5cbmZ1bmN0aW9uIGlzRmlsZVBhdGgoc3RyKSB7XG4gIHJldHVybiAodHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgJiYgcmVnZXhwLnRlc3Qoc3RyKSk7XG59XG5cbmZ1bmN0aW9uIGlzRGlyU3BlYyhvYmopIHtcbiAgcmV0dXJuICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb2JqLnBhdGggPT09ICdzdHJpbmcnKTtcbn1cblxuZnVuY3Rpb24gZGVjb21wb3NlUGF0aE9iaihvYmosIHBhdGhMaXN0LCByZWZMaXN0LCBkaXJzID0gZmFsc2UpIHtcbiAgZm9yIChsZXQga2V5IGluIG9iaikge1xuICAgIGNvbnN0IHZhbHVlID0gb2JqW2tleV07XG5cbiAgICBpZiAoKCFkaXJzICYmIGlzRmlsZVBhdGgodmFsdWUpKSB8fCAoZGlycyAmJiBpc0RpclNwZWModmFsdWUpKSkge1xuICAgICAgY29uc3QgcmVmID0geyBvYmosIGtleSB9O1xuICAgICAgbGV0IGluZGV4ID0gLTE7XG5cbiAgICAgIGlmICghZGlycylcbiAgICAgICAgaW5kZXggPSBwYXRoTGlzdC5pbmRleE9mKHZhbHVlKTtcblxuICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICBjb25zdCBsZW5ndGggPSBwYXRoTGlzdC5wdXNoKHZhbHVlKTtcblxuICAgICAgICBpbmRleCA9IGxlbmd0aCAtIDE7XG4gICAgICAgIHJlZkxpc3RbaW5kZXhdID0gW107XG4gICAgICB9XG5cbiAgICAgIHJlZkxpc3RbaW5kZXhdLnB1c2gocmVmKTtcblxuICAgICAgb2JqW2tleV0gPSBudWxsO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgZGVjb21wb3NlUGF0aE9iaih2YWx1ZSwgcGF0aExpc3QsIHJlZkxpc3QsIGRpcnMpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBwb3B1bGF0ZVJlZkxpc3QocmVmTGlzdCwgbG9hZGVkT2JqTGlzdCkge1xuICBjb25zdCBsZW5ndGggPSByZWZMaXN0Lmxlbmd0aDtcblxuICBpZiAobGVuZ3RoICE9PSBsb2FkZWRPYmpMaXN0Lmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgWyR7U0VSVklDRV9JRH1dIExvYWRlZCBCdWZmZXJzIGRvIG5vdCBtYXRjaCBmaWxlIGRlZmluaW9uYCk7XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcmVmcyA9IHJlZkxpc3RbaV07XG5cbiAgICBmb3IgKGxldCBqID0gMCwgbCA9IHJlZnMubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICBjb25zdCByZWYgPSByZWZzW2pdO1xuICAgICAgY29uc3Qgb2JqID0gcmVmLm9iajtcbiAgICAgIGNvbnN0IGtleSA9IHJlZi5rZXk7XG5cbiAgICAgIG9ialtrZXldID0gbG9hZGVkT2JqTGlzdFtpXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlT2JqRnJvbVBhdGhMaXN0KHBhdGhMaXN0LCBjb21tb25QYXRoKSB7XG4gIGxldCBvYmogPSBbXTtcblxuICBmb3IgKGxldCBwYXRoIG9mIHBhdGhMaXN0KSB7XG4gICAgbGV0IHN1YlBhdGhJbmRleCA9IHBhdGguaW5kZXhPZihjb21tb25QYXRoKTtcblxuICAgIGlmIChzdWJQYXRoSW5kZXggPj0gMCkge1xuICAgICAgc3ViUGF0aEluZGV4ICs9IGNvbW1vblBhdGgubGVuZ3RoO1xuXG4gICAgICBpZiAocGF0aFtzdWJQYXRoSW5kZXhdID09PSAnLycpXG4gICAgICAgIHN1YlBhdGhJbmRleCsrO1xuXG4gICAgICBjb25zdCBzdWJQYXRoID0gcGF0aC5zdWJzdHJpbmcoc3ViUGF0aEluZGV4KTtcbiAgICAgIGNvbnN0IG5vZGVzID0gc3ViUGF0aC5zcGxpdCgnLycpO1xuICAgICAgY29uc3QgZGVwdGggPSBub2Rlcy5sZW5ndGg7XG4gICAgICBsZXQgcmVmID0gb2JqO1xuICAgICAgbGV0IGk7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBkZXB0aCAtIDE7IGkrKykge1xuICAgICAgICBjb25zdCBrZXkgPSBub2Rlc1tpXTtcblxuICAgICAgICBpZiAocmVmW2tleV0gPT09IHVuZGVmaW5lZClcbiAgICAgICAgICByZWZba2V5XSA9IFtdO1xuXG4gICAgICAgIHJlZiA9IHJlZltrZXldO1xuICAgICAgfVxuXG4gICAgICByZWYucHVzaChwYXRoKTtcbiAgICB9XG5cbiAgICAvLyB0cmFuc2Zvcm0gZW1wdHkgYXJyYXkgdG8gb2JqZWN0XG4gICAgaWYgKG9iai5sZW5ndGggPT09IDApXG4gICAgICBvYmogPSBPYmplY3QuYXNzaWduKHt9LCBvYmopO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gcHJlZml4UGF0aHMocGF0aExpc3QsIHByZWZpeCkge1xuICAvLyB0ZXN0IGFic29sdXRlIHVybHMgKG9yIHByb3RvY29sIHJlbGF0aXZlKVxuICBjb25zdCBpc0Fic29sdXRlID0gL15odHRwcz86XFwvXFwvfF5cXC9cXC8vaTtcblxuICBwYXRoTGlzdCA9IHBhdGhMaXN0Lm1hcCgocGF0aCkgPT4ge1xuICAgIGlmIChpc0Fic29sdXRlLnRlc3QocGF0aCkgfHwgcHJlZml4ID09PSAnLycpXG4gICAgICByZXR1cm4gcGF0aDtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gcHJlZml4ICsgcGF0aDtcbiAgfSk7XG5cbiAgcmV0dXJuIHBhdGhMaXN0O1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ2F1ZGlvLWJ1ZmZlci1tYW5hZ2VyJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgYWxsb3dzIHRvIHByZWxvYWQgZmlsZXMgYW5kIHN0b3JlIHRoZW0gaW50byBidWZmZXJzXG4gKiBiZWZvcmUgdGhlIGJlZ2lubmluZyBvZiB0aGUgZXhwZXJpZW5jZS4gQXVkaW8gZmlsZXMgd2lsbCBiZSBjb252ZXJ0ZWQgYW5kXG4gKiBzdG9yZWQgaW50byBBdWRpb0J1ZmZlciBvYmplY3RzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IG9wdGlvbnMuYXNzZXRzRG9tYWluIC0gUHJlZml4IGNvbmNhdGVuYXRlZCB0byBhbGxcbiAqICBnaXZlbiBwYXRocy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLmZpbGVzIC0gRGVmaW5pdGlvbiBvZiBmaWxlcyB0byBsb2FkLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMuZGlyZWN0b3JpZXMgLSBEZWZpbml0aW9uIG9mIGRpcmVjdG9yaWVzIHRvIGxvYWQuXG4gKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IG9wdGlvbnMuZGlyZWN0b3JpZXMgLSBMaXN0IG9mIGRpcmVjdG9yaWVzIHRvIGxvYWQuXG4gKiBAcGFyYW0ge1N0cmluZ3xtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuRmlsZVN5c3RlbX5MaXN0Q29uZmlnfSBbb3B0aW9ucy5kaXJlY3Rvcmllcz1udWxsXSAtXG4gKiAgTG9hZCBhbGwgdGhlIGZpbGVzIGluIHBhcnRpY3VsYXIgZGlyZWN0b3JpZXMuIElmIHNldHRlZCB0aGlzIG9wdGlvbiByZWxpZXNcbiAqICBvbiB0aGUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5GaWxlU3lzdGVtfSB3aGljaCBpdHNlbGYgcmVsaWVzIG9uXG4gKiAgaXRzIHNlcnZlciBjb3VudGVycGFydCwgdGhlIGF1ZGlvLWJ1ZmZlci1tYW5hZ2VyIGNhbiB0aGVuIG5vIGxvbmdlciBiZVxuICogIGNvbnNpZGVyZWQgYXMgYSBjbGllbnQtb25seSBzZXJ2aWNlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyByZXF1aXJlIGFuZCBjb25maWd1cmUgdGhlIGBhdWRpby1idWZmZXItbWFuYWdlcmAgaW5zaWRlIHRoZSBleHBlcmllbmNlXG4gKiAvLyBjb25zdHJ1Y3RvclxuICogLy8gRGVmaW5pbmcgYSBzaW5nbGUgYXJyYXkgb2YgYXVkaW8gZmlsZXMgcmVzdWx0cyBpbiBhIHNpbmdsZVxuICogLy8gYXJyYXkgb2YgYXVkaW8gYnVmZmVycyBhc3NvY2lhdGVkIHRvIHRoZSBpZGVudGlmaWVyIGBkZWZhdWx0YC5cbiAqXG4gKiAvLyBUaGVyZSBhcmUgdHdvIGRpZmZlcmVudCB3YXlzIHRvIHNwZWNpZnkgdGhlIGZpbGVzIHRvIGJlIGxvYWRlZCBhbmQgdGhlXG4gKiAvLyBkYXRhIHN0cnVjdHVyZSBpbiB3aGljaCB0aGUgbG9hZGVkIGRhdGEgb2JqZWN0cyBhcmUgYXJyYW5nZWQ6XG4gKiAvL1xuICogLy8gKDEuKSBXaXRoIHRoZSAnZmlsZXMnIG9wdGlvbiwgdGhlIGZpbGVzIGFuZCBzdHJ1Y3R1cmUgYXJlIGRlZmluZWQgYnkgYW5cbiAqIC8vIG9iamVjdCBvZiBhbnkgZGVwdGggdGhhdCBjb250YWlucyBmaWxlIHBhdGhzLiBBbGwgc3BlY2lmaWVkIGZpbGVzIGFyZVxuICogLy8gbG9hZGVkIGFuZCB0aGUgbG9hZGVkIGRhdGEgb2JqZWN0cyBhcmUgc3RvcmVkIGludG8gYW4gb2JqZWN0IG9mIHRoZSBzYW1lXG4gKiAvLyBzdHJ1Y3R1cmUgYXMgdGhlIGRlZmluaXRpb24gb2JqZWN0LlxuICpcbiAqIHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1idWZmZXItbWFuYWdlcicsIHsgZmlsZXM6IFtcbiAqICAgJ3NvdW5kcy9kcnVtcy9raWNrLm1wMycsXG4gKiAgICdzb3VuZHMvZHJ1bXMvc25hcmUubXAzJ1xuICogXX0pO1xuICpcbiAqIHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1idWZmZXItbWFuYWdlcicsIHsgZmlsZXM6IHtcbiAqICAga2ljazogJ3NvdW5kcy9raWNrXzQ0a0h6Lm1wMycsXG4gKiAgIHNuYXJlOiAnc291bmRzLzgwOHNuYXJlLm1wMydcbiAqIH19KTtcbiAqXG4gKiB0aGlzLmF1ZGlvQnVmZmVyTWFuYWdlciA9IHRoaXMucmVxdWlyZSgnYXVkaW8tYnVmZmVyLW1hbmFnZXInLCB7IGZpbGVzOiB7XG4gKiAgIGxhdGluOiB7XG4gKiAgICAgYXVkaW86ICdsb29wcy9zaGVpbGEtZS1yYXNwYmVycnkubXAzJyxcbiAqICAgICBtYXJrZXJzOiAnbG9vcHMvc2hlaWxhLWUtcmFzcGJlcnJ5LW1hcmtlcnMuanNvbicsXG4gKiAgIH0sXG4gKiAgIGpheno6IHtcbiAqICAgICBhdWRpbzogJ2xvb3BzL251c3NiYXVtLXNodWZmbGUubXAzJyxcbiAqICAgICBtYXJrZXJzOiAnbG9vcHMvbnVzc2JhdW0tc2h1ZmZsZS1tYXJrZXJzLmpzb24nLFxuICogICB9LFxuICogfX0pO1xuICpcbiAqIHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1idWZmZXItbWFuYWdlcicsIHsgZmlsZXM6IHtcbiAqICAgaW5zdHJ1bWVudHM6IFtcbiAqICAgICAnc291bmRzL2luc3RydW1lbnRzL2tpY2tfNDRrSHoubXAzJyxcbiAqICAgICAnc291bmRzL2luc3RydW1lbnRzLzgwOHNuYXJlLm1wMyddLFxuICogICBsb29wczogW1xuICogICAgICdzb3VuZHMvbG9vcHMvc2hlaWxhLWUtcmFzcGJlcnJ5Lm1wMycsXG4gKiAgICAgJ3NvdW5kcy9sb29wcy9udXNzYmF1bS1zaHVmZmxlLm1wMyddLFxuICogfX0pO1xuICpcbiAqIC8vKDIuKSBUaGUgJ2RpcmVjdG9yaWVzJyBvcHRpb24gY2FuIGJlIHVzZWQgdG8gbG9hZCB0aGUgZmlsZXMgb2YgYVxuICogLy8gZ2l2ZW4gZGlyZWN0b3J5LiBFYWNoIGRpcmVjdG9yeSBpcyBzcGVjaWZpZWQgYnkgYW4gb2JqZWN0IHRoYXQgaGFzIGFcbiAqIC8vIHByb3BlcnR5ICdwYXRoJyB3aXRoIHRoZSBkaXJlY3RvcnkgcGF0aCBhbmQgb3B0aW9uYWxseSB0aGUga2V5c1xuICogLy8gJ3JlY3Vyc2l2ZScgKHNwZWNpZnlpbmcgd2hldGhlciB0aGUgZGlyZWN0b3J5J3Mgc3ViLWRpcmVjdG9yaWVzIGFyZVxuICogLy8gY29uc2lkZXJlZCkgYW5kIGEga2V5ICdtYXRjaCcgKHNwZWNpZnlpbmcgYSByZWdleHAgdG8gc2VsZWN0IHRoZSBmaWxlc1xuICogLy8gaW4gdGhlIGdpdmVuIGRpcmVjdG9yeSkuXG4gKlxuICogLy8gV2l0aCB0aGUgb3B0aW9uICdyZWN1cnNpdmUnIHNldCB0byBmYWxzZSwgYWxsIChtYXRjaGluZykgZmlsZXNcbiAqIC8vIGluIGEgZ2l2ZW4gZGlyZWN0b3JpeSBhcmUgbG9hZGVkIGludG8gYW4gYXJyYXlzIG9mIG9iamVjdHMgd2l0aG91dFxuICogLy8gY29uc2lkZXJpbmcgc3ViLWRpcmVjdG9yaWVzLiBUaGUgYXJyYXlzIG9mIGxvYWRlZCBkYXRhIG9iamVjdHMgYXJlXG4gKiAvLyBhcnJhbmdlZCBpbiB0aGUgc2FtZSBkYXRhIHN0cnVjdHVyZSBhcyB0aGUgZGVmaW5pdGlvbiBvYmplY3QuXG4gKlxuICogdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLWJ1ZmZlci1tYW5hZ2VyJywge1xuICogICBkaXJlY3Rvcmllczoge1xuICogICAgIGluc3RydW1lbnRzOiB7IHBhdGg6ICdzb3VuZHMvaW5zdHJ1bWVudHMnLCByZWN1cnNpdmU6IGZhbHNlIH0sXG4gKiAgICAgbG9vcHM6IHsgcGF0aDogJ3NvdW5kcy9pbnN0cnVtZW50cycsIHJlY3Vyc2l2ZTogZmFsc2UgfSxcbiAqICAgfSxcbiAqIH0pO1xuICpcbiAqIC8vIFdoZW4gJ3JlY3Vyc2l2ZScgaXMgc2V0IHRvIHRydWUsIGFsbCAobWF0Y2hpbmcpIGZpbGVzIGluIHRoZSBnaXZlblxuICogLy8gZGlyZWN0b3JpZXMgYW5kIHRoZWlyIHN1Yi1kaXJlY3RvcmllcyBhcmUgbG9hZGVkIGFzIGFycmF5cyBvZiBvYmplY3RzLlxuICogLy8gV2l0aCB0aGUgb3B0aW9uICdmbGF0dGVuJyBzZXQgdG8gdHJ1ZSwgYWxsIGZpbGVzIGluIHRoZSBkZWZpbmVkIGRpcmVjdG9yeVxuICogLy8gYW5kIGl0cyBzdWItZGlyZWN0b3JpZXMgYXJlIGxvYWRlZCBpbnRvIGEgc2luZ2xlIGFycmF5LiBXaGVuIHRoZSBvcHRpb25cbiAqIC8vICdmbGF0dGVuJyBzZXQgdG8gZmFsc2UsIHRoZSBmaWxlcyBvZiBlYWNoIHN1Yi1kaXJlY3RvcnkgYXJlIGFzc2VtYmxlZFxuICogLy8gaW50byBhbiBhcnJheSBhbmQgYWxsIG9mIHRoZXNlIGFycmF5cyBhcmUgYXJyYW5nZWQgdG8gYSBkYXRhIHN0cnVjdHVyZVxuICogLy8gdGhhdCByZXByb2R1Y2VzIHRoZSBzdWItZGlyZWN0b3J5IHRyZWUgb2YgdGhlIGRlZmluZWQgZGlyZWN0b3JpZXMuXG4gKiAvLyBUaGUgcmVzdWx0aW5nIGRhdGEgc3RydWN0dXJlIGNvcnJlc3BvbmRzIHRvIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlXG4gKiAvLyBkZWZpbml0aW9uIG9iamVjdCBleHRlbmRlZCBieSB0aGUgZGVmaW5lZCBzdWItZGlyZWN0b3J5IHRyZWVzLlxuICpcbiAqIC8vIFRoZSBmb2xsb3dpbmcgb3B0aW9uIHJlc3VsdHMgaW4gYSBzaW5nbGUgYXJyYXkgb2YgcHJlLWxvYWRlZCBmaWxlczpcbiAqIHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1idWZmZXItbWFuYWdlcicsIHtcbiAqICAgZGlyZWN0b3JpZXM6IHtcbiAqICAgICBwYXRoOiAnc291bmRzJyxcbiAqICAgICByZWN1cnNpdmU6IHRydWUsXG4gKiAgICAgZmxhdHRlbjogdHJ1ZSxcbiAqICAgICBtYXRjaDogL1xcLm1wMy8sXG4gKiAgIH0sXG4gKiB9KTtcbiAqXG4gKiAvLyBUaGlzIHZhcmlhbnQgcmVzdWx0cyBpbiBhIGRhdGEgc3RydWN0dXJlIHRoYXQgcmVwcm9kdWNlcyB0aGVcbiAqIC8vIHN1Yi1kaXJlY3RvcnkgdHJlZSBvZiB0aGUgJ3NvdW5kcycgZGlyZWN0b3J5OlxuICogdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLWJ1ZmZlci1tYW5hZ2VyJywge1xuICogICBkaXJlY3Rvcmllczoge1xuICogICAgIHBhdGg6ICdzb3VuZHMnLFxuICogICAgIHJlY3Vyc2l2ZTogdHJ1ZSxcbiAqICAgICBtYXRjaDogL1xcLm1wMy8sXG4gKiAgIH0sXG4gKiB9KTtcbiAqXG4gKiAvLyBUaGUgbG9hZGVkIG9iamVjdHMgY2FuIGJlIHJldHJpZXZlZCBhY2NvcmRpbmcgdG8gdGhlaXIgZGVmaW5pdGlvbiwgYXMgZm9yIGV4YW1wbGUgOlxuICogY29uc3Qga2lja0J1ZmZlciA9IHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyLmRhdGEua2ljaztcbiAqIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIuZGF0YS5sYXRpbi5hdWRpbztcbiAqIGNvbnN0IG1hcmtlckFycmF5ID0gdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIuZGF0YS5qYXp6Lm1hcmtlcnM7XG4gKiBjb25zdCBzbmFyZUJ1ZmZlciA9IHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyLmRhdGEuaW5zdHJ1bWVudHNbMV07XG4gKiBjb25zdCBudXNzYmF1bUxvb3AgPSB0aGlzLmF1ZGlvQnVmZmVyTWFuYWdlci5kYXRhLmxvb3BzWzFdO1xuICovXG5jbGFzcyBBdWRpb0J1ZmZlck1hbmFnZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGFzc2V0c0RvbWFpbjogJycsXG4gICAgICBmaWxlczogbnVsbCxcbiAgICAgIGRpcmVjdG9yaWVzOiBudWxsLFxuICAgICAgYXVkaW9XcmFwVGFpbDogMCxcbiAgICAgIHZpZXdQcmlvcml0eTogNCxcbiAgICAgIGRlYnVnOiBmYWxzZSwgLy8gaWYgc2V0IHRvIHRydWUsIHRoZSBzZXJ2aWNlIG5ldmVyIFwicmVhZHlcIiB0byBkZWJ1ZyB0aGUgdmlld1xuICAgIH07XG5cbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRGF0YSBzdHJ1Y3R1cmUgY29ycmVwb25kaW5nIHRvIHRoZSBzdHJ1Y3R1cmUgb2YgcmVxdWVzdGVkIGZpbGVzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kYXRhID0gW107XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG5cbiAgICBjb25zdCBkaXJlY3RvcmllcyA9IHRoaXMub3B0aW9ucy5kaXJlY3RvcmllcztcblxuICAgIGlmIChkaXJlY3RvcmllcyAhPT0gbnVsbClcbiAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0gPSB0aGlzLnJlcXVpcmUoJ2ZpbGUtc3lzdGVtJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5maWxlcyB8fCB0aGlzLm9wdGlvbnMuZGlyZWN0b3JpZXMpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZmlsZXMpXG4gICAgICAgIHRoaXMubG9hZEZpbGVzKHRoaXMub3B0aW9ucy5maWxlcywgdGhpcy52aWV3KTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaXJlY3RvcmllcylcbiAgICAgICAgdGhpcy5sb2FkRGlyZWN0b3JpZXModGhpcy5vcHRpb25zLmRpcmVjdG9yaWVzLCB0aGlzLnZpZXcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgcmVhZHkoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZyA9PT0gZmFsc2UpXG4gICAgICBzdXBlci5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgZmlsZXMgZGVmaW5lZCBhcyBhIHNldCBvZiBmaWxlIHBhdGhzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmT2JqIC0gRGVmaW5pdGlvbiBvZiBmaWxlcyB0byBsb2FkXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSAtIFByb21pc2UgcmVzb2x2ZWQgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBsb2FkRmlsZXMoZGVmT2JqLCB2aWV3ID0gbnVsbCkge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgcGF0aExpc3QgPSBbXTtcbiAgICAgIGxldCByZWZMaXN0ID0gW107XG5cbiAgICAgIGlmICh0eXBlb2YgZGVmT2JqID09PSAnc3RyaW5nJylcbiAgICAgICAgZGVmT2JqID0gW2RlZk9ial07XG5cbiAgICAgIC8vIGNyZWF0ZSBkYXRhIG9iamVjdCBjb3B5aW5nIHRoZSBzdHJjdXR1cmUgb2YgdGhlIGZpbGUgZGVmaW5pb24gb2JqZWN0XG4gICAgICBjb25zdCBkYXRhT2JqID0gY2xvbmVQYXRoT2JqKGRlZk9iaik7XG4gICAgICBkZWNvbXBvc2VQYXRoT2JqKGRhdGFPYmosIHBhdGhMaXN0LCByZWZMaXN0LCBmYWxzZSk7XG5cbiAgICAgIC8vIHByZWZpeCByZWxhdGl2ZSBwYXRocyB3aXRoIGFzc2V0c0RvbWFpblxuICAgICAgcGF0aExpc3QgPSBwcmVmaXhQYXRocyhwYXRoTGlzdCwgdGhpcy5vcHRpb25zLmFzc2V0c0RvbWFpbik7XG5cbiAgICAgIGxvZyhwYXRoTGlzdCwgcmVmTGlzdCk7XG5cbiAgICAgIC8vIGxvYWQgZmlsZXNcbiAgICAgIGlmIChwYXRoTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBTdXBlckxvYWRlcigpO1xuICAgICAgICBsb2FkZXIuc2V0QXVkaW9Db250ZXh0KGF1ZGlvQ29udGV4dCk7XG5cbiAgICAgICAgaWYgKHZpZXcgJiYgdmlldy5zZXRQcm9ncmVzc1JhdGlvKSB7XG4gICAgICAgICAgY29uc3QgcHJvZ3Jlc3NQZXJGaWxlID0gcGF0aExpc3QubWFwKCgpID0+IDApOyAvLyB0cmFjayBmaWxlcyBsb2FkaW5nIHByb2dyZXNzXG5cbiAgICAgICAgICBsb2FkZXIucHJvZ3Jlc3NDYWxsYmFjayA9IChlKSA9PiB7XG4gICAgICAgICAgICBwcm9ncmVzc1BlckZpbGVbZS5pbmRleF0gPSBlLnZhbHVlO1xuXG4gICAgICAgICAgICBsZXQgdG90YWxQcm9ncmVzcyA9IDA7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvZ3Jlc3NQZXJGaWxlLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICB0b3RhbFByb2dyZXNzICs9IHByb2dyZXNzUGVyRmlsZVtpXTtcblxuICAgICAgICAgICAgdG90YWxQcm9ncmVzcyAvPSBwcm9ncmVzc1BlckZpbGUubGVuZ3RoO1xuXG4gICAgICAgICAgICB2aWV3LnNldFByb2dyZXNzUmF0aW8odG90YWxQcm9ncmVzcyk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWRlclxuICAgICAgICAgIC5sb2FkKHBhdGhMaXN0LCB7XG4gICAgICAgICAgICB3cmFwQXJvdW5kRXh0ZW50aW9uOiB0aGlzLm9wdGlvbnMuYXVkaW9XcmFwVGFpbCxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKChsb2FkZWRPYmpMaXN0KSA9PiB7XG4gICAgICAgICAgICAvLyBwbGFjZSBsb2FkZWQgb2JqZWN0cyAoaS5lLiBhdWRpbyBidWZmZXJzIGFuZCBqc29uIGZpbGVzKSBpbnRvIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGZpbGUgZGVmaW5pdGlvbiBvYmplY3RcbiAgICAgICAgICAgIHBvcHVsYXRlUmVmTGlzdChyZWZMaXN0LCBsb2FkZWRPYmpMaXN0KTtcblxuICAgICAgICAgICAgLy8gbWl4IGxvYWRlZCBvYmplY3RzIGludG8gZGF0YVxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmRhdGEsIGRhdGFPYmopO1xuICAgICAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgICAgICAgcmVzb2x2ZShkYXRhT2JqKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgICAgcmVzb2x2ZShbXSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGZpbGVzIGRlZmluZWQgYXMgYSBzZXQgb2YgZGlyZWN0b3J5IHBhdGhzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGVmT2JqIC0gRGVmaW5pdGlvbiBvZiBmaWxlcyB0byBsb2FkXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSAtIFByb21pc2UgcmVzb2x2ZWQgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBsb2FkRGlyZWN0b3JpZXMoZGVmT2JqLCB2aWV3ID0gbnVsbCkge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgZGlyRGVmTGlzdCA9IFtdO1xuICAgICAgbGV0IGRpclJlZkxpc3QgPSBbXTtcblxuICAgICAgLy8gZm9yIHRoZSBjYXNlIHRoYXQganVzdCBhIGRpcmVjdG9yeSBvYmplY3QgaXMgZ2l2ZW4gYXMgZGVmaW5pdGlvbixcbiAgICAgIC8vIHdlIGhhdmUgdG8gd3JhcCBpdCB0ZW1wb3JhcmlseSBpbnRvIGEgZHVtbXkgb2JqZWN0XG4gICAgICBkZWZPYmogPSB7IGRlZjogZGVmT2JqIH07XG5cbiAgICAgIGxldCBmaWxlRGVmT2JqID0gY2xvbmVQYXRoT2JqKGRlZk9iaik7IC8vIGNsb25lIGRlZmluaXRpb24gb2JqZWN0XG5cbiAgICAgIC8vIGRlY29tcG9zZSBkaXJlY3RvcnkgZGVmaW5pdGlvbiBpbnRvIGxpc3Qgb2YgZGlyZWN0b3J5IHBhdGhzIChzdHJpbmdzKVxuICAgICAgZGVjb21wb3NlUGF0aE9iaihmaWxlRGVmT2JqLCBkaXJEZWZMaXN0LCBkaXJSZWZMaXN0LCB0cnVlKTtcblxuICAgICAgdGhpcy5fZmlsZVN5c3RlbS5nZXRMaXN0KGRpckRlZkxpc3QpXG4gICAgICAgIC50aGVuKChmaWxlUGF0aExpc3RMaXN0KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3ViRGlyTGlzdCA9IFtdO1xuICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IGZpbGVQYXRoTGlzdExpc3QubGVuZ3RoO1xuXG4gICAgICAgICAgLy8gY3JlYXRlIHN1YiBkaXJlY3RvcnkgZmlsZSBkZWZpbml0aW9ucyAobGlzdCBvZiBmaWxlIHBhdGhzIHN0cnVjdHVyZWQgaW50byBzdWIgZGlyZWN0b3J5IHRyZWVzIGRlcml2ZWQgZnJvbSBmaWxlIHBhdGhzKVxuICAgICAgICAgIGlmIChsZW5ndGggPT09IGRpckRlZkxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGRpclBhdGggPSBkaXJEZWZMaXN0W2ldLnBhdGg7XG4gICAgICAgICAgICAgIGNvbnN0IGZsYXR0ZW4gPSAhIWRpckRlZkxpc3RbaV0uZmxhdHRlbjtcbiAgICAgICAgICAgICAgY29uc3QgcGF0aExpc3QgPSBmaWxlUGF0aExpc3RMaXN0W2ldO1xuICAgICAgICAgICAgICBsZXQgc3ViRGlyID0gcGF0aExpc3Q7XG5cbiAgICAgICAgICAgICAgaWYoIWZsYXR0ZW4pXG4gICAgICAgICAgICAgICAgc3ViRGlyID0gY3JlYXRlT2JqRnJvbVBhdGhMaXN0KHBhdGhMaXN0LCBkaXJQYXRoKTtcblxuICAgICAgICAgICAgICBzdWJEaXJMaXN0LnB1c2goc3ViRGlyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVwbGFjZSBkaXJlY3RvcnkgcGF0aHMgaW4gaW5pdGlhbCBkZWZpbml0aW9uIGJ5IHN1YiBkaXJlY3RvcnkgZmlsZSBkZWZpbml0aW9uc1xuICAgICAgICAgICAgLy8gdG8gY3JlYXRlIGEgY29tcGxldGUgZmlsZSBkZWZpbml0aW9uIG9iamVjdFxuICAgICAgICAgICAgcG9wdWxhdGVSZWZMaXN0KGRpclJlZkxpc3QsIHN1YkRpckxpc3QpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFske1NFUlZJQ0VfSUR9XSBDYW5ub3QgcmV0cmlldmUgZmlsZSBwYXRocyBmcm9tIGRlZmluZWQgZGlyZWN0b3JpZXNgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyB1bndyYXAgc3ViRGlyIGZyb20gZHVtbXkgb2JqZWN0XG4gICAgICAgICAgZmlsZURlZk9iaiA9IGZpbGVEZWZPYmouZGVmO1xuXG4gICAgICAgICAgLy8gbG9hZCBmaWxlc1xuICAgICAgICAgIHRoaXMubG9hZEZpbGVzKGZpbGVEZWZPYmosIHZpZXcpXG4gICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHJlamVjdChlcnJvcikpO1xuICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHJlamVjdChlcnJvcikpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogd3JhcEFyb3VuZCwgY29weSB0aGUgYmVnaW5pbmcgaW5wdXQgYnVmZmVyIHRvIHRoZSBlbmQgb2YgYW4gb3V0cHV0IGJ1ZmZlclxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge2FycmF5YnVmZmVyfSBpbkJ1ZmZlciB7YXJyYXlidWZmZXJ9IC0gVGhlIGlucHV0IGJ1ZmZlclxuICAgKiBAcmV0dXJucyB7YXJyYXlidWZmZXJ9IC0gVGhlIHByb2Nlc3NlZCBidWZmZXIgKHdpdGggZnJhbWUgY29waWVkIGZyb20gdGhlIGJlZ2luaW5nIHRvIHRoZSBlbmQpXG4gICAqL1xuICBfd3JhcEFyb3VuZChpbkJ1ZmZlcikge1xuICAgIGNvbnN0IGluTGVuZ3RoID0gaW5CdWZmZXIubGVuZ3RoO1xuICAgIGNvbnN0IG91dExlbmd0aCA9IGluTGVuZ3RoICsgdGhpcy5vcHRpb25zLndyYXBBcm91bmRFeHRlbnNpb24gKiBpbkJ1ZmZlci5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IG91dEJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoaW5CdWZmZXIubnVtYmVyT2ZDaGFubmVscywgb3V0TGVuZ3RoLCBpbkJ1ZmZlci5zYW1wbGVSYXRlKTtcbiAgICBsZXQgYXJyYXlDaERhdGEsIGFycmF5T3V0Q2hEYXRhO1xuXG4gICAgZm9yIChsZXQgY2ggPSAwOyBjaCA8IGluQnVmZmVyLm51bWJlck9mQ2hhbm5lbHM7IGNoKyspIHtcbiAgICAgIGFycmF5Q2hEYXRhID0gaW5CdWZmZXIuZ2V0Q2hhbm5lbERhdGEoY2gpO1xuICAgICAgYXJyYXlPdXRDaERhdGEgPSBvdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoY2gpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluTGVuZ3RoOyBpKyspXG4gICAgICAgIGFycmF5T3V0Q2hEYXRhW2ldID0gYXJyYXlDaERhdGFbaV07XG5cbiAgICAgIGZvciAobGV0IGkgPSBpbkxlbmd0aDsgaSA8IG91dExlbmd0aDsgaSsrKVxuICAgICAgICBhcnJheU91dENoRGF0YVtpXSA9IGFycmF5Q2hEYXRhW2kgLSBpbkxlbmd0aF07XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dEJ1ZmZlcjtcbiAgfVxuXG4gIC8qKiBkZXByZWNhdGVkICovXG4gIGxvYWQoZmlsZXMsIHZpZXcgPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMubG9hZEZpbGVzKGZpbGVzLCB2aWV3KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhIGxvYWRlZCBvYmplY3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIE9iamVjdCBvciBncm91cCBpZGVudGlmaWVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC0gTWVtYmVyIGtleSBpbiBncm91cC5cbiAgICogQHJldHVybnMge1Byb21pc2V9IC0gUmV0dXJucyB0aGUgbG9hZGVkIG9iamVjdC5cbiAgICovXG4gIGdldChpZCwga2V5ID0gbnVsbCkge1xuICAgIGNvbnN0IG9iaiA9IHRoaXMuZGF0YVtpZF07XG5cbiAgICBpZiAob2JqICYmIChrZXkgIT09IG51bGwpKVxuICAgICAgcmV0dXJuIG9ialtrZXldO1xuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBBdWRpb0J1ZmZlck1hbmFnZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBBdWRpb0J1ZmZlck1hbmFnZXI7XG4iXX0=