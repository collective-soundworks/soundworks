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

var _Activity2 = require('../core/Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:locator';

/**
 * Interface of the server `'locator'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'placer'`]{@link module:soundworks/server.Placer}
 * and [`'checkin'`]{@link module:soundworks/server.Checkin} services.
 *
 * The `'locator'` service allows a client to give its approximate location inside
 * a graphical representation of the `area` as defined in the server's `setup`
 * configuration entry.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Locator}*__
 *
 * @see {@link module:soundworks/server.Placer}
 * @see {@link module:soundworks/server.Checkin}
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.locator = this.require('locator');
 */

var Locator = function (_Activity) {
  (0, _inherits3.default)(Locator, _Activity);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Locator() {
    (0, _classCallCheck3.default)(this, Locator);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Locator).call(this, SERVICE_ID));

    var defaults = {
      areaConfigItem: 'setup.area'
    };

    _this.configure(defaults);

    _this._area = null;
    _this._sharedConfigService = _this.require('shared-config');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Locator, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(Locator.prototype), 'start', this).call(this);

      var areaConfigItem = this.options.areaConfigItem;

      this.clientTypes.forEach(function (clientType) {
        _this2._sharedConfigService.share(areaConfigItem, clientType);
      });
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Locator.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'coordinates', this._onCoordinates(client));
    }

    /** @private */

  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this3 = this;

      return function () {
        return _this3.send(client, 'aknowledge', _this3.options.areaConfigItem);
      };
    }

    /** @private */

  }, {
    key: '_onCoordinates',
    value: function _onCoordinates(client) {
      return function (coordinates) {
        return client.coordinates = coordinates;
      };
    }
  }]);
  return Locator;
}(_Activity3.default);

_serviceManager2.default.register(SERVICE_ID, Locator);

exports.default = Locator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvY2F0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxhQUFhLGlCQUFuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBd0JNLE87Ozs7O0FBRUoscUJBQWM7QUFBQTs7QUFBQSxpSEFDTixVQURNOztBQUdaLFFBQU0sV0FBVztBQUNmLHNCQUFnQjtBQURELEtBQWpCOztBQUlBLFVBQUssU0FBTCxDQUFlLFFBQWY7O0FBRUEsVUFBSyxLQUFMLEdBQWEsSUFBYjtBQUNBLFVBQUssb0JBQUwsR0FBNEIsTUFBSyxPQUFMLENBQWEsZUFBYixDQUE1QjtBQVZZO0FBV2I7Ozs7Ozs7NEJBR087QUFBQTs7QUFDTjs7QUFFQSxVQUFNLGlCQUFpQixLQUFLLE9BQUwsQ0FBYSxjQUFwQzs7QUFFQSxXQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBeUIsVUFBQyxVQUFELEVBQWdCO0FBQ3ZDLGVBQUssb0JBQUwsQ0FBMEIsS0FBMUIsQ0FBZ0MsY0FBaEMsRUFBZ0QsVUFBaEQ7QUFDRCxPQUZEO0FBR0Q7Ozs7Ozs0QkFHTyxNLEVBQVE7QUFDZCx1R0FBYyxNQUFkOztBQUVBLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsU0FBckIsRUFBZ0MsS0FBSyxVQUFMLENBQWdCLE1BQWhCLENBQWhDO0FBQ0EsV0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixhQUFyQixFQUFvQyxLQUFLLGNBQUwsQ0FBb0IsTUFBcEIsQ0FBcEM7QUFDRDs7Ozs7OytCQUdVLE0sRUFBUTtBQUFBOztBQUNqQixhQUFPO0FBQUEsZUFBTSxPQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLFlBQWxCLEVBQWdDLE9BQUssT0FBTCxDQUFhLGNBQTdDLENBQU47QUFBQSxPQUFQO0FBQ0Q7Ozs7OzttQ0FHYyxNLEVBQVE7QUFDckIsYUFBTyxVQUFDLFdBQUQ7QUFBQSxlQUFpQixPQUFPLFdBQVAsR0FBcUIsV0FBdEM7QUFBQSxPQUFQO0FBQ0Q7Ozs7O0FBR0gseUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxPQUFwQzs7a0JBRWUsTyIsImZpbGUiOiJMb2NhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4uL2NvcmUvQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bG9jYXRvcic7XG5cblxuLyoqXG4gKiBJbnRlcmZhY2Ugb2YgdGhlIHNlcnZlciBgJ2xvY2F0b3InYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBpcyBvbmUgb2YgdGhlIHByb3ZpZGVkIHNlcnZpY2VzIGFpbWVkIGF0IGlkZW50aWZ5aW5nIGNsaWVudHMgaW5zaWRlXG4gKiB0aGUgZXhwZXJpZW5jZSBhbG9uZyB3aXRoIHRoZSBbYCdwbGFjZXInYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlBsYWNlcn1cbiAqIGFuZCBbYCdjaGVja2luJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DaGVja2lufSBzZXJ2aWNlcy5cbiAqXG4gKiBUaGUgYCdsb2NhdG9yJ2Agc2VydmljZSBhbGxvd3MgYSBjbGllbnQgdG8gZ2l2ZSBpdHMgYXBwcm94aW1hdGUgbG9jYXRpb24gaW5zaWRlXG4gKiBhIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYGFyZWFgIGFzIGRlZmluZWQgaW4gdGhlIHNlcnZlcidzIGBzZXR1cGBcbiAqIGNvbmZpZ3VyYXRpb24gZW50cnkuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9Kl9fXG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlBsYWNlcn1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DaGVja2lufVxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMubG9jYXRvciA9IHRoaXMucmVxdWlyZSgnbG9jYXRvcicpO1xuICovXG5jbGFzcyBMb2NhdG9yIGV4dGVuZHMgQWN0aXZpdHkge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBhcmVhQ29uZmlnSXRlbTogJ3NldHVwLmFyZWEnLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9hcmVhID0gbnVsbDtcbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGNvbnN0IGFyZWFDb25maWdJdGVtID0gdGhpcy5vcHRpb25zLmFyZWFDb25maWdJdGVtO1xuXG4gICAgdGhpcy5jbGllbnRUeXBlcy5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLnNoYXJlKGFyZWFDb25maWdJdGVtLCBjbGllbnRUeXBlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdjb29yZGluYXRlcycsIHRoaXMuX29uQ29vcmRpbmF0ZXMoY2xpZW50KSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5zZW5kKGNsaWVudCwgJ2Frbm93bGVkZ2UnLCB0aGlzLm9wdGlvbnMuYXJlYUNvbmZpZ0l0ZW0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkNvb3JkaW5hdGVzKGNsaWVudCkge1xuICAgIHJldHVybiAoY29vcmRpbmF0ZXMpID0+IGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIExvY2F0b3IpO1xuXG5leHBvcnQgZGVmYXVsdCBMb2NhdG9yO1xuIl19