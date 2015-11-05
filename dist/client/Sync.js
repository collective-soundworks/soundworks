'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var Sync = require('sync/client');
var audioContext = require('waves-audio').audioContext;
var client = require('./client');
var ClientModule = require('./ClientModule');
// import client from './client.es6.js';
// import ClientModule from './ClientModule.es6.js';

/**
 * The {@link ClientSync} module takes care of the synchronization process on the client side.
 * It displays "Clock syncing, stand by…" until the very first synchronization process is done.
 * The {@link ClientSync} module calls its `done` method as soon as the client clock is in sync with the sync clock.
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

var ClientSync = (function (_ClientModule) {
  _inherits(ClientSync, _ClientModule);

  // export default class ClientSync extends ClientModule {
  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='sync'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   */

  function ClientSync() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientSync);

    _get(Object.getPrototypeOf(ClientSync.prototype), 'constructor', this).call(this, options.name || 'sync', true, options.color || 'black');

    this._ready = false;
    this._sync = new Sync(function () {
      return audioContext.currentTime;
    });

    this.setCenteredViewContent('<p class="soft-blink">Clock syncing, stand by&hellip;</p>');
  }

  /**
   * Starts the synchronization process.
   */

  _createClass(ClientSync, [{
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(ClientSync.prototype), 'start', this).call(this);
      this._sync.start(client.send, client.receive, function (status, report) {
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

  return ClientSync;
})(ClientModule);

module.exports = ClientSync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7QUFFYixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDcEMsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFlBQVksQ0FBQztBQUN6RCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW9CekMsVUFBVTtZQUFWLFVBQVU7Ozs7Ozs7Ozs7QUFRSCxXQVJQLFVBQVUsR0FRWTtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUnBCLFVBQVU7O0FBU1osK0JBVEUsVUFBVSw2Q0FTTixPQUFPLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLEVBQUU7O0FBRTlELFFBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUM7YUFBTSxZQUFZLENBQUMsV0FBVztLQUFBLENBQUMsQ0FBQzs7QUFFdEQsUUFBSSxDQUFDLHNCQUFzQixDQUFDLDJEQUEyRCxDQUFDLENBQUM7R0FDMUY7Ozs7OztlQWZHLFVBQVU7O1dBb0JULGlCQUFHOzs7QUFDTixpQ0FyQkUsVUFBVSx1Q0FxQkU7QUFDZCxVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFLO0FBQ2hFLGNBQUssaUJBQWlCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ3hDLENBQUMsQ0FBQztLQUNKOzs7V0FFTSxtQkFBRyxFQUVUOzs7Ozs7Ozs7O0FBQUE7OztXQVNXLHNCQUFDLFFBQVEsRUFBRTtBQUNyQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzFDOzs7Ozs7Ozs7OztXQVNVLHFCQUFDLFNBQVMsRUFBRTtBQUNyQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzFDOzs7V0FFZ0IsMkJBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUNqQyxVQUFHLE9BQU8sS0FBSyxhQUFhLEVBQUU7QUFDNUIsWUFBRyxNQUFNLENBQUMsTUFBTSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtBQUMzRCxjQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLGdCQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixnQkFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1dBQ2I7U0FDRjtBQUNELFlBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ2xDO0tBQ0Y7OztTQS9ERyxVQUFVO0dBQVMsWUFBWTs7QUFrRXJDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDIiwiZmlsZSI6InNyYy9jbGllbnQvU3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY29uc3QgU3luYyA9IHJlcXVpcmUoJ3N5bmMvY2xpZW50Jyk7XG5jb25zdCBhdWRpb0NvbnRleHQgPSByZXF1aXJlKCd3YXZlcy1hdWRpbycpLmF1ZGlvQ29udGV4dDtcbmNvbnN0IGNsaWVudCA9IHJlcXVpcmUoJy4vY2xpZW50Jyk7XG5jb25zdCBDbGllbnRNb2R1bGUgPSByZXF1aXJlKCcuL0NsaWVudE1vZHVsZScpO1xuLy8gaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudC5lczYuanMnO1xuLy8gaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZS5lczYuanMnO1xuXG4vKipcbiAqIFRoZSB7QGxpbmsgQ2xpZW50U3luY30gbW9kdWxlIHRha2VzIGNhcmUgb2YgdGhlIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAqIEl0IGRpc3BsYXlzIFwiQ2xvY2sgc3luY2luZywgc3RhbmQgYnnigKZcIiB1bnRpbCB0aGUgdmVyeSBmaXJzdCBzeW5jaHJvbml6YXRpb24gcHJvY2VzcyBpcyBkb25lLlxuICogVGhlIHtAbGluayBDbGllbnRTeW5jfSBtb2R1bGUgY2FsbHMgaXRzIGBkb25lYCBtZXRob2QgYXMgc29vbiBhcyB0aGUgY2xpZW50IGNsb2NrIGlzIGluIHN5bmMgd2l0aCB0aGUgc3luYyBjbG9jay5cbiAqIFRoZW4sIHRoZSBzeW5jaHJvbml6YXRpb24gcHJvY2VzcyBrZWVwcyBydW5uaW5nIGluIHRoZSBiYWNrZ3JvdW5kIHRvIHJlc3luY2hyb25pemUgdGhlIGNsb2NrcyBmcm9tIHRpbWVzIHRvIHRpbWVzLlxuICogQGV4YW1wbGVcbiAqIC8vIFJlcXVpcmUgdGhlIFNvdW5kd29ya3MgbGlicmFyeSAoY2xpZW50IHNpZGUpXG4gKiBjb25zdCBjbGllbnRTaWRlID0gcmVxdWlyZSgnc291bmR3b3Jrcy9jbGllbnQnKTsgLy8gVE9ET1xuICpcbiAqIC8vIENyZWF0ZSBTeW5jIG1vZHVsZVxuICogY29uc3Qgc3luYyA9IG5ldyBjbGllbnRTaWRlLlN5bmMoKTtcbiAqXG4gKiAvLyBHZXQgdGltZXNcbiAqIGNvbnN0IG5vd0xvY2FsID0gc3luYy5nZXRMb2NhbFRpbWUoKTsgLy8gY3VycmVudCB0aW1lIGluIGxvY2FsIGNsb2NrIHRpbWVcbiAqIGNvbnN0IG5vd1N5bmMgPSBzeW5jLmdldFN5bmNUaW1lKCk7IC8vIGN1cnJlbnQgdGltZSBpbiBzeW5jIGNsb2NrIHRpbWVcbiAqL1xuY2xhc3MgQ2xpZW50U3luYyBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRTeW5jIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLiBBbHdheXMgaGFzIGEgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nc3luYyddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc3luYycsIHRydWUsIG9wdGlvbnMuY29sb3IgfHwgJ2JsYWNrJyk7XG5cbiAgICB0aGlzLl9yZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luYygoKSA9PiBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuXG4gICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KCc8cCBjbGFzcz1cInNvZnQtYmxpbmtcIj5DbG9jayBzeW5jaW5nLCBzdGFuZCBieSZoZWxsaXA7PC9wPicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgc3luY2hyb25pemF0aW9uIHByb2Nlc3MuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIHRoaXMuX3N5bmMuc3RhcnQoY2xpZW50LnNlbmQsIGNsaWVudC5yZWNlaXZlLCAoc3RhdHVzLCByZXBvcnQpID0+IHtcbiAgICAgIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQoc3RhdHVzLCByZXBvcnQpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVzdGFydCgpIHtcbiAgICAvLyBUT0RPXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdGltZSBpbiB0aGUgbG9jYWwgY2xvY2suXG4gICAqIElmIG5vIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQsIHJldHVybnMgdGhlIGN1cnJlbnQgbG9jYWwgdGltZSAoKmkuZS4qIGBhdWRpb0NvbnRleHQuY3VycmVudFRpbWVgKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN5bmNUaW1lIFRpbWUgaW4gdGhlIHN5bmMgY2xvY2sgKGluIHNlY29uZHMpLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrIGNvcnJlc3BvbmRpbmcgdG8gYHN5bmNUaW1lYCAoaW4gc2Vjb25kcykuXG4gICAqIEB0b2RvIGFkZCBvcHRpb25hbCBhcmd1bWVudD9cbiAgICovXG4gIGdldExvY2FsVGltZShzeW5jVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldExvY2FsVGltZShzeW5jVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdGltZSBpbiB0aGUgc3luYyBjbG9jay5cbiAgICogSWYgbm8gYXJndW1lbnRzIGFyZSBwcm92aWRlZCwgcmV0dXJucyB0aGUgY3VycmVudCBzeW5jIHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsb2NhbFRpbWUgVGltZSBpbiB0aGUgbG9jYWwgY2xvY2sgKGluIHNlY29uZHMpLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRpbWUgaW4gdGhlIHN5bmMgY2xvY2sgY29ycmVzcG9uZGluZyB0byBgbG9jYWxUaW1lYCAoaW4gc2Vjb25kcylcbiAgICogQHRvZG8gYWRkIG9wdGlvbmFsIGFyZ3VtZW50P1xuICAgKi9cbiAgZ2V0U3luY1RpbWUobG9jYWxUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUobG9jYWxUaW1lKTtcbiAgfVxuXG4gIF9zeW5jU3RhdHVzUmVwb3J0KG1lc3NhZ2UsIHJlcG9ydCkge1xuICAgIGlmKG1lc3NhZ2UgPT09ICdzeW5jOnN0YXR1cycpIHtcbiAgICAgIGlmKHJlcG9ydC5zdGF0dXMgPT09ICd0cmFpbmluZycgfHwgcmVwb3J0LnN0YXR1cyA9PT0gJ3N5bmMnKSB7XG4gICAgICAgIGlmKCF0aGlzLl9yZWFkeSkge1xuICAgICAgICAgIHRoaXMuX3JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5lbWl0KCdzeW5jOnN0YXR1cycsIHJlcG9ydCk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xpZW50U3luYztcbiJdfQ==