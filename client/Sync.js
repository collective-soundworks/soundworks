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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOzswQkFDbkIsYUFBYTs7OztzQkFDakIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFtQlIsSUFBSTtZQUFKLElBQUk7Ozs7Ozs7OztBQU9aLFdBUFEsSUFBSSxHQU9HO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFQTCxJQUFJOztBQVFyQiwrQkFSaUIsSUFBSSw2Q0FRZixPQUFPLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLEVBQUU7O0FBRTlELFFBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxLQUFLLEdBQUcsNEJBQWU7YUFBTSx5QkFBYSxXQUFXO0tBQUEsQ0FBQyxDQUFDOztBQUU1RCxRQUFJLENBQUMsc0JBQXNCLENBQUMsMkRBQTJELENBQUMsQ0FBQztHQUMxRjs7Ozs7OztlQWRrQixJQUFJOztXQW9CbEIsaUJBQUc7OztBQUNOLGlDQXJCaUIsSUFBSSx1Q0FxQlA7QUFDZCxVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxvQkFBTyxJQUFJLEVBQUUsb0JBQU8sT0FBTyxFQUFFLFVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBSztBQUNoRSxjQUFLLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztPQUN4QyxDQUFDLENBQUM7S0FDSjs7Ozs7OztXQUtNLG1CQUFHLEVBRVQ7Ozs7Ozs7Ozs7QUFBQTs7O1dBU1csc0JBQUMsUUFBUSxFQUFFO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDMUM7Ozs7Ozs7Ozs7O1dBU1UscUJBQUMsU0FBUyxFQUFFO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDMUM7OztXQUVnQiwyQkFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQ2pDLFVBQUcsT0FBTyxLQUFLLGFBQWEsRUFBRTtBQUM1QixZQUFHLE1BQU0sQ0FBQyxNQUFNLEtBQUssVUFBVSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFO0FBQzNELGNBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsZ0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLGdCQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7V0FDYjtTQUNGO0FBQ0QsWUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDbEM7S0FDRjs7O1NBbEVrQixJQUFJOzs7cUJBQUosSUFBSSIsImZpbGUiOiJzcmMvY2xpZW50L1N5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgU3luY0NsaWVudCBmcm9tICdzeW5jL2NsaWVudCc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbi8qKlxuICogVGhlIHtAbGluayBTeW5jfSBtb2R1bGUgdGFrZXMgY2FyZSBvZiB0aGUgc3luY2hyb25pemF0aW9uIHByb2Nlc3Mgb24gdGhlIGNsaWVudCBzaWRlLlxuICogSXQgZGlzcGxheXMgXCJDbG9jayBzeW5jaW5nLCBzdGFuZCBieeKAplwiIHVudGlsIHRoZSB2ZXJ5IGZpcnN0IHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIGlzIGRvbmUuXG4gKiBUaGUge0BsaW5rIFN5bmN9IG1vZHVsZSBjYWxscyBpdHMgYGRvbmVgIG1ldGhvZCBhcyBzb29uIGFzIHRoZSBjbGllbnQgY2xvY2sgaXMgaW4gc3luYyB3aXRoIHRoZSBzeW5jIGNsb2NrLlxuICogVGhlbiwgdGhlIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIGtlZXBzIHJ1bm5pbmcgaW4gdGhlIGJhY2tncm91bmQgdG8gcmVzeW5jaHJvbml6ZSB0aGUgY2xvY2tzIGZyb20gdGltZXMgdG8gdGltZXMuXG4gKiBAZXhhbXBsZVxuICogLy8gUmVxdWlyZSB0aGUgU291bmR3b3JrcyBsaWJyYXJ5IChjbGllbnQgc2lkZSlcbiAqIGNvbnN0IGNsaWVudFNpZGUgPSByZXF1aXJlKCdzb3VuZHdvcmtzL2NsaWVudCcpOyAvLyBUT0RPXG4gKlxuICogLy8gQ3JlYXRlIFN5bmMgbW9kdWxlXG4gKiBjb25zdCBzeW5jID0gbmV3IGNsaWVudFNpZGUuU3luYygpO1xuICpcbiAqIC8vIEdldCB0aW1lc1xuICogY29uc3Qgbm93TG9jYWwgPSBzeW5jLmdldExvY2FsVGltZSgpOyAvLyBjdXJyZW50IHRpbWUgaW4gbG9jYWwgY2xvY2sgdGltZVxuICogY29uc3Qgbm93U3luYyA9IHN5bmMuZ2V0U3luY1RpbWUoKTsgLy8gY3VycmVudCB0aW1lIGluIHN5bmMgY2xvY2sgdGltZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTeW5jIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLiBBbHdheXMgaGFzIGEgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nc3luYyddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc3luYycsIHRydWUsIG9wdGlvbnMuY29sb3IgfHwgJ2JsYWNrJyk7XG5cbiAgICB0aGlzLl9yZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY0NsaWVudCgoKSA9PiBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuXG4gICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KCc8cCBjbGFzcz1cInNvZnQtYmxpbmtcIj5DbG9jayBzeW5jaW5nLCBzdGFuZCBieSZoZWxsaXA7PC9wPicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgc3luY2hyb25pemF0aW9uIHByb2Nlc3MuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIHRoaXMuX3N5bmMuc3RhcnQoY2xpZW50LnNlbmQsIGNsaWVudC5yZWNlaXZlLCAoc3RhdHVzLCByZXBvcnQpID0+IHtcbiAgICAgIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQoc3RhdHVzLCByZXBvcnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIC8vIFRPRE9cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0aW1lIGluIHRoZSBsb2NhbCBjbG9jay5cbiAgICogSWYgbm8gYXJndW1lbnRzIGFyZSBwcm92aWRlZCwgcmV0dXJucyB0aGUgY3VycmVudCBsb2NhbCB0aW1lICgqaS5lLiogYGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZWApLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3luY1RpbWUgVGltZSBpbiB0aGUgc3luYyBjbG9jayAoaW4gc2Vjb25kcykuXG4gICAqIEByZXR1cm4ge051bWJlcn0gVGltZSBpbiB0aGUgbG9jYWwgY2xvY2sgY29ycmVzcG9uZGluZyB0byBgc3luY1RpbWVgIChpbiBzZWNvbmRzKS5cbiAgICogQHRvZG8gYWRkIG9wdGlvbmFsIGFyZ3VtZW50P1xuICAgKi9cbiAgZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0aW1lIGluIHRoZSBzeW5jIGNsb2NrLlxuICAgKiBJZiBubyBhcmd1bWVudHMgYXJlIHByb3ZpZGVkLCByZXR1cm5zIHRoZSBjdXJyZW50IHN5bmMgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxvY2FsVGltZSBUaW1lIGluIHRoZSBsb2NhbCBjbG9jayAoaW4gc2Vjb25kcykuXG4gICAqIEByZXR1cm4ge051bWJlcn0gVGltZSBpbiB0aGUgc3luYyBjbG9jayBjb3JyZXNwb25kaW5nIHRvIGBsb2NhbFRpbWVgIChpbiBzZWNvbmRzKVxuICAgKiBAdG9kbyBhZGQgb3B0aW9uYWwgYXJndW1lbnQ/XG4gICAqL1xuICBnZXRTeW5jVGltZShsb2NhbFRpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZShsb2NhbFRpbWUpO1xuICB9XG5cbiAgX3N5bmNTdGF0dXNSZXBvcnQobWVzc2FnZSwgcmVwb3J0KSB7XG4gICAgaWYobWVzc2FnZSA9PT0gJ3N5bmM6c3RhdHVzJykge1xuICAgICAgaWYocmVwb3J0LnN0YXR1cyA9PT0gJ3RyYWluaW5nJyB8fCByZXBvcnQuc3RhdHVzID09PSAnc3luYycpIHtcbiAgICAgICAgaWYoIXRoaXMuX3JlYWR5KSB7XG4gICAgICAgICAgdGhpcy5fcmVhZHkgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmVtaXQoJ3N5bmM6c3RhdHVzJywgcmVwb3J0KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==