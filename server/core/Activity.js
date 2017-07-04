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
     * Stop listening for messages from the server on a given channel.
     *
     * @param {module:soundworks/server.Client} client - Client that must listen to the message.
     * @param {String} channel - The channel of the message (is automatically
     *  namespaced with the activity's id: `${this.id}:channel`).
     * @param {Function} callback - The callback to remove from the stack.
     */

  }, {
    key: 'stopReceiving',
    value: function stopReceiving(client, channel, callback) {
      _sockets2.default.removeListener(client, this.id + ':' + channel, callback);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGl2aXR5LmpzIl0sIm5hbWVzIjpbIkFjdGl2aXR5IiwiaWQiLCJvcHRpb25zIiwiY2xpZW50VHlwZXMiLCJyZXF1aXJlZEFjdGl2aXRpZXMiLCJzZXRBY3Rpdml0eSIsInN0YXJ0IiwiYmluZCIsInJlcXVpcmVkU2lnbmFscyIsImFkZE9ic2VydmVyIiwid2FpdEZvciIsInNpZ25hbHMiLCJ0eXBlIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiZm9yRWFjaCIsImNsaWVudFR5cGUiLCJhZGQiLCJhY3Rpdml0eSIsImFkZENsaWVudFR5cGVzIiwic2lnbmFsIiwiaW5zdGFuY2UiLCJyZXF1aXJlIiwiYWRkUmVxdWlyZWRBY3Rpdml0eSIsInJlYWR5IiwiY2xpZW50IiwiYWN0aXZpdGllcyIsImNoYW5uZWwiLCJjYWxsYmFjayIsIm5hbWVzcGFjZWRDaGFubmVsIiwicmVjZWl2ZSIsInJlbW92ZUxpc3RlbmVyIiwiYXJncyIsInNlbmQiLCJleGNsdWRlQ2xpZW50IiwiYnJvYWRjYXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7O0FBRUE7Ozs7O0lBS01BLFE7OztBQUNKOzs7O0FBSUEsb0JBQVlDLEVBQVosRUFBZ0I7QUFBQTs7QUFHZDs7Ozs7Ozs7O0FBSGM7O0FBWWQsVUFBS0EsRUFBTCxHQUFVQSxFQUFWOztBQUVBOzs7Ozs7OztBQVFBLFVBQUtDLE9BQUwsR0FBZSxFQUFmOztBQUVBOzs7Ozs7O0FBT0EsVUFBS0MsV0FBTCxHQUFtQixtQkFBbkI7O0FBRUE7Ozs7O0FBS0EsVUFBS0Msa0JBQUwsR0FBMEIsbUJBQTFCOztBQUVBO0FBQ0EscUJBQU9DLFdBQVA7O0FBRUEsVUFBS0MsS0FBTCxHQUFhLE1BQUtBLEtBQUwsQ0FBV0MsSUFBWCxPQUFiOztBQUVBLFVBQUtDLGVBQUwsR0FBdUIseUJBQXZCO0FB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aWxlIjoiQWN0aXZpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc29ja2V0cyBmcm9tICcuL3NvY2tldHMnO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJy4uLy4uL3V0aWxzL0V2ZW50RW1pdHRlcic7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4uLy4uL3V0aWxzL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4uLy4uL3V0aWxzL1NpZ25hbEFsbCc7XG5cbi8vIEB0b2RvIC0gcmVtb3ZlIEV2ZW50RW1pdHRlciA/IChJbXBsZW1lbnQgb3VyIG93biBsaXN0ZW5lcnMpXG5cbi8qKlxuICogSW50ZXJuYWwgYmFzZSBjbGFzcyBmb3Igc2VydmljZXMgYW5kIHNjZW5lcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKi9cbmNsYXNzIEFjdGl2aXR5IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBJZCBvZiB0aGUgYWN0aXZpdHkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaWQgb2YgdGhlIGFjdGl2aXR5LiBUaGlzIHZhbHVlIG11c3QgbWF0Y2ggYSBjbGllbnQgc2lkZVxuICAgICAqIHtAbGluayBzcmMvY2xpZW50L2NvcmUvQWN0aXZpdHkuanN+QWN0aXZpdHl9IGlkIGluIG9yZGVyIHRvIGNyZWF0ZVxuICAgICAqIGEgbmFtZXNwYWNlZCBzb2NrZXQgY2hhbm5lbCBiZXR3ZWVuIHRoZSBhY3Rpdml0eSBhbmQgaXRzIGNsaWVudCBzaWRlIHBlZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAbmFtZSBpZFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLmlkID0gaWQ7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIG9mIHRoZSBhY3Rpdml0eS4gVGhlc2UgdmFsdWVzIHNob3VsZCBiZSB1cGRhdGVkIHdpdGggdGhlXG4gICAgICogYHRoaXMuY29uZmlndXJlYCBtZXRob2QuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbmFtZSBvcHRpb25zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5BY3Rpdml0eVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNsaWVudCB0eXBlcyBvbiB3aGljaCB0aGUgYWN0aXZpdHkgc2hvdWxkIGJlIG1hcHBlZC5cbiAgICAgKiBAdHlwZSB7U2V0fVxuICAgICAqIEBuYW1lIGNsaWVudFR5cGVzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5BY3Rpdml0eVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50VHlwZXMgPSBuZXcgU2V0KCk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBhY3Rpdml0aWVzIHRoZSBjdXJyZW50IGFjdGl2aXR5IG5lZWRzIGluIG9yZGVyIHRvIHdvcmsuXG4gICAgICogQHR5cGUge1NldH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVxdWlyZWRBY3Rpdml0aWVzID0gbmV3IFNldCgpO1xuXG4gICAgLy8gcmVnaXN0ZXIgYXMgZXhpc3RpbmcgdG8gdGhlIHNlcnZlclxuICAgIHNlcnZlci5zZXRBY3Rpdml0eSh0aGlzKTtcblxuICAgIHRoaXMuc3RhcnQgPSB0aGlzLnN0YXJ0LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscyA9IG5ldyBTaWduYWxBbGwoKTtcbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGRPYnNlcnZlcih0aGlzLnN0YXJ0KTtcbiAgICAvLyB3YWl0IGZvciBzZXJ2aWNlTWFuYWdlci5zdGFydFxuICAgIHRoaXMud2FpdEZvcihzZXJ2aWNlTWFuYWdlci5zaWduYWxzLnN0YXJ0KTtcblxuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB0aGUgYWN0aXZpdHkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgY2xpZW50IHR5cGUgdGhhdCBzaG91bGQgYmUgbWFwcGVkIHRvIHRoaXMgYWN0aXZpdHkuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSB2YWwgLSBUaGUgY2xpZW50IHR5cGUocykgb24gd2hpY2ggdGhlIGFjdGl2aXR5XG4gICAqICBzaG91bGQgYmUgbWFwcGVkXG4gICAqL1xuICBhZGRDbGllbnRUeXBlcyh0eXBlKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpXG4gICAgICAgIHR5cGUgPSBbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHR5cGUgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGNsaWVudCB0eXBlcyB0byBjdXJyZW50IGFjdGl2aXR5XG4gICAgdHlwZS5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICB0aGlzLmNsaWVudFR5cGVzLmFkZChjbGllbnRUeXBlKTtcbiAgICB9KTtcblxuICAgIC8vIHByb3BhZ2F0ZSB2YWx1ZSB0byByZXF1aXJlZCBhY3Rpdml0aWVzXG4gICAgdGhpcy5yZXF1aXJlZEFjdGl2aXRpZXMuZm9yRWFjaCgoYWN0aXZpdHkpID0+IHtcbiAgICAgIGFjdGl2aXR5LmFkZENsaWVudFR5cGVzKHR5cGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgZ2l2ZW4gYWN0aXZpdHkgYXMgYSByZXF1aXJlbWVudCBmb3IgdGhlIGN1cnJlbnQgYWN0aXZpdHkuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkFjdGl2aXR5fSBhY3Rpdml0eVxuICAgKi9cbiAgYWRkUmVxdWlyZWRBY3Rpdml0eShhY3Rpdml0eSkge1xuICAgIHRoaXMucmVxdWlyZWRBY3Rpdml0aWVzLmFkZChhY3Rpdml0eSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgc2lnbmFsIHRvIHRoZSByZXF1aXJlZCBzaWduYWxzIGluIG9yZGVyIGZvciB0aGUgYFNjZW5lYCBpbnN0YW5jZVxuICAgKiB0byBzdGFydC5cbiAgICogQHBhcmFtIHtTaWduYWx9IHNpZ25hbCAtIFRoZSBzaWduYWwgdGhhdCBtdXN0IGJlIHdhaXRlZCBmb3IuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB3YWl0Rm9yKHNpZ25hbCkge1xuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZChzaWduYWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGEgc2VydmljZS4gVGhlIHJlcXVpcmVkIHNlcnZpY2UgaXMgYWRkZWQgdG8gdGhlIGByZXF1aXJlZEFjdGl2aXRpZXNgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gU29tZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIC8vIG1ha2UgYWJzdHJhY3QsIHNob3VsZCBiZSBpbXBsZW1lbnRlZCBieSBjaGlsZCBjbGFzc2VzIChTY2VuZSBhbmQgU2VydmljZSlcbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIGNvbnN0IGluc3RhbmNlID0gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmFkZFJlcXVpcmVkQWN0aXZpdHkoaW5zdGFuY2UpO1xuICAgIHRoaXMud2FpdEZvcihpbnN0YW5jZS5zaWduYWxzLnJlYWR5KTtcblxuICAgIGluc3RhbmNlLmFkZENsaWVudFR5cGVzKHRoaXMuY2xpZW50VHlwZXMpO1xuXG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gYmUgaW1wbGVtZW50ZWQgYnkgYWN0aXZpdGllcy4gQXMgcGFydCBvZiBhbiBhY3Rpdml0eVxuICAgKiBsaWZlY3ljbGUsIHRoZSBtZXRob2Qgc2hvdWxkIGRlZmluZSB0aGUgYmVoYXZpb3Igb2YgdGhlIGFjdGl2aXR5IHdoZW4gc3RhcnRlZFxuICAgKiAoZS5nLiBiaW5kaW5nIGxpc3RlbmVycykuIFdoZW4gdGhpcyBtZXRob2QgaXMgY2FsbGVkLCBhbGwgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAqIHNob3VsZCBiZSBkZWZpbmVkLlxuICAgKiBUaGUgbWV0aG9kIGlzIGF1dG9tYXRpY2FsbHkgY2FsbGVkIGJ5IHRoZSBzZXJ2ZXIgb24gc3RhcnR1cC5cbiAgICovXG4gIHN0YXJ0KCkge31cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGBjbGllbnRgIGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuIFRoaXMgbWV0aG9kIHNob3VsZCBoYW5kbGVcbiAgICogdGhlIHBhcnRpY3VsYXIgbG9naWMgb2YgdGhlIGFjdGl2aXR5IG9uIHRoZSBzZXJ2ZXIgc2lkZSBhY2NvcmRpbmcgdG8gdGhlXG4gICAqIGNvbm5lY3RlZCBjbGllbnQgKGUuZy4gYWRkaW5nIHNvY2tldCBsaXN0ZW5lcnMpLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DbGllbnR9IGNsaWVudFxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBjbGllbnQuYWN0aXZpdGllc1t0aGlzLmlkXSA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgYGNsaWVudGAgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyLiBUaGlzIG1ldGhvZFxuICAgKiBzaG91bGQgaGFuZGxlIHRoZSBwYXJ0aWN1bGFyIGxvZ2ljIG9mIHRoZSBhY3Rpdml0eSBvbiB0aGUgc2VydmVyIHNpZGUgd2hlblxuICAgKiBhIGNsaWVudCBkaXNjb25uZWN0IChlLmcuIHJlbW92aW5nIHNvY2tldCBsaXN0ZW5lcnMpLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DbGllbnR9IGNsaWVudFxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICAvLyBkZWxldGUgY2xpZW50LmFjdGl2aXRpZXNbdGhpcy5pZF0gLy8gbWF5YmUgbmVlZGVkIGJ5IG90aGVyIGFjdGl2aXRpZXNcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gdG8gYSB3ZWIgc29ja2V0IG1lc3NhZ2UgZnJvbSBhIGdpdmVuIGNsaWVudC5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50fSBjbGllbnQgLSBDbGllbnQgdGhhdCBtdXN0IGxpc3RlbiB0byB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBDaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWRcbiAgICogIHdpdGggdGhlIGFjdGl2aXR5J3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNsaWVudCwgY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gO1xuICAgIHNvY2tldHMucmVjZWl2ZShjbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgZm9yIG1lc3NhZ2VzIGZyb20gdGhlIHNlcnZlciBvbiBhIGdpdmVuIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNsaWVudH0gY2xpZW50IC0gQ2xpZW50IHRoYXQgbXVzdCBsaXN0ZW4gdG8gdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHlcbiAgICogIG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBpZDogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byByZW1vdmUgZnJvbSB0aGUgc3RhY2suXG4gICAqL1xuICBzdG9wUmVjZWl2aW5nKGNsaWVudCwgY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBzb2NrZXRzLnJlbW92ZUxpc3RlbmVyKGNsaWVudCwgYCR7dGhpcy5pZH06JHtjaGFubmVsfWAsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgd2ViIHNvY2tldCBtZXNzYWdlIHRvIGEgZ2l2ZW4gY2xpZW50LlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DbGllbnR9IGNsaWVudCAtIENsaWVudCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIENoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZFxuICAgKiB3aXRoIHRoZSBhY3Rpdml0eSdzIGlkOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLmlkfToke2NoYW5uZWx9YDtcbiAgICBzb2NrZXRzLnNlbmQoY2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIG1lc3NhZ2UgdG8gYWxsIGNsaWVudCBvZiBnaXZlbiBgY2xpZW50VHlwZWAocykuXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5PFN0cmluZz58bnVsbH0gY2xpZW50VHlwZSAtIFRoZSBgY2xpZW50VHlwZWAocykgdGhhdCBzaG91bGRcbiAgICogIHJlY2VpdmUgdGhlIG1lc3NhZ2UuIElmIGBudWxsYCwgdGhlIG1lc3NhZ2UgaXMgc2VuZCB0byBhbGwgY2xpZW50cy5cbiAgICogIElmIGNsaWVudFR5cGUgaXMgYW4gYXJyYXksIHRoZSB0aGUgbWVzc2FnZSBpcyBzZW5kIHRvIGNsaWVudHMgb2YgdGhlIGdpdmVuIGNsaWVudCB0eXBlcy5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50fSBleGNsdWRlQ2xpZW50IC0gQ2xpZW50IHRvIHNob3VsZFxuICAgKiAgbm90IHJlY2VpdmUgdGhlIG1lc3NhZ2UgKHR5cGljYWxseSB0aGUgb3JpZ2luYWwgc2VuZGVyIG9mIHRoZSBtZXNzYWdlKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBDaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWRcbiAgICogd2l0aCB0aGUgYWN0aXZpdHkncyBpZDogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBicm9hZGNhc3QoY2xpZW50VHlwZSwgZXhjbHVkZUNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5pZH06JHtjaGFubmVsfWA7XG4gICAgc29ja2V0cy5icm9hZGNhc3QoY2xpZW50VHlwZSwgZXhjbHVkZUNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIC4uLmFyZ3MpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFjdGl2aXR5O1xuIl19