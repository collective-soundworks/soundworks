'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _wavesAudio = require('waves-audio');

var _wavesLoaders = require('waves-loaders');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _SegmentedView2 = require('../views/SegmentedView');

var _SegmentedView3 = _interopRequireDefault(_SegmentedView2);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:loader';
var log = (0, _debug2.default)('soundworks:services:loader');

var defaultViewTemplate = '\n<div class="section-top flex-middle">\n  <p><%= loading %></p>\n</div>\n<div class="section-center flex-center">\n  <% if (showProgress) { %>\n  <div class="progress-wrap">\n    <div class="progress-bar"></div>\n  </div>\n  <% } %>\n</div>\n<div class="section-bottom"></div>';

var defaultViewContent = {
  loading: 'Loading sounds…'
};

/**
 * Interface for the view of the `loader` service.
 *
 * @interface AbstractLoaderView
 * @extends module:soundworks/client.View
 */
/**
 * Method called when a new information about the currently loaded assets
 * is received.
 *
 * @function
 * @name AbstractLoaderView.onProgress
 * @param {Number} percent - The purcentage of loaded assets.
 */

var LoaderView = function (_SegmentedView) {
  (0, _inherits3.default)(LoaderView, _SegmentedView);

  function LoaderView() {
    (0, _classCallCheck3.default)(this, LoaderView);
    return (0, _possibleConstructorReturn3.default)(this, (LoaderView.__proto__ || (0, _getPrototypeOf2.default)(LoaderView)).apply(this, arguments));
  }

  (0, _createClass3.default)(LoaderView, [{
    key: 'onRender',
    value: function onRender() {
      (0, _get3.default)(LoaderView.prototype.__proto__ || (0, _getPrototypeOf2.default)(LoaderView.prototype), 'onRender', this).call(this);
      this.$progressBar = this.$el.querySelector('.progress-bar');
    }
  }, {
    key: 'onProgress',
    value: function onProgress(percent) {
      if (this.content.showProgress) this.$progressBar.style.width = percent + '%';
    }
  }]);
  return LoaderView;
}(_SegmentedView3.default);

function getIdFromFilePath(filePath) {
  var fileName = filePath.split('/').pop();
  return fileName.split('.')[0];
}

/**
 * Interface for the client `'loader'` service.
 *
 * This service allows to preload files and store them into buffers
 * before the beginning of the experience. Audio files will be converted and
 * stored into AudioBuffer objects.
 *
 * @param {Object} options
 * @param {Array<String>} options.assetsDomain - Prefix concatenated to all
 *  given paths.
 * @param {Array<String>} options.files - List of files to load.
 * @param {Boolean} [options.showProgress=true] - Display the progress bar
 *  in the view.
 *
 * @memberof module:soundworks/client
 * @example
 * // require and configure the loader inside the experience constructor,
 * // the files to load can be defined as an object with identifiers
 * this.loader = this.require('loader', { files: {
 *   kick: 'sounds/kick_44kHz.mp3',
 *   snare: 'sounds/808snare.mp3'
 * }});
 *
 * // ... or as a group of objets associating different files to different keys
 * this.loader = this.require('loader', { files: {
 *   latin: {
 *     audio: 'loops/sheila-e-raspberry.mp3',
 *     segments: 'loops/sheila-e-raspberry-markers.json',
 *   },
 *   jazz: {
 *     audio: 'loops/nussbaum-shuffle.mp3',
 *     segments: 'loops/nussbaum-shuffle-markers.json',
 *   },
 * }});
 *
 * // ... when defining the files to load as a simple array,
 * // the identifiers are derived as the file names without path and extension
 * this.loader = this.require('loader', { files: [
 *   'sounds/drums/kick.mp3',
 *   'sounds/drums/snare.mp3'
 * ]});
 *
 * // the loaded objects can be retrieved according to their definition
 * const kickBuffer = this.loader.get('kick');
 * const audioBuffer = this.loader.get('jazz', 'audio');
 * const segmentArray = this.loader.get('jazz', 'segments');
 *
 * // ... audio buffers an be retrieved through their identifier
 * const snareBuffer = this.loader.getAudioBuffer('snare');
 * const jazzBuffer = this.loader.getAudioBuffer('jazz');
 *
 * // ... the buffers property contains an array of all loaded objects
 * // in the order of their definition
 * const kickBuffer = this.loader.buffers[0];
 * const snareBuffer = this.loader.buffers[1];
 */

var Loader = function (_Service) {
  (0, _inherits3.default)(Loader, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function Loader() {
    (0, _classCallCheck3.default)(this, Loader);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (Loader.__proto__ || (0, _getPrototypeOf2.default)(Loader)).call(this, SERVICE_ID, false));

    var defaults = {
      assetsDomain: '',
      showProgress: true,
      files: [],
      audioWrapTail: 0,
      viewCtor: LoaderView,
      viewPriority: 4
    };

    _this2._defaultViewTemplate = defaultViewTemplate;
    _this2._defaultViewContent = defaultViewContent;

    _this2.configure(defaults);
    return _this2;
  }

  /** @private */


  (0, _createClass3.default)(Loader, [{
    key: 'init',
    value: function init() {
      /**
       * List of all loaded buffers.
       * @private
       */
      this.buffers = [];

      /**
       * List of the loaded audio buffers created from the loaded audio files.
       * @private
       */
      this.audioBuffers = {};

      /**
       * Data structure correponding to the structure of requested files.
       * @private
       */
      this.data = {};

      // prepare view
      this.viewContent.showProgress = this.options.showProgress;
      this.viewCtor = this.options.viewCtor;
      this.view = this.createView();
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)(Loader.prototype.__proto__ || (0, _getPrototypeOf2.default)(Loader.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();
      // preload files (must be called after show)
      this._loadFiles(this.options.files, this.view, true);
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      (0, _get3.default)(Loader.prototype.__proto__ || (0, _getPrototypeOf2.default)(Loader.prototype), 'stop', this).call(this);
    }

    /** @private */

  }, {
    key: '_appendFileDescription',
    value: function _appendFileDescription(filePaths, fileDescriptions, fileDescr) {
      var id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

      var descr = undefined;

      if (typeof fileDescr === 'string') {
        /**
         * fileDescr = {
         *   my-sound-id: 'assets/audio-file-name.wav'
         * }
         * // becomes
         * {
         *   my-sound-id: <AudioBuffer>
         * }
         * ... or
         * fileDescr = 'assets/audio-file-name.wav'
         * // becomes
         * {
         *   audio-file-name: <AudioBuffer>
         * }
         */
        var path = fileDescr;

        if (!id) id = getIdFromFilePath(path);

        var _descr = { id: id, path: path };
        filePaths.push(path);
        fileDescriptions.push(_descr);
      } else if (id && (typeof fileDescr === 'undefined' ? 'undefined' : (0, _typeof3.default)(fileDescr)) === 'object') {
        /**
         * fileDescr = {
         *   my-sound-id: {
         *     audio: 'assets/audio-file-name.wav',
         *     segmentation: 'assets/descriptor-file-name.json']
         * }
         * // becomes
         * {
         *   my-sound-id: {
         *     audio: <AudioBuffer>,
         *     segmentation: [<segments>]
         *   }
         * }
         */
        for (var key in fileDescr) {
          var _path = fileDescr[key];

          if (typeof _path === 'string') {
            var _descr2 = { id: id, key: key, path: _path };
            filePaths.push(_path);
            fileDescriptions.push(_descr2);
          }
        }
      }
    }

    /**
     * Populate the `audioBuffers` and `data` attribute according to the loader
     * response and the given file descriptions.
     * @private
     */

  }, {
    key: '_populateData',
    value: function _populateData(loadedObjects, fileDescriptions) {
      var _this3 = this;

      loadedObjects.forEach(function (obj, i) {
        var descr = fileDescriptions[i];
        var id = descr.id;
        var key = descr.key;

        _this3.buffers.push(obj);

        if (obj instanceof AudioBuffer) _this3.audioBuffers[id] = obj;

        if (key) {
          var data = _this3.data[id];

          if (!data) _this3.data[id] = data = {};

          data[key] = obj;
        } else {
          _this3.data[id] = obj;
        }

        log(_this3.data[id]);
      });
    }

    /** @private */

  }, {
    key: '_loadFiles',
    value: function _loadFiles(files) {
      var _this4 = this;

      var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var triggerReady = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var promise = new _promise2.default(function (resolve, reject) {
        var filePaths = [];
        var fileDescriptions = [];

        // prepare the files descriptions
        if (Array.isArray(files)) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = (0, _getIterator3.default)(files), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var file = _step.value;

              _this4._appendFileDescription(filePaths, fileDescriptions, file);
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
        } else {
          for (var id in files) {
            _this4._appendFileDescription(filePaths, fileDescriptions, files[id], id);
          }
        }

        filePaths = filePaths.map(function (path) {
          return _this4.options.assetsDomain + path;
        });
        log(filePaths);

        // load files
        if (filePaths.length > 0 && fileDescriptions.length > 0) {
          var loader = new _wavesLoaders.SuperLoader();
          loader.setAudioContext(_wavesAudio.audioContext);

          if (view && view.onProgress) {
            var progressPerFile = filePaths.map(function () {
              return 0;
            }); // track files loading progress

            loader.progressCallback = function (e) {
              progressPerFile[e.index] = e.value;

              var totalProgress = progressPerFile.reduce(function (prev, current) {
                return prev + current;
              }, 0);
              totalProgress /= progressPerFile.length;

              view.onProgress(totalProgress * 100);
            };
          };

          loader.load(filePaths, { wrapAroundExtention: _this4.options.audioWrapTail }).then(function (loadedObjects) {
            _this4._populateData(loadedObjects, fileDescriptions);

            if (triggerReady) _this4.ready();

            resolve();
          }).catch(function (error) {
            reject(error);
            console.error(error);
          });
        } else {
          if (triggerReady) _this4.ready();

          resolve();
        }
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
      var length = inBuffer.length + this.options.wrapAroundExtension * inBuffer.sampleRate;

      var outBuffer = _wavesAudio.audioContext.createBuffer(inBuffer.numberOfChannels, length, inBuffer.sampleRate);
      var arrayChData, arrayOutChData;

      for (var channel = 0; channel < inBuffer.numberOfChannels; channel++) {
        arrayChData = inBuffer.getChannelData(channel);
        arrayOutChData = outBuffer.getChannelData(channel);

        arrayOutChData.forEach(function (sample, index) {
          if (index < inBuffer.length) arrayOutChData[index] = arrayChData[index];else arrayOutChData[index] = arrayChData[index - inBuffer.length];
        });
      }

      return outBuffer;
    }

    /**
     * Load a defined set of files.
     * @param {Object} files - Definition of files to load (same as require).
     * @returns {Promise} - A promise that is resolved when all files are loaded.
     */

  }, {
    key: 'load',
    value: function load(files) {
      return this._loadFiles(files);
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
      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      var obj = this.data[id];

      if (obj && key) return obj[key];

      return obj;
    }

    /**
     * Retrieve an audio buffer.
     * @param {String} id - Object identifier.
     * @returns {Promise} - Returns the loaded audio buffer.
     */

  }, {
    key: 'getAudioBuffer',
    value: function getAudioBuffer(id) {
      return this.audioBuffers[id];
    }
  }]);
  return Loader;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Loader);

exports.default = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvYWRlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwibG9nIiwiZGVmYXVsdFZpZXdUZW1wbGF0ZSIsImRlZmF1bHRWaWV3Q29udGVudCIsImxvYWRpbmciLCJMb2FkZXJWaWV3IiwiJHByb2dyZXNzQmFyIiwiJGVsIiwicXVlcnlTZWxlY3RvciIsInBlcmNlbnQiLCJjb250ZW50Iiwic2hvd1Byb2dyZXNzIiwic3R5bGUiLCJ3aWR0aCIsImdldElkRnJvbUZpbGVQYXRoIiwiZmlsZVBhdGgiLCJmaWxlTmFtZSIsInNwbGl0IiwicG9wIiwiTG9hZGVyIiwiZGVmYXVsdHMiLCJhc3NldHNEb21haW4iLCJmaWxlcyIsImF1ZGlvV3JhcFRhaWwiLCJ2aWV3Q3RvciIsInZpZXdQcmlvcml0eSIsIl9kZWZhdWx0Vmlld1RlbXBsYXRlIiwiX2RlZmF1bHRWaWV3Q29udGVudCIsImNvbmZpZ3VyZSIsImJ1ZmZlcnMiLCJhdWRpb0J1ZmZlcnMiLCJkYXRhIiwidmlld0NvbnRlbnQiLCJvcHRpb25zIiwidmlldyIsImNyZWF0ZVZpZXciLCJoYXNTdGFydGVkIiwiaW5pdCIsInNob3ciLCJfbG9hZEZpbGVzIiwiaGlkZSIsImZpbGVQYXRocyIsImZpbGVEZXNjcmlwdGlvbnMiLCJmaWxlRGVzY3IiLCJpZCIsInVuZGVmaW5lZCIsImRlc2NyIiwicGF0aCIsInB1c2giLCJrZXkiLCJsb2FkZWRPYmplY3RzIiwiZm9yRWFjaCIsIm9iaiIsImkiLCJBdWRpb0J1ZmZlciIsInRyaWdnZXJSZWFkeSIsInByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiQXJyYXkiLCJpc0FycmF5IiwiZmlsZSIsIl9hcHBlbmRGaWxlRGVzY3JpcHRpb24iLCJtYXAiLCJsZW5ndGgiLCJsb2FkZXIiLCJzZXRBdWRpb0NvbnRleHQiLCJvblByb2dyZXNzIiwicHJvZ3Jlc3NQZXJGaWxlIiwicHJvZ3Jlc3NDYWxsYmFjayIsImUiLCJpbmRleCIsInZhbHVlIiwidG90YWxQcm9ncmVzcyIsInJlZHVjZSIsInByZXYiLCJjdXJyZW50IiwibG9hZCIsIndyYXBBcm91bmRFeHRlbnRpb24iLCJ0aGVuIiwiX3BvcHVsYXRlRGF0YSIsInJlYWR5IiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJpbkJ1ZmZlciIsIndyYXBBcm91bmRFeHRlbnNpb24iLCJzYW1wbGVSYXRlIiwib3V0QnVmZmVyIiwiY3JlYXRlQnVmZmVyIiwibnVtYmVyT2ZDaGFubmVscyIsImFycmF5Q2hEYXRhIiwiYXJyYXlPdXRDaERhdGEiLCJjaGFubmVsIiwiZ2V0Q2hhbm5lbERhdGEiLCJzYW1wbGUiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsZ0JBQW5CO0FBQ0EsSUFBTUMsTUFBTSxxQkFBTSw0QkFBTixDQUFaOztBQUVBLElBQU1DLDZTQUFOOztBQWNBLElBQU1DLHFCQUFxQjtBQUN6QkMsV0FBUztBQURnQixDQUEzQjs7QUFLQTs7Ozs7O0FBTUE7Ozs7Ozs7OztJQVFNQyxVOzs7Ozs7Ozs7OytCQUNPO0FBQ1Q7QUFDQSxXQUFLQyxZQUFMLEdBQW9CLEtBQUtDLEdBQUwsQ0FBU0MsYUFBVCxDQUF1QixlQUF2QixDQUFwQjtBQUNEOzs7K0JBRVVDLE8sRUFBUztBQUNsQixVQUFJLEtBQUtDLE9BQUwsQ0FBYUMsWUFBakIsRUFDRSxLQUFLTCxZQUFMLENBQWtCTSxLQUFsQixDQUF3QkMsS0FBeEIsR0FBbUNKLE9BQW5DO0FBQ0g7Ozs7O0FBR0gsU0FBU0ssaUJBQVQsQ0FBMkJDLFFBQTNCLEVBQXFDO0FBQ25DLE1BQU1DLFdBQVdELFNBQVNFLEtBQVQsQ0FBZSxHQUFmLEVBQW9CQyxHQUFwQixFQUFqQjtBQUNBLFNBQU9GLFNBQVNDLEtBQVQsQ0FBZSxHQUFmLEVBQW9CLENBQXBCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7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OztBQUN2QixVQUFNTyxNQUFNLEtBQUtyQixJQUFMLENBQVVhLEVBQVYsQ0FBWjs7QUFFQSxVQUFJUSxPQUFPSCxHQUFYLEVBQ0UsT0FBT0csSUFBSUgsR0FBSixDQUFQOztBQUVGLGFBQU9HLEdBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7bUNBS2VSLEUsRUFBSTtBQUNqQixhQUFPLEtBQUtkLFlBQUwsQ0FBa0JjLEVBQWxCLENBQVA7QUFDRDs7Ozs7QUFHSCx5QkFBZW9ELFFBQWYsQ0FBd0JoRyxVQUF4QixFQUFvQ21CLE1BQXBDOztrQkFFZUEsTSIsImZpbGUiOiJMb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgeyBTdXBlckxvYWRlciB9IGZyb20gJ3dhdmVzLWxvYWRlcnMnO1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL3ZpZXdzL1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmxvYWRlcic7XG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3JrczpzZXJ2aWNlczpsb2FkZXInKTtcblxuY29uc3QgZGVmYXVsdFZpZXdUZW1wbGF0ZSA9IGBcbjxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcCBmbGV4LW1pZGRsZVwiPlxuICA8cD48JT0gbG9hZGluZyAlPjwvcD5cbjwvZGl2PlxuPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gIDwlIGlmIChzaG93UHJvZ3Jlc3MpIHsgJT5cbiAgPGRpdiBjbGFzcz1cInByb2dyZXNzLXdyYXBcIj5cbiAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCI+PC9kaXY+XG4gIDwvZGl2PlxuICA8JSB9ICU+XG48L2Rpdj5cbjxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbVwiPjwvZGl2PmA7XG5cblxuY29uc3QgZGVmYXVsdFZpZXdDb250ZW50ID0ge1xuICBsb2FkaW5nOiAnTG9hZGluZyBzb3VuZHPigKYnLFxufTtcblxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHZpZXcgb2YgdGhlIGBsb2FkZXJgIHNlcnZpY2UuXG4gKlxuICogQGludGVyZmFjZSBBYnN0cmFjdExvYWRlclZpZXdcbiAqIEBleHRlbmRzIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gKi9cbi8qKlxuICogTWV0aG9kIGNhbGxlZCB3aGVuIGEgbmV3IGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50bHkgbG9hZGVkIGFzc2V0c1xuICogaXMgcmVjZWl2ZWQuXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSBBYnN0cmFjdExvYWRlclZpZXcub25Qcm9ncmVzc1xuICogQHBhcmFtIHtOdW1iZXJ9IHBlcmNlbnQgLSBUaGUgcHVyY2VudGFnZSBvZiBsb2FkZWQgYXNzZXRzLlxuICovXG5jbGFzcyBMb2FkZXJWaWV3IGV4dGVuZHMgU2VnbWVudGVkVmlldyB7XG4gIG9uUmVuZGVyKCkge1xuICAgIHN1cGVyLm9uUmVuZGVyKCk7XG4gICAgdGhpcy4kcHJvZ3Jlc3NCYXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcucHJvZ3Jlc3MtYmFyJyk7XG4gIH1cblxuICBvblByb2dyZXNzKHBlcmNlbnQpIHtcbiAgICBpZiAodGhpcy5jb250ZW50LnNob3dQcm9ncmVzcylcbiAgICAgIHRoaXMuJHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gYCR7cGVyY2VudH0lYDtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRJZEZyb21GaWxlUGF0aChmaWxlUGF0aCkge1xuICBjb25zdCBmaWxlTmFtZSA9IGZpbGVQYXRoLnNwbGl0KCcvJykucG9wKCk7XG4gIHJldHVybiBmaWxlTmFtZS5zcGxpdCgnLicpWzBdO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ2xvYWRlcidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byBwcmVsb2FkIGZpbGVzIGFuZCBzdG9yZSB0aGVtIGludG8gYnVmZmVyc1xuICogYmVmb3JlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGV4cGVyaWVuY2UuIEF1ZGlvIGZpbGVzIHdpbGwgYmUgY29udmVydGVkIGFuZFxuICogc3RvcmVkIGludG8gQXVkaW9CdWZmZXIgb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBvcHRpb25zLmFzc2V0c0RvbWFpbiAtIFByZWZpeCBjb25jYXRlbmF0ZWQgdG8gYWxsXG4gKiAgZ2l2ZW4gcGF0aHMuXG4gKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IG9wdGlvbnMuZmlsZXMgLSBMaXN0IG9mIGZpbGVzIHRvIGxvYWQuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNob3dQcm9ncmVzcz10cnVlXSAtIERpc3BsYXkgdGhlIHByb2dyZXNzIGJhclxuICogIGluIHRoZSB2aWV3LlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyByZXF1aXJlIGFuZCBjb25maWd1cmUgdGhlIGxvYWRlciBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3IsXG4gKiAvLyB0aGUgZmlsZXMgdG8gbG9hZCBjYW4gYmUgZGVmaW5lZCBhcyBhbiBvYmplY3Qgd2l0aCBpZGVudGlmaWVyc1xuICogdGhpcy5sb2FkZXIgPSB0aGlzLnJlcXVpcmUoJ2xvYWRlcicsIHsgZmlsZXM6IHtcbiAqICAga2ljazogJ3NvdW5kcy9raWNrXzQ0a0h6Lm1wMycsXG4gKiAgIHNuYXJlOiAnc291bmRzLzgwOHNuYXJlLm1wMydcbiAqIH19KTtcbiAqXG4gKiAvLyAuLi4gb3IgYXMgYSBncm91cCBvZiBvYmpldHMgYXNzb2NpYXRpbmcgZGlmZmVyZW50IGZpbGVzIHRvIGRpZmZlcmVudCBrZXlzXG4gKiB0aGlzLmxvYWRlciA9IHRoaXMucmVxdWlyZSgnbG9hZGVyJywgeyBmaWxlczoge1xuICogICBsYXRpbjoge1xuICogICAgIGF1ZGlvOiAnbG9vcHMvc2hlaWxhLWUtcmFzcGJlcnJ5Lm1wMycsXG4gKiAgICAgc2VnbWVudHM6ICdsb29wcy9zaGVpbGEtZS1yYXNwYmVycnktbWFya2Vycy5qc29uJyxcbiAqICAgfSxcbiAqICAgamF6ejoge1xuICogICAgIGF1ZGlvOiAnbG9vcHMvbnVzc2JhdW0tc2h1ZmZsZS5tcDMnLFxuICogICAgIHNlZ21lbnRzOiAnbG9vcHMvbnVzc2JhdW0tc2h1ZmZsZS1tYXJrZXJzLmpzb24nLFxuICogICB9LFxuICogfX0pO1xuICpcbiAqIC8vIC4uLiB3aGVuIGRlZmluaW5nIHRoZSBmaWxlcyB0byBsb2FkIGFzIGEgc2ltcGxlIGFycmF5LFxuICogLy8gdGhlIGlkZW50aWZpZXJzIGFyZSBkZXJpdmVkIGFzIHRoZSBmaWxlIG5hbWVzIHdpdGhvdXQgcGF0aCBhbmQgZXh0ZW5zaW9uXG4gKiB0aGlzLmxvYWRlciA9IHRoaXMucmVxdWlyZSgnbG9hZGVyJywgeyBmaWxlczogW1xuICogICAnc291bmRzL2RydW1zL2tpY2subXAzJyxcbiAqICAgJ3NvdW5kcy9kcnVtcy9zbmFyZS5tcDMnXG4gKiBdfSk7XG4gKlxuICogLy8gdGhlIGxvYWRlZCBvYmplY3RzIGNhbiBiZSByZXRyaWV2ZWQgYWNjb3JkaW5nIHRvIHRoZWlyIGRlZmluaXRpb25cbiAqIGNvbnN0IGtpY2tCdWZmZXIgPSB0aGlzLmxvYWRlci5nZXQoJ2tpY2snKTtcbiAqIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5sb2FkZXIuZ2V0KCdqYXp6JywgJ2F1ZGlvJyk7XG4gKiBjb25zdCBzZWdtZW50QXJyYXkgPSB0aGlzLmxvYWRlci5nZXQoJ2phenonLCAnc2VnbWVudHMnKTtcbiAqXG4gKiAvLyAuLi4gYXVkaW8gYnVmZmVycyBhbiBiZSByZXRyaWV2ZWQgdGhyb3VnaCB0aGVpciBpZGVudGlmaWVyXG4gKiBjb25zdCBzbmFyZUJ1ZmZlciA9IHRoaXMubG9hZGVyLmdldEF1ZGlvQnVmZmVyKCdzbmFyZScpO1xuICogY29uc3QgamF6ekJ1ZmZlciA9IHRoaXMubG9hZGVyLmdldEF1ZGlvQnVmZmVyKCdqYXp6Jyk7XG4gKlxuICogLy8gLi4uIHRoZSBidWZmZXJzIHByb3BlcnR5IGNvbnRhaW5zIGFuIGFycmF5IG9mIGFsbCBsb2FkZWQgb2JqZWN0c1xuICogLy8gaW4gdGhlIG9yZGVyIG9mIHRoZWlyIGRlZmluaXRpb25cbiAqIGNvbnN0IGtpY2tCdWZmZXIgPSB0aGlzLmxvYWRlci5idWZmZXJzWzBdO1xuICogY29uc3Qgc25hcmVCdWZmZXIgPSB0aGlzLmxvYWRlci5idWZmZXJzWzFdO1xuICovXG5jbGFzcyBMb2FkZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGFzc2V0c0RvbWFpbjogJycsXG4gICAgICBzaG93UHJvZ3Jlc3M6IHRydWUsXG4gICAgICBmaWxlczogW10sXG4gICAgICBhdWRpb1dyYXBUYWlsOiAwLFxuICAgICAgdmlld0N0b3I6IExvYWRlclZpZXcsXG4gICAgICB2aWV3UHJpb3JpdHk6IDQsXG4gICAgfTtcblxuICAgIHRoaXMuX2RlZmF1bHRWaWV3VGVtcGxhdGUgPSBkZWZhdWx0Vmlld1RlbXBsYXRlO1xuICAgIHRoaXMuX2RlZmF1bHRWaWV3Q29udGVudCA9IGRlZmF1bHRWaWV3Q29udGVudDtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0KCkge1xuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgYWxsIGxvYWRlZCBidWZmZXJzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5idWZmZXJzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBsb2FkZWQgYXVkaW8gYnVmZmVycyBjcmVhdGVkIGZyb20gdGhlIGxvYWRlZCBhdWRpbyBmaWxlcy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuYXVkaW9CdWZmZXJzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBEYXRhIHN0cnVjdHVyZSBjb3JyZXBvbmRpbmcgdG8gdGhlIHN0cnVjdHVyZSBvZiByZXF1ZXN0ZWQgZmlsZXMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRhdGEgPSB7fTtcblxuICAgIC8vIHByZXBhcmUgdmlld1xuICAgIHRoaXMudmlld0NvbnRlbnQuc2hvd1Byb2dyZXNzID0gdGhpcy5vcHRpb25zLnNob3dQcm9ncmVzcztcbiAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG4gICAgLy8gcHJlbG9hZCBmaWxlcyAobXVzdCBiZSBjYWxsZWQgYWZ0ZXIgc2hvdylcbiAgICB0aGlzLl9sb2FkRmlsZXModGhpcy5vcHRpb25zLmZpbGVzLCB0aGlzLnZpZXcsIHRydWUpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9hcHBlbmRGaWxlRGVzY3JpcHRpb24oZmlsZVBhdGhzLCBmaWxlRGVzY3JpcHRpb25zLCBmaWxlRGVzY3IsIGlkID0gdW5kZWZpbmVkKSB7XG4gICAgbGV0IGRlc2NyID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKHR5cGVvZiBmaWxlRGVzY3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvKipcbiAgICAgICAqIGZpbGVEZXNjciA9IHtcbiAgICAgICAqICAgbXktc291bmQtaWQ6ICdhc3NldHMvYXVkaW8tZmlsZS1uYW1lLndhdidcbiAgICAgICAqIH1cbiAgICAgICAqIC8vIGJlY29tZXNcbiAgICAgICAqIHtcbiAgICAgICAqICAgbXktc291bmQtaWQ6IDxBdWRpb0J1ZmZlcj5cbiAgICAgICAqIH1cbiAgICAgICAqIC4uLiBvclxuICAgICAgICogZmlsZURlc2NyID0gJ2Fzc2V0cy9hdWRpby1maWxlLW5hbWUud2F2J1xuICAgICAgICogLy8gYmVjb21lc1xuICAgICAgICoge1xuICAgICAgICogICBhdWRpby1maWxlLW5hbWU6IDxBdWRpb0J1ZmZlcj5cbiAgICAgICAqIH1cbiAgICAgICAqL1xuICAgICAgY29uc3QgcGF0aCA9IGZpbGVEZXNjcjtcblxuICAgICAgaWYgKCFpZClcbiAgICAgICAgaWQgPSBnZXRJZEZyb21GaWxlUGF0aChwYXRoKTtcblxuICAgICAgY29uc3QgZGVzY3IgPSB7IGlkLCBwYXRoIH07XG4gICAgICBmaWxlUGF0aHMucHVzaChwYXRoKTtcbiAgICAgIGZpbGVEZXNjcmlwdGlvbnMucHVzaChkZXNjcik7XG5cbiAgICB9IGVsc2UgaWYgKGlkICYmIHR5cGVvZiBmaWxlRGVzY3IgPT09ICdvYmplY3QnKSB7XG4gICAgICAvKipcbiAgICAgICAqIGZpbGVEZXNjciA9IHtcbiAgICAgICAqICAgbXktc291bmQtaWQ6IHtcbiAgICAgICAqICAgICBhdWRpbzogJ2Fzc2V0cy9hdWRpby1maWxlLW5hbWUud2F2JyxcbiAgICAgICAqICAgICBzZWdtZW50YXRpb246ICdhc3NldHMvZGVzY3JpcHRvci1maWxlLW5hbWUuanNvbiddXG4gICAgICAgKiB9XG4gICAgICAgKiAvLyBiZWNvbWVzXG4gICAgICAgKiB7XG4gICAgICAgKiAgIG15LXNvdW5kLWlkOiB7XG4gICAgICAgKiAgICAgYXVkaW86IDxBdWRpb0J1ZmZlcj4sXG4gICAgICAgKiAgICAgc2VnbWVudGF0aW9uOiBbPHNlZ21lbnRzPl1cbiAgICAgICAqICAgfVxuICAgICAgICogfVxuICAgICAgICovXG4gICAgICBmb3IgKGxldCBrZXkgaW4gZmlsZURlc2NyKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBmaWxlRGVzY3Jba2V5XTtcblxuICAgICAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY29uc3QgZGVzY3IgPSB7IGlkLCBrZXksIHBhdGggfTtcbiAgICAgICAgICBmaWxlUGF0aHMucHVzaChwYXRoKTtcbiAgICAgICAgICBmaWxlRGVzY3JpcHRpb25zLnB1c2goZGVzY3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBvcHVsYXRlIHRoZSBgYXVkaW9CdWZmZXJzYCBhbmQgYGRhdGFgIGF0dHJpYnV0ZSBhY2NvcmRpbmcgdG8gdGhlIGxvYWRlclxuICAgKiByZXNwb25zZSBhbmQgdGhlIGdpdmVuIGZpbGUgZGVzY3JpcHRpb25zLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3BvcHVsYXRlRGF0YShsb2FkZWRPYmplY3RzLCBmaWxlRGVzY3JpcHRpb25zKSB7XG4gICAgbG9hZGVkT2JqZWN0cy5mb3JFYWNoKChvYmosIGkpID0+IHtcbiAgICAgIGNvbnN0IGRlc2NyID0gZmlsZURlc2NyaXB0aW9uc1tpXTtcbiAgICAgIGNvbnN0IGlkID0gZGVzY3IuaWQ7XG4gICAgICBsZXQga2V5ID0gZGVzY3Iua2V5O1xuXG4gICAgICB0aGlzLmJ1ZmZlcnMucHVzaChvYmopO1xuXG4gICAgICBpZiAob2JqIGluc3RhbmNlb2YgQXVkaW9CdWZmZXIpXG4gICAgICAgIHRoaXMuYXVkaW9CdWZmZXJzW2lkXSA9IG9iajtcblxuICAgICAgaWYgKGtleSkge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YVtpZF07XG5cbiAgICAgICAgaWYoIWRhdGEpXG4gICAgICAgICAgdGhpcy5kYXRhW2lkXSA9IGRhdGEgPSB7fTtcblxuICAgICAgICBkYXRhW2tleV0gPSBvYmo7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRhdGFbaWRdID0gb2JqO1xuICAgICAgfVxuXG4gICAgICBsb2codGhpcy5kYXRhW2lkXSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2xvYWRGaWxlcyhmaWxlcywgdmlldyA9IG51bGwsIHRyaWdnZXJSZWFkeSA9IGZhbHNlKSB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCBmaWxlUGF0aHMgPSBbXTtcbiAgICAgIGNvbnN0IGZpbGVEZXNjcmlwdGlvbnMgPSBbXTtcblxuICAgICAgLy8gcHJlcGFyZSB0aGUgZmlsZXMgZGVzY3JpcHRpb25zXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShmaWxlcykpIHtcbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiBmaWxlcylcbiAgICAgICAgICB0aGlzLl9hcHBlbmRGaWxlRGVzY3JpcHRpb24oZmlsZVBhdGhzLCBmaWxlRGVzY3JpcHRpb25zLCBmaWxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAobGV0IGlkIGluIGZpbGVzKVxuICAgICAgICAgIHRoaXMuX2FwcGVuZEZpbGVEZXNjcmlwdGlvbihmaWxlUGF0aHMsIGZpbGVEZXNjcmlwdGlvbnMsIGZpbGVzW2lkXSwgaWQpO1xuICAgICAgfVxuXG4gICAgICBmaWxlUGF0aHMgPSBmaWxlUGF0aHMubWFwKChwYXRoKSA9PiB0aGlzLm9wdGlvbnMuYXNzZXRzRG9tYWluICsgcGF0aCk7XG4gICAgICBsb2coZmlsZVBhdGhzKTtcblxuICAgICAgLy8gbG9hZCBmaWxlc1xuICAgICAgaWYgKGZpbGVQYXRocy5sZW5ndGggPiAwICYmIGZpbGVEZXNjcmlwdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBsb2FkZXIgPSBuZXcgU3VwZXJMb2FkZXIoKTtcbiAgICAgICAgbG9hZGVyLnNldEF1ZGlvQ29udGV4dChhdWRpb0NvbnRleHQpO1xuXG4gICAgICAgIGlmICh2aWV3ICYmIHZpZXcub25Qcm9ncmVzcykge1xuICAgICAgICAgIGNvbnN0IHByb2dyZXNzUGVyRmlsZSA9IGZpbGVQYXRocy5tYXAoKCkgPT4gMCk7IC8vIHRyYWNrIGZpbGVzIGxvYWRpbmcgcHJvZ3Jlc3NcblxuICAgICAgICAgIGxvYWRlci5wcm9ncmVzc0NhbGxiYWNrID0gKGUpID0+IHtcbiAgICAgICAgICAgIHByb2dyZXNzUGVyRmlsZVtlLmluZGV4XSA9IGUudmFsdWU7XG5cbiAgICAgICAgICAgIGxldCB0b3RhbFByb2dyZXNzID0gcHJvZ3Jlc3NQZXJGaWxlLnJlZHVjZSgocHJldiwgY3VycmVudCkgPT4gcHJldiArIGN1cnJlbnQsIDApO1xuICAgICAgICAgICAgdG90YWxQcm9ncmVzcyAvPSBwcm9ncmVzc1BlckZpbGUubGVuZ3RoO1xuXG4gICAgICAgICAgICB2aWV3Lm9uUHJvZ3Jlc3ModG90YWxQcm9ncmVzcyAqIDEwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGxvYWRlclxuICAgICAgICAgIC5sb2FkKGZpbGVQYXRocywgeyB3cmFwQXJvdW5kRXh0ZW50aW9uOiB0aGlzLm9wdGlvbnMuYXVkaW9XcmFwVGFpbCB9KVxuICAgICAgICAgIC50aGVuKChsb2FkZWRPYmplY3RzKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9wb3B1bGF0ZURhdGEobG9hZGVkT2JqZWN0cywgZmlsZURlc2NyaXB0aW9ucyk7XG5cbiAgICAgICAgICAgIGlmICh0cmlnZ2VyUmVhZHkpXG4gICAgICAgICAgICAgIHRoaXMucmVhZHkoKTtcblxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHJpZ2dlclJlYWR5KVxuICAgICAgICAgIHRoaXMucmVhZHkoKTtcblxuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiB3cmFwQXJvdW5kLCBjb3B5IHRoZSBiZWdpbmluZyBpbnB1dCBidWZmZXIgdG8gdGhlIGVuZCBvZiBhbiBvdXRwdXQgYnVmZmVyXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7YXJyYXlidWZmZXJ9IGluQnVmZmVyIHthcnJheWJ1ZmZlcn0gLSBUaGUgaW5wdXQgYnVmZmVyXG4gICAqIEByZXR1cm5zIHthcnJheWJ1ZmZlcn0gLSBUaGUgcHJvY2Vzc2VkIGJ1ZmZlciAod2l0aCBmcmFtZSBjb3BpZWQgZnJvbSB0aGUgYmVnaW5pbmcgdG8gdGhlIGVuZClcbiAgICovXG4gIF93cmFwQXJvdW5kKGluQnVmZmVyKSB7XG4gICAgdmFyIGxlbmd0aCA9IGluQnVmZmVyLmxlbmd0aCArIHRoaXMub3B0aW9ucy53cmFwQXJvdW5kRXh0ZW5zaW9uICogaW5CdWZmZXIuc2FtcGxlUmF0ZTtcblxuICAgIHZhciBvdXRCdWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKGluQnVmZmVyLm51bWJlck9mQ2hhbm5lbHMsIGxlbmd0aCwgaW5CdWZmZXIuc2FtcGxlUmF0ZSk7XG4gICAgdmFyIGFycmF5Q2hEYXRhLCBhcnJheU91dENoRGF0YTtcblxuICAgIGZvciAodmFyIGNoYW5uZWwgPSAwOyBjaGFubmVsIDwgaW5CdWZmZXIubnVtYmVyT2ZDaGFubmVsczsgY2hhbm5lbCsrKSB7XG4gICAgICBhcnJheUNoRGF0YSA9IGluQnVmZmVyLmdldENoYW5uZWxEYXRhKGNoYW5uZWwpO1xuICAgICAgYXJyYXlPdXRDaERhdGEgPSBvdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoY2hhbm5lbCk7XG5cbiAgICAgIGFycmF5T3V0Q2hEYXRhLmZvckVhY2goZnVuY3Rpb24oc2FtcGxlLCBpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCBpbkJ1ZmZlci5sZW5ndGgpIGFycmF5T3V0Q2hEYXRhW2luZGV4XSA9IGFycmF5Q2hEYXRhW2luZGV4XTtcbiAgICAgICAgZWxzZSBhcnJheU91dENoRGF0YVtpbmRleF0gPSBhcnJheUNoRGF0YVtpbmRleCAtIGluQnVmZmVyLmxlbmd0aF07XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0QnVmZmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgYSBkZWZpbmVkIHNldCBvZiBmaWxlcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGZpbGVzIC0gRGVmaW5pdGlvbiBvZiBmaWxlcyB0byBsb2FkIChzYW1lIGFzIHJlcXVpcmUpLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gLSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIGFsbCBmaWxlcyBhcmUgbG9hZGVkLlxuICAgKi9cbiAgbG9hZChmaWxlcykge1xuICAgIHJldHVybiB0aGlzLl9sb2FkRmlsZXMoZmlsZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGEgbG9hZGVkIG9iamVjdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gT2JqZWN0IG9yIGdyb3VwIGlkZW50aWZpZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgLSBNZW1iZXIga2V5IGluIGdyb3VwLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gLSBSZXR1cm5zIHRoZSBsb2FkZWQgb2JqZWN0LlxuICAgKi9cbiAgZ2V0KGlkLCBrZXkgPSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBvYmogPSB0aGlzLmRhdGFbaWRdO1xuXG4gICAgaWYgKG9iaiAmJiBrZXkpXG4gICAgICByZXR1cm4gb2JqW2tleV07XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFuIGF1ZGlvIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gT2JqZWN0IGlkZW50aWZpZXIuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSAtIFJldHVybnMgdGhlIGxvYWRlZCBhdWRpbyBidWZmZXIuXG4gICAqL1xuICBnZXRBdWRpb0J1ZmZlcihpZCkge1xuICAgIHJldHVybiB0aGlzLmF1ZGlvQnVmZmVyc1tpZF07XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgTG9hZGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hZGVyO1xuIl19