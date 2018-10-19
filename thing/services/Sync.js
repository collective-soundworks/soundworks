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

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../../client/core/serviceManager');

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
/**
 * @todo - review to use `libpd.currentTime`
 */

var Sync = function (_Service) {
  (0, _inherits3.default)(Sync, _Service);

  function Sync() {
    (0, _classCallCheck3.default)(this, Sync);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Sync.__proto__ || (0, _getPrototypeOf2.default)(Sync)).call(this, SERVICE_ID, true));

    var defaults = {
      viewPriority: 3,
      getTime: function () {
        if (process && process.hrtime) {
          var startTime = process.hrtime();

          return function () {
            var time = process.hrtime(startTime);
            return time[0] + time[1] * 1e-9;
          };
        } else {
          return function () {
            return performance.now();
          };
        }
      }()
      // @todo - add options to configure the sync service
    };

    _this.configure(defaults);

    _this._ready = false;
    _this._reportListeners = [];

    _this.getAudioTime = _this.getAudioTime.bind(_this);
    _this.getLocalTime = _this.getLocalTime.bind(_this);
    _this.getSyncTime = _this.getSyncTime.bind(_this);
    _this._syncStatusReport = _this._syncStatusReport.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Sync, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)(Sync.prototype.__proto__ || (0, _getPrototypeOf2.default)(Sync.prototype), 'start', this).call(this);

      var sendFunction = function sendFunction() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _this2.send.apply(_this2, ['ping'].concat(args));
      };
      var receiveFunction = function receiveFunction(callback) {
        return _this2.receive('pong', callback);
      };

      this._sync = new _sync.SyncClient(this.options.getTime);
      this._sync.start(sendFunction, receiveFunction, this._syncStatusReport);
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIlN5bmMiLCJkZWZhdWx0cyIsInZpZXdQcmlvcml0eSIsImdldFRpbWUiLCJwcm9jZXNzIiwiaHJ0aW1lIiwic3RhcnRUaW1lIiwidGltZSIsInBlcmZvcm1hbmNlIiwibm93IiwiY29uZmlndXJlIiwiX3JlYWR5IiwiX3JlcG9ydExpc3RlbmVycyIsImdldEF1ZGlvVGltZSIsImJpbmQiLCJnZXRMb2NhbFRpbWUiLCJnZXRTeW5jVGltZSIsIl9zeW5jU3RhdHVzUmVwb3J0Iiwic2VuZEZ1bmN0aW9uIiwiYXJncyIsInNlbmQiLCJyZWNlaXZlRnVuY3Rpb24iLCJyZWNlaXZlIiwiY2FsbGJhY2siLCJfc3luYyIsIlN5bmNDbGllbnQiLCJvcHRpb25zIiwic3RhcnQiLCJzeW5jVGltZSIsImF1ZGlvVGltZSIsInB1c2giLCJyZXBvcnQiLCJzdGF0dXMiLCJmb3JFYWNoIiwicmVhZHkiLCJTZXJ2aWNlIiwic2VydmljZU1hbmFnZXIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsYUFBYSxjQUFuQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVRBOzs7O0lBa0NNQyxJOzs7QUFDSixrQkFBYztBQUFBOztBQUFBLGtJQUNORCxVQURNLEVBQ00sSUFETjs7QUFHWixRQUFNRSxXQUFXO0FBQ2ZDLG9CQUFjLENBREM7QUFFZkMsZUFBVSxZQUFXO0FBQ25CLFlBQUlDLFdBQVdBLFFBQVFDLE1BQXZCLEVBQStCO0FBQzdCLGNBQU1DLFlBQVlGLFFBQVFDLE1BQVIsRUFBbEI7O0FBRUEsaUJBQU8sWUFBTTtBQUNYLGdCQUFNRSxPQUFPSCxRQUFRQyxNQUFSLENBQWVDLFNBQWYsQ0FBYjtBQUNBLG1CQUFPQyxLQUFLLENBQUwsSUFBVUEsS0FBSyxDQUFMLElBQVUsSUFBM0I7QUFDRCxXQUhEO0FBSUQsU0FQRCxNQU9PO0FBQ0wsaUJBQU87QUFBQSxtQkFBTUMsWUFBWUMsR0FBWixFQUFOO0FBQUEsV0FBUDtBQUNEO0FBQ0YsT0FYUTtBQVlUO0FBZGUsS0FBakI7O0FBaUJBLFVBQUtDLFNBQUwsQ0FBZVQsUUFBZjs7QUFFQSxVQUFLVSxNQUFMLEdBQWMsS0FBZDtBQUNBLFVBQUtDLGdCQUFMLEdBQXdCLEVBQXhCOztBQUVBLFVBQUtDLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQkMsSUFBbEIsT0FBcEI7QUFDQSxVQUFLQyxZQUFMLEdBQW9CLE1BQUtBLFlBQUwsQ0FBa0JELElBQWxCLE9BQXBCO0FBQ0EsVUFBS0UsV0FBTCxHQUFtQixNQUFLQSxXQUFMLENBQWlCRixJQUFqQixPQUFuQjtBQUNBLFVBQUtHLGlCQUFMLEdBQXlCLE1BQUtBLGlCQUFMLENBQXVCSCxJQUF2QixPQUF6QjtBQTVCWTtBQTZCYjs7QUFFRDs7Ozs7NEJBQ1E7QUFBQTs7QUFDTjs7QUFFQSxVQUFNSSxlQUFlLFNBQWZBLFlBQWU7QUFBQSwwQ0FBSUMsSUFBSjtBQUFJQSxjQUFKO0FBQUE7O0FBQUEsZUFBYSxPQUFLQyxJQUFMLGdCQUFVLE1BQVYsU0FBcUJELElBQXJCLEVBQWI7QUFBQSxPQUFyQjtBQUNBLFVBQU1FLGtCQUFrQixTQUFsQkEsZUFBa0I7QUFBQSxlQUFZLE9BQUtDLE9BQUwsQ0FBYSxNQUFiLEVBQXFCQyxRQUFyQixDQUFaO0FBQUEsT0FBeEI7O0FBRUEsV0FBS0MsS0FBTCxHQUFhLElBQUlDLGdCQUFKLENBQWUsS0FBS0MsT0FBTCxDQUFhdkIsT0FBNUIsQ0FBYjtBQUNBLFdBQUtxQixLQUFMLENBQVdHLEtBQVgsQ0FBaUJULFlBQWpCLEVBQStCRyxlQUEvQixFQUFnRCxLQUFLSixpQkFBckQ7QUFDRDs7QUFFRDs7OzsyQkFDTztBQUNMO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7aUNBT2FXLFEsRUFBVTtBQUNyQixhQUFPLEtBQUtKLEtBQUwsQ0FBV1QsWUFBWCxDQUF3QmEsUUFBeEIsQ0FBUDtBQUNEOzs7aUNBRVlBLFEsRUFBVTtBQUNyQixhQUFPLEtBQUtKLEtBQUwsQ0FBV1QsWUFBWCxDQUF3QmEsUUFBeEIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7O2dDQU9ZQyxTLEVBQVc7QUFDckIsYUFBTyxLQUFLTCxLQUFMLENBQVdSLFdBQVgsQ0FBdUJhLFNBQXZCLENBQVA7QUFDRDs7QUFFRDs7Ozs7OztnQ0FJWU4sUSxFQUFVO0FBQ3BCLFdBQUtYLGdCQUFMLENBQXNCa0IsSUFBdEIsQ0FBMkJQLFFBQTNCO0FBQ0Q7OztzQ0FFaUJRLE0sRUFBUTtBQUN4QixVQUFJQSxPQUFPQyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDRCxPQUFPQyxNQUFQLEtBQWtCLE1BQXRELEVBQThEO0FBQzVELGFBQUtwQixnQkFBTCxDQUFzQnFCLE9BQXRCLENBQThCLFVBQUNWLFFBQUQ7QUFBQSxpQkFBZUEsU0FBU1EsTUFBVCxDQUFmO0FBQUEsU0FBOUI7O0FBRUEsWUFBSSxDQUFDLEtBQUtwQixNQUFWLEVBQWtCO0FBQ2hCLGVBQUtBLE1BQUwsR0FBYyxJQUFkO0FBQ0EsZUFBS3VCLEtBQUw7QUFDRDtBQUNGO0FBQ0Y7OztFQTNGZ0JDLGlCOztBQStGbkJDLHlCQUFlQyxRQUFmLENBQXdCdEMsVUFBeEIsRUFBb0NDLElBQXBDOztrQkFFZUEsSSIsImZpbGUiOiJTeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAdG9kbyAtIHJldmlldyB0byB1c2UgYGxpYnBkLmN1cnJlbnRUaW1lYFxuICovXG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uLy4uL2NsaWVudC9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB7IFN5bmNDbGllbnQgfSBmcm9tICdAaXJjYW0vc3luYyc7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzeW5jJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdzeW5jJ2Agc2VydmljZS5cbiAqXG4gKiBUaGUgYHN5bmNgIHNlcnZpY2Ugc3luY2hyb25pemVzIHRoZSBsb2NhbCBhdWRpbyBjbG9jayBvZiB0aGUgY2xpZW50IHdpdGggdGhlXG4gKiBjbG9jayBvZiB0aGUgc2VydmVyIChtYXN0ZXIgY2xvY2spLiBJdCBpbnRlcm5hbGx5IHJlbGllcyBvbiB0aGUgYFdlYkF1ZGlvYFxuICogY2xvY2sgYW5kIHRoZW4gcmVxdWlyZXMgdGhlIGBwbGF0Zm9ybWAgc2VydmljZSB0byBhY2Nlc3MgdGhpcyBmZWF0dXJlLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0c1xuICogW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuU3luY30qX19cbiAqXG4gKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlXG4gKiBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfXG4gKlxuICogX05vdGU6XyB0aGUgc2VydmljZSBpcyBiYXNlZCBvblxuICogW2BnaXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jYF0oaHR0cHM6Ly9naXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jKS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5zeW5jID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG4gKiAvLyB3aGVuIHRoZSBleHBlcmllbmNlIGhhcyBzdGFydGVkLCB0cmFuc2xhdGUgdGhlIHN5bmMgdGltZSBpbiBsb2NhbCB0aW1lXG4gKiBjb25zdCBzeW5jVGltZSA9IHRoaXMuc3luYy5nZXRTeW5jVGltZSgpO1xuICogY29uc3QgbG9jYWxUaW1lID0gdGhpcy5zeW5jLmdldEF1ZGlvVGltZShzeW5jVGltZSk7XG4gKi9cbmNsYXNzIFN5bmMgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHZpZXdQcmlvcml0eTogMyxcbiAgICAgIGdldFRpbWU6IChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MgJiYgcHJvY2Vzcy5ocnRpbWUpIHtcbiAgICAgICAgICBjb25zdCBzdGFydFRpbWUgPSBwcm9jZXNzLmhydGltZSgpO1xuXG4gICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBwcm9jZXNzLmhydGltZShzdGFydFRpbWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRpbWVbMF0gKyB0aW1lWzFdICogMWUtOTtcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAoKSA9PiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgfVxuICAgICAgfSkoKSxcbiAgICAgIC8vIEB0b2RvIC0gYWRkIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzeW5jIHNlcnZpY2VcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fcmVhZHkgPSBmYWxzZTtcbiAgICB0aGlzLl9yZXBvcnRMaXN0ZW5lcnMgPSBbXTtcblxuICAgIHRoaXMuZ2V0QXVkaW9UaW1lID0gdGhpcy5nZXRBdWRpb1RpbWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldExvY2FsVGltZSA9IHRoaXMuZ2V0TG9jYWxUaW1lLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRTeW5jVGltZSA9IHRoaXMuZ2V0U3luY1RpbWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0ID0gdGhpcy5fc3luY1N0YXR1c1JlcG9ydC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBjb25zdCBzZW5kRnVuY3Rpb24gPSAoLi4uYXJncykgPT4gdGhpcy5zZW5kKCdwaW5nJywgLi4uYXJncyk7XG4gICAgY29uc3QgcmVjZWl2ZUZ1bmN0aW9uID0gY2FsbGJhY2sgPT4gdGhpcy5yZWNlaXZlKCdwb25nJywgY2FsbGJhY2spO1xuXG4gICAgdGhpcy5fc3luYyA9IG5ldyBTeW5jQ2xpZW50KHRoaXMub3B0aW9ucy5nZXRUaW1lKTtcbiAgICB0aGlzLl9zeW5jLnN0YXJ0KHNlbmRGdW5jdGlvbiwgcmVjZWl2ZUZ1bmN0aW9uLCB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrLiBJZiBubyBhcmd1bWVudHMgcHJvdmlkZWQsXG4gICAqIHJldHVybnMgdGhlIGN1cnJlbnQgbG9jYWwgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN5bmNUaW1lIC0gVGltZSBmcm9tIHRoZSBzeW5jIGNsb2NrIChpbiBfc2Vjb25kc18pLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gTG9jYWwgdGltZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlblxuICAgKiAgYHN5bmNUaW1lYCAoaW4gX3NlY29uZHNfKS5cbiAgICovXG4gIGdldEF1ZGlvVGltZShzeW5jVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldExvY2FsVGltZShzeW5jVGltZSk7XG4gIH1cblxuICBnZXRMb2NhbFRpbWUoc3luY1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRMb2NhbFRpbWUoc3luY1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdGltZSBpbiB0aGUgc3luYyBjbG9jay4gSWYgbm8gYXJndW1lbnRzIHByb3ZpZGVkLFxuICAgKiByZXR1cm5zIHRoZSBjdXJyZW50IHN5bmMgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGF1ZGlvVGltZSAtIFRpbWUgZnJvbSB0aGUgbG9jYWwgY2xvY2sgKGluIF9zZWNvbmRzXykuXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBTeW5jIHRpbWUgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW5cbiAgICogIGBhdWRpb1RpbWVgIChpbiBfc2Vjb25kc18pLlxuICAgKi9cbiAgZ2V0U3luY1RpbWUoYXVkaW9UaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUoYXVkaW9UaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBjYWxsYmFjayBmdW5jdGlvbiB0byB0aGUgc3luY2hyb25pemF0aW9uIHJlcG9ydHMgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgYWRkTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9yZXBvcnRMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICBfc3luY1N0YXR1c1JlcG9ydChyZXBvcnQpIHtcbiAgICBpZiAocmVwb3J0LnN0YXR1cyA9PT0gJ3RyYWluaW5nJyB8fCByZXBvcnQuc3RhdHVzID09PSAnc3luYycpIHtcbiAgICAgIHRoaXMuX3JlcG9ydExpc3RlbmVycy5mb3JFYWNoKChjYWxsYmFjaykgPT4gIGNhbGxiYWNrKHJlcG9ydCkpO1xuXG4gICAgICBpZiAoIXRoaXMuX3JlYWR5KSB7XG4gICAgICAgIHRoaXMuX3JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFN5bmMpO1xuXG5leHBvcnQgZGVmYXVsdCBTeW5jO1xuIl19