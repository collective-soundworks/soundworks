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

  /** @private */


  (0, _createClass3.default)(Network, [{
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk5ldHdvcmsuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIk5ldHdvcmsiLCJjbGllbnQiLCJyZWNlaXZlIiwiX29uU2VuZCIsIl9vbkJyb2FkY2FzdCIsInZhbHVlcyIsImNsaWVudFR5cGVzIiwic2hpZnQiLCJicm9hZGNhc3QiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsaUJBQW5COztBQUVBOzs7Ozs7Ozs7Ozs7OztJQWFNQyxPOzs7QUFDSjtBQUNBLHFCQUFjO0FBQUE7QUFBQSxtSUFDTkQsVUFETTtBQUViOztBQUVEOzs7Ozs0QkFDUUUsTSxFQUFRO0FBQ2Qsc0lBQWNBLE1BQWQ7O0FBRUEsV0FBS0MsT0FBTCxDQUFhRCxNQUFiLEVBQXFCLE1BQXJCLEVBQTZCLEtBQUtFLE9BQUwsQ0FBYUYsTUFBYixDQUE3QjtBQUNBLFdBQUtDLE9BQUwsQ0FBYUQsTUFBYixFQUFxQixXQUFyQixFQUFrQyxLQUFLRyxZQUFMLENBQWtCSCxNQUFsQixDQUFsQztBQUNEOztBQUVEOzs7OzRCQUNRQSxNLEVBQVE7QUFBQTs7QUFDZCxhQUFPLFVBQUNJLE1BQUQsRUFBWTtBQUNqQixZQUFNQyxjQUFjRCxPQUFPRSxLQUFQLEVBQXBCO0FBQ0EsZUFBS0MsU0FBTCxnQkFBZUYsV0FBZixFQUE0QkwsTUFBNUIsRUFBb0MsU0FBcEMsMENBQWtESSxNQUFsRDtBQUNELE9BSEQ7QUFJRDs7QUFFRDs7OztpQ0FDYUosTSxFQUFRO0FBQUE7O0FBQ25CLGFBQU8sVUFBQ0ksTUFBRDtBQUFBLGVBQVksT0FBS0csU0FBTCxnQkFBZSxJQUFmLEVBQXFCUCxNQUFyQixFQUE2QixTQUE3QiwwQ0FBMkNJLE1BQTNDLEdBQVo7QUFBQSxPQUFQO0FBQ0Q7Ozs7O0FBR0gseUJBQWVJLFFBQWYsQ0FBd0JWLFVBQXhCLEVBQW9DQyxPQUFwQzs7a0JBRWVBLE8iLCJmaWxlIjoiTmV0d29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpuZXR3b3JrJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCduZXR3b3JrJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgcHJvdmlkZXMgYSBnZW5lcmljIHdheSB0byBjcmVhdGUgY2xpZW50IHRvIGNsaWVudCBjb21tdW5pY2F0aW9uc1xuICogdGhyb3VnaCB3ZWJzb2NrZXRzIHdpdGhvdXQgc2VydmVyIHNpZGUgY3VzdG9tIGNvZGUuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50Lk5ldHdvcmt9Kl9fXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5uZXR3b3JrID0gdGhpcy5yZXF1aXJlKCduZXR3b3JrJyk7XG4gKi9cbmNsYXNzIE5ldHdvcmsgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdzZW5kJywgdGhpcy5fb25TZW5kKGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdicm9hZGNhc3QnLCB0aGlzLl9vbkJyb2FkY2FzdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25TZW5kKGNsaWVudCkge1xuICAgIHJldHVybiAodmFsdWVzKSA9PiB7XG4gICAgICBjb25zdCBjbGllbnRUeXBlcyA9IHZhbHVlcy5zaGlmdCgpO1xuICAgICAgdGhpcy5icm9hZGNhc3QoY2xpZW50VHlwZXMsIGNsaWVudCwgJ3JlY2VpdmUnLCAuLi52YWx1ZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Ccm9hZGNhc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICh2YWx1ZXMpID0+IHRoaXMuYnJvYWRjYXN0KG51bGwsIGNsaWVudCwgJ3JlY2VpdmUnLCAuLi52YWx1ZXMpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIE5ldHdvcmspO1xuXG5leHBvcnQgZGVmYXVsdCBOZXR3b3JrO1xuIl19