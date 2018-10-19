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

var _sync = require('@ircam/sync');

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
      // @todo - add options to configure the sync service
    };

    _this.configure(defaults);

    var getTime = _this.options.useAudioTime ? function () {
      return _wavesAudio.audioContext.currentTime;
    } : function () {
      return new Date().getTime() * 0.001;
    };

    _this._sync = new _sync.SyncClient(getTime);
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
      var _this2 = this;

      (0, _get3.default)(Sync.prototype.__proto__ || (0, _getPrototypeOf2.default)(Sync.prototype), 'start', this).call(this);
      this.show();

      var sendFunction = function sendFunction() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _this2.send.apply(_this2, ['ping'].concat(args));
      };
      var receiveFunction = function receiveFunction(callback) {
        return _this2.receive('pong', callback);
      };

      this._sync.start(sendFunction, receiveFunction, this._syncStatusReport);
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
    key: 'getLocalTime',
    value: function getLocalTime(syncTime) {
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
    value: function _syncStatusReport(report) {
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
  }]);
  return Sync;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Sync);

exports.default = Sync;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIlN5bmMiLCJkZWZhdWx0cyIsInZpZXdQcmlvcml0eSIsInVzZUF1ZGlvVGltZSIsImNvbmZpZ3VyZSIsImdldFRpbWUiLCJvcHRpb25zIiwiYXVkaW9Db250ZXh0IiwiY3VycmVudFRpbWUiLCJEYXRlIiwiX3N5bmMiLCJTeW5jQ2xpZW50IiwiX3JlYWR5IiwicmVxdWlyZSIsImZlYXR1cmVzIiwiX3N5bmNTdGF0dXNSZXBvcnQiLCJiaW5kIiwiX3JlcG9ydExpc3RlbmVycyIsInNob3ciLCJzZW5kRnVuY3Rpb24iLCJhcmdzIiwic2VuZCIsInJlY2VpdmVGdW5jdGlvbiIsInJlY2VpdmUiLCJjYWxsYmFjayIsInN0YXJ0IiwiaGlkZSIsInN5bmNUaW1lIiwiZ2V0TG9jYWxUaW1lIiwiYXVkaW9UaW1lIiwiZ2V0U3luY1RpbWUiLCJwdXNoIiwicmVwb3J0Iiwic3RhdHVzIiwiZm9yRWFjaCIsInJlYWR5IiwiU2VydmljZSIsInNlcnZpY2VNYW5hZ2VyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsYUFBYSxjQUFuQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF5Qk1DLEk7OztBQUNKLGtCQUFjO0FBQUE7O0FBQUEsa0lBQ05ELFVBRE0sRUFDTSxJQUROOztBQUdaLFFBQU1FLFdBQVc7QUFDZkMsb0JBQWMsQ0FEQztBQUVmQyxvQkFBYztBQUNkO0FBSGUsS0FBakI7O0FBTUEsVUFBS0MsU0FBTCxDQUFlSCxRQUFmOztBQUVBLFFBQU1JLFVBQVUsTUFBS0MsT0FBTCxDQUFhSCxZQUFiLEdBQ2Q7QUFBQSxhQUFNSSx5QkFBYUMsV0FBbkI7QUFBQSxLQURjLEdBRWQ7QUFBQSxhQUFPLElBQUlDLElBQUosR0FBV0osT0FBWCxLQUF1QixLQUE5QjtBQUFBLEtBRkY7O0FBSUEsVUFBS0ssS0FBTCxHQUFhLElBQUlDLGdCQUFKLENBQWVOLE9BQWYsQ0FBYjtBQUNBLFVBQUtPLE1BQUwsR0FBYyxLQUFkOztBQUVBLFVBQUtDLE9BQUwsQ0FBYSxVQUFiLEVBQXlCLEVBQUVDLFVBQVUsV0FBWixFQUF6Qjs7QUFFQSxVQUFLQyxpQkFBTCxHQUF5QixNQUFLQSxpQkFBTCxDQUF1QkMsSUFBdkIsT0FBekI7QUFDQSxVQUFLQyxnQkFBTCxHQUF3QixFQUF4QjtBQXJCWTtBQXNCYjs7QUFFRDs7Ozs7NEJBQ1E7QUFBQTs7QUFDTjtBQUNBLFdBQUtDLElBQUw7O0FBRUEsVUFBTUMsZUFBZSxTQUFmQSxZQUFlO0FBQUEsMENBQUlDLElBQUo7QUFBSUEsY0FBSjtBQUFBOztBQUFBLGVBQWEsT0FBS0MsSUFBTCxnQkFBVSxNQUFWLFNBQXFCRCxJQUFyQixFQUFiO0FBQUEsT0FBckI7QUFDQSxVQUFNRSxrQkFBa0IsU0FBbEJBLGVBQWtCO0FBQUEsZUFBWSxPQUFLQyxPQUFMLENBQWEsTUFBYixFQUFxQkMsUUFBckIsQ0FBWjtBQUFBLE9BQXhCOztBQUVBLFdBQUtkLEtBQUwsQ0FBV2UsS0FBWCxDQUFpQk4sWUFBakIsRUFBK0JHLGVBQS9CLEVBQWdELEtBQUtQLGlCQUFyRDtBQUNEOztBQUVEOzs7OzJCQUNPO0FBQ0wsV0FBS1csSUFBTDtBQUNBO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7aUNBT2FDLFEsRUFBVTtBQUNyQixhQUFPLEtBQUtqQixLQUFMLENBQVdrQixZQUFYLENBQXdCRCxRQUF4QixDQUFQO0FBQ0Q7OztpQ0FFWUEsUSxFQUFVO0FBQ3JCLGFBQU8sS0FBS2pCLEtBQUwsQ0FBV2tCLFlBQVgsQ0FBd0JELFFBQXhCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OztnQ0FPWUUsUyxFQUFXO0FBQ3JCLGFBQU8sS0FBS25CLEtBQUwsQ0FBV29CLFdBQVgsQ0FBdUJELFNBQXZCLENBQVA7QUFDRDs7QUFFRDs7Ozs7OztnQ0FJWUwsUSxFQUFVO0FBQ3BCLFdBQUtQLGdCQUFMLENBQXNCYyxJQUF0QixDQUEyQlAsUUFBM0I7QUFDRDs7O3NDQUVpQlEsTSxFQUFRO0FBQ3hCLFVBQUlBLE9BQU9DLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0NELE9BQU9DLE1BQVAsS0FBa0IsTUFBdEQsRUFBOEQ7QUFDNUQsYUFBS2hCLGdCQUFMLENBQXNCaUIsT0FBdEIsQ0FBOEIsVUFBQ1YsUUFBRDtBQUFBLGlCQUFlQSxTQUFTUSxNQUFULENBQWY7QUFBQSxTQUE5Qjs7QUFFQSxZQUFJLENBQUMsS0FBS3BCLE1BQVYsRUFBa0I7QUFDaEIsZUFBS0EsTUFBTCxHQUFjLElBQWQ7QUFDQSxlQUFLdUIsS0FBTDtBQUNEO0FBQ0Y7QUFDRjs7O0VBckZnQkMsaUI7O0FBeUZuQkMseUJBQWVDLFFBQWYsQ0FBd0J2QyxVQUF4QixFQUFvQ0MsSUFBcEM7O2tCQUVlQSxJIiwiZmlsZSI6IlN5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgeyBTeW5jQ2xpZW50IH0gZnJvbSAnQGlyY2FtL3N5bmMnO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c3luYyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnc3luYydgIHNlcnZpY2UuXG4gKlxuICogVGhlIGBzeW5jYCBzZXJ2aWNlIHN5bmNocm9uaXplcyB0aGUgbG9jYWwgYXVkaW8gY2xvY2sgb2YgdGhlIGNsaWVudCB3aXRoIHRoZVxuICogY2xvY2sgb2YgdGhlIHNlcnZlciAobWFzdGVyIGNsb2NrKS4gSXQgaW50ZXJuYWxseSByZWxpZXMgb24gdGhlIGBXZWJBdWRpb2BcbiAqIGNsb2NrIGFuZCB0aGVuIHJlcXVpcmVzIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UgdG8gYWNjZXNzIHRoaXMgZmVhdHVyZS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHNcbiAqIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlN5bmN9Kl9fXG4gKlxuICogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZVxuICogaW5zdGFuY2lhdGVkIG1hbnVhbGx5X1xuICpcbiAqIF9Ob3RlOl8gdGhlIHNlcnZpY2UgaXMgYmFzZWQgb25cbiAqIFtgZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luY2BdKGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luYykuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZCwgdHJhbnNsYXRlIHRoZSBzeW5jIHRpbWUgaW4gbG9jYWwgdGltZVxuICogY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcbiAqIGNvbnN0IGxvY2FsVGltZSA9IHRoaXMuc3luYy5nZXRBdWRpb1RpbWUoc3luY1RpbWUpO1xuICovXG5jbGFzcyBTeW5jIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICB2aWV3UHJpb3JpdHk6IDMsXG4gICAgICB1c2VBdWRpb1RpbWU6IHRydWUsXG4gICAgICAvLyBAdG9kbyAtIGFkZCBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc3luYyBzZXJ2aWNlXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIGNvbnN0IGdldFRpbWUgPSB0aGlzLm9wdGlvbnMudXNlQXVkaW9UaW1lID9cbiAgICAgICgpID0+IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSA6XG4gICAgICAoKSA9PiAobmV3IERhdGUoKS5nZXRUaW1lKCkgKiAwLjAwMSk7XG5cbiAgICB0aGlzLl9zeW5jID0gbmV3IFN5bmNDbGllbnQoZ2V0VGltZSk7XG4gICAgdGhpcy5fcmVhZHkgPSBmYWxzZTtcblxuICAgIHRoaXMucmVxdWlyZSgncGxhdGZvcm0nLCB7IGZlYXR1cmVzOiAnd2ViLWF1ZGlvJyB9KTtcblxuICAgIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQgPSB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fcmVwb3J0TGlzdGVuZXJzID0gW107XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLnNob3coKTtcblxuICAgIGNvbnN0IHNlbmRGdW5jdGlvbiA9ICguLi5hcmdzKSA9PiB0aGlzLnNlbmQoJ3BpbmcnLCAuLi5hcmdzKTtcbiAgICBjb25zdCByZWNlaXZlRnVuY3Rpb24gPSBjYWxsYmFjayA9PiB0aGlzLnJlY2VpdmUoJ3BvbmcnLCBjYWxsYmFjayk7XG5cbiAgICB0aGlzLl9zeW5jLnN0YXJ0KHNlbmRGdW5jdGlvbiwgcmVjZWl2ZUZ1bmN0aW9uLCB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrLiBJZiBubyBhcmd1bWVudHMgcHJvdmlkZWQsXG4gICAqIHJldHVybnMgdGhlIGN1cnJlbnQgbG9jYWwgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN5bmNUaW1lIC0gVGltZSBmcm9tIHRoZSBzeW5jIGNsb2NrIChpbiBfc2Vjb25kc18pLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gTG9jYWwgdGltZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlblxuICAgKiAgYHN5bmNUaW1lYCAoaW4gX3NlY29uZHNfKS5cbiAgICovXG4gIGdldEF1ZGlvVGltZShzeW5jVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldExvY2FsVGltZShzeW5jVGltZSk7XG4gIH1cblxuICBnZXRMb2NhbFRpbWUoc3luY1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRMb2NhbFRpbWUoc3luY1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdGltZSBpbiB0aGUgc3luYyBjbG9jay4gSWYgbm8gYXJndW1lbnRzIHByb3ZpZGVkLFxuICAgKiByZXR1cm5zIHRoZSBjdXJyZW50IHN5bmMgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGF1ZGlvVGltZSAtIFRpbWUgZnJvbSB0aGUgbG9jYWwgY2xvY2sgKGluIF9zZWNvbmRzXykuXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBTeW5jIHRpbWUgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW5cbiAgICogIGBhdWRpb1RpbWVgIChpbiBfc2Vjb25kc18pLlxuICAgKi9cbiAgZ2V0U3luY1RpbWUoYXVkaW9UaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUoYXVkaW9UaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBjYWxsYmFjayBmdW5jdGlvbiB0byB0aGUgc3luY2hyb25pemF0aW9uIHJlcG9ydHMgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgYWRkTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9yZXBvcnRMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICBfc3luY1N0YXR1c1JlcG9ydChyZXBvcnQpIHtcbiAgICBpZiAocmVwb3J0LnN0YXR1cyA9PT0gJ3RyYWluaW5nJyB8fCByZXBvcnQuc3RhdHVzID09PSAnc3luYycpIHtcbiAgICAgIHRoaXMuX3JlcG9ydExpc3RlbmVycy5mb3JFYWNoKChjYWxsYmFjaykgPT4gIGNhbGxiYWNrKHJlcG9ydCkpO1xuXG4gICAgICBpZiAoIXRoaXMuX3JlYWR5KSB7XG4gICAgICAgIHRoaXMuX3JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFN5bmMpO1xuXG5leHBvcnQgZGVmYXVsdCBTeW5jO1xuIl19