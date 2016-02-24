'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreServerActivity = require('../core/ServerActivity');

var _coreServerActivity2 = _interopRequireDefault(_coreServerActivity);

var _coreServerServiceManager = require('../core/serverServiceManager');

var _coreServerServiceManager2 = _interopRequireDefault(_coreServerServiceManager);

var _syncServer = require('sync/server');

var _syncServer2 = _interopRequireDefault(_syncServer);

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

var ServerSync = (function (_ServerActivity) {
  _inherits(ServerSync, _ServerActivity);

  function ServerSync() {
    _classCallCheck(this, ServerSync);

    _get(Object.getPrototypeOf(ServerSync.prototype), 'constructor', this).call(this, SERVICE_ID);
  }

  _createClass(ServerSync, [{
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(ServerSync.prototype), 'start', this).call(this);

      this._hrtimeStart = process.hrtime();

      this._sync = new _syncServer2['default'](function () {
        var time = process.hrtime(_this._hrtimeStart);
        return time[0] + time[1] * 1e-9;
      });
    }

    /**
     * @private
     */
  }, {
    key: 'connect',
    value: function connect(client) {
      var _this2 = this;

      _get(Object.getPrototypeOf(ServerSync.prototype), 'connect', this).call(this, client);

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
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerSync);

exports['default'] = ServerSync;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlclN5bmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztrQ0FBMkIsd0JBQXdCOzs7O3dDQUNsQiw4QkFBOEI7Ozs7MEJBQ3hDLGFBQWE7Ozs7QUFFcEMsSUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0lBZTVCLFVBQVU7WUFBVixVQUFVOztBQUNILFdBRFAsVUFBVSxHQUNBOzBCQURWLFVBQVU7O0FBRVosK0JBRkUsVUFBVSw2Q0FFTixVQUFVLEVBQUU7R0FDbkI7O2VBSEcsVUFBVTs7V0FLVCxpQkFBRzs7O0FBQ04saUNBTkUsVUFBVSx1Q0FNRTs7QUFFZCxVQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFckMsVUFBSSxDQUFDLEtBQUssR0FBRyw0QkFBZSxZQUFNO0FBQ2hDLFlBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBSyxZQUFZLENBQUMsQ0FBQztBQUMvQyxlQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO09BQ2pDLENBQUMsQ0FBQztLQUNKOzs7Ozs7O1dBS00saUJBQUMsTUFBTSxFQUFFOzs7QUFDZCxpQ0FwQkUsVUFBVSx5Q0FvQkUsTUFBTSxFQUFFOztBQUV0QixVQUFNLElBQUksR0FBRyxTQUFQLElBQUksQ0FBSSxHQUFHOzBDQUFLLElBQUk7QUFBSixjQUFJOzs7ZUFBSyxPQUFLLElBQUksTUFBQSxVQUFDLE1BQU0sRUFBRSxHQUFHLFNBQUssSUFBSSxFQUFDO09BQUEsQ0FBQztBQUMvRCxVQUFNLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBSSxHQUFHLEVBQUUsUUFBUTtlQUFLLE9BQUssT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDO09BQUEsQ0FBQzs7QUFFdkUsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ2pDOzs7Ozs7OztXQU1VLHVCQUFHO0FBQ1osYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ2pDOzs7U0FsQ0csVUFBVTs7O0FBcUNoQixzQ0FBcUIsUUFBUSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQzs7cUJBRXZDLFVBQVUiLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyU3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTeW5jU2VydmVyIGZyb20gJ3N5bmMvc2VydmVyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnN5bmMnO1xuLyoqXG4gKiBTeW5jaHJvbml6ZSB0aGUgbG9jYWwgY2xvY2sgb24gYSBtYXN0ZXIgY2xvY2sgc2hhcmVkIGJ5IHRoZSBzZXJ2ZXIgYW5kIHRoZSBjbGllbnRzLlxuICpcbiAqIEJvdGggdGhlIGNsaWVudHMgYW5kIHRoZSBzZXJ2ZXIgY2FuIHVzZSB0aGlzIG1hc3RlciBjbG9jayBhcyBhIGNvbW1vbiB0aW1lIHJlZmVyZW5jZS5cbiAqIEZvciBpbnN0YW5jZSwgdGhpcyBhbGxvd3MgYWxsIHRoZSBjbGllbnRzIHRvIGRvIHNvbWV0aGluZyBleGFjdGx5IGF0IHRoZSBzYW1lIHRpbWUsIHN1Y2ggYXMgYmxpbmtpbmcgdGhlIHNjcmVlbiBvciBwbGF5aW5nIGEgc291bmQgaW4gYSBzeW5jaHJvbml6ZWQgbWFubmVyLlxuICpcbiAqICoqTm90ZToqKiB0aGUgbW9kdWxlIGlzIGJhc2VkIG9uIFtgZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luY2BdKGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luYykuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudFN5bmMuanN+Q2xpZW50U3luY30gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSBjb25zdCBzeW5jID0gbmV3IFNlcnZlclN5bmMoKTtcbiAqXG4gKiBjb25zdCBub3dTeW5jID0gc3luYy5nZXRTeW5jVGltZSgpOyAvLyBjdXJyZW50IHRpbWUgaW4gdGhlIHN5bmMgY2xvY2sgdGltZVxuICovXG5jbGFzcyBTZXJ2ZXJTeW5jIGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLl9ocnRpbWVTdGFydCA9IHByb2Nlc3MuaHJ0aW1lKCk7XG5cbiAgICB0aGlzLl9zeW5jID0gbmV3IFN5bmNTZXJ2ZXIoKCkgPT4ge1xuICAgICAgY29uc3QgdGltZSA9IHByb2Nlc3MuaHJ0aW1lKHRoaXMuX2hydGltZVN0YXJ0KTtcbiAgICAgIHJldHVybiB0aW1lWzBdICsgdGltZVsxXSAqIDFlLTk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgY29uc3Qgc2VuZCA9IChjbWQsIC4uLmFyZ3MpID0+IHRoaXMuc2VuZChjbGllbnQsIGNtZCwgLi4uYXJncyk7XG4gICAgY29uc3QgcmVjZWl2ZSA9IChjbWQsIGNhbGxiYWNrKSA9PiB0aGlzLnJlY2VpdmUoY2xpZW50LCBjbWQsIGNhbGxiYWNrKTtcblxuICAgIHRoaXMuX3N5bmMuc3RhcnQoc2VuZCwgcmVjZWl2ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB0aW1lIGluIHRoZSBzeW5jIGNsb2NrLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gQ3VycmVudCBzeW5jIHRpbWUgKGluIHNlY29uZHMpLlxuICAgKi9cbiAgZ2V0U3luY1RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUoKTtcbiAgfVxufVxuXG5zZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTZXJ2ZXJTeW5jKTtcblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyU3luYztcbiJdfQ==