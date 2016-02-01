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

var _corePier = require('../core/Pier');

var _corePier2 = _interopRequireDefault(_corePier);

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

var ServerSync = (function (_Pier) {
  _inherits(ServerSync, _Pier);

  function ServerSync() {
    var _this = this;

    _classCallCheck(this, ServerSync);

    _get(Object.getPrototypeOf(ServerSync.prototype), 'constructor', this).call(this, 'service:sync');

    this._hrtimeStart = process.hrtime();

    this._sync = new _syncServer2['default'](function () {
      var time = process.hrtime(_this._hrtimeStart);
      return time[0] + time[1] * 1e-9;
    });
  }

  /**
   * @private
   */

  _createClass(ServerSync, [{
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
})(_corePier2['default']);

exports['default'] = ServerSync;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyU3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUF1QixhQUFhOzs7O3dCQUNuQixjQUFjOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaUJWLFVBQVU7WUFBVixVQUFVOztBQUNsQixXQURRLFVBQVUsR0FDZjs7OzBCQURLLFVBQVU7O0FBRTNCLCtCQUZpQixVQUFVLDZDQUVyQixjQUFjLEVBQUU7O0FBRXRCLFFBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUVyQyxRQUFJLENBQUMsS0FBSyxHQUFHLDRCQUFlLFlBQU07QUFDaEMsVUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFLLFlBQVksQ0FBQyxDQUFDO0FBQy9DLGFBQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7S0FDakMsQ0FBQyxDQUFDO0dBQ0o7Ozs7OztlQVZrQixVQUFVOztXQWV0QixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQWhCaUIsVUFBVSx5Q0FnQmIsTUFBTSxFQUFFOztBQUV0QixVQUFNLElBQUksR0FBRyxTQUFQLElBQUksQ0FBSSxHQUFHOzBDQUFLLElBQUk7QUFBSixjQUFJOzs7ZUFBSyxPQUFLLElBQUksTUFBQSxVQUFDLE1BQU0sRUFBRSxHQUFHLFNBQUssSUFBSSxFQUFDO09BQUEsQ0FBQztBQUMvRCxVQUFNLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBSSxHQUFHLEVBQUUsUUFBUTtlQUFLLE9BQUssT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDO09BQUEsQ0FBQzs7QUFFdkUsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ2pDOzs7Ozs7OztXQU1VLHVCQUFHO0FBQ1osYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ2pDOzs7U0E5QmtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6InNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyU3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTeW5jU2VydmVyIGZyb20gJ3N5bmMvc2VydmVyJztcbmltcG9ydCBQaWVyIGZyb20gJy4uL2NvcmUvUGllcic7XG5cblxuLyoqXG4gKiBTeW5jaHJvbml6ZSB0aGUgbG9jYWwgY2xvY2sgb24gYSBtYXN0ZXIgY2xvY2sgc2hhcmVkIGJ5IHRoZSBzZXJ2ZXIgYW5kIHRoZSBjbGllbnRzLlxuICpcbiAqIEJvdGggdGhlIGNsaWVudHMgYW5kIHRoZSBzZXJ2ZXIgY2FuIHVzZSB0aGlzIG1hc3RlciBjbG9jayBhcyBhIGNvbW1vbiB0aW1lIHJlZmVyZW5jZS5cbiAqIEZvciBpbnN0YW5jZSwgdGhpcyBhbGxvd3MgYWxsIHRoZSBjbGllbnRzIHRvIGRvIHNvbWV0aGluZyBleGFjdGx5IGF0IHRoZSBzYW1lIHRpbWUsIHN1Y2ggYXMgYmxpbmtpbmcgdGhlIHNjcmVlbiBvciBwbGF5aW5nIGEgc291bmQgaW4gYSBzeW5jaHJvbml6ZWQgbWFubmVyLlxuICpcbiAqICoqTm90ZToqKiB0aGUgbW9kdWxlIGlzIGJhc2VkIG9uIFtgZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luY2BdKGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luYykuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudFN5bmMuanN+Q2xpZW50U3luY30gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSBjb25zdCBzeW5jID0gbmV3IFNlcnZlclN5bmMoKTtcbiAqXG4gKiBjb25zdCBub3dTeW5jID0gc3luYy5nZXRTeW5jVGltZSgpOyAvLyBjdXJyZW50IHRpbWUgaW4gdGhlIHN5bmMgY2xvY2sgdGltZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJTeW5jIGV4dGVuZHMgUGllciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCdzZXJ2aWNlOnN5bmMnKTtcblxuICAgIHRoaXMuX2hydGltZVN0YXJ0ID0gcHJvY2Vzcy5ocnRpbWUoKTtcblxuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY1NlcnZlcigoKSA9PiB7XG4gICAgICBjb25zdCB0aW1lID0gcHJvY2Vzcy5ocnRpbWUodGhpcy5faHJ0aW1lU3RhcnQpO1xuICAgICAgcmV0dXJuIHRpbWVbMF0gKyB0aW1lWzFdICogMWUtOTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICBjb25zdCBzZW5kID0gKGNtZCwgLi4uYXJncykgPT4gdGhpcy5zZW5kKGNsaWVudCwgY21kLCAuLi5hcmdzKTtcbiAgICBjb25zdCByZWNlaXZlID0gKGNtZCwgY2FsbGJhY2spID0+IHRoaXMucmVjZWl2ZShjbGllbnQsIGNtZCwgY2FsbGJhY2spO1xuXG4gICAgdGhpcy5fc3luYy5zdGFydChzZW5kLCByZWNlaXZlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHRpbWUgaW4gdGhlIHN5bmMgY2xvY2suXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBDdXJyZW50IHN5bmMgdGltZSAoaW4gc2Vjb25kcykuXG4gICAqL1xuICBnZXRTeW5jVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZSgpO1xuICB9XG59XG4iXX0=