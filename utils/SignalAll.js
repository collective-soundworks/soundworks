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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpZ25hbEFsbC5qcyJdLCJuYW1lcyI6WyJTaWduYWxBbGwiLCJfZGVwZW5kZW5jaWVzIiwic2lnbmFsIiwiYWRkIiwiYWRkT2JzZXJ2ZXIiLCJ2YWx1ZSIsImdldCIsInNpemUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBOzs7OztJQUtNQSxTOzs7QUFDSix1QkFBYztBQUFBOztBQUFBOztBQUVaLFVBQUtDLGFBQUwsR0FBcUIsbUJBQXJCO0FBRlk7QUFHYjs7Ozt3QkFNR0MsTSxFQUFRO0FBQUE7O0FBQ1YsV0FBS0QsYUFBTCxDQUFtQkUsR0FBbkIsQ0FBdUJELE1BQXZCOztBQUVBQSxhQUFPRSxXQUFQLENBQW1CLFlBQU07QUFDdkIsWUFBSUMsUUFBUSxJQUFaOztBQUR1QjtBQUFBO0FBQUE7O0FBQUE7QUFHdkIsMERBQW1CLE9BQUtKLGFBQXhCO0FBQUEsZ0JBQVNDLE9BQVQ7O0FBQ0VHLG9CQUFRQSxTQUFTSCxRQUFPSSxHQUFQLEVBQWpCO0FBREY7QUFIdUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFNdkIsNElBQVVELEtBQVY7QUFDRCxPQVBEO0FBUUQ7Ozt3QkFFR0EsSyxFQUFPLENBQUUsVUFBWTs7O3dCQWpCWjtBQUNYLGFBQU8sS0FBS0osYUFBTCxDQUFtQk0sSUFBMUI7QUFDRDs7Ozs7a0JBa0JZUCxTIiwiZmlsZSI6IlNpZ25hbEFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuXG4vKipcbiAqIENvbXBvdW5kIHNpZ25hbCB0aGF0IGlzIGB0cnVlYCB3aGVuIGFsbCBzaWduYWxzIGl0IGRlcGVuZHMgb24gYXJlIGB0cnVlYC5cbiAqIERlcGVuZGVuY2llcyBhcmUgYWRkZWQgdGhyb3VnaCB0aGUgYGFkZGAgbWV0aG9kLlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgU2lnbmFsQWxsIGV4dGVuZHMgU2lnbmFsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9kZXBlbmRlbmNpZXMgPSBuZXcgU2V0KCk7XG4gIH1cblxuICBnZXQgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLl9kZXBlbmRlbmNpZXMuc2l6ZTtcbiAgfVxuXG4gIGFkZChzaWduYWwpIHtcbiAgICB0aGlzLl9kZXBlbmRlbmNpZXMuYWRkKHNpZ25hbCk7XG5cbiAgICBzaWduYWwuYWRkT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgbGV0IHZhbHVlID0gdHJ1ZTtcblxuICAgICAgZm9yIChsZXQgc2lnbmFsIG9mIHRoaXMuX2RlcGVuZGVuY2llcylcbiAgICAgICAgdmFsdWUgPSB2YWx1ZSAmJiBzaWduYWwuZ2V0KCk7XG5cbiAgICAgIHN1cGVyLnNldCh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsdWUpIHsgLyogbm9vcCAqLyB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpZ25hbEFsbDtcbiJdfQ==