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
 * const sync = serviceManager.getInstance('service:sync');
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
  }, {
    key: '_syncStatusReport',
    value: function _syncStatusReport(message, report) {
      console.log(message, report);

      if (message === 'sync:status') {
        if (report.status === 'training' || report.status === 'sync') {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50U3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOztvQ0FDaEIsMEJBQTBCOzs7OzJCQUNoQyxpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7OzBCQUM1QixhQUFhOzs7O0FBRXBDLElBQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE0QjVCLFVBQVU7WUFBVixVQUFVOztBQUNILFdBRFAsVUFBVSxHQUNBOzBCQURWLFVBQVU7O0FBRVosK0JBRkUsVUFBVSw2Q0FFTixVQUFVLEVBQUUsSUFBSSxFQUFFOztBQUV4QixRQUFNLFFBQVEsR0FBRztBQUNmLGNBQVEsbUNBQWU7QUFDdkIsa0JBQVksRUFBRSxDQUFDO0tBRWhCLENBQUE7OztBQUVELFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsUUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDNUQ7O2VBWkcsVUFBVTs7V0FjVixnQkFBRztBQUNMLFVBQUksQ0FBQyxLQUFLLEdBQUcsNEJBQWU7ZUFBTSx5QkFBYSxXQUFXO09BQUEsQ0FBQyxDQUFDO0FBQzVELFVBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDOztBQUVwQixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQ3RDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQy9COzs7OztXQUdJLGlCQUFHO0FBQ04saUNBeEJFLFVBQVUsdUNBd0JFOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUNsQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWQsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1osVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ25FOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLGlDQW5DRSxVQUFVLHNDQW1DQztLQUNkOzs7Ozs7Ozs7O1dBUVcsc0JBQUMsUUFBUSxFQUFFO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDMUM7Ozs7Ozs7Ozs7V0FRVSxxQkFBQyxTQUFTLEVBQUU7QUFDckIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUMxQzs7O1dBRWdCLDJCQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDakMsYUFBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRTdCLFVBQUksT0FBTyxLQUFLLGFBQWEsRUFBRTtBQUM3QixZQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssVUFBVSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFO0FBQzVELGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2hCLGdCQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixnQkFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1dBQ2Q7U0FDRjtPQUNGO0tBQ0Y7OztTQXJFRyxVQUFVOzs7QUF3RWhCLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7O3FCQUVqQyxVQUFVIiwiZmlsZSI6InNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50U3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFN5bmNDbGllbnQgZnJvbSAnc3luYy9jbGllbnQnO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c3luYyc7XG5cbi8qKlxuICogW2NsaWVudF0gU3luY2hyb25pemUgdGhlIGxvY2FsIGNsb2NrIG9uIGEgbWFzdGVyIGNsb2NrIHNoYXJlZCBieSB0aGUgc2VydmVyIGFuZCB0aGUgY2xpZW50cy5cbiAqXG4gKiBCb3RoIHRoZSBjbGllbnRzIGFuZCB0aGUgc2VydmVyIGNhbiB1c2UgdGhpcyBtYXN0ZXIgY2xvY2sgYXMgYSBjb21tb24gdGltZSByZWZlcmVuY2UuXG4gKiBGb3IgaW5zdGFuY2UsIHRoaXMgYWxsb3dzIGFsbCB0aGUgY2xpZW50cyB0byBkbyBzb21ldGhpbmcgZXhhY3RseSBhdCB0aGUgc2FtZSB0aW1lLCBzdWNoIGFzIGJsaW5raW5nIHRoZSBzY3JlZW4gb3IgcGxheWluZyBhIHNvdW5kIGluIGEgc3luY2hyb25pemVkIG1hbm5lci5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3ICh0aGF0IGRpc3BsYXlzIFwiQ2xvY2sgc3luY2luZywgc3RhbmQgYnnigKZcIiwgdW50aWwgdGhlIHZlcnkgZmlyc3Qgc3luY2hyb25pemF0aW9uIHByb2Nlc3MgaXMgZG9uZSkuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gYXMgc29vbiBhcyB0aGUgY2xpZW50IGNsb2NrIGlzIGluIHN5bmMgd2l0aCB0aGUgbWFzdGVyIGNsb2NrLlxuICogVGhlbiwgdGhlIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIGtlZXBzIHJ1bm5pbmcgaW4gdGhlIGJhY2tncm91bmQgdG8gcmVzeW5jaHJvbml6ZSB0aGUgY2xvY2tzIGZyb20gdGltZXMgdG8gdGltZXMuXG4gKlxuICogKipOb3RlOioqIHRoZSBzZXJ2aWNlIGlzIGJhc2VkIG9uIFtgZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luY2BdKGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luYykuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlclN5bmMuanN+U2VydmVyU3luY30gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3Qgc3luYyA9IHNlcnZpY2VNYW5hZ2VyLmdldEluc3RhbmNlKCdzZXJ2aWNlOnN5bmMnKTtcbiAqXG4gKiBjb25zdCBub3dMb2NhbCA9IHN5bmMuZ2V0TG9jYWxUaW1lKCk7IC8vIGN1cnJlbnQgdGltZSBpbiBsb2NhbCBjbG9jayB0aW1lXG4gKiBjb25zdCBub3dTeW5jID0gc3luYy5nZXRTeW5jVGltZSgpOyAvLyBjdXJyZW50IHRpbWUgaW4gc3luYyBjbG9jayB0aW1lXG4gKiBAZW1pdHMgJ3N5bmM6c3RhdHMnIGVhY2ggdGltZSB0aGUgbW9kdWxlIChyZSlzeW5jaHJvbml6ZXMgdGhlIGxvY2FsIGNsb2NrIG9uIHRoZSBzeW5jIGNsb2NrLlxuICogVGhlIGAnc3RhdHVzJ2AgZXZlbnQgZ29lcyBhbG9uZyB3aXRoIHRoZSBgcmVwb3J0YCBvYmplY3QgdGhhdCBoYXMgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICogLSBgdGltZU9mZnNldGAsIGN1cnJlbnQgZXN0aW1hdGlvbiBvZiB0aGUgdGltZSBvZmZzZXQgYmV0d2VlbiB0aGUgY2xpZW50IGNsb2NrIGFuZCB0aGUgc3luYyBjbG9jaztcbiAqIC0gYHRyYXZlbFRpbWVgLCBjdXJyZW50IGVzdGltYXRpb24gb2YgdGhlIHRyYXZlbCB0aW1lIGZvciBhIG1lc3NhZ2UgdG8gZ28gZnJvbSB0aGUgY2xpZW50IHRvIHRoZSBzZXJ2ZXIgYW5kIGJhY2s7XG4gKiAtIGB0cmF2ZWxUaW1lTWF4YCwgY3VycmVudCBlc3RpbWF0aW9uIG9mIHRoZSBtYXhpbXVtIHRyYXZlbCB0aW1lIGZvciBhIG1lc3NhZ2UgdG8gZ28gZnJvbSB0aGUgY2xpZW50IHRvIHRoZSBzZXJ2ZXIgYW5kIGJhY2suXG4gKi9cbmNsYXNzIENsaWVudFN5bmMgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHZpZXdDdG9yOiBTZWdtZW50ZWRWaWV3LFxuICAgICAgdmlld1ByaW9yaXR5OiAzLFxuICAgICAgLy8gQHRvZG8gLSBhZGQgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHN5bmMgbW9kdWxlXG4gICAgfVxuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQgPSB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0LmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY0NsaWVudCgoKSA9PiBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuICAgIHRoaXMuX3JlYWR5ID0gZmFsc2U7XG5cbiAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG4gICAgdGhpcy5fc3luYy5zdGFydCh0aGlzLnNlbmQsIHRoaXMucmVjZWl2ZSwgdGhpcy5fc3luY1N0YXR1c1JlcG9ydCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrLlxuICAgKiBJZiBubyBhcmd1bWVudHMgYXJlIHByb3ZpZGVkLCByZXR1cm5zIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUgKCppLmUuKiBgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lYCkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzeW5jVGltZSBUaW1lIGluIHRoZSBzeW5jIGNsb2NrIChpbiBzZWNvbmRzKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSBUaW1lIGluIHRoZSBsb2NhbCBjbG9jayBjb3JyZXNwb25kaW5nIHRvIGBzeW5jVGltZWAgKGluIHNlY29uZHMpLlxuICAgKi9cbiAgZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIHN5bmMgY2xvY2suXG4gICAqIElmIG5vIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQsIHJldHVybnMgdGhlIGN1cnJlbnQgc3luYyB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbG9jYWxUaW1lIFRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrIChpbiBzZWNvbmRzKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSBUaW1lIGluIHRoZSBzeW5jIGNsb2NrIGNvcnJlc3BvbmRpbmcgdG8gYGxvY2FsVGltZWAgKGluIHNlY29uZHMpXG4gICAqL1xuICBnZXRTeW5jVGltZShsb2NhbFRpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZShsb2NhbFRpbWUpO1xuICB9XG5cbiAgX3N5bmNTdGF0dXNSZXBvcnQobWVzc2FnZSwgcmVwb3J0KSB7XG4gICAgY29uc29sZS5sb2cobWVzc2FnZSwgcmVwb3J0KTtcblxuICAgIGlmIChtZXNzYWdlID09PSAnc3luYzpzdGF0dXMnKSB7XG4gICAgICBpZiAocmVwb3J0LnN0YXR1cyA9PT0gJ3RyYWluaW5nJyB8fCByZXBvcnQuc3RhdHVzID09PSAnc3luYycpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9yZWFkeSkge1xuICAgICAgICAgIHRoaXMuX3JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2xpZW50U3luYyk7XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudFN5bmM7XG5cbiJdfQ==