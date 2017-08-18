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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9zYy5qcyJdLCJuYW1lcyI6WyJsb2ciLCJTRVJWSUNFX0lEIiwiT3NjIiwiZGVmYXVsdHMiLCJjb25maWdJdGVtIiwiY29uZmlndXJlIiwiX2xpc3RlbmVycyIsIl9zaGFyZWRDb25maWciLCJyZXF1aXJlIiwiX29uTWVzc2FnZSIsImJpbmQiLCJvc2NDb25maWciLCJnZXQiLCJvcHRpb25zIiwiRXJyb3IiLCJvc2MiLCJVRFBQb3J0IiwibG9jYWxBZGRyZXNzIiwicmVjZWl2ZUFkZHJlc3MiLCJsb2NhbFBvcnQiLCJyZWNlaXZlUG9ydCIsInJlbW90ZUFkZHJlc3MiLCJzZW5kQWRkcmVzcyIsInJlbW90ZVBvcnQiLCJzZW5kUG9ydCIsIm9uIiwicmVjZWl2ZSIsInNlbmQiLCJvcGVuIiwibXNnIiwiZm9yRWFjaCIsImxpc3RlbmVyIiwiYWRkcmVzcyIsImNhbGxiYWNrIiwiYXJncyIsInVybCIsInBvcnQiLCJlIiwiY29uc29sZSIsInB1c2giLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBLElBQU1BLE1BQU0scUJBQU0sZ0JBQU4sQ0FBWjtBQUNBLElBQU1DLGFBQWEsYUFBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW9CTUMsRzs7O0FBQ0o7QUFDQSxpQkFBYztBQUFBOztBQUFBLGdJQUNORCxVQURNOztBQUdaLFFBQU1FLFdBQVc7QUFDZkMsa0JBQVk7QUFERyxLQUFqQjs7QUFJQSxVQUFLQyxTQUFMLENBQWVGLFFBQWY7O0FBRUEsVUFBS0csVUFBTCxHQUFrQixFQUFsQjtBQUNBLFVBQUtDLGFBQUwsR0FBcUIsTUFBS0MsT0FBTCxDQUFhLGVBQWIsQ0FBckI7O0FBRUEsVUFBS0MsVUFBTCxHQUFrQixNQUFLQSxVQUFMLENBQWdCQyxJQUFoQixPQUFsQjtBQVpZO0FBYWI7O0FBRUQ7Ozs7OzRCQUNRO0FBQ04sVUFBTUMsWUFBWSxLQUFLSixhQUFMLENBQW1CSyxHQUFuQixDQUF1QixLQUFLQyxPQUFMLENBQWFULFVBQXBDLENBQWxCOztBQUVBLFVBQUksS0FBS08sU0FBTCxLQUFtQixJQUF2QixFQUNFLE1BQU0sSUFBSUcsS0FBSixtQ0FBMENWLFVBQTFDLHFCQUFOOztBQUVGLFdBQUtXLEdBQUwsR0FBVyxJQUFJLGNBQUlDLE9BQVIsQ0FBZ0I7QUFDekI7QUFDQUMsc0JBQWNOLFVBQVVPLGNBRkM7QUFHekJDLG1CQUFXUixVQUFVUyxXQUhJO0FBSXpCO0FBQ0FDLHVCQUFlVixVQUFVVyxXQUxBO0FBTXpCQyxvQkFBWVosVUFBVWE7QUFORyxPQUFoQixDQUFYOztBQVNBLFdBQUtULEdBQUwsQ0FBU1UsRUFBVCxDQUFZLE9BQVosRUFBcUIsWUFBTTtBQUN6QixZQUFNQyxVQUFhZixVQUFVTyxjQUF2QixTQUF5Q1AsVUFBVVMsV0FBekQ7QUFDQSxZQUFNTyxPQUFVaEIsVUFBVVcsV0FBcEIsU0FBbUNYLFVBQVVhLFFBQW5EOztBQUVBeEIsNkNBQW1DMEIsT0FBbkM7QUFDQTFCLDJDQUFpQzJCLElBQWpDO0FBQ0QsT0FORDs7QUFRQSxXQUFLWixHQUFMLENBQVNVLEVBQVQsQ0FBWSxTQUFaLEVBQXVCLEtBQUtoQixVQUE1QjtBQUNBLFdBQUtNLEdBQUwsQ0FBU2EsSUFBVDtBQUNEOztBQUVEOzs7Ozs7OytCQUlXQyxHLEVBQUs7QUFDZCxXQUFLdkIsVUFBTCxDQUFnQndCLE9BQWhCLENBQXdCLFVBQUNDLFFBQUQsRUFBYztBQUNwQyxZQUFJRixJQUFJRyxPQUFKLEtBQWdCRCxTQUFTQyxPQUE3QixFQUNFRCxTQUFTRSxRQUFULGtEQUFxQkosSUFBSUssSUFBekI7QUFDSCxPQUhEOztBQUtBbEMsb0RBQTBCNkIsSUFBSUcsT0FBOUIsZ0RBQTZDSCxJQUFJSyxJQUFqRDtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7eUJBU0tGLE8sRUFBU0UsSSxFQUErQjtBQUFBLFVBQXpCQyxHQUF5Qix1RUFBbkIsSUFBbUI7QUFBQSxVQUFiQyxJQUFhLHVFQUFOLElBQU07O0FBQzNDLFVBQU1QLE1BQU0sRUFBRUcsZ0JBQUYsRUFBV0UsVUFBWCxFQUFaOztBQUVBLFVBQUk7QUFDRixZQUFJQyxPQUFPQyxJQUFYLEVBQ0UsS0FBS3JCLEdBQUwsQ0FBU1ksSUFBVCxDQUFjRSxHQUFkLEVBQW1CTSxHQUFuQixFQUF3QkMsSUFBeEIsRUFERixLQUdFLEtBQUtyQixHQUFMLENBQVNZLElBQVQsQ0FBY0UsR0FBZCxFQUpBLENBSW9CO0FBQ3ZCLE9BTEQsQ0FLRSxPQUFPUSxDQUFQLEVBQVU7QUFDVkMsZ0JBQVF0QyxHQUFSLENBQVksa0NBQVosRUFBZ0RxQyxDQUFoRDtBQUNEOztBQUVEckMsaURBQXVCZ0MsT0FBdkIsZ0RBQXNDRSxJQUF0QztBQUNEOztBQUVEOzs7Ozs7Ozs7OzRCQU9RRixPLEVBQVNDLFEsRUFBVTtBQUN6QixVQUFNRixXQUFXLEVBQUVDLGdCQUFGLEVBQVdDLGtCQUFYLEVBQWpCO0FBQ0EsV0FBSzNCLFVBQUwsQ0FBZ0JpQyxJQUFoQixDQUFxQlIsUUFBckI7QUFDRDs7QUFFRDs7Ozs7OzttQ0FJZUMsTyxFQUFTQyxRLEVBQVUsQ0FBRTs7Ozs7QUFHdEMseUJBQWVPLFFBQWYsQ0FBd0J2QyxVQUF4QixFQUFvQ0MsR0FBcEM7O2tCQUVlQSxHIiwiZmlsZSI6Ik9zYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgb3NjIGZyb20gJ29zYyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOm9zYycpO1xuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOm9zYyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAnb3NjJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZlci1vbmx5IHNlcnZpY2UgcHJvdmlkZXMgc3VwcG9ydCBmb3IgT1NDIGNvbW11bmljYXRpb25zIHdpdGggYW4gZXh0ZW5hbFxuICogc29mdHdhcmUgKGUuZy4gTWF4KS4gVGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHNlcnZpY2UgKHVybCBhbmQgcG9ydCkgc2hvdWxkIGJlXG4gKiBkZWZpbmVkIGluIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiwgY2YuIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuZW52Q29uZmlnfS5cbiAqXG4gKiBUaGUgc2VydmljZSBjdXJyZW50bHkgb25seSBzdXBwb3J0cyBVRFAgcHJvdG9jb2wuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5vc2MgPSB0aGlzLnJlcXVpcmUoJ29zYycpO1xuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZCwgbGlzdGVuIHRvIGluY29taW5nIG1lc3NhZ2VcbiAqIHRoaXMub3NjLnJlY2VpdmUoJy9vc2MvY2hhbm5lbDEnLCAodmFsdWVzKSA9PiB7XG4gKiAgIC8vIGRvIHNvbWV0aGluZyB3aXRoIGB2YWx1ZXNgXG4gKiB9KTtcbiAqIC8vIHNlbmQgYSBtZXNzYWdlXG4gKiB0aGlzLm9zYy5zZW5kKCcvb3NjL2NoYW5uZWwyJywgWzAuNjE4LCB0cnVlXSk7XG4gKi9cbmNsYXNzIE9zYyBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBjb25maWdJdGVtOiAnb3NjJyxcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgICB0aGlzLl9zaGFyZWRDb25maWcgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcblxuICAgIHRoaXMuX29uTWVzc2FnZSA9IHRoaXMuX29uTWVzc2FnZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIGNvbnN0IG9zY0NvbmZpZyA9IHRoaXMuX3NoYXJlZENvbmZpZy5nZXQodGhpcy5vcHRpb25zLmNvbmZpZ0l0ZW0pO1xuXG4gICAgaWYgKHRoaXMub3NjQ29uZmlnID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcInNlcnZpY2U6b3NjXCI6IHNlcnZlci5jb25maWcuJHtjb25maWdJdGVtfSBpcyBub3QgZGVmaW5lZGApO1xuXG4gICAgdGhpcy5vc2MgPSBuZXcgb3NjLlVEUFBvcnQoe1xuICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSdyZSBsaXN0ZW5pbmcgb24uXG4gICAgICBsb2NhbEFkZHJlc3M6IG9zY0NvbmZpZy5yZWNlaXZlQWRkcmVzcyxcbiAgICAgIGxvY2FsUG9ydDogb3NjQ29uZmlnLnJlY2VpdmVQb3J0LFxuICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSB1c2UgdG8gc2VuZCBtZXNzYWdlcy5cbiAgICAgIHJlbW90ZUFkZHJlc3M6IG9zY0NvbmZpZy5zZW5kQWRkcmVzcyxcbiAgICAgIHJlbW90ZVBvcnQ6IG9zY0NvbmZpZy5zZW5kUG9ydCxcbiAgICB9KTtcblxuICAgIHRoaXMub3NjLm9uKCdyZWFkeScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlY2VpdmUgPSBgJHtvc2NDb25maWcucmVjZWl2ZUFkZHJlc3N9OiR7b3NjQ29uZmlnLnJlY2VpdmVQb3J0fWA7XG4gICAgICBjb25zdCBzZW5kID0gYCR7b3NjQ29uZmlnLnNlbmRBZGRyZXNzfToke29zY0NvbmZpZy5zZW5kUG9ydH1gO1xuXG4gICAgICBsb2coYFtPU0Mgb3ZlciBVRFBdIFJlY2VpdmluZyBvbiAke3JlY2VpdmV9YCk7XG4gICAgICBsb2coYFtPU0Mgb3ZlciBVRFBdIFNlbmRpbmcgb24gJHtzZW5kfWApO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vc2Mub24oJ21lc3NhZ2UnLCB0aGlzLl9vbk1lc3NhZ2UpO1xuICAgIHRoaXMub3NjLm9wZW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBhbGwgdGhlIGxpc3RlbmVycyBhY2NvcmRpbmcgdG8gdGhlIGFkZHJlc3Mgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25NZXNzYWdlKG1zZykge1xuICAgIHRoaXMuX2xpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xuICAgICAgaWYgKG1zZy5hZGRyZXNzID09PSBsaXN0ZW5lci5hZGRyZXNzKVxuICAgICAgICBsaXN0ZW5lci5jYWxsYmFjayguLi5tc2cuYXJncylcbiAgICB9KTtcblxuICAgIGxvZyhgbWVzc2FnZSAtIGFkZHJlc3MgXCIke21zZy5hZGRyZXNzfVwiYCwgLi4ubXNnLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYW4gT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhZGRyZXNzIC0gQWRkcmVzcyBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3VybD1udWxsXSAtIFVSTCB0byBzZW5kIHRoZSBPU0MgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCxcbiAgICogIHVzZXMgdGhlIHBvcnQgZGVmaW5lZCBpbiB0aGUgT1NDIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHtAbGluayBzZXJ2ZXJ9KS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwb3J0PW51bGxdLSBQb3J0IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8gKGlmIG5vdCBzcGVjaWZpZWQsXG4gICAqICB1c2VzIHRoZSBwb3J0IGRlZmluZWQgaW4gdGhlIE9TQyBjb25maWd1cmF0aW9uIG9mIHRoZSB7QGxpbmsgc2VydmVyfSkuXG4gICAqL1xuICBzZW5kKGFkZHJlc3MsIGFyZ3MsIHVybCA9IG51bGwsIHBvcnQgPSBudWxsKSB7XG4gICAgY29uc3QgbXNnID0geyBhZGRyZXNzLCBhcmdzIH07XG5cbiAgICB0cnkge1xuICAgICAgaWYgKHVybCAmJiBwb3J0KVxuICAgICAgICB0aGlzLm9zYy5zZW5kKG1zZywgdXJsLCBwb3J0KTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5vc2Muc2VuZChtc2cpOyAvLyB1c2UgZGVmYXVsdHMgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgc2VuZGluZyBPU0MgbWVzc2FnZTonLCBlKTtcbiAgICB9XG5cbiAgICBsb2coYHNlbmQgLSBhZGRyZXNzIFwiJHthZGRyZXNzfVwiYCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgY2FsbGJhY2tzIGZvciBPU0MgbWVzYWdlcy4gVGhlIHNlcnZlciBsaXN0ZW5zIHRvIE9TQyBtZXNzYWdlc1xuICAgKiBhdCB0aGUgYWRkcmVzcyBhbmQgcG9ydCBkZWZpbmVkIGluIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSB7QGxpbmsgc2VydmVyfS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGFkZHJlc3MgLSBXaWxkY2FyZCBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgd2hlbiBhbiBPU0NcbiAgICogIG1lc3NhZ2UgaXMgcmVjZWl2ZWQgYXQgdGhlIGdpdmVuIGFkZHJlc3MuXG4gICAqL1xuICByZWNlaXZlKGFkZHJlc3MsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbGlzdGVuZXIgPSB7IGFkZHJlc3MsIGNhbGxiYWNrIH1cbiAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gIH1cblxuICAvKipcbiAgICogQHRvZG8gLSBpbXBsZW1lbnRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGFkZHJlc3MsIGNhbGxiYWNrKSB7fVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBPc2MpO1xuXG5leHBvcnQgZGVmYXVsdCBPc2M7XG4iXX0=