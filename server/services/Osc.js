'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _osc = require('osc');

var _osc2 = _interopRequireDefault(_osc);

var _coreServerService = require('../core/ServerService');

var _coreServerService2 = _interopRequireDefault(_coreServerService);

var _coreServerServiceManager = require('../core/serverServiceManager');

var _coreServerServiceManager2 = _interopRequireDefault(_coreServerServiceManager);

var log = (0, _debug2['default'])('soundworks:osc');
var SERVICE_ID = 'service:osc';

/**
 * Server only service for OSC communications with an external software (e.g. Max).
 * Only support UDP protocol for now.
 * @todo - should be properly tested.
 * @todo - define if other protocols need to be added.
 */

var Osc = (function (_ServerActivity) {
  _inherits(Osc, _ServerActivity);

  function Osc() {
    _classCallCheck(this, Osc);

    _get(Object.getPrototypeOf(Osc.prototype), 'constructor', this).call(this, SERVICE_ID);

    var defaults = {
      oscConfigPath: 'osc'
    };

    // protocol: 'udp',
    this.configure(defaults);

    this._listeners = [];
    this._sharedConfigService = this.require('shared-config');

    this._onMessage = this._onMessage.bind(this);
  }

  _createClass(Osc, [{
    key: 'start',
    value: function start() {
      var oscConfigPath = this.options.oscConfigPath;
      var oscConfig = this._sharedConfigService.get(oscConfigPath)[oscConfigPath];

      this.osc = new _osc2['default'].UDPPort({
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
      this.listeners.forEach(function (listener) {
        if (msg.address === listener.address) listener.callback(msg);
      });

      log.apply(undefined, ['message - address "' + msg.address + '"'].concat(_toConsumableArray(msg.args)));
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

      log.apply(undefined, ['send - address "' + address + '"'].concat(_toConsumableArray(args)));
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
      this.listeners.push(listener);
    }
  }]);

  return Osc;
})(ServerActivity);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvT3NjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3FCQUFrQixPQUFPOzs7O21CQUNULEtBQUs7Ozs7aUNBQ0ssdUJBQXVCOzs7O3dDQUNoQiw4QkFBOEI7Ozs7QUFHL0QsSUFBTSxHQUFHLEdBQUcsd0JBQU0sZ0JBQWdCLENBQUMsQ0FBQztBQUNwQyxJQUFNLFVBQVUsR0FBRyxhQUFhLENBQUM7Ozs7Ozs7OztJQVEzQixHQUFHO1lBQUgsR0FBRzs7QUFDSSxXQURQLEdBQUcsR0FDTzswQkFEVixHQUFHOztBQUVMLCtCQUZFLEdBQUcsNkNBRUMsVUFBVSxFQUFFOztBQUVsQixRQUFNLFFBQVEsR0FBRztBQUNmLG1CQUFhLEVBQUUsS0FBSztLQUVyQixDQUFBOzs7QUFFRCxRQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUV6QixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUNyQixRQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs7QUFFMUQsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM5Qzs7ZUFmRyxHQUFHOztXQWlCRixpQkFBRztBQUNOLFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO0FBQ2pELFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRTlFLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxpQkFBSSxPQUFPLENBQUM7O0FBRXpCLG9CQUFZLEVBQUUsU0FBUyxDQUFDLGNBQWM7QUFDdEMsaUJBQVMsRUFBRSxTQUFTLENBQUMsV0FBVzs7QUFFaEMscUJBQWEsRUFBRSxTQUFTLENBQUMsV0FBVztBQUNwQyxrQkFBVSxFQUFFLFNBQVMsQ0FBQyxRQUFRO09BQy9CLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBTTtBQUN6QixZQUFNLE9BQU8sR0FBTSxTQUFTLENBQUMsY0FBYyxTQUFJLFNBQVMsQ0FBQyxXQUFXLEFBQUUsQ0FBQztBQUN2RSxZQUFNLElBQUksR0FBTSxTQUFTLENBQUMsV0FBVyxTQUFJLFNBQVMsQ0FBQyxRQUFRLEFBQUUsQ0FBQzs7QUFFOUQsV0FBRyxrQ0FBZ0MsT0FBTyxDQUFHLENBQUM7QUFDOUMsV0FBRyxnQ0FBOEIsSUFBSSxDQUFHLENBQUM7T0FDMUMsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNqQjs7Ozs7Ozs7V0FNUyxvQkFBQyxHQUFHLEVBQUU7QUFDZCxVQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUNuQyxZQUFJLEdBQUcsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLE9BQU8sRUFDbEMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtPQUN6QixDQUFDLENBQUM7O0FBRUgsU0FBRywyQ0FBdUIsR0FBRyxDQUFDLE9BQU8sa0NBQVEsR0FBRyxDQUFDLElBQUksR0FBQyxDQUFDO0tBQ3hEOzs7Ozs7Ozs7Ozs7O1dBV0csY0FBQyxPQUFPLEVBQUUsSUFBSSxFQUEyQjtVQUF6QixHQUFHLHlEQUFHLElBQUk7VUFBRSxJQUFJLHlEQUFHLElBQUk7O0FBQ3pDLFVBQU0sR0FBRyxHQUFHLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLENBQUM7O0FBRTlCLFVBQUk7QUFDRixZQUFJLEdBQUcsSUFBSSxJQUFJLEVBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUU5QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUN0QixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsZUFBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUNwRDs7QUFFRCxTQUFHLHdDQUFvQixPQUFPLGtDQUFRLElBQUksR0FBQyxDQUFDO0tBQzdDOzs7Ozs7Ozs7OztXQVNNLGlCQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDekIsVUFBTSxRQUFRLEdBQUcsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQTtBQUN0QyxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUMvQjs7O1NBekZHLEdBQUc7R0FBUyxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvT3NjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBvc2MgZnJvbSAnb3NjJztcbmltcG9ydCBTZXJ2ZXJTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmVyU2VydmljZSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5cblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6b3NjJyk7XG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6b3NjJztcblxuLyoqXG4gKiBTZXJ2ZXIgb25seSBzZXJ2aWNlIGZvciBPU0MgY29tbXVuaWNhdGlvbnMgd2l0aCBhbiBleHRlcm5hbCBzb2Z0d2FyZSAoZS5nLiBNYXgpLlxuICogT25seSBzdXBwb3J0IFVEUCBwcm90b2NvbCBmb3Igbm93LlxuICogQHRvZG8gLSBzaG91bGQgYmUgcHJvcGVybHkgdGVzdGVkLlxuICogQHRvZG8gLSBkZWZpbmUgaWYgb3RoZXIgcHJvdG9jb2xzIG5lZWQgdG8gYmUgYWRkZWQuXG4gKi9cbmNsYXNzIE9zYyBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG9zY0NvbmZpZ1BhdGg6ICdvc2MnLFxuICAgICAgLy8gcHJvdG9jb2w6ICd1ZHAnLFxuICAgIH1cblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcblxuICAgIHRoaXMuX29uTWVzc2FnZSA9IHRoaXMuX29uTWVzc2FnZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgY29uc3Qgb3NjQ29uZmlnUGF0aCA9IHRoaXMub3B0aW9ucy5vc2NDb25maWdQYXRoO1xuICAgIGNvbnN0IG9zY0NvbmZpZyA9IHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UuZ2V0KG9zY0NvbmZpZ1BhdGgpW29zY0NvbmZpZ1BhdGhdO1xuXG4gICAgdGhpcy5vc2MgPSBuZXcgb3NjLlVEUFBvcnQoe1xuICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSdyZSBsaXN0ZW5pbmcgb24uXG4gICAgICBsb2NhbEFkZHJlc3M6IG9zY0NvbmZpZy5yZWNlaXZlQWRkcmVzcyxcbiAgICAgIGxvY2FsUG9ydDogb3NjQ29uZmlnLnJlY2VpdmVQb3J0LFxuICAgICAgLy8gVGhpcyBpcyB0aGUgcG9ydCB3ZSB1c2UgdG8gc2VuZCBtZXNzYWdlcy5cbiAgICAgIHJlbW90ZUFkZHJlc3M6IG9zY0NvbmZpZy5zZW5kQWRkcmVzcyxcbiAgICAgIHJlbW90ZVBvcnQ6IG9zY0NvbmZpZy5zZW5kUG9ydCxcbiAgICB9KTtcblxuICAgIHRoaXMub3NjLm9uKCdyZWFkeScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlY2VpdmUgPSBgJHtvc2NDb25maWcucmVjZWl2ZUFkZHJlc3N9OiR7b3NjQ29uZmlnLnJlY2VpdmVQb3J0fWA7XG4gICAgICBjb25zdCBzZW5kID0gYCR7b3NjQ29uZmlnLnNlbmRBZGRyZXNzfToke29zY0NvbmZpZy5zZW5kUG9ydH1gO1xuXG4gICAgICBsb2coYFtPU0Mgb3ZlciBVRFBdIFJlY2VpdmluZyBvbiAke3JlY2VpdmV9YCk7XG4gICAgICBsb2coYFtPU0Mgb3ZlciBVRFBdIFNlbmRpbmcgb24gJHtzZW5kfWApO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vc2Mub24oJ21lc3NhZ2UnLCB0aGlzLl9vbk1lc3NhZ2UpO1xuICAgIHRoaXMub3NjLm9wZW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBhbGwgdGhlIGxpc3RlbmVycyBhY2NvcmRpbmcgdG8gdGhlIGFkZHJlc3Mgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25NZXNzYWdlKG1zZykge1xuICAgIHRoaXMubGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG4gICAgICBpZiAobXNnLmFkZHJlc3MgPT09IGxpc3RlbmVyLmFkZHJlc3MpXG4gICAgICAgIGxpc3RlbmVyLmNhbGxiYWNrKG1zZylcbiAgICB9KTtcblxuICAgIGxvZyhgbWVzc2FnZSAtIGFkZHJlc3MgXCIke21zZy5hZGRyZXNzfVwiYCwgLi4ubXNnLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYW4gT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhZGRyZXNzIC0gQWRkcmVzcyBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3VybD1udWxsXSAtIFVSTCB0byBzZW5kIHRoZSBPU0MgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCxcbiAgICogIHVzZXMgdGhlIHBvcnQgZGVmaW5lZCBpbiB0aGUgT1NDIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHtAbGluayBzZXJ2ZXJ9KS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwb3J0PW51bGxdLSBQb3J0IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8gKGlmIG5vdCBzcGVjaWZpZWQsXG4gICAqICB1c2VzIHRoZSBwb3J0IGRlZmluZWQgaW4gdGhlIE9TQyBjb25maWd1cmF0aW9uIG9mIHRoZSB7QGxpbmsgc2VydmVyfSkuXG4gICAqL1xuICBzZW5kKGFkZHJlc3MsIGFyZ3MsIHVybCA9IG51bGwsIHBvcnQgPSBudWxsKSB7XG4gICAgY29uc3QgbXNnID0geyBhZGRyZXNzLCBhcmdzIH07XG5cbiAgICB0cnkge1xuICAgICAgaWYgKHVybCAmJiBwb3J0KVxuICAgICAgICB0aGlzLm9zYy5zZW5kKG1zZywgdXJsLCBwb3J0KTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5vc2Muc2VuZChtc2cpOyAvLyB1c2UgZGVmYXVsdHMgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgc2VuZGluZyBPU0MgbWVzc2FnZTonLCBlKTtcbiAgICB9XG5cbiAgICBsb2coYHNlbmQgLSBhZGRyZXNzIFwiJHthZGRyZXNzfVwiYCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgY2FsbGJhY2tzIGZvciBPU0MgbWVzYWdlcy4gVGhlIHNlcnZlciBsaXN0ZW5zIHRvIE9TQyBtZXNzYWdlc1xuICAgKiBhdCB0aGUgYWRkcmVzcyBhbmQgcG9ydCBkZWZpbmVkIGluIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSB7QGxpbmsgc2VydmVyfS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHdpbGRjYXJkIC0gV2lsZGNhcmQgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIHdoZW4gYW4gT1NDXG4gICAqICBtZXNzYWdlIGlzIHJlY2VpdmVkIG9uIHRoZSBnaXZlbiBhZGRyZXNzLlxuICAgKi9cbiAgcmVjZWl2ZShhZGRyZXNzLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGxpc3RlbmVyID0geyBhZGRyZXNzLCBjYWxsYmFjayB9XG4gICAgdGhpcy5saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gIH1cbn1cbiJdfQ==