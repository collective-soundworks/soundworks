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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIlN5bmMiLCJfaHJ0aW1lU3RhcnQiLCJwcm9jZXNzIiwiaHJ0aW1lIiwiX3N5bmMiLCJ0aW1lIiwiY2xpZW50Iiwic2VuZCIsImNtZCIsImFyZ3MiLCJyZWNlaXZlIiwiY2FsbGJhY2siLCJzdGFydCIsImdldFN5bmNUaW1lIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxjQUFuQjtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQk1DLEk7OztBQUNKO0FBQ0Esa0JBQWM7QUFBQTs7QUFBQSxrSUFDTkQsVUFETTs7QUFHWixVQUFLRSxZQUFMLEdBQW9CQyxRQUFRQyxNQUFSLEVBQXBCOztBQUVBLFVBQUtDLEtBQUwsR0FBYSxxQkFBZSxZQUFNO0FBQ2hDLFVBQU1DLE9BQU9ILFFBQVFDLE1BQVIsQ0FBZSxNQUFLRixZQUFwQixDQUFiO0FBQ0EsYUFBT0ksS0FBSyxDQUFMLElBQVVBLEtBQUssQ0FBTCxJQUFVLElBQTNCO0FBQ0QsS0FIWSxDQUFiO0FBTFk7QUFTYjs7QUFFRDs7Ozs7NEJBQ1E7QUFDTjtBQUNEOztBQUVEOzs7OzRCQUNRQyxNLEVBQVE7QUFBQTs7QUFDZCxnSUFBY0EsTUFBZDs7QUFFQSxVQUFNQyxPQUFPLFNBQVBBLElBQU8sQ0FBQ0MsR0FBRDtBQUFBLDBDQUFTQyxJQUFUO0FBQVNBLGNBQVQ7QUFBQTs7QUFBQSxlQUFrQixPQUFLRixJQUFMLGdCQUFVRCxNQUFWLEVBQWtCRSxHQUFsQixTQUEwQkMsSUFBMUIsRUFBbEI7QUFBQSxPQUFiO0FBQ0EsVUFBTUMsVUFBVSxTQUFWQSxPQUFVLENBQUNGLEdBQUQsRUFBTUcsUUFBTjtBQUFBLGVBQW1CLE9BQUtELE9BQUwsQ0FBYUosTUFBYixFQUFxQkUsR0FBckIsRUFBMEJHLFFBQTFCLENBQW5CO0FBQUEsT0FBaEI7O0FBRUEsV0FBS1AsS0FBTCxDQUFXUSxLQUFYLENBQWlCTCxJQUFqQixFQUF1QkcsT0FBdkI7QUFDRDs7QUFFRDs7Ozs7OztrQ0FJYztBQUNaLGFBQU8sS0FBS04sS0FBTCxDQUFXUyxXQUFYLEVBQVA7QUFDRDs7Ozs7QUFHSCx5QkFBZUMsUUFBZixDQUF3QmYsVUFBeEIsRUFBb0NDLElBQXBDOztrQkFFZUEsSSIsImZpbGUiOiJTeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTeW5jTW9kdWxlIGZyb20gJ3N5bmMvc2VydmVyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnN5bmMnO1xuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdzeW5jJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgYWN0cyBhcyB0aGUgbWFzdGVyIGNsb2NrIHByb3ZpZGVyIGZvciB0aGUgY2xpZW50IHN5bmMgc2VydmljZSxcbiAqIGluIG9yZGVyIHRvIHN5bmNocm9uaXplIHRoZSBjbG9ja3Mgb2YgdGhlIGRpZmZlcmVudCBjbGllbnRzIHRvIGl0cyBvd24gY2xvY2suXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlN5bmN9Kl9fXG4gKlxuICogKipOb3RlOioqIHRoZSBzZXJ2aWNlIGlzIGJhc2VkIG9uIFtgZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luY2BdKGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luYykuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5zeW5jID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG4gKiAvLyB3aGVuIHRoZSBleHBlcmllbmNlIGhhcyBzdGFydGVkXG4gKiBjb25zdCBzeW5jVGltZSA9IHRoaXMuc3luYy5nZXRTeW5jVGltZSgpO1xuICovXG5jbGFzcyBTeW5jIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICB0aGlzLl9ocnRpbWVTdGFydCA9IHByb2Nlc3MuaHJ0aW1lKCk7XG5cbiAgICB0aGlzLl9zeW5jID0gbmV3IFN5bmNNb2R1bGUoKCkgPT4ge1xuICAgICAgY29uc3QgdGltZSA9IHByb2Nlc3MuaHJ0aW1lKHRoaXMuX2hydGltZVN0YXJ0KTtcbiAgICAgIHJldHVybiB0aW1lWzBdICsgdGltZVsxXSAqIDFlLTk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIGNvbnN0IHNlbmQgPSAoY21kLCAuLi5hcmdzKSA9PiB0aGlzLnNlbmQoY2xpZW50LCBjbWQsIC4uLmFyZ3MpO1xuICAgIGNvbnN0IHJlY2VpdmUgPSAoY21kLCBjYWxsYmFjaykgPT4gdGhpcy5yZWNlaXZlKGNsaWVudCwgY21kLCBjYWxsYmFjayk7XG5cbiAgICB0aGlzLl9zeW5jLnN0YXJ0KHNlbmQsIHJlY2VpdmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgdGltZSBpbiB0aGUgc3luYyBjbG9jaywgZGVyaXZlZCBmcm9tIGBwcm9jZXNzLmhydGltZSgpYC5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIEN1cnJlbnQgc3luYyB0aW1lIChpbiBfc2Vjb25kc18pLlxuICAgKi9cbiAgZ2V0U3luY1RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUoKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTeW5jKTtcblxuZXhwb3J0IGRlZmF1bHQgU3luYztcbiJdfQ==