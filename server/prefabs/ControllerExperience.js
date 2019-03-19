'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Experience2 = require('../core/Experience');

var _Experience3 = _interopRequireDefault(_Experience2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Server-side experience to create 1 liner controllers
 *
 * @deprecated
 * @memberof module:soundworks/server
 */
var ControllerExperience = function (_Experience) {
  (0, _inherits3.default)(ControllerExperience, _Experience);

  function ControllerExperience(clientTypes) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, ControllerExperience);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ControllerExperience.__proto__ || (0, _getPrototypeOf2.default)(ControllerExperience)).call(this, clientTypes));

    console.error('[deprecated] ControllerExperience is deprecated, has moved in soundworks-template and will be removed in soundworks#v3.0.0. Please consider updating your application from soundworks-template');

    /**
     * Instance of the server-side `shared-params` service.
     * @type {module:soundworks/server.SharedParams}
     * @name sharedParams
     * @instance
     * @memberof module:soundworks/server.ControllerExperience
     */
    _this.sharedParams = _this.require('shared-params');

    if (options.auth) _this.auth = _this.require('auth');
    return _this;
  }

  return ControllerExperience;
}(_Experience3.default);

exports.default = ControllerExperience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRyb2xsZXJFeHBlcmllbmNlLmpzIl0sIm5hbWVzIjpbIkNvbnRyb2xsZXJFeHBlcmllbmNlIiwiY2xpZW50VHlwZXMiLCJvcHRpb25zIiwiY29uc29sZSIsImVycm9yIiwic2hhcmVkUGFyYW1zIiwicmVxdWlyZSIsImF1dGgiLCJFeHBlcmllbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBOzs7Ozs7SUFNTUEsb0I7OztBQUNKLGdDQUFZQyxXQUFaLEVBQXVDO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQUEsa0tBQy9CRCxXQUQrQjs7QUFHckNFLFlBQVFDLEtBQVIsQ0FBYyxnTUFBZDs7QUFFQTs7Ozs7OztBQU9BLFVBQUtDLFlBQUwsR0FBb0IsTUFBS0MsT0FBTCxDQUFhLGVBQWIsQ0FBcEI7O0FBRUEsUUFBSUosUUFBUUssSUFBWixFQUNFLE1BQUtBLElBQUwsR0FBWSxNQUFLRCxPQUFMLENBQWEsTUFBYixDQUFaO0FBZm1DO0FBZ0J0Qzs7O0VBakJnQ0Usb0I7O2tCQW9CcEJSLG9CIiwiZmlsZSI6IkNvbnRyb2xsZXJFeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV4cGVyaWVuY2UgZnJvbSAnLi4vY29yZS9FeHBlcmllbmNlJztcblxuLyoqXG4gKiBTZXJ2ZXItc2lkZSBleHBlcmllbmNlIHRvIGNyZWF0ZSAxIGxpbmVyIGNvbnRyb2xsZXJzXG4gKlxuICogQGRlcHJlY2F0ZWRcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqL1xuY2xhc3MgQ29udHJvbGxlckV4cGVyaWVuY2UgZXh0ZW5kcyBFeHBlcmllbmNlIHtcbiAgY29uc3RydWN0b3IoY2xpZW50VHlwZXMsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGNsaWVudFR5cGVzKTtcblxuICAgIGNvbnNvbGUuZXJyb3IoJ1tkZXByZWNhdGVkXSBDb250cm9sbGVyRXhwZXJpZW5jZSBpcyBkZXByZWNhdGVkLCBoYXMgbW92ZWQgaW4gc291bmR3b3Jrcy10ZW1wbGF0ZSBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHNvdW5kd29ya3MjdjMuMC4wLiBQbGVhc2UgY29uc2lkZXIgdXBkYXRpbmcgeW91ciBhcHBsaWNhdGlvbiBmcm9tIHNvdW5kd29ya3MtdGVtcGxhdGUnKTtcblxuICAgIC8qKlxuICAgICAqIEluc3RhbmNlIG9mIHRoZSBzZXJ2ZXItc2lkZSBgc2hhcmVkLXBhcmFtc2Agc2VydmljZS5cbiAgICAgKiBAdHlwZSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlNoYXJlZFBhcmFtc31cbiAgICAgKiBAbmFtZSBzaGFyZWRQYXJhbXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNvbnRyb2xsZXJFeHBlcmllbmNlXG4gICAgICovXG4gICAgdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcblxuICAgIGlmIChvcHRpb25zLmF1dGgpXG4gICAgICB0aGlzLmF1dGggPSB0aGlzLnJlcXVpcmUoJ2F1dGgnKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyRXhwZXJpZW5jZTtcbiJdfQ==