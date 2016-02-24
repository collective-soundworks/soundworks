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

var _displaySegmentedView = require('../display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

var _coreService = require('../core/Service');

var _coreService2 = _interopRequireDefault(_coreService);

var _coreServiceManager = require('../core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

var _syncClient = require('sync/client');

var _syncClient2 = _interopRequireDefault(_syncClient);

var SERVICE_ID = 'service:sync';

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
 * **Note:** the service is based on [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * (See also {@link src/server/ServerSync.js~ServerSync} on the server side.)
 *
 * @example
 * const sync = serviceManager.require('service:sync');
 *
 * const nowLocal = sync.getLocalTime(); // current time in local clock time
 * const nowSync = sync.getSyncTime(); // current time in sync clock time
 * @emits 'sync:stats' each time the module (re)synchronizes the local clock on the sync clock.
 * The `'status'` event goes along with the `report` object that has the following properties:
 * - `timeOffset`, current estimation of the time offset between the client clock and the sync clock;
 * - `travelTime`, current estimation of the travel time for a message to go from the client to the server and back;
 * - `travelTimeMax`, current estimation of the maximum travel time for a message to go from the client to the server and back.
 */

var ClientSync = (function (_Service) {
  _inherits(ClientSync, _Service);

  function ClientSync() {
    _classCallCheck(this, ClientSync);

    _get(Object.getPrototypeOf(ClientSync.prototype), 'constructor', this).call(this, SERVICE_ID, true);

    var defaults = {
      viewCtor: _displaySegmentedView2['default'],
      viewPriority: 3
    };

    // @todo - add options to configure the sync module
    this.configure(defaults);
    this._syncStatusReport = this._syncStatusReport.bind(this);
    this._reportListeners = [];
  }

  _createClass(ClientSync, [{
    key: 'init',
    value: function init() {
      this._sync = new _syncClient2['default'](function () {
        return _wavesAudio.audioContext.currentTime;
      });
      this._ready = false;

      this.viewCtor = this.options.viewCtor;
      this.view = this.createView();
    }

    /** @private */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientSync.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();
      this._sync.start(this.send, this.receive, this._syncStatusReport);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      _get(Object.getPrototypeOf(ClientSync.prototype), 'stop', this).call(this);
    }

    /**
     * Return the time in the local clock.
     * If no arguments are provided, returns the current local time (*i.e.* `audioContext.currentTime`).
     * @param {Number} syncTime Time in the sync clock (in seconds).
     * @return {Number} Time in the local clock corresponding to `syncTime` (in seconds).
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
     */
  }, {
    key: 'getSyncTime',
    value: function getSyncTime(localTime) {
      return this._sync.getSyncTime(localTime);
    }

    /**
     * Add a function to be called on each sync report
     * @param {Function} callback
     */
  }, {
    key: 'addListener',
    value: function addListener(callback) {
      this._reportListeners.push(callback);
    }
  }, {
    key: '_syncStatusReport',
    value: function _syncStatusReport(message, report) {
      if (message === 'sync:status') {
        if (report.status === 'training' || report.status === 'sync') {
          this._reportListeners.forEach(function (callback) {
            return callback(status, report);
          });

          if (!this._ready) {
            this._ready = true;
            this.ready();
          }
        }
      }
    }
  }]);

  return ClientSync;
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, ClientSync);

exports['default'] = ClientSync;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50U3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOztvQ0FDaEIsMEJBQTBCOzs7OzJCQUNoQyxpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7OzBCQUM1QixhQUFhOzs7O0FBRXBDLElBQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE0QjVCLFVBQVU7WUFBVixVQUFVOztBQUNILFdBRFAsVUFBVSxHQUNBOzBCQURWLFVBQVU7O0FBRVosK0JBRkUsVUFBVSw2Q0FFTixVQUFVLEVBQUUsSUFBSSxFQUFFOztBQUV4QixRQUFNLFFBQVEsR0FBRztBQUNmLGNBQVEsbUNBQWU7QUFDdkIsa0JBQVksRUFBRSxDQUFDO0tBRWhCLENBQUE7OztBQUVELFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsUUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0QsUUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztHQUM1Qjs7ZUFiRyxVQUFVOztXQWVWLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLEtBQUssR0FBRyw0QkFBZTtlQUFNLHlCQUFhLFdBQVc7T0FBQSxDQUFDLENBQUM7QUFDNUQsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7O0FBRXBCLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDdEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDL0I7Ozs7O1dBR0ksaUJBQUc7QUFDTixpQ0F6QkUsVUFBVSx1Q0F5QkU7O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQ2xCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFZCxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDbkU7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1osaUNBcENFLFVBQVUsc0NBb0NDO0tBQ2Q7Ozs7Ozs7Ozs7V0FRVyxzQkFBQyxRQUFRLEVBQUU7QUFDckIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUMxQzs7Ozs7Ozs7OztXQVFVLHFCQUFDLFNBQVMsRUFBRTtBQUNyQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzFDOzs7Ozs7OztXQU1XLHFCQUFDLFFBQVEsRUFBRTtBQUNyQixVQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3RDOzs7V0FFZ0IsMkJBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUNqQyxVQUFJLE9BQU8sS0FBSyxhQUFhLEVBQUU7QUFDN0IsWUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtBQUM1RCxjQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUTttQkFBTSxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztXQUFBLENBQUMsQ0FBQzs7QUFFdkUsY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDaEIsZ0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLGdCQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7V0FDZDtTQUNGO09BQ0Y7S0FDRjs7O1NBOUVHLFVBQVU7OztBQWlGaEIsZ0NBQWUsUUFBUSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQzs7cUJBRWpDLFVBQVUiLCJmaWxlIjoiL1VzZXJzL21hdHVzemV3c2tpL2Rldi9jb3NpbWEvbGliL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9zZXJ2aWNlcy9DbGllbnRTeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU3luY0NsaWVudCBmcm9tICdzeW5jL2NsaWVudCc7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzeW5jJztcblxuLyoqXG4gKiBbY2xpZW50XSBTeW5jaHJvbml6ZSB0aGUgbG9jYWwgY2xvY2sgb24gYSBtYXN0ZXIgY2xvY2sgc2hhcmVkIGJ5IHRoZSBzZXJ2ZXIgYW5kIHRoZSBjbGllbnRzLlxuICpcbiAqIEJvdGggdGhlIGNsaWVudHMgYW5kIHRoZSBzZXJ2ZXIgY2FuIHVzZSB0aGlzIG1hc3RlciBjbG9jayBhcyBhIGNvbW1vbiB0aW1lIHJlZmVyZW5jZS5cbiAqIEZvciBpbnN0YW5jZSwgdGhpcyBhbGxvd3MgYWxsIHRoZSBjbGllbnRzIHRvIGRvIHNvbWV0aGluZyBleGFjdGx5IGF0IHRoZSBzYW1lIHRpbWUsIHN1Y2ggYXMgYmxpbmtpbmcgdGhlIHNjcmVlbiBvciBwbGF5aW5nIGEgc291bmQgaW4gYSBzeW5jaHJvbml6ZWQgbWFubmVyLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcgKHRoYXQgZGlzcGxheXMgXCJDbG9jayBzeW5jaW5nLCBzdGFuZCBieeKAplwiLCB1bnRpbCB0aGUgdmVyeSBmaXJzdCBzeW5jaHJvbml6YXRpb24gcHJvY2VzcyBpcyBkb25lKS5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBhcyBzb29uIGFzIHRoZSBjbGllbnQgY2xvY2sgaXMgaW4gc3luYyB3aXRoIHRoZSBtYXN0ZXIgY2xvY2suXG4gKiBUaGVuLCB0aGUgc3luY2hyb25pemF0aW9uIHByb2Nlc3Mga2VlcHMgcnVubmluZyBpbiB0aGUgYmFja2dyb3VuZCB0byByZXN5bmNocm9uaXplIHRoZSBjbG9ja3MgZnJvbSB0aW1lcyB0byB0aW1lcy5cbiAqXG4gKiAqKk5vdGU6KiogdGhlIHNlcnZpY2UgaXMgYmFzZWQgb24gW2BnaXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jYF0oaHR0cHM6Ly9naXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jKS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyU3luYy5qc35TZXJ2ZXJTeW5jfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBzeW5jID0gc2VydmljZU1hbmFnZXIucmVxdWlyZSgnc2VydmljZTpzeW5jJyk7XG4gKlxuICogY29uc3Qgbm93TG9jYWwgPSBzeW5jLmdldExvY2FsVGltZSgpOyAvLyBjdXJyZW50IHRpbWUgaW4gbG9jYWwgY2xvY2sgdGltZVxuICogY29uc3Qgbm93U3luYyA9IHN5bmMuZ2V0U3luY1RpbWUoKTsgLy8gY3VycmVudCB0aW1lIGluIHN5bmMgY2xvY2sgdGltZVxuICogQGVtaXRzICdzeW5jOnN0YXRzJyBlYWNoIHRpbWUgdGhlIG1vZHVsZSAocmUpc3luY2hyb25pemVzIHRoZSBsb2NhbCBjbG9jayBvbiB0aGUgc3luYyBjbG9jay5cbiAqIFRoZSBgJ3N0YXR1cydgIGV2ZW50IGdvZXMgYWxvbmcgd2l0aCB0aGUgYHJlcG9ydGAgb2JqZWN0IHRoYXQgaGFzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqIC0gYHRpbWVPZmZzZXRgLCBjdXJyZW50IGVzdGltYXRpb24gb2YgdGhlIHRpbWUgb2Zmc2V0IGJldHdlZW4gdGhlIGNsaWVudCBjbG9jayBhbmQgdGhlIHN5bmMgY2xvY2s7XG4gKiAtIGB0cmF2ZWxUaW1lYCwgY3VycmVudCBlc3RpbWF0aW9uIG9mIHRoZSB0cmF2ZWwgdGltZSBmb3IgYSBtZXNzYWdlIHRvIGdvIGZyb20gdGhlIGNsaWVudCB0byB0aGUgc2VydmVyIGFuZCBiYWNrO1xuICogLSBgdHJhdmVsVGltZU1heGAsIGN1cnJlbnQgZXN0aW1hdGlvbiBvZiB0aGUgbWF4aW11bSB0cmF2ZWwgdGltZSBmb3IgYSBtZXNzYWdlIHRvIGdvIGZyb20gdGhlIGNsaWVudCB0byB0aGUgc2VydmVyIGFuZCBiYWNrLlxuICovXG5jbGFzcyBDbGllbnRTeW5jIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICB2aWV3Q3RvcjogU2VnbWVudGVkVmlldyxcbiAgICAgIHZpZXdQcmlvcml0eTogMyxcbiAgICAgIC8vIEB0b2RvIC0gYWRkIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzeW5jIG1vZHVsZVxuICAgIH1cblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0ID0gdGhpcy5fc3luY1N0YXR1c1JlcG9ydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3JlcG9ydExpc3RlbmVycyA9IFtdO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLl9zeW5jID0gbmV3IFN5bmNDbGllbnQoKCkgPT4gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcbiAgICB0aGlzLl9yZWFkeSA9IGZhbHNlO1xuXG4gICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2hvdygpO1xuICAgIHRoaXMuX3N5bmMuc3RhcnQodGhpcy5zZW5kLCB0aGlzLnJlY2VpdmUsIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0aW1lIGluIHRoZSBsb2NhbCBjbG9jay5cbiAgICogSWYgbm8gYXJndW1lbnRzIGFyZSBwcm92aWRlZCwgcmV0dXJucyB0aGUgY3VycmVudCBsb2NhbCB0aW1lICgqaS5lLiogYGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZWApLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3luY1RpbWUgVGltZSBpbiB0aGUgc3luYyBjbG9jayAoaW4gc2Vjb25kcykuXG4gICAqIEByZXR1cm4ge051bWJlcn0gVGltZSBpbiB0aGUgbG9jYWwgY2xvY2sgY29ycmVzcG9uZGluZyB0byBgc3luY1RpbWVgIChpbiBzZWNvbmRzKS5cbiAgICovXG4gIGdldExvY2FsVGltZShzeW5jVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldExvY2FsVGltZShzeW5jVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0aW1lIGluIHRoZSBzeW5jIGNsb2NrLlxuICAgKiBJZiBubyBhcmd1bWVudHMgYXJlIHByb3ZpZGVkLCByZXR1cm5zIHRoZSBjdXJyZW50IHN5bmMgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxvY2FsVGltZSBUaW1lIGluIHRoZSBsb2NhbCBjbG9jayAoaW4gc2Vjb25kcykuXG4gICAqIEByZXR1cm4ge051bWJlcn0gVGltZSBpbiB0aGUgc3luYyBjbG9jayBjb3JyZXNwb25kaW5nIHRvIGBsb2NhbFRpbWVgIChpbiBzZWNvbmRzKVxuICAgKi9cbiAgZ2V0U3luY1RpbWUobG9jYWxUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUobG9jYWxUaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgb24gZWFjaCBzeW5jIHJlcG9ydFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgYWRkTGlzdGVuZXIgKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fcmVwb3J0TGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgX3N5bmNTdGF0dXNSZXBvcnQobWVzc2FnZSwgcmVwb3J0KSB7XG4gICAgaWYgKG1lc3NhZ2UgPT09ICdzeW5jOnN0YXR1cycpIHtcbiAgICAgIGlmIChyZXBvcnQuc3RhdHVzID09PSAndHJhaW5pbmcnIHx8IHJlcG9ydC5zdGF0dXMgPT09ICdzeW5jJykge1xuICAgICAgICB0aGlzLl9yZXBvcnRMaXN0ZW5lcnMuZm9yRWFjaCgoY2FsbGJhY2spID0+ICBjYWxsYmFjayhzdGF0dXMsIHJlcG9ydCkpO1xuXG4gICAgICAgIGlmICghdGhpcy5fcmVhZHkpIHtcbiAgICAgICAgICB0aGlzLl9yZWFkeSA9IHRydWU7XG4gICAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENsaWVudFN5bmMpO1xuXG5leHBvcnQgZGVmYXVsdCBDbGllbnRTeW5jO1xuXG4iXX0=