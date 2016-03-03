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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyU2hhcmVkQ29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQ0FBMkIsd0JBQXdCOzs7O3dDQUNsQiw4QkFBOEI7Ozs7MEJBQzVDLGdCQUFnQjs7OztBQUduQyxJQUFNLFVBQVUsR0FBRyx1QkFBdUIsQ0FBQzs7Ozs7OztJQU1yQyxrQkFBa0I7WUFBbEIsa0JBQWtCOztBQUNYLFdBRFAsa0JBQWtCLEdBQ1I7MEJBRFYsa0JBQWtCOztBQUVwQiwrQkFGRSxrQkFBa0IsNkNBRWQsVUFBVSxFQUFFOztBQUVsQixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNqQixRQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztHQUMzQjs7OztlQU5HLGtCQUFrQjs7V0FTZixpQkFBQyxNQUFNLEVBQUU7QUFDZCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQzFEOzs7Ozs7Ozs7Ozs7V0FVRSxhQUFDLElBQUksRUFBRTtBQUNSLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDOUIsVUFBSSxLQUFLLEdBQUcsd0JBQU8sTUFBTSxDQUFDOztBQUUxQixXQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3RCLFlBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxFQUNiLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FFcEIsS0FBSyxHQUFHLElBQUksQ0FBQztPQUNoQixDQUFDLENBQUM7O0FBRUgsYUFBTyxLQUFLLENBQUM7S0FDZDs7Ozs7Ozs7O1dBT00saUJBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtBQUN4QixVQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsRUFDbkMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsR0FBRyxVQUFTLENBQUMsQ0FBQzs7QUFFaEQsVUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDNUM7Ozs7Ozs7OztXQU9TLG9CQUFDLFVBQVUsRUFBRTtBQUNyQixVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQ3pCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFakMsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMvQyxVQUFNLFlBQVksR0FBRyx3QkFBTyxNQUFNLENBQUM7QUFDbkMsVUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDOzs7QUFHaEIsV0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN0QixZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLFlBQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7QUFFbkIsYUFBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN0QixjQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUNoQixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVyQixpQkFBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN6QixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7OztBQUdILFdBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDdEIsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QixZQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3pCLFlBQUksS0FBSyxHQUFHLFlBQVksQ0FBQztBQUN6QixZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7O0FBRW5CLGFBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFLO0FBQzdCLGVBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXBCLGNBQUksS0FBSyxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQ2pCLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FFeEIsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUN6QixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDL0IsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBRVMsb0JBQUMsTUFBTSxFQUFFOzs7O0FBRWpCLGFBQU8sVUFBQyxLQUFLLEVBQUs7QUFDaEIsYUFBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7aUJBQUssTUFBSyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUM7U0FBQSxDQUFDLENBQUM7O0FBRXpELFlBQU0sTUFBTSxHQUFHLE1BQUssVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxjQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ3JDLENBQUE7S0FDRjs7O1NBdEdHLGtCQUFrQjs7O0FBeUd4QixzQ0FBcUIsUUFBUSxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDOztxQkFFL0Msa0JBQWtCIiwiZmlsZSI6Ii9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyU2hhcmVkQ29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuLi9jb3JlL3NlcnZlcic7XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1jb25maWcnO1xuXG4vKipcbiAqIFtzZXJ2ZXJdIFNlcnZpY2UgdGhhdCBhY3RzIGFzIGFuIGFjY2Vzc29yIGZvciB0aGUgc2VydmVyIGNvbmZpZyBmb3IgYm90aFxuICogc2VydmVyIGFuZCBjbGllbnQgc2lkZXMuXG4gKi9cbmNsYXNzIFNlcnZlclNoYXJlZENvbmZpZyBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICB0aGlzLl9jYWNoZSA9IHt9O1xuICAgIHRoaXMuX2NsaWVudEl0ZW1zTWFwID0ge307XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGl0ZW0gb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uIGZyb20gaXRzIHBhdGguIEZvciBzZXJ2ZXItc2lkZSB1c2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpdGVtIC0gU3RyaW5nIHJlcHJlc2VudGluZyB0aGUgcGF0aCB0byB0aGUgY29uZmlndXJhdGlvblxuICAgKiAgZXguIGAnc2V0dXAuYXJlYSdgIHdpbGwgc2VhcmNoIGZvciB0aGUgYGFyZWFgIGVudHJ5IG9mIHRoZSAnYHNldHVwYCcgZW50cnlcbiAgICogIG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAgICogQHJldHVybnMge01peGVkfSAtIFRoZSB2YWx1ZSBvZiB0aGUgcmVxdWVzdCBpdGVtLiBSZXR1cm5zIGBudWxsYCBpZlxuICAgKiAgdGhlIGdpdmVuIGl0ZW0gZG9lcyBub3QgZXhpc3RzLlxuICAgKi9cbiAgZ2V0KGl0ZW0pIHtcbiAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICBsZXQgdmFsdWUgPSBzZXJ2ZXIuY29uZmlnO1xuICAgIC8vIHNlYXJjaCBpdGVtIHRocm91Z2ggY29uZmlnXG4gICAgcGFydHMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgaWYgKHZhbHVlW2F0dHJdKVxuICAgICAgICB2YWx1ZSA9IHZhbHVlW2F0dHJdO1xuICAgICAgZWxzZVxuICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcmVxdWlyZWQgaXRlbSBmcm9tIHNlcnZlciBzaWRlIHRvIGEgc3BlY2lmaWMgY2xpZW50LiBUaGlzIHNob3VsZCBiZVxuICAgKiBjYWxsZWQgb24gU2VydmVyQWN0aXZpdGllcyBpbml0aWFsaXphdGlvbi5cbiAgICpcbiAgICovXG4gIGFkZEl0ZW0oaXRlbSwgY2xpZW50VHlwZSkge1xuICAgIGlmICghdGhpcy5fY2xpZW50SXRlbXNNYXBbY2xpZW50VHlwZV0pXG4gICAgICB0aGlzLl9jbGllbnRJdGVtc01hcFtjbGllbnRUeXBlXSA9IG5ldyBTZXQoKTs7XG5cbiAgICB0aGlzLl9jbGllbnRJdGVtc01hcFtjbGllbnRUeXBlXS5hZGQoaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgYSBvYmplY3QgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBpdGVtcy4gVGhlIHJlc3VsdCBpcyBjYWNoZWRcbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBpdGVtcyAtIFRoZSBwYXRoIHRvIHRoZSBpdGVtcyB0byBiZSBzaGFyZWQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IC0gQW4gb3B0aW1pemVkIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgcmVxdWVzdGVkIGl0ZW1zLlxuICAgKi9cbiAgX2dldFZhbHVlcyhjbGllbnRUeXBlKSB7XG4gICAgaWYgKHRoaXMuX2NhY2hlW2NsaWVudFR5cGVdKVxuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlW2NsaWVudFR5cGVdO1xuXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLl9jbGllbnRJdGVtc01hcFtjbGllbnRUeXBlXTtcbiAgICBjb25zdCBzZXJ2ZXJDb25maWcgPSBzZXJ2ZXIuY29uZmlnO1xuICAgIGNvbnN0IGRhdGEgPSB7fTtcblxuICAgIC8vIGJ1aWxkIGRhdGEgdHJlZVxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdCgnLicpO1xuICAgICAgbGV0IHBvaW50ZXIgPSBkYXRhO1xuXG4gICAgICBwYXJ0cy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICAgIGlmICghcG9pbnRlclthdHRyXSlcbiAgICAgICAgICBwb2ludGVyW2F0dHJdID0ge307XG5cbiAgICAgICAgcG9pbnRlciA9IHBvaW50ZXJbYXR0cl07XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIHBvcHVsYXRlIHByZXZpb3VzbHkgYnVpbGRlZCB0cmVlXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCcuJyk7XG4gICAgICBjb25zdCBsZW4gPSBwYXJ0cy5sZW5ndGg7XG4gICAgICBsZXQgdmFsdWUgPSBzZXJ2ZXJDb25maWc7XG4gICAgICBsZXQgcG9pbnRlciA9IGRhdGE7XG5cbiAgICAgIHBhcnRzLmZvckVhY2goKGF0dHIsIGluZGV4KSA9PiB7XG4gICAgICAgIHZhbHVlID0gdmFsdWVbYXR0cl07XG5cbiAgICAgICAgaWYgKGluZGV4IDwgbGVuIC0gMSlcbiAgICAgICAgICBwb2ludGVyID0gcG9pbnRlclthdHRyXTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBvaW50ZXJbYXR0cl0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fY2FjaGVbY2xpZW50VHlwZV0gPSBkYXRhO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICAvLyBnZW5lcmF0ZSBhbiBvcHRpbWl6ZWQgY29uZmlnIGJ1bmRsZSB0byByZXR1cm4gdGhlIGNsaWVudFxuICAgIHJldHVybiAoaXRlbXMpID0+IHtcbiAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMuYWRkSXRlbShpdGVtLCBjbGllbnQudHlwZSkpO1xuXG4gICAgICBjb25zdCBjb25maWcgPSB0aGlzLl9nZXRWYWx1ZXMoY2xpZW50LnR5cGUpO1xuICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2NvbmZpZycsIGNvbmZpZyk7XG4gICAgfVxuICB9XG59XG5cbnNlcnZlclNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNlcnZlclNoYXJlZENvbmZpZyk7XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlclNoYXJlZENvbmZpZztcbiJdfQ==