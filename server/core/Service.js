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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZpY2UuanMiXSwibmFtZXMiOlsiU2VydmljZSIsImFyZ3MiLCJzaWduYWxzIiwicmVhZHkiLCJTaWduYWwiLCJzZXQiLCJBY3Rpdml0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7O0lBTU1BLE87OztBQUNKLHFCQUFxQjtBQUFBOztBQUFBOztBQUFBLHNDQUFOQyxJQUFNO0FBQU5BLFVBQU07QUFBQTs7QUFBQSxtS0FDVkEsSUFEVTs7QUFHbkIsVUFBS0MsT0FBTCxHQUFlLEVBQWY7QUFDQSxVQUFLQSxPQUFMLENBQWFDLEtBQWIsR0FBcUIsSUFBSUMsZ0JBQUosRUFBckI7QUFKbUI7QUFLcEI7Ozs7NEJBRU87QUFDTixXQUFLRixPQUFMLENBQWFDLEtBQWIsQ0FBbUJFLEdBQW5CLENBQXVCLElBQXZCO0FBQ0Q7OztFQVZtQkMsa0I7O2tCQWFQTixPIiwiZmlsZSI6IlNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9BY3Rpdml0eSc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4uLy4uL3V0aWxzL1NpZ25hbCc7XG5cbi8qKlxuICogQmFzZSBjbGFzcyB0byBiZSBleHRlbmRlZCBpbiBvcmRlciB0byBjcmVhdGUgYSBuZXcgc2VydmljZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQWN0aXZpdHlcbiAqL1xuY2xhc3MgU2VydmljZSBleHRlbmRzIEFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgdGhpcy5zaWduYWxzID0ge307XG4gICAgdGhpcy5zaWduYWxzLnJlYWR5ID0gbmV3IFNpZ25hbCgpO1xuICB9XG5cbiAgcmVhZHkoKSB7XG4gICAgdGhpcy5zaWduYWxzLnJlYWR5LnNldCh0cnVlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZXJ2aWNlO1xuIl19