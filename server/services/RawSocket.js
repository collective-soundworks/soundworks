'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

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

var _server = require('../core/server');

var _server2 = _interopRequireDefault(_server);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _uws = require('uws');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _pem = require('pem');

var _pem2 = _interopRequireDefault(_pem);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:raw-socket';

/**
 * Protocol defined in configuration is added to these two entry that manage
 * the handshake at the creation of the socket.
 * @private
 */
var baseProtocol = [{ channel: 'service:handshake', type: 'Uint32' }, { channel: 'service:handshake-ack', type: 'Uint8' }];

/**
 * Counter that create tokens in order to match sockets and clients.
 * @private
 */
var counter = 0;

/**
 * Interface for the `raw-socket` service.
 *
 * This service creates an additionnal native socket with its binary type set
 * to `arraybuffer` and focused on performances.
 * It allows the transfert of `TypedArray` data wrapped with a minimal channel
 * mechanism (up to 256 channels).
 *
 * The user-defined protocol must follow the convention:
 * @example
 * const protocol = [
 *   { channel: 'my-channel', type: 'Float32' }
 *   // ...
 * ]
 *
 * Where the `channel` can be any string and the `type` can be interpolated
 * to any `TypedArray` by concatenating `'Array'` at its end.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.RawSocket}*__
 *
 * @memberof module:soundworks/server
 */

var RawSocket = function (_Service) {
  (0, _inherits3.default)(RawSocket, _Service);

  function RawSocket() {
    (0, _classCallCheck3.default)(this, RawSocket);

    var _this = (0, _possibleConstructorReturn3.default)(this, (RawSocket.__proto__ || (0, _getPrototypeOf2.default)(RawSocket)).call(this, SERVICE_ID));

    var defaults = {
      configItem: 'rawSocket'
    };

    _this.configure(defaults);

    _this._port = null;
    _this._protocol = null;
    _this._channels = null;

    /**
     * Listeners for the incomming messages.
     *
     * @type {Map<client, Set<Function>>}
     * @name _listeners
     * @memberof module:soundworks/server.RawSocket
     * @instance
     * @private
     */
    _this._listeners = new _map2.default();

    _this._tokenClientMap = new _map2.default();
    _this._clientSocketMap = new _map2.default();
    _this._socketClientMap = new _map2.default();

    _this._protocol = baseProtocol;

    // retrieve service config + useHttps
    _this._sharedConfig = _this.require('shared-config');

    _this._onConnection = _this._onConnection.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(RawSocket, [{
    key: 'configure',
    value: function configure(options) {
      if (options.protocol) this._protocol = this._protocol.concat(options.protocol);

      (0, _get3.default)(RawSocket.prototype.__proto__ || (0, _getPrototypeOf2.default)(RawSocket.prototype), 'configure', this).call(this, options);
    }
  }, {
    key: 'addProtocolDefinition',
    value: function addProtocolDefinition(def) {
      this._protocol.push(def);
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)(RawSocket.prototype.__proto__ || (0, _getPrototypeOf2.default)(RawSocket.prototype), 'start', this).call(this);

      var configItem = this.options.configItem;
      var config = this._sharedConfig.get(configItem);

      this._port = config.port;

      if (Array.isArray(config.protocol)) this._protocol = this.protocol.concat(config.protocol);

      this._channels = this._protocol.map(function (def) {
        return def.channel;
      });

      // check http / https mode
      var useHttps = _server2.default.config.useHttps;

      // launch http(s) server
      if (!useHttps) {
        var httpServer = _http2.default.createServer();
        this.runServer(httpServer);
      } else {
        var httpsInfos = _server2.default.config.httpsInfos;

        // use given certificate
        if (httpsInfos.key && httpsInfos.cert) {
          var key = _fs2.default.readFileSync(httpsInfos.key);
          var cert = _fs2.default.readFileSync(httpsInfos.cert);

          var httpsServer = _https2.default.createServer({ key: key, cert: cert });
          this.runServer(httpsServer);
          // generate certificate on the fly (for development purposes)
        } else {
          _pem2.default.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
            var httpsServer = _https2.default.createServer({ key: keys.serviceKey, cert: keys.certificate });
            _this2.runServer(httpsServer);
          });
        }
      }
    }
  }, {
    key: 'runServer',
    value: function runServer(server) {
      server.listen(this._port, function () {
        // console.log(SERVICE_ID, ': Https server listening on port:', this._port);
      });

      this._wss = new _uws.Server({ server: server });
      this._wss.on('connection', this._onConnection);
      this.ready();
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      var _this3 = this;

      // send infos to create the socket to the client
      (0, _get3.default)(RawSocket.prototype.__proto__ || (0, _getPrototypeOf2.default)(RawSocket.prototype), 'receive', this).call(this, client, 'request', function () {
        var token = counter += 1;
        _this3._tokenClientMap.set(token, client);

        (0, _get3.default)(RawSocket.prototype.__proto__ || (0, _getPrototypeOf2.default)(RawSocket.prototype), 'send', _this3).call(_this3, client, 'infos', _this3._port, _this3._protocol, token);
      });
    }
  }, {
    key: 'disconect',
    value: function disconect(client) {
      var socket = this._clientSocketMap.get(client);

      this._clientSocketMap.delete(client);
      this._socketClientMap.delete(socket);
    }

    /** @private */

  }, {
    key: '_onConnection',
    value: function _onConnection(socket) {
      var _this4 = this;

      socket.on('message', function (buffer) {
        buffer = new Uint8Array(buffer).buffer;
        var index = new Uint8Array(buffer)[0];

        if (!_this4._protocol[index]) throw new Error('Invalid protocol index: ${index}');

        var _protocol$index = _this4._protocol[index],
            channel = _protocol$index.channel,
            type = _protocol$index.type;

        var viewCtor = global[type + 'Array'];
        var data = new viewCtor(buffer, viewCtor.BYTES_PER_ELEMENT);

        if (channel === 'service:handshake') _this4._pairClientSocket(socket, data[0]);else _this4._propagateEvent(socket, channel, data);
      });
    }

    /**
     * Associate the socket with the corresponding client according to the `token`
     *
     * @param {Socket} socket - Socket which receive the message.
     * @param {Number} token - Token to match the client associated to the socket.
     * @private
     */

  }, {
    key: '_pairClientSocket',
    value: function _pairClientSocket(socket, token) {
      var client = this._tokenClientMap.get(token);
      this._clientSocketMap.set(client, socket);
      this._socketClientMap.set(socket, client);
      this._tokenClientMap.delete(token);

      this.send(client, 'service:handshake-ack');
    }

    /**
     * Call all the registered listener associated to a client.
     *
     * @param {Socket} socket - Socket which received the message.
     * @param {String} channel - Channel of the message.
     * @param {TypedArray} data - Received data.
     * @private
     */

  }, {
    key: '_propagateEvent',
    value: function _propagateEvent(socket, channel, data) {
      var client = this._socketClientMap.get(socket);
      var clientListeners = this._listeners.get(client);
      var callbacks = clientListeners[channel];

      callbacks.forEach(function (callback) {
        return callback(data);
      });
    }

    /**
     * Register a callback function on a specific channel.
     *
     * @param {client} client - Client to listen the message from.
     * @param {String} channel - Channel of the message.
     * @param {Function} callback - Callback function.
     */

  }, {
    key: 'receive',
    value: function receive(client, channel, callback) {
      var listeners = this._listeners;

      if (!listeners.has(client)) listeners.set(client, {});

      var clientListeners = listeners.get(client);

      if (!clientListeners[channel]) clientListeners[channel] = new _set2.default();

      clientListeners[channel].add(callback);
    }

    /**
     * Send data to a specific client, on a given channel.
     *
     * @param {client} client - Client to send the message to.
     * @param {String} channel - Channel of the message.
     * @param {TypedArray} data - Data.
     */

  }, {
    key: 'send',
    value: function send(client, channel, data) {
      var socket = this._clientSocketMap.get(client);
      var index = this._channels.indexOf(channel);

      if (index === -1) throw new Error('Undefined channel "' + channel + '"');

      var type = this._protocol[index].type;

      var viewCtor = global[type + 'Array'];
      var size = data ? 1 + data.length : 1;
      var view = new viewCtor(size);

      var channelView = new Uint8Array(viewCtor.BYTES_PER_ELEMENT);
      channelView[0] = index;
      // populate final buffer
      view.set(new viewCtor(channelView.buffer), 0);

      if (data) view.set(data, 1);

      socket.send(view.buffer);
    }

    /**
     * Broadcast data to several client at once.
     *
     * @param {String|Array} clientType - Type or types of client to send the
     *  message to.
     * @param {client} excludeClient - Client to exclude from the broadcast.
     * @param {String} channel - Channel of the message.
     * @param {TypedArray} data - Data.
     */

  }, {
    key: 'broadcast',
    value: function broadcast(clientType, excludeClient, channel, data) {
      if (!Array.isArray(clientType)) clientType = [clientType];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this._clientSocketMap.keys()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var client = _step.value;

          if (clientType.indexOf(client.type) !== -1 && client !== excludeClient) this.send(client, channel, data);
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
    }
  }]);
  return RawSocket;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, RawSocket);

exports.default = RawSocket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJhd1NvY2tldC5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiYmFzZVByb3RvY29sIiwiY2hhbm5lbCIsInR5cGUiLCJjb3VudGVyIiwiUmF3U29ja2V0IiwiZGVmYXVsdHMiLCJjb25maWdJdGVtIiwiY29uZmlndXJlIiwiX3BvcnQiLCJfcHJvdG9jb2wiLCJfY2hhbm5lbHMiLCJfbGlzdGVuZXJzIiwiX3Rva2VuQ2xpZW50TWFwIiwiX2NsaWVudFNvY2tldE1hcCIsIl9zb2NrZXRDbGllbnRNYXAiLCJfc2hhcmVkQ29uZmlnIiwicmVxdWlyZSIsIl9vbkNvbm5lY3Rpb24iLCJiaW5kIiwib3B0aW9ucyIsInByb3RvY29sIiwiY29uY2F0IiwiZGVmIiwicHVzaCIsImNvbmZpZyIsImdldCIsInBvcnQiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJ1c2VIdHRwcyIsImh0dHBTZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJydW5TZXJ2ZXIiLCJodHRwc0luZm9zIiwia2V5IiwiY2VydCIsInJlYWRGaWxlU3luYyIsImh0dHBzU2VydmVyIiwiY3JlYXRlQ2VydGlmaWNhdGUiLCJkYXlzIiwic2VsZlNpZ25lZCIsImVyciIsImtleXMiLCJzZXJ2aWNlS2V5IiwiY2VydGlmaWNhdGUiLCJzZXJ2ZXIiLCJsaXN0ZW4iLCJfd3NzIiwib24iLCJyZWFkeSIsImNsaWVudCIsInRva2VuIiwic2V0Iiwic29ja2V0IiwiZGVsZXRlIiwiYnVmZmVyIiwiVWludDhBcnJheSIsImluZGV4IiwiRXJyb3IiLCJ2aWV3Q3RvciIsImdsb2JhbCIsImRhdGEiLCJCWVRFU19QRVJfRUxFTUVOVCIsIl9wYWlyQ2xpZW50U29ja2V0IiwiX3Byb3BhZ2F0ZUV2ZW50Iiwic2VuZCIsImNsaWVudExpc3RlbmVycyIsImNhbGxiYWNrcyIsImZvckVhY2giLCJjYWxsYmFjayIsImxpc3RlbmVycyIsImhhcyIsImFkZCIsImluZGV4T2YiLCJzaXplIiwibGVuZ3RoIiwidmlldyIsImNoYW5u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QVYsRUFBa0JsRCxPQUFsQixFQUEyQjZELElBQTNCO0FBQ0g7QUFQaUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFuRDs7Ozs7QUFHSCx5QkFBZW1CLFFBQWYsQ0FBd0JsRixVQUF4QixFQUFvQ0ssU0FBcEM7O2tCQUVlQSxTIiwiZmlsZSI6IlJhd1NvY2tldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzZXJ2ZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXInO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB7IFNlcnZlciBhcyBXZWJTb2NrZXRTZXJ2ZXIgfSBmcm9tICd1d3MnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgaHR0cHMgZnJvbSAnaHR0cHMnO1xuaW1wb3J0IHBlbSBmcm9tICdwZW0nO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnJhdy1zb2NrZXQnO1xuXG5cbi8qKlxuICogUHJvdG9jb2wgZGVmaW5lZCBpbiBjb25maWd1cmF0aW9uIGlzIGFkZGVkIHRvIHRoZXNlIHR3byBlbnRyeSB0aGF0IG1hbmFnZVxuICogdGhlIGhhbmRzaGFrZSBhdCB0aGUgY3JlYXRpb24gb2YgdGhlIHNvY2tldC5cbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IGJhc2VQcm90b2NvbCA9IFtcbiAgeyBjaGFubmVsOiAnc2VydmljZTpoYW5kc2hha2UnLCB0eXBlOiAnVWludDMyJyB9LFxuICB7IGNoYW5uZWw6ICdzZXJ2aWNlOmhhbmRzaGFrZS1hY2snLCB0eXBlOiAnVWludDgnIH0sXG5dO1xuXG4vKipcbiAqIENvdW50ZXIgdGhhdCBjcmVhdGUgdG9rZW5zIGluIG9yZGVyIHRvIG1hdGNoIHNvY2tldHMgYW5kIGNsaWVudHMuXG4gKiBAcHJpdmF0ZVxuICovXG5sZXQgY291bnRlciA9IDA7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgYHJhdy1zb2NrZXRgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGNyZWF0ZXMgYW4gYWRkaXRpb25uYWwgbmF0aXZlIHNvY2tldCB3aXRoIGl0cyBiaW5hcnkgdHlwZSBzZXRcbiAqIHRvIGBhcnJheWJ1ZmZlcmAgYW5kIGZvY3VzZWQgb24gcGVyZm9ybWFuY2VzLlxuICogSXQgYWxsb3dzIHRoZSB0cmFuc2ZlcnQgb2YgYFR5cGVkQXJyYXlgIGRhdGEgd3JhcHBlZCB3aXRoIGEgbWluaW1hbCBjaGFubmVsXG4gKiBtZWNoYW5pc20gKHVwIHRvIDI1NiBjaGFubmVscykuXG4gKlxuICogVGhlIHVzZXItZGVmaW5lZCBwcm90b2NvbCBtdXN0IGZvbGxvdyB0aGUgY29udmVudGlvbjpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBwcm90b2NvbCA9IFtcbiAqICAgeyBjaGFubmVsOiAnbXktY2hhbm5lbCcsIHR5cGU6ICdGbG9hdDMyJyB9XG4gKiAgIC8vIC4uLlxuICogXVxuICpcbiAqIFdoZXJlIHRoZSBgY2hhbm5lbGAgY2FuIGJlIGFueSBzdHJpbmcgYW5kIHRoZSBgdHlwZWAgY2FuIGJlIGludGVycG9sYXRlZFxuICogdG8gYW55IGBUeXBlZEFycmF5YCBieSBjb25jYXRlbmF0aW5nIGAnQXJyYXknYCBhdCBpdHMgZW5kLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5SYXdTb2NrZXR9Kl9fXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICovXG5jbGFzcyBSYXdTb2NrZXQgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbmZpZ0l0ZW06ICdyYXdTb2NrZXQnLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9wb3J0ID0gbnVsbDtcbiAgICB0aGlzLl9wcm90b2NvbCA9IG51bGw7XG4gICAgdGhpcy5fY2hhbm5lbHMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTGlzdGVuZXJzIGZvciB0aGUgaW5jb21taW5nIG1lc3NhZ2VzLlxuICAgICAqXG4gICAgICogQHR5cGUge01hcDxjbGllbnQsIFNldDxGdW5jdGlvbj4+fVxuICAgICAqIEBuYW1lIF9saXN0ZW5lcnNcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlJhd1NvY2tldFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5fdG9rZW5DbGllbnRNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fY2xpZW50U29ja2V0TWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX3NvY2tldENsaWVudE1hcCA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMuX3Byb3RvY29sID0gYmFzZVByb3RvY29sO1xuXG4gICAgLy8gcmV0cmlldmUgc2VydmljZSBjb25maWcgKyB1c2VIdHRwc1xuICAgIHRoaXMuX3NoYXJlZENvbmZpZyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuXG4gICAgdGhpcy5fb25Db25uZWN0aW9uID0gdGhpcy5fb25Db25uZWN0aW9uLmJpbmQodGhpcyk7XG4gIH1cblxuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLnByb3RvY29sKVxuICAgICAgdGhpcy5fcHJvdG9jb2wgPSB0aGlzLl9wcm90b2NvbC5jb25jYXQob3B0aW9ucy5wcm90b2NvbCk7XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICBhZGRQcm90b2NvbERlZmluaXRpb24oZGVmKSB7XG4gICAgdGhpcy5fcHJvdG9jb2wucHVzaChkZWYpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBjb25zdCBjb25maWdJdGVtID0gdGhpcy5vcHRpb25zLmNvbmZpZ0l0ZW07XG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5fc2hhcmVkQ29uZmlnLmdldChjb25maWdJdGVtKTtcblxuICAgIHRoaXMuX3BvcnQgPSBjb25maWcucG9ydDtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGNvbmZpZy5wcm90b2NvbCkpXG4gICAgICB0aGlzLl9wcm90b2NvbCA9IHRoaXMucHJvdG9jb2wuY29uY2F0KGNvbmZpZy5wcm90b2NvbCk7XG5cbiAgICB0aGlzLl9jaGFubmVscyA9IHRoaXMuX3Byb3RvY29sLm1hcCgoZGVmKSA9PiBkZWYuY2hhbm5lbCk7XG5cbiAgICAvLyBjaGVjayBodHRwIC8gaHR0cHMgbW9kZVxuICAgIGxldCB1c2VIdHRwcyA9IHNlcnZlci5jb25maWcudXNlSHR0cHM7XG5cbiAgICAvLyBsYXVuY2ggaHR0cChzKSBzZXJ2ZXJcbiAgICBpZiAoIXVzZUh0dHBzKSB7XG4gICAgICBsZXQgaHR0cFNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKCk7XG4gICAgICB0aGlzLnJ1blNlcnZlcihodHRwU2VydmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaHR0cHNJbmZvcyA9IHNlcnZlci5jb25maWcuaHR0cHNJbmZvcztcblxuICAgICAgLy8gdXNlIGdpdmVuIGNlcnRpZmljYXRlXG4gICAgICBpZiAoaHR0cHNJbmZvcy5rZXkgJiYgaHR0cHNJbmZvcy5jZXJ0KSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGZzLnJlYWRGaWxlU3luYyhodHRwc0luZm9zLmtleSk7XG4gICAgICAgIGNvbnN0IGNlcnQgPSBmcy5yZWFkRmlsZVN5bmMoaHR0cHNJbmZvcy5jZXJ0KTtcblxuICAgICAgICBsZXQgaHR0cHNTZXJ2ZXIgPSBodHRwcy5jcmVhdGVTZXJ2ZXIoeyBrZXk6IGtleSwgY2VydDogY2VydCB9KTtcbiAgICAgICAgdGhpcy5ydW5TZXJ2ZXIoaHR0cHNTZXJ2ZXIpO1xuICAgICAgLy8gZ2VuZXJhdGUgY2VydGlmaWNhdGUgb24gdGhlIGZseSAoZm9yIGRldmVsb3BtZW50IHB1cnBvc2VzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVtLmNyZWF0ZUNlcnRpZmljYXRlKHsgZGF5czogMSwgc2VsZlNpZ25lZDogdHJ1ZSB9LCAoZXJyLCBrZXlzKSA9PiB7XG4gICAgICAgICAgbGV0IGh0dHBzU2VydmVyID0gaHR0cHMuY3JlYXRlU2VydmVyKHsga2V5OiBrZXlzLnNlcnZpY2VLZXksIGNlcnQ6IGtleXMuY2VydGlmaWNhdGUgfSk7XG4gICAgICAgICAgdGhpcy5ydW5TZXJ2ZXIoaHR0cHNTZXJ2ZXIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBydW5TZXJ2ZXIoc2VydmVyKXtcbiAgICBzZXJ2ZXIubGlzdGVuKHRoaXMuX3BvcnQsICgpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFNFUlZJQ0VfSUQsICc6IEh0dHBzIHNlcnZlciBsaXN0ZW5pbmcgb24gcG9ydDonLCB0aGlzLl9wb3J0KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3dzcyA9IG5ldyBXZWJTb2NrZXRTZXJ2ZXIoeyBzZXJ2ZXI6IHNlcnZlciB9KTtcbiAgICB0aGlzLl93c3Mub24oJ2Nvbm5lY3Rpb24nLCB0aGlzLl9vbkNvbm5lY3Rpb24pO1xuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIHNlbmQgaW5mb3MgdG8gY3JlYXRlIHRoZSBzb2NrZXQgdG8gdGhlIGNsaWVudFxuICAgIHN1cGVyLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gY291bnRlciArPSAxO1xuICAgICAgdGhpcy5fdG9rZW5DbGllbnRNYXAuc2V0KHRva2VuLCBjbGllbnQpO1xuXG4gICAgICBzdXBlci5zZW5kKGNsaWVudCwgJ2luZm9zJywgdGhpcy5fcG9ydCwgdGhpcy5fcHJvdG9jb2wsIHRva2VuKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRpc2NvbmVjdChjbGllbnQpIHtcbiAgICBjb25zdCBzb2NrZXQgPSB0aGlzLl9jbGllbnRTb2NrZXRNYXAuZ2V0KGNsaWVudCk7XG5cbiAgICB0aGlzLl9jbGllbnRTb2NrZXRNYXAuZGVsZXRlKGNsaWVudCk7XG4gICAgdGhpcy5fc29ja2V0Q2xpZW50TWFwLmRlbGV0ZShzb2NrZXQpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkNvbm5lY3Rpb24oc29ja2V0KSB7XG4gICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgKGJ1ZmZlcikgPT4ge1xuICAgICAgYnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKS5idWZmZXI7XG4gICAgICBjb25zdCBpbmRleCA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcilbMF07XG5cbiAgICAgIGlmICghdGhpcy5fcHJvdG9jb2xbaW5kZXhdKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcHJvdG9jb2wgaW5kZXg6ICR7aW5kZXh9Jyk7XG5cbiAgICAgIGNvbnN0IHsgY2hhbm5lbCwgdHlwZSB9ID0gdGhpcy5fcHJvdG9jb2xbaW5kZXhdO1xuICAgICAgY29uc3Qgdmlld0N0b3IgPSBnbG9iYWxbYCR7dHlwZX1BcnJheWBdO1xuICAgICAgY29uc3QgZGF0YSA9IG5ldyB2aWV3Q3RvcihidWZmZXIsIHZpZXdDdG9yLkJZVEVTX1BFUl9FTEVNRU5UKTtcblxuICAgICAgaWYgKGNoYW5uZWwgPT09ICdzZXJ2aWNlOmhhbmRzaGFrZScpXG4gICAgICAgIHRoaXMuX3BhaXJDbGllbnRTb2NrZXQoc29ja2V0LCBkYXRhWzBdKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5fcHJvcGFnYXRlRXZlbnQoc29ja2V0LCBjaGFubmVsLCBkYXRhKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NvY2lhdGUgdGhlIHNvY2tldCB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIGNsaWVudCBhY2NvcmRpbmcgdG8gdGhlIGB0b2tlbmBcbiAgICpcbiAgICogQHBhcmFtIHtTb2NrZXR9IHNvY2tldCAtIFNvY2tldCB3aGljaCByZWNlaXZlIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdG9rZW4gLSBUb2tlbiB0byBtYXRjaCB0aGUgY2xpZW50IGFzc29jaWF0ZWQgdG8gdGhlIHNvY2tldC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9wYWlyQ2xpZW50U29ja2V0KHNvY2tldCwgdG9rZW4pIHtcbiAgICBjb25zdCBjbGllbnQgPSB0aGlzLl90b2tlbkNsaWVudE1hcC5nZXQodG9rZW4pO1xuICAgIHRoaXMuX2NsaWVudFNvY2tldE1hcC5zZXQoY2xpZW50LCBzb2NrZXQpO1xuICAgIHRoaXMuX3NvY2tldENsaWVudE1hcC5zZXQoc29ja2V0LCBjbGllbnQpO1xuICAgIHRoaXMuX3Rva2VuQ2xpZW50TWFwLmRlbGV0ZSh0b2tlbik7XG5cbiAgICB0aGlzLnNlbmQoY2xpZW50LCAnc2VydmljZTpoYW5kc2hha2UtYWNrJyk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbCBhbGwgdGhlIHJlZ2lzdGVyZWQgbGlzdGVuZXIgYXNzb2NpYXRlZCB0byBhIGNsaWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtTb2NrZXR9IHNvY2tldCAtIFNvY2tldCB3aGljaCByZWNlaXZlZCB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBDaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1R5cGVkQXJyYXl9IGRhdGEgLSBSZWNlaXZlZCBkYXRhLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3Byb3BhZ2F0ZUV2ZW50KHNvY2tldCwgY2hhbm5lbCwgZGF0YSkge1xuICAgIGNvbnN0IGNsaWVudCA9IHRoaXMuX3NvY2tldENsaWVudE1hcC5nZXQoc29ja2V0KTtcbiAgICBjb25zdCBjbGllbnRMaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGNsaWVudCk7XG4gICAgY29uc3QgY2FsbGJhY2tzID0gY2xpZW50TGlzdGVuZXJzW2NoYW5uZWxdO1xuXG4gICAgY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjayhkYXRhKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBjYWxsYmFjayBmdW5jdGlvbiBvbiBhIHNwZWNpZmljIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7Y2xpZW50fSBjbGllbnQgLSBDbGllbnQgdG8gbGlzdGVuIHRoZSBtZXNzYWdlIGZyb20uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayBmdW5jdGlvbi5cbiAgICovXG4gIHJlY2VpdmUoY2xpZW50LCBjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcblxuICAgIGlmICghbGlzdGVuZXJzLmhhcyhjbGllbnQpKVxuICAgICAgbGlzdGVuZXJzLnNldChjbGllbnQsIHt9KTtcblxuICAgIGNvbnN0IGNsaWVudExpc3RlbmVycyA9IGxpc3RlbmVycy5nZXQoY2xpZW50KTtcblxuICAgIGlmICghY2xpZW50TGlzdGVuZXJzW2NoYW5uZWxdKVxuICAgICAgY2xpZW50TGlzdGVuZXJzW2NoYW5uZWxdID0gbmV3IFNldCgpO1xuXG4gICAgY2xpZW50TGlzdGVuZXJzW2NoYW5uZWxdLmFkZChjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBkYXRhIHRvIGEgc3BlY2lmaWMgY2xpZW50LCBvbiBhIGdpdmVuIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7Y2xpZW50fSBjbGllbnQgLSBDbGllbnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0by5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBDaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1R5cGVkQXJyYXl9IGRhdGEgLSBEYXRhLlxuICAgKi9cbiAgc2VuZChjbGllbnQsIGNoYW5uZWwsIGRhdGEpIHtcbiAgICBjb25zdCBzb2NrZXQgPSB0aGlzLl9jbGllbnRTb2NrZXRNYXAuZ2V0KGNsaWVudCk7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9jaGFubmVscy5pbmRleE9mKGNoYW5uZWwpO1xuXG4gICAgaWYgKGluZGV4ID09PSAtMSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5kZWZpbmVkIGNoYW5uZWwgXCIke2NoYW5uZWx9XCJgKTtcblxuICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5fcHJvdG9jb2xbaW5kZXhdO1xuICAgIGNvbnN0IHZpZXdDdG9yID0gZ2xvYmFsW2Ake3R5cGV9QXJyYXlgXTtcbiAgICBjb25zdCBzaXplID0gZGF0YSA/IDEgKyBkYXRhLmxlbmd0aCA6IDE7XG4gICAgY29uc3QgdmlldyA9IG5ldyB2aWV3Q3RvcihzaXplKTtcblxuICAgIGNvbnN0IGNoYW5uZWxWaWV3ID0gbmV3IFVpbnQ4QXJyYXkodmlld0N0b3IuQllURVNfUEVSX0VMRU1FTlQpO1xuICAgIGNoYW5uZWxWaWV3WzBdID0gaW5kZXg7XG4gICAgLy8gcG9wdWxhdGUgZmluYWwgYnVmZmVyXG4gICAgdmlldy5zZXQobmV3IHZpZXdDdG9yKGNoYW5uZWxWaWV3LmJ1ZmZlciksIDApO1xuXG4gICAgaWYgKGRhdGEpXG4gICAgICB2aWV3LnNldChkYXRhLCAxKTtcblxuICAgIHNvY2tldC5zZW5kKHZpZXcuYnVmZmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCcm9hZGNhc3QgZGF0YSB0byBzZXZlcmFsIGNsaWVudCBhdCBvbmNlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gY2xpZW50VHlwZSAtIFR5cGUgb3IgdHlwZXMgb2YgY2xpZW50IHRvIHNlbmQgdGhlXG4gICAqICBtZXNzYWdlIHRvLlxuICAgKiBAcGFyYW0ge2NsaWVudH0gZXhjbHVkZUNsaWVudCAtIENsaWVudCB0byBleGNsdWRlIGZyb20gdGhlIGJyb2FkY2FzdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBDaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1R5cGVkQXJyYXl9IGRhdGEgLSBEYXRhLlxuICAgKi9cbiAgYnJvYWRjYXN0KGNsaWVudFR5cGUsIGV4Y2x1ZGVDbGllbnQsIGNoYW5uZWwsIGRhdGEpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoY2xpZW50VHlwZSkpXG4gICAgICBjbGllbnRUeXBlID0gW2NsaWVudFR5cGVdO1xuXG4gICAgZm9yIChsZXQgY2xpZW50IG9mIHRoaXMuX2NsaWVudFNvY2tldE1hcC5rZXlzKCkpIHtcbiAgICAgIGlmIChjbGllbnRUeXBlLmluZGV4T2YoY2xpZW50LnR5cGUpICE9PSAtMSAmJiBjbGllbnQgIT09IGV4Y2x1ZGVDbGllbnQpXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsIGNoYW5uZWwsIGRhdGEpO1xuICAgIH1cbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBSYXdTb2NrZXQpO1xuXG5leHBvcnQgZGVmYXVsdCBSYXdTb2NrZXQ7XG4iXX0=