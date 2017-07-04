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

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:shared-config';

/**
 * Interface for the client `'shared-config'` service.
 *
 * The `shared-config` service allows clients to access items of the server
 * configuration.
 * All configuration items retrieved by the server are also stored in the
 * `client.config` attribute.
 *
 * __*The service must be used with its
 * [server-side counterpart]{@link module:soundworks/server.SharedConfig}*__
 *
 * _<span class="warning">__WARNING__</span> This class should never be
 * instanciated manually_
 *
 * @param {Object} options
 * @param {Array<String>} options.items - List of the configuration items
 *  required by the server. The given strings follow a convention defining a path
 *  to the required configuration item.
 *  _example:_ `'setup.area'` will retrieve the value (here an object)
 *  corresponding to the `area` key inside the `setup` entry of the server
 *  configuration.
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.sharedConfig = this.require('shared-config', { items: ['setup.area'] });
 * // when the experience has started
 * const areaWidth = this.sharedConfig.get('setup.area.width');
 */

var SharedConfig = function (_Service) {
  (0, _inherits3.default)(SharedConfig, _Service);

  function SharedConfig() {
    (0, _classCallCheck3.default)(this, SharedConfig);

    /**
     * Configuration items required by the client.
     * @type {Array}
     * @private
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (SharedConfig.__proto__ || (0, _getPrototypeOf2.default)(SharedConfig)).call(this, SERVICE_ID, true));

    _this._items = [];

    /**
     * Object containing all the configuration items shared by the server. The
     * object is flattened in order to minimize the needed communications between
     * the client and the server.
     * @type {Object}
     */
    _this.data = null;

    _this._onConfigResponse = _this._onConfigResponse.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(SharedConfig, [{
    key: 'configure',
    value: function configure(options) {
      if (options.items) {
        this._items = this._items.concat(options.items);
        delete options.items;
      }

      (0, _get3.default)(SharedConfig.prototype.__proto__ || (0, _getPrototypeOf2.default)(SharedConfig.prototype), 'configure', this).call(this, options);
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)(SharedConfig.prototype.__proto__ || (0, _getPrototypeOf2.default)(SharedConfig.prototype), 'start', this).call(this);

      this.send('request', this._items);
      this.receive('config', this._onConfigResponse);
    }

    /** @private */

  }, {
    key: '_onConfigResponse',
    value: function _onConfigResponse(data) {
      this.data = _client2.default.config = data;
      this.ready();
    }

    /**
     * Retrieve a configuration value from its key, as defined in server side
     * service's `addItem` method or in client-side `items` option.
     *
     * @param {String} item - Key to the configuration item (_ex:_ `'setup.area'`)
     * @return {Mixed}
     */

  }, {
    key: 'get',
    value: function get(item) {
      var parts = item.split('.');
      var tmp = this.data;

      parts.forEach(function (attr) {
        return tmp = tmp[attr];
      });

      return tmp;
    }
  }]);
  return SharedConfig;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SharedConfig);

exports.default = SharedConfig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZENvbmZpZy5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiU2hhcmVkQ29uZmlnIiwiX2l0ZW1zIiwiZGF0YSIsIl9vbkNvbmZpZ1Jlc3BvbnNlIiwiYmluZCIsIm9wdGlvbnMiLCJpdGVtcyIsImNvbmNhdCIsInNlbmQiLCJyZWNlaXZlIiwiY29uZmlnIiwicmVhZHkiLCJpdGVtIiwicGFydHMiLCJzcGxpdCIsInRtcCIsImZvckVhY2giLCJhdHRyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0EsSUFBTUEsYUFBYSx1QkFBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTZCTUMsWTs7O0FBQ0osMEJBQWM7QUFBQTs7QUFHWjs7Ozs7QUFIWSxrSkFDTkQsVUFETSxFQUNNLElBRE47O0FBUVosVUFBS0UsTUFBTCxHQUFjLEVBQWQ7O0FBRUE7Ozs7OztBQU1BLFVBQUtDLElBQUwsR0FBWSxJQUFaOztBQUVBLFVBQUtDLGlCQUFMLEdBQXlCLE1BQUtBLGlCQUFMLENBQXVCQyxJQUF2QixPQUF6QjtBQWxCWTtBQW1CYjs7QUFFRDs7Ozs7OEJBQ1VDLE8sRUFBUztBQUNqQixVQUFJQSxRQUFRQyxLQUFaLEVBQW1CO0FBQ2pCLGFBQUtMLE1BQUwsR0FBYyxLQUFLQSxNQUFMLENBQVlNLE1BQVosQ0FBbUJGLFFBQVFDLEtBQTNCLENBQWQ7QUFDQSxlQUFPRCxRQUFRQyxLQUFmO0FBQ0Q7O0FBRUQsa0pBQWdCRCxPQUFoQjtBQUNEOztBQUVEOzs7OzRCQUNRO0FBQ047O0FBRUEsV0FBS0csSUFBTCxDQUFVLFNBQVYsRUFBcUIsS0FBS1AsTUFBMUI7QUFDQSxXQUFLUSxPQUFMLENBQWEsUUFBYixFQUF1QixLQUFLTixpQkFBNUI7QUFDRDs7QUFFRDs7OztzQ0FDa0JELEksRUFBTTtBQUN0QixXQUFLQSxJQUFMLEdBQVksaUJBQU9RLE1BQVAsR0FBZ0JSLElBQTVCO0FBQ0EsV0FBS1MsS0FBTDtBQUNEOztBQUVEOzs7Ozs7Ozs7O3dCQU9JQyxJLEVBQU07QUFDUixVQUFNQyxRQUFRRCxLQUFLRSxLQUFMLENBQVcsR0FBWCxDQUFkO0FBQ0EsVUFBSUMsTUFBTSxLQUFLYixJQUFmOztBQUVBVyxZQUFNRyxPQUFOLENBQWMsVUFBQ0MsSUFBRDtBQUFBLGVBQVVGLE1BQU1BLElBQUlFLElBQUosQ0FBaEI7QUFBQSxPQUFkOztBQUVBLGFBQU9GLEdBQVA7QUFDRDs7Ozs7QUFHSCx5QkFBZUcsUUFBZixDQUF3Qm5CLFVBQXhCLEVBQW9DQyxZQUFwQzs7a0JBRWVBLFkiLCJmaWxlIjoiU2hhcmVkQ29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzaGFyZWQtY29uZmlnJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdzaGFyZWQtY29uZmlnJ2Agc2VydmljZS5cbiAqXG4gKiBUaGUgYHNoYXJlZC1jb25maWdgIHNlcnZpY2UgYWxsb3dzIGNsaWVudHMgdG8gYWNjZXNzIGl0ZW1zIG9mIHRoZSBzZXJ2ZXJcbiAqIGNvbmZpZ3VyYXRpb24uXG4gKiBBbGwgY29uZmlndXJhdGlvbiBpdGVtcyByZXRyaWV2ZWQgYnkgdGhlIHNlcnZlciBhcmUgYWxzbyBzdG9yZWQgaW4gdGhlXG4gKiBgY2xpZW50LmNvbmZpZ2AgYXR0cmlidXRlLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0c1xuICogW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuU2hhcmVkQ29uZmlnfSpfX1xuICpcbiAqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmVcbiAqIGluc3RhbmNpYXRlZCBtYW51YWxseV9cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBvcHRpb25zLml0ZW1zIC0gTGlzdCBvZiB0aGUgY29uZmlndXJhdGlvbiBpdGVtc1xuICogIHJlcXVpcmVkIGJ5IHRoZSBzZXJ2ZXIuIFRoZSBnaXZlbiBzdHJpbmdzIGZvbGxvdyBhIGNvbnZlbnRpb24gZGVmaW5pbmcgYSBwYXRoXG4gKiAgdG8gdGhlIHJlcXVpcmVkIGNvbmZpZ3VyYXRpb24gaXRlbS5cbiAqICBfZXhhbXBsZTpfIGAnc2V0dXAuYXJlYSdgIHdpbGwgcmV0cmlldmUgdGhlIHZhbHVlIChoZXJlIGFuIG9iamVjdClcbiAqICBjb3JyZXNwb25kaW5nIHRvIHRoZSBgYXJlYWAga2V5IGluc2lkZSB0aGUgYHNldHVwYCBlbnRyeSBvZiB0aGUgc2VydmVyXG4gKiAgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnNoYXJlZENvbmZpZyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycsIHsgaXRlbXM6IFsnc2V0dXAuYXJlYSddIH0pO1xuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZFxuICogY29uc3QgYXJlYVdpZHRoID0gdGhpcy5zaGFyZWRDb25maWcuZ2V0KCdzZXR1cC5hcmVhLndpZHRoJyk7XG4gKi9cbmNsYXNzIFNoYXJlZENvbmZpZyBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyYXRpb24gaXRlbXMgcmVxdWlyZWQgYnkgdGhlIGNsaWVudC5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9pdGVtcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogT2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBjb25maWd1cmF0aW9uIGl0ZW1zIHNoYXJlZCBieSB0aGUgc2VydmVyLiBUaGVcbiAgICAgKiBvYmplY3QgaXMgZmxhdHRlbmVkIGluIG9yZGVyIHRvIG1pbmltaXplIHRoZSBuZWVkZWQgY29tbXVuaWNhdGlvbnMgYmV0d2VlblxuICAgICAqIHRoZSBjbGllbnQgYW5kIHRoZSBzZXJ2ZXIuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmRhdGEgPSBudWxsO1xuXG4gICAgdGhpcy5fb25Db25maWdSZXNwb25zZSA9IHRoaXMuX29uQ29uZmlnUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLml0ZW1zKSB7XG4gICAgICB0aGlzLl9pdGVtcyA9IHRoaXMuX2l0ZW1zLmNvbmNhdChvcHRpb25zLml0ZW1zKTtcbiAgICAgIGRlbGV0ZSBvcHRpb25zLml0ZW1zO1xuICAgIH1cblxuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0JywgdGhpcy5faXRlbXMpO1xuICAgIHRoaXMucmVjZWl2ZSgnY29uZmlnJywgdGhpcy5fb25Db25maWdSZXNwb25zZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQ29uZmlnUmVzcG9uc2UoZGF0YSkge1xuICAgIHRoaXMuZGF0YSA9IGNsaWVudC5jb25maWcgPSBkYXRhO1xuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhIGNvbmZpZ3VyYXRpb24gdmFsdWUgZnJvbSBpdHMga2V5LCBhcyBkZWZpbmVkIGluIHNlcnZlciBzaWRlXG4gICAqIHNlcnZpY2UncyBgYWRkSXRlbWAgbWV0aG9kIG9yIGluIGNsaWVudC1zaWRlIGBpdGVtc2Agb3B0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaXRlbSAtIEtleSB0byB0aGUgY29uZmlndXJhdGlvbiBpdGVtIChfZXg6XyBgJ3NldHVwLmFyZWEnYClcbiAgICogQHJldHVybiB7TWl4ZWR9XG4gICAqL1xuICBnZXQoaXRlbSkge1xuICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdCgnLicpO1xuICAgIGxldCB0bXAgPSB0aGlzLmRhdGE7XG5cbiAgICBwYXJ0cy5mb3JFYWNoKChhdHRyKSA9PiB0bXAgPSB0bXBbYXR0cl0pO1xuXG4gICAgcmV0dXJuIHRtcDtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTaGFyZWRDb25maWcpO1xuXG5leHBvcnQgZGVmYXVsdCBTaGFyZWRDb25maWc7XG4iXX0=