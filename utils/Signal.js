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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpZ25hbC5qcyJdLCJuYW1lcyI6WyJTaWduYWwiLCJfc3RhdGUiLCJfb2JzZXJ2ZXJzIiwidmFsdWUiLCJvYnNlcnZlciIsImFkZCIsImRlbGV0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7SUFJTUEsTTtBQUNKLG9CQUFjO0FBQUE7O0FBQ1osU0FBS0MsTUFBTCxHQUFjLEtBQWQ7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLG1CQUFsQjtBQUNEOzs7O3dCQUVHQyxLLEVBQU87QUFDVCxVQUFJQSxVQUFVLEtBQUtGLE1BQW5CLEVBQTJCO0FBQ3pCLGFBQUtBLE1BQUwsR0FBY0UsS0FBZDs7QUFEeUI7QUFBQTtBQUFBOztBQUFBO0FBR3pCLDBEQUFxQixLQUFLRCxVQUExQjtBQUFBLGdCQUFTRSxRQUFUOztBQUNFQSxxQkFBU0QsS0FBVDtBQURGO0FBSHlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLMUI7QUFDRjs7OzBCQUVLO0FBQ0osYUFBTyxLQUFLRixNQUFaO0FBQ0Q7OztnQ0FFV0csUSxFQUFVO0FBQ3BCLFdBQUtGLFVBQUwsQ0FBZ0JHLEdBQWhCLENBQW9CRCxRQUFwQjtBQUNEOzs7bUNBRWNBLFEsRUFBVTtBQUN2QixXQUFLRixVQUFMLENBQWdCSSxNQUFoQixDQUF1QkYsUUFBdkI7QUFDRDs7Ozs7a0JBR1lKLE0iLCJmaWxlIjoiU2lnbmFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKlxuICpcbiAqL1xuY2xhc3MgU2lnbmFsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fc3RhdGUgPSBmYWxzZTtcbiAgICB0aGlzLl9vYnNlcnZlcnMgPSBuZXcgU2V0KCk7XG4gIH1cblxuICBzZXQodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX3N0YXRlKSB7XG4gICAgICB0aGlzLl9zdGF0ZSA9IHZhbHVlO1xuXG4gICAgICBmb3IgKGxldCBvYnNlcnZlciBvZiB0aGlzLl9vYnNlcnZlcnMpXG4gICAgICAgIG9ic2VydmVyKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9XG5cbiAgYWRkT2JzZXJ2ZXIob2JzZXJ2ZXIpIHtcbiAgICB0aGlzLl9vYnNlcnZlcnMuYWRkKG9ic2VydmVyKTtcbiAgfVxuXG4gIHJlbW92ZU9ic2VydmVyKG9ic2VydmVyKSB7XG4gICAgdGhpcy5fb2JzZXJ2ZXJzLmRlbGV0ZShvYnNlcnZlcik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2lnbmFsO1xuIl19