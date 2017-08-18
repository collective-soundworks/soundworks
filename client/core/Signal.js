"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 *
 */
var Signal = function () {
  function Signal() {
    (0, _classCallCheck3.default)(this, Signal);

    this._state = false;
    this._observers = new _set2.default();
  }

  (0, _createClass3.default)(Signal, [{
    key: "set",
    value: function set(value) {
      if (value !== this._state) {
        this._state = value;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(this._observers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var observer = _step.value;

            observer(value);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
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
      this._observers.delete(observer);
    }
  }]);
  return Signal;
}();

exports.default = Signal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpZ25hbC5qcyJdLCJuYW1lcyI6WyJTaWduYWwiLCJfc3RhdGUiLCJfb2JzZXJ2ZXJzIiwidmFsdWUiLCJvYnNlcnZlciIsImFkZCIsImRlbGV0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7SUFJcUJBLE07QUFDbkIsb0JBQWM7QUFBQTs7QUFDWixTQUFLQyxNQUFMLEdBQWMsS0FBZDtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsbUJBQWxCO0FBQ0Q7Ozs7d0JBRUdDLEssRUFBTztBQUNULFVBQUlBLFVBQVUsS0FBS0YsTUFBbkIsRUFBMkI7QUFDekIsYUFBS0EsTUFBTCxHQUFjRSxLQUFkOztBQUR5QjtBQUFBO0FBQUE7O0FBQUE7QUFHekIsMERBQXFCLEtBQUtELFVBQTFCO0FBQUEsZ0JBQVNFLFFBQVQ7O0FBQ0VBLHFCQUFTRCxLQUFUO0FBREY7QUFIeUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUsxQjtBQUNGOzs7MEJBRUs7QUFDSixhQUFPLEtBQUtGLE1BQVo7QUFDRDs7O2dDQUVXRyxRLEVBQVU7QUFDcEIsV0FBS0YsVUFBTCxDQUFnQkcsR0FBaEIsQ0FBb0JELFFBQXBCO0FBQ0Q7OzttQ0FFY0EsUSxFQUFVO0FBQ3ZCLFdBQUtGLFVBQUwsQ0FBZ0JJLE1BQWhCLENBQXVCRixRQUF2QjtBQUNEOzs7OztrQkF6QmtCSixNIiwiZmlsZSI6IlNpZ25hbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICpcbiAqXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZ25hbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3N0YXRlID0gZmFsc2U7XG4gICAgdGhpcy5fb2JzZXJ2ZXJzID0gbmV3IFNldCgpO1xuICB9XG5cbiAgc2V0KHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9zdGF0ZSkge1xuICAgICAgdGhpcy5fc3RhdGUgPSB2YWx1ZTtcblxuICAgICAgZm9yIChsZXQgb2JzZXJ2ZXIgb2YgdGhpcy5fb2JzZXJ2ZXJzKVxuICAgICAgICBvYnNlcnZlcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgfVxuXG4gIGFkZE9ic2VydmVyKG9ic2VydmVyKSB7XG4gICAgdGhpcy5fb2JzZXJ2ZXJzLmFkZChvYnNlcnZlcik7XG4gIH1cblxuICByZW1vdmVPYnNlcnZlcihvYnNlcnZlcikge1xuICAgIHRoaXMuX29ic2VydmVycy5kZWxldGUob2JzZXJ2ZXIpO1xuICB9XG59XG4iXX0=