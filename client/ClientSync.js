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
 * The {@link ClientSync} module takes care of the synchronization process on the client side.
 * It displays "Clock syncing, stand by…" until the very first synchronization process is done.
 * The {@link ClientSync} module calls its `done` method as soon as the client clock is in sync with the sync clock.
 * Then, the synchronization process keeps running in the background to resynchronize the clocks from times to times.
 * @example
 * // Require the Soundworks library (client side)
 * const clientSide = require('soundworks/client'); // TODO
 *
 * // Create Sync module
 * const sync = new clientSide.ClientSync();
 *
 * // Get times
 * const nowLocal = sync.getLocalTime(); // current time in local clock time
 * const nowSync = sync.getSyncTime(); // current time in sync clock time
 */

var ClientSync = (function (_Module) {
  _inherits(ClientSync, _Module);

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
    this._sync = new _syncClient2['default'](function () {
      return _wavesAudio.audioContext.currentTime;
    });

    this.setCenteredViewContent('<p class="soft-blink">Clock syncing, stand by&hellip;</p>');
  }

  /**
   * Starts the synchronization process.
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
})(_Module3['default']);

exports['default'] = ClientSync;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50U3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOzswQkFDbkIsYUFBYTs7OztzQkFDakIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFrQlIsVUFBVTtZQUFWLFVBQVU7Ozs7Ozs7OztBQU9sQixXQVBRLFVBQVUsR0FPSDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUEwsVUFBVTs7QUFRM0IsK0JBUmlCLFVBQVUsNkNBUXJCLE9BQU8sQ0FBQyxJQUFJLElBQUksTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sRUFBRTs7QUFFOUQsUUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDcEIsUUFBSSxDQUFDLEtBQUssR0FBRyw0QkFBZTthQUFNLHlCQUFhLFdBQVc7S0FBQSxDQUFDLENBQUM7O0FBRTVELFFBQUksQ0FBQyxzQkFBc0IsQ0FBQywyREFBMkQsQ0FBQyxDQUFDO0dBQzFGOzs7Ozs7O2VBZGtCLFVBQVU7O1dBb0J4QixpQkFBRzs7O0FBQ04saUNBckJpQixVQUFVLHVDQXFCYjtBQUNkLFVBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUs7QUFDNUQsY0FBSyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDeEMsQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7V0FLTSxtQkFBRyxFQUVUOzs7Ozs7Ozs7O0FBQUE7OztXQVNXLHNCQUFDLFFBQVEsRUFBRTtBQUNyQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzFDOzs7Ozs7Ozs7OztXQVNVLHFCQUFDLFNBQVMsRUFBRTtBQUNyQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzFDOzs7V0FFZ0IsMkJBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUNqQyxVQUFJLE9BQU8sS0FBSyxhQUFhLEVBQUU7QUFDN0IsWUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtBQUM1RCxjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNoQixnQkFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsZ0JBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztXQUNiO1NBQ0Y7QUFDRCxZQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztPQUNsQztLQUNGOzs7U0FsRWtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50U3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBTeW5jQ2xpZW50IGZyb20gJ3N5bmMvY2xpZW50JztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cbi8qKlxuICogVGhlIHtAbGluayBDbGllbnRTeW5jfSBtb2R1bGUgdGFrZXMgY2FyZSBvZiB0aGUgc3luY2hyb25pemF0aW9uIHByb2Nlc3Mgb24gdGhlIGNsaWVudCBzaWRlLlxuICogSXQgZGlzcGxheXMgXCJDbG9jayBzeW5jaW5nLCBzdGFuZCBieeKAplwiIHVudGlsIHRoZSB2ZXJ5IGZpcnN0IHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIGlzIGRvbmUuXG4gKiBUaGUge0BsaW5rIENsaWVudFN5bmN9IG1vZHVsZSBjYWxscyBpdHMgYGRvbmVgIG1ldGhvZCBhcyBzb29uIGFzIHRoZSBjbGllbnQgY2xvY2sgaXMgaW4gc3luYyB3aXRoIHRoZSBzeW5jIGNsb2NrLlxuICogVGhlbiwgdGhlIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIGtlZXBzIHJ1bm5pbmcgaW4gdGhlIGJhY2tncm91bmQgdG8gcmVzeW5jaHJvbml6ZSB0aGUgY2xvY2tzIGZyb20gdGltZXMgdG8gdGltZXMuXG4gKiBAZXhhbXBsZVxuICogLy8gUmVxdWlyZSB0aGUgU291bmR3b3JrcyBsaWJyYXJ5IChjbGllbnQgc2lkZSlcbiAqIGNvbnN0IGNsaWVudFNpZGUgPSByZXF1aXJlKCdzb3VuZHdvcmtzL2NsaWVudCcpOyAvLyBUT0RPXG4gKlxuICogLy8gQ3JlYXRlIFN5bmMgbW9kdWxlXG4gKiBjb25zdCBzeW5jID0gbmV3IGNsaWVudFNpZGUuQ2xpZW50U3luYygpO1xuICpcbiAqIC8vIEdldCB0aW1lc1xuICogY29uc3Qgbm93TG9jYWwgPSBzeW5jLmdldExvY2FsVGltZSgpOyAvLyBjdXJyZW50IHRpbWUgaW4gbG9jYWwgY2xvY2sgdGltZVxuICogY29uc3Qgbm93U3luYyA9IHN5bmMuZ2V0U3luY1RpbWUoKTsgLy8gY3VycmVudCB0aW1lIGluIHN5bmMgY2xvY2sgdGltZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRTeW5jIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLiBBbHdheXMgaGFzIGEgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nc3luYyddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc3luYycsIHRydWUsIG9wdGlvbnMuY29sb3IgfHwgJ2JsYWNrJyk7XG5cbiAgICB0aGlzLl9yZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY0NsaWVudCgoKSA9PiBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuXG4gICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KCc8cCBjbGFzcz1cInNvZnQtYmxpbmtcIj5DbG9jayBzeW5jaW5nLCBzdGFuZCBieSZoZWxsaXA7PC9wPicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgc3luY2hyb25pemF0aW9uIHByb2Nlc3MuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIHRoaXMuX3N5bmMuc3RhcnQodGhpcy5zZW5kLCB0aGlzLnJlY2VpdmUsIChzdGF0dXMsIHJlcG9ydCkgPT4ge1xuICAgICAgdGhpcy5fc3luY1N0YXR1c1JlcG9ydChzdGF0dXMsIHJlcG9ydCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgLy8gVE9ET1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrLlxuICAgKiBJZiBubyBhcmd1bWVudHMgYXJlIHByb3ZpZGVkLCByZXR1cm5zIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUgKCppLmUuKiBgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lYCkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzeW5jVGltZSBUaW1lIGluIHRoZSBzeW5jIGNsb2NrIChpbiBzZWNvbmRzKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSBUaW1lIGluIHRoZSBsb2NhbCBjbG9jayBjb3JyZXNwb25kaW5nIHRvIGBzeW5jVGltZWAgKGluIHNlY29uZHMpLlxuICAgKiBAdG9kbyBhZGQgb3B0aW9uYWwgYXJndW1lbnQ/XG4gICAqL1xuICBnZXRMb2NhbFRpbWUoc3luY1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRMb2NhbFRpbWUoc3luY1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRpbWUgaW4gdGhlIHN5bmMgY2xvY2suXG4gICAqIElmIG5vIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQsIHJldHVybnMgdGhlIGN1cnJlbnQgc3luYyB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbG9jYWxUaW1lIFRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrIChpbiBzZWNvbmRzKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSBUaW1lIGluIHRoZSBzeW5jIGNsb2NrIGNvcnJlc3BvbmRpbmcgdG8gYGxvY2FsVGltZWAgKGluIHNlY29uZHMpXG4gICAqIEB0b2RvIGFkZCBvcHRpb25hbCBhcmd1bWVudD9cbiAgICovXG4gIGdldFN5bmNUaW1lKGxvY2FsVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldFN5bmNUaW1lKGxvY2FsVGltZSk7XG4gIH1cblxuICBfc3luY1N0YXR1c1JlcG9ydChtZXNzYWdlLCByZXBvcnQpIHtcbiAgICBpZiAobWVzc2FnZSA9PT0gJ3N5bmM6c3RhdHVzJykge1xuICAgICAgaWYgKHJlcG9ydC5zdGF0dXMgPT09ICd0cmFpbmluZycgfHwgcmVwb3J0LnN0YXR1cyA9PT0gJ3N5bmMnKSB7XG4gICAgICAgIGlmICghdGhpcy5fcmVhZHkpIHtcbiAgICAgICAgICB0aGlzLl9yZWFkeSA9IHRydWU7XG4gICAgICAgICAgdGhpcy5kb25lKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdCgnc3luYzpzdGF0dXMnLCByZXBvcnQpO1xuICAgIH1cbiAgfVxufVxuIl19