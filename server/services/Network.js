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
    return (0, _possibleConstructorReturn3.default)(this, (Network.__proto__ || (0, _getPrototypeOf2.default)(Network)).call(this, SERVICE_ID));
  }

  (0, _createClass3.default)(Network, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(Network.prototype.__proto__ || (0, _getPrototypeOf2.default)(Network.prototype), 'start', this).call(this);

      this.ready();
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)(Network.prototype.__proto__ || (0, _getPrototypeOf2.default)(Network.prototype), 'connect', this).call(this, client);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk5ldHdvcmsuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIk5ldHdvcmsiLCJyZWFkeSIsImNsaWVudCIsInJlY2VpdmUiLCJfb25TZW5kIiwiX29uQnJvYWRjYXN0IiwidmFsdWVzIiwiY2xpZW50VHlwZXMiLCJzaGlmdCIsImJyb2FkY2FzdCIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxpQkFBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0lBYU1DLE87OztBQUNKO0FBQ0EscUJBQWM7QUFBQTtBQUFBLG1JQUNORCxVQURNO0FBRWI7Ozs7NEJBRU87QUFDTjs7QUFFQSxXQUFLRSxLQUFMO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1FDLE0sRUFBUTtBQUNkLHNJQUFjQSxNQUFkOztBQUVBLFdBQUtDLE9BQUwsQ0FBYUQsTUFBYixFQUFxQixNQUFyQixFQUE2QixLQUFLRSxPQUFMLENBQWFGLE1BQWIsQ0FBN0I7QUFDQSxXQUFLQyxPQUFMLENBQWFELE1BQWIsRUFBcUIsV0FBckIsRUFBa0MsS0FBS0csWUFBTCxDQUFrQkgsTUFBbEIsQ0FBbEM7QUFDRDs7QUFFRDs7Ozs0QkFDUUEsTSxFQUFRO0FBQUE7O0FBQ2QsYUFBTyxVQUFDSSxNQUFELEVBQVk7QUFDakIsWUFBTUMsY0FBY0QsT0FBT0UsS0FBUCxFQUFwQjtBQUNBLGVBQUtDLFNBQUwsZ0JBQWVGLFdBQWYsRUFBNEJMLE1BQTVCLEVBQW9DLFNBQXBDLDBDQUFrREksTUFBbEQ7QUFDRCxPQUhEO0FBSUQ7O0FBRUQ7Ozs7aUNBQ2FKLE0sRUFBUTtBQUFBOztBQUNuQixhQUFPLFVBQUNJLE1BQUQ7QUFBQSxlQUFZLE9BQUtHLFNBQUwsZ0JBQWUsSUFBZixFQUFxQlAsTUFBckIsRUFBNkIsU0FBN0IsMENBQTJDSSxNQUEzQyxHQUFaO0FBQUEsT0FBUDtBQUNEOzs7OztBQUdILHlCQUFlSSxRQUFmLENBQXdCWCxVQUF4QixFQUFvQ0MsT0FBcEM7O2tCQUVlQSxPIiwiZmlsZSI6Ik5ldHdvcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bmV0d29yayc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAnbmV0d29yaydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIHByb3ZpZGVzIGEgZ2VuZXJpYyB3YXkgdG8gY3JlYXRlIGNsaWVudCB0byBjbGllbnQgY29tbXVuaWNhdGlvbnNcbiAqIHRocm91Z2ggd2Vic29ja2V0cyB3aXRob3V0IHNlcnZlciBzaWRlIGN1c3RvbSBjb2RlLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5OZXR3b3JrfSpfX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMubmV0d29yayA9IHRoaXMucmVxdWlyZSgnbmV0d29yaycpO1xuICovXG5jbGFzcyBOZXR3b3JrIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3NlbmQnLCB0aGlzLl9vblNlbmQoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2Jyb2FkY2FzdCcsIHRoaXMuX29uQnJvYWRjYXN0KGNsaWVudCkpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblNlbmQoY2xpZW50KSB7XG4gICAgcmV0dXJuICh2YWx1ZXMpID0+IHtcbiAgICAgIGNvbnN0IGNsaWVudFR5cGVzID0gdmFsdWVzLnNoaWZ0KCk7XG4gICAgICB0aGlzLmJyb2FkY2FzdChjbGllbnRUeXBlcywgY2xpZW50LCAncmVjZWl2ZScsIC4uLnZhbHVlcyk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Ccm9hZGNhc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICh2YWx1ZXMpID0+IHRoaXMuYnJvYWRjYXN0KG51bGwsIGNsaWVudCwgJ3JlY2VpdmUnLCAuLi52YWx1ZXMpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIE5ldHdvcmspO1xuXG5leHBvcnQgZGVmYXVsdCBOZXR3b3JrO1xuIl19