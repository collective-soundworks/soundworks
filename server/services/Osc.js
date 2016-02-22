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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvT3NjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFBa0IsT0FBTzs7OzttQkFDVCxLQUFLOzs7O2tDQUNNLHdCQUF3Qjs7Ozt3Q0FDbEIsOEJBQThCOzs7O0FBRy9ELElBQU0sR0FBRyxHQUFHLHdCQUFNLGdCQUFnQixDQUFDLENBQUM7QUFDcEMsSUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDOzs7Ozs7OztJQU8zQixHQUFHO1lBQUgsR0FBRzs7QUFDSSxXQURQLEdBQUcsR0FDTzswQkFEVixHQUFHOztBQUVMLCtCQUZFLEdBQUcsNkNBRUMsVUFBVSxFQUFFOztBQUVsQixRQUFNLFFBQVEsR0FBRztBQUNmLG1CQUFhLEVBQUUsS0FBSztLQUVyQixDQUFBOzs7QUFFRCxRQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUV6QixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUNyQixRQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs7QUFFMUQsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM5Qzs7ZUFmRyxHQUFHOztXQWlCRixpQkFBRztBQUNOLFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO0FBQ2pELFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRTlFLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxpQkFBSSxPQUFPLENBQUM7O0FBRXpCLG9CQUFZLEVBQUUsU0FBUyxDQUFDLGNBQWM7QUFDdEMsaUJBQVMsRUFBRSxTQUFTLENBQUMsV0FBVzs7QUFFaEMscUJBQWEsRUFBRSxTQUFTLENBQUMsV0FBVztBQUNwQyxrQkFBVSxFQUFFLFNBQVMsQ0FBQyxRQUFRO09BQy9CLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBTTtBQUN6QixZQUFNLE9BQU8sR0FBTSxTQUFTLENBQUMsY0FBYyxTQUFJLFNBQVMsQ0FBQyxXQUFXLEFBQUUsQ0FBQztBQUN2RSxZQUFNLElBQUksR0FBTSxTQUFTLENBQUMsV0FBVyxTQUFJLFNBQVMsQ0FBQyxRQUFRLEFBQUUsQ0FBQzs7QUFFOUQsV0FBRyxrQ0FBZ0MsT0FBTyxDQUFHLENBQUM7QUFDOUMsV0FBRyxnQ0FBOEIsSUFBSSxDQUFHLENBQUM7T0FDMUMsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNqQjs7Ozs7Ozs7V0FNUyxvQkFBQyxHQUFHLEVBQUU7QUFDZCxVQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUNwQyxZQUFJLEdBQUcsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLE9BQU8sRUFDbEMsUUFBUSxDQUFDLFFBQVEsTUFBQSxDQUFqQixRQUFRLHFCQUFhLEdBQUcsQ0FBQyxJQUFJLEVBQUMsQ0FBQTtPQUNqQyxDQUFDLENBQUM7OztLQUdKOzs7Ozs7Ozs7Ozs7O1dBV0csY0FBQyxPQUFPLEVBQUUsSUFBSSxFQUEyQjtVQUF6QixHQUFHLHlEQUFHLElBQUk7VUFBRSxJQUFJLHlEQUFHLElBQUk7O0FBQ3pDLFVBQU0sR0FBRyxHQUFHLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLENBQUM7O0FBRTlCLFVBQUk7QUFDRixZQUFJLEdBQUcsSUFBSSxJQUFJLEVBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUU5QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUN0QixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsZUFBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUNwRDs7QUFFRCxTQUFHLHdDQUFvQixPQUFPLGtDQUFRLElBQUksR0FBQyxDQUFDO0tBQzdDOzs7Ozs7Ozs7OztXQVNNLGlCQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDekIsVUFBTSxRQUFRLEdBQUcsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQTtBQUN0QyxVQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNoQzs7Ozs7OztXQUtRLHFCQUFHLEVBQUU7OztTQTlGVixHQUFHOzs7QUFpR1Qsc0NBQXFCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7O3FCQUVoQyxHQUFHIiwiZmlsZSI6Ii9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvT3NjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBvc2MgZnJvbSAnb3NjJztcbmltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcblxuXG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3Jrczpvc2MnKTtcbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpvc2MnO1xuXG4vKipcbiAqIFNlcnZlciBvbmx5IHNlcnZpY2UgZm9yIE9TQyBjb21tdW5pY2F0aW9ucyB3aXRodyBleHRlcm5hbCBzb2Z0d2FyZXNcbiAqIChlLmcuIE1heCkuIE9ubHkgc3VwcG9ydCBVRFAgcHJvdG9jb2wuXG4gKiBAdG9kbyAtIGRlZmluZSBpZiBvdGhlciBwcm90b2NvbHMgc2hvdWxkIGJlIHN1cHBvcnRlZC5cbiAqL1xuY2xhc3MgT3NjIGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgb3NjQ29uZmlnUGF0aDogJ29zYycsXG4gICAgICAvLyBwcm90b2NvbDogJ3VkcCcsXG4gICAgfVxuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZSA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuXG4gICAgdGhpcy5fb25NZXNzYWdlID0gdGhpcy5fb25NZXNzYWdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBjb25zdCBvc2NDb25maWdQYXRoID0gdGhpcy5vcHRpb25zLm9zY0NvbmZpZ1BhdGg7XG4gICAgY29uc3Qgb3NjQ29uZmlnID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQob3NjQ29uZmlnUGF0aClbb3NjQ29uZmlnUGF0aF07XG5cbiAgICB0aGlzLm9zYyA9IG5ldyBvc2MuVURQUG9ydCh7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBwb3J0IHdlJ3JlIGxpc3RlbmluZyBvbi5cbiAgICAgIGxvY2FsQWRkcmVzczogb3NjQ29uZmlnLnJlY2VpdmVBZGRyZXNzLFxuICAgICAgbG9jYWxQb3J0OiBvc2NDb25maWcucmVjZWl2ZVBvcnQsXG4gICAgICAvLyBUaGlzIGlzIHRoZSBwb3J0IHdlIHVzZSB0byBzZW5kIG1lc3NhZ2VzLlxuICAgICAgcmVtb3RlQWRkcmVzczogb3NjQ29uZmlnLnNlbmRBZGRyZXNzLFxuICAgICAgcmVtb3RlUG9ydDogb3NjQ29uZmlnLnNlbmRQb3J0LFxuICAgIH0pO1xuXG4gICAgdGhpcy5vc2Mub24oJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVjZWl2ZSA9IGAke29zY0NvbmZpZy5yZWNlaXZlQWRkcmVzc306JHtvc2NDb25maWcucmVjZWl2ZVBvcnR9YDtcbiAgICAgIGNvbnN0IHNlbmQgPSBgJHtvc2NDb25maWcuc2VuZEFkZHJlc3N9OiR7b3NjQ29uZmlnLnNlbmRQb3J0fWA7XG5cbiAgICAgIGxvZyhgW09TQyBvdmVyIFVEUF0gUmVjZWl2aW5nIG9uICR7cmVjZWl2ZX1gKTtcbiAgICAgIGxvZyhgW09TQyBvdmVyIFVEUF0gU2VuZGluZyBvbiAke3NlbmR9YCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9zYy5vbignbWVzc2FnZScsIHRoaXMuX29uTWVzc2FnZSk7XG4gICAgdGhpcy5vc2Mub3BlbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGFsbCB0aGUgbGlzdGVuZXJzIGFjY29yZGluZyB0byB0aGUgYWRkcmVzcyBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9vbk1lc3NhZ2UobXNnKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG4gICAgICBpZiAobXNnLmFkZHJlc3MgPT09IGxpc3RlbmVyLmFkZHJlc3MpXG4gICAgICAgIGxpc3RlbmVyLmNhbGxiYWNrKC4uLm1zZy5hcmdzKVxuICAgIH0pO1xuXG4gICAgLy8gbG9nKGBtZXNzYWdlIC0gYWRkcmVzcyBcIiR7bXNnLmFkZHJlc3N9XCJgLCAuLi5tc2cuYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhbiBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGFkZHJlc3MgLSBBZGRyZXNzIG9mIHRoZSBPU0MgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtBcnJheX0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdXJsPW51bGxdIC0gVVJMIHRvIHNlbmQgdGhlIE9TQyBtZXNzYWdlIHRvIChpZiBub3Qgc3BlY2lmaWVkLFxuICAgKiAgdXNlcyB0aGUgcG9ydCBkZWZpbmVkIGluIHRoZSBPU0MgY29uZmlndXJhdGlvbiBvZiB0aGUge0BsaW5rIHNlcnZlcn0pLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BvcnQ9bnVsbF0tIFBvcnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0byAoaWYgbm90IHNwZWNpZmllZCxcbiAgICogIHVzZXMgdGhlIHBvcnQgZGVmaW5lZCBpbiB0aGUgT1NDIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHtAbGluayBzZXJ2ZXJ9KS5cbiAgICovXG4gIHNlbmQoYWRkcmVzcywgYXJncywgdXJsID0gbnVsbCwgcG9ydCA9IG51bGwpIHtcbiAgICBjb25zdCBtc2cgPSB7IGFkZHJlc3MsIGFyZ3MgfTtcblxuICAgIHRyeSB7XG4gICAgICBpZiAodXJsICYmIHBvcnQpXG4gICAgICAgIHRoaXMub3NjLnNlbmQobXNnLCB1cmwsIHBvcnQpO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLm9zYy5zZW5kKG1zZyk7IC8vIHVzZSBkZWZhdWx0cyAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBzZW5kaW5nIE9TQyBtZXNzYWdlOicsIGUpO1xuICAgIH1cblxuICAgIGxvZyhgc2VuZCAtIGFkZHJlc3MgXCIke2FkZHJlc3N9XCJgLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBjYWxsYmFja3MgZm9yIE9TQyBtZXNhZ2VzLiBUaGUgc2VydmVyIGxpc3RlbnMgdG8gT1NDIG1lc3NhZ2VzXG4gICAqIGF0IHRoZSBhZGRyZXNzIGFuZCBwb3J0IGRlZmluZWQgaW4gdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHtAbGluayBzZXJ2ZXJ9LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gd2lsZGNhcmQgLSBXaWxkY2FyZCBvZiB0aGUgT1NDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgd2hlbiBhbiBPU0NcbiAgICogIG1lc3NhZ2UgaXMgcmVjZWl2ZWQgb24gdGhlIGdpdmVuIGFkZHJlc3MuXG4gICAqL1xuICByZWNlaXZlKGFkZHJlc3MsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbGlzdGVuZXIgPSB7IGFkZHJlc3MsIGNhbGxiYWNrIH1cbiAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gIH1cblxuICAvKipcbiAgICogQHRvZG8gLSBpbXBsZW1lbnRcbiAgICovXG4gIGJyb2FkY2FzdCgpIHt9XG59XG5cbnNlcnZlclNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIE9zYyk7XG5cbmV4cG9ydCBkZWZhdWx0IE9zYztcblxuIl19