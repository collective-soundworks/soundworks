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

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

/**
 * [client] Synchronize the local clock on a master clock shared by the server and the clients.
 *
 * Both the clients and the server can use this master clock as a common time reference.
 * For instance, this allows all the clients to do something exactly at the same time, such as blinking the screen or playing a sound in a synchronized manner.
 *
 * The module always has a view (that displays "Clock syncing, stand by…", until the very first synchronization process is done).
 *
 * The module finishes its initialization as soon as the client clock is in sync with the master clock.
 * Then, the synchronization process keeps running in the background to resynchronize the clocks from times to times.
 *
 * **Note:** the module is based on [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * (See also {@link src/server/ServerSync.js~ServerSync} on the server side.)
 *
 * @example const sync = new ClientSync();
 *
 * const nowLocal = sync.getLocalTime(); // current time in local clock time
 * const nowSync = sync.getSyncTime(); // current time in sync clock time
 * @emits 'sync:stats' each time the module (re)synchronizes the local clock on the sync clock.
 * The `'sync:stats'` event goes along with the `report` object that has the following properties:
 * - `timeOffset`, current estimation of the time offset between the client clock and the sync clock;
 * - `travelTime`, current estimation of the travel time for a message to go from the client to the server and back;
 * - `travelTimeMax`, current estimation of the maximum travel time for a message to go from the client to the server and back.
 */

var ClientSync = (function (_ClientModule) {
  _inherits(ClientSync, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='sync'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   */

  function ClientSync() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientSync);

    _get(Object.getPrototypeOf(ClientSync.prototype), 'constructor', this).call(this, options.name || 'sync', true, options.color || 'black');

    this._ready = false;
    this._sync = new _syncClient2['default'](function () {
      return _wavesAudio.audioContext.currentTime;
    });

    this.setCenteredViewContent('<p class="soft-blink">Clock syncing, stand by&hellip;</p>');
  }

  /**
   * Start the synchronization process.
   * @private
   */

  _createClass(ClientSync, [{
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(ClientSync.prototype), 'start', this).call(this);
      this._sync.start(this.send, this.receive, function (status, report) {
        _this._syncStatusReport(status, report);
      });
    }

    /**
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {}
    // TODO

    /**
     * Return the time in the local clock.
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
     * Return the time in the sync clock.
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

  return ClientSync;
})(_ClientModule3['default']);

exports['default'] = ClientSync;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50U3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOzswQkFDbkIsYUFBYTs7OztzQkFDakIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTJCcEIsVUFBVTtZQUFWLFVBQVU7Ozs7Ozs7O0FBTWxCLFdBTlEsVUFBVSxHQU1IO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFOTCxVQUFVOztBQU8zQiwrQkFQaUIsVUFBVSw2Q0FPckIsT0FBTyxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLElBQUksT0FBTyxFQUFFOztBQUU5RCxRQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNwQixRQUFJLENBQUMsS0FBSyxHQUFHLDRCQUFlO2FBQU0seUJBQWEsV0FBVztLQUFBLENBQUMsQ0FBQzs7QUFFNUQsUUFBSSxDQUFDLHNCQUFzQixDQUFDLDJEQUEyRCxDQUFDLENBQUM7R0FDMUY7Ozs7Ozs7ZUFia0IsVUFBVTs7V0FtQnhCLGlCQUFHOzs7QUFDTixpQ0FwQmlCLFVBQVUsdUNBb0JiO0FBQ2QsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBSztBQUM1RCxjQUFLLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztPQUN4QyxDQUFDLENBQUM7S0FDSjs7Ozs7OztXQUtNLG1CQUFHLEVBRVQ7Ozs7Ozs7Ozs7QUFBQTs7O1dBU1csc0JBQUMsUUFBUSxFQUFFO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDMUM7Ozs7Ozs7Ozs7O1dBU1UscUJBQUMsU0FBUyxFQUFFO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDMUM7OztXQUVnQiwyQkFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQ2pDLFVBQUksT0FBTyxLQUFLLGFBQWEsRUFBRTtBQUM3QixZQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssVUFBVSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFO0FBQzVELGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2hCLGdCQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixnQkFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1dBQ2I7U0FDRjtBQUNELFlBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ2xDO0tBQ0Y7OztTQWpFa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRTeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IFN5bmNDbGllbnQgZnJvbSAnc3luYy9jbGllbnQnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcblxuLyoqXG4gKiBbY2xpZW50XSBTeW5jaHJvbml6ZSB0aGUgbG9jYWwgY2xvY2sgb24gYSBtYXN0ZXIgY2xvY2sgc2hhcmVkIGJ5IHRoZSBzZXJ2ZXIgYW5kIHRoZSBjbGllbnRzLlxuICpcbiAqIEJvdGggdGhlIGNsaWVudHMgYW5kIHRoZSBzZXJ2ZXIgY2FuIHVzZSB0aGlzIG1hc3RlciBjbG9jayBhcyBhIGNvbW1vbiB0aW1lIHJlZmVyZW5jZS5cbiAqIEZvciBpbnN0YW5jZSwgdGhpcyBhbGxvd3MgYWxsIHRoZSBjbGllbnRzIHRvIGRvIHNvbWV0aGluZyBleGFjdGx5IGF0IHRoZSBzYW1lIHRpbWUsIHN1Y2ggYXMgYmxpbmtpbmcgdGhlIHNjcmVlbiBvciBwbGF5aW5nIGEgc291bmQgaW4gYSBzeW5jaHJvbml6ZWQgbWFubmVyLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcgKHRoYXQgZGlzcGxheXMgXCJDbG9jayBzeW5jaW5nLCBzdGFuZCBieeKAplwiLCB1bnRpbCB0aGUgdmVyeSBmaXJzdCBzeW5jaHJvbml6YXRpb24gcHJvY2VzcyBpcyBkb25lKS5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBhcyBzb29uIGFzIHRoZSBjbGllbnQgY2xvY2sgaXMgaW4gc3luYyB3aXRoIHRoZSBtYXN0ZXIgY2xvY2suXG4gKiBUaGVuLCB0aGUgc3luY2hyb25pemF0aW9uIHByb2Nlc3Mga2VlcHMgcnVubmluZyBpbiB0aGUgYmFja2dyb3VuZCB0byByZXN5bmNocm9uaXplIHRoZSBjbG9ja3MgZnJvbSB0aW1lcyB0byB0aW1lcy5cbiAqXG4gKiAqKk5vdGU6KiogdGhlIG1vZHVsZSBpcyBiYXNlZCBvbiBbYGdpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmNgXShodHRwczovL2dpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmMpLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJTeW5jLmpzflNlcnZlclN5bmN9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGUgY29uc3Qgc3luYyA9IG5ldyBDbGllbnRTeW5jKCk7XG4gKlxuICogY29uc3Qgbm93TG9jYWwgPSBzeW5jLmdldExvY2FsVGltZSgpOyAvLyBjdXJyZW50IHRpbWUgaW4gbG9jYWwgY2xvY2sgdGltZVxuICogY29uc3Qgbm93U3luYyA9IHN5bmMuZ2V0U3luY1RpbWUoKTsgLy8gY3VycmVudCB0aW1lIGluIHN5bmMgY2xvY2sgdGltZVxuICogQGVtaXRzICdzeW5jOnN0YXRzJyBlYWNoIHRpbWUgdGhlIG1vZHVsZSAocmUpc3luY2hyb25pemVzIHRoZSBsb2NhbCBjbG9jayBvbiB0aGUgc3luYyBjbG9jay5cbiAqIFRoZSBgJ3N5bmM6c3RhdHMnYCBldmVudCBnb2VzIGFsb25nIHdpdGggdGhlIGByZXBvcnRgIG9iamVjdCB0aGF0IGhhcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiAtIGB0aW1lT2Zmc2V0YCwgY3VycmVudCBlc3RpbWF0aW9uIG9mIHRoZSB0aW1lIG9mZnNldCBiZXR3ZWVuIHRoZSBjbGllbnQgY2xvY2sgYW5kIHRoZSBzeW5jIGNsb2NrO1xuICogLSBgdHJhdmVsVGltZWAsIGN1cnJlbnQgZXN0aW1hdGlvbiBvZiB0aGUgdHJhdmVsIHRpbWUgZm9yIGEgbWVzc2FnZSB0byBnbyBmcm9tIHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlciBhbmQgYmFjaztcbiAqIC0gYHRyYXZlbFRpbWVNYXhgLCBjdXJyZW50IGVzdGltYXRpb24gb2YgdGhlIG1heGltdW0gdHJhdmVsIHRpbWUgZm9yIGEgbWVzc2FnZSB0byBnbyBmcm9tIHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlciBhbmQgYmFjay5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50U3luYyBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdzeW5jJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdzeW5jJywgdHJ1ZSwgb3B0aW9ucy5jb2xvciB8fCAnYmxhY2snKTtcblxuICAgIHRoaXMuX3JlYWR5ID0gZmFsc2U7XG4gICAgdGhpcy5fc3luYyA9IG5ldyBTeW5jQ2xpZW50KCgpID0+IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG5cbiAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQoJzxwIGNsYXNzPVwic29mdC1ibGlua1wiPkNsb2NrIHN5bmNpbmcsIHN0YW5kIGJ5JmhlbGxpcDs8L3A+Jyk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLl9zeW5jLnN0YXJ0KHRoaXMuc2VuZCwgdGhpcy5yZWNlaXZlLCAoc3RhdHVzLCByZXBvcnQpID0+IHtcbiAgICAgIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQoc3RhdHVzLCByZXBvcnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIC8vIFRPRE9cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrLlxuICAgKiBJZiBubyBhcmd1bWVudHMgYXJlIHByb3ZpZGVkLCByZXR1cm5zIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUgKCppLmUuKiBgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lYCkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzeW5jVGltZSBUaW1lIGluIHRoZSBzeW5jIGNsb2NrIChpbiBzZWNvbmRzKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSBUaW1lIGluIHRoZSBsb2NhbCBjbG9jayBjb3JyZXNwb25kaW5nIHRvIGBzeW5jVGltZWAgKGluIHNlY29uZHMpLlxuICAgKiBAdG9kbyBhZGQgb3B0aW9uYWwgYXJndW1lbnQ/XG4gICAqL1xuICBnZXRMb2NhbFRpbWUoc3luY1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRMb2NhbFRpbWUoc3luY1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdGltZSBpbiB0aGUgc3luYyBjbG9jay5cbiAgICogSWYgbm8gYXJndW1lbnRzIGFyZSBwcm92aWRlZCwgcmV0dXJucyB0aGUgY3VycmVudCBzeW5jIHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsb2NhbFRpbWUgVGltZSBpbiB0aGUgbG9jYWwgY2xvY2sgKGluIHNlY29uZHMpLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRpbWUgaW4gdGhlIHN5bmMgY2xvY2sgY29ycmVzcG9uZGluZyB0byBgbG9jYWxUaW1lYCAoaW4gc2Vjb25kcylcbiAgICogQHRvZG8gYWRkIG9wdGlvbmFsIGFyZ3VtZW50P1xuICAgKi9cbiAgZ2V0U3luY1RpbWUobG9jYWxUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUobG9jYWxUaW1lKTtcbiAgfVxuXG4gIF9zeW5jU3RhdHVzUmVwb3J0KG1lc3NhZ2UsIHJlcG9ydCkge1xuICAgIGlmIChtZXNzYWdlID09PSAnc3luYzpzdGF0dXMnKSB7XG4gICAgICBpZiAocmVwb3J0LnN0YXR1cyA9PT0gJ3RyYWluaW5nJyB8fCByZXBvcnQuc3RhdHVzID09PSAnc3luYycpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9yZWFkeSkge1xuICAgICAgICAgIHRoaXMuX3JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5lbWl0KCdzeW5jOnN0YXR1cycsIHJlcG9ydCk7XG4gICAgfVxuICB9XG59XG4iXX0=