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
  }, {
    key: 'length',
    get: function get() {
      return this._dependencies.size;
    }
  }]);

  return SignalAll;
})(_Signal3['default']);

exports['default'] = SignalAll;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvY29yZS9TaWduYWxBbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBQW1CLFVBQVU7Ozs7Ozs7OztJQU9SLFNBQVM7WUFBVCxTQUFTOztBQUNqQixXQURRLFNBQVMsR0FDZDswQkFESyxTQUFTOztBQUUxQiwrQkFGaUIsU0FBUyw2Q0FFbEI7QUFDUixRQUFJLENBQUMsYUFBYSxHQUFHLFVBQVMsQ0FBQztHQUNoQzs7ZUFKa0IsU0FBUzs7V0FVekIsYUFBQyxNQUFNLEVBQUU7OztBQUNWLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUUvQixZQUFNLENBQUMsV0FBVyxDQUFDLFlBQU07QUFDdkIsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOzs7Ozs7O0FBRWpCLDRDQUFtQixNQUFLLGFBQWE7Z0JBQTVCLE9BQU07O0FBQ2IsaUJBQUssR0FBRyxLQUFLLElBQUksT0FBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1dBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFaEMsbUNBbkJlLFNBQVMsdUNBbUJkLEtBQUssRUFBRTtPQUNsQixDQUFDLENBQUM7S0FDSjs7O1dBRUUsYUFBQyxLQUFLLEVBQUUsWUFBYzs7O1NBakJmLGVBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO0tBQ2hDOzs7U0FSa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiL1VzZXJzL21hdHVzemV3c2tpL2Rldi9jb3NpbWEvbGliL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9jb3JlL1NpZ25hbEFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuXG5cbi8qKlxuICogQ2FsbCBpdCdzIG9ic2VydmVycyB3aXRoIHRydWUgd2hlbiBhbGwgaXRzIGFkZGVkIGBTaWduYWxgIGluc3RhbmNlcyBhcmUgc2V0dGVkIHRvIGB0cnVlYCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWduYWxBbGwgZXh0ZW5kcyBTaWduYWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2RlcGVuZGVuY2llcyA9IG5ldyBTZXQoKTtcbiAgfVxuXG4gIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RlcGVuZGVuY2llcy5zaXplO1xuICB9XG5cbiAgYWRkKHNpZ25hbCkge1xuICAgIHRoaXMuX2RlcGVuZGVuY2llcy5hZGQoc2lnbmFsKTtcblxuICAgIHNpZ25hbC5hZGRPYnNlcnZlcigoKSA9PiB7XG4gICAgICBsZXQgdmFsdWUgPSB0cnVlO1xuXG4gICAgICBmb3IgKGxldCBzaWduYWwgb2YgdGhpcy5fZGVwZW5kZW5jaWVzKVxuICAgICAgICB2YWx1ZSA9IHZhbHVlICYmIHNpZ25hbC5nZXQoKTtcblxuICAgICAgc3VwZXIuc2V0KHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWx1ZSkgeyAvKiBub29wICovIH1cbn1cbiJdfQ==