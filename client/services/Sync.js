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
      // @todo - add options to configure the sync service
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsImRlZmF1bHRWaWV3VGVtcGxhdGUiLCJkZWZhdWx0Vmlld0NvbnRlbnQiLCJ3YWl0IiwiU3luYyIsImRlZmF1bHRzIiwidmlld0N0b3IiLCJ2aWV3UHJpb3JpdHkiLCJjb25maWd1cmUiLCJfZGVmYXVsdFZpZXdUZW1wbGF0ZSIsIl9kZWZhdWx0Vmlld0NvbnRlbnQiLCJyZXF1aXJlIiwiZmVhdHVyZXMiLCJfc3luY1N0YXR1c1JlcG9ydCIsImJpbmQiLCJfcmVwb3J0TGlzdGVuZXJzIiwiX3N5bmMiLCJjdXJyZW50VGltZSIsIl9yZWFkeSIsIm9wdGlvbnMiLCJ2aWV3IiwiY3JlYXRlVmlldyIsImhhc1N0YXJ0ZWQiLCJpbml0Iiwic2hvdyIsInN0YXJ0Iiwic2VuZCIsInJlY2VpdmUiLCJoaWRlIiwic3luY1RpbWUiLCJnZXRMb2NhbFRpbWUiLCJhdWRpb1RpbWUiLCJnZXRTeW5jVGltZSIsImNhbGxiYWNrIiwicHVzaCIsImNoYW5uZWwiLCJyZXBvcnQiLCJzdGF0dXMiLCJmb3JFYWNoIiwicmVhZHkiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsY0FBbkI7O0FBRUEsSUFBTUMsMExBQU47O0FBUUEsSUFBTUMscUJBQXFCO0FBQ3pCQztBQUR5QixDQUEzQjs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFtQk1DLEk7OztBQUNKO0FBQ0Esa0JBQWM7QUFBQTs7QUFBQSxrSUFDTkosVUFETSxFQUNNLElBRE47O0FBR1osUUFBTUssV0FBVztBQUNmQyx1Q0FEZTtBQUVmQyxvQkFBYztBQUNkO0FBSGUsS0FBakI7O0FBTUEsVUFBS0MsU0FBTCxDQUFlSCxRQUFmOztBQUVBLFVBQUtJLG9CQUFMLEdBQTRCUixtQkFBNUI7QUFDQSxVQUFLUyxtQkFBTCxHQUEyQlIsa0JBQTNCOztBQUVBLFVBQUtTLE9BQUwsQ0FBYSxVQUFiLEVBQXlCLEVBQUVDLFVBQVUsV0FBWixFQUF6Qjs7QUFFQSxVQUFLQyxpQkFBTCxHQUF5QixNQUFLQSxpQkFBTCxDQUF1QkMsSUFBdkIsT0FBekI7QUFDQSxVQUFLQyxnQkFBTCxHQUF3QixFQUF4QjtBQWpCWTtBQWtCYjs7QUFFRDs7Ozs7MkJBQ087QUFDTCxXQUFLQyxLQUFMLEdBQWEscUJBQWU7QUFBQSxlQUFNLHlCQUFhQyxXQUFuQjtBQUFBLE9BQWYsQ0FBYjtBQUNBLFdBQUtDLE1BQUwsR0FBYyxLQUFkOztBQUVBLFdBQUtaLFFBQUwsR0FBZ0IsS0FBS2EsT0FBTCxDQUFhYixRQUE3QjtBQUNBLFdBQUtjLElBQUwsR0FBWSxLQUFLQyxVQUFMLEVBQVo7QUFDRDs7QUFFRDs7Ozs0QkFDUTtBQUNOOztBQUVBLFVBQUksQ0FBQyxLQUFLQyxVQUFWLEVBQ0UsS0FBS0MsSUFBTDs7QUFFRixXQUFLQyxJQUFMO0FBQ0EsV0FBS1IsS0FBTCxDQUFXUyxLQUFYLENBQWlCLEtBQUtDLElBQXRCLEVBQTRCLEtBQUtDLE9BQWpDLEVBQTBDLEtBQUtkLGlCQUEvQztBQUNEOztBQUVEOzs7OzJCQUNPO0FBQ0wsV0FBS2UsSUFBTDtBQUNBO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7aUNBT2FDLFEsRUFBVTtBQUNyQixhQUFPLEtBQUtiLEtBQUwsQ0FBV2MsWUFBWCxDQUF3QkQsUUFBeEIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7O2dDQU9ZRSxTLEVBQVc7QUFDckIsYUFBTyxLQUFLZixLQUFMLENBQVdnQixXQUFYLENBQXVCRCxTQUF2QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Z0NBSVlFLFEsRUFBVTtBQUNwQixXQUFLbEIsZ0JBQUwsQ0FBc0JtQixJQUF0QixDQUEyQkQsUUFBM0I7QUFDRDs7O3NDQUVpQkUsTyxFQUFTQyxNLEVBQVE7QUFDakMsVUFBSUQsWUFBWSxhQUFoQixFQUErQjtBQUM3QixZQUFJQyxPQUFPQyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDRCxPQUFPQyxNQUFQLEtBQWtCLE1BQXRELEVBQThEO0FBQzVELGVBQUt0QixnQkFBTCxDQUFzQnVCLE9BQXRCLENBQThCLFVBQUNMLFFBQUQ7QUFBQSxtQkFBZUEsU0FBU0csTUFBVCxDQUFmO0FBQUEsV0FBOUI7O0FBRUEsY0FBSSxDQUFDLEtBQUtsQixNQUFWLEVBQWtCO0FBQ2hCLGlCQUFLQSxNQUFMLEdBQWMsSUFBZDtBQUNBLGlCQUFLcUIsS0FBTDtBQUNEO0FBQ0Y7QUFDRjtBQUNGOzs7OztBQUlILHlCQUFlQyxRQUFmLENBQXdCeEMsVUFBeEIsRUFBb0NJLElBQXBDOztrQkFFZUEsSSIsImZpbGUiOiJTeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vdmlld3MvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFN5bmNNb2R1bGUgZnJvbSAnc3luYy9jbGllbnQnO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c3luYyc7XG5cbmNvbnN0IGRlZmF1bHRWaWV3VGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj48L2Rpdj5cbjxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPlxuICA8cCBjbGFzcz1cInNvZnQtYmxpbmtcIj48JT0gd2FpdCAlPjwvcD5cbjwvZGl2PlxuPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tXCI+PC9kaXY+XG5gO1xuXG5jb25zdCBkZWZhdWx0Vmlld0NvbnRlbnQgPSB7XG4gIHdhaXQ6IGBDbG9jayBzeW5jaW5nLDxiciAvPnN0YW5kIGJ5JmhlbGxpcDtgLFxufTtcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdzeW5jJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2Ugc3luY2hyb25pemVzIHRoZSBsb2NhbCBhdWRpbyBjbG9jayBvZiB0aGUgY2xpZW50IHdpdGggdGhlIGNsb2NrXG4gKiBvZiB0aGUgc2VydmVyIChtYXN0ZXIgY2xvY2spLiBJdCB0aGVuIGludGVybmFsbHkgcmVsaWVzIG9uIHRoZSBgV2ViQXVkaW9gXG4gKiBjbG9jayBhbmQgcmVxdWlyZXMgdGhlIHBsYXRmb3JtIHRvIGFjY2VzcyB0aGlzIGZlYXR1cmUuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlN5bmN9Kl9fXG4gKlxuICogX05vdGU6XyB0aGUgc2VydmljZSBpcyBiYXNlZCBvbiBbYGdpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmNgXShodHRwczovL2dpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmMpLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZCwgdHJhbnNsYXRlIHRoZSBzeW5jIHRpbWUgaW4gbG9jYWwgdGltZVxuICogY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcbiAqIGNvbnN0IGxvY2FsVGltZSA9IHRoaXMuc3luYy5nZXRBdWRpb1RpbWUoc3luY1RpbWUpO1xuICovXG5jbGFzcyBTeW5jIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHZpZXdDdG9yOiBTZWdtZW50ZWRWaWV3LFxuICAgICAgdmlld1ByaW9yaXR5OiAzLFxuICAgICAgLy8gQHRvZG8gLSBhZGQgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHN5bmMgc2VydmljZVxuICAgIH1cblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX2RlZmF1bHRWaWV3VGVtcGxhdGUgPSBkZWZhdWx0Vmlld1RlbXBsYXRlO1xuICAgIHRoaXMuX2RlZmF1bHRWaWV3Q29udGVudCA9IGRlZmF1bHRWaWV3Q29udGVudDtcblxuICAgIHRoaXMucmVxdWlyZSgncGxhdGZvcm0nLCB7IGZlYXR1cmVzOiAnd2ViLWF1ZGlvJyB9KTtcblxuICAgIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQgPSB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fcmVwb3J0TGlzdGVuZXJzID0gW107XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLl9zeW5jID0gbmV3IFN5bmNNb2R1bGUoKCkgPT4gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcbiAgICB0aGlzLl9yZWFkeSA9IGZhbHNlO1xuXG4gICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMuc2hvdygpO1xuICAgIHRoaXMuX3N5bmMuc3RhcnQodGhpcy5zZW5kLCB0aGlzLnJlY2VpdmUsIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdGltZSBpbiB0aGUgbG9jYWwgY2xvY2suIElmIG5vIGFyZ3VtZW50cyBwcm92aWRlZCxcbiAgICogcmV0dXJucyB0aGUgY3VycmVudCBsb2NhbCB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3luY1RpbWUgLSBUaW1lIGZyb20gdGhlIHN5bmMgY2xvY2sgKGluIF9zZWNvbmRzXykuXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBMb2NhbCB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuXG4gICAqICBgc3luY1RpbWVgIChpbiBfc2Vjb25kc18pLlxuICAgKi9cbiAgZ2V0QXVkaW9UaW1lKHN5bmNUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIHN5bmMgY2xvY2suIElmIG5vIGFyZ3VtZW50cyBwcm92aWRlZCxcbiAgICogcmV0dXJucyB0aGUgY3VycmVudCBzeW5jIHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhdWRpb1RpbWUgLSBUaW1lIGZyb20gdGhlIGxvY2FsIGNsb2NrIChpbiBfc2Vjb25kc18pLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gU3luYyB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuXG4gICAqICBgYXVkaW9UaW1lYCAoaW4gX3NlY29uZHNfKS5cbiAgICovXG4gIGdldFN5bmNUaW1lKGF1ZGlvVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldFN5bmNUaW1lKGF1ZGlvVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gdGhlIHN5bmNocm9uaXphdGlvbiByZXBvcnRzIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIGFkZExpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fcmVwb3J0TGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgX3N5bmNTdGF0dXNSZXBvcnQoY2hhbm5lbCwgcmVwb3J0KSB7XG4gICAgaWYgKGNoYW5uZWwgPT09ICdzeW5jOnN0YXR1cycpIHtcbiAgICAgIGlmIChyZXBvcnQuc3RhdHVzID09PSAndHJhaW5pbmcnIHx8IHJlcG9ydC5zdGF0dXMgPT09ICdzeW5jJykge1xuICAgICAgICB0aGlzLl9yZXBvcnRMaXN0ZW5lcnMuZm9yRWFjaCgoY2FsbGJhY2spID0+ICBjYWxsYmFjayhyZXBvcnQpKTtcblxuICAgICAgICBpZiAoIXRoaXMuX3JlYWR5KSB7XG4gICAgICAgICAgdGhpcy5fcmVhZHkgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFN5bmMpO1xuXG5leHBvcnQgZGVmYXVsdCBTeW5jO1xuIl19