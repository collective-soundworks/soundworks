'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _syncServer = require('sync/server');

var _syncServer2 = _interopRequireDefault(_syncServer);

var _ServerModule2 = require('./ServerModule');

var _ServerModule3 = _interopRequireDefault(_ServerModule2);

/**
 * [server] Synchronize the local clock on a master clock shared by the server and the clients.
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

var ServerSync = (function (_ServerModule) {
  _inherits(ServerSync, _ServerModule);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [name='sync'] Name of the module.
   */

  function ServerSync() {
    var _this = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerSync);

    _get(Object.getPrototypeOf(ServerSync.prototype), 'constructor', this).call(this, options.name || 'sync');

    this._hrtimeStart = process.hrtime();

    this._sync = new _syncServer2['default'](function () {
      var time = process.hrtime(_this._hrtimeStart);
      return time[0] + time[1] * 1e-9;
    });
  }

  /**
   * @private
   * @todo ?
   */

  _createClass(ServerSync, [{
    key: 'connect',
    value: function connect(client) {
      var _this2 = this;

      _get(Object.getPrototypeOf(ServerSync.prototype), 'connect', this).call(this, client);

      var sendFunction = function sendFunction(cmd) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return _this2.send.apply(_this2, [client, cmd].concat(args));
      };
      var receiveFunction = function receiveFunction(cmd, callback) {
        return _this2.receive(client, cmd, callback);
      };

      this._sync.start(sendFunction, receiveFunction);
    }

    /**
     * Returns the current time in the sync clock.
     * @return {Number} Current sync time (in seconds).
     */
  }, {
    key: 'getSyncTime',
    value: function getSyncTime() {
      return this._sync.getSyncTime();
    }
  }]);

  return ServerSync;
})(_ServerModule3['default']);

exports['default'] = ServerSync;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyU3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUF1QixhQUFhOzs7OzZCQUNYLGdCQUFnQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWlCcEIsVUFBVTtZQUFWLFVBQVU7Ozs7Ozs7O0FBTWxCLFdBTlEsVUFBVSxHQU1IOzs7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQU5MLFVBQVU7O0FBTzNCLCtCQVBpQixVQUFVLDZDQU9yQixPQUFPLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRTs7QUFFOUIsUUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRXJDLFFBQUksQ0FBQyxLQUFLLEdBQUcsNEJBQWUsWUFBTTtBQUNoQyxVQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQUssWUFBWSxDQUFDLENBQUM7QUFDL0MsYUFBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztLQUNqQyxDQUFDLENBQUM7R0FDSjs7Ozs7OztlQWZrQixVQUFVOztXQXFCdEIsaUJBQUMsTUFBTSxFQUFFOzs7QUFDZCxpQ0F0QmlCLFVBQVUseUNBc0JiLE1BQU0sRUFBRTs7QUFFdEIsVUFBTSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQUksR0FBRzswQ0FBSyxJQUFJO0FBQUosY0FBSTs7O2VBQUssT0FBSyxJQUFJLE1BQUEsVUFBQyxNQUFNLEVBQUUsR0FBRyxTQUFLLElBQUksRUFBQztPQUFBLENBQUM7QUFDdkUsVUFBTSxlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFJLEdBQUcsRUFBRSxRQUFRO2VBQUssT0FBSyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUM7T0FBQSxDQUFDOztBQUUvRSxVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDLENBQUM7S0FDakQ7Ozs7Ozs7O1dBTVUsdUJBQUc7QUFDWixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDakM7OztTQXBDa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoic3JjL3NlcnZlci9TZXJ2ZXJTeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN5bmNTZXJ2ZXIgZnJvbSAnc3luYy9zZXJ2ZXInO1xuaW1wb3J0IFNlcnZlck1vZHVsZSBmcm9tICcuL1NlcnZlck1vZHVsZSc7XG5cblxuLyoqXG4gKiBbc2VydmVyXSBTeW5jaHJvbml6ZSB0aGUgbG9jYWwgY2xvY2sgb24gYSBtYXN0ZXIgY2xvY2sgc2hhcmVkIGJ5IHRoZSBzZXJ2ZXIgYW5kIHRoZSBjbGllbnRzLlxuICpcbiAqIEJvdGggdGhlIGNsaWVudHMgYW5kIHRoZSBzZXJ2ZXIgY2FuIHVzZSB0aGlzIG1hc3RlciBjbG9jayBhcyBhIGNvbW1vbiB0aW1lIHJlZmVyZW5jZS5cbiAqIEZvciBpbnN0YW5jZSwgdGhpcyBhbGxvd3MgYWxsIHRoZSBjbGllbnRzIHRvIGRvIHNvbWV0aGluZyBleGFjdGx5IGF0IHRoZSBzYW1lIHRpbWUsIHN1Y2ggYXMgYmxpbmtpbmcgdGhlIHNjcmVlbiBvciBwbGF5aW5nIGEgc291bmQgaW4gYSBzeW5jaHJvbml6ZWQgbWFubmVyLlxuICpcbiAqICoqTm90ZToqKiB0aGUgbW9kdWxlIGlzIGJhc2VkIG9uIFtgZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luY2BdKGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luYykuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudFN5bmMuanN+Q2xpZW50U3luY30gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSBjb25zdCBzeW5jID0gbmV3IFNlcnZlclN5bmMoKTtcbiAqXG4gKiBjb25zdCBub3dTeW5jID0gc3luYy5nZXRTeW5jVGltZSgpOyAvLyBjdXJyZW50IHRpbWUgaW4gdGhlIHN5bmMgY2xvY2sgdGltZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJTeW5jIGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZT0nc3luYyddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc3luYycpO1xuXG4gICAgdGhpcy5faHJ0aW1lU3RhcnQgPSBwcm9jZXNzLmhydGltZSgpO1xuXG4gICAgdGhpcy5fc3luYyA9IG5ldyBTeW5jU2VydmVyKCgpID0+IHtcbiAgICAgIGNvbnN0IHRpbWUgPSBwcm9jZXNzLmhydGltZSh0aGlzLl9ocnRpbWVTdGFydCk7XG4gICAgICByZXR1cm4gdGltZVswXSArIHRpbWVbMV0gKiAxZS05O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0b2RvID9cbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgY29uc3Qgc2VuZEZ1bmN0aW9uID0gKGNtZCwgLi4uYXJncykgPT4gdGhpcy5zZW5kKGNsaWVudCwgY21kLCAuLi5hcmdzKTtcbiAgICBjb25zdCByZWNlaXZlRnVuY3Rpb24gPSAoY21kLCBjYWxsYmFjaykgPT4gdGhpcy5yZWNlaXZlKGNsaWVudCwgY21kLCBjYWxsYmFjayk7XG5cbiAgICB0aGlzLl9zeW5jLnN0YXJ0KHNlbmRGdW5jdGlvbiwgcmVjZWl2ZUZ1bmN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHRpbWUgaW4gdGhlIHN5bmMgY2xvY2suXG4gICAqIEByZXR1cm4ge051bWJlcn0gQ3VycmVudCBzeW5jIHRpbWUgKGluIHNlY29uZHMpLlxuICAgKi9cbiAgZ2V0U3luY1RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUoKTtcbiAgfVxufVxuIl19