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
      var id = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];

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

      var view = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var triggerReady = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

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
            (function () {
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
            })();
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
      var key = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvYWRlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwibG9nIiwiZGVmYXVsdFZpZXdUZW1wbGF0ZSIsImRlZmF1bHRWaWV3Q29udGVudCIsImxvYWRpbmciLCJMb2FkZXJWaWV3IiwiJHByb2dyZXNzQmFyIiwiJGVsIiwicXVlcnlTZWxlY3RvciIsInBlcmNlbnQiLCJjb250ZW50Iiwic2hvd1Byb2dyZXNzIiwic3R5bGUiLCJ3aWR0aCIsImdldElkRnJvbUZpbGVQYXRoIiwiZmlsZVBhdGgiLCJmaWxlTmFtZSIsInNwbGl0IiwicG9wIiwiTG9hZGVyIiwiZGVmYXVsdHMiLCJhc3NldHNEb21haW4iLCJmaWxlcyIsImF1ZGlvV3JhcFRhaWwiLCJ2aWV3Q3RvciIsInZpZXdQcmlvcml0eSIsIl9kZWZhdWx0Vmlld1RlbXBsYXRlIiwiX2RlZmF1bHRWaWV3Q29udGVudCIsImNvbmZpZ3VyZSIsImJ1ZmZlcnMiLCJhdWRpb0J1ZmZlcnMiLCJkYXRhIiwidmlld0NvbnRlbnQiLCJvcHRpb25zIiwidmlldyIsImNyZWF0ZVZpZXciLCJoYXNTdGFydGVkIiwiaW5pdCIsInNob3ciLCJfbG9hZEZpbGVzIiwiaGlkZSIsImZpbGVQYXRocyIsImZpbGVEZXNjcmlwdGlvbnMiLCJmaWxlRGVzY3IiLCJpZCIsInVuZGVmaW5lZCIsImRlc2NyIiwicGF0aCIsInB1c2giLCJrZXkiLCJsb2FkZWRPYmplY3RzIiwiZm9yRWFjaCIsIm9iaiIsImkiLCJBdWRpb0J1ZmZlciIsInRyaWdnZXJSZWFkeSIsInByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiQXJyYXkiLCJpc0FycmF5IiwiZmlsZSIsIl9hcHBlbmRGaWxlRGVzY3JpcHRpb24iLCJtYXAiLCJsZW5ndGgiLCJsb2FkZXIiLCJzZXRBdWRpb0NvbnRleHQiLCJvblByb2dyZXNzIiwicHJvZ3Jlc3NQZXJGaWxlIiwicHJvZ3Jlc3NDYWxsYmFjayIsImUiLCJpbmRleCIsInZhbHVlIiwidG90YWxQcm9ncmVzcyIsInJlZHVjZSIsInByZXYiLCJjdXJyZW50IiwibG9hZCIsIndyYXBBcm91bmRFeHRlbnRpb24iLCJ0aGVuIiwiX3BvcHVsYXRlRGF0YSIsInJlYWR5IiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJpbkJ1ZmZlciIsIndyYXBBcm91bmRFeHRlbnNpb24iLCJzYW1wbGVSYXRlIiwib3V0QnVmZmVyIiwiY3JlYXRlQnVmZmVyIiwibnVtYmVyT2ZDaGFubmVscyIsImFycmF5Q2hEYXRhIiwiYXJyYXlPdXRDaERhdGEiLCJjaGFubmVsIiwiZ2V0Q2hhbm5lbERhdGEiLCJzYW1wbGUiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsZ0JBQW5CO0FBQ0EsSUFBTUMsTUFBTSxxQkFBTSw0QkFBTixDQUFaOztBQUVBLElBQU1DLDZTQUFOOztBQWNBLElBQU1DLHFCQUFxQjtBQUN6QkMsV0FBUztBQURnQixDQUEzQjs7QUFLQTs7Ozs7O0FBTUE7Ozs7Ozs7OztJQVFNQyxVOzs7Ozs7Ozs7OytCQUNPO0FBQ1Q7QUFDQSxXQUFLQyxZQUFMLEdBQW9CLEtBQUtDLEdBQUwsQ0FBU0MsYUFBVCxDQUF1QixlQUF2QixDQUFwQjtBQUNEOzs7K0JBRVVDLE8sRUFBUztBQUNsQixVQUFJLEtBQUtDLE9BQUwsQ0FBYUMsWUFBakIsRUFDRSxLQUFLTCxZQUFMLENBQWtCTSxLQUFsQixDQUF3QkMsS0FBeEIsR0FBbUNKLE9BQW5DO0FBQ0g7Ozs7O0FBR0gsU0FBU0ssaUJBQVQsQ0FBMkJDLFFBQTNCLEVBQXFDO0FBQ25DLE1BQU1DLFdBQVdELFNBQVNFLEtBQVQsQ0FBZSxHQUFmLEVBQW9CQyxHQUFwQixFQUFqQjtBQUNBLFNBQU9GLFNBQVNDLEtBQVQsQ0FBZSxHQUFmLEVBQW9CLENBQXBCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7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Qix5REFBWEosU0FBVzs7QUFDdkIsVUFBTU8sTUFBTSxLQUFLckIsSUFBTCxDQUFVYSxFQUFWLENBQVo7O0FBRUEsVUFBSVEsT0FBT0gsR0FBWCxFQUNFLE9BQU9HLElBQUlILEdBQUosQ0FBUDs7QUFFRixhQUFPRyxHQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O21DQUtlUixFLEVBQUk7QUFDakIsYUFBTyxLQUFLZCxZQUFMLENBQWtCYyxFQUFsQixDQUFQO0FBQ0Q7Ozs7O0FBR0gseUJBQWVvRCxRQUFmLENBQXdCaEcsVUFBeEIsRUFBb0NtQixNQUFwQzs7a0JBRWVBLE0iLCJmaWxlIjoiTG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IHsgU3VwZXJMb2FkZXIgfSBmcm9tICd3YXZlcy1sb2FkZXJzJztcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpsb2FkZXInO1xuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6c2VydmljZXM6bG9hZGVyJyk7XG5cbmNvbnN0IGRlZmF1bHRWaWV3VGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwic2VjdGlvbi10b3AgZmxleC1taWRkbGVcIj5cbiAgPHA+PCU9IGxvYWRpbmcgJT48L3A+XG48L2Rpdj5cbjxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPlxuICA8JSBpZiAoc2hvd1Byb2dyZXNzKSB7ICU+XG4gIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy13cmFwXCI+XG4gICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiPjwvZGl2PlxuICA8L2Rpdj5cbiAgPCUgfSAlPlxuPC9kaXY+XG48ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b21cIj48L2Rpdj5gO1xuXG5cbmNvbnN0IGRlZmF1bHRWaWV3Q29udGVudCA9IHtcbiAgbG9hZGluZzogJ0xvYWRpbmcgc291bmRz4oCmJyxcbn07XG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSB2aWV3IG9mIHRoZSBgbG9hZGVyYCBzZXJ2aWNlLlxuICpcbiAqIEBpbnRlcmZhY2UgQWJzdHJhY3RMb2FkZXJWaWV3XG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICovXG4vKipcbiAqIE1ldGhvZCBjYWxsZWQgd2hlbiBhIG5ldyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudGx5IGxvYWRlZCBhc3NldHNcbiAqIGlzIHJlY2VpdmVkLlxuICpcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgQWJzdHJhY3RMb2FkZXJWaWV3Lm9uUHJvZ3Jlc3NcbiAqIEBwYXJhbSB7TnVtYmVyfSBwZXJjZW50IC0gVGhlIHB1cmNlbnRhZ2Ugb2YgbG9hZGVkIGFzc2V0cy5cbiAqL1xuY2xhc3MgTG9hZGVyVmlldyBleHRlbmRzIFNlZ21lbnRlZFZpZXcge1xuICBvblJlbmRlcigpIHtcbiAgICBzdXBlci5vblJlbmRlcigpO1xuICAgIHRoaXMuJHByb2dyZXNzQmFyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLnByb2dyZXNzLWJhcicpO1xuICB9XG5cbiAgb25Qcm9ncmVzcyhwZXJjZW50KSB7XG4gICAgaWYgKHRoaXMuY29udGVudC5zaG93UHJvZ3Jlc3MpXG4gICAgICB0aGlzLiRwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IGAke3BlcmNlbnR9JWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0SWRGcm9tRmlsZVBhdGgoZmlsZVBhdGgpIHtcbiAgY29uc3QgZmlsZU5hbWUgPSBmaWxlUGF0aC5zcGxpdCgnLycpLnBvcCgpO1xuICByZXR1cm4gZmlsZU5hbWUuc3BsaXQoJy4nKVswXTtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdsb2FkZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gcHJlbG9hZCBmaWxlcyBhbmQgc3RvcmUgdGhlbSBpbnRvIGJ1ZmZlcnNcbiAqIGJlZm9yZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBleHBlcmllbmNlLiBBdWRpbyBmaWxlcyB3aWxsIGJlIGNvbnZlcnRlZCBhbmRcbiAqIHN0b3JlZCBpbnRvIEF1ZGlvQnVmZmVyIG9iamVjdHMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gb3B0aW9ucy5hc3NldHNEb21haW4gLSBQcmVmaXggY29uY2F0ZW5hdGVkIHRvIGFsbFxuICogIGdpdmVuIHBhdGhzLlxuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBvcHRpb25zLmZpbGVzIC0gTGlzdCBvZiBmaWxlcyB0byBsb2FkLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93UHJvZ3Jlc3M9dHJ1ZV0gLSBEaXNwbGF5IHRoZSBwcm9ncmVzcyBiYXJcbiAqICBpbiB0aGUgdmlldy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gcmVxdWlyZSBhbmQgY29uZmlndXJlIHRoZSBsb2FkZXIgaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yLFxuICogLy8gdGhlIGZpbGVzIHRvIGxvYWQgY2FuIGJlIGRlZmluZWQgYXMgYW4gb2JqZWN0IHdpdGggaWRlbnRpZmllcnNcbiAqIHRoaXMubG9hZGVyID0gdGhpcy5yZXF1aXJlKCdsb2FkZXInLCB7IGZpbGVzOiB7XG4gKiAgIGtpY2s6ICdzb3VuZHMva2lja180NGtIei5tcDMnLFxuICogICBzbmFyZTogJ3NvdW5kcy84MDhzbmFyZS5tcDMnXG4gKiB9fSk7XG4gKlxuICogLy8gLi4uIG9yIGFzIGEgZ3JvdXAgb2Ygb2JqZXRzIGFzc29jaWF0aW5nIGRpZmZlcmVudCBmaWxlcyB0byBkaWZmZXJlbnQga2V5c1xuICogdGhpcy5sb2FkZXIgPSB0aGlzLnJlcXVpcmUoJ2xvYWRlcicsIHsgZmlsZXM6IHtcbiAqICAgbGF0aW46IHtcbiAqICAgICBhdWRpbzogJ2xvb3BzL3NoZWlsYS1lLXJhc3BiZXJyeS5tcDMnLFxuICogICAgIHNlZ21lbnRzOiAnbG9vcHMvc2hlaWxhLWUtcmFzcGJlcnJ5LW1hcmtlcnMuanNvbicsXG4gKiAgIH0sXG4gKiAgIGpheno6IHtcbiAqICAgICBhdWRpbzogJ2xvb3BzL251c3NiYXVtLXNodWZmbGUubXAzJyxcbiAqICAgICBzZWdtZW50czogJ2xvb3BzL251c3NiYXVtLXNodWZmbGUtbWFya2Vycy5qc29uJyxcbiAqICAgfSxcbiAqIH19KTtcbiAqXG4gKiAvLyAuLi4gd2hlbiBkZWZpbmluZyB0aGUgZmlsZXMgdG8gbG9hZCBhcyBhIHNpbXBsZSBhcnJheSxcbiAqIC8vIHRoZSBpZGVudGlmaWVycyBhcmUgZGVyaXZlZCBhcyB0aGUgZmlsZSBuYW1lcyB3aXRob3V0IHBhdGggYW5kIGV4dGVuc2lvblxuICogdGhpcy5sb2FkZXIgPSB0aGlzLnJlcXVpcmUoJ2xvYWRlcicsIHsgZmlsZXM6IFtcbiAqICAgJ3NvdW5kcy9kcnVtcy9raWNrLm1wMycsXG4gKiAgICdzb3VuZHMvZHJ1bXMvc25hcmUubXAzJ1xuICogXX0pO1xuICpcbiAqIC8vIHRoZSBsb2FkZWQgb2JqZWN0cyBjYW4gYmUgcmV0cmlldmVkIGFjY29yZGluZyB0byB0aGVpciBkZWZpbml0aW9uXG4gKiBjb25zdCBraWNrQnVmZmVyID0gdGhpcy5sb2FkZXIuZ2V0KCdraWNrJyk7XG4gKiBjb25zdCBhdWRpb0J1ZmZlciA9IHRoaXMubG9hZGVyLmdldCgnamF6eicsICdhdWRpbycpO1xuICogY29uc3Qgc2VnbWVudEFycmF5ID0gdGhpcy5sb2FkZXIuZ2V0KCdqYXp6JywgJ3NlZ21lbnRzJyk7XG4gKlxuICogLy8gLi4uIGF1ZGlvIGJ1ZmZlcnMgYW4gYmUgcmV0cmlldmVkIHRocm91Z2ggdGhlaXIgaWRlbnRpZmllclxuICogY29uc3Qgc25hcmVCdWZmZXIgPSB0aGlzLmxvYWRlci5nZXRBdWRpb0J1ZmZlcignc25hcmUnKTtcbiAqIGNvbnN0IGphenpCdWZmZXIgPSB0aGlzLmxvYWRlci5nZXRBdWRpb0J1ZmZlcignamF6eicpO1xuICpcbiAqIC8vIC4uLiB0aGUgYnVmZmVycyBwcm9wZXJ0eSBjb250YWlucyBhbiBhcnJheSBvZiBhbGwgbG9hZGVkIG9iamVjdHNcbiAqIC8vIGluIHRoZSBvcmRlciBvZiB0aGVpciBkZWZpbml0aW9uXG4gKiBjb25zdCBraWNrQnVmZmVyID0gdGhpcy5sb2FkZXIuYnVmZmVyc1swXTtcbiAqIGNvbnN0IHNuYXJlQnVmZmVyID0gdGhpcy5sb2FkZXIuYnVmZmVyc1sxXTtcbiAqL1xuY2xhc3MgTG9hZGVyIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBhc3NldHNEb21haW46ICcnLFxuICAgICAgc2hvd1Byb2dyZXNzOiB0cnVlLFxuICAgICAgZmlsZXM6IFtdLFxuICAgICAgYXVkaW9XcmFwVGFpbDogMCxcbiAgICAgIHZpZXdDdG9yOiBMb2FkZXJWaWV3LFxuICAgICAgdmlld1ByaW9yaXR5OiA0LFxuICAgIH07XG5cbiAgICB0aGlzLl9kZWZhdWx0Vmlld1RlbXBsYXRlID0gZGVmYXVsdFZpZXdUZW1wbGF0ZTtcbiAgICB0aGlzLl9kZWZhdWx0Vmlld0NvbnRlbnQgPSBkZWZhdWx0Vmlld0NvbnRlbnQ7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIGFsbCBsb2FkZWQgYnVmZmVycy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuYnVmZmVycyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgbG9hZGVkIGF1ZGlvIGJ1ZmZlcnMgY3JlYXRlZCBmcm9tIHRoZSBsb2FkZWQgYXVkaW8gZmlsZXMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmF1ZGlvQnVmZmVycyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogRGF0YSBzdHJ1Y3R1cmUgY29ycmVwb25kaW5nIHRvIHRoZSBzdHJ1Y3R1cmUgb2YgcmVxdWVzdGVkIGZpbGVzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kYXRhID0ge307XG5cbiAgICAvLyBwcmVwYXJlIHZpZXdcbiAgICB0aGlzLnZpZXdDb250ZW50LnNob3dQcm9ncmVzcyA9IHRoaXMub3B0aW9ucy5zaG93UHJvZ3Jlc3M7XG4gICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2hvdygpO1xuICAgIC8vIHByZWxvYWQgZmlsZXMgKG11c3QgYmUgY2FsbGVkIGFmdGVyIHNob3cpXG4gICAgdGhpcy5fbG9hZEZpbGVzKHRoaXMub3B0aW9ucy5maWxlcywgdGhpcy52aWV3LCB0cnVlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfYXBwZW5kRmlsZURlc2NyaXB0aW9uKGZpbGVQYXRocywgZmlsZURlc2NyaXB0aW9ucywgZmlsZURlc2NyLCBpZCA9IHVuZGVmaW5lZCkge1xuICAgIGxldCBkZXNjciA9IHVuZGVmaW5lZDtcblxuICAgIGlmICh0eXBlb2YgZmlsZURlc2NyID09PSAnc3RyaW5nJykge1xuICAgICAgLyoqXG4gICAgICAgKiBmaWxlRGVzY3IgPSB7XG4gICAgICAgKiAgIG15LXNvdW5kLWlkOiAnYXNzZXRzL2F1ZGlvLWZpbGUtbmFtZS53YXYnXG4gICAgICAgKiB9XG4gICAgICAgKiAvLyBiZWNvbWVzXG4gICAgICAgKiB7XG4gICAgICAgKiAgIG15LXNvdW5kLWlkOiA8QXVkaW9CdWZmZXI+XG4gICAgICAgKiB9XG4gICAgICAgKiAuLi4gb3JcbiAgICAgICAqIGZpbGVEZXNjciA9ICdhc3NldHMvYXVkaW8tZmlsZS1uYW1lLndhdidcbiAgICAgICAqIC8vIGJlY29tZXNcbiAgICAgICAqIHtcbiAgICAgICAqICAgYXVkaW8tZmlsZS1uYW1lOiA8QXVkaW9CdWZmZXI+XG4gICAgICAgKiB9XG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHBhdGggPSBmaWxlRGVzY3I7XG5cbiAgICAgIGlmICghaWQpXG4gICAgICAgIGlkID0gZ2V0SWRGcm9tRmlsZVBhdGgocGF0aCk7XG5cbiAgICAgIGNvbnN0IGRlc2NyID0geyBpZCwgcGF0aCB9O1xuICAgICAgZmlsZVBhdGhzLnB1c2gocGF0aCk7XG4gICAgICBmaWxlRGVzY3JpcHRpb25zLnB1c2goZGVzY3IpO1xuXG4gICAgfSBlbHNlIGlmIChpZCAmJiB0eXBlb2YgZmlsZURlc2NyID09PSAnb2JqZWN0Jykge1xuICAgICAgLyoqXG4gICAgICAgKiBmaWxlRGVzY3IgPSB7XG4gICAgICAgKiAgIG15LXNvdW5kLWlkOiB7XG4gICAgICAgKiAgICAgYXVkaW86ICdhc3NldHMvYXVkaW8tZmlsZS1uYW1lLndhdicsXG4gICAgICAgKiAgICAgc2VnbWVudGF0aW9uOiAnYXNzZXRzL2Rlc2NyaXB0b3ItZmlsZS1uYW1lLmpzb24nXVxuICAgICAgICogfVxuICAgICAgICogLy8gYmVjb21lc1xuICAgICAgICoge1xuICAgICAgICogICBteS1zb3VuZC1pZDoge1xuICAgICAgICogICAgIGF1ZGlvOiA8QXVkaW9CdWZmZXI+LFxuICAgICAgICogICAgIHNlZ21lbnRhdGlvbjogWzxzZWdtZW50cz5dXG4gICAgICAgKiAgIH1cbiAgICAgICAqIH1cbiAgICAgICAqL1xuICAgICAgZm9yIChsZXQga2V5IGluIGZpbGVEZXNjcikge1xuICAgICAgICBjb25zdCBwYXRoID0gZmlsZURlc2NyW2tleV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNvbnN0IGRlc2NyID0geyBpZCwga2V5LCBwYXRoIH07XG4gICAgICAgICAgZmlsZVBhdGhzLnB1c2gocGF0aCk7XG4gICAgICAgICAgZmlsZURlc2NyaXB0aW9ucy5wdXNoKGRlc2NyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQb3B1bGF0ZSB0aGUgYGF1ZGlvQnVmZmVyc2AgYW5kIGBkYXRhYCBhdHRyaWJ1dGUgYWNjb3JkaW5nIHRvIHRoZSBsb2FkZXJcbiAgICogcmVzcG9uc2UgYW5kIHRoZSBnaXZlbiBmaWxlIGRlc2NyaXB0aW9ucy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9wb3B1bGF0ZURhdGEobG9hZGVkT2JqZWN0cywgZmlsZURlc2NyaXB0aW9ucykge1xuICAgIGxvYWRlZE9iamVjdHMuZm9yRWFjaCgob2JqLCBpKSA9PiB7XG4gICAgICBjb25zdCBkZXNjciA9IGZpbGVEZXNjcmlwdGlvbnNbaV07XG4gICAgICBjb25zdCBpZCA9IGRlc2NyLmlkO1xuICAgICAgbGV0IGtleSA9IGRlc2NyLmtleTtcblxuICAgICAgdGhpcy5idWZmZXJzLnB1c2gob2JqKTtcblxuICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIEF1ZGlvQnVmZmVyKVxuICAgICAgICB0aGlzLmF1ZGlvQnVmZmVyc1tpZF0gPSBvYmo7XG5cbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmRhdGFbaWRdO1xuXG4gICAgICAgIGlmKCFkYXRhKVxuICAgICAgICAgIHRoaXMuZGF0YVtpZF0gPSBkYXRhID0ge307XG5cbiAgICAgICAgZGF0YVtrZXldID0gb2JqO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kYXRhW2lkXSA9IG9iajtcbiAgICAgIH1cblxuICAgICAgbG9nKHRoaXMuZGF0YVtpZF0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9sb2FkRmlsZXMoZmlsZXMsIHZpZXcgPSBudWxsLCB0cmlnZ2VyUmVhZHkgPSBmYWxzZSkge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgZmlsZVBhdGhzID0gW107XG4gICAgICBjb25zdCBmaWxlRGVzY3JpcHRpb25zID0gW107XG5cbiAgICAgIC8vIHByZXBhcmUgdGhlIGZpbGVzIGRlc2NyaXB0aW9uc1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZmlsZXMpKSB7XG4gICAgICAgIGZvciAobGV0IGZpbGUgb2YgZmlsZXMpXG4gICAgICAgICAgdGhpcy5fYXBwZW5kRmlsZURlc2NyaXB0aW9uKGZpbGVQYXRocywgZmlsZURlc2NyaXB0aW9ucywgZmlsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBpZCBpbiBmaWxlcylcbiAgICAgICAgICB0aGlzLl9hcHBlbmRGaWxlRGVzY3JpcHRpb24oZmlsZVBhdGhzLCBmaWxlRGVzY3JpcHRpb25zLCBmaWxlc1tpZF0sIGlkKTtcbiAgICAgIH1cblxuICAgICAgZmlsZVBhdGhzID0gZmlsZVBhdGhzLm1hcCgocGF0aCkgPT4gdGhpcy5vcHRpb25zLmFzc2V0c0RvbWFpbiArIHBhdGgpO1xuICAgICAgbG9nKGZpbGVQYXRocyk7XG5cbiAgICAgIC8vIGxvYWQgZmlsZXNcbiAgICAgIGlmIChmaWxlUGF0aHMubGVuZ3RoID4gMCAmJiBmaWxlRGVzY3JpcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgbG9hZGVyID0gbmV3IFN1cGVyTG9hZGVyKCk7XG4gICAgICAgIGxvYWRlci5zZXRBdWRpb0NvbnRleHQoYXVkaW9Db250ZXh0KTtcblxuICAgICAgICBpZiAodmlldyAmJiB2aWV3Lm9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgICBjb25zdCBwcm9ncmVzc1BlckZpbGUgPSBmaWxlUGF0aHMubWFwKCgpID0+IDApOyAvLyB0cmFjayBmaWxlcyBsb2FkaW5nIHByb2dyZXNzXG5cbiAgICAgICAgICBsb2FkZXIucHJvZ3Jlc3NDYWxsYmFjayA9IChlKSA9PiB7XG4gICAgICAgICAgICBwcm9ncmVzc1BlckZpbGVbZS5pbmRleF0gPSBlLnZhbHVlO1xuXG4gICAgICAgICAgICBsZXQgdG90YWxQcm9ncmVzcyA9IHByb2dyZXNzUGVyRmlsZS5yZWR1Y2UoKHByZXYsIGN1cnJlbnQpID0+IHByZXYgKyBjdXJyZW50LCAwKTtcbiAgICAgICAgICAgIHRvdGFsUHJvZ3Jlc3MgLz0gcHJvZ3Jlc3NQZXJGaWxlLmxlbmd0aDtcblxuICAgICAgICAgICAgdmlldy5vblByb2dyZXNzKHRvdGFsUHJvZ3Jlc3MgKiAxMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBsb2FkZXJcbiAgICAgICAgICAubG9hZChmaWxlUGF0aHMsIHsgd3JhcEFyb3VuZEV4dGVudGlvbjogdGhpcy5vcHRpb25zLmF1ZGlvV3JhcFRhaWwgfSlcbiAgICAgICAgICAudGhlbigobG9hZGVkT2JqZWN0cykgPT4ge1xuICAgICAgICAgICAgdGhpcy5fcG9wdWxhdGVEYXRhKGxvYWRlZE9iamVjdHMsIGZpbGVEZXNjcmlwdGlvbnMpO1xuXG4gICAgICAgICAgICBpZiAodHJpZ2dlclJlYWR5KVxuICAgICAgICAgICAgICB0aGlzLnJlYWR5KCk7XG5cbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRyaWdnZXJSZWFkeSlcbiAgICAgICAgICB0aGlzLnJlYWR5KCk7XG5cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogd3JhcEFyb3VuZCwgY29weSB0aGUgYmVnaW5pbmcgaW5wdXQgYnVmZmVyIHRvIHRoZSBlbmQgb2YgYW4gb3V0cHV0IGJ1ZmZlclxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge2FycmF5YnVmZmVyfSBpbkJ1ZmZlciB7YXJyYXlidWZmZXJ9IC0gVGhlIGlucHV0IGJ1ZmZlclxuICAgKiBAcmV0dXJucyB7YXJyYXlidWZmZXJ9IC0gVGhlIHByb2Nlc3NlZCBidWZmZXIgKHdpdGggZnJhbWUgY29waWVkIGZyb20gdGhlIGJlZ2luaW5nIHRvIHRoZSBlbmQpXG4gICAqL1xuICBfd3JhcEFyb3VuZChpbkJ1ZmZlcikge1xuICAgIHZhciBsZW5ndGggPSBpbkJ1ZmZlci5sZW5ndGggKyB0aGlzLm9wdGlvbnMud3JhcEFyb3VuZEV4dGVuc2lvbiAqIGluQnVmZmVyLnNhbXBsZVJhdGU7XG5cbiAgICB2YXIgb3V0QnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcihpbkJ1ZmZlci5udW1iZXJPZkNoYW5uZWxzLCBsZW5ndGgsIGluQnVmZmVyLnNhbXBsZVJhdGUpO1xuICAgIHZhciBhcnJheUNoRGF0YSwgYXJyYXlPdXRDaERhdGE7XG5cbiAgICBmb3IgKHZhciBjaGFubmVsID0gMDsgY2hhbm5lbCA8IGluQnVmZmVyLm51bWJlck9mQ2hhbm5lbHM7IGNoYW5uZWwrKykge1xuICAgICAgYXJyYXlDaERhdGEgPSBpbkJ1ZmZlci5nZXRDaGFubmVsRGF0YShjaGFubmVsKTtcbiAgICAgIGFycmF5T3V0Q2hEYXRhID0gb3V0QnVmZmVyLmdldENoYW5uZWxEYXRhKGNoYW5uZWwpO1xuXG4gICAgICBhcnJheU91dENoRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHNhbXBsZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4IDwgaW5CdWZmZXIubGVuZ3RoKSBhcnJheU91dENoRGF0YVtpbmRleF0gPSBhcnJheUNoRGF0YVtpbmRleF07XG4gICAgICAgIGVsc2UgYXJyYXlPdXRDaERhdGFbaW5kZXhdID0gYXJyYXlDaERhdGFbaW5kZXggLSBpbkJ1ZmZlci5sZW5ndGhdO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dEJ1ZmZlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGEgZGVmaW5lZCBzZXQgb2YgZmlsZXMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmaWxlcyAtIERlZmluaXRpb24gb2YgZmlsZXMgdG8gbG9hZCAoc2FtZSBhcyByZXF1aXJlKS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IC0gQSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiBhbGwgZmlsZXMgYXJlIGxvYWRlZC5cbiAgICovXG4gIGxvYWQoZmlsZXMpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9hZEZpbGVzKGZpbGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhIGxvYWRlZCBvYmplY3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIE9iamVjdCBvciBncm91cCBpZGVudGlmaWVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC0gTWVtYmVyIGtleSBpbiBncm91cC5cbiAgICogQHJldHVybnMge1Byb21pc2V9IC0gUmV0dXJucyB0aGUgbG9hZGVkIG9iamVjdC5cbiAgICovXG4gIGdldChpZCwga2V5ID0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3Qgb2JqID0gdGhpcy5kYXRhW2lkXTtcblxuICAgIGlmIChvYmogJiYga2V5KVxuICAgICAgcmV0dXJuIG9ialtrZXldO1xuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbiBhdWRpbyBidWZmZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIE9iamVjdCBpZGVudGlmaWVyLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gLSBSZXR1cm5zIHRoZSBsb2FkZWQgYXVkaW8gYnVmZmVyLlxuICAgKi9cbiAgZ2V0QXVkaW9CdWZmZXIoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5hdWRpb0J1ZmZlcnNbaWRdO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIExvYWRlcik7XG5cbmV4cG9ydCBkZWZhdWx0IExvYWRlcjtcbiJdfQ==