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
 * The module always has a view (that displays "Clock syncing, stand by…", until the very first synchronization process is done).
 *
 * The module finishes its initialization as soon as the client clock is in sync with the master clock.
 * Then, the synchronization process keeps running in the background to resynchronize the clocks from times to times.
 *
 * **Note:** the service is based on [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * (See also {@link src/server/ServerSync.js~ServerSync} on the server side.)
 *
 * @example
 * const sync = serviceManager.require('service:sync');
 *
 * const nowLocal = sync.getLocalTime(); // current time in local clock time
 * const nowSync = sync.getSyncTime(); // current time in sync clock time
 * @emits 'sync:stats' each time the module (re)synchronizes the local clock on the sync clock.
 * The `'status'` event goes along with the `report` object that has the following properties:
 * - `timeOffset`, current estimation of the time offset between the client clock and the sync clock;
 * - `travelTime`, current estimation of the travel time for a message to go from the client to the server and back;
 * - `travelTimeMax`, current estimation of the maximum travel time for a message to go from the client to the server and back.
 */

var ClientSync = function (_Service) {
  (0, _inherits3.default)(ClientSync, _Service);

  function ClientSync() {
    (0, _classCallCheck3.default)(this, ClientSync);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ClientSync).call(this, SERVICE_ID, true));

    var defaults = {
      viewCtor: _SegmentedView2.default,
      viewPriority: 3
    };

    // @todo - add options to configure the sync module
    _this.configure(defaults);
    // needs audio time
    _this.require('welcome');

    _this._syncStatusReport = _this._syncStatusReport.bind(_this);
    _this._reportListeners = [];
    return _this;
  }

  (0, _createClass3.default)(ClientSync, [{
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientSync.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.show();
      this._sync.start(this.send, this.receive, this._syncStatusReport);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientSync.prototype), 'stop', this).call(this);
    }

    /**
     * Return the time in the local clock.
     * If no arguments are provided, returns the current local time (*i.e.* `audioContext.currentTime`).
     * @param {Number} syncTime Time in the sync clock (in seconds).
     * @return {Number} Time in the local clock corresponding to `syncTime` (in seconds).
     */

  }, {
    key: 'getLocalTime',
    value: function getLocalTime(syncTime) {
      return this._sync.getLocalTime(syncTime);
    }

    /**
     * Return the time in the sync clock.
     * If no arguments are provided, returns the current sync time.
     * @param {Number} localTime Time in the local clock (in seconds).
     * @return {Number} Time in the sync clock corresponding to `localTime` (in seconds)
     */

  }, {
    key: 'getSyncTime',
    value: function getSyncTime(localTime) {
      return this._sync.getSyncTime(localTime);
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
  return ClientSync;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, ClientSync);

exports.default = ClientSync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudFN5bmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sYUFBYSxjQUFiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTRCQTs7O0FBQ0osV0FESSxVQUNKLEdBQWM7d0NBRFYsWUFDVTs7NkZBRFYsdUJBRUksWUFBWSxPQUROOztBQUdaLFFBQU0sV0FBVztBQUNmLHVDQURlO0FBRWYsb0JBQWMsQ0FBZDtLQUZJLENBSE07OztBQVNaLFVBQUssU0FBTCxDQUFlLFFBQWY7O0FBVFksU0FXWixDQUFLLE9BQUwsQ0FBYSxTQUFiLEVBWFk7O0FBYVosVUFBSyxpQkFBTCxHQUF5QixNQUFLLGlCQUFMLENBQXVCLElBQXZCLE9BQXpCLENBYlk7QUFjWixVQUFLLGdCQUFMLEdBQXdCLEVBQXhCLENBZFk7O0dBQWQ7OzZCQURJOzsyQkFrQkc7QUFDTCxXQUFLLEtBQUwsR0FBYSxxQkFBZTtlQUFNLHlCQUFhLFdBQWI7T0FBTixDQUE1QixDQURLO0FBRUwsV0FBSyxNQUFMLEdBQWMsS0FBZCxDQUZLOztBQUlMLFdBQUssUUFBTCxHQUFnQixLQUFLLE9BQUwsQ0FBYSxRQUFiLENBSlg7QUFLTCxXQUFLLElBQUwsR0FBWSxLQUFLLFVBQUwsRUFBWixDQUxLOzs7Ozs7OzRCQVNDO0FBQ04sdURBNUJFLGdEQTRCRixDQURNOztBQUdOLFVBQUksQ0FBQyxLQUFLLFVBQUwsRUFDSCxLQUFLLElBQUwsR0FERjs7QUFHQSxXQUFLLElBQUwsR0FOTTtBQU9OLFdBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsS0FBSyxJQUFMLEVBQVcsS0FBSyxPQUFMLEVBQWMsS0FBSyxpQkFBTCxDQUExQyxDQVBNOzs7OzJCQVVEO0FBQ0wsV0FBSyxJQUFMLEdBREs7QUFFTCx1REF2Q0UsK0NBdUNGLENBRks7Ozs7Ozs7Ozs7OztpQ0FXTSxVQUFVO0FBQ3JCLGFBQU8sS0FBSyxLQUFMLENBQVcsWUFBWCxDQUF3QixRQUF4QixDQUFQLENBRHFCOzs7Ozs7Ozs7Ozs7Z0NBVVgsV0FBVztBQUNyQixhQUFPLEtBQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsU0FBdkIsQ0FBUCxDQURxQjs7Ozs7Ozs7OztnQ0FRVixVQUFVO0FBQ3JCLFdBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsUUFBM0IsRUFEcUI7Ozs7c0NBSUwsU0FBUyxRQUFRO0FBQ2pDLFVBQUksWUFBWSxhQUFaLEVBQTJCO0FBQzdCLFlBQUksT0FBTyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDLE9BQU8sTUFBUCxLQUFrQixNQUFsQixFQUEwQjtBQUM1RCxlQUFLLGdCQUFMLENBQXNCLE9BQXRCLENBQThCLFVBQUMsUUFBRDttQkFBZSxTQUFTLE1BQVQsRUFBaUIsTUFBakI7V0FBZixDQUE5QixDQUQ0RDs7QUFHNUQsY0FBSSxDQUFDLEtBQUssTUFBTCxFQUFhO0FBQ2hCLGlCQUFLLE1BQUwsR0FBYyxJQUFkLENBRGdCO0FBRWhCLGlCQUFLLEtBQUwsR0FGZ0I7V0FBbEI7U0FIRjtPQURGOzs7U0F2RUU7OztBQW9GTix5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLFVBQXBDOztrQkFFZSIsImZpbGUiOiJDbGllbnRTeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vdmlld3MvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFN5bmNDbGllbnQgZnJvbSAnc3luYy9jbGllbnQnO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c3luYyc7XG5cbi8qKlxuICogW2NsaWVudF0gU3luY2hyb25pemUgdGhlIGxvY2FsIGNsb2NrIG9uIGEgbWFzdGVyIGNsb2NrIHNoYXJlZCBieSB0aGUgc2VydmVyIGFuZCB0aGUgY2xpZW50cy5cbiAqXG4gKiBCb3RoIHRoZSBjbGllbnRzIGFuZCB0aGUgc2VydmVyIGNhbiB1c2UgdGhpcyBtYXN0ZXIgY2xvY2sgYXMgYSBjb21tb24gdGltZSByZWZlcmVuY2UuXG4gKiBGb3IgaW5zdGFuY2UsIHRoaXMgYWxsb3dzIGFsbCB0aGUgY2xpZW50cyB0byBkbyBzb21ldGhpbmcgZXhhY3RseSBhdCB0aGUgc2FtZSB0aW1lLCBzdWNoIGFzIGJsaW5raW5nIHRoZSBzY3JlZW4gb3IgcGxheWluZyBhIHNvdW5kIGluIGEgc3luY2hyb25pemVkIG1hbm5lci5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3ICh0aGF0IGRpc3BsYXlzIFwiQ2xvY2sgc3luY2luZywgc3RhbmQgYnnigKZcIiwgdW50aWwgdGhlIHZlcnkgZmlyc3Qgc3luY2hyb25pemF0aW9uIHByb2Nlc3MgaXMgZG9uZSkuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gYXMgc29vbiBhcyB0aGUgY2xpZW50IGNsb2NrIGlzIGluIHN5bmMgd2l0aCB0aGUgbWFzdGVyIGNsb2NrLlxuICogVGhlbiwgdGhlIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIGtlZXBzIHJ1bm5pbmcgaW4gdGhlIGJhY2tncm91bmQgdG8gcmVzeW5jaHJvbml6ZSB0aGUgY2xvY2tzIGZyb20gdGltZXMgdG8gdGltZXMuXG4gKlxuICogKipOb3RlOioqIHRoZSBzZXJ2aWNlIGlzIGJhc2VkIG9uIFtgZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luY2BdKGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luYykuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlclN5bmMuanN+U2VydmVyU3luY30gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3Qgc3luYyA9IHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoJ3NlcnZpY2U6c3luYycpO1xuICpcbiAqIGNvbnN0IG5vd0xvY2FsID0gc3luYy5nZXRMb2NhbFRpbWUoKTsgLy8gY3VycmVudCB0aW1lIGluIGxvY2FsIGNsb2NrIHRpbWVcbiAqIGNvbnN0IG5vd1N5bmMgPSBzeW5jLmdldFN5bmNUaW1lKCk7IC8vIGN1cnJlbnQgdGltZSBpbiBzeW5jIGNsb2NrIHRpbWVcbiAqIEBlbWl0cyAnc3luYzpzdGF0cycgZWFjaCB0aW1lIHRoZSBtb2R1bGUgKHJlKXN5bmNocm9uaXplcyB0aGUgbG9jYWwgY2xvY2sgb24gdGhlIHN5bmMgY2xvY2suXG4gKiBUaGUgYCdzdGF0dXMnYCBldmVudCBnb2VzIGFsb25nIHdpdGggdGhlIGByZXBvcnRgIG9iamVjdCB0aGF0IGhhcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiAtIGB0aW1lT2Zmc2V0YCwgY3VycmVudCBlc3RpbWF0aW9uIG9mIHRoZSB0aW1lIG9mZnNldCBiZXR3ZWVuIHRoZSBjbGllbnQgY2xvY2sgYW5kIHRoZSBzeW5jIGNsb2NrO1xuICogLSBgdHJhdmVsVGltZWAsIGN1cnJlbnQgZXN0aW1hdGlvbiBvZiB0aGUgdHJhdmVsIHRpbWUgZm9yIGEgbWVzc2FnZSB0byBnbyBmcm9tIHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlciBhbmQgYmFjaztcbiAqIC0gYHRyYXZlbFRpbWVNYXhgLCBjdXJyZW50IGVzdGltYXRpb24gb2YgdGhlIG1heGltdW0gdHJhdmVsIHRpbWUgZm9yIGEgbWVzc2FnZSB0byBnbyBmcm9tIHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlciBhbmQgYmFjay5cbiAqL1xuY2xhc3MgQ2xpZW50U3luYyBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgdmlld0N0b3I6IFNlZ21lbnRlZFZpZXcsXG4gICAgICB2aWV3UHJpb3JpdHk6IDMsXG4gICAgICAvLyBAdG9kbyAtIGFkZCBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc3luYyBtb2R1bGVcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gICAgLy8gbmVlZHMgYXVkaW8gdGltZVxuICAgIHRoaXMucmVxdWlyZSgnd2VsY29tZScpO1xuXG4gICAgdGhpcy5fc3luY1N0YXR1c1JlcG9ydCA9IHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9yZXBvcnRMaXN0ZW5lcnMgPSBbXTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5fc3luYyA9IG5ldyBTeW5jQ2xpZW50KCgpID0+IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgdGhpcy5fcmVhZHkgPSBmYWxzZTtcblxuICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNob3coKTtcbiAgICB0aGlzLl9zeW5jLnN0YXJ0KHRoaXMuc2VuZCwgdGhpcy5yZWNlaXZlLCB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0KTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdGltZSBpbiB0aGUgbG9jYWwgY2xvY2suXG4gICAqIElmIG5vIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQsIHJldHVybnMgdGhlIGN1cnJlbnQgbG9jYWwgdGltZSAoKmkuZS4qIGBhdWRpb0NvbnRleHQuY3VycmVudFRpbWVgKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN5bmNUaW1lIFRpbWUgaW4gdGhlIHN5bmMgY2xvY2sgKGluIHNlY29uZHMpLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRpbWUgaW4gdGhlIGxvY2FsIGNsb2NrIGNvcnJlc3BvbmRpbmcgdG8gYHN5bmNUaW1lYCAoaW4gc2Vjb25kcykuXG4gICAqL1xuICBnZXRMb2NhbFRpbWUoc3luY1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRMb2NhbFRpbWUoc3luY1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdGltZSBpbiB0aGUgc3luYyBjbG9jay5cbiAgICogSWYgbm8gYXJndW1lbnRzIGFyZSBwcm92aWRlZCwgcmV0dXJucyB0aGUgY3VycmVudCBzeW5jIHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsb2NhbFRpbWUgVGltZSBpbiB0aGUgbG9jYWwgY2xvY2sgKGluIHNlY29uZHMpLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRpbWUgaW4gdGhlIHN5bmMgY2xvY2sgY29ycmVzcG9uZGluZyB0byBgbG9jYWxUaW1lYCAoaW4gc2Vjb25kcylcbiAgICovXG4gIGdldFN5bmNUaW1lKGxvY2FsVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldFN5bmNUaW1lKGxvY2FsVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGVhY2ggc3luYyByZXBvcnRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIGFkZExpc3RlbmVyIChjYWxsYmFjaykge1xuICAgIHRoaXMuX3JlcG9ydExpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIF9zeW5jU3RhdHVzUmVwb3J0KG1lc3NhZ2UsIHJlcG9ydCkge1xuICAgIGlmIChtZXNzYWdlID09PSAnc3luYzpzdGF0dXMnKSB7XG4gICAgICBpZiAocmVwb3J0LnN0YXR1cyA9PT0gJ3RyYWluaW5nJyB8fCByZXBvcnQuc3RhdHVzID09PSAnc3luYycpIHtcbiAgICAgICAgdGhpcy5fcmVwb3J0TGlzdGVuZXJzLmZvckVhY2goKGNhbGxiYWNrKSA9PiAgY2FsbGJhY2soc3RhdHVzLCByZXBvcnQpKTtcblxuICAgICAgICBpZiAoIXRoaXMuX3JlYWR5KSB7XG4gICAgICAgICAgdGhpcy5fcmVhZHkgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBDbGllbnRTeW5jKTtcblxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50U3luYztcblxuIl19