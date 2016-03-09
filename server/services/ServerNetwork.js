'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _ServerActivity2 = require('../core/ServerActivity');

var _ServerActivity3 = _interopRequireDefault(_ServerActivity2);

var _serverServiceManager = require('../core/serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:network';

var ServerNetwork = function (_ServerActivity) {
  (0, _inherits3.default)(ServerNetwork, _ServerActivity);

  function ServerNetwork() {
    (0, _classCallCheck3.default)(this, ServerNetwork);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerNetwork).call(this, SERVICE_ID));
  }

  (0, _createClass3.default)(ServerNetwork, [{
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerNetwork.prototype), 'connect', this).call(this, client);

      this.receive(client, 'send', this._onSend(client));
      this.receive(client, 'broadcast', this._onBroadcast(client));
    }
  }, {
    key: '_onSend',
    value: function _onSend(client) {
      var _this2 = this;

      return function (values) {
        var clientTypes = values.shift();
        _this2.broadcast.apply(_this2, [clientTypes, client, 'receive'].concat((0, _toConsumableArray3.default)(values)));
      };
    }
  }, {
    key: '_onBroadcast',
    value: function _onBroadcast(client) {
      var _this3 = this;

      return function (values) {
        return _this3.broadcast.apply(_this3, [null, client, 'receive'].concat((0, _toConsumableArray3.default)(values)));
      };
    }
  }]);
  return ServerNetwork;
}(_ServerActivity3.default);

_serverServiceManager2.default.register(SERVICE_ID, ServerNetwork);

exports.default = ServerNetwork;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlck5ldHdvcmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sYUFBYSxpQkFBYjs7SUFFQTs7O0FBQ0osV0FESSxhQUNKLEdBQWM7d0NBRFYsZUFDVTt3RkFEViwwQkFFSSxhQURNO0dBQWQ7OzZCQURJOzs0QkFLSSxRQUFRO0FBQ2QsdURBTkUsc0RBTVksT0FBZCxDQURjOztBQUdkLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsTUFBckIsRUFBNkIsS0FBSyxPQUFMLENBQWEsTUFBYixDQUE3QixFQUhjO0FBSWQsV0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixXQUFyQixFQUFrQyxLQUFLLFlBQUwsQ0FBa0IsTUFBbEIsQ0FBbEMsRUFKYzs7Ozs0QkFPUixRQUFROzs7QUFDZCxhQUFPLFVBQUMsTUFBRCxFQUFZO0FBQ2pCLFlBQU0sY0FBYyxPQUFPLEtBQVAsRUFBZCxDQURXO0FBRWpCLGVBQUssU0FBTCxnQkFBZSxhQUFhLFFBQVEsbURBQWMsUUFBbEQsRUFGaUI7T0FBWixDQURPOzs7O2lDQU9ILFFBQVE7OztBQUNuQixhQUFPLFVBQUMsTUFBRDtlQUFZLE9BQUssU0FBTCxnQkFBZSxNQUFNLFFBQVEsbURBQWMsUUFBM0M7T0FBWixDQURZOzs7U0FuQmpCOzs7QUF3Qk4sK0JBQXFCLFFBQXJCLENBQThCLFVBQTlCLEVBQTBDLGFBQTFDOztrQkFFZSIsImZpbGUiOiJTZXJ2ZXJOZXR3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bmV0d29yayc7XG5cbmNsYXNzIFNlcnZlck5ldHdvcmsgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuICB9XG5cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnc2VuZCcsIHRoaXMuX29uU2VuZChjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnYnJvYWRjYXN0JywgdGhpcy5fb25Ccm9hZGNhc3QoY2xpZW50KSk7XG4gIH1cblxuICBfb25TZW5kKGNsaWVudCkge1xuICAgIHJldHVybiAodmFsdWVzKSA9PiB7XG4gICAgICBjb25zdCBjbGllbnRUeXBlcyA9IHZhbHVlcy5zaGlmdCgpO1xuICAgICAgdGhpcy5icm9hZGNhc3QoY2xpZW50VHlwZXMsIGNsaWVudCwgJ3JlY2VpdmUnLCAuLi52YWx1ZXMpO1xuICAgIH1cbiAgfVxuXG4gIF9vbkJyb2FkY2FzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKHZhbHVlcykgPT4gdGhpcy5icm9hZGNhc3QobnVsbCwgY2xpZW50LCAncmVjZWl2ZScsIC4uLnZhbHVlcyk7XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyTmV0d29yayk7XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlck5ldHdvcms7XG4iXX0=