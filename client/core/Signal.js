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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2NvcmUvU2lnbmFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUlxQixNQUFNO0FBQ2QsV0FEUSxNQUFNLEdBQ1g7MEJBREssTUFBTTs7QUFFdkIsUUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDcEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFTLENBQUM7R0FDN0I7O2VBSmtCLE1BQU07O1dBTXRCLGFBQUMsS0FBSyxFQUFFO0FBQ1QsVUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUN6QixZQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQzs7Ozs7OztBQUVwQiw0Q0FBcUIsSUFBSSxDQUFDLFVBQVU7Z0JBQTNCLFFBQVE7O0FBQ2Ysb0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztXQUFBOzs7Ozs7Ozs7Ozs7Ozs7T0FDbkI7S0FDRjs7O1dBRUUsZUFBRztBQUNKLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUNwQjs7O1dBRVUscUJBQUMsUUFBUSxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQy9COzs7V0FFYSx3QkFBQyxRQUFRLEVBQUU7QUFDdkIsVUFBSSxDQUFDLFVBQVUsVUFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2xDOzs7U0F6QmtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2NvcmUvU2lnbmFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKlxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2lnbmFsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fc3RhdGUgPSBmYWxzZTtcbiAgICB0aGlzLl9vYnNlcnZlcnMgPSBuZXcgU2V0KCk7XG4gIH1cblxuICBzZXQodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX3N0YXRlKSB7XG4gICAgICB0aGlzLl9zdGF0ZSA9IHZhbHVlO1xuXG4gICAgICBmb3IgKGxldCBvYnNlcnZlciBvZiB0aGlzLl9vYnNlcnZlcnMpXG4gICAgICAgIG9ic2VydmVyKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9XG5cbiAgYWRkT2JzZXJ2ZXIob2JzZXJ2ZXIpIHtcbiAgICB0aGlzLl9vYnNlcnZlcnMuYWRkKG9ic2VydmVyKTtcbiAgfVxuXG4gIHJlbW92ZU9ic2VydmVyKG9ic2VydmVyKSB7XG4gICAgdGhpcy5fb2JzZXJ2ZXJzLmRlbGV0ZShvYnNlcnZlcik7XG4gIH1cbn1cbiJdfQ==