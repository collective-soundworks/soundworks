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

var _serviceManager = require('./serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @todo - remove EventEmitter ? (Implement our own listeners)

/**
 * Base class used to create any *Soundworks* Activity on the server side.
 *
 * While the sequence of user interactions and exchanges between client and server is determined on the client side, the server side activities are ready to receive requests from the corresponding client side activities as soon as a client is connected to the server.
 *
 * Each activity should have a connect and a disconnect method.
 * Any activity mapped to the type of client `'clientType'` (thanks to the {@link server#map} method) calls its connect method when such a client connects to the server, and its disconnect method when such a client disconnects from the server.
 */

var Activity = function (_EventEmitter) {
  (0, _inherits3.default)(Activity, _EventEmitter);

  /**
   * Creates an instance of the class.
   * @param {String} id - The id of the activity.
   */

  function Activity(id) {
    (0, _classCallCheck3.default)(this, Activity);


    /**
     * The id of the activity. This value must match a client side
     * {@link src/client/core/Activity.js~Activity} id in order to create
     * a namespaced socket channel between the activity and its client side peer.
     * @type {string}
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Activity).call(this));

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


  (0, _createClass3.default)(Activity, [{
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
     * @type {Activity} activity
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
      return _serviceManager2.default.require(id, this, options);
    }

    /**
     * Interface method to be implemented by activities. As part of an activity
     * lifecycle, the method should define the behavior of the activity when started
     * (e.g. binding listeners). When this method id called, all configuration options
     * should be setted. Also, if the activity relies on another service,
     * this dependency should be considered as instanciated.
     * The method is automatically called by the server on startup.
     */

  }, {
    key: 'start',
    value: function start() {}

    /**
     * Called when the `client` connects to the server.
     *
     * This method should handle the logic of the activity on the server side.
     * For instance, it can take care of the communication with the client side activity by setting up WebSocket message listeners and sending WebSocket messages, or it can add the client to a list to keep track of all the connected clients.
     * @param {Client} client Connected client.
     */

  }, {
    key: 'connect',
    value: function connect(client) {
      // setup an object
      client.activities[this.id] = {};
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
    // delete client.activities[this.id] // maybe needed by other activities


    /**
     * Listen a WebSocket message.
     * @param {Client} client - The client that must listen to the message.
     * @param {String} channel - The channel of the message (is automatically namespaced with the activity's name: `${this.id}:channel`).
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
     * @param {String} channel - The channel of the message (is automatically namespaced with the activity's name: `${this.id}:channel`).
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
     * @param {String} channel - The channel of the message (is automatically namespaced with the activity's name: `${this.id}:channel`).
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
  return Activity;
}(_events.EventEmitter);

exports.default = Activity;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGl2aXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztJQVlxQjs7Ozs7Ozs7QUFLbkIsV0FMbUIsUUFLbkIsQ0FBWSxFQUFaLEVBQWdCO3dDQUxHLFVBS0g7Ozs7Ozs7Ozs7NkZBTEcsc0JBS0g7O0FBU2QsVUFBSyxFQUFMLEdBQVUsRUFBVjs7Ozs7OztBQVRjLFNBZ0JkLENBQUssT0FBTCxHQUFlLEVBQWY7Ozs7Ozs7QUFoQmMsU0F1QmQsQ0FBSyxXQUFMLEdBQW1CLG1CQUFuQjs7Ozs7OztBQXZCYyxTQThCZCxDQUFLLGtCQUFMLEdBQTBCLG1CQUExQjs7O0FBOUJjLG9CQWlDZCxDQUFPLFdBQVAsUUFqQ2M7O0dBQWhCOzs7Ozs7Ozs2QkFMbUI7OzhCQTZDVCxTQUFTO0FBQ2pCLDRCQUFjLEtBQUssT0FBTCxFQUFjLE9BQTVCLEVBRGlCOzs7Ozs7Ozs7Ozs7a0NBVUwsT0FBTzs7O0FBQ25CLFVBQUksVUFBVSxNQUFWLEtBQXFCLENBQXJCLEVBQXdCO0FBQzFCLFlBQUksT0FBTyxLQUFQLEtBQWlCLFFBQWpCLEVBQ0YsUUFBUSxDQUFDLEtBQUQsQ0FBUixDQURGO09BREYsTUFHTztBQUNMLGdCQUFRLG9CQUFXLFNBQVgsQ0FBUixDQURLO09BSFA7OztBQURtQixXQVNuQixDQUFNLE9BQU4sQ0FBYyxVQUFDLFVBQUQsRUFBZ0I7QUFDNUIsZUFBSyxXQUFMLENBQWlCLEdBQWpCLENBQXFCLFVBQXJCLEVBRDRCO09BQWhCLENBQWQ7OztBQVRtQixVQWNuQixDQUFLLGtCQUFMLENBQXdCLE9BQXhCLENBQWdDLFVBQUMsUUFBRCxFQUFjO0FBQzVDLGlCQUFTLGFBQVQsQ0FBdUIsS0FBdkIsRUFENEM7T0FBZCxDQUFoQyxDQWRtQjs7Ozs7Ozs7Ozs7d0NBd0JELFVBQVU7QUFDNUIsV0FBSyxrQkFBTCxDQUF3QixHQUF4QixDQUE0QixRQUE1QixFQUQ0Qjs7Ozs7Ozs7Ozs7NEJBU3RCLElBQUksU0FBUztBQUNuQixhQUFPLHlCQUFlLE9BQWYsQ0FBdUIsRUFBdkIsRUFBMkIsSUFBM0IsRUFBaUMsT0FBakMsQ0FBUCxDQURtQjs7Ozs7Ozs7Ozs7Ozs7NEJBWWI7Ozs7Ozs7Ozs7Ozs0QkFTQSxRQUFROztBQUVkLGFBQU8sVUFBUCxDQUFrQixLQUFLLEVBQUwsQ0FBbEIsR0FBNkIsRUFBN0IsQ0FGYzs7Ozs7Ozs7Ozs7OzsrQkFZTCxRQUFROzs7Ozs7Ozs7Ozs7OzRCQVVYLFFBQVEsU0FBUyxVQUFVO0FBQ2pDLFVBQU0sb0JBQXVCLEtBQUssRUFBTCxTQUFXLE9BQWxDLENBRDJCO0FBRWpDLHdCQUFRLE9BQVIsQ0FBZ0IsTUFBaEIsRUFBd0IsaUJBQXhCLEVBQTJDLFFBQTNDLEVBRmlDOzs7Ozs7Ozs7Ozs7eUJBVzlCLFFBQVEsU0FBa0I7QUFDN0IsVUFBTSxvQkFBdUIsS0FBSyxFQUFMLFNBQVcsT0FBbEMsQ0FEdUI7O3dDQUFOOztPQUFNOztBQUU3Qix3QkFBUSxJQUFSLDJCQUFhLFFBQVEsMEJBQXNCLEtBQTNDLEVBRjZCOzs7Ozs7Ozs7Ozs7OEJBV3JCLFlBQVksZUFBZSxTQUFrQjtBQUNyRCxVQUFNLG9CQUF1QixLQUFLLEVBQUwsU0FBVyxPQUFsQyxDQUQrQzs7eUNBQU47O09BQU07O0FBRXJELHdCQUFRLFNBQVIsMkJBQWtCLFlBQVksZUFBZSwwQkFBc0IsS0FBbkUsRUFGcUQ7OztTQXpKcEMiLCJmaWxlIjoiQWN0aXZpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc29ja2V0cyBmcm9tICcuL3NvY2tldHMnO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG4vLyBAdG9kbyAtIHJlbW92ZSBFdmVudEVtaXR0ZXIgPyAoSW1wbGVtZW50IG91ciBvd24gbGlzdGVuZXJzKVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgdXNlZCB0byBjcmVhdGUgYW55ICpTb3VuZHdvcmtzKiBBY3Rpdml0eSBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKlxuICogV2hpbGUgdGhlIHNlcXVlbmNlIG9mIHVzZXIgaW50ZXJhY3Rpb25zIGFuZCBleGNoYW5nZXMgYmV0d2VlbiBjbGllbnQgYW5kIHNlcnZlciBpcyBkZXRlcm1pbmVkIG9uIHRoZSBjbGllbnQgc2lkZSwgdGhlIHNlcnZlciBzaWRlIGFjdGl2aXRpZXMgYXJlIHJlYWR5IHRvIHJlY2VpdmUgcmVxdWVzdHMgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBjbGllbnQgc2lkZSBhY3Rpdml0aWVzIGFzIHNvb24gYXMgYSBjbGllbnQgaXMgY29ubmVjdGVkIHRvIHRoZSBzZXJ2ZXIuXG4gKlxuICogRWFjaCBhY3Rpdml0eSBzaG91bGQgaGF2ZSBhIGNvbm5lY3QgYW5kIGEgZGlzY29ubmVjdCBtZXRob2QuXG4gKiBBbnkgYWN0aXZpdHkgbWFwcGVkIHRvIHRoZSB0eXBlIG9mIGNsaWVudCBgJ2NsaWVudFR5cGUnYCAodGhhbmtzIHRvIHRoZSB7QGxpbmsgc2VydmVyI21hcH0gbWV0aG9kKSBjYWxscyBpdHMgY29ubmVjdCBtZXRob2Qgd2hlbiBzdWNoIGEgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIsIGFuZCBpdHMgZGlzY29ubmVjdCBtZXRob2Qgd2hlbiBzdWNoIGEgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0aXZpdHkgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgYWN0aXZpdHkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaWQgb2YgdGhlIGFjdGl2aXR5LiBUaGlzIHZhbHVlIG11c3QgbWF0Y2ggYSBjbGllbnQgc2lkZVxuICAgICAqIHtAbGluayBzcmMvY2xpZW50L2NvcmUvQWN0aXZpdHkuanN+QWN0aXZpdHl9IGlkIGluIG9yZGVyIHRvIGNyZWF0ZVxuICAgICAqIGEgbmFtZXNwYWNlZCBzb2NrZXQgY2hhbm5lbCBiZXR3ZWVuIHRoZSBhY3Rpdml0eSBhbmQgaXRzIGNsaWVudCBzaWRlIHBlZXIuXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmlkID0gaWQ7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIG9mIHRoZSBhY3Rpdml0eS4gVGhlc2UgdmFsdWVzIHNob3VsZCBiZSB1cGRhdGVkIHdpdGggdGhlXG4gICAgICogYHRoaXMuY29uZmlndXJlYCBtZXRob2QuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjbGllbnQgdHlwZXMgb24gd2hpY2ggdGhlIGFjdGl2aXR5IHNob3VsZCBiZSBtYXBwZWQuXG4gICAgICogQHR5cGUge1NldH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50VHlwZXMgPSBuZXcgU2V0KCk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBhY3Rpdml0aWVzIHRoZSBjdXJyZW50IGFjdGl2aXR5IG5lZWRzIGluIG9yZGVyIHRvIHdvcmsuXG4gICAgICogQHR5cGUge1NldH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVxdWlyZWRBY3Rpdml0aWVzID0gbmV3IFNldCgpO1xuXG4gICAgLy8gcmVnaXN0ZXIgYXMgZXhpc3RpbmcgdG8gdGhlIHNlcnZlclxuICAgIHNlcnZlci5zZXRBY3Rpdml0eSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIGFjdGl2aXR5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGNsaWVudCB0eXBlIHRoYXQgc2hvdWxkIGJlIG1hcHBlZCB0byB0aGlzIGFjdGl2aXR5LlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gdmFsIC0gVGhlIGNsaWVudCB0eXBlKHMpIG9uIHdoaWNoIHRoZSBhY3Rpdml0eVxuICAgKiAgc2hvdWxkIGJlIG1hcHBlZFxuICAgKi9cbiAgYWRkQ2xpZW50VHlwZSh2YWx1ZSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJylcbiAgICAgICAgdmFsdWUgPSBbdmFsdWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IEFycmF5LmZyb20oYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgY2xpZW50IHR5cGVzIHRvIGN1cnJlbnQgYWN0aXZpdHlcbiAgICB2YWx1ZS5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICB0aGlzLmNsaWVudFR5cGVzLmFkZChjbGllbnRUeXBlKTtcbiAgICB9KTtcblxuICAgIC8vIHByb3BhZ2F0ZSB2YWx1ZSB0byByZXF1aXJlZCBhY3Rpdml0aWVzXG4gICAgdGhpcy5yZXF1aXJlZEFjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IHtcbiAgICAgIGFjdGl2aXR5LmFkZENsaWVudFR5cGUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgZ2l2ZW4gYWN0aXZpdHkgYXMgYSByZXF1aXJlbWVudCBmb3IgdGhlIGN1cnJlbnQgYWN0aXZpdHkuXG4gICAqIEBwcml2YXRlXG4gICAqIEB0eXBlIHtBY3Rpdml0eX0gYWN0aXZpdHlcbiAgICovXG4gIGFkZFJlcXVpcmVkQWN0aXZpdHkoYWN0aXZpdHkpIHtcbiAgICB0aGlzLnJlcXVpcmVkQWN0aXZpdGllcy5hZGQoYWN0aXZpdHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGEgc2VydmljZS4gVGhlIHJlcXVpcmVkIHNlcnZpY2UgaXMgYWRkZWQgdG8gdGhlIGByZXF1aXJlZEFjdGl2aXRpZXNgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gU29tZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgdGhpcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBiZSBpbXBsZW1lbnRlZCBieSBhY3Rpdml0aWVzLiBBcyBwYXJ0IG9mIGFuIGFjdGl2aXR5XG4gICAqIGxpZmVjeWNsZSwgdGhlIG1ldGhvZCBzaG91bGQgZGVmaW5lIHRoZSBiZWhhdmlvciBvZiB0aGUgYWN0aXZpdHkgd2hlbiBzdGFydGVkXG4gICAqIChlLmcuIGJpbmRpbmcgbGlzdGVuZXJzKS4gV2hlbiB0aGlzIG1ldGhvZCBpZCBjYWxsZWQsIGFsbCBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICogc2hvdWxkIGJlIHNldHRlZC4gQWxzbywgaWYgdGhlIGFjdGl2aXR5IHJlbGllcyBvbiBhbm90aGVyIHNlcnZpY2UsXG4gICAqIHRoaXMgZGVwZW5kZW5jeSBzaG91bGQgYmUgY29uc2lkZXJlZCBhcyBpbnN0YW5jaWF0ZWQuXG4gICAqIFRoZSBtZXRob2QgaXMgYXV0b21hdGljYWxseSBjYWxsZWQgYnkgdGhlIHNlcnZlciBvbiBzdGFydHVwLlxuICAgKi9cbiAgc3RhcnQoKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgYGNsaWVudGAgY29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGhhbmRsZSB0aGUgbG9naWMgb2YgdGhlIGFjdGl2aXR5IG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAgICogRm9yIGluc3RhbmNlLCBpdCBjYW4gdGFrZSBjYXJlIG9mIHRoZSBjb21tdW5pY2F0aW9uIHdpdGggdGhlIGNsaWVudCBzaWRlIGFjdGl2aXR5IGJ5IHNldHRpbmcgdXAgV2ViU29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzIGFuZCBzZW5kaW5nIFdlYlNvY2tldCBtZXNzYWdlcywgb3IgaXQgY2FuIGFkZCB0aGUgY2xpZW50IHRvIGEgbGlzdCB0byBrZWVwIHRyYWNrIG9mIGFsbCB0aGUgY29ubmVjdGVkIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgLy8gc2V0dXAgYW4gb2JqZWN0XG4gICAgY2xpZW50LmFjdGl2aXRpZXNbdGhpcy5pZF0gPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGBjbGllbnRgIGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAgICpcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGhhbmRsZSB0aGUgbG9naWMgd2hlbiB0aGF0IGhhcHBlbnMuXG4gICAqIEZvciBpbnN0YW5jZSwgaXQgY2FuIHJlbW92ZSB0aGUgc29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzLCBvciByZW1vdmUgdGhlIGNsaWVudCBmcm9tIHRoZSBsaXN0IHRoYXQga2VlcHMgdHJhY2sgb2YgdGhlIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IERpc2Nvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIGRlbGV0ZSBjbGllbnQuYWN0aXZpdGllc1t0aGlzLmlkXSAvLyBtYXliZSBuZWVkZWQgYnkgb3RoZXIgYWN0aXZpdGllc1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0aGF0IG11c3QgbGlzdGVuIHRvIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2xpZW50LCBjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5pZH06JHtjaGFubmVsfWA7XG4gICAgc29ja2V0cy5yZWNlaXZlKGNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBjbGllbnQuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBhY3Rpdml0eSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gO1xuICAgIHNvY2tldHMuc2VuZChjbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gYWxsIGNsaWVudCBvZiBnaXZlbiBgY2xpZW50VHlwZWAgb3IgYGNsaWVudFR5cGVgcy4gSWYgbm90IHNwZWNpZmllZCwgdGhlIG1lc3NhZ2UgaXMgc2VudCB0byBhbGwgY2xpZW50c1xuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gY2xpZW50VHlwZSAtIFRoZSBgY2xpZW50VHlwZWAocykgdGhhdCBtdXN0IHJlY2VpdmUgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBhY3Rpdml0eSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgYnJvYWRjYXN0KGNsaWVudFR5cGUsIGV4Y2x1ZGVDbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gO1xuICAgIHNvY2tldHMuYnJvYWRjYXN0KGNsaWVudFR5cGUsIGV4Y2x1ZGVDbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCAuLi5hcmdzKTtcbiAgfVxufVxuIl19