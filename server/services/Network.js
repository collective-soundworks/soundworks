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

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:network';

/**
 * Interface for the server `'network'` service.
 *
 * This service provides a generic way to create client to client communications
 * through websockets without server side custom code.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Network}*__
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.network = this.require('network');
 */

var Network = function (_Service) {
  (0, _inherits3.default)(Network, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Network() {
    (0, _classCallCheck3.default)(this, Network);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Network).call(this, SERVICE_ID));
  }

  /** @private */


  (0, _createClass3.default)(Network, [{
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Network.prototype), 'connect', this).call(this, client);

      this.receive(client, 'send', this._onSend(client));
      this.receive(client, 'broadcast', this._onBroadcast(client));
    }

    /** @private */

  }, {
    key: '_onSend',
    value: function _onSend(client) {
      var _this2 = this;

      return function (values) {
        var clientTypes = values.shift();
        _this2.broadcast.apply(_this2, [clientTypes, client, 'receive'].concat((0, _toConsumableArray3.default)(values)));
      };
    }

    /** @private */

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
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Network);

exports.default = Network;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk5ldHdvcmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sYUFBYSxpQkFBbkI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFlTSxPOzs7OztBQUVKLHFCQUFjO0FBQUE7QUFBQSw0R0FDTixVQURNO0FBRWI7Ozs7Ozs7NEJBR08sTSxFQUFRO0FBQ2QsdUdBQWMsTUFBZDs7QUFFQSxXQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLE1BQXJCLEVBQTZCLEtBQUssT0FBTCxDQUFhLE1BQWIsQ0FBN0I7QUFDQSxXQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLFdBQXJCLEVBQWtDLEtBQUssWUFBTCxDQUFrQixNQUFsQixDQUFsQztBQUNEOzs7Ozs7NEJBR08sTSxFQUFRO0FBQUE7O0FBQ2QsYUFBTyxVQUFDLE1BQUQsRUFBWTtBQUNqQixZQUFNLGNBQWMsT0FBTyxLQUFQLEVBQXBCO0FBQ0EsZUFBSyxTQUFMLGdCQUFlLFdBQWYsRUFBNEIsTUFBNUIsRUFBb0MsU0FBcEMsMENBQWtELE1BQWxEO0FBQ0QsT0FIRDtBQUlEOzs7Ozs7aUNBR1ksTSxFQUFRO0FBQUE7O0FBQ25CLGFBQU8sVUFBQyxNQUFEO0FBQUEsZUFBWSxPQUFLLFNBQUwsZ0JBQWUsSUFBZixFQUFxQixNQUFyQixFQUE2QixTQUE3QiwwQ0FBMkMsTUFBM0MsR0FBWjtBQUFBLE9BQVA7QUFDRDs7Ozs7QUFHSCx5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLE9BQXBDOztrQkFFZSxPIiwiZmlsZSI6Ik5ldHdvcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bmV0d29yayc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAnbmV0d29yaydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIHByb3ZpZGVzIGEgZ2VuZXJpYyB3YXkgdG8gY3JlYXRlIGNsaWVudCB0byBjbGllbnQgY29tbXVuaWNhdGlvbnNcbiAqIHRocm91Z2ggd2Vic29ja2V0cyB3aXRob3V0IHNlcnZlciBzaWRlIGN1c3RvbSBjb2RlLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5OZXR3b3JrfSpfX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMubmV0d29yayA9IHRoaXMucmVxdWlyZSgnbmV0d29yaycpO1xuICovXG5jbGFzcyBOZXR3b3JrIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnc2VuZCcsIHRoaXMuX29uU2VuZChjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnYnJvYWRjYXN0JywgdGhpcy5fb25Ccm9hZGNhc3QoY2xpZW50KSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uU2VuZChjbGllbnQpIHtcbiAgICByZXR1cm4gKHZhbHVlcykgPT4ge1xuICAgICAgY29uc3QgY2xpZW50VHlwZXMgPSB2YWx1ZXMuc2hpZnQoKTtcbiAgICAgIHRoaXMuYnJvYWRjYXN0KGNsaWVudFR5cGVzLCBjbGllbnQsICdyZWNlaXZlJywgLi4udmFsdWVzKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQnJvYWRjYXN0KGNsaWVudCkge1xuICAgIHJldHVybiAodmFsdWVzKSA9PiB0aGlzLmJyb2FkY2FzdChudWxsLCBjbGllbnQsICdyZWNlaXZlJywgLi4udmFsdWVzKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBOZXR3b3JrKTtcblxuZXhwb3J0IGRlZmF1bHQgTmV0d29yaztcbiJdfQ==