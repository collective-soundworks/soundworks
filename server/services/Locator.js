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

    var _this = (0, _possibleConstructorReturn3.default)(this, (Locator.__proto__ || (0, _getPrototypeOf2.default)(Locator)).call(this, SERVICE_ID));

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

      (0, _get3.default)(Locator.prototype.__proto__ || (0, _getPrototypeOf2.default)(Locator.prototype), 'start', this).call(this);

      var configItem = this.options.configItem;

      if (this._sharedConfig.get(configItem) === null) throw new Error('"service:locator": server.config.' + configItem + ' is not defined');

      this.clientTypes.forEach(function (clientType) {
        _this2._sharedConfig.share(configItem, clientType);
      });

      this.ready();
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)(Locator.prototype.__proto__ || (0, _getPrototypeOf2.default)(Locator.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'coordinates', this._onCoordinates(client));
    }

    /** @private */

  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this3 = this;

      return function () {
        return _this3.send(client, 'acknowledge', _this3.options.configItem);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvY2F0b3IuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIkxvY2F0b3IiLCJkZWZhdWx0cyIsImNvbmZpZ0l0ZW0iLCJjb25maWd1cmUiLCJfYXJlYSIsIl9zaGFyZWRDb25maWciLCJyZXF1aXJlIiwib3B0aW9ucyIsImdldCIsIkVycm9yIiwiY2xpZW50VHlwZXMiLCJmb3JFYWNoIiwiY2xpZW50VHlwZSIsInNoYXJlIiwicmVhZHkiLCJjbGllbnQiLCJyZWNlaXZlIiwiX29uUmVxdWVzdCIsIl9vbkNvb3JkaW5hdGVzIiwic2VuZCIsImNvb3JkaW5hdGVzIiwiU2VydmljZSIsInNlcnZpY2VNYW5hZ2VyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsaUJBQW5COztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUJNQyxPOzs7QUFDSjtBQUNBLHFCQUFjO0FBQUE7O0FBQUEsd0lBQ05ELFVBRE07O0FBR1osUUFBTUUsV0FBVztBQUNmQyxrQkFBWTtBQURHLEtBQWpCOztBQUlBLFVBQUtDLFNBQUwsQ0FBZUYsUUFBZjs7QUFFQSxVQUFLRyxLQUFMLEdBQWEsSUFBYjtBQUNBLFVBQUtDLGFBQUwsR0FBcUIsTUFBS0MsT0FBTCxDQUFhLGVBQWIsQ0FBckI7QUFWWTtBQVdiOztBQUVEOzs7Ozs0QkFDUTtBQUFBOztBQUNOOztBQUVBLFVBQU1KLGFBQWEsS0FBS0ssT0FBTCxDQUFhTCxVQUFoQzs7QUFFQSxVQUFJLEtBQUtHLGFBQUwsQ0FBbUJHLEdBQW5CLENBQXVCTixVQUF2QixNQUF1QyxJQUEzQyxFQUNFLE1BQU0sSUFBSU8sS0FBSix1Q0FBOENQLFVBQTlDLHFCQUFOOztBQUVGLFdBQUtRLFdBQUwsQ0FBaUJDLE9BQWpCLENBQXlCLFVBQUNDLFVBQUQsRUFBZ0I7QUFDdkMsZUFBS1AsYUFBTCxDQUFtQlEsS0FBbkIsQ0FBeUJYLFVBQXpCLEVBQXFDVSxVQUFyQztBQUNELE9BRkQ7O0FBSUEsV0FBS0UsS0FBTDtBQUNEOztBQUVEOzs7OzRCQUNRQyxNLEVBQVE7QUFDZCxzSUFBY0EsTUFBZDs7QUFFQSxXQUFLQyxPQUFMLENBQWFELE1BQWIsRUFBcUIsU0FBckIsRUFBZ0MsS0FBS0UsVUFBTCxDQUFnQkYsTUFBaEIsQ0FBaEM7QUFDQSxXQUFLQyxPQUFMLENBQWFELE1BQWIsRUFBcUIsYUFBckIsRUFBb0MsS0FBS0csY0FBTCxDQUFvQkgsTUFBcEIsQ0FBcEM7QUFDRDs7QUFFRDs7OzsrQkFDV0EsTSxFQUFRO0FBQUE7O0FBQ2pCLGFBQU87QUFBQSxlQUFNLE9BQUtJLElBQUwsQ0FBVUosTUFBVixFQUFrQixhQUFsQixFQUFpQyxPQUFLUixPQUFMLENBQWFMLFVBQTlDLENBQU47QUFBQSxPQUFQO0FBQ0Q7O0FBRUQ7Ozs7bUNBQ2VhLE0sRUFBUTtBQUNyQixhQUFPLFVBQUNLLFdBQUQ7QUFBQSxlQUFpQkwsT0FBT0ssV0FBUCxHQUFxQkEsV0FBdEM7QUFBQSxPQUFQO0FBQ0Q7OztFQS9DbUJDLGlCOztBQWtEdEJDLHlCQUFlQyxRQUFmLENBQXdCeEIsVUFBeEIsRUFBb0NDLE9BQXBDOztrQkFFZUEsTyIsImZpbGUiOiJMb2NhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmxvY2F0b3InO1xuXG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAnbG9jYXRvcidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGlzIG9uZSBvZiB0aGUgcHJvdmlkZWQgc2VydmljZXMgYWltZWQgYXQgaWRlbnRpZnlpbmcgY2xpZW50cyBpbnNpZGVcbiAqIHRoZSBleHBlcmllbmNlIGFsb25nIHdpdGggdGhlIFtgJ3BsYWNlcidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuUGxhY2VyfVxuICogYW5kIFtgJ2NoZWNraW4nYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNoZWNraW59IHNlcnZpY2VzLlxuICpcbiAqIFRoZSBgJ2xvY2F0b3InYCBzZXJ2aWNlIGFsbG93cyBhIGNsaWVudCB0byBnaXZlIGl0cyBhcHByb3hpbWF0ZSBsb2NhdGlvbiBpbnNpZGVcbiAqIGEgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBgYXJlYWAgYXMgZGVmaW5lZCBpbiB0aGUgc2VydmVyJ3MgYHNldHVwYFxuICogY29uZmlndXJhdGlvbiBlbnRyeS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn0qX19cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuUGxhY2VyfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNoZWNraW59XG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5sb2NhdG9yID0gdGhpcy5yZXF1aXJlKCdsb2NhdG9yJyk7XG4gKi9cbmNsYXNzIExvY2F0b3IgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgY29uZmlnSXRlbTogJ3NldHVwLmFyZWEnLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9hcmVhID0gbnVsbDtcbiAgICB0aGlzLl9zaGFyZWRDb25maWcgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgY29uc3QgY29uZmlnSXRlbSA9IHRoaXMub3B0aW9ucy5jb25maWdJdGVtO1xuXG4gICAgaWYgKHRoaXMuX3NoYXJlZENvbmZpZy5nZXQoY29uZmlnSXRlbSkgPT09IG51bGwpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFwic2VydmljZTpsb2NhdG9yXCI6IHNlcnZlci5jb25maWcuJHtjb25maWdJdGVtfSBpcyBub3QgZGVmaW5lZGApO1xuXG4gICAgdGhpcy5jbGllbnRUeXBlcy5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICB0aGlzLl9zaGFyZWRDb25maWcuc2hhcmUoY29uZmlnSXRlbSwgY2xpZW50VHlwZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnY29vcmRpbmF0ZXMnLCB0aGlzLl9vbkNvb3JkaW5hdGVzKGNsaWVudCkpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHRoaXMuc2VuZChjbGllbnQsICdhY2tub3dsZWRnZScsIHRoaXMub3B0aW9ucy5jb25maWdJdGVtKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Db29yZGluYXRlcyhjbGllbnQpIHtcbiAgICByZXR1cm4gKGNvb3JkaW5hdGVzKSA9PiBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBMb2NhdG9yKTtcblxuZXhwb3J0IGRlZmF1bHQgTG9jYXRvcjtcbiJdfQ==