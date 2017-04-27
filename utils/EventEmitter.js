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

      if (stack) stach.forEach(function (callback) {
        return callback.apply(undefined, args);
      });
    }
  }]);
  return EventEmitter;
}();

exports.default = EventEmitter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6WyJFdmVudEVtaXR0ZXIiLCJfZXZlbnRzIiwiY2hhbm5lbCIsImNhbGxiYWNrIiwiaGFzIiwic2V0Iiwic3RhY2siLCJnZXQiLCJhZGQiLCJkZWxldGUiLCJhcmdzIiwic3RhY2giLCJmb3JFYWNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTUEsWTtBQUNKLDBCQUFjO0FBQUE7O0FBQ1o7Ozs7Ozs7QUFPQSxTQUFLQyxPQUFMLEdBQWUsbUJBQWY7QUFDRDs7QUFFRDs7Ozs7Ozs7O2dDQUtZQyxPLEVBQVNDLFEsRUFBVTtBQUM3QixVQUFJLENBQUMsS0FBS0YsT0FBTCxDQUFhRyxHQUFiLENBQWlCRixPQUFqQixDQUFMLEVBQ0UsS0FBS0QsT0FBTCxDQUFhSSxHQUFiLENBQWlCSCxPQUFqQixFQUEwQixtQkFBMUI7O0FBRUYsVUFBTUksUUFBUSxLQUFLTCxPQUFMLENBQWFNLEdBQWIsQ0FBaUJMLE9BQWpCLENBQWQ7QUFDQUksWUFBTUUsR0FBTixDQUFVTCxRQUFWO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O21DQUtlRCxPLEVBQVNDLFEsRUFBVTtBQUNoQyxVQUFNRyxRQUFRLEtBQUtMLE9BQUwsQ0FBYU0sR0FBYixDQUFpQkwsT0FBakIsQ0FBZDs7QUFFQSxVQUFJSSxLQUFKLEVBQ0VBLE1BQU1HLE1BQU4sQ0FBYU4sUUFBYjtBQUNIOztBQUVEOzs7Ozs7Ozt5QkFLS0QsTyxFQUFrQjtBQUFBLHdDQUFOUSxJQUFNO0FBQU5BLFlBQU07QUFBQTs7QUFDckIsVUFBTUosUUFBUSxLQUFLTCxPQUFMLENBQWFNLEdBQWIsQ0FBaUJMLE9BQWpCLENBQWQ7O0FBRUEsVUFBSUksS0FBSixFQUNFSyxNQUFNQyxPQUFOLENBQWMsVUFBQ1QsUUFBRDtBQUFBLGVBQWNBLDBCQUFZTyxJQUFaLENBQWQ7QUFBQSxPQUFkO0FBQ0g7Ozs7O2tCQUdZVixZIiwiZmlsZSI6IkV2ZW50RW1pdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qKlxuICAgICAqIEV2ZW50c1xuICAgICAqIEBuYW1lIF9ldmVudHNcbiAgICAgKiBAdHlwZSB7TWFwPFN0cmluZywgU2V0Pn1cbiAgICAgKiBAaW5zdGFuY2VvZiBQcm9jZXNzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9ldmVudHMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY2FsbGJhY2sgdG8gYSBuYW1lZCBldmVudFxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIE5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIGV4ZWN1dGVkIHdoZW4gdGhlIGV2ZW50IGlzIGVtaXR0ZWQuXG4gICAqL1xuICBhZGRMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmhhcyhjaGFubmVsKSlcbiAgICAgIHRoaXMuX2V2ZW50cy5zZXQoY2hhbm5lbCwgbmV3IFNldCgpKTtcblxuICAgIGNvbnN0IHN0YWNrID0gdGhpcy5fZXZlbnRzLmdldChjaGFubmVsKTtcbiAgICBzdGFjay5hZGQoY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGNhbGxiYWNrIGZyb20gYSBuYW1lZCBldmVudFxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIE5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgc3RhY2sgPSB0aGlzLl9ldmVudHMuZ2V0KGNoYW5uZWwpO1xuXG4gICAgaWYgKHN0YWNrKVxuICAgICAgc3RhY2suZGVsZXRlKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0IGEgbmFtZWQgZXZlbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHsuLi5NaXhlZH0gYXJncyAtIEFyZ3VtZW50cyB0byBwYXNzIHRvIHRoZSBjYWxsYmFjay5cbiAgICovXG4gIGVtaXQoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IHN0YWNrID0gdGhpcy5fZXZlbnRzLmdldChjaGFubmVsKTtcblxuICAgIGlmIChzdGFjaylcbiAgICAgIHN0YWNoLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjayguLi5hcmdzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRFbWl0dGVyO1xuIl19