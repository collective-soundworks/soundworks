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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpZ25hbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUlxQixNO0FBQ25CLG9CQUFjO0FBQUE7O0FBQ1osU0FBSyxNQUFMLEdBQWMsS0FBZDtBQUNBLFNBQUssVUFBTCxHQUFrQixtQkFBbEI7QUFDRDs7Ozt3QkFFRyxLLEVBQU87QUFDVCxVQUFJLFVBQVUsS0FBSyxNQUFuQixFQUEyQjtBQUN6QixhQUFLLE1BQUwsR0FBYyxLQUFkOztBQUR5QjtBQUFBO0FBQUE7O0FBQUE7QUFHekIsMERBQXFCLEtBQUssVUFBMUI7QUFBQSxnQkFBUyxRQUFUOztBQUNFLHFCQUFTLEtBQVQ7QUFERjtBQUh5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSzFCO0FBQ0Y7OzswQkFFSztBQUNKLGFBQU8sS0FBSyxNQUFaO0FBQ0Q7OztnQ0FFVyxRLEVBQVU7QUFDcEIsV0FBSyxVQUFMLENBQWdCLEdBQWhCLENBQW9CLFFBQXBCO0FBQ0Q7OzttQ0FFYyxRLEVBQVU7QUFDdkIsV0FBSyxVQUFMLENBQWdCLE1BQWhCLENBQXVCLFFBQXZCO0FBQ0Q7Ozs7O2tCQXpCa0IsTSIsImZpbGUiOiJTaWduYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqXG4gKlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWduYWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9zdGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuX29ic2VydmVycyA9IG5ldyBTZXQoKTtcbiAgfVxuXG4gIHNldCh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fc3RhdGUpIHtcbiAgICAgIHRoaXMuX3N0YXRlID0gdmFsdWU7XG5cbiAgICAgIGZvciAobGV0IG9ic2VydmVyIG9mIHRoaXMuX29ic2VydmVycylcbiAgICAgICAgb2JzZXJ2ZXIodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH1cblxuICBhZGRPYnNlcnZlcihvYnNlcnZlcikge1xuICAgIHRoaXMuX29ic2VydmVycy5hZGQob2JzZXJ2ZXIpO1xuICB9XG5cbiAgcmVtb3ZlT2JzZXJ2ZXIob2JzZXJ2ZXIpIHtcbiAgICB0aGlzLl9vYnNlcnZlcnMuZGVsZXRlKG9ic2VydmVyKTtcbiAgfVxufVxuIl19