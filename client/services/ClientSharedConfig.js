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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50U2hhcmVkQ29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7OzsyQkFDL0IsaUJBQWlCOzs7O0FBR3JDLElBQU0sVUFBVSxHQUFHLHVCQUF1QixDQUFDOzs7Ozs7SUFLckMsa0JBQWtCO1lBQWxCLGtCQUFrQjs7QUFDWCxXQURQLGtCQUFrQixHQUNSOzBCQURWLGtCQUFrQjs7QUFFcEIsK0JBRkUsa0JBQWtCLDZDQUVkLFVBQVUsRUFBRSxJQUFJLEVBQUU7O0FBRXhCLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzVEOzs7O2VBTEcsa0JBQWtCOztXQVFsQixnQkFBRztBQUNMLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2xCOzs7OztXQUdJLGlCQUFHO0FBQ04saUNBZEUsa0JBQWtCLHVDQWNOOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUNsQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFckIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDaEQ7Ozs7Ozs7Ozs7V0FRRSxhQUFDLElBQUksRUFBRTtBQUNSLGFBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4Qjs7O1dBRWdCLDJCQUFDLElBQUksRUFBRTtBQUN0QixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDZDs7O1NBckNHLGtCQUFrQjs7O0FBd0N4QixnQ0FBZSxRQUFRLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLENBQUM7O3FCQUV6QyxrQkFBa0IiLCJmaWxlIjoic3JjL2NsaWVudC9zZXJ2aWNlcy9DbGllbnRTaGFyZWRDb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzaGFyZWQtY29uZmlnJztcblxuLyoqXG4gKiBUaGlzIHNlcnZpY2UgYWxsb3dzIHRvIHJldHJpZXZlIHBhcnQgb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uIHRvIGNsaWVudC5cbiAqL1xuY2xhc3MgQ2xpZW50U2hhcmVkQ29uZmlnIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgdGhpcy5fb25Db25maWdSZXNwb25zZSA9IHRoaXMuX29uQ29uZmlnUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBpbml0KCkge1xuICAgIHRoaXMuZGF0YSA9IG51bGw7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnY29uZmlnJywgdGhpcy5fb25Db25maWdSZXNwb25zZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYSBjb25maWd1cmF0aW9uIGVudHJ5IGZyb20gaXRzIHBhdGgsIGFzIGRlZmluZWQgaW4gc2VydmVyIHNpZGVcbiAgICogc2VydmljZSdzIGBhZGRJdGVtYCBtZXRob2QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggb2YgdGhlIGNvbmZpZ3VyYXRpb24gKGV4OiBgJ3NldHVwLmFyZWEnYClcbiAgICogQHJldHVybiB7TWl4ZWR9XG4gICAqL1xuICBnZXQocGF0aCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFbcGF0aF07XG4gIH1cblxuICBfb25Db25maWdSZXNwb25zZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2xpZW50U2hhcmVkQ29uZmlnKTtcblxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50U2hhcmVkQ29uZmlnO1xuIl19