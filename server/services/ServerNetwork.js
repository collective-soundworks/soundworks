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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlck5ldHdvcmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tDQUEyQix3QkFBd0I7Ozs7d0NBQ2xCLDhCQUE4Qjs7OztBQUUvRCxJQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQzs7SUFFL0IsYUFBYTtZQUFiLGFBQWE7O0FBQ04sV0FEUCxhQUFhLEdBQ0g7MEJBRFYsYUFBYTs7QUFFZiwrQkFGRSxhQUFhLDZDQUVULFVBQVUsRUFBRTtHQUNuQjs7ZUFIRyxhQUFhOztXQUtWLGlCQUFDLE1BQU0sRUFBRTtBQUNkLGlDQU5FLGFBQWEseUNBTUQsTUFBTSxFQUFFOztBQUV0QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ25ELFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDOUQ7OztXQUVNLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsYUFBTyxVQUFDLE1BQU0sRUFBSztBQUNqQixZQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDbkMsY0FBSyxTQUFTLE1BQUEsU0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLFNBQVMsNEJBQUssTUFBTSxHQUFDLENBQUM7T0FDM0QsQ0FBQTtLQUNGOzs7V0FFVyxzQkFBQyxNQUFNLEVBQUU7OztBQUNuQixhQUFPLFVBQUMsTUFBTTtlQUFLLE9BQUssU0FBUyxNQUFBLFVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLDRCQUFLLE1BQU0sR0FBQztPQUFBLENBQUM7S0FDdkU7OztTQXJCRyxhQUFhOzs7QUF3Qm5CLHNDQUFxQixRQUFRLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDOztxQkFFMUMsYUFBYSIsImZpbGUiOiIvVXNlcnMvc2NobmVsbC9EZXZlbG9wbWVudC93ZWIvY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3Mvc3JjL3NlcnZlci9zZXJ2aWNlcy9TZXJ2ZXJOZXR3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bmV0d29yayc7XG5cbmNsYXNzIFNlcnZlck5ldHdvcmsgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuICB9XG5cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnc2VuZCcsIHRoaXMuX29uU2VuZChjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnYnJvYWRjYXN0JywgdGhpcy5fb25Ccm9hZGNhc3QoY2xpZW50KSk7XG4gIH1cblxuICBfb25TZW5kKGNsaWVudCkge1xuICAgIHJldHVybiAodmFsdWVzKSA9PiB7XG4gICAgICBjb25zdCBjbGllbnRUeXBlcyA9IHZhbHVlcy5zaGlmdCgpO1xuICAgICAgdGhpcy5icm9hZGNhc3QoY2xpZW50VHlwZXMsIGNsaWVudCwgJ3JlY2VpdmUnLCAuLi52YWx1ZXMpO1xuICAgIH1cbiAgfVxuXG4gIF9vbkJyb2FkY2FzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKHZhbHVlcykgPT4gdGhpcy5icm9hZGNhc3QobnVsbCwgY2xpZW50LCAncmVjZWl2ZScsIC4uLnZhbHVlcyk7XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyTmV0d29yayk7XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlck5ldHdvcms7XG4iXX0=