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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9zYy5qcyJdLCJuYW1lcyI6WyJsb2ciLCJTRVJWSUNFX0lEIiwiT3NjIiwiZGVmYXVsdHMiLCJjb25maWdJdGVtIiwiY29uZmlndXJlIiwiX2xpc3RlbmVycyIsIl9zaGFyZWRDb25maWciLCJyZXF1aXJlIiwiX29uTWVzc2FnZSIsImJpbmQiLCJvc2NDb25maWciLCJnZXQiLCJvcHRpb25zIiwiRXJyb3IiLCJvc2MiLCJVRFBQb3J0IiwibG9jYWxBZGRyZXNzIiwicmVjZWl2ZUFkZHJlc3MiLCJsb2NhbFBvcnQiLCJyZWNlaXZlUG9ydCIsInJlbW90ZUFkZHJlc3MiLCJzZW5kQWRkcmVzcyIsInJlbW90ZVBvcnQiLCJzZW5kUG9ydCIsIm9uIiwicmVjZWl2ZSIsInNlbmQiLCJyZWFkeSIsIm9wZW4iLCJtc2ciLCJmb3JFYWNoIiwibGlzdGVuZXIiLCJhZGRyZXNzIiwiY2FsbGJhY2siLCJhcmdzIiwidXJsIiwicG9ydCIsImUiLCJjb25zb2xlIiwicHVzaCIsIlNlcnZpY2UiLCJzZXJ2aWNlTWFuYWdlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0EsSUFBTUEsTUFBTSxxQkFBTSxnQkFBTixDQUFaO0FBQ0EsSUFBTUMsYUFBYSxhQUFuQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBb0JNQyxHOzs7QUFDSjtBQUNBLGlCQUFjO0FBQUE7O0FBQUEsZ0lBQ05ELFVBRE07O0FBR1osUUFBTUUsV0FBVztBQUNmQyxrQkFBWTtBQURHLEtBQWpCOztBQUlBLFVBQUtDLFNBQUwsQ0FBZUYsUUFBZjs7QUFFQSxVQUFLRyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsVUFBS0MsYUFBTCxHQUFxQixNQUFLQyxPQUFMLENBQWEsZUFBYixDQUFyQjs7QUFFQSxVQUFLQyxVQUFMLEdBQWtCLE1BQUtBLFVBQUwsQ0FBZ0JDLElBQWhCLE9BQWxCO0FBWlk7QUFhYjs7QUFFRDs7Ozs7NEJBQ1E7QUFBQTs7QUFDTixVQUFNQyxZQUFZLEtBQUtKLGFBQUwsQ0FBbUJLLEdBQW5CLENBQXVCLEtBQUtDLE9BQUwsQ0FBYVQsVUFBcEMsQ0FBbEI7O0FBRUEsVUFBSSxLQUFLTyxTQUFMLEtBQW1CLElBQXZCLEVBQ0UsTUFBTSxJQUFJRyxLQUFKLG1DQUEwQ1YsVUFBMUMscUJBQU47O0FBRUYsV0FBS1csR0FBTCxHQUFXLElBQUlBLGNBQUlDLE9BQVIsQ0FBZ0I7QUFDekI7QUFDQUMsc0JBQWNOLFVBQVVPLGNBRkM7QUFHekJDLG1CQUFXUixVQUFVUyxXQUhJO0FBSXpCO0FBQ0FDLHVCQUFlVixVQUFVVyxXQUxBO0FBTXpCQyxvQkFBWVosVUFBVWE7QUFORyxPQUFoQixDQUFYOztBQVNBLFdBQUtULEdBQUwsQ0FBU1UsRUFBVCxDQUFZLE9BQVosRUFBcUIsWUFBTTtBQUN6QixZQUFNQyxVQUFhZixVQUFVTyxjQUF2QixTQUF5Q1AsVUFBVVMsV0FBekQ7QUFDQSxZQUFNTyxPQUFVaEIsVUFBVVcsV0FBcEIsU0FBbUNYLFVBQVVhLFFBQW5EOztBQUVBeEIsNkNBQW1DMEIsT0FBbkM7QUFDQTFCLDJDQUFpQzJCLElBQWpDOztBQUVBLGVBQUtDLEtBQUw7QUFDRCxPQVJEOztBQVVBLFdBQUtiLEdBQUwsQ0FBU1UsRUFBVCxDQUFZLFNBQVosRUFBdUIsS0FBS2hCLFVBQTVCO0FBQ0EsV0FBS00sR0FBTCxDQUFTYyxJQUFUO0FBQ0Q7O0FBRUQ7Ozs7Ozs7K0JBSVdDLEcsRUFBSztBQUNkLFdBQUt4QixVQUFMLENBQWdCeUIsT0FBaEIsQ0FBd0IsVUFBQ0MsUUFBRCxFQUFjO0FBQ3BDLFlBQUlGLElBQUlHLE9BQUosS0FBZ0JELFNBQVNDLE9BQTdCLEVBQ0VELFNBQVNFLFFBQVQsa0RBQXFCSixJQUFJSyxJQUF6QjtBQUNILE9BSEQ7O0FBS0FuQyxvREFBMEI4QixJQUFJRyxPQUE5QixnREFBNkNILElBQUlLLElBQWpEO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozt5QkFTS0YsTyxFQUFTRSxJLEVBQStCO0FBQUEsVUFBekJDLEdBQXlCLHVFQUFuQixJQUFtQjtBQUFBLFVBQWJDLElBQWEsdUVBQU4sSUFBTTs7QUFDM0MsVUFBTVAsTUFBTSxFQUFFRyxnQkFBRixFQUFXRSxVQUFYLEVBQVo7O0FBRUEsVUFBSTtBQUNGLFlBQUlDLE9BQU9DLElBQVgsRUFDRSxLQUFLdEIsR0FBTCxDQUFTWSxJQUFULENBQWNHLEdBQWQsRUFBbUJNLEdBQW5CLEVBQXdCQyxJQUF4QixFQURGLEtBR0UsS0FBS3RCLEdBQUwsQ0FBU1ksSUFBVCxDQUFjRyxHQUFkLEVBSkEsQ0FJb0I7QUFDdkIsT0FMRCxDQUtFLE9BQU9RLENBQVAsRUFBVTtBQUNWQyxnQkFBUXZDLEdBQVIsQ0FBWSxrQ0FBWixFQUFnRHNDLENBQWhEO0FBQ0Q7O0FBRUR0QyxpREFBdUJpQyxPQUF2QixnREFBc0NFLElBQXRDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7NEJBT1FGLE8sRUFBU0MsUSxFQUFVO0FBQ3pCLFVBQU1GLFdBQVcsRUFBRUMsZ0JBQUYsRUFBV0Msa0JBQVgsRUFBakI7QUFDQSxXQUFLNUIsVUFBTCxDQUFnQmtDLElBQWhCLENBQXFCUixRQUFyQjtBQUNEOztBQUVEOzs7Ozs7O21DQUllQyxPLEVBQVNDLFEsRUFBVSxDQUFFOzs7RUFwR3BCTyxpQjs7QUF1R2xCQyx5QkFBZUMsUUFBZixDQUF3QjFDLFVBQXhCLEVBQW9DQyxHQUFwQzs7a0JBRWVBLEciLCJmaWxlIjoiT3NjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBvc2MgZnJvbSAnb3NjJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6b3NjJyk7XG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6b3NjJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdvc2MnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmVyLW9ubHkgc2VydmljZSBwcm92aWRlcyBzdXBwb3J0IGZvciBPU0MgY29tbXVuaWNhdGlvbnMgd2l0aCBhbiBleHRlbmFsXG4gKiBzb2Z0d2FyZSAoZS5nLiBNYXgpLiBUaGUgY29uZmlndXJhdGlvbiBvZiB0aGUgc2VydmljZSAodXJsIGFuZCBwb3J0KSBzaG91bGQgYmVcbiAqIGRlZmluZWQgaW4gdGhlIHNlcnZlciBjb25maWd1cmF0aW9uLCBjZi4ge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5lbnZDb25maWd9LlxuICpcbiAqIFRoZSBzZXJ2aWNlIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIFVEUCBwcm90b2NvbC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLm9zYyA9IHRoaXMucmVxdWlyZSgnb3NjJyk7XG4gKiAvLyB3aGVuIHRoZSBleHBlcmllbmNlIGhhcyBzdGFydGVkLCBsaXN0ZW4gdG8gaW5jb21pbmcgbWVzc2FnZVxuICogdGhpcy5vc2MucmVjZWl2ZSgnL29zYy9jaGFubmVsMScsICh2YWx1ZXMpID0+IHtcbiAqICAgLy8gZG8gc29tZXRoaW5nIHdpdGggYHZhbHVlc2BcbiAqIH0pO1xuICogLy8gc2VuZCBhIG1lc3NhZ2VcbiAqIHRoaXMub3NjLnNlbmQoJy9vc2MvY2hhbm5lbDInLCBbMC42MTgsIHRydWVdKTtcbiAqL1xuY2xhc3MgT3NjIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbmZpZ0l0ZW06ICdvc2MnLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgICB0aGlzLl9zaGFyZWRDb25maWcgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcblxuICAgIHRoaXMuX29uTWVzc2FnZSA9IHRoaXMuX29uTWVzc2FnZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIGNvbnN0IG9zY0NvbmZpZyA9IHRoaXMuX3NoYXJlZENvbmZpZy5nZXQodGhpcy5vcHRpb25zLmNvbmZpZ0l0ZW0pO1xuXG4gICAgaWYgKHRoaXMub3NjQ29uZmlnID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcInNlcnZpY2U6b3NjXCI6IHNlcnZlci5jb25maWcuJHtjb25maWdJdGVtfSBpcyBub3QgZGVmaW5lZGApO1xuXG4gICAgdGhpcy5vc2MgPSBuZXcgb3NjLlVEUFBvcnQoe1xuICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSdyZSBsaXN0ZW5pbmcgb24uXG4gICAgICBsb2NhbEFkZHJlc3M6IG9zY0NvbmZpZy5yZWNlaXZlQWRkcmVzcyxcbiAgICAgIGxvY2FsUG9ydDogb3NjQ29uZmlnLnJlY2VpdmVQb3J0LFxuICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSB1c2UgdG8gc2VuZCBtZXNzYWdlcy5cbiAgICAgIHJlbW90ZUFkZHJlc3M6IG9zY0NvbmZpZy5zZW5kQWRkcmVzcyxcbiAgICAgIHJlbW90ZVBvcnQ6IG9zY0NvbmZpZy5zZW5kUG9ydCxcbiAgICB9KTtcblxuICAgIHRoaXMub3NjLm9uKCdyZWFkeScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlY2VpdmUgPSBgJHtvc2NDb25maWcucmVjZWl2ZUFkZHJlc3N9OiR7b3NjQ29uZmlnLnJlY2VpdmVQb3J0fWA7XG4gICAgICBjb25zdCBzZW5kID0gYCR7b3NjQ29uZmlnLnNlbmRBZGRyZXNzfToke29zY0NvbmZpZy5zZW5kUG9ydH1gO1xuXG4gICAgICBsb2coYFtPU0Mgb3ZlciBVRFBdIFJlY2VpdmluZyBvbiAke3JlY2VpdmV9YCk7XG4gICAgICBsb2coYFtPU0Mgb3ZlciBVRFBdIFNlbmRpbmcgb24gJHtzZW5kfWApO1xuXG4gICAgICB0aGlzLnJlYWR5KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9zYy5vbignbWVzc2FnZScsIHRoaXMuX29uTWVzc2FnZSk7XG4gICAgdGhpcy5vc2Mub3BlbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGFsbCB0aGUgbGlzdGVuZXJzIGFjY29yZGluZyB0byB0aGUgYWRkcmVzcyBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9vbk1lc3NhZ2UobXNnKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG4gICAgICBpZiAobXNnLmFkZHJlc3MgPT09IGxpc3RlbmVyLmFkZHJlc3MpXG4gICAgICAgIGxpc3RlbmVyLmNhbGxiYWNrKC4uLm1zZy5hcmdzKTtcbiAgICB9KTtcblxuICAgIGxvZyhgbWVzc2FnZSAtIGFkZHJlc3MgXCIke21zZy5hZGRyZXNzfVwiYCwgLi4ubXNnLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYW4gT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhZGRyZXNzIC0gQWRkcmVzcyBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3VybD1udWxsXSAtIFVSTCB0byBzZW5kIHRoZSBPU0MgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCxcbiAgICogIHVzZXMgdGhlIHBvcnQgZGVmaW5lZCBpbiB0aGUgT1NDIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHtAbGluayBzZXJ2ZXJ9KS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwb3J0PW51bGxdLSBQb3J0IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8gKGlmIG5vdCBzcGVjaWZpZWQsXG4gICAqICB1c2VzIHRoZSBwb3J0IGRlZmluZWQgaW4gdGhlIE9TQyBjb25maWd1cmF0aW9uIG9mIHRoZSB7QGxpbmsgc2VydmVyfSkuXG4gICAqL1xuICBzZW5kKGFkZHJlc3MsIGFyZ3MsIHVybCA9IG51bGwsIHBvcnQgPSBudWxsKSB7XG4gICAgY29uc3QgbXNnID0geyBhZGRyZXNzLCBhcmdzIH07XG5cbiAgICB0cnkge1xuICAgICAgaWYgKHVybCAmJiBwb3J0KVxuICAgICAgICB0aGlzLm9zYy5zZW5kKG1zZywgdXJsLCBwb3J0KTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5vc2Muc2VuZChtc2cpOyAvLyB1c2UgZGVmYXVsdHMgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgc2VuZGluZyBPU0MgbWVzc2FnZTonLCBlKTtcbiAgICB9XG5cbiAgICBsb2coYHNlbmQgLSBhZGRyZXNzIFwiJHthZGRyZXNzfVwiYCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgY2FsbGJhY2tzIGZvciBPU0MgbWVzYWdlcy4gVGhlIHNlcnZlciBsaXN0ZW5zIHRvIE9TQyBtZXNzYWdlc1xuICAgKiBhdCB0aGUgYWRkcmVzcyBhbmQgcG9ydCBkZWZpbmVkIGluIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSB7QGxpbmsgc2VydmVyfS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGFkZHJlc3MgLSBXaWxkY2FyZCBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgd2hlbiBhbiBPU0NcbiAgICogIG1lc3NhZ2UgaXMgcmVjZWl2ZWQgYXQgdGhlIGdpdmVuIGFkZHJlc3MuXG4gICAqL1xuICByZWNlaXZlKGFkZHJlc3MsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbGlzdGVuZXIgPSB7IGFkZHJlc3MsIGNhbGxiYWNrIH07XG4gICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIC0gaW1wbGVtZW50XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihhZGRyZXNzLCBjYWxsYmFjaykge31cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgT3NjKTtcblxuZXhwb3J0IGRlZmF1bHQgT3NjO1xuIl19