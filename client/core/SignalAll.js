'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Signal2 = require('./Signal');

var _Signal3 = _interopRequireDefault(_Signal2);

/**
 * Call it's observers with true when all its added `Signal` instances are setted to `true`, `false` otherwise.
 * @private
 */

var SignalAll = (function (_Signal) {
  _inherits(SignalAll, _Signal);

  function SignalAll() {
    _classCallCheck(this, SignalAll);

    _get(Object.getPrototypeOf(SignalAll.prototype), 'constructor', this).call(this);
    this._dependencies = new _Set();
  }

  _createClass(SignalAll, [{
    key: 'add',
    value: function add(signal) {
      var _this = this;

      this._dependencies.add(signal);

      signal.addObserver(function () {
        var value = true;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _getIterator(_this._dependencies), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _signal = _step.value;

            value = value && _signal.get();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        _get(Object.getPrototypeOf(SignalAll.prototype), 'set', _this).call(_this, value);
      });
    }
  }, {
    key: 'set',
    value: function set(value) {/* noop */}
  }]);

  return SignalAll;
})(_Signal3['default']);

exports['default'] = SignalAll;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9TaWduYWxBbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBQW1CLFVBQVU7Ozs7Ozs7OztJQU9SLFNBQVM7WUFBVCxTQUFTOztBQUNqQixXQURRLFNBQVMsR0FDZDswQkFESyxTQUFTOztBQUUxQiwrQkFGaUIsU0FBUyw2Q0FFbEI7QUFDUixRQUFJLENBQUMsYUFBYSxHQUFHLFVBQVMsQ0FBQztHQUNoQzs7ZUFKa0IsU0FBUzs7V0FNekIsYUFBQyxNQUFNLEVBQUU7OztBQUNWLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUUvQixZQUFNLENBQUMsV0FBVyxDQUFDLFlBQU07QUFDdkIsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOzs7Ozs7O0FBRWpCLDRDQUFtQixNQUFLLGFBQWE7Z0JBQTVCLE9BQU07O0FBQ2IsaUJBQUssR0FBRyxLQUFLLElBQUksT0FBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1dBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFaEMsbUNBZmUsU0FBUyx1Q0FlZCxLQUFLLEVBQUU7T0FDbEIsQ0FBQyxDQUFDO0tBQ0o7OztXQUVFLGFBQUMsS0FBSyxFQUFFLFlBQWM7OztTQW5CTixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiJzcmMvY2xpZW50L2NvcmUvU2lnbmFsQWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5cblxuLyoqXG4gKiBDYWxsIGl0J3Mgb2JzZXJ2ZXJzIHdpdGggdHJ1ZSB3aGVuIGFsbCBpdHMgYWRkZWQgYFNpZ25hbGAgaW5zdGFuY2VzIGFyZSBzZXR0ZWQgdG8gYHRydWVgLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZ25hbEFsbCBleHRlbmRzIFNpZ25hbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fZGVwZW5kZW5jaWVzID0gbmV3IFNldCgpO1xuICB9XG5cbiAgYWRkKHNpZ25hbCkge1xuICAgIHRoaXMuX2RlcGVuZGVuY2llcy5hZGQoc2lnbmFsKTtcblxuICAgIHNpZ25hbC5hZGRPYnNlcnZlcigoKSA9PiB7XG4gICAgICBsZXQgdmFsdWUgPSB0cnVlO1xuXG4gICAgICBmb3IgKGxldCBzaWduYWwgb2YgdGhpcy5fZGVwZW5kZW5jaWVzKVxuICAgICAgICB2YWx1ZSA9IHZhbHVlICYmIHNpZ25hbC5nZXQoKTtcblxuICAgICAgc3VwZXIuc2V0KHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWx1ZSkgeyAvKiBub29wICovIH1cbn1cbiJdfQ==