'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _Process2 = require('./Process');

var _Process3 = _interopRequireDefault(_Process2);

var _Signal = require('../../utils/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _SignalAll = require('../../utils/SignalAll');

var _SignalAll2 = _interopRequireDefault(_SignalAll);

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

var _View = require('../views/View');

var _View2 = _interopRequireDefault(_View);

var _viewManager = require('./viewManager');

var _viewManager2 = _interopRequireDefault(_viewManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Internal base class for services and scenes. Basically a process with view
 * and optionnal network abilities.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Process
 */
var Activity = function (_Process) {
  (0, _inherits3.default)(Activity, _Process);

  /**
   * @param {String} id - Id of the activity.
   * @param {Boolean} hasNetwork - Define if the activity needs a socket
   *  connection or not.
   */
  function Activity(id) {
    var hasNetwork = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    (0, _classCallCheck3.default)(this, Activity);

    /**
     * If `true`, defines if the activity has already started once.
     * @type {Boolean}
     * @name hasStarted
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (Activity.__proto__ || (0, _getPrototypeOf2.default)(Activity)).call(this, id));

    _this.hasStarted = false;

    /**
     * Defines if the activity needs a connection to the server.
     * @type {Boolean}
     * @name hasNetwork
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    _this.hasNetwork = !!hasNetwork;

    // register as a networked service, setup the socket connection
    if (_this.hasNetwork) _socket2.default.required = true;

    /**
     * Options of the activity.
     * @type {Object}
     * @name options
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    _this.options = { viewPriority: 0 };

    /**
     * View of the activity.
     * @type {module:soundworks/client.View}
     * @name view
     * @instance
     * @memberof module:soundworks/client.Activity
     * @private
     */
    _this._view = null;

    /**
     * Define which signal the `Activity` requires to start.
     * @private
     */
    _this.requiredSignals = new _SignalAll2.default();

    _this.send = _this.send.bind(_this);
    _this.sendVolatile = _this.sendVolatile.bind(_this);
    _this.receive = _this.receive.bind(_this);
    _this.removeListener = _this.removeListener.bind(_this);
    return _this;
  }

  /**
   * Interface method to implement in child classes.
   * Define what to do when a service is required by an `Activity`.
   */


  (0, _createClass3.default)(Activity, [{
    key: 'require',
    value: function require() {}

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
     * Configure the activity with the given options.
     * @param {Object} options
     */

  }, {
    key: 'configure',
    value: function configure(options) {
      (0, _assign2.default)(this.options, options);
    }

    /**
     * Set the view of service.
     *
     * @param {Object} view - any object compliant with the view interface.
     */

  }, {
    key: 'show',


    /**
     * Request the view manager to display the view. The call of this method
     * doesn't guarantee a synchronized rendering or any rendering at all as the
     * view manager decides which view to display based on their priority.
     *
     * @return {Promise} - a promise that resolves when the view is actually
     *  displayed in the application.
     */
    value: function show() {
      return _viewManager2.default.register(this._view, this.options.viewPriority);
    }

    /**
     * Hide the view of the activity if it owns one.
     */

  }, {
    key: 'hide',
    value: function hide() {
      _viewManager2.default.remove(this._view);
    }

    /**
     * Send a web socket message to the server on a given channel.
     *
     * @param {String} channel - The channel of the message (is automatically
     *  namespaced with the activity's id: `${this.id}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */

  }, {
    key: 'send',
    value: function send(channel) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      _socket2.default.send.apply(_socket2.default, [this.id + ':' + channel].concat(args));
    }

    /**
     * Send a web socket message to the server on a given channel.
     *
     * @param {String} channel - The channel of the message (is automatically
     *  namespaced with the activity's id: `${this.id}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */

  }, {
    key: 'sendVolatile',
    value: function sendVolatile(channel) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      _socket2.default.sendVolatile.apply(_socket2.default, [this.id + ':' + channel].concat(args));
    }

    /**
     * Listen to web socket messages from the server on a given channel.
     *
     * @param {String} channel - The channel of the message (is automatically
     *  namespaced with the activity's id: `${this.id}:channel`).
     * @param {Function} callback - The callback to execute when a message is received.
     */

  }, {
    key: 'receive',
    value: function receive(channel, callback) {
      _socket2.default.receive(this.id + ':' + channel, callback);
    }

    /**
     * Stop listening for messages from the server on a given channel.
     *
     * @param {String} channel - The channel of the message (is automatically
     *  namespaced with the activity's id: `${this.id}:channel`).
     * @param {Function} callback - The callback to remove from the stack.
     */

  }, {
    key: 'stopReceiving',
    value: function stopReceiving(channel, callback) {
      _socket2.default.removeListener(this.id + ':' + channel, callback);
    }
  }, {
    key: 'view',
    set: function set(view) {
      this._view = view;
    },
    get: function get() {
      return this._view;
    }
  }]);
  return Activity;
}(_Process3.default);

exports.default = Activity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGl2aXR5LmpzIl0sIm5hbWVzIjpbIkFjdGl2aXR5IiwiaWQiLCJoYXNOZXR3b3JrIiwiaGFzU3RhcnRlZCIsInNvY2tldCIsInJlcXVpcmVkIiwib3B0aW9ucyIsInZpZXdQcmlvcml0eSIsIl92aWV3IiwicmVxdWlyZWRTaWduYWxzIiwiU2lnbmFsQWxsIiwic2VuZCIsImJpbmQiLCJzZW5kVm9sYXRpbGUiLCJyZWNlaXZlIiwicmVtb3ZlTGlzdGVuZXIiLCJzaWduYWwiLCJhZGQiLCJ2aWV3TWFuYWdlciIsInJlZ2lzdGVyIiwicmVtb3ZlIiwiY2hhbm5lbCIsImFyZ3MiLCJjYWxsYmFjayIsInZpZXciLCJQcm9jZXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBOzs7Ozs7O0lBT01BLFE7OztBQUNKOzs7OztBQUtBLG9CQUFZQyxFQUFaLEVBQW1DO0FBQUEsUUFBbkJDLFVBQW1CLHVFQUFOLElBQU07QUFBQTs7QUFHakM7Ozs7Ozs7QUFIaUMsMElBQzNCRCxFQUQyQjs7QUFVakMsVUFBS0UsVUFBTCxHQUFrQixLQUFsQjs7QUFFQTs7Ozs7OztBQU9BLFVBQUtELFVBQUwsR0FBa0IsQ0FBQyxDQUFDQSxVQUFwQjs7QUFFQTtBQUNBLFFBQUksTUFBS0EsVUFBVCxFQUNFRSxpQkFBT0MsUUFBUCxHQUFrQixJQUFsQjs7QUFFRjs7Ozs7OztBQU9BLFVBQUtDLE9BQUwsR0FBZSxFQUFFQyxjQUFjLENBQWhCLEVBQWY7O0FBRUE7Ozs7Ozs7O0FBUUEsVUFBS0MsS0FBTCxHQUFhLElBQWI7O0FBRUE7Ozs7QUFJQSxVQUFLQyxlQUFMLEdBQXVCLElBQUlDLG1CQUFKLEVBQXZCOztBQUVBLFVBQUtDLElBQUwsR0FBWSxNQUFLQSxJQUFMLENBQVVDLElBQVYsT0FBWjtBQUNBLFVBQUtDLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQkQsSUFBbEIsT0FBcEI7QUFDQSxVQUFLRSxPQUFMLEdBQWUsTUFBS0EsT0FBTCxDQUFhRixJQUFiLE9BQWY7QUFDQSxVQUFLRyxjQUFMLEdBQXNCLE1BQUtBLGNBQUwsQ0FBb0JILElBQXBCLE9BQXRCO0FBckRpQztBQXNEbEM7O0FBRUQ7Ozs7Ozs7OzhCQUlVLENBQUU7O0FBRVo7Ozs7Ozs7Ozs0QkFNUUksTSxFQUFRO0FBQ2QsV0FBS1AsZUFBTCxDQUFxQlEsR0FBckIsQ0FBeUJELE1BQXpCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OEJBSVVWLE8sRUFBUztBQUNqQiw0QkFBYyxLQUFLQSxPQUFuQixFQUE0QkEsT0FBNUI7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQWFBOzs7Ozs7OzsyQkFRTztBQUNMLGFBQU9ZLHNCQUFZQyxRQUFaLENBQXFCLEtBQUtYLEtBQTFCLEVBQWlDLEtBQUtGLE9BQUwsQ0FBYUMsWUFBOUMsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7MkJBR087QUFDTFcsNEJBQVlFLE1BQVosQ0FBbUIsS0FBS1osS0FBeEI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozt5QkFPS2EsTyxFQUFrQjtBQUFBLHdDQUFOQyxJQUFNO0FBQU5BLFlBQU07QUFBQTs7QUFDckJsQix1QkFBT08sSUFBUCwwQkFBZSxLQUFLVixFQUFwQixTQUEwQm9CLE9BQTFCLFNBQXdDQyxJQUF4QztBQUNEOztBQUVEOzs7Ozs7Ozs7O2lDQU9hRCxPLEVBQWtCO0FBQUEseUNBQU5DLElBQU07QUFBTkEsWUFBTTtBQUFBOztBQUM3QmxCLHVCQUFPUyxZQUFQLDBCQUF1QixLQUFLWixFQUE1QixTQUFrQ29CLE9BQWxDLFNBQWdEQyxJQUFoRDtBQUNEOztBQUVEOzs7Ozs7Ozs7OzRCQU9RRCxPLEVBQVNFLFEsRUFBVTtBQUN6Qm5CLHVCQUFPVSxPQUFQLENBQWtCLEtBQUtiLEVBQXZCLFNBQTZCb0IsT0FBN0IsRUFBd0NFLFFBQXhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7a0NBT2NGLE8sRUFBU0UsUSxFQUFVO0FBQy9CbkIsdUJBQU9XLGNBQVAsQ0FBeUIsS0FBS2QsRUFBOUIsU0FBb0NvQixPQUFwQyxFQUErQ0UsUUFBL0M7QUFDRDs7O3NCQXJFUUMsSSxFQUFNO0FBQ2IsV0FBS2hCLEtBQUwsR0FBYWdCLElBQWI7QUFDRCxLO3dCQUVVO0FBQ1QsYUFBTyxLQUFLaEIsS0FBWjtBQUNEOzs7RUFqR29CaUIsaUI7O2tCQW1LUnpCLFEiLCJmaWxlIjoiQWN0aXZpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvY2VzcyBmcm9tICcuL1Byb2Nlc3MnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuLi8uLi91dGlscy9TaWduYWwnO1xuaW1wb3J0IFNpZ25hbEFsbCBmcm9tICcuLi8uLi91dGlscy9TaWduYWxBbGwnO1xuaW1wb3J0IHNvY2tldCBmcm9tICcuL3NvY2tldCc7XG5pbXBvcnQgVmlldyBmcm9tICcuLi92aWV3cy9WaWV3JztcbmltcG9ydCB2aWV3TWFuYWdlciBmcm9tICcuL3ZpZXdNYW5hZ2VyJztcblxuXG4vKipcbiAqIEludGVybmFsIGJhc2UgY2xhc3MgZm9yIHNlcnZpY2VzIGFuZCBzY2VuZXMuIEJhc2ljYWxseSBhIHByb2Nlc3Mgd2l0aCB2aWV3XG4gKiBhbmQgb3B0aW9ubmFsIG5ldHdvcmsgYWJpbGl0aWVzLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleHRlbmRzIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Qcm9jZXNzXG4gKi9cbmNsYXNzIEFjdGl2aXR5IGV4dGVuZHMgUHJvY2VzcyB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBJZCBvZiB0aGUgYWN0aXZpdHkuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gaGFzTmV0d29yayAtIERlZmluZSBpZiB0aGUgYWN0aXZpdHkgbmVlZHMgYSBzb2NrZXRcbiAgICogIGNvbm5lY3Rpb24gb3Igbm90LlxuICAgKi9cbiAgY29uc3RydWN0b3IoaWQsIGhhc05ldHdvcmsgPSB0cnVlKSB7XG4gICAgc3VwZXIoaWQpO1xuXG4gICAgLyoqXG4gICAgICogSWYgYHRydWVgLCBkZWZpbmVzIGlmIHRoZSBhY3Rpdml0eSBoYXMgYWxyZWFkeSBzdGFydGVkIG9uY2UuXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG5hbWUgaGFzU3RhcnRlZFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLmhhc1N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgaWYgdGhlIGFjdGl2aXR5IG5lZWRzIGEgY29ubmVjdGlvbiB0byB0aGUgc2VydmVyLlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBuYW1lIGhhc05ldHdvcmtcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFjdGl2aXR5XG4gICAgICovXG4gICAgdGhpcy5oYXNOZXR3b3JrID0gISFoYXNOZXR3b3JrO1xuXG4gICAgLy8gcmVnaXN0ZXIgYXMgYSBuZXR3b3JrZWQgc2VydmljZSwgc2V0dXAgdGhlIHNvY2tldCBjb25uZWN0aW9uXG4gICAgaWYgKHRoaXMuaGFzTmV0d29yaylcbiAgICAgIHNvY2tldC5yZXF1aXJlZCA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIG9mIHRoZSBhY3Rpdml0eS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIG9wdGlvbnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFjdGl2aXR5XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0geyB2aWV3UHJpb3JpdHk6IDAgfTtcblxuICAgIC8qKlxuICAgICAqIFZpZXcgb2YgdGhlIGFjdGl2aXR5LlxuICAgICAqIEB0eXBlIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld31cbiAgICAgKiBAbmFtZSB2aWV3XG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BY3Rpdml0eVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fdmlldyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmUgd2hpY2ggc2lnbmFsIHRoZSBgQWN0aXZpdHlgIHJlcXVpcmVzIHRvIHN0YXJ0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMgPSBuZXcgU2lnbmFsQWxsKCk7XG5cbiAgICB0aGlzLnNlbmQgPSB0aGlzLnNlbmQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNlbmRWb2xhdGlsZSA9IHRoaXMuc2VuZFZvbGF0aWxlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWNlaXZlID0gdGhpcy5yZWNlaXZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lciA9IHRoaXMucmVtb3ZlTGlzdGVuZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGltcGxlbWVudCBpbiBjaGlsZCBjbGFzc2VzLlxuICAgKiBEZWZpbmUgd2hhdCB0byBkbyB3aGVuIGEgc2VydmljZSBpcyByZXF1aXJlZCBieSBhbiBgQWN0aXZpdHlgLlxuICAgKi9cbiAgcmVxdWlyZSgpIHt9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHNpZ25hbCB0byB0aGUgcmVxdWlyZWQgc2lnbmFscyBpbiBvcmRlciBmb3IgdGhlIGBTY2VuZWAgaW5zdGFuY2VcbiAgICogdG8gc3RhcnQuXG4gICAqIEBwYXJhbSB7U2lnbmFsfSBzaWduYWwgLSBUaGUgc2lnbmFsIHRoYXQgbXVzdCBiZSB3YWl0ZWQgZm9yLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgd2FpdEZvcihzaWduYWwpIHtcbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGQoc2lnbmFsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIGFjdGl2aXR5IHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHZpZXcgb2Ygc2VydmljZS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHZpZXcgLSBhbnkgb2JqZWN0IGNvbXBsaWFudCB3aXRoIHRoZSB2aWV3IGludGVyZmFjZS5cbiAgICovXG4gIHNldCB2aWV3KHZpZXcpIHtcbiAgICB0aGlzLl92aWV3ID0gdmlldztcbiAgfVxuXG4gIGdldCB2aWV3KCkge1xuICAgIHJldHVybiB0aGlzLl92aWV3O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdGhlIHZpZXcgbWFuYWdlciB0byBkaXNwbGF5IHRoZSB2aWV3LiBUaGUgY2FsbCBvZiB0aGlzIG1ldGhvZFxuICAgKiBkb2Vzbid0IGd1YXJhbnRlZSBhIHN5bmNocm9uaXplZCByZW5kZXJpbmcgb3IgYW55IHJlbmRlcmluZyBhdCBhbGwgYXMgdGhlXG4gICAqIHZpZXcgbWFuYWdlciBkZWNpZGVzIHdoaWNoIHZpZXcgdG8gZGlzcGxheSBiYXNlZCBvbiB0aGVpciBwcmlvcml0eS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSB2aWV3IGlzIGFjdHVhbGx5XG4gICAqICBkaXNwbGF5ZWQgaW4gdGhlIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgc2hvdygpIHtcbiAgICByZXR1cm4gdmlld01hbmFnZXIucmVnaXN0ZXIodGhpcy5fdmlldywgdGhpcy5vcHRpb25zLnZpZXdQcmlvcml0eSk7XG4gIH1cblxuICAvKipcbiAgICogSGlkZSB0aGUgdmlldyBvZiB0aGUgYWN0aXZpdHkgaWYgaXQgb3ducyBvbmUuXG4gICAqL1xuICBoaWRlKCkge1xuICAgIHZpZXdNYW5hZ2VyLnJlbW92ZSh0aGlzLl92aWV3KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgd2ViIHNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgb24gYSBnaXZlbiBjaGFubmVsLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5XG4gICAqICBuYW1lc3BhY2VkIHdpdGggdGhlIGFjdGl2aXR5J3MgaWQ6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgc29ja2V0LnNlbmQoYCR7dGhpcy5pZH06JHtjaGFubmVsfWAsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSB3ZWIgc29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBvbiBhIGdpdmVuIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHlcbiAgICogIG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBpZDogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kVm9sYXRpbGUoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIHNvY2tldC5zZW5kVm9sYXRpbGUoYCR7dGhpcy5pZH06JHtjaGFubmVsfWAsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiB0byB3ZWIgc29ja2V0IG1lc3NhZ2VzIGZyb20gdGhlIHNlcnZlciBvbiBhIGdpdmVuIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHlcbiAgICogIG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBpZDogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHNvY2tldC5yZWNlaXZlKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgZm9yIG1lc3NhZ2VzIGZyb20gdGhlIHNlcnZlciBvbiBhIGdpdmVuIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHlcbiAgICogIG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBpZDogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byByZW1vdmUgZnJvbSB0aGUgc3RhY2suXG4gICAqL1xuICBzdG9wUmVjZWl2aW5nKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWN0aXZpdHk7XG4iXX0=