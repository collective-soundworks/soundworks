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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZENvbmZpZy5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiU2hhcmVkQ29uZmlnIiwiX2l0ZW1zIiwiZGF0YSIsIl9vbkNvbmZpZ1Jlc3BvbnNlIiwiYmluZCIsIm9wdGlvbnMiLCJpdGVtcyIsImNvbmNhdCIsInNlbmQiLCJyZWNlaXZlIiwiY2xpZW50IiwiY29uZmlnIiwicmVhZHkiLCJpdGVtIiwicGFydHMiLCJzcGxpdCIsInRtcCIsImZvckVhY2giLCJhdHRyIiwiU2VydmljZSIsInNlcnZpY2VNYW5hZ2VyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0EsSUFBTUEsYUFBYSx1QkFBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTZCTUMsWTs7O0FBQ0osMEJBQWM7QUFBQTs7QUFHWjs7Ozs7QUFIWSxrSkFDTkQsVUFETSxFQUNNLElBRE47O0FBUVosVUFBS0UsTUFBTCxHQUFjLEVBQWQ7O0FBRUE7Ozs7OztBQU1BLFVBQUtDLElBQUwsR0FBWSxJQUFaOztBQUVBLFVBQUtDLGlCQUFMLEdBQXlCLE1BQUtBLGlCQUFMLENBQXVCQyxJQUF2QixPQUF6QjtBQWxCWTtBQW1CYjs7QUFFRDs7Ozs7OEJBQ1VDLE8sRUFBUztBQUNqQixVQUFJQSxRQUFRQyxLQUFaLEVBQW1CO0FBQ2pCLGFBQUtMLE1BQUwsR0FBYyxLQUFLQSxNQUFMLENBQVlNLE1BQVosQ0FBbUJGLFFBQVFDLEtBQTNCLENBQWQ7QUFDQSxlQUFPRCxRQUFRQyxLQUFmO0FBQ0Q7O0FBRUQsa0pBQWdCRCxPQUFoQjtBQUNEOztBQUVEOzs7OzRCQUNRO0FBQ047O0FBRUEsV0FBS0csSUFBTCxDQUFVLFNBQVYsRUFBcUIsS0FBS1AsTUFBMUI7QUFDQSxXQUFLUSxPQUFMLENBQWEsUUFBYixFQUF1QixLQUFLTixpQkFBNUI7QUFDRDs7QUFFRDs7OztzQ0FDa0JELEksRUFBTTtBQUN0QixXQUFLQSxJQUFMLEdBQVlRLGlCQUFPQyxNQUFQLEdBQWdCVCxJQUE1QjtBQUNBLFdBQUtVLEtBQUw7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozt3QkFPSUMsSSxFQUFNO0FBQ1IsVUFBTUMsUUFBUUQsS0FBS0UsS0FBTCxDQUFXLEdBQVgsQ0FBZDtBQUNBLFVBQUlDLE1BQU0sS0FBS2QsSUFBZjs7QUFFQVksWUFBTUcsT0FBTixDQUFjLFVBQUNDLElBQUQ7QUFBQSxlQUFVRixNQUFNQSxJQUFJRSxJQUFKLENBQWhCO0FBQUEsT0FBZDs7QUFFQSxhQUFPRixHQUFQO0FBQ0Q7OztFQTVEd0JHLGlCOztBQStEM0JDLHlCQUFlQyxRQUFmLENBQXdCdEIsVUFBeEIsRUFBb0NDLFlBQXBDOztrQkFFZUEsWSIsImZpbGUiOiJTaGFyZWRDb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1jb25maWcnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ3NoYXJlZC1jb25maWcnYCBzZXJ2aWNlLlxuICpcbiAqIFRoZSBgc2hhcmVkLWNvbmZpZ2Agc2VydmljZSBhbGxvd3MgY2xpZW50cyB0byBhY2Nlc3MgaXRlbXMgb2YgdGhlIHNlcnZlclxuICogY29uZmlndXJhdGlvbi5cbiAqIEFsbCBjb25maWd1cmF0aW9uIGl0ZW1zIHJldHJpZXZlZCBieSB0aGUgc2VydmVyIGFyZSBhbHNvIHN0b3JlZCBpbiB0aGVcbiAqIGBjbGllbnQuY29uZmlnYCBhdHRyaWJ1dGUuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzXG4gKiBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5TaGFyZWRDb25maWd9Kl9fXG4gKlxuICogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZVxuICogaW5zdGFuY2lhdGVkIG1hbnVhbGx5X1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IG9wdGlvbnMuaXRlbXMgLSBMaXN0IG9mIHRoZSBjb25maWd1cmF0aW9uIGl0ZW1zXG4gKiAgcmVxdWlyZWQgYnkgdGhlIHNlcnZlci4gVGhlIGdpdmVuIHN0cmluZ3MgZm9sbG93IGEgY29udmVudGlvbiBkZWZpbmluZyBhIHBhdGhcbiAqICB0byB0aGUgcmVxdWlyZWQgY29uZmlndXJhdGlvbiBpdGVtLlxuICogIF9leGFtcGxlOl8gYCdzZXR1cC5hcmVhJ2Agd2lsbCByZXRyaWV2ZSB0aGUgdmFsdWUgKGhlcmUgYW4gb2JqZWN0KVxuICogIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGBhcmVhYCBrZXkgaW5zaWRlIHRoZSBgc2V0dXBgIGVudHJ5IG9mIHRoZSBzZXJ2ZXJcbiAqICBjb25maWd1cmF0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc2hhcmVkQ29uZmlnID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJywgeyBpdGVtczogWydzZXR1cC5hcmVhJ10gfSk7XG4gKiAvLyB3aGVuIHRoZSBleHBlcmllbmNlIGhhcyBzdGFydGVkXG4gKiBjb25zdCBhcmVhV2lkdGggPSB0aGlzLnNoYXJlZENvbmZpZy5nZXQoJ3NldHVwLmFyZWEud2lkdGgnKTtcbiAqL1xuY2xhc3MgU2hhcmVkQ29uZmlnIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgLyoqXG4gICAgICogQ29uZmlndXJhdGlvbiBpdGVtcyByZXF1aXJlZCBieSB0aGUgY2xpZW50LlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2l0ZW1zID0gW107XG5cbiAgICAvKipcbiAgICAgKiBPYmplY3QgY29udGFpbmluZyBhbGwgdGhlIGNvbmZpZ3VyYXRpb24gaXRlbXMgc2hhcmVkIGJ5IHRoZSBzZXJ2ZXIuIFRoZVxuICAgICAqIG9iamVjdCBpcyBmbGF0dGVuZWQgaW4gb3JkZXIgdG8gbWluaW1pemUgdGhlIG5lZWRlZCBjb21tdW5pY2F0aW9ucyBiZXR3ZWVuXG4gICAgICogdGhlIGNsaWVudCBhbmQgdGhlIHNlcnZlci5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuZGF0YSA9IG51bGw7XG5cbiAgICB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlID0gdGhpcy5fb25Db25maWdSZXNwb25zZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMuaXRlbXMpIHtcbiAgICAgIHRoaXMuX2l0ZW1zID0gdGhpcy5faXRlbXMuY29uY2F0KG9wdGlvbnMuaXRlbXMpO1xuICAgICAgZGVsZXRlIG9wdGlvbnMuaXRlbXM7XG4gICAgfVxuXG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnLCB0aGlzLl9pdGVtcyk7XG4gICAgdGhpcy5yZWNlaXZlKCdjb25maWcnLCB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Db25maWdSZXNwb25zZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gY2xpZW50LmNvbmZpZyA9IGRhdGE7XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGEgY29uZmlndXJhdGlvbiB2YWx1ZSBmcm9tIGl0cyBrZXksIGFzIGRlZmluZWQgaW4gc2VydmVyIHNpZGVcbiAgICogc2VydmljZSdzIGBhZGRJdGVtYCBtZXRob2Qgb3IgaW4gY2xpZW50LXNpZGUgYGl0ZW1zYCBvcHRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpdGVtIC0gS2V5IHRvIHRoZSBjb25maWd1cmF0aW9uIGl0ZW0gKF9leDpfIGAnc2V0dXAuYXJlYSdgKVxuICAgKiBAcmV0dXJuIHtNaXhlZH1cbiAgICovXG4gIGdldChpdGVtKSB7XG4gICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCcuJyk7XG4gICAgbGV0IHRtcCA9IHRoaXMuZGF0YTtcblxuICAgIHBhcnRzLmZvckVhY2goKGF0dHIpID0+IHRtcCA9IHRtcFthdHRyXSk7XG5cbiAgICByZXR1cm4gdG1wO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNoYXJlZENvbmZpZyk7XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXJlZENvbmZpZztcbiJdfQ==