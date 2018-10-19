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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:geolocation';

/**
 * Interface for the server `'geolocation'` service.
 *
 * The `'geolocation'` service allows to retrieve the latitude and longitude
 * of the client using `gps`. The current values are store into the
 * `client.coordinates` member.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Geolocation}*__
 *
 * @memberof module:soundworks/server
 */

var Geolocation = function (_Service) {
  (0, _inherits3.default)(Geolocation, _Service);

  function Geolocation() {
    (0, _classCallCheck3.default)(this, Geolocation);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Geolocation.__proto__ || (0, _getPrototypeOf2.default)(Geolocation)).call(this, SERVICE_ID));

    var defaults = {};
    _this.configure(defaults);
    return _this;
  }

  (0, _createClass3.default)(Geolocation, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(Geolocation.prototype.__proto__ || (0, _getPrototypeOf2.default)(Geolocation.prototype), 'start', this).call(this);

      this.ready();
    }
  }, {
    key: 'connect',
    value: function connect(client) {
      this.receive(client, 'geoposition', this._onGeoposition(client));
    }
  }, {
    key: '_onGeoposition',
    value: function _onGeoposition(client) {
      var _this2 = this;

      return function (position) {
        var coords = position.coords;
        client.coordinates = [coords.latitude, coords.longitude];
        client.geoposition = position;

        _this2.emit('geoposition', client, client.coordinates, client.geoposition);
      };
    }
  }]);
  return Geolocation;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Geolocation);

exports.default = Geolocation;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdlb2xvY2F0aW9uLmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJHZW9sb2NhdGlvbiIsImRlZmF1bHRzIiwiY29uZmlndXJlIiwicmVhZHkiLCJjbGllbnQiLCJyZWNlaXZlIiwiX29uR2VvcG9zaXRpb24iLCJwb3NpdGlvbiIsImNvb3JkcyIsImNvb3JkaW5hdGVzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJnZW9wb3NpdGlvbiIsImVtaXQiLCJTZXJ2aWNlIiwic2VydmljZU1hbmFnZXIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxxQkFBbkI7O0FBRUE7Ozs7Ozs7Ozs7OztJQVdNQyxXOzs7QUFDSix5QkFBYztBQUFBOztBQUFBLGdKQUNORCxVQURNOztBQUdaLFFBQU1FLFdBQVcsRUFBakI7QUFDQSxVQUFLQyxTQUFMLENBQWVELFFBQWY7QUFKWTtBQUtiOzs7OzRCQUVPO0FBQ047O0FBRUEsV0FBS0UsS0FBTDtBQUNEOzs7NEJBRU9DLE0sRUFBUTtBQUNkLFdBQUtDLE9BQUwsQ0FBYUQsTUFBYixFQUFxQixhQUFyQixFQUFvQyxLQUFLRSxjQUFMLENBQW9CRixNQUFwQixDQUFwQztBQUNEOzs7bUNBRWNBLE0sRUFBUTtBQUFBOztBQUNyQixhQUFPLFVBQUNHLFFBQUQsRUFBYztBQUNuQixZQUFNQyxTQUFTRCxTQUFTQyxNQUF4QjtBQUNBSixlQUFPSyxXQUFQLEdBQXFCLENBQUNELE9BQU9FLFFBQVIsRUFBa0JGLE9BQU9HLFNBQXpCLENBQXJCO0FBQ0FQLGVBQU9RLFdBQVAsR0FBcUJMLFFBQXJCOztBQUVBLGVBQUtNLElBQUwsQ0FBVSxhQUFWLEVBQXlCVCxNQUF6QixFQUFpQ0EsT0FBT0ssV0FBeEMsRUFBcURMLE9BQU9RLFdBQTVEO0FBQ0QsT0FORDtBQU9EOzs7RUExQnVCRSxpQjs7QUE2QjFCQyx5QkFBZUMsUUFBZixDQUF3QmpCLFVBQXhCLEVBQW9DQyxXQUFwQzs7a0JBRWVBLFciLCJmaWxlIjoiR2VvbG9jYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6Z2VvbG9jYXRpb24nO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHNlcnZlciBgJ2dlb2xvY2F0aW9uJ2Agc2VydmljZS5cbiAqXG4gKiBUaGUgYCdnZW9sb2NhdGlvbidgIHNlcnZpY2UgYWxsb3dzIHRvIHJldHJpZXZlIHRoZSBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlXG4gKiBvZiB0aGUgY2xpZW50IHVzaW5nIGBncHNgLiBUaGUgY3VycmVudCB2YWx1ZXMgYXJlIHN0b3JlIGludG8gdGhlXG4gKiBgY2xpZW50LmNvb3JkaW5hdGVzYCBtZW1iZXIuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50Lkdlb2xvY2F0aW9ufSpfX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqL1xuY2xhc3MgR2VvbG9jYXRpb24gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHt9O1xuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdnZW9wb3NpdGlvbicsIHRoaXMuX29uR2VvcG9zaXRpb24oY2xpZW50KSk7XG4gIH1cblxuICBfb25HZW9wb3NpdGlvbihjbGllbnQpIHtcbiAgICByZXR1cm4gKHBvc2l0aW9uKSA9PiB7XG4gICAgICBjb25zdCBjb29yZHMgPSBwb3NpdGlvbi5jb29yZHM7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBbY29vcmRzLmxhdGl0dWRlLCBjb29yZHMubG9uZ2l0dWRlXTtcbiAgICAgIGNsaWVudC5nZW9wb3NpdGlvbiA9IHBvc2l0aW9uO1xuXG4gICAgICB0aGlzLmVtaXQoJ2dlb3Bvc2l0aW9uJywgY2xpZW50LCBjbGllbnQuY29vcmRpbmF0ZXMsIGNsaWVudC5nZW9wb3NpdGlvbik7XG4gICAgfVxuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIEdlb2xvY2F0aW9uKTtcblxuZXhwb3J0IGRlZmF1bHQgR2VvbG9jYXRpb247XG4iXX0=