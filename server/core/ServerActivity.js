'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _sockets = require('./sockets');

var _sockets2 = _interopRequireDefault(_sockets);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _serverServiceManager = require('./serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

var _events = require('events');

// @todo - remove EventEmitter ? (Implement our own listeners)

/**
 * Base class used to create any *Soundworks* piers on the server side.
 *
 * While the sequence of user interactions and exchanges between client and server is determined on the client side, the server side modules are ready to receive requests from the corresponding client side modules as soon as a client is connected to the server.
 *
 * Each module should have a {@link ServerModule#connect} and a {@link ServerModule#disconnect} methods.
 * Any module mapped to the type of client `'clientType'` (thanks to the {@link server#map} method) calls its {@link ServerModule#connect} method when such a client connects to the server, and its {@link ServerModule#disconnect} method when such a client disconnects from the server.
 *
 * (See also {@link src/client/ClientModule.js~ClientModule} on the client side.)
 *
 * **Note:** a more complete example of how to write a module is in the [Example](manual/example.html) section.
 *
 * @example
 * class MyPier extends Pier {
 *   constructor(name) {
 *     super(name);
 *
 *     // ...
 *   }
 *
 *   connect(client) {
 *     super.connect(client);
 *
 *     // ...
 *   }
 *
 *   disconnect(client) {
 *     super.disconnect(client);
 *
 *     // ...
 *   }
 * }
 */

var ServerActivity = (function (_EventEmitter) {
  _inherits(ServerActivity, _EventEmitter);

  /**
   * Creates an instance of the class.
   * @param {String} id - The id of the activity.
   */

  function ServerActivity(id) {
    _classCallCheck(this, ServerActivity);

    _get(Object.getPrototypeOf(ServerActivity.prototype), 'constructor', this).call(this);

    /**
     * The id of the activity. This id must match a client side `Activity` id in order
     * to create the socket channel between the activity and its client side peer.
     * @type {string}
     */
    this.id = id;

    /**
     * The client types on which the activity should be mapped.
     * @type {Array}
     * @private
     */
    this._clientTypes = [];

    /**
     * Options of the activity. (Should be changed by calling `this.configure`)
     */
    this.options = {};

    // register as an existing activity to the server
    _server2['default'].setActivity(this);
  }

  /**
   * Retrieve a service.
   */

  _createClass(ServerActivity, [{
    key: 'require',
    value: function require(id, options) {
      return _serverServiceManager2['default'].require(id, options);
    }

    /**
     * Start an activity, is automatically called on server startup.
     */
  }, {
    key: 'start',
    value: function start() {
      // register on which client the activity should apply.
      _server2['default'].setMap(this._clientTypes, this);
    }

    /**
     * @param {String|Array} val - The client type(s) on which the activity should be mapped
     */
  }, {
    key: 'addClientType',
    value: function addClientType(val) {
      if (arguments.length === 1) {
        if (typeof val === 'string') val = [val];
      } else {
        val = _Array$from(arguments);
      }

      this._clientTypes = this._clientTypes.concat(val);
    }

    /**
     * Configure the activity.
     * @param {Object} options
     */
  }, {
    key: 'configure',
    value: function configure(options) {
      if (options.clientType) {
        this.addClientType(options.clientType);
        delete options.clientType;
      }

      _Object$assign(this.options, options);
    }

    /**
     * Called when the `client` connects to the server.
     *
     * This method should handle the logic of the module on the server side.
     * For instance, it can take care of the communication with the client side module by setting up WebSocket message listeners and sending WebSocket messages, or it can add the client to a list to keep track of all the connected clients.
     * @param {Client} client Connected client.
     */
  }, {
    key: 'connect',
    value: function connect(client) {
      // Setup an object
      client.modules[this.id] = {};
    }

    /**
     * Called when the client `client` disconnects from the server.
     *
     * This method should handle the logic when that happens.
     * For instance, it can remove the socket message listeners, or remove the client from the list that keeps track of the connected clients.
     * @param {Client} client Disconnected client.
     */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {}
    // delete client.modules[this.id] // maybe needed by other modules

    /**
     * Listen a WebSocket message.
     * @param {Client} client - The client that must listen to the message.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} callback - The callback to execute when a message is received.
     */

  }, {
    key: 'receive',
    value: function receive(client, channel, callback) {
      var namespacedChannel = this.id + ':' + channel;
      _sockets2['default'].receive(client, namespacedChannel, callback);
    }

    /**
     * Sends a WebSocket message to the client.
     * @param {Client} client - The client to send the message to.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'send',
    value: function send(client, channel) {
      var namespacedChannel = this.id + ':' + channel;

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      _sockets2['default'].send.apply(_sockets2['default'], [client, namespacedChannel].concat(args));
    }

    /**
     * Sends a message to all client of given `clientType` or `clientType`s. If not specified, the message is sent to all clients
     * @param {String|Array} clientType - The `clientType`(s) that must receive the message.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'broadcast',
    value: function broadcast(clientType, excludeClient, channel) {
      var namespacedChannel = this.id + ':' + channel;

      for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        args[_key2 - 3] = arguments[_key2];
      }

      _sockets2['default'].broadcast.apply(_sockets2['default'], [clientType, excludeClient, namespacedChannel].concat(args));
    }
  }]);

  return ServerActivity;
})(_events.EventEmitter);

exports['default'] = ServerActivity;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29yZS9TZXJ2ZXJBY3Rpdml0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBb0IsV0FBVzs7OztzQkFDWixVQUFVOzs7O29DQUNJLHdCQUF3Qjs7OztzQkFDNUIsUUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQ2hCLGNBQWM7WUFBZCxjQUFjOzs7Ozs7O0FBS3RCLFdBTFEsY0FBYyxDQUtyQixFQUFFLEVBQUU7MEJBTEcsY0FBYzs7QUFNL0IsK0JBTmlCLGNBQWMsNkNBTXZCOzs7Ozs7O0FBT1IsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFPYixRQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLdkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7OztBQUdsQix3QkFBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDMUI7Ozs7OztlQTdCa0IsY0FBYzs7V0FrQzFCLGlCQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUU7QUFDbkIsYUFBTyxrQ0FBcUIsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNsRDs7Ozs7OztXQUtJLGlCQUFHOztBQUVOLDBCQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3hDOzs7Ozs7O1dBS1ksdUJBQUMsR0FBRyxFQUFFO0FBQ2pCLFVBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDMUIsWUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQ3pCLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ2YsTUFBTTtBQUNMLFdBQUcsR0FBRyxZQUFXLFNBQVMsQ0FBQyxDQUFDO09BQzdCOztBQUVELFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbkQ7Ozs7Ozs7O1dBTVEsbUJBQUMsT0FBTyxFQUFFO0FBQ2pCLFVBQUksT0FBTyxDQUFDLFVBQVUsRUFBRTtBQUN0QixZQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN2QyxlQUFPLE9BQU8sQ0FBQyxVQUFVLENBQUM7T0FDM0I7O0FBRUQscUJBQWMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN0Qzs7Ozs7Ozs7Ozs7V0FTTSxpQkFBQyxNQUFNLEVBQUU7O0FBRWQsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQzlCOzs7Ozs7Ozs7OztXQVNTLG9CQUFDLE1BQU0sRUFBRSxFQUVsQjs7Ozs7Ozs7O0FBQUE7OztXQVFNLGlCQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ2pDLFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLEVBQUUsU0FBSSxPQUFPLEFBQUUsQ0FBQztBQUNsRCwyQkFBUSxPQUFPLENBQUMsTUFBTSxFQUFFLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3REOzs7Ozs7Ozs7O1dBUUcsY0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFXO0FBQzdCLFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLEVBQUUsU0FBSSxPQUFPLEFBQUUsQ0FBQzs7d0NBRDNCLElBQUk7QUFBSixZQUFJOzs7QUFFM0IsMkJBQVEsSUFBSSxNQUFBLHdCQUFDLE1BQU0sRUFBRSxpQkFBaUIsU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUNsRDs7Ozs7Ozs7OztXQVFRLG1CQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFXO0FBQ3JELFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLEVBQUUsU0FBSSxPQUFPLEFBQUUsQ0FBQzs7eUNBREgsSUFBSTtBQUFKLFlBQUk7OztBQUVuRCwyQkFBUSxTQUFTLE1BQUEsd0JBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUMxRTs7O1NBL0hrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiJzcmMvc2VydmVyL2NvcmUvU2VydmVyQWN0aXZpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc29ja2V0cyBmcm9tICcuL3NvY2tldHMnO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG4vLyBAdG9kbyAtIHJlbW92ZSBFdmVudEVtaXR0ZXIgPyAoSW1wbGVtZW50IG91ciBvd24gbGlzdGVuZXJzKVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgdXNlZCB0byBjcmVhdGUgYW55ICpTb3VuZHdvcmtzKiBwaWVycyBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKlxuICogV2hpbGUgdGhlIHNlcXVlbmNlIG9mIHVzZXIgaW50ZXJhY3Rpb25zIGFuZCBleGNoYW5nZXMgYmV0d2VlbiBjbGllbnQgYW5kIHNlcnZlciBpcyBkZXRlcm1pbmVkIG9uIHRoZSBjbGllbnQgc2lkZSwgdGhlIHNlcnZlciBzaWRlIG1vZHVsZXMgYXJlIHJlYWR5IHRvIHJlY2VpdmUgcmVxdWVzdHMgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBjbGllbnQgc2lkZSBtb2R1bGVzIGFzIHNvb24gYXMgYSBjbGllbnQgaXMgY29ubmVjdGVkIHRvIHRoZSBzZXJ2ZXIuXG4gKlxuICogRWFjaCBtb2R1bGUgc2hvdWxkIGhhdmUgYSB7QGxpbmsgU2VydmVyTW9kdWxlI2Nvbm5lY3R9IGFuZCBhIHtAbGluayBTZXJ2ZXJNb2R1bGUjZGlzY29ubmVjdH0gbWV0aG9kcy5cbiAqIEFueSBtb2R1bGUgbWFwcGVkIHRvIHRoZSB0eXBlIG9mIGNsaWVudCBgJ2NsaWVudFR5cGUnYCAodGhhbmtzIHRvIHRoZSB7QGxpbmsgc2VydmVyI21hcH0gbWV0aG9kKSBjYWxscyBpdHMge0BsaW5rIFNlcnZlck1vZHVsZSNjb25uZWN0fSBtZXRob2Qgd2hlbiBzdWNoIGEgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIsIGFuZCBpdHMge0BsaW5rIFNlcnZlck1vZHVsZSNkaXNjb25uZWN0fSBtZXRob2Qgd2hlbiBzdWNoIGEgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50TW9kdWxlLmpzfkNsaWVudE1vZHVsZX0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiAqKk5vdGU6KiogYSBtb3JlIGNvbXBsZXRlIGV4YW1wbGUgb2YgaG93IHRvIHdyaXRlIGEgbW9kdWxlIGlzIGluIHRoZSBbRXhhbXBsZV0obWFudWFsL2V4YW1wbGUuaHRtbCkgc2VjdGlvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogY2xhc3MgTXlQaWVyIGV4dGVuZHMgUGllciB7XG4gKiAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAqICAgICBzdXBlcihuYW1lKTtcbiAqXG4gKiAgICAgLy8gLi4uXG4gKiAgIH1cbiAqXG4gKiAgIGNvbm5lY3QoY2xpZW50KSB7XG4gKiAgICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuICpcbiAqICAgICAvLyAuLi5cbiAqICAgfVxuICpcbiAqICAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAqICAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG4gKlxuICogICAgIC8vIC4uLlxuICogICB9XG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckFjdGl2aXR5IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIGFjdGl2aXR5LlxuICAgKi9cbiAgY29uc3RydWN0b3IoaWQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGlkIG9mIHRoZSBhY3Rpdml0eS4gVGhpcyBpZCBtdXN0IG1hdGNoIGEgY2xpZW50IHNpZGUgYEFjdGl2aXR5YCBpZCBpbiBvcmRlclxuICAgICAqIHRvIGNyZWF0ZSB0aGUgc29ja2V0IGNoYW5uZWwgYmV0d2VlbiB0aGUgYWN0aXZpdHkgYW5kIGl0cyBjbGllbnQgc2lkZSBwZWVyLlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNsaWVudCB0eXBlcyBvbiB3aGljaCB0aGUgYWN0aXZpdHkgc2hvdWxkIGJlIG1hcHBlZC5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9jbGllbnRUeXBlcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ucyBvZiB0aGUgYWN0aXZpdHkuIChTaG91bGQgYmUgY2hhbmdlZCBieSBjYWxsaW5nIGB0aGlzLmNvbmZpZ3VyZWApXG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0ge307XG5cbiAgICAvLyByZWdpc3RlciBhcyBhbiBleGlzdGluZyBhY3Rpdml0eSB0byB0aGUgc2VydmVyXG4gICAgc2VydmVyLnNldEFjdGl2aXR5KHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGEgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmVyU2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgYW4gYWN0aXZpdHksIGlzIGF1dG9tYXRpY2FsbHkgY2FsbGVkIG9uIHNlcnZlciBzdGFydHVwLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgLy8gcmVnaXN0ZXIgb24gd2hpY2ggY2xpZW50IHRoZSBhY3Rpdml0eSBzaG91bGQgYXBwbHkuXG4gICAgc2VydmVyLnNldE1hcCh0aGlzLl9jbGllbnRUeXBlcywgdGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHZhbCAtIFRoZSBjbGllbnQgdHlwZShzKSBvbiB3aGljaCB0aGUgYWN0aXZpdHkgc2hvdWxkIGJlIG1hcHBlZFxuICAgKi9cbiAgYWRkQ2xpZW50VHlwZSh2YWwpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKVxuICAgICAgICB2YWwgPSBbdmFsXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIHRoaXMuX2NsaWVudFR5cGVzID0gdGhpcy5fY2xpZW50VHlwZXMuY29uY2F0KHZhbCk7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIHRoZSBhY3Rpdml0eS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMuY2xpZW50VHlwZSkge1xuICAgICAgdGhpcy5hZGRDbGllbnRUeXBlKG9wdGlvbnMuY2xpZW50VHlwZSk7XG4gICAgICBkZWxldGUgb3B0aW9ucy5jbGllbnRUeXBlO1xuICAgIH1cblxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgYGNsaWVudGAgY29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGhhbmRsZSB0aGUgbG9naWMgb2YgdGhlIG1vZHVsZSBvbiB0aGUgc2VydmVyIHNpZGUuXG4gICAqIEZvciBpbnN0YW5jZSwgaXQgY2FuIHRha2UgY2FyZSBvZiB0aGUgY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBjbGllbnQgc2lkZSBtb2R1bGUgYnkgc2V0dGluZyB1cCBXZWJTb2NrZXQgbWVzc2FnZSBsaXN0ZW5lcnMgYW5kIHNlbmRpbmcgV2ViU29ja2V0IG1lc3NhZ2VzLCBvciBpdCBjYW4gYWRkIHRoZSBjbGllbnQgdG8gYSBsaXN0IHRvIGtlZXAgdHJhY2sgb2YgYWxsIHRoZSBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICAvLyBTZXR1cCBhbiBvYmplY3RcbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLmlkXSA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgYGNsaWVudGAgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgaGFuZGxlIHRoZSBsb2dpYyB3aGVuIHRoYXQgaGFwcGVucy5cbiAgICogRm9yIGluc3RhbmNlLCBpdCBjYW4gcmVtb3ZlIHRoZSBzb2NrZXQgbWVzc2FnZSBsaXN0ZW5lcnMsIG9yIHJlbW92ZSB0aGUgY2xpZW50IGZyb20gdGhlIGxpc3QgdGhhdCBrZWVwcyB0cmFjayBvZiB0aGUgY29ubmVjdGVkIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgRGlzY29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgLy8gZGVsZXRlIGNsaWVudC5tb2R1bGVzW3RoaXMuaWRdIC8vIG1heWJlIG5lZWRlZCBieSBvdGhlciBtb2R1bGVzXG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHRoYXQgbXVzdCBsaXN0ZW4gdG8gdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2xpZW50LCBjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5pZH06JHtjaGFubmVsfWA7XG4gICAgc29ja2V0cy5yZWNlaXZlKGNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBjbGllbnQuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLnNlbmQoY2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIGFsbCBjbGllbnQgb2YgZ2l2ZW4gYGNsaWVudFR5cGVgIG9yIGBjbGllbnRUeXBlYHMuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBtZXNzYWdlIGlzIHNlbnQgdG8gYWxsIGNsaWVudHNcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGNsaWVudFR5cGUgLSBUaGUgYGNsaWVudFR5cGVgKHMpIHRoYXQgbXVzdCByZWNlaXZlIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBicm9hZGNhc3QoY2xpZW50VHlwZSwgZXhjbHVkZUNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5pZH06JHtjaGFubmVsfWA7XG4gICAgc29ja2V0cy5icm9hZGNhc3QoY2xpZW50VHlwZSwgZXhjbHVkZUNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIC4uLmFyZ3MpO1xuICB9XG59XG4iXX0=