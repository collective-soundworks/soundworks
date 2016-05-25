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

var _wavesLoaders = require('waves-loaders');

var _SegmentedView2 = require('../views/SegmentedView');

var _SegmentedView3 = _interopRequireDefault(_SegmentedView2);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:loader';

var LoaderView = function (_SegmentedView) {
  (0, _inherits3.default)(LoaderView, _SegmentedView);

  function LoaderView() {
    (0, _classCallCheck3.default)(this, LoaderView);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(LoaderView).apply(this, arguments));
  }

  (0, _createClass3.default)(LoaderView, [{
    key: 'onRender',
    value: function onRender() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(LoaderView.prototype), 'onRender', this).call(this);
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

function appendFileDescription(filePaths, fileDescriptions, fileDescr) {
  var id = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];

  var descr = undefined;

  if (typeof fileDescr === 'string') {
    // fileDescr = { my-sound-id: 'assets/audio-file-name.wav' } --> { my-sound-id: { audio: <AudioBuffer> } }
    // fileDescr = 'assets/audio-file-name.wav' --> { audio-file-name: { audio: <AudioBuffer> } }
    var path = fileDescr;

    if (!id) id = getIdFromFilePath(path);

    var _descr = { id: id, path: path };
    filePaths.push(path);
    fileDescriptions.push(_descr);
  } else if (id && (typeof fileDescr === 'undefined' ? 'undefined' : (0, _typeof3.default)(fileDescr)) === 'object') {
    // fileDescr = { my-sound-id: { audio: 'assets/audio-file-name.wav', segmentation: 'assets/descriptor-file-name.json'] } --> { my-sound-id: { audio: <AudioBuffer>, segmentation: [<segments>] } }
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
 * Interface of the client `'loader'` service.
 *
 * This service allow to preload files and store them into buffers
 * before the start of the experience. Audio files will be converted and
 * stored into AudioBuffer objects.
 *
 * @param {Object} options
 * @param {Array<String>} options.files - List of files to load.
 * @param {Boolean} [options.showProgress=true] - Display the progress bar in the view.
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

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Loader).call(this, SERVICE_ID, false));

    var defaults = {
      showProgress: true,
      files: [],
      audioWrapTail: 0,
      viewCtor: LoaderView,
      viewPriority: 4
    };

    _this2.configure(defaults);
    return _this2;
  }

  /** @private */


  (0, _createClass3.default)(Loader, [{
    key: 'init',
    value: function init() {
      /**
       * @private
       * List of all loaded buffers.
       */
      this.buffers = [];

      /**
      * @private
       * List of the loaded audio buffers created from the loaded audio files.
       */
      this.audioBuffers = {};

      /**
      * @private
       * Data structure correponding to the structure of requested files.
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(Loader.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      // preload files
      this._loadFiles(this.options.files, this.view, true);
      this.show();
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      (0, _get3.default)((0, _getPrototypeOf2.default)(Loader.prototype), 'stop', this).call(this);
    }

    /** @private */

  }, {
    key: '_loadFiles',
    value: function _loadFiles(files) {
      var _this3 = this;

      var view = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var signalReady = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      var promise = new _promise2.default(function (resolve, reject) {
        var filePaths = [];
        var fileDescriptions = [];

        if (Array.isArray(files)) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = (0, _getIterator3.default)(files), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var file = _step.value;

              appendFileDescription(filePaths, fileDescriptions, file);
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
            appendFileDescription(filePaths, fileDescriptions, files[id], id);
          }
        }

        if (filePaths.length > 0 && fileDescriptions.length > 0) {
          var loader = new _wavesLoaders.SuperLoader();

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

          loader.load(filePaths, { wrapAroundExtention: _this3.options.audioWrapTail }).then(function (loadedObjects) {
            // for (let i = 0; i < loadedObjects.length; i++) {
            loadedObjects.forEach(function (obj, i) {
              // const obj = loadedObjects[i];
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
            });

            if (signalReady) _this3.ready();

            resolve();
          }, function (error) {
            reject(error);
            console.error(error);
          });
        } else {
          if (signalReady) _this3.ready();

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

      var outBuffer = audioContext.createBuffer(inBuffer.numberOfChannels, length, inBuffer.sampleRate);
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
//# sourceMappingURL=data:application/json;base64,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dCB7IFN1cGVyTG9hZGVyIH0gZnJvbSAnd2F2ZXMtbG9hZGVycyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpsb2FkZXInO1xuXG5jbGFzcyBMb2FkZXJWaWV3IGV4dGVuZHMgU2VnbWVudGVkVmlldyB7XG4gIG9uUmVuZGVyKCkge1xuICAgIHN1cGVyLm9uUmVuZGVyKCk7XG4gICAgdGhpcy4kcHJvZ3Jlc3NCYXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcucHJvZ3Jlc3MtYmFyJyk7XG4gIH1cblxuICBvblByb2dyZXNzKHBlcmNlbnQpIHtcbiAgICBpZiAodGhpcy5jb250ZW50LnNob3dQcm9ncmVzcylcbiAgICAgIHRoaXMuJHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gYCR7cGVyY2VudH0lYDtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRJZEZyb21GaWxlUGF0aChmaWxlUGF0aCkge1xuICBjb25zdCBmaWxlTmFtZSA9IGZpbGVQYXRoLnNwbGl0KCcvJykucG9wKCk7XG4gIHJldHVybiBmaWxlTmFtZS5zcGxpdCgnLicpWzBdO1xufVxuXG5mdW5jdGlvbiBhcHBlbmRGaWxlRGVzY3JpcHRpb24oZmlsZVBhdGhzLCBmaWxlRGVzY3JpcHRpb25zLCBmaWxlRGVzY3IsIGlkID0gdW5kZWZpbmVkKSB7XG4gIGxldCBkZXNjciA9IHVuZGVmaW5lZDtcblxuICBpZih0eXBlb2YgZmlsZURlc2NyID09PSAnc3RyaW5nJykge1xuICAgIC8vIGZpbGVEZXNjciA9IHsgbXktc291bmQtaWQ6ICdhc3NldHMvYXVkaW8tZmlsZS1uYW1lLndhdicgfSAtLT4geyBteS1zb3VuZC1pZDogeyBhdWRpbzogPEF1ZGlvQnVmZmVyPiB9IH1cbiAgICAvLyBmaWxlRGVzY3IgPSAnYXNzZXRzL2F1ZGlvLWZpbGUtbmFtZS53YXYnIC0tPiB7IGF1ZGlvLWZpbGUtbmFtZTogeyBhdWRpbzogPEF1ZGlvQnVmZmVyPiB9IH1cbiAgICBjb25zdCBwYXRoID0gZmlsZURlc2NyO1xuXG4gICAgaWYoIWlkKVxuICAgICAgaWQgPSBnZXRJZEZyb21GaWxlUGF0aChwYXRoKTtcblxuICAgIGNvbnN0IGRlc2NyID0geyBpZCwgcGF0aCB9O1xuICAgIGZpbGVQYXRocy5wdXNoKHBhdGgpO1xuICAgIGZpbGVEZXNjcmlwdGlvbnMucHVzaChkZXNjcik7XG5cbiAgfSBlbHNlIGlmKGlkICYmIHR5cGVvZiBmaWxlRGVzY3IgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gZmlsZURlc2NyID0geyBteS1zb3VuZC1pZDogeyBhdWRpbzogJ2Fzc2V0cy9hdWRpby1maWxlLW5hbWUud2F2Jywgc2VnbWVudGF0aW9uOiAnYXNzZXRzL2Rlc2NyaXB0b3ItZmlsZS1uYW1lLmpzb24nXSB9IC0tPiB7IG15LXNvdW5kLWlkOiB7IGF1ZGlvOiA8QXVkaW9CdWZmZXI+LCBzZWdtZW50YXRpb246IFs8c2VnbWVudHM+XSB9IH1cbiAgICBmb3IobGV0IGtleSBpbiBmaWxlRGVzY3IpIHtcbiAgICAgIGNvbnN0IHBhdGggPSBmaWxlRGVzY3Jba2V5XTtcblxuICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IGRlc2NyID0geyBpZCwga2V5LCBwYXRoIH07XG4gICAgICAgIGZpbGVQYXRocy5wdXNoKHBhdGgpO1xuICAgICAgICBmaWxlRGVzY3JpcHRpb25zLnB1c2goZGVzY3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEludGVyZmFjZSBvZiB0aGUgY2xpZW50IGAnbG9hZGVyJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgYWxsb3cgdG8gcHJlbG9hZCBmaWxlcyBhbmQgc3RvcmUgdGhlbSBpbnRvIGJ1ZmZlcnNcbiAqIGJlZm9yZSB0aGUgc3RhcnQgb2YgdGhlIGV4cGVyaWVuY2UuIEF1ZGlvIGZpbGVzIHdpbGwgYmUgY29udmVydGVkIGFuZFxuICogc3RvcmVkIGludG8gQXVkaW9CdWZmZXIgb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBvcHRpb25zLmZpbGVzIC0gTGlzdCBvZiBmaWxlcyB0byBsb2FkLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93UHJvZ3Jlc3M9dHJ1ZV0gLSBEaXNwbGF5IHRoZSBwcm9ncmVzcyBiYXIgaW4gdGhlIHZpZXcuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIHJlcXVpcmUgYW5kIGNvbmZpZ3VyZSB0aGUgbG9hZGVyIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvcixcbiAqIC8vIHRoZSBmaWxlcyB0byBsb2FkIGNhbiBiZSBkZWZpbmVkIGFzIGFuIG9iamVjdCB3aXRoIGlkZW50aWZpZXJzXG4gKiB0aGlzLmxvYWRlciA9IHRoaXMucmVxdWlyZSgnbG9hZGVyJywgeyBmaWxlczoge1xuICogICBraWNrOiAnc291bmRzL2tpY2tfNDRrSHoubXAzJyxcbiAqICAgc25hcmU6ICdzb3VuZHMvODA4c25hcmUubXAzJ1xuICogfX0pO1xuICpcbiAqIC8vIC4uLiBvciBhcyBhIGdyb3VwIG9mIG9iamV0cyBhc3NvY2lhdGluZyBkaWZmZXJlbnQgZmlsZXMgdG8gZGlmZmVyZW50IGtleXNcbiAqIHRoaXMubG9hZGVyID0gdGhpcy5yZXF1aXJlKCdsb2FkZXInLCB7IGZpbGVzOiB7XG4gKiAgIGxhdGluOiB7XG4gKiAgICAgYXVkaW86ICdsb29wcy9zaGVpbGEtZS1yYXNwYmVycnkubXAzJyxcbiAqICAgICBzZWdtZW50czogJ2xvb3BzL3NoZWlsYS1lLXJhc3BiZXJyeS1tYXJrZXJzLmpzb24nLFxuICogICB9LFxuICogICBqYXp6OiB7XG4gKiAgICAgYXVkaW86ICdsb29wcy9udXNzYmF1bS1zaHVmZmxlLm1wMycsXG4gKiAgICAgc2VnbWVudHM6ICdsb29wcy9udXNzYmF1bS1zaHVmZmxlLW1hcmtlcnMuanNvbicsXG4gKiAgIH0sXG4gKiB9fSk7XG4gKlxuICogLy8gLi4uIHdoZW4gZGVmaW5pbmcgdGhlIGZpbGVzIHRvIGxvYWQgYXMgYSBzaW1wbGUgYXJyYXksXG4gKiAvLyB0aGUgaWRlbnRpZmllcnMgYXJlIGRlcml2ZWQgYXMgdGhlIGZpbGUgbmFtZXMgd2l0aG91dCBwYXRoIGFuZCBleHRlbnNpb25cbiAqIHRoaXMubG9hZGVyID0gdGhpcy5yZXF1aXJlKCdsb2FkZXInLCB7IGZpbGVzOiBbXG4gKiAgICdzb3VuZHMvZHJ1bXMva2ljay5tcDMnLFxuICogICAnc291bmRzL2RydW1zL3NuYXJlLm1wMydcbiAqIF19KTtcbiAqXG4gKiAvLyB0aGUgbG9hZGVkIG9iamVjdHMgY2FuIGJlIHJldHJpZXZlZCBhY2NvcmRpbmcgdG8gdGhlaXIgZGVmaW5pdGlvblxuICogY29uc3Qga2lja0J1ZmZlciA9IHRoaXMubG9hZGVyLmdldCgna2ljaycpO1xuICogY29uc3QgYXVkaW9CdWZmZXIgPSB0aGlzLmxvYWRlci5nZXQoJ2phenonLCAnYXVkaW8nKTtcbiAqIGNvbnN0IHNlZ21lbnRBcnJheSA9IHRoaXMubG9hZGVyLmdldCgnamF6eicsICdzZWdtZW50cycpO1xuICpcbiAqIC8vIC4uLiBhdWRpbyBidWZmZXJzIGFuIGJlIHJldHJpZXZlZCB0aHJvdWdoIHRoZWlyIGlkZW50aWZpZXJcbiAqIGNvbnN0IHNuYXJlQnVmZmVyID0gdGhpcy5sb2FkZXIuZ2V0QXVkaW9CdWZmZXIoJ3NuYXJlJyk7XG4gKiBjb25zdCBqYXp6QnVmZmVyID0gdGhpcy5sb2FkZXIuZ2V0QXVkaW9CdWZmZXIoJ2phenonKTtcbiAqXG4gKiAvLyAuLi4gdGhlIGJ1ZmZlcnMgcHJvcGVydHkgY29udGFpbnMgYW4gYXJyYXkgb2YgYWxsIGxvYWRlZCBvYmplY3RzXG4gKiAvLyBpbiB0aGUgb3JkZXIgb2YgdGhlaXIgZGVmaW5pdGlvblxuICogY29uc3Qga2lja0J1ZmZlciA9IHRoaXMubG9hZGVyLmJ1ZmZlcnNbMF07XG4gKiBjb25zdCBzbmFyZUJ1ZmZlciA9IHRoaXMubG9hZGVyLmJ1ZmZlcnNbMV07XG4gKi9cbmNsYXNzIExvYWRlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIGZhbHNlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgc2hvd1Byb2dyZXNzOiB0cnVlLFxuICAgICAgZmlsZXM6IFtdLFxuICAgICAgYXVkaW9XcmFwVGFpbDogMCxcbiAgICAgIHZpZXdDdG9yOiBMb2FkZXJWaWV3LFxuICAgICAgdmlld1ByaW9yaXR5OiA0LFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIExpc3Qgb2YgYWxsIGxvYWRlZCBidWZmZXJzLlxuICAgICAqL1xuICAgIHRoaXMuYnVmZmVycyA9IFtdO1xuXG4gICAgLyoqXG4gICAgKiBAcHJpdmF0ZVxuICAgICAqIExpc3Qgb2YgdGhlIGxvYWRlZCBhdWRpbyBidWZmZXJzIGNyZWF0ZWQgZnJvbSB0aGUgbG9hZGVkIGF1ZGlvIGZpbGVzLlxuICAgICAqL1xuICAgIHRoaXMuYXVkaW9CdWZmZXJzID0ge307XG5cbiAgICAvKipcbiAgICAqIEBwcml2YXRlXG4gICAgICogRGF0YSBzdHJ1Y3R1cmUgY29ycmVwb25kaW5nIHRvIHRoZSBzdHJ1Y3R1cmUgb2YgcmVxdWVzdGVkIGZpbGVzLlxuICAgICAqL1xuICAgIHRoaXMuZGF0YSA9IHt9O1xuXG4gICAgLy8gcHJlcGFyZSB2aWV3XG4gICAgdGhpcy52aWV3Q29udGVudC5zaG93UHJvZ3Jlc3MgPSB0aGlzLm9wdGlvbnMuc2hvd1Byb2dyZXNzO1xuICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICAvLyBwcmVsb2FkIGZpbGVzXG4gICAgdGhpcy5fbG9hZEZpbGVzKHRoaXMub3B0aW9ucy5maWxlcywgdGhpcy52aWV3LCB0cnVlKTtcbiAgICB0aGlzLnNob3coKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfbG9hZEZpbGVzKGZpbGVzLCB2aWV3ID0gbnVsbCwgc2lnbmFsUmVhZHkgPSBmYWxzZSkge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aHMgPSBbXTtcbiAgICAgIGNvbnN0IGZpbGVEZXNjcmlwdGlvbnMgPSBbXTtcblxuICAgICAgaWYoQXJyYXkuaXNBcnJheShmaWxlcykpIHtcbiAgICAgICAgZm9yKGxldCBmaWxlIG9mIGZpbGVzKVxuICAgICAgICAgIGFwcGVuZEZpbGVEZXNjcmlwdGlvbihmaWxlUGF0aHMsIGZpbGVEZXNjcmlwdGlvbnMsIGZpbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgaWQgaW4gZmlsZXMpXG4gICAgICAgICAgYXBwZW5kRmlsZURlc2NyaXB0aW9uKGZpbGVQYXRocywgZmlsZURlc2NyaXB0aW9ucywgZmlsZXNbaWRdLCBpZCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlUGF0aHMubGVuZ3RoID4gMCAmJiBmaWxlRGVzY3JpcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgbG9hZGVyID0gbmV3IFN1cGVyTG9hZGVyKCk7XG5cbiAgICAgICAgaWYgKHZpZXcgJiYgdmlldy5vblByb2dyZXNzKSB7XG4gICAgICAgICAgY29uc3QgcHJvZ3Jlc3NQZXJGaWxlID0gZmlsZVBhdGhzLm1hcCgoKSA9PiAwKTsgLy8gdHJhY2sgZmlsZXMgbG9hZGluZyBwcm9ncmVzc1xuXG4gICAgICAgICAgbG9hZGVyLnByb2dyZXNzQ2FsbGJhY2sgPSAoZSkgPT4ge1xuICAgICAgICAgICAgcHJvZ3Jlc3NQZXJGaWxlW2UuaW5kZXhdID0gZS52YWx1ZTtcblxuICAgICAgICAgICAgbGV0IHRvdGFsUHJvZ3Jlc3MgPSBwcm9ncmVzc1BlckZpbGUucmVkdWNlKChwcmV2LCBjdXJyZW50KSA9PiBwcmV2ICsgY3VycmVudCwgMCk7XG4gICAgICAgICAgICB0b3RhbFByb2dyZXNzIC89IHByb2dyZXNzUGVyRmlsZS5sZW5ndGg7XG5cbiAgICAgICAgICAgIHZpZXcub25Qcm9ncmVzcyh0b3RhbFByb2dyZXNzICogMTAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgbG9hZGVyLmxvYWQoZmlsZVBhdGhzLCB7IHdyYXBBcm91bmRFeHRlbnRpb246IHRoaXMub3B0aW9ucy5hdWRpb1dyYXBUYWlsIH0pXG4gICAgICAgICAgLnRoZW4oKGxvYWRlZE9iamVjdHMpID0+IHtcbiAgICAgICAgICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgbG9hZGVkT2JqZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbG9hZGVkT2JqZWN0cy5mb3JFYWNoKChvYmosIGkpID0+IHtcbiAgICAgICAgICAgICAgLy8gY29uc3Qgb2JqID0gbG9hZGVkT2JqZWN0c1tpXTtcbiAgICAgICAgICAgICAgY29uc3QgZGVzY3IgPSBmaWxlRGVzY3JpcHRpb25zW2ldO1xuICAgICAgICAgICAgICBjb25zdCBpZCA9IGRlc2NyLmlkO1xuICAgICAgICAgICAgICBsZXQga2V5ID0gZGVzY3Iua2V5O1xuXG4gICAgICAgICAgICAgIHRoaXMuYnVmZmVycy5wdXNoKG9iaik7XG5cbiAgICAgICAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIEF1ZGlvQnVmZmVyKVxuICAgICAgICAgICAgICAgIHRoaXMuYXVkaW9CdWZmZXJzW2lkXSA9IG9iajtcblxuICAgICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmRhdGFbaWRdO1xuXG4gICAgICAgICAgICAgICAgaWYoIWRhdGEpXG4gICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaWRdID0gZGF0YSA9IHt9O1xuXG4gICAgICAgICAgICAgICAgZGF0YVtrZXldID0gb2JqO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpZF0gPSBvYmo7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoc2lnbmFsUmVhZHkpXG4gICAgICAgICAgICAgIHRoaXMucmVhZHkoKTtcblxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNpZ25hbFJlYWR5KVxuICAgICAgICAgIHRoaXMucmVhZHkoKTtcblxuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiB3cmFwQXJvdW5kLCBjb3B5IHRoZSBiZWdpbmluZyBpbnB1dCBidWZmZXIgdG8gdGhlIGVuZCBvZiBhbiBvdXRwdXQgYnVmZmVyXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7YXJyYXlidWZmZXJ9IGluQnVmZmVyIHthcnJheWJ1ZmZlcn0gLSBUaGUgaW5wdXQgYnVmZmVyXG4gICAqIEByZXR1cm5zIHthcnJheWJ1ZmZlcn0gLSBUaGUgcHJvY2Vzc2VkIGJ1ZmZlciAod2l0aCBmcmFtZSBjb3BpZWQgZnJvbSB0aGUgYmVnaW5pbmcgdG8gdGhlIGVuZClcbiAgICovXG4gIF93cmFwQXJvdW5kKGluQnVmZmVyKSB7XG4gICAgdmFyIGxlbmd0aCA9IGluQnVmZmVyLmxlbmd0aCArIHRoaXMub3B0aW9ucy53cmFwQXJvdW5kRXh0ZW5zaW9uICogaW5CdWZmZXIuc2FtcGxlUmF0ZTtcblxuICAgIHZhciBvdXRCdWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKGluQnVmZmVyLm51bWJlck9mQ2hhbm5lbHMsIGxlbmd0aCwgaW5CdWZmZXIuc2FtcGxlUmF0ZSk7XG4gICAgdmFyIGFycmF5Q2hEYXRhLCBhcnJheU91dENoRGF0YTtcblxuICAgIGZvciAodmFyIGNoYW5uZWwgPSAwOyBjaGFubmVsIDwgaW5CdWZmZXIubnVtYmVyT2ZDaGFubmVsczsgY2hhbm5lbCsrKSB7XG4gICAgICBhcnJheUNoRGF0YSA9IGluQnVmZmVyLmdldENoYW5uZWxEYXRhKGNoYW5uZWwpO1xuICAgICAgYXJyYXlPdXRDaERhdGEgPSBvdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoY2hhbm5lbCk7XG5cbiAgICAgIGFycmF5T3V0Q2hEYXRhLmZvckVhY2goZnVuY3Rpb24oc2FtcGxlLCBpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCBpbkJ1ZmZlci5sZW5ndGgpIGFycmF5T3V0Q2hEYXRhW2luZGV4XSA9IGFycmF5Q2hEYXRhW2luZGV4XTtcbiAgICAgICAgZWxzZSBhcnJheU91dENoRGF0YVtpbmRleF0gPSBhcnJheUNoRGF0YVtpbmRleCAtIGluQnVmZmVyLmxlbmd0aF07XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0QnVmZmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgYSBkZWZpbmVkIHNldCBvZiBmaWxlcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGZpbGVzIC0gRGVmaW5pdGlvbiBvZiBmaWxlcyB0byBsb2FkIChzYW1lIGFzIHJlcXVpcmUpLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gLSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIGFsbCBmaWxlcyBhcmUgbG9hZGVkLlxuICAgKi9cbiAgbG9hZChmaWxlcykge1xuICAgIHJldHVybiB0aGlzLl9sb2FkRmlsZXMoZmlsZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGEgbG9hZGVkIG9iamVjdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gT2JqZWN0IG9yIGdyb3VwIGlkZW50aWZpZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgLSBNZW1iZXIga2V5IGluIGdyb3VwLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gLSBSZXR1cm5zIHRoZSBsb2FkZWQgb2JqZWN0LlxuICAgKi9cbiAgZ2V0KGlkLCBrZXkgPSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBvYmogPSB0aGlzLmRhdGFbaWRdO1xuXG4gICAgaWYgKG9iaiAmJiBrZXkpXG4gICAgICByZXR1cm4gb2JqW2tleV07XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFuIGF1ZGlvIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gT2JqZWN0IGlkZW50aWZpZXIuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSAtIFJldHVybnMgdGhlIGxvYWRlZCBhdWRpbyBidWZmZXIuXG4gICAqL1xuICBnZXRBdWRpb0J1ZmZlcihpZCkge1xuICAgIHJldHVybiB0aGlzLmF1ZGlvQnVmZmVyc1tpZF07XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgTG9hZGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hZGVyO1xuIl19