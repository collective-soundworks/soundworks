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
 * // Require and configure `audio-stream-manager` service (inside experience constructor).
 * // define list of "streamable" audio files
 * let audioFiles = [
 *   './public/stream/my-audio-file.wav',
 *   './public/stream/another-audio-file.wav',
 * ];
 * // require service
 * this.audioStreamManager = this.require('audio-stream-manager', {audioFiles: audioFiles});
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

      audioFiles.forEach(function (item, id) {
        slicer.slice(item, function (chunkList) {
          bufferInfos.push(chunkList);
          // return local map when all file processed
          if (bufferInfos.length >= audioFiles.length) callback(bufferInfos);
        });
      });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvU3RyZWFtTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJTbGljZXIiLCJyZXF1aXJlIiwiU0VSVklDRV9JRCIsIkF1ZGlvU3RyZWFtTWFuYWdlciIsImRlZmF1bHRzIiwiYXVkaW9GaWxlcyIsImNvbXByZXNzIiwiZHVyYXRpb24iLCJvdmVybGFwIiwiY29uZmlndXJlIiwiX3N5bmMiLCJfY2xpZW50cyIsIm9wdGlvbnMiLCJyZWFkeSIsInByZXBhcmVTdHJlYW1DaHVua3MiLCJidWZmZXJJbmZvcyIsImNsaWVudCIsImFkZCIsInJlY2VpdmUiLCJfb25SZXF1ZXN0IiwiZGVsZXRlIiwic2VuZCIsIl9zeW5jU3RhcnRUaW1lIiwiY2FsbGJhY2siLCJzbGljZXIiLCJmb3JFYWNoIiwiaXRlbSIsImlkIiwic2xpY2UiLCJjaHVua0xpc3QiLCJwdXNoIiwibGVuZ3RoIiwidGltZSIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBSEEsSUFBTUEsU0FBU0MsUUFBUSxtQkFBUixFQUE2QkQsTUFBNUM7OztBQUtBLElBQU1FLGFBQWEsOEJBQW5COztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQ01DLGtCOzs7QUFDSjtBQUNBLGdDQUFjO0FBQUE7O0FBQUEsOEpBQ05ELFVBRE07O0FBR1osUUFBTUUsV0FBVztBQUNmQyxrQkFBWSxJQURHO0FBRWZDLGdCQUFVLElBRks7QUFHZkMsZ0JBQVUsQ0FISztBQUlmQyxlQUFTO0FBSk0sS0FBakI7O0FBT0EsVUFBS0MsU0FBTCxDQUFlTCxRQUFmOztBQUVBLFVBQUtNLEtBQUwsR0FBYSxNQUFLVCxPQUFMLENBQWEsTUFBYixDQUFiOztBQUVBLFVBQUtVLFFBQUwsR0FBZ0IsbUJBQWhCO0FBZFk7QUFlYjs7QUFFRDs7Ozs7Ozs7Ozs7QUFhQTs4QkFDVUMsTyxFQUFTO0FBQ2pCLDhKQUFnQkEsT0FBaEI7QUFDRDs7QUFFRDs7Ozs0QkFDUTtBQUFBOztBQUNOOztBQUVBLFVBQUksS0FBS0EsT0FBTCxDQUFhUCxVQUFiLEtBQTRCLElBQWhDLEVBQXNDO0FBQ3BDLGFBQUtRLEtBQUw7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLQyxtQkFBTCxDQUF5QixLQUFLRixPQUFMLENBQWFQLFVBQXRDLEVBQWtELFVBQUNVLFdBQUQsRUFBaUI7QUFDakUsaUJBQUtBLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0EsaUJBQUtGLEtBQUw7QUFDRCxTQUhEO0FBSUQ7QUFDRjs7QUFFRDs7Ozs0QkFDUUcsTSxFQUFRO0FBQ2QsV0FBS0wsUUFBTCxDQUFjTSxHQUFkLENBQWtCRCxNQUFsQjtBQUNBLFdBQUtFLE9BQUwsQ0FBYUYsTUFBYixFQUFxQixTQUFyQixFQUFnQyxLQUFLRyxVQUFMLENBQWdCSCxNQUFoQixDQUFoQztBQUNEOzs7K0JBRVVBLE0sRUFBUTtBQUNqQixXQUFLTCxRQUFMLENBQWNTLE1BQWQsQ0FBcUJKLE1BQXJCO0FBQ0Q7O0FBRUQ7Ozs7K0JBQ1dBLE0sRUFBUTtBQUFBOztBQUNqQixhQUFPLFlBQU07QUFDWCxlQUFLSyxJQUFMLENBQVVMLE1BQVYsRUFBa0IsYUFBbEIsRUFBaUMsT0FBS0QsV0FBdEM7O0FBRUE7QUFDQSxZQUFJLE9BQUtPLGNBQUwsS0FBd0IsSUFBNUIsRUFDRSxPQUFLRCxJQUFMLENBQVVMLE1BQVYsRUFBa0IsZUFBbEIsRUFBbUMsT0FBS00sY0FBeEM7QUFDSCxPQU5EO0FBT0Q7O0FBRUQ7Ozs7Ozs7Ozt3Q0FNb0JqQixVLEVBQVlrQixRLEVBQVU7QUFDeEMsVUFBTVIsY0FBYyxFQUFwQjs7QUFFQSxVQUFNUyxTQUFTLElBQUl4QixNQUFKLENBQVc7QUFDeEJNLGtCQUFVLEtBQUtNLE9BQUwsQ0FBYU4sUUFEQztBQUV4QkMsa0JBQVUsS0FBS0ssT0FBTCxDQUFhTCxRQUZDO0FBR3hCQyxpQkFBUyxLQUFLSSxPQUFMLENBQWFKO0FBSEUsT0FBWCxDQUFmOztBQU1BSCxpQkFBV29CLE9BQVgsQ0FBbUIsVUFBQ0MsSUFBRCxFQUFPQyxFQUFQLEVBQWM7QUFDL0JILGVBQU9JLEtBQVAsQ0FBYUYsSUFBYixFQUFtQixVQUFDRyxTQUFELEVBQWU7QUFDaENkLHNCQUFZZSxJQUFaLENBQWlCRCxTQUFqQjtBQUNBO0FBQ0EsY0FBSWQsWUFBWWdCLE1BQVosSUFBc0IxQixXQUFXMEIsTUFBckMsRUFDRVIsU0FBU1IsV0FBVDtBQUNILFNBTEQ7QUFNRCxPQVBEO0FBUUQ7OztzQkF2RWlCaUIsSSxFQUFNO0FBQUE7O0FBQ3RCLFdBQUtWLGNBQUwsR0FBc0JVLElBQXRCOztBQUVBLFdBQUtyQixRQUFMLENBQWNjLE9BQWQsQ0FBc0Isa0JBQVU7QUFDOUIsZUFBS0osSUFBTCxDQUFVTCxNQUFWLEVBQWtCLGVBQWxCLEVBQW1DLE9BQUtNLGNBQXhDO0FBQ0QsT0FGRDtBQUdEOzs7OztBQXFFSCx5QkFBZVcsUUFBZixDQUF3Qi9CLFVBQXhCLEVBQW9DQyxrQkFBcEM7O2tCQUVlQSxrQiIsImZpbGUiOiJBdWRpb1N0cmVhbU1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBTbGljZXIgPSByZXF1aXJlKCdub2RlLWF1ZGlvLXNsaWNlcicpLlNsaWNlcjtcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgeyBnZXRPcHQgfSBmcm9tICcuLi8uLi91dGlscy9oZWxwZXJzJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmF1ZGlvLXN0cmVhbS1tYW5hZ2VyJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdhdWRpby1zdHJlYW0tbWFuYWdlcidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byBzdHJlYW0gYXVkaW8gYnVmZmVycyB0byB0aGUgY2xpZW50IGR1cmluZyB0aGUgZXhwZXJpZW5jZVxuICogKG5vdCBwcmVsb2FkZWQpLiBJbnB1dCBhdWRpbyBmaWxlcyBhcmUgc2VnbWVudGVkIGJ5IHRoZSBzZXJ2ZXIgdXBvbiBzdGFydHVwIGFuZFxuICogc2VudCB0byB0aGUgY2xpZW50cyB1cG9uIHJlcXVlc3QuIFNlcnZpY2Ugb25seSBhY2NlcHRzIC53YXYgZmlsZXMgYXQgdGhlIG1vbWVudC5cbiAqIFNlcnZpY2UgbWFpbiBvYmplY3RpdmUgaXMgdG8gMSkgZW5hYmxlIHN5bmNlZCBzdHJlYW1pbmcgYmV0d2VlbiBjbGllbnRzIChub3QgcHJlY2lzZVxuICogaWYgYmFzZWQgb24gbWVkaWFFbGVtZW50U291cmNlcyksIGFuZCAyKSBwcm92aWRlIGFuIGVxdWl2YWxlbnQgdG8gdGhlIG1lZGlhRWxlbWVudFNvdXJjZVxuICogb2JqZWN0IChzdHJlYW1pbmcgYXMgYSBXZWIgQXVkaW8gQVBJIG5vZGUpIHRoYXQgY291bGQgYmUgcGx1Z2dlZCB0byBhbnkgb3RoZXIgbm9kZSBpbiBTYWZhcmlcbiAqIChieXBhc3NpbmcgZS5nLiBnYWluIG9yIGFuYWx5emVyIG5vZGVzIHdoZW4gcGx1Z2dlZCB0byBtZWRpYUVsZW1lbnRTb3VyY2UpLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIHNob3VsZCBiZSB1c2VkIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkF1ZGlvU3RyZWFtTWFuYWdlcn0qX19cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBvcHRpb25zLmF1ZGlvRmlsZXMgLSBsaXN0IG9mIHBhdGhzIHRvd2FyZHMgd291bGQtYmUtc3RyZWFtYWJsZSBhdWRpbyBmaWxlcy5cbiAqIEBwYXJhbSB7Qm9vbH0gb3B0aW9ucy5jb21wcmVzcyAtIEdlbmVyYXRlIC5tcDMgc3RyZWFtIGNodW5rcyBpZiBzZXQgdG8gdHJ1ZS4gS2VlcCBpbnB1dCBmaWxlIGV4dGVuc2lvbiBvdGhlcndpc2UuXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5kdXJhdGlvbiAtIEF1ZGlvIGNodW5rcyBkdXJhdGlvbiAoaW4gc2VjKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLm92ZXJsYXAgLSBEdXJhdGlvbiBvZiBhZGRpdGlvbmFsIGF1ZGlvIHNhbXBsZXMgYWRkZWQgdG8gaGVhZCBhbmQgdGFpbCBvZiBzdHJlYW1lZCBhdWRpb1xuICogIGJ1ZmZlcnMuIFBhaXJlZCB3aXRoIGEgZmFkZS1pbiBmYWRlLW91dCBtZWNoYW5pc20gb24gY2xpZW50J3Mgc2lkZSwgdGhpcyBhbGxvd3MgdG8gaGlkZSBkaXN0b3J0aW9ucyBpbmR1Y2VkIGJ5XG4gKiAgbXAzIGVuY29kaW5nIG9mIGF1ZGlvIGNodW5rcyBub3Qgc3RhcnRpbmcgLyBmaW5pc2hpbmcgd2l0aCB6ZXJvZWQgc2FtcGxlcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogLy8gUmVxdWlyZSBhbmQgY29uZmlndXJlIGBhdWRpby1zdHJlYW0tbWFuYWdlcmAgc2VydmljZSAoaW5zaWRlIGV4cGVyaWVuY2UgY29uc3RydWN0b3IpLlxuICogLy8gZGVmaW5lIGxpc3Qgb2YgXCJzdHJlYW1hYmxlXCIgYXVkaW8gZmlsZXNcbiAqIGxldCBhdWRpb0ZpbGVzID0gW1xuICogICAnLi9wdWJsaWMvc3RyZWFtL215LWF1ZGlvLWZpbGUud2F2JyxcbiAqICAgJy4vcHVibGljL3N0cmVhbS9hbm90aGVyLWF1ZGlvLWZpbGUud2F2JyxcbiAqIF07XG4gKiAvLyByZXF1aXJlIHNlcnZpY2VcbiAqIHRoaXMuYXVkaW9TdHJlYW1NYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1zdHJlYW0tbWFuYWdlcicsIHthdWRpb0ZpbGVzOiBhdWRpb0ZpbGVzfSk7XG4gKi9cblxuY2xhc3MgQXVkaW9TdHJlYW1NYW5hZ2VyIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbnRpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGF1ZGlvRmlsZXM6IG51bGwsXG4gICAgICBjb21wcmVzczogdHJ1ZSxcbiAgICAgIGR1cmF0aW9uOiA0LFxuICAgICAgb3ZlcmxhcDogMC4xXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX3N5bmMgPSB0aGlzLnJlcXVpcmUoJ3N5bmMnKTtcblxuICAgIHRoaXMuX2NsaWVudHMgPSBuZXcgU2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGNvbW1vbiAoc3luYykgc3RhcnQgdGltZSBmb3IgQXVkaW9TdHJlYW0gaW4gc3luYyBtb2RlLlxuICAgKiBUaGUgdmFsdWUgaXMgcHJvcGFnYXRlZCB0byBldmVyeSBjb25uZWN0ZWQgY2xpZW50cyBhbmQgbmV3bHkgY29ubmVjdGVkXG4gICAqIGNsaWVudHMuXG4gICAqL1xuICBzZXQgc3luY1N0YXJ0VGltZSh0aW1lKSB7XG4gICAgdGhpcy5fc3luY1N0YXJ0VGltZSA9IHRpbWU7XG5cbiAgICB0aGlzLl9jbGllbnRzLmZvckVhY2goY2xpZW50ID0+IHtcbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdzeW5jU3RhcnRUaW1lJywgdGhpcy5fc3luY1N0YXJ0VGltZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuYXVkaW9GaWxlcyA9PT0gbnVsbCkge8KgXG4gICAgICB0aGlzLnJlYWR5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJlcGFyZVN0cmVhbUNodW5rcyh0aGlzLm9wdGlvbnMuYXVkaW9GaWxlcywgKGJ1ZmZlckluZm9zKSA9PiB7XG4gICAgICAgIHRoaXMuYnVmZmVySW5mb3MgPSBidWZmZXJJbmZvcztcbiAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgdGhpcy5fY2xpZW50cy5hZGQoY2xpZW50KTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgdGhpcy5fY2xpZW50cy5kZWxldGUoY2xpZW50KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnYWNrbm93bGVnZGUnLCB0aGlzLmJ1ZmZlckluZm9zKTtcblxuICAgICAgLy8gaGFzIGFscmVhZHkgc3RhcnRlZCBpbiBzeW5jIG1vZGVcbiAgICAgIGlmICh0aGlzLl9zeW5jU3RhcnRUaW1lICE9PSBudWxsKVxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnc3luY1N0YXJ0VGltZScsIHRoaXMuX3N5bmNTdGFydFRpbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWdtZW50IGF1ZGlvIGZpbGVzIGxpc3RlZCBpbnRvIGF1ZGlvRmlsZXMgaW50byBjaHVua3MgZm9yIHN0cmVhbWluZy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBhdWRpb0ZpbGVzIC0gbGlzdCBvZiBwYXRocyB0b3dhcmRzIGF1ZGlvIGZpbGVzIHRvIGNodW5rLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byBjYWxsIHdoZW4gc2xpY2luZyBjb21wbGV0ZWQuXG4gICAqL1xuICBwcmVwYXJlU3RyZWFtQ2h1bmtzKGF1ZGlvRmlsZXMsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgYnVmZmVySW5mb3MgPSBbXTtcblxuICAgIGNvbnN0IHNsaWNlciA9IG5ldyBTbGljZXIoe1xuICAgICAgY29tcHJlc3M6IHRoaXMub3B0aW9ucy5jb21wcmVzcyxcbiAgICAgIGR1cmF0aW9uOiB0aGlzLm9wdGlvbnMuZHVyYXRpb24sXG4gICAgICBvdmVybGFwOiB0aGlzLm9wdGlvbnMub3ZlcmxhcFxuICAgIH0pO1xuXG4gICAgYXVkaW9GaWxlcy5mb3JFYWNoKChpdGVtLCBpZCkgPT4ge1xuICAgICAgc2xpY2VyLnNsaWNlKGl0ZW0sIChjaHVua0xpc3QpID0+IHtcbiAgICAgICAgYnVmZmVySW5mb3MucHVzaChjaHVua0xpc3QpO1xuICAgICAgICAvLyByZXR1cm4gbG9jYWwgbWFwIHdoZW4gYWxsIGZpbGUgcHJvY2Vzc2VkXG4gICAgICAgIGlmIChidWZmZXJJbmZvcy5sZW5ndGggPj0gYXVkaW9GaWxlcy5sZW5ndGgpXG4gICAgICAgICAgY2FsbGJhY2soYnVmZmVySW5mb3MpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBBdWRpb1N0cmVhbU1hbmFnZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBBdWRpb1N0cmVhbU1hbmFnZXI7XG4iXX0=