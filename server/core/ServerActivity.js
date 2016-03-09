'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

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

var _sockets = require('./sockets');

var _sockets2 = _interopRequireDefault(_sockets);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _serverServiceManager = require('./serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var ServerActivity = function (_EventEmitter) {
  (0, _inherits3.default)(ServerActivity, _EventEmitter);

  /**
   * Creates an instance of the class.
   * @param {String} id - The id of the activity.
   */

  function ServerActivity(id) {
    (0, _classCallCheck3.default)(this, ServerActivity);


    /**
     * The id of the activity. This value must match a client side
     * {@link src/client/core/Activity.js~Activity} id in order to create
     * a namespaced socket channel between the activity and its client side peer.
     * @type {string}
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerActivity).call(this));

    _this.id = id;

    /**
     * Options of the activity. These values should be updated with the
     * `this.configure` method.
     * @type {Object}
     */
    _this.options = {};

    /**
     * The client types on which the activity should be mapped.
     * @type {Set}
     * @private
     */
    _this.clientTypes = new _set2.default();

    /**
     * List of the activities the current activity needs in order to work.
     * @type {Set}
     * @private
     */
    _this.requiredActivities = new _set2.default();

    // register as existing to the server
    _server2.default.setActivity(_this);
    return _this;
  }

  /**
   * Configure the activity.
   * @param {Object} options
   */


  (0, _createClass3.default)(ServerActivity, [{
    key: 'configure',
    value: function configure(options) {
      (0, _assign2.default)(this.options, options);
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
      var _this2 = this;

      if (arguments.length === 1) {
        if (typeof value === 'string') value = [value];
      } else {
        value = (0, _from2.default)(arguments);
      }

      // add client types to current activity
      value.forEach(function (clientType) {
        _this2.clientTypes.add(clientType);
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
      return _serverServiceManager2.default.require(id, this, options);
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
      _sockets2.default.receive(client, namespacedChannel, callback);
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

      _sockets2.default.send.apply(_sockets2.default, [client, namespacedChannel].concat(args));
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

      _sockets2.default.broadcast.apply(_sockets2.default, [clientType, excludeClient, namespacedChannel].concat(args));
    }
  }]);
  return ServerActivity;
}(_events.EventEmitter);

exports.default = ServerActivity;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckFjdGl2aXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQ3FCOzs7Ozs7OztBQUtuQixXQUxtQixjQUtuQixDQUFZLEVBQVosRUFBZ0I7d0NBTEcsZ0JBS0g7Ozs7Ozs7Ozs7NkZBTEcsNEJBS0g7O0FBU2QsVUFBSyxFQUFMLEdBQVUsRUFBVjs7Ozs7OztBQVRjLFNBZ0JkLENBQUssT0FBTCxHQUFlLEVBQWY7Ozs7Ozs7QUFoQmMsU0F1QmQsQ0FBSyxXQUFMLEdBQW1CLG1CQUFuQjs7Ozs7OztBQXZCYyxTQThCZCxDQUFLLGtCQUFMLEdBQTBCLG1CQUExQjs7O0FBOUJjLG9CQWlDZCxDQUFPLFdBQVAsUUFqQ2M7O0dBQWhCOzs7Ozs7Ozs2QkFMbUI7OzhCQTZDVCxTQUFTO0FBQ2pCLDRCQUFjLEtBQUssT0FBTCxFQUFjLE9BQTVCLEVBRGlCOzs7Ozs7Ozs7Ozs7a0NBVUwsT0FBTzs7O0FBQ25CLFVBQUksVUFBVSxNQUFWLEtBQXFCLENBQXJCLEVBQXdCO0FBQzFCLFlBQUksT0FBTyxLQUFQLEtBQWlCLFFBQWpCLEVBQ0YsUUFBUSxDQUFDLEtBQUQsQ0FBUixDQURGO09BREYsTUFHTztBQUNMLGdCQUFRLG9CQUFXLFNBQVgsQ0FBUixDQURLO09BSFA7OztBQURtQixXQVNuQixDQUFNLE9BQU4sQ0FBYyxVQUFDLFVBQUQsRUFBZ0I7QUFDNUIsZUFBSyxXQUFMLENBQWlCLEdBQWpCLENBQXFCLFVBQXJCLEVBRDRCO09BQWhCLENBQWQ7OztBQVRtQixVQWNuQixDQUFLLGtCQUFMLENBQXdCLE9BQXhCLENBQWdDLFVBQUMsUUFBRCxFQUFjO0FBQzVDLGlCQUFTLGFBQVQsQ0FBdUIsS0FBdkIsRUFENEM7T0FBZCxDQUFoQyxDQWRtQjs7Ozs7Ozs7Ozs7d0NBd0JELFVBQVU7QUFDNUIsV0FBSyxrQkFBTCxDQUF3QixHQUF4QixDQUE0QixRQUE1QixFQUQ0Qjs7Ozs7Ozs7Ozs7NEJBU3RCLElBQUksU0FBUztBQUNuQixhQUFPLCtCQUFxQixPQUFyQixDQUE2QixFQUE3QixFQUFpQyxJQUFqQyxFQUF1QyxPQUF2QyxDQUFQLENBRG1COzs7Ozs7Ozs7Ozs7Ozs7NEJBYWI7Ozs7Ozs7Ozs7Ozs0QkFTQSxRQUFROztBQUVkLGFBQU8sT0FBUCxDQUFlLEtBQUssRUFBTCxDQUFmLEdBQTBCLEVBQTFCLENBRmM7Ozs7Ozs7Ozs7Ozs7K0JBWUwsUUFBUTs7Ozs7Ozs7Ozs7Ozs0QkFVWCxRQUFRLFNBQVMsVUFBVTtBQUNqQyxVQUFNLG9CQUF1QixLQUFLLEVBQUwsU0FBVyxPQUFsQyxDQUQyQjtBQUVqQyx3QkFBUSxPQUFSLENBQWdCLE1BQWhCLEVBQXdCLGlCQUF4QixFQUEyQyxRQUEzQyxFQUZpQzs7Ozs7Ozs7Ozs7O3lCQVc5QixRQUFRLFNBQWtCO0FBQzdCLFVBQU0sb0JBQXVCLEtBQUssRUFBTCxTQUFXLE9BQWxDLENBRHVCOzt3Q0FBTjs7T0FBTTs7QUFFN0Isd0JBQVEsSUFBUiwyQkFBYSxRQUFRLDBCQUFzQixLQUEzQyxFQUY2Qjs7Ozs7Ozs7Ozs7OzhCQVdyQixZQUFZLGVBQWUsU0FBa0I7QUFDckQsVUFBTSxvQkFBdUIsS0FBSyxFQUFMLFNBQVcsT0FBbEMsQ0FEK0M7O3lDQUFOOztPQUFNOztBQUVyRCx3QkFBUSxTQUFSLDJCQUFrQixZQUFZLGVBQWUsMEJBQXNCLEtBQW5FLEVBRnFEOzs7U0ExSnBDIiwiZmlsZSI6IlNlcnZlckFjdGl2aXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNvY2tldHMgZnJvbSAnLi9zb2NrZXRzJztcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXInO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmVyU2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuLy8gQHRvZG8gLSByZW1vdmUgRXZlbnRFbWl0dGVyID8gKEltcGxlbWVudCBvdXIgb3duIGxpc3RlbmVycylcblxuLyoqXG4gKiBCYXNlIGNsYXNzIHVzZWQgdG8gY3JlYXRlIGFueSAqU291bmR3b3JrcyogYWN0aXZpdHkgb24gdGhlIHNlcnZlciBzaWRlLlxuICpcbiAqIFdoaWxlIHRoZSBzZXF1ZW5jZSBvZiB1c2VyIGludGVyYWN0aW9ucyBhbmQgZXhjaGFuZ2VzIGJldHdlZW4gY2xpZW50IGFuZCBzZXJ2ZXIgaXMgZGV0ZXJtaW5lZCBvbiB0aGUgY2xpZW50IHNpZGUsIHRoZSBzZXJ2ZXIgc2lkZSBtb2R1bGVzIGFyZSByZWFkeSB0byByZWNlaXZlIHJlcXVlc3RzIGZyb20gdGhlIGNvcnJlc3BvbmRpbmcgY2xpZW50IHNpZGUgbW9kdWxlcyBhcyBzb29uIGFzIGEgY2xpZW50IGlzIGNvbm5lY3RlZCB0byB0aGUgc2VydmVyLlxuICpcbiAqIEVhY2ggbW9kdWxlIHNob3VsZCBoYXZlIGEge0BsaW5rIFNlcnZlck1vZHVsZSNjb25uZWN0fSBhbmQgYSB7QGxpbmsgU2VydmVyTW9kdWxlI2Rpc2Nvbm5lY3R9IG1ldGhvZHMuXG4gKiBBbnkgbW9kdWxlIG1hcHBlZCB0byB0aGUgdHlwZSBvZiBjbGllbnQgYCdjbGllbnRUeXBlJ2AgKHRoYW5rcyB0byB0aGUge0BsaW5rIHNlcnZlciNtYXB9IG1ldGhvZCkgY2FsbHMgaXRzIHtAbGluayBTZXJ2ZXJNb2R1bGUjY29ubmVjdH0gbWV0aG9kIHdoZW4gc3VjaCBhIGNsaWVudCBjb25uZWN0cyB0byB0aGUgc2VydmVyLCBhbmQgaXRzIHtAbGluayBTZXJ2ZXJNb2R1bGUjZGlzY29ubmVjdH0gbWV0aG9kIHdoZW4gc3VjaCBhIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudE1vZHVsZS5qc35DbGllbnRNb2R1bGV9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKlxuICogKipOb3RlOioqIGEgbW9yZSBjb21wbGV0ZSBleGFtcGxlIG9mIGhvdyB0byB3cml0ZSBhIG1vZHVsZSBpcyBpbiB0aGUgW0V4YW1wbGVdKG1hbnVhbC9leGFtcGxlLmh0bWwpIHNlY3Rpb24uXG4gKlxuICogQGV4YW1wbGVcbiAqIGNsYXNzIE15UGllciBleHRlbmRzIFBpZXIge1xuICogICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gKiAgICAgc3VwZXIobmFtZSk7XG4gKlxuICogICAgIC8vIC4uLlxuICogICB9XG4gKlxuICogICBjb25uZWN0KGNsaWVudCkge1xuICogICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcbiAqXG4gKiAgICAgLy8gLi4uXG4gKiAgIH1cbiAqXG4gKiAgIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gKiAgICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuICpcbiAqICAgICAvLyAuLi5cbiAqICAgfVxuICogfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJBY3Rpdml0eSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkIG9mIHRoZSBhY3Rpdml0eS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGlkKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBpZCBvZiB0aGUgYWN0aXZpdHkuIFRoaXMgdmFsdWUgbXVzdCBtYXRjaCBhIGNsaWVudCBzaWRlXG4gICAgICoge0BsaW5rIHNyYy9jbGllbnQvY29yZS9BY3Rpdml0eS5qc35BY3Rpdml0eX0gaWQgaW4gb3JkZXIgdG8gY3JlYXRlXG4gICAgICogYSBuYW1lc3BhY2VkIHNvY2tldCBjaGFubmVsIGJldHdlZW4gdGhlIGFjdGl2aXR5IGFuZCBpdHMgY2xpZW50IHNpZGUgcGVlci5cbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuaWQgPSBpZDtcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbnMgb2YgdGhlIGFjdGl2aXR5LiBUaGVzZSB2YWx1ZXMgc2hvdWxkIGJlIHVwZGF0ZWQgd2l0aCB0aGVcbiAgICAgKiBgdGhpcy5jb25maWd1cmVgIG1ldGhvZC5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNsaWVudCB0eXBlcyBvbiB3aGljaCB0aGUgYWN0aXZpdHkgc2hvdWxkIGJlIG1hcHBlZC5cbiAgICAgKiBAdHlwZSB7U2V0fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jbGllbnRUeXBlcyA9IG5ldyBTZXQoKTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGFjdGl2aXRpZXMgdGhlIGN1cnJlbnQgYWN0aXZpdHkgbmVlZHMgaW4gb3JkZXIgdG8gd29yay5cbiAgICAgKiBAdHlwZSB7U2V0fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5yZXF1aXJlZEFjdGl2aXRpZXMgPSBuZXcgU2V0KCk7XG5cbiAgICAvLyByZWdpc3RlciBhcyBleGlzdGluZyB0byB0aGUgc2VydmVyXG4gICAgc2VydmVyLnNldEFjdGl2aXR5KHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB0aGUgYWN0aXZpdHkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgY2xpZW50IHR5cGUgdGhhdCBzaG91bGQgYmUgbWFwcGVkIHRvIHRoaXMgYWN0aXZpdHkuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSB2YWwgLSBUaGUgY2xpZW50IHR5cGUocykgb24gd2hpY2ggdGhlIGFjdGl2aXR5XG4gICAqICBzaG91bGQgYmUgbWFwcGVkXG4gICAqL1xuICBhZGRDbGllbnRUeXBlKHZhbHVlKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKVxuICAgICAgICB2YWx1ZSA9IFt2YWx1ZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIGFkZCBjbGllbnQgdHlwZXMgdG8gY3VycmVudCBhY3Rpdml0eVxuICAgIHZhbHVlLmZvckVhY2goKGNsaWVudFR5cGUpID0+IHtcbiAgICAgIHRoaXMuY2xpZW50VHlwZXMuYWRkKGNsaWVudFR5cGUpO1xuICAgIH0pO1xuXG4gICAgLy8gcHJvcGFnYXRlIHZhbHVlIHRvIHJlcXVpcmVkIGFjdGl2aXRpZXNcbiAgICB0aGlzLnJlcXVpcmVkQWN0aXZpdGllcy5mb3JFYWNoKChhY3Rpdml0eSkgPT4ge1xuICAgICAgYWN0aXZpdHkuYWRkQ2xpZW50VHlwZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBnaXZlbiBhY3Rpdml0eSBhcyBhIHJlcXVpcmVtZW50IGZvciB0aGUgY3VycmVudCBhY3Rpdml0eS5cbiAgICogQHByaXZhdGVcbiAgICogQHR5cGUge1NlcnZlckFjdGl2aXR5fSBhY3Rpdml0eVxuICAgKi9cbiAgYWRkUmVxdWlyZWRBY3Rpdml0eShhY3Rpdml0eSkge1xuICAgIHRoaXMucmVxdWlyZWRBY3Rpdml0aWVzLmFkZChhY3Rpdml0eSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYSBzZXJ2aWNlLiBUaGUgcmVxdWlyZWQgc2VydmljZSBpcyBhZGRlZCB0byB0aGUgYHJlcXVpcmVkQWN0aXZpdGllc2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBTb21lIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCB0aGlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGJlIGltcGxlbWVudGVkIGJ5IGFjdGl2aXRpZXMuIEFzIHBhcnQgb2YgYW4gYWN0aXZpdHlcbiAgICogbGlmZWN5Y2xlLCB0aGUgbWV0aG9kIHNob3VsZCBkZWZpbmUgdGhlIGJlaGF2aW9yIG9mIHRoZSBhY3Rpdml0eSB3aGVuIHN0YXJ0ZWRcbiAgICogKGUuZy4gYmluZGluZyBsaXN0ZW5lcnMpLiBXaGVuIHRoaXMgbWV0aG9kIGlkIGNhbGxlZCwgYWxsIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgKiBzaG91bGQgYmUgc2V0dGVkLiBBbHNvLCBpZiB0aGUgYWN0aXZpdHkgcmVsaWVzIG9uIGFub3RoZXIgc2VydmljZVxuICAgKiAoZS5nLiB7QGxpbmsgc3JjL3NlcnZlci9jb3JlL1NlcnZlclNoYXJlZENvbmZpZy5qc35TZXJ2ZXJTaGFyZWRDb25maWd9KSxcbiAgICogdGhpcyBkZXBlbmRlbmN5IHNob3VsZCBiZSBjb25zaWRlcmVkIGFzIGluc3RhbmNpYXRlZC5cbiAgICogVGhlIG1ldGhvZCBpcyBhdXRvbWF0aWNhbGx5IGNhbGxlZCBieSB0aGUgc2VydmVyIG9uIHN0YXJ0dXAuXG4gICAqL1xuICBzdGFydCgpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBgY2xpZW50YCBjb25uZWN0cyB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgaGFuZGxlIHRoZSBsb2dpYyBvZiB0aGUgbW9kdWxlIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAgICogRm9yIGluc3RhbmNlLCBpdCBjYW4gdGFrZSBjYXJlIG9mIHRoZSBjb21tdW5pY2F0aW9uIHdpdGggdGhlIGNsaWVudCBzaWRlIG1vZHVsZSBieSBzZXR0aW5nIHVwIFdlYlNvY2tldCBtZXNzYWdlIGxpc3RlbmVycyBhbmQgc2VuZGluZyBXZWJTb2NrZXQgbWVzc2FnZXMsIG9yIGl0IGNhbiBhZGQgdGhlIGNsaWVudCB0byBhIGxpc3QgdG8ga2VlcCB0cmFjayBvZiBhbGwgdGhlIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IENvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIFNldHVwIGFuIG9iamVjdFxuICAgIGNsaWVudC5tb2R1bGVzW3RoaXMuaWRdID0ge307XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBgY2xpZW50YCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBoYW5kbGUgdGhlIGxvZ2ljIHdoZW4gdGhhdCBoYXBwZW5zLlxuICAgKiBGb3IgaW5zdGFuY2UsIGl0IGNhbiByZW1vdmUgdGhlIHNvY2tldCBtZXNzYWdlIGxpc3RlbmVycywgb3IgcmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgbGlzdCB0aGF0IGtlZXBzIHRyYWNrIG9mIHRoZSBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBEaXNjb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICAvLyBkZWxldGUgY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0gLy8gbWF5YmUgbmVlZGVkIGJ5IG90aGVyIG1vZHVsZXNcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdGhhdCBtdXN0IGxpc3RlbiB0byB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjbGllbnQsIGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLnJlY2VpdmUoY2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0by5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gO1xuICAgIHNvY2tldHMuc2VuZChjbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gYWxsIGNsaWVudCBvZiBnaXZlbiBgY2xpZW50VHlwZWAgb3IgYGNsaWVudFR5cGVgcy4gSWYgbm90IHNwZWNpZmllZCwgdGhlIG1lc3NhZ2UgaXMgc2VudCB0byBhbGwgY2xpZW50c1xuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gY2xpZW50VHlwZSAtIFRoZSBgY2xpZW50VHlwZWAocykgdGhhdCBtdXN0IHJlY2VpdmUgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIGJyb2FkY2FzdChjbGllbnRUeXBlLCBleGNsdWRlQ2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLmJyb2FkY2FzdChjbGllbnRUeXBlLCBleGNsdWRlQ2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cbn1cbiJdfQ==