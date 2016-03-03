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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlclNoYXJlZENvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tDQUEyQix3QkFBd0I7Ozs7d0NBQ2xCLDhCQUE4Qjs7OzswQkFDNUMsZ0JBQWdCOzs7O0FBR25DLElBQU0sVUFBVSxHQUFHLHVCQUF1QixDQUFDOzs7Ozs7OztJQU9yQyxrQkFBa0I7WUFBbEIsa0JBQWtCOztBQUNYLFdBRFAsa0JBQWtCLEdBQ1I7MEJBRFYsa0JBQWtCOztBQUVwQiwrQkFGRSxrQkFBa0IsNkNBRWQsVUFBVSxFQUFFOzs7O0FBSWxCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0dBQ2xCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2VBUEcsa0JBQWtCOztXQTJDZixpQkFBQyxJQUFJLEVBQUUsRUFFYjs7Ozs7Ozs7Ozs7Ozs7V0FZRSxhQUFDLFdBQVcsRUFBRTtBQUNmLFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUM3QixXQUFXLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFOUIsVUFBTSxZQUFZLEdBQUcsd0JBQU8sTUFBTSxDQUFDO0FBQ25DLFVBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsaUJBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxVQUFVLEVBQUs7O0FBRWxDLFlBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkMsWUFBSSxHQUFHLEdBQUcsWUFBWSxDQUFDOztBQUV2QixhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzNDLGNBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFckIsY0FBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQ1gsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUVoQixNQUFNLElBQUksS0FBSyxPQUFLLFVBQVUsdUNBQW9DLENBQUM7U0FDdEU7O0FBRUQsY0FBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztPQUMxQixDQUFDLENBQUM7O0FBRUgsYUFBTyxNQUFNLENBQUM7S0FDZjs7Ozs7V0FHTSxpQkFBQyxNQUFNLEVBQUU7QUFDZCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQzFEOzs7V0FFYyx5QkFBQyxLQUFLLEVBQUU7QUFDckIsVUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRTtLQUN6Qjs7O1dBRVMsb0JBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTs7Ozs7QUFHeEIsYUFBTyxZQUFNO0FBQ1gsWUFBTSxXQUFXLEdBQUcsTUFBSyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0QsWUFBTSxNQUFNLEdBQUcsTUFBSyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXJDLGNBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDckMsQ0FBQTtLQUNGOzs7U0F2R0csa0JBQWtCOzs7QUEwR3hCLHNDQUFxQixRQUFRLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLENBQUM7O3FCQUUvQyxrQkFBa0IiLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyU2hhcmVkQ29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuLi9jb3JlL3NlcnZlcic7XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1jb25maWcnO1xuXG4vKipcbiAqIFtzZXJ2ZXJdIFRoaXMgc2VydmljZSBhY3RzIGFzIGFuIGFjY2Vzc29yIGZvciB0aGUgc2VydmVyIGNvbmZpZyBib3RoIHNlcnZlclxuICogYW5kIGNsaWVudCBzaWRlcy5cbiAqXG4gKi9cbmNsYXNzIFNlcnZlclNoYXJlZENvbmZpZyBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICAvLyB0aGlzLl9jbGllbnRUeXBlQ29uZmlnUGF0aHMgPSB7fTtcblxuICAgIHRoaXMuX2NhY2hlID0ge307XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBpdGVtIG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiBoYXMgcmVxdWlyZWQgYnkgc29tZSB0eXBlIG9mIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWdQYXRoIC0gU3RyaW5nIHJlcHJlc2VudGluZyB0aGUgcGF0aCB0byB0aGUgY29uZmlndXJhdGlvblxuICAgKiAgZXguIGAnc2V0dXAuYXJlYSdgIHdpbGwgc2VhcmNoIGZvciB0aGUgYGFyZWFgIGVudHJ5IG9mIHRoZSAnYHNldHVwYCcgZW50cnlcbiAgICogIG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fDxTdHJpbmc+fSAtIFRoZSBuYW1lIG9mIHRoZSBjbGllbnQgdHlwZXMgd2l0aCB3aG9tIHRoZVxuICAgKiAgY29uZmlndXJhdGlvbiBlbnRyeSBtdXN0IGJlIHNoYXJlZC5cbiAgICovXG4gIC8vIGFkZEl0ZW0oY29uZmlnUGF0aCwgY2xpZW50VHlwZXMpIHtcbiAgLy8gICAvLyBhZGQgZ2l2ZW4gY2xpZW50IHR5cGUgdG8gbWFwcGVkIGNsaWVudCB0eXBlc1xuICAvLyAgIGNvbnN0IG9wdGlvbnMgPSB7IGNsaWVudFR5cGVzIH07XG4gIC8vICAgdGhpcy5jb25maWd1cmUob3B0aW9ucyk7XG5cbiAgLy8gICBpZiAodHlwZW9mIGNsaWVudFR5cGVzID09PSAnc3RyaW5nJylcbiAgLy8gICAgIGNsaWVudFR5cGVzID0gW2NsaWVudFR5cGVzXTtcblxuICAvLyAgIGNsaWVudFR5cGVzLmZvckVhY2goKHR5cGUpID0+IHtcbiAgLy8gICAgIGlmICghdGhpcy5fY2xpZW50VHlwZUNvbmZpZ1BhdGhzW3R5cGVdKVxuICAvLyAgICAgICB0aGlzLl9jbGllbnRUeXBlQ29uZmlnUGF0aHNbdHlwZV0gPSBbXTtcblxuICAvLyAgICAgdGhpcy5fY2xpZW50VHlwZUNvbmZpZ1BhdGhzW3R5cGVdLnB1c2goY29uZmlnUGF0aCk7XG4gIC8vICAgfSk7XG4gIC8vIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBpdGVtIG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiBmcm9tIGl0cyBwYXRoLiAoQWxsb3cgdG8gdXNlIHRoZVxuICAgKiBzZXJ2aWNlIHNlcnZlci1zaWRlKS4gVXNlZCBzZXJ2ZXItc2lkZSBieSBvdGhlciBzZXJ2aWNlIHRvIGdldFxuICAgKiBjb25maWcgaW5mb3JtYXRpb25zXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWdQYXRoIC0gU3RyaW5nIHJlcHJlc2VudGluZyB0aGUgcGF0aCB0byB0aGUgY29uZmlndXJhdGlvblxuICAgKiAgZXguIGAnc2V0dXAuYXJlYSdgIHdpbGwgc2VhcmNoIGZvciB0aGUgYGFyZWFgIGVudHJ5IG9mIHRoZSAnYHNldHVwYCcgZW50cnlcbiAgICogIG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAgICogcmV0dXJucyB7T2JqZWN0PFN0cmluZywgTWl4ZWQ+fSAtIEFuIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgY29uZmlndXJhdGlvblxuICAgKiAgaW5mb3JtYXRpb25zLCBvcmRlcmVkIHdpdGggdGhlIGNvbmZpZ3VyYXRpb24gcGF0aHMgYXMga2V5cy5cbiAgICovXG4gIGdldFBhdGgocGF0aCkge1xuXG4gIH1cblxuICAvKipcbiAgICogQHRvZG8gLSByZW1vdmVcbiAgICogUmV0dXJucyBhbiBpdGVtIG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiBmcm9tIGl0cyBwYXRoLiAoQWxsb3cgdG8gdXNlIHRoZVxuICAgKiBzZXJ2aWNlIHNlcnZlci1zaWRlKVxuICAgKiBAcGFyYW0ge1N0cmluZ30gY29uZmlnUGF0aCAtIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHBhdGggdG8gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICogIGV4LiBgJ3NldHVwLmFyZWEnYCB3aWxsIHNlYXJjaCBmb3IgdGhlIGBhcmVhYCBlbnRyeSBvZiB0aGUgJ2BzZXR1cGAnIGVudHJ5XG4gICAqICBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gICAqIHJldHVybnMge09iamVjdDxTdHJpbmcsIE1peGVkPn0gLSBBbiBvYmplY3QgY29udGFpbmluZyBhbGwgdGhlIGNvbmZpZ3VyYXRpb25cbiAgICogIGluZm9ybWF0aW9ucywgb3JkZXJlZCB3aXRoIHRoZSBjb25maWd1cmF0aW9uIHBhdGhzIGFzIGtleXMuXG4gICAqL1xuICBnZXQoY29uZmlnUGF0aHMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29uZmlnUGF0aHMpKVxuICAgICAgY29uZmlnUGF0aHMgPSBbY29uZmlnUGF0aHNdO1xuXG4gICAgY29uc3Qgc2VydmVyQ29uZmlnID0gc2VydmVyLmNvbmZpZztcbiAgICBjb25zdCBjb25maWcgPSB7fTtcblxuICAgIGNvbmZpZ1BhdGhzLmZvckVhY2goKGNvbmZpZ1BhdGgpID0+IHtcbiAgICAgIC8vICdzZXR1cC5hcmVhJyA9PiBbJ3NldHVwJywgJ2FyZWEnXTtcbiAgICAgIGNvbnN0IHBhdGggPSBjb25maWdQYXRoLnNwbGl0KCcuJyk7XG4gICAgICBsZXQgdG1wID0gc2VydmVyQ29uZmlnO1xuICAgICAgLy8gc2VhcmNoIHBhdGggdGhyb3VnaCBjb25maWdcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gcGF0aC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29uc3QgYXR0ciA9IHBhdGhbaV07XG5cbiAgICAgICAgaWYgKHRtcFthdHRyXSlcbiAgICAgICAgICB0bXAgPSB0bXBbYXR0cl07XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFwiJHtjb25maWdQYXRofVwiIGRvZXMgbm90IGV4aXN0IGluIHNlcnZlciBjb25maWdgKTtcbiAgICAgIH1cblxuICAgICAgY29uZmlnW2NvbmZpZ1BhdGhdID0gdG1wO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICB9XG5cbiAgX2dlbmVyYXRlT2JqZWN0KHBhdGhzKSB7XG4gICAgY29uc3Qga2V5ID0gcGF0aHMuam9pbignOicpO1xuICAgIGlmICh0aGlzLl9jYWNoZVtrZXldKSB7fVxuICB9XG5cbiAgX29uUmVxdWVzdChjbGllbnQsIHBhdGhzKSB7XG4gICAgLy8gZ2VuZXJhdGUgYW4gb3B0aW1pemVkIGNvbmZpZyBidW5kbGUgdG8gcmV0dXJuIHRoZSBjbGllbnRcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCBjb25maWdQYXRocyA9IHRoaXMuX2NsaWVudFR5cGVDb25maWdQYXRoc1tjbGllbnQudHlwZV07XG4gICAgICBjb25zdCBjb25maWcgPSB0aGlzLmdldChjb25maWdQYXRocyk7XG5cbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdjb25maWcnLCBjb25maWcpO1xuICAgIH1cbiAgfVxufVxuXG5zZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTZXJ2ZXJTaGFyZWRDb25maWcpO1xuXG5leHBvcnQgZGVmYXVsdCBTZXJ2ZXJTaGFyZWRDb25maWc7XG4iXX0=