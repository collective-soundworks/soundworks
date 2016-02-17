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

    this._clientTypeConfigPaths = {};
  }

  /**
   * Adds an item of the server configuration has required by some type of clients.
   * @param {String} configPath - String representing the path to the configuration
   *  ex. `'setup.area'` will search for the `area` entry of the '`setup`' entry
   *  of the server configuration.
   * @param {Array<String>|<String>} - The name of the client types with whom the
   *  configuration entry must be shared.
   */

  _createClass(ServerSharedConfig, [{
    key: 'addItem',
    value: function addItem(configPath, clientTypes) {
      var _this = this;

      // add given client type to mapped client types
      var options = { clientTypes: clientTypes };
      this.configure(options);

      if (typeof clientTypes === 'string') clientTypes = [clientTypes];

      clientTypes.forEach(function (type) {
        if (!_this._clientTypeConfigPaths[type]) _this._clientTypeConfigPaths[type] = [];

        _this._clientTypeConfigPaths[type].push(configPath);
      });
    }

    /**
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
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this2 = this;

      return function () {
        var configPaths = _this2._clientTypeConfigPaths[client.type];
        var config = _this2.get(configPaths);

        _this2.send(client, 'config', config);
      };
    }
  }]);

  return ServerSharedConfig;
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerSharedConfig);

exports['default'] = ServerSharedConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyU2hhcmVkQ29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7Ozt3Q0FDbEIsOEJBQThCOzs7OzBCQUM1QyxnQkFBZ0I7Ozs7QUFHbkMsSUFBTSxVQUFVLEdBQUcsdUJBQXVCLENBQUM7Ozs7Ozs7O0lBT3JDLGtCQUFrQjtZQUFsQixrQkFBa0I7O0FBQ1gsV0FEUCxrQkFBa0IsR0FDUjswQkFEVixrQkFBa0I7O0FBRXBCLCtCQUZFLGtCQUFrQiw2Q0FFZCxVQUFVLEVBQUU7O0FBRWxCLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7R0FDbEM7Ozs7Ozs7Ozs7O2VBTEcsa0JBQWtCOztXQWVmLGlCQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUU7Ozs7QUFFL0IsVUFBTSxPQUFPLEdBQUcsRUFBRSxXQUFXLEVBQVgsV0FBVyxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFeEIsVUFBSSxPQUFPLFdBQVcsS0FBSyxRQUFRLEVBQ2pDLFdBQVcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUU5QixpQkFBVyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUM1QixZQUFJLENBQUMsTUFBSyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsRUFDcEMsTUFBSyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRXpDLGNBQUssc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ3BELENBQUMsQ0FBQztLQUNKOzs7Ozs7Ozs7Ozs7O1dBV0UsYUFBQyxXQUFXLEVBQUU7QUFDZixVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFDN0IsV0FBVyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTlCLFVBQU0sWUFBWSxHQUFHLHdCQUFPLE1BQU0sQ0FBQztBQUNuQyxVQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7O0FBRWxCLGlCQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVSxFQUFLOztBQUVsQyxZQUFNLElBQUksR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25DLFlBQUksR0FBRyxHQUFHLFlBQVksQ0FBQzs7QUFFdkIsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMzQyxjQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXJCLGNBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUNYLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FFaEIsTUFBTSxJQUFJLEtBQUssT0FBSyxVQUFVLHVDQUFvQyxDQUFDO1NBQ3RFOztBQUVELGNBQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLENBQUM7T0FDMUIsQ0FBQyxDQUFDOztBQUVILGFBQU8sTUFBTSxDQUFDO0tBQ2Y7Ozs7O1dBR00saUJBQUMsTUFBTSxFQUFFO0FBQ2QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUMxRDs7O1dBRVMsb0JBQUMsTUFBTSxFQUFFOzs7QUFDakIsYUFBTyxZQUFNO0FBQ1gsWUFBTSxXQUFXLEdBQUcsT0FBSyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0QsWUFBTSxNQUFNLEdBQUcsT0FBSyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXJDLGVBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDckMsQ0FBQTtLQUNGOzs7U0EvRUcsa0JBQWtCOzs7QUFrRnhCLHNDQUFxQixRQUFRLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLENBQUM7O3FCQUUvQyxrQkFBa0IiLCJmaWxlIjoic3JjL3NlcnZlci9zZXJ2aWNlcy9TZXJ2ZXJTaGFyZWRDb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc2VydmVyIGZyb20gJy4uL2NvcmUvc2VydmVyJztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLWNvbmZpZyc7XG5cbi8qKlxuICogW3NlcnZlcl0gVGhpcyBzZXJ2aWNlIGFjdHMgYXMgYW4gYWNjZXNzb3IgZm9yIHRoZSBzZXJ2ZXIgY29uZmlnIGJvdGggc2VydmVyXG4gKiBhbmQgY2xpZW50IHNpZGVzLlxuICpcbiAqL1xuY2xhc3MgU2VydmVyU2hhcmVkQ29uZmlnIGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIHRoaXMuX2NsaWVudFR5cGVDb25maWdQYXRocyA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gaXRlbSBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gaGFzIHJlcXVpcmVkIGJ5IHNvbWUgdHlwZSBvZiBjbGllbnRzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY29uZmlnUGF0aCAtIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHBhdGggdG8gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICogIGV4LiBgJ3NldHVwLmFyZWEnYCB3aWxsIHNlYXJjaCBmb3IgdGhlIGBhcmVhYCBlbnRyeSBvZiB0aGUgJ2BzZXR1cGAnIGVudHJ5XG4gICAqICBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPnw8U3RyaW5nPn0gLSBUaGUgbmFtZSBvZiB0aGUgY2xpZW50IHR5cGVzIHdpdGggd2hvbSB0aGVcbiAgICogIGNvbmZpZ3VyYXRpb24gZW50cnkgbXVzdCBiZSBzaGFyZWQuXG4gICAqL1xuICBhZGRJdGVtKGNvbmZpZ1BhdGgsIGNsaWVudFR5cGVzKSB7XG4gICAgLy8gYWRkIGdpdmVuIGNsaWVudCB0eXBlIHRvIG1hcHBlZCBjbGllbnQgdHlwZXNcbiAgICBjb25zdCBvcHRpb25zID0geyBjbGllbnRUeXBlcyB9O1xuICAgIHRoaXMuY29uZmlndXJlKG9wdGlvbnMpO1xuXG4gICAgaWYgKHR5cGVvZiBjbGllbnRUeXBlcyA9PT0gJ3N0cmluZycpXG4gICAgICBjbGllbnRUeXBlcyA9IFtjbGllbnRUeXBlc107XG5cbiAgICBjbGllbnRUeXBlcy5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX2NsaWVudFR5cGVDb25maWdQYXRoc1t0eXBlXSlcbiAgICAgICAgdGhpcy5fY2xpZW50VHlwZUNvbmZpZ1BhdGhzW3R5cGVdID0gW107XG5cbiAgICAgIHRoaXMuX2NsaWVudFR5cGVDb25maWdQYXRoc1t0eXBlXS5wdXNoKGNvbmZpZ1BhdGgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaXRlbSBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gZnJvbSBpdHMgcGF0aC4gKEFsbG93IHRvIHVzZSB0aGVcbiAgICogc2VydmljZSBzZXJ2ZXItc2lkZSlcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNvbmZpZ1BhdGggLSBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBwYXRoIHRvIHRoZSBjb25maWd1cmF0aW9uXG4gICAqICBleC4gYCdzZXR1cC5hcmVhJ2Agd2lsbCBzZWFyY2ggZm9yIHRoZSBgYXJlYWAgZW50cnkgb2YgdGhlICdgc2V0dXBgJyBlbnRyeVxuICAgKiAgb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uLlxuICAgKiByZXR1cm5zIHtPYmplY3Q8U3RyaW5nLCBNaXhlZD59IC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBjb25maWd1cmF0aW9uXG4gICAqICBpbmZvcm1hdGlvbnMsIG9yZGVyZWQgd2l0aCB0aGUgY29uZmlndXJhdGlvbiBwYXRocyBhcyBrZXlzLlxuICAgKi9cbiAgZ2V0KGNvbmZpZ1BhdGhzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbmZpZ1BhdGhzKSlcbiAgICAgIGNvbmZpZ1BhdGhzID0gW2NvbmZpZ1BhdGhzXTtcblxuICAgIGNvbnN0IHNlcnZlckNvbmZpZyA9IHNlcnZlci5jb25maWc7XG4gICAgY29uc3QgY29uZmlnID0ge307XG5cbiAgICBjb25maWdQYXRocy5mb3JFYWNoKChjb25maWdQYXRoKSA9PiB7XG4gICAgICAvLyAnc2V0dXAuYXJlYScgPT4gWydzZXR1cCcsICdhcmVhJ107XG4gICAgICBjb25zdCBwYXRoID0gY29uZmlnUGF0aC5zcGxpdCgnLicpO1xuICAgICAgbGV0IHRtcCA9IHNlcnZlckNvbmZpZztcbiAgICAgIC8vIHNlYXJjaCBwYXRoIHRocm91Z2ggY29uZmlnXG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHBhdGgubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGF0dHIgPSBwYXRoW2ldO1xuXG4gICAgICAgIGlmICh0bXBbYXR0cl0pXG4gICAgICAgICAgdG1wID0gdG1wW2F0dHJdO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcIiR7Y29uZmlnUGF0aH1cIiBkb2VzIG5vdCBleGlzdCBpbiBzZXJ2ZXIgY29uZmlnYCk7XG4gICAgICB9XG5cbiAgICAgIGNvbmZpZ1tjb25maWdQYXRoXSA9IHRtcDtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb25maWc7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZ1BhdGhzID0gdGhpcy5fY2xpZW50VHlwZUNvbmZpZ1BhdGhzW2NsaWVudC50eXBlXTtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuZ2V0KGNvbmZpZ1BhdGhzKTtcblxuICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2NvbmZpZycsIGNvbmZpZyk7XG4gICAgfVxuICB9XG59XG5cbnNlcnZlclNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNlcnZlclNoYXJlZENvbmZpZyk7XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlclNoYXJlZENvbmZpZztcbiJdfQ==