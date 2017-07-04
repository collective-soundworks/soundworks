"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Lightweight EventEmitter mimicing node EventEmitter's API.
 */
var EventEmitter = function () {
  function EventEmitter() {
    (0, _classCallCheck3.default)(this, EventEmitter);

    /**
     * Events
     * @name _events
     * @type {Map<String, Set>}
     * @instanceof Process
     * @private
     */
    this._events = new _map2.default();
  }

  /**
   * Add a callback to a named event
   * @param {String} channel - Name of the event.
   * @param {Function} callback - Callback executed when the event is emitted.
   */


  (0, _createClass3.default)(EventEmitter, [{
    key: "addListener",
    value: function addListener(channel, callback) {
      if (!this._events.has(channel)) this._events.set(channel, new _set2.default());

      var stack = this._events.get(channel);
      stack.add(callback);
    }

    /**
     * Remove a callback from a named event
     * @param {String} channel - Name of the event.
     * @param {Function} callback - Callback to remove.
     */

  }, {
    key: "removeListener",
    value: function removeListener(channel, callback) {
      var stack = this._events.get(channel);

      if (stack) stack.delete(callback);
    }

    /**
     * Emit a named event
     * @param {String} channel - Name of the event.
     * @param {...Mixed} args - Arguments to pass to the callback.
     */

  }, {
    key: "emit",
    value: function emit(channel) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var stack = this._events.get(channel);

      if (stack) stack.forEach(function (callback) {
        return callback.apply(undefined, args);
      });
    }
  }]);
  return EventEmitter;
}();

exports.default = EventEmitter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6WyJFdmVudEVtaXR0ZXIiLCJfZXZlbnRzIiwiY2hhbm5lbCIsImNhbGxiYWNrIiwiaGFzIiwic2V0Iiwic3RhY2siLCJnZXQiLCJhZGQiLCJkZWxldGUiLCJhcmdzIiwiZm9yRWFjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztJQUdNQSxZO0FBQ0osMEJBQWM7QUFBQTs7QUFDWjs7Ozs7OztBQU9BLFNBQUtDLE9BQUwsR0FBZSxtQkFBZjtBQUNEOztBQUVEOzs7Ozs7Ozs7Z0NBS1lDLE8sRUFBU0MsUSxFQUFVO0FBQzdCLFVBQUksQ0FBQyxLQUFLRixPQUFMLENBQWFHLEdBQWIsQ0FBaUJGLE9BQWpCLENBQUwsRUFDRSxLQUFLRCxPQUFMLENBQWFJLEdBQWIsQ0FBaUJILE9BQWpCLEVBQTBCLG1CQUExQjs7QUFFRixVQUFNSSxRQUFRLEtBQUtMLE9BQUwsQ0FBYU0sR0FBYixDQUFpQkwsT0FBakIsQ0FBZDtBQUNBSSxZQUFNRSxHQUFOLENBQVVMLFFBQVY7QUFDRDs7QUFFRDs7Ozs7Ozs7bUNBS2VELE8sRUFBU0MsUSxFQUFVO0FBQ2hDLFVBQU1HLFFBQVEsS0FBS0wsT0FBTCxDQUFhTSxHQUFiLENBQWlCTCxPQUFqQixDQUFkOztBQUVBLFVBQUlJLEtBQUosRUFDRUEsTUFBTUcsTUFBTixDQUFhTixRQUFiO0FBQ0g7O0FBRUQ7Ozs7Ozs7O3lCQUtLRCxPLEVBQWtCO0FBQUEsd0NBQU5RLElBQU07QUFBTkEsWUFBTTtBQUFBOztBQUNyQixVQUFNSixRQUFRLEtBQUtMLE9BQUwsQ0FBYU0sR0FBYixDQUFpQkwsT0FBakIsQ0FBZDs7QUFFQSxVQUFJSSxLQUFKLEVBQ0VBLE1BQU1LLE9BQU4sQ0FBYyxVQUFDUixRQUFEO0FBQUEsZUFBY0EsMEJBQVlPLElBQVosQ0FBZDtBQUFBLE9BQWQ7QUFDSDs7Ozs7a0JBR1lWLFkiLCJmaWxlIjoiRXZlbnRFbWl0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBMaWdodHdlaWdodCBFdmVudEVtaXR0ZXIgbWltaWNpbmcgbm9kZSBFdmVudEVtaXR0ZXIncyBBUEkuXG4gKi9cbmNsYXNzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qKlxuICAgICAqIEV2ZW50c1xuICAgICAqIEBuYW1lIF9ldmVudHNcbiAgICAgKiBAdHlwZSB7TWFwPFN0cmluZywgU2V0Pn1cbiAgICAgKiBAaW5zdGFuY2VvZiBQcm9jZXNzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9ldmVudHMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY2FsbGJhY2sgdG8gYSBuYW1lZCBldmVudFxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIE5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIGV4ZWN1dGVkIHdoZW4gdGhlIGV2ZW50IGlzIGVtaXR0ZWQuXG4gICAqL1xuICBhZGRMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmhhcyhjaGFubmVsKSlcbiAgICAgIHRoaXMuX2V2ZW50cy5zZXQoY2hhbm5lbCwgbmV3IFNldCgpKTtcblxuICAgIGNvbnN0IHN0YWNrID0gdGhpcy5fZXZlbnRzLmdldChjaGFubmVsKTtcbiAgICBzdGFjay5hZGQoY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGNhbGxiYWNrIGZyb20gYSBuYW1lZCBldmVudFxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIE5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgc3RhY2sgPSB0aGlzLl9ldmVudHMuZ2V0KGNoYW5uZWwpO1xuXG4gICAgaWYgKHN0YWNrKVxuICAgICAgc3RhY2suZGVsZXRlKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0IGEgbmFtZWQgZXZlbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHsuLi5NaXhlZH0gYXJncyAtIEFyZ3VtZW50cyB0byBwYXNzIHRvIHRoZSBjYWxsYmFjay5cbiAgICovXG4gIGVtaXQoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IHN0YWNrID0gdGhpcy5fZXZlbnRzLmdldChjaGFubmVsKTtcblxuICAgIGlmIChzdGFjaylcbiAgICAgIHN0YWNrLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjayguLi5hcmdzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRFbWl0dGVyO1xuIl19