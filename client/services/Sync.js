'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _wavesAudio = require('waves-audio');

var _SegmentedView = require('../views/SegmentedView');

var _SegmentedView2 = _interopRequireDefault(_SegmentedView);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _client = require('sync/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:sync';

/**
 * [client] Synchronize the local clock on a master clock shared by the server and the clients.
 *
 * Both the clients and the server can use this master clock as a common time reference.
 * For instance, this allows all the clients to do something exactly at the same time, such as blinking the screen or playing a sound in a synchronized manner.
 *
 * The service always has a view (that displays "Clock syncing, stand by…", until the very first synchronization process is done).
 *
 * The service finishes its initialization as soon as the client clock is in sync with the master clock.
 * Then, the synchronization process keeps running in the background to resynchronize the clocks from times to times.
 *
 * **Note:** the service is based on [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * @example
 * const sync = serviceManager.require('service:sync');
 *
 * const nowLocal = sync.getAudioTime(); // current time in local clock time
 * const nowSync = sync.getSyncTime(); // current time in sync clock time
 * @emits 'sync:stats' each time the service (re)synchronizes the local clock on the sync clock.
 * The `'status'` event goes along with the `report` object that has the following properties:
 * - `timeOffset`, current estimation of the time offset between the client clock and the sync clock;
 * - `travelTime`, current estimation of the travel time for a message to go from the client to the server and back;
 * - `travelTimeMax`, current estimation of the maximum travel time for a message to go from the client to the server and back.
 */

var Sync = function (_Service) {
  (0, _inherits3.default)(Sync, _Service);

  function Sync() {
    (0, _classCallCheck3.default)(this, Sync);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Sync).call(this, SERVICE_ID, true));

    var defaults = {
      viewCtor: _SegmentedView2.default,
      viewPriority: 3
    };

    // @todo - add options to configure the sync service
    _this.configure(defaults);
    // needs audio time
    _this._platform = _this.require('platform', { features: 'web-audio' });

    _this._syncStatusReport = _this._syncStatusReport.bind(_this);
    _this._reportListeners = [];
    return _this;
  }

  (0, _createClass3.default)(Sync, [{
    key: 'init',
    value: function init() {
      this._sync = new _client2.default(function () {
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(Sync.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();
      this._sync.start(this.send, this.receive, this._syncStatusReport);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      (0, _get3.default)((0, _getPrototypeOf2.default)(Sync.prototype), 'stop', this).call(this);
    }

    /**
     * Return the time in the local clock.
     * If no arguments are provided, returns the current local time (*i.e.* `audioContext.currentTime`).
     * @param {Number} syncTime Time in the sync clock (in seconds).
     * @return {Number} Time in the local clock corresponding to `syncTime` (in seconds).
     */

  }, {
    key: 'getAudioTime',
    value: function getAudioTime(syncTime) {
      return this._sync.getLocalTime(syncTime);
    }

    /**
     * Return the time in the sync clock.
     * If no arguments are provided, returns the current sync time.
     * @param {Number} audioTime Time in the local clock (in seconds).
     * @return {Number} Time in the sync clock corresponding to `audioTime` (in seconds)
     */

  }, {
    key: 'getSyncTime',
    value: function getSyncTime(audioTime) {
      return this._sync.getSyncTime(audioTime);
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
  return Sync;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Sync);

exports.default = Sync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sYUFBYSxjQUFiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEwQkE7OztBQUNKLFdBREksSUFDSixHQUFjO3dDQURWLE1BQ1U7OzZGQURWLGlCQUVJLFlBQVksT0FETjs7QUFHWixRQUFNLFdBQVc7QUFDZix1Q0FEZTtBQUVmLG9CQUFjLENBQWQ7S0FGSSxDQUhNOzs7QUFTWixVQUFLLFNBQUwsQ0FBZSxRQUFmOztBQVRZLFNBV1osQ0FBSyxTQUFMLEdBQWlCLE1BQUssT0FBTCxDQUFhLFVBQWIsRUFBeUIsRUFBRSxVQUFVLFdBQVYsRUFBM0IsQ0FBakIsQ0FYWTs7QUFhWixVQUFLLGlCQUFMLEdBQXlCLE1BQUssaUJBQUwsQ0FBdUIsSUFBdkIsT0FBekIsQ0FiWTtBQWNaLFVBQUssZ0JBQUwsR0FBd0IsRUFBeEIsQ0FkWTs7R0FBZDs7NkJBREk7OzJCQWtCRztBQUNMLFdBQUssS0FBTCxHQUFhLHFCQUFlO2VBQU0seUJBQWEsV0FBYjtPQUFOLENBQTVCLENBREs7QUFFTCxXQUFLLE1BQUwsR0FBYyxLQUFkLENBRks7O0FBSUwsV0FBSyxRQUFMLEdBQWdCLEtBQUssT0FBTCxDQUFhLFFBQWIsQ0FKWDtBQUtMLFdBQUssSUFBTCxHQUFZLEtBQUssVUFBTCxFQUFaLENBTEs7Ozs7Ozs7NEJBU0M7QUFDTix1REE1QkUsMENBNEJGLENBRE07O0FBR04sVUFBSSxDQUFDLEtBQUssVUFBTCxFQUNILEtBQUssSUFBTCxHQURGOztBQUdBLFdBQUssSUFBTCxHQU5NO0FBT04sV0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixLQUFLLElBQUwsRUFBVyxLQUFLLE9BQUwsRUFBYyxLQUFLLGlCQUFMLENBQTFDLENBUE07Ozs7MkJBVUQ7QUFDTCxXQUFLLElBQUwsR0FESztBQUVMLHVEQXZDRSx5Q0F1Q0YsQ0FGSzs7Ozs7Ozs7Ozs7O2lDQVdNLFVBQVU7QUFDckIsYUFBTyxLQUFLLEtBQUwsQ0FBVyxZQUFYLENBQXdCLFFBQXhCLENBQVAsQ0FEcUI7Ozs7Ozs7Ozs7OztnQ0FVWCxXQUFXO0FBQ3JCLGFBQU8sS0FBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixTQUF2QixDQUFQLENBRHFCOzs7Ozs7Ozs7O2dDQVFWLFVBQVU7QUFDckIsV0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUEyQixRQUEzQixFQURxQjs7OztzQ0FJTCxTQUFTLFFBQVE7QUFDakMsVUFBSSxZQUFZLGFBQVosRUFBMkI7QUFDN0IsWUFBSSxPQUFPLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0MsT0FBTyxNQUFQLEtBQWtCLE1BQWxCLEVBQTBCO0FBQzVELGVBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsQ0FBOEIsVUFBQyxRQUFEO21CQUFlLFNBQVMsTUFBVCxFQUFpQixNQUFqQjtXQUFmLENBQTlCLENBRDREOztBQUc1RCxjQUFJLENBQUMsS0FBSyxNQUFMLEVBQWE7QUFDaEIsaUJBQUssTUFBTCxHQUFjLElBQWQsQ0FEZ0I7QUFFaEIsaUJBQUssS0FBTCxHQUZnQjtXQUFsQjtTQUhGO09BREY7OztTQXZFRTs7O0FBb0ZOLHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsSUFBcEM7O2tCQUVlIiwiZmlsZSI6IlN5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU3luY01vZHVsZSBmcm9tICdzeW5jL2NsaWVudCc7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzeW5jJztcblxuLyoqXG4gKiBbY2xpZW50XSBTeW5jaHJvbml6ZSB0aGUgbG9jYWwgY2xvY2sgb24gYSBtYXN0ZXIgY2xvY2sgc2hhcmVkIGJ5IHRoZSBzZXJ2ZXIgYW5kIHRoZSBjbGllbnRzLlxuICpcbiAqIEJvdGggdGhlIGNsaWVudHMgYW5kIHRoZSBzZXJ2ZXIgY2FuIHVzZSB0aGlzIG1hc3RlciBjbG9jayBhcyBhIGNvbW1vbiB0aW1lIHJlZmVyZW5jZS5cbiAqIEZvciBpbnN0YW5jZSwgdGhpcyBhbGxvd3MgYWxsIHRoZSBjbGllbnRzIHRvIGRvIHNvbWV0aGluZyBleGFjdGx5IGF0IHRoZSBzYW1lIHRpbWUsIHN1Y2ggYXMgYmxpbmtpbmcgdGhlIHNjcmVlbiBvciBwbGF5aW5nIGEgc291bmQgaW4gYSBzeW5jaHJvbml6ZWQgbWFubmVyLlxuICpcbiAqIFRoZSBzZXJ2aWNlIGFsd2F5cyBoYXMgYSB2aWV3ICh0aGF0IGRpc3BsYXlzIFwiQ2xvY2sgc3luY2luZywgc3RhbmQgYnnigKZcIiwgdW50aWwgdGhlIHZlcnkgZmlyc3Qgc3luY2hyb25pemF0aW9uIHByb2Nlc3MgaXMgZG9uZSkuXG4gKlxuICogVGhlIHNlcnZpY2UgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIGFzIHNvb24gYXMgdGhlIGNsaWVudCBjbG9jayBpcyBpbiBzeW5jIHdpdGggdGhlIG1hc3RlciBjbG9jay5cbiAqIFRoZW4sIHRoZSBzeW5jaHJvbml6YXRpb24gcHJvY2VzcyBrZWVwcyBydW5uaW5nIGluIHRoZSBiYWNrZ3JvdW5kIHRvIHJlc3luY2hyb25pemUgdGhlIGNsb2NrcyBmcm9tIHRpbWVzIHRvIHRpbWVzLlxuICpcbiAqICoqTm90ZToqKiB0aGUgc2VydmljZSBpcyBiYXNlZCBvbiBbYGdpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmNgXShodHRwczovL2dpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmMpLlxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBzeW5jID0gc2VydmljZU1hbmFnZXIucmVxdWlyZSgnc2VydmljZTpzeW5jJyk7XG4gKlxuICogY29uc3Qgbm93TG9jYWwgPSBzeW5jLmdldEF1ZGlvVGltZSgpOyAvLyBjdXJyZW50IHRpbWUgaW4gbG9jYWwgY2xvY2sgdGltZVxuICogY29uc3Qgbm93U3luYyA9IHN5bmMuZ2V0U3luY1RpbWUoKTsgLy8gY3VycmVudCB0aW1lIGluIHN5bmMgY2xvY2sgdGltZVxuICogQGVtaXRzICdzeW5jOnN0YXRzJyBlYWNoIHRpbWUgdGhlIHNlcnZpY2UgKHJlKXN5bmNocm9uaXplcyB0aGUgbG9jYWwgY2xvY2sgb24gdGhlIHN5bmMgY2xvY2suXG4gKiBUaGUgYCdzdGF0dXMnYCBldmVudCBnb2VzIGFsb25nIHdpdGggdGhlIGByZXBvcnRgIG9iamVjdCB0aGF0IGhhcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiAtIGB0aW1lT2Zmc2V0YCwgY3VycmVudCBlc3RpbWF0aW9uIG9mIHRoZSB0aW1lIG9mZnNldCBiZXR3ZWVuIHRoZSBjbGllbnQgY2xvY2sgYW5kIHRoZSBzeW5jIGNsb2NrO1xuICogLSBgdHJhdmVsVGltZWAsIGN1cnJlbnQgZXN0aW1hdGlvbiBvZiB0aGUgdHJhdmVsIHRpbWUgZm9yIGEgbWVzc2FnZSB0byBnbyBmcm9tIHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlciBhbmQgYmFjaztcbiAqIC0gYHRyYXZlbFRpbWVNYXhgLCBjdXJyZW50IGVzdGltYXRpb24gb2YgdGhlIG1heGltdW0gdHJhdmVsIHRpbWUgZm9yIGEgbWVzc2FnZSB0byBnbyBmcm9tIHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlciBhbmQgYmFjay5cbiAqL1xuY2xhc3MgU3luYyBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgdmlld0N0b3I6IFNlZ21lbnRlZFZpZXcsXG4gICAgICB2aWV3UHJpb3JpdHk6IDMsXG4gICAgICAvLyBAdG9kbyAtIGFkZCBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc3luYyBzZXJ2aWNlXG4gICAgfVxuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIC8vIG5lZWRzIGF1ZGlvIHRpbWVcbiAgICB0aGlzLl9wbGF0Zm9ybSA9IHRoaXMucmVxdWlyZSgncGxhdGZvcm0nLCB7IGZlYXR1cmVzOiAnd2ViLWF1ZGlvJyB9KTtcblxuICAgIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQgPSB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fcmVwb3J0TGlzdGVuZXJzID0gW107XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY01vZHVsZSgoKSA9PiBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuICAgIHRoaXMuX3JlYWR5ID0gZmFsc2U7XG5cbiAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG4gICAgdGhpcy5fc3luYy5zdGFydCh0aGlzLnNlbmQsIHRoaXMucmVjZWl2ZSwgdGhpcy5fc3luY1N0YXR1c1JlcG9ydCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrLlxuICAgKiBJZiBubyBhcmd1bWVudHMgYXJlIHByb3ZpZGVkLCByZXR1cm5zIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUgKCppLmUuKiBgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lYCkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzeW5jVGltZSBUaW1lIGluIHRoZSBzeW5jIGNsb2NrIChpbiBzZWNvbmRzKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSBUaW1lIGluIHRoZSBsb2NhbCBjbG9jayBjb3JyZXNwb25kaW5nIHRvIGBzeW5jVGltZWAgKGluIHNlY29uZHMpLlxuICAgKi9cbiAgZ2V0QXVkaW9UaW1lKHN5bmNUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIHN5bmMgY2xvY2suXG4gICAqIElmIG5vIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQsIHJldHVybnMgdGhlIGN1cnJlbnQgc3luYyB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gYXVkaW9UaW1lIFRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrIChpbiBzZWNvbmRzKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSBUaW1lIGluIHRoZSBzeW5jIGNsb2NrIGNvcnJlc3BvbmRpbmcgdG8gYGF1ZGlvVGltZWAgKGluIHNlY29uZHMpXG4gICAqL1xuICBnZXRTeW5jVGltZShhdWRpb1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZShhdWRpb1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbiBlYWNoIHN5bmMgcmVwb3J0XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBhZGRMaXN0ZW5lciAoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9yZXBvcnRMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICBfc3luY1N0YXR1c1JlcG9ydChtZXNzYWdlLCByZXBvcnQpIHtcbiAgICBpZiAobWVzc2FnZSA9PT0gJ3N5bmM6c3RhdHVzJykge1xuICAgICAgaWYgKHJlcG9ydC5zdGF0dXMgPT09ICd0cmFpbmluZycgfHwgcmVwb3J0LnN0YXR1cyA9PT0gJ3N5bmMnKSB7XG4gICAgICAgIHRoaXMuX3JlcG9ydExpc3RlbmVycy5mb3JFYWNoKChjYWxsYmFjaykgPT4gIGNhbGxiYWNrKHN0YXR1cywgcmVwb3J0KSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9yZWFkeSkge1xuICAgICAgICAgIHRoaXMuX3JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU3luYyk7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bmM7XG4iXX0=