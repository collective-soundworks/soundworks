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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdlb2xvY2F0aW9uLmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJHZW9sb2NhdGlvbiIsImRlZmF1bHRzIiwiY29uZmlndXJlIiwicmVhZHkiLCJjbGllbnQiLCJyZWNlaXZlIiwiX29uR2VvcG9zaXRpb24iLCJwb3NpdGlvbiIsImNvb3JkcyIsImNvb3JkaW5hdGVzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJnZW9wb3NpdGlvbiIsImVtaXQiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxxQkFBbkI7O0FBRUE7Ozs7Ozs7Ozs7OztJQVdNQyxXOzs7QUFDSix5QkFBYztBQUFBOztBQUFBLGdKQUNORCxVQURNOztBQUdaLFFBQU1FLFdBQVcsRUFBakI7QUFDQSxVQUFLQyxTQUFMLENBQWVELFFBQWY7QUFKWTtBQUtiOzs7OzRCQUVPO0FBQ047O0FBRUEsV0FBS0UsS0FBTDtBQUNEOzs7NEJBRU9DLE0sRUFBUTtBQUNkLFdBQUtDLE9BQUwsQ0FBYUQsTUFBYixFQUFxQixhQUFyQixFQUFvQyxLQUFLRSxjQUFMLENBQW9CRixNQUFwQixDQUFwQztBQUNEOzs7bUNBRWNBLE0sRUFBUTtBQUFBOztBQUNyQixhQUFPLFVBQUNHLFFBQUQsRUFBYztBQUNuQixZQUFNQyxTQUFTRCxTQUFTQyxNQUF4QjtBQUNBSixlQUFPSyxXQUFQLEdBQXFCLENBQUNELE9BQU9FLFFBQVIsRUFBa0JGLE9BQU9HLFNBQXpCLENBQXJCO0FBQ0FQLGVBQU9RLFdBQVAsR0FBcUJMLFFBQXJCOztBQUVBLGVBQUtNLElBQUwsQ0FBVSxhQUFWLEVBQXlCVCxNQUF6QixFQUFpQ0EsT0FBT0ssV0FBeEMsRUFBcURMLE9BQU9RLFdBQTVEO0FBQ0QsT0FORDtBQU9EOzs7OztBQUdILHlCQUFlRSxRQUFmLENBQXdCZixVQUF4QixFQUFvQ0MsV0FBcEM7O2tCQUVlQSxXIiwiZmlsZSI6Ikdlb2xvY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmdlb2xvY2F0aW9uJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdnZW9sb2NhdGlvbidgIHNlcnZpY2UuXG4gKlxuICogVGhlIGAnZ2VvbG9jYXRpb24nYCBzZXJ2aWNlIGFsbG93cyB0byByZXRyaWV2ZSB0aGUgbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZVxuICogb2YgdGhlIGNsaWVudCB1c2luZyBgZ3BzYC4gVGhlIGN1cnJlbnQgdmFsdWVzIGFyZSBzdG9yZSBpbnRvIHRoZVxuICogYGNsaWVudC5jb29yZGluYXRlc2AgbWVtYmVyLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5HZW9sb2NhdGlvbn0qX19cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKi9cbmNsYXNzIEdlb2xvY2F0aW9uIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnZ2VvcG9zaXRpb24nLCB0aGlzLl9vbkdlb3Bvc2l0aW9uKGNsaWVudCkpO1xuICB9XG5cbiAgX29uR2VvcG9zaXRpb24oY2xpZW50KSB7XG4gICAgcmV0dXJuIChwb3NpdGlvbikgPT4ge1xuICAgICAgY29uc3QgY29vcmRzID0gcG9zaXRpb24uY29vcmRzO1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gW2Nvb3Jkcy5sYXRpdHVkZSwgY29vcmRzLmxvbmdpdHVkZV07XG4gICAgICBjbGllbnQuZ2VvcG9zaXRpb24gPSBwb3NpdGlvbjtcblxuICAgICAgdGhpcy5lbWl0KCdnZW9wb3NpdGlvbicsIGNsaWVudCwgY2xpZW50LmNvb3JkaW5hdGVzLCBjbGllbnQuZ2VvcG9zaXRpb24pO1xuICAgIH1cbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBHZW9sb2NhdGlvbik7XG5cbmV4cG9ydCBkZWZhdWx0IEdlb2xvY2F0aW9uO1xuIl19