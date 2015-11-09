'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wavesAudio = require('waves-audio');

var _syncClient = require('sync/client');

var _syncClient2 = _interopRequireDefault(_syncClient);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

/**
 * The {@link Sync} module takes care of the synchronization process on the client side.
 * It displays "Clock syncing, stand by…" until the very first synchronization process is done.
 * The {@link Sync} module calls its `done` method as soon as the client clock is in sync with the sync clock.
 * Then, the synchronization process keeps running in the background to resynchronize the clocks from times to times.
 * @example
 * // Require the Soundworks library (client side)
 * const clientSide = require('soundworks/client'); // TODO
 *
 * // Create Sync module
 * const sync = new clientSide.Sync();
 *
 * // Get times
 * const nowLocal = sync.getLocalTime(); // current time in local clock time
 * const nowSync = sync.getSyncTime(); // current time in sync clock time
 */

var Sync = (function (_Module) {
  _inherits(Sync, _Module);

  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='sync'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   */

  function Sync() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Sync);

    _get(Object.getPrototypeOf(Sync.prototype), 'constructor', this).call(this, options.name || 'sync', true, options.color || 'black');

    this._ready = false;
    this._sync = new _syncClient2['default'](function () {
      return _wavesAudio.audioContext.currentTime;
    });

    this.setCenteredViewContent('<p class="soft-blink">Clock syncing, stand by&hellip;</p>');
  }

  /**
   * Starts the synchronization process.
   */

  _createClass(Sync, [{
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(Sync.prototype), 'start', this).call(this);
      this._sync.start(_client2['default'].send, _client2['default'].receive, function (status, report) {
        _this._syncStatusReport(status, report);
      });
    }
  }, {
    key: 'restart',
    value: function restart() {}
    // TODO

    /**
     * Returns the time in the local clock.
     * If no arguments are provided, returns the current local time (*i.e.* `audioContext.currentTime`).
     * @param {Number} syncTime Time in the sync clock (in seconds).
     * @return {Number} Time in the local clock corresponding to `syncTime` (in seconds).
     * @todo add optional argument?
     */

  }, {
    key: 'getLocalTime',
    value: function getLocalTime(syncTime) {
      return this._sync.getLocalTime(syncTime);
    }

    /**
     * Returns the time in the sync clock.
     * If no arguments are provided, returns the current sync time.
     * @param {Number} localTime Time in the local clock (in seconds).
     * @return {Number} Time in the sync clock corresponding to `localTime` (in seconds)
     * @todo add optional argument?
     */
  }, {
    key: 'getSyncTime',
    value: function getSyncTime(localTime) {
      return this._sync.getSyncTime(localTime);
    }
  }, {
    key: '_syncStatusReport',
    value: function _syncStatusReport(message, report) {
      if (message === 'sync:status') {
        if (report.status === 'training' || report.status === 'sync') {
          if (!this._ready) {
            this._ready = true;
            this.done();
          }
        }
        this.emit('sync:status', report);
      }
    }
  }]);

  return Sync;
})(_Module3['default']);

exports['default'] = Sync;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOzswQkFDbkIsYUFBYTs7OztzQkFDakIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFtQlIsSUFBSTtZQUFKLElBQUk7Ozs7Ozs7OztBQU9aLFdBUFEsSUFBSSxHQU9HO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFQTCxJQUFJOztBQVFyQiwrQkFSaUIsSUFBSSw2Q0FRZixPQUFPLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLEVBQUU7O0FBRTlELFFBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxLQUFLLEdBQUcsNEJBQWU7YUFBTSx5QkFBYSxXQUFXO0tBQUEsQ0FBQyxDQUFDOztBQUU1RCxRQUFJLENBQUMsc0JBQXNCLENBQUMsMkRBQTJELENBQUMsQ0FBQztHQUMxRjs7Ozs7O2VBZGtCLElBQUk7O1dBbUJsQixpQkFBRzs7O0FBQ04saUNBcEJpQixJQUFJLHVDQW9CUDtBQUNkLFVBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLG9CQUFPLElBQUksRUFBRSxvQkFBTyxPQUFPLEVBQUUsVUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFLO0FBQ2hFLGNBQUssaUJBQWlCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ3hDLENBQUMsQ0FBQztLQUNKOzs7V0FFTSxtQkFBRyxFQUVUOzs7Ozs7Ozs7O0FBQUE7OztXQVNXLHNCQUFDLFFBQVEsRUFBRTtBQUNyQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzFDOzs7Ozs7Ozs7OztXQVNVLHFCQUFDLFNBQVMsRUFBRTtBQUNyQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzFDOzs7V0FFZ0IsMkJBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUNqQyxVQUFHLE9BQU8sS0FBSyxhQUFhLEVBQUU7QUFDNUIsWUFBRyxNQUFNLENBQUMsTUFBTSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtBQUMzRCxjQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLGdCQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixnQkFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1dBQ2I7U0FDRjtBQUNELFlBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ2xDO0tBQ0Y7OztTQTlEa0IsSUFBSTs7O3FCQUFKLElBQUkiLCJmaWxlIjoic3JjL2NsaWVudC9TeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IFN5bmNDbGllbnQgZnJvbSAnc3luYy9jbGllbnQnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG4vKipcbiAqIFRoZSB7QGxpbmsgU3luY30gbW9kdWxlIHRha2VzIGNhcmUgb2YgdGhlIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAqIEl0IGRpc3BsYXlzIFwiQ2xvY2sgc3luY2luZywgc3RhbmQgYnnigKZcIiB1bnRpbCB0aGUgdmVyeSBmaXJzdCBzeW5jaHJvbml6YXRpb24gcHJvY2VzcyBpcyBkb25lLlxuICogVGhlIHtAbGluayBTeW5jfSBtb2R1bGUgY2FsbHMgaXRzIGBkb25lYCBtZXRob2QgYXMgc29vbiBhcyB0aGUgY2xpZW50IGNsb2NrIGlzIGluIHN5bmMgd2l0aCB0aGUgc3luYyBjbG9jay5cbiAqIFRoZW4sIHRoZSBzeW5jaHJvbml6YXRpb24gcHJvY2VzcyBrZWVwcyBydW5uaW5nIGluIHRoZSBiYWNrZ3JvdW5kIHRvIHJlc3luY2hyb25pemUgdGhlIGNsb2NrcyBmcm9tIHRpbWVzIHRvIHRpbWVzLlxuICogQGV4YW1wbGVcbiAqIC8vIFJlcXVpcmUgdGhlIFNvdW5kd29ya3MgbGlicmFyeSAoY2xpZW50IHNpZGUpXG4gKiBjb25zdCBjbGllbnRTaWRlID0gcmVxdWlyZSgnc291bmR3b3Jrcy9jbGllbnQnKTsgLy8gVE9ET1xuICpcbiAqIC8vIENyZWF0ZSBTeW5jIG1vZHVsZVxuICogY29uc3Qgc3luYyA9IG5ldyBjbGllbnRTaWRlLlN5bmMoKTtcbiAqXG4gKiAvLyBHZXQgdGltZXNcbiAqIGNvbnN0IG5vd0xvY2FsID0gc3luYy5nZXRMb2NhbFRpbWUoKTsgLy8gY3VycmVudCB0aW1lIGluIGxvY2FsIGNsb2NrIHRpbWVcbiAqIGNvbnN0IG5vd1N5bmMgPSBzeW5jLmdldFN5bmNUaW1lKCk7IC8vIGN1cnJlbnQgdGltZSBpbiBzeW5jIGNsb2NrIHRpbWVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3luYyBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy4gQWx3YXlzIGhhcyBhIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3N5bmMnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3N5bmMnLCB0cnVlLCBvcHRpb25zLmNvbG9yIHx8ICdibGFjaycpO1xuXG4gICAgdGhpcy5fcmVhZHkgPSBmYWxzZTtcbiAgICB0aGlzLl9zeW5jID0gbmV3IFN5bmNDbGllbnQoKCkgPT4gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcblxuICAgIHRoaXMuc2V0Q2VudGVyZWRWaWV3Q29udGVudCgnPHAgY2xhc3M9XCJzb2Z0LWJsaW5rXCI+Q2xvY2sgc3luY2luZywgc3RhbmQgYnkmaGVsbGlwOzwvcD4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLl9zeW5jLnN0YXJ0KGNsaWVudC5zZW5kLCBjbGllbnQucmVjZWl2ZSwgKHN0YXR1cywgcmVwb3J0KSA9PiB7XG4gICAgICB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0KHN0YXR1cywgcmVwb3J0KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlc3RhcnQoKSB7XG4gICAgLy8gVE9ET1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrLlxuICAgKiBJZiBubyBhcmd1bWVudHMgYXJlIHByb3ZpZGVkLCByZXR1cm5zIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUgKCppLmUuKiBgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lYCkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzeW5jVGltZSBUaW1lIGluIHRoZSBzeW5jIGNsb2NrIChpbiBzZWNvbmRzKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSBUaW1lIGluIHRoZSBsb2NhbCBjbG9jayBjb3JyZXNwb25kaW5nIHRvIGBzeW5jVGltZWAgKGluIHNlY29uZHMpLlxuICAgKiBAdG9kbyBhZGQgb3B0aW9uYWwgYXJndW1lbnQ/XG4gICAqL1xuICBnZXRMb2NhbFRpbWUoc3luY1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRMb2NhbFRpbWUoc3luY1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRpbWUgaW4gdGhlIHN5bmMgY2xvY2suXG4gICAqIElmIG5vIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQsIHJldHVybnMgdGhlIGN1cnJlbnQgc3luYyB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbG9jYWxUaW1lIFRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrIChpbiBzZWNvbmRzKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSBUaW1lIGluIHRoZSBzeW5jIGNsb2NrIGNvcnJlc3BvbmRpbmcgdG8gYGxvY2FsVGltZWAgKGluIHNlY29uZHMpXG4gICAqIEB0b2RvIGFkZCBvcHRpb25hbCBhcmd1bWVudD9cbiAgICovXG4gIGdldFN5bmNUaW1lKGxvY2FsVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldFN5bmNUaW1lKGxvY2FsVGltZSk7XG4gIH1cblxuICBfc3luY1N0YXR1c1JlcG9ydChtZXNzYWdlLCByZXBvcnQpIHtcbiAgICBpZihtZXNzYWdlID09PSAnc3luYzpzdGF0dXMnKSB7XG4gICAgICBpZihyZXBvcnQuc3RhdHVzID09PSAndHJhaW5pbmcnIHx8IHJlcG9ydC5zdGF0dXMgPT09ICdzeW5jJykge1xuICAgICAgICBpZighdGhpcy5fcmVhZHkpIHtcbiAgICAgICAgICB0aGlzLl9yZWFkeSA9IHRydWU7XG4gICAgICAgICAgdGhpcy5kb25lKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdCgnc3luYzpzdGF0dXMnLCByZXBvcnQpO1xuICAgIH1cbiAgfVxufVxuXG4iXX0=