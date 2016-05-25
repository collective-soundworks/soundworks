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
 * Interface of the server `'sync'` service.
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

var Sync = function (_Activity) {
  (0, _inherits3.default)(Sync, _Activity);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Sync() {
    (0, _classCallCheck3.default)(this, Sync);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Sync).call(this, SERVICE_ID));

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
      (0, _get3.default)((0, _getPrototypeOf2.default)(Sync.prototype), 'start', this).call(this);
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(Sync.prototype), 'connect', this).call(this, client);

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
     * Returns the current time in the sync clock, devired from `process.hrtime()`.
     * @return {Number} - Current sync time (in _seconds_).
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLGFBQWEsY0FBbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFrQk0sSTs7Ozs7QUFFSixrQkFBYztBQUFBOztBQUFBLDhHQUNOLFVBRE07O0FBR1osVUFBSyxZQUFMLEdBQW9CLFFBQVEsTUFBUixFQUFwQjs7QUFFQSxVQUFLLEtBQUwsR0FBYSxxQkFBZSxZQUFNO0FBQ2hDLFVBQU0sT0FBTyxRQUFRLE1BQVIsQ0FBZSxNQUFLLFlBQXBCLENBQWI7QUFDQSxhQUFPLEtBQUssQ0FBTCxJQUFVLEtBQUssQ0FBTCxJQUFVLElBQTNCO0FBQ0QsS0FIWSxDQUFiO0FBTFk7QUFTYjs7Ozs7Ozs0QkFHTztBQUNOO0FBQ0Q7Ozs7Ozs0QkFHTyxNLEVBQVE7QUFBQTs7QUFDZCxvR0FBYyxNQUFkOztBQUVBLFVBQU0sT0FBTyxTQUFQLElBQU8sQ0FBQyxHQUFEO0FBQUEsMENBQVMsSUFBVDtBQUFTLGNBQVQ7QUFBQTs7QUFBQSxlQUFrQixPQUFLLElBQUwsZ0JBQVUsTUFBVixFQUFrQixHQUFsQixTQUEwQixJQUExQixFQUFsQjtBQUFBLE9BQWI7QUFDQSxVQUFNLFVBQVUsU0FBVixPQUFVLENBQUMsR0FBRCxFQUFNLFFBQU47QUFBQSxlQUFtQixPQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLEdBQXJCLEVBQTBCLFFBQTFCLENBQW5CO0FBQUEsT0FBaEI7O0FBRUEsV0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixJQUFqQixFQUF1QixPQUF2QjtBQUNEOzs7Ozs7Ozs7a0NBTWE7QUFDWixhQUFPLEtBQUssS0FBTCxDQUFXLFdBQVgsRUFBUDtBQUNEOzs7OztBQUdILHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsSUFBcEM7O2tCQUVlLEkiLCJmaWxlIjoiU3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuLi9jb3JlL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTeW5jTW9kdWxlIGZyb20gJ3N5bmMvc2VydmVyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnN5bmMnO1xuLyoqXG4gKiBJbnRlcmZhY2Ugb2YgdGhlIHNlcnZlciBgJ3N5bmMnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhY3RzIGFzIHRoZSBtYXN0ZXIgY2xvY2sgcHJvdmlkZXIgZm9yIHRoZSBjbGllbnQgc3luYyBzZXJ2aWNlLFxuICogaW4gb3JkZXIgdG8gc3luY2hyb25pemUgdGhlIGNsb2NrcyBvZiB0aGUgZGlmZmVyZW50IGNsaWVudHMgdG8gaXRzIG93biBjbG9jay5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU3luY30qX19cbiAqXG4gKiAqKk5vdGU6KiogdGhlIHNlcnZpY2UgaXMgYmFzZWQgb24gW2BnaXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jYF0oaHR0cHM6Ly9naXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jKS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnN5bmMgPSB0aGlzLnJlcXVpcmUoJ3N5bmMnKTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWRcbiAqIGNvbnN0IHN5bmNUaW1lID0gdGhpcy5zeW5jLmdldFN5bmNUaW1lKCk7XG4gKi9cbmNsYXNzIFN5bmMgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICB0aGlzLl9ocnRpbWVTdGFydCA9IHByb2Nlc3MuaHJ0aW1lKCk7XG5cbiAgICB0aGlzLl9zeW5jID0gbmV3IFN5bmNNb2R1bGUoKCkgPT4ge1xuICAgICAgY29uc3QgdGltZSA9IHByb2Nlc3MuaHJ0aW1lKHRoaXMuX2hydGltZVN0YXJ0KTtcbiAgICAgIHJldHVybiB0aW1lWzBdICsgdGltZVsxXSAqIDFlLTk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIGNvbnN0IHNlbmQgPSAoY21kLCAuLi5hcmdzKSA9PiB0aGlzLnNlbmQoY2xpZW50LCBjbWQsIC4uLmFyZ3MpO1xuICAgIGNvbnN0IHJlY2VpdmUgPSAoY21kLCBjYWxsYmFjaykgPT4gdGhpcy5yZWNlaXZlKGNsaWVudCwgY21kLCBjYWxsYmFjayk7XG5cbiAgICB0aGlzLl9zeW5jLnN0YXJ0KHNlbmQsIHJlY2VpdmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgdGltZSBpbiB0aGUgc3luYyBjbG9jaywgZGV2aXJlZCBmcm9tIGBwcm9jZXNzLmhydGltZSgpYC5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIEN1cnJlbnQgc3luYyB0aW1lIChpbiBfc2Vjb25kc18pLlxuICAgKi9cbiAgZ2V0U3luY1RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUoKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTeW5jKTtcblxuZXhwb3J0IGRlZmF1bHQgU3luYztcbiJdfQ==