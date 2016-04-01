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
     * should be set. Also, if the activity relies on another service,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGl2aXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztJQVlNOzs7Ozs7OztBQUtKLFdBTEksUUFLSixDQUFZLEVBQVosRUFBZ0I7d0NBTFosVUFLWTs7Ozs7Ozs7Ozs2RkFMWixzQkFLWTs7QUFTZCxVQUFLLEVBQUwsR0FBVSxFQUFWOzs7Ozs7O0FBVGMsU0FnQmQsQ0FBSyxPQUFMLEdBQWUsRUFBZjs7Ozs7OztBQWhCYyxTQXVCZCxDQUFLLFdBQUwsR0FBbUIsbUJBQW5COzs7Ozs7O0FBdkJjLFNBOEJkLENBQUssa0JBQUwsR0FBMEIsbUJBQTFCOzs7QUE5QmMsb0JBaUNkLENBQU8sV0FBUCxRQWpDYzs7R0FBaEI7Ozs7Ozs7OzZCQUxJOzs4QkE2Q00sU0FBUztBQUNqQiw0QkFBYyxLQUFLLE9BQUwsRUFBYyxPQUE1QixFQURpQjs7Ozs7Ozs7Ozs7O2tDQVVMLE9BQU87OztBQUNuQixVQUFJLFVBQVUsTUFBVixLQUFxQixDQUFyQixFQUF3QjtBQUMxQixZQUFJLE9BQU8sS0FBUCxLQUFpQixRQUFqQixFQUNGLFFBQVEsQ0FBQyxLQUFELENBQVIsQ0FERjtPQURGLE1BR087QUFDTCxnQkFBUSxvQkFBVyxTQUFYLENBQVIsQ0FESztPQUhQOzs7QUFEbUIsV0FTbkIsQ0FBTSxPQUFOLENBQWMsVUFBQyxVQUFELEVBQWdCO0FBQzVCLGVBQUssV0FBTCxDQUFpQixHQUFqQixDQUFxQixVQUFyQixFQUQ0QjtPQUFoQixDQUFkOzs7QUFUbUIsVUFjbkIsQ0FBSyxrQkFBTCxDQUF3QixPQUF4QixDQUFnQyxVQUFDLFFBQUQsRUFBYztBQUM1QyxpQkFBUyxhQUFULENBQXVCLEtBQXZCLEVBRDRDO09BQWQsQ0FBaEMsQ0FkbUI7Ozs7Ozs7Ozs7O3dDQXdCRCxVQUFVO0FBQzVCLFdBQUssa0JBQUwsQ0FBd0IsR0FBeEIsQ0FBNEIsUUFBNUIsRUFENEI7Ozs7Ozs7Ozs7OzRCQVN0QixJQUFJLFNBQVM7QUFDbkIsYUFBTyx5QkFBZSxPQUFmLENBQXVCLEVBQXZCLEVBQTJCLElBQTNCLEVBQWlDLE9BQWpDLENBQVAsQ0FEbUI7Ozs7Ozs7Ozs7Ozs7OzRCQVliOzs7Ozs7Ozs7Ozs7NEJBU0EsUUFBUTs7QUFFZCxhQUFPLFVBQVAsQ0FBa0IsS0FBSyxFQUFMLENBQWxCLEdBQTZCLEVBQTdCLENBRmM7Ozs7Ozs7Ozs7Ozs7K0JBWUwsUUFBUTs7Ozs7Ozs7Ozs7Ozs0QkFVWCxRQUFRLFNBQVMsVUFBVTtBQUNqQyxVQUFNLG9CQUF1QixLQUFLLEVBQUwsU0FBVyxPQUFsQyxDQUQyQjtBQUVqQyx3QkFBUSxPQUFSLENBQWdCLE1BQWhCLEVBQXdCLGlCQUF4QixFQUEyQyxRQUEzQyxFQUZpQzs7Ozs7Ozs7Ozs7O3lCQVc5QixRQUFRLFNBQWtCO0FBQzdCLFVBQU0sb0JBQXVCLEtBQUssRUFBTCxTQUFXLE9BQWxDLENBRHVCOzt3Q0FBTjs7T0FBTTs7QUFFN0Isd0JBQVEsSUFBUiwyQkFBYSxRQUFRLDBCQUFzQixLQUEzQyxFQUY2Qjs7Ozs7Ozs7Ozs7OzhCQVdyQixZQUFZLGVBQWUsU0FBa0I7QUFDckQsVUFBTSxvQkFBdUIsS0FBSyxFQUFMLFNBQVcsT0FBbEMsQ0FEK0M7O3lDQUFOOztPQUFNOztBQUVyRCx3QkFBUSxTQUFSLDJCQUFrQixZQUFZLGVBQWUsMEJBQXNCLEtBQW5FLEVBRnFEOzs7U0F6Sm5EOzs7a0JBK0pTIiwiZmlsZSI6IkFjdGl2aXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNvY2tldHMgZnJvbSAnLi9zb2NrZXRzJztcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXInO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuLy8gQHRvZG8gLSByZW1vdmUgRXZlbnRFbWl0dGVyID8gKEltcGxlbWVudCBvdXIgb3duIGxpc3RlbmVycylcblxuLyoqXG4gKiBCYXNlIGNsYXNzIHVzZWQgdG8gY3JlYXRlIGFueSAqU291bmR3b3JrcyogQWN0aXZpdHkgb24gdGhlIHNlcnZlciBzaWRlLlxuICpcbiAqIFdoaWxlIHRoZSBzZXF1ZW5jZSBvZiB1c2VyIGludGVyYWN0aW9ucyBhbmQgZXhjaGFuZ2VzIGJldHdlZW4gY2xpZW50IGFuZCBzZXJ2ZXIgaXMgZGV0ZXJtaW5lZCBvbiB0aGUgY2xpZW50IHNpZGUsIHRoZSBzZXJ2ZXIgc2lkZSBhY3Rpdml0aWVzIGFyZSByZWFkeSB0byByZWNlaXZlIHJlcXVlc3RzIGZyb20gdGhlIGNvcnJlc3BvbmRpbmcgY2xpZW50IHNpZGUgYWN0aXZpdGllcyBhcyBzb29uIGFzIGEgY2xpZW50IGlzIGNvbm5lY3RlZCB0byB0aGUgc2VydmVyLlxuICpcbiAqIEVhY2ggYWN0aXZpdHkgc2hvdWxkIGhhdmUgYSBjb25uZWN0IGFuZCBhIGRpc2Nvbm5lY3QgbWV0aG9kLlxuICogQW55IGFjdGl2aXR5IG1hcHBlZCB0byB0aGUgdHlwZSBvZiBjbGllbnQgYCdjbGllbnRUeXBlJ2AgKHRoYW5rcyB0byB0aGUge0BsaW5rIHNlcnZlciNtYXB9IG1ldGhvZCkgY2FsbHMgaXRzIGNvbm5lY3QgbWV0aG9kIHdoZW4gc3VjaCBhIGNsaWVudCBjb25uZWN0cyB0byB0aGUgc2VydmVyLCBhbmQgaXRzIGRpc2Nvbm5lY3QgbWV0aG9kIHdoZW4gc3VjaCBhIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gKi9cbmNsYXNzIEFjdGl2aXR5IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIGFjdGl2aXR5LlxuICAgKi9cbiAgY29uc3RydWN0b3IoaWQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGlkIG9mIHRoZSBhY3Rpdml0eS4gVGhpcyB2YWx1ZSBtdXN0IG1hdGNoIGEgY2xpZW50IHNpZGVcbiAgICAgKiB7QGxpbmsgc3JjL2NsaWVudC9jb3JlL0FjdGl2aXR5LmpzfkFjdGl2aXR5fSBpZCBpbiBvcmRlciB0byBjcmVhdGVcbiAgICAgKiBhIG5hbWVzcGFjZWQgc29ja2V0IGNoYW5uZWwgYmV0d2VlbiB0aGUgYWN0aXZpdHkgYW5kIGl0cyBjbGllbnQgc2lkZSBwZWVyLlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ucyBvZiB0aGUgYWN0aXZpdHkuIFRoZXNlIHZhbHVlcyBzaG91bGQgYmUgdXBkYXRlZCB3aXRoIHRoZVxuICAgICAqIGB0aGlzLmNvbmZpZ3VyZWAgbWV0aG9kLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0ge307XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY2xpZW50IHR5cGVzIG9uIHdoaWNoIHRoZSBhY3Rpdml0eSBzaG91bGQgYmUgbWFwcGVkLlxuICAgICAqIEB0eXBlIHtTZXR9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudFR5cGVzID0gbmV3IFNldCgpO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgYWN0aXZpdGllcyB0aGUgY3VycmVudCBhY3Rpdml0eSBuZWVkcyBpbiBvcmRlciB0byB3b3JrLlxuICAgICAqIEB0eXBlIHtTZXR9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnJlcXVpcmVkQWN0aXZpdGllcyA9IG5ldyBTZXQoKTtcblxuICAgIC8vIHJlZ2lzdGVyIGFzIGV4aXN0aW5nIHRvIHRoZSBzZXJ2ZXJcbiAgICBzZXJ2ZXIuc2V0QWN0aXZpdHkodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIHRoZSBhY3Rpdml0eS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBjbGllbnQgdHlwZSB0aGF0IHNob3VsZCBiZSBtYXBwZWQgdG8gdGhpcyBhY3Rpdml0eS5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHZhbCAtIFRoZSBjbGllbnQgdHlwZShzKSBvbiB3aGljaCB0aGUgYWN0aXZpdHlcbiAgICogIHNob3VsZCBiZSBtYXBwZWRcbiAgICovXG4gIGFkZENsaWVudFR5cGUodmFsdWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpXG4gICAgICAgIHZhbHVlID0gW3ZhbHVlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGNsaWVudCB0eXBlcyB0byBjdXJyZW50IGFjdGl2aXR5XG4gICAgdmFsdWUuZm9yRWFjaCgoY2xpZW50VHlwZSkgPT4ge1xuICAgICAgdGhpcy5jbGllbnRUeXBlcy5hZGQoY2xpZW50VHlwZSk7XG4gICAgfSk7XG5cbiAgICAvLyBwcm9wYWdhdGUgdmFsdWUgdG8gcmVxdWlyZWQgYWN0aXZpdGllc1xuICAgIHRoaXMucmVxdWlyZWRBY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiB7XG4gICAgICBhY3Rpdml0eS5hZGRDbGllbnRUeXBlKHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIGdpdmVuIGFjdGl2aXR5IGFzIGEgcmVxdWlyZW1lbnQgZm9yIHRoZSBjdXJyZW50IGFjdGl2aXR5LlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdHlwZSB7QWN0aXZpdHl9IGFjdGl2aXR5XG4gICAqL1xuICBhZGRSZXF1aXJlZEFjdGl2aXR5KGFjdGl2aXR5KSB7XG4gICAgdGhpcy5yZXF1aXJlZEFjdGl2aXRpZXMuYWRkKGFjdGl2aXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhIHNlcnZpY2UuIFRoZSByZXF1aXJlZCBzZXJ2aWNlIGlzIGFkZGVkIHRvIHRoZSBgcmVxdWlyZWRBY3Rpdml0aWVzYC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFNvbWUgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIHRoaXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gYmUgaW1wbGVtZW50ZWQgYnkgYWN0aXZpdGllcy4gQXMgcGFydCBvZiBhbiBhY3Rpdml0eVxuICAgKiBsaWZlY3ljbGUsIHRoZSBtZXRob2Qgc2hvdWxkIGRlZmluZSB0aGUgYmVoYXZpb3Igb2YgdGhlIGFjdGl2aXR5IHdoZW4gc3RhcnRlZFxuICAgKiAoZS5nLiBiaW5kaW5nIGxpc3RlbmVycykuIFdoZW4gdGhpcyBtZXRob2QgaWQgY2FsbGVkLCBhbGwgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAqIHNob3VsZCBiZSBzZXQuIEFsc28sIGlmIHRoZSBhY3Rpdml0eSByZWxpZXMgb24gYW5vdGhlciBzZXJ2aWNlLFxuICAgKiB0aGlzIGRlcGVuZGVuY3kgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYXMgaW5zdGFuY2lhdGVkLlxuICAgKiBUaGUgbWV0aG9kIGlzIGF1dG9tYXRpY2FsbHkgY2FsbGVkIGJ5IHRoZSBzZXJ2ZXIgb24gc3RhcnR1cC5cbiAgICovXG4gIHN0YXJ0KCkge31cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGBjbGllbnRgIGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBoYW5kbGUgdGhlIGxvZ2ljIG9mIHRoZSBhY3Rpdml0eSBvbiB0aGUgc2VydmVyIHNpZGUuXG4gICAqIEZvciBpbnN0YW5jZSwgaXQgY2FuIHRha2UgY2FyZSBvZiB0aGUgY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBjbGllbnQgc2lkZSBhY3Rpdml0eSBieSBzZXR0aW5nIHVwIFdlYlNvY2tldCBtZXNzYWdlIGxpc3RlbmVycyBhbmQgc2VuZGluZyBXZWJTb2NrZXQgbWVzc2FnZXMsIG9yIGl0IGNhbiBhZGQgdGhlIGNsaWVudCB0byBhIGxpc3QgdG8ga2VlcCB0cmFjayBvZiBhbGwgdGhlIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IENvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIHNldHVwIGFuIG9iamVjdFxuICAgIGNsaWVudC5hY3Rpdml0aWVzW3RoaXMuaWRdID0ge307XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBgY2xpZW50YCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBoYW5kbGUgdGhlIGxvZ2ljIHdoZW4gdGhhdCBoYXBwZW5zLlxuICAgKiBGb3IgaW5zdGFuY2UsIGl0IGNhbiByZW1vdmUgdGhlIHNvY2tldCBtZXNzYWdlIGxpc3RlbmVycywgb3IgcmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgbGlzdCB0aGF0IGtlZXBzIHRyYWNrIG9mIHRoZSBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBEaXNjb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICAvLyBkZWxldGUgY2xpZW50LmFjdGl2aXRpZXNbdGhpcy5pZF0gLy8gbWF5YmUgbmVlZGVkIGJ5IG90aGVyIGFjdGl2aXRpZXNcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdGhhdCBtdXN0IGxpc3RlbiB0byB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIGFjdGl2aXR5J3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNsaWVudCwgY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gO1xuICAgIHNvY2tldHMucmVjZWl2ZShjbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgY2xpZW50LlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLnNlbmQoY2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIGFsbCBjbGllbnQgb2YgZ2l2ZW4gYGNsaWVudFR5cGVgIG9yIGBjbGllbnRUeXBlYHMuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBtZXNzYWdlIGlzIHNlbnQgdG8gYWxsIGNsaWVudHNcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGNsaWVudFR5cGUgLSBUaGUgYGNsaWVudFR5cGVgKHMpIHRoYXQgbXVzdCByZWNlaXZlIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIGJyb2FkY2FzdChjbGllbnRUeXBlLCBleGNsdWRlQ2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLmJyb2FkY2FzdChjbGllbnRUeXBlLCBleGNsdWRlQ2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWN0aXZpdHk7XG4iXX0=