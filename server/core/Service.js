'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Activity2 = require('../core/Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _Signal = require('../../utils/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base class to be extended in order to create a new service.
 *
 * @memberof module:soundworks/server
 * @extends module:soundworks/server.Activity
 */
var Service = function (_Activity) {
  (0, _inherits3.default)(Service, _Activity);

  function Service() {
    var _ref;

    (0, _classCallCheck3.default)(this, Service);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, (_ref = Service.__proto__ || (0, _getPrototypeOf2.default)(Service)).call.apply(_ref, [this].concat(args)));

    _this.signals = {};
    _this.signals.ready = new _Signal2.default();
    return _this;
  }

  (0, _createClass3.default)(Service, [{
    key: 'ready',
    value: function ready() {
      this.signals.ready.set(true);
    }
  }]);
  return Service;
}(_Activity3.default);

exports.default = Service;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZpY2UuanMiXSwibmFtZXMiOlsiU2VydmljZSIsImFyZ3MiLCJzaWduYWxzIiwicmVhZHkiLCJzZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7OztJQU1NQSxPOzs7QUFDSixxQkFBcUI7QUFBQTs7QUFBQTs7QUFBQSxzQ0FBTkMsSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQUEsbUtBQ1ZBLElBRFU7O0FBR25CLFVBQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0EsVUFBS0EsT0FBTCxDQUFhQyxLQUFiLEdBQXFCLHNCQUFyQjtBQUptQjtBQUtwQjs7Ozs0QkFFTztBQUNOLFdBQUtELE9BQUwsQ0FBYUMsS0FBYixDQUFtQkMsR0FBbkIsQ0FBdUIsSUFBdkI7QUFDRDs7Ozs7a0JBR1lKLE8iLCJmaWxlIjoiU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuLi9jb3JlL0FjdGl2aXR5JztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi4vLi4vdXRpbHMvU2lnbmFsJztcblxuLyoqXG4gKiBCYXNlIGNsYXNzIHRvIGJlIGV4dGVuZGVkIGluIG9yZGVyIHRvIGNyZWF0ZSBhIG5ldyBzZXJ2aWNlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleHRlbmRzIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5BY3Rpdml0eVxuICovXG5jbGFzcyBTZXJ2aWNlIGV4dGVuZHMgQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICB0aGlzLnNpZ25hbHMgPSB7fTtcbiAgICB0aGlzLnNpZ25hbHMucmVhZHkgPSBuZXcgU2lnbmFsKCk7XG4gIH1cblxuICByZWFkeSgpIHtcbiAgICB0aGlzLnNpZ25hbHMucmVhZHkuc2V0KHRydWUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZpY2U7XG4iXX0=