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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvY2F0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxhQUFhLGlCQUFiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF3QkE7Ozs7O0FBRUosV0FGSSxPQUVKLEdBQWM7d0NBRlYsU0FFVTs7NkZBRlYsb0JBR0ksYUFETTs7QUFHWixRQUFNLFdBQVc7QUFDZixzQkFBZ0IsWUFBaEI7S0FESSxDQUhNOztBQU9aLFVBQUssU0FBTCxDQUFlLFFBQWYsRUFQWTs7QUFTWixVQUFLLEtBQUwsR0FBYSxJQUFiLENBVFk7QUFVWixVQUFLLG9CQUFMLEdBQTRCLE1BQUssT0FBTCxDQUFhLGVBQWIsQ0FBNUIsQ0FWWTs7R0FBZDs7Ozs7NkJBRkk7OzRCQWdCSTs7O0FBQ04sdURBakJFLDZDQWlCRixDQURNOztBQUdOLFVBQU0saUJBQWlCLEtBQUssT0FBTCxDQUFhLGNBQWIsQ0FIakI7O0FBS04sV0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQXlCLFVBQUMsVUFBRCxFQUFnQjtBQUN2QyxlQUFLLG9CQUFMLENBQTBCLEtBQTFCLENBQWdDLGNBQWhDLEVBQWdELFVBQWhELEVBRHVDO09BQWhCLENBQXpCLENBTE07Ozs7Ozs7NEJBV0EsUUFBUTtBQUNkLHVEQTVCRSxnREE0QlksT0FBZCxDQURjOztBQUdkLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsU0FBckIsRUFBZ0MsS0FBSyxVQUFMLENBQWdCLE1BQWhCLENBQWhDLEVBSGM7QUFJZCxXQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLGFBQXJCLEVBQW9DLEtBQUssY0FBTCxDQUFvQixNQUFwQixDQUFwQyxFQUpjOzs7Ozs7OytCQVFMLFFBQVE7OztBQUNqQixhQUFPO2VBQU0sT0FBSyxJQUFMLENBQVUsTUFBVixFQUFrQixZQUFsQixFQUFnQyxPQUFLLE9BQUwsQ0FBYSxjQUFiO09BQXRDLENBRFU7Ozs7Ozs7bUNBS0osUUFBUTtBQUNyQixhQUFPLFVBQUMsV0FBRDtlQUFpQixPQUFPLFdBQVAsR0FBcUIsV0FBckI7T0FBakIsQ0FEYzs7O1NBeENuQjs7O0FBNkNOLHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsT0FBcEM7O2tCQUVlIiwiZmlsZSI6IkxvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpsb2NhdG9yJztcblxuXG4vKipcbiAqIEludGVyZmFjZSBvZiB0aGUgc2VydmVyIGAnbG9jYXRvcidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGlzIG9uZSBvZiB0aGUgcHJvdmlkZWQgc2VydmljZXMgYWltZWQgYXQgaWRlbnRpZnlpbmcgY2xpZW50cyBpbnNpZGVcbiAqIHRoZSBleHBlcmllbmNlIGFsb25nIHdpdGggdGhlIFtgJ3BsYWNlcidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuUGxhY2VyfVxuICogYW5kIFtgJ2NoZWNraW4nYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNoZWNraW59IHNlcnZpY2VzLlxuICpcbiAqIFRoZSBgJ2xvY2F0b3InYCBzZXJ2aWNlIGFsbG93cyBhIGNsaWVudCB0byBnaXZlIGl0cyBhcHByb3hpbWF0ZSBsb2NhdGlvbiBpbnNpZGVcbiAqIGEgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBgYXJlYWAgYXMgZGVmaW5lZCBpbiB0aGUgc2VydmVyJ3MgYHNldHVwYFxuICogY29uZmlndXJhdGlvbiBlbnRyeS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn0qX19cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuUGxhY2VyfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNoZWNraW59XG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5sb2NhdG9yID0gdGhpcy5yZXF1aXJlKCdsb2NhdG9yJyk7XG4gKi9cbmNsYXNzIExvY2F0b3IgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGFyZWFDb25maWdJdGVtOiAnc2V0dXAuYXJlYScsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX2FyZWEgPSBudWxsO1xuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgY29uc3QgYXJlYUNvbmZpZ0l0ZW0gPSB0aGlzLm9wdGlvbnMuYXJlYUNvbmZpZ0l0ZW07XG5cbiAgICB0aGlzLmNsaWVudFR5cGVzLmZvckVhY2goKGNsaWVudFR5cGUpID0+IHtcbiAgICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2Uuc2hhcmUoYXJlYUNvbmZpZ0l0ZW0sIGNsaWVudFR5cGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2Nvb3JkaW5hdGVzJywgdGhpcy5fb25Db29yZGluYXRlcyhjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB0aGlzLnNlbmQoY2xpZW50LCAnYWtub3dsZWRnZScsIHRoaXMub3B0aW9ucy5hcmVhQ29uZmlnSXRlbSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQ29vcmRpbmF0ZXMoY2xpZW50KSB7XG4gICAgcmV0dXJuIChjb29yZGluYXRlcykgPT4gY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgTG9jYXRvcik7XG5cbmV4cG9ydCBkZWZhdWx0IExvY2F0b3I7XG4iXX0=