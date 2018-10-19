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

var _Process2 = require('../../client/core/Process');

var _Process3 = _interopRequireDefault(_Process2);

var _Signal = require('../../utils/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _SignalAll = require('../../utils/SignalAll');

var _SignalAll2 = _interopRequireDefault(_SignalAll);

var _socket = require('../../client/core/socket');

var _socket2 = _interopRequireDefault(_socket);

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
  }]);
  return Activity;
}(_Process3.default);

exports.default = Activity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGl2aXR5LmpzIl0sIm5hbWVzIjpbIkFjdGl2aXR5IiwiaWQiLCJoYXNOZXR3b3JrIiwiaGFzU3RhcnRlZCIsInNvY2tldCIsInJlcXVpcmVkIiwib3B0aW9ucyIsInZpZXdQcmlvcml0eSIsInJlcXVpcmVkU2lnbmFscyIsIlNpZ25hbEFsbCIsInNlbmQiLCJiaW5kIiwic2VuZFZvbGF0aWxlIiwicmVjZWl2ZSIsInJlbW92ZUxpc3RlbmVyIiwic2lnbmFsIiwiYWRkIiwiY2hhbm5lbCIsImFyZ3MiLCJjYWxsYmFjayIsIlByb2Nlc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7OztJQU9NQSxROzs7QUFDSjs7Ozs7QUFLQSxvQkFBWUMsRUFBWixFQUFtQztBQUFBLFFBQW5CQyxVQUFtQix1RUFBTixJQUFNO0FBQUE7O0FBR2pDOzs7Ozs7O0FBSGlDLDBJQUMzQkQsRUFEMkI7O0FBVWpDLFVBQUtFLFVBQUwsR0FBa0IsS0FBbEI7O0FBRUE7Ozs7Ozs7QUFPQSxVQUFLRCxVQUFMLEdBQWtCLENBQUMsQ0FBQ0EsVUFBcEI7O0FBRUE7QUFDQSxRQUFJLE1BQUtBLFVBQVQsRUFDRUUsaUJBQU9DLFFBQVAsR0FBa0IsSUFBbEI7O0FBRUY7Ozs7Ozs7QUFPQSxVQUFLQyxPQUFMLEdBQWUsRUFBRUMsY0FBYyxDQUFoQixFQUFmOztBQUVBOzs7O0FBSUEsVUFBS0MsZUFBTCxHQUF1QixJQUFJQyxtQkFBSixFQUF2Qjs7QUFFQSxVQUFLQyxJQUFMLEdBQVksTUFBS0EsSUFBTCxDQUFVQyxJQUFWLE9BQVo7QUFDQSxVQUFLQyxZQUFMLEdBQW9CLE1BQUtBLFlBQUwsQ0FBa0JELElBQWxCLE9BQXBCO0FBQ0EsVUFBS0UsT0FBTCxHQUFlLE1BQUtBLE9BQUwsQ0FBYUYsSUFBYixPQUFmO0FBQ0EsVUFBS0csY0FBTCxHQUFzQixNQUFLQSxjQUFMLENBQW9CSCxJQUFwQixPQUF0QjtBQTNDaUM7QUE0Q2xDOztBQUVEOzs7Ozs7Ozs4QkFJVSxDQUFFOztBQUVaOzs7Ozs7Ozs7NEJBTVFJLE0sRUFBUTtBQUNkLFdBQUtQLGVBQUwsQ0FBcUJRLEdBQXJCLENBQXlCRCxNQUF6QjtBQUNEOztBQUVEOzs7Ozs7OzhCQUlVVCxPLEVBQVM7QUFDakIsNEJBQWMsS0FBS0EsT0FBbkIsRUFBNEJBLE9BQTVCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7eUJBT0tXLE8sRUFBa0I7QUFBQSx3Q0FBTkMsSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBQ3JCZCx1QkFBT00sSUFBUCwwQkFBZSxLQUFLVCxFQUFwQixTQUEwQmdCLE9BQTFCLFNBQXdDQyxJQUF4QztBQUNEOztBQUVEOzs7Ozs7Ozs7O2lDQU9hRCxPLEVBQWtCO0FBQUEseUNBQU5DLElBQU07QUFBTkEsWUFBTTtBQUFBOztBQUM3QmQsdUJBQU9RLFlBQVAsMEJBQXVCLEtBQUtYLEVBQTVCLFNBQWtDZ0IsT0FBbEMsU0FBZ0RDLElBQWhEO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7NEJBT1FELE8sRUFBU0UsUSxFQUFVO0FBQ3pCZix1QkFBT1MsT0FBUCxDQUFrQixLQUFLWixFQUF2QixTQUE2QmdCLE9BQTdCLEVBQXdDRSxRQUF4QztBQUNEOztBQUVEOzs7Ozs7Ozs7O2tDQU9jRixPLEVBQVNFLFEsRUFBVTtBQUMvQmYsdUJBQU9VLGNBQVAsQ0FBeUIsS0FBS2IsRUFBOUIsU0FBb0NnQixPQUFwQyxFQUErQ0UsUUFBL0M7QUFDRDs7O0VBdEhvQkMsaUI7O2tCQXlIUnBCLFEiLCJmaWxlIjoiQWN0aXZpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvY2VzcyBmcm9tICcuLi8uLi9jbGllbnQvY29yZS9Qcm9jZXNzJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi4vLi4vdXRpbHMvU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi4vLi4vdXRpbHMvU2lnbmFsQWxsJztcbmltcG9ydCBzb2NrZXQgZnJvbSAnLi4vLi4vY2xpZW50L2NvcmUvc29ja2V0JztcblxuLyoqXG4gKiBJbnRlcm5hbCBiYXNlIGNsYXNzIGZvciBzZXJ2aWNlcyBhbmQgc2NlbmVzLiBCYXNpY2FsbHkgYSBwcm9jZXNzIHdpdGggdmlld1xuICogYW5kIG9wdGlvbm5hbCBuZXR3b3JrIGFiaWxpdGllcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUHJvY2Vzc1xuICovXG5jbGFzcyBBY3Rpdml0eSBleHRlbmRzIFByb2Nlc3Mge1xuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gSWQgb2YgdGhlIGFjdGl2aXR5LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGhhc05ldHdvcmsgLSBEZWZpbmUgaWYgdGhlIGFjdGl2aXR5IG5lZWRzIGEgc29ja2V0XG4gICAqICBjb25uZWN0aW9uIG9yIG5vdC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGlkLCBoYXNOZXR3b3JrID0gdHJ1ZSkge1xuICAgIHN1cGVyKGlkKTtcblxuICAgIC8qKlxuICAgICAqIElmIGB0cnVlYCwgZGVmaW5lcyBpZiB0aGUgYWN0aXZpdHkgaGFzIGFscmVhZHkgc3RhcnRlZCBvbmNlLlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBuYW1lIGhhc1N0YXJ0ZWRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFjdGl2aXR5XG4gICAgICovXG4gICAgdGhpcy5oYXNTdGFydGVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGlmIHRoZSBhY3Rpdml0eSBuZWVkcyBhIGNvbm5lY3Rpb24gdG8gdGhlIHNlcnZlci5cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbmFtZSBoYXNOZXR3b3JrXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BY3Rpdml0eVxuICAgICAqL1xuICAgIHRoaXMuaGFzTmV0d29yayA9ICEhaGFzTmV0d29yaztcblxuICAgIC8vIHJlZ2lzdGVyIGFzIGEgbmV0d29ya2VkIHNlcnZpY2UsIHNldHVwIHRoZSBzb2NrZXQgY29ubmVjdGlvblxuICAgIGlmICh0aGlzLmhhc05ldHdvcmspXG4gICAgICBzb2NrZXQucmVxdWlyZWQgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ucyBvZiB0aGUgYWN0aXZpdHkuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbmFtZSBvcHRpb25zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BY3Rpdml0eVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IHsgdmlld1ByaW9yaXR5OiAwIH07XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmUgd2hpY2ggc2lnbmFsIHRoZSBgQWN0aXZpdHlgIHJlcXVpcmVzIHRvIHN0YXJ0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMgPSBuZXcgU2lnbmFsQWxsKCk7XG5cbiAgICB0aGlzLnNlbmQgPSB0aGlzLnNlbmQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNlbmRWb2xhdGlsZSA9IHRoaXMuc2VuZFZvbGF0aWxlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWNlaXZlID0gdGhpcy5yZWNlaXZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lciA9IHRoaXMucmVtb3ZlTGlzdGVuZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGltcGxlbWVudCBpbiBjaGlsZCBjbGFzc2VzLlxuICAgKiBEZWZpbmUgd2hhdCB0byBkbyB3aGVuIGEgc2VydmljZSBpcyByZXF1aXJlZCBieSBhbiBgQWN0aXZpdHlgLlxuICAgKi9cbiAgcmVxdWlyZSgpIHt9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHNpZ25hbCB0byB0aGUgcmVxdWlyZWQgc2lnbmFscyBpbiBvcmRlciBmb3IgdGhlIGBTY2VuZWAgaW5zdGFuY2VcbiAgICogdG8gc3RhcnQuXG4gICAqIEBwYXJhbSB7U2lnbmFsfSBzaWduYWwgLSBUaGUgc2lnbmFsIHRoYXQgbXVzdCBiZSB3YWl0ZWQgZm9yLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgd2FpdEZvcihzaWduYWwpIHtcbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGQoc2lnbmFsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIGFjdGl2aXR5IHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgd2ViIHNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgb24gYSBnaXZlbiBjaGFubmVsLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5XG4gICAqICBuYW1lc3BhY2VkIHdpdGggdGhlIGFjdGl2aXR5J3MgaWQ6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgc29ja2V0LnNlbmQoYCR7dGhpcy5pZH06JHtjaGFubmVsfWAsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSB3ZWIgc29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBvbiBhIGdpdmVuIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHlcbiAgICogIG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBpZDogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kVm9sYXRpbGUoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIHNvY2tldC5zZW5kVm9sYXRpbGUoYCR7dGhpcy5pZH06JHtjaGFubmVsfWAsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiB0byB3ZWIgc29ja2V0IG1lc3NhZ2VzIGZyb20gdGhlIHNlcnZlciBvbiBhIGdpdmVuIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHlcbiAgICogIG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBpZDogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHNvY2tldC5yZWNlaXZlKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgZm9yIG1lc3NhZ2VzIGZyb20gdGhlIHNlcnZlciBvbiBhIGdpdmVuIGNoYW5uZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHlcbiAgICogIG5hbWVzcGFjZWQgd2l0aCB0aGUgYWN0aXZpdHkncyBpZDogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byByZW1vdmUgZnJvbSB0aGUgc3RhY2suXG4gICAqL1xuICBzdG9wUmVjZWl2aW5nKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWN0aXZpdHk7XG4iXX0=