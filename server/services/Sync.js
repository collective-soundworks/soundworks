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

var _server = require('sync/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:sync';
/**
 * Interface for the server `'sync'` service.
 *
 * This service acts as the master clock provider for the client sync service,
 * in order to synchronize the clocks of the different clients to its own clock.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Sync}*__
 *
 * **Note:** the service is based on [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.sync = this.require('sync');
 * // when the experience has started
 * const syncTime = this.sync.getSyncTime();
 */

var Sync = function (_Service) {
  (0, _inherits3.default)(Sync, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function Sync() {
    (0, _classCallCheck3.default)(this, Sync);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Sync.__proto__ || (0, _getPrototypeOf2.default)(Sync)).call(this, SERVICE_ID));

    _this._hrtimeStart = process.hrtime();

    _this._sync = new _server2.default(function () {
      var time = process.hrtime(_this._hrtimeStart);
      return time[0] + time[1] * 1e-9;
    });
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Sync, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(Sync.prototype.__proto__ || (0, _getPrototypeOf2.default)(Sync.prototype), 'start', this).call(this);

      this.ready();
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      var _this2 = this;

      (0, _get3.default)(Sync.prototype.__proto__ || (0, _getPrototypeOf2.default)(Sync.prototype), 'connect', this).call(this, client);

      var send = function send(cmd) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return _this2.send.apply(_this2, [client, cmd].concat(args));
      };
      var receive = function receive(cmd, callback) {
        return _this2.receive(client, cmd, callback);
      };

      this._sync.start(send, receive);
    }

    /**
     * Returns the current time in the sync clock, derived from `process.hrtime()`.
     * @return {Number} - Current sync time (in _seconds_).
     */

  }, {
    key: 'getSyncTime',
    value: function getSyncTime() {
      return this._sync.getSyncTime();
    }
  }]);
  return Sync;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Sync);

exports.default = Sync;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIlN5bmMiLCJfaHJ0aW1lU3RhcnQiLCJwcm9jZXNzIiwiaHJ0aW1lIiwiX3N5bmMiLCJ0aW1lIiwicmVhZHkiLCJjbGllbnQiLCJzZW5kIiwiY21kIiwiYXJncyIsInJlY2VpdmUiLCJjYWxsYmFjayIsInN0YXJ0IiwiZ2V0U3luY1RpbWUiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxhQUFhLGNBQW5CO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWlCTUMsSTs7O0FBQ0o7QUFDQSxrQkFBYztBQUFBOztBQUFBLGtJQUNORCxVQURNOztBQUdaLFVBQUtFLFlBQUwsR0FBb0JDLFFBQVFDLE1BQVIsRUFBcEI7O0FBRUEsVUFBS0MsS0FBTCxHQUFhLHFCQUFlLFlBQU07QUFDaEMsVUFBTUMsT0FBT0gsUUFBUUMsTUFBUixDQUFlLE1BQUtGLFlBQXBCLENBQWI7QUFDQSxhQUFPSSxLQUFLLENBQUwsSUFBVUEsS0FBSyxDQUFMLElBQVUsSUFBM0I7QUFDRCxLQUhZLENBQWI7QUFMWTtBQVNiOztBQUVEOzs7Ozs0QkFDUTtBQUNOOztBQUVBLFdBQUtDLEtBQUw7QUFDRDs7QUFFRDs7Ozs0QkFDUUMsTSxFQUFRO0FBQUE7O0FBQ2QsZ0lBQWNBLE1BQWQ7O0FBRUEsVUFBTUMsT0FBTyxTQUFQQSxJQUFPLENBQUNDLEdBQUQ7QUFBQSwwQ0FBU0MsSUFBVDtBQUFTQSxjQUFUO0FBQUE7O0FBQUEsZUFBa0IsT0FBS0YsSUFBTCxnQkFBVUQsTUFBVixFQUFrQkUsR0FBbEIsU0FBMEJDLElBQTFCLEVBQWxCO0FBQUEsT0FBYjtBQUNBLFVBQU1DLFVBQVUsU0FBVkEsT0FBVSxDQUFDRixHQUFELEVBQU1HLFFBQU47QUFBQSxlQUFtQixPQUFLRCxPQUFMLENBQWFKLE1BQWIsRUFBcUJFLEdBQXJCLEVBQTBCRyxRQUExQixDQUFuQjtBQUFBLE9BQWhCOztBQUVBLFdBQUtSLEtBQUwsQ0FBV1MsS0FBWCxDQUFpQkwsSUFBakIsRUFBdUJHLE9BQXZCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7a0NBSWM7QUFDWixhQUFPLEtBQUtQLEtBQUwsQ0FBV1UsV0FBWCxFQUFQO0FBQ0Q7Ozs7O0FBR0gseUJBQWVDLFFBQWYsQ0FBd0JoQixVQUF4QixFQUFvQ0MsSUFBcEM7O2tCQUVlQSxJIiwiZmlsZSI6IlN5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFN5bmNNb2R1bGUgZnJvbSAnc3luYy9zZXJ2ZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c3luYyc7XG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHNlcnZlciBgJ3N5bmMnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhY3RzIGFzIHRoZSBtYXN0ZXIgY2xvY2sgcHJvdmlkZXIgZm9yIHRoZSBjbGllbnQgc3luYyBzZXJ2aWNlLFxuICogaW4gb3JkZXIgdG8gc3luY2hyb25pemUgdGhlIGNsb2NrcyBvZiB0aGUgZGlmZmVyZW50IGNsaWVudHMgdG8gaXRzIG93biBjbG9jay5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU3luY30qX19cbiAqXG4gKiAqKk5vdGU6KiogdGhlIHNlcnZpY2UgaXMgYmFzZWQgb24gW2BnaXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jYF0oaHR0cHM6Ly9naXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jKS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnN5bmMgPSB0aGlzLnJlcXVpcmUoJ3N5bmMnKTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWRcbiAqIGNvbnN0IHN5bmNUaW1lID0gdGhpcy5zeW5jLmdldFN5bmNUaW1lKCk7XG4gKi9cbmNsYXNzIFN5bmMgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIHRoaXMuX2hydGltZVN0YXJ0ID0gcHJvY2Vzcy5ocnRpbWUoKTtcblxuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY01vZHVsZSgoKSA9PiB7XG4gICAgICBjb25zdCB0aW1lID0gcHJvY2Vzcy5ocnRpbWUodGhpcy5faHJ0aW1lU3RhcnQpO1xuICAgICAgcmV0dXJuIHRpbWVbMF0gKyB0aW1lWzFdICogMWUtOTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgY29uc3Qgc2VuZCA9IChjbWQsIC4uLmFyZ3MpID0+IHRoaXMuc2VuZChjbGllbnQsIGNtZCwgLi4uYXJncyk7XG4gICAgY29uc3QgcmVjZWl2ZSA9IChjbWQsIGNhbGxiYWNrKSA9PiB0aGlzLnJlY2VpdmUoY2xpZW50LCBjbWQsIGNhbGxiYWNrKTtcblxuICAgIHRoaXMuX3N5bmMuc3RhcnQoc2VuZCwgcmVjZWl2ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB0aW1lIGluIHRoZSBzeW5jIGNsb2NrLCBkZXJpdmVkIGZyb20gYHByb2Nlc3MuaHJ0aW1lKClgLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gQ3VycmVudCBzeW5jIHRpbWUgKGluIF9zZWNvbmRzXykuXG4gICAqL1xuICBnZXRTeW5jVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFN5bmMpO1xuXG5leHBvcnQgZGVmYXVsdCBTeW5jO1xuIl19