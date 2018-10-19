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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk5ldHdvcmsuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIk5ldHdvcmsiLCJyZWFkeSIsImNsaWVudCIsInJlY2VpdmUiLCJfb25TZW5kIiwiX29uQnJvYWRjYXN0IiwidmFsdWVzIiwiY2xpZW50VHlwZXMiLCJzaGlmdCIsImJyb2FkY2FzdCIsIlNlcnZpY2UiLCJzZXJ2aWNlTWFuYWdlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxpQkFBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0lBYU1DLE87OztBQUNKO0FBQ0EscUJBQWM7QUFBQTtBQUFBLG1JQUNORCxVQURNO0FBRWI7Ozs7NEJBRU87QUFDTjs7QUFFQSxXQUFLRSxLQUFMO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1FDLE0sRUFBUTtBQUNkLHNJQUFjQSxNQUFkOztBQUVBLFdBQUtDLE9BQUwsQ0FBYUQsTUFBYixFQUFxQixNQUFyQixFQUE2QixLQUFLRSxPQUFMLENBQWFGLE1BQWIsQ0FBN0I7QUFDQSxXQUFLQyxPQUFMLENBQWFELE1BQWIsRUFBcUIsV0FBckIsRUFBa0MsS0FBS0csWUFBTCxDQUFrQkgsTUFBbEIsQ0FBbEM7QUFDRDs7QUFFRDs7Ozs0QkFDUUEsTSxFQUFRO0FBQUE7O0FBQ2QsYUFBTyxVQUFDSSxNQUFELEVBQVk7QUFDakIsWUFBTUMsY0FBY0QsT0FBT0UsS0FBUCxFQUFwQjtBQUNBLGVBQUtDLFNBQUwsZ0JBQWVGLFdBQWYsRUFBNEJMLE1BQTVCLEVBQW9DLFNBQXBDLDBDQUFrREksTUFBbEQ7QUFDRCxPQUhEO0FBSUQ7O0FBRUQ7Ozs7aUNBQ2FKLE0sRUFBUTtBQUFBOztBQUNuQixhQUFPLFVBQUNJLE1BQUQ7QUFBQSxlQUFZLE9BQUtHLFNBQUwsZ0JBQWUsSUFBZixFQUFxQlAsTUFBckIsRUFBNkIsU0FBN0IsMENBQTJDSSxNQUEzQyxHQUFaO0FBQUEsT0FBUDtBQUNEOzs7RUEvQm1CSSxpQjs7QUFrQ3RCQyx5QkFBZUMsUUFBZixDQUF3QmIsVUFBeEIsRUFBb0NDLE9BQXBDOztrQkFFZUEsTyIsImZpbGUiOiJOZXR3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOm5ldHdvcmsnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHNlcnZlciBgJ25ldHdvcmsnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBwcm92aWRlcyBhIGdlbmVyaWMgd2F5IHRvIGNyZWF0ZSBjbGllbnQgdG8gY2xpZW50IGNvbW11bmljYXRpb25zXG4gKiB0aHJvdWdoIHdlYnNvY2tldHMgd2l0aG91dCBzZXJ2ZXIgc2lkZSBjdXN0b20gY29kZS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTmV0d29ya30qX19cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLm5ldHdvcmsgPSB0aGlzLnJlcXVpcmUoJ25ldHdvcmsnKTtcbiAqL1xuY2xhc3MgTmV0d29yayBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdzZW5kJywgdGhpcy5fb25TZW5kKGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdicm9hZGNhc3QnLCB0aGlzLl9vbkJyb2FkY2FzdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25TZW5kKGNsaWVudCkge1xuICAgIHJldHVybiAodmFsdWVzKSA9PiB7XG4gICAgICBjb25zdCBjbGllbnRUeXBlcyA9IHZhbHVlcy5zaGlmdCgpO1xuICAgICAgdGhpcy5icm9hZGNhc3QoY2xpZW50VHlwZXMsIGNsaWVudCwgJ3JlY2VpdmUnLCAuLi52YWx1ZXMpO1xuICAgIH07XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQnJvYWRjYXN0KGNsaWVudCkge1xuICAgIHJldHVybiAodmFsdWVzKSA9PiB0aGlzLmJyb2FkY2FzdChudWxsLCBjbGllbnQsICdyZWNlaXZlJywgLi4udmFsdWVzKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBOZXR3b3JrKTtcblxuZXhwb3J0IGRlZmF1bHQgTmV0d29yaztcbiJdfQ==