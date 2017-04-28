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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJhd1NvY2tldC5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiUmF3U29ja2V0IiwiZGVmYXVsdHMiLCJ2aWV3Q3RvciIsInZpZXdQcmlvcml0eSIsImNvbmZpZ3VyZSIsIl9saXN0ZW5lcnMiLCJfcHJvdG9jb2wiLCJfb25SZWNlaXZlQ29ubmVjdGlvbkluZm9zIiwiYmluZCIsIl9vblJlY2VpdmVBY2tub2xlZGdlbWVudCIsIl9vbk1lc3NhZ2UiLCJzaG93IiwiaGlkZSIsInBvcnQiLCJwcm90b2NvbCIsInRva2VuIiwiX2NoYW5uZWxzIiwibWFwIiwiZW50cnkiLCJjaGFubmVsIiwicmVtb3ZlTGlzdGVuZXIiLCJzb2NrZXRQcm90b2NvbCIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVwbGFjZSIsInNvY2tldEhvc3RuYW1lIiwiaG9zdG5hbWUiLCJ1cmwiLCJzb2NrZXQiLCJXZWJTb2NrZXQiLCJiaW5hcnlUeXBlIiwiZGF0YSIsIlVpbnQzMkFycmF5IiwiYWRkRXZlbnRMaXN0ZW5lciIsInNlbmQiLCJlIiwiaW5kZXgiLCJVaW50OEFycmF5IiwidHlwZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJyZWFkeSIsIkVycm9yIiwiQllURVNfUEVSX0VMRU1FTlQiLCJjYWxsYmFja3MiLCJmb3JFYWNoIiwiY2FsbGJhY2siLCJsaXN0ZW5lcnMiLCJhZGQiLCJpbmRleE9mIiwic2l6ZSIsImxlbmd0aCIsInZpZXciLCJjaGFubmVsVmlldyIsInNldCIsImJ1ZmZlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxhQUFhLG9CQUFuQjs7QUFFQTs7Ozs7Ozs7Ozs7OztJQVlNQyxTOzs7QUFDSix1QkFBYztBQUFBOztBQUFBLDRJQUNORCxVQURNLEVBQ00sSUFETjs7QUFHWixRQUFNRSxXQUFXO0FBQ2ZDLHVDQURlO0FBRWZDLG9CQUFj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QWlCaEIsS0FBakI7QUFDQTtBQUNBZSxXQUFLRSxHQUFMLENBQVMsSUFBSW5ELFFBQUosQ0FBYWtELFlBQVlFLE1BQXpCLENBQVQsRUFBMkMsQ0FBM0M7O0FBRUEsVUFBSXZCLElBQUosRUFDRW9CLEtBQUtFLEdBQUwsQ0FBU3RCLElBQVQsRUFBZSxDQUFmOztBQUVGLFdBQUtILE1BQUwsQ0FBWU0sSUFBWixDQUFpQmlCLEtBQUtHLE1BQXRCO0FBQ0Q7Ozs7O0FBR0gseUJBQWVDLFFBQWYsQ0FBd0J4RCxVQUF4QixFQUFvQ0MsU0FBcEM7O2tCQUVlQSxTIiwiZmlsZSI6IlJhd1NvY2tldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL3ZpZXdzL1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnJhdy1zb2NrZXQnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGByYXctc29ja2V0YCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBjcmVhdGVzIGFuIGFkZGl0aW9ubmFsIG5hdGl2ZSBzb2NrZXQgd2l0aCBpdHMgYmluYXJ5IHR5cGUgc2V0XG4gKiB0byBgYXJyYXlidWZmZXJgIGFuZCBmb2N1c2VkIG9uIHBlcmZvcm1hbmNlcy5cbiAqIEl0IGFsbG93cyB0aGUgdHJhbnNmZXJ0IG9mIGBUeXBlZEFycmF5YCBkYXRhIHdyYXBwZWQgd2l0aCBhIG1pbmltYWwgY2hhbm5lbFxuICogbWVjaGFuaXNtICh1cCB0byAyNTYgY2hhbm5lbHMpLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5SYXdTb2NrZXR9Kl9fXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICovXG5jbGFzcyBSYXdTb2NrZXQgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHZpZXdDdG9yOiBTZWdtZW50ZWRWaWV3LFxuICAgICAgdmlld1ByaW9yaXR5OiA1LFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZW5lcnMgZm9yIHRoZSBpbmNvbW1pbmcgbWVzc2FnZXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0PFN0cmluZywgU2V0PEZ1bmN0aW9uPj59XG4gICAgICogQG5hbWUgX2xpc3RlbmVyc1xuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuUmF3U29ja2V0XG4gICAgICogQGluc3RhbmNlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcblxuICAgIHRoaXMuX3Byb3RvY29sID0gbnVsbDtcbiAgICB0aGlzLl9vblJlY2VpdmVDb25uZWN0aW9uSW5mb3MgPSB0aGlzLl9vblJlY2VpdmVDb25uZWN0aW9uSW5mb3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblJlY2VpdmVBY2tub2xlZGdlbWVudCA9IHRoaXMuX29uUmVjZWl2ZUFja25vbGVkZ2VtZW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25NZXNzYWdlID0gdGhpcy5fb25NZXNzYWdlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLnNob3coKTtcblxuICAgIHN1cGVyLnNlbmQoJ3JlcXVlc3QnKTtcbiAgICBzdXBlci5yZWNlaXZlKCdpbmZvcycsIHRoaXMuX29uUmVjZWl2ZUNvbm5lY3Rpb25JbmZvcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogTWV0aG9kIGV4ZWN1dGVkIHdoZW4gdGhlIHNlcnZpY2UgcmVjZWl2ZSBjb25uZWN0aW9uIGluZm9ybWF0aW9ucyBmcm9tIHRoZVxuICAgKiBzZXJ2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3J0IC0gUG9ydCBvbiB3aGljaCBvcGVuIHRoZSBuZXcgc29ja2V0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvdG9jb2wgLSBVc2VyLWRlZmluZWQgcHJvdG9jb2wgdG8gYmUgdXNlZCBpbiByYXcgc29ja2V0XG4gICAqICBleGNoYW5nZXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0b2tlbiAtIFVuaXF1ZSB0b2tlbiB0byByZXRyaWV2ZSBpbiB0aGUgZmlyc3QgbWVzc2FnZSB0b1xuICAgKiAgaWRlbnR5IHRoZSBjbGllbnQgc2VydmVyLXNpZGUsIGFsbG93IHRvIG1hdGNoIHRoZSBzb2NrZXQgd2l0aCBpdHNcbiAgICogIGNvcnJlc3BvbmRpbmcgY2xpZW50LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uUmVjZWl2ZUNvbm5lY3Rpb25JbmZvcyhwb3J0LCBwcm90b2NvbCwgdG9rZW4pIHtcbiAgICB0aGlzLl9wcm90b2NvbCA9IHByb3RvY29sO1xuICAgIHRoaXMuX2NoYW5uZWxzID0gcHJvdG9jb2wubWFwKChlbnRyeSkgPT4gZW50cnkuY2hhbm5lbCk7XG5cbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdjb25uZWN0aW9uLWluZm9zJywgdGhpcy5fb25SZWNlaXZlQ29ubmVjdGlvbkluZm9zKTtcblxuICAgIGNvbnN0IHNvY2tldFByb3RvY29sID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sLnJlcGxhY2UoL15odHRwPy8sICd3cycpO1xuICAgIGNvbnN0IHNvY2tldEhvc3RuYW1lID0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lO1xuICAgIGNvbnN0IHVybCA9IGAke3NvY2tldFByb3RvY29sfS8vJHtzb2NrZXRIb3N0bmFtZX06JHtwb3J0fWA7XG5cbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQodXJsKTtcbiAgICB0aGlzLnNvY2tldC5iaW5hcnlUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgICAvLyBzZW5kIHRva2VuIGJhY2sgdG8gdGhlIHNlcnZlciBhbmQgd2FpdCBmb3IgYWNrbm9sZWRnZW1lbnRcbiAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQzMkFycmF5KDEpO1xuICAgIGRhdGFbMF0gPSB0b2tlbjtcblxuICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ29wZW4nLCAoKSA9PiB7XG4gICAgICB0aGlzLnNlbmQoJ3NlcnZpY2U6aGFuZHNoYWtlJywgZGF0YSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5fb25SZWNlaXZlQWNrbm9sZWRnZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGV4ZWN1dGVkIHdoZW4gdGhlIHNlcnZlciBhY2tub2xlZGdlcyB0aGUgbWF0Y2hpbmcgYmV0d2VlbiBhXG4gICAqIGNsaWVudCBhbmQgYSBzb2NrZXQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25SZWNlaXZlQWNrbm9sZWRnZW1lbnQoZSkge1xuICAgIGNvbnN0IGluZGV4ID0gbmV3IFVpbnQ4QXJyYXkoZS5kYXRhKVswXTtcbiAgICBjb25zdCB7IGNoYW5uZWwsIHR5cGUgfSA9IHRoaXMuX3Byb3RvY29sW2luZGV4XTtcblxuICAgIC8vIGlnbm9yZSBpbmNvbW1pbmcgbWVzc2FnZXMgdGhhdCBjb3VsZCBvY2N1ciBpZlxuICAgIC8vIGFja25vbGVkZ2VtZW50IHdhcyBub3QgeWV0IHJlY2VpdmVkXG4gICAgaWYgKGNoYW5uZWwgPT09ICdzZXJ2aWNlOmhhbmRzaGFrZS1hY2snKcKge1xuICAgICAgdGhpcy5zb2NrZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMuX29uUmVjZWl2ZUFja25vbGVkZ2VtZW50KTtcbiAgICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLl9vbk1lc3NhZ2UpO1xuICAgICAgdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmdW5jdGlvbiBvZiB0aGUgc29ja2V0IGBtZXNzYWdlYCBldmVudC4gVW53cmFwIHRoZSBjaGFubmVsIGFuZFxuICAgKiB0aGUgZGF0YSBjb250YWluZWQgaW4gdGhlIHBheWxvYWQgYW5kIGV4ZWN1dGUgdGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2suXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25NZXNzYWdlKGUpIHtcbiAgICBjb25zdCBpbmRleCA9IG5ldyBVaW50OEFycmF5KGUuZGF0YSlbMF07XG5cbiAgICBpZiAoIXRoaXMuX3Byb3RvY29sW2luZGV4XSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBwcm90b2NvbCBpbmRleDogJHtpbmRleH1gKTtcblxuICAgIGNvbnN0IHsgY2hhbm5lbCwgdHlwZSB9ID0gdGhpcy5fcHJvdG9jb2xbaW5kZXhdO1xuICAgIGNvbnN0IHZpZXdDdG9yID0gd2luZG93W2Ake3R5cGV9QXJyYXlgXTtcbiAgICBjb25zdCBkYXRhID0gbmV3IHZpZXdDdG9yKGUuZGF0YSwgdmlld0N0b3IuQllURVNfUEVSX0VMRU1FTlQpO1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IHRoaXMuX2xpc3RlbmVyc1tjaGFubmVsXTtcblxuICAgIGlmIChjYWxsYmFja3MpXG4gICAgICBjYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKGRhdGEpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gcmVjZWl2aW5nIGEgbWVzc2FnZSBvbiBhIHNwZWNpZmljXG4gICAqIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayBmdW5jdGlvbi5cbiAgICovXG4gIHJlY2VpdmUoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XG5cbiAgICBpZiAoIWxpc3RlbmVyc1tjaGFubmVsXSlcbiAgICAgIGxpc3RlbmVyc1tjaGFubmVsXSA9IG5ldyBTZXQoKTtcblxuICAgIGxpc3RlbmVyc1tjaGFubmVsXS5hZGQoY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgZGF0YSBvbiBhIHNwZWNpZmljIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtUeXBlZEFycmF5fSBkYXRhIC0gRGF0YS5cbiAgICovXG4gIHNlbmQoY2hhbm5lbCwgZGF0YSkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fY2hhbm5lbHMuaW5kZXhPZihjaGFubmVsKTtcblxuICAgIGlmIChpbmRleCA9PT0gLTEpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZGVmaW5lZCBjaGFubmVsIFwiJHtjaGFubmVsfVwiYCk7XG5cbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuX3Byb3RvY29sW2luZGV4XTtcbiAgICBjb25zdCB2aWV3Q3RvciA9IHdpbmRvd1tgJHt0eXBlfUFycmF5YF07XG4gICAgY29uc3Qgc2l6ZSA9IGRhdGEgPyAxICsgZGF0YS5sZW5ndGggOiAxO1xuICAgIGNvbnN0IHZpZXcgPSBuZXcgdmlld0N0b3Ioc2l6ZSk7XG5cbiAgICBjb25zdCBjaGFubmVsVmlldyA9IG5ldyBVaW50OEFycmF5KHZpZXdDdG9yLkJZVEVTX1BFUl9FTEVNRU5UKTtcbiAgICBjaGFubmVsVmlld1swXSA9IGluZGV4O1xuICAgIC8vIHBvcHVsYXRlIGJ1ZmZlclxuICAgIHZpZXcuc2V0KG5ldyB2aWV3Q3RvcihjaGFubmVsVmlldy5idWZmZXIpLCAwKTtcblxuICAgIGlmIChkYXRhKVxuICAgICAgdmlldy5zZXQoZGF0YSwgMSk7XG5cbiAgICB0aGlzLnNvY2tldC5zZW5kKHZpZXcuYnVmZmVyKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBSYXdTb2NrZXQpO1xuXG5leHBvcnQgZGVmYXVsdCBSYXdTb2NrZXQ7XG4iXX0=