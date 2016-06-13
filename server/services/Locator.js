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

var SERVICE_ID = 'service:locator';

/**
 * Interface for the server `'locator'` service.
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

var Locator = function (_Service) {
  (0, _inherits3.default)(Locator, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Locator() {
    (0, _classCallCheck3.default)(this, Locator);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Locator).call(this, SERVICE_ID));

    var defaults = {
      configItem: 'setup.area'
    };

    _this.configure(defaults);

    _this._area = null;
    _this._sharedConfig = _this.require('shared-config');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Locator, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(Locator.prototype), 'start', this).call(this);

      var configItem = this.options.configItem;

      if (this._sharedConfig.get(configItem) === null) throw new Error('"service:locator": server.config.' + configItem + ' is not defined');

      this.clientTypes.forEach(function (clientType) {
        _this2._sharedConfig.share(configItem, clientType);
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
        return _this3.send(client, 'aknowledge', _this3.options.configItem);
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
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Locator);

exports.default = Locator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvY2F0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxhQUFhLGlCQUFuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBd0JNLE87Ozs7O0FBRUoscUJBQWM7QUFBQTs7QUFBQSxpSEFDTixVQURNOztBQUdaLFFBQU0sV0FBVztBQUNmLGtCQUFZO0FBREcsS0FBakI7O0FBSUEsVUFBSyxTQUFMLENBQWUsUUFBZjs7QUFFQSxVQUFLLEtBQUwsR0FBYSxJQUFiO0FBQ0EsVUFBSyxhQUFMLEdBQXFCLE1BQUssT0FBTCxDQUFhLGVBQWIsQ0FBckI7QUFWWTtBQVdiOzs7Ozs7OzRCQUdPO0FBQUE7O0FBQ047O0FBRUEsVUFBTSxhQUFhLEtBQUssT0FBTCxDQUFhLFVBQWhDOztBQUVBLFVBQUksS0FBSyxhQUFMLENBQW1CLEdBQW5CLENBQXVCLFVBQXZCLE1BQXVDLElBQTNDLEVBQ0UsTUFBTSxJQUFJLEtBQUosdUNBQThDLFVBQTlDLHFCQUFOOztBQUVGLFdBQUssV0FBTCxDQUFpQixPQUFqQixDQUF5QixVQUFDLFVBQUQsRUFBZ0I7QUFDdkMsZUFBSyxhQUFMLENBQW1CLEtBQW5CLENBQXlCLFVBQXpCLEVBQXFDLFVBQXJDO0FBQ0QsT0FGRDtBQUdEOzs7Ozs7NEJBR08sTSxFQUFRO0FBQ2QsdUdBQWMsTUFBZDs7QUFFQSxXQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLFNBQXJCLEVBQWdDLEtBQUssVUFBTCxDQUFnQixNQUFoQixDQUFoQztBQUNBLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsYUFBckIsRUFBb0MsS0FBSyxjQUFMLENBQW9CLE1BQXBCLENBQXBDO0FBQ0Q7Ozs7OzsrQkFHVSxNLEVBQVE7QUFBQTs7QUFDakIsYUFBTztBQUFBLGVBQU0sT0FBSyxJQUFMLENBQVUsTUFBVixFQUFrQixZQUFsQixFQUFnQyxPQUFLLE9BQUwsQ0FBYSxVQUE3QyxDQUFOO0FBQUEsT0FBUDtBQUNEOzs7Ozs7bUNBR2MsTSxFQUFRO0FBQ3JCLGFBQU8sVUFBQyxXQUFEO0FBQUEsZUFBaUIsT0FBTyxXQUFQLEdBQXFCLFdBQXRDO0FBQUEsT0FBUDtBQUNEOzs7OztBQUdILHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsT0FBcEM7O2tCQUVlLE8iLCJmaWxlIjoiTG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpsb2NhdG9yJztcblxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHNlcnZlciBgJ2xvY2F0b3InYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBpcyBvbmUgb2YgdGhlIHByb3ZpZGVkIHNlcnZpY2VzIGFpbWVkIGF0IGlkZW50aWZ5aW5nIGNsaWVudHMgaW5zaWRlXG4gKiB0aGUgZXhwZXJpZW5jZSBhbG9uZyB3aXRoIHRoZSBbYCdwbGFjZXInYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlBsYWNlcn1cbiAqIGFuZCBbYCdjaGVja2luJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DaGVja2lufSBzZXJ2aWNlcy5cbiAqXG4gKiBUaGUgYCdsb2NhdG9yJ2Agc2VydmljZSBhbGxvd3MgYSBjbGllbnQgdG8gZ2l2ZSBpdHMgYXBwcm94aW1hdGUgbG9jYXRpb24gaW5zaWRlXG4gKiBhIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYGFyZWFgIGFzIGRlZmluZWQgaW4gdGhlIHNlcnZlcidzIGBzZXR1cGBcbiAqIGNvbmZpZ3VyYXRpb24gZW50cnkuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9Kl9fXG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlBsYWNlcn1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DaGVja2lufVxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMubG9jYXRvciA9IHRoaXMucmVxdWlyZSgnbG9jYXRvcicpO1xuICovXG5jbGFzcyBMb2NhdG9yIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbmZpZ0l0ZW06ICdzZXR1cC5hcmVhJyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fYXJlYSA9IG51bGw7XG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGNvbnN0IGNvbmZpZ0l0ZW0gPSB0aGlzLm9wdGlvbnMuY29uZmlnSXRlbTtcblxuICAgIGlmICh0aGlzLl9zaGFyZWRDb25maWcuZ2V0KGNvbmZpZ0l0ZW0pID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcInNlcnZpY2U6bG9jYXRvclwiOiBzZXJ2ZXIuY29uZmlnLiR7Y29uZmlnSXRlbX0gaXMgbm90IGRlZmluZWRgKTtcblxuICAgIHRoaXMuY2xpZW50VHlwZXMuZm9yRWFjaCgoY2xpZW50VHlwZSkgPT4ge1xuICAgICAgdGhpcy5fc2hhcmVkQ29uZmlnLnNoYXJlKGNvbmZpZ0l0ZW0sIGNsaWVudFR5cGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2Nvb3JkaW5hdGVzJywgdGhpcy5fb25Db29yZGluYXRlcyhjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB0aGlzLnNlbmQoY2xpZW50LCAnYWtub3dsZWRnZScsIHRoaXMub3B0aW9ucy5jb25maWdJdGVtKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Db29yZGluYXRlcyhjbGllbnQpIHtcbiAgICByZXR1cm4gKGNvb3JkaW5hdGVzKSA9PiBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBMb2NhdG9yKTtcblxuZXhwb3J0IGRlZmF1bHQgTG9jYXRvcjtcbiJdfQ==