'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Signal2 = require('./Signal');

var _Signal3 = _interopRequireDefault(_Signal2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Compound signal that is `true` when all signals it depends on are `true`.
 * Dependencies are added through the `add` method.
 * @private
 */
var SignalAll = function (_Signal) {
  (0, _inherits3.default)(SignalAll, _Signal);

  function SignalAll() {
    (0, _classCallCheck3.default)(this, SignalAll);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SignalAll.__proto__ || (0, _getPrototypeOf2.default)(SignalAll)).call(this));

    _this._dependencies = new _set2.default();
    return _this;
  }

  (0, _createClass3.default)(SignalAll, [{
    key: 'add',
    value: function add(signal) {
      var _this2 = this;

      this._dependencies.add(signal);

      signal.addObserver(function () {
        var value = true;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(_this2._dependencies), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _signal = _step.value;

            value = value && _signal.get();
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

        (0, _get3.default)(SignalAll.prototype.__proto__ || (0, _getPrototypeOf2.default)(SignalAll.prototype), 'set', _this2).call(_this2, value);
      });
    }
  }, {
    key: 'set',
    value: function set(value) {/* noop */}
  }, {
    key: 'length',
    get: function get() {
      return this._dependencies.size;
    }
  }]);
  return SignalAll;
}(_Signal3.default);

exports.default = SignalAll;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpZ25hbEFsbC5qcyJdLCJuYW1lcyI6WyJTaWduYWxBbGwiLCJfZGVwZW5kZW5jaWVzIiwic2lnbmFsIiwiYWRkIiwiYWRkT2JzZXJ2ZXIiLCJ2YWx1ZSIsImdldCIsInNpemUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBOzs7OztJQUtxQkEsUzs7O0FBQ25CLHVCQUFjO0FBQUE7O0FBQUE7O0FBRVosVUFBS0MsYUFBTCxHQUFxQixtQkFBckI7QUFGWTtBQUdiOzs7O3dCQU1HQyxNLEVBQVE7QUFBQTs7QUFDVixXQUFLRCxhQUFMLENBQW1CRSxHQUFuQixDQUF1QkQsTUFBdkI7O0FBRUFBLGFBQU9FLFdBQVAsQ0FBbUIsWUFBTTtBQUN2QixZQUFJQyxRQUFRLElBQVo7O0FBRHVCO0FBQUE7QUFBQTs7QUFBQTtBQUd2QiwwREFBbUIsT0FBS0osYUFBeEI7QUFBQSxnQkFBU0MsT0FBVDs7QUFDRUcsb0JBQVFBLFNBQVNILFFBQU9JLEdBQVAsRUFBakI7QUFERjtBQUh1QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQU12Qiw0SUFBVUQsS0FBVjtBQUNELE9BUEQ7QUFRRDs7O3dCQUVHQSxLLEVBQU8sQ0FBRSxVQUFZOzs7d0JBakJaO0FBQ1gsYUFBTyxLQUFLSixhQUFMLENBQW1CTSxJQUExQjtBQUNEOzs7OztrQkFSa0JQLFMiLCJmaWxlIjoiU2lnbmFsQWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5cbi8qKlxuICogQ29tcG91bmQgc2lnbmFsIHRoYXQgaXMgYHRydWVgIHdoZW4gYWxsIHNpZ25hbHMgaXQgZGVwZW5kcyBvbiBhcmUgYHRydWVgLlxuICogRGVwZW5kZW5jaWVzIGFyZSBhZGRlZCB0aHJvdWdoIHRoZSBgYWRkYCBtZXRob2QuXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWduYWxBbGwgZXh0ZW5kcyBTaWduYWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2RlcGVuZGVuY2llcyA9IG5ldyBTZXQoKTtcbiAgfVxuXG4gIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RlcGVuZGVuY2llcy5zaXplO1xuICB9XG5cbiAgYWRkKHNpZ25hbCkge1xuICAgIHRoaXMuX2RlcGVuZGVuY2llcy5hZGQoc2lnbmFsKTtcblxuICAgIHNpZ25hbC5hZGRPYnNlcnZlcigoKSA9PiB7XG4gICAgICBsZXQgdmFsdWUgPSB0cnVlO1xuXG4gICAgICBmb3IgKGxldCBzaWduYWwgb2YgdGhpcy5fZGVwZW5kZW5jaWVzKVxuICAgICAgICB2YWx1ZSA9IHZhbHVlICYmIHNpZ25hbC5nZXQoKTtcblxuICAgICAgc3VwZXIuc2V0KHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWx1ZSkgeyAvKiBub29wICovIH1cbn1cbiJdfQ==