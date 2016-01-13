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

var _displaySegmentedView = require('./display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

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

    _get(Object.getPrototypeOf(ClientSync.prototype), 'constructor', this).call(this, options.name || 'sync', options);

    this._sync = new _syncClient2['default'](function () {
      return _wavesAudio.audioContext.currentTime;
    });
    this.viewCtor = _displaySegmentedView2['default'] || options.viewCtor;

    this.init();
  }

  _createClass(ClientSync, [{
    key: 'init',
    value: function init() {
      this._ready = false;
      this.view = this.createView();
    }

    /**
     * Start the synchronization process.
     * @private
     */
  }, {
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

        this.emit('status', report);
      }
    }
  }]);

  return ClientSync;
})(_ClientModule3['default']);

exports['default'] = ClientSync;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50U3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOzswQkFDbkIsYUFBYTs7OztzQkFDakIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7b0NBQ2YseUJBQXlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEyQjlCLFVBQVU7WUFBVixVQUFVOzs7Ozs7OztBQU1sQixXQU5RLFVBQVUsR0FNSDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTkwsVUFBVTs7QUFPM0IsK0JBUGlCLFVBQVUsNkNBT3JCLE9BQU8sQ0FBQyxJQUFJLElBQUksTUFBTSxFQUFFLE9BQU8sRUFBRTs7QUFFdkMsUUFBSSxDQUFDLEtBQUssR0FBRyw0QkFBZTthQUFNLHlCQUFhLFdBQVc7S0FBQSxDQUFDLENBQUM7QUFDNUQsUUFBSSxDQUFDLFFBQVEsR0FBRyxxQ0FBaUIsT0FBTyxDQUFDLFFBQVEsQ0FBQzs7QUFFbEQsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ2I7O2VBYmtCLFVBQVU7O1dBZXpCLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDcEIsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDL0I7Ozs7Ozs7O1dBTUksaUJBQUc7OztBQUNOLGlDQXpCaUIsVUFBVSx1Q0F5QmI7QUFDZCxVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFLO0FBQzVELGNBQUssaUJBQWlCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ3hDLENBQUMsQ0FBQztLQUNKOzs7Ozs7O1dBS00sbUJBQUcsRUFFVDs7Ozs7Ozs7OztBQUFBOzs7V0FTVyxzQkFBQyxRQUFRLEVBQUU7QUFDckIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUMxQzs7Ozs7Ozs7Ozs7V0FTVSxxQkFBQyxTQUFTLEVBQUU7QUFDckIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUMxQzs7O1dBRWdCLDJCQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDakMsVUFBSSxPQUFPLEtBQUssYUFBYSxFQUFFO0FBQzdCLFlBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUU7QUFDNUQsY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDaEIsZ0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLGdCQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7V0FDYjtTQUNGOztBQUVELFlBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQzdCO0tBQ0Y7OztTQXZFa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRTeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IFN5bmNDbGllbnQgZnJvbSAnc3luYy9jbGllbnQnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcblxuLyoqXG4gKiBbY2xpZW50XSBTeW5jaHJvbml6ZSB0aGUgbG9jYWwgY2xvY2sgb24gYSBtYXN0ZXIgY2xvY2sgc2hhcmVkIGJ5IHRoZSBzZXJ2ZXIgYW5kIHRoZSBjbGllbnRzLlxuICpcbiAqIEJvdGggdGhlIGNsaWVudHMgYW5kIHRoZSBzZXJ2ZXIgY2FuIHVzZSB0aGlzIG1hc3RlciBjbG9jayBhcyBhIGNvbW1vbiB0aW1lIHJlZmVyZW5jZS5cbiAqIEZvciBpbnN0YW5jZSwgdGhpcyBhbGxvd3MgYWxsIHRoZSBjbGllbnRzIHRvIGRvIHNvbWV0aGluZyBleGFjdGx5IGF0IHRoZSBzYW1lIHRpbWUsIHN1Y2ggYXMgYmxpbmtpbmcgdGhlIHNjcmVlbiBvciBwbGF5aW5nIGEgc291bmQgaW4gYSBzeW5jaHJvbml6ZWQgbWFubmVyLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcgKHRoYXQgZGlzcGxheXMgXCJDbG9jayBzeW5jaW5nLCBzdGFuZCBieeKAplwiLCB1bnRpbCB0aGUgdmVyeSBmaXJzdCBzeW5jaHJvbml6YXRpb24gcHJvY2VzcyBpcyBkb25lKS5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBhcyBzb29uIGFzIHRoZSBjbGllbnQgY2xvY2sgaXMgaW4gc3luYyB3aXRoIHRoZSBtYXN0ZXIgY2xvY2suXG4gKiBUaGVuLCB0aGUgc3luY2hyb25pemF0aW9uIHByb2Nlc3Mga2VlcHMgcnVubmluZyBpbiB0aGUgYmFja2dyb3VuZCB0byByZXN5bmNocm9uaXplIHRoZSBjbG9ja3MgZnJvbSB0aW1lcyB0byB0aW1lcy5cbiAqXG4gKiAqKk5vdGU6KiogdGhlIG1vZHVsZSBpcyBiYXNlZCBvbiBbYGdpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmNgXShodHRwczovL2dpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmMpLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJTeW5jLmpzflNlcnZlclN5bmN9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGUgY29uc3Qgc3luYyA9IG5ldyBDbGllbnRTeW5jKCk7XG4gKlxuICogY29uc3Qgbm93TG9jYWwgPSBzeW5jLmdldExvY2FsVGltZSgpOyAvLyBjdXJyZW50IHRpbWUgaW4gbG9jYWwgY2xvY2sgdGltZVxuICogY29uc3Qgbm93U3luYyA9IHN5bmMuZ2V0U3luY1RpbWUoKTsgLy8gY3VycmVudCB0aW1lIGluIHN5bmMgY2xvY2sgdGltZVxuICogQGVtaXRzICdzeW5jOnN0YXRzJyBlYWNoIHRpbWUgdGhlIG1vZHVsZSAocmUpc3luY2hyb25pemVzIHRoZSBsb2NhbCBjbG9jayBvbiB0aGUgc3luYyBjbG9jay5cbiAqIFRoZSBgJ3N5bmM6c3RhdHMnYCBldmVudCBnb2VzIGFsb25nIHdpdGggdGhlIGByZXBvcnRgIG9iamVjdCB0aGF0IGhhcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiAtIGB0aW1lT2Zmc2V0YCwgY3VycmVudCBlc3RpbWF0aW9uIG9mIHRoZSB0aW1lIG9mZnNldCBiZXR3ZWVuIHRoZSBjbGllbnQgY2xvY2sgYW5kIHRoZSBzeW5jIGNsb2NrO1xuICogLSBgdHJhdmVsVGltZWAsIGN1cnJlbnQgZXN0aW1hdGlvbiBvZiB0aGUgdHJhdmVsIHRpbWUgZm9yIGEgbWVzc2FnZSB0byBnbyBmcm9tIHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlciBhbmQgYmFjaztcbiAqIC0gYHRyYXZlbFRpbWVNYXhgLCBjdXJyZW50IGVzdGltYXRpb24gb2YgdGhlIG1heGltdW0gdHJhdmVsIHRpbWUgZm9yIGEgbWVzc2FnZSB0byBnbyBmcm9tIHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlciBhbmQgYmFjay5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50U3luYyBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdzeW5jJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdzeW5jJywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9zeW5jID0gbmV3IFN5bmNDbGllbnQoKCkgPT4gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcbiAgICB0aGlzLnZpZXdDdG9yID0gU2VnbWVudGVkVmlldyB8fMKgb3B0aW9ucy52aWV3Q3RvcjtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLl9yZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBzeW5jaHJvbml6YXRpb24gcHJvY2Vzcy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5fc3luYy5zdGFydCh0aGlzLnNlbmQsIHRoaXMucmVjZWl2ZSwgKHN0YXR1cywgcmVwb3J0KSA9PiB7XG4gICAgICB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0KHN0YXR1cywgcmVwb3J0KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICAvLyBUT0RPXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0aW1lIGluIHRoZSBsb2NhbCBjbG9jay5cbiAgICogSWYgbm8gYXJndW1lbnRzIGFyZSBwcm92aWRlZCwgcmV0dXJucyB0aGUgY3VycmVudCBsb2NhbCB0aW1lICgqaS5lLiogYGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZWApLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3luY1RpbWUgVGltZSBpbiB0aGUgc3luYyBjbG9jayAoaW4gc2Vjb25kcykuXG4gICAqIEByZXR1cm4ge051bWJlcn0gVGltZSBpbiB0aGUgbG9jYWwgY2xvY2sgY29ycmVzcG9uZGluZyB0byBgc3luY1RpbWVgIChpbiBzZWNvbmRzKS5cbiAgICogQHRvZG8gYWRkIG9wdGlvbmFsIGFyZ3VtZW50P1xuICAgKi9cbiAgZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIHN5bmMgY2xvY2suXG4gICAqIElmIG5vIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQsIHJldHVybnMgdGhlIGN1cnJlbnQgc3luYyB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbG9jYWxUaW1lIFRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrIChpbiBzZWNvbmRzKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSBUaW1lIGluIHRoZSBzeW5jIGNsb2NrIGNvcnJlc3BvbmRpbmcgdG8gYGxvY2FsVGltZWAgKGluIHNlY29uZHMpXG4gICAqIEB0b2RvIGFkZCBvcHRpb25hbCBhcmd1bWVudD9cbiAgICovXG4gIGdldFN5bmNUaW1lKGxvY2FsVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldFN5bmNUaW1lKGxvY2FsVGltZSk7XG4gIH1cblxuICBfc3luY1N0YXR1c1JlcG9ydChtZXNzYWdlLCByZXBvcnQpIHtcbiAgICBpZiAobWVzc2FnZSA9PT0gJ3N5bmM6c3RhdHVzJykge1xuICAgICAgaWYgKHJlcG9ydC5zdGF0dXMgPT09ICd0cmFpbmluZycgfHwgcmVwb3J0LnN0YXR1cyA9PT0gJ3N5bmMnKSB7XG4gICAgICAgIGlmICghdGhpcy5fcmVhZHkpIHtcbiAgICAgICAgICB0aGlzLl9yZWFkeSA9IHRydWU7XG4gICAgICAgICAgdGhpcy5kb25lKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5lbWl0KCdzdGF0dXMnLCByZXBvcnQpO1xuICAgIH1cbiAgfVxufVxuIl19