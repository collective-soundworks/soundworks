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

var _SegmentedView = require('../views/SegmentedView');

var _SegmentedView2 = _interopRequireDefault(_SegmentedView);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:raw-socket';

/**
 * Interface for the `raw-socket` service.
 *
 * This service creates an additionnal native socket with its binary type set
 * to `arraybuffer` and focused on performances.
 * It allows the transfert of `TypedArray` data wrapped with a minimal channel
 * mechanism (up to 256 channels).
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.RawSocket}*__
 *
 * @memberof module:soundworks/client
 */

var RawSocket = function (_Service) {
  (0, _inherits3.default)(RawSocket, _Service);

  function RawSocket() {
    (0, _classCallCheck3.default)(this, RawSocket);

    var _this = (0, _possibleConstructorReturn3.default)(this, (RawSocket.__proto__ || (0, _getPrototypeOf2.default)(RawSocket)).call(this, SERVICE_ID, true));

    var defaults = {
      viewCtor: _SegmentedView2.default,
      viewPriority: 5
    };

    _this.configure(defaults);

    /**
     * Listeners for the incomming messages.
     *
     * @type {Object<String, Set<Function>>}
     * @name _listeners
     * @memberof module:soundworks/server.RawSocket
     * @instance
     * @private
     */
    _this._listeners = {};

    _this._protocol = null;
    _this._onReceiveConnectionInfos = _this._onReceiveConnectionInfos.bind(_this);
    _this._onReceiveAcknoledgement = _this._onReceiveAcknoledgement.bind(_this);
    _this._onMessage = _this._onMessage.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(RawSocket, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(RawSocket.prototype.__proto__ || (0, _getPrototypeOf2.default)(RawSocket.prototype), 'start', this).call(this);
      this.show();

      (0, _get3.default)(RawSocket.prototype.__proto__ || (0, _getPrototypeOf2.default)(RawSocket.prototype), 'send', this).call(this, 'request');
      (0, _get3.default)(RawSocket.prototype.__proto__ || (0, _getPrototypeOf2.default)(RawSocket.prototype), 'receive', this).call(this, 'infos', this._onReceiveConnectionInfos);
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      (0, _get3.default)(RawSocket.prototype.__proto__ || (0, _getPrototypeOf2.default)(RawSocket.prototype), 'stop', this).call(this);
    }

    /**
     * Method executed when the service receive connection informations from the
     * server.
     *
     * @param {Number} port - Port on which open the new socket.
     * @param {Object} protocol - User-defined protocol to be used in raw socket
     *  exchanges.
     * @param {Number} token - Unique token to retrieve in the first message to
     *  identy the client server-side, allow to match the socket with its
     *  corresponding client.
     *
     * @private
     */

  }, {
    key: '_onReceiveConnectionInfos',
    value: function _onReceiveConnectionInfos(port, protocol, token) {
      var _this2 = this;

      this._protocol = protocol;
      this._channels = protocol.map(function (entry) {
        return entry.channel;
      });

      this.removeListener('connection-infos', this._onReceiveConnectionInfos);

      var socketProtocol = window.location.protocol.replace(/^http?/, 'ws');
      var socketHostname = window.location.hostname;
      var url = socketProtocol + '//' + socketHostname + ':' + port;

      this.socket = new WebSocket(url);
      this.socket.binaryType = 'arraybuffer';
      // send token back to the server and wait for acknoledgement
      var data = new Uint32Array(1);
      data[0] = token;

      this.socket.addEventListener('open', function () {
        _this2.send('service:handshake', data);
      });

      this.socket.addEventListener('message', this._onReceiveAcknoledgement);
    }

    /**
     * Callback executed when the server acknoledges the matching between a
     * client and a socket.
     *
     * @private
     */

  }, {
    key: '_onReceiveAcknoledgement',
    value: function _onReceiveAcknoledgement(e) {
      var index = new Uint8Array(e.data)[0];
      var _protocol$index = this._protocol[index],
          channel = _protocol$index.channel,
          type = _protocol$index.type;

      // ignore incomming messages that could occur if
      // acknoledgement was not yet received

      if (channel === 'service:handshake-ack') {
        this.socket.removeEventListener('message', this._onReceiveAcknoledgement);
        this.socket.addEventListener('message', this._onMessage);
        this.ready();
      }
    }

    /**
     * Callback function of the socket `message` event. Unwrap the channel and
     * the data contained in the payload and execute the registered callback.
     *
     * @private
     */

  }, {
    key: '_onMessage',
    value: function _onMessage(e) {
      var index = new Uint8Array(e.data)[0];

      if (!this._protocol[index]) throw new Error('Invalid protocol index: ' + index);

      var _protocol$index2 = this._protocol[index],
          channel = _protocol$index2.channel,
          type = _protocol$index2.type;

      var viewCtor = window[type + 'Array'];
      var data = new viewCtor(e.data, viewCtor.BYTES_PER_ELEMENT);
      var callbacks = this._listeners[channel];

      if (callbacks) callbacks.forEach(function (callback) {
        return callback(data);
      });
    }

    /**
     * Register a callback to be executed when receiving a message on a specific
     * channel.
     *
     * @param {String} channel - Channel of the message.
     * @param {Function} callback - Callback function.
     */

  }, {
    key: 'receive',
    value: function receive(channel, callback) {
      var listeners = this._listeners;

      if (!listeners[channel]) listeners[channel] = new _set2.default();

      listeners[channel].add(callback);
    }

    /**
     * Send data on a specific channel.
     *
     * @param {String} channel - Channel of the message.
     * @param {TypedArray} data - Data.
     */

  }, {
    key: 'send',
    value: function send(channel, data) {
      var index = this._channels.indexOf(channel);

      if (index === -1) throw new Error('Undefined channel "' + channel + '"');

      var type = this._protocol[index].type;

      var viewCtor = window[type + 'Array'];
      var size = data ? 1 + data.length : 1;
      var view = new viewCtor(size);

      var channelView = new Uint8Array(viewCtor.BYTES_PER_ELEMENT);
      channelView[0] = index;
      // populate buffer
      view.set(new viewCtor(channelView.buffer), 0);

      if (data) view.set(data, 1);

      this.socket.send(view.buffer);
    }
  }]);
  return RawSocket;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, RawSocket);

exports.default = RawSocket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJhd1NvY2tldC5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiUmF3U29ja2V0IiwiZGVmYXVsdHMiLCJ2aWV3Q3RvciIsIlNlZ21lbnRlZFZpZXciLCJ2aWV3UHJpb3JpdHkiLCJjb25maWd1cmUiLCJfbGlzdGVuZXJzIiwiX3Byb3RvY29sIiwiX29uUmVjZWl2ZUNvbm5lY3Rpb25JbmZvcyIsImJpbmQiLCJfb25SZWNlaXZlQWNrbm9sZWRnZW1lbnQiLCJfb25NZXNzYWdlIiwic2hvdyIsImhpZGUiLCJwb3J0IiwicHJvdG9jb2wiLCJ0b2tlbiIsIl9jaGFubmVscyIsIm1hcCIsImVudHJ5IiwiY2hhbm5lbCIsInJlbW92ZUxpc3RlbmVyIiwic29ja2V0UHJvdG9jb2wiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInJlcGxhY2UiLCJzb2NrZXRIb3N0bmFtZSIsImhvc3RuYW1lIiwidXJsIiwic29ja2V0IiwiV2ViU29ja2V0IiwiYmluYXJ5VHlwZSIsImRhdGEiLCJVaW50MzJBcnJheSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZW5kIiwiZSIsImluZGV4IiwiVWludDhBcnJheSIsInR5cGUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVhZHkiLCJFcnJvciIsIkJZVEVTX1BFUl9FTEVNRU5UIiwiY2FsbGJhY2tzIiwiZm9yRWFjaCIsImNhbGxiYWNrIiwibGlzdGVuZXJzIiwiYWRkIiwiaW5kZXhPZiIsInNpemUiLCJsZW5ndGgiLCJ2aWV3IiwiY2hhbm5lbFZpZXciLCJzZXQiLCJidWZmZXIiLCJTZXJ2aWNlIiwic2VydmljZU1hbmFnZXIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxvQkFBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7SUFZTUMsUzs7O0FBQ0osdUJBQWM7QUFBQTs7QUFBQSw0SUFDTkQsVUFETSxFQUNNLElB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QUFKLENBQWVwQyxTQUFTeUMsaUJBQXhCLENBQXBCO0FBQ0FVLGtCQUFZLENBQVosSUFBaUJoQixLQUFqQjtBQUNBO0FBQ0FlLFdBQUtFLEdBQUwsQ0FBUyxJQUFJcEQsUUFBSixDQUFhbUQsWUFBWUUsTUFBekIsQ0FBVCxFQUEyQyxDQUEzQzs7QUFFQSxVQUFJdkIsSUFBSixFQUNFb0IsS0FBS0UsR0FBTCxDQUFTdEIsSUFBVCxFQUFlLENBQWY7O0FBRUYsV0FBS0gsTUFBTCxDQUFZTSxJQUFaLENBQWlCaUIsS0FBS0csTUFBdEI7QUFDRDs7O0VBaktxQkMsaUI7O0FBb0t4QkMseUJBQWVDLFFBQWYsQ0FBd0IzRCxVQUF4QixFQUFvQ0MsU0FBcEM7O2tCQUVlQSxTIiwiZmlsZSI6IlJhd1NvY2tldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL3ZpZXdzL1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnJhdy1zb2NrZXQnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGByYXctc29ja2V0YCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBjcmVhdGVzIGFuIGFkZGl0aW9ubmFsIG5hdGl2ZSBzb2NrZXQgd2l0aCBpdHMgYmluYXJ5IHR5cGUgc2V0XG4gKiB0byBgYXJyYXlidWZmZXJgIGFuZCBmb2N1c2VkIG9uIHBlcmZvcm1hbmNlcy5cbiAqIEl0IGFsbG93cyB0aGUgdHJhbnNmZXJ0IG9mIGBUeXBlZEFycmF5YCBkYXRhIHdyYXBwZWQgd2l0aCBhIG1pbmltYWwgY2hhbm5lbFxuICogbWVjaGFuaXNtICh1cCB0byAyNTYgY2hhbm5lbHMpLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5SYXdTb2NrZXR9Kl9fXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICovXG5jbGFzcyBSYXdTb2NrZXQgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHZpZXdDdG9yOiBTZWdtZW50ZWRWaWV3LFxuICAgICAgdmlld1ByaW9yaXR5OiA1LFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZW5lcnMgZm9yIHRoZSBpbmNvbW1pbmcgbWVzc2FnZXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0PFN0cmluZywgU2V0PEZ1bmN0aW9uPj59XG4gICAgICogQG5hbWUgX2xpc3RlbmVyc1xuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuUmF3U29ja2V0XG4gICAgICogQGluc3RhbmNlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcblxuICAgIHRoaXMuX3Byb3RvY29sID0gbnVsbDtcbiAgICB0aGlzLl9vblJlY2VpdmVDb25uZWN0aW9uSW5mb3MgPSB0aGlzLl9vblJlY2VpdmVDb25uZWN0aW9uSW5mb3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblJlY2VpdmVBY2tub2xlZGdlbWVudCA9IHRoaXMuX29uUmVjZWl2ZUFja25vbGVkZ2VtZW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25NZXNzYWdlID0gdGhpcy5fb25NZXNzYWdlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLnNob3coKTtcblxuICAgIHN1cGVyLnNlbmQoJ3JlcXVlc3QnKTtcbiAgICBzdXBlci5yZWNlaXZlKCdpbmZvcycsIHRoaXMuX29uUmVjZWl2ZUNvbm5lY3Rpb25JbmZvcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogTWV0aG9kIGV4ZWN1dGVkIHdoZW4gdGhlIHNlcnZpY2UgcmVjZWl2ZSBjb25uZWN0aW9uIGluZm9ybWF0aW9ucyBmcm9tIHRoZVxuICAgKiBzZXJ2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3J0IC0gUG9ydCBvbiB3aGljaCBvcGVuIHRoZSBuZXcgc29ja2V0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvdG9jb2wgLSBVc2VyLWRlZmluZWQgcHJvdG9jb2wgdG8gYmUgdXNlZCBpbiByYXcgc29ja2V0XG4gICAqICBleGNoYW5nZXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0b2tlbiAtIFVuaXF1ZSB0b2tlbiB0byByZXRyaWV2ZSBpbiB0aGUgZmlyc3QgbWVzc2FnZSB0b1xuICAgKiAgaWRlbnR5IHRoZSBjbGllbnQgc2VydmVyLXNpZGUsIGFsbG93IHRvIG1hdGNoIHRoZSBzb2NrZXQgd2l0aCBpdHNcbiAgICogIGNvcnJlc3BvbmRpbmcgY2xpZW50LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uUmVjZWl2ZUNvbm5lY3Rpb25JbmZvcyhwb3J0LCBwcm90b2NvbCwgdG9rZW4pIHtcbiAgICB0aGlzLl9wcm90b2NvbCA9IHByb3RvY29sO1xuICAgIHRoaXMuX2NoYW5uZWxzID0gcHJvdG9jb2wubWFwKChlbnRyeSkgPT4gZW50cnkuY2hhbm5lbCk7XG5cbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjb25uZWN0aW9uLWluZm9zJywgdGhpcy5fb25SZWNlaXZlQ29ubmVjdGlvbkluZm9zKTtcblxuICAgIGNvbnN0IHNvY2tldFByb3RvY29sID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sLnJlcGxhY2UoL15odHRwPy8sICd3cycpO1xuICAgIGNvbnN0IHNvY2tldEhvc3RuYW1lID0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lO1xuICAgIGNvbnN0IHVybCA9IGAke3NvY2tldFByb3RvY29sfS8vJHtzb2NrZXRIb3N0bmFtZX06JHtwb3J0fWA7XG5cbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQodXJsKTtcbiAgICB0aGlzLnNvY2tldC5iaW5hcnlUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgICAvLyBzZW5kIHRva2VuIGJhY2sgdG8gdGhlIHNlcnZlciBhbmQgd2FpdCBmb3IgYWNrbm9sZWRnZW1lbnRcbiAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQzMkFycmF5KDEpO1xuICAgIGRhdGFbMF0gPSB0b2tlbjtcblxuICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ29wZW4nLCAoKSA9PiB7XG4gICAgICB0aGlzLnNlbmQoJ3NlcnZpY2U6aGFuZHNoYWtlJywgZGF0YSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5fb25SZWNlaXZlQWNrbm9sZWRnZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGV4ZWN1dGVkIHdoZW4gdGhlIHNlcnZlciBhY2tub2xlZGdlcyB0aGUgbWF0Y2hpbmcgYmV0d2VlbiBhXG4gICAqIGNsaWVudCBhbmQgYSBzb2NrZXQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25SZWNlaXZlQWNrbm9sZWRnZW1lbnQoZSkge1xuICAgIGNvbnN0IGluZGV4ID0gbmV3IFVpbnQ4QXJyYXkoZS5kYXRhKVswXTtcbiAgICBjb25zdCB7IGNoYW5uZWwsIHR5cGUgfSA9IHRoaXMuX3Byb3RvY29sW2luZGV4XTtcblxuICAgIC8vIGlnbm9yZSBpbmNvbW1pbmcgbWVzc2FnZXMgdGhhdCBjb3VsZCBvY2N1ciBpZlxuICAgIC8vIGFja25vbGVkZ2VtZW50IHdhcyBub3QgeWV0IHJlY2VpdmVkXG4gICAgaWYgKGNoYW5uZWwgPT09ICdzZXJ2aWNlOmhhbmRzaGFrZS1hY2snKcKge1xuICAgICAgdGhpcy5zb2NrZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMuX29uUmVjZWl2ZUFja25vbGVkZ2VtZW50KTtcbiAgICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLl9vbk1lc3NhZ2UpO1xuICAgICAgdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmdW5jdGlvbiBvZiB0aGUgc29ja2V0IGBtZXNzYWdlYCBldmVudC4gVW53cmFwIHRoZSBjaGFubmVsIGFuZFxuICAgKiB0aGUgZGF0YSBjb250YWluZWQgaW4gdGhlIHBheWxvYWQgYW5kIGV4ZWN1dGUgdGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2suXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25NZXNzYWdlKGUpIHtcbiAgICBjb25zdCBpbmRleCA9IG5ldyBVaW50OEFycmF5KGUuZGF0YSlbMF07XG5cbiAgICBpZiAoIXRoaXMuX3Byb3RvY29sW2luZGV4XSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBwcm90b2NvbCBpbmRleDogJHtpbmRleH1gKTtcblxuICAgIGNvbnN0IHsgY2hhbm5lbCwgdHlwZSB9ID0gdGhpcy5fcHJvdG9jb2xbaW5kZXhdO1xuICAgIGNvbnN0IHZpZXdDdG9yID0gd2luZG93W2Ake3R5cGV9QXJyYXlgXTtcbiAgICBjb25zdCBkYXRhID0gbmV3IHZpZXdDdG9yKGUuZGF0YSwgdmlld0N0b3IuQllURVNfUEVSX0VMRU1FTlQpO1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IHRoaXMuX2xpc3RlbmVyc1tjaGFubmVsXTtcblxuICAgIGlmIChjYWxsYmFja3MpXG4gICAgICBjYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKGRhdGEpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gcmVjZWl2aW5nIGEgbWVzc2FnZSBvbiBhIHNwZWNpZmljXG4gICAqIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayBmdW5jdGlvbi5cbiAgICovXG4gIHJlY2VpdmUoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XG5cbiAgICBpZiAoIWxpc3RlbmVyc1tjaGFubmVsXSlcbiAgICAgIGxpc3RlbmVyc1tjaGFubmVsXSA9IG5ldyBTZXQoKTtcblxuICAgIGxpc3RlbmVyc1tjaGFubmVsXS5hZGQoY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgZGF0YSBvbiBhIHNwZWNpZmljIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtUeXBlZEFycmF5fSBkYXRhIC0gRGF0YS5cbiAgICovXG4gIHNlbmQoY2hhbm5lbCwgZGF0YSkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fY2hhbm5lbHMuaW5kZXhPZihjaGFubmVsKTtcblxuICAgIGlmIChpbmRleCA9PT0gLTEpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZGVmaW5lZCBjaGFubmVsIFwiJHtjaGFubmVsfVwiYCk7XG5cbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuX3Byb3RvY29sW2luZGV4XTtcbiAgICBjb25zdCB2aWV3Q3RvciA9IHdpbmRvd1tgJHt0eXBlfUFycmF5YF07XG4gICAgY29uc3Qgc2l6ZSA9IGRhdGEgPyAxICsgZGF0YS5sZW5ndGggOiAxO1xuICAgIGNvbnN0IHZpZXcgPSBuZXcgdmlld0N0b3Ioc2l6ZSk7XG5cbiAgICBjb25zdCBjaGFubmVsVmlldyA9IG5ldyBVaW50OEFycmF5KHZpZXdDdG9yLkJZVEVTX1BFUl9FTEVNRU5UKTtcbiAgICBjaGFubmVsVmlld1swXSA9IGluZGV4O1xuICAgIC8vIHBvcHVsYXRlIGJ1ZmZlclxuICAgIHZpZXcuc2V0KG5ldyB2aWV3Q3RvcihjaGFubmVsVmlldy5idWZmZXIpLCAwKTtcblxuICAgIGlmIChkYXRhKVxuICAgICAgdmlldy5zZXQoZGF0YSwgMSk7XG5cbiAgICB0aGlzLnNvY2tldC5zZW5kKHZpZXcuYnVmZmVyKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBSYXdTb2NrZXQpO1xuXG5leHBvcnQgZGVmYXVsdCBSYXdTb2NrZXQ7XG4iXX0=