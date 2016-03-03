'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreServerActivity = require('../core/ServerActivity');

var _coreServerActivity2 = _interopRequireDefault(_coreServerActivity);

var _coreServerServiceManager = require('../core/serverServiceManager');

var _coreServerServiceManager2 = _interopRequireDefault(_coreServerServiceManager);

var _coreServer = require('../core/server');

var _coreServer2 = _interopRequireDefault(_coreServer);

var SERVICE_ID = 'service:shared-config';

/**
 * [server] Service that acts as an accessor for the server config for both
 * server and client sides.
 */

var ServerSharedConfig = (function (_ServerActivity) {
  _inherits(ServerSharedConfig, _ServerActivity);

  function ServerSharedConfig() {
    _classCallCheck(this, ServerSharedConfig);

    _get(Object.getPrototypeOf(ServerSharedConfig.prototype), 'constructor', this).call(this, SERVICE_ID);

    this._cache = {};
    this._clientItemsMap = {};
  }

  /** @inheritdoc */

  _createClass(ServerSharedConfig, [{
    key: 'connect',
    value: function connect(client) {
      this.receive(client, 'request', this._onRequest(client));
    }

    /**
     * Returns an item of the server configuration from its path. For server-side use.
     * @param {String} item - String representing the path to the configuration
     *  ex. `'setup.area'` will search for the `area` entry of the '`setup`' entry
     *  of the server configuration.
     * @returns {Mixed} - The value of the request item. Returns `null` if
     *  the given item does not exists.
     */
  }, {
    key: 'get',
    value: function get(item) {
      var parts = item.split('.');
      var value = _coreServer2['default'].config;
      // search item through config
      parts.forEach(function (attr) {
        if (value[attr]) value = value[attr];else value = null;
      });

      return value;
    }

    /**
     * Add a required item from server side to a specific client. This should be
     * called on ServerActivities initialization.
     *
     */
  }, {
    key: 'addItem',
    value: function addItem(item, clientType) {
      if (!this._clientItemsMap[clientType]) this._clientItemsMap[clientType] = new _Set();;

      this._clientItemsMap[clientType].add(item);
    }

    /**
     * Generate a object according to the given items. The result is cached
     * @param {Array<String>} items - The path to the items to be shared.
     * @returns {Object} - An optimized object containing all the requested items.
     */
  }, {
    key: '_getValues',
    value: function _getValues(clientType) {
      if (this._cache[clientType]) return this._cache[clientType];

      var items = this._clientItemsMap[clientType];
      var serverConfig = _coreServer2['default'].config;
      var data = {};

      // build data tree
      items.forEach(function (item) {
        var parts = item.split('.');
        var pointer = data;

        parts.forEach(function (attr) {
          if (!pointer[attr]) pointer[attr] = {};

          pointer = pointer[attr];
        });
      });

      // populate previously builded tree
      items.forEach(function (item) {
        var parts = item.split('.');
        var len = parts.length;
        var value = serverConfig;
        var pointer = data;

        parts.forEach(function (attr, index) {
          value = value[attr];

          if (index < len - 1) pointer = pointer[attr];else pointer[attr] = value;
        });
      });

      this._cache[clientType] = data;
      return data;
    }
  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this = this;

      // generate an optimized config bundle to return the client
      return function (items) {
        items.forEach(function (item) {
          return _this.addItem(item, client.type);
        });

        var config = _this._getValues(client.type);
        _this.send(client, 'config', config);
      };
    }
  }]);

  return ServerSharedConfig;
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerSharedConfig);

exports['default'] = ServerSharedConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlclNoYXJlZENvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7Ozt3Q0FDbEIsOEJBQThCOzs7OzBCQUM1QyxnQkFBZ0I7Ozs7QUFHbkMsSUFBTSxVQUFVLEdBQUcsdUJBQXVCLENBQUM7Ozs7Ozs7SUFNckMsa0JBQWtCO1lBQWxCLGtCQUFrQjs7QUFDWCxXQURQLGtCQUFrQixHQUNSOzBCQURWLGtCQUFrQjs7QUFFcEIsK0JBRkUsa0JBQWtCLDZDQUVkLFVBQVUsRUFBRTs7QUFFbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7R0FDM0I7Ozs7ZUFORyxrQkFBa0I7O1dBU2YsaUJBQUMsTUFBTSxFQUFFO0FBQ2QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUMxRDs7Ozs7Ozs7Ozs7O1dBVUUsYUFBQyxJQUFJLEVBQUU7QUFDUixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLFVBQUksS0FBSyxHQUFHLHdCQUFPLE1BQU0sQ0FBQzs7QUFFMUIsV0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN0QixZQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFDYixLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBRXBCLEtBQUssR0FBRyxJQUFJLENBQUM7T0FDaEIsQ0FBQyxDQUFDOztBQUVILGFBQU8sS0FBSyxDQUFDO0tBQ2Q7Ozs7Ozs7OztXQU9NLGlCQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7QUFDeEIsVUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEVBQ25DLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEdBQUcsVUFBUyxDQUFDLENBQUM7O0FBRWhELFVBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzVDOzs7Ozs7Ozs7V0FPUyxvQkFBQyxVQUFVLEVBQUU7QUFDckIsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUN6QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRWpDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDL0MsVUFBTSxZQUFZLEdBQUcsd0JBQU8sTUFBTSxDQUFDO0FBQ25DLFVBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQzs7O0FBR2hCLFdBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDdEIsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QixZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7O0FBRW5CLGFBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDdEIsY0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFDaEIsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsaUJBQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekIsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDOzs7QUFHSCxXQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3RCLFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDOUIsWUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUN6QixZQUFJLEtBQUssR0FBRyxZQUFZLENBQUM7QUFDekIsWUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVuQixhQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBSztBQUM3QixlQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVwQixjQUFJLEtBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUNqQixPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBRXhCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDekIsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQy9CLGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztXQUVTLG9CQUFDLE1BQU0sRUFBRTs7OztBQUVqQixhQUFPLFVBQUMsS0FBSyxFQUFLO0FBQ2hCLGFBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2lCQUFLLE1BQUssT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDO1NBQUEsQ0FBQyxDQUFDOztBQUV6RCxZQUFNLE1BQU0sR0FBRyxNQUFLLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsY0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztPQUNyQyxDQUFBO0tBQ0Y7OztTQXRHRyxrQkFBa0I7OztBQXlHeEIsc0NBQXFCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs7cUJBRS9DLGtCQUFrQiIsImZpbGUiOiIvVXNlcnMvc2NobmVsbC9EZXZlbG9wbWVudC93ZWIvY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3Mvc3JjL3NlcnZlci9zZXJ2aWNlcy9TZXJ2ZXJTaGFyZWRDb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc2VydmVyIGZyb20gJy4uL2NvcmUvc2VydmVyJztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLWNvbmZpZyc7XG5cbi8qKlxuICogW3NlcnZlcl0gU2VydmljZSB0aGF0IGFjdHMgYXMgYW4gYWNjZXNzb3IgZm9yIHRoZSBzZXJ2ZXIgY29uZmlnIGZvciBib3RoXG4gKiBzZXJ2ZXIgYW5kIGNsaWVudCBzaWRlcy5cbiAqL1xuY2xhc3MgU2VydmVyU2hhcmVkQ29uZmlnIGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIHRoaXMuX2NhY2hlID0ge307XG4gICAgdGhpcy5fY2xpZW50SXRlbXNNYXAgPSB7fTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaXRlbSBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gZnJvbSBpdHMgcGF0aC4gRm9yIHNlcnZlci1zaWRlIHVzZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGl0ZW0gLSBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBwYXRoIHRvIHRoZSBjb25maWd1cmF0aW9uXG4gICAqICBleC4gYCdzZXR1cC5hcmVhJ2Agd2lsbCBzZWFyY2ggZm9yIHRoZSBgYXJlYWAgZW50cnkgb2YgdGhlICdgc2V0dXBgJyBlbnRyeVxuICAgKiAgb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uLlxuICAgKiBAcmV0dXJucyB7TWl4ZWR9IC0gVGhlIHZhbHVlIG9mIHRoZSByZXF1ZXN0IGl0ZW0uIFJldHVybnMgYG51bGxgIGlmXG4gICAqICB0aGUgZ2l2ZW4gaXRlbSBkb2VzIG5vdCBleGlzdHMuXG4gICAqL1xuICBnZXQoaXRlbSkge1xuICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdCgnLicpO1xuICAgIGxldCB2YWx1ZSA9IHNlcnZlci5jb25maWc7XG4gICAgLy8gc2VhcmNoIGl0ZW0gdGhyb3VnaCBjb25maWdcbiAgICBwYXJ0cy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICBpZiAodmFsdWVbYXR0cl0pXG4gICAgICAgIHZhbHVlID0gdmFsdWVbYXR0cl07XG4gICAgICBlbHNlXG4gICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICB9KTtcblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSByZXF1aXJlZCBpdGVtIGZyb20gc2VydmVyIHNpZGUgdG8gYSBzcGVjaWZpYyBjbGllbnQuIFRoaXMgc2hvdWxkIGJlXG4gICAqIGNhbGxlZCBvbiBTZXJ2ZXJBY3Rpdml0aWVzIGluaXRpYWxpemF0aW9uLlxuICAgKlxuICAgKi9cbiAgYWRkSXRlbShpdGVtLCBjbGllbnRUeXBlKSB7XG4gICAgaWYgKCF0aGlzLl9jbGllbnRJdGVtc01hcFtjbGllbnRUeXBlXSlcbiAgICAgIHRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdID0gbmV3IFNldCgpOztcblxuICAgIHRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdLmFkZChpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhIG9iamVjdCBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIGl0ZW1zLiBUaGUgcmVzdWx0IGlzIGNhY2hlZFxuICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IGl0ZW1zIC0gVGhlIHBhdGggdG8gdGhlIGl0ZW1zIHRvIGJlIHNoYXJlZC5cbiAgICogQHJldHVybnMge09iamVjdH0gLSBBbiBvcHRpbWl6ZWQgb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSByZXF1ZXN0ZWQgaXRlbXMuXG4gICAqL1xuICBfZ2V0VmFsdWVzKGNsaWVudFR5cGUpIHtcbiAgICBpZiAodGhpcy5fY2FjaGVbY2xpZW50VHlwZV0pXG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVbY2xpZW50VHlwZV07XG5cbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdO1xuICAgIGNvbnN0IHNlcnZlckNvbmZpZyA9IHNlcnZlci5jb25maWc7XG4gICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgLy8gYnVpbGQgZGF0YSB0cmVlXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCcuJyk7XG4gICAgICBsZXQgcG9pbnRlciA9IGRhdGE7XG5cbiAgICAgIHBhcnRzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgICAgaWYgKCFwb2ludGVyW2F0dHJdKVxuICAgICAgICAgIHBvaW50ZXJbYXR0cl0gPSB7fTtcblxuICAgICAgICBwb2ludGVyID0gcG9pbnRlclthdHRyXTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gcG9wdWxhdGUgcHJldmlvdXNseSBidWlsZGVkIHRyZWVcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICAgIGNvbnN0IGxlbiA9IHBhcnRzLmxlbmd0aDtcbiAgICAgIGxldCB2YWx1ZSA9IHNlcnZlckNvbmZpZztcbiAgICAgIGxldCBwb2ludGVyID0gZGF0YTtcblxuICAgICAgcGFydHMuZm9yRWFjaCgoYXR0ciwgaW5kZXgpID0+IHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZVthdHRyXTtcblxuICAgICAgICBpZiAoaW5kZXggPCBsZW4gLSAxKVxuICAgICAgICAgIHBvaW50ZXIgPSBwb2ludGVyW2F0dHJdO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcG9pbnRlclthdHRyXSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jYWNoZVtjbGllbnRUeXBlXSA9IGRhdGE7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIC8vIGdlbmVyYXRlIGFuIG9wdGltaXplZCBjb25maWcgYnVuZGxlIHRvIHJldHVybiB0aGUgY2xpZW50XG4gICAgcmV0dXJuIChpdGVtcykgPT4ge1xuICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy5hZGRJdGVtKGl0ZW0sIGNsaWVudC50eXBlKSk7XG5cbiAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuX2dldFZhbHVlcyhjbGllbnQudHlwZSk7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnY29uZmlnJywgY29uZmlnKTtcbiAgICB9XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyU2hhcmVkQ29uZmlnKTtcblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyU2hhcmVkQ29uZmlnO1xuIl19