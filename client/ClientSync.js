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
      this.view = this.createDefaultView();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50U3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOzswQkFDbkIsYUFBYTs7OztzQkFDakIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7b0NBQ2YseUJBQXlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEyQjlCLFVBQVU7WUFBVixVQUFVOzs7Ozs7OztBQU1sQixXQU5RLFVBQVUsR0FNSDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTkwsVUFBVTs7QUFPM0IsK0JBUGlCLFVBQVUsNkNBT3JCLE9BQU8sQ0FBQyxJQUFJLElBQUksTUFBTSxFQUFFLE9BQU8sRUFBRTs7QUFFdkMsUUFBSSxDQUFDLEtBQUssR0FBRyw0QkFBZTthQUFNLHlCQUFhLFdBQVc7S0FBQSxDQUFDLENBQUM7QUFDNUQsUUFBSSxDQUFDLFFBQVEsR0FBRyxxQ0FBaUIsT0FBTyxDQUFDLFFBQVEsQ0FBQzs7QUFFbEQsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ2I7O2VBYmtCLFVBQVU7O1dBZXpCLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDcEIsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztLQUN0Qzs7Ozs7Ozs7V0FNSSxpQkFBRzs7O0FBQ04saUNBekJpQixVQUFVLHVDQXlCYjtBQUNkLFVBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUs7QUFDNUQsY0FBSyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDeEMsQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7V0FLTSxtQkFBRyxFQUVUOzs7Ozs7Ozs7O0FBQUE7OztXQVNXLHNCQUFDLFFBQVEsRUFBRTtBQUNyQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzFDOzs7Ozs7Ozs7OztXQVNVLHFCQUFDLFNBQVMsRUFBRTtBQUNyQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzFDOzs7V0FFZ0IsMkJBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUNqQyxVQUFJLE9BQU8sS0FBSyxhQUFhLEVBQUU7QUFDN0IsWUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtBQUM1RCxjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNoQixnQkFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsZ0JBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztXQUNiO1NBQ0Y7QUFDRCxZQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztPQUM3QjtLQUNGOzs7U0F0RWtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50U3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBTeW5jQ2xpZW50IGZyb20gJ3N5bmMvY2xpZW50JztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5cbi8qKlxuICogW2NsaWVudF0gU3luY2hyb25pemUgdGhlIGxvY2FsIGNsb2NrIG9uIGEgbWFzdGVyIGNsb2NrIHNoYXJlZCBieSB0aGUgc2VydmVyIGFuZCB0aGUgY2xpZW50cy5cbiAqXG4gKiBCb3RoIHRoZSBjbGllbnRzIGFuZCB0aGUgc2VydmVyIGNhbiB1c2UgdGhpcyBtYXN0ZXIgY2xvY2sgYXMgYSBjb21tb24gdGltZSByZWZlcmVuY2UuXG4gKiBGb3IgaW5zdGFuY2UsIHRoaXMgYWxsb3dzIGFsbCB0aGUgY2xpZW50cyB0byBkbyBzb21ldGhpbmcgZXhhY3RseSBhdCB0aGUgc2FtZSB0aW1lLCBzdWNoIGFzIGJsaW5raW5nIHRoZSBzY3JlZW4gb3IgcGxheWluZyBhIHNvdW5kIGluIGEgc3luY2hyb25pemVkIG1hbm5lci5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3ICh0aGF0IGRpc3BsYXlzIFwiQ2xvY2sgc3luY2luZywgc3RhbmQgYnnigKZcIiwgdW50aWwgdGhlIHZlcnkgZmlyc3Qgc3luY2hyb25pemF0aW9uIHByb2Nlc3MgaXMgZG9uZSkuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gYXMgc29vbiBhcyB0aGUgY2xpZW50IGNsb2NrIGlzIGluIHN5bmMgd2l0aCB0aGUgbWFzdGVyIGNsb2NrLlxuICogVGhlbiwgdGhlIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIGtlZXBzIHJ1bm5pbmcgaW4gdGhlIGJhY2tncm91bmQgdG8gcmVzeW5jaHJvbml6ZSB0aGUgY2xvY2tzIGZyb20gdGltZXMgdG8gdGltZXMuXG4gKlxuICogKipOb3RlOioqIHRoZSBtb2R1bGUgaXMgYmFzZWQgb24gW2BnaXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jYF0oaHR0cHM6Ly9naXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jKS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyU3luYy5qc35TZXJ2ZXJTeW5jfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICpcbiAqIEBleGFtcGxlIGNvbnN0IHN5bmMgPSBuZXcgQ2xpZW50U3luYygpO1xuICpcbiAqIGNvbnN0IG5vd0xvY2FsID0gc3luYy5nZXRMb2NhbFRpbWUoKTsgLy8gY3VycmVudCB0aW1lIGluIGxvY2FsIGNsb2NrIHRpbWVcbiAqIGNvbnN0IG5vd1N5bmMgPSBzeW5jLmdldFN5bmNUaW1lKCk7IC8vIGN1cnJlbnQgdGltZSBpbiBzeW5jIGNsb2NrIHRpbWVcbiAqIEBlbWl0cyAnc3luYzpzdGF0cycgZWFjaCB0aW1lIHRoZSBtb2R1bGUgKHJlKXN5bmNocm9uaXplcyB0aGUgbG9jYWwgY2xvY2sgb24gdGhlIHN5bmMgY2xvY2suXG4gKiBUaGUgYCdzeW5jOnN0YXRzJ2AgZXZlbnQgZ29lcyBhbG9uZyB3aXRoIHRoZSBgcmVwb3J0YCBvYmplY3QgdGhhdCBoYXMgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICogLSBgdGltZU9mZnNldGAsIGN1cnJlbnQgZXN0aW1hdGlvbiBvZiB0aGUgdGltZSBvZmZzZXQgYmV0d2VlbiB0aGUgY2xpZW50IGNsb2NrIGFuZCB0aGUgc3luYyBjbG9jaztcbiAqIC0gYHRyYXZlbFRpbWVgLCBjdXJyZW50IGVzdGltYXRpb24gb2YgdGhlIHRyYXZlbCB0aW1lIGZvciBhIG1lc3NhZ2UgdG8gZ28gZnJvbSB0aGUgY2xpZW50IHRvIHRoZSBzZXJ2ZXIgYW5kIGJhY2s7XG4gKiAtIGB0cmF2ZWxUaW1lTWF4YCwgY3VycmVudCBlc3RpbWF0aW9uIG9mIHRoZSBtYXhpbXVtIHRyYXZlbCB0aW1lIGZvciBhIG1lc3NhZ2UgdG8gZ28gZnJvbSB0aGUgY2xpZW50IHRvIHRoZSBzZXJ2ZXIgYW5kIGJhY2suXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFN5bmMgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nc3luYyddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc3luYycsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fc3luYyA9IG5ldyBTeW5jQ2xpZW50KCgpID0+IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgdGhpcy52aWV3Q3RvciA9IFNlZ21lbnRlZFZpZXcgfHzCoG9wdGlvbnMudmlld0N0b3I7XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5fcmVhZHkgPSBmYWxzZTtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZURlZmF1bHRWaWV3KCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLl9zeW5jLnN0YXJ0KHRoaXMuc2VuZCwgdGhpcy5yZWNlaXZlLCAoc3RhdHVzLCByZXBvcnQpID0+IHtcbiAgICAgIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQoc3RhdHVzLCByZXBvcnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIC8vIFRPRE9cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrLlxuICAgKiBJZiBubyBhcmd1bWVudHMgYXJlIHByb3ZpZGVkLCByZXR1cm5zIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUgKCppLmUuKiBgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lYCkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzeW5jVGltZSBUaW1lIGluIHRoZSBzeW5jIGNsb2NrIChpbiBzZWNvbmRzKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSBUaW1lIGluIHRoZSBsb2NhbCBjbG9jayBjb3JyZXNwb25kaW5nIHRvIGBzeW5jVGltZWAgKGluIHNlY29uZHMpLlxuICAgKiBAdG9kbyBhZGQgb3B0aW9uYWwgYXJndW1lbnQ/XG4gICAqL1xuICBnZXRMb2NhbFRpbWUoc3luY1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRMb2NhbFRpbWUoc3luY1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdGltZSBpbiB0aGUgc3luYyBjbG9jay5cbiAgICogSWYgbm8gYXJndW1lbnRzIGFyZSBwcm92aWRlZCwgcmV0dXJucyB0aGUgY3VycmVudCBzeW5jIHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsb2NhbFRpbWUgVGltZSBpbiB0aGUgbG9jYWwgY2xvY2sgKGluIHNlY29uZHMpLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRpbWUgaW4gdGhlIHN5bmMgY2xvY2sgY29ycmVzcG9uZGluZyB0byBgbG9jYWxUaW1lYCAoaW4gc2Vjb25kcylcbiAgICogQHRvZG8gYWRkIG9wdGlvbmFsIGFyZ3VtZW50P1xuICAgKi9cbiAgZ2V0U3luY1RpbWUobG9jYWxUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUobG9jYWxUaW1lKTtcbiAgfVxuXG4gIF9zeW5jU3RhdHVzUmVwb3J0KG1lc3NhZ2UsIHJlcG9ydCkge1xuICAgIGlmIChtZXNzYWdlID09PSAnc3luYzpzdGF0dXMnKSB7XG4gICAgICBpZiAocmVwb3J0LnN0YXR1cyA9PT0gJ3RyYWluaW5nJyB8fCByZXBvcnQuc3RhdHVzID09PSAnc3luYycpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9yZWFkeSkge1xuICAgICAgICAgIHRoaXMuX3JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5lbWl0KCdzdGF0dXMnLCByZXBvcnQpO1xuICAgIH1cbiAgfVxufVxuIl19