'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

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
     * Options of the activity. (Should be changed by calling `this.configure`)
     */
    this.options = {};

    /**
     * The client types on which the activity should be mapped.
     * @type {Set}
     * @private
     */
    this.clientTypes = new _Set();

    /**
     * List of the required activities
     * @type {Set}
     * @private
     */
    this.requiredActivities = new _Set();

    // register as existing to the server
    _server2['default'].setActivity(this);
  }

  /**
   * Retrieve a service.
   */

  _createClass(ServerActivity, [{
    key: 'require',
    value: function require(id, options) {
      return _serverServiceManager2['default'].require(id, this, options);
    }

    /**
     * Start an activity, is automatically called on server startup.
     */
  }, {
    key: 'start',
    value: function start() {}

    /**
     * Add client type that should be mapped to this activity.
     * @private
     * @param {String|Array} val - The client type(s) on which the activity
     *  should be mapped
     */
  }, {
    key: 'addClientType',
    value: function addClientType(value) {
      var _this = this;

      if (arguments.length === 1) {
        if (typeof value === 'string') value = [value];
      } else {
        value = _Array$from(arguments);
      }

      // add client types to current activity
      value.forEach(function (clientType) {
        _this.clientTypes.add(clientType);
      });
      // propagate value to required activities
      this.requiredActivities.forEach(function (activity) {
        activity.addClientType(value);
      });
    }

    /**
     * Add the given activity as a requirement for the behavior of the
     *  current activity.
     * @private
     * @type {ServerActivity} activity
     */
  }, {
    key: 'addRequiredActivity',
    value: function addRequiredActivity(activity) {
      this.requiredActivities.add(activity);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29yZS9TZXJ2ZXJBY3Rpdml0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQUFvQixXQUFXOzs7O3NCQUNaLFVBQVU7Ozs7b0NBQ0ksd0JBQXdCOzs7O3NCQUM1QixRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXFDaEIsY0FBYztZQUFkLGNBQWM7Ozs7Ozs7QUFLdEIsV0FMUSxjQUFjLENBS3JCLEVBQUUsRUFBRTswQkFMRyxjQUFjOztBQU0vQiwrQkFOaUIsY0FBYyw2Q0FNdkI7Ozs7Ozs7QUFPUixRQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLYixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7Ozs7OztBQU9sQixRQUFJLENBQUMsV0FBVyxHQUFHLFVBQVMsQ0FBQzs7Ozs7OztBQU83QixRQUFJLENBQUMsa0JBQWtCLEdBQUcsVUFBUyxDQUFDOzs7QUFHcEMsd0JBQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzFCOzs7Ozs7ZUFwQ2tCLGNBQWM7O1dBeUMxQixpQkFBQyxFQUFFLEVBQUUsT0FBTyxFQUFFO0FBQ25CLGFBQU8sa0NBQXFCLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3hEOzs7Ozs7O1dBS0ksaUJBQUcsRUFBRTs7Ozs7Ozs7OztXQVFHLHVCQUFDLEtBQUssRUFBRTs7O0FBQ25CLFVBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDMUIsWUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQzNCLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ25CLE1BQU07QUFDTCxhQUFLLEdBQUcsWUFBVyxTQUFTLENBQUMsQ0FBQztPQUMvQjs7O0FBR0QsV0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFVBQVUsRUFBSztBQUM1QixjQUFLLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7T0FDbEMsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDNUMsZ0JBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDL0IsQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7Ozs7V0FRa0IsNkJBQUMsUUFBUSxFQUFFO0FBQzVCLFVBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDdkM7Ozs7Ozs7O1dBTVEsbUJBQUMsT0FBTyxFQUFFO0FBQ2pCLFVBQUksT0FBTyxDQUFDLFVBQVUsRUFBRTtBQUN0QixZQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN2QyxlQUFPLE9BQU8sQ0FBQyxVQUFVLENBQUM7T0FDM0I7O0FBRUQscUJBQWMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN0Qzs7Ozs7Ozs7Ozs7V0FTTSxpQkFBQyxNQUFNLEVBQUU7O0FBRWQsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQzlCOzs7Ozs7Ozs7OztXQVNTLG9CQUFDLE1BQU0sRUFBRSxFQUVsQjs7Ozs7Ozs7O0FBQUE7OztXQVFNLGlCQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ2pDLFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLEVBQUUsU0FBSSxPQUFPLEFBQUUsQ0FBQztBQUNsRCwyQkFBUSxPQUFPLENBQUMsTUFBTSxFQUFFLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3REOzs7Ozs7Ozs7O1dBUUcsY0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFXO0FBQzdCLFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLEVBQUUsU0FBSSxPQUFPLEFBQUUsQ0FBQzs7d0NBRDNCLElBQUk7QUFBSixZQUFJOzs7QUFFM0IsMkJBQVEsSUFBSSxNQUFBLHdCQUFDLE1BQU0sRUFBRSxpQkFBaUIsU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUNsRDs7Ozs7Ozs7OztXQVFRLG1CQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFXO0FBQ3JELFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLEVBQUUsU0FBSSxPQUFPLEFBQUUsQ0FBQzs7eUNBREgsSUFBSTtBQUFKLFlBQUk7OztBQUVuRCwyQkFBUSxTQUFTLE1BQUEsd0JBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUMxRTs7O1NBdkprQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiJzcmMvc2VydmVyL2NvcmUvU2VydmVyQWN0aXZpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc29ja2V0cyBmcm9tICcuL3NvY2tldHMnO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG4vLyBAdG9kbyAtIHJlbW92ZSBFdmVudEVtaXR0ZXIgPyAoSW1wbGVtZW50IG91ciBvd24gbGlzdGVuZXJzKVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgdXNlZCB0byBjcmVhdGUgYW55ICpTb3VuZHdvcmtzKiBwaWVycyBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKlxuICogV2hpbGUgdGhlIHNlcXVlbmNlIG9mIHVzZXIgaW50ZXJhY3Rpb25zIGFuZCBleGNoYW5nZXMgYmV0d2VlbiBjbGllbnQgYW5kIHNlcnZlciBpcyBkZXRlcm1pbmVkIG9uIHRoZSBjbGllbnQgc2lkZSwgdGhlIHNlcnZlciBzaWRlIG1vZHVsZXMgYXJlIHJlYWR5IHRvIHJlY2VpdmUgcmVxdWVzdHMgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBjbGllbnQgc2lkZSBtb2R1bGVzIGFzIHNvb24gYXMgYSBjbGllbnQgaXMgY29ubmVjdGVkIHRvIHRoZSBzZXJ2ZXIuXG4gKlxuICogRWFjaCBtb2R1bGUgc2hvdWxkIGhhdmUgYSB7QGxpbmsgU2VydmVyTW9kdWxlI2Nvbm5lY3R9IGFuZCBhIHtAbGluayBTZXJ2ZXJNb2R1bGUjZGlzY29ubmVjdH0gbWV0aG9kcy5cbiAqIEFueSBtb2R1bGUgbWFwcGVkIHRvIHRoZSB0eXBlIG9mIGNsaWVudCBgJ2NsaWVudFR5cGUnYCAodGhhbmtzIHRvIHRoZSB7QGxpbmsgc2VydmVyI21hcH0gbWV0aG9kKSBjYWxscyBpdHMge0BsaW5rIFNlcnZlck1vZHVsZSNjb25uZWN0fSBtZXRob2Qgd2hlbiBzdWNoIGEgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIsIGFuZCBpdHMge0BsaW5rIFNlcnZlck1vZHVsZSNkaXNjb25uZWN0fSBtZXRob2Qgd2hlbiBzdWNoIGEgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50TW9kdWxlLmpzfkNsaWVudE1vZHVsZX0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiAqKk5vdGU6KiogYSBtb3JlIGNvbXBsZXRlIGV4YW1wbGUgb2YgaG93IHRvIHdyaXRlIGEgbW9kdWxlIGlzIGluIHRoZSBbRXhhbXBsZV0obWFudWFsL2V4YW1wbGUuaHRtbCkgc2VjdGlvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogY2xhc3MgTXlQaWVyIGV4dGVuZHMgUGllciB7XG4gKiAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAqICAgICBzdXBlcihuYW1lKTtcbiAqXG4gKiAgICAgLy8gLi4uXG4gKiAgIH1cbiAqXG4gKiAgIGNvbm5lY3QoY2xpZW50KSB7XG4gKiAgICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuICpcbiAqICAgICAvLyAuLi5cbiAqICAgfVxuICpcbiAqICAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAqICAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG4gKlxuICogICAgIC8vIC4uLlxuICogICB9XG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckFjdGl2aXR5IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIGFjdGl2aXR5LlxuICAgKi9cbiAgY29uc3RydWN0b3IoaWQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGlkIG9mIHRoZSBhY3Rpdml0eS4gVGhpcyBpZCBtdXN0IG1hdGNoIGEgY2xpZW50IHNpZGUgYEFjdGl2aXR5YCBpZCBpbiBvcmRlclxuICAgICAqIHRvIGNyZWF0ZSB0aGUgc29ja2V0IGNoYW5uZWwgYmV0d2VlbiB0aGUgYWN0aXZpdHkgYW5kIGl0cyBjbGllbnQgc2lkZSBwZWVyLlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ucyBvZiB0aGUgYWN0aXZpdHkuIChTaG91bGQgYmUgY2hhbmdlZCBieSBjYWxsaW5nIGB0aGlzLmNvbmZpZ3VyZWApXG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0ge307XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY2xpZW50IHR5cGVzIG9uIHdoaWNoIHRoZSBhY3Rpdml0eSBzaG91bGQgYmUgbWFwcGVkLlxuICAgICAqIEB0eXBlIHtTZXR9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudFR5cGVzID0gbmV3IFNldCgpO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgcmVxdWlyZWQgYWN0aXZpdGllc1xuICAgICAqIEB0eXBlIHtTZXR9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnJlcXVpcmVkQWN0aXZpdGllcyA9IG5ldyBTZXQoKTtcblxuICAgIC8vIHJlZ2lzdGVyIGFzIGV4aXN0aW5nIHRvIHRoZSBzZXJ2ZXJcbiAgICBzZXJ2ZXIuc2V0QWN0aXZpdHkodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCB0aGlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCBhbiBhY3Rpdml0eSwgaXMgYXV0b21hdGljYWxseSBjYWxsZWQgb24gc2VydmVyIHN0YXJ0dXAuXG4gICAqL1xuICBzdGFydCgpIHt9XG5cbiAgLyoqXG4gICAqIEFkZCBjbGllbnQgdHlwZSB0aGF0IHNob3VsZCBiZSBtYXBwZWQgdG8gdGhpcyBhY3Rpdml0eS5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHZhbCAtIFRoZSBjbGllbnQgdHlwZShzKSBvbiB3aGljaCB0aGUgYWN0aXZpdHlcbiAgICogIHNob3VsZCBiZSBtYXBwZWRcbiAgICovXG4gIGFkZENsaWVudFR5cGUodmFsdWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpXG4gICAgICAgIHZhbHVlID0gW3ZhbHVlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGNsaWVudCB0eXBlcyB0byBjdXJyZW50IGFjdGl2aXR5XG4gICAgdmFsdWUuZm9yRWFjaCgoY2xpZW50VHlwZSkgPT4ge1xuICAgICAgdGhpcy5jbGllbnRUeXBlcy5hZGQoY2xpZW50VHlwZSk7XG4gICAgfSk7XG4gICAgLy8gcHJvcGFnYXRlIHZhbHVlIHRvIHJlcXVpcmVkIGFjdGl2aXRpZXNcbiAgICB0aGlzLnJlcXVpcmVkQWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4ge1xuICAgICAgYWN0aXZpdHkuYWRkQ2xpZW50VHlwZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBnaXZlbiBhY3Rpdml0eSBhcyBhIHJlcXVpcmVtZW50IGZvciB0aGUgYmVoYXZpb3Igb2YgdGhlXG4gICAqICBjdXJyZW50IGFjdGl2aXR5LlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdHlwZSB7U2VydmVyQWN0aXZpdHl9IGFjdGl2aXR5XG4gICAqL1xuICBhZGRSZXF1aXJlZEFjdGl2aXR5KGFjdGl2aXR5KSB7XG4gICAgdGhpcy5yZXF1aXJlZEFjdGl2aXRpZXMuYWRkKGFjdGl2aXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIGFjdGl2aXR5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5jbGllbnRUeXBlKSB7XG4gICAgICB0aGlzLmFkZENsaWVudFR5cGUob3B0aW9ucy5jbGllbnRUeXBlKTtcbiAgICAgIGRlbGV0ZSBvcHRpb25zLmNsaWVudFR5cGU7XG4gICAgfVxuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBgY2xpZW50YCBjb25uZWN0cyB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgaGFuZGxlIHRoZSBsb2dpYyBvZiB0aGUgbW9kdWxlIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAgICogRm9yIGluc3RhbmNlLCBpdCBjYW4gdGFrZSBjYXJlIG9mIHRoZSBjb21tdW5pY2F0aW9uIHdpdGggdGhlIGNsaWVudCBzaWRlIG1vZHVsZSBieSBzZXR0aW5nIHVwIFdlYlNvY2tldCBtZXNzYWdlIGxpc3RlbmVycyBhbmQgc2VuZGluZyBXZWJTb2NrZXQgbWVzc2FnZXMsIG9yIGl0IGNhbiBhZGQgdGhlIGNsaWVudCB0byBhIGxpc3QgdG8ga2VlcCB0cmFjayBvZiBhbGwgdGhlIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IENvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIFNldHVwIGFuIG9iamVjdFxuICAgIGNsaWVudC5tb2R1bGVzW3RoaXMuaWRdID0ge307XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBgY2xpZW50YCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBoYW5kbGUgdGhlIGxvZ2ljIHdoZW4gdGhhdCBoYXBwZW5zLlxuICAgKiBGb3IgaW5zdGFuY2UsIGl0IGNhbiByZW1vdmUgdGhlIHNvY2tldCBtZXNzYWdlIGxpc3RlbmVycywgb3IgcmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgbGlzdCB0aGF0IGtlZXBzIHRyYWNrIG9mIHRoZSBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBEaXNjb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICAvLyBkZWxldGUgY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0gLy8gbWF5YmUgbmVlZGVkIGJ5IG90aGVyIG1vZHVsZXNcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdGhhdCBtdXN0IGxpc3RlbiB0byB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjbGllbnQsIGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLnJlY2VpdmUoY2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0by5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gO1xuICAgIHNvY2tldHMuc2VuZChjbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gYWxsIGNsaWVudCBvZiBnaXZlbiBgY2xpZW50VHlwZWAgb3IgYGNsaWVudFR5cGVgcy4gSWYgbm90IHNwZWNpZmllZCwgdGhlIG1lc3NhZ2UgaXMgc2VudCB0byBhbGwgY2xpZW50c1xuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gY2xpZW50VHlwZSAtIFRoZSBgY2xpZW50VHlwZWAocykgdGhhdCBtdXN0IHJlY2VpdmUgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIGJyb2FkY2FzdChjbGllbnRUeXBlLCBleGNsdWRlQ2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLmJyb2FkY2FzdChjbGllbnRUeXBlLCBleGNsdWRlQ2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cbn1cbiJdfQ==