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
 * Interface for the client `'sync'` service.
 *
 * The `sync` service synchronizes the local audio clock of the client with the
 * clock of the server (master clock). It internally relies on the `WebAudio`
 * clock and then requires the `platform` service to access this feature.
 *
 * __*The service must be used with its
 * [server-side counterpart]{@link module:soundworks/server.Sync}*__
 *
 * _<span class="warning">__WARNING__</span> This class should never be
 * instanciated manually_
 *
 * _Note:_ the service is based on
 * [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * @memberof module:soundworks/client
 *
 * @example
 * // inside the experience constructor
 * this.sync = this.require('sync');
 * // when the experience has started, translate the sync time in local time
 * const syncTime = this.sync.getSyncTime();
 * const localTime = this.sync.getAudioTime(syncTime);
 */

var Sync = function (_Service) {
  (0, _inherits3.default)(Sync, _Service);

  function Sync() {
    (0, _classCallCheck3.default)(this, Sync);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Sync.__proto__ || (0, _getPrototypeOf2.default)(Sync)).call(this, SERVICE_ID, true));

    var defaults = {
      viewPriority: 3,
      useAudioTime: true
    };

    _this.configure(defaults);

    var getTime = _this.options.useAudioTime ? function () {
      return _wavesAudio.audioContext.currentTime;
    } : function () {
      return new Date().getTime() * 0.001;
    };

    _this._sync = new _client2.default(getTime);
    _this._ready = false;

    _this.require('platform', { features: 'web-audio' });

    _this._syncStatusReport = _this._syncStatusReport.bind(_this);
    _this._reportListeners = [];
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Sync, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(Sync.prototype.__proto__ || (0, _getPrototypeOf2.default)(Sync.prototype), 'start', this).call(this);
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
  }, {
    key: 'getLocaltime',
    value: function getLocaltime(syncTime) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIlN5bmMiLCJkZWZhdWx0cyIsInZpZXdQcmlvcml0eSIsInVzZUF1ZGlvVGltZSIsImNvbmZpZ3VyZSIsImdldFRpbWUiLCJvcHRpb25zIiwiY3VycmVudFRpbWUiLCJEYXRlIiwiX3N5bmMiLCJfcmVhZHkiLCJyZXF1aXJlIiwiZmVhdHVyZXMiLCJfc3luY1N0YXR1c1JlcG9ydCIsImJpbmQiLCJfcmVwb3J0TGlzdGVuZXJzIiwic2hvdyIsInN0YXJ0Iiwic2VuZCIsInJlY2VpdmUiLCJoaWRlIiwic3luY1RpbWUiLCJnZXRMb2NhbFRpbWUiLCJhdWRpb1RpbWUiLCJnZXRTeW5jVGltZSIsImNhbGxiYWNrIiwicHVzaCIsImNoYW5uZWwiLCJyZXBvcnQiLCJzdGF0dXMiLCJmb3JFYWNoIiwicmVhZHkiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsY0FBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBeUJNQyxJOzs7QUFDSixrQkFBYztBQUFBOztBQUFBLGtJQUNORCxVQURNLEVBQ00sSUFETjs7QUFHWixRQUFNRSxXQUFXO0FBQ2ZDLG9CQUFjLENBREM7QUFFZkMsb0JBQWM7QUFGQyxLQUFqQjs7QUFNQSxVQUFLQyxTQUFMLENBQWVILFFBQWY7O0FBRUEsUUFBTUksVUFBVSxNQUFLQyxPQUFMLENBQWFILFlBQWIsR0FDZDtBQUFBLGFBQU0seUJBQWFJLFdBQW5CO0FBQUEsS0FEYyxHQUVkO0FBQUEsYUFBTyxJQUFJQyxJQUFKLEdBQVdILE9BQVgsS0FBdUIsS0FBOUI7QUFBQSxLQUZGOztBQUlBLFVBQUtJLEtBQUwsR0FBYSxxQkFBZUosT0FBZixDQUFiO0FBQ0EsVUFBS0ssTUFBTCxHQUFjLEtBQWQ7O0FBRUEsVUFBS0MsT0FBTCxDQUFhLFVBQWIsRUFBeUIsRUFBRUMsVUFBVSxXQUFaLEVBQXpCOztBQUVBLFVBQUtDLGlCQUFMLEdBQXlCLE1BQUtBLGlCQUFMLENBQXVCQyxJQUF2QixPQUF6QjtBQUNBLFVBQUtDLGdCQUFMLEdBQXdCLEVBQXhCO0FBckJZO0FBc0JiOztBQUVEOzs7Ozs0QkFDUTtBQUNOO0FBQ0EsV0FBS0MsSUFBTDs7QUFFQSxXQUFLUCxLQUFMLENBQVdRLEtBQVgsQ0FBaUIsS0FBS0MsSUFBdEIsRUFBNEIsS0FBS0MsT0FBakMsRUFBMEMsS0FBS04saUJBQS9DO0FBQ0Q7O0FBRUQ7Ozs7MkJBQ087QUFDTCxXQUFLTyxJQUFMO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7Ozs7OztpQ0FPYUMsUSxFQUFVO0FBQ3JCLGFBQU8sS0FBS1osS0FBTCxDQUFXYSxZQUFYLENBQXdCRCxRQUF4QixDQUFQO0FBQ0Q7OztpQ0FHWUEsUSxFQUFVO0FBQ3JCLGFBQU8sS0FBS1osS0FBTCxDQUFXYSxZQUFYLENBQXdCRCxRQUF4QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Z0NBT1lFLFMsRUFBVztBQUNyQixhQUFPLEtBQUtkLEtBQUwsQ0FBV2UsV0FBWCxDQUF1QkQsU0FBdkIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7O2dDQUlZRSxRLEVBQVU7QUFDcEIsV0FBS1YsZ0JBQUwsQ0FBc0JXLElBQXRCLENBQTJCRCxRQUEzQjtBQUNEOzs7c0NBRWlCRSxPLEVBQVNDLE0sRUFBUTtBQUNqQyxVQUFJRCxZQUFZLGFBQWhCLEVBQStCO0FBQzdCLFlBQUlDLE9BQU9DLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0NELE9BQU9DLE1BQVAsS0FBa0IsTUFBdEQsRUFBOEQ7QUFDNUQsZUFBS2QsZ0JBQUwsQ0FBc0JlLE9BQXRCLENBQThCLFVBQUNMLFFBQUQ7QUFBQSxtQkFBZUEsU0FBU0csTUFBVCxDQUFmO0FBQUEsV0FBOUI7O0FBRUEsY0FBSSxDQUFDLEtBQUtsQixNQUFWLEVBQWtCO0FBQ2hCLGlCQUFLQSxNQUFMLEdBQWMsSUFBZDtBQUNBLGlCQUFLcUIsS0FBTDtBQUNEO0FBQ0Y7QUFDRjtBQUNGOzs7OztBQUlILHlCQUFlQyxRQUFmLENBQXdCakMsVUFBeEIsRUFBb0NDLElBQXBDOztrQkFFZUEsSSIsImZpbGUiOiJTeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vdmlld3MvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFN5bmNNb2R1bGUgZnJvbSAnc3luYy9jbGllbnQnO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c3luYyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnc3luYydgIHNlcnZpY2UuXG4gKlxuICogVGhlIGBzeW5jYCBzZXJ2aWNlIHN5bmNocm9uaXplcyB0aGUgbG9jYWwgYXVkaW8gY2xvY2sgb2YgdGhlIGNsaWVudCB3aXRoIHRoZVxuICogY2xvY2sgb2YgdGhlIHNlcnZlciAobWFzdGVyIGNsb2NrKS4gSXQgaW50ZXJuYWxseSByZWxpZXMgb24gdGhlIGBXZWJBdWRpb2BcbiAqIGNsb2NrIGFuZCB0aGVuIHJlcXVpcmVzIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UgdG8gYWNjZXNzIHRoaXMgZmVhdHVyZS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHNcbiAqIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlN5bmN9Kl9fXG4gKlxuICogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZVxuICogaW5zdGFuY2lhdGVkIG1hbnVhbGx5X1xuICpcbiAqIF9Ob3RlOl8gdGhlIHNlcnZpY2UgaXMgYmFzZWQgb25cbiAqIFtgZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luY2BdKGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luYykuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZCwgdHJhbnNsYXRlIHRoZSBzeW5jIHRpbWUgaW4gbG9jYWwgdGltZVxuICogY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcbiAqIGNvbnN0IGxvY2FsVGltZSA9IHRoaXMuc3luYy5nZXRBdWRpb1RpbWUoc3luY1RpbWUpO1xuICovXG5jbGFzcyBTeW5jIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICB2aWV3UHJpb3JpdHk6IDMsXG4gICAgICB1c2VBdWRpb1RpbWU6IHRydWUsXG4gICAgICAvLyBAdG9kbyAtIGFkZCBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc3luYyBzZXJ2aWNlXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIGNvbnN0IGdldFRpbWUgPSB0aGlzLm9wdGlvbnMudXNlQXVkaW9UaW1lID9cbiAgICAgICgpID0+IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSA6XG4gICAgICAoKSA9PiAobmV3IERhdGUoKS5nZXRUaW1lKCkgKiAwLjAwMSk7XG5cbiAgICB0aGlzLl9zeW5jID0gbmV3IFN5bmNNb2R1bGUoZ2V0VGltZSk7XG4gICAgdGhpcy5fcmVhZHkgPSBmYWxzZTtcblxuICAgIHRoaXMucmVxdWlyZSgncGxhdGZvcm0nLCB7IGZlYXR1cmVzOiAnd2ViLWF1ZGlvJyB9KTtcblxuICAgIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQgPSB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fcmVwb3J0TGlzdGVuZXJzID0gW107XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLnNob3coKTtcblxuICAgIHRoaXMuX3N5bmMuc3RhcnQodGhpcy5zZW5kLCB0aGlzLnJlY2VpdmUsIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdGltZSBpbiB0aGUgbG9jYWwgY2xvY2suIElmIG5vIGFyZ3VtZW50cyBwcm92aWRlZCxcbiAgICogcmV0dXJucyB0aGUgY3VycmVudCBsb2NhbCB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3luY1RpbWUgLSBUaW1lIGZyb20gdGhlIHN5bmMgY2xvY2sgKGluIF9zZWNvbmRzXykuXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBMb2NhbCB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuXG4gICAqICBgc3luY1RpbWVgIChpbiBfc2Vjb25kc18pLlxuICAgKi9cbiAgZ2V0QXVkaW9UaW1lKHN5bmNUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKTtcbiAgfVxuXG5cbiAgZ2V0TG9jYWx0aW1lKHN5bmNUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIHN5bmMgY2xvY2suIElmIG5vIGFyZ3VtZW50cyBwcm92aWRlZCxcbiAgICogcmV0dXJucyB0aGUgY3VycmVudCBzeW5jIHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhdWRpb1RpbWUgLSBUaW1lIGZyb20gdGhlIGxvY2FsIGNsb2NrIChpbiBfc2Vjb25kc18pLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gU3luYyB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuXG4gICAqICBgYXVkaW9UaW1lYCAoaW4gX3NlY29uZHNfKS5cbiAgICovXG4gIGdldFN5bmNUaW1lKGF1ZGlvVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldFN5bmNUaW1lKGF1ZGlvVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gdGhlIHN5bmNocm9uaXphdGlvbiByZXBvcnRzIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIGFkZExpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fcmVwb3J0TGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgX3N5bmNTdGF0dXNSZXBvcnQoY2hhbm5lbCwgcmVwb3J0KSB7XG4gICAgaWYgKGNoYW5uZWwgPT09ICdzeW5jOnN0YXR1cycpIHtcbiAgICAgIGlmIChyZXBvcnQuc3RhdHVzID09PSAndHJhaW5pbmcnIHx8IHJlcG9ydC5zdGF0dXMgPT09ICdzeW5jJykge1xuICAgICAgICB0aGlzLl9yZXBvcnRMaXN0ZW5lcnMuZm9yRWFjaCgoY2FsbGJhY2spID0+ICBjYWxsYmFjayhyZXBvcnQpKTtcblxuICAgICAgICBpZiAoIXRoaXMuX3JlYWR5KSB7XG4gICAgICAgICAgdGhpcy5fcmVhZHkgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFN5bmMpO1xuXG5leHBvcnQgZGVmYXVsdCBTeW5jO1xuIl19