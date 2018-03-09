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

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _helpers = require('../../utils/helpers');

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Slicer = require('node-audio-slicer').Slicer;


var SERVICE_ID = 'service:audio-stream-manager';

/**
 * Interface for the server `'audio-stream-manager'` service.
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
 * @example
 * // define list of "streamable" audio files
 * let audioFiles = [
 *   './public/stream/my-audio-file.wav',
 *   './public/stream/another-audio-file.wav',
 * ];
 *
 * // require service
 * this.audioStreamManager = this.require('audio-stream-manager', { audioFiles });
 */

var AudioStreamManager = function (_Service) {
  (0, _inherits3.default)(AudioStreamManager, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instantiated manually_ */
  function AudioStreamManager() {
    (0, _classCallCheck3.default)(this, AudioStreamManager);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AudioStreamManager.__proto__ || (0, _getPrototypeOf2.default)(AudioStreamManager)).call(this, SERVICE_ID));

    var defaults = {
      audioFiles: null,
      compress: true,
      duration: 4,
      overlap: 0.1
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
        this.prepareStreamChunks(this.options.audioFiles, function (bufferInfos) {
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
    value: function prepareStreamChunks(audioFiles, callback) {
      var bufferInfos = [];

      var slicer = new Slicer({
        compress: this.options.compress,
        duration: this.options.duration,
        overlap: this.options.overlap
      });

      // try avoid hardcore parallel processing that crashes the server
      // (ulimit issue) when lots of audioFiles to process
      var index = 0;

      function sliceNext() {
        var item = audioFiles[index];

        slicer.slice(item, function (chunkList) {
          bufferInfos.push(chunkList);

          index += 1;

          if (index >= audioFiles.length) callback(bufferInfos);else sliceNext();
        });
      }

      sliceNext();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvU3RyZWFtTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJTbGljZXIiLCJyZXF1aXJlIiwiU0VSVklDRV9JRCIsIkF1ZGlvU3RyZWFtTWFuYWdlciIsImRlZmF1bHRzIiwiYXVkaW9GaWxlcyIsImNvbXByZXNzIiwiZHVyYXRpb24iLCJvdmVybGFwIiwiY29uZmlndXJlIiwiX3N5bmMiLCJfY2xpZW50cyIsIm9wdGlvbnMiLCJyZWFkeSIsInByZXBhcmVTdHJlYW1DaHVua3MiLCJidWZmZXJJbmZvcyIsImNsaWVudCIsImFkZCIsInJlY2VpdmUiLCJfb25SZXF1ZXN0IiwiZGVsZXRlIiwic2VuZCIsIl9zeW5jU3RhcnRUaW1lIiwiY2FsbGJhY2siLCJzbGljZXIiLCJpbmRleCIsInNsaWNlTmV4dCIsIml0ZW0iLCJzbGljZSIsInB1c2giLCJjaHVua0xpc3QiLCJsZW5ndGgiLCJ0aW1lIiwiZm9yRWFjaCIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBSEEsSUFBTUEsU0FBU0MsUUFBUSxtQkFBUixFQUE2QkQsTUFBNUM7OztBQUtBLElBQU1FLGFBQWEsOEJBQW5COztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQ01DLGtCOzs7QUFDSjtBQUNBLGdDQUFjO0FBQUE7O0FBQUEsOEpBQ05ELFVBRE07O0FBR1osUUFBTUUsV0FBVztBQUNmQyxrQkFBWSxJQURHO0FBRWZDLGdCQUFVLElBRks7QUFHZkMsZ0JBQVUsQ0FISztBQUlmQyxlQUFTO0FBSk0sS0FBakI7O0FBT0EsVUFBS0MsU0FBTCxDQUFlTCxRQUFmOztBQUVBLFVBQUtNLEtBQUwsR0FBYSxNQUFLVCxPQUFMLENBQWEsTUFBYixDQUFiOztBQUVBLFVBQUtVLFFBQUwsR0FBZ0IsbUJBQWhCO0FBZFk7QUFlYjs7QUFFRDs7Ozs7Ozs7Ozs7QUFhQTs4QkFDVUMsTyxFQUFTO0FBQ2pCLDhKQUFnQkEsT0FBaEI7QUFDRDs7QUFFRDs7Ozs0QkFDUTtBQUFBOztBQUNOOztBQUVBLFVBQUksS0FBS0EsT0FBTCxDQUFhUCxVQUFiLEtBQTRCLElBQWhDLEVBQXNDO0FBQ3BDLGFBQUtRLEtBQUw7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLQyxtQkFBTCxDQUF5QixLQUFLRixPQUFMLENBQWFQLFVBQXRDLEVBQWtELHVCQUFlO0FBQy9ELGlCQUFLVSxXQUFMLEdBQW1CQSxXQUFuQjtBQUNBLGlCQUFLRixLQUFMO0FBQ0QsU0FIRDtBQUlEO0FBQ0Y7O0FBRUQ7Ozs7NEJBQ1FHLE0sRUFBUTtBQUNkLFdBQUtMLFFBQUwsQ0FBY00sR0FBZCxDQUFrQkQsTUFBbEI7QUFDQSxXQUFLRSxPQUFMLENBQWFGLE1BQWIsRUFBcUIsU0FBckIsRUFBZ0MsS0FBS0csVUFBTCxDQUFnQkgsTUFBaEIsQ0FBaEM7QUFDRDs7OytCQUVVQSxNLEVBQVE7QUFDakIsV0FBS0wsUUFBTCxDQUFjUyxNQUFkLENBQXFCSixNQUFyQjtBQUNEOztBQUVEOzs7OytCQUNXQSxNLEVBQVE7QUFBQTs7QUFDakIsYUFBTyxZQUFNO0FBQ1gsZUFBS0ssSUFBTCxDQUFVTCxNQUFWLEVBQWtCLGFBQWxCLEVBQWlDLE9BQUtELFdBQXRDOztBQUVBO0FBQ0EsWUFBSSxPQUFLTyxjQUFMLEtBQXdCLElBQTVCLEVBQ0UsT0FBS0QsSUFBTCxDQUFVTCxNQUFWLEVBQWtCLGVBQWxCLEVBQW1DLE9BQUtNLGNBQXhDO0FBQ0gsT0FORDtBQU9EOztBQUVEOzs7Ozs7Ozs7d0NBTW9CakIsVSxFQUFZa0IsUSxFQUFVO0FBQ3hDLFVBQU1SLGNBQWMsRUFBcEI7O0FBRUEsVUFBTVMsU0FBUyxJQUFJeEIsTUFBSixDQUFXO0FBQ3hCTSxrQkFBVSxLQUFLTSxPQUFMLENBQWFOLFFBREM7QUFFeEJDLGtCQUFVLEtBQUtLLE9BQUwsQ0FBYUwsUUFGQztBQUd4QkMsaUJBQVMsS0FBS0ksT0FBTCxDQUFhSjtBQUhFLE9BQVgsQ0FBZjs7QUFNQTtBQUNBO0FBQ0EsVUFBSWlCLFFBQVEsQ0FBWjs7QUFFQSxlQUFTQyxTQUFULEdBQXFCO0FBQ25CLFlBQU1DLE9BQU90QixXQUFXb0IsS0FBWCxDQUFiOztBQUVBRCxlQUFPSSxLQUFQLENBQWFELElBQWIsRUFBbUIscUJBQWE7QUFDOUJaLHNCQUFZYyxJQUFaLENBQWlCQyxTQUFqQjs7QUFFQUwsbUJBQVMsQ0FBVDs7QUFFQSxjQUFJQSxTQUFTcEIsV0FBVzBCLE1BQXhCLEVBQ0VSLFNBQVNSLFdBQVQsRUFERixLQUdFVztBQUNILFNBVEQ7QUFVRDs7QUFFREE7QUFDRDs7O3NCQW5GaUJNLEksRUFBTTtBQUFBOztBQUN0QixXQUFLVixjQUFMLEdBQXNCVSxJQUF0Qjs7QUFFQSxXQUFLckIsUUFBTCxDQUFjc0IsT0FBZCxDQUFzQixrQkFBVTtBQUM5QixlQUFLWixJQUFMLENBQVVMLE1BQVYsRUFBa0IsZUFBbEIsRUFBbUMsT0FBS00sY0FBeEM7QUFDRCxPQUZEO0FBR0Q7Ozs7O0FBaUZILHlCQUFlWSxRQUFmLENBQXdCaEMsVUFBeEIsRUFBb0NDLGtCQUFwQzs7a0JBRWVBLGtCIiwiZmlsZSI6IkF1ZGlvU3RyZWFtTWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFNsaWNlciA9IHJlcXVpcmUoJ25vZGUtYXVkaW8tc2xpY2VyJykuU2xpY2VyO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCB7IGdldE9wdCB9IGZyb20gJy4uLy4uL3V0aWxzL2hlbHBlcnMnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6YXVkaW8tc3RyZWFtLW1hbmFnZXInO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHNlcnZlciBgJ2F1ZGlvLXN0cmVhbS1tYW5hZ2VyJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgYWxsb3dzIHRvIHN0cmVhbSBhdWRpbyBidWZmZXJzIHRvIHRoZSBjbGllbnQgZHVyaW5nIHRoZSBleHBlcmllbmNlXG4gKiAobm90IHByZWxvYWRlZCkuIElucHV0IGF1ZGlvIGZpbGVzIGFyZSBzZWdtZW50ZWQgYnkgdGhlIHNlcnZlciB1cG9uIHN0YXJ0dXAgYW5kXG4gKiBzZW50IHRvIHRoZSBjbGllbnRzIHVwb24gcmVxdWVzdC4gU2VydmljZSBvbmx5IGFjY2VwdHMgLndhdiBmaWxlcyBhdCB0aGUgbW9tZW50LlxuICogU2VydmljZSBtYWluIG9iamVjdGl2ZSBpcyB0byAxKSBlbmFibGUgc3luY2VkIHN0cmVhbWluZyBiZXR3ZWVuIGNsaWVudHMgKG5vdCBwcmVjaXNlXG4gKiBpZiBiYXNlZCBvbiBtZWRpYUVsZW1lbnRTb3VyY2VzKSwgYW5kIDIpIHByb3ZpZGUgYW4gZXF1aXZhbGVudCB0byB0aGUgbWVkaWFFbGVtZW50U291cmNlXG4gKiBvYmplY3QgKHN0cmVhbWluZyBhcyBhIFdlYiBBdWRpbyBBUEkgbm9kZSkgdGhhdCBjb3VsZCBiZSBwbHVnZ2VkIHRvIGFueSBvdGhlciBub2RlIGluIFNhZmFyaVxuICogKGJ5cGFzc2luZyBlLmcuIGdhaW4gb3IgYW5hbHl6ZXIgbm9kZXMgd2hlbiBwbHVnZ2VkIHRvIG1lZGlhRWxlbWVudFNvdXJjZSkuXG4gKlxuICogX18qVGhlIHNlcnZpY2Ugc2hvdWxkIGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQXVkaW9TdHJlYW1NYW5hZ2VyfSpfX1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IG9wdGlvbnMuYXVkaW9GaWxlcyAtIGxpc3Qgb2YgcGF0aHMgdG93YXJkcyB3b3VsZC1iZS1zdHJlYW1hYmxlIGF1ZGlvIGZpbGVzLlxuICogQHBhcmFtIHtCb29sfSBvcHRpb25zLmNvbXByZXNzIC0gR2VuZXJhdGUgLm1wMyBzdHJlYW0gY2h1bmtzIGlmIHNldCB0byB0cnVlLiBLZWVwIGlucHV0IGZpbGUgZXh0ZW5zaW9uIG90aGVyd2lzZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLmR1cmF0aW9uIC0gQXVkaW8gY2h1bmtzIGR1cmF0aW9uIChpbiBzZWMpLlxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMub3ZlcmxhcCAtIER1cmF0aW9uIG9mIGFkZGl0aW9uYWwgYXVkaW8gc2FtcGxlcyBhZGRlZCB0byBoZWFkIGFuZCB0YWlsIG9mIHN0cmVhbWVkIGF1ZGlvXG4gKiAgYnVmZmVycy4gUGFpcmVkIHdpdGggYSBmYWRlLWluIGZhZGUtb3V0IG1lY2hhbmlzbSBvbiBjbGllbnQncyBzaWRlLCB0aGlzIGFsbG93cyB0byBoaWRlIGRpc3RvcnRpb25zIGluZHVjZWQgYnlcbiAqICBtcDMgZW5jb2Rpbmcgb2YgYXVkaW8gY2h1bmtzIG5vdCBzdGFydGluZyAvIGZpbmlzaGluZyB3aXRoIHplcm9lZCBzYW1wbGVzLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBkZWZpbmUgbGlzdCBvZiBcInN0cmVhbWFibGVcIiBhdWRpbyBmaWxlc1xuICogbGV0IGF1ZGlvRmlsZXMgPSBbXG4gKiAgICcuL3B1YmxpYy9zdHJlYW0vbXktYXVkaW8tZmlsZS53YXYnLFxuICogICAnLi9wdWJsaWMvc3RyZWFtL2Fub3RoZXItYXVkaW8tZmlsZS53YXYnLFxuICogXTtcbiAqXG4gKiAvLyByZXF1aXJlIHNlcnZpY2VcbiAqIHRoaXMuYXVkaW9TdHJlYW1NYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1zdHJlYW0tbWFuYWdlcicsIHsgYXVkaW9GaWxlcyB9KTtcbiAqL1xuY2xhc3MgQXVkaW9TdHJlYW1NYW5hZ2VyIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbnRpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGF1ZGlvRmlsZXM6IG51bGwsXG4gICAgICBjb21wcmVzczogdHJ1ZSxcbiAgICAgIGR1cmF0aW9uOiA0LFxuICAgICAgb3ZlcmxhcDogMC4xLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9zeW5jID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG5cbiAgICB0aGlzLl9jbGllbnRzID0gbmV3IFNldCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBjb21tb24gKHN5bmMpIHN0YXJ0IHRpbWUgZm9yIEF1ZGlvU3RyZWFtIGluIHN5bmMgbW9kZS5cbiAgICogVGhlIHZhbHVlIGlzIHByb3BhZ2F0ZWQgdG8gZXZlcnkgY29ubmVjdGVkIGNsaWVudHMgYW5kIG5ld2x5IGNvbm5lY3RlZFxuICAgKiBjbGllbnRzLlxuICAgKi9cbiAgc2V0IHN5bmNTdGFydFRpbWUodGltZSkge1xuICAgIHRoaXMuX3N5bmNTdGFydFRpbWUgPSB0aW1lO1xuXG4gICAgdGhpcy5fY2xpZW50cy5mb3JFYWNoKGNsaWVudCA9PiB7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnc3luY1N0YXJ0VGltZScsIHRoaXMuX3N5bmNTdGFydFRpbWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmF1ZGlvRmlsZXMgPT09IG51bGwpIHvCoFxuICAgICAgdGhpcy5yZWFkeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByZXBhcmVTdHJlYW1DaHVua3ModGhpcy5vcHRpb25zLmF1ZGlvRmlsZXMsIGJ1ZmZlckluZm9zID0+IHtcbiAgICAgICAgdGhpcy5idWZmZXJJbmZvcyA9IGJ1ZmZlckluZm9zO1xuICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICB0aGlzLl9jbGllbnRzLmFkZChjbGllbnQpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICB9XG5cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICB0aGlzLl9jbGllbnRzLmRlbGV0ZShjbGllbnQpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdhY2tub3dsZWdkZScsIHRoaXMuYnVmZmVySW5mb3MpO1xuXG4gICAgICAvLyBoYXMgYWxyZWFkeSBzdGFydGVkIGluIHN5bmMgbW9kZVxuICAgICAgaWYgKHRoaXMuX3N5bmNTdGFydFRpbWUgIT09IG51bGwpXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdzeW5jU3RhcnRUaW1lJywgdGhpcy5fc3luY1N0YXJ0VGltZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlZ21lbnQgYXVkaW8gZmlsZXMgbGlzdGVkIGludG8gYXVkaW9GaWxlcyBpbnRvIGNodW5rcyBmb3Igc3RyZWFtaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IGF1ZGlvRmlsZXMgLSBsaXN0IG9mIHBhdGhzIHRvd2FyZHMgYXVkaW8gZmlsZXMgdG8gY2h1bmsuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGNhbGwgd2hlbiBzbGljaW5nIGNvbXBsZXRlZC5cbiAgICovXG4gIHByZXBhcmVTdHJlYW1DaHVua3MoYXVkaW9GaWxlcywgY2FsbGJhY2spIHtcbiAgICBjb25zdCBidWZmZXJJbmZvcyA9IFtdO1xuXG4gICAgY29uc3Qgc2xpY2VyID0gbmV3IFNsaWNlcih7XG4gICAgICBjb21wcmVzczogdGhpcy5vcHRpb25zLmNvbXByZXNzLFxuICAgICAgZHVyYXRpb246IHRoaXMub3B0aW9ucy5kdXJhdGlvbixcbiAgICAgIG92ZXJsYXA6IHRoaXMub3B0aW9ucy5vdmVybGFwXG4gICAgfSk7XG5cbiAgICAvLyB0cnkgYXZvaWQgaGFyZGNvcmUgcGFyYWxsZWwgcHJvY2Vzc2luZyB0aGF0IGNyYXNoZXMgdGhlIHNlcnZlclxuICAgIC8vICh1bGltaXQgaXNzdWUpIHdoZW4gbG90cyBvZiBhdWRpb0ZpbGVzIHRvIHByb2Nlc3NcbiAgICBsZXQgaW5kZXggPSAwO1xuXG4gICAgZnVuY3Rpb24gc2xpY2VOZXh0KCkge1xuICAgICAgY29uc3QgaXRlbSA9IGF1ZGlvRmlsZXNbaW5kZXhdO1xuXG4gICAgICBzbGljZXIuc2xpY2UoaXRlbSwgY2h1bmtMaXN0ID0+IHtcbiAgICAgICAgYnVmZmVySW5mb3MucHVzaChjaHVua0xpc3QpO1xuXG4gICAgICAgIGluZGV4ICs9IDE7XG5cbiAgICAgICAgaWYgKGluZGV4ID49IGF1ZGlvRmlsZXMubGVuZ3RoKVxuICAgICAgICAgIGNhbGxiYWNrKGJ1ZmZlckluZm9zKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHNsaWNlTmV4dCgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2xpY2VOZXh0KCk7XG4gIH1cblxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBBdWRpb1N0cmVhbU1hbmFnZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBBdWRpb1N0cmVhbU1hbmFnZXI7XG4iXX0=