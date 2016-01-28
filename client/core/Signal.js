/**
 *
 *
 */
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _Set = require("babel-runtime/core-js/set")["default"];

var _getIterator = require("babel-runtime/core-js/get-iterator")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Signal = (function () {
  function Signal() {
    _classCallCheck(this, Signal);

    this._state = false;
    this._observers = new _Set();
  }

  _createClass(Signal, [{
    key: "set",
    value: function set(value) {
      if (value !== this._state) {
        this._state = value;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _getIterator(this._observers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var observer = _step.value;

            observer(value);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }
  }, {
    key: "get",
    value: function get() {
      return this._state;
    }
  }, {
    key: "addObserver",
    value: function addObserver(observer) {
      this._observers.add(observer);
    }
  }, {
    key: "removeObserver",
    value: function removeObserver(observer) {
      this._observers["delete"](observer);
    }
  }]);

  return Signal;
})();

exports["default"] = Signal;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9TaWduYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBSXFCLE1BQU07QUFDZCxXQURRLE1BQU0sR0FDWDswQkFESyxNQUFNOztBQUV2QixRQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNwQixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVMsQ0FBQztHQUM3Qjs7ZUFKa0IsTUFBTTs7V0FNdEIsYUFBQyxLQUFLLEVBQUU7QUFDVCxVQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3pCLFlBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDOzs7Ozs7O0FBRXBCLDRDQUFxQixJQUFJLENBQUMsVUFBVTtnQkFBM0IsUUFBUTs7QUFDZixvQkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1dBQUE7Ozs7Ozs7Ozs7Ozs7OztPQUNuQjtLQUNGOzs7V0FFRSxlQUFHO0FBQ0osYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3BCOzs7V0FFVSxxQkFBQyxRQUFRLEVBQUU7QUFDcEIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDL0I7OztXQUVhLHdCQUFDLFFBQVEsRUFBRTtBQUN2QixVQUFJLENBQUMsVUFBVSxVQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDbEM7OztTQXpCa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoic3JjL2NsaWVudC9jb3JlL1NpZ25hbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICpcbiAqXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZ25hbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3N0YXRlID0gZmFsc2U7XG4gICAgdGhpcy5fb2JzZXJ2ZXJzID0gbmV3IFNldCgpO1xuICB9XG5cbiAgc2V0KHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9zdGF0ZSkge1xuICAgICAgdGhpcy5fc3RhdGUgPSB2YWx1ZTtcblxuICAgICAgZm9yIChsZXQgb2JzZXJ2ZXIgb2YgdGhpcy5fb2JzZXJ2ZXJzKVxuICAgICAgICBvYnNlcnZlcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgfVxuXG4gIGFkZE9ic2VydmVyKG9ic2VydmVyKSB7XG4gICAgdGhpcy5fb2JzZXJ2ZXJzLmFkZChvYnNlcnZlcik7XG4gIH1cblxuICByZW1vdmVPYnNlcnZlcihvYnNlcnZlcikge1xuICAgIHRoaXMuX29ic2VydmVycy5kZWxldGUob2JzZXJ2ZXIpO1xuICB9XG59XG4iXX0=