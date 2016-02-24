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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2NvcmUvU2lnbmFsQWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQUFtQixVQUFVOzs7Ozs7Ozs7SUFPUixTQUFTO1lBQVQsU0FBUzs7QUFDakIsV0FEUSxTQUFTLEdBQ2Q7MEJBREssU0FBUzs7QUFFMUIsK0JBRmlCLFNBQVMsNkNBRWxCO0FBQ1IsUUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFTLENBQUM7R0FDaEM7O2VBSmtCLFNBQVM7O1dBVXpCLGFBQUMsTUFBTSxFQUFFOzs7QUFDVixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFL0IsWUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFNO0FBQ3ZCLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQzs7Ozs7OztBQUVqQiw0Q0FBbUIsTUFBSyxhQUFhO2dCQUE1QixPQUFNOztBQUNiLGlCQUFLLEdBQUcsS0FBSyxJQUFJLE9BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztXQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRWhDLG1DQW5CZSxTQUFTLHVDQW1CZCxLQUFLLEVBQUU7T0FDbEIsQ0FBQyxDQUFDO0tBQ0o7OztXQUVFLGFBQUMsS0FBSyxFQUFFLFlBQWM7OztTQWpCZixlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztLQUNoQzs7O1NBUmtCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2NvcmUvU2lnbmFsQWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5cblxuLyoqXG4gKiBDYWxsIGl0J3Mgb2JzZXJ2ZXJzIHdpdGggdHJ1ZSB3aGVuIGFsbCBpdHMgYWRkZWQgYFNpZ25hbGAgaW5zdGFuY2VzIGFyZSBzZXR0ZWQgdG8gYHRydWVgLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZ25hbEFsbCBleHRlbmRzIFNpZ25hbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fZGVwZW5kZW5jaWVzID0gbmV3IFNldCgpO1xuICB9XG5cbiAgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVwZW5kZW5jaWVzLnNpemU7XG4gIH1cblxuICBhZGQoc2lnbmFsKSB7XG4gICAgdGhpcy5fZGVwZW5kZW5jaWVzLmFkZChzaWduYWwpO1xuXG4gICAgc2lnbmFsLmFkZE9ic2VydmVyKCgpID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9IHRydWU7XG5cbiAgICAgIGZvciAobGV0IHNpZ25hbCBvZiB0aGlzLl9kZXBlbmRlbmNpZXMpXG4gICAgICAgIHZhbHVlID0gdmFsdWUgJiYgc2lnbmFsLmdldCgpO1xuXG4gICAgICBzdXBlci5zZXQodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0KHZhbHVlKSB7IC8qIG5vb3AgKi8gfVxufVxuIl19