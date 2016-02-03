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

var SERVICE_ID = 'service:shared-config';

var ClientSharedConfig = (function (_Service) {
  _inherits(ClientSharedConfig, _Service);

  function ClientSharedConfig() {
    _classCallCheck(this, ClientSharedConfig);

    _get(Object.getPrototypeOf(ClientSharedConfig.prototype), 'constructor', this).call(this, SERVICE_ID, true);
  }

  _createClass(ClientSharedConfig, [{
    key: 'init',
    value: function init() {
      this.data = null;
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(ClientSharedConfig.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.send('request');

      this.receive('config', function (data) {
        _this.data = data;
      });
    }
  }, {
    key: 'get',
    value: function get(path) {
      return this.data[path];
    }
  }]);

  return ClientSharedConfig;
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, ClientSharedConfig);

exports['default'] = ClientSharedConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50U2hhcmVkQ29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7OzsyQkFDL0IsaUJBQWlCOzs7O0FBR3JDLElBQU0sVUFBVSxHQUFHLHVCQUF1QixDQUFDOztJQUVyQyxrQkFBa0I7WUFBbEIsa0JBQWtCOztBQUNYLFdBRFAsa0JBQWtCLEdBQ1I7MEJBRFYsa0JBQWtCOztBQUVwQiwrQkFGRSxrQkFBa0IsNkNBRWQsVUFBVSxFQUFFLElBQUksRUFBRTtHQUN6Qjs7ZUFIRyxrQkFBa0I7O1dBS2xCLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7S0FDbEI7OztXQUVJLGlCQUFHOzs7QUFDTixpQ0FWRSxrQkFBa0IsdUNBVU47O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQ2xCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFZCxVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUVyQixVQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFDLElBQUksRUFBSztBQUMvQixjQUFLLElBQUksR0FBRyxJQUFJLENBQUM7T0FDbEIsQ0FBQyxDQUFDO0tBQ0o7OztXQUVFLGFBQUMsSUFBSSxFQUFFO0FBQ1IsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3hCOzs7U0F4Qkcsa0JBQWtCOzs7QUEyQnhCLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs7cUJBRXpDLGtCQUFrQiIsImZpbGUiOiJzcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudFNoYXJlZENvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1jb25maWcnO1xuXG5jbGFzcyBDbGllbnRTaGFyZWRDb25maWcgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuZGF0YSA9IG51bGw7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdjb25maWcnLCAoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldChwYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVtwYXRoXTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBDbGllbnRTaGFyZWRDb25maWcpO1xuXG5leHBvcnQgZGVmYXVsdCBDbGllbnRTaGFyZWRDb25maWc7XG4iXX0=