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
 * Interface of the client `'shared-config'` service.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZENvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBLElBQU0sYUFBYSx1QkFBbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXVCTSxZOzs7OztBQUVKLDBCQUFjO0FBQUE7Ozs7Ozs7OztBQUFBLHNIQUNOLFVBRE0sRUFDTSxJQUROOztBQVFaLFVBQUssTUFBTCxHQUFjLEVBQWQ7O0FBRUEsVUFBSyxpQkFBTCxHQUF5QixNQUFLLGlCQUFMLENBQXVCLElBQXZCLE9BQXpCO0FBVlk7QUFXYjs7Ozs7Ozs4QkFHUyxPLEVBQVM7QUFDakIsVUFBSSxRQUFRLEtBQVosRUFBbUI7QUFDakIsYUFBSyxNQUFMLEdBQWMsS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixRQUFRLEtBQTNCLENBQWQ7QUFDQSxlQUFPLFFBQVEsS0FBZjtBQUNEOztBQUVELDhHQUFnQixPQUFoQjtBQUNEOzs7Ozs7MkJBR007Ozs7Ozs7QUFPTCxXQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0Q7Ozs7Ozs0QkFHTztBQUNOOztBQUVBLFVBQUksQ0FBQyxLQUFLLFVBQVYsRUFDRSxLQUFLLElBQUw7O0FBRUYsV0FBSyxJQUFMLENBQVUsU0FBVixFQUFxQixLQUFLLE1BQTFCO0FBQ0EsV0FBSyxPQUFMLENBQWEsUUFBYixFQUF1QixLQUFLLGlCQUE1QjtBQUNEOzs7Ozs7c0NBR2lCLEksRUFBTTtBQUN0QixXQUFLLElBQUwsR0FBWSxpQkFBTyxNQUFQLEdBQWdCLElBQTVCO0FBQ0EsV0FBSyxLQUFMO0FBQ0Q7Ozs7Ozs7Ozs7O3dCQVFHLEksRUFBTTtBQUNSLFVBQU0sUUFBUSxLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWQ7QUFDQSxVQUFJLE1BQU0sS0FBSyxJQUFmOztBQUVBLFlBQU0sT0FBTixDQUFjLFVBQUMsSUFBRDtBQUFBLGVBQVUsTUFBTSxJQUFJLElBQUosQ0FBaEI7QUFBQSxPQUFkOztBQUVBLGFBQU8sR0FBUDtBQUNEOzs7OztBQUdILHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsWUFBcEM7O2tCQUVlLFkiLCJmaWxlIjoiU2hhcmVkQ29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzaGFyZWQtY29uZmlnJztcblxuLyoqXG4gKiBJbnRlcmZhY2Ugb2YgdGhlIGNsaWVudCBgJ3NoYXJlZC1jb25maWcnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gc2hhcmUgcGFydHMgb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uIHRvIHRoZSBjbGllbnRzLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5TaGFyZWRDb25maWd9Kl9fXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gb3B0aW9ucy5pdGVtcyAtIExpc3Qgb2YgdGhlIGNvbmZpZ3VyYXRpb24gaXRlbXNcbiAqICByZXF1aXJlZCBieSB0aGUgc2VydmVyLiBUaGUgZ2l2ZW4gc3RyaW5ncyBmb2xsb3cgYSBjb252ZW50aW9uIGRlZmluaW5nIGEgcGF0aFxuICogIHRvIHRoZSByZXF1aXJlZCBjb25maWd1cmF0aW9uIGl0ZW0sIGZvciBleGFtcGxlIGAnc2V0dXAuYXJlYSdgIHdpbGwgcmV0cmlldmVcbiAqICB0aGUgdmFsdWUgKGhlcmUgYW4gb2JqZWN0KSBjb3JyZXNwb25kaW5nIHRvIHRoZSBgYXJlYWAga2V5IGluc2lkZSB0aGUgYHNldHVwYFxuICogIGVudHJ5IG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnNoYXJlZENvbmZpZyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycsIHsgaXRlbXM6IFsnc2V0dXAuYXJlYSddIH0pO1xuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZFxuICogY29uc3QgYXJlYVdpZHRoID0gdGhpcy5zaGFyZWRDb25maWcuZ2V0KCdzZXR1cC5hcmVhLndpZHRoJyk7XG4gKi9cbmNsYXNzIFNoYXJlZENvbmZpZyBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgLyoqXG4gICAgICogQ29uZmlndXJhdGlvbiBpdGVtcyByZXF1aXJlZCBieSB0aGUgY2xpZW50LlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2l0ZW1zID0gW107XG5cbiAgICB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlID0gdGhpcy5fb25Db25maWdSZXNwb25zZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMuaXRlbXMpIHtcbiAgICAgIHRoaXMuX2l0ZW1zID0gdGhpcy5faXRlbXMuY29uY2F0KG9wdGlvbnMuaXRlbXMpO1xuICAgICAgZGVsZXRlIG9wdGlvbnMuaXRlbXM7XG4gICAgfVxuXG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGluaXQoKSB7XG4gICAgLyoqXG4gICAgICogT2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBjb25maWd1cmF0aW9uIGl0ZW1zIHNoYXJlZCBieSB0aGUgc2VydmVyLiBUaGVcbiAgICAgKiBvYmplY3QgaXMgZmxhdHRlbmVkIGluIG9yZGVyIHRvIG1pbmltaXplIHRoZSBuZWVkZWQgY29tbXVuaWNhdGlvbnMgYmV0d2VlblxuICAgICAqIHRoZSBjbGllbnQgYW5kIHRoZSBzZXJ2ZXIuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmRhdGEgPSBudWxsO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0JywgdGhpcy5faXRlbXMpO1xuICAgIHRoaXMucmVjZWl2ZSgnY29uZmlnJywgdGhpcy5fb25Db25maWdSZXNwb25zZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQ29uZmlnUmVzcG9uc2UoZGF0YSkge1xuICAgIHRoaXMuZGF0YSA9IGNsaWVudC5jb25maWcgPSBkYXRhO1xuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhIGNvbmZpZ3VyYXRpb24gdmFsdWUgZnJvbSBpdHMga2V5IGl0ZW0sIGFzIGRlZmluZWQgaW4gc2VydmVyIHNpZGVcbiAgICogc2VydmljZSdzIGBhZGRJdGVtYCBtZXRob2Qgb3IgaW4gY2xpZW50LXNpZGUgYGl0ZW1zYCBvcHRpb24uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpdGVtIC0gS2V5IHRvIHRoZSBjb25maWd1cmF0aW9uIGl0ZW0gKF9leDpfIGAnc2V0dXAuYXJlYSdgKVxuICAgKiBAcmV0dXJuIHtNaXhlZH1cbiAgICovXG4gIGdldChpdGVtKSB7XG4gICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCcuJyk7XG4gICAgbGV0IHRtcCA9IHRoaXMuZGF0YTtcblxuICAgIHBhcnRzLmZvckVhY2goKGF0dHIpID0+IHRtcCA9IHRtcFthdHRyXSk7XG5cbiAgICByZXR1cm4gdG1wO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNoYXJlZENvbmZpZyk7XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXJlZENvbmZpZztcbiJdfQ==