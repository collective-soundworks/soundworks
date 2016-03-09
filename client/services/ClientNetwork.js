'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @todo
 * A generic service for inter-client communications (based on client.type)
 * without server side custom code
 */

var SERVICE_ID = 'service:network';

var ClientNetwork = function (_Service) {
  (0, _inherits3.default)(ClientNetwork, _Service);

  function ClientNetwork() {
    (0, _classCallCheck3.default)(this, ClientNetwork);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ClientNetwork).call(this, SERVICE_ID, true));

    var defaults = {};
    _this.configure(defaults);

    _this._listeners = {};
    return _this;
  }

  (0, _createClass3.default)(ClientNetwork, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientNetwork.prototype), 'start', this).call(this);

      // common logic for receivers
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientNetwork.prototype), 'receive', this).call(this, 'receive', function () {
        for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
          values[_key] = arguments[_key];
        }

        var channel = values.shift();
        var listeners = _this2._listeners[channel];

        if (Array.isArray(listeners)) listeners.forEach(function (callback) {
          return callback.apply(undefined, values);
        });
      });

      this.ready();
    }
  }, {
    key: 'send',
    value: function send(clientTypes, channel) {
      for (var _len2 = arguments.length, values = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        values[_key2 - 2] = arguments[_key2];
      }

      values.unshift(clientTypes, channel);
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientNetwork.prototype), 'send', this).call(this, 'send', values);
    }
  }, {
    key: 'broadcast',
    value: function broadcast(channel) {
      for (var _len3 = arguments.length, values = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        values[_key3 - 1] = arguments[_key3];
      }

      values.unshift(channel);
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientNetwork.prototype), 'send', this).call(this, 'broadcast', values);
    }
  }, {
    key: 'receive',
    value: function receive(channel, callback) {
      if (!this._listeners[channel]) this._listeners[channel] = [];

      this._listeners[channel].push(callback);
    }
  }, {
    key: 'removeListener',
    value: function removeListener(channel, callback) {
      var listeners = this._listeners[channel];

      if (Array.isArray(listeners)) {
        var index = listeners.indexOf(callback);

        if (index !== -1) listeners.splice(index, 1);
      }
    }
  }]);
  return ClientNetwork;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, ClientNetwork);

exports.default = ClientNetwork;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudE5ldHdvcmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxhQUFhLGlCQUFiOztJQUVBOzs7QUFDSixXQURJLGFBQ0osR0FBYzt3Q0FEVixlQUNVOzs2RkFEViwwQkFFSSxZQUFZLE9BRE47O0FBR1osUUFBTSxXQUFXLEVBQVgsQ0FITTtBQUlaLFVBQUssU0FBTCxDQUFlLFFBQWYsRUFKWTs7QUFNWixVQUFLLFVBQUwsR0FBa0IsRUFBbEIsQ0FOWTs7R0FBZDs7NkJBREk7OzRCQVVJOzs7QUFDTix1REFYRSxtREFXRjs7O0FBRE0sdURBVkosc0RBY1ksV0FBVyxZQUFlOzBDQUFYOztTQUFXOztBQUN0QyxZQUFNLFVBQVUsT0FBTyxLQUFQLEVBQVYsQ0FEZ0M7QUFFdEMsWUFBTSxZQUFZLE9BQUssVUFBTCxDQUFnQixPQUFoQixDQUFaLENBRmdDOztBQUl0QyxZQUFJLE1BQU0sT0FBTixDQUFjLFNBQWQsQ0FBSixFQUNFLFVBQVUsT0FBVixDQUFrQixVQUFDLFFBQUQ7aUJBQWMsMEJBQVksTUFBWjtTQUFkLENBQWxCLENBREY7T0FKdUIsQ0FBekIsQ0FKTTs7QUFZTixXQUFLLEtBQUwsR0FaTTs7Ozt5QkFlSCxhQUFhLFNBQW9CO3lDQUFSOztPQUFROztBQUNwQyxhQUFPLE9BQVAsQ0FBZSxXQUFmLEVBQTRCLE9BQTVCLEVBRG9DO0FBRXBDLHVEQTNCRSxtREEyQlMsUUFBUSxPQUFuQixDQUZvQzs7Ozs4QkFLNUIsU0FBb0I7eUNBQVI7O09BQVE7O0FBQzVCLGFBQU8sT0FBUCxDQUFlLE9BQWYsRUFENEI7QUFFNUIsdURBaENFLG1EQWdDUyxhQUFhLE9BQXhCLENBRjRCOzs7OzRCQUt0QixTQUFTLFVBQVU7QUFDekIsVUFBSSxDQUFDLEtBQUssVUFBTCxDQUFnQixPQUFoQixDQUFELEVBQ0YsS0FBSyxVQUFMLENBQWdCLE9BQWhCLElBQTJCLEVBQTNCLENBREY7O0FBR0EsV0FBSyxVQUFMLENBQWdCLE9BQWhCLEVBQXlCLElBQXpCLENBQThCLFFBQTlCLEVBSnlCOzs7O21DQU9aLFNBQVMsVUFBVTtBQUNoQyxVQUFNLFlBQVksS0FBSyxVQUFMLENBQWdCLE9BQWhCLENBQVosQ0FEMEI7O0FBR2hDLFVBQUksTUFBTSxPQUFOLENBQWMsU0FBZCxDQUFKLEVBQThCO0FBQzVCLFlBQU0sUUFBUSxVQUFVLE9BQVYsQ0FBa0IsUUFBbEIsQ0FBUixDQURzQjs7QUFHNUIsWUFBSSxVQUFVLENBQUMsQ0FBRCxFQUNaLFVBQVUsTUFBVixDQUFpQixLQUFqQixFQUF3QixDQUF4QixFQURGO09BSEY7OztTQTdDRTs7O0FBc0ROLHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsYUFBcEM7O2tCQUVlIiwiZmlsZSI6IkNsaWVudE5ldHdvcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEB0b2RvXG4gKiBBIGdlbmVyaWMgc2VydmljZSBmb3IgaW50ZXItY2xpZW50IGNvbW11bmljYXRpb25zIChiYXNlZCBvbiBjbGllbnQudHlwZSlcbiAqIHdpdGhvdXQgc2VydmVyIHNpZGUgY3VzdG9tIGNvZGVcbiAqL1xuXG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bmV0d29yayc7XG5cbmNsYXNzIENsaWVudE5ldHdvcmsgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHt9O1xuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIC8vIGNvbW1vbiBsb2dpYyBmb3IgcmVjZWl2ZXJzXG4gICAgc3VwZXIucmVjZWl2ZSgncmVjZWl2ZScsICguLi52YWx1ZXMpID0+IHtcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSB2YWx1ZXMuc2hpZnQoKTtcbiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc1tjaGFubmVsXTtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkobGlzdGVuZXJzKSlcbiAgICAgICAgbGlzdGVuZXJzLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjayguLi52YWx1ZXMpKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIHNlbmQoY2xpZW50VHlwZXMsIGNoYW5uZWwsIC4uLnZhbHVlcykge1xuICAgIHZhbHVlcy51bnNoaWZ0KGNsaWVudFR5cGVzLCBjaGFubmVsKTtcbiAgICBzdXBlci5zZW5kKCdzZW5kJywgdmFsdWVzKTtcbiAgfVxuXG4gIGJyb2FkY2FzdChjaGFubmVsLCAuLi52YWx1ZXMpIHtcbiAgICB2YWx1ZXMudW5zaGlmdChjaGFubmVsKTtcbiAgICBzdXBlci5zZW5kKCdicm9hZGNhc3QnLCB2YWx1ZXMpO1xuICB9XG5cbiAgcmVjZWl2ZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fbGlzdGVuZXJzW2NoYW5uZWxdKVxuICAgICAgdGhpcy5fbGlzdGVuZXJzW2NoYW5uZWxdID0gW107XG5cbiAgICB0aGlzLl9saXN0ZW5lcnNbY2hhbm5lbF0ucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc1tjaGFubmVsXTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGxpc3RlbmVycykpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gbGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2xpZW50TmV0d29yayk7XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudE5ldHdvcms7XG4iXX0=