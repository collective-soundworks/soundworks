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

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _wavesAudio = require('waves-audio');

var audio = _interopRequireWildcard(_wavesAudio);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audioScheduler = audio.getScheduler();

var SyncTimeSchedulingQueue = function (_audio$SchedulingQueu) {
  (0, _inherits3.default)(SyncTimeSchedulingQueue, _audio$SchedulingQueu);

  function SyncTimeSchedulingQueue(sync, scheduler) {
    (0, _classCallCheck3.default)(this, SyncTimeSchedulingQueue);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SyncTimeSchedulingQueue.__proto__ || (0, _getPrototypeOf2.default)(SyncTimeSchedulingQueue)).call(this));

    _this.sync = sync;
    _this.scheduler = scheduler;
    _this.scheduler.add(_this, Infinity);
    _this.nextSyncTime = Infinity;

    // call this.resync in sync callback
    _this.resync = _this.resync.bind(_this);
    _this.sync.addListener(_this.resync);
    return _this;
  }

  (0, _createClass3.default)(SyncTimeSchedulingQueue, [{
    key: 'advanceTime',
    value: function advanceTime(audioTime) {
      var nextSyncTime = (0, _get3.default)(SyncTimeSchedulingQueue.prototype.__proto__ || (0, _getPrototypeOf2.default)(SyncTimeSchedulingQueue.prototype), 'advanceTime', this).call(this, this.nextSyncTime);
      var nextAudioTime = this.sync.getAudioTime(nextSyncTime);

      this.nextSyncTime = nextSyncTime;

      return nextAudioTime;
    }
  }, {
    key: 'resetTime',
    value: function resetTime(syncTime) {
      if (syncTime === undefined) syncTime = this.sync.getSyncTime();

      this.nextSyncTime = syncTime;

      var audioTime = this.sync.getAudioTime(syncTime);
      this.master.resetEngineTime(this, audioTime);
    }
  }, {
    key: 'resync',
    value: function resync() {
      if (this.nextSyncTime !== Infinity) {
        var nextAudioTime = this.sync.getAudioTime(this.nextSyncTime);
        this.master.resetEngineTime(this, nextAudioTime);
      } else {
        this.master.resetEngineTime(this, Infinity);
      }
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this.sync.getSyncTime(this.scheduler.currentTime);
    }
  }]);
  return SyncTimeSchedulingQueue;
}(audio.SchedulingQueue);

var SERVICE_ID = 'service:sync-scheduler';

/**
 * Interface for the client `'sync-scheduler'` service.
 *
 * The `sync-scheduler` provides a scheduler synchronised among all client using the
 * [`sync`]{@link module:soundworks/client.Sync} service.
 *
 * While this service has no direct server counterpart, its dependency on the
 * [`sync`]{@link module:soundworks/client.Sync} service which requires the
 * existence of a server.
 *
 * @param {Object} options
 * @param {Number} [options.period] - Period of the scheduler (defauts to
 *  current value).
 * @param {Number} [options.lookahead] - Lookahead of the scheduler (defauts
 *  to current value).
 *
 * @memberof module:soundworks/client
 * @see [`wavesAudio.Scheduler`]{@link http://wavesjs.github.io/audio/#audio-scheduler}
 * @see [`platform` service]{@link module:soundworks/client.Platform}
 * @see [`sync` service]{@link module:soundworks/client.Sync}
 *
 * @example
 * // inside the experience constructor
 * this.syncScheduler = this.require('scheduler');
 *
 * // when the experience has started
 * const nextSyncTime = this.syncScheduler.current + 2;
 * this.syncScheduler.add(timeEngine, nextSyncTime);
 */

var SyncScheduler = function (_Service) {
  (0, _inherits3.default)(SyncScheduler, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function SyncScheduler() {
    (0, _classCallCheck3.default)(this, SyncScheduler);

    // initialize sync option
    var _this2 = (0, _possibleConstructorReturn3.default)(this, (SyncScheduler.__proto__ || (0, _getPrototypeOf2.default)(SyncScheduler)).call(this, SERVICE_ID, false));

    _this2._sync = null;
    _this2._syncedQueue = null;

    // init audio time based scheduler, sync service, and queue
    _this2._platform = _this2.require('platform', { features: 'web-audio' });
    _this2._sync = _this2.require('sync');
    _this2._syncedQueue = null;
    return _this2;
  }

  /** @private */


  (0, _createClass3.default)(SyncScheduler, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(SyncScheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(SyncScheduler.prototype), 'start', this).call(this);

      this._syncedQueue = new SyncTimeSchedulingQueue(this._sync, audioScheduler);
      this.ready();
    }

    /**
     * Current audio time of the scheduler.
     * @instance
     * @type {Number}
     */

  }, {
    key: 'getSyncTimeAtAudioTime',


    /**
     * Get sync time corresponding to given audio time.
     *
     * @param  {Number} audioTime - audio time.
     * @return {Number} - sync time corresponding to given audio time.
     */
    value: function getSyncTimeAtAudioTime(audioTime) {
      return this._sync.getSyncTime(audioTime);
    }

    /**
     * Get audio time corresponding to given sync time.
     *
     * @param  {Number} syncTime - sync time.
     * @return {Number} - audio time corresponding to given sync time.
     */

  }, {
    key: 'getAudioTimeAtSyncTime',
    value: function getAudioTimeAtSyncTime(syncTime) {
      return this._sync.getAudioTime(syncTime);
    }

    /**
     * Call a function at a given time.
     *
     * @param {Function} fun - Function to be deferred.
     * @param {Number} time - The time at which the function should be executed.
     * @param {Boolean} [lookahead=false] - Defines whether the function is called
     *  anticipated (e.g. for audio events) or precisely at the given time (default).
     */

  }, {
    key: 'defer',
    value: function defer(fun, time) {
      var lookahead = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var scheduler = this._syncedQueue;
      var schedulerService = this;
      var engine = void 0;

      if (lookahead) {
        scheduler.defer(fun, time);
      } else {
        engine = {
          advanceTime: function advanceTime(time) {
            var delta = schedulerService.deltaTime;

            if (delta > 0) setTimeout(fun, 1000 * delta, time); // bridge scheduler lookahead with timeout
            else fun(time);
          }
        };

        scheduler.add(engine, time); // add without checks
      }
    }

    /**
     * Add a time engine to the queue.
     *
     * @param {Function} engine - Engine to schedule.
     * @param {Number} time - The time at which the function should be executed.
     */

  }, {
    key: 'add',
    value: function add(engine, time) {
      this._syncedQueue.add(engine, time);
    }

    /**
     * Remove the given engine from the queue.
     *
     * @param {Function} engine - Engine to remove from the scheduler.
     */

  }, {
    key: 'remove',
    value: function remove(engine) {
      this._syncedQueue.remove(engine);
    }

    /**
     * Remove all scheduled functions and time engines from the scheduler.
     */

  }, {
    key: 'clear',
    value: function clear() {
      this._syncedQueue.clear();
    }
  }, {
    key: 'audioTime',
    get: function get() {
      return audioScheduler.currentTime;
    }

    /**
     * Current sync time of the scheduler.
     * @instance
     * @type {Number}
     */

  }, {
    key: 'syncTime',
    get: function get() {
      return this._syncedQueue.currentTime;
    }

    /**
     * Current sync time of the scheduler (alias `this.syncTime`).
     * @instance
     * @type {Number}
     */

  }, {
    key: 'currentTime',
    get: function get() {
      return this._syncedQueue.currentTime;
    }

    /**
     * Difference between the scheduler's logical audio time and the `currentTime`
     * of the audio context.
     * @instance
     * @type {Number}
     */

  }, {
    key: 'deltaTime',
    get: function get() {
      return audioScheduler.currentTime - audio.audioContext.currentTime;
    }
  }]);
  return SyncScheduler;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SyncScheduler);

exports.default = SyncScheduler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmNTY2hlZHVsZXIuanMiXSwibmFtZXMiOlsiYXVkaW8iLCJhdWRpb1NjaGVkdWxlciIsImdldFNjaGVkdWxlciIsIlN5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlIiwic3luYyIsInNjaGVkdWxlciIsImFkZCIsIkluZmluaXR5IiwibmV4dFN5bmNUaW1lIiwicmVzeW5jIiwiYmluZCIsImFkZExpc3RlbmVyIiwiYXVkaW9UaW1lIiwibmV4dEF1ZGlvVGltZSIsImdldEF1ZGlvVGltZSIsInN5bmNUaW1lIiwidW5kZWZpbmVkIiwiZ2V0U3luY1RpbWUiLCJtYXN0ZXIiLCJyZXNldEVuZ2luZVRpbWUiLCJjdXJyZW50VGltZSIsIlNjaGVkdWxpbmdRdWV1ZSIsIlNFUlZJQ0VfSUQiLCJTeW5jU2NoZWR1bGVyIiwiX3N5bmMiLCJfc3luY2VkUXVldWUiLCJfcGxhdGZvcm0iLCJyZXF1aXJlIiwiZmVhdHVyZXMiLCJyZWFkeSIsImZ1biIsInRpbWUiLCJsb29rYWhlYWQiLCJzY2hlZHVsZXJTZXJ2aWNlIiwiZW5naW5lIiwiZGVmZXIiLCJhZHZhbmNlVGltZSIsImRlbHRhIiwiZGVsdGFUaW1lIiwic2V0VGltZW91dCIsInJlbW92ZSIsImNsZWFyIiwiYXVkaW9Db250ZXh0IiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWUEsSzs7Ozs7O0FBQ1osSUFBTUMsaUJBQWlCRCxNQUFNRSxZQUFOLEVBQXZCOztJQUVNQyx1Qjs7O0FBQ0osbUNBQVlDLElBQVosRUFBa0JDLFNBQWxCLEVBQTZCO0FBQUE7O0FBQUE7O0FBRzNCLFVBQUtELElBQUwsR0FBWUEsSUFBWjtBQUNBLFVBQUtDLFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0EsVUFBS0EsU0FBTCxDQUFlQyxHQUFmLFFBQXlCQyxRQUF6QjtBQUNBLFVBQUtDLFlBQUwsR0FBb0JELFFBQXBCOztBQUVBO0FBQ0EsVUFBS0Us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LFdBQVdULEdBQVgsRUFBZ0IsT0FBT08sS0FBdkIsRUFBOEJOLElBQTlCLEVBREYsQ0FDdUM7QUFEdkMsaUJBR0VELElBQUlDLElBQUo7QUFDSDtBQVJNLFNBQVQ7O0FBV0ExQixrQkFBVUMsR0FBVixDQUFjNEIsTUFBZCxFQUFzQkgsSUFBdEIsRUFaSyxDQVl3QjtBQUM5QjtBQUNGOztBQUVEOzs7Ozs7Ozs7d0JBTUlHLE0sRUFBUUgsSSxFQUFNO0FBQ2hCLFdBQUtOLFlBQUwsQ0FBa0JuQixHQUFsQixDQUFzQjRCLE1BQXRCLEVBQThCSCxJQUE5QjtBQUNEOztBQUVEOzs7Ozs7OzsyQkFLT0csTSxFQUFRO0FBQ2IsV0FBS1QsWUFBTCxDQUFrQmUsTUFBbEIsQ0FBeUJOLE1BQXpCO0FBQ0Q7O0FBRUQ7Ozs7Ozs0QkFHUTtBQUNOLFdBQUtULFlBQUwsQ0FBa0JnQixLQUFsQjtBQUNEOzs7d0JBM0dlO0FBQ2QsYUFBT3hDLGVBQWVtQixXQUF0QjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLZTtBQUNiLGFBQU8sS0FBS0ssWUFBTCxDQUFrQkwsV0FBekI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS2tCO0FBQ2hCLGFBQU8sS0FBS0ssWUFBTCxDQUFrQkwsV0FBekI7QUFDRDs7QUFFRDs7Ozs7Ozs7O3dCQU1nQjtBQUNkLGFBQU9uQixlQUFlbUIsV0FBZixHQUE2QnBCLE1BQU0wQyxZQUFOLENBQW1CdEIsV0FBdkQ7QUFDRDs7Ozs7QUFnRkgseUJBQWV1QixRQUFmLENBQXdCckIsVUFBeEIsRUFBb0NDLGFBQXBDOztrQkFFZUEsYSIsImZpbGUiOiJTeW5jU2NoZWR1bGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCAqIGFzIGF1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcbmNvbnN0IGF1ZGlvU2NoZWR1bGVyID0gYXVkaW8uZ2V0U2NoZWR1bGVyKCk7XG5cbmNsYXNzIFN5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlIGV4dGVuZHMgYXVkaW8uU2NoZWR1bGluZ1F1ZXVlIHtcbiAgY29uc3RydWN0b3Ioc3luYywgc2NoZWR1bGVyKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3luYyA9IHN5bmM7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgdGhpcy5zY2hlZHVsZXIuYWRkKHRoaXMsIEluZmluaXR5KTtcbiAgICB0aGlzLm5leHRTeW5jVGltZSA9IEluZmluaXR5O1xuXG4gICAgLy8gY2FsbCB0aGlzLnJlc3luYyBpbiBzeW5jIGNhbGxiYWNrXG4gICAgdGhpcy5yZXN5bmMgPSB0aGlzLnJlc3luYy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3luYy5hZGRMaXN0ZW5lcih0aGlzLnJlc3luYyk7XG4gIH1cblxuICBnZXQgY3VycmVudFRpbWUgKCkge1xuICAgIHJldHVybiB0aGlzLnN5bmMuZ2V0U3luY1RpbWUodGhpcy5zY2hlZHVsZXIuY3VycmVudFRpbWUpO1xuICB9XG5cbiAgYWR2YW5jZVRpbWUoYXVkaW9UaW1lKSB7XG4gICAgY29uc3QgbmV4dFN5bmNUaW1lID0gc3VwZXIuYWR2YW5jZVRpbWUodGhpcy5uZXh0U3luY1RpbWUpO1xuICAgIGNvbnN0IG5leHRBdWRpb1RpbWUgPSB0aGlzLnN5bmMuZ2V0QXVkaW9UaW1lKG5leHRTeW5jVGltZSk7XG5cbiAgICB0aGlzLm5leHRTeW5jVGltZSA9IG5leHRTeW5jVGltZTtcblxuICAgIHJldHVybiBuZXh0QXVkaW9UaW1lO1xuICB9XG5cbiAgcmVzZXRUaW1lKHN5bmNUaW1lKSB7XG4gICAgaWYgKHN5bmNUaW1lID09PSB1bmRlZmluZWQpXG4gICAgICBzeW5jVGltZSA9IHRoaXMuc3luYy5nZXRTeW5jVGltZSgpO1xuXG4gICAgdGhpcy5uZXh0U3luY1RpbWUgPSBzeW5jVGltZTtcblxuICAgIGNvbnN0IGF1ZGlvVGltZSA9IHRoaXMuc3luYy5nZXRBdWRpb1RpbWUoc3luY1RpbWUpO1xuICAgIHRoaXMubWFzdGVyLnJlc2V0RW5naW5lVGltZSh0aGlzLCBhdWRpb1RpbWUpO1xuICB9XG5cbiAgcmVzeW5jKCkge1xuICAgIGlmICh0aGlzLm5leHRTeW5jVGltZSAhPT0gSW5maW5pdHkpIHtcbiAgICAgIGNvbnN0IG5leHRBdWRpb1RpbWUgPSB0aGlzLnN5bmMuZ2V0QXVkaW9UaW1lKHRoaXMubmV4dFN5bmNUaW1lKTtcbiAgICAgIHRoaXMubWFzdGVyLnJlc2V0RW5naW5lVGltZSh0aGlzLCBuZXh0QXVkaW9UaW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIEluZmluaXR5KTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnN5bmMtc2NoZWR1bGVyJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdzeW5jLXNjaGVkdWxlcidgIHNlcnZpY2UuXG4gKlxuICogVGhlIGBzeW5jLXNjaGVkdWxlcmAgcHJvdmlkZXMgYSBzY2hlZHVsZXIgc3luY2hyb25pc2VkIGFtb25nIGFsbCBjbGllbnQgdXNpbmcgdGhlXG4gKiBbYHN5bmNgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU3luY30gc2VydmljZS5cbiAqXG4gKiBXaGlsZSB0aGlzIHNlcnZpY2UgaGFzIG5vIGRpcmVjdCBzZXJ2ZXIgY291bnRlcnBhcnQsIGl0cyBkZXBlbmRlbmN5IG9uIHRoZVxuICogW2BzeW5jYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlN5bmN9IHNlcnZpY2Ugd2hpY2ggcmVxdWlyZXMgdGhlXG4gKiBleGlzdGVuY2Ugb2YgYSBzZXJ2ZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5wZXJpb2RdIC0gUGVyaW9kIG9mIHRoZSBzY2hlZHVsZXIgKGRlZmF1dHMgdG9cbiAqICBjdXJyZW50IHZhbHVlKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5sb29rYWhlYWRdIC0gTG9va2FoZWFkIG9mIHRoZSBzY2hlZHVsZXIgKGRlZmF1dHNcbiAqICB0byBjdXJyZW50IHZhbHVlKS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAc2VlIFtgd2F2ZXNBdWRpby5TY2hlZHVsZXJgXXtAbGluayBodHRwOi8vd2F2ZXNqcy5naXRodWIuaW8vYXVkaW8vI2F1ZGlvLXNjaGVkdWxlcn1cbiAqIEBzZWUgW2BwbGF0Zm9ybWAgc2VydmljZV17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfVxuICogQHNlZSBbYHN5bmNgIHNlcnZpY2Vde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TeW5jfVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc3luY1NjaGVkdWxlciA9IHRoaXMucmVxdWlyZSgnc2NoZWR1bGVyJyk7XG4gKlxuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZFxuICogY29uc3QgbmV4dFN5bmNUaW1lID0gdGhpcy5zeW5jU2NoZWR1bGVyLmN1cnJlbnQgKyAyO1xuICogdGhpcy5zeW5jU2NoZWR1bGVyLmFkZCh0aW1lRW5naW5lLCBuZXh0U3luY1RpbWUpO1xuICovXG5jbGFzcyBTeW5jU2NoZWR1bGVyIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIGZhbHNlKTtcblxuICAgIC8vIGluaXRpYWxpemUgc3luYyBvcHRpb25cbiAgICB0aGlzLl9zeW5jID0gbnVsbDtcbiAgICB0aGlzLl9zeW5jZWRRdWV1ZSA9IG51bGw7XG5cbiAgICAvLyBpbml0IGF1ZGlvIHRpbWUgYmFzZWQgc2NoZWR1bGVyLCBzeW5jIHNlcnZpY2UsIGFuZCBxdWV1ZVxuICAgIHRoaXMuX3BsYXRmb3JtID0gdGhpcy5yZXF1aXJlKCdwbGF0Zm9ybScsIHsgZmVhdHVyZXM6ICd3ZWItYXVkaW8nIH0pO1xuICAgIHRoaXMuX3N5bmMgPSB0aGlzLnJlcXVpcmUoJ3N5bmMnKTtcbiAgICB0aGlzLl9zeW5jZWRRdWV1ZSA9IG51bGw7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuX3N5bmNlZFF1ZXVlID0gbmV3IFN5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlKHRoaXMuX3N5bmMsIGF1ZGlvU2NoZWR1bGVyKTtcbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCBhdWRpbyB0aW1lIG9mIHRoZSBzY2hlZHVsZXIuXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGF1ZGlvVGltZSgpIHtcbiAgICByZXR1cm4gYXVkaW9TY2hlZHVsZXIuY3VycmVudFRpbWU7XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCBzeW5jIHRpbWUgb2YgdGhlIHNjaGVkdWxlci5cbiAgICogQGluc3RhbmNlXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3luY1RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmNlZFF1ZXVlLmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgc3luYyB0aW1lIG9mIHRoZSBzY2hlZHVsZXIgKGFsaWFzIGB0aGlzLnN5bmNUaW1lYCkuXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGN1cnJlbnRUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jZWRRdWV1ZS5jdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaWZmZXJlbmNlIGJldHdlZW4gdGhlIHNjaGVkdWxlcidzIGxvZ2ljYWwgYXVkaW8gdGltZSBhbmQgdGhlIGBjdXJyZW50VGltZWBcbiAgICogb2YgdGhlIGF1ZGlvIGNvbnRleHQuXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGRlbHRhVGltZSgpIHtcbiAgICByZXR1cm4gYXVkaW9TY2hlZHVsZXIuY3VycmVudFRpbWUgLSBhdWRpby5hdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHN5bmMgdGltZSBjb3JyZXNwb25kaW5nIHRvIGdpdmVuIGF1ZGlvIHRpbWUuXG4gICAqXG4gICAqIEBwYXJhbSAge051bWJlcn0gYXVkaW9UaW1lIC0gYXVkaW8gdGltZS5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIHN5bmMgdGltZSBjb3JyZXNwb25kaW5nIHRvIGdpdmVuIGF1ZGlvIHRpbWUuXG4gICAqL1xuICBnZXRTeW5jVGltZUF0QXVkaW9UaW1lKGF1ZGlvVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldFN5bmNUaW1lKGF1ZGlvVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGF1ZGlvIHRpbWUgY29ycmVzcG9uZGluZyB0byBnaXZlbiBzeW5jIHRpbWUuXG4gICAqXG4gICAqIEBwYXJhbSAge051bWJlcn0gc3luY1RpbWUgLSBzeW5jIHRpbWUuXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBhdWRpbyB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gZ2l2ZW4gc3luYyB0aW1lLlxuICAgKi9cbiAgZ2V0QXVkaW9UaW1lQXRTeW5jVGltZShzeW5jVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldEF1ZGlvVGltZShzeW5jVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbCBhIGZ1bmN0aW9uIGF0IGEgZ2l2ZW4gdGltZS5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuIC0gRnVuY3Rpb24gdG8gYmUgZGVmZXJyZWQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIC0gVGhlIHRpbWUgYXQgd2hpY2ggdGhlIGZ1bmN0aW9uIHNob3VsZCBiZSBleGVjdXRlZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbbG9va2FoZWFkPWZhbHNlXSAtIERlZmluZXMgd2hldGhlciB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkXG4gICAqICBhbnRpY2lwYXRlZCAoZS5nLiBmb3IgYXVkaW8gZXZlbnRzKSBvciBwcmVjaXNlbHkgYXQgdGhlIGdpdmVuIHRpbWUgKGRlZmF1bHQpLlxuICAgKi9cbiAgZGVmZXIoZnVuLCB0aW1lLCBsb29rYWhlYWQgPSBmYWxzZSkge1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHRoaXMuX3N5bmNlZFF1ZXVlO1xuICAgIGNvbnN0IHNjaGVkdWxlclNlcnZpY2UgPSB0aGlzO1xuICAgIGxldCBlbmdpbmU7XG5cbiAgICBpZihsb29rYWhlYWQpIHtcbiAgICAgIHNjaGVkdWxlci5kZWZlcihmdW4sIHRpbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmdpbmUgPSB7XG4gICAgICAgIGFkdmFuY2VUaW1lOiBmdW5jdGlvbih0aW1lKSB7XG4gICAgICAgICAgY29uc3QgZGVsdGEgPSBzY2hlZHVsZXJTZXJ2aWNlLmRlbHRhVGltZTtcblxuICAgICAgICAgIGlmKGRlbHRhID4gMClcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuLCAxMDAwICogZGVsdGEsIHRpbWUpOyAvLyBicmlkZ2Ugc2NoZWR1bGVyIGxvb2thaGVhZCB3aXRoIHRpbWVvdXRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBmdW4odGltZSk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICBzY2hlZHVsZXIuYWRkKGVuZ2luZSwgdGltZSk7IC8vIGFkZCB3aXRob3V0IGNoZWNrc1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSB0aW1lIGVuZ2luZSB0byB0aGUgcXVldWUuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGVuZ2luZSAtIEVuZ2luZSB0byBzY2hlZHVsZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBUaGUgdGltZSBhdCB3aGljaCB0aGUgZnVuY3Rpb24gc2hvdWxkIGJlIGV4ZWN1dGVkLlxuICAgKi9cbiAgYWRkKGVuZ2luZSwgdGltZSkge1xuICAgIHRoaXMuX3N5bmNlZFF1ZXVlLmFkZChlbmdpbmUsIHRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZ2l2ZW4gZW5naW5lIGZyb20gdGhlIHF1ZXVlLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBlbmdpbmUgLSBFbmdpbmUgdG8gcmVtb3ZlIGZyb20gdGhlIHNjaGVkdWxlci5cbiAgICovXG4gIHJlbW92ZShlbmdpbmUpIHtcbiAgICB0aGlzLl9zeW5jZWRRdWV1ZS5yZW1vdmUoZW5naW5lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIHNjaGVkdWxlZCBmdW5jdGlvbnMgYW5kIHRpbWUgZW5naW5lcyBmcm9tIHRoZSBzY2hlZHVsZXIuXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLl9zeW5jZWRRdWV1ZS5jbGVhcigpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFN5bmNTY2hlZHVsZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBTeW5jU2NoZWR1bGVyO1xuIl19