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

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Activity).call(this));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGl2aXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQVNNLFE7Ozs7Ozs7O0FBS0osb0JBQVksRUFBWixFQUFnQjtBQUFBOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBWWQsVUFBSyxFQUFMLEdBQVUsRUFBVjs7Ozs7Ozs7OztBQVVBLFVBQUssT0FBTCxHQUFlLEVBQWY7Ozs7Ozs7OztBQVNBLFVBQUssV0FBTCxHQUFtQixtQkFBbkI7Ozs7Ozs7QUFPQSxVQUFLLGtCQUFMLEdBQTBCLG1CQUExQjs7O0FBR0EscUJBQU8sV0FBUDtBQXpDYztBQTBDZjs7Ozs7Ozs7Ozs4QkFNUyxPLEVBQVM7QUFDakIsNEJBQWMsS0FBSyxPQUFuQixFQUE0QixPQUE1QjtBQUNEOzs7Ozs7Ozs7OztrQ0FRYSxLLEVBQU87QUFBQTs7QUFDbkIsVUFBSSxVQUFVLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDMUIsWUFBSSxPQUFPLEtBQVAsS0FBaUIsUUFBckIsRUFDRSxRQUFRLENBQUMsS0FBRCxDQUFSO0FBQ0gsT0FIRCxNQUdPO0FBQ0wsZ0JBQVEsb0JBQVcsU0FBWCxDQUFSO0FBQ0Q7OztBQUdELFlBQU0sT0FBTixDQUFjLFVBQUMsVUFBRCxFQUFnQjtBQUM1QixlQUFLLFdBQUwsQ0FBaUIsR0FBakIsQ0FBcUIsVUFBckI7QUFDRCxPQUZEOzs7QUFLQSxXQUFLLGtCQUFMLENBQXdCLE9BQXhCLENBQWdDLFVBQUMsUUFBRCxFQUFjO0FBQzVDLGlCQUFTLGFBQVQsQ0FBdUIsS0FBdkI7QUFDRCxPQUZEO0FBR0Q7Ozs7Ozs7Ozs7d0NBT21CLFEsRUFBVTtBQUM1QixXQUFLLGtCQUFMLENBQXdCLEdBQXhCLENBQTRCLFFBQTVCO0FBQ0Q7Ozs7Ozs7Ozs7NEJBT08sRSxFQUFJLE8sRUFBUztBQUNuQixhQUFPLHlCQUFlLE9BQWYsQ0FBdUIsRUFBdkIsRUFBMkIsSUFBM0IsRUFBaUMsT0FBakMsQ0FBUDtBQUNEOzs7Ozs7Ozs7Ozs7NEJBU08sQ0FBRTs7Ozs7Ozs7Ozs7NEJBUUYsTSxFQUFROztBQUVkLGFBQU8sVUFBUCxDQUFrQixLQUFLLEVBQXZCLElBQTZCLEVBQTdCO0FBQ0Q7Ozs7Ozs7Ozs7OytCQVFVLE0sRUFBUSxDQUVsQjs7Ozs7Ozs7Ozs7Ozs7NEJBU08sTSxFQUFRLE8sRUFBUyxRLEVBQVU7QUFDakMsVUFBTSxvQkFBdUIsS0FBSyxFQUE1QixTQUFrQyxPQUF4QztBQUNBLHdCQUFRLE9BQVIsQ0FBZ0IsTUFBaEIsRUFBd0IsaUJBQXhCLEVBQTJDLFFBQTNDO0FBQ0Q7Ozs7Ozs7Ozs7Ozt5QkFTSSxNLEVBQVEsTyxFQUFrQjtBQUM3QixVQUFNLG9CQUF1QixLQUFLLEVBQTVCLFNBQWtDLE9BQXhDOztBQUQ2Qix3Q0FBTixJQUFNO0FBQU4sWUFBTTtBQUFBOztBQUU3Qix3QkFBUSxJQUFSLDJCQUFhLE1BQWIsRUFBcUIsaUJBQXJCLFNBQTJDLElBQTNDO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs4QkFZUyxVLEVBQVksYSxFQUFlLE8sRUFBa0I7QUFDckQsVUFBTSxvQkFBdUIsS0FBSyxFQUE1QixTQUFrQyxPQUF4Qzs7QUFEcUQseUNBQU4sSUFBTTtBQUFOLFlBQU07QUFBQTs7QUFFckQsd0JBQVEsU0FBUiwyQkFBa0IsVUFBbEIsRUFBOEIsYUFBOUIsRUFBNkMsaUJBQTdDLFNBQW1FLElBQW5FO0FBQ0Q7Ozs7O2tCQUdZLFEiLCJmaWxlIjoiQWN0aXZpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc29ja2V0cyBmcm9tICcuL3NvY2tldHMnO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG4vLyBAdG9kbyAtIHJlbW92ZSBFdmVudEVtaXR0ZXIgPyAoSW1wbGVtZW50IG91ciBvd24gbGlzdGVuZXJzKVxuXG4vKipcbiAqIEludGVybmFsIGJhc2UgY2xhc3MgZm9yIHNlcnZpY2VzIGFuZCBzY2VuZXMuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICovXG5jbGFzcyBBY3Rpdml0eSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gSWQgb2YgdGhlIGFjdGl2aXR5LlxuICAgKi9cbiAgY29uc3RydWN0b3IoaWQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGlkIG9mIHRoZSBhY3Rpdml0eS4gVGhpcyB2YWx1ZSBtdXN0IG1hdGNoIGEgY2xpZW50IHNpZGVcbiAgICAgKiB7QGxpbmsgc3JjL2NsaWVudC9jb3JlL0FjdGl2aXR5LmpzfkFjdGl2aXR5fSBpZCBpbiBvcmRlciB0byBjcmVhdGVcbiAgICAgKiBhIG5hbWVzcGFjZWQgc29ja2V0IGNoYW5uZWwgYmV0d2VlbiB0aGUgYWN0aXZpdHkgYW5kIGl0cyBjbGllbnQgc2lkZSBwZWVyLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQG5hbWUgaWRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkFjdGl2aXR5XG4gICAgICovXG4gICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ucyBvZiB0aGUgYWN0aXZpdHkuIFRoZXNlIHZhbHVlcyBzaG91bGQgYmUgdXBkYXRlZCB3aXRoIHRoZVxuICAgICAqIGB0aGlzLmNvbmZpZ3VyZWAgbWV0aG9kLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgb3B0aW9uc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjbGllbnQgdHlwZXMgb24gd2hpY2ggdGhlIGFjdGl2aXR5IHNob3VsZCBiZSBtYXBwZWQuXG4gICAgICogQHR5cGUge1NldH1cbiAgICAgKiBAbmFtZSBjbGllbnRUeXBlc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudFR5cGVzID0gbmV3IFNldCgpO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgYWN0aXZpdGllcyB0aGUgY3VycmVudCBhY3Rpdml0eSBuZWVkcyBpbiBvcmRlciB0byB3b3JrLlxuICAgICAqIEB0eXBlIHtTZXR9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnJlcXVpcmVkQWN0aXZpdGllcyA9IG5ldyBTZXQoKTtcblxuICAgIC8vIHJlZ2lzdGVyIGFzIGV4aXN0aW5nIHRvIHRoZSBzZXJ2ZXJcbiAgICBzZXJ2ZXIuc2V0QWN0aXZpdHkodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIHRoZSBhY3Rpdml0eS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBjbGllbnQgdHlwZSB0aGF0IHNob3VsZCBiZSBtYXBwZWQgdG8gdGhpcyBhY3Rpdml0eS5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHZhbCAtIFRoZSBjbGllbnQgdHlwZShzKSBvbiB3aGljaCB0aGUgYWN0aXZpdHlcbiAgICogIHNob3VsZCBiZSBtYXBwZWRcbiAgICovXG4gIGFkZENsaWVudFR5cGUodmFsdWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpXG4gICAgICAgIHZhbHVlID0gW3ZhbHVlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGNsaWVudCB0eXBlcyB0byBjdXJyZW50IGFjdGl2aXR5XG4gICAgdmFsdWUuZm9yRWFjaCgoY2xpZW50VHlwZSkgPT4ge1xuICAgICAgdGhpcy5jbGllbnRUeXBlcy5hZGQoY2xpZW50VHlwZSk7XG4gICAgfSk7XG5cbiAgICAvLyBwcm9wYWdhdGUgdmFsdWUgdG8gcmVxdWlyZWQgYWN0aXZpdGllc1xuICAgIHRoaXMucmVxdWlyZWRBY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiB7XG4gICAgICBhY3Rpdml0eS5hZGRDbGllbnRUeXBlKHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIGdpdmVuIGFjdGl2aXR5IGFzIGEgcmVxdWlyZW1lbnQgZm9yIHRoZSBjdXJyZW50IGFjdGl2aXR5LlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5BY3Rpdml0eX0gYWN0aXZpdHlcbiAgICovXG4gIGFkZFJlcXVpcmVkQWN0aXZpdHkoYWN0aXZpdHkpIHtcbiAgICB0aGlzLnJlcXVpcmVkQWN0aXZpdGllcy5hZGQoYWN0aXZpdHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGEgc2VydmljZS4gVGhlIHJlcXVpcmVkIHNlcnZpY2UgaXMgYWRkZWQgdG8gdGhlIGByZXF1aXJlZEFjdGl2aXRpZXNgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gU29tZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgdGhpcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBiZSBpbXBsZW1lbnRlZCBieSBhY3Rpdml0aWVzLiBBcyBwYXJ0IG9mIGFuIGFjdGl2aXR5XG4gICAqIGxpZmVjeWNsZSwgdGhlIG1ldGhvZCBzaG91bGQgZGVmaW5lIHRoZSBiZWhhdmlvciBvZiB0aGUgYWN0aXZpdHkgd2hlbiBzdGFydGVkXG4gICAqIChlLmcuIGJpbmRpbmcgbGlzdGVuZXJzKS4gV2hlbiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQsIGFsbCBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICogc2hvdWxkIGJlIGRlZmluZWQuXG4gICAqIFRoZSBtZXRob2QgaXMgYXV0b21hdGljYWxseSBjYWxsZWQgYnkgdGhlIHNlcnZlciBvbiBzdGFydHVwLlxuICAgKi9cbiAgc3RhcnQoKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgYGNsaWVudGAgY29ubmVjdHMgdG8gdGhlIHNlcnZlci4gVGhpcyBtZXRob2Qgc2hvdWxkIGhhbmRsZVxuICAgKiB0aGUgcGFydGljdWxhciBsb2dpYyBvZiB0aGUgYWN0aXZpdHkgb24gdGhlIHNlcnZlciBzaWRlIGFjY29yZGluZyB0byB0aGVcbiAgICogY29ubmVjdGVkIGNsaWVudCAoZS5nLiBhZGRpbmcgc29ja2V0IGxpc3RlbmVycykuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNsaWVudH0gY2xpZW50XG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIHNldHVwIGFuIG9iamVjdFxuICAgIGNsaWVudC5hY3Rpdml0aWVzW3RoaXMuaWRdID0ge307XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBgY2xpZW50YCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuIFRoaXMgbWV0aG9kXG4gICAqIHNob3VsZCBoYW5kbGUgdGhlIHBhcnRpY3VsYXIgbG9naWMgb2YgdGhlIGFjdGl2aXR5IG9uIHRoZSBzZXJ2ZXIgc2lkZSB3aGVuXG4gICAqIGEgY2xpZW50IGRpc2Nvbm5lY3QgKGUuZy4gcmVtb3Zpbmcgc29ja2V0IGxpc3RlbmVycykuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNsaWVudH0gY2xpZW50XG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIGRlbGV0ZSBjbGllbnQuYWN0aXZpdGllc1t0aGlzLmlkXSAvLyBtYXliZSBuZWVkZWQgYnkgb3RoZXIgYWN0aXZpdGllc1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiB0byBhIHdlYiBzb2NrZXQgbWVzc2FnZSBmcm9tIGEgZ2l2ZW4gY2xpZW50LlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DbGllbnR9IGNsaWVudCAtIENsaWVudCB0aGF0IG11c3QgbGlzdGVuIHRvIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIENoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZFxuICAgKiAgd2l0aCB0aGUgYWN0aXZpdHkncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2xpZW50LCBjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5pZH06JHtjaGFubmVsfWA7XG4gICAgc29ja2V0cy5yZWNlaXZlKGNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgd2ViIHNvY2tldCBtZXNzYWdlIHRvIGEgZ2l2ZW4gY2xpZW50LlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DbGllbnR9IGNsaWVudCAtIENsaWVudCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIENoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZFxuICAgKiB3aXRoIHRoZSBhY3Rpdml0eSdzIGlkOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLnNlbmQoY2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIG1lc3NhZ2UgdG8gYWxsIGNsaWVudCBvZiBnaXZlbiBgY2xpZW50VHlwZWAocykuXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5PFN0cmluZz58bnVsbH0gY2xpZW50VHlwZSAtIFRoZSBgY2xpZW50VHlwZWAocykgdGhhdCBzaG91bGRcbiAgICogIHJlY2VpdmUgdGhlIG1lc3NhZ2UuIElmIGBudWxsYCwgdGhlIG1lc3NhZ2UgaXMgc2VuZCB0byBhbGwgY2xpZW50cy5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50fSBleGNsdWRlQ2xpZW50IC0gQ2xpZW50IHRvIHNob3VsZFxuICAgKiAgbm90IHJlY2VpdmUgdGhlIG1lc3NhZ2UgKHR5cGljYWxseSB0aGUgb3JpZ2luYWwgc2VuZGVyIG9mIHRoZSBtZXNzYWdlKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBDaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWRcbiAgICogd2l0aCB0aGUgYWN0aXZpdHkncyBpZDogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBicm9hZGNhc3QoY2xpZW50VHlwZSwgZXhjbHVkZUNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5pZH06JHtjaGFubmVsfWA7XG4gICAgc29ja2V0cy5icm9hZGNhc3QoY2xpZW50VHlwZSwgZXhjbHVkZUNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIC4uLmFyZ3MpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFjdGl2aXR5O1xuIl19