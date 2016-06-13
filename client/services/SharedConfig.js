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
 * This service allows to share parts of the server configuration to the clients.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.SharedConfig}*__
 *
 * @param {Object} options
 * @param {Array<String>} options.items - List of the configuration items
 *  required by the server. The given strings follow a convention defining a path
 *  to the required configuration item, for example `'setup.area'` will retrieve
 *  the value (here an object) corresponding to the `area` key inside the `setup`
 *  entry of the server configuration.
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

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function SharedConfig() {
    (0, _classCallCheck3.default)(this, SharedConfig);


    /**
     * Configuration items required by the client.
     * @type {Array}
     * @private
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SharedConfig).call(this, SERVICE_ID, true));

    _this._items = [];

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

      (0, _get3.default)((0, _getPrototypeOf2.default)(SharedConfig.prototype), 'configure', this).call(this, options);
    }

    /** @private */

  }, {
    key: 'init',
    value: function init() {
      /**
       * Object containing all the configuration items shared by the server. The
       * object is flattened in order to minimize the needed communications between
       * the client and the server.
       * @type {Object}
       */
      this.data = null;
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(SharedConfig.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

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
     * Retrieve a configuration value from its key item, as defined in server side
     * service's `addItem` method or in client-side `items` option.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZENvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBLElBQU0sYUFBYSx1QkFBbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXVCTSxZOzs7OztBQUVKLDBCQUFjO0FBQUE7Ozs7Ozs7OztBQUFBLHNIQUNOLFVBRE0sRUFDTSxJQUROOztBQVFaLFVBQUssTUFBTCxHQUFjLEVBQWQ7O0FBRUEsVUFBSyxpQkFBTCxHQUF5QixNQUFLLGlCQUFMLENBQXVCLElBQXZCLE9BQXpCO0FBVlk7QUFXYjs7Ozs7Ozs4QkFHUyxPLEVBQVM7QUFDakIsVUFBSSxRQUFRLEtBQVosRUFBbUI7QUFDakIsYUFBSyxNQUFMLEdBQWMsS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixRQUFRLEtBQTNCLENBQWQ7QUFDQSxlQUFPLFFBQVEsS0FBZjtBQUNEOztBQUVELDhHQUFnQixPQUFoQjtBQUNEOzs7Ozs7MkJBR007Ozs7Ozs7QUFPTCxXQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0Q7Ozs7Ozs0QkFHTztBQUNOOztBQUVBLFVBQUksQ0FBQyxLQUFLLFVBQVYsRUFDRSxLQUFLLElBQUw7O0FBRUYsV0FBSyxJQUFMLENBQVUsU0FBVixFQUFxQixLQUFLLE1BQTFCO0FBQ0EsV0FBSyxPQUFMLENBQWEsUUFBYixFQUF1QixLQUFLLGlCQUE1QjtBQUNEOzs7Ozs7c0NBR2lCLEksRUFBTTtBQUN0QixXQUFLLElBQUwsR0FBWSxpQkFBTyxNQUFQLEdBQWdCLElBQTVCO0FBQ0EsV0FBSyxLQUFMO0FBQ0Q7Ozs7Ozs7Ozs7O3dCQVFHLEksRUFBTTtBQUNSLFVBQU0sUUFBUSxLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWQ7QUFDQSxVQUFJLE1BQU0sS0FBSyxJQUFmOztBQUVBLFlBQU0sT0FBTixDQUFjLFVBQUMsSUFBRDtBQUFBLGVBQVUsTUFBTSxJQUFJLElBQUosQ0FBaEI7QUFBQSxPQUFkOztBQUVBLGFBQU8sR0FBUDtBQUNEOzs7OztBQUdILHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsWUFBcEM7O2tCQUVlLFkiLCJmaWxlIjoiU2hhcmVkQ29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzaGFyZWQtY29uZmlnJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdzaGFyZWQtY29uZmlnJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgYWxsb3dzIHRvIHNoYXJlIHBhcnRzIG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiB0byB0aGUgY2xpZW50cy5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuU2hhcmVkQ29uZmlnfSpfX1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IG9wdGlvbnMuaXRlbXMgLSBMaXN0IG9mIHRoZSBjb25maWd1cmF0aW9uIGl0ZW1zXG4gKiAgcmVxdWlyZWQgYnkgdGhlIHNlcnZlci4gVGhlIGdpdmVuIHN0cmluZ3MgZm9sbG93IGEgY29udmVudGlvbiBkZWZpbmluZyBhIHBhdGhcbiAqICB0byB0aGUgcmVxdWlyZWQgY29uZmlndXJhdGlvbiBpdGVtLCBmb3IgZXhhbXBsZSBgJ3NldHVwLmFyZWEnYCB3aWxsIHJldHJpZXZlXG4gKiAgdGhlIHZhbHVlIChoZXJlIGFuIG9iamVjdCkgY29ycmVzcG9uZGluZyB0byB0aGUgYGFyZWFgIGtleSBpbnNpZGUgdGhlIGBzZXR1cGBcbiAqICBlbnRyeSBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5zaGFyZWRDb25maWcgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnLCB7IGl0ZW1zOiBbJ3NldHVwLmFyZWEnXSB9KTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWRcbiAqIGNvbnN0IGFyZWFXaWR0aCA9IHRoaXMuc2hhcmVkQ29uZmlnLmdldCgnc2V0dXAuYXJlYS53aWR0aCcpO1xuICovXG5jbGFzcyBTaGFyZWRDb25maWcgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyYXRpb24gaXRlbXMgcmVxdWlyZWQgYnkgdGhlIGNsaWVudC5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9pdGVtcyA9IFtdO1xuXG4gICAgdGhpcy5fb25Db25maWdSZXNwb25zZSA9IHRoaXMuX29uQ29uZmlnUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLml0ZW1zKSB7XG4gICAgICB0aGlzLl9pdGVtcyA9IHRoaXMuX2l0ZW1zLmNvbmNhdChvcHRpb25zLml0ZW1zKTtcbiAgICAgIGRlbGV0ZSBvcHRpb25zLml0ZW1zO1xuICAgIH1cblxuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0KCkge1xuICAgIC8qKlxuICAgICAqIE9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgY29uZmlndXJhdGlvbiBpdGVtcyBzaGFyZWQgYnkgdGhlIHNlcnZlci4gVGhlXG4gICAgICogb2JqZWN0IGlzIGZsYXR0ZW5lZCBpbiBvcmRlciB0byBtaW5pbWl6ZSB0aGUgbmVlZGVkIGNvbW11bmljYXRpb25zIGJldHdlZW5cbiAgICAgKiB0aGUgY2xpZW50IGFuZCB0aGUgc2VydmVyLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5kYXRhID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcsIHRoaXMuX2l0ZW1zKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NvbmZpZycsIHRoaXMuX29uQ29uZmlnUmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkNvbmZpZ1Jlc3BvbnNlKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBjbGllbnQuY29uZmlnID0gZGF0YTtcbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYSBjb25maWd1cmF0aW9uIHZhbHVlIGZyb20gaXRzIGtleSBpdGVtLCBhcyBkZWZpbmVkIGluIHNlcnZlciBzaWRlXG4gICAqIHNlcnZpY2UncyBgYWRkSXRlbWAgbWV0aG9kIG9yIGluIGNsaWVudC1zaWRlIGBpdGVtc2Agb3B0aW9uLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaXRlbSAtIEtleSB0byB0aGUgY29uZmlndXJhdGlvbiBpdGVtIChfZXg6XyBgJ3NldHVwLmFyZWEnYClcbiAgICogQHJldHVybiB7TWl4ZWR9XG4gICAqL1xuICBnZXQoaXRlbSkge1xuICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdCgnLicpO1xuICAgIGxldCB0bXAgPSB0aGlzLmRhdGE7XG5cbiAgICBwYXJ0cy5mb3JFYWNoKChhdHRyKSA9PiB0bXAgPSB0bXBbYXR0cl0pO1xuXG4gICAgcmV0dXJuIHRtcDtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTaGFyZWRDb25maWcpO1xuXG5leHBvcnQgZGVmYXVsdCBTaGFyZWRDb25maWc7XG4iXX0=