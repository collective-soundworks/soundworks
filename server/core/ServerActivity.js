'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

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
 * Base class used to create any *Soundworks* activity on the server side.
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
     * The id of the activity. This value must match a client side
     * {@link src/client/core/Activity.js~Activity} id in order to create
     * a namespaced socket channel between the activity and its client side peer.
     * @type {string}
     */
    this.id = id;

    /**
     * Options of the activity. These values should be updated with the
     * `this.configure` method.
     * @type {Object}
     */
    this.options = {};

    /**
     * The client types on which the activity should be mapped.
     * @type {Set}
     * @private
     */
    this.clientTypes = new _Set();

    /**
     * List of the activities the current activity needs in order to work.
     * @type {Set}
     * @private
     */
    this.requiredActivities = new _Set();

    // register as existing to the server
    _server2['default'].setActivity(this);
  }

  /**
   * Configure the activity.
   * @param {Object} options
   */

  _createClass(ServerActivity, [{
    key: 'configure',
    value: function configure(options) {
      _Object$assign(this.options, options);
    }

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
     * Add the given activity as a requirement for the current activity.
     * @private
     * @type {ServerActivity} activity
     */
  }, {
    key: 'addRequiredActivity',
    value: function addRequiredActivity(activity) {
      this.requiredActivities.add(activity);
    }

    /**
     * Retrieve a service. The required service is added to the `requiredActivities`.
     * @param {String} id - The id of the service.
     * @param {Object} options - Some options to configure the service.
     */
  }, {
    key: 'require',
    value: function require(id, options) {
      return _serverServiceManager2['default'].require(id, this, options);
    }

    /**
     * Interface method to be implemented by activities. As part of an activity
     * lifecycle, the method should define the behavior of the activity when started
     * (e.g. binding listeners). When this method id called, all configuration options
     * should be setted. Also, if the activity relies on another service
     * (e.g. {@link src/server/core/ServerSharedConfig.js~ServerSharedConfig}),
     * this dependency should be considered as instanciated.
     * The method is automatically called by the server on startup.
     */
  }, {
    key: 'start',
    value: function start() {}

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvY29yZS9TZXJ2ZXJBY3Rpdml0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQUFvQixXQUFXOzs7O3NCQUNaLFVBQVU7Ozs7b0NBQ0ksd0JBQXdCOzs7O3NCQUM1QixRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXFDaEIsY0FBYztZQUFkLGNBQWM7Ozs7Ozs7QUFLdEIsV0FMUSxjQUFjLENBS3JCLEVBQUUsRUFBRTswQkFMRyxjQUFjOztBQU0vQiwrQkFOaUIsY0FBYyw2Q0FNdkI7Ozs7Ozs7O0FBUVIsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFPYixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7Ozs7OztBQU9sQixRQUFJLENBQUMsV0FBVyxHQUFHLFVBQVMsQ0FBQzs7Ozs7OztBQU83QixRQUFJLENBQUMsa0JBQWtCLEdBQUcsVUFBUyxDQUFDOzs7QUFHcEMsd0JBQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzFCOzs7Ozs7O2VBdkNrQixjQUFjOztXQTZDeEIsbUJBQUMsT0FBTyxFQUFFO0FBQ2pCLHFCQUFjLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDdEM7Ozs7Ozs7Ozs7V0FRWSx1QkFBQyxLQUFLLEVBQUU7OztBQUNuQixVQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQzFCLFlBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUMzQixLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUNuQixNQUFNO0FBQ0wsYUFBSyxHQUFHLFlBQVcsU0FBUyxDQUFDLENBQUM7T0FDL0I7OztBQUdELFdBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxVQUFVLEVBQUs7QUFDNUIsY0FBSyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ2xDLENBQUMsQ0FBQzs7O0FBR0gsVUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUM1QyxnQkFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUMvQixDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7O1dBT2tCLDZCQUFDLFFBQVEsRUFBRTtBQUM1QixVQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3ZDOzs7Ozs7Ozs7V0FPTSxpQkFBQyxFQUFFLEVBQUUsT0FBTyxFQUFFO0FBQ25CLGFBQU8sa0NBQXFCLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3hEOzs7Ozs7Ozs7Ozs7O1dBV0ksaUJBQUcsRUFBRTs7Ozs7Ozs7Ozs7V0FTSCxpQkFBQyxNQUFNLEVBQUU7O0FBRWQsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQzlCOzs7Ozs7Ozs7OztXQVNTLG9CQUFDLE1BQU0sRUFBRSxFQUVsQjs7Ozs7Ozs7O0FBQUE7OztXQVFNLGlCQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ2pDLFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLEVBQUUsU0FBSSxPQUFPLEFBQUUsQ0FBQztBQUNsRCwyQkFBUSxPQUFPLENBQUMsTUFBTSxFQUFFLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3REOzs7Ozs7Ozs7O1dBUUcsY0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFXO0FBQzdCLFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLEVBQUUsU0FBSSxPQUFPLEFBQUUsQ0FBQzs7d0NBRDNCLElBQUk7QUFBSixZQUFJOzs7QUFFM0IsMkJBQVEsSUFBSSxNQUFBLHdCQUFDLE1BQU0sRUFBRSxpQkFBaUIsU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUNsRDs7Ozs7Ozs7OztXQVFRLG1CQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFXO0FBQ3JELFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLEVBQUUsU0FBSSxPQUFPLEFBQUUsQ0FBQzs7eUNBREgsSUFBSTtBQUFKLFlBQUk7OztBQUVuRCwyQkFBUSxTQUFTLE1BQUEsd0JBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUMxRTs7O1NBN0prQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvc2VydmVyL2NvcmUvU2VydmVyQWN0aXZpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc29ja2V0cyBmcm9tICcuL3NvY2tldHMnO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG4vLyBAdG9kbyAtIHJlbW92ZSBFdmVudEVtaXR0ZXIgPyAoSW1wbGVtZW50IG91ciBvd24gbGlzdGVuZXJzKVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgdXNlZCB0byBjcmVhdGUgYW55ICpTb3VuZHdvcmtzKiBhY3Rpdml0eSBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKlxuICogV2hpbGUgdGhlIHNlcXVlbmNlIG9mIHVzZXIgaW50ZXJhY3Rpb25zIGFuZCBleGNoYW5nZXMgYmV0d2VlbiBjbGllbnQgYW5kIHNlcnZlciBpcyBkZXRlcm1pbmVkIG9uIHRoZSBjbGllbnQgc2lkZSwgdGhlIHNlcnZlciBzaWRlIG1vZHVsZXMgYXJlIHJlYWR5IHRvIHJlY2VpdmUgcmVxdWVzdHMgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBjbGllbnQgc2lkZSBtb2R1bGVzIGFzIHNvb24gYXMgYSBjbGllbnQgaXMgY29ubmVjdGVkIHRvIHRoZSBzZXJ2ZXIuXG4gKlxuICogRWFjaCBtb2R1bGUgc2hvdWxkIGhhdmUgYSB7QGxpbmsgU2VydmVyTW9kdWxlI2Nvbm5lY3R9IGFuZCBhIHtAbGluayBTZXJ2ZXJNb2R1bGUjZGlzY29ubmVjdH0gbWV0aG9kcy5cbiAqIEFueSBtb2R1bGUgbWFwcGVkIHRvIHRoZSB0eXBlIG9mIGNsaWVudCBgJ2NsaWVudFR5cGUnYCAodGhhbmtzIHRvIHRoZSB7QGxpbmsgc2VydmVyI21hcH0gbWV0aG9kKSBjYWxscyBpdHMge0BsaW5rIFNlcnZlck1vZHVsZSNjb25uZWN0fSBtZXRob2Qgd2hlbiBzdWNoIGEgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIsIGFuZCBpdHMge0BsaW5rIFNlcnZlck1vZHVsZSNkaXNjb25uZWN0fSBtZXRob2Qgd2hlbiBzdWNoIGEgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50TW9kdWxlLmpzfkNsaWVudE1vZHVsZX0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiAqKk5vdGU6KiogYSBtb3JlIGNvbXBsZXRlIGV4YW1wbGUgb2YgaG93IHRvIHdyaXRlIGEgbW9kdWxlIGlzIGluIHRoZSBbRXhhbXBsZV0obWFudWFsL2V4YW1wbGUuaHRtbCkgc2VjdGlvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogY2xhc3MgTXlQaWVyIGV4dGVuZHMgUGllciB7XG4gKiAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAqICAgICBzdXBlcihuYW1lKTtcbiAqXG4gKiAgICAgLy8gLi4uXG4gKiAgIH1cbiAqXG4gKiAgIGNvbm5lY3QoY2xpZW50KSB7XG4gKiAgICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuICpcbiAqICAgICAvLyAuLi5cbiAqICAgfVxuICpcbiAqICAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAqICAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG4gKlxuICogICAgIC8vIC4uLlxuICogICB9XG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckFjdGl2aXR5IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIGFjdGl2aXR5LlxuICAgKi9cbiAgY29uc3RydWN0b3IoaWQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGlkIG9mIHRoZSBhY3Rpdml0eS4gVGhpcyB2YWx1ZSBtdXN0IG1hdGNoIGEgY2xpZW50IHNpZGVcbiAgICAgKiB7QGxpbmsgc3JjL2NsaWVudC9jb3JlL0FjdGl2aXR5LmpzfkFjdGl2aXR5fSBpZCBpbiBvcmRlciB0byBjcmVhdGVcbiAgICAgKiBhIG5hbWVzcGFjZWQgc29ja2V0IGNoYW5uZWwgYmV0d2VlbiB0aGUgYWN0aXZpdHkgYW5kIGl0cyBjbGllbnQgc2lkZSBwZWVyLlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ucyBvZiB0aGUgYWN0aXZpdHkuIFRoZXNlIHZhbHVlcyBzaG91bGQgYmUgdXBkYXRlZCB3aXRoIHRoZVxuICAgICAqIGB0aGlzLmNvbmZpZ3VyZWAgbWV0aG9kLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0ge307XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY2xpZW50IHR5cGVzIG9uIHdoaWNoIHRoZSBhY3Rpdml0eSBzaG91bGQgYmUgbWFwcGVkLlxuICAgICAqIEB0eXBlIHtTZXR9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudFR5cGVzID0gbmV3IFNldCgpO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgYWN0aXZpdGllcyB0aGUgY3VycmVudCBhY3Rpdml0eSBuZWVkcyBpbiBvcmRlciB0byB3b3JrLlxuICAgICAqIEB0eXBlIHtTZXR9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnJlcXVpcmVkQWN0aXZpdGllcyA9IG5ldyBTZXQoKTtcblxuICAgIC8vIHJlZ2lzdGVyIGFzIGV4aXN0aW5nIHRvIHRoZSBzZXJ2ZXJcbiAgICBzZXJ2ZXIuc2V0QWN0aXZpdHkodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIHRoZSBhY3Rpdml0eS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBjbGllbnQgdHlwZSB0aGF0IHNob3VsZCBiZSBtYXBwZWQgdG8gdGhpcyBhY3Rpdml0eS5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHZhbCAtIFRoZSBjbGllbnQgdHlwZShzKSBvbiB3aGljaCB0aGUgYWN0aXZpdHlcbiAgICogIHNob3VsZCBiZSBtYXBwZWRcbiAgICovXG4gIGFkZENsaWVudFR5cGUodmFsdWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpXG4gICAgICAgIHZhbHVlID0gW3ZhbHVlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGNsaWVudCB0eXBlcyB0byBjdXJyZW50IGFjdGl2aXR5XG4gICAgdmFsdWUuZm9yRWFjaCgoY2xpZW50VHlwZSkgPT4ge1xuICAgICAgdGhpcy5jbGllbnRUeXBlcy5hZGQoY2xpZW50VHlwZSk7XG4gICAgfSk7XG5cbiAgICAvLyBwcm9wYWdhdGUgdmFsdWUgdG8gcmVxdWlyZWQgYWN0aXZpdGllc1xuICAgIHRoaXMucmVxdWlyZWRBY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiB7XG4gICAgICBhY3Rpdml0eS5hZGRDbGllbnRUeXBlKHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIGdpdmVuIGFjdGl2aXR5IGFzIGEgcmVxdWlyZW1lbnQgZm9yIHRoZSBjdXJyZW50IGFjdGl2aXR5LlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdHlwZSB7U2VydmVyQWN0aXZpdHl9IGFjdGl2aXR5XG4gICAqL1xuICBhZGRSZXF1aXJlZEFjdGl2aXR5KGFjdGl2aXR5KSB7XG4gICAgdGhpcy5yZXF1aXJlZEFjdGl2aXRpZXMuYWRkKGFjdGl2aXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhIHNlcnZpY2UuIFRoZSByZXF1aXJlZCBzZXJ2aWNlIGlzIGFkZGVkIHRvIHRoZSBgcmVxdWlyZWRBY3Rpdml0aWVzYC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFNvbWUgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZlclNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIHRoaXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gYmUgaW1wbGVtZW50ZWQgYnkgYWN0aXZpdGllcy4gQXMgcGFydCBvZiBhbiBhY3Rpdml0eVxuICAgKiBsaWZlY3ljbGUsIHRoZSBtZXRob2Qgc2hvdWxkIGRlZmluZSB0aGUgYmVoYXZpb3Igb2YgdGhlIGFjdGl2aXR5IHdoZW4gc3RhcnRlZFxuICAgKiAoZS5nLiBiaW5kaW5nIGxpc3RlbmVycykuIFdoZW4gdGhpcyBtZXRob2QgaWQgY2FsbGVkLCBhbGwgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAqIHNob3VsZCBiZSBzZXR0ZWQuIEFsc28sIGlmIHRoZSBhY3Rpdml0eSByZWxpZXMgb24gYW5vdGhlciBzZXJ2aWNlXG4gICAqIChlLmcuIHtAbGluayBzcmMvc2VydmVyL2NvcmUvU2VydmVyU2hhcmVkQ29uZmlnLmpzflNlcnZlclNoYXJlZENvbmZpZ30pLFxuICAgKiB0aGlzIGRlcGVuZGVuY3kgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYXMgaW5zdGFuY2lhdGVkLlxuICAgKiBUaGUgbWV0aG9kIGlzIGF1dG9tYXRpY2FsbHkgY2FsbGVkIGJ5IHRoZSBzZXJ2ZXIgb24gc3RhcnR1cC5cbiAgICovXG4gIHN0YXJ0KCkge31cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGBjbGllbnRgIGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBoYW5kbGUgdGhlIGxvZ2ljIG9mIHRoZSBtb2R1bGUgb24gdGhlIHNlcnZlciBzaWRlLlxuICAgKiBGb3IgaW5zdGFuY2UsIGl0IGNhbiB0YWtlIGNhcmUgb2YgdGhlIGNvbW11bmljYXRpb24gd2l0aCB0aGUgY2xpZW50IHNpZGUgbW9kdWxlIGJ5IHNldHRpbmcgdXAgV2ViU29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzIGFuZCBzZW5kaW5nIFdlYlNvY2tldCBtZXNzYWdlcywgb3IgaXQgY2FuIGFkZCB0aGUgY2xpZW50IHRvIGEgbGlzdCB0byBrZWVwIHRyYWNrIG9mIGFsbCB0aGUgY29ubmVjdGVkIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgLy8gU2V0dXAgYW4gb2JqZWN0XG4gICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0gPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGBjbGllbnRgIGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAgICpcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGhhbmRsZSB0aGUgbG9naWMgd2hlbiB0aGF0IGhhcHBlbnMuXG4gICAqIEZvciBpbnN0YW5jZSwgaXQgY2FuIHJlbW92ZSB0aGUgc29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzLCBvciByZW1vdmUgdGhlIGNsaWVudCBmcm9tIHRoZSBsaXN0IHRoYXQga2VlcHMgdHJhY2sgb2YgdGhlIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IERpc2Nvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIGRlbGV0ZSBjbGllbnQubW9kdWxlc1t0aGlzLmlkXSAvLyBtYXliZSBuZWVkZWQgYnkgb3RoZXIgbW9kdWxlc1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0aGF0IG11c3QgbGlzdGVuIHRvIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNsaWVudCwgY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gO1xuICAgIHNvY2tldHMucmVjZWl2ZShjbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgY2xpZW50LlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5pZH06JHtjaGFubmVsfWA7XG4gICAgc29ja2V0cy5zZW5kKGNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byBhbGwgY2xpZW50IG9mIGdpdmVuIGBjbGllbnRUeXBlYCBvciBgY2xpZW50VHlwZWBzLiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgbWVzc2FnZSBpcyBzZW50IHRvIGFsbCBjbGllbnRzXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBjbGllbnRUeXBlIC0gVGhlIGBjbGllbnRUeXBlYChzKSB0aGF0IG11c3QgcmVjZWl2ZSB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgYnJvYWRjYXN0KGNsaWVudFR5cGUsIGV4Y2x1ZGVDbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gO1xuICAgIHNvY2tldHMuYnJvYWRjYXN0KGNsaWVudFR5cGUsIGV4Y2x1ZGVDbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCAuLi5hcmdzKTtcbiAgfVxufVxuIl19