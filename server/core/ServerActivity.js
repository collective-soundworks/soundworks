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
     * Retrieve a service.
     */
  }, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvY29yZS9TZXJ2ZXJBY3Rpdml0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQUFvQixXQUFXOzs7O3NCQUNaLFVBQVU7Ozs7b0NBQ0ksd0JBQXdCOzs7O3NCQUM1QixRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXFDaEIsY0FBYztZQUFkLGNBQWM7Ozs7Ozs7QUFLdEIsV0FMUSxjQUFjLENBS3JCLEVBQUUsRUFBRTswQkFMRyxjQUFjOztBQU0vQiwrQkFOaUIsY0FBYyw2Q0FNdkI7Ozs7Ozs7QUFPUixRQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLYixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7Ozs7OztBQU9sQixRQUFJLENBQUMsV0FBVyxHQUFHLFVBQVMsQ0FBQzs7Ozs7OztBQU83QixRQUFJLENBQUMsa0JBQWtCLEdBQUcsVUFBUyxDQUFDOzs7QUFHcEMsd0JBQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzFCOzs7Ozs7O2VBcENrQixjQUFjOztXQTBDeEIsbUJBQUMsT0FBTyxFQUFFO0FBQ2pCLHFCQUFjLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDdEM7Ozs7Ozs7Ozs7V0FRWSx1QkFBQyxLQUFLLEVBQUU7OztBQUNuQixVQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQzFCLFlBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUMzQixLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUNuQixNQUFNO0FBQ0wsYUFBSyxHQUFHLFlBQVcsU0FBUyxDQUFDLENBQUM7T0FDL0I7OztBQUdELFdBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxVQUFVLEVBQUs7QUFDNUIsY0FBSyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ2xDLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQzVDLGdCQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQy9CLENBQUMsQ0FBQztLQUNKOzs7Ozs7Ozs7O1dBUWtCLDZCQUFDLFFBQVEsRUFBRTtBQUM1QixVQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3ZDOzs7Ozs7O1dBS00saUJBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUNuQixhQUFPLGtDQUFxQixPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN4RDs7Ozs7OztXQUtJLGlCQUFHLEVBQUU7Ozs7Ozs7Ozs7O1dBU0gsaUJBQUMsTUFBTSxFQUFFOztBQUVkLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUM5Qjs7Ozs7Ozs7Ozs7V0FTUyxvQkFBQyxNQUFNLEVBQUUsRUFFbEI7Ozs7Ozs7OztBQUFBOzs7V0FRTSxpQkFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUNqQyxVQUFNLGlCQUFpQixHQUFNLElBQUksQ0FBQyxFQUFFLFNBQUksT0FBTyxBQUFFLENBQUM7QUFDbEQsMkJBQVEsT0FBTyxDQUFDLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN0RDs7Ozs7Ozs7OztXQVFHLGNBQUMsTUFBTSxFQUFFLE9BQU8sRUFBVztBQUM3QixVQUFNLGlCQUFpQixHQUFNLElBQUksQ0FBQyxFQUFFLFNBQUksT0FBTyxBQUFFLENBQUM7O3dDQUQzQixJQUFJO0FBQUosWUFBSTs7O0FBRTNCLDJCQUFRLElBQUksTUFBQSx3QkFBQyxNQUFNLEVBQUUsaUJBQWlCLFNBQUssSUFBSSxFQUFDLENBQUM7S0FDbEQ7Ozs7Ozs7Ozs7V0FRUSxtQkFBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBVztBQUNyRCxVQUFNLGlCQUFpQixHQUFNLElBQUksQ0FBQyxFQUFFLFNBQUksT0FBTyxBQUFFLENBQUM7O3lDQURILElBQUk7QUFBSixZQUFJOzs7QUFFbkQsMkJBQVEsU0FBUyxNQUFBLHdCQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsaUJBQWlCLFNBQUssSUFBSSxFQUFDLENBQUM7S0FDMUU7OztTQWxKa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL1VzZXJzL21hdHVzemV3c2tpL2Rldi9jb3NpbWEvbGliL3NvdW5kd29ya3Mvc3JjL3NlcnZlci9jb3JlL1NlcnZlckFjdGl2aXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNvY2tldHMgZnJvbSAnLi9zb2NrZXRzJztcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXInO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmVyU2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuLy8gQHRvZG8gLSByZW1vdmUgRXZlbnRFbWl0dGVyID8gKEltcGxlbWVudCBvdXIgb3duIGxpc3RlbmVycylcblxuLyoqXG4gKiBCYXNlIGNsYXNzIHVzZWQgdG8gY3JlYXRlIGFueSAqU291bmR3b3JrcyogYWN0aXZpdHkgb24gdGhlIHNlcnZlciBzaWRlLlxuICpcbiAqIFdoaWxlIHRoZSBzZXF1ZW5jZSBvZiB1c2VyIGludGVyYWN0aW9ucyBhbmQgZXhjaGFuZ2VzIGJldHdlZW4gY2xpZW50IGFuZCBzZXJ2ZXIgaXMgZGV0ZXJtaW5lZCBvbiB0aGUgY2xpZW50IHNpZGUsIHRoZSBzZXJ2ZXIgc2lkZSBtb2R1bGVzIGFyZSByZWFkeSB0byByZWNlaXZlIHJlcXVlc3RzIGZyb20gdGhlIGNvcnJlc3BvbmRpbmcgY2xpZW50IHNpZGUgbW9kdWxlcyBhcyBzb29uIGFzIGEgY2xpZW50IGlzIGNvbm5lY3RlZCB0byB0aGUgc2VydmVyLlxuICpcbiAqIEVhY2ggbW9kdWxlIHNob3VsZCBoYXZlIGEge0BsaW5rIFNlcnZlck1vZHVsZSNjb25uZWN0fSBhbmQgYSB7QGxpbmsgU2VydmVyTW9kdWxlI2Rpc2Nvbm5lY3R9IG1ldGhvZHMuXG4gKiBBbnkgbW9kdWxlIG1hcHBlZCB0byB0aGUgdHlwZSBvZiBjbGllbnQgYCdjbGllbnRUeXBlJ2AgKHRoYW5rcyB0byB0aGUge0BsaW5rIHNlcnZlciNtYXB9IG1ldGhvZCkgY2FsbHMgaXRzIHtAbGluayBTZXJ2ZXJNb2R1bGUjY29ubmVjdH0gbWV0aG9kIHdoZW4gc3VjaCBhIGNsaWVudCBjb25uZWN0cyB0byB0aGUgc2VydmVyLCBhbmQgaXRzIHtAbGluayBTZXJ2ZXJNb2R1bGUjZGlzY29ubmVjdH0gbWV0aG9kIHdoZW4gc3VjaCBhIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudE1vZHVsZS5qc35DbGllbnRNb2R1bGV9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKlxuICogKipOb3RlOioqIGEgbW9yZSBjb21wbGV0ZSBleGFtcGxlIG9mIGhvdyB0byB3cml0ZSBhIG1vZHVsZSBpcyBpbiB0aGUgW0V4YW1wbGVdKG1hbnVhbC9leGFtcGxlLmh0bWwpIHNlY3Rpb24uXG4gKlxuICogQGV4YW1wbGVcbiAqIGNsYXNzIE15UGllciBleHRlbmRzIFBpZXIge1xuICogICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gKiAgICAgc3VwZXIobmFtZSk7XG4gKlxuICogICAgIC8vIC4uLlxuICogICB9XG4gKlxuICogICBjb25uZWN0KGNsaWVudCkge1xuICogICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcbiAqXG4gKiAgICAgLy8gLi4uXG4gKiAgIH1cbiAqXG4gKiAgIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gKiAgICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuICpcbiAqICAgICAvLyAuLi5cbiAqICAgfVxuICogfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJBY3Rpdml0eSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkIG9mIHRoZSBhY3Rpdml0eS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGlkKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBpZCBvZiB0aGUgYWN0aXZpdHkuIFRoaXMgaWQgbXVzdCBtYXRjaCBhIGNsaWVudCBzaWRlIGBBY3Rpdml0eWAgaWQgaW4gb3JkZXJcbiAgICAgKiB0byBjcmVhdGUgdGhlIHNvY2tldCBjaGFubmVsIGJldHdlZW4gdGhlIGFjdGl2aXR5IGFuZCBpdHMgY2xpZW50IHNpZGUgcGVlci5cbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuaWQgPSBpZDtcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbnMgb2YgdGhlIGFjdGl2aXR5LiAoU2hvdWxkIGJlIGNoYW5nZWQgYnkgY2FsbGluZyBgdGhpcy5jb25maWd1cmVgKVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNsaWVudCB0eXBlcyBvbiB3aGljaCB0aGUgYWN0aXZpdHkgc2hvdWxkIGJlIG1hcHBlZC5cbiAgICAgKiBAdHlwZSB7U2V0fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jbGllbnRUeXBlcyA9IG5ldyBTZXQoKTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIHJlcXVpcmVkIGFjdGl2aXRpZXNcbiAgICAgKiBAdHlwZSB7U2V0fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5yZXF1aXJlZEFjdGl2aXRpZXMgPSBuZXcgU2V0KCk7XG5cbiAgICAvLyByZWdpc3RlciBhcyBleGlzdGluZyB0byB0aGUgc2VydmVyXG4gICAgc2VydmVyLnNldEFjdGl2aXR5KHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB0aGUgYWN0aXZpdHkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgY2xpZW50IHR5cGUgdGhhdCBzaG91bGQgYmUgbWFwcGVkIHRvIHRoaXMgYWN0aXZpdHkuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSB2YWwgLSBUaGUgY2xpZW50IHR5cGUocykgb24gd2hpY2ggdGhlIGFjdGl2aXR5XG4gICAqICBzaG91bGQgYmUgbWFwcGVkXG4gICAqL1xuICBhZGRDbGllbnRUeXBlKHZhbHVlKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKVxuICAgICAgICB2YWx1ZSA9IFt2YWx1ZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIGFkZCBjbGllbnQgdHlwZXMgdG8gY3VycmVudCBhY3Rpdml0eVxuICAgIHZhbHVlLmZvckVhY2goKGNsaWVudFR5cGUpID0+IHtcbiAgICAgIHRoaXMuY2xpZW50VHlwZXMuYWRkKGNsaWVudFR5cGUpO1xuICAgIH0pO1xuICAgIC8vIHByb3BhZ2F0ZSB2YWx1ZSB0byByZXF1aXJlZCBhY3Rpdml0aWVzXG4gICAgdGhpcy5yZXF1aXJlZEFjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IHtcbiAgICAgIGFjdGl2aXR5LmFkZENsaWVudFR5cGUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgZ2l2ZW4gYWN0aXZpdHkgYXMgYSByZXF1aXJlbWVudCBmb3IgdGhlIGJlaGF2aW9yIG9mIHRoZVxuICAgKiAgY3VycmVudCBhY3Rpdml0eS5cbiAgICogQHByaXZhdGVcbiAgICogQHR5cGUge1NlcnZlckFjdGl2aXR5fSBhY3Rpdml0eVxuICAgKi9cbiAgYWRkUmVxdWlyZWRBY3Rpdml0eShhY3Rpdml0eSkge1xuICAgIHRoaXMucmVxdWlyZWRBY3Rpdml0aWVzLmFkZChhY3Rpdml0eSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCB0aGlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCBhbiBhY3Rpdml0eSwgaXMgYXV0b21hdGljYWxseSBjYWxsZWQgb24gc2VydmVyIHN0YXJ0dXAuXG4gICAqL1xuICBzdGFydCgpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBgY2xpZW50YCBjb25uZWN0cyB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgaGFuZGxlIHRoZSBsb2dpYyBvZiB0aGUgbW9kdWxlIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAgICogRm9yIGluc3RhbmNlLCBpdCBjYW4gdGFrZSBjYXJlIG9mIHRoZSBjb21tdW5pY2F0aW9uIHdpdGggdGhlIGNsaWVudCBzaWRlIG1vZHVsZSBieSBzZXR0aW5nIHVwIFdlYlNvY2tldCBtZXNzYWdlIGxpc3RlbmVycyBhbmQgc2VuZGluZyBXZWJTb2NrZXQgbWVzc2FnZXMsIG9yIGl0IGNhbiBhZGQgdGhlIGNsaWVudCB0byBhIGxpc3QgdG8ga2VlcCB0cmFjayBvZiBhbGwgdGhlIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IENvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIFNldHVwIGFuIG9iamVjdFxuICAgIGNsaWVudC5tb2R1bGVzW3RoaXMuaWRdID0ge307XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBgY2xpZW50YCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBoYW5kbGUgdGhlIGxvZ2ljIHdoZW4gdGhhdCBoYXBwZW5zLlxuICAgKiBGb3IgaW5zdGFuY2UsIGl0IGNhbiByZW1vdmUgdGhlIHNvY2tldCBtZXNzYWdlIGxpc3RlbmVycywgb3IgcmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgbGlzdCB0aGF0IGtlZXBzIHRyYWNrIG9mIHRoZSBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBEaXNjb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICAvLyBkZWxldGUgY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0gLy8gbWF5YmUgbmVlZGVkIGJ5IG90aGVyIG1vZHVsZXNcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdGhhdCBtdXN0IGxpc3RlbiB0byB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjbGllbnQsIGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLnJlY2VpdmUoY2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0by5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gO1xuICAgIHNvY2tldHMuc2VuZChjbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gYWxsIGNsaWVudCBvZiBnaXZlbiBgY2xpZW50VHlwZWAgb3IgYGNsaWVudFR5cGVgcy4gSWYgbm90IHNwZWNpZmllZCwgdGhlIG1lc3NhZ2UgaXMgc2VudCB0byBhbGwgY2xpZW50c1xuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gY2xpZW50VHlwZSAtIFRoZSBgY2xpZW50VHlwZWAocykgdGhhdCBtdXN0IHJlY2VpdmUgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIGJyb2FkY2FzdChjbGllbnRUeXBlLCBleGNsdWRlQ2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLmJyb2FkY2FzdChjbGllbnRUeXBlLCBleGNsdWRlQ2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cbn1cbiJdfQ==