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

var _Activity2 = require('../core/Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:network';

var Network = function (_Activity) {
  (0, _inherits3.default)(Network, _Activity);

  function Network() {
    (0, _classCallCheck3.default)(this, Network);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Network).call(this, SERVICE_ID));
  }

  (0, _createClass3.default)(Network, [{
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Network.prototype), 'connect', this).call(this, client);

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
  return Network;
}(_Activity3.default);

_serviceManager2.default.register(SERVICE_ID, Network);

exports.default = Network;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk5ldHdvcmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sYUFBYSxpQkFBYjs7SUFFQTs7O0FBQ0osV0FESSxPQUNKLEdBQWM7d0NBRFYsU0FDVTt3RkFEVixvQkFFSSxhQURNO0dBQWQ7OzZCQURJOzs0QkFLSSxRQUFRO0FBQ2QsdURBTkUsZ0RBTVksT0FBZCxDQURjOztBQUdkLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsTUFBckIsRUFBNkIsS0FBSyxPQUFMLENBQWEsTUFBYixDQUE3QixFQUhjO0FBSWQsV0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixXQUFyQixFQUFrQyxLQUFLLFlBQUwsQ0FBa0IsTUFBbEIsQ0FBbEMsRUFKYzs7Ozs0QkFPUixRQUFROzs7QUFDZCxhQUFPLFVBQUMsTUFBRCxFQUFZO0FBQ2pCLFlBQU0sY0FBYyxPQUFPLEtBQVAsRUFBZCxDQURXO0FBRWpCLGVBQUssU0FBTCxnQkFBZSxhQUFhLFFBQVEsbURBQWMsUUFBbEQsRUFGaUI7T0FBWixDQURPOzs7O2lDQU9ILFFBQVE7OztBQUNuQixhQUFPLFVBQUMsTUFBRDtlQUFZLE9BQUssU0FBTCxnQkFBZSxNQUFNLFFBQVEsbURBQWMsUUFBM0M7T0FBWixDQURZOzs7U0FuQmpCOzs7QUF3Qk4seUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxPQUFwQzs7a0JBRWUiLCJmaWxlIjoiTmV0d29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuLi9jb3JlL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOm5ldHdvcmsnO1xuXG5jbGFzcyBOZXR3b3JrIGV4dGVuZHMgQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcbiAgfVxuXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3NlbmQnLCB0aGlzLl9vblNlbmQoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2Jyb2FkY2FzdCcsIHRoaXMuX29uQnJvYWRjYXN0KGNsaWVudCkpO1xuICB9XG5cbiAgX29uU2VuZChjbGllbnQpIHtcbiAgICByZXR1cm4gKHZhbHVlcykgPT4ge1xuICAgICAgY29uc3QgY2xpZW50VHlwZXMgPSB2YWx1ZXMuc2hpZnQoKTtcbiAgICAgIHRoaXMuYnJvYWRjYXN0KGNsaWVudFR5cGVzLCBjbGllbnQsICdyZWNlaXZlJywgLi4udmFsdWVzKTtcbiAgICB9XG4gIH1cblxuICBfb25Ccm9hZGNhc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICh2YWx1ZXMpID0+IHRoaXMuYnJvYWRjYXN0KG51bGwsIGNsaWVudCwgJ3JlY2VpdmUnLCAuLi52YWx1ZXMpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIE5ldHdvcmspO1xuXG5leHBvcnQgZGVmYXVsdCBOZXR3b3JrO1xuIl19