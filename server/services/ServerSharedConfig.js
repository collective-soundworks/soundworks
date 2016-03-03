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
 * [server] This service acts as an accessor for the server config both server
 * and client sides.
 *
 */

var ServerSharedConfig = (function (_ServerActivity) {
  _inherits(ServerSharedConfig, _ServerActivity);

  function ServerSharedConfig() {
    _classCallCheck(this, ServerSharedConfig);

    _get(Object.getPrototypeOf(ServerSharedConfig.prototype), 'constructor', this).call(this, SERVICE_ID);

    // this._clientTypeConfigPaths = {};

    this._cache = {};
  }

  /**
   * Adds an item of the server configuration has required by some type of clients.
   * @param {String} configPath - String representing the path to the configuration
   *  ex. `'setup.area'` will search for the `area` entry of the '`setup`' entry
   *  of the server configuration.
   * @param {Array<String>|<String>} - The name of the client types with whom the
   *  configuration entry must be shared.
   */
  // addItem(configPath, clientTypes) {
  //   // add given client type to mapped client types
  //   const options = { clientTypes };
  //   this.configure(options);

  //   if (typeof clientTypes === 'string')
  //     clientTypes = [clientTypes];

  //   clientTypes.forEach((type) => {
  //     if (!this._clientTypeConfigPaths[type])
  //       this._clientTypeConfigPaths[type] = [];

  //     this._clientTypeConfigPaths[type].push(configPath);
  //   });
  // }

  /**
   * Returns an item of the server configuration from its path. (Allow to use the
   * service server-side). Used server-side by other service to get
   * config informations
   * @param {String} configPath - String representing the path to the configuration
   *  ex. `'setup.area'` will search for the `area` entry of the '`setup`' entry
   *  of the server configuration.
   * returns {Object<String, Mixed>} - An object containing all the configuration
   *  informations, ordered with the configuration paths as keys.
   */

  _createClass(ServerSharedConfig, [{
    key: 'getPath',
    value: function getPath(path) {}

    /**
     * @todo - remove
     * Returns an item of the server configuration from its path. (Allow to use the
     * service server-side)
     * @param {String} configPath - String representing the path to the configuration
     *  ex. `'setup.area'` will search for the `area` entry of the '`setup`' entry
     *  of the server configuration.
     * returns {Object<String, Mixed>} - An object containing all the configuration
     *  informations, ordered with the configuration paths as keys.
     */
  }, {
    key: 'get',
    value: function get(configPaths) {
      if (!Array.isArray(configPaths)) configPaths = [configPaths];

      var serverConfig = _coreServer2['default'].config;
      var config = {};

      configPaths.forEach(function (configPath) {
        // 'setup.area' => ['setup', 'area'];
        var path = configPath.split('.');
        var tmp = serverConfig;
        // search path through config
        for (var i = 0, l = path.length; i < l; i++) {
          var attr = path[i];

          if (tmp[attr]) tmp = tmp[attr];else throw new Error('"' + configPath + '" does not exist in server config');
        }

        config[configPath] = tmp;
      });

      return config;
    }

    /** @inheritdoc */
  }, {
    key: 'connect',
    value: function connect(client) {
      this.receive(client, 'request', this._onRequest(client));
    }
  }, {
    key: '_generateObject',
    value: function _generateObject(paths) {
      var key = paths.join(':');
      if (this._cache[key]) {}
    }
  }, {
    key: '_onRequest',
    value: function _onRequest(client, paths) {
      var _this = this;

      // generate an optimized config bundle to return the client

      return function () {
        var configPaths = _this._clientTypeConfigPaths[client.type];
        var config = _this.get(configPaths);

        _this.send(client, 'config', config);
      };
    }
  }]);

  return ServerSharedConfig;
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerSharedConfig);

exports['default'] = ServerSharedConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyU2hhcmVkQ29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7Ozt3Q0FDbEIsOEJBQThCOzs7OzBCQUM1QyxnQkFBZ0I7Ozs7QUFHbkMsSUFBTSxVQUFVLEdBQUcsdUJBQXVCLENBQUM7Ozs7Ozs7O0lBT3JDLGtCQUFrQjtZQUFsQixrQkFBa0I7O0FBQ1gsV0FEUCxrQkFBa0IsR0FDUjswQkFEVixrQkFBa0I7O0FBRXBCLCtCQUZFLGtCQUFrQiw2Q0FFZCxVQUFVLEVBQUU7Ozs7QUFJbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7R0FDbEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFQRyxrQkFBa0I7O1dBMkNmLGlCQUFDLElBQUksRUFBRSxFQUViOzs7Ozs7Ozs7Ozs7OztXQVlFLGFBQUMsV0FBVyxFQUFFO0FBQ2YsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQzdCLFdBQVcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUU5QixVQUFNLFlBQVksR0FBRyx3QkFBTyxNQUFNLENBQUM7QUFDbkMsVUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDOztBQUVsQixpQkFBVyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFVBQVUsRUFBSzs7QUFFbEMsWUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQyxZQUFJLEdBQUcsR0FBRyxZQUFZLENBQUM7O0FBRXZCLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDM0MsY0FBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVyQixjQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFDWCxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBRWhCLE1BQU0sSUFBSSxLQUFLLE9BQUssVUFBVSx1Q0FBb0MsQ0FBQztTQUN0RTs7QUFFRCxjQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxDQUFDO09BQzFCLENBQUMsQ0FBQzs7QUFFSCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7OztXQUdNLGlCQUFDLE1BQU0sRUFBRTtBQUNkLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDMUQ7OztXQUVjLHlCQUFDLEtBQUssRUFBRTtBQUNyQixVQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFO0tBQ3pCOzs7V0FFUyxvQkFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFOzs7OztBQUd4QixhQUFPLFlBQU07QUFDWCxZQUFNLFdBQVcsR0FBRyxNQUFLLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3RCxZQUFNLE1BQU0sR0FBRyxNQUFLLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFckMsY0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztPQUNyQyxDQUFBO0tBQ0Y7OztTQXZHRyxrQkFBa0I7OztBQTBHeEIsc0NBQXFCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs7cUJBRS9DLGtCQUFrQiIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlclNoYXJlZENvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXInO1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzaGFyZWQtY29uZmlnJztcblxuLyoqXG4gKiBbc2VydmVyXSBUaGlzIHNlcnZpY2UgYWN0cyBhcyBhbiBhY2Nlc3NvciBmb3IgdGhlIHNlcnZlciBjb25maWcgYm90aCBzZXJ2ZXJcbiAqIGFuZCBjbGllbnQgc2lkZXMuXG4gKlxuICovXG5jbGFzcyBTZXJ2ZXJTaGFyZWRDb25maWcgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgLy8gdGhpcy5fY2xpZW50VHlwZUNvbmZpZ1BhdGhzID0ge307XG5cbiAgICB0aGlzLl9jYWNoZSA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gaXRlbSBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gaGFzIHJlcXVpcmVkIGJ5IHNvbWUgdHlwZSBvZiBjbGllbnRzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY29uZmlnUGF0aCAtIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHBhdGggdG8gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICogIGV4LiBgJ3NldHVwLmFyZWEnYCB3aWxsIHNlYXJjaCBmb3IgdGhlIGBhcmVhYCBlbnRyeSBvZiB0aGUgJ2BzZXR1cGAnIGVudHJ5XG4gICAqICBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPnw8U3RyaW5nPn0gLSBUaGUgbmFtZSBvZiB0aGUgY2xpZW50IHR5cGVzIHdpdGggd2hvbSB0aGVcbiAgICogIGNvbmZpZ3VyYXRpb24gZW50cnkgbXVzdCBiZSBzaGFyZWQuXG4gICAqL1xuICAvLyBhZGRJdGVtKGNvbmZpZ1BhdGgsIGNsaWVudFR5cGVzKSB7XG4gIC8vICAgLy8gYWRkIGdpdmVuIGNsaWVudCB0eXBlIHRvIG1hcHBlZCBjbGllbnQgdHlwZXNcbiAgLy8gICBjb25zdCBvcHRpb25zID0geyBjbGllbnRUeXBlcyB9O1xuICAvLyAgIHRoaXMuY29uZmlndXJlKG9wdGlvbnMpO1xuXG4gIC8vICAgaWYgKHR5cGVvZiBjbGllbnRUeXBlcyA9PT0gJ3N0cmluZycpXG4gIC8vICAgICBjbGllbnRUeXBlcyA9IFtjbGllbnRUeXBlc107XG5cbiAgLy8gICBjbGllbnRUeXBlcy5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gIC8vICAgICBpZiAoIXRoaXMuX2NsaWVudFR5cGVDb25maWdQYXRoc1t0eXBlXSlcbiAgLy8gICAgICAgdGhpcy5fY2xpZW50VHlwZUNvbmZpZ1BhdGhzW3R5cGVdID0gW107XG5cbiAgLy8gICAgIHRoaXMuX2NsaWVudFR5cGVDb25maWdQYXRoc1t0eXBlXS5wdXNoKGNvbmZpZ1BhdGgpO1xuICAvLyAgIH0pO1xuICAvLyB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaXRlbSBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gZnJvbSBpdHMgcGF0aC4gKEFsbG93IHRvIHVzZSB0aGVcbiAgICogc2VydmljZSBzZXJ2ZXItc2lkZSkuIFVzZWQgc2VydmVyLXNpZGUgYnkgb3RoZXIgc2VydmljZSB0byBnZXRcbiAgICogY29uZmlnIGluZm9ybWF0aW9uc1xuICAgKiBAcGFyYW0ge1N0cmluZ30gY29uZmlnUGF0aCAtIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHBhdGggdG8gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICogIGV4LiBgJ3NldHVwLmFyZWEnYCB3aWxsIHNlYXJjaCBmb3IgdGhlIGBhcmVhYCBlbnRyeSBvZiB0aGUgJ2BzZXR1cGAnIGVudHJ5XG4gICAqICBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gICAqIHJldHVybnMge09iamVjdDxTdHJpbmcsIE1peGVkPn0gLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgdGhlIGNvbmZpZ3VyYXRpb25cbiAgICogIGluZm9ybWF0aW9ucywgb3JkZXJlZCB3aXRoIHRoZSBjb25maWd1cmF0aW9uIHBhdGhzIGFzIGtleXMuXG4gICAqL1xuICBnZXRQYXRoKHBhdGgpIHtcblxuICB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIC0gcmVtb3ZlXG4gICAqIFJldHVybnMgYW4gaXRlbSBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gZnJvbSBpdHMgcGF0aC4gKEFsbG93IHRvIHVzZSB0aGVcbiAgICogc2VydmljZSBzZXJ2ZXItc2lkZSlcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNvbmZpZ1BhdGggLSBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBwYXRoIHRvIHRoZSBjb25maWd1cmF0aW9uXG4gICAqICBleC4gYCdzZXR1cC5hcmVhJ2Agd2lsbCBzZWFyY2ggZm9yIHRoZSBgYXJlYWAgZW50cnkgb2YgdGhlICdgc2V0dXBgJyBlbnRyeVxuICAgKiAgb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uLlxuICAgKiByZXR1cm5zIHtPYmplY3Q8U3RyaW5nLCBNaXhlZD59IC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBjb25maWd1cmF0aW9uXG4gICAqICBpbmZvcm1hdGlvbnMsIG9yZGVyZWQgd2l0aCB0aGUgY29uZmlndXJhdGlvbiBwYXRocyBhcyBrZXlzLlxuICAgKi9cbiAgZ2V0KGNvbmZpZ1BhdGhzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbmZpZ1BhdGhzKSlcbiAgICAgIGNvbmZpZ1BhdGhzID0gW2NvbmZpZ1BhdGhzXTtcblxuICAgIGNvbnN0IHNlcnZlckNvbmZpZyA9IHNlcnZlci5jb25maWc7XG4gICAgY29uc3QgY29uZmlnID0ge307XG5cbiAgICBjb25maWdQYXRocy5mb3JFYWNoKChjb25maWdQYXRoKSA9PiB7XG4gICAgICAvLyAnc2V0dXAuYXJlYScgPT4gWydzZXR1cCcsICdhcmVhJ107XG4gICAgICBjb25zdCBwYXRoID0gY29uZmlnUGF0aC5zcGxpdCgnLicpO1xuICAgICAgbGV0IHRtcCA9IHNlcnZlckNvbmZpZztcbiAgICAgIC8vIHNlYXJjaCBwYXRoIHRocm91Z2ggY29uZmlnXG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHBhdGgubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGF0dHIgPSBwYXRoW2ldO1xuXG4gICAgICAgIGlmICh0bXBbYXR0cl0pXG4gICAgICAgICAgdG1wID0gdG1wW2F0dHJdO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcIiR7Y29uZmlnUGF0aH1cIiBkb2VzIG5vdCBleGlzdCBpbiBzZXJ2ZXIgY29uZmlnYCk7XG4gICAgICB9XG5cbiAgICAgIGNvbmZpZ1tjb25maWdQYXRoXSA9IHRtcDtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb25maWc7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIF9nZW5lcmF0ZU9iamVjdChwYXRocykge1xuICAgIGNvbnN0IGtleSA9IHBhdGhzLmpvaW4oJzonKTtcbiAgICBpZiAodGhpcy5fY2FjaGVba2V5XSkge31cbiAgfVxuXG4gIF9vblJlcXVlc3QoY2xpZW50LCBwYXRocykge1xuICAgIC8vIGdlbmVyYXRlIGFuIG9wdGltaXplZCBjb25maWcgYnVuZGxlIHRvIHJldHVybiB0aGUgY2xpZW50XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnUGF0aHMgPSB0aGlzLl9jbGllbnRUeXBlQ29uZmlnUGF0aHNbY2xpZW50LnR5cGVdO1xuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXQoY29uZmlnUGF0aHMpO1xuXG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnY29uZmlnJywgY29uZmlnKTtcbiAgICB9XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyU2hhcmVkQ29uZmlnKTtcblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyU2hhcmVkQ29uZmlnO1xuIl19