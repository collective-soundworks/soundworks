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

var ServerSharedConfig = (function (_ServerActivity) {
  _inherits(ServerSharedConfig, _ServerActivity);

  function ServerSharedConfig() {
    _classCallCheck(this, ServerSharedConfig);

    _get(Object.getPrototypeOf(ServerSharedConfig.prototype), 'constructor', this).call(this, SERVICE_ID);

    this._clientTypeConfigPaths = {};
  }

  _createClass(ServerSharedConfig, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ServerSharedConfig.prototype), 'start', this).call(this);
    }
  }, {
    key: 'addItem',
    value: function addItem(configPath, clientType) {
      var _this = this;

      // add given client type to mapped client types
      var options = { clientType: clientType };
      this.configure(options);

      if (typeof clientType === 'string') clientType = [clientType];

      clientType.forEach(function (type) {
        if (!_this._clientTypeConfigPaths[type]) _this._clientTypeConfigPaths[type] = [];

        _this._clientTypeConfigPaths[type].push(configPath);
      });
    }
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
        var serverConfig = _coreServer2['default'].config;
        var config = {};

        configPaths.forEach(function (configPath) {
          // 'setup.area' => ['setup', 'area'];
          var path = configPath.split('.');
          var tmp = serverConfig;
          // search path trough config
          for (var i = 0, l = path.length; i < l; i++) {
            var attr = path[i];

            if (tmp[attr]) tmp = tmp[attr];else throw new Error('"' + configPath + '" does not exist in server config');
          }

          config[configPath] = tmp;
        });

        _this2.send(client, 'config', config);
      };
    }
  }]);

  return ServerSharedConfig;
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerSharedConfig);

exports['default'] = ServerSharedConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyU2hhcmVkQ29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7Ozt3Q0FDbEIsOEJBQThCOzs7OzBCQUM1QyxnQkFBZ0I7Ozs7QUFHbkMsSUFBTSxVQUFVLEdBQUcsdUJBQXVCLENBQUM7O0lBRXJDLGtCQUFrQjtZQUFsQixrQkFBa0I7O0FBQ1gsV0FEUCxrQkFBa0IsR0FDUjswQkFEVixrQkFBa0I7O0FBRXBCLCtCQUZFLGtCQUFrQiw2Q0FFZCxVQUFVLEVBQUU7O0FBRWxCLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7R0FDbEM7O2VBTEcsa0JBQWtCOztXQU9qQixpQkFBRztBQUNOLGlDQVJFLGtCQUFrQix1Q0FRTjtLQUNmOzs7V0FFTSxpQkFBQyxVQUFVLEVBQUUsVUFBVSxFQUFFOzs7O0FBRTlCLFVBQU0sT0FBTyxHQUFHLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBRSxDQUFDO0FBQy9CLFVBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRXhCLFVBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUNoQyxVQUFVLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFNUIsZ0JBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDM0IsWUFBSSxDQUFDLE1BQUssc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQ3BDLE1BQUssc0JBQXNCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUV6QyxjQUFLLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztPQUNwRCxDQUFDLENBQUM7S0FDSjs7O1dBRU0saUJBQUMsTUFBTSxFQUFFO0FBQ2QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUMxRDs7O1dBRVMsb0JBQUMsTUFBTSxFQUFFOzs7QUFDakIsYUFBTyxZQUFNO0FBQ1gsWUFBTSxXQUFXLEdBQUcsT0FBSyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0QsWUFBTSxZQUFZLEdBQUcsd0JBQU8sTUFBTSxDQUFDO0FBQ25DLFlBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsbUJBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxVQUFVLEVBQUs7O0FBRWxDLGNBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkMsY0FBSSxHQUFHLEdBQUcsWUFBWSxDQUFDOztBQUV2QixlQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzNDLGdCQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXJCLGdCQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFDWCxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBRWhCLE1BQU0sSUFBSSxLQUFLLE9BQUssVUFBVSx1Q0FBb0MsQ0FBQztXQUN0RTs7QUFFRCxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztTQUMxQixDQUFDLENBQUM7O0FBRUgsZUFBSyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztPQUNyQyxDQUFBO0tBQ0Y7OztTQXhERyxrQkFBa0I7OztBQTJEeEIsc0NBQXFCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs7cUJBRS9DLGtCQUFrQiIsImZpbGUiOiJzcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlclNoYXJlZENvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXInO1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzaGFyZWQtY29uZmlnJztcblxuY2xhc3MgU2VydmVyU2hhcmVkQ29uZmlnIGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIHRoaXMuX2NsaWVudFR5cGVDb25maWdQYXRocyA9IHt9O1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgfVxuXG4gIGFkZEl0ZW0oY29uZmlnUGF0aCwgY2xpZW50VHlwZSkge1xuICAgIC8vIGFkZCBnaXZlbiBjbGllbnQgdHlwZSB0byBtYXBwZWQgY2xpZW50IHR5cGVzXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgY2xpZW50VHlwZSB9O1xuICAgIHRoaXMuY29uZmlndXJlKG9wdGlvbnMpO1xuXG4gICAgaWYgKHR5cGVvZiBjbGllbnRUeXBlID09PSAnc3RyaW5nJylcbiAgICAgIGNsaWVudFR5cGUgPSBbY2xpZW50VHlwZV07XG5cbiAgICBjbGllbnRUeXBlLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICAgIGlmICghdGhpcy5fY2xpZW50VHlwZUNvbmZpZ1BhdGhzW3R5cGVdKVxuICAgICAgICB0aGlzLl9jbGllbnRUeXBlQ29uZmlnUGF0aHNbdHlwZV0gPSBbXTtcblxuICAgICAgdGhpcy5fY2xpZW50VHlwZUNvbmZpZ1BhdGhzW3R5cGVdLnB1c2goY29uZmlnUGF0aCk7XG4gICAgfSk7XG4gIH1cblxuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICB9XG5cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnUGF0aHMgPSB0aGlzLl9jbGllbnRUeXBlQ29uZmlnUGF0aHNbY2xpZW50LnR5cGVdO1xuICAgICAgY29uc3Qgc2VydmVyQ29uZmlnID0gc2VydmVyLmNvbmZpZztcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHt9O1xuXG4gICAgICBjb25maWdQYXRocy5mb3JFYWNoKChjb25maWdQYXRoKSA9PiB7XG4gICAgICAgIC8vICdzZXR1cC5hcmVhJyA9PiBbJ3NldHVwJywgJ2FyZWEnXTtcbiAgICAgICAgY29uc3QgcGF0aCA9IGNvbmZpZ1BhdGguc3BsaXQoJy4nKTtcbiAgICAgICAgbGV0IHRtcCA9IHNlcnZlckNvbmZpZztcbiAgICAgICAgLy8gc2VhcmNoIHBhdGggdHJvdWdoIGNvbmZpZ1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHBhdGgubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgYXR0ciA9IHBhdGhbaV07XG5cbiAgICAgICAgICBpZiAodG1wW2F0dHJdKVxuICAgICAgICAgICAgdG1wID0gdG1wW2F0dHJdO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgXCIke2NvbmZpZ1BhdGh9XCIgZG9lcyBub3QgZXhpc3QgaW4gc2VydmVyIGNvbmZpZ2ApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnW2NvbmZpZ1BhdGhdID0gdG1wO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdjb25maWcnLCBjb25maWcpO1xuICAgIH1cbiAgfVxufVxuXG5zZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTZXJ2ZXJTaGFyZWRDb25maWcpO1xuXG5leHBvcnQgZGVmYXVsdCBTZXJ2ZXJTaGFyZWRDb25maWc7XG4iXX0=