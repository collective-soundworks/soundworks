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
 * Internal base class for services and scenes.
 *
 * @memberof module:soundworks/server
 */
var Activity = function (_EventEmitter) {
  (0, _inherits3.default)(Activity, _EventEmitter);

  /**
   * Creates an instance of the class.
   * @param {String} id - Id of the activity.
   */
  function Activity(id) {
    (0, _classCallCheck3.default)(this, Activity);

    /**
     * The id of the activity. This value must match a client side
     * {@link src/client/core/Activity.js~Activity} id in order to create
     * a namespaced socket channel between the activity and its client side peer.
     * @type {String}
     * @name id
     * @instance
     * @memberof module:soundworks/server.Activity
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (Activity.__proto__ || (0, _getPrototypeOf2.default)(Activity)).call(this));

    _this.id = id;

    /**
     * Options of the activity. These values should be updated with the
     * `this.configure` method.
     * @type {Object}
     * @name options
     * @instance
     * @memberof module:soundworks/server.Activity
     */
    _this.options = {};

    /**
     * The client types on which the activity should be mapped.
     * @type {Set}
     * @name clientTypes
     * @instance
     * @memberof module:soundworks/server.Activity
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
     * @param {module:soundworks/server.Activity} activity
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
     * (e.g. binding listeners). When this method is called, all configuration options
     * should be defined.
     * The method is automatically called by the server on startup.
     */

  }, {
    key: 'start',
    value: function start() {}

    /**
     * Called when the `client` connects to the server. This method should handle
     * the particular logic of the activity on the server side according to the
     * connected client (e.g. adding socket listeners).
     * @param {module:soundworks/server.Client} client
     */

  }, {
    key: 'connect',
    value: function connect(client) {
      // setup an object
      client.activities[this.id] = {};
    }

    /**
     * Called when the client `client` disconnects from the server. This method
     * should handle the particular logic of the activity on the server side when
     * a client disconnect (e.g. removing socket listeners).
     * @param {module:soundworks/server.Client} client
     */

  }, {
    key: 'disconnect',
    value: function disconnect(client) {}
    // delete client.activities[this.id] // maybe needed by other activities


    /**
     * Listen to a web socket message from a given client.
     * @param {module:soundworks/server.Client} client - Client that must listen to the message.
     * @param {String} channel - Channel of the message (is automatically namespaced
     *  with the activity's name: `${this.id}:channel`).
     * @param {Function} callback - Callback to execute when a message is received.
     */

  }, {
    key: 'receive',
    value: function receive(client, channel, callback) {
      var namespacedChannel = this.id + ':' + channel;
      _sockets2.default.receive(client, namespacedChannel, callback);
    }

    /**
     * Send a web socket message to a given client.
     * @param {module:soundworks/server.Client} client - Client to send the message to.
     * @param {String} channel - Channel of the message (is automatically namespaced
     * with the activity's id: `${this.id}:channel`).
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
     * Send a message to all client of given `clientType`(s).
     * @param {String|Array<String>|null} clientType - The `clientType`(s) that should
     *  receive the message. If `null`, the message is send to all clients.
     * @param {module:soundworks/server.Client} excludeClient - Client to should
     *  not receive the message (typically the original sender of the message).
     * @param {String} channel - Channel of the message (is automatically namespaced
     * with the activity's id: `${this.id}:channel`).
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGl2aXR5LmpzIl0sIm5hbWVzIjpbIkFjdGl2aXR5IiwiaWQiLCJvcHRpb25zIiwiY2xpZW50VHlwZXMiLCJyZXF1aXJlZEFjdGl2aXRpZXMiLCJzZXRBY3Rpdml0eSIsInZhbHVlIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiZm9yRWFjaCIsImNsaWVudFR5cGUiLCJhZGQiLCJhY3Rpdml0eSIsImFkZENsaWVudFR5cGUiLCJyZXF1aXJlIiwiY2xpZW50IiwiYWN0aXZpdGllcyIsImNoYW5uZWwiLCJjYWxsYmFjayIsIm5hbWVzcGFjZWRDaGFubmVsIiwicmVjZWl2ZSIsImFyZ3MiLCJzZW5kIiwiZXhjbHVkZUNsaWVudCIsImJyb2FkY2FzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQUVBOzs7OztJQUtNQSxROzs7QUFDSjs7OztBQUlBLG9CQUFZQyxFQUFaLEVBQWdCO0FBQUE7O0FBR2Q7Ozs7Ozs7OztBQUhjOztBQVlkLFVBQUtBLEVBQUwsR0FBVUEsRUFBVjs7QUFFQTs7Ozs7Ozs7QUFRQSxVQUFLQyxPQUFMLEdBQWUsRUFBZjs7QUFFQTs7Ozs7OztBQU9BLFVBQUtDLFdBQUwsR0FBbUIsbUJBQW5COztBQUVBOzs7OztBQUtBLFVBQUtDLGtCQUFMLEdBQTBCLG1CQUExQjs7QUFFQTtBQUNBLHFCQUFPQyxXQUFQO0FBekNjO0FBMENmOztBQUVEOzs7Ozs7Ozs4QkFJVUgsTyxFQUFTO0FBQ2pCLDRCQUFjLEtBQUtBLE9BQW5CLEVBQTRCQSxPQUE1QjtBQUNEOztBQUVEOzs7Ozs7Ozs7a0NBTWNJLEssRUFBTztBQUFBOztBQUNuQixVQUFJQyxVQUFVQyxNQUFWLEtBQXFCLENBQXpCLEVBQTRCO0FBQzFCLFlBQUksT0FBT0YsS0FBUCxLQUFpQixRQUFyQixFQUNFQSxRQUFRLENBQUNBLEtBQUQsQ0FBUjtBQUNILE9BSEQsTUFHTztBQUNMQSxnQkFBUSxvQkFBV0MsU0FBWCxDQUFSO0FBQ0Q7O0FBRUQ7QUFDQUQsWUFBTUcsT0FBTixDQUFjLFVBQUNDLFVBQUQsRUFBZ0I7QUFDNUIsZUFBS1AsV0FBTCxDQUFpQlEsR0FBakIsQ0FBcUJELFVBQXJCO0FBQ0QsT0FGRDs7QUFJQTtBQUNBLFdBQUtOLGtCQUFMLENBQXdCSyxPQUF4QixDQUFnQyxVQUFDRyxRQUFELEVBQWM7QUFDNUNBLGlCQUFTQyxhQUFULENBQXVCUCxLQUF2QjtBQUNELE9BRkQ7QUFHRDs7QUFFRDs7Ozs7Ozs7d0NBS29CTSxRLEVBQVU7QUFDNUIsV0FBS1Isa0JBQUwsQ0FBd0JPLEdBQXhCLENBQTRCQyxRQUE1QjtBQUNEOztBQUVEOzs7Ozs7Ozs0QkFLUVgsRSxFQUFJQyxPLEVBQVM7QUFDbkIsYUFBTyx5QkFBZVksT0FBZixDQUF1QmIsRUFBdkIsRUFBMkIsSUFBM0IsRUFBaUNDLE9BQWpDLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs0QkFPUSxDQUFFOztBQUVWOzs7Ozs7Ozs7NEJBTVFhLE0sRUFBUTtBQUNkO0FBQ0FBLGFBQU9DLFVBQVAsQ0FBa0IsS0FBS2YsRUFBdkIsSUFBNkIsRUFBN0I7QUFDRDs7QUFFRDs7Ozs7Ozs7OytCQU1XYyxNLEVBQVEsQ0FFbEI7QUFEQzs7O0FBR0Y7Ozs7Ozs7Ozs7NEJBT1FBLE0sRUFBUUUsTyxFQUFTQyxRLEVBQVU7QUFDakMsVUFBTUMsb0JBQXVCLEtBQUtsQixFQUE1QixTQUFrQ2dCLE9BQXhDO0FBQ0Esd0JBQVFHLE9BQVIsQ0FBZ0JMLE1BQWhCLEVBQXdCSSxpQkFBeEIsRUFBMkNELFFBQTNDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7eUJBT0tILE0sRUFBUUUsTyxFQUFrQjtBQUM3QixVQUFNRSxvQkFBdUIsS0FBS2xCLEVBQTVCLFNBQWtDZ0IsT0FBeEM7O0FBRDZCLHdDQUFOSSxJQUFNO0FBQU5BLFlBQU07QUFBQTs7QUFFN0Isd0JBQVFDLElBQVIsMkJBQWFQLE1BQWIsRUFBcUJJLGlCQUFyQixTQUEyQ0UsSUFBM0M7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs4QkFVVVgsVSxFQUFZYSxhLEVBQWVOLE8sRUFBa0I7QUFDckQsVUFBTUUsb0JBQXVCLEtBQUtsQixFQUE1QixTQUFrQ2dCLE9BQXhDOztBQURxRCx5Q0FBTkksSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBRXJELHdCQUFRRyxTQUFSLDJCQUFrQmQsVUFBbEIsRUFBOEJhLGFBQTlCLEVBQTZDSixpQkFBN0MsU0FBbUVFLElBQW5FO0FBQ0Q7Ozs7O2tCQUdZckIsUSIsImZpbGUiOiJBY3Rpdml0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzb2NrZXRzIGZyb20gJy4vc29ja2V0cyc7XG5pbXBvcnQgc2VydmVyIGZyb20gJy4vc2VydmVyJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbi8vIEB0b2RvIC0gcmVtb3ZlIEV2ZW50RW1pdHRlciA/IChJbXBsZW1lbnQgb3VyIG93biBsaXN0ZW5lcnMpXG5cbi8qKlxuICogSW50ZXJuYWwgYmFzZSBjbGFzcyBmb3Igc2VydmljZXMgYW5kIHNjZW5lcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKi9cbmNsYXNzIEFjdGl2aXR5IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBJZCBvZiB0aGUgYWN0aXZpdHkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaWQgb2YgdGhlIGFjdGl2aXR5LiBUaGlzIHZhbHVlIG11c3QgbWF0Y2ggYSBjbGllbnQgc2lkZVxuICAgICAqIHtAbGluayBzcmMvY2xpZW50L2NvcmUvQWN0aXZpdHkuanN+QWN0aXZpdHl9IGlkIGluIG9yZGVyIHRvIGNyZWF0ZVxuICAgICAqIGEgbmFtZXNwYWNlZCBzb2NrZXQgY2hhbm5lbCBiZXR3ZWVuIHRoZSBhY3Rpdml0eSBhbmQgaXRzIGNsaWVudCBzaWRlIHBlZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAbmFtZSBpZFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLmlkID0gaWQ7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIG9mIHRoZSBhY3Rpdml0eS4gVGhlc2UgdmFsdWVzIHNob3VsZCBiZSB1cGRhdGVkIHdpdGggdGhlXG4gICAgICogYHRoaXMuY29uZmlndXJlYCBtZXRob2QuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbmFtZSBvcHRpb25zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5BY3Rpdml0eVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNsaWVudCB0eXBlcyBvbiB3aGljaCB0aGUgYWN0aXZpdHkgc2hvdWxkIGJlIG1hcHBlZC5cbiAgICAgKiBAdHlwZSB7U2V0fVxuICAgICAqIEBuYW1lIGNsaWVudFR5cGVzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5BY3Rpdml0eVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50VHlwZXMgPSBuZXcgU2V0KCk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBhY3Rpdml0aWVzIHRoZSBjdXJyZW50IGFjdGl2aXR5IG5lZWRzIGluIG9yZGVyIHRvIHdvcmsuXG4gICAgICogQHR5cGUge1NldH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVxdWlyZWRBY3Rpdml0aWVzID0gbmV3IFNldCgpO1xuXG4gICAgLy8gcmVnaXN0ZXIgYXMgZXhpc3RpbmcgdG8gdGhlIHNlcnZlclxuICAgIHNlcnZlci5zZXRBY3Rpdml0eSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIGFjdGl2aXR5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGNsaWVudCB0eXBlIHRoYXQgc2hvdWxkIGJlIG1hcHBlZCB0byB0aGlzIGFjdGl2aXR5LlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gdmFsIC0gVGhlIGNsaWVudCB0eXBlKHMpIG9uIHdoaWNoIHRoZSBhY3Rpdml0eVxuICAgKiAgc2hvdWxkIGJlIG1hcHBlZFxuICAgKi9cbiAgYWRkQ2xpZW50VHlwZSh2YWx1ZSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJylcbiAgICAgICAgdmFsdWUgPSBbdmFsdWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IEFycmF5LmZyb20oYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgY2xpZW50IHR5cGVzIHRvIGN1cnJlbnQgYWN0aXZpdHlcbiAgICB2YWx1ZS5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICB0aGlzLmNsaWVudFR5cGVzLmFkZChjbGllbnRUeXBlKTtcbiAgICB9KTtcblxuICAgIC8vIHByb3BhZ2F0ZSB2YWx1ZSB0byByZXF1aXJlZCBhY3Rpdml0aWVzXG4gICAgdGhpcy5yZXF1aXJlZEFjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IHtcbiAgICAgIGFjdGl2aXR5LmFkZENsaWVudFR5cGUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgZ2l2ZW4gYWN0aXZpdHkgYXMgYSByZXF1aXJlbWVudCBmb3IgdGhlIGN1cnJlbnQgYWN0aXZpdHkuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkFjdGl2aXR5fSBhY3Rpdml0eVxuICAgKi9cbiAgYWRkUmVxdWlyZWRBY3Rpdml0eShhY3Rpdml0eSkge1xuICAgIHRoaXMucmVxdWlyZWRBY3Rpdml0aWVzLmFkZChhY3Rpdml0eSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYSBzZXJ2aWNlLiBUaGUgcmVxdWlyZWQgc2VydmljZSBpcyBhZGRlZCB0byB0aGUgYHJlcXVpcmVkQWN0aXZpdGllc2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBTb21lIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCB0aGlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGJlIGltcGxlbWVudGVkIGJ5IGFjdGl2aXRpZXMuIEFzIHBhcnQgb2YgYW4gYWN0aXZpdHlcbiAgICogbGlmZWN5Y2xlLCB0aGUgbWV0aG9kIHNob3VsZCBkZWZpbmUgdGhlIGJlaGF2aW9yIG9mIHRoZSBhY3Rpdml0eSB3aGVuIHN0YXJ0ZWRcbiAgICogKGUuZy4gYmluZGluZyBsaXN0ZW5lcnMpLiBXaGVuIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCwgYWxsIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgKiBzaG91bGQgYmUgZGVmaW5lZC5cbiAgICogVGhlIG1ldGhvZCBpcyBhdXRvbWF0aWNhbGx5IGNhbGxlZCBieSB0aGUgc2VydmVyIG9uIHN0YXJ0dXAuXG4gICAqL1xuICBzdGFydCgpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBgY2xpZW50YCBjb25uZWN0cyB0byB0aGUgc2VydmVyLiBUaGlzIG1ldGhvZCBzaG91bGQgaGFuZGxlXG4gICAqIHRoZSBwYXJ0aWN1bGFyIGxvZ2ljIG9mIHRoZSBhY3Rpdml0eSBvbiB0aGUgc2VydmVyIHNpZGUgYWNjb3JkaW5nIHRvIHRoZVxuICAgKiBjb25uZWN0ZWQgY2xpZW50IChlLmcuIGFkZGluZyBzb2NrZXQgbGlzdGVuZXJzKS5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50fSBjbGllbnRcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgLy8gc2V0dXAgYW4gb2JqZWN0XG4gICAgY2xpZW50LmFjdGl2aXRpZXNbdGhpcy5pZF0gPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGBjbGllbnRgIGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci4gVGhpcyBtZXRob2RcbiAgICogc2hvdWxkIGhhbmRsZSB0aGUgcGFydGljdWxhciBsb2dpYyBvZiB0aGUgYWN0aXZpdHkgb24gdGhlIHNlcnZlciBzaWRlIHdoZW5cbiAgICogYSBjbGllbnQgZGlzY29ubmVjdCAoZS5nLiByZW1vdmluZyBzb2NrZXQgbGlzdGVuZXJzKS5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50fSBjbGllbnRcbiAgICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgLy8gZGVsZXRlIGNsaWVudC5hY3Rpdml0aWVzW3RoaXMuaWRdIC8vIG1heWJlIG5lZWRlZCBieSBvdGhlciBhY3Rpdml0aWVzXG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuIHRvIGEgd2ViIHNvY2tldCBtZXNzYWdlIGZyb20gYSBnaXZlbiBjbGllbnQuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNsaWVudH0gY2xpZW50IC0gQ2xpZW50IHRoYXQgbXVzdCBsaXN0ZW4gdG8gdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkXG4gICAqICB3aXRoIHRoZSBhY3Rpdml0eSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjbGllbnQsIGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLnJlY2VpdmUoY2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSB3ZWIgc29ja2V0IG1lc3NhZ2UgdG8gYSBnaXZlbiBjbGllbnQuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNsaWVudH0gY2xpZW50IC0gQ2xpZW50IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkXG4gICAqIHdpdGggdGhlIGFjdGl2aXR5J3MgaWQ6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gO1xuICAgIHNvY2tldHMuc2VuZChjbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgbWVzc2FnZSB0byBhbGwgY2xpZW50IG9mIGdpdmVuIGBjbGllbnRUeXBlYChzKS5cbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXk8U3RyaW5nPnxudWxsfSBjbGllbnRUeXBlIC0gVGhlIGBjbGllbnRUeXBlYChzKSB0aGF0IHNob3VsZFxuICAgKiAgcmVjZWl2ZSB0aGUgbWVzc2FnZS4gSWYgYG51bGxgLCB0aGUgbWVzc2FnZSBpcyBzZW5kIHRvIGFsbCBjbGllbnRzLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DbGllbnR9IGV4Y2x1ZGVDbGllbnQgLSBDbGllbnQgdG8gc2hvdWxkXG4gICAqICBub3QgcmVjZWl2ZSB0aGUgbWVzc2FnZSAodHlwaWNhbGx5IHRoZSBvcmlnaW5hbCBzZW5kZXIgb2YgdGhlIG1lc3NhZ2UpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIENoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZFxuICAgKiB3aXRoIHRoZSBhY3Rpdml0eSdzIGlkOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIGJyb2FkY2FzdChjbGllbnRUeXBlLCBleGNsdWRlQ2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLmJyb2FkY2FzdChjbGllbnRUeXBlLCBleGNsdWRlQ2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWN0aXZpdHk7XG4iXX0=