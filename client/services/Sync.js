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
      // @todo - add options to configure the sync service
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIlN5bmMiLCJkZWZhdWx0cyIsInZpZXdQcmlvcml0eSIsInVzZUF1ZGlvVGltZSIsImNvbmZpZ3VyZSIsImdldFRpbWUiLCJvcHRpb25zIiwiY3VycmVudFRpbWUiLCJEYXRlIiwiX3N5bmMiLCJfcmVhZHkiLCJyZXF1aXJlIiwiZmVhdHVyZXMiLCJfc3luY1N0YXR1c1JlcG9ydCIsImJpbmQiLCJfcmVwb3J0TGlzdGVuZXJzIiwic2hvdyIsInNlbmRGdW5jdGlvbiIsImFyZ3MiLCJzZW5kIiwicmVjZWl2ZUZ1bmN0aW9uIiwicmVjZWl2ZSIsImNhbGxiYWNrIiwic3RhcnQiLCJoaWRlIiwic3luY1RpbWUiLCJnZXRMb2NhbFRpbWUiLCJhdWRpb1RpbWUiLCJnZXRTeW5jVGltZSIsInB1c2giLCJyZXBvcnQiLCJzdGF0dXMiLCJmb3JFYWNoIiwicmVhZHkiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsY0FBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBeUJNQyxJOzs7QUFDSixrQkFBYztBQUFBOztBQUFBLGtJQUNORCxVQURNLEVBQ00sSUFETjs7QUFHWixRQUFNRSxXQUFXO0FBQ2ZDLG9CQUFjLENBREM7QUFFZkMsb0JBQWM7QUFDZDtBQUhlLEtBQWpCOztBQU1BLFVBQUtDLFNBQUwsQ0FBZUgsUUFBZjs7QUFFQSxRQUFNSSxVQUFVLE1BQUtDLE9BQUwsQ0FBYUgsWUFBYixHQUNkO0FBQUEsYUFBTSx5QkFBYUksV0FBbkI7QUFBQSxLQURjLEdBRWQ7QUFBQSxhQUFPLElBQUlDLElBQUosR0FBV0gsT0FBWCxLQUF1QixLQUE5QjtBQUFBLEtBRkY7O0FBSUEsVUFBS0ksS0FBTCxHQUFhLHFCQUFlSixPQUFmLENBQWI7QUFDQSxVQUFLSyxNQUFMLEdBQWMsS0FBZDs7QUFFQSxVQUFLQyxPQUFMLENBQWEsVUFBYixFQUF5QixFQUFFQyxVQUFVLFdBQVosRUFBekI7O0FBRUEsVUFBS0MsaUJBQUwsR0FBeUIsTUFBS0EsaUJBQUwsQ0FBdUJDLElBQXZCLE9BQXpCO0FBQ0EsVUFBS0MsZ0JBQUwsR0FBd0IsRUFBeEI7QUFyQlk7QUFzQmI7O0FBRUQ7Ozs7OzRCQUNRO0FBQUE7O0FBQ047QUFDQSxXQUFLQyxJQUFMOztBQUVBLFVBQU1DLGVBQWUsU0FBZkEsWUFBZTtBQUFBLDBDQUFJQyxJQUFKO0FBQUlBLGNBQUo7QUFBQTs7QUFBQSxlQUFhLE9BQUtDLElBQUwsZ0JBQVUsTUFBVixTQUFxQkQsSUFBckIsRUFBYjtBQUFBLE9BQXJCO0FBQ0EsVUFBTUUsa0JBQWtCLFNBQWxCQSxlQUFrQjtBQUFBLGVBQVksT0FBS0MsT0FBTCxDQUFhLE1BQWIsRUFBcUJDLFFBQXJCLENBQVo7QUFBQSxPQUF4Qjs7QUFFQSxXQUFLYixLQUFMLENBQVdjLEtBQVgsQ0FBaUJOLFlBQWpCLEVBQStCRyxlQUEvQixFQUFnRCxLQUFLUCxpQkFBckQ7QUFDRDs7QUFFRDs7OzsyQkFDTztBQUNMLFdBQUtXLElBQUw7QUFDQTtBQUNEOztBQUVEOzs7Ozs7Ozs7O2lDQU9hQyxRLEVBQVU7QUFDckIsYUFBTyxLQUFLaEIsS0FBTCxDQUFXaUIsWUFBWCxDQUF3QkQsUUFBeEIsQ0FBUDtBQUNEOzs7aUNBRVlBLFEsRUFBVTtBQUNyQixhQUFPLEtBQUtoQixLQUFMLENBQVdpQixZQUFYLENBQXdCRCxRQUF4QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Z0NBT1lFLFMsRUFBVztBQUNyQixhQUFPLEtBQUtsQixLQUFMLENBQVdtQixXQUFYLENBQXVCRCxTQUF2QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Z0NBSVlMLFEsRUFBVTtBQUNwQixXQUFLUCxnQkFBTCxDQUFzQmMsSUFBdEIsQ0FBMkJQLFFBQTNCO0FBQ0Q7OztzQ0FFaUJRLE0sRUFBUTtBQUN4QixVQUFJQSxPQUFPQyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDRCxPQUFPQyxNQUFQLEtBQWtCLE1BQXRELEVBQThEO0FBQzVELGFBQUtoQixnQkFBTCxDQUFzQmlCLE9BQXRCLENBQThCLFVBQUNWLFFBQUQ7QUFBQSxpQkFBZUEsU0FBU1EsTUFBVCxDQUFmO0FBQUEsU0FBOUI7O0FBRUEsWUFBSSxDQUFDLEtBQUtwQixNQUFWLEVBQWtCO0FBQ2hCLGVBQUtBLE1BQUwsR0FBYyxJQUFkO0FBQ0EsZUFBS3VCLEtBQUw7QUFDRDtBQUNGO0FBQ0Y7Ozs7O0FBSUgseUJBQWVDLFFBQWYsQ0FBd0JuQyxVQUF4QixFQUFvQ0MsSUFBcEM7O2tCQUVlQSxJIiwiZmlsZSI6IlN5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU3luY01vZHVsZSBmcm9tICdzeW5jL2NsaWVudCc7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzeW5jJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdzeW5jJ2Agc2VydmljZS5cbiAqXG4gKiBUaGUgYHN5bmNgIHNlcnZpY2Ugc3luY2hyb25pemVzIHRoZSBsb2NhbCBhdWRpbyBjbG9jayBvZiB0aGUgY2xpZW50IHdpdGggdGhlXG4gKiBjbG9jayBvZiB0aGUgc2VydmVyIChtYXN0ZXIgY2xvY2spLiBJdCBpbnRlcm5hbGx5IHJlbGllcyBvbiB0aGUgYFdlYkF1ZGlvYFxuICogY2xvY2sgYW5kIHRoZW4gcmVxdWlyZXMgdGhlIGBwbGF0Zm9ybWAgc2VydmljZSB0byBhY2Nlc3MgdGhpcyBmZWF0dXJlLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0c1xuICogW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuU3luY30qX19cbiAqXG4gKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlXG4gKiBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfXG4gKlxuICogX05vdGU6XyB0aGUgc2VydmljZSBpcyBiYXNlZCBvblxuICogW2BnaXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jYF0oaHR0cHM6Ly9naXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jKS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5zeW5jID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG4gKiAvLyB3aGVuIHRoZSBleHBlcmllbmNlIGhhcyBzdGFydGVkLCB0cmFuc2xhdGUgdGhlIHN5bmMgdGltZSBpbiBsb2NhbCB0aW1lXG4gKiBjb25zdCBzeW5jVGltZSA9IHRoaXMuc3luYy5nZXRTeW5jVGltZSgpO1xuICogY29uc3QgbG9jYWxUaW1lID0gdGhpcy5zeW5jLmdldEF1ZGlvVGltZShzeW5jVGltZSk7XG4gKi9cbmNsYXNzIFN5bmMgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHZpZXdQcmlvcml0eTogMyxcbiAgICAgIHVzZUF1ZGlvVGltZTogdHJ1ZSxcbiAgICAgIC8vIEB0b2RvIC0gYWRkIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzeW5jIHNlcnZpY2VcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgY29uc3QgZ2V0VGltZSA9IHRoaXMub3B0aW9ucy51c2VBdWRpb1RpbWUgP1xuICAgICAgKCkgPT4gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lIDpcbiAgICAgICgpID0+IChuZXcgRGF0ZSgpLmdldFRpbWUoKSAqIDAuMDAxKTtcblxuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY01vZHVsZShnZXRUaW1lKTtcbiAgICB0aGlzLl9yZWFkeSA9IGZhbHNlO1xuXG4gICAgdGhpcy5yZXF1aXJlKCdwbGF0Zm9ybScsIHsgZmVhdHVyZXM6ICd3ZWItYXVkaW8nIH0pO1xuXG4gICAgdGhpcy5fc3luY1N0YXR1c1JlcG9ydCA9IHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9yZXBvcnRMaXN0ZW5lcnMgPSBbXTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgY29uc3Qgc2VuZEZ1bmN0aW9uID0gKC4uLmFyZ3MpID0+IHRoaXMuc2VuZCgncGluZycsIC4uLmFyZ3MpO1xuICAgIGNvbnN0IHJlY2VpdmVGdW5jdGlvbiA9IGNhbGxiYWNrID0+IHRoaXMucmVjZWl2ZSgncG9uZycsIGNhbGxiYWNrKTtcblxuICAgIHRoaXMuX3N5bmMuc3RhcnQoc2VuZEZ1bmN0aW9uLCByZWNlaXZlRnVuY3Rpb24sIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdGltZSBpbiB0aGUgbG9jYWwgY2xvY2suIElmIG5vIGFyZ3VtZW50cyBwcm92aWRlZCxcbiAgICogcmV0dXJucyB0aGUgY3VycmVudCBsb2NhbCB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3luY1RpbWUgLSBUaW1lIGZyb20gdGhlIHN5bmMgY2xvY2sgKGluIF9zZWNvbmRzXykuXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBMb2NhbCB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuXG4gICAqICBgc3luY1RpbWVgIChpbiBfc2Vjb25kc18pLlxuICAgKi9cbiAgZ2V0QXVkaW9UaW1lKHN5bmNUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKTtcbiAgfVxuXG4gIGdldExvY2FsVGltZShzeW5jVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldExvY2FsVGltZShzeW5jVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0aW1lIGluIHRoZSBzeW5jIGNsb2NrLiBJZiBubyBhcmd1bWVudHMgcHJvdmlkZWQsXG4gICAqIHJldHVybnMgdGhlIGN1cnJlbnQgc3luYyB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gYXVkaW9UaW1lIC0gVGltZSBmcm9tIHRoZSBsb2NhbCBjbG9jayAoaW4gX3NlY29uZHNfKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIFN5bmMgdGltZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlblxuICAgKiAgYGF1ZGlvVGltZWAgKGluIF9zZWNvbmRzXykuXG4gICAqL1xuICBnZXRTeW5jVGltZShhdWRpb1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZShhdWRpb1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIHRoZSBzeW5jaHJvbml6YXRpb24gcmVwb3J0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBhZGRMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuX3JlcG9ydExpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIF9zeW5jU3RhdHVzUmVwb3J0KHJlcG9ydCkge1xuICAgIGlmIChyZXBvcnQuc3RhdHVzID09PSAndHJhaW5pbmcnIHx8IHJlcG9ydC5zdGF0dXMgPT09ICdzeW5jJykge1xuICAgICAgdGhpcy5fcmVwb3J0TGlzdGVuZXJzLmZvckVhY2goKGNhbGxiYWNrKSA9PiAgY2FsbGJhY2socmVwb3J0KSk7XG5cbiAgICAgIGlmICghdGhpcy5fcmVhZHkpIHtcbiAgICAgICAgdGhpcy5fcmVhZHkgPSB0cnVlO1xuICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU3luYyk7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bmM7XG4iXX0=