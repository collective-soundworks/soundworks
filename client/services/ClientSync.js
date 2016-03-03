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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudFN5bmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzswQkFBNkIsYUFBYTs7b0NBQ2hCLDBCQUEwQjs7OzsyQkFDaEMsaUJBQWlCOzs7O2tDQUNWLHdCQUF3Qjs7OzswQkFDNUIsYUFBYTs7OztBQUVwQyxJQUFNLFVBQVUsR0FBRyxjQUFjLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNEI1QixVQUFVO1lBQVYsVUFBVTs7QUFDSCxXQURQLFVBQVUsR0FDQTswQkFEVixVQUFVOztBQUVaLCtCQUZFLFVBQVUsNkNBRU4sVUFBVSxFQUFFLElBQUksRUFBRTs7QUFFeEIsUUFBTSxRQUFRLEdBQUc7QUFDZixjQUFRLG1DQUFlO0FBQ3ZCLGtCQUFZLEVBQUUsQ0FBQztLQUVoQixDQUFBOzs7QUFFRCxRQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNELFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7R0FDNUI7O2VBYkcsVUFBVTs7V0FlVixnQkFBRztBQUNMLFVBQUksQ0FBQyxLQUFLLEdBQUcsNEJBQWU7ZUFBTSx5QkFBYSxXQUFXO09BQUEsQ0FBQyxDQUFDO0FBQzVELFVBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDOztBQUVwQixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQ3RDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQy9COzs7OztXQUdJLGlCQUFHO0FBQ04saUNBekJFLFVBQVUsdUNBeUJFOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUNsQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWQsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1osVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ25FOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLGlDQXBDRSxVQUFVLHNDQW9DQztLQUNkOzs7Ozs7Ozs7O1dBUVcsc0JBQUMsUUFBUSxFQUFFO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDMUM7Ozs7Ozs7Ozs7V0FRVSxxQkFBQyxTQUFTLEVBQUU7QUFDckIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUMxQzs7Ozs7Ozs7V0FNVyxxQkFBQyxRQUFRLEVBQUU7QUFDckIsVUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN0Qzs7O1dBRWdCLDJCQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDakMsVUFBSSxPQUFPLEtBQUssYUFBYSxFQUFFO0FBQzdCLFlBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUU7QUFDNUQsY0FBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7bUJBQU0sUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7V0FBQSxDQUFDLENBQUM7O0FBRXZFLGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2hCLGdCQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixnQkFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1dBQ2Q7U0FDRjtPQUNGO0tBQ0Y7OztTQTlFRyxVQUFVOzs7QUFpRmhCLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7O3FCQUVqQyxVQUFVIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudFN5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi9kaXNwbGF5L1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTeW5jQ2xpZW50IGZyb20gJ3N5bmMvY2xpZW50JztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnN5bmMnO1xuXG4vKipcbiAqIFtjbGllbnRdIFN5bmNocm9uaXplIHRoZSBsb2NhbCBjbG9jayBvbiBhIG1hc3RlciBjbG9jayBzaGFyZWQgYnkgdGhlIHNlcnZlciBhbmQgdGhlIGNsaWVudHMuXG4gKlxuICogQm90aCB0aGUgY2xpZW50cyBhbmQgdGhlIHNlcnZlciBjYW4gdXNlIHRoaXMgbWFzdGVyIGNsb2NrIGFzIGEgY29tbW9uIHRpbWUgcmVmZXJlbmNlLlxuICogRm9yIGluc3RhbmNlLCB0aGlzIGFsbG93cyBhbGwgdGhlIGNsaWVudHMgdG8gZG8gc29tZXRoaW5nIGV4YWN0bHkgYXQgdGhlIHNhbWUgdGltZSwgc3VjaCBhcyBibGlua2luZyB0aGUgc2NyZWVuIG9yIHBsYXlpbmcgYSBzb3VuZCBpbiBhIHN5bmNocm9uaXplZCBtYW5uZXIuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgaGFzIGEgdmlldyAodGhhdCBkaXNwbGF5cyBcIkNsb2NrIHN5bmNpbmcsIHN0YW5kIGJ54oCmXCIsIHVudGlsIHRoZSB2ZXJ5IGZpcnN0IHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIGlzIGRvbmUpLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIGFzIHNvb24gYXMgdGhlIGNsaWVudCBjbG9jayBpcyBpbiBzeW5jIHdpdGggdGhlIG1hc3RlciBjbG9jay5cbiAqIFRoZW4sIHRoZSBzeW5jaHJvbml6YXRpb24gcHJvY2VzcyBrZWVwcyBydW5uaW5nIGluIHRoZSBiYWNrZ3JvdW5kIHRvIHJlc3luY2hyb25pemUgdGhlIGNsb2NrcyBmcm9tIHRpbWVzIHRvIHRpbWVzLlxuICpcbiAqICoqTm90ZToqKiB0aGUgc2VydmljZSBpcyBiYXNlZCBvbiBbYGdpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmNgXShodHRwczovL2dpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmMpLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJTeW5jLmpzflNlcnZlclN5bmN9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHN5bmMgPSBzZXJ2aWNlTWFuYWdlci5yZXF1aXJlKCdzZXJ2aWNlOnN5bmMnKTtcbiAqXG4gKiBjb25zdCBub3dMb2NhbCA9IHN5bmMuZ2V0TG9jYWxUaW1lKCk7IC8vIGN1cnJlbnQgdGltZSBpbiBsb2NhbCBjbG9jayB0aW1lXG4gKiBjb25zdCBub3dTeW5jID0gc3luYy5nZXRTeW5jVGltZSgpOyAvLyBjdXJyZW50IHRpbWUgaW4gc3luYyBjbG9jayB0aW1lXG4gKiBAZW1pdHMgJ3N5bmM6c3RhdHMnIGVhY2ggdGltZSB0aGUgbW9kdWxlIChyZSlzeW5jaHJvbml6ZXMgdGhlIGxvY2FsIGNsb2NrIG9uIHRoZSBzeW5jIGNsb2NrLlxuICogVGhlIGAnc3RhdHVzJ2AgZXZlbnQgZ29lcyBhbG9uZyB3aXRoIHRoZSBgcmVwb3J0YCBvYmplY3QgdGhhdCBoYXMgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICogLSBgdGltZU9mZnNldGAsIGN1cnJlbnQgZXN0aW1hdGlvbiBvZiB0aGUgdGltZSBvZmZzZXQgYmV0d2VlbiB0aGUgY2xpZW50IGNsb2NrIGFuZCB0aGUgc3luYyBjbG9jaztcbiAqIC0gYHRyYXZlbFRpbWVgLCBjdXJyZW50IGVzdGltYXRpb24gb2YgdGhlIHRyYXZlbCB0aW1lIGZvciBhIG1lc3NhZ2UgdG8gZ28gZnJvbSB0aGUgY2xpZW50IHRvIHRoZSBzZXJ2ZXIgYW5kIGJhY2s7XG4gKiAtIGB0cmF2ZWxUaW1lTWF4YCwgY3VycmVudCBlc3RpbWF0aW9uIG9mIHRoZSBtYXhpbXVtIHRyYXZlbCB0aW1lIGZvciBhIG1lc3NhZ2UgdG8gZ28gZnJvbSB0aGUgY2xpZW50IHRvIHRoZSBzZXJ2ZXIgYW5kIGJhY2suXG4gKi9cbmNsYXNzIENsaWVudFN5bmMgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHZpZXdDdG9yOiBTZWdtZW50ZWRWaWV3LFxuICAgICAgdmlld1ByaW9yaXR5OiAzLFxuICAgICAgLy8gQHRvZG8gLSBhZGQgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHN5bmMgbW9kdWxlXG4gICAgfVxuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQgPSB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fcmVwb3J0TGlzdGVuZXJzID0gW107XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY0NsaWVudCgoKSA9PiBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuICAgIHRoaXMuX3JlYWR5ID0gZmFsc2U7XG5cbiAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG4gICAgdGhpcy5fc3luYy5zdGFydCh0aGlzLnNlbmQsIHRoaXMucmVjZWl2ZSwgdGhpcy5fc3luY1N0YXR1c1JlcG9ydCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrLlxuICAgKiBJZiBubyBhcmd1bWVudHMgYXJlIHByb3ZpZGVkLCByZXR1cm5zIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUgKCppLmUuKiBgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lYCkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzeW5jVGltZSBUaW1lIGluIHRoZSBzeW5jIGNsb2NrIChpbiBzZWNvbmRzKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSBUaW1lIGluIHRoZSBsb2NhbCBjbG9jayBjb3JyZXNwb25kaW5nIHRvIGBzeW5jVGltZWAgKGluIHNlY29uZHMpLlxuICAgKi9cbiAgZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIHN5bmMgY2xvY2suXG4gICAqIElmIG5vIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQsIHJldHVybnMgdGhlIGN1cnJlbnQgc3luYyB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbG9jYWxUaW1lIFRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrIChpbiBzZWNvbmRzKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSBUaW1lIGluIHRoZSBzeW5jIGNsb2NrIGNvcnJlc3BvbmRpbmcgdG8gYGxvY2FsVGltZWAgKGluIHNlY29uZHMpXG4gICAqL1xuICBnZXRTeW5jVGltZShsb2NhbFRpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZShsb2NhbFRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbiBlYWNoIHN5bmMgcmVwb3J0XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBhZGRMaXN0ZW5lciAoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9yZXBvcnRMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICBfc3luY1N0YXR1c1JlcG9ydChtZXNzYWdlLCByZXBvcnQpIHtcbiAgICBpZiAobWVzc2FnZSA9PT0gJ3N5bmM6c3RhdHVzJykge1xuICAgICAgaWYgKHJlcG9ydC5zdGF0dXMgPT09ICd0cmFpbmluZycgfHwgcmVwb3J0LnN0YXR1cyA9PT0gJ3N5bmMnKSB7XG4gICAgICAgIHRoaXMuX3JlcG9ydExpc3RlbmVycy5mb3JFYWNoKChjYWxsYmFjaykgPT4gIGNhbGxiYWNrKHN0YXR1cywgcmVwb3J0KSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9yZWFkeSkge1xuICAgICAgICAgIHRoaXMuX3JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2xpZW50U3luYyk7XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudFN5bmM7XG5cbiJdfQ==