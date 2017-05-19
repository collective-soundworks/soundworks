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

var Experience_ID = 'basic-shared-controller';

/**
 * Server-side experience to create 1 liner controllers
 *
 * @memberof module:soundworks/server
 */

var ControllerExperience = function (_Experience) {
  (0, _inherits3.default)(ControllerExperience, _Experience);

  function ControllerExperience(clientTypes) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, ControllerExperience);

    /**
     * Instance of the server-side `shared-params` service.
     * @type {module:soundworks/server.SharedParams}
     * @name sharedParams
     * @instance
     * @memberof module:soundworks/server.ControllerExperience
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (ControllerExperience.__proto__ || (0, _getPrototypeOf2.default)(ControllerExperience)).call(this, clientTypes));

    _this.sharedParams = _this.require('shared-params');

    if (options.auth) _this.auth = _this.require('auth');
    return _this;
  }

  return ControllerExperience;
}(_Experience3.default);

exports.default = ControllerExperience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRyb2xsZXJFeHBlcmllbmNlLmpzIl0sIm5hbWVzIjpbIkV4cGVyaWVuY2VfSUQiLCJDb250cm9sbGVyRXhwZXJpZW5jZSIsImNsaWVudFR5cGVzIiwib3B0aW9ucyIsInNoYXJlZFBhcmFtcyIsInJlcXVpcmUiLCJhdXRoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBLElBQU1BLGdCQUFnQix5QkFBdEI7O0FBRUE7Ozs7OztJQUtNQyxvQjs7O0FBQ0osZ0NBQVlDLFdBQVosRUFBdUM7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFHckM7Ozs7Ozs7QUFIcUMsa0tBQy9CRCxXQUQrQjs7QUFVckMsVUFBS0UsWUFBTCxHQUFvQixNQUFLQyxPQUFMLENBQWEsZUFBYixDQUFwQjs7QUFFQSxRQUFJRixRQUFRRyxJQUFaLEVBQ0UsTUFBS0EsSUFBTCxHQUFZLE1BQUtELE9BQUwsQ0FBYSxNQUFiLENBQVo7QUFibUM7QUFjdEM7Ozs7O2tCQUdZSixvQiIsImZpbGUiOiJDb250cm9sbGVyRXhwZXJpZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFeHBlcmllbmNlIGZyb20gJy4uL2NvcmUvRXhwZXJpZW5jZSc7XG5cbmNvbnN0IEV4cGVyaWVuY2VfSUQgPSAnYmFzaWMtc2hhcmVkLWNvbnRyb2xsZXInO1xuXG4vKipcbiAqIFNlcnZlci1zaWRlIGV4cGVyaWVuY2UgdG8gY3JlYXRlIDEgbGluZXIgY29udHJvbGxlcnNcbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKi9cbmNsYXNzIENvbnRyb2xsZXJFeHBlcmllbmNlIGV4dGVuZHMgRXhwZXJpZW5jZSB7XG4gIGNvbnN0cnVjdG9yKGNsaWVudFR5cGVzLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihjbGllbnRUeXBlcyk7XG5cbiAgICAvKipcbiAgICAgKiBJbnN0YW5jZSBvZiB0aGUgc2VydmVyLXNpZGUgYHNoYXJlZC1wYXJhbXNgIHNlcnZpY2UuXG4gICAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5TaGFyZWRQYXJhbXN9XG4gICAgICogQG5hbWUgc2hhcmVkUGFyYW1zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5Db250cm9sbGVyRXhwZXJpZW5jZVxuICAgICAqL1xuICAgIHRoaXMuc2hhcmVkUGFyYW1zID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtcGFyYW1zJyk7XG5cbiAgICBpZiAob3B0aW9ucy5hdXRoKVxuICAgICAgdGhpcy5hdXRoID0gdGhpcy5yZXF1aXJlKCdhdXRoJyk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29udHJvbGxlckV4cGVyaWVuY2VcbiJdfQ==