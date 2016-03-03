'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

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
     * Generate a object according to the given items. The result is cached
     * @param {Array<String>} items - The path to the items to be shared.
     * @returns {Object} - An optimized object containing all the requested items.
     */
  }, {
    key: '_generateFromItems',
    value: function _generateFromItems(items) {
      var key = items.join(':');

      if (this._cache[key]) return this._cache[key];

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

      this._cache[key] = data;
      return data;
    }
  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this = this;

      // generate an optimized config bundle to return the client
      return function (items) {
        var config = _this._generateFromItems(items);
        _this.send(client, 'config', config);
      };
    }
  }]);

  return ServerSharedConfig;
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerSharedConfig);

exports['default'] = ServerSharedConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyU2hhcmVkQ29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7Ozt3Q0FDbEIsOEJBQThCOzs7OzBCQUM1QyxnQkFBZ0I7Ozs7QUFHbkMsSUFBTSxVQUFVLEdBQUcsdUJBQXVCLENBQUM7Ozs7Ozs7SUFNckMsa0JBQWtCO1lBQWxCLGtCQUFrQjs7QUFDWCxXQURQLGtCQUFrQixHQUNSOzBCQURWLGtCQUFrQjs7QUFFcEIsK0JBRkUsa0JBQWtCLDZDQUVkLFVBQVUsRUFBRTs7QUFFbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7R0FDbEI7Ozs7ZUFMRyxrQkFBa0I7O1dBUWYsaUJBQUMsTUFBTSxFQUFFO0FBQ2QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUMxRDs7Ozs7Ozs7Ozs7O1dBVUUsYUFBQyxJQUFJLEVBQUU7QUFDUixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLFVBQUksS0FBSyxHQUFHLHdCQUFPLE1BQU0sQ0FBQzs7QUFFMUIsV0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN0QixZQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFDYixLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBRXBCLEtBQUssR0FBRyxJQUFJLENBQUM7T0FDaEIsQ0FBQyxDQUFDOztBQUVILGFBQU8sS0FBSyxDQUFDO0tBQ2Q7Ozs7Ozs7OztXQU9pQiw0QkFBQyxLQUFLLEVBQUU7QUFDeEIsVUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFNUIsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUNsQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTFCLFVBQU0sWUFBWSxHQUFHLHdCQUFPLE1BQU0sQ0FBQztBQUNuQyxVQUFNLElBQUksR0FBRyxFQUFFLENBQUM7OztBQUdoQixXQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3RCLFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDOUIsWUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVuQixhQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3RCLGNBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQ2hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRXJCLGlCQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3pCLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQzs7O0FBR0gsV0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN0QixZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLFlBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDekIsWUFBSSxLQUFLLEdBQUcsWUFBWSxDQUFDO0FBQ3pCLFlBQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7QUFFbkIsYUFBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUs7QUFDN0IsZUFBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFcEIsY0FBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFDakIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUV4QixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQ3pCLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN4QixhQUFPLElBQUksQ0FBQztLQUNiOzs7V0FFUyxvQkFBQyxNQUFNLEVBQUU7Ozs7QUFFakIsYUFBTyxVQUFDLEtBQUssRUFBSztBQUNoQixZQUFNLE1BQU0sR0FBRyxNQUFLLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlDLGNBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDckMsQ0FBQTtLQUNGOzs7U0F4Rkcsa0JBQWtCOzs7QUEyRnhCLHNDQUFxQixRQUFRLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLENBQUM7O3FCQUUvQyxrQkFBa0IiLCJmaWxlIjoiL1VzZXJzL21hdHVzemV3c2tpL2Rldi9jb3NpbWEvbGliL3NvdW5kd29ya3Mvc3JjL3NlcnZlci9zZXJ2aWNlcy9TZXJ2ZXJTaGFyZWRDb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc2VydmVyIGZyb20gJy4uL2NvcmUvc2VydmVyJztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLWNvbmZpZyc7XG5cbi8qKlxuICogW3NlcnZlcl0gU2VydmljZSB0aGF0IGFjdHMgYXMgYW4gYWNjZXNzb3IgZm9yIHRoZSBzZXJ2ZXIgY29uZmlnIGZvciBib3RoXG4gKiBzZXJ2ZXIgYW5kIGNsaWVudCBzaWRlcy5cbiAqL1xuY2xhc3MgU2VydmVyU2hhcmVkQ29uZmlnIGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIHRoaXMuX2NhY2hlID0ge307XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGl0ZW0gb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uIGZyb20gaXRzIHBhdGguIEZvciBzZXJ2ZXItc2lkZSB1c2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpdGVtIC0gU3RyaW5nIHJlcHJlc2VudGluZyB0aGUgcGF0aCB0byB0aGUgY29uZmlndXJhdGlvblxuICAgKiAgZXguIGAnc2V0dXAuYXJlYSdgIHdpbGwgc2VhcmNoIGZvciB0aGUgYGFyZWFgIGVudHJ5IG9mIHRoZSAnYHNldHVwYCcgZW50cnlcbiAgICogIG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAgICogQHJldHVybnMge01peGVkfSAtIFRoZSB2YWx1ZSBvZiB0aGUgcmVxdWVzdCBpdGVtLiBSZXR1cm5zIGBudWxsYCBpZlxuICAgKiAgdGhlIGdpdmVuIGl0ZW0gZG9lcyBub3QgZXhpc3RzLlxuICAgKi9cbiAgZ2V0KGl0ZW0pIHtcbiAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICBsZXQgdmFsdWUgPSBzZXJ2ZXIuY29uZmlnO1xuICAgIC8vIHNlYXJjaCBpdGVtIHRocm91Z2ggY29uZmlnXG4gICAgcGFydHMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgaWYgKHZhbHVlW2F0dHJdKVxuICAgICAgICB2YWx1ZSA9IHZhbHVlW2F0dHJdO1xuICAgICAgZWxzZVxuICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgYSBvYmplY3QgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBpdGVtcy4gVGhlIHJlc3VsdCBpcyBjYWNoZWRcbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBpdGVtcyAtIFRoZSBwYXRoIHRvIHRoZSBpdGVtcyB0byBiZSBzaGFyZWQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IC0gQW4gb3B0aW1pemVkIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgcmVxdWVzdGVkIGl0ZW1zLlxuICAgKi9cbiAgX2dlbmVyYXRlRnJvbUl0ZW1zKGl0ZW1zKSB7XG4gICAgY29uc3Qga2V5ID0gaXRlbXMuam9pbignOicpO1xuXG4gICAgaWYgKHRoaXMuX2NhY2hlW2tleV0pXG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVba2V5XTtcblxuICAgIGNvbnN0IHNlcnZlckNvbmZpZyA9IHNlcnZlci5jb25maWc7XG4gICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgLy8gYnVpbGQgZGF0YSB0cmVlXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCcuJyk7XG4gICAgICBsZXQgcG9pbnRlciA9IGRhdGE7XG5cbiAgICAgIHBhcnRzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgICAgaWYgKCFwb2ludGVyW2F0dHJdKVxuICAgICAgICAgIHBvaW50ZXJbYXR0cl0gPSB7fTtcblxuICAgICAgICBwb2ludGVyID0gcG9pbnRlclthdHRyXTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gcG9wdWxhdGUgcHJldmlvdXNseSBidWlsZGVkIHRyZWVcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICAgIGNvbnN0IGxlbiA9IHBhcnRzLmxlbmd0aDtcbiAgICAgIGxldCB2YWx1ZSA9IHNlcnZlckNvbmZpZztcbiAgICAgIGxldCBwb2ludGVyID0gZGF0YTtcblxuICAgICAgcGFydHMuZm9yRWFjaCgoYXR0ciwgaW5kZXgpID0+IHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZVthdHRyXTtcblxuICAgICAgICBpZiAoaW5kZXggPCBsZW4gLSAxKVxuICAgICAgICAgIHBvaW50ZXIgPSBwb2ludGVyW2F0dHJdO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcG9pbnRlclthdHRyXSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jYWNoZVtrZXldID0gZGF0YTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgLy8gZ2VuZXJhdGUgYW4gb3B0aW1pemVkIGNvbmZpZyBidW5kbGUgdG8gcmV0dXJuIHRoZSBjbGllbnRcbiAgICByZXR1cm4gKGl0ZW1zKSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSB0aGlzLl9nZW5lcmF0ZUZyb21JdGVtcyhpdGVtcyk7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnY29uZmlnJywgY29uZmlnKTtcbiAgICB9XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyU2hhcmVkQ29uZmlnKTtcblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyU2hhcmVkQ29uZmlnO1xuIl19