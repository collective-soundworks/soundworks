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

var _ServerActivity2 = require('../core/ServerActivity');

var _ServerActivity3 = _interopRequireDefault(_ServerActivity2);

var _serverServiceManager = require('../core/serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:locator';

/**
 * [server] This service allows to indicate the approximate location of the client on a map.
 *
 * (See also {@link src/client/services/ClientLocator.js~ClientLocator} on the client side.)
 */

var ServerLocator = function (_ServerActivity) {
  (0, _inherits3.default)(ServerLocator, _ServerActivity);

  function ServerLocator() {
    (0, _classCallCheck3.default)(this, ServerLocator);


    /**
     * @type {Object} defaults - Defaults options of the service
     * @attribute {String} [defaults.areaConfigItem='setup.area'] - The path to the server's area
     *  configuration entry (see {@link src/server/core/server.js~appConfig} for details).
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerLocator).call(this, SERVICE_ID));

    var defaults = {
      areaConfigItem: 'setup.area'
    };

    _this.configure(defaults);

    _this._area = null;
    _this._sharedConfigService = _this.require('shared-config');
    return _this;
  }

  /** @inheritdoc */


  (0, _createClass3.default)(ServerLocator, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerLocator.prototype), 'start', this).call(this);

      var areaConfigItem = this.options.areaConfigItem;

      this.clientTypes.forEach(function (clientType) {
        _this2._sharedConfigService.addItem(areaConfigItem, clientType);
      });
    }

    /** @inheritdoc */

  }, {
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerLocator.prototype), 'connect', this).call(this, client);

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
  return ServerLocator;
}(_ServerActivity3.default);

_serverServiceManager2.default.register(SERVICE_ID, ServerLocator);

exports.default = ServerLocator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckxvY2F0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxhQUFhLGlCQUFiOzs7Ozs7OztJQU9BOzs7QUFDSixXQURJLGFBQ0osR0FBYzt3Q0FEVixlQUNVOzs7Ozs7Ozs7NkZBRFYsMEJBRUksYUFETTs7QUFRWixRQUFNLFdBQVc7QUFDZixzQkFBZ0IsWUFBaEI7S0FESSxDQVJNOztBQVlaLFVBQUssU0FBTCxDQUFlLFFBQWYsRUFaWTs7QUFjWixVQUFLLEtBQUwsR0FBYSxJQUFiLENBZFk7QUFlWixVQUFLLG9CQUFMLEdBQTRCLE1BQUssT0FBTCxDQUFhLGVBQWIsQ0FBNUIsQ0FmWTs7R0FBZDs7Ozs7NkJBREk7OzRCQW9CSTs7O0FBQ04sdURBckJFLG1EQXFCRixDQURNOztBQUdOLFVBQU0saUJBQWlCLEtBQUssT0FBTCxDQUFhLGNBQWIsQ0FIakI7O0FBS04sV0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQXlCLFVBQUMsVUFBRCxFQUFnQjtBQUN2QyxlQUFLLG9CQUFMLENBQTBCLE9BQTFCLENBQWtDLGNBQWxDLEVBQWtELFVBQWxELEVBRHVDO09BQWhCLENBQXpCLENBTE07Ozs7Ozs7NEJBV0EsUUFBUTtBQUNkLHVEQWhDRSxzREFnQ1ksT0FBZCxDQURjOztBQUdkLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsU0FBckIsRUFBZ0MsS0FBSyxVQUFMLENBQWdCLE1BQWhCLENBQWhDLEVBSGM7QUFJZCxXQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLGFBQXJCLEVBQW9DLEtBQUssY0FBTCxDQUFvQixNQUFwQixDQUFwQyxFQUpjOzs7Ozs7OytCQVFMLFFBQVE7OztBQUNqQixhQUFPO2VBQU0sT0FBSyxJQUFMLENBQVUsTUFBVixFQUFrQixZQUFsQixFQUFnQyxPQUFLLE9BQUwsQ0FBYSxjQUFiO09BQXRDLENBRFU7Ozs7Ozs7bUNBS0osUUFBUTtBQUNyQixhQUFPLFVBQUMsV0FBRDtlQUFpQixPQUFPLFdBQVAsR0FBcUIsV0FBckI7T0FBakIsQ0FEYzs7O1NBNUNuQjs7O0FBaUROLCtCQUFxQixRQUFyQixDQUE4QixVQUE5QixFQUEwQyxhQUExQzs7a0JBRWUiLCJmaWxlIjoiU2VydmVyTG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmxvY2F0b3InO1xuXG4vKipcbiAqIFtzZXJ2ZXJdIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uIG9mIHRoZSBjbGllbnQgb24gYSBtYXAuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudExvY2F0b3IuanN+Q2xpZW50TG9jYXRvcn0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqL1xuY2xhc3MgU2VydmVyTG9jYXRvciBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fSBkZWZhdWx0cyAtIERlZmF1bHRzIG9wdGlvbnMgb2YgdGhlIHNlcnZpY2VcbiAgICAgKiBAYXR0cmlidXRlIHtTdHJpbmd9IFtkZWZhdWx0cy5hcmVhQ29uZmlnSXRlbT0nc2V0dXAuYXJlYSddIC0gVGhlIHBhdGggdG8gdGhlIHNlcnZlcidzIGFyZWFcbiAgICAgKiAgY29uZmlndXJhdGlvbiBlbnRyeSAoc2VlIHtAbGluayBzcmMvc2VydmVyL2NvcmUvc2VydmVyLmpzfmFwcENvbmZpZ30gZm9yIGRldGFpbHMpLlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgYXJlYUNvbmZpZ0l0ZW06ICdzZXR1cC5hcmVhJyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fYXJlYSA9IG51bGw7XG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZSA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBjb25zdCBhcmVhQ29uZmlnSXRlbSA9IHRoaXMub3B0aW9ucy5hcmVhQ29uZmlnSXRlbTtcblxuICAgIHRoaXMuY2xpZW50VHlwZXMuZm9yRWFjaCgoY2xpZW50VHlwZSkgPT4ge1xuICAgICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5hZGRJdGVtKGFyZWFDb25maWdJdGVtLCBjbGllbnRUeXBlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdjb29yZGluYXRlcycsIHRoaXMuX29uQ29vcmRpbmF0ZXMoY2xpZW50KSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5zZW5kKGNsaWVudCwgJ2Frbm93bGVkZ2UnLCB0aGlzLm9wdGlvbnMuYXJlYUNvbmZpZ0l0ZW0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkNvb3JkaW5hdGVzKGNsaWVudCkge1xuICAgIHJldHVybiAoY29vcmRpbmF0ZXMpID0+IGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICB9XG59XG5cbnNlcnZlclNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNlcnZlckxvY2F0b3IpO1xuXG5leHBvcnQgZGVmYXVsdCBTZXJ2ZXJMb2NhdG9yO1xuIl19