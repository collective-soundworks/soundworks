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

      if (stack) stack.forEach(function (callback) {
        return callback.apply(undefined, args);
      });
    }
  }]);
  return EventEmitter;
}();

exports.default = EventEmitter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6WyJFdmVudEVtaXR0ZXIiLCJfZXZlbnRzIiwiY2hhbm5lbCIsImNhbGxiYWNrIiwiaGFzIiwic2V0Iiwic3RhY2siLCJnZXQiLCJhZGQiLCJkZWxldGUiLCJhcmdzIiwiZm9yRWFjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQU1BLFk7QUFDSiwwQkFBYztBQUFBOztBQUNaOzs7Ozs7O0FBT0EsU0FBS0MsT0FBTCxHQUFlLG1CQUFmO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztnQ0FLWUMsTyxFQUFTQyxRLEVBQVU7QUFDN0IsVUFBSSxDQUFDLEtBQUtGLE9BQUwsQ0FBYUcsR0FBYixDQUFpQkYsT0FBakIsQ0FBTCxFQUNFLEtBQUtELE9BQUwsQ0FBYUksR0FBYixDQUFpQkgsT0FBakIsRUFBMEIsbUJBQTFCOztBQUVGLFVBQU1JLFFBQVEsS0FBS0wsT0FBTCxDQUFhTSxHQUFiLENBQWlCTCxPQUFqQixDQUFkO0FBQ0FJLFlBQU1FLEdBQU4sQ0FBVUwsUUFBVjtBQUNEOztBQUVEOzs7Ozs7OzttQ0FLZUQsTyxFQUFTQyxRLEVBQVU7QUFDaEMsVUFBTUcsUUFBUSxLQUFLTCxPQUFMLENBQWFNLEdBQWIsQ0FBaUJMLE9BQWpCLENBQWQ7O0FBRUEsVUFBSUksS0FBSixFQUNFQSxNQUFNRyxNQUFOLENBQWFOLFFBQWI7QUFDSDs7QUFFRDs7Ozs7Ozs7eUJBS0tELE8sRUFBa0I7QUFBQSx3Q0FBTlEsSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBQ3JCLFVBQU1KLFFBQVEsS0FBS0wsT0FBTCxDQUFhTSxHQUFiLENBQWlCTCxPQUFqQixDQUFkOztBQUVBLFVBQUlJLEtBQUosRUFDRUEsTUFBTUssT0FBTixDQUFjLFVBQUNSLFFBQUQ7QUFBQSxlQUFjQSwwQkFBWU8sSUFBWixDQUFkO0FBQUEsT0FBZDtBQUNIOzs7OztrQkFHWVYsWSIsImZpbGUiOiJFdmVudEVtaXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvKipcbiAgICAgKiBFdmVudHNcbiAgICAgKiBAbmFtZSBfZXZlbnRzXG4gICAgICogQHR5cGUge01hcDxTdHJpbmcsIFNldD59XG4gICAgICogQGluc3RhbmNlb2YgUHJvY2Vzc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fZXZlbnRzID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNhbGxiYWNrIHRvIGEgbmFtZWQgZXZlbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayBleGVjdXRlZCB3aGVuIHRoZSBldmVudCBpcyBlbWl0dGVkLlxuICAgKi9cbiAgYWRkTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5oYXMoY2hhbm5lbCkpXG4gICAgICB0aGlzLl9ldmVudHMuc2V0KGNoYW5uZWwsIG5ldyBTZXQoKSk7XG5cbiAgICBjb25zdCBzdGFjayA9IHRoaXMuX2V2ZW50cy5nZXQoY2hhbm5lbCk7XG4gICAgc3RhY2suYWRkKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBjYWxsYmFjayBmcm9tIGEgbmFtZWQgZXZlbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBOYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHN0YWNrID0gdGhpcy5fZXZlbnRzLmdldChjaGFubmVsKTtcblxuICAgIGlmIChzdGFjaylcbiAgICAgIHN0YWNrLmRlbGV0ZShjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdCBhIG5hbWVkIGV2ZW50XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gTmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSB7Li4uTWl4ZWR9IGFyZ3MgLSBBcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgY2FsbGJhY2suXG4gICAqL1xuICBlbWl0KGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBzdGFjayA9IHRoaXMuX2V2ZW50cy5nZXQoY2hhbm5lbCk7XG5cbiAgICBpZiAoc3RhY2spXG4gICAgICBzdGFjay5mb3JFYWNoKChjYWxsYmFjaykgPT4gY2FsbGJhY2soLi4uYXJncykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50RW1pdHRlcjtcbiJdfQ==