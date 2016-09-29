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

    var _this = (0, _possibleConstructorReturn3.default)(this, (Sync.__proto__ || (0, _getPrototypeOf2.default)(Sync)).call(this, SERVICE_ID, true));

    var defaults = {
      viewCtor: _SegmentedView2.default,
      viewPriority: 3
    };

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
      (0, _get3.default)(Sync.prototype.__proto__ || (0, _getPrototypeOf2.default)(Sync.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();
      this._sync.start(this.send, this.receive, this._syncStatusReport);
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      (0, _get3.default)(Sync.prototype.__proto__ || (0, _getPrototypeOf2.default)(Sync.prototype), 'stop', this).call(this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsImRlZmF1bHRWaWV3VGVtcGxhdGUiLCJkZWZhdWx0Vmlld0NvbnRlbnQiLCJ3YWl0IiwiU3luYyIsImRlZmF1bHRzIiwidmlld0N0b3IiLCJ2aWV3UHJpb3JpdHkiLCJjb25maWd1cmUiLCJfZGVmYXVsdFZpZXdUZW1wbGF0ZSIsIl9kZWZhdWx0Vmlld0NvbnRlbnQiLCJyZXF1aXJlIiwiZmVhdHVyZXMiLCJfc3luY1N0YXR1c1JlcG9ydCIsImJpbmQiLCJfcmVwb3J0TGlzdGVuZXJzIiwiX3N5bmMiLCJjdXJyZW50VGltZSIsIl9yZWFkeSIsIm9wdGlvbnMiLCJ2aWV3IiwiY3JlYXRlVmlldyIsImhhc1N0YXJ0ZWQiLCJpbml0Iiwic2hvdyIsInN0YXJ0Iiwic2VuZCIsInJlY2VpdmUiLCJoaWRlIiwic3luY1RpbWUiLCJnZXRMb2NhbFRpbWUiLCJhdWRpb1RpbWUiLCJnZXRTeW5jVGltZSIsImNhbGxiYWNrIiwicHVzaCIsImNoYW5uZWwiLCJyZXBvcnQiLCJzdGF0dXMiLCJmb3JFYWNoIiwicmVhZHkiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsY0FBbkI7O0FBRUEsSUFBTUMsMExBQU47O0FBUUEsSUFBTUMscUJBQXFCO0FBQ3pCQztBQUR5QixDQUEzQjs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFtQk1DLEk7OztBQUNKO0FBQ0Esa0JBQWM7QUFBQTs7QUFBQSxrSUFDTkosVUFETSxFQUNNLElBRE47O0FBR1osUUFBTUssV0FBVztBQUNmQyx1Q0FEZTtBQUVmQyxvQkFBYztBQUZDLEtBQWpCOztBQU1BLFVBQUtDLFNBQUwsQ0FBZUgsUUFBZjs7QUFFQSxVQUFLSSxvQkFBTCxHQUE0QlIsbUJBQTVCO0FBQ0EsVUFBS1MsbUJBQUwsR0FBMkJSLGtCQUEzQjs7QUFFQSxVQUFLUyxPQUFMLENBQWEsVUFBYixFQUF5QixFQUFFQyxVQUFVLFdBQVosRUFBekI7O0FBRUEsVUFBS0MsaUJBQUwsR0FBeUIsTUFBS0EsaUJBQUwsQ0FBdUJDLElBQXZCLE9BQXpCO0FBQ0EsVUFBS0MsZ0JBQUwsR0FBd0IsRUFBeEI7QUFqQlk7QUFrQmI7O0FBRUQ7Ozs7OzJCQUNPO0FBQ0wsV0FBS0MsS0FBTCxHQUFhLHFCQUFlO0FBQUEsZUFBTSx5QkFBYUMsV0FBbkI7QUFBQSxPQUFmLENBQWI7QUFDQSxXQUFLQyxNQUFMLEdBQWMsS0FBZDs7QUFFQSxXQUFLWixRQUFMLEdBQWdCLEtBQUthLE9BQUwsQ0FBYWIsUUFBN0I7QUFDQSxXQUFLYyxJQUFMLEdBQVksS0FBS0MsVUFBTCxFQUFaO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1E7QUFDTjs7QUFFQSxVQUFJLENBQUMsS0FBS0MsVUFBVixFQUNFLEtBQUtDLElBQUw7O0FBRUYsV0FBS0MsSUFBTDtBQUNBLFdBQUtSLEtBQUwsQ0FBV1MsS0FBWCxDQUFpQixLQUFLQyxJQUF0QixFQUE0QixLQUFLQyxPQUFqQyxFQUEwQyxLQUFLZCxpQkFBL0M7QUFDRDs7QUFFRDs7OzsyQkFDTztBQUNMLFdBQUtlLElBQUw7QUFDQTtBQUNEOztBQUVEOzs7Ozs7Ozs7O2lDQU9hQyxRLEVBQVU7QUFDckIsYUFBTyxLQUFLYixLQUFMLENBQVdjLFlBQVgsQ0FBd0JELFFBQXhCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OztnQ0FPWUUsUyxFQUFXO0FBQ3JCLGFBQU8sS0FBS2YsS0FBTCxDQUFXZ0IsV0FBWCxDQUF1QkQsU0FBdkIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7O2dDQUlZRSxRLEVBQVU7QUFDcEIsV0FBS2xCLGdCQUFMLENBQXNCbUIsSUFBdEIsQ0FBMkJELFFBQTNCO0FBQ0Q7OztzQ0FFaUJFLE8sRUFBU0MsTSxFQUFRO0FBQ2pDLFVBQUlELFlBQVksYUFBaEIsRUFBK0I7QUFDN0IsWUFBSUMsT0FBT0MsTUFBUCxLQUFrQixVQUFsQixJQUFnQ0QsT0FBT0MsTUFBUCxLQUFrQixNQUF0RCxFQUE4RDtBQUM1RCxlQUFLdEIsZ0JBQUwsQ0FBc0J1QixPQUF0QixDQUE4QixVQUFDTCxRQUFEO0FBQUEsbUJBQWVBLFNBQVNHLE1BQVQsQ0FBZjtBQUFBLFdBQTlCOztBQUVBLGNBQUksQ0FBQyxLQUFLbEIsTUFBVixFQUFrQjtBQUNoQixpQkFBS0EsTUFBTCxHQUFjLElBQWQ7QUFDQSxpQkFBS3FCLEtBQUw7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7Ozs7QUFJSCx5QkFBZUMsUUFBZixDQUF3QnhDLFVBQXhCLEVBQW9DSSxJQUFwQzs7a0JBRWVBLEkiLCJmaWxlIjoiU3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL3ZpZXdzL1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTeW5jTW9kdWxlIGZyb20gJ3N5bmMvY2xpZW50JztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnN5bmMnO1xuXG5jb25zdCBkZWZhdWx0Vmlld1RlbXBsYXRlID0gYFxuPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wXCI+PC9kaXY+XG48ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgPHAgY2xhc3M9XCJzb2Z0LWJsaW5rXCI+PCU9IHdhaXQgJT48L3A+XG48L2Rpdj5cbjxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbVwiPjwvZGl2PlxuYDtcblxuY29uc3QgZGVmYXVsdFZpZXdDb250ZW50ID0ge1xuICB3YWl0OiBgQ2xvY2sgc3luY2luZyw8YnIgLz5zdGFuZCBieSZoZWxsaXA7YCxcbn07XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnc3luYydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIHN5bmNocm9uaXplcyB0aGUgbG9jYWwgYXVkaW8gY2xvY2sgb2YgdGhlIGNsaWVudCB3aXRoIHRoZSBjbG9ja1xuICogb2YgdGhlIHNlcnZlciAobWFzdGVyIGNsb2NrKS4gSXQgdGhlbiBpbnRlcm5hbGx5IHJlbGllcyBvbiB0aGUgYFdlYkF1ZGlvYFxuICogY2xvY2sgYW5kIHJlcXVpcmVzIHRoZSBwbGF0Zm9ybSB0byBhY2Nlc3MgdGhpcyBmZWF0dXJlLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5TeW5jfSpfX1xuICpcbiAqIF9Ob3RlOl8gdGhlIHNlcnZpY2UgaXMgYmFzZWQgb24gW2BnaXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jYF0oaHR0cHM6Ly9naXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jKS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnN5bmMgPSB0aGlzLnJlcXVpcmUoJ3N5bmMnKTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWQsIHRyYW5zbGF0ZSB0aGUgc3luYyB0aW1lIGluIGxvY2FsIHRpbWVcbiAqIGNvbnN0IHN5bmNUaW1lID0gdGhpcy5zeW5jLmdldFN5bmNUaW1lKCk7XG4gKiBjb25zdCBsb2NhbFRpbWUgPSB0aGlzLnN5bmMuZ2V0QXVkaW9UaW1lKHN5bmNUaW1lKTtcbiAqL1xuY2xhc3MgU3luYyBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICB2aWV3Q3RvcjogU2VnbWVudGVkVmlldyxcbiAgICAgIHZpZXdQcmlvcml0eTogMyxcbiAgICAgIC8vIEB0b2RvIC0gYWRkIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzeW5jIHNlcnZpY2VcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9kZWZhdWx0Vmlld1RlbXBsYXRlID0gZGVmYXVsdFZpZXdUZW1wbGF0ZTtcbiAgICB0aGlzLl9kZWZhdWx0Vmlld0NvbnRlbnQgPSBkZWZhdWx0Vmlld0NvbnRlbnQ7XG5cbiAgICB0aGlzLnJlcXVpcmUoJ3BsYXRmb3JtJywgeyBmZWF0dXJlczogJ3dlYi1hdWRpbycgfSk7XG5cbiAgICB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0ID0gdGhpcy5fc3luY1N0YXR1c1JlcG9ydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3JlcG9ydExpc3RlbmVycyA9IFtdO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGluaXQoKSB7XG4gICAgdGhpcy5fc3luYyA9IG5ldyBTeW5jTW9kdWxlKCgpID0+IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgdGhpcy5fcmVhZHkgPSBmYWxzZTtcblxuICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNob3coKTtcbiAgICB0aGlzLl9zeW5jLnN0YXJ0KHRoaXMuc2VuZCwgdGhpcy5yZWNlaXZlLCB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrLiBJZiBubyBhcmd1bWVudHMgcHJvdmlkZWQsXG4gICAqIHJldHVybnMgdGhlIGN1cnJlbnQgbG9jYWwgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN5bmNUaW1lIC0gVGltZSBmcm9tIHRoZSBzeW5jIGNsb2NrIChpbiBfc2Vjb25kc18pLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gTG9jYWwgdGltZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlblxuICAgKiAgYHN5bmNUaW1lYCAoaW4gX3NlY29uZHNfKS5cbiAgICovXG4gIGdldEF1ZGlvVGltZShzeW5jVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldExvY2FsVGltZShzeW5jVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0aW1lIGluIHRoZSBzeW5jIGNsb2NrLiBJZiBubyBhcmd1bWVudHMgcHJvdmlkZWQsXG4gICAqIHJldHVybnMgdGhlIGN1cnJlbnQgc3luYyB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gYXVkaW9UaW1lIC0gVGltZSBmcm9tIHRoZSBsb2NhbCBjbG9jayAoaW4gX3NlY29uZHNfKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIFN5bmMgdGltZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlblxuICAgKiAgYGF1ZGlvVGltZWAgKGluIF9zZWNvbmRzXykuXG4gICAqL1xuICBnZXRTeW5jVGltZShhdWRpb1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZShhdWRpb1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIHRoZSBzeW5jaHJvbml6YXRpb24gcmVwb3J0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBhZGRMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuX3JlcG9ydExpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIF9zeW5jU3RhdHVzUmVwb3J0KGNoYW5uZWwsIHJlcG9ydCkge1xuICAgIGlmIChjaGFubmVsID09PSAnc3luYzpzdGF0dXMnKSB7XG4gICAgICBpZiAocmVwb3J0LnN0YXR1cyA9PT0gJ3RyYWluaW5nJyB8fCByZXBvcnQuc3RhdHVzID09PSAnc3luYycpIHtcbiAgICAgICAgdGhpcy5fcmVwb3J0TGlzdGVuZXJzLmZvckVhY2goKGNhbGxiYWNrKSA9PiAgY2FsbGJhY2socmVwb3J0KSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9yZWFkeSkge1xuICAgICAgICAgIHRoaXMuX3JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTeW5jKTtcblxuZXhwb3J0IGRlZmF1bHQgU3luYztcbiJdfQ==