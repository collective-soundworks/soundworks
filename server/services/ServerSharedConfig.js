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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyU2hhcmVkQ29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7Ozt3Q0FDbEIsOEJBQThCOzs7OzBCQUM1QyxnQkFBZ0I7Ozs7QUFHbkMsSUFBTSxVQUFVLEdBQUcsdUJBQXVCLENBQUM7Ozs7Ozs7O0lBUXJDLGtCQUFrQjtZQUFsQixrQkFBa0I7O0FBQ1gsV0FEUCxrQkFBa0IsR0FDUjswQkFEVixrQkFBa0I7O0FBRXBCLCtCQUZFLGtCQUFrQiw2Q0FFZCxVQUFVLEVBQUU7O0FBRWxCLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7R0FDbEM7Ozs7Ozs7Ozs7O2VBTEcsa0JBQWtCOztXQWVmLGlCQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUU7Ozs7QUFFL0IsVUFBTSxPQUFPLEdBQUcsRUFBRSxXQUFXLEVBQVgsV0FBVyxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFeEIsVUFBSSxPQUFPLFdBQVcsS0FBSyxRQUFRLEVBQ2pDLFdBQVcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUU5QixpQkFBVyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUM1QixZQUFJLENBQUMsTUFBSyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsRUFDcEMsTUFBSyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRXpDLGNBQUssc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ3BELENBQUMsQ0FBQztLQUNKOzs7Ozs7Ozs7Ozs7O1dBV0UsYUFBQyxXQUFXLEVBQUU7QUFDZixVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFDN0IsV0FBVyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTlCLFVBQU0sWUFBWSxHQUFHLHdCQUFPLE1BQU0sQ0FBQztBQUNuQyxVQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7O0FBRWxCLGlCQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVSxFQUFLOztBQUVsQyxZQUFNLElBQUksR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25DLFlBQUksR0FBRyxHQUFHLFlBQVksQ0FBQzs7QUFFdkIsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMzQyxjQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXJCLGNBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUNYLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FFaEIsTUFBTSxJQUFJLEtBQUssT0FBSyxVQUFVLHVDQUFvQyxDQUFDO1NBQ3RFOztBQUVELGNBQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLENBQUM7T0FDMUIsQ0FBQyxDQUFDOztBQUVILGFBQU8sTUFBTSxDQUFDO0tBQ2Y7Ozs7O1dBR00saUJBQUMsTUFBTSxFQUFFO0FBQ2QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUMxRDs7O1dBRVMsb0JBQUMsTUFBTSxFQUFFOzs7QUFDakIsYUFBTyxZQUFNO0FBQ1gsWUFBTSxXQUFXLEdBQUcsT0FBSyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0QsWUFBTSxNQUFNLEdBQUcsT0FBSyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXJDLGVBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDckMsQ0FBQTtLQUNGOzs7U0EvRUcsa0JBQWtCOzs7QUFrRnhCLHNDQUFxQixRQUFRLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLENBQUM7O3FCQUUvQyxrQkFBa0IiLCJmaWxlIjoic3JjL3NlcnZlci9zZXJ2aWNlcy9TZXJ2ZXJTaGFyZWRDb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc2VydmVyIGZyb20gJy4uL2NvcmUvc2VydmVyJztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLWNvbmZpZyc7XG5cblxuLyoqXG4gKiBbc2VydmVyXSBUaGlzIHNlcnZpY2UgYWN0cyBhcyBhbiBhY2Nlc3NvciBmb3IgdGhlIHNlcnZlciBjb25maWcgYm90aCBzZXJ2ZXJcbiAqIGFuZCBjbGllbnQgc2lkZXMuXG4gKlxuICovXG5jbGFzcyBTZXJ2ZXJTaGFyZWRDb25maWcgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgdGhpcy5fY2xpZW50VHlwZUNvbmZpZ1BhdGhzID0ge307XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBpdGVtIG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiBoYXMgcmVxdWlyZWQgYnkgc29tZSB0eXBlIG9mIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWdQYXRoIC0gU3RyaW5nIHJlcHJlc2VudGluZyB0aGUgcGF0aCB0byB0aGUgY29uZmlndXJhdGlvblxuICAgKiAgZXguIGAnc2V0dXAuYXJlYSdgIHdpbGwgc2VhcmNoIGZvciB0aGUgYGFyZWFgIGVudHJ5IG9mIHRoZSAnYHNldHVwYCcgZW50cnlcbiAgICogIG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fDxTdHJpbmc+fSAtIFRoZSBuYW1lIG9mIHRoZSBjbGllbnQgdHlwZXMgd2l0aCB3aG9tIHRoZVxuICAgKiAgY29uZmlndXJhdGlvbiBlbnRyeSBtdXN0IGJlIHNoYXJlZC5cbiAgICovXG4gIGFkZEl0ZW0oY29uZmlnUGF0aCwgY2xpZW50VHlwZXMpIHtcbiAgICAvLyBhZGQgZ2l2ZW4gY2xpZW50IHR5cGUgdG8gbWFwcGVkIGNsaWVudCB0eXBlc1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IGNsaWVudFR5cGVzIH07XG4gICAgdGhpcy5jb25maWd1cmUob3B0aW9ucyk7XG5cbiAgICBpZiAodHlwZW9mIGNsaWVudFR5cGVzID09PSAnc3RyaW5nJylcbiAgICAgIGNsaWVudFR5cGVzID0gW2NsaWVudFR5cGVzXTtcblxuICAgIGNsaWVudFR5cGVzLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICAgIGlmICghdGhpcy5fY2xpZW50VHlwZUNvbmZpZ1BhdGhzW3R5cGVdKVxuICAgICAgICB0aGlzLl9jbGllbnRUeXBlQ29uZmlnUGF0aHNbdHlwZV0gPSBbXTtcblxuICAgICAgdGhpcy5fY2xpZW50VHlwZUNvbmZpZ1BhdGhzW3R5cGVdLnB1c2goY29uZmlnUGF0aCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBpdGVtIG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiBmcm9tIGl0cyBwYXRoLiAoQWxsb3cgdG8gdXNlIHRoZVxuICAgKiBzZXJ2aWNlIHNlcnZlci1zaWRlKVxuICAgKiBAcGFyYW0ge1N0cmluZ30gY29uZmlnUGF0aCAtIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHBhdGggdG8gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICogIGV4LiBgJ3NldHVwLmFyZWEnYCB3aWxsIHNlYXJjaCBmb3IgdGhlIGBhcmVhYCBlbnRyeSBvZiB0aGUgJ2BzZXR1cGAnIGVudHJ5XG4gICAqICBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gICAqIHJldHVybnMge09iamVjdDxTdHJpbmcsIE1peGVkPn0gLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgdGhlIGNvbmZpZ3VyYXRpb25cbiAgICogIGluZm9ybWF0aW9ucywgb3JkZXJlZCB3aXRoIHRoZSBjb25maWd1cmF0aW9uIHBhdGhzIGFzIGtleXMuXG4gICAqL1xuICBnZXQoY29uZmlnUGF0aHMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29uZmlnUGF0aHMpKVxuICAgICAgY29uZmlnUGF0aHMgPSBbY29uZmlnUGF0aHNdO1xuXG4gICAgY29uc3Qgc2VydmVyQ29uZmlnID0gc2VydmVyLmNvbmZpZztcbiAgICBjb25zdCBjb25maWcgPSB7fTtcblxuICAgIGNvbmZpZ1BhdGhzLmZvckVhY2goKGNvbmZpZ1BhdGgpID0+IHtcbiAgICAgIC8vICdzZXR1cC5hcmVhJyA9PiBbJ3NldHVwJywgJ2FyZWEnXTtcbiAgICAgIGNvbnN0IHBhdGggPSBjb25maWdQYXRoLnNwbGl0KCcuJyk7XG4gICAgICBsZXQgdG1wID0gc2VydmVyQ29uZmlnO1xuICAgICAgLy8gc2VhcmNoIHBhdGggdGhyb3VnaCBjb25maWdcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gcGF0aC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29uc3QgYXR0ciA9IHBhdGhbaV07XG5cbiAgICAgICAgaWYgKHRtcFthdHRyXSlcbiAgICAgICAgICB0bXAgPSB0bXBbYXR0cl07XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFwiJHtjb25maWdQYXRofVwiIGRvZXMgbm90IGV4aXN0IGluIHNlcnZlciBjb25maWdgKTtcbiAgICAgIH1cblxuICAgICAgY29uZmlnW2NvbmZpZ1BhdGhdID0gdG1wO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICB9XG5cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnUGF0aHMgPSB0aGlzLl9jbGllbnRUeXBlQ29uZmlnUGF0aHNbY2xpZW50LnR5cGVdO1xuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXQoY29uZmlnUGF0aHMpO1xuXG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnY29uZmlnJywgY29uZmlnKTtcbiAgICB9XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyU2hhcmVkQ29uZmlnKTtcblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyU2hhcmVkQ29uZmlnO1xuIl19