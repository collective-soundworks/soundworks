'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreServiceManager = require('../core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

var _coreService = require('../core/Service');

var _coreService2 = _interopRequireDefault(_coreService);

var _coreClient = require('../core/client');

var _coreClient2 = _interopRequireDefault(_coreClient);

var SERVICE_ID = 'service:shared-config';

/**
 * This service allows to retrieve part of the server configuration to client.
 */

var ClientSharedConfig = (function (_Service) {
  _inherits(ClientSharedConfig, _Service);

  function ClientSharedConfig() {
    _classCallCheck(this, ClientSharedConfig);

    _get(Object.getPrototypeOf(ClientSharedConfig.prototype), 'constructor', this).call(this, SERVICE_ID, true);

    /**
     * Configuration items required by the client.
     * @type {Array}
     */
    this._items = [];

    this._onConfigResponse = this._onConfigResponse.bind(this);
  }

  /** @inheritdoc */

  _createClass(ClientSharedConfig, [{
    key: 'configure',
    value: function configure(options) {
      if (options.items) {
        this._items = this._items.concat(options.items);
        delete options.items;
      }

      _get(Object.getPrototypeOf(ClientSharedConfig.prototype), 'configure', this).call(this, options);
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
      _get(Object.getPrototypeOf(ClientSharedConfig.prototype), 'start', this).call(this);

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
      this.data = _coreClient2['default'].config = data;
      this.ready();
    }
  }]);

  return ClientSharedConfig;
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, ClientSharedConfig);

exports['default'] = ClientSharedConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50U2hhcmVkQ29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7OzsyQkFDL0IsaUJBQWlCOzs7OzBCQUNsQixnQkFBZ0I7Ozs7QUFHbkMsSUFBTSxVQUFVLEdBQUcsdUJBQXVCLENBQUM7Ozs7OztJQUtyQyxrQkFBa0I7WUFBbEIsa0JBQWtCOztBQUNYLFdBRFAsa0JBQWtCLEdBQ1I7MEJBRFYsa0JBQWtCOztBQUVwQiwrQkFGRSxrQkFBa0IsNkNBRWQsVUFBVSxFQUFFLElBQUksRUFBRTs7Ozs7O0FBTXhCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDOztBQUVqQixRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM1RDs7OztlQVhHLGtCQUFrQjs7V0FjYixtQkFBQyxPQUFPLEVBQUU7QUFDakIsVUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hELGVBQU8sT0FBTyxDQUFDLEtBQUssQ0FBQztPQUN0Qjs7QUFFRCxpQ0FwQkUsa0JBQWtCLDJDQW9CSixPQUFPLEVBQUU7S0FDMUI7Ozs7O1dBR0csZ0JBQUc7QUFDTCxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztLQUNsQjs7Ozs7V0FHSSxpQkFBRztBQUNOLGlDQTlCRSxrQkFBa0IsdUNBOEJOOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUNsQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDLFVBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ2hEOzs7Ozs7Ozs7O1dBUUUsYUFBQyxJQUFJLEVBQUU7QUFDUixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLFVBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7O0FBRXBCLFdBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2VBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7T0FBQSxDQUFDLENBQUM7O0FBRXpDLGFBQU8sR0FBRyxDQUFDO0tBQ1o7OztXQUVnQiwyQkFBQyxJQUFJLEVBQUU7QUFDdEIsVUFBSSxDQUFDLElBQUksR0FBRyx3QkFBTyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNkOzs7U0F6REcsa0JBQWtCOzs7QUE0RHhCLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs7cUJBRXpDLGtCQUFrQiIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudFNoYXJlZENvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLWNvbmZpZyc7XG5cbi8qKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byByZXRyaWV2ZSBwYXJ0IG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiB0byBjbGllbnQuXG4gKi9cbmNsYXNzIENsaWVudFNoYXJlZENvbmZpZyBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyYXRpb24gaXRlbXMgcmVxdWlyZWQgYnkgdGhlIGNsaWVudC5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5faXRlbXMgPSBbXTtcblxuICAgIHRoaXMuX29uQ29uZmlnUmVzcG9uc2UgPSB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5pdGVtcykge1xuICAgICAgdGhpcy5faXRlbXMgPSB0aGlzLl9pdGVtcy5jb25jYXQob3B0aW9ucy5pdGVtcyk7XG4gICAgICBkZWxldGUgb3B0aW9ucy5pdGVtcztcbiAgICB9XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmRhdGEgPSBudWxsO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0JywgdGhpcy5faXRlbXMpO1xuICAgIHRoaXMucmVjZWl2ZSgnY29uZmlnJywgdGhpcy5fb25Db25maWdSZXNwb25zZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYSBjb25maWd1cmF0aW9uIHZhbHVlIGZyb20gaXRzIGtleSBpdGVtLCBhcyBkZWZpbmVkIGluIHNlcnZlciBzaWRlXG4gICAqIHNlcnZpY2UncyBgYWRkSXRlbWAgbWV0aG9kLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaXRlbSAtIFRoZSBpdGVtIG9mIHRoZSBjb25maWd1cmF0aW9uIChleDogYCdzZXR1cC5hcmVhJ2ApXG4gICAqIEByZXR1cm4ge01peGVkfVxuICAgKi9cbiAgZ2V0KGl0ZW0pIHtcbiAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICBsZXQgdG1wID0gdGhpcy5kYXRhO1xuXG4gICAgcGFydHMuZm9yRWFjaCgoYXR0cikgPT4gdG1wID0gdG1wW2F0dHJdKTtcblxuICAgIHJldHVybiB0bXA7XG4gIH1cblxuICBfb25Db25maWdSZXNwb25zZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gY2xpZW50LmNvbmZpZyA9IGRhdGE7XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENsaWVudFNoYXJlZENvbmZpZyk7XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudFNoYXJlZENvbmZpZztcbiJdfQ==