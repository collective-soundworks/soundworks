'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _osc = require('osc');

var _osc2 = _interopRequireDefault(_osc);

var _coreServerActivity = require('../core/ServerActivity');

var _coreServerActivity2 = _interopRequireDefault(_coreServerActivity);

var _coreServerServiceManager = require('../core/serverServiceManager');

var _coreServerServiceManager2 = _interopRequireDefault(_coreServerServiceManager);

var log = (0, _debug2['default'])('soundworks:osc');
var SERVICE_ID = 'service:osc';

/**
 * Server only service for OSC communications withw external softwares
 * (e.g. Max). Only support UDP protocol.
 * @todo - define if other protocols should be supported.
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
      this._listeners.forEach(function (listener) {
        if (msg.address === listener.address) listener.callback.apply(listener, _toConsumableArray(msg.args));
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
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, Osc);

exports['default'] = Osc;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL3NlcnZpY2VzL09zYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBQWtCLE9BQU87Ozs7bUJBQ1QsS0FBSzs7OztrQ0FDTSx3QkFBd0I7Ozs7d0NBQ2xCLDhCQUE4Qjs7OztBQUcvRCxJQUFNLEdBQUcsR0FBRyx3QkFBTSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3BDLElBQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQzs7Ozs7Ozs7SUFPM0IsR0FBRztZQUFILEdBQUc7O0FBQ0ksV0FEUCxHQUFHLEdBQ087MEJBRFYsR0FBRzs7QUFFTCwrQkFGRSxHQUFHLDZDQUVDLFVBQVUsRUFBRTs7QUFFbEIsUUFBTSxRQUFRLEdBQUc7QUFDZixtQkFBYSxFQUFFLEtBQUs7S0FFckIsQ0FBQTs7O0FBRUQsUUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFekIsUUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDckIsUUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBRTFELFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDOUM7O2VBZkcsR0FBRzs7V0FpQkYsaUJBQUc7QUFDTixVQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztBQUNqRCxVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUU5RSxVQUFJLENBQUMsR0FBRyxHQUFHLElBQUksaUJBQUksT0FBTyxDQUFDOztBQUV6QixvQkFBWSxFQUFFLFNBQVMsQ0FBQyxjQUFjO0FBQ3RDLGlCQUFTLEVBQUUsU0FBUyxDQUFDLFdBQVc7O0FBRWhDLHFCQUFhLEVBQUUsU0FBUyxDQUFDLFdBQVc7QUFDcEMsa0JBQVUsRUFBRSxTQUFTLENBQUMsUUFBUTtPQUMvQixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDekIsWUFBTSxPQUFPLEdBQU0sU0FBUyxDQUFDLGNBQWMsU0FBSSxTQUFTLENBQUMsV0FBVyxBQUFFLENBQUM7QUFDdkUsWUFBTSxJQUFJLEdBQU0sU0FBUyxDQUFDLFdBQVcsU0FBSSxTQUFTLENBQUMsUUFBUSxBQUFFLENBQUM7O0FBRTlELFdBQUcsa0NBQWdDLE9BQU8sQ0FBRyxDQUFDO0FBQzlDLFdBQUcsZ0NBQThCLElBQUksQ0FBRyxDQUFDO09BQzFDLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hDLFVBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDakI7Ozs7Ozs7O1dBTVMsb0JBQUMsR0FBRyxFQUFFO0FBQ2QsVUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDcEMsWUFBSSxHQUFHLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxPQUFPLEVBQ2xDLFFBQVEsQ0FBQyxRQUFRLE1BQUEsQ0FBakIsUUFBUSxxQkFBYSxHQUFHLENBQUMsSUFBSSxFQUFDLENBQUE7T0FDakMsQ0FBQyxDQUFDOzs7S0FHSjs7Ozs7Ozs7Ozs7OztXQVdHLGNBQUMsT0FBTyxFQUFFLElBQUksRUFBMkI7VUFBekIsR0FBRyx5REFBRyxJQUFJO1VBQUUsSUFBSSx5REFBRyxJQUFJOztBQUN6QyxVQUFNLEdBQUcsR0FBRyxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxDQUFDOztBQUU5QixVQUFJO0FBQ0YsWUFBSSxHQUFHLElBQUksSUFBSSxFQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FFOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDdEIsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLGVBQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDcEQ7O0FBRUQsU0FBRyx3Q0FBb0IsT0FBTyxrQ0FBUSxJQUFJLEdBQUMsQ0FBQztLQUM3Qzs7Ozs7Ozs7Ozs7V0FTTSxpQkFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3pCLFVBQU0sUUFBUSxHQUFHLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUE7QUFDdEMsVUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDaEM7Ozs7Ozs7V0FLUSxxQkFBRyxFQUFFOzs7U0E5RlYsR0FBRzs7O0FBaUdULHNDQUFxQixRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztxQkFFaEMsR0FBRyIsImZpbGUiOiIvVXNlcnMvc2NobmVsbC9EZXZlbG9wbWVudC93ZWIvY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3Mvc3JjL3NlcnZlci9zZXJ2aWNlcy9Pc2MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IG9zYyBmcm9tICdvc2MnO1xuaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuXG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOm9zYycpO1xuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOm9zYyc7XG5cbi8qKlxuICogU2VydmVyIG9ubHkgc2VydmljZSBmb3IgT1NDIGNvbW11bmljYXRpb25zIHdpdGh3IGV4dGVybmFsIHNvZnR3YXJlc1xuICogKGUuZy4gTWF4KS4gT25seSBzdXBwb3J0IFVEUCBwcm90b2NvbC5cbiAqIEB0b2RvIC0gZGVmaW5lIGlmIG90aGVyIHByb3RvY29scyBzaG91bGQgYmUgc3VwcG9ydGVkLlxuICovXG5jbGFzcyBPc2MgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBvc2NDb25maWdQYXRoOiAnb3NjJyxcbiAgICAgIC8vIHByb3RvY29sOiAndWRwJyxcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG5cbiAgICB0aGlzLl9vbk1lc3NhZ2UgPSB0aGlzLl9vbk1lc3NhZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGNvbnN0IG9zY0NvbmZpZ1BhdGggPSB0aGlzLm9wdGlvbnMub3NjQ29uZmlnUGF0aDtcbiAgICBjb25zdCBvc2NDb25maWcgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmdldChvc2NDb25maWdQYXRoKVtvc2NDb25maWdQYXRoXTtcblxuICAgIHRoaXMub3NjID0gbmV3IG9zYy5VRFBQb3J0KHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIHBvcnQgd2UncmUgbGlzdGVuaW5nIG9uLlxuICAgICAgbG9jYWxBZGRyZXNzOiBvc2NDb25maWcucmVjZWl2ZUFkZHJlc3MsXG4gICAgICBsb2NhbFBvcnQ6IG9zY0NvbmZpZy5yZWNlaXZlUG9ydCxcbiAgICAgIC8vIFRoaXMgaXMgdGhlIHBvcnQgd2UgdXNlIHRvIHNlbmQgbWVzc2FnZXMuXG4gICAgICByZW1vdGVBZGRyZXNzOiBvc2NDb25maWcuc2VuZEFkZHJlc3MsXG4gICAgICByZW1vdGVQb3J0OiBvc2NDb25maWcuc2VuZFBvcnQsXG4gICAgfSk7XG5cbiAgICB0aGlzLm9zYy5vbigncmVhZHknLCAoKSA9PiB7XG4gICAgICBjb25zdCByZWNlaXZlID0gYCR7b3NjQ29uZmlnLnJlY2VpdmVBZGRyZXNzfToke29zY0NvbmZpZy5yZWNlaXZlUG9ydH1gO1xuICAgICAgY29uc3Qgc2VuZCA9IGAke29zY0NvbmZpZy5zZW5kQWRkcmVzc306JHtvc2NDb25maWcuc2VuZFBvcnR9YDtcblxuICAgICAgbG9nKGBbT1NDIG92ZXIgVURQXSBSZWNlaXZpbmcgb24gJHtyZWNlaXZlfWApO1xuICAgICAgbG9nKGBbT1NDIG92ZXIgVURQXSBTZW5kaW5nIG9uICR7c2VuZH1gKTtcbiAgICB9KTtcblxuICAgIHRoaXMub3NjLm9uKCdtZXNzYWdlJywgdGhpcy5fb25NZXNzYWdlKTtcbiAgICB0aGlzLm9zYy5vcGVuKCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgYWxsIHRoZSBsaXN0ZW5lcnMgYWNjb3JkaW5nIHRvIHRoZSBhZGRyZXNzIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uTWVzc2FnZShtc2cpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgIGlmIChtc2cuYWRkcmVzcyA9PT0gbGlzdGVuZXIuYWRkcmVzcylcbiAgICAgICAgbGlzdGVuZXIuY2FsbGJhY2soLi4ubXNnLmFyZ3MpXG4gICAgfSk7XG5cbiAgICAvLyBsb2coYG1lc3NhZ2UgLSBhZGRyZXNzIFwiJHttc2cuYWRkcmVzc31cImAsIC4uLm1zZy5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGFuIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzcyAtIEFkZHJlc3Mgb2YgdGhlIE9TQyBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFt1cmw9bnVsbF0gLSBVUkwgdG8gc2VuZCB0aGUgT1NDIG1lc3NhZ2UgdG8gKGlmIG5vdCBzcGVjaWZpZWQsXG4gICAqICB1c2VzIHRoZSBwb3J0IGRlZmluZWQgaW4gdGhlIE9TQyBjb25maWd1cmF0aW9uIG9mIHRoZSB7QGxpbmsgc2VydmVyfSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbcG9ydD1udWxsXS0gUG9ydCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvIChpZiBub3Qgc3BlY2lmaWVkLFxuICAgKiAgdXNlcyB0aGUgcG9ydCBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlndXJhdGlvbiBvZiB0aGUge0BsaW5rIHNlcnZlcn0pLlxuICAgKi9cbiAgc2VuZChhZGRyZXNzLCBhcmdzLCB1cmwgPSBudWxsLCBwb3J0ID0gbnVsbCkge1xuICAgIGNvbnN0IG1zZyA9IHsgYWRkcmVzcywgYXJncyB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICh1cmwgJiYgcG9ydClcbiAgICAgICAgdGhpcy5vc2Muc2VuZChtc2csIHVybCwgcG9ydCk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMub3NjLnNlbmQobXNnKTsgLy8gdXNlIGRlZmF1bHRzIChhcyBkZWZpbmVkIGluIHRoZSBjb25maWcpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHdoaWxlIHNlbmRpbmcgT1NDIG1lc3NhZ2U6JywgZSk7XG4gICAgfVxuXG4gICAgbG9nKGBzZW5kIC0gYWRkcmVzcyBcIiR7YWRkcmVzc31cImAsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGNhbGxiYWNrcyBmb3IgT1NDIG1lc2FnZXMuIFRoZSBzZXJ2ZXIgbGlzdGVucyB0byBPU0MgbWVzc2FnZXNcbiAgICogYXQgdGhlIGFkZHJlc3MgYW5kIHBvcnQgZGVmaW5lZCBpbiB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUge0BsaW5rIHNlcnZlcn0uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB3aWxkY2FyZCAtIFdpbGRjYXJkIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCB3aGVuIGFuIE9TQ1xuICAgKiAgbWVzc2FnZSBpcyByZWNlaXZlZCBvbiB0aGUgZ2l2ZW4gYWRkcmVzcy5cbiAgICovXG4gIHJlY2VpdmUoYWRkcmVzcywgY2FsbGJhY2spIHtcbiAgICBjb25zdCBsaXN0ZW5lciA9IHsgYWRkcmVzcywgY2FsbGJhY2sgfVxuICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdG9kbyAtIGltcGxlbWVudFxuICAgKi9cbiAgYnJvYWRjYXN0KCkge31cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgT3NjKTtcblxuZXhwb3J0IGRlZmF1bHQgT3NjO1xuXG4iXX0=