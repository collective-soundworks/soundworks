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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL2NvcmUvU2VydmVyQWN0aXZpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBb0IsV0FBVzs7OztzQkFDWixVQUFVOzs7O29DQUNJLHdCQUF3Qjs7OztzQkFDNUIsUUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQ2hCLGNBQWM7WUFBZCxjQUFjOzs7Ozs7O0FBS3RCLFdBTFEsY0FBYyxDQUtyQixFQUFFLEVBQUU7MEJBTEcsY0FBYzs7QUFNL0IsK0JBTmlCLGNBQWMsNkNBTXZCOzs7Ozs7OztBQVFSLFFBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDOzs7Ozs7O0FBT2IsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFPbEIsUUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFTLENBQUM7Ozs7Ozs7QUFPN0IsUUFBSSxDQUFDLGtCQUFrQixHQUFHLFVBQVMsQ0FBQzs7O0FBR3BDLHdCQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUMxQjs7Ozs7OztlQXZDa0IsY0FBYzs7V0E2Q3hCLG1CQUFDLE9BQU8sRUFBRTtBQUNqQixxQkFBYyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3RDOzs7Ozs7Ozs7O1dBUVksdUJBQUMsS0FBSyxFQUFFOzs7QUFDbkIsVUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMxQixZQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFDM0IsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDbkIsTUFBTTtBQUNMLGFBQUssR0FBRyxZQUFXLFNBQVMsQ0FBQyxDQUFDO09BQy9COzs7QUFHRCxXQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVSxFQUFLO0FBQzVCLGNBQUssV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztPQUNsQyxDQUFDLENBQUM7OztBQUdILFVBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDNUMsZ0JBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDL0IsQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7OztXQU9rQiw2QkFBQyxRQUFRLEVBQUU7QUFDNUIsVUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN2Qzs7Ozs7Ozs7O1dBT00saUJBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUNuQixhQUFPLGtDQUFxQixPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN4RDs7Ozs7Ozs7Ozs7OztXQVdJLGlCQUFHLEVBQUU7Ozs7Ozs7Ozs7O1dBU0gsaUJBQUMsTUFBTSxFQUFFOztBQUVkLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUM5Qjs7Ozs7Ozs7Ozs7V0FTUyxvQkFBQyxNQUFNLEVBQUUsRUFFbEI7Ozs7Ozs7OztBQUFBOzs7V0FRTSxpQkFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUNqQyxVQUFNLGlCQUFpQixHQUFNLElBQUksQ0FBQyxFQUFFLFNBQUksT0FBTyxBQUFFLENBQUM7QUFDbEQsMkJBQVEsT0FBTyxDQUFDLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN0RDs7Ozs7Ozs7OztXQVFHLGNBQUMsTUFBTSxFQUFFLE9BQU8sRUFBVztBQUM3QixVQUFNLGlCQUFpQixHQUFNLElBQUksQ0FBQyxFQUFFLFNBQUksT0FBTyxBQUFFLENBQUM7O3dDQUQzQixJQUFJO0FBQUosWUFBSTs7O0FBRTNCLDJCQUFRLElBQUksTUFBQSx3QkFBQyxNQUFNLEVBQUUsaUJBQWlCLFNBQUssSUFBSSxFQUFDLENBQUM7S0FDbEQ7Ozs7Ozs7Ozs7V0FRUSxtQkFBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBVztBQUNyRCxVQUFNLGlCQUFpQixHQUFNLElBQUksQ0FBQyxFQUFFLFNBQUksT0FBTyxBQUFFLENBQUM7O3lDQURILElBQUk7QUFBSixZQUFJOzs7QUFFbkQsMkJBQVEsU0FBUyxNQUFBLHdCQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsaUJBQWlCLFNBQUssSUFBSSxFQUFDLENBQUM7S0FDMUU7OztTQTdKa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvY29yZS9TZXJ2ZXJBY3Rpdml0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzb2NrZXRzIGZyb20gJy4vc29ja2V0cyc7XG5pbXBvcnQgc2VydmVyIGZyb20gJy4vc2VydmVyJztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbi8vIEB0b2RvIC0gcmVtb3ZlIEV2ZW50RW1pdHRlciA/IChJbXBsZW1lbnQgb3VyIG93biBsaXN0ZW5lcnMpXG5cbi8qKlxuICogQmFzZSBjbGFzcyB1c2VkIHRvIGNyZWF0ZSBhbnkgKlNvdW5kd29ya3MqIGFjdGl2aXR5IG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAqXG4gKiBXaGlsZSB0aGUgc2VxdWVuY2Ugb2YgdXNlciBpbnRlcmFjdGlvbnMgYW5kIGV4Y2hhbmdlcyBiZXR3ZWVuIGNsaWVudCBhbmQgc2VydmVyIGlzIGRldGVybWluZWQgb24gdGhlIGNsaWVudCBzaWRlLCB0aGUgc2VydmVyIHNpZGUgbW9kdWxlcyBhcmUgcmVhZHkgdG8gcmVjZWl2ZSByZXF1ZXN0cyBmcm9tIHRoZSBjb3JyZXNwb25kaW5nIGNsaWVudCBzaWRlIG1vZHVsZXMgYXMgc29vbiBhcyBhIGNsaWVudCBpcyBjb25uZWN0ZWQgdG8gdGhlIHNlcnZlci5cbiAqXG4gKiBFYWNoIG1vZHVsZSBzaG91bGQgaGF2ZSBhIHtAbGluayBTZXJ2ZXJNb2R1bGUjY29ubmVjdH0gYW5kIGEge0BsaW5rIFNlcnZlck1vZHVsZSNkaXNjb25uZWN0fSBtZXRob2RzLlxuICogQW55IG1vZHVsZSBtYXBwZWQgdG8gdGhlIHR5cGUgb2YgY2xpZW50IGAnY2xpZW50VHlwZSdgICh0aGFua3MgdG8gdGhlIHtAbGluayBzZXJ2ZXIjbWFwfSBtZXRob2QpIGNhbGxzIGl0cyB7QGxpbmsgU2VydmVyTW9kdWxlI2Nvbm5lY3R9IG1ldGhvZCB3aGVuIHN1Y2ggYSBjbGllbnQgY29ubmVjdHMgdG8gdGhlIHNlcnZlciwgYW5kIGl0cyB7QGxpbmsgU2VydmVyTW9kdWxlI2Rpc2Nvbm5lY3R9IG1ldGhvZCB3aGVuIHN1Y2ggYSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRNb2R1bGUuanN+Q2xpZW50TW9kdWxlfSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICpcbiAqICoqTm90ZToqKiBhIG1vcmUgY29tcGxldGUgZXhhbXBsZSBvZiBob3cgdG8gd3JpdGUgYSBtb2R1bGUgaXMgaW4gdGhlIFtFeGFtcGxlXShtYW51YWwvZXhhbXBsZS5odG1sKSBzZWN0aW9uLlxuICpcbiAqIEBleGFtcGxlXG4gKiBjbGFzcyBNeVBpZXIgZXh0ZW5kcyBQaWVyIHtcbiAqICAgY29uc3RydWN0b3IobmFtZSkge1xuICogICAgIHN1cGVyKG5hbWUpO1xuICpcbiAqICAgICAvLyAuLi5cbiAqICAgfVxuICpcbiAqICAgY29ubmVjdChjbGllbnQpIHtcbiAqICAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG4gKlxuICogICAgIC8vIC4uLlxuICogICB9XG4gKlxuICogICBkaXNjb25uZWN0KGNsaWVudCkge1xuICogICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcbiAqXG4gKiAgICAgLy8gLi4uXG4gKiAgIH1cbiAqIH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyQWN0aXZpdHkgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgYWN0aXZpdHkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaWQgb2YgdGhlIGFjdGl2aXR5LiBUaGlzIHZhbHVlIG11c3QgbWF0Y2ggYSBjbGllbnQgc2lkZVxuICAgICAqIHtAbGluayBzcmMvY2xpZW50L2NvcmUvQWN0aXZpdHkuanN+QWN0aXZpdHl9IGlkIGluIG9yZGVyIHRvIGNyZWF0ZVxuICAgICAqIGEgbmFtZXNwYWNlZCBzb2NrZXQgY2hhbm5lbCBiZXR3ZWVuIHRoZSBhY3Rpdml0eSBhbmQgaXRzIGNsaWVudCBzaWRlIHBlZXIuXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmlkID0gaWQ7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIG9mIHRoZSBhY3Rpdml0eS4gVGhlc2UgdmFsdWVzIHNob3VsZCBiZSB1cGRhdGVkIHdpdGggdGhlXG4gICAgICogYHRoaXMuY29uZmlndXJlYCBtZXRob2QuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjbGllbnQgdHlwZXMgb24gd2hpY2ggdGhlIGFjdGl2aXR5IHNob3VsZCBiZSBtYXBwZWQuXG4gICAgICogQHR5cGUge1NldH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50VHlwZXMgPSBuZXcgU2V0KCk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBhY3Rpdml0aWVzIHRoZSBjdXJyZW50IGFjdGl2aXR5IG5lZWRzIGluIG9yZGVyIHRvIHdvcmsuXG4gICAgICogQHR5cGUge1NldH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVxdWlyZWRBY3Rpdml0aWVzID0gbmV3IFNldCgpO1xuXG4gICAgLy8gcmVnaXN0ZXIgYXMgZXhpc3RpbmcgdG8gdGhlIHNlcnZlclxuICAgIHNlcnZlci5zZXRBY3Rpdml0eSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIGFjdGl2aXR5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGNsaWVudCB0eXBlIHRoYXQgc2hvdWxkIGJlIG1hcHBlZCB0byB0aGlzIGFjdGl2aXR5LlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gdmFsIC0gVGhlIGNsaWVudCB0eXBlKHMpIG9uIHdoaWNoIHRoZSBhY3Rpdml0eVxuICAgKiAgc2hvdWxkIGJlIG1hcHBlZFxuICAgKi9cbiAgYWRkQ2xpZW50VHlwZSh2YWx1ZSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJylcbiAgICAgICAgdmFsdWUgPSBbdmFsdWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IEFycmF5LmZyb20oYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgY2xpZW50IHR5cGVzIHRvIGN1cnJlbnQgYWN0aXZpdHlcbiAgICB2YWx1ZS5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICB0aGlzLmNsaWVudFR5cGVzLmFkZChjbGllbnRUeXBlKTtcbiAgICB9KTtcblxuICAgIC8vIHByb3BhZ2F0ZSB2YWx1ZSB0byByZXF1aXJlZCBhY3Rpdml0aWVzXG4gICAgdGhpcy5yZXF1aXJlZEFjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IHtcbiAgICAgIGFjdGl2aXR5LmFkZENsaWVudFR5cGUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgZ2l2ZW4gYWN0aXZpdHkgYXMgYSByZXF1aXJlbWVudCBmb3IgdGhlIGN1cnJlbnQgYWN0aXZpdHkuXG4gICAqIEBwcml2YXRlXG4gICAqIEB0eXBlIHtTZXJ2ZXJBY3Rpdml0eX0gYWN0aXZpdHlcbiAgICovXG4gIGFkZFJlcXVpcmVkQWN0aXZpdHkoYWN0aXZpdHkpIHtcbiAgICB0aGlzLnJlcXVpcmVkQWN0aXZpdGllcy5hZGQoYWN0aXZpdHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGEgc2VydmljZS4gVGhlIHJlcXVpcmVkIHNlcnZpY2UgaXMgYWRkZWQgdG8gdGhlIGByZXF1aXJlZEFjdGl2aXRpZXNgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gU29tZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmVyU2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgdGhpcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBiZSBpbXBsZW1lbnRlZCBieSBhY3Rpdml0aWVzLiBBcyBwYXJ0IG9mIGFuIGFjdGl2aXR5XG4gICAqIGxpZmVjeWNsZSwgdGhlIG1ldGhvZCBzaG91bGQgZGVmaW5lIHRoZSBiZWhhdmlvciBvZiB0aGUgYWN0aXZpdHkgd2hlbiBzdGFydGVkXG4gICAqIChlLmcuIGJpbmRpbmcgbGlzdGVuZXJzKS4gV2hlbiB0aGlzIG1ldGhvZCBpZCBjYWxsZWQsIGFsbCBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICogc2hvdWxkIGJlIHNldHRlZC4gQWxzbywgaWYgdGhlIGFjdGl2aXR5IHJlbGllcyBvbiBhbm90aGVyIHNlcnZpY2VcbiAgICogKGUuZy4ge0BsaW5rIHNyYy9zZXJ2ZXIvY29yZS9TZXJ2ZXJTaGFyZWRDb25maWcuanN+U2VydmVyU2hhcmVkQ29uZmlnfSksXG4gICAqIHRoaXMgZGVwZW5kZW5jeSBzaG91bGQgYmUgY29uc2lkZXJlZCBhcyBpbnN0YW5jaWF0ZWQuXG4gICAqIFRoZSBtZXRob2QgaXMgYXV0b21hdGljYWxseSBjYWxsZWQgYnkgdGhlIHNlcnZlciBvbiBzdGFydHVwLlxuICAgKi9cbiAgc3RhcnQoKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgYGNsaWVudGAgY29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGhhbmRsZSB0aGUgbG9naWMgb2YgdGhlIG1vZHVsZSBvbiB0aGUgc2VydmVyIHNpZGUuXG4gICAqIEZvciBpbnN0YW5jZSwgaXQgY2FuIHRha2UgY2FyZSBvZiB0aGUgY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBjbGllbnQgc2lkZSBtb2R1bGUgYnkgc2V0dGluZyB1cCBXZWJTb2NrZXQgbWVzc2FnZSBsaXN0ZW5lcnMgYW5kIHNlbmRpbmcgV2ViU29ja2V0IG1lc3NhZ2VzLCBvciBpdCBjYW4gYWRkIHRoZSBjbGllbnQgdG8gYSBsaXN0IHRvIGtlZXAgdHJhY2sgb2YgYWxsIHRoZSBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICAvLyBTZXR1cCBhbiBvYmplY3RcbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLmlkXSA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgYGNsaWVudGAgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgaGFuZGxlIHRoZSBsb2dpYyB3aGVuIHRoYXQgaGFwcGVucy5cbiAgICogRm9yIGluc3RhbmNlLCBpdCBjYW4gcmVtb3ZlIHRoZSBzb2NrZXQgbWVzc2FnZSBsaXN0ZW5lcnMsIG9yIHJlbW92ZSB0aGUgY2xpZW50IGZyb20gdGhlIGxpc3QgdGhhdCBrZWVwcyB0cmFjayBvZiB0aGUgY29ubmVjdGVkIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgRGlzY29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgLy8gZGVsZXRlIGNsaWVudC5tb2R1bGVzW3RoaXMuaWRdIC8vIG1heWJlIG5lZWRlZCBieSBvdGhlciBtb2R1bGVzXG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHRoYXQgbXVzdCBsaXN0ZW4gdG8gdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2xpZW50LCBjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5pZH06JHtjaGFubmVsfWA7XG4gICAgc29ja2V0cy5yZWNlaXZlKGNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBjbGllbnQuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLnNlbmQoY2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIGFsbCBjbGllbnQgb2YgZ2l2ZW4gYGNsaWVudFR5cGVgIG9yIGBjbGllbnRUeXBlYHMuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBtZXNzYWdlIGlzIHNlbnQgdG8gYWxsIGNsaWVudHNcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGNsaWVudFR5cGUgLSBUaGUgYGNsaWVudFR5cGVgKHMpIHRoYXQgbXVzdCByZWNlaXZlIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBicm9hZGNhc3QoY2xpZW50VHlwZSwgZXhjbHVkZUNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5pZH06JHtjaGFubmVsfWA7XG4gICAgc29ja2V0cy5icm9hZGNhc3QoY2xpZW50VHlwZSwgZXhjbHVkZUNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIC4uLmFyZ3MpO1xuICB9XG59XG4iXX0=