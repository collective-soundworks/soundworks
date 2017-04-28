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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvY2F0b3IuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIkxvY2F0b3IiLCJkZWZhdWx0cyIsImNvbmZpZ0l0ZW0iLCJjb25maWd1cmUiLCJfYXJlYSIsIl9zaGFyZWRDb25maWciLCJyZXF1aXJlIiwib3B0aW9ucyIsImdldCIsIkVycm9yIiwiY2xpZW50VHlwZXMiLCJmb3JFYWNoIiwiY2xpZW50VHlwZSIsInNoYXJlIiwicmVhZHkiLCJjbGllbnQiLCJyZWNlaXZlIiwiX29uUmVxdWVzdCIsIl9vbkNvb3JkaW5hdGVzIiwic2VuZCIsImNvb3JkaW5hdGVzIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsaUJBQW5COztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUJNQyxPOzs7QUFDSjtBQUNBLHFCQUFjO0FBQUE7O0FBQUEsd0lBQ05ELFVBRE07O0FBR1osUUFBTUUsV0FBVztBQUNmQyxrQkFBWTtBQURHLEtBQWpCOztBQUlBLFVBQUtDLFNBQUwsQ0FBZUYsUUFBZjs7QUFFQSxVQUFLRyxLQUFMLEdBQWEsSUFBYjtBQUNBLFVBQUtDLGFBQUwsR0FBcUIsTUFBS0MsT0FBTCxDQUFhLGVBQWIsQ0FBckI7QUFWWTtBQVdiOztBQUVEOzs7Ozs0QkFDUTtBQUFBOztBQUNOOztBQUVBLFVBQU1KLGFBQWEsS0FBS0ssT0FBTCxDQUFhTCxVQUFoQzs7QUFFQSxVQUFJLEtBQUtHLGFBQUwsQ0FBbUJHLEdBQW5CLENBQXVCTixVQUF2QixNQUF1QyxJQUEzQyxFQUNFLE1BQU0sSUFBSU8sS0FBSix1Q0FBOENQLFVBQTlDLHFCQUFOOztBQUVGLFdBQUtRLFdBQUwsQ0FBaUJDLE9BQWpCLENBQXlCLFVBQUNDLFVBQUQsRUFBZ0I7QUFDdkMsZUFBS1AsYUFBTCxDQUFtQlEsS0FBbkIsQ0FBeUJYLFVBQXpCLEVBQXFDVSxVQUFyQztBQUNELE9BRkQ7O0FBSUEsV0FBS0UsS0FBTDtBQUNEOztBQUVEOzs7OzRCQUNRQyxNLEVBQVE7QUFDZCxzSUFBY0EsTUFBZDs7QUFFQSxXQUFLQyxPQUFMLENBQWFELE1BQWIsRUFBcUIsU0FBckIsRUFBZ0MsS0FBS0UsVUFBTCxDQUFnQkYsTUFBaEIsQ0FBaEM7QUFDQSxXQUFLQyxPQUFMLENBQWFELE1BQWIsRUFBcUIsYUFBckIsRUFBb0MsS0FBS0csY0FBTCxDQUFvQkgsTUFBcEIsQ0FBcEM7QUFDRDs7QUFFRDs7OzsrQkFDV0EsTSxFQUFRO0FBQUE7O0FBQ2pCLGFBQU87QUFBQSxlQUFNLE9BQUtJLElBQUwsQ0FBVUosTUFBVixFQUFrQixhQUFsQixFQUFpQyxPQUFLUixPQUFMLENBQWFMLFVBQTlDLENBQU47QUFBQSxPQUFQO0FBQ0Q7O0FBRUQ7Ozs7bUNBQ2VhLE0sRUFBUTtBQUNyQixhQUFPLFVBQUNLLFdBQUQ7QUFBQSxlQUFpQkwsT0FBT0ssV0FBUCxHQUFxQkEsV0FBdEM7QUFBQSxPQUFQO0FBQ0Q7Ozs7O0FBR0gseUJBQWVDLFFBQWYsQ0FBd0J0QixVQUF4QixFQUFvQ0MsT0FBcEM7O2tCQUVlQSxPIiwiZmlsZSI6IkxvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bG9jYXRvcic7XG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdsb2NhdG9yJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgaXMgb25lIG9mIHRoZSBwcm92aWRlZCBzZXJ2aWNlcyBhaW1lZCBhdCBpZGVudGlmeWluZyBjbGllbnRzIGluc2lkZVxuICogdGhlIGV4cGVyaWVuY2UgYWxvbmcgd2l0aCB0aGUgW2AncGxhY2VyJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5QbGFjZXJ9XG4gKiBhbmQgW2AnY2hlY2tpbidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2hlY2tpbn0gc2VydmljZXMuXG4gKlxuICogVGhlIGAnbG9jYXRvcidgIHNlcnZpY2UgYWxsb3dzIGEgY2xpZW50IHRvIGdpdmUgaXRzIGFwcHJveGltYXRlIGxvY2F0aW9uIGluc2lkZVxuICogYSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGBhcmVhYCBhcyBkZWZpbmVkIGluIHRoZSBzZXJ2ZXIncyBgc2V0dXBgXG4gKiBjb25maWd1cmF0aW9uIGVudHJ5LlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfSpfX1xuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5QbGFjZXJ9XG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2hlY2tpbn1cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLmxvY2F0b3IgPSB0aGlzLnJlcXVpcmUoJ2xvY2F0b3InKTtcbiAqL1xuY2xhc3MgTG9jYXRvciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBjb25maWdJdGVtOiAnc2V0dXAuYXJlYScsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX2FyZWEgPSBudWxsO1xuICAgIHRoaXMuX3NoYXJlZENvbmZpZyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBjb25zdCBjb25maWdJdGVtID0gdGhpcy5vcHRpb25zLmNvbmZpZ0l0ZW07XG5cbiAgICBpZiAodGhpcy5fc2hhcmVkQ29uZmlnLmdldChjb25maWdJdGVtKSA9PT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXCJzZXJ2aWNlOmxvY2F0b3JcIjogc2VydmVyLmNvbmZpZy4ke2NvbmZpZ0l0ZW19IGlzIG5vdCBkZWZpbmVkYCk7XG5cbiAgICB0aGlzLmNsaWVudFR5cGVzLmZvckVhY2goKGNsaWVudFR5cGUpID0+IHtcbiAgICAgIHRoaXMuX3NoYXJlZENvbmZpZy5zaGFyZShjb25maWdJdGVtLCBjbGllbnRUeXBlKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdjb29yZGluYXRlcycsIHRoaXMuX29uQ29vcmRpbmF0ZXMoY2xpZW50KSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5zZW5kKGNsaWVudCwgJ2Fja25vd2xlZGdlJywgdGhpcy5vcHRpb25zLmNvbmZpZ0l0ZW0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkNvb3JkaW5hdGVzKGNsaWVudCkge1xuICAgIHJldHVybiAoY29vcmRpbmF0ZXMpID0+IGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIExvY2F0b3IpO1xuXG5leHBvcnQgZGVmYXVsdCBMb2NhdG9yO1xuIl19