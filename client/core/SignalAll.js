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
 * Call it's observers with true when all its added `Signal` instances are setted to `true`, `false` otherwise.
 * @private
 */

var SignalAll = function (_Signal) {
  (0, _inherits3.default)(SignalAll, _Signal);

  function SignalAll() {
    (0, _classCallCheck3.default)(this, SignalAll);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SignalAll).call(this));

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

        (0, _get3.default)((0, _getPrototypeOf2.default)(SignalAll.prototype), 'set', _this2).call(_this2, value);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpZ25hbEFsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7OztJQU9xQjs7O0FBQ25CLFdBRG1CLFNBQ25CLEdBQWM7d0NBREssV0FDTDs7NkZBREssdUJBQ0w7O0FBRVosVUFBSyxhQUFMLEdBQXFCLG1CQUFyQixDQUZZOztHQUFkOzs2QkFEbUI7O3dCQVVmLFFBQVE7OztBQUNWLFdBQUssYUFBTCxDQUFtQixHQUFuQixDQUF1QixNQUF2QixFQURVOztBQUdWLGFBQU8sV0FBUCxDQUFtQixZQUFNO0FBQ3ZCLFlBQUksUUFBUSxJQUFSLENBRG1COzs7Ozs7O0FBR3ZCLDBEQUFtQixPQUFLLGFBQUwsUUFBbkI7Z0JBQVM7O0FBQ1Asb0JBQVEsU0FBUyxRQUFPLEdBQVAsRUFBVDtXQURWOzs7Ozs7Ozs7Ozs7OztTQUh1Qjs7QUFNdkIseURBbkJlLGtEQW1CTCxNQUFWLENBTnVCO09BQU4sQ0FBbkIsQ0FIVTs7Ozt3QkFhUixPQUFPOzs7d0JBakJFO0FBQ1gsYUFBTyxLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FESTs7O1NBTk0iLCJmaWxlIjoiU2lnbmFsQWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5cblxuLyoqXG4gKiBDYWxsIGl0J3Mgb2JzZXJ2ZXJzIHdpdGggdHJ1ZSB3aGVuIGFsbCBpdHMgYWRkZWQgYFNpZ25hbGAgaW5zdGFuY2VzIGFyZSBzZXR0ZWQgdG8gYHRydWVgLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZ25hbEFsbCBleHRlbmRzIFNpZ25hbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fZGVwZW5kZW5jaWVzID0gbmV3IFNldCgpO1xuICB9XG5cbiAgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVwZW5kZW5jaWVzLnNpemU7XG4gIH1cblxuICBhZGQoc2lnbmFsKSB7XG4gICAgdGhpcy5fZGVwZW5kZW5jaWVzLmFkZChzaWduYWwpO1xuXG4gICAgc2lnbmFsLmFkZE9ic2VydmVyKCgpID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9IHRydWU7XG5cbiAgICAgIGZvciAobGV0IHNpZ25hbCBvZiB0aGlzLl9kZXBlbmRlbmNpZXMpXG4gICAgICAgIHZhbHVlID0gdmFsdWUgJiYgc2lnbmFsLmdldCgpO1xuXG4gICAgICBzdXBlci5zZXQodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbHVlKSB7IC8qIG5vb3AgKi8gfVxufVxuIl19