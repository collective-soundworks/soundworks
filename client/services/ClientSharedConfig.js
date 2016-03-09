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
 * This service allows to retrieve part of the server configuration to client.
 */

var ClientSharedConfig = function (_Service) {
  (0, _inherits3.default)(ClientSharedConfig, _Service);

  function ClientSharedConfig() {
    (0, _classCallCheck3.default)(this, ClientSharedConfig);


    /**
     * Configuration items required by the client.
     * @type {Array}
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ClientSharedConfig).call(this, SERVICE_ID, true));

    _this._items = [];

    _this._onConfigResponse = _this._onConfigResponse.bind(_this);
    return _this;
  }

  /** @inheritdoc */


  (0, _createClass3.default)(ClientSharedConfig, [{
    key: 'configure',
    value: function configure(options) {
      if (options.items) {
        this._items = this._items.concat(options.items);
        delete options.items;
      }

      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientSharedConfig.prototype), 'configure', this).call(this, options);
    }

    /** @inheritdoc */

  }, {
    key: 'init',
    value: function init() {
      this.data = null;
    }

    /** @inheritdoc */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientSharedConfig.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.send('request', this._items);
      this.receive('config', this._onConfigResponse);
    }

    /**
     * Retrieve a configuration value from its key item, as defined in server side
     * service's `addItem` method.
     * @param {String} item - The item of the configuration (ex: `'setup.area'`)
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
  }, {
    key: '_onConfigResponse',
    value: function _onConfigResponse(data) {
      this.data = _client2.default.config = data;
      this.ready();
    }
  }]);
  return ClientSharedConfig;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, ClientSharedConfig);

exports.default = ClientSharedConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudFNoYXJlZENvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBLElBQU0sYUFBYSx1QkFBYjs7Ozs7O0lBS0E7OztBQUNKLFdBREksa0JBQ0osR0FBYzt3Q0FEVixvQkFDVTs7Ozs7Ozs7NkZBRFYsK0JBRUksWUFBWSxPQUROOztBQU9aLFVBQUssTUFBTCxHQUFjLEVBQWQsQ0FQWTs7QUFTWixVQUFLLGlCQUFMLEdBQXlCLE1BQUssaUJBQUwsQ0FBdUIsSUFBdkIsT0FBekIsQ0FUWTs7R0FBZDs7Ozs7NkJBREk7OzhCQWNNLFNBQVM7QUFDakIsVUFBSSxRQUFRLEtBQVIsRUFBZTtBQUNqQixhQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLFFBQVEsS0FBUixDQUFqQyxDQURpQjtBQUVqQixlQUFPLFFBQVEsS0FBUixDQUZVO09BQW5COztBQUtBLHVEQXBCRSw2REFvQmMsUUFBaEIsQ0FOaUI7Ozs7Ozs7MkJBVVo7QUFDTCxXQUFLLElBQUwsR0FBWSxJQUFaLENBREs7Ozs7Ozs7NEJBS0M7QUFDTix1REE5QkUsd0RBOEJGLENBRE07O0FBR04sVUFBSSxDQUFDLEtBQUssVUFBTCxFQUNILEtBQUssSUFBTCxHQURGOztBQUdBLFdBQUssSUFBTCxDQUFVLFNBQVYsRUFBcUIsS0FBSyxNQUFMLENBQXJCLENBTk07QUFPTixXQUFLLE9BQUwsQ0FBYSxRQUFiLEVBQXVCLEtBQUssaUJBQUwsQ0FBdkIsQ0FQTTs7Ozs7Ozs7Ozs7O3dCQWdCSixNQUFNO0FBQ1IsVUFBTSxRQUFRLEtBQUssS0FBTCxDQUFXLEdBQVgsQ0FBUixDQURFO0FBRVIsVUFBSSxNQUFNLEtBQUssSUFBTCxDQUZGOztBQUlSLFlBQU0sT0FBTixDQUFjLFVBQUMsSUFBRDtlQUFVLE1BQU0sSUFBSSxJQUFKLENBQU47T0FBVixDQUFkLENBSlE7O0FBTVIsYUFBTyxHQUFQLENBTlE7Ozs7c0NBU1EsTUFBTTtBQUN0QixXQUFLLElBQUwsR0FBWSxpQkFBTyxNQUFQLEdBQWdCLElBQWhCLENBRFU7QUFFdEIsV0FBSyxLQUFMLEdBRnNCOzs7U0F0RHBCOzs7QUE0RE4seUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxrQkFBcEM7O2tCQUVlIiwiZmlsZSI6IkNsaWVudFNoYXJlZENvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLWNvbmZpZyc7XG5cbi8qKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byByZXRyaWV2ZSBwYXJ0IG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiB0byBjbGllbnQuXG4gKi9cbmNsYXNzIENsaWVudFNoYXJlZENvbmZpZyBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyYXRpb24gaXRlbXMgcmVxdWlyZWQgYnkgdGhlIGNsaWVudC5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5faXRlbXMgPSBbXTtcblxuICAgIHRoaXMuX29uQ29uZmlnUmVzcG9uc2UgPSB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5pdGVtcykge1xuICAgICAgdGhpcy5faXRlbXMgPSB0aGlzLl9pdGVtcy5jb25jYXQob3B0aW9ucy5pdGVtcyk7XG4gICAgICBkZWxldGUgb3B0aW9ucy5pdGVtcztcbiAgICB9XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmRhdGEgPSBudWxsO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0JywgdGhpcy5faXRlbXMpO1xuICAgIHRoaXMucmVjZWl2ZSgnY29uZmlnJywgdGhpcy5fb25Db25maWdSZXNwb25zZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYSBjb25maWd1cmF0aW9uIHZhbHVlIGZyb20gaXRzIGtleSBpdGVtLCBhcyBkZWZpbmVkIGluIHNlcnZlciBzaWRlXG4gICAqIHNlcnZpY2UncyBgYWRkSXRlbWAgbWV0aG9kLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaXRlbSAtIFRoZSBpdGVtIG9mIHRoZSBjb25maWd1cmF0aW9uIChleDogYCdzZXR1cC5hcmVhJ2ApXG4gICAqIEByZXR1cm4ge01peGVkfVxuICAgKi9cbiAgZ2V0KGl0ZW0pIHtcbiAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICBsZXQgdG1wID0gdGhpcy5kYXRhO1xuXG4gICAgcGFydHMuZm9yRWFjaCgoYXR0cikgPT4gdG1wID0gdG1wW2F0dHJdKTtcblxuICAgIHJldHVybiB0bXA7XG4gIH1cblxuICBfb25Db25maWdSZXNwb25zZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gY2xpZW50LmNvbmZpZyA9IGRhdGE7XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENsaWVudFNoYXJlZENvbmZpZyk7XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudFNoYXJlZENvbmZpZztcbiJdfQ==