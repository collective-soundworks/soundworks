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
 * Interface of the client `'sync'` service.
 *
 * This service synchronize the local audio clock of the client with the clock
 * of the server (master clock). It then internally relies on the `WebAudio`
 * clock and requires the platform to access this feature.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Sync}*__
 *
 * _Note:_ the service is based on [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.sync = this.require('sync');
 * // when the experience has started, translate the sync time in local time
 * const syncTime = this.sync.getSyncTime();
 * const localTime = this.sync.getAudioTime(syncTime);
 */

var Sync = function (_Service) {
  (0, _inherits3.default)(Sync, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Sync() {
    (0, _classCallCheck3.default)(this, Sync);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Sync).call(this, SERVICE_ID, true));

    var defaults = {
      viewCtor: _SegmentedView2.default,
      viewPriority: 3
    };

    // @todo - add options to configure the sync service
    _this.configure(defaults);
    _this.require('platform', { features: 'web-audio' });

    _this._syncStatusReport = _this._syncStatusReport.bind(_this);
    _this._reportListeners = [];
    return _this;
  }

  /** @private */


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

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      (0, _get3.default)((0, _getPrototypeOf2.default)(Sync.prototype), 'stop', this).call(this);
    }

    /**
     * Return the time in the local clock. If no arguments provided,
     * returns the current local time.
     * @param {Number} syncTime - Time from the sync clock (in _seconds_).
     * @return {Number} - Local time corresponding to the given
     *  `syncTime` (in _seconds_).
     */

  }, {
    key: 'getAudioTime',
    value: function getAudioTime(syncTime) {
      return this._sync.getLocalTime(syncTime);
    }

    /**
     * Return the time in the sync clock. If no arguments provided,
     * returns the current sync time.
     * @param {Number} audioTime - Time from the local clock (in _seconds_).
     * @return {Number} - Sync time corresponding to the given
     *  `audioTime` (in _seconds_).
     */

  }, {
    key: 'getSyncTime',
    value: function getSyncTime(audioTime) {
      return this._sync.getSyncTime(audioTime);
    }

    /**
     * Add a callback function to the synchronization reports from the server.
     * @param {Function} callback
     */

  }, {
    key: 'addListener',
    value: function addListener(callback) {
      this._reportListeners.push(callback);
    }
  }, {
    key: '_syncStatusReport',
    value: function _syncStatusReport(channel, report) {
      if (channel === 'sync:status') {
        if (report.status === 'training' || report.status === 'sync') {
          this._reportListeners.forEach(function (callback) {
            return callback(report);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sYUFBYSxjQUFiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUJBOzs7OztBQUVKLFdBRkksSUFFSixHQUFjO3dDQUZWLE1BRVU7OzZGQUZWLGlCQUdJLFlBQVksT0FETjs7QUFHWixRQUFNLFdBQVc7QUFDZix1Q0FEZTtBQUVmLG9CQUFjLENBQWQ7S0FGSSxDQUhNOzs7QUFTWixVQUFLLFNBQUwsQ0FBZSxRQUFmLEVBVFk7QUFVWixVQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQXlCLEVBQUUsVUFBVSxXQUFWLEVBQTNCLEVBVlk7O0FBWVosVUFBSyxpQkFBTCxHQUF5QixNQUFLLGlCQUFMLENBQXVCLElBQXZCLE9BQXpCLENBWlk7QUFhWixVQUFLLGdCQUFMLEdBQXdCLEVBQXhCLENBYlk7O0dBQWQ7Ozs7OzZCQUZJOzsyQkFtQkc7QUFDTCxXQUFLLEtBQUwsR0FBYSxxQkFBZTtlQUFNLHlCQUFhLFdBQWI7T0FBTixDQUE1QixDQURLO0FBRUwsV0FBSyxNQUFMLEdBQWMsS0FBZCxDQUZLOztBQUlMLFdBQUssUUFBTCxHQUFnQixLQUFLLE9BQUwsQ0FBYSxRQUFiLENBSlg7QUFLTCxXQUFLLElBQUwsR0FBWSxLQUFLLFVBQUwsRUFBWixDQUxLOzs7Ozs7OzRCQVNDO0FBQ04sdURBN0JFLDBDQTZCRixDQURNOztBQUdOLFVBQUksQ0FBQyxLQUFLLFVBQUwsRUFDSCxLQUFLLElBQUwsR0FERjs7QUFHQSxXQUFLLElBQUwsR0FOTTtBQU9OLFdBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsS0FBSyxJQUFMLEVBQVcsS0FBSyxPQUFMLEVBQWMsS0FBSyxpQkFBTCxDQUExQyxDQVBNOzs7Ozs7OzJCQVdEO0FBQ0wsV0FBSyxJQUFMLEdBREs7QUFFTCx1REF6Q0UseUNBeUNGLENBRks7Ozs7Ozs7Ozs7Ozs7aUNBWU0sVUFBVTtBQUNyQixhQUFPLEtBQUssS0FBTCxDQUFXLFlBQVgsQ0FBd0IsUUFBeEIsQ0FBUCxDQURxQjs7Ozs7Ozs7Ozs7OztnQ0FXWCxXQUFXO0FBQ3JCLGFBQU8sS0FBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixTQUF2QixDQUFQLENBRHFCOzs7Ozs7Ozs7O2dDQVFYLFVBQVU7QUFDcEIsV0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUEyQixRQUEzQixFQURvQjs7OztzQ0FJSixTQUFTLFFBQVE7QUFDakMsVUFBSSxZQUFZLGFBQVosRUFBMkI7QUFDN0IsWUFBSSxPQUFPLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0MsT0FBTyxNQUFQLEtBQWtCLE1BQWxCLEVBQTBCO0FBQzVELGVBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsQ0FBOEIsVUFBQyxRQUFEO21CQUFlLFNBQVMsTUFBVDtXQUFmLENBQTlCLENBRDREOztBQUc1RCxjQUFJLENBQUMsS0FBSyxNQUFMLEVBQWE7QUFDaEIsaUJBQUssTUFBTCxHQUFjLElBQWQsQ0FEZ0I7QUFFaEIsaUJBQUssS0FBTCxHQUZnQjtXQUFsQjtTQUhGO09BREY7OztTQTNFRTs7O0FBeUZOLHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsSUFBcEM7O2tCQUVlIiwiZmlsZSI6IlN5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU3luY01vZHVsZSBmcm9tICdzeW5jL2NsaWVudCc7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzeW5jJztcblxuLyoqXG4gKiBJbnRlcmZhY2Ugb2YgdGhlIGNsaWVudCBgJ3N5bmMnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBzeW5jaHJvbml6ZSB0aGUgbG9jYWwgYXVkaW8gY2xvY2sgb2YgdGhlIGNsaWVudCB3aXRoIHRoZSBjbG9ja1xuICogb2YgdGhlIHNlcnZlciAobWFzdGVyIGNsb2NrKS4gSXQgdGhlbiBpbnRlcm5hbGx5IHJlbGllcyBvbiB0aGUgYFdlYkF1ZGlvYFxuICogY2xvY2sgYW5kIHJlcXVpcmVzIHRoZSBwbGF0Zm9ybSB0byBhY2Nlc3MgdGhpcyBmZWF0dXJlLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5TeW5jfSpfX1xuICpcbiAqIF9Ob3RlOl8gdGhlIHNlcnZpY2UgaXMgYmFzZWQgb24gW2BnaXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jYF0oaHR0cHM6Ly9naXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jKS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnN5bmMgPSB0aGlzLnJlcXVpcmUoJ3N5bmMnKTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWQsIHRyYW5zbGF0ZSB0aGUgc3luYyB0aW1lIGluIGxvY2FsIHRpbWVcbiAqIGNvbnN0IHN5bmNUaW1lID0gdGhpcy5zeW5jLmdldFN5bmNUaW1lKCk7XG4gKiBjb25zdCBsb2NhbFRpbWUgPSB0aGlzLnN5bmMuZ2V0QXVkaW9UaW1lKHN5bmNUaW1lKTtcbiAqL1xuY2xhc3MgU3luYyBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICB2aWV3Q3RvcjogU2VnbWVudGVkVmlldyxcbiAgICAgIHZpZXdQcmlvcml0eTogMyxcbiAgICAgIC8vIEB0b2RvIC0gYWRkIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzeW5jIHNlcnZpY2VcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gICAgdGhpcy5yZXF1aXJlKCdwbGF0Zm9ybScsIHsgZmVhdHVyZXM6ICd3ZWItYXVkaW8nIH0pO1xuXG4gICAgdGhpcy5fc3luY1N0YXR1c1JlcG9ydCA9IHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9yZXBvcnRMaXN0ZW5lcnMgPSBbXTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0KCkge1xuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY01vZHVsZSgoKSA9PiBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuICAgIHRoaXMuX3JlYWR5ID0gZmFsc2U7XG5cbiAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG4gICAgdGhpcy5fc3luYy5zdGFydCh0aGlzLnNlbmQsIHRoaXMucmVjZWl2ZSwgdGhpcy5fc3luY1N0YXR1c1JlcG9ydCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0aW1lIGluIHRoZSBsb2NhbCBjbG9jay4gSWYgbm8gYXJndW1lbnRzIHByb3ZpZGVkLFxuICAgKiByZXR1cm5zIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzeW5jVGltZSAtIFRpbWUgZnJvbSB0aGUgc3luYyBjbG9jayAoaW4gX3NlY29uZHNfKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIExvY2FsIHRpbWUgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW5cbiAgICogIGBzeW5jVGltZWAgKGluIF9zZWNvbmRzXykuXG4gICAqL1xuICBnZXRBdWRpb1RpbWUoc3luY1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRMb2NhbFRpbWUoc3luY1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdGltZSBpbiB0aGUgc3luYyBjbG9jay4gSWYgbm8gYXJndW1lbnRzIHByb3ZpZGVkLFxuICAgKiByZXR1cm5zIHRoZSBjdXJyZW50IHN5bmMgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGF1ZGlvVGltZSAtIFRpbWUgZnJvbSB0aGUgbG9jYWwgY2xvY2sgKGluIF9zZWNvbmRzXykuXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBTeW5jIHRpbWUgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW5cbiAgICogIGBhdWRpb1RpbWVgIChpbiBfc2Vjb25kc18pLlxuICAgKi9cbiAgZ2V0U3luY1RpbWUoYXVkaW9UaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUoYXVkaW9UaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBjYWxsYmFjayBmdW5jdGlvbiB0byB0aGUgc3luY2hyb25pemF0aW9uIHJlcG9ydHMgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgYWRkTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9yZXBvcnRMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICBfc3luY1N0YXR1c1JlcG9ydChjaGFubmVsLCByZXBvcnQpIHtcbiAgICBpZiAoY2hhbm5lbCA9PT0gJ3N5bmM6c3RhdHVzJykge1xuICAgICAgaWYgKHJlcG9ydC5zdGF0dXMgPT09ICd0cmFpbmluZycgfHwgcmVwb3J0LnN0YXR1cyA9PT0gJ3N5bmMnKSB7XG4gICAgICAgIHRoaXMuX3JlcG9ydExpc3RlbmVycy5mb3JFYWNoKChjYWxsYmFjaykgPT4gIGNhbGxiYWNrKHJlcG9ydCkpO1xuXG4gICAgICAgIGlmICghdGhpcy5fcmVhZHkpIHtcbiAgICAgICAgICB0aGlzLl9yZWFkeSA9IHRydWU7XG4gICAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU3luYyk7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bmM7XG4iXX0=