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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyTmV0d29yay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7Ozt3Q0FDbEIsOEJBQThCOzs7O0FBRS9ELElBQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDOztJQUUvQixhQUFhO1lBQWIsYUFBYTs7QUFDTixXQURQLGFBQWEsR0FDSDswQkFEVixhQUFhOztBQUVmLCtCQUZFLGFBQWEsNkNBRVQsVUFBVSxFQUFFO0dBQ25COztlQUhHLGFBQWE7O1dBS1YsaUJBQUMsTUFBTSxFQUFFO0FBQ2QsaUNBTkUsYUFBYSx5Q0FNRCxNQUFNLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDbkQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUM5RDs7O1dBRU0saUJBQUMsTUFBTSxFQUFFOzs7QUFDZCxhQUFPLFVBQUMsTUFBTSxFQUFLO0FBQ2pCLFlBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNuQyxjQUFLLFNBQVMsTUFBQSxTQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsU0FBUyw0QkFBSyxNQUFNLEdBQUMsQ0FBQztPQUMzRCxDQUFBO0tBQ0Y7OztXQUVXLHNCQUFDLE1BQU0sRUFBRTs7O0FBQ25CLGFBQU8sVUFBQyxNQUFNO2VBQUssT0FBSyxTQUFTLE1BQUEsVUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsNEJBQUssTUFBTSxHQUFDO09BQUEsQ0FBQztLQUN2RTs7O1NBckJHLGFBQWE7OztBQXdCbkIsc0NBQXFCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7O3FCQUUxQyxhQUFhIiwiZmlsZSI6Ii9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyTmV0d29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOm5ldHdvcmsnO1xuXG5jbGFzcyBTZXJ2ZXJOZXR3b3JrIGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcbiAgfVxuXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3NlbmQnLCB0aGlzLl9vblNlbmQoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2Jyb2FkY2FzdCcsIHRoaXMuX29uQnJvYWRjYXN0KGNsaWVudCkpO1xuICB9XG5cbiAgX29uU2VuZChjbGllbnQpIHtcbiAgICByZXR1cm4gKHZhbHVlcykgPT4ge1xuICAgICAgY29uc3QgY2xpZW50VHlwZXMgPSB2YWx1ZXMuc2hpZnQoKTtcbiAgICAgIHRoaXMuYnJvYWRjYXN0KGNsaWVudFR5cGVzLCBjbGllbnQsICdyZWNlaXZlJywgLi4udmFsdWVzKTtcbiAgICB9XG4gIH1cblxuICBfb25Ccm9hZGNhc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICh2YWx1ZXMpID0+IHRoaXMuYnJvYWRjYXN0KG51bGwsIGNsaWVudCwgJ3JlY2VpdmUnLCAuLi52YWx1ZXMpO1xuICB9XG59XG5cbnNlcnZlclNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNlcnZlck5ldHdvcmspO1xuXG5leHBvcnQgZGVmYXVsdCBTZXJ2ZXJOZXR3b3JrO1xuIl19