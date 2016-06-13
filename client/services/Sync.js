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

var defaultViewTemplate = '\n<div class="section-top"></div>\n<div class="section-center flex-center">\n  <p class="soft-blink"><%= wait %></p>\n</div>\n<div class="section-bottom"></div>\n';

var defaultViewContent = {
  wait: 'Clock syncing,<br />stand by&hellip;'
};

/**
 * Interface for the client `'sync'` service.
 *
 * This service synchronizes the local audio clock of the client with the clock
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

    _this._defaultViewTemplate = defaultViewTemplate;
    _this._defaultViewContent = defaultViewContent;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sYUFBYSxjQUFuQjs7QUFFQSxJQUFNLDBMQUFOOztBQVFBLElBQU0scUJBQXFCO0FBQ3pCO0FBRHlCLENBQTNCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBdUJNLEk7Ozs7O0FBRUosa0JBQWM7QUFBQTs7QUFBQSw4R0FDTixVQURNLEVBQ00sSUFETjs7QUFHWixRQUFNLFdBQVc7QUFDZix1Q0FEZTtBQUVmLG9CQUFjO0FBRkMsS0FBakI7OztBQU1BLFVBQUssU0FBTCxDQUFlLFFBQWY7O0FBRUEsVUFBSyxvQkFBTCxHQUE0QixtQkFBNUI7QUFDQSxVQUFLLG1CQUFMLEdBQTJCLGtCQUEzQjs7QUFFQSxVQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQXlCLEVBQUUsVUFBVSxXQUFaLEVBQXpCOztBQUVBLFVBQUssaUJBQUwsR0FBeUIsTUFBSyxpQkFBTCxDQUF1QixJQUF2QixPQUF6QjtBQUNBLFVBQUssZ0JBQUwsR0FBd0IsRUFBeEI7QUFqQlk7QUFrQmI7Ozs7Ozs7MkJBR007QUFDTCxXQUFLLEtBQUwsR0FBYSxxQkFBZTtBQUFBLGVBQU0seUJBQWEsV0FBbkI7QUFBQSxPQUFmLENBQWI7QUFDQSxXQUFLLE1BQUwsR0FBYyxLQUFkOztBQUVBLFdBQUssUUFBTCxHQUFnQixLQUFLLE9BQUwsQ0FBYSxRQUE3QjtBQUNBLFdBQUssSUFBTCxHQUFZLEtBQUssVUFBTCxFQUFaO0FBQ0Q7Ozs7Ozs0QkFHTztBQUNOOztBQUVBLFVBQUksQ0FBQyxLQUFLLFVBQVYsRUFDRSxLQUFLLElBQUw7O0FBRUYsV0FBSyxJQUFMO0FBQ0EsV0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixLQUFLLElBQXRCLEVBQTRCLEtBQUssT0FBakMsRUFBMEMsS0FBSyxpQkFBL0M7QUFDRDs7Ozs7OzJCQUdNO0FBQ0wsV0FBSyxJQUFMO0FBQ0E7QUFDRDs7Ozs7Ozs7Ozs7O2lDQVNZLFEsRUFBVTtBQUNyQixhQUFPLEtBQUssS0FBTCxDQUFXLFlBQVgsQ0FBd0IsUUFBeEIsQ0FBUDtBQUNEOzs7Ozs7Ozs7Ozs7Z0NBU1csUyxFQUFXO0FBQ3JCLGFBQU8sS0FBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixTQUF2QixDQUFQO0FBQ0Q7Ozs7Ozs7OztnQ0FNVyxRLEVBQVU7QUFDcEIsV0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUEyQixRQUEzQjtBQUNEOzs7c0NBRWlCLE8sRUFBUyxNLEVBQVE7QUFDakMsVUFBSSxZQUFZLGFBQWhCLEVBQStCO0FBQzdCLFlBQUksT0FBTyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDLE9BQU8sTUFBUCxLQUFrQixNQUF0RCxFQUE4RDtBQUM1RCxlQUFLLGdCQUFMLENBQXNCLE9BQXRCLENBQThCLFVBQUMsUUFBRDtBQUFBLG1CQUFlLFNBQVMsTUFBVCxDQUFmO0FBQUEsV0FBOUI7O0FBRUEsY0FBSSxDQUFDLEtBQUssTUFBVixFQUFrQjtBQUNoQixpQkFBSyxNQUFMLEdBQWMsSUFBZDtBQUNBLGlCQUFLLEtBQUw7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7Ozs7QUFJSCx5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLElBQXBDOztrQkFFZSxJIiwiZmlsZSI6IlN5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU3luY01vZHVsZSBmcm9tICdzeW5jL2NsaWVudCc7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzeW5jJztcblxuY29uc3QgZGVmYXVsdFZpZXdUZW1wbGF0ZSA9IGBcbjxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcFwiPjwvZGl2PlxuPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gIDxwIGNsYXNzPVwic29mdC1ibGlua1wiPjwlPSB3YWl0ICU+PC9wPlxuPC9kaXY+XG48ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b21cIj48L2Rpdj5cbmA7XG5cbmNvbnN0IGRlZmF1bHRWaWV3Q29udGVudCA9IHtcbiAgd2FpdDogYENsb2NrIHN5bmNpbmcsPGJyIC8+c3RhbmQgYnkmaGVsbGlwO2AsXG59O1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ3N5bmMnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBzeW5jaHJvbml6ZXMgdGhlIGxvY2FsIGF1ZGlvIGNsb2NrIG9mIHRoZSBjbGllbnQgd2l0aCB0aGUgY2xvY2tcbiAqIG9mIHRoZSBzZXJ2ZXIgKG1hc3RlciBjbG9jaykuIEl0IHRoZW4gaW50ZXJuYWxseSByZWxpZXMgb24gdGhlIGBXZWJBdWRpb2BcbiAqIGNsb2NrIGFuZCByZXF1aXJlcyB0aGUgcGxhdGZvcm0gdG8gYWNjZXNzIHRoaXMgZmVhdHVyZS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuU3luY30qX19cbiAqXG4gKiBfTm90ZTpfIHRoZSBzZXJ2aWNlIGlzIGJhc2VkIG9uIFtgZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luY2BdKGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luYykuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5zeW5jID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG4gKiAvLyB3aGVuIHRoZSBleHBlcmllbmNlIGhhcyBzdGFydGVkLCB0cmFuc2xhdGUgdGhlIHN5bmMgdGltZSBpbiBsb2NhbCB0aW1lXG4gKiBjb25zdCBzeW5jVGltZSA9IHRoaXMuc3luYy5nZXRTeW5jVGltZSgpO1xuICogY29uc3QgbG9jYWxUaW1lID0gdGhpcy5zeW5jLmdldEF1ZGlvVGltZShzeW5jVGltZSk7XG4gKi9cbmNsYXNzIFN5bmMgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgdmlld0N0b3I6IFNlZ21lbnRlZFZpZXcsXG4gICAgICB2aWV3UHJpb3JpdHk6IDMsXG4gICAgICAvLyBAdG9kbyAtIGFkZCBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc3luYyBzZXJ2aWNlXG4gICAgfVxuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fZGVmYXVsdFZpZXdUZW1wbGF0ZSA9IGRlZmF1bHRWaWV3VGVtcGxhdGU7XG4gICAgdGhpcy5fZGVmYXVsdFZpZXdDb250ZW50ID0gZGVmYXVsdFZpZXdDb250ZW50O1xuXG4gICAgdGhpcy5yZXF1aXJlKCdwbGF0Zm9ybScsIHsgZmVhdHVyZXM6ICd3ZWItYXVkaW8nIH0pO1xuXG4gICAgdGhpcy5fc3luY1N0YXR1c1JlcG9ydCA9IHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9yZXBvcnRMaXN0ZW5lcnMgPSBbXTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0KCkge1xuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY01vZHVsZSgoKSA9PiBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuICAgIHRoaXMuX3JlYWR5ID0gZmFsc2U7XG5cbiAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zaG93KCk7XG4gICAgdGhpcy5fc3luYy5zdGFydCh0aGlzLnNlbmQsIHRoaXMucmVjZWl2ZSwgdGhpcy5fc3luY1N0YXR1c1JlcG9ydCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0aW1lIGluIHRoZSBsb2NhbCBjbG9jay4gSWYgbm8gYXJndW1lbnRzIHByb3ZpZGVkLFxuICAgKiByZXR1cm5zIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzeW5jVGltZSAtIFRpbWUgZnJvbSB0aGUgc3luYyBjbG9jayAoaW4gX3NlY29uZHNfKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIExvY2FsIHRpbWUgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW5cbiAgICogIGBzeW5jVGltZWAgKGluIF9zZWNvbmRzXykuXG4gICAqL1xuICBnZXRBdWRpb1RpbWUoc3luY1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRMb2NhbFRpbWUoc3luY1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdGltZSBpbiB0aGUgc3luYyBjbG9jay4gSWYgbm8gYXJndW1lbnRzIHByb3ZpZGVkLFxuICAgKiByZXR1cm5zIHRoZSBjdXJyZW50IHN5bmMgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGF1ZGlvVGltZSAtIFRpbWUgZnJvbSB0aGUgbG9jYWwgY2xvY2sgKGluIF9zZWNvbmRzXykuXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBTeW5jIHRpbWUgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW5cbiAgICogIGBhdWRpb1RpbWVgIChpbiBfc2Vjb25kc18pLlxuICAgKi9cbiAgZ2V0U3luY1RpbWUoYXVkaW9UaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUoYXVkaW9UaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBjYWxsYmFjayBmdW5jdGlvbiB0byB0aGUgc3luY2hyb25pemF0aW9uIHJlcG9ydHMgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgYWRkTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9yZXBvcnRMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICBfc3luY1N0YXR1c1JlcG9ydChjaGFubmVsLCByZXBvcnQpIHtcbiAgICBpZiAoY2hhbm5lbCA9PT0gJ3N5bmM6c3RhdHVzJykge1xuICAgICAgaWYgKHJlcG9ydC5zdGF0dXMgPT09ICd0cmFpbmluZycgfHwgcmVwb3J0LnN0YXR1cyA9PT0gJ3N5bmMnKSB7XG4gICAgICAgIHRoaXMuX3JlcG9ydExpc3RlbmVycy5mb3JFYWNoKChjYWxsYmFjaykgPT4gIGNhbGxiYWNrKHJlcG9ydCkpO1xuXG4gICAgICAgIGlmICghdGhpcy5fcmVhZHkpIHtcbiAgICAgICAgICB0aGlzLl9yZWFkeSA9IHRydWU7XG4gICAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU3luYyk7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bmM7XG4iXX0=