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

var audio = _interopRequireWildcard(_wavesAudio);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _SyncTimeSchedulingQueue = function (_audio$SchedulingQueu) {
  (0, _inherits3.default)(_SyncTimeSchedulingQueue, _audio$SchedulingQueu);

  function _SyncTimeSchedulingQueue(sync, scheduler) {
    (0, _classCallCheck3.default)(this, _SyncTimeSchedulingQueue);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_SyncTimeSchedulingQueue).call(this));

    _this.sync = sync;
    _this.scheduler = scheduler;
    _this.scheduler.add(_this, Infinity);
    _this.nextSyncTime = Infinity;

    // call this.resync in sync callback
    _this.resync = _this.resync.bind(_this);
    _this.sync.addListener(_this.resync);
    return _this;
  }

  (0, _createClass3.default)(_SyncTimeSchedulingQueue, [{
    key: 'advanceTime',
    value: function advanceTime(audioTime) {
      var syncTime = this.sync.getSyncTime(audioTime);
      var nextSyncTime = (0, _get3.default)((0, _getPrototypeOf2.default)(_SyncTimeSchedulingQueue.prototype), 'advanceTime', this).call(this, this.nextSyncTime);
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
  return _SyncTimeSchedulingQueue;
}(audio.SchedulingQueue);

var SERVICE_ID = 'service:scheduler';

/**
 * Interface for the client `'scheduler'` service.
 *
 * This service provides a scheduler synchronised among all client using the
 * [`sync`]{@link module:soundworks/client.Sync} service. It internally uses the
 * scheduler provided by the [`wavesjs`]{@link https://github.com/wavesjs/audio}
 * library.
 *
 * When setting the option `'sync'` to `'false'`, the scheduling is local
 * (without sunchronization to the other clients) and the `'sync'` service is
 * not required (attention: since its default value is `'true'`, all requests
 * of the `'scheduler'` service in the application have to explicitly specify
 * the `'sync'` option as `'false'` to assure that the `'sync'` service is not
 * enabled).
 *
 * While this service has no direct server counterpart, it's dependency to the
 * [`sync`]{@link module:soundworks/client.Sync} service may require the existance
 * of a server. In addition, the service requires a device with `WebAudio` ability.
 *
 * @param {Object} options
 * @param {Number} [options.period] - Period of the scheduler (defauts to current value).
 * @param {Number} [options.lookahead] - Lookahead of the scheduler (defauts to current value).
 * @param {Boolean} [options.sync = true] - Enable synchronized scheduling.
 *
 * @memberof module:soundworks/client
 * @see [`wavesAudio.Scheduler`]{@link http://wavesjs.github.io/audio/#audio-scheduler}
 * @see [`sync service`]{@link module:soundworks/client.Sync}
 *
 * @example
 * // inside the experience constructor
 * this.scheduler = this.require('scheduler', { sync: true });
 *
 * // when the experience has started
 * const nextSyncTime = this.scheduler.getSyncTime() + 2;
 * this.scheduler.add(timeEngine, nextSyncTime, true);
 */

var Scheduler = function (_Service) {
  (0, _inherits3.default)(Scheduler, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Scheduler() {
    (0, _classCallCheck3.default)(this, Scheduler);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Scheduler).call(this, SERVICE_ID));

    _this2._platform = _this2.require('platform', { features: 'web-audio' });

    // initialize sync option
    _this2._sync = null;
    _this2._syncedQueue = null;

    // get audio time based scheduler
    _this2._scheduler = audio.getScheduler();

    var defaults = {
      lookahead: _this2._scheduler.lookahead,
      period: _this2._scheduler.period,
      sync: undefined
    };

    // call super.configure (activate sync option only if required)
    (0, _get3.default)((0, _getPrototypeOf2.default)(Scheduler.prototype), 'configure', _this2).call(_this2, defaults);
    return _this2;
  }

  /**
   * Override default `configure` to configure the scheduler.
   * @private
   * @param {Object} options - The options to apply to the service.
   */


  (0, _createClass3.default)(Scheduler, [{
    key: 'configure',
    value: function configure(options) {
      // check and set scheduler period option
      if (options.period !== undefined) {
        if (options.period > 0.010) this._scheduler.period = options.period;else throw new Error('Invalid scheduler period: ' + options.period);
      }

      // check and set scheduler lookahead option
      if (options.lookahead !== undefined) {
        if (options.lookahead > 0.010) this._scheduler.lookahead = options.lookahead;else throw new Error('Invalid scheduler lookahead: ' + options.lookahead);
      }

      // set sync option
      var opt = options.sync !== undefined ? options.sync : true; // default is true
      var sync = sync === undefined ? opt : sync || opt; // truth will prevail

      // enable sync at first request with option set to true
      if (sync && !this._sync) {
        this._sync = this.require('sync');
        this._syncedQueue = new _SyncTimeSchedulingQueue(this._sync, this._scheduler);
      }

      options.sync = sync;
      (0, _get3.default)((0, _getPrototypeOf2.default)(Scheduler.prototype), 'configure', this).call(this, options);
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Scheduler.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.ready();
    }

    /**
     * Current audio time of the scheduler.
     */

  }, {
    key: 'defer',


    /**
     * Call a function at a given time.
     * @param {Function} fun - Function to be deferred.
     * @param {Number} time - The time at which the function should be executed.
     * @param {Boolean} [synchronized=true] - Defines whether the function call should be
     * @param {Boolean} [lookahead=false] - Defines whether the function is called anticipated
     * (e.g. for audio events) or precisely at the given time (default).
     *
     * Attention: The actual synchronization of the scheduled function depends not
     * only of the `'synchronized'` option, but also of the configuration of the
     * scheduler service. However, to assure a the desired synchronization, the
     * option has to be properly specified. Without specifying the option,
     * synchronized scheduling will be used when available.
     */
    value: function defer(fun, time) {
      var synchronized = arguments.length <= 2 || arguments[2] === undefined ? !!this._sync : arguments[2];
      var lookahead = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      var scheduler = synchronized && this._sync ? this._syncedQueue : this._scheduler;
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
     * @param {Function} engine - Engine to schedule.
     * @param {Number} time - The time at which the function should be executed.
     * @param {Boolean} [synchronized=true] - Defines whether the engine should be synchronized or not.
     *
     * Attention: The actual synchronization of the scheduled time engine depends
     * not only of the `'synchronized'` option, but also of the configuration of
     * the scheduler service. However, to assure a the desired synchronization,
     * the option has to be properly specified. Without specifying the option,
     * synchronized scheduling will be used when available.
     */

  }, {
    key: 'add',
    value: function add(engine, time) {
      var synchronized = arguments.length <= 2 || arguments[2] === undefined ? !!this._sync : arguments[2];

      var scheduler = synchronized && this._sync ? this._syncedQueue : this._scheduler;
      scheduler.add(engine, time);
    }

    /**
     * Remove the given engine from the queue.
     * @param {Function} engine - Engine to remove from the scheduler.
     */

  }, {
    key: 'remove',
    value: function remove(engine) {
      if (this._scheduler.has(engine)) this._scheduler.remove(engine);else if (this._syncedQueue && this._syncedQueue.has(engine)) this._syncedQueue.remove(engine);
    }

    /**
     * Remove all scheduled functions and time engines (synchronized and not) from the scheduler.
     */

  }, {
    key: 'clear',
    value: function clear() {
      if (this._syncedQueue) this._syncedQueue.clear();

      this._scheduler.clear();
    }
  }, {
    key: 'audioTime',
    get: function get() {
      return this._scheduler.currentTime;
    }

    /**
     * Current sync time of the scheduler.
     */

  }, {
    key: 'syncTime',
    get: function get() {
      if (this._syncedQueue) return this._syncedQueue.currentTime;

      return undefined;
    }

    /**
     * Difference between the scheduler's logical audio time and the `currentTime`
     * of the audio context.
     */

  }, {
    key: 'deltaTime',
    get: function get() {
      return this._scheduler.currentTime - audio.audioContext.currentTime;
    }
  }]);
  return Scheduler;
}(_Service3.default);

;

_serviceManager2.default.register(SERVICE_ID, Scheduler);

exports.default = Scheduler;
//# sourceMappingURL=data:application/json;base64,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d0IsVUFBeEIsRUFBb0MsU0FBcEM7O2tCQUVlLFMiLCJmaWxlIjoiU2NoZWR1bGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY2xhc3MgX1N5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlIGV4dGVuZHMgYXVkaW8uU2NoZWR1bGluZ1F1ZXVlIHtcbiAgY29uc3RydWN0b3Ioc3luYywgc2NoZWR1bGVyKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3luYyA9IHN5bmM7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgdGhpcy5zY2hlZHVsZXIuYWRkKHRoaXMsIEluZmluaXR5KTtcbiAgICB0aGlzLm5leHRTeW5jVGltZSA9IEluZmluaXR5O1xuXG4gICAgLy8gY2FsbCB0aGlzLnJlc3luYyBpbiBzeW5jIGNhbGxiYWNrXG4gICAgdGhpcy5yZXN5bmMgPSB0aGlzLnJlc3luYy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3luYy5hZGRMaXN0ZW5lcih0aGlzLnJlc3luYyk7XG4gIH1cblxuICBnZXQgY3VycmVudFRpbWUgKCkge1xuICAgIHJldHVybiB0aGlzLnN5bmMuZ2V0U3luY1RpbWUodGhpcy5zY2hlZHVsZXIuY3VycmVudFRpbWUpO1xuICB9XG5cbiAgYWR2YW5jZVRpbWUoYXVkaW9UaW1lKSB7XG4gICAgY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoYXVkaW9UaW1lKTtcbiAgICBjb25zdCBuZXh0U3luY1RpbWUgPSBzdXBlci5hZHZhbmNlVGltZSh0aGlzLm5leHRTeW5jVGltZSk7XG4gICAgY29uc3QgbmV4dEF1ZGlvVGltZSA9IHRoaXMuc3luYy5nZXRBdWRpb1RpbWUobmV4dFN5bmNUaW1lKTtcblxuICAgIHRoaXMubmV4dFN5bmNUaW1lID0gbmV4dFN5bmNUaW1lO1xuXG4gICAgcmV0dXJuIG5leHRBdWRpb1RpbWU7XG4gIH1cblxuICByZXNldFRpbWUoc3luY1RpbWUpIHtcbiAgICBpZihzeW5jVGltZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcblxuICAgIHRoaXMubmV4dFN5bmNUaW1lID0gc3luY1RpbWU7XG5cbiAgICBjb25zdCBhdWRpb1RpbWUgPSB0aGlzLnN5bmMuZ2V0QXVkaW9UaW1lKHN5bmNUaW1lKTtcbiAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVRpbWUodGhpcywgYXVkaW9UaW1lKTtcbiAgfVxuXG4gIHJlc3luYygpIHtcbiAgICBpZiAodGhpcy5uZXh0U3luY1RpbWUgIT09IEluZmluaXR5KSB7XG4gICAgICBjb25zdCBuZXh0QXVkaW9UaW1lID0gdGhpcy5zeW5jLmdldEF1ZGlvVGltZSh0aGlzLm5leHRTeW5jVGltZSk7XG4gICAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVRpbWUodGhpcywgbmV4dEF1ZGlvVGltZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWFzdGVyLnJlc2V0RW5naW5lVGltZSh0aGlzLCBJbmZpbml0eSk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzY2hlZHVsZXInO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ3NjaGVkdWxlcidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIHByb3ZpZGVzIGEgc2NoZWR1bGVyIHN5bmNocm9uaXNlZCBhbW9uZyBhbGwgY2xpZW50IHVzaW5nIHRoZVxuICogW2BzeW5jYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlN5bmN9IHNlcnZpY2UuIEl0IGludGVybmFsbHkgdXNlcyB0aGVcbiAqIHNjaGVkdWxlciBwcm92aWRlZCBieSB0aGUgW2B3YXZlc2pzYF17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3dhdmVzanMvYXVkaW99XG4gKiBsaWJyYXJ5LlxuICpcbiAqIFdoZW4gc2V0dGluZyB0aGUgb3B0aW9uIGAnc3luYydgIHRvIGAnZmFsc2UnYCwgdGhlIHNjaGVkdWxpbmcgaXMgbG9jYWxcbiAqICh3aXRob3V0IHN1bmNocm9uaXphdGlvbiB0byB0aGUgb3RoZXIgY2xpZW50cykgYW5kIHRoZSBgJ3N5bmMnYCBzZXJ2aWNlIGlzXG4gKiBub3QgcmVxdWlyZWQgKGF0dGVudGlvbjogc2luY2UgaXRzIGRlZmF1bHQgdmFsdWUgaXMgYCd0cnVlJ2AsIGFsbCByZXF1ZXN0c1xuICogb2YgdGhlIGAnc2NoZWR1bGVyJ2Agc2VydmljZSBpbiB0aGUgYXBwbGljYXRpb24gaGF2ZSB0byBleHBsaWNpdGx5IHNwZWNpZnlcbiAqIHRoZSBgJ3N5bmMnYCBvcHRpb24gYXMgYCdmYWxzZSdgIHRvIGFzc3VyZSB0aGF0IHRoZSBgJ3N5bmMnYCBzZXJ2aWNlIGlzIG5vdFxuICogZW5hYmxlZCkuXG4gKlxuICogV2hpbGUgdGhpcyBzZXJ2aWNlIGhhcyBubyBkaXJlY3Qgc2VydmVyIGNvdW50ZXJwYXJ0LCBpdCdzIGRlcGVuZGVuY3kgdG8gdGhlXG4gKiBbYHN5bmNgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU3luY30gc2VydmljZSBtYXkgcmVxdWlyZSB0aGUgZXhpc3RhbmNlXG4gKiBvZiBhIHNlcnZlci4gSW4gYWRkaXRpb24sIHRoZSBzZXJ2aWNlIHJlcXVpcmVzIGEgZGV2aWNlIHdpdGggYFdlYkF1ZGlvYCBhYmlsaXR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucGVyaW9kXSAtIFBlcmlvZCBvZiB0aGUgc2NoZWR1bGVyIChkZWZhdXRzIHRvIGN1cnJlbnQgdmFsdWUpLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmxvb2thaGVhZF0gLSBMb29rYWhlYWQgb2YgdGhlIHNjaGVkdWxlciAoZGVmYXV0cyB0byBjdXJyZW50IHZhbHVlKS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc3luYyA9IHRydWVdIC0gRW5hYmxlIHN5bmNocm9uaXplZCBzY2hlZHVsaW5nLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBzZWUgW2B3YXZlc0F1ZGlvLlNjaGVkdWxlcmBde0BsaW5rIGh0dHA6Ly93YXZlc2pzLmdpdGh1Yi5pby9hdWRpby8jYXVkaW8tc2NoZWR1bGVyfVxuICogQHNlZSBbYHN5bmMgc2VydmljZWBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TeW5jfVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc2NoZWR1bGVyID0gdGhpcy5yZXF1aXJlKCdzY2hlZHVsZXInLCB7IHN5bmM6IHRydWUgfSk7XG4gKlxuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZFxuICogY29uc3QgbmV4dFN5bmNUaW1lID0gdGhpcy5zY2hlZHVsZXIuZ2V0U3luY1RpbWUoKSArIDI7XG4gKiB0aGlzLnNjaGVkdWxlci5hZGQodGltZUVuZ2luZSwgbmV4dFN5bmNUaW1lLCB0cnVlKTtcbiAqL1xuY2xhc3MgU2NoZWR1bGVyIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgdGhpcy5fcGxhdGZvcm0gPSB0aGlzLnJlcXVpcmUoJ3BsYXRmb3JtJywgeyBmZWF0dXJlczogJ3dlYi1hdWRpbycgfSk7XG5cbiAgICAvLyBpbml0aWFsaXplIHN5bmMgb3B0aW9uXG4gICAgdGhpcy5fc3luYyA9IG51bGw7XG4gICAgdGhpcy5fc3luY2VkUXVldWUgPSBudWxsO1xuXG4gICAgLy8gZ2V0IGF1ZGlvIHRpbWUgYmFzZWQgc2NoZWR1bGVyXG4gICAgdGhpcy5fc2NoZWR1bGVyID0gYXVkaW8uZ2V0U2NoZWR1bGVyKCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGxvb2thaGVhZDogdGhpcy5fc2NoZWR1bGVyLmxvb2thaGVhZCxcbiAgICAgIHBlcmlvZDogdGhpcy5fc2NoZWR1bGVyLnBlcmlvZCxcbiAgICAgIHN5bmM6IHVuZGVmaW5lZCxcbiAgICB9O1xuXG4gICAgLy8gY2FsbCBzdXBlci5jb25maWd1cmUgKGFjdGl2YXRlIHN5bmMgb3B0aW9uIG9ubHkgaWYgcmVxdWlyZWQpXG4gICAgc3VwZXIuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZSBkZWZhdWx0IGBjb25maWd1cmVgIHRvIGNvbmZpZ3VyZSB0aGUgc2NoZWR1bGVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGFwcGx5IHRvIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICAvLyBjaGVjayBhbmQgc2V0IHNjaGVkdWxlciBwZXJpb2Qgb3B0aW9uXG4gICAgaWYgKG9wdGlvbnMucGVyaW9kICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChvcHRpb25zLnBlcmlvZCA+IDAuMDEwKVxuICAgICAgICB0aGlzLl9zY2hlZHVsZXIucGVyaW9kID0gb3B0aW9ucy5wZXJpb2Q7XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzY2hlZHVsZXIgcGVyaW9kOiAke29wdGlvbnMucGVyaW9kfWApO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGFuZCBzZXQgc2NoZWR1bGVyIGxvb2thaGVhZCBvcHRpb25cbiAgICBpZiAob3B0aW9ucy5sb29rYWhlYWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKG9wdGlvbnMubG9va2FoZWFkID4gMC4wMTApXG4gICAgICAgIHRoaXMuX3NjaGVkdWxlci5sb29rYWhlYWQgPSBvcHRpb25zLmxvb2thaGVhZDtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNjaGVkdWxlciBsb29rYWhlYWQ6ICR7b3B0aW9ucy5sb29rYWhlYWR9YCk7XG4gICAgfVxuXG4gICAgLy8gc2V0IHN5bmMgb3B0aW9uXG4gICAgY29uc3Qgb3B0ID0gKG9wdGlvbnMuc3luYyAhPT0gdW5kZWZpbmVkKT8gb3B0aW9ucy5zeW5jOiB0cnVlOyAvLyBkZWZhdWx0IGlzIHRydWVcbiAgICBjb25zdCBzeW5jID0gKHN5bmMgPT09IHVuZGVmaW5lZCk/IG9wdDogKHN5bmMgfHwgb3B0KTsgLy8gdHJ1dGggd2lsbCBwcmV2YWlsXG5cbiAgICAvLyBlbmFibGUgc3luYyBhdCBmaXJzdCByZXF1ZXN0IHdpdGggb3B0aW9uIHNldCB0byB0cnVlXG4gICAgaWYoc3luYyAmJiAhdGhpcy5fc3luYykge1xuICAgICAgdGhpcy5fc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuICAgICAgdGhpcy5fc3luY2VkUXVldWUgPSBuZXcgX1N5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlKHRoaXMuX3N5bmMsIHRoaXMuX3NjaGVkdWxlcilcbiAgICB9XG5cbiAgICBvcHRpb25zLnN5bmMgPSBzeW5jO1xuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdXJyZW50IGF1ZGlvIHRpbWUgb2YgdGhlIHNjaGVkdWxlci5cbiAgICovXG4gIGdldCBhdWRpb1RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdXJyZW50IHN5bmMgdGltZSBvZiB0aGUgc2NoZWR1bGVyLlxuICAgKi9cbiAgZ2V0IHN5bmNUaW1lKCkge1xuICAgIGlmKHRoaXMuX3N5bmNlZFF1ZXVlKVxuICAgICAgcmV0dXJuIHRoaXMuX3N5bmNlZFF1ZXVlLmN1cnJlbnRUaW1lO1xuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaWZmZXJlbmNlIGJldHdlZW4gdGhlIHNjaGVkdWxlcidzIGxvZ2ljYWwgYXVkaW8gdGltZSBhbmQgdGhlIGBjdXJyZW50VGltZWBcbiAgICogb2YgdGhlIGF1ZGlvIGNvbnRleHQuXG4gICAqL1xuICBnZXQgZGVsdGFUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zY2hlZHVsZXIuY3VycmVudFRpbWUgLSBhdWRpby5hdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbCBhIGZ1bmN0aW9uIGF0IGEgZ2l2ZW4gdGltZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuIC0gRnVuY3Rpb24gdG8gYmUgZGVmZXJyZWQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIC0gVGhlIHRpbWUgYXQgd2hpY2ggdGhlIGZ1bmN0aW9uIHNob3VsZCBiZSBleGVjdXRlZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbc3luY2hyb25pemVkPXRydWVdIC0gRGVmaW5lcyB3aGV0aGVyIHRoZSBmdW5jdGlvbiBjYWxsIHNob3VsZCBiZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtsb29rYWhlYWQ9ZmFsc2VdIC0gRGVmaW5lcyB3aGV0aGVyIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgYW50aWNpcGF0ZWRcbiAgICogKGUuZy4gZm9yIGF1ZGlvIGV2ZW50cykgb3IgcHJlY2lzZWx5IGF0IHRoZSBnaXZlbiB0aW1lIChkZWZhdWx0KS5cbiAgICpcbiAgICogQXR0ZW50aW9uOiBUaGUgYWN0dWFsIHN5bmNocm9uaXphdGlvbiBvZiB0aGUgc2NoZWR1bGVkIGZ1bmN0aW9uIGRlcGVuZHMgbm90XG4gICAqIG9ubHkgb2YgdGhlIGAnc3luY2hyb25pemVkJ2Agb3B0aW9uLCBidXQgYWxzbyBvZiB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGVcbiAgICogc2NoZWR1bGVyIHNlcnZpY2UuIEhvd2V2ZXIsIHRvIGFzc3VyZSBhIHRoZSBkZXNpcmVkIHN5bmNocm9uaXphdGlvbiwgdGhlXG4gICAqIG9wdGlvbiBoYXMgdG8gYmUgcHJvcGVybHkgc3BlY2lmaWVkLiBXaXRob3V0IHNwZWNpZnlpbmcgdGhlIG9wdGlvbixcbiAgICogc3luY2hyb25pemVkIHNjaGVkdWxpbmcgd2lsbCBiZSB1c2VkIHdoZW4gYXZhaWxhYmxlLlxuICAgKi9cbiAgZGVmZXIoZnVuLCB0aW1lLCBzeW5jaHJvbml6ZWQgPSAhIXRoaXMuX3N5bmMsIGxvb2thaGVhZCA9IGZhbHNlKSB7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gKHN5bmNocm9uaXplZCAmJiB0aGlzLl9zeW5jKSA/IHRoaXMuX3N5bmNlZFF1ZXVlIDogdGhpcy5fc2NoZWR1bGVyO1xuICAgIGNvbnN0IHNjaGVkdWxlclNlcnZpY2UgPSB0aGlzO1xuICAgIGxldCBlbmdpbmU7XG5cbiAgICBpZihsb29rYWhlYWQpIHtcbiAgICAgIHNjaGVkdWxlci5kZWZlcihmdW4sIHRpbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmdpbmUgPSB7XG4gICAgICAgIGFkdmFuY2VUaW1lOiBmdW5jdGlvbih0aW1lKSB7XG4gICAgICAgICAgY29uc3QgZGVsdGEgPSBzY2hlZHVsZXJTZXJ2aWNlLmRlbHRhVGltZTtcblxuICAgICAgICAgIGlmKGRlbHRhID4gMClcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuLCAxMDAwICogZGVsdGEsIHRpbWUpOyAvLyBicmlkZ2Ugc2NoZWR1bGVyIGxvb2thaGVhZCB3aXRoIHRpbWVvdXRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBmdW4odGltZSk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICBzY2hlZHVsZXIuYWRkKGVuZ2luZSwgdGltZSk7IC8vIGFkZCB3aXRob3V0IGNoZWNrc1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSB0aW1lIGVuZ2luZSB0byB0aGUgcXVldWUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGVuZ2luZSAtIEVuZ2luZSB0byBzY2hlZHVsZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBUaGUgdGltZSBhdCB3aGljaCB0aGUgZnVuY3Rpb24gc2hvdWxkIGJlIGV4ZWN1dGVkLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtzeW5jaHJvbml6ZWQ9dHJ1ZV0gLSBEZWZpbmVzIHdoZXRoZXIgdGhlIGVuZ2luZSBzaG91bGQgYmUgc3luY2hyb25pemVkIG9yIG5vdC5cbiAgICpcbiAgICogQXR0ZW50aW9uOiBUaGUgYWN0dWFsIHN5bmNocm9uaXphdGlvbiBvZiB0aGUgc2NoZWR1bGVkIHRpbWUgZW5naW5lIGRlcGVuZHNcbiAgICogbm90IG9ubHkgb2YgdGhlIGAnc3luY2hyb25pemVkJ2Agb3B0aW9uLCBidXQgYWxzbyBvZiB0aGUgY29uZmlndXJhdGlvbiBvZlxuICAgKiB0aGUgc2NoZWR1bGVyIHNlcnZpY2UuIEhvd2V2ZXIsIHRvIGFzc3VyZSBhIHRoZSBkZXNpcmVkIHN5bmNocm9uaXphdGlvbixcbiAgICogdGhlIG9wdGlvbiBoYXMgdG8gYmUgcHJvcGVybHkgc3BlY2lmaWVkLiBXaXRob3V0IHNwZWNpZnlpbmcgdGhlIG9wdGlvbixcbiAgICogc3luY2hyb25pemVkIHNjaGVkdWxpbmcgd2lsbCBiZSB1c2VkIHdoZW4gYXZhaWxhYmxlLlxuICAgKi9cbiAgYWRkKGVuZ2luZSwgdGltZSwgc3luY2hyb25pemVkID0gISF0aGlzLl9zeW5jKSB7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gKHN5bmNocm9uaXplZCAmJiB0aGlzLl9zeW5jKSA/IHRoaXMuX3N5bmNlZFF1ZXVlIDogdGhpcy5fc2NoZWR1bGVyO1xuICAgIHNjaGVkdWxlci5hZGQoZW5naW5lLCB0aW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIGdpdmVuIGVuZ2luZSBmcm9tIHRoZSBxdWV1ZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZW5naW5lIC0gRW5naW5lIHRvIHJlbW92ZSBmcm9tIHRoZSBzY2hlZHVsZXIuXG4gICAqL1xuICByZW1vdmUoZW5naW5lKSB7XG4gICAgaWYgKHRoaXMuX3NjaGVkdWxlci5oYXMoZW5naW5lKSlcbiAgICAgIHRoaXMuX3NjaGVkdWxlci5yZW1vdmUoZW5naW5lKTtcbiAgICBlbHNlIGlmICh0aGlzLl9zeW5jZWRRdWV1ZSAmJiB0aGlzLl9zeW5jZWRRdWV1ZS5oYXMoZW5naW5lKSlcbiAgICAgIHRoaXMuX3N5bmNlZFF1ZXVlLnJlbW92ZShlbmdpbmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgc2NoZWR1bGVkIGZ1bmN0aW9ucyBhbmQgdGltZSBlbmdpbmVzIChzeW5jaHJvbml6ZWQgYW5kIG5vdCkgZnJvbSB0aGUgc2NoZWR1bGVyLlxuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgaWYodGhpcy5fc3luY2VkUXVldWUpXG4gICAgICB0aGlzLl9zeW5jZWRRdWV1ZS5jbGVhcigpO1xuXG4gICAgdGhpcy5fc2NoZWR1bGVyLmNsZWFyKCk7XG4gIH1cbn07XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNjaGVkdWxlcik7XG5cbmV4cG9ydCBkZWZhdWx0IFNjaGVkdWxlcjtcbiJdfQ==