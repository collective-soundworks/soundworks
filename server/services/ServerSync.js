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

var _ServerActivity2 = require('../core/ServerActivity');

var _ServerActivity3 = _interopRequireDefault(_ServerActivity2);

var _serverServiceManager = require('../core/serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

var _server = require('sync/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:sync';
/**
 * Synchronize the local clock on a master clock shared by the server and the clients.
 *
 * Both the clients and the server can use this master clock as a common time reference.
 * For instance, this allows all the clients to do something exactly at the same time, such as blinking the screen or playing a sound in a synchronized manner.
 *
 * **Note:** the module is based on [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * (See also {@link src/client/ClientSync.js~ClientSync} on the client side.)
 *
 * @example const sync = new ServerSync();
 *
 * const nowSync = sync.getSyncTime(); // current time in the sync clock time
 */

var ServerSync = function (_ServerActivity) {
  (0, _inherits3.default)(ServerSync, _ServerActivity);

  function ServerSync() {
    (0, _classCallCheck3.default)(this, ServerSync);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerSync).call(this, SERVICE_ID));
  }

  (0, _createClass3.default)(ServerSync, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerSync.prototype), 'start', this).call(this);

      this._hrtimeStart = process.hrtime();

      this._sync = new _server2.default(function () {
        var time = process.hrtime(_this2._hrtimeStart);
        return time[0] + time[1] * 1e-9;
      });
    }

    /**
     * @private
     */

  }, {
    key: 'connect',
    value: function connect(client) {
      var _this3 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerSync.prototype), 'connect', this).call(this, client);

      var send = function send(cmd) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return _this3.send.apply(_this3, [client, cmd].concat(args));
      };
      var receive = function receive(cmd, callback) {
        return _this3.receive(client, cmd, callback);
      };

      this._sync.start(send, receive);
    }

    /**
     * Returns the current time in the sync clock.
     * @return {Number} - Current sync time (in seconds).
     */

  }, {
    key: 'getSyncTime',
    value: function getSyncTime() {
      return this._sync.getSyncTime();
    }
  }]);
  return ServerSync;
}(_ServerActivity3.default);

_serverServiceManager2.default.register(SERVICE_ID, ServerSync);

exports.default = ServerSync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlclN5bmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLGFBQWEsY0FBYjs7Ozs7Ozs7Ozs7Ozs7OztJQWVBOzs7QUFDSixXQURJLFVBQ0osR0FBYzt3Q0FEVixZQUNVO3dGQURWLHVCQUVJLGFBRE07R0FBZDs7NkJBREk7OzRCQUtJOzs7QUFDTix1REFORSxnREFNRixDQURNOztBQUdOLFdBQUssWUFBTCxHQUFvQixRQUFRLE1BQVIsRUFBcEIsQ0FITTs7QUFLTixXQUFLLEtBQUwsR0FBYSxxQkFBZSxZQUFNO0FBQ2hDLFlBQU0sT0FBTyxRQUFRLE1BQVIsQ0FBZSxPQUFLLFlBQUwsQ0FBdEIsQ0FEMEI7QUFFaEMsZUFBTyxLQUFLLENBQUwsSUFBVSxLQUFLLENBQUwsSUFBVSxJQUFWLENBRmU7T0FBTixDQUE1QixDQUxNOzs7Ozs7Ozs7NEJBY0EsUUFBUTs7O0FBQ2QsdURBcEJFLG1EQW9CWSxPQUFkLENBRGM7O0FBR2QsVUFBTSxPQUFPLFNBQVAsSUFBTyxDQUFDLEdBQUQ7MENBQVM7Ozs7ZUFBUyxPQUFLLElBQUwsZ0JBQVUsUUFBUSxZQUFRLEtBQTFCO09BQWxCLENBSEM7QUFJZCxVQUFNLFVBQVUsU0FBVixPQUFVLENBQUMsR0FBRCxFQUFNLFFBQU47ZUFBbUIsT0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixHQUFyQixFQUEwQixRQUExQjtPQUFuQixDQUpGOztBQU1kLFdBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsSUFBakIsRUFBdUIsT0FBdkIsRUFOYzs7Ozs7Ozs7OztrQ0FhRjtBQUNaLGFBQU8sS0FBSyxLQUFMLENBQVcsV0FBWCxFQUFQLENBRFk7OztTQWhDVjs7O0FBcUNOLCtCQUFxQixRQUFyQixDQUE4QixVQUE5QixFQUEwQyxVQUExQzs7a0JBRWUiLCJmaWxlIjoiU2VydmVyU3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTeW5jU2VydmVyIGZyb20gJ3N5bmMvc2VydmVyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnN5bmMnO1xuLyoqXG4gKiBTeW5jaHJvbml6ZSB0aGUgbG9jYWwgY2xvY2sgb24gYSBtYXN0ZXIgY2xvY2sgc2hhcmVkIGJ5IHRoZSBzZXJ2ZXIgYW5kIHRoZSBjbGllbnRzLlxuICpcbiAqIEJvdGggdGhlIGNsaWVudHMgYW5kIHRoZSBzZXJ2ZXIgY2FuIHVzZSB0aGlzIG1hc3RlciBjbG9jayBhcyBhIGNvbW1vbiB0aW1lIHJlZmVyZW5jZS5cbiAqIEZvciBpbnN0YW5jZSwgdGhpcyBhbGxvd3MgYWxsIHRoZSBjbGllbnRzIHRvIGRvIHNvbWV0aGluZyBleGFjdGx5IGF0IHRoZSBzYW1lIHRpbWUsIHN1Y2ggYXMgYmxpbmtpbmcgdGhlIHNjcmVlbiBvciBwbGF5aW5nIGEgc291bmQgaW4gYSBzeW5jaHJvbml6ZWQgbWFubmVyLlxuICpcbiAqICoqTm90ZToqKiB0aGUgbW9kdWxlIGlzIGJhc2VkIG9uIFtgZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luY2BdKGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luYykuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudFN5bmMuanN+Q2xpZW50U3luY30gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSBjb25zdCBzeW5jID0gbmV3IFNlcnZlclN5bmMoKTtcbiAqXG4gKiBjb25zdCBub3dTeW5jID0gc3luYy5nZXRTeW5jVGltZSgpOyAvLyBjdXJyZW50IHRpbWUgaW4gdGhlIHN5bmMgY2xvY2sgdGltZVxuICovXG5jbGFzcyBTZXJ2ZXJTeW5jIGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLl9ocnRpbWVTdGFydCA9IHByb2Nlc3MuaHJ0aW1lKCk7XG5cbiAgICB0aGlzLl9zeW5jID0gbmV3IFN5bmNTZXJ2ZXIoKCkgPT4ge1xuICAgICAgY29uc3QgdGltZSA9IHByb2Nlc3MuaHJ0aW1lKHRoaXMuX2hydGltZVN0YXJ0KTtcbiAgICAgIHJldHVybiB0aW1lWzBdICsgdGltZVsxXSAqIDFlLTk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgY29uc3Qgc2VuZCA9IChjbWQsIC4uLmFyZ3MpID0+IHRoaXMuc2VuZChjbGllbnQsIGNtZCwgLi4uYXJncyk7XG4gICAgY29uc3QgcmVjZWl2ZSA9IChjbWQsIGNhbGxiYWNrKSA9PiB0aGlzLnJlY2VpdmUoY2xpZW50LCBjbWQsIGNhbGxiYWNrKTtcblxuICAgIHRoaXMuX3N5bmMuc3RhcnQoc2VuZCwgcmVjZWl2ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB0aW1lIGluIHRoZSBzeW5jIGNsb2NrLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gQ3VycmVudCBzeW5jIHRpbWUgKGluIHNlY29uZHMpLlxuICAgKi9cbiAgZ2V0U3luY1RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUoKTtcbiAgfVxufVxuXG5zZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTZXJ2ZXJTeW5jKTtcblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyU3luYztcbiJdfQ==