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
 * [server] This service allows to indicate the approximate location of the client on a map.
 *
 * (See also {@link src/client/services/ClientLocator.js~ClientLocator} on the client side.)
 */

var Locator = function (_Activity) {
  (0, _inherits3.default)(Locator, _Activity);

  function Locator() {
    (0, _classCallCheck3.default)(this, Locator);


    /**
     * @type {Object} defaults - Defaults options of the service
     * @attribute {String} [defaults.areaConfigItem='setup.area'] - The path to the server's area
     *  configuration entry (see {@link src/server/core/server.js~appConfig} for details).
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Locator).call(this, SERVICE_ID));

    var defaults = {
      areaConfigItem: 'setup.area'
    };

    _this.configure(defaults);

    _this._area = null;
    _this._sharedConfigService = _this.require('shared-config');
    return _this;
  }

  /** @inheritdoc */


  (0, _createClass3.default)(Locator, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(Locator.prototype), 'start', this).call(this);

      var areaConfigItem = this.options.areaConfigItem;

      this.clientTypes.forEach(function (clientType) {
        _this2._sharedConfigService.addItem(areaConfigItem, clientType);
      });
    }

    /** @inheritdoc */

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvY2F0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxhQUFhLGlCQUFiOzs7Ozs7OztJQU9BOzs7QUFDSixXQURJLE9BQ0osR0FBYzt3Q0FEVixTQUNVOzs7Ozs7Ozs7NkZBRFYsb0JBRUksYUFETTs7QUFRWixRQUFNLFdBQVc7QUFDZixzQkFBZ0IsWUFBaEI7S0FESSxDQVJNOztBQVlaLFVBQUssU0FBTCxDQUFlLFFBQWYsRUFaWTs7QUFjWixVQUFLLEtBQUwsR0FBYSxJQUFiLENBZFk7QUFlWixVQUFLLG9CQUFMLEdBQTRCLE1BQUssT0FBTCxDQUFhLGVBQWIsQ0FBNUIsQ0FmWTs7R0FBZDs7Ozs7NkJBREk7OzRCQW9CSTs7O0FBQ04sdURBckJFLDZDQXFCRixDQURNOztBQUdOLFVBQU0saUJBQWlCLEtBQUssT0FBTCxDQUFhLGNBQWIsQ0FIakI7O0FBS04sV0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQXlCLFVBQUMsVUFBRCxFQUFnQjtBQUN2QyxlQUFLLG9CQUFMLENBQTBCLE9BQTFCLENBQWtDLGNBQWxDLEVBQWtELFVBQWxELEVBRHVDO09BQWhCLENBQXpCLENBTE07Ozs7Ozs7NEJBV0EsUUFBUTtBQUNkLHVEQWhDRSxnREFnQ1ksT0FBZCxDQURjOztBQUdkLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsU0FBckIsRUFBZ0MsS0FBSyxVQUFMLENBQWdCLE1BQWhCLENBQWhDLEVBSGM7QUFJZCxXQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLGFBQXJCLEVBQW9DLEtBQUssY0FBTCxDQUFvQixNQUFwQixDQUFwQyxFQUpjOzs7Ozs7OytCQVFMLFFBQVE7OztBQUNqQixhQUFPO2VBQU0sT0FBSyxJQUFMLENBQVUsTUFBVixFQUFrQixZQUFsQixFQUFnQyxPQUFLLE9BQUwsQ0FBYSxjQUFiO09BQXRDLENBRFU7Ozs7Ozs7bUNBS0osUUFBUTtBQUNyQixhQUFPLFVBQUMsV0FBRDtlQUFpQixPQUFPLFdBQVAsR0FBcUIsV0FBckI7T0FBakIsQ0FEYzs7O1NBNUNuQjs7O0FBaUROLHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsT0FBcEM7O2tCQUVlIiwiZmlsZSI6IkxvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpsb2NhdG9yJztcblxuLyoqXG4gKiBbc2VydmVyXSBUaGlzIHNlcnZpY2UgYWxsb3dzIHRvIGluZGljYXRlIHRoZSBhcHByb3hpbWF0ZSBsb2NhdGlvbiBvZiB0aGUgY2xpZW50IG9uIGEgbWFwLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9zZXJ2aWNlcy9DbGllbnRMb2NhdG9yLmpzfkNsaWVudExvY2F0b3J9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKi9cbmNsYXNzIExvY2F0b3IgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH0gZGVmYXVsdHMgLSBEZWZhdWx0cyBvcHRpb25zIG9mIHRoZSBzZXJ2aWNlXG4gICAgICogQGF0dHJpYnV0ZSB7U3RyaW5nfSBbZGVmYXVsdHMuYXJlYUNvbmZpZ0l0ZW09J3NldHVwLmFyZWEnXSAtIFRoZSBwYXRoIHRvIHRoZSBzZXJ2ZXIncyBhcmVhXG4gICAgICogIGNvbmZpZ3VyYXRpb24gZW50cnkgKHNlZSB7QGxpbmsgc3JjL3NlcnZlci9jb3JlL3NlcnZlci5qc35hcHBDb25maWd9IGZvciBkZXRhaWxzKS5cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGFyZWFDb25maWdJdGVtOiAnc2V0dXAuYXJlYScsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX2FyZWEgPSBudWxsO1xuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgY29uc3QgYXJlYUNvbmZpZ0l0ZW0gPSB0aGlzLm9wdGlvbnMuYXJlYUNvbmZpZ0l0ZW07XG5cbiAgICB0aGlzLmNsaWVudFR5cGVzLmZvckVhY2goKGNsaWVudFR5cGUpID0+IHtcbiAgICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UuYWRkSXRlbShhcmVhQ29uZmlnSXRlbSwgY2xpZW50VHlwZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnY29vcmRpbmF0ZXMnLCB0aGlzLl9vbkNvb3JkaW5hdGVzKGNsaWVudCkpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHRoaXMuc2VuZChjbGllbnQsICdha25vd2xlZGdlJywgdGhpcy5vcHRpb25zLmFyZWFDb25maWdJdGVtKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Db29yZGluYXRlcyhjbGllbnQpIHtcbiAgICByZXR1cm4gKGNvb3JkaW5hdGVzKSA9PiBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBMb2NhdG9yKTtcblxuZXhwb3J0IGRlZmF1bHQgTG9jYXRvcjtcbiJdfQ==