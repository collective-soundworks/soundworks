'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _nodeAudioSlicer = require('node-audio-slicer');

var _cache = require('../utils/cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:audio-stream-manager';

/**
 * Interface for the server `'audio-stream-manager'` service.
 *
 * @warning - unstable
 *
 * This service allows to stream audio buffers to the client during the experience
 * (not preloaded). Input audio files are segmented by the server upon startup and
 * sent to the clients upon request. Service only accepts .wav files at the moment.
 * Service main objective is to 1) enable synced streaming between clients (not precise
 * if based on mediaElementSources), and 2) provide an equivalent to the mediaElementSource
 * object (streaming as a Web Audio API node) that could be plugged to any other node in Safari
 * (bypassing e.g. gain or analyzer nodes when plugged to mediaElementSource).
 *
 * __*The service should be used with its [client-side counterpart]{@link module:soundworks/client.AudioStreamManager}*__
 *
 * @param {Object} options
 * @param {Array<String>} options.audioFiles - list of paths towards would-be-streamable audio files.
 * @param {Bool} options.compress - Generate .mp3 stream chunks if set to true. Keep input file extension otherwise.
 * @param {Number} options.duration - Audio chunks duration (in sec).
 * @param {Number} options.overlap - Duration of additional audio samples added to head and tail of streamed audio
 *  buffers. Paired with a fade-in fade-out mechanism on client's side, this allows to hide distortions induced by
 *  mp3 encoding of audio chunks not starting / finishing with zeroed samples.
 *
 * @memberof module:soundworks/server
 *
 * @example
 * // define list of "streamable" audio files
 * const audioFiles = [
 *   'stream/my-audio-file.wav',
 *   'stream/another-audio-file.wav',
 * ];
 *
 * // require service
 * this.audioStreamManager = this.require('audio-stream-manager', { audioFiles });
 *
 */

var AudioStreamManager = function (_Service) {
  (0, _inherits3.default)(AudioStreamManager, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instantiated manually_ */
  function AudioStreamManager() {
    (0, _classCallCheck3.default)(this, AudioStreamManager);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AudioStreamManager.__proto__ || (0, _getPrototypeOf2.default)(AudioStreamManager)).call(this, SERVICE_ID));

    console.error('[deprecated] AudioStreamManager unstable API is now deprecated - API will change in soundworks#v3.0.0, please consider updating your application');

    var defaults = {
      audioFiles: null,
      compress: true,
      duration: 4,
      overlap: 0.1,
      publicDirectory: 'public'
    };

    _this.configure(defaults);

    _this._sync = _this.require('sync');

    _this._clients = new _set2.default();
    return _this;
  }

  /**
   * Set common (sync) start time for AudioStream in sync mode.
   * The value is propagated to every connected clients and newly connected
   * clients.
   */


  (0, _createClass3.default)(AudioStreamManager, [{
    key: 'configure',


    /** @private */
    value: function configure(options) {
      (0, _get3.default)(AudioStreamManager.prototype.__proto__ || (0, _getPrototypeOf2.default)(AudioStreamManager.prototype), 'configure', this).call(this, options);
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)(AudioStreamManager.prototype.__proto__ || (0, _getPrototypeOf2.default)(AudioStreamManager.prototype), 'start', this).call(this);

      if (this.options.audioFiles === null) {
        this.ready();
      } else {
        var _options = this.options,
            audioFiles = _options.audioFiles,
            publicDirectory = _options.publicDirectory;


        this.prepareStreamChunks(audioFiles, publicDirectory, function (bufferInfos) {
          _this2.bufferInfos = bufferInfos;
          _this2.ready();
        });
      }
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      this._clients.add(client);
      this.receive(client, 'request', this._onRequest(client));
    }
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      this._clients.delete(client);
    }

    /** @private */

  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this3 = this;

      return function () {
        _this3.send(client, 'acknowlegde', _this3.bufferInfos);

        // has already started in sync mode
        if (_this3._syncStartTime !== null) _this3.send(client, 'syncStartTime', _this3._syncStartTime);
      };
    }

    /**
     * Segment audio files listed into audioFiles into chunks for streaming.
     *
     * @param {Array<String>} audioFiles - list of paths towards audio files to chunk.
     * @param {Object} callback - Function to call when slicing completed.
     */

  }, {
    key: 'prepareStreamChunks',
    value: function prepareStreamChunks(audioFiles, publicDirectory, callback) {
      var bufferInfos = {};
      // try avoid hardcore parallel processing that crashes the server
      // (ulimit issue) when lots of audioFiles to process
      var index = 0;

      var slicer = new _nodeAudioSlicer.Slicer({
        compress: this.options.compress,
        duration: this.options.duration,
        overlap: this.options.overlap
      });

      function next() {
        index += 1;

        if (index >= audioFiles.length) callback(bufferInfos);else processFile();
      }

      function processFile() {
        // const fileId = ;
        var filename = _path2.default.join(publicDirectory, audioFiles[index]);
        var fileId = _path2.default.basename(filename, '.wav');

        var cachedItem = _cache2.default.read(SERVICE_ID, fileId);
        var stats = _fs2.default.statSync(filename);
        var lastModified = stats.mtimeMs;

        if (cachedItem && lastModified === cachedItem.lastModified) {
          bufferInfos[fileId] = cachedItem.chunks;
          return next();
        }

        slicer.slice(filename, function (chunkList) {
          var chunks = chunkList.map(function (chunk) {
            chunk.name = _path2.default.relative(publicDirectory, chunk.name);
            return chunk;
          });

          console.log(SERVICE_ID, 'sliced file', filename);
          bufferInfos[fileId] = chunks;
          // cache informations
          _cache2.default.write(SERVICE_ID, fileId, { lastModified: lastModified, chunks: chunks });

          next();
        });
      }

      processFile();
    }
  }, {
    key: 'syncStartTime',
    set: function set(time) {
      var _this4 = this;

      this._syncStartTime = time;

      this._clients.forEach(function (client) {
        _this4.send(client, 'syncStartTime', _this4._syncStartTime);
      });
    }
  }]);
  return AudioStreamManager;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, AudioStreamManager);

exports.default = AudioStreamManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvU3RyZWFtTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiQXVkaW9TdHJlYW1NYW5hZ2VyIiwiY29uc29sZSIsImVycm9yIiwiZGVmYXVsdHMiLCJhdWRpb0ZpbGVzIiwiY29tcHJlc3MiLCJkdXJhdGlvbiIsIm92ZXJsYXAiLCJwdWJsaWNEaXJlY3RvcnkiLCJjb25maWd1cmUiLCJfc3luYyIsInJlcXVpcmUiLCJfY2xpZW50cyIsIm9wdGlvbnMiLCJyZWFkeSIsInByZXBhcmVTdHJlYW1DaHVua3MiLCJidWZmZXJJbmZvcyIsImNsaWVudCIsImFkZCIsInJlY2VpdmUiLCJfb25SZXF1ZXN0IiwiZGVsZXRlIiwic2VuZCIsIl9zeW5jU3RhcnRUaW1lIiwiY2FsbGJhY2siLCJpbmRleCIsInNsaWNlciIsIlNsaWNlciIsIm5leHQiLCJsZW5ndGgiLCJwcm9jZXNzRmlsZSIsImZpbGVuYW1lIiwicGF0aCIsImpvaW4iLCJmaWxlSWQiLCJiYXNlbmFtZSIsImNhY2hlZEl0ZW0iLCJjYWNoZSIsInJlYWQiLCJzdGF0cyIsImZzIiwic3RhdFN5bmMiLCJsYXN0TW9kaWZpZWQiLCJtdGltZU1zIiwiY2h1bmtzIiwic2xpY2UiLCJjaHVua0xpc3QiLCJtYXAiLCJjaHVuayIsIm5hbWUiLCJyZWxhdGl2ZSIsImxvZyIsIndyaXRlIiwidGltZSIsImZvckVhY2giLCJTZXJ2aWNlIiwic2VydmljZU1hbmFnZXIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsOEJBQW5COztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBb0NNQyxrQjs7O0FBQ0o7QUFDQSxnQ0FBYztBQUFBOztBQUFBLDhKQUNORCxVQURNOztBQUdaRSxZQUFRQyxLQUFSLENB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Q0FBYWQsUUFBYixFQUF1QixxQkFBYTtBQUNsQyxjQUFNYSxTQUFTRSxVQUFVQyxHQUFWLENBQWMsaUJBQVM7QUFDcENDLGtCQUFNQyxJQUFOLEdBQWFqQixlQUFLa0IsUUFBTCxDQUFjMUMsZUFBZCxFQUErQndDLE1BQU1DLElBQXJDLENBQWI7QUFDQSxtQkFBT0QsS0FBUDtBQUNELFdBSGMsQ0FBZjs7QUFLQS9DLGtCQUFRa0QsR0FBUixDQUFZcEQsVUFBWixFQUF3QixhQUF4QixFQUF1Q2dDLFFBQXZDO0FBQ0FmLHNCQUFZa0IsTUFBWixJQUFzQlUsTUFBdEI7QUFDQTtBQUNBUCwwQkFBTWUsS0FBTixDQUFZckQsVUFBWixFQUF3Qm1DLE1BQXhCLEVBQWdDLEVBQUVRLDBCQUFGLEVBQWdCRSxjQUFoQixFQUFoQzs7QUFFQWhCO0FBQ0QsU0FaRDtBQWFEOztBQUVERTtBQUNEOzs7c0JBM0dpQnVCLEksRUFBTTtBQUFBOztBQUN0QixXQUFLOUIsY0FBTCxHQUFzQjhCLElBQXRCOztBQUVBLFdBQUt6QyxRQUFMLENBQWMwQyxPQUFkLENBQXNCLGtCQUFVO0FBQzlCLGVBQUtoQyxJQUFMLENBQVVMLE1BQVYsRUFBa0IsZUFBbEIsRUFBbUMsT0FBS00sY0FBeEM7QUFDRCxPQUZEO0FBR0Q7OztFQWpDOEJnQyxpQjs7QUEwSWpDQyx5QkFBZUMsUUFBZixDQUF3QjFELFVBQXhCLEVBQW9DQyxrQkFBcEM7O2tCQUVlQSxrQiIsImZpbGUiOiJBdWRpb1N0cmVhbU1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHsgU2xpY2VyIH0gZnJvbSAnbm9kZS1hdWRpby1zbGljZXInO1xuaW1wb3J0IGNhY2hlIGZyb20gJy4uL3V0aWxzL2NhY2hlJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmF1ZGlvLXN0cmVhbS1tYW5hZ2VyJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdhdWRpby1zdHJlYW0tbWFuYWdlcidgIHNlcnZpY2UuXG4gKlxuICogQHdhcm5pbmcgLSB1bnN0YWJsZVxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gc3RyZWFtIGF1ZGlvIGJ1ZmZlcnMgdG8gdGhlIGNsaWVudCBkdXJpbmcgdGhlIGV4cGVyaWVuY2VcbiAqIChub3QgcHJlbG9hZGVkKS4gSW5wdXQgYXVkaW8gZmlsZXMgYXJlIHNlZ21lbnRlZCBieSB0aGUgc2VydmVyIHVwb24gc3RhcnR1cCBhbmRcbiAqIHNlbnQgdG8gdGhlIGNsaWVudHMgdXBvbiByZXF1ZXN0LiBTZXJ2aWNlIG9ubHkgYWNjZXB0cyAud2F2IGZpbGVzIGF0IHRoZSBtb21lbnQuXG4gKiBTZXJ2aWNlIG1haW4gb2JqZWN0aXZlIGlzIHRvIDEpIGVuYWJsZSBzeW5jZWQgc3RyZWFtaW5nIGJldHdlZW4gY2xpZW50cyAobm90IHByZWNpc2VcbiAqIGlmIGJhc2VkIG9uIG1lZGlhRWxlbWVudFNvdXJjZXMpLCBhbmQgMikgcHJvdmlkZSBhbiBlcXVpdmFsZW50IHRvIHRoZSBtZWRpYUVsZW1lbnRTb3VyY2VcbiAqIG9iamVjdCAoc3RyZWFtaW5nIGFzIGEgV2ViIEF1ZGlvIEFQSSBub2RlKSB0aGF0IGNvdWxkIGJlIHBsdWdnZWQgdG8gYW55IG90aGVyIG5vZGUgaW4gU2FmYXJpXG4gKiAoYnlwYXNzaW5nIGUuZy4gZ2FpbiBvciBhbmFseXplciBub2RlcyB3aGVuIHBsdWdnZWQgdG8gbWVkaWFFbGVtZW50U291cmNlKS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBzaG91bGQgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BdWRpb1N0cmVhbU1hbmFnZXJ9Kl9fXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gb3B0aW9ucy5hdWRpb0ZpbGVzIC0gbGlzdCBvZiBwYXRocyB0b3dhcmRzIHdvdWxkLWJlLXN0cmVhbWFibGUgYXVkaW8gZmlsZXMuXG4gKiBAcGFyYW0ge0Jvb2x9IG9wdGlvbnMuY29tcHJlc3MgLSBHZW5lcmF0ZSAubXAzIHN0cmVhbSBjaHVua3MgaWYgc2V0IHRvIHRydWUuIEtlZXAgaW5wdXQgZmlsZSBleHRlbnNpb24gb3RoZXJ3aXNlLlxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMuZHVyYXRpb24gLSBBdWRpbyBjaHVua3MgZHVyYXRpb24gKGluIHNlYykuXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5vdmVybGFwIC0gRHVyYXRpb24gb2YgYWRkaXRpb25hbCBhdWRpbyBzYW1wbGVzIGFkZGVkIHRvIGhlYWQgYW5kIHRhaWwgb2Ygc3RyZWFtZWQgYXVkaW9cbiAqICBidWZmZXJzLiBQYWlyZWQgd2l0aCBhIGZhZGUtaW4gZmFkZS1vdXQgbWVjaGFuaXNtIG9uIGNsaWVudCdzIHNpZGUsIHRoaXMgYWxsb3dzIHRvIGhpZGUgZGlzdG9ydGlvbnMgaW5kdWNlZCBieVxuICogIG1wMyBlbmNvZGluZyBvZiBhdWRpbyBjaHVua3Mgbm90IHN0YXJ0aW5nIC8gZmluaXNoaW5nIHdpdGggemVyb2VkIHNhbXBsZXMuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBkZWZpbmUgbGlzdCBvZiBcInN0cmVhbWFibGVcIiBhdWRpbyBmaWxlc1xuICogY29uc3QgYXVkaW9GaWxlcyA9IFtcbiAqICAgJ3N0cmVhbS9teS1hdWRpby1maWxlLndhdicsXG4gKiAgICdzdHJlYW0vYW5vdGhlci1hdWRpby1maWxlLndhdicsXG4gKiBdO1xuICpcbiAqIC8vIHJlcXVpcmUgc2VydmljZVxuICogdGhpcy5hdWRpb1N0cmVhbU1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLXN0cmVhbS1tYW5hZ2VyJywgeyBhdWRpb0ZpbGVzIH0pO1xuICpcbiAqL1xuY2xhc3MgQXVkaW9TdHJlYW1NYW5hZ2VyIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbnRpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zb2xlLmVycm9yKCdbZGVwcmVjYXRlZF0gQXVkaW9TdHJlYW1NYW5hZ2VyIHVuc3RhYmxlIEFQSSBpcyBub3cgZGVwcmVjYXRlZCAtIEFQSSB3aWxsIGNoYW5nZSBpbiBzb3VuZHdvcmtzI3YzLjAuMCwgcGxlYXNlIGNvbnNpZGVyIHVwZGF0aW5nIHlvdXIgYXBwbGljYXRpb24nKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgYXVkaW9GaWxlczogbnVsbCxcbiAgICAgIGNvbXByZXNzOiB0cnVlLFxuICAgICAgZHVyYXRpb246IDQsXG4gICAgICBvdmVybGFwOiAwLjEsXG4gICAgICBwdWJsaWNEaXJlY3Rvcnk6ICdwdWJsaWMnLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9zeW5jID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG5cbiAgICB0aGlzLl9jbGllbnRzID0gbmV3IFNldCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBjb21tb24gKHN5bmMpIHN0YXJ0IHRpbWUgZm9yIEF1ZGlvU3RyZWFtIGluIHN5bmMgbW9kZS5cbiAgICogVGhlIHZhbHVlIGlzIHByb3BhZ2F0ZWQgdG8gZXZlcnkgY29ubmVjdGVkIGNsaWVudHMgYW5kIG5ld2x5IGNvbm5lY3RlZFxuICAgKiBjbGllbnRzLlxuICAgKi9cbiAgc2V0IHN5bmNTdGFydFRpbWUodGltZSkge1xuICAgIHRoaXMuX3N5bmNTdGFydFRpbWUgPSB0aW1lO1xuXG4gICAgdGhpcy5fY2xpZW50cy5mb3JFYWNoKGNsaWVudCA9PiB7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnc3luY1N0YXJ0VGltZScsIHRoaXMuX3N5bmNTdGFydFRpbWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmF1ZGlvRmlsZXMgPT09IG51bGwpIHvCoFxuICAgICAgdGhpcy5yZWFkeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB7IGF1ZGlvRmlsZXMsIHB1YmxpY0RpcmVjdG9yeSB9ID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICB0aGlzLnByZXBhcmVTdHJlYW1DaHVua3MoYXVkaW9GaWxlcywgcHVibGljRGlyZWN0b3J5LCBidWZmZXJJbmZvcyA9PiB7XG4gICAgICAgIHRoaXMuYnVmZmVySW5mb3MgPSBidWZmZXJJbmZvcztcbiAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgdGhpcy5fY2xpZW50cy5hZGQoY2xpZW50KTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgdGhpcy5fY2xpZW50cy5kZWxldGUoY2xpZW50KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnYWNrbm93bGVnZGUnLCB0aGlzLmJ1ZmZlckluZm9zKTtcblxuICAgICAgLy8gaGFzIGFscmVhZHkgc3RhcnRlZCBpbiBzeW5jIG1vZGVcbiAgICAgIGlmICh0aGlzLl9zeW5jU3RhcnRUaW1lICE9PSBudWxsKVxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnc3luY1N0YXJ0VGltZScsIHRoaXMuX3N5bmNTdGFydFRpbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWdtZW50IGF1ZGlvIGZpbGVzIGxpc3RlZCBpbnRvIGF1ZGlvRmlsZXMgaW50byBjaHVua3MgZm9yIHN0cmVhbWluZy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBhdWRpb0ZpbGVzIC0gbGlzdCBvZiBwYXRocyB0b3dhcmRzIGF1ZGlvIGZpbGVzIHRvIGNodW5rLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byBjYWxsIHdoZW4gc2xpY2luZyBjb21wbGV0ZWQuXG4gICAqL1xuICBwcmVwYXJlU3RyZWFtQ2h1bmtzKGF1ZGlvRmlsZXMsIHB1YmxpY0RpcmVjdG9yeSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBidWZmZXJJbmZvcyA9IHt9O1xuICAgIC8vIHRyeSBhdm9pZCBoYXJkY29yZSBwYXJhbGxlbCBwcm9jZXNzaW5nIHRoYXQgY3Jhc2hlcyB0aGUgc2VydmVyXG4gICAgLy8gKHVsaW1pdCBpc3N1ZSkgd2hlbiBsb3RzIG9mIGF1ZGlvRmlsZXMgdG8gcHJvY2Vzc1xuICAgIGxldCBpbmRleCA9IDA7XG5cbiAgICBjb25zdCBzbGljZXIgPSBuZXcgU2xpY2VyKHtcbiAgICAgIGNvbXByZXNzOiB0aGlzLm9wdGlvbnMuY29tcHJlc3MsXG4gICAgICBkdXJhdGlvbjogdGhpcy5vcHRpb25zLmR1cmF0aW9uLFxuICAgICAgb3ZlcmxhcDogdGhpcy5vcHRpb25zLm92ZXJsYXBcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICBpbmRleCArPSAxO1xuXG4gICAgICBpZiAoaW5kZXggPj0gYXVkaW9GaWxlcy5sZW5ndGgpXG4gICAgICAgIGNhbGxiYWNrKGJ1ZmZlckluZm9zKTtcbiAgICAgIGVsc2VcbiAgICAgICAgcHJvY2Vzc0ZpbGUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzRmlsZSgpIHtcbiAgICAgIC8vIGNvbnN0IGZpbGVJZCA9IDtcbiAgICAgIGNvbnN0IGZpbGVuYW1lID0gcGF0aC5qb2luKHB1YmxpY0RpcmVjdG9yeSwgYXVkaW9GaWxlc1tpbmRleF0pO1xuICAgICAgY29uc3QgZmlsZUlkID0gcGF0aC5iYXNlbmFtZShmaWxlbmFtZSwgJy53YXYnKTtcblxuICAgICAgY29uc3QgY2FjaGVkSXRlbSA9IGNhY2hlLnJlYWQoU0VSVklDRV9JRCwgZmlsZUlkKTtcbiAgICAgIGNvbnN0IHN0YXRzID0gZnMuc3RhdFN5bmMoZmlsZW5hbWUpO1xuICAgICAgY29uc3QgbGFzdE1vZGlmaWVkID0gc3RhdHMubXRpbWVNcztcblxuICAgICAgaWYgKGNhY2hlZEl0ZW0gJiYgbGFzdE1vZGlmaWVkID09PSBjYWNoZWRJdGVtLmxhc3RNb2RpZmllZCkge1xuICAgICAgICBidWZmZXJJbmZvc1tmaWxlSWRdID0gY2FjaGVkSXRlbS5jaHVua3M7XG4gICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICB9XG5cbiAgICAgIHNsaWNlci5zbGljZShmaWxlbmFtZSwgY2h1bmtMaXN0ID0+IHtcbiAgICAgICAgY29uc3QgY2h1bmtzID0gY2h1bmtMaXN0Lm1hcChjaHVuayA9PiB7XG4gICAgICAgICAgY2h1bmsubmFtZSA9IHBhdGgucmVsYXRpdmUocHVibGljRGlyZWN0b3J5LCBjaHVuay5uYW1lKTtcbiAgICAgICAgICByZXR1cm4gY2h1bms7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFNFUlZJQ0VfSUQsICdzbGljZWQgZmlsZScsIGZpbGVuYW1lKTtcbiAgICAgICAgYnVmZmVySW5mb3NbZmlsZUlkXSA9IGNodW5rcztcbiAgICAgICAgLy8gY2FjaGUgaW5mb3JtYXRpb25zXG4gICAgICAgIGNhY2hlLndyaXRlKFNFUlZJQ0VfSUQsIGZpbGVJZCwgeyBsYXN0TW9kaWZpZWQsIGNodW5rcyB9KVxuXG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHByb2Nlc3NGaWxlKCk7XG4gIH1cblxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBBdWRpb1N0cmVhbU1hbmFnZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBBdWRpb1N0cmVhbU1hbmFnZXI7XG4iXX0=