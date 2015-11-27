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
 * [client] Synchronize the local clock on a master clock shared by the server and the clients.
 *
 * The module always has a view (that displays "Clock syncing, stand by…", until the very first synchronization process is done).
 *
 * The module finishes its initialization as soon as the client clock is in sync with the master clock.
 * Then, the synchronization process keeps running in the background to resynchronize the clocks from times to times.
 * @example const sync = new Sync();
 *
 * const nowLocal = sync.getLocalTime(); // current time in local clock time
 * const nowSync = sync.getSyncTime(); // current time in sync clock time
 */

var Sync = (function (_Module) {
  _inherits(Sync, _Module);

  /**
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
   * Start the synchronization process.
   * @private
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

  return Sync;
})(_Module3['default']);

exports['default'] = Sync;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOzswQkFDbkIsYUFBYTs7OztzQkFDakIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7OztJQWVSLElBQUk7WUFBSixJQUFJOzs7Ozs7OztBQU1aLFdBTlEsSUFBSSxHQU1HO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFOTCxJQUFJOztBQU9yQiwrQkFQaUIsSUFBSSw2Q0FPZixPQUFPLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLEVBQUU7O0FBRTlELFFBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxLQUFLLEdBQUcsNEJBQWU7YUFBTSx5QkFBYSxXQUFXO0tBQUEsQ0FBQyxDQUFDOztBQUU1RCxRQUFJLENBQUMsc0JBQXNCLENBQUMsMkRBQTJELENBQUMsQ0FBQztHQUMxRjs7Ozs7OztlQWJrQixJQUFJOztXQW1CbEIsaUJBQUc7OztBQUNOLGlDQXBCaUIsSUFBSSx1Q0FvQlA7QUFDZCxVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxvQkFBTyxJQUFJLEVBQUUsb0JBQU8sT0FBTyxFQUFFLFVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBSztBQUNoRSxjQUFLLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztPQUN4QyxDQUFDLENBQUM7S0FDSjs7Ozs7OztXQUtNLG1CQUFHLEVBRVQ7Ozs7Ozs7Ozs7QUFBQTs7O1dBU1csc0JBQUMsUUFBUSxFQUFFO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDMUM7Ozs7Ozs7Ozs7O1dBU1UscUJBQUMsU0FBUyxFQUFFO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDMUM7OztXQUVnQiwyQkFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQ2pDLFVBQUcsT0FBTyxLQUFLLGFBQWEsRUFBRTtBQUM1QixZQUFHLE1BQU0sQ0FBQyxNQUFNLEtBQUssVUFBVSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFO0FBQzNELGNBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsZ0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLGdCQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7V0FDYjtTQUNGO0FBQ0QsWUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDbEM7S0FDRjs7O1NBakVrQixJQUFJOzs7cUJBQUosSUFBSSIsImZpbGUiOiJzcmMvY2xpZW50L1N5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgU3luY0NsaWVudCBmcm9tICdzeW5jL2NsaWVudCc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gU3luY2hyb25pemUgdGhlIGxvY2FsIGNsb2NrIG9uIGEgbWFzdGVyIGNsb2NrIHNoYXJlZCBieSB0aGUgc2VydmVyIGFuZCB0aGUgY2xpZW50cy5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3ICh0aGF0IGRpc3BsYXlzIFwiQ2xvY2sgc3luY2luZywgc3RhbmQgYnnigKZcIiwgdW50aWwgdGhlIHZlcnkgZmlyc3Qgc3luY2hyb25pemF0aW9uIHByb2Nlc3MgaXMgZG9uZSkuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gYXMgc29vbiBhcyB0aGUgY2xpZW50IGNsb2NrIGlzIGluIHN5bmMgd2l0aCB0aGUgbWFzdGVyIGNsb2NrLlxuICogVGhlbiwgdGhlIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIGtlZXBzIHJ1bm5pbmcgaW4gdGhlIGJhY2tncm91bmQgdG8gcmVzeW5jaHJvbml6ZSB0aGUgY2xvY2tzIGZyb20gdGltZXMgdG8gdGltZXMuXG4gKiBAZXhhbXBsZSBjb25zdCBzeW5jID0gbmV3IFN5bmMoKTtcbiAqXG4gKiBjb25zdCBub3dMb2NhbCA9IHN5bmMuZ2V0TG9jYWxUaW1lKCk7IC8vIGN1cnJlbnQgdGltZSBpbiBsb2NhbCBjbG9jayB0aW1lXG4gKiBjb25zdCBub3dTeW5jID0gc3luYy5nZXRTeW5jVGltZSgpOyAvLyBjdXJyZW50IHRpbWUgaW4gc3luYyBjbG9jayB0aW1lXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5bmMgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nc3luYyddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc3luYycsIHRydWUsIG9wdGlvbnMuY29sb3IgfHwgJ2JsYWNrJyk7XG5cbiAgICB0aGlzLl9yZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY0NsaWVudCgoKSA9PiBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuXG4gICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KCc8cCBjbGFzcz1cInNvZnQtYmxpbmtcIj5DbG9jayBzeW5jaW5nLCBzdGFuZCBieSZoZWxsaXA7PC9wPicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBzeW5jaHJvbml6YXRpb24gcHJvY2Vzcy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5fc3luYy5zdGFydChjbGllbnQuc2VuZCwgY2xpZW50LnJlY2VpdmUsIChzdGF0dXMsIHJlcG9ydCkgPT4ge1xuICAgICAgdGhpcy5fc3luY1N0YXR1c1JlcG9ydChzdGF0dXMsIHJlcG9ydCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgLy8gVE9ET1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdGltZSBpbiB0aGUgbG9jYWwgY2xvY2suXG4gICAqIElmIG5vIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQsIHJldHVybnMgdGhlIGN1cnJlbnQgbG9jYWwgdGltZSAoKmkuZS4qIGBhdWRpb0NvbnRleHQuY3VycmVudFRpbWVgKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN5bmNUaW1lIFRpbWUgaW4gdGhlIHN5bmMgY2xvY2sgKGluIHNlY29uZHMpLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrIGNvcnJlc3BvbmRpbmcgdG8gYHN5bmNUaW1lYCAoaW4gc2Vjb25kcykuXG4gICAqIEB0b2RvIGFkZCBvcHRpb25hbCBhcmd1bWVudD9cbiAgICovXG4gIGdldExvY2FsVGltZShzeW5jVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldExvY2FsVGltZShzeW5jVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0aW1lIGluIHRoZSBzeW5jIGNsb2NrLlxuICAgKiBJZiBubyBhcmd1bWVudHMgYXJlIHByb3ZpZGVkLCByZXR1cm5zIHRoZSBjdXJyZW50IHN5bmMgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxvY2FsVGltZSBUaW1lIGluIHRoZSBsb2NhbCBjbG9jayAoaW4gc2Vjb25kcykuXG4gICAqIEByZXR1cm4ge051bWJlcn0gVGltZSBpbiB0aGUgc3luYyBjbG9jayBjb3JyZXNwb25kaW5nIHRvIGBsb2NhbFRpbWVgIChpbiBzZWNvbmRzKVxuICAgKiBAdG9kbyBhZGQgb3B0aW9uYWwgYXJndW1lbnQ/XG4gICAqL1xuICBnZXRTeW5jVGltZShsb2NhbFRpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZShsb2NhbFRpbWUpO1xuICB9XG5cbiAgX3N5bmNTdGF0dXNSZXBvcnQobWVzc2FnZSwgcmVwb3J0KSB7XG4gICAgaWYobWVzc2FnZSA9PT0gJ3N5bmM6c3RhdHVzJykge1xuICAgICAgaWYocmVwb3J0LnN0YXR1cyA9PT0gJ3RyYWluaW5nJyB8fCByZXBvcnQuc3RhdHVzID09PSAnc3luYycpIHtcbiAgICAgICAgaWYoIXRoaXMuX3JlYWR5KSB7XG4gICAgICAgICAgdGhpcy5fcmVhZHkgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmVtaXQoJ3N5bmM6c3RhdHVzJywgcmVwb3J0KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==