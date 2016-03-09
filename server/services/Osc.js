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

var _ServerActivity2 = require('../core/ServerActivity');

var _ServerActivity3 = _interopRequireDefault(_ServerActivity2);

var _serverServiceManager = require('../core/serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('soundworks:osc');
var SERVICE_ID = 'service:osc';

/**
 * Server only service for OSC communications withw external softwares
 * (e.g. Max). Only support UDP protocol.
 * @todo - define if other protocols should be supported.
 */

var Osc = function (_ServerActivity) {
  (0, _inherits3.default)(Osc, _ServerActivity);

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

      // log(`message - address "${msg.address}"`, ...msg.args);
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
     * Register callbacks for OSC mesages. The server listens to OSC messages
     * at the address and port defined in the configuration of the {@link server}.
     * @param {String} wildcard - Wildcard of the OSC message.
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
     */

  }, {
    key: 'broadcast',
    value: function broadcast() {}
  }]);
  return Osc;
}(_ServerActivity3.default);

_serverServiceManager2.default.register(SERVICE_ID, Osc);

exports.default = Osc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9zYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0EsSUFBTSxNQUFNLHFCQUFNLGdCQUFOLENBQU47QUFDTixJQUFNLGFBQWEsYUFBYjs7Ozs7Ozs7SUFPQTs7O0FBQ0osV0FESSxHQUNKLEdBQWM7d0NBRFYsS0FDVTs7NkZBRFYsZ0JBRUksYUFETTs7QUFHWixRQUFNLFdBQVc7QUFDZixxQkFBZSxLQUFmO0tBREksQ0FITTs7O0FBUVosVUFBSyxTQUFMLENBQWUsUUFBZixFQVJZOztBQVVaLFVBQUssVUFBTCxHQUFrQixFQUFsQixDQVZZO0FBV1osVUFBSyxvQkFBTCxHQUE0QixNQUFLLE9BQUwsQ0FBYSxlQUFiLENBQTVCLENBWFk7O0FBYVosVUFBSyxVQUFMLEdBQWtCLE1BQUssVUFBTCxDQUFnQixJQUFoQixPQUFsQixDQWJZOztHQUFkOzs2QkFESTs7NEJBaUJJO0FBQ04sVUFBTSxZQUFZLEtBQUssb0JBQUwsQ0FBMEIsR0FBMUIsQ0FBOEIsS0FBSyxPQUFMLENBQWEsYUFBYixDQUExQyxDQURBOztBQUdOLFdBQUssR0FBTCxHQUFXLElBQUksY0FBSSxPQUFKLENBQVk7O0FBRXpCLHNCQUFjLFVBQVUsY0FBVjtBQUNkLG1CQUFXLFVBQVUsV0FBVjs7QUFFWCx1QkFBZSxVQUFVLFdBQVY7QUFDZixvQkFBWSxVQUFVLFFBQVY7T0FOSCxDQUFYLENBSE07O0FBWU4sV0FBSyxHQUFMLENBQVMsRUFBVCxDQUFZLE9BQVosRUFBcUIsWUFBTTtBQUN6QixZQUFNLFVBQWEsVUFBVSxjQUFWLFNBQTRCLFVBQVUsV0FBVixDQUR0QjtBQUV6QixZQUFNLE9BQVUsVUFBVSxXQUFWLFNBQXlCLFVBQVUsUUFBVixDQUZoQjs7QUFJekIsNkNBQW1DLE9BQW5DLEVBSnlCO0FBS3pCLDJDQUFpQyxJQUFqQyxFQUx5QjtPQUFOLENBQXJCLENBWk07O0FBb0JOLFdBQUssR0FBTCxDQUFTLEVBQVQsQ0FBWSxTQUFaLEVBQXVCLEtBQUssVUFBTCxDQUF2QixDQXBCTTtBQXFCTixXQUFLLEdBQUwsQ0FBUyxJQUFULEdBckJNOzs7Ozs7Ozs7OytCQTRCRyxLQUFLO0FBQ2QsV0FBSyxVQUFMLENBQWdCLE9BQWhCLENBQXdCLFVBQUMsUUFBRCxFQUFjO0FBQ3BDLFlBQUksSUFBSSxPQUFKLEtBQWdCLFNBQVMsT0FBVCxFQUNsQixTQUFTLFFBQVQsa0RBQXFCLElBQUksSUFBSixDQUFyQixFQURGO09BRHNCLENBQXhCOzs7QUFEYzs7Ozs7Ozs7Ozs7Ozs7eUJBa0JYLFNBQVMsTUFBK0I7VUFBekIsNERBQU0sb0JBQW1CO1VBQWIsNkRBQU8sb0JBQU07O0FBQzNDLFVBQU0sTUFBTSxFQUFFLGdCQUFGLEVBQVcsVUFBWCxFQUFOLENBRHFDOztBQUczQyxVQUFJO0FBQ0YsWUFBSSxPQUFPLElBQVAsRUFDRixLQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsR0FBZCxFQUFtQixHQUFuQixFQUF3QixJQUF4QixFQURGLEtBR0UsS0FBSyxHQUFMLENBQVMsSUFBVCxDQUFjLEdBQWQsRUFIRjtBQURFLE9BQUosQ0FLRSxPQUFPLENBQVAsRUFBVTtBQUNWLGdCQUFRLEdBQVIsQ0FBWSxrQ0FBWixFQUFnRCxDQUFoRCxFQURVO09BQVY7O0FBSUYsaURBQXVCLHVEQUFlLE1BQXRDLEVBWjJDOzs7Ozs7Ozs7Ozs7OzRCQXNCckMsU0FBUyxVQUFVO0FBQ3pCLFVBQU0sV0FBVyxFQUFFLGdCQUFGLEVBQVcsa0JBQVgsRUFBWCxDQURtQjtBQUV6QixXQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsUUFBckIsRUFGeUI7Ozs7Ozs7OztnQ0FRZjs7U0E3RlI7OztBQWdHTiwrQkFBcUIsUUFBckIsQ0FBOEIsVUFBOUIsRUFBMEMsR0FBMUM7O2tCQUVlIiwiZmlsZSI6Ik9zYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgb3NjIGZyb20gJ29zYyc7XG5pbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5cblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6b3NjJyk7XG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6b3NjJztcblxuLyoqXG4gKiBTZXJ2ZXIgb25seSBzZXJ2aWNlIGZvciBPU0MgY29tbXVuaWNhdGlvbnMgd2l0aHcgZXh0ZXJuYWwgc29mdHdhcmVzXG4gKiAoZS5nLiBNYXgpLiBPbmx5IHN1cHBvcnQgVURQIHByb3RvY29sLlxuICogQHRvZG8gLSBkZWZpbmUgaWYgb3RoZXIgcHJvdG9jb2xzIHNob3VsZCBiZSBzdXBwb3J0ZWQuXG4gKi9cbmNsYXNzIE9zYyBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG9zY0NvbmZpZ0l0ZW06ICdvc2MnLFxuICAgICAgLy8gcHJvdG9jb2w6ICd1ZHAnLFxuICAgIH1cblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcblxuICAgIHRoaXMuX29uTWVzc2FnZSA9IHRoaXMuX29uTWVzc2FnZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgY29uc3Qgb3NjQ29uZmlnID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQodGhpcy5vcHRpb25zLm9zY0NvbmZpZ0l0ZW0pO1xuXG4gICAgdGhpcy5vc2MgPSBuZXcgb3NjLlVEUFBvcnQoe1xuICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSdyZSBsaXN0ZW5pbmcgb24uXG4gICAgICBsb2NhbEFkZHJlc3M6IG9zY0NvbmZpZy5yZWNlaXZlQWRkcmVzcyxcbiAgICAgIGxvY2FsUG9ydDogb3NjQ29uZmlnLnJlY2VpdmVQb3J0LFxuICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSB1c2UgdG8gc2VuZCBtZXNzYWdlcy5cbiAgICAgIHJlbW90ZUFkZHJlc3M6IG9zY0NvbmZpZy5zZW5kQWRkcmVzcyxcbiAgICAgIHJlbW90ZVBvcnQ6IG9zY0NvbmZpZy5zZW5kUG9ydCxcbiAgICB9KTtcblxuICAgIHRoaXMub3NjLm9uKCdyZWFkeScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlY2VpdmUgPSBgJHtvc2NDb25maWcucmVjZWl2ZUFkZHJlc3N9OiR7b3NjQ29uZmlnLnJlY2VpdmVQb3J0fWA7XG4gICAgICBjb25zdCBzZW5kID0gYCR7b3NjQ29uZmlnLnNlbmRBZGRyZXNzfToke29zY0NvbmZpZy5zZW5kUG9ydH1gO1xuXG4gICAgICBsb2coYFtPU0Mgb3ZlciBVRFBdIFJlY2VpdmluZyBvbiAke3JlY2VpdmV9YCk7XG4gICAgICBsb2coYFtPU0Mgb3ZlciBVRFBdIFNlbmRpbmcgb24gJHtzZW5kfWApO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vc2Mub24oJ21lc3NhZ2UnLCB0aGlzLl9vbk1lc3NhZ2UpO1xuICAgIHRoaXMub3NjLm9wZW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBhbGwgdGhlIGxpc3RlbmVycyBhY2NvcmRpbmcgdG8gdGhlIGFkZHJlc3Mgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25NZXNzYWdlKG1zZykge1xuICAgIHRoaXMuX2xpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xuICAgICAgaWYgKG1zZy5hZGRyZXNzID09PSBsaXN0ZW5lci5hZGRyZXNzKVxuICAgICAgICBsaXN0ZW5lci5jYWxsYmFjayguLi5tc2cuYXJncylcbiAgICB9KTtcblxuICAgIC8vIGxvZyhgbWVzc2FnZSAtIGFkZHJlc3MgXCIke21zZy5hZGRyZXNzfVwiYCwgLi4ubXNnLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYW4gT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhZGRyZXNzIC0gQWRkcmVzcyBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3VybD1udWxsXSAtIFVSTCB0byBzZW5kIHRoZSBPU0MgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCxcbiAgICogIHVzZXMgdGhlIHBvcnQgZGVmaW5lZCBpbiB0aGUgT1NDIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHtAbGluayBzZXJ2ZXJ9KS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwb3J0PW51bGxdLSBQb3J0IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8gKGlmIG5vdCBzcGVjaWZpZWQsXG4gICAqICB1c2VzIHRoZSBwb3J0IGRlZmluZWQgaW4gdGhlIE9TQyBjb25maWd1cmF0aW9uIG9mIHRoZSB7QGxpbmsgc2VydmVyfSkuXG4gICAqL1xuICBzZW5kKGFkZHJlc3MsIGFyZ3MsIHVybCA9IG51bGwsIHBvcnQgPSBudWxsKSB7XG4gICAgY29uc3QgbXNnID0geyBhZGRyZXNzLCBhcmdzIH07XG5cbiAgICB0cnkge1xuICAgICAgaWYgKHVybCAmJiBwb3J0KVxuICAgICAgICB0aGlzLm9zYy5zZW5kKG1zZywgdXJsLCBwb3J0KTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5vc2Muc2VuZChtc2cpOyAvLyB1c2UgZGVmYXVsdHMgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgc2VuZGluZyBPU0MgbWVzc2FnZTonLCBlKTtcbiAgICB9XG5cbiAgICBsb2coYHNlbmQgLSBhZGRyZXNzIFwiJHthZGRyZXNzfVwiYCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgY2FsbGJhY2tzIGZvciBPU0MgbWVzYWdlcy4gVGhlIHNlcnZlciBsaXN0ZW5zIHRvIE9TQyBtZXNzYWdlc1xuICAgKiBhdCB0aGUgYWRkcmVzcyBhbmQgcG9ydCBkZWZpbmVkIGluIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSB7QGxpbmsgc2VydmVyfS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHdpbGRjYXJkIC0gV2lsZGNhcmQgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIHdoZW4gYW4gT1NDXG4gICAqICBtZXNzYWdlIGlzIHJlY2VpdmVkIG9uIHRoZSBnaXZlbiBhZGRyZXNzLlxuICAgKi9cbiAgcmVjZWl2ZShhZGRyZXNzLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGxpc3RlbmVyID0geyBhZGRyZXNzLCBjYWxsYmFjayB9XG4gICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIC0gaW1wbGVtZW50XG4gICAqL1xuICBicm9hZGNhc3QoKSB7fVxufVxuXG5zZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBPc2MpO1xuXG5leHBvcnQgZGVmYXVsdCBPc2M7XG5cbiJdfQ==