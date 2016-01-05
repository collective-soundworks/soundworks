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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50U3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOzswQkFDbkIsYUFBYTs7OztzQkFDakIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7b0NBQ2YseUJBQXlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEyQjlCLFVBQVU7WUFBVixVQUFVOzs7Ozs7OztBQU1sQixXQU5RLFVBQVUsR0FNSDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTkwsVUFBVTs7QUFPM0IsK0JBUGlCLFVBQVUsNkNBT3JCLE9BQU8sQ0FBQyxJQUFJLElBQUksTUFBTSxFQUFFLE9BQU8sRUFBRTs7QUFFdkMsUUFBSSxDQUFDLEtBQUssR0FBRyw0QkFBZTthQUFNLHlCQUFhLFdBQVc7S0FBQSxDQUFDLENBQUM7QUFDNUQsUUFBSSxDQUFDLFFBQVEsR0FBRyxxQ0FBaUIsT0FBTyxDQUFDLFFBQVEsQ0FBQzs7QUFFbEQsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ2I7O2VBYmtCLFVBQVU7O1dBZXpCLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDcEIsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDL0I7Ozs7Ozs7O1dBTUksaUJBQUc7OztBQUNOLGlDQXpCaUIsVUFBVSx1Q0F5QmI7QUFDZCxVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFLO0FBQzVELGNBQUssaUJBQWlCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ3hDLENBQUMsQ0FBQztLQUNKOzs7Ozs7O1dBS00sbUJBQUcsRUFFVDs7Ozs7Ozs7OztBQUFBOzs7V0FTVyxzQkFBQyxRQUFRLEVBQUU7QUFDckIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUMxQzs7Ozs7Ozs7Ozs7V0FTVSxxQkFBQyxTQUFTLEVBQUU7QUFDckIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUMxQzs7O1dBRWdCLDJCQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDakMsVUFBSSxPQUFPLEtBQUssYUFBYSxFQUFFO0FBQzdCLFlBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUU7QUFDNUQsY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDaEIsZ0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLGdCQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7V0FDYjtTQUNGO0FBQ0QsWUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDN0I7S0FDRjs7O1NBdEVrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudFN5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgU3luY0NsaWVudCBmcm9tICdzeW5jL2NsaWVudCc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlZ21lbnRlZFZpZXcnO1xuXG4vKipcbiAqIFtjbGllbnRdIFN5bmNocm9uaXplIHRoZSBsb2NhbCBjbG9jayBvbiBhIG1hc3RlciBjbG9jayBzaGFyZWQgYnkgdGhlIHNlcnZlciBhbmQgdGhlIGNsaWVudHMuXG4gKlxuICogQm90aCB0aGUgY2xpZW50cyBhbmQgdGhlIHNlcnZlciBjYW4gdXNlIHRoaXMgbWFzdGVyIGNsb2NrIGFzIGEgY29tbW9uIHRpbWUgcmVmZXJlbmNlLlxuICogRm9yIGluc3RhbmNlLCB0aGlzIGFsbG93cyBhbGwgdGhlIGNsaWVudHMgdG8gZG8gc29tZXRoaW5nIGV4YWN0bHkgYXQgdGhlIHNhbWUgdGltZSwgc3VjaCBhcyBibGlua2luZyB0aGUgc2NyZWVuIG9yIHBsYXlpbmcgYSBzb3VuZCBpbiBhIHN5bmNocm9uaXplZCBtYW5uZXIuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgaGFzIGEgdmlldyAodGhhdCBkaXNwbGF5cyBcIkNsb2NrIHN5bmNpbmcsIHN0YW5kIGJ54oCmXCIsIHVudGlsIHRoZSB2ZXJ5IGZpcnN0IHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIGlzIGRvbmUpLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIGFzIHNvb24gYXMgdGhlIGNsaWVudCBjbG9jayBpcyBpbiBzeW5jIHdpdGggdGhlIG1hc3RlciBjbG9jay5cbiAqIFRoZW4sIHRoZSBzeW5jaHJvbml6YXRpb24gcHJvY2VzcyBrZWVwcyBydW5uaW5nIGluIHRoZSBiYWNrZ3JvdW5kIHRvIHJlc3luY2hyb25pemUgdGhlIGNsb2NrcyBmcm9tIHRpbWVzIHRvIHRpbWVzLlxuICpcbiAqICoqTm90ZToqKiB0aGUgbW9kdWxlIGlzIGJhc2VkIG9uIFtgZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luY2BdKGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luYykuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlclN5bmMuanN+U2VydmVyU3luY30gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSBjb25zdCBzeW5jID0gbmV3IENsaWVudFN5bmMoKTtcbiAqXG4gKiBjb25zdCBub3dMb2NhbCA9IHN5bmMuZ2V0TG9jYWxUaW1lKCk7IC8vIGN1cnJlbnQgdGltZSBpbiBsb2NhbCBjbG9jayB0aW1lXG4gKiBjb25zdCBub3dTeW5jID0gc3luYy5nZXRTeW5jVGltZSgpOyAvLyBjdXJyZW50IHRpbWUgaW4gc3luYyBjbG9jayB0aW1lXG4gKiBAZW1pdHMgJ3N5bmM6c3RhdHMnIGVhY2ggdGltZSB0aGUgbW9kdWxlIChyZSlzeW5jaHJvbml6ZXMgdGhlIGxvY2FsIGNsb2NrIG9uIHRoZSBzeW5jIGNsb2NrLlxuICogVGhlIGAnc3luYzpzdGF0cydgIGV2ZW50IGdvZXMgYWxvbmcgd2l0aCB0aGUgYHJlcG9ydGAgb2JqZWN0IHRoYXQgaGFzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqIC0gYHRpbWVPZmZzZXRgLCBjdXJyZW50IGVzdGltYXRpb24gb2YgdGhlIHRpbWUgb2Zmc2V0IGJldHdlZW4gdGhlIGNsaWVudCBjbG9jayBhbmQgdGhlIHN5bmMgY2xvY2s7XG4gKiAtIGB0cmF2ZWxUaW1lYCwgY3VycmVudCBlc3RpbWF0aW9uIG9mIHRoZSB0cmF2ZWwgdGltZSBmb3IgYSBtZXNzYWdlIHRvIGdvIGZyb20gdGhlIGNsaWVudCB0byB0aGUgc2VydmVyIGFuZCBiYWNrO1xuICogLSBgdHJhdmVsVGltZU1heGAsIGN1cnJlbnQgZXN0aW1hdGlvbiBvZiB0aGUgbWF4aW11bSB0cmF2ZWwgdGltZSBmb3IgYSBtZXNzYWdlIHRvIGdvIGZyb20gdGhlIGNsaWVudCB0byB0aGUgc2VydmVyIGFuZCBiYWNrLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRTeW5jIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3N5bmMnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3N5bmMnLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY0NsaWVudCgoKSA9PiBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuICAgIHRoaXMudmlld0N0b3IgPSBTZWdtZW50ZWRWaWV3IHx8wqBvcHRpb25zLnZpZXdDdG9yO1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuX3JlYWR5ID0gZmFsc2U7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLl9zeW5jLnN0YXJ0KHRoaXMuc2VuZCwgdGhpcy5yZWNlaXZlLCAoc3RhdHVzLCByZXBvcnQpID0+IHtcbiAgICAgIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQoc3RhdHVzLCByZXBvcnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIC8vIFRPRE9cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrLlxuICAgKiBJZiBubyBhcmd1bWVudHMgYXJlIHByb3ZpZGVkLCByZXR1cm5zIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUgKCppLmUuKiBgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lYCkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzeW5jVGltZSBUaW1lIGluIHRoZSBzeW5jIGNsb2NrIChpbiBzZWNvbmRzKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSBUaW1lIGluIHRoZSBsb2NhbCBjbG9jayBjb3JyZXNwb25kaW5nIHRvIGBzeW5jVGltZWAgKGluIHNlY29uZHMpLlxuICAgKiBAdG9kbyBhZGQgb3B0aW9uYWwgYXJndW1lbnQ/XG4gICAqL1xuICBnZXRMb2NhbFRpbWUoc3luY1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRMb2NhbFRpbWUoc3luY1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdGltZSBpbiB0aGUgc3luYyBjbG9jay5cbiAgICogSWYgbm8gYXJndW1lbnRzIGFyZSBwcm92aWRlZCwgcmV0dXJucyB0aGUgY3VycmVudCBzeW5jIHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsb2NhbFRpbWUgVGltZSBpbiB0aGUgbG9jYWwgY2xvY2sgKGluIHNlY29uZHMpLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRpbWUgaW4gdGhlIHN5bmMgY2xvY2sgY29ycmVzcG9uZGluZyB0byBgbG9jYWxUaW1lYCAoaW4gc2Vjb25kcylcbiAgICogQHRvZG8gYWRkIG9wdGlvbmFsIGFyZ3VtZW50P1xuICAgKi9cbiAgZ2V0U3luY1RpbWUobG9jYWxUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUobG9jYWxUaW1lKTtcbiAgfVxuXG4gIF9zeW5jU3RhdHVzUmVwb3J0KG1lc3NhZ2UsIHJlcG9ydCkge1xuICAgIGlmIChtZXNzYWdlID09PSAnc3luYzpzdGF0dXMnKSB7XG4gICAgICBpZiAocmVwb3J0LnN0YXR1cyA9PT0gJ3RyYWluaW5nJyB8fCByZXBvcnQuc3RhdHVzID09PSAnc3luYycpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9yZWFkeSkge1xuICAgICAgICAgIHRoaXMuX3JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5lbWl0KCdzdGF0dXMnLCByZXBvcnQpO1xuICAgIH1cbiAgfVxufVxuIl19