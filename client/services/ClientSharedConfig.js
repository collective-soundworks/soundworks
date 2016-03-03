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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudFNoYXJlZENvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tDQUEyQix3QkFBd0I7Ozs7MkJBQy9CLGlCQUFpQjs7OzswQkFDbEIsZ0JBQWdCOzs7O0FBR25DLElBQU0sVUFBVSxHQUFHLHVCQUF1QixDQUFDOzs7Ozs7SUFLckMsa0JBQWtCO1lBQWxCLGtCQUFrQjs7QUFDWCxXQURQLGtCQUFrQixHQUNSOzBCQURWLGtCQUFrQjs7QUFFcEIsK0JBRkUsa0JBQWtCLDZDQUVkLFVBQVUsRUFBRSxJQUFJLEVBQUU7Ozs7OztBQU14QixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFakIsUUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDNUQ7Ozs7ZUFYRyxrQkFBa0I7O1dBY2IsbUJBQUMsT0FBTyxFQUFFO0FBQ2pCLFVBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtBQUNqQixZQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCxlQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUM7T0FDdEI7O0FBRUQsaUNBcEJFLGtCQUFrQiwyQ0FvQkosT0FBTyxFQUFFO0tBQzFCOzs7OztXQUdHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7S0FDbEI7Ozs7O1dBR0ksaUJBQUc7QUFDTixpQ0E5QkUsa0JBQWtCLHVDQThCTjs7QUFFZCxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFDbEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUNoRDs7Ozs7Ozs7OztXQVFFLGFBQUMsSUFBSSxFQUFFO0FBQ1IsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QixVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDOztBQUVwQixXQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtlQUFLLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO09BQUEsQ0FBQyxDQUFDOztBQUV6QyxhQUFPLEdBQUcsQ0FBQztLQUNaOzs7V0FFZ0IsMkJBQUMsSUFBSSxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxJQUFJLEdBQUcsd0JBQU8sTUFBTSxHQUFHLElBQUksQ0FBQztBQUNqQyxVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDZDs7O1NBekRHLGtCQUFrQjs7O0FBNER4QixnQ0FBZSxRQUFRLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLENBQUM7O3FCQUV6QyxrQkFBa0IiLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50U2hhcmVkQ29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzaGFyZWQtY29uZmlnJztcblxuLyoqXG4gKiBUaGlzIHNlcnZpY2UgYWxsb3dzIHRvIHJldHJpZXZlIHBhcnQgb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uIHRvIGNsaWVudC5cbiAqL1xuY2xhc3MgQ2xpZW50U2hhcmVkQ29uZmlnIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgLyoqXG4gICAgICogQ29uZmlndXJhdGlvbiBpdGVtcyByZXF1aXJlZCBieSB0aGUgY2xpZW50LlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICB0aGlzLl9pdGVtcyA9IFtdO1xuXG4gICAgdGhpcy5fb25Db25maWdSZXNwb25zZSA9IHRoaXMuX29uQ29uZmlnUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLml0ZW1zKSB7XG4gICAgICB0aGlzLl9pdGVtcyA9IHRoaXMuX2l0ZW1zLmNvbmNhdChvcHRpb25zLml0ZW1zKTtcbiAgICAgIGRlbGV0ZSBvcHRpb25zLml0ZW1zO1xuICAgIH1cblxuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBpbml0KCkge1xuICAgIHRoaXMuZGF0YSA9IG51bGw7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnLCB0aGlzLl9pdGVtcyk7XG4gICAgdGhpcy5yZWNlaXZlKCdjb25maWcnLCB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhIGNvbmZpZ3VyYXRpb24gdmFsdWUgZnJvbSBpdHMga2V5IGl0ZW0sIGFzIGRlZmluZWQgaW4gc2VydmVyIHNpZGVcbiAgICogc2VydmljZSdzIGBhZGRJdGVtYCBtZXRob2QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpdGVtIC0gVGhlIGl0ZW0gb2YgdGhlIGNvbmZpZ3VyYXRpb24gKGV4OiBgJ3NldHVwLmFyZWEnYClcbiAgICogQHJldHVybiB7TWl4ZWR9XG4gICAqL1xuICBnZXQoaXRlbSkge1xuICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdCgnLicpO1xuICAgIGxldCB0bXAgPSB0aGlzLmRhdGE7XG5cbiAgICBwYXJ0cy5mb3JFYWNoKChhdHRyKSA9PiB0bXAgPSB0bXBbYXR0cl0pO1xuXG4gICAgcmV0dXJuIHRtcDtcbiAgfVxuXG4gIF9vbkNvbmZpZ1Jlc3BvbnNlKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBjbGllbnQuY29uZmlnID0gZGF0YTtcbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2xpZW50U2hhcmVkQ29uZmlnKTtcblxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50U2hhcmVkQ29uZmlnO1xuIl19