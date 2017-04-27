'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _osc = require('osc');

var _osc2 = _interopRequireDefault(_osc);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('soundworks:osc');
var SERVICE_ID = 'service:osc';

/**
 * Interface for the server `'osc'` service.
 *
 * This server-only service provides support for OSC communications with an extenal
 * software (e.g. Max). The configuration of the service (url and port) should be
 * defined in the server configuration, cf. {@link module:soundworks/server.envConfig}.
 *
 * The service currently only supports UDP protocol.
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.osc = this.require('osc');
 * // when the experience has started, listen to incoming message
 * this.osc.receive('/osc/channel1', (values) => {
 *   // do something with `values`
 * });
 * // send a message
 * this.osc.send('/osc/channel2', [0.618, true]);
 */

var Osc = function (_Service) {
  (0, _inherits3.default)(Osc, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function Osc() {
    (0, _classCallCheck3.default)(this, Osc);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Osc.__proto__ || (0, _getPrototypeOf2.default)(Osc)).call(this, SERVICE_ID));

    var defaults = {
      configItem: 'osc'
    };

    _this.configure(defaults);

    _this._listeners = [];
    _this._sharedConfig = _this.require('shared-config');

    _this._onMessage = _this._onMessage.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Osc, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      var oscConfig = this._sharedConfig.get(this.options.configItem);

      if (this.oscConfig === null) throw new Error('"service:osc": server.config.' + configItem + ' is not defined');

      this.osc = new _osc2.default.UDPPort({
        // This is the port we're listening on.
        localAddress: oscConfig.receiveAddress,
        localPort: oscConfig.receivePort,
        // This is the port we use to send messages.
        remoteAddress: oscConfig.sendAddress,
        remotePort: oscConfig.sendPort
      });

      this.osc.on('ready', function () {
        var receive = oscConfig.receiveAddress + ':' + oscConfig.receivePort;
        var send = oscConfig.sendAddress + ':' + oscConfig.sendPort;

        log('[OSC over UDP] Receiving on ' + receive);
        log('[OSC over UDP] Sending on ' + send);

        _this2.ready();
      });

      this.osc.on('message', this._onMessage);
      this.osc.open();
    }

    /**
     * Apply all the listeners according to the address of the message.
     * @private
     */

  }, {
    key: '_onMessage',
    value: function _onMessage(msg) {
      this._listeners.forEach(function (listener) {
        if (msg.address === listener.address) listener.callback.apply(listener, (0, _toConsumableArray3.default)(msg.args));
      });

      log.apply(undefined, ['message - address "' + msg.address + '"'].concat((0, _toConsumableArray3.default)(msg.args)));
    }

    /**
     * Send an OSC message.
     * @param {String} address - Address of the OSC message.
     * @param {Array} args - Arguments of the OSC message.
     * @param {String} [url=null] - URL to send the OSC message to (if not specified,
     *  uses the port defined in the OSC configuration of the {@link server}).
     * @param {Number} [port=null]- Port to send the message to (if not specified,
     *  uses the port defined in the OSC configuration of the {@link server}).
     */

  }, {
    key: 'send',
    value: function send(address, args) {
      var url = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var port = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      var msg = { address: address, args: args };

      try {
        if (url && port) this.osc.send(msg, url, port);else this.osc.send(msg); // use defaults (as defined in the config)
      } catch (e) {
        console.log('Error while sending OSC message:', e);
      }

      log.apply(undefined, ['send - address "' + address + '"'].concat((0, _toConsumableArray3.default)(args)));
    }

    /**
     * Register callbacks for OSC mesages. The server listens to OSC messages
     * at the address and port defined in the configuration of the {@link server}.
     * @param {String} address - Wildcard of the OSC message.
     * @param {Function} callback - Callback function to be executed when an OSC
     *  message is received at the given address.
     */

  }, {
    key: 'receive',
    value: function receive(address, callback) {
      var listener = { address: address, callback: callback };
      this._listeners.push(listener);
    }

    /**
     * @todo - implement
     * @private
     */

  }, {
    key: 'removeListener',
    value: function removeListener(address, callback) {}
  }]);
  return Osc;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Osc);

exports.default = Osc;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9zYy5qcyJdLCJuYW1lcyI6WyJsb2ciLCJTRVJWSUNFX0lEIiwiT3NjIiwiZGVmYXVsdHMiLCJjb25maWdJdGVtIiwiY29uZmlndXJlIiwiX2xpc3RlbmVycyIsIl9zaGFyZWRDb25maWciLCJyZXF1aXJlIiwiX29uTWVzc2FnZSIsImJpbmQiLCJvc2NDb25maWciLCJnZXQiLCJvcHRpb25zIiwiRXJyb3IiLCJvc2MiLCJVRFBQb3J0IiwibG9jYWxBZGRyZXNzIiwicmVjZWl2ZUFkZHJlc3MiLCJsb2NhbFBvcnQiLCJyZWNlaXZlUG9ydCIsInJlbW90ZUFkZHJlc3MiLCJzZW5kQWRkcmVzcyIsInJlbW90ZVBvcnQiLCJzZW5kUG9ydCIsIm9uIiwicmVjZWl2ZSIsInNlbmQiLCJyZWFkeSIsIm9wZW4iLCJtc2ciLCJmb3JFYWNoIiwibGlzdGVuZXIiLCJhZGRyZXNzIiwiY2FsbGJhY2siLCJhcmdzIiwidXJsIiwicG9ydCIsImUiLCJjb25zb2xlIiwicHVzaCIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0EsSUFBTUEsTUFBTSxxQkFBTSxnQkFBTixDQUFaO0FBQ0EsSUFBTUMsYUFBYSxhQUFuQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBb0JNQyxHOzs7QUFDSjtBQUNBLGlCQUFjO0FBQUE7O0FBQUEsZ0lBQ05ELFVBRE07O0FBR1osUUFBTUUsV0FBVztBQUNmQyxrQkFBWTtBQURHLEtBQWpCOztBQUlBLFVBQUtDLFNBQUwsQ0FBZUYsUUFBZjs7QUFFQSxVQUFLRyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsVUFBS0MsYUFBTCxHQUFxQixNQUFLQyxPQUFMLENBQWEsZUFBYixDQUFyQjs7QUFFQSxVQUFLQyxVQUFMLEdBQWtCLE1BQUtBLFVBQUwsQ0FBZ0JDLElBQWhCLE9BQWxCO0FBWlk7QUFhYjs7QUFFRDs7Ozs7NEJBQ1E7QUFBQTs7QUFDTixVQUFNQyxZQUFZLEtBQUtKLGFBQUwsQ0FBbUJLLEdBQW5CLENBQXVCLEtBQUtDLE9BQUwsQ0FBYVQsVUFBcEMsQ0FBbEI7O0FBRUEsVUFBSSxLQUFLTyxTQUFMLEtBQW1CLElBQXZCLEVBQ0UsTUFBTSxJQUFJRyxLQUFKLG1DQUEwQ1YsVUFBMUMscUJBQU47O0FBRUYsV0FBS1csR0FBTCxHQUFXLElBQUksY0FBSUMsT0FBUixDQUFnQjtBQUN6QjtBQUNBQyxzQkFBY04sVUFBVU8sY0FGQztBQUd6QkMsbUJBQVdSLFVBQVVTLFdBSEk7QUFJekI7QUFDQUMsdUJBQWVWLFVBQVVXLFdBTEE7QUFNekJDLG9CQUFZWixVQUFVYTtBQU5HLE9BQWhCLENBQVg7O0FBU0EsV0FBS1QsR0FBTCxDQUFTVSxFQUFULENBQVksT0FBWixFQUFxQixZQUFNO0FBQ3pCLFlBQU1DLFVBQWFmLFVBQVVPLGNBQXZCLFNBQXlDUCxVQUFVUyxXQUF6RDtBQUNBLFlBQU1PLE9BQVVoQixVQUFVVyxXQUFwQixTQUFtQ1gsVUFBVWEsUUFBbkQ7O0FBRUF4Qiw2Q0FBbUMwQixPQUFuQztBQUNBMUIsMkNBQWlDMkIsSUFBakM7O0FBRUEsZUFBS0MsS0FBTDtBQUNELE9BUkQ7O0FBVUEsV0FBS2IsR0FBTCxDQUFTVSxFQUFULENBQVksU0FBWixFQUF1QixLQUFLaEIsVUFBNUI7QUFDQSxXQUFLTSxHQUFMLENBQVNjLElBQVQ7QUFDRDs7QUFFRDs7Ozs7OzsrQkFJV0MsRyxFQUFLO0FBQ2QsV0FBS3hCLFVBQUwsQ0FBZ0J5QixPQUFoQixDQUF3QixVQUFDQyxRQUFELEVBQWM7QUFDcEMsWUFBSUYsSUFBSUcsT0FBSixLQUFnQkQsU0FBU0MsT0FBN0IsRUFDRUQsU0FBU0UsUUFBVCxrREFBcUJKLElBQUlLLElBQXpCO0FBQ0gsT0FIRDs7QUFLQW5DLG9EQUEwQjhCLElBQUlHLE9BQTlCLGdEQUE2Q0gsSUFBSUssSUFBakQ7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7O3lCQVNLRixPLEVBQVNFLEksRUFBK0I7QUFBQSxVQUF6QkMsR0FBeUIsdUVBQW5CLElBQW1CO0FBQUEsVUFBYkMsSUFBYSx1RUFBTixJQUFNOztBQUMzQyxVQUFNUCxNQUFNLEVBQUVHLGdCQUFGLEVBQVdFLFVBQVgsRUFBWjs7QUFFQSxVQUFJO0FBQ0YsWUFBSUMsT0FBT0MsSUFBWCxFQUNFLEtBQUt0QixHQUFMLENBQVNZLElBQVQsQ0FBY0csR0FBZCxFQUFtQk0sR0FBbkIsRUFBd0JDLElBQXhCLEVBREYsS0FHRSxLQUFLdEIsR0FBTCxDQUFTWSxJQUFULENBQWNHLEdBQWQsRUFKQSxDQUlvQjtBQUN2QixPQUxELENBS0UsT0FBT1EsQ0FBUCxFQUFVO0FBQ1ZDLGdCQUFRdkMsR0FBUixDQUFZLGtDQUFaLEVBQWdEc0MsQ0FBaEQ7QUFDRDs7QUFFRHRDLGlEQUF1QmlDLE9BQXZCLGdEQUFzQ0UsSUFBdEM7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs0QkFPUUYsTyxFQUFTQyxRLEVBQVU7QUFDekIsVUFBTUYsV0FBVyxFQUFFQyxnQkFBRixFQUFXQyxrQkFBWCxFQUFqQjtBQUNBLFdBQUs1QixVQUFMLENBQWdCa0MsSUFBaEIsQ0FBcUJSLFFBQXJCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7bUNBSWVDLE8sRUFBU0MsUSxFQUFVLENBQUU7Ozs7O0FBR3RDLHlCQUFlTyxRQUFmLENBQXdCeEMsVUFBeEIsRUFBb0NDLEdBQXBDOztrQkFFZUEsRyIsImZpbGUiOiJPc2MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IG9zYyBmcm9tICdvc2MnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuXG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3Jrczpvc2MnKTtcbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpvc2MnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHNlcnZlciBgJ29zYydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2ZXItb25seSBzZXJ2aWNlIHByb3ZpZGVzIHN1cHBvcnQgZm9yIE9TQyBjb21tdW5pY2F0aW9ucyB3aXRoIGFuIGV4dGVuYWxcbiAqIHNvZnR3YXJlIChlLmcuIE1heCkuIFRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSBzZXJ2aWNlICh1cmwgYW5kIHBvcnQpIHNob3VsZCBiZVxuICogZGVmaW5lZCBpbiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24sIGNmLiB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLmVudkNvbmZpZ30uXG4gKlxuICogVGhlIHNlcnZpY2UgY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgVURQIHByb3RvY29sLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMub3NjID0gdGhpcy5yZXF1aXJlKCdvc2MnKTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWQsIGxpc3RlbiB0byBpbmNvbWluZyBtZXNzYWdlXG4gKiB0aGlzLm9zYy5yZWNlaXZlKCcvb3NjL2NoYW5uZWwxJywgKHZhbHVlcykgPT4ge1xuICogICAvLyBkbyBzb21ldGhpbmcgd2l0aCBgdmFsdWVzYFxuICogfSk7XG4gKiAvLyBzZW5kIGEgbWVzc2FnZVxuICogdGhpcy5vc2Muc2VuZCgnL29zYy9jaGFubmVsMicsIFswLjYxOCwgdHJ1ZV0pO1xuICovXG5jbGFzcyBPc2MgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgY29uZmlnSXRlbTogJ29zYycsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICAgIHRoaXMuX3NoYXJlZENvbmZpZyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuXG4gICAgdGhpcy5fb25NZXNzYWdlID0gdGhpcy5fb25NZXNzYWdlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgY29uc3Qgb3NjQ29uZmlnID0gdGhpcy5fc2hhcmVkQ29uZmlnLmdldCh0aGlzLm9wdGlvbnMuY29uZmlnSXRlbSk7XG5cbiAgICBpZiAodGhpcy5vc2NDb25maWcgPT09IG51bGwpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFwic2VydmljZTpvc2NcIjogc2VydmVyLmNvbmZpZy4ke2NvbmZpZ0l0ZW19IGlzIG5vdCBkZWZpbmVkYCk7XG5cbiAgICB0aGlzLm9zYyA9IG5ldyBvc2MuVURQUG9ydCh7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBwb3J0IHdlJ3JlIGxpc3RlbmluZyBvbi5cbiAgICAgIGxvY2FsQWRkcmVzczogb3NjQ29uZmlnLnJlY2VpdmVBZGRyZXNzLFxuICAgICAgbG9jYWxQb3J0OiBvc2NDb25maWcucmVjZWl2ZVBvcnQsXG4gICAgICAvLyBUaGlzIGlzIHRoZSBwb3J0IHdlIHVzZSB0byBzZW5kIG1lc3NhZ2VzLlxuICAgICAgcmVtb3RlQWRkcmVzczogb3NjQ29uZmlnLnNlbmRBZGRyZXNzLFxuICAgICAgcmVtb3RlUG9ydDogb3NjQ29uZmlnLnNlbmRQb3J0LFxuICAgIH0pO1xuXG4gICAgdGhpcy5vc2Mub24oJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVjZWl2ZSA9IGAke29zY0NvbmZpZy5yZWNlaXZlQWRkcmVzc306JHtvc2NDb25maWcucmVjZWl2ZVBvcnR9YDtcbiAgICAgIGNvbnN0IHNlbmQgPSBgJHtvc2NDb25maWcuc2VuZEFkZHJlc3N9OiR7b3NjQ29uZmlnLnNlbmRQb3J0fWA7XG5cbiAgICAgIGxvZyhgW09TQyBvdmVyIFVEUF0gUmVjZWl2aW5nIG9uICR7cmVjZWl2ZX1gKTtcbiAgICAgIGxvZyhgW09TQyBvdmVyIFVEUF0gU2VuZGluZyBvbiAke3NlbmR9YCk7XG5cbiAgICAgIHRoaXMucmVhZHkoKTtcbiAgICB9KTtcblxuICAgIHRoaXMub3NjLm9uKCdtZXNzYWdlJywgdGhpcy5fb25NZXNzYWdlKTtcbiAgICB0aGlzLm9zYy5vcGVuKCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgYWxsIHRoZSBsaXN0ZW5lcnMgYWNjb3JkaW5nIHRvIHRoZSBhZGRyZXNzIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uTWVzc2FnZShtc2cpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgIGlmIChtc2cuYWRkcmVzcyA9PT0gbGlzdGVuZXIuYWRkcmVzcylcbiAgICAgICAgbGlzdGVuZXIuY2FsbGJhY2soLi4ubXNnLmFyZ3MpO1xuICAgIH0pO1xuXG4gICAgbG9nKGBtZXNzYWdlIC0gYWRkcmVzcyBcIiR7bXNnLmFkZHJlc3N9XCJgLCAuLi5tc2cuYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhbiBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGFkZHJlc3MgLSBBZGRyZXNzIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtBcnJheX0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdXJsPW51bGxdIC0gVVJMIHRvIHNlbmQgdGhlIE9TQyBtZXNzYWdlIHRvIChpZiBub3Qgc3BlY2lmaWVkLFxuICAgKiAgdXNlcyB0aGUgcG9ydCBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlndXJhdGlvbiBvZiB0aGUge0BsaW5rIHNlcnZlcn0pLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BvcnQ9bnVsbF0tIFBvcnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCxcbiAgICogIHVzZXMgdGhlIHBvcnQgZGVmaW5lZCBpbiB0aGUgT1NDIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHtAbGluayBzZXJ2ZXJ9KS5cbiAgICovXG4gIHNlbmQoYWRkcmVzcywgYXJncywgdXJsID0gbnVsbCwgcG9ydCA9IG51bGwpIHtcbiAgICBjb25zdCBtc2cgPSB7IGFkZHJlc3MsIGFyZ3MgfTtcblxuICAgIHRyeSB7XG4gICAgICBpZiAodXJsICYmIHBvcnQpXG4gICAgICAgIHRoaXMub3NjLnNlbmQobXNnLCB1cmwsIHBvcnQpO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLm9zYy5zZW5kKG1zZyk7IC8vIHVzZSBkZWZhdWx0cyAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBzZW5kaW5nIE9TQyBtZXNzYWdlOicsIGUpO1xuICAgIH1cblxuICAgIGxvZyhgc2VuZCAtIGFkZHJlc3MgXCIke2FkZHJlc3N9XCJgLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBjYWxsYmFja3MgZm9yIE9TQyBtZXNhZ2VzLiBUaGUgc2VydmVyIGxpc3RlbnMgdG8gT1NDIG1lc3NhZ2VzXG4gICAqIGF0IHRoZSBhZGRyZXNzIGFuZCBwb3J0IGRlZmluZWQgaW4gdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHtAbGluayBzZXJ2ZXJ9LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzcyAtIFdpbGRjYXJkIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCB3aGVuIGFuIE9TQ1xuICAgKiAgbWVzc2FnZSBpcyByZWNlaXZlZCBhdCB0aGUgZ2l2ZW4gYWRkcmVzcy5cbiAgICovXG4gIHJlY2VpdmUoYWRkcmVzcywgY2FsbGJhY2spIHtcbiAgICBjb25zdCBsaXN0ZW5lciA9IHsgYWRkcmVzcywgY2FsbGJhY2sgfTtcbiAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gIH1cblxuICAvKipcbiAgICogQHRvZG8gLSBpbXBsZW1lbnRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGFkZHJlc3MsIGNhbGxiYWNrKSB7fVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBPc2MpO1xuXG5leHBvcnQgZGVmYXVsdCBPc2M7XG4iXX0=