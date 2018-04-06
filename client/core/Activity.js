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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGl2aXR5LmpzIl0sIm5hbWVzIjpbIkFjdGl2aXR5IiwiaWQiLCJoYXNOZXR3b3JrIiwiaGFzU3RhcnRlZCIsInJlcXVpcmVkIiwib3B0aW9ucyIsInZpZXdQcmlvcml0eSIsIl92aWV3IiwicmVxdWlyZWRTaWduYWxzIiwic2VuZCIsImJpbmQiLCJzZW5kVm9sYXRpbGUiLCJyZWNlaXZlIiwicmVtb3ZlTGlzdGVuZXIiLCJzaWduYWwiLCJhZGQiLCJyZWdpc3RlciIsInJlbW92ZSIsImNoYW5uZWwiLCJhcmdzIiwiY2FsbGJhY2siLCJ2aWV3Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBOzs7Ozs7O0lBT01BLFE7OztBQUNKOzs7OztBQUtBLG9CQUFZQyxFQUFaLEVBQW1DO0FBQUEsUUFBbkJDLFVBQW1CLHVFQUFOLElBQU07QUFBQTs7QUFHakM7Ozs7Ozs7QUFIaUMsMElBQzNCRCxFQUQyQjs7QUFVakMsVUFBS0UsVUFBTCxHQUFrQixLQUFsQjs7QUFFQTs7Ozs7OztBQU9BLFVBQUtELFVBQUwsR0FBa0IsQ0FBQyxDQUFDQSxVQUFwQjs7QUFFQTtBQUNBLFFBQUksTUFBS0EsVUFBVCxFQUNFLGlCQUFPRSxRQUFQLEdBQWtCLElBQWxCOztBQUVGOzs7Ozs7O0FBT0EsVUFBS0MsT0FBTCxHQUFlLEVBQUVDLGNBQWMsQ0FBaEIsRUFBZjs7QUFFQTs7Ozs7Ozs7QUFRQSxVQUFLQyxLQUFMLEdBQWEsSUFBYjs7QUFFQTs7OztBQUlBLFVBQUtDLGVBQUwsR0FBdUIseUJBQXZCOztBQUVBLFVBQUtDLElBQUwsR0FBWSxNQUFLQSxJQUFMLENBQVVDLElBQVYsT0FBWjtBQUNBLFVBQUtDLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQkQsSUFBbEIsT0FBcEI7QUFDQSxVQUFLRSxPQUFMLEdBQWUsTUFBS0EsT0FBTCxDQUFhRixJQUFiLE9BQWY7QUFDQSxVQUFLRyxjQUFMLEdBQXNCLE1BQUtBLGNBQUwsQ0FBb0JILElBQXBCLE9BQXRCO0FBckRpQztBQXNEbEM7O0FBRUQ7Ozs7Ozs7OzhCQUlVLENBQUU7O0FBRVo7Ozs7Ozs7Ozs0QkFNUUksTSxFQUFRO0FBQ2QsV0FBS04sZUFBTCxDQUFxQk8sR0FBckIsQ0FBeUJELE1BQXpCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OEJBSVVULE8sRUFBUztBQUNqQiw0QkFBYyxLQUFLQSxPQUFuQixFQUE0QkEsT0FBNUI7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQWFBOzs7Ozs7OzsyQkFRTztBQUNMLGFBQU8sc0JBQVlXLFFBQVosQ0FBcUIsS0FBS1QsS0FBMUIsRUFBaUMsS0FBS0YsT0FBTCxDQUFhQyxZQUE5QyxDQUFQO0FBQ0Q7O0FBRUQ7Ozs7OzsyQkFHTztBQUNMLDRCQUFZVyxNQUFaLENBQW1CLEtBQUtWLEtBQXhCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7eUJBT0tXLE8sRUFBa0I7QUFBQSx3Q0FBTkMsSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBQ3JCLHVCQUFPVixJQUFQLDBCQUFlLEtBQUtSLEVBQXBCLFNBQTBCaUIsT0FBMUIsU0FBd0NDLElBQXhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7aUNBT2FELE8sRUFBa0I7QUFBQSx5Q0FBTkMsSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBQzdCLHVCQUFPUixZQUFQLDBCQUF1QixLQUFLVixFQUE1QixTQUFrQ2lCLE9BQWxDLFNBQWdEQyxJQUFoRDtBQUNEOztBQUVEOzs7Ozs7Ozs7OzRCQU9RRCxPLEVBQVNFLFEsRUFBVTtBQUN6Qix1QkFBT1IsT0FBUCxDQUFrQixLQUFLWCxFQUF2QixTQUE2QmlCLE9BQTdCLEVBQXdDRSxRQUF4QztBQUNEOztBQUVEOzs7Ozs7Ozs7O2tDQU9jRixPLEVBQVNFLFEsRUFBVTtBQUMvQix1QkFBT1AsY0FBUCxDQUF5QixLQUFLWixFQUE5QixTQUFvQ2lCLE9BQXBDLEVBQStDRSxRQUEvQztBQUNEOzs7c0JBckVRQyxJLEVBQU07QUFDYixXQUFLZCxLQUFMLEdBQWFjLElBQWI7QUFDRCxLO3dCQUVVO0FBQ1QsYUFBTyxLQUFLZCxLQUFaO0FBQ0Q7Ozs7O2tCQWtFWVAsUSIsImZpbGUiOiJBY3Rpdml0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9jZXNzIGZyb20gJy4vUHJvY2Vzcyc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4uLy4uL3V0aWxzL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4uLy4uL3V0aWxzL1NpZ25hbEFsbCc7XG5pbXBvcnQgc29ja2V0IGZyb20gJy4vc29ja2V0JztcbmltcG9ydCBWaWV3IGZyb20gJy4uL3ZpZXdzL1ZpZXcnO1xuaW1wb3J0IHZpZXdNYW5hZ2VyIGZyb20gJy4vdmlld01hbmFnZXInO1xuXG5cbi8qKlxuICogSW50ZXJuYWwgYmFzZSBjbGFzcyBmb3Igc2VydmljZXMgYW5kIHNjZW5lcy4gQmFzaWNhbGx5IGEgcHJvY2VzcyB3aXRoIHZpZXdcbiAqIGFuZCBvcHRpb25uYWwgbmV0d29yayBhYmlsaXRpZXMuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlByb2Nlc3NcbiAqL1xuY2xhc3MgQWN0aXZpdHkgZXh0ZW5kcyBQcm9jZXNzIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIElkIG9mIHRoZSBhY3Rpdml0eS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBoYXNOZXR3b3JrIC0gRGVmaW5lIGlmIHRoZSBhY3Rpdml0eSBuZWVkcyBhIHNvY2tldFxuICAgKiAgY29ubmVjdGlvbiBvciBub3QuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZCwgaGFzTmV0d29yayA9IHRydWUpIHtcbiAgICBzdXBlcihpZCk7XG5cbiAgICAvKipcbiAgICAgKiBJZiBgdHJ1ZWAsIGRlZmluZXMgaWYgdGhlIGFjdGl2aXR5IGhhcyBhbHJlYWR5IHN0YXJ0ZWQgb25jZS5cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbmFtZSBoYXNTdGFydGVkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BY3Rpdml0eVxuICAgICAqL1xuICAgIHRoaXMuaGFzU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBpZiB0aGUgYWN0aXZpdHkgbmVlZHMgYSBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIuXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG5hbWUgaGFzTmV0d29ya1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLmhhc05ldHdvcmsgPSAhIWhhc05ldHdvcms7XG5cbiAgICAvLyByZWdpc3RlciBhcyBhIG5ldHdvcmtlZCBzZXJ2aWNlLCBzZXR1cCB0aGUgc29ja2V0IGNvbm5lY3Rpb25cbiAgICBpZiAodGhpcy5oYXNOZXR3b3JrKVxuICAgICAgc29ja2V0LnJlcXVpcmVkID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbnMgb2YgdGhlIGFjdGl2aXR5LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgb3B0aW9uc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSB7IHZpZXdQcmlvcml0eTogMCB9O1xuXG4gICAgLyoqXG4gICAgICogVmlldyBvZiB0aGUgYWN0aXZpdHkuXG4gICAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3fVxuICAgICAqIEBuYW1lIHZpZXdcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFjdGl2aXR5XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl92aWV3ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIERlZmluZSB3aGljaCBzaWduYWwgdGhlIGBBY3Rpdml0eWAgcmVxdWlyZXMgdG8gc3RhcnQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscyA9IG5ldyBTaWduYWxBbGwoKTtcblxuICAgIHRoaXMuc2VuZCA9IHRoaXMuc2VuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2VuZFZvbGF0aWxlID0gdGhpcy5zZW5kVm9sYXRpbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlY2VpdmUgPSB0aGlzLnJlY2VpdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyID0gdGhpcy5yZW1vdmVMaXN0ZW5lci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gaW1wbGVtZW50IGluIGNoaWxkIGNsYXNzZXMuXG4gICAqIERlZmluZSB3aGF0IHRvIGRvIHdoZW4gYSBzZXJ2aWNlIGlzIHJlcXVpcmVkIGJ5IGFuIGBBY3Rpdml0eWAuXG4gICAqL1xuICByZXF1aXJlKCkge31cblxuICAvKipcbiAgICogQWRkIGEgc2lnbmFsIHRvIHRoZSByZXF1aXJlZCBzaWduYWxzIGluIG9yZGVyIGZvciB0aGUgYFNjZW5lYCBpbnN0YW5jZVxuICAgKiB0byBzdGFydC5cbiAgICogQHBhcmFtIHtTaWduYWx9IHNpZ25hbCAtIFRoZSBzaWduYWwgdGhhdCBtdXN0IGJlIHdhaXRlZCBmb3IuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB3YWl0Rm9yKHNpZ25hbCkge1xuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZChzaWduYWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB0aGUgYWN0aXZpdHkgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgdmlldyBvZiBzZXJ2aWNlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gdmlldyAtIGFueSBvYmplY3QgY29tcGxpYW50IHdpdGggdGhlIHZpZXcgaW50ZXJmYWNlLlxuICAgKi9cbiAgc2V0IHZpZXcodmlldykge1xuICAgIHRoaXMuX3ZpZXcgPSB2aWV3O1xuICB9XG5cbiAgZ2V0IHZpZXcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZpZXc7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0aGUgdmlldyBtYW5hZ2VyIHRvIGRpc3BsYXkgdGhlIHZpZXcuIFRoZSBjYWxsIG9mIHRoaXMgbWV0aG9kXG4gICAqIGRvZXNuJ3QgZ3VhcmFudGVlIGEgc3luY2hyb25pemVkIHJlbmRlcmluZyBvciBhbnkgcmVuZGVyaW5nIGF0IGFsbCBhcyB0aGVcbiAgICogdmlldyBtYW5hZ2VyIGRlY2lkZXMgd2hpY2ggdmlldyB0byBkaXNwbGF5IGJhc2VkIG9uIHRoZWlyIHByaW9yaXR5LlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIHZpZXcgaXMgYWN0dWFsbHlcbiAgICogIGRpc3BsYXllZCBpbiB0aGUgYXBwbGljYXRpb24uXG4gICAqL1xuICBzaG93KCkge1xuICAgIHJldHVybiB2aWV3TWFuYWdlci5yZWdpc3Rlcih0aGlzLl92aWV3LCB0aGlzLm9wdGlvbnMudmlld1ByaW9yaXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlIHRoZSB2aWV3IG9mIHRoZSBhY3Rpdml0eSBpZiBpdCBvd25zIG9uZS5cbiAgICovXG4gIGhpZGUoKSB7XG4gICAgdmlld01hbmFnZXIucmVtb3ZlKHRoaXMuX3ZpZXcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSB3ZWIgc29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBvbiBhIGdpdmVuIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHlcbiAgICogIG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBpZDogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBzb2NrZXQuc2VuZChgJHt0aGlzLmlkfToke2NoYW5uZWx9YCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIHdlYiBzb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIG9uIGEgZ2l2ZW4gY2hhbm5lbC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseVxuICAgKiAgbmFtZXNwYWNlZCB3aXRoIHRoZSBhY3Rpdml0eSdzIGlkOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmRWb2xhdGlsZShjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgc29ja2V0LnNlbmRWb2xhdGlsZShgJHt0aGlzLmlkfToke2NoYW5uZWx9YCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuIHRvIHdlYiBzb2NrZXQgbWVzc2FnZXMgZnJvbSB0aGUgc2VydmVyIG9uIGEgZ2l2ZW4gY2hhbm5lbC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseVxuICAgKiAgbmFtZXNwYWNlZCB3aXRoIHRoZSBhY3Rpdml0eSdzIGlkOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgc29ja2V0LnJlY2VpdmUoYCR7dGhpcy5pZH06JHtjaGFubmVsfWAsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIGxpc3RlbmluZyBmb3IgbWVzc2FnZXMgZnJvbSB0aGUgc2VydmVyIG9uIGEgZ2l2ZW4gY2hhbm5lbC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseVxuICAgKiAgbmFtZXNwYWNlZCB3aXRoIHRoZSBhY3Rpdml0eSdzIGlkOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIHJlbW92ZSBmcm9tIHRoZSBzdGFjay5cbiAgICovXG4gIHN0b3BSZWNlaXZpbmcoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoYCR7dGhpcy5pZH06JHtjaGFubmVsfWAsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBY3Rpdml0eTtcbiJdfQ==