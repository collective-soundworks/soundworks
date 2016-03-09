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

console.log(_ServerActivity3.default);


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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlclN5bmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7QUFGQSxRQUFRLEdBQVI7OztBQUlBLElBQU0sYUFBYSxjQUFiOzs7Ozs7Ozs7Ozs7Ozs7O0lBZUE7OztBQUNKLFdBREksVUFDSixHQUFjO3dDQURWLFlBQ1U7d0ZBRFYsdUJBRUksYUFETTtHQUFkOzs2QkFESTs7NEJBS0k7OztBQUNOLHVEQU5FLGdEQU1GLENBRE07O0FBR04sV0FBSyxZQUFMLEdBQW9CLFFBQVEsTUFBUixFQUFwQixDQUhNOztBQUtOLFdBQUssS0FBTCxHQUFhLHFCQUFlLFlBQU07QUFDaEMsWUFBTSxPQUFPLFFBQVEsTUFBUixDQUFlLE9BQUssWUFBTCxDQUF0QixDQUQwQjtBQUVoQyxlQUFPLEtBQUssQ0FBTCxJQUFVLEtBQUssQ0FBTCxJQUFVLElBQVYsQ0FGZTtPQUFOLENBQTVCLENBTE07Ozs7Ozs7Ozs0QkFjQSxRQUFROzs7QUFDZCx1REFwQkUsbURBb0JZLE9BQWQsQ0FEYzs7QUFHZCxVQUFNLE9BQU8sU0FBUCxJQUFPLENBQUMsR0FBRDswQ0FBUzs7OztlQUFTLE9BQUssSUFBTCxnQkFBVSxRQUFRLFlBQVEsS0FBMUI7T0FBbEIsQ0FIQztBQUlkLFVBQU0sVUFBVSxTQUFWLE9BQVUsQ0FBQyxHQUFELEVBQU0sUUFBTjtlQUFtQixPQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLEdBQXJCLEVBQTBCLFFBQTFCO09BQW5CLENBSkY7O0FBTWQsV0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixJQUFqQixFQUF1QixPQUF2QixFQU5jOzs7Ozs7Ozs7O2tDQWFGO0FBQ1osYUFBTyxLQUFLLEtBQUwsQ0FBVyxXQUFYLEVBQVAsQ0FEWTs7O1NBaENWOzs7QUFxQ04sK0JBQXFCLFFBQXJCLENBQThCLFVBQTlCLEVBQTBDLFVBQTFDOztrQkFFZSIsImZpbGUiOiJTZXJ2ZXJTeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuY29uc29sZS5sb2coU2VydmVyQWN0aXZpdHkpO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFN5bmNTZXJ2ZXIgZnJvbSAnc3luYy9zZXJ2ZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c3luYyc7XG4vKipcbiAqIFN5bmNocm9uaXplIHRoZSBsb2NhbCBjbG9jayBvbiBhIG1hc3RlciBjbG9jayBzaGFyZWQgYnkgdGhlIHNlcnZlciBhbmQgdGhlIGNsaWVudHMuXG4gKlxuICogQm90aCB0aGUgY2xpZW50cyBhbmQgdGhlIHNlcnZlciBjYW4gdXNlIHRoaXMgbWFzdGVyIGNsb2NrIGFzIGEgY29tbW9uIHRpbWUgcmVmZXJlbmNlLlxuICogRm9yIGluc3RhbmNlLCB0aGlzIGFsbG93cyBhbGwgdGhlIGNsaWVudHMgdG8gZG8gc29tZXRoaW5nIGV4YWN0bHkgYXQgdGhlIHNhbWUgdGltZSwgc3VjaCBhcyBibGlua2luZyB0aGUgc2NyZWVuIG9yIHBsYXlpbmcgYSBzb3VuZCBpbiBhIHN5bmNocm9uaXplZCBtYW5uZXIuXG4gKlxuICogKipOb3RlOioqIHRoZSBtb2R1bGUgaXMgYmFzZWQgb24gW2BnaXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jYF0oaHR0cHM6Ly9naXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jKS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50U3luYy5qc35DbGllbnRTeW5jfSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICpcbiAqIEBleGFtcGxlIGNvbnN0IHN5bmMgPSBuZXcgU2VydmVyU3luYygpO1xuICpcbiAqIGNvbnN0IG5vd1N5bmMgPSBzeW5jLmdldFN5bmNUaW1lKCk7IC8vIGN1cnJlbnQgdGltZSBpbiB0aGUgc3luYyBjbG9jayB0aW1lXG4gKi9cbmNsYXNzIFNlcnZlclN5bmMgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuX2hydGltZVN0YXJ0ID0gcHJvY2Vzcy5ocnRpbWUoKTtcblxuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY1NlcnZlcigoKSA9PiB7XG4gICAgICBjb25zdCB0aW1lID0gcHJvY2Vzcy5ocnRpbWUodGhpcy5faHJ0aW1lU3RhcnQpO1xuICAgICAgcmV0dXJuIHRpbWVbMF0gKyB0aW1lWzFdICogMWUtOTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICBjb25zdCBzZW5kID0gKGNtZCwgLi4uYXJncykgPT4gdGhpcy5zZW5kKGNsaWVudCwgY21kLCAuLi5hcmdzKTtcbiAgICBjb25zdCByZWNlaXZlID0gKGNtZCwgY2FsbGJhY2spID0+IHRoaXMucmVjZWl2ZShjbGllbnQsIGNtZCwgY2FsbGJhY2spO1xuXG4gICAgdGhpcy5fc3luYy5zdGFydChzZW5kLCByZWNlaXZlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHRpbWUgaW4gdGhlIHN5bmMgY2xvY2suXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBDdXJyZW50IHN5bmMgdGltZSAoaW4gc2Vjb25kcykuXG4gICAqL1xuICBnZXRTeW5jVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZSgpO1xuICB9XG59XG5cbnNlcnZlclNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNlcnZlclN5bmMpO1xuXG5leHBvcnQgZGVmYXVsdCBTZXJ2ZXJTeW5jO1xuIl19