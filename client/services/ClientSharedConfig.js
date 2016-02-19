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

var SERVICE_ID = 'service:shared-config';

/**
 * This service allows to retrieve part of the server configuration to client.
 */

var ClientSharedConfig = (function (_Service) {
  _inherits(ClientSharedConfig, _Service);

  function ClientSharedConfig() {
    _classCallCheck(this, ClientSharedConfig);

    _get(Object.getPrototypeOf(ClientSharedConfig.prototype), 'constructor', this).call(this, SERVICE_ID, true);

    this._onConfigResponse = this._onConfigResponse.bind(this);
  }

  /** @inheritdoc */

  _createClass(ClientSharedConfig, [{
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

      this.send('request');
      this.receive('config', this._onConfigResponse);
    }

    /**
     * Retrieve a configuration entry from its path, as defined in server side
     * service's `addItem` method.
     * @param {String} path - The path of the configuration (ex: `'setup.area'`)
     * @return {Mixed}
     */
  }, {
    key: 'get',
    value: function get(path) {
      return this.data[path];
    }
  }, {
    key: '_onConfigResponse',
    value: function _onConfigResponse(data) {
      this.data = data;
      this.ready();
    }
  }]);

  return ClientSharedConfig;
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, ClientSharedConfig);

exports['default'] = ClientSharedConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50U2hhcmVkQ29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7OzsyQkFDL0IsaUJBQWlCOzs7O0FBR3JDLElBQU0sVUFBVSxHQUFHLHVCQUF1QixDQUFDOzs7Ozs7SUFLckMsa0JBQWtCO1lBQWxCLGtCQUFrQjs7QUFDWCxXQURQLGtCQUFrQixHQUNSOzBCQURWLGtCQUFrQjs7QUFFcEIsK0JBRkUsa0JBQWtCLDZDQUVkLFVBQVUsRUFBRSxJQUFJLEVBQUU7O0FBRXhCLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzVEOzs7O2VBTEcsa0JBQWtCOztXQVFsQixnQkFBRztBQUNMLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2xCOzs7OztXQUdJLGlCQUFHO0FBQ04saUNBZEUsa0JBQWtCLHVDQWNOOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUNsQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNyQixVQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUNoRDs7Ozs7Ozs7OztXQVFFLGFBQUMsSUFBSSxFQUFFO0FBQ1IsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3hCOzs7V0FFZ0IsMkJBQUMsSUFBSSxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNkOzs7U0FwQ0csa0JBQWtCOzs7QUF1Q3hCLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs7cUJBRXpDLGtCQUFrQiIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudFNoYXJlZENvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1jb25maWcnO1xuXG4vKipcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gcmV0cmlldmUgcGFydCBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gdG8gY2xpZW50LlxuICovXG5jbGFzcyBDbGllbnRTaGFyZWRDb25maWcgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlID0gdGhpcy5fb25Db25maWdSZXNwb25zZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIGluaXQoKSB7XG4gICAgdGhpcy5kYXRhID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuICAgIHRoaXMucmVjZWl2ZSgnY29uZmlnJywgdGhpcy5fb25Db25maWdSZXNwb25zZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYSBjb25maWd1cmF0aW9uIGVudHJ5IGZyb20gaXRzIHBhdGgsIGFzIGRlZmluZWQgaW4gc2VydmVyIHNpZGVcbiAgICogc2VydmljZSdzIGBhZGRJdGVtYCBtZXRob2QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggb2YgdGhlIGNvbmZpZ3VyYXRpb24gKGV4OiBgJ3NldHVwLmFyZWEnYClcbiAgICogQHJldHVybiB7TWl4ZWR9XG4gICAqL1xuICBnZXQocGF0aCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFbcGF0aF07XG4gIH1cblxuICBfb25Db25maWdSZXNwb25zZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2xpZW50U2hhcmVkQ29uZmlnKTtcblxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50U2hhcmVkQ29uZmlnO1xuIl19