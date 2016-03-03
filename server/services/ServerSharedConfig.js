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
     * returns {Object<String, Mixed>} - An object containing all the configuration
     *  informations, ordered with the configuration paths as keys.
     */
  }, {
    key: 'get',
    value: function get(item) {
      var parts = item.split('.');
      var value = serverConfig;
      // search item through config
      parts.forEach(function (attr) {
        if (value[attr]) value = value[attr];else throw new Error('Invalid item: "' + item + '"');
      });

      return value;
    }

    /**
     * Generate a object according to the given items. The result is cached
     * @param {Array<String>} items - The path to the items to be shared.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyU2hhcmVkQ29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7Ozt3Q0FDbEIsOEJBQThCOzs7OzBCQUM1QyxnQkFBZ0I7Ozs7QUFHbkMsSUFBTSxVQUFVLEdBQUcsdUJBQXVCLENBQUM7Ozs7Ozs7SUFNckMsa0JBQWtCO1lBQWxCLGtCQUFrQjs7QUFDWCxXQURQLGtCQUFrQixHQUNSOzBCQURWLGtCQUFrQjs7QUFFcEIsK0JBRkUsa0JBQWtCLDZDQUVkLFVBQVUsRUFBRTs7QUFFbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7R0FDbEI7Ozs7ZUFMRyxrQkFBa0I7O1dBUWYsaUJBQUMsTUFBTSxFQUFFO0FBQ2QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUMxRDs7Ozs7Ozs7Ozs7O1dBVUUsYUFBQyxJQUFJLEVBQUU7QUFDUixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLFVBQUksS0FBSyxHQUFHLFlBQVksQ0FBQzs7QUFFekIsV0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN0QixZQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFDYixLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBRXBCLE1BQU0sSUFBSSxLQUFLLHFCQUFtQixJQUFJLE9BQUksQ0FBQztPQUM5QyxDQUFDLENBQUE7O0FBRUYsYUFBTyxLQUFLLENBQUM7S0FDZDs7Ozs7Ozs7V0FNaUIsNEJBQUMsS0FBSyxFQUFFO0FBQ3hCLFVBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTVCLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFDbEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUUxQixVQUFNLFlBQVksR0FBRyx3QkFBTyxNQUFNLENBQUM7QUFDbkMsVUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDOzs7QUFHaEIsV0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN0QixZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLFlBQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7QUFFbkIsYUFBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN0QixjQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUNoQixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVyQixpQkFBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN6QixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7OztBQUdILFdBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDdEIsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QixZQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3pCLFlBQUksS0FBSyxHQUFHLFlBQVksQ0FBQztBQUN6QixZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7O0FBRW5CLGFBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFLO0FBQzdCLGVBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXBCLGNBQUksS0FBSyxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQ2pCLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FFeEIsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUN6QixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDeEIsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBRVMsb0JBQUMsTUFBTSxFQUFFOzs7O0FBRWpCLGFBQU8sVUFBQyxLQUFLLEVBQUs7QUFDaEIsWUFBTSxNQUFNLEdBQUcsTUFBSyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QyxjQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ3JDLENBQUE7S0FDRjs7O1NBdkZHLGtCQUFrQjs7O0FBMEZ4QixzQ0FBcUIsUUFBUSxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDOztxQkFFL0Msa0JBQWtCIiwiZmlsZSI6Ii9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyU2hhcmVkQ29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuLi9jb3JlL3NlcnZlcic7XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1jb25maWcnO1xuXG4vKipcbiAqIFtzZXJ2ZXJdIFNlcnZpY2UgdGhhdCBhY3RzIGFzIGFuIGFjY2Vzc29yIGZvciB0aGUgc2VydmVyIGNvbmZpZyBmb3IgYm90aFxuICogc2VydmVyIGFuZCBjbGllbnQgc2lkZXMuXG4gKi9cbmNsYXNzIFNlcnZlclNoYXJlZENvbmZpZyBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICB0aGlzLl9jYWNoZSA9IHt9O1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBpdGVtIG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiBmcm9tIGl0cyBwYXRoLiBGb3Igc2VydmVyLXNpZGUgdXNlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaXRlbSAtIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHBhdGggdG8gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICogIGV4LiBgJ3NldHVwLmFyZWEnYCB3aWxsIHNlYXJjaCBmb3IgdGhlIGBhcmVhYCBlbnRyeSBvZiB0aGUgJ2BzZXR1cGAnIGVudHJ5XG4gICAqICBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gICAqIHJldHVybnMge09iamVjdDxTdHJpbmcsIE1peGVkPn0gLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgdGhlIGNvbmZpZ3VyYXRpb25cbiAgICogIGluZm9ybWF0aW9ucywgb3JkZXJlZCB3aXRoIHRoZSBjb25maWd1cmF0aW9uIHBhdGhzIGFzIGtleXMuXG4gICAqL1xuICBnZXQoaXRlbSkge1xuICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdCgnLicpO1xuICAgIGxldCB2YWx1ZSA9IHNlcnZlckNvbmZpZztcbiAgICAvLyBzZWFyY2ggaXRlbSB0aHJvdWdoIGNvbmZpZ1xuICAgIHBhcnRzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgIGlmICh2YWx1ZVthdHRyXSlcbiAgICAgICAgdmFsdWUgPSB2YWx1ZVthdHRyXTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGl0ZW06IFwiJHtpdGVtfVwiYCk7XG4gICAgfSlcblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhIG9iamVjdCBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIGl0ZW1zLiBUaGUgcmVzdWx0IGlzIGNhY2hlZFxuICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IGl0ZW1zIC0gVGhlIHBhdGggdG8gdGhlIGl0ZW1zIHRvIGJlIHNoYXJlZC5cbiAgICovXG4gIF9nZW5lcmF0ZUZyb21JdGVtcyhpdGVtcykge1xuICAgIGNvbnN0IGtleSA9IGl0ZW1zLmpvaW4oJzonKTtcblxuICAgIGlmICh0aGlzLl9jYWNoZVtrZXldKVxuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlW2tleV07XG5cbiAgICBjb25zdCBzZXJ2ZXJDb25maWcgPSBzZXJ2ZXIuY29uZmlnO1xuICAgIGNvbnN0IGRhdGEgPSB7fTtcblxuICAgIC8vIGJ1aWxkIGRhdGEgdHJlZVxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdCgnLicpO1xuICAgICAgbGV0IHBvaW50ZXIgPSBkYXRhO1xuXG4gICAgICBwYXJ0cy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICAgIGlmICghcG9pbnRlclthdHRyXSlcbiAgICAgICAgICBwb2ludGVyW2F0dHJdID0ge307XG5cbiAgICAgICAgcG9pbnRlciA9IHBvaW50ZXJbYXR0cl07XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIHBvcHVsYXRlIHByZXZpb3VzbHkgYnVpbGRlZCB0cmVlXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCcuJyk7XG4gICAgICBjb25zdCBsZW4gPSBwYXJ0cy5sZW5ndGg7XG4gICAgICBsZXQgdmFsdWUgPSBzZXJ2ZXJDb25maWc7XG4gICAgICBsZXQgcG9pbnRlciA9IGRhdGE7XG5cbiAgICAgIHBhcnRzLmZvckVhY2goKGF0dHIsIGluZGV4KSA9PiB7XG4gICAgICAgIHZhbHVlID0gdmFsdWVbYXR0cl07XG5cbiAgICAgICAgaWYgKGluZGV4IDwgbGVuIC0gMSlcbiAgICAgICAgICBwb2ludGVyID0gcG9pbnRlclthdHRyXTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBvaW50ZXJbYXR0cl0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fY2FjaGVba2V5XSA9IGRhdGE7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIC8vIGdlbmVyYXRlIGFuIG9wdGltaXplZCBjb25maWcgYnVuZGxlIHRvIHJldHVybiB0aGUgY2xpZW50XG4gICAgcmV0dXJuIChpdGVtcykgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5fZ2VuZXJhdGVGcm9tSXRlbXMoaXRlbXMpO1xuICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2NvbmZpZycsIGNvbmZpZyk7XG4gICAgfVxuICB9XG59XG5cbnNlcnZlclNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNlcnZlclNoYXJlZENvbmZpZyk7XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlclNoYXJlZENvbmZpZztcbiJdfQ==