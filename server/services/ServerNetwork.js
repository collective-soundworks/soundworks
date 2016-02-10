'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreServerActivity = require('../core/ServerActivity');

var _coreServerActivity2 = _interopRequireDefault(_coreServerActivity);

var _coreServerServiceManager = require('../core/serverServiceManager');

var _coreServerServiceManager2 = _interopRequireDefault(_coreServerServiceManager);

var SERVICE_ID = 'service:network';

var ServerNetwork = (function (_ServerActivity) {
  _inherits(ServerNetwork, _ServerActivity);

  function ServerNetwork() {
    _classCallCheck(this, ServerNetwork);

    _get(Object.getPrototypeOf(ServerNetwork.prototype), 'constructor', this).call(this, SERVICE_ID);
  }

  _createClass(ServerNetwork, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ServerNetwork.prototype), 'start', this).call(this);
    }
  }, {
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(ServerNetwork.prototype), 'connect', this).call(this, client);

      this.receive(client, 'send', this._onSend(client));
      this.receive(client, 'broadcast', this._onBroadcast(client));
    }
  }, {
    key: '_onSend',
    value: function _onSend(client) {
      var _this = this;

      return function (values) {
        var clientTypes = values.shift();
        _this.broadcast.apply(_this, [clientTypes, client, 'receive'].concat(_toConsumableArray(values)));
      };
    }
  }, {
    key: '_onBroadcast',
    value: function _onBroadcast(client) {
      var _this2 = this;

      return function (values) {
        return _this2.broadcast.apply(_this2, [null, client, 'receive'].concat(_toConsumableArray(values)));
      };
    }
  }]);

  return ServerNetwork;
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerNetwork);

exports['default'] = ServerNetwork;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyTmV0d29yay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7Ozt3Q0FDbEIsOEJBQThCOzs7O0FBRS9ELElBQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDOztJQUUvQixhQUFhO1lBQWIsYUFBYTs7QUFDTixXQURQLGFBQWEsR0FDSDswQkFEVixhQUFhOztBQUVmLCtCQUZFLGFBQWEsNkNBRVQsVUFBVSxFQUFFO0dBQ25COztlQUhHLGFBQWE7O1dBS1osaUJBQUc7QUFDTixpQ0FORSxhQUFhLHVDQU1EO0tBQ2Y7OztXQUVNLGlCQUFDLE1BQU0sRUFBRTtBQUNkLGlDQVZFLGFBQWEseUNBVUQsTUFBTSxFQUFFOztBQUV0QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ25ELFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDOUQ7OztXQUVNLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsYUFBTyxVQUFDLE1BQU0sRUFBSztBQUNqQixZQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDbkMsY0FBSyxTQUFTLE1BQUEsU0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLFNBQVMsNEJBQUssTUFBTSxHQUFDLENBQUM7T0FDM0QsQ0FBQTtLQUNGOzs7V0FFVyxzQkFBQyxNQUFNLEVBQUU7OztBQUNuQixhQUFPLFVBQUMsTUFBTTtlQUFLLE9BQUssU0FBUyxNQUFBLFVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLDRCQUFLLE1BQU0sR0FBQztPQUFBLENBQUM7S0FDdkU7OztTQXpCRyxhQUFhOzs7QUE0Qm5CLHNDQUFxQixRQUFRLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDOztxQkFFMUMsYUFBYSIsImZpbGUiOiJzcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlck5ldHdvcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpuZXR3b3JrJztcblxuY2xhc3MgU2VydmVyTmV0d29yayBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICB9XG5cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnc2VuZCcsIHRoaXMuX29uU2VuZChjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnYnJvYWRjYXN0JywgdGhpcy5fb25Ccm9hZGNhc3QoY2xpZW50KSk7XG4gIH1cblxuICBfb25TZW5kKGNsaWVudCkge1xuICAgIHJldHVybiAodmFsdWVzKSA9PiB7XG4gICAgICBjb25zdCBjbGllbnRUeXBlcyA9IHZhbHVlcy5zaGlmdCgpO1xuICAgICAgdGhpcy5icm9hZGNhc3QoY2xpZW50VHlwZXMsIGNsaWVudCwgJ3JlY2VpdmUnLCAuLi52YWx1ZXMpO1xuICAgIH1cbiAgfVxuXG4gIF9vbkJyb2FkY2FzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKHZhbHVlcykgPT4gdGhpcy5icm9hZGNhc3QobnVsbCwgY2xpZW50LCAncmVjZWl2ZScsIC4uLnZhbHVlcyk7XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyTmV0d29yayk7XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlck5ldHdvcms7XG4iXX0=