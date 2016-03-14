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

var _Activity2 = require('../core/Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

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
 * **Note:** the service is based on [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * (See also {@link src/client/ClientSync.js~ClientSync} on the client side.)
 *
 * @example const sync = new Sync();
 *
 * const nowSync = sync.getSyncTime(); // current time in the sync clock time
 */

var Sync = function (_Activity) {
  (0, _inherits3.default)(Sync, _Activity);

  function Sync() {
    (0, _classCallCheck3.default)(this, Sync);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Sync).call(this, SERVICE_ID));
  }

  (0, _createClass3.default)(Sync, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(Sync.prototype), 'start', this).call(this);

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

      (0, _get3.default)((0, _getPrototypeOf2.default)(Sync.prototype), 'connect', this).call(this, client);

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
  return Sync;
}(_Activity3.default);

_serviceManager2.default.register(SERVICE_ID, Sync);

exports.default = Sync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLGFBQWEsY0FBYjs7Ozs7Ozs7Ozs7Ozs7OztJQWVBOzs7QUFDSixXQURJLElBQ0osR0FBYzt3Q0FEVixNQUNVO3dGQURWLGlCQUVJLGFBRE07R0FBZDs7NkJBREk7OzRCQUtJOzs7QUFDTix1REFORSwwQ0FNRixDQURNOztBQUdOLFdBQUssWUFBTCxHQUFvQixRQUFRLE1BQVIsRUFBcEIsQ0FITTs7QUFLTixXQUFLLEtBQUwsR0FBYSxxQkFBZSxZQUFNO0FBQ2hDLFlBQU0sT0FBTyxRQUFRLE1BQVIsQ0FBZSxPQUFLLFlBQUwsQ0FBdEIsQ0FEMEI7QUFFaEMsZUFBTyxLQUFLLENBQUwsSUFBVSxLQUFLLENBQUwsSUFBVSxJQUFWLENBRmU7T0FBTixDQUE1QixDQUxNOzs7Ozs7Ozs7NEJBY0EsUUFBUTs7O0FBQ2QsdURBcEJFLDZDQW9CWSxPQUFkLENBRGM7O0FBR2QsVUFBTSxPQUFPLFNBQVAsSUFBTyxDQUFDLEdBQUQ7MENBQVM7Ozs7ZUFBUyxPQUFLLElBQUwsZ0JBQVUsUUFBUSxZQUFRLEtBQTFCO09BQWxCLENBSEM7QUFJZCxVQUFNLFVBQVUsU0FBVixPQUFVLENBQUMsR0FBRCxFQUFNLFFBQU47ZUFBbUIsT0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixHQUFyQixFQUEwQixRQUExQjtPQUFuQixDQUpGOztBQU1kLFdBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsSUFBakIsRUFBdUIsT0FBdkIsRUFOYzs7Ozs7Ozs7OztrQ0FhRjtBQUNaLGFBQU8sS0FBSyxLQUFMLENBQVcsV0FBWCxFQUFQLENBRFk7OztTQWhDVjs7O0FBcUNOLHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsSUFBcEM7O2tCQUVlIiwiZmlsZSI6IlN5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU3luY01vZHVsZSBmcm9tICdzeW5jL3NlcnZlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzeW5jJztcbi8qKlxuICogU3luY2hyb25pemUgdGhlIGxvY2FsIGNsb2NrIG9uIGEgbWFzdGVyIGNsb2NrIHNoYXJlZCBieSB0aGUgc2VydmVyIGFuZCB0aGUgY2xpZW50cy5cbiAqXG4gKiBCb3RoIHRoZSBjbGllbnRzIGFuZCB0aGUgc2VydmVyIGNhbiB1c2UgdGhpcyBtYXN0ZXIgY2xvY2sgYXMgYSBjb21tb24gdGltZSByZWZlcmVuY2UuXG4gKiBGb3IgaW5zdGFuY2UsIHRoaXMgYWxsb3dzIGFsbCB0aGUgY2xpZW50cyB0byBkbyBzb21ldGhpbmcgZXhhY3RseSBhdCB0aGUgc2FtZSB0aW1lLCBzdWNoIGFzIGJsaW5raW5nIHRoZSBzY3JlZW4gb3IgcGxheWluZyBhIHNvdW5kIGluIGEgc3luY2hyb25pemVkIG1hbm5lci5cbiAqXG4gKiAqKk5vdGU6KiogdGhlIHNlcnZpY2UgaXMgYmFzZWQgb24gW2BnaXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jYF0oaHR0cHM6Ly9naXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jKS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50U3luYy5qc35DbGllbnRTeW5jfSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICpcbiAqIEBleGFtcGxlIGNvbnN0IHN5bmMgPSBuZXcgU3luYygpO1xuICpcbiAqIGNvbnN0IG5vd1N5bmMgPSBzeW5jLmdldFN5bmNUaW1lKCk7IC8vIGN1cnJlbnQgdGltZSBpbiB0aGUgc3luYyBjbG9jayB0aW1lXG4gKi9cbmNsYXNzIFN5bmMgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuX2hydGltZVN0YXJ0ID0gcHJvY2Vzcy5ocnRpbWUoKTtcblxuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY01vZHVsZSgoKSA9PiB7XG4gICAgICBjb25zdCB0aW1lID0gcHJvY2Vzcy5ocnRpbWUodGhpcy5faHJ0aW1lU3RhcnQpO1xuICAgICAgcmV0dXJuIHRpbWVbMF0gKyB0aW1lWzFdICogMWUtOTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICBjb25zdCBzZW5kID0gKGNtZCwgLi4uYXJncykgPT4gdGhpcy5zZW5kKGNsaWVudCwgY21kLCAuLi5hcmdzKTtcbiAgICBjb25zdCByZWNlaXZlID0gKGNtZCwgY2FsbGJhY2spID0+IHRoaXMucmVjZWl2ZShjbGllbnQsIGNtZCwgY2FsbGJhY2spO1xuXG4gICAgdGhpcy5fc3luYy5zdGFydChzZW5kLCByZWNlaXZlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHRpbWUgaW4gdGhlIHN5bmMgY2xvY2suXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBDdXJyZW50IHN5bmMgdGltZSAoaW4gc2Vjb25kcykuXG4gICAqL1xuICBnZXRTeW5jVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFN5bmMpO1xuXG5leHBvcnQgZGVmYXVsdCBTeW5jO1xuIl19