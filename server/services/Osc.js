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

var _Activity2 = require('../core/Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('soundworks:osc');
var SERVICE_ID = 'service:osc';

/**
 * Interface of the server `'osc'` service.
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
 * // when the experience has started, listen for incomming message
 * this.osc.receive('/osc/channel1', (values) => {
 *   // do something with `values`
 * });
 * // send a message
 * this.osc.send('/osc/channel2', [0.618, true]);
 */

var Osc = function (_Activity) {
  (0, _inherits3.default)(Osc, _Activity);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Osc() {
    (0, _classCallCheck3.default)(this, Osc);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Osc).call(this, SERVICE_ID));

    var defaults = {
      oscConfigItem: 'osc'
    };

    // protocol: 'udp',
    _this.configure(defaults);

    _this._listeners = [];
    _this._sharedConfigService = _this.require('shared-config');

    _this._onMessage = _this._onMessage.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Osc, [{
    key: 'start',
    value: function start() {
      var oscConfig = this._sharedConfigService.get(this.options.oscConfigItem);

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
      var url = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
      var port = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      var msg = { address: address, args: args };

      try {
        if (url && port) this.osc.send(msg, url, port);else this.osc.send(msg); // use defaults (as defined in the config)
      } catch (e) {
        console.log('Error while sending OSC message:', e);
      }

      log.apply(undefined, ['send - address "' + address + '"'].concat((0, _toConsumableArray3.default)(args)));
    }

    /**
     * Register callbacks for OSC mesages. The server listens for OSC messages
     * at the address and port defined in the configuration of the {@link server}.
     * @param {String} address - Wildcard of the OSC message.
     * @param {Function} callback - Callback function to be executed when an OSC
     *  message is received on the given address.
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
}(_Activity3.default);

_serviceManager2.default.register(SERVICE_ID, Osc);

exports.default = Osc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9zYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0EsSUFBTSxNQUFNLHFCQUFNLGdCQUFOLENBQVo7QUFDQSxJQUFNLGFBQWEsYUFBbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBc0JNLEc7Ozs7O0FBRUosaUJBQWM7QUFBQTs7QUFBQSw2R0FDTixVQURNOztBQUdaLFFBQU0sV0FBVztBQUNmLHFCQUFlO0FBREEsS0FBakI7OztBQUtBLFVBQUssU0FBTCxDQUFlLFFBQWY7O0FBRUEsVUFBSyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsVUFBSyxvQkFBTCxHQUE0QixNQUFLLE9BQUwsQ0FBYSxlQUFiLENBQTVCOztBQUVBLFVBQUssVUFBTCxHQUFrQixNQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsT0FBbEI7QUFiWTtBQWNiOzs7Ozs7OzRCQUdPO0FBQ04sVUFBTSxZQUFZLEtBQUssb0JBQUwsQ0FBMEIsR0FBMUIsQ0FBOEIsS0FBSyxPQUFMLENBQWEsYUFBM0MsQ0FBbEI7O0FBRUEsV0FBSyxHQUFMLEdBQVcsSUFBSSxjQUFJLE9BQVIsQ0FBZ0I7O0FBRXpCLHNCQUFjLFVBQVUsY0FGQztBQUd6QixtQkFBVyxVQUFVLFdBSEk7O0FBS3pCLHVCQUFlLFVBQVUsV0FMQTtBQU16QixvQkFBWSxVQUFVO0FBTkcsT0FBaEIsQ0FBWDs7QUFTQSxXQUFLLEdBQUwsQ0FBUyxFQUFULENBQVksT0FBWixFQUFxQixZQUFNO0FBQ3pCLFlBQU0sVUFBYSxVQUFVLGNBQXZCLFNBQXlDLFVBQVUsV0FBekQ7QUFDQSxZQUFNLE9BQVUsVUFBVSxXQUFwQixTQUFtQyxVQUFVLFFBQW5EOztBQUVBLDZDQUFtQyxPQUFuQztBQUNBLDJDQUFpQyxJQUFqQztBQUNELE9BTkQ7O0FBUUEsV0FBSyxHQUFMLENBQVMsRUFBVCxDQUFZLFNBQVosRUFBdUIsS0FBSyxVQUE1QjtBQUNBLFdBQUssR0FBTCxDQUFTLElBQVQ7QUFDRDs7Ozs7Ozs7OytCQU1VLEcsRUFBSztBQUNkLFdBQUssVUFBTCxDQUFnQixPQUFoQixDQUF3QixVQUFDLFFBQUQsRUFBYztBQUNwQyxZQUFJLElBQUksT0FBSixLQUFnQixTQUFTLE9BQTdCLEVBQ0UsU0FBUyxRQUFULGtEQUFxQixJQUFJLElBQXpCO0FBQ0gsT0FIRDs7QUFLQSxvREFBMEIsSUFBSSxPQUE5QixnREFBNkMsSUFBSSxJQUFqRDtBQUNEOzs7Ozs7Ozs7Ozs7Ozt5QkFXSSxPLEVBQVMsSSxFQUErQjtBQUFBLFVBQXpCLEdBQXlCLHlEQUFuQixJQUFtQjtBQUFBLFVBQWIsSUFBYSx5REFBTixJQUFNOztBQUMzQyxVQUFNLE1BQU0sRUFBRSxnQkFBRixFQUFXLFVBQVgsRUFBWjs7QUFFQSxVQUFJO0FBQ0YsWUFBSSxPQUFPLElBQVgsRUFDRSxLQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsR0FBZCxFQUFtQixHQUFuQixFQUF3QixJQUF4QixFQURGLEtBR0UsS0FBSyxHQUFMLENBQVMsSUFBVCxDQUFjLEdBQWQsRTtBQUNILE9BTEQsQ0FLRSxPQUFPLENBQVAsRUFBVTtBQUNWLGdCQUFRLEdBQVIsQ0FBWSxrQ0FBWixFQUFnRCxDQUFoRDtBQUNEOztBQUVELGlEQUF1QixPQUF2QixnREFBc0MsSUFBdEM7QUFDRDs7Ozs7Ozs7Ozs7OzRCQVNPLE8sRUFBUyxRLEVBQVU7QUFDekIsVUFBTSxXQUFXLEVBQUUsZ0JBQUYsRUFBVyxrQkFBWCxFQUFqQjtBQUNBLFdBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixRQUFyQjtBQUNEOzs7Ozs7Ozs7bUNBTWMsTyxFQUFTLFEsRUFBVSxDQUFFOzs7OztBQUd0Qyx5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLEdBQXBDOztrQkFFZSxHIiwiZmlsZSI6Ik9zYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgb3NjIGZyb20gJ29zYyc7XG5pbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6b3NjJyk7XG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6b3NjJztcblxuLyoqXG4gKiBJbnRlcmZhY2Ugb2YgdGhlIHNlcnZlciBgJ29zYydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2ZXItb25seSBzZXJ2aWNlIHByb3ZpZGVzIHN1cHBvcnQgZm9yIE9TQyBjb21tdW5pY2F0aW9ucyB3aXRoIGFuIGV4dGVuYWxcbiAqIHNvZnR3YXJlIChlLmcuIE1heCkuIFRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSBzZXJ2aWNlICh1cmwgYW5kIHBvcnQpIHNob3VsZCBiZVxuICogZGVmaW5lZCBpbiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24sIGNmLiB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLmVudkNvbmZpZ30uXG4gKlxuICogVGhlIHNlcnZpY2UgY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgVURQIHByb3RvY29sLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMub3NjID0gdGhpcy5yZXF1aXJlKCdvc2MnKTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWQsIGxpc3RlbiBmb3IgaW5jb21taW5nIG1lc3NhZ2VcbiAqIHRoaXMub3NjLnJlY2VpdmUoJy9vc2MvY2hhbm5lbDEnLCAodmFsdWVzKSA9PiB7XG4gKiAgIC8vIGRvIHNvbWV0aGluZyB3aXRoIGB2YWx1ZXNgXG4gKiB9KTtcbiAqIC8vIHNlbmQgYSBtZXNzYWdlXG4gKiB0aGlzLm9zYy5zZW5kKCcvb3NjL2NoYW5uZWwyJywgWzAuNjE4LCB0cnVlXSk7XG4gKi9cbmNsYXNzIE9zYyBleHRlbmRzIEFjdGl2aXR5IHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgb3NjQ29uZmlnSXRlbTogJ29zYycsXG4gICAgICAvLyBwcm90b2NvbDogJ3VkcCcsXG4gICAgfVxuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZSA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuXG4gICAgdGhpcy5fb25NZXNzYWdlID0gdGhpcy5fb25NZXNzYWdlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgY29uc3Qgb3NjQ29uZmlnID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQodGhpcy5vcHRpb25zLm9zY0NvbmZpZ0l0ZW0pO1xuXG4gICAgdGhpcy5vc2MgPSBuZXcgb3NjLlVEUFBvcnQoe1xuICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSdyZSBsaXN0ZW5pbmcgb24uXG4gICAgICBsb2NhbEFkZHJlc3M6IG9zY0NvbmZpZy5yZWNlaXZlQWRkcmVzcyxcbiAgICAgIGxvY2FsUG9ydDogb3NjQ29uZmlnLnJlY2VpdmVQb3J0LFxuICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSB1c2UgdG8gc2VuZCBtZXNzYWdlcy5cbiAgICAgIHJlbW90ZUFkZHJlc3M6IG9zY0NvbmZpZy5zZW5kQWRkcmVzcyxcbiAgICAgIHJlbW90ZVBvcnQ6IG9zY0NvbmZpZy5zZW5kUG9ydCxcbiAgICB9KTtcblxuICAgIHRoaXMub3NjLm9uKCdyZWFkeScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlY2VpdmUgPSBgJHtvc2NDb25maWcucmVjZWl2ZUFkZHJlc3N9OiR7b3NjQ29uZmlnLnJlY2VpdmVQb3J0fWA7XG4gICAgICBjb25zdCBzZW5kID0gYCR7b3NjQ29uZmlnLnNlbmRBZGRyZXNzfToke29zY0NvbmZpZy5zZW5kUG9ydH1gO1xuXG4gICAgICBsb2coYFtPU0Mgb3ZlciBVRFBdIFJlY2VpdmluZyBvbiAke3JlY2VpdmV9YCk7XG4gICAgICBsb2coYFtPU0Mgb3ZlciBVRFBdIFNlbmRpbmcgb24gJHtzZW5kfWApO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vc2Mub24oJ21lc3NhZ2UnLCB0aGlzLl9vbk1lc3NhZ2UpO1xuICAgIHRoaXMub3NjLm9wZW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBhbGwgdGhlIGxpc3RlbmVycyBhY2NvcmRpbmcgdG8gdGhlIGFkZHJlc3Mgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25NZXNzYWdlKG1zZykge1xuICAgIHRoaXMuX2xpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xuICAgICAgaWYgKG1zZy5hZGRyZXNzID09PSBsaXN0ZW5lci5hZGRyZXNzKVxuICAgICAgICBsaXN0ZW5lci5jYWxsYmFjayguLi5tc2cuYXJncylcbiAgICB9KTtcblxuICAgIGxvZyhgbWVzc2FnZSAtIGFkZHJlc3MgXCIke21zZy5hZGRyZXNzfVwiYCwgLi4ubXNnLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYW4gT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhZGRyZXNzIC0gQWRkcmVzcyBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3VybD1udWxsXSAtIFVSTCB0byBzZW5kIHRoZSBPU0MgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCxcbiAgICogIHVzZXMgdGhlIHBvcnQgZGVmaW5lZCBpbiB0aGUgT1NDIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHtAbGluayBzZXJ2ZXJ9KS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwb3J0PW51bGxdLSBQb3J0IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8gKGlmIG5vdCBzcGVjaWZpZWQsXG4gICAqICB1c2VzIHRoZSBwb3J0IGRlZmluZWQgaW4gdGhlIE9TQyBjb25maWd1cmF0aW9uIG9mIHRoZSB7QGxpbmsgc2VydmVyfSkuXG4gICAqL1xuICBzZW5kKGFkZHJlc3MsIGFyZ3MsIHVybCA9IG51bGwsIHBvcnQgPSBudWxsKSB7XG4gICAgY29uc3QgbXNnID0geyBhZGRyZXNzLCBhcmdzIH07XG5cbiAgICB0cnkge1xuICAgICAgaWYgKHVybCAmJiBwb3J0KVxuICAgICAgICB0aGlzLm9zYy5zZW5kKG1zZywgdXJsLCBwb3J0KTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5vc2Muc2VuZChtc2cpOyAvLyB1c2UgZGVmYXVsdHMgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgc2VuZGluZyBPU0MgbWVzc2FnZTonLCBlKTtcbiAgICB9XG5cbiAgICBsb2coYHNlbmQgLSBhZGRyZXNzIFwiJHthZGRyZXNzfVwiYCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgY2FsbGJhY2tzIGZvciBPU0MgbWVzYWdlcy4gVGhlIHNlcnZlciBsaXN0ZW5zIGZvciBPU0MgbWVzc2FnZXNcbiAgICogYXQgdGhlIGFkZHJlc3MgYW5kIHBvcnQgZGVmaW5lZCBpbiB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUge0BsaW5rIHNlcnZlcn0uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhZGRyZXNzIC0gV2lsZGNhcmQgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIHdoZW4gYW4gT1NDXG4gICAqICBtZXNzYWdlIGlzIHJlY2VpdmVkIG9uIHRoZSBnaXZlbiBhZGRyZXNzLlxuICAgKi9cbiAgcmVjZWl2ZShhZGRyZXNzLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGxpc3RlbmVyID0geyBhZGRyZXNzLCBjYWxsYmFjayB9XG4gICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIC0gaW1wbGVtZW50XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihhZGRyZXNzLCBjYWxsYmFjaykge31cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgT3NjKTtcblxuZXhwb3J0IGRlZmF1bHQgT3NjO1xuIl19