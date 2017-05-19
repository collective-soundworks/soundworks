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

var _EventEmitter2 = require('../../utils/EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var _Signal = require('../../utils/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _SignalAll = require('../../utils/SignalAll');

var _SignalAll2 = _interopRequireDefault(_SignalAll);

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

    _this.start = _this.start.bind(_this);

    _this.requiredSignals = new _SignalAll2.default();
    _this.requiredSignals.addObserver(_this.start);
    // wait for serviceManager.start
    _this.waitFor(_serviceManager2.default.signals.start);

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
    key: 'addClientTypes',
    value: function addClientTypes(type) {
      var _this2 = this;

      if (arguments.length === 1) {
        if (typeof type === 'string') type = [type];
      } else {
        type = (0, _from2.default)(arguments);
      }

      // add client types to current activity
      type.forEach(function (clientType) {
        _this2.clientTypes.add(clientType);
      });

      // propagate value to required activities
      this.requiredActivities.forEach(function (activity) {
        activity.addClientTypes(type);
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
     * Add a signal to the required signals in order for the `Scene` instance
     * to start.
     * @param {Signal} signal - The signal that must be waited for.
     * @private
     */

  }, {
    key: 'waitFor',
    value: function waitFor(signal) {
      this.requiredSignals.add(signal);
    }

    /**
     * Retrieve a service. The required service is added to the `requiredActivities`.
     * @param {String} id - The id of the service.
     * @param {Object} options - Some options to configure the service.
     */
    // make abstract, should be implemented by child classes (Scene and Service)

  }, {
    key: 'require',
    value: function require(id, options) {
      var instance = _serviceManager2.default.require(id, options);

      this.addRequiredActivity(instance);
      this.waitFor(instance.signals.ready);

      instance.addClientTypes(this.clientTypes);

      return instance;
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
     *  If clientType is an array, the the message is send to clients of the given client types.
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
}(_EventEmitter3.default);

exports.default = Activity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGl2aXR5LmpzIl0sIm5hbWVzIjpbIkFjdGl2aXR5IiwiaWQiLCJvcHRpb25zIiwiY2xpZW50VHlwZXMiLCJyZXF1aXJlZEFjdGl2aXRpZXMiLCJzZXRBY3Rpdml0eSIsInN0YXJ0IiwiYmluZCIsInJlcXVpcmVkU2lnbmFscyIsImFkZE9ic2VydmVyIiwid2FpdEZvciIsInNpZ25hbHMiLCJ0eXBlIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiZm9yRWFjaCIsImNsaWVudFR5cGUiLCJhZGQiLCJhY3Rpdml0eSIsImFkZENsaWVudFR5cGVzIiwic2lnbmFsIiwiaW5zdGFuY2UiLCJyZXF1aXJlIiwiYWRkUmVxdWlyZWRBY3Rpdml0eSIsInJlYWR5IiwiY2xpZW50IiwiYWN0aXZpdGllcyIsImNoYW5uZWwiLCJjYWxsYmFjayIsIm5hbWVzcGFjZWRDaGFubmVsIiwicmVjZWl2ZSIsImFyZ3MiLCJzZW5kIiwiZXhjbHVkZUNsaWVudCIsImJyb2FkY2FzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOztBQUVBOzs7OztJQUtNQSxROzs7QUFDSjs7OztBQUlBLG9CQUFZQyxFQUFaLEVBQWdCO0FBQUE7O0FBR2Q7Ozs7Ozs7OztBQUhjOztBQVlkLFVBQUtBLEVBQUwsR0FBVUEsRUFBVjs7QUFFQTs7Ozs7Ozs7QUFRQSxVQUFLQyxPQUFMLEdBQWUsRUFBZjs7QUFFQTs7Ozs7OztBQU9BLFVBQUtDLFdBQUwsR0FBbUIsbUJBQW5COztBQUVBOzs7OztBQUtBLFVBQUtDLGtCQUFMLEdBQTBCLG1CQUExQjs7QUFFQTtBQUNBLHFCQUFPQyxXQUFQOztBQUVBLFVBQUtDLEtBQUwsR0FBYSxNQUFLQSxLQUFMLENBQVdDLElBQVgsT0FBYjs7QUFFQSxVQUFLQyxlQUFMLEdBQXVCLHlCQUF2QjtBQUNBLFVBQUtBLGVBQUwsQ0FBcUJDLFdBQXJCLENBQWlDLE1BQUtILEtBQXRDO0FBQ0E7QUFDQSxVQUFLSSxPQUFMLENBQWEseUJBQWVDLE9BQWYsQ0FBdUJMLEtBQXBDOztBQWhEYztBQWtEZjs7QUFFRDs7Ozs7Ozs7OEJBSVVKLE8sRUFBUztBQUNqQiw0QkFBYyxLQUFLQSxPQUFuQixFQUE0QkEsT0FBNUI7QUFDRDs7QUFFRDs7Ozs7Ozs7O21DQU1lVSxJLEVBQU07QUFBQTs7QUFDbkIsVUFBSUMsVUFBVUMsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUMxQixZQUFJLE9BQU9GLElBQVAsS0FBZ0IsUUFBcEIsRUFDRUEsT0FBTyxDQUFDQSxJQUFELENBQVA7QUFDSCxPQUhELE1BR087QUFDTEEsZUFBTyxvQkFBV0MsU0FBWCxDQUFQO0FBQ0Q7O0FBRUQ7QUFDQUQsV0FBS0csT0FBTCxDQUFhLFVBQUNDLFVBQUQsRUFBZ0I7QUFDM0IsZUFBS2IsV0FBTCxDQUFpQmMsR0FBakIsQ0FBcUJELFVBQXJCO0FBQ0QsT0FGRDs7QUFJQTtBQUNBLFdBQUtaLGtCQUFMLENBQXdCVyxPQUF4QixDQUFnQyxVQUFDRyxRQUFELEVBQWM7QUFDNUNBLGlCQUFTQyxjQUFULENBQXdCUCxJQUF4QjtBQUNELE9BRkQ7QUFHRDs7QUFFRDs7Ozs7Ozs7d0NBS29CTSxRLEVBQVU7QUFDNUIsV0FBS2Qsa0JBQUwsQ0FBd0JhLEdBQXhCLENBQTRCQyxRQUE1QjtBQUNEOztBQUVEOzs7Ozs7Ozs7NEJBTVFFLE0sRUFBUTtBQUNkLFdBQUtaLGVBQUwsQ0FBcUJTLEdBQXJCLENBQXlCRyxNQUF6QjtBQUNEOztBQUVEOzs7OztBQUtBOzs7OzRCQUNRbkIsRSxFQUFJQyxPLEVBQVM7QUFDbkIsVUFBTW1CLFdBQVcseUJBQWVDLE9BQWYsQ0FBdUJyQixFQUF2QixFQUEyQkMsT0FBM0IsQ0FBakI7O0FBRUEsV0FBS3FCLG1CQUFMLENBQXlCRixRQUF6QjtBQUNBLFdBQUtYLE9BQUwsQ0FBYVcsU0FBU1YsT0FBVCxDQUFpQmEsS0FBOUI7O0FBRUFILGVBQVNGLGNBQVQsQ0FBd0IsS0FBS2hCLFdBQTdCOztBQUVBLGFBQU9rQixRQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7NEJBT1EsQ0FBRTs7QUFFVjs7Ozs7Ozs7OzRCQU1RSSxNLEVBQVE7QUFDZEEsYUFBT0MsVUFBUCxDQUFrQixLQUFLekIsRUFBdkIsSUFBNkIsRUFBN0I7QUFDRDs7QUFFRDs7Ozs7Ozs7OytCQU1Xd0IsTSxFQUFRLENBRWxCO0FBREM7OztBQUdGOzs7Ozs7Ozs7OzRCQU9RQSxNLEVBQVFFLE8sRUFBU0MsUSxFQUFVO0FBQ2pDLFVBQU1DLG9CQUF1QixLQUFLNUIsRUFBNUIsU0FBa0MwQixPQUF4QztBQUNBLHdCQUFRRyxPQUFSLENBQWdCTCxNQUFoQixFQUF3QkksaUJBQXhCLEVBQTJDRCxRQUEzQztBQUNEOztBQUVEOzs7Ozs7Ozs7O3lCQU9LSCxNLEVBQVFFLE8sRUFBa0I7QUFDN0IsVUFBTUUsb0JBQXVCLEtBQUs1QixFQUE1QixTQUFrQzBCLE9BQXhDOztBQUQ2Qix3Q0FBTkksSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBRTdCLHdCQUFRQyxJQUFSLDJCQUFhUCxNQUFiLEVBQXFCSSxpQkFBckIsU0FBMkNFLElBQTNDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7OzhCQVdVZixVLEVBQVlpQixhLEVBQWVOLE8sRUFBa0I7QUFDckQsVUFBTUUsb0JBQXVCLEtBQUs1QixFQUE1QixTQUFrQzBCLE9BQXhDOztBQURxRCx5Q0FBTkksSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBRXJELHdCQUFRRyxTQUFSLDJCQUFrQmxCLFVBQWxCLEVBQThCaUIsYUFBOUIsRUFBNkNKLGlCQUE3QyxTQUFtRUUsSUFBbkU7QUFDRDs7Ozs7a0JBR1kvQixRIiwiZmlsZSI6IkFjdGl2aXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNvY2tldHMgZnJvbSAnLi9zb2NrZXRzJztcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXInO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICcuLi8uLi91dGlscy9FdmVudEVtaXR0ZXInO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuLi8uLi91dGlscy9TaWduYWwnO1xuaW1wb3J0IFNpZ25hbEFsbCBmcm9tICcuLi8uLi91dGlscy9TaWduYWxBbGwnO1xuXG4vLyBAdG9kbyAtIHJlbW92ZSBFdmVudEVtaXR0ZXIgPyAoSW1wbGVtZW50IG91ciBvd24gbGlzdGVuZXJzKVxuXG4vKipcbiAqIEludGVybmFsIGJhc2UgY2xhc3MgZm9yIHNlcnZpY2VzIGFuZCBzY2VuZXMuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICovXG5jbGFzcyBBY3Rpdml0eSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gSWQgb2YgdGhlIGFjdGl2aXR5LlxuICAgKi9cbiAgY29uc3RydWN0b3IoaWQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGlkIG9mIHRoZSBhY3Rpdml0eS4gVGhpcyB2YWx1ZSBtdXN0IG1hdGNoIGEgY2xpZW50IHNpZGVcbiAgICAgKiB7QGxpbmsgc3JjL2NsaWVudC9jb3JlL0FjdGl2aXR5LmpzfkFjdGl2aXR5fSBpZCBpbiBvcmRlciB0byBjcmVhdGVcbiAgICAgKiBhIG5hbWVzcGFjZWQgc29ja2V0IGNoYW5uZWwgYmV0d2VlbiB0aGUgYWN0aXZpdHkgYW5kIGl0cyBjbGllbnQgc2lkZSBwZWVyLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQG5hbWUgaWRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkFjdGl2aXR5XG4gICAgICovXG4gICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ucyBvZiB0aGUgYWN0aXZpdHkuIFRoZXNlIHZhbHVlcyBzaG91bGQgYmUgdXBkYXRlZCB3aXRoIHRoZVxuICAgICAqIGB0aGlzLmNvbmZpZ3VyZWAgbWV0aG9kLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgb3B0aW9uc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjbGllbnQgdHlwZXMgb24gd2hpY2ggdGhlIGFjdGl2aXR5IHNob3VsZCBiZSBtYXBwZWQuXG4gICAgICogQHR5cGUge1NldH1cbiAgICAgKiBAbmFtZSBjbGllbnRUeXBlc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudFR5cGVzID0gbmV3IFNldCgpO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgYWN0aXZpdGllcyB0aGUgY3VycmVudCBhY3Rpdml0eSBuZWVkcyBpbiBvcmRlciB0byB3b3JrLlxuICAgICAqIEB0eXBlIHtTZXR9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnJlcXVpcmVkQWN0aXZpdGllcyA9IG5ldyBTZXQoKTtcblxuICAgIC8vIHJlZ2lzdGVyIGFzIGV4aXN0aW5nIHRvIHRoZSBzZXJ2ZXJcbiAgICBzZXJ2ZXIuc2V0QWN0aXZpdHkodGhpcyk7XG5cbiAgICB0aGlzLnN0YXJ0ID0gdGhpcy5zdGFydC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMgPSBuZXcgU2lnbmFsQWxsKCk7XG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkT2JzZXJ2ZXIodGhpcy5zdGFydCk7XG4gICAgLy8gd2FpdCBmb3Igc2VydmljZU1hbmFnZXIuc3RhcnRcbiAgICB0aGlzLndhaXRGb3Ioc2VydmljZU1hbmFnZXIuc2lnbmFscy5zdGFydCk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIGFjdGl2aXR5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGNsaWVudCB0eXBlIHRoYXQgc2hvdWxkIGJlIG1hcHBlZCB0byB0aGlzIGFjdGl2aXR5LlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gdmFsIC0gVGhlIGNsaWVudCB0eXBlKHMpIG9uIHdoaWNoIHRoZSBhY3Rpdml0eVxuICAgKiAgc2hvdWxkIGJlIG1hcHBlZFxuICAgKi9cbiAgYWRkQ2xpZW50VHlwZXModHlwZSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKVxuICAgICAgICB0eXBlID0gW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICB0eXBlID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIGFkZCBjbGllbnQgdHlwZXMgdG8gY3VycmVudCBhY3Rpdml0eVxuICAgIHR5cGUuZm9yRWFjaCgoY2xpZW50VHlwZSkgPT4ge1xuICAgICAgdGhpcy5jbGllbnRUeXBlcy5hZGQoY2xpZW50VHlwZSk7XG4gICAgfSk7XG5cbiAgICAvLyBwcm9wYWdhdGUgdmFsdWUgdG8gcmVxdWlyZWQgYWN0aXZpdGllc1xuICAgIHRoaXMucmVxdWlyZWRBY3Rpdml0aWVzLmZvckVhY2goKGFjdGl2aXR5KSA9PiB7XG4gICAgICBhY3Rpdml0eS5hZGRDbGllbnRUeXBlcyh0eXBlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIGdpdmVuIGFjdGl2aXR5IGFzIGEgcmVxdWlyZW1lbnQgZm9yIHRoZSBjdXJyZW50IGFjdGl2aXR5LlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5BY3Rpdml0eX0gYWN0aXZpdHlcbiAgICovXG4gIGFkZFJlcXVpcmVkQWN0aXZpdHkoYWN0aXZpdHkpIHtcbiAgICB0aGlzLnJlcXVpcmVkQWN0aXZpdGllcy5hZGQoYWN0aXZpdHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHNpZ25hbCB0byB0aGUgcmVxdWlyZWQgc2lnbmFscyBpbiBvcmRlciBmb3IgdGhlIGBTY2VuZWAgaW5zdGFuY2VcbiAgICogdG8gc3RhcnQuXG4gICAqIEBwYXJhbSB7U2lnbmFsfSBzaWduYWwgLSBUaGUgc2lnbmFsIHRoYXQgbXVzdCBiZSB3YWl0ZWQgZm9yLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgd2FpdEZvcihzaWduYWwpIHtcbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGQoc2lnbmFsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhIHNlcnZpY2UuIFRoZSByZXF1aXJlZCBzZXJ2aWNlIGlzIGFkZGVkIHRvIHRoZSBgcmVxdWlyZWRBY3Rpdml0aWVzYC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFNvbWUgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICAvLyBtYWtlIGFic3RyYWN0LCBzaG91bGQgYmUgaW1wbGVtZW50ZWQgYnkgY2hpbGQgY2xhc3NlcyAoU2NlbmUgYW5kIFNlcnZpY2UpXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBpbnN0YW5jZSA9IHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5hZGRSZXF1aXJlZEFjdGl2aXR5KGluc3RhbmNlKTtcbiAgICB0aGlzLndhaXRGb3IoaW5zdGFuY2Uuc2lnbmFscy5yZWFkeSk7XG5cbiAgICBpbnN0YW5jZS5hZGRDbGllbnRUeXBlcyh0aGlzLmNsaWVudFR5cGVzKTtcblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGJlIGltcGxlbWVudGVkIGJ5IGFjdGl2aXRpZXMuIEFzIHBhcnQgb2YgYW4gYWN0aXZpdHlcbiAgICogbGlmZWN5Y2xlLCB0aGUgbWV0aG9kIHNob3VsZCBkZWZpbmUgdGhlIGJlaGF2aW9yIG9mIHRoZSBhY3Rpdml0eSB3aGVuIHN0YXJ0ZWRcbiAgICogKGUuZy4gYmluZGluZyBsaXN0ZW5lcnMpLiBXaGVuIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCwgYWxsIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgKiBzaG91bGQgYmUgZGVmaW5lZC5cbiAgICogVGhlIG1ldGhvZCBpcyBhdXRvbWF0aWNhbGx5IGNhbGxlZCBieSB0aGUgc2VydmVyIG9uIHN0YXJ0dXAuXG4gICAqL1xuICBzdGFydCgpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBgY2xpZW50YCBjb25uZWN0cyB0byB0aGUgc2VydmVyLiBUaGlzIG1ldGhvZCBzaG91bGQgaGFuZGxlXG4gICAqIHRoZSBwYXJ0aWN1bGFyIGxvZ2ljIG9mIHRoZSBhY3Rpdml0eSBvbiB0aGUgc2VydmVyIHNpZGUgYWNjb3JkaW5nIHRvIHRoZVxuICAgKiBjb25uZWN0ZWQgY2xpZW50IChlLmcuIGFkZGluZyBzb2NrZXQgbGlzdGVuZXJzKS5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50fSBjbGllbnRcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgY2xpZW50LmFjdGl2aXRpZXNbdGhpcy5pZF0gPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGBjbGllbnRgIGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci4gVGhpcyBtZXRob2RcbiAgICogc2hvdWxkIGhhbmRsZSB0aGUgcGFydGljdWxhciBsb2dpYyBvZiB0aGUgYWN0aXZpdHkgb24gdGhlIHNlcnZlciBzaWRlIHdoZW5cbiAgICogYSBjbGllbnQgZGlzY29ubmVjdCAoZS5nLiByZW1vdmluZyBzb2NrZXQgbGlzdGVuZXJzKS5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50fSBjbGllbnRcbiAgICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgLy8gZGVsZXRlIGNsaWVudC5hY3Rpdml0aWVzW3RoaXMuaWRdIC8vIG1heWJlIG5lZWRlZCBieSBvdGhlciBhY3Rpdml0aWVzXG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuIHRvIGEgd2ViIHNvY2tldCBtZXNzYWdlIGZyb20gYSBnaXZlbiBjbGllbnQuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNsaWVudH0gY2xpZW50IC0gQ2xpZW50IHRoYXQgbXVzdCBsaXN0ZW4gdG8gdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkXG4gICAqICB3aXRoIHRoZSBhY3Rpdml0eSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjbGllbnQsIGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLnJlY2VpdmUoY2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSB3ZWIgc29ja2V0IG1lc3NhZ2UgdG8gYSBnaXZlbiBjbGllbnQuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNsaWVudH0gY2xpZW50IC0gQ2xpZW50IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkXG4gICAqIHdpdGggdGhlIGFjdGl2aXR5J3MgaWQ6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gO1xuICAgIHNvY2tldHMuc2VuZChjbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgbWVzc2FnZSB0byBhbGwgY2xpZW50IG9mIGdpdmVuIGBjbGllbnRUeXBlYChzKS5cbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXk8U3RyaW5nPnxudWxsfSBjbGllbnRUeXBlIC0gVGhlIGBjbGllbnRUeXBlYChzKSB0aGF0IHNob3VsZFxuICAgKiAgcmVjZWl2ZSB0aGUgbWVzc2FnZS4gSWYgYG51bGxgLCB0aGUgbWVzc2FnZSBpcyBzZW5kIHRvIGFsbCBjbGllbnRzLlxuICAgKiAgSWYgY2xpZW50VHlwZSBpcyBhbiBhcnJheSwgdGhlIHRoZSBtZXNzYWdlIGlzIHNlbmQgdG8gY2xpZW50cyBvZiB0aGUgZ2l2ZW4gY2xpZW50IHR5cGVzLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DbGllbnR9IGV4Y2x1ZGVDbGllbnQgLSBDbGllbnQgdG8gc2hvdWxkXG4gICAqICBub3QgcmVjZWl2ZSB0aGUgbWVzc2FnZSAodHlwaWNhbGx5IHRoZSBvcmlnaW5hbCBzZW5kZXIgb2YgdGhlIG1lc3NhZ2UpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIENoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZFxuICAgKiB3aXRoIHRoZSBhY3Rpdml0eSdzIGlkOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIGJyb2FkY2FzdChjbGllbnRUeXBlLCBleGNsdWRlQ2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLmJyb2FkY2FzdChjbGllbnRUeXBlLCBleGNsdWRlQ2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWN0aXZpdHk7XG4iXX0=