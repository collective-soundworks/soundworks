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
 * While this service has no direct server counterpart, its dependency on the
 * [`sync`]{@link module:soundworks/client.Sync} service may require the existence
 * of a server. In addition, the service requires a device with `web-audio` ability.
 *
 * @param {Object} options
 * @param {Number} [options.period] - Period of the scheduler (defauts to current value).
 * @param {Number} [options.lookahead] - Lookahead of the scheduler (defauts to current value).
 * @param {Boolean} [options.sync = true] - Enable synchronized scheduling.
 *
 * @memberof module:soundworks/client
 * @see [`wavesAudio.Scheduler`]{@link http://wavesjs.github.io/audio/#audio-scheduler}
 * @see [`platform` service]{@link module:soundworks/client.Platform}
 * @see [`sync` service]{@link module:soundworks/client.Sync}
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
     * Remove all scheduled functions and time engines (synchronized or not) from the scheduler.
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
//# sourceMappingURL=data:application/json;base64,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QXdCLFVBQXhCLEVBQW9DLFNBQXBDOztrQkFFZSxTIiwiZmlsZSI6IlNjaGVkdWxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGF1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNsYXNzIF9TeW5jVGltZVNjaGVkdWxpbmdRdWV1ZSBleHRlbmRzIGF1ZGlvLlNjaGVkdWxpbmdRdWV1ZSB7XG4gIGNvbnN0cnVjdG9yKHN5bmMsIHNjaGVkdWxlcikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN5bmMgPSBzeW5jO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgIHRoaXMuc2NoZWR1bGVyLmFkZCh0aGlzLCBJbmZpbml0eSk7XG4gICAgdGhpcy5uZXh0U3luY1RpbWUgPSBJbmZpbml0eTtcblxuICAgIC8vIGNhbGwgdGhpcy5yZXN5bmMgaW4gc3luYyBjYWxsYmFja1xuICAgIHRoaXMucmVzeW5jID0gdGhpcy5yZXN5bmMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN5bmMuYWRkTGlzdGVuZXIodGhpcy5yZXN5bmMpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRUaW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5zeW5jLmdldFN5bmNUaW1lKHRoaXMuc2NoZWR1bGVyLmN1cnJlbnRUaW1lKTtcbiAgfVxuXG4gIGFkdmFuY2VUaW1lKGF1ZGlvVGltZSkge1xuICAgIGNvbnN0IHN5bmNUaW1lID0gdGhpcy5zeW5jLmdldFN5bmNUaW1lKGF1ZGlvVGltZSk7XG4gICAgY29uc3QgbmV4dFN5bmNUaW1lID0gc3VwZXIuYWR2YW5jZVRpbWUodGhpcy5uZXh0U3luY1RpbWUpO1xuICAgIGNvbnN0IG5leHRBdWRpb1RpbWUgPSB0aGlzLnN5bmMuZ2V0QXVkaW9UaW1lKG5leHRTeW5jVGltZSk7XG5cbiAgICB0aGlzLm5leHRTeW5jVGltZSA9IG5leHRTeW5jVGltZTtcblxuICAgIHJldHVybiBuZXh0QXVkaW9UaW1lO1xuICB9XG5cbiAgcmVzZXRUaW1lKHN5bmNUaW1lKSB7XG4gICAgaWYoc3luY1RpbWUgPT09IHVuZGVmaW5lZClcbiAgICAgIHN5bmNUaW1lID0gdGhpcy5zeW5jLmdldFN5bmNUaW1lKCk7XG5cbiAgICB0aGlzLm5leHRTeW5jVGltZSA9IHN5bmNUaW1lO1xuXG4gICAgY29uc3QgYXVkaW9UaW1lID0gdGhpcy5zeW5jLmdldEF1ZGlvVGltZShzeW5jVGltZSk7XG4gICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIGF1ZGlvVGltZSk7XG4gIH1cblxuICByZXN5bmMoKSB7XG4gICAgaWYgKHRoaXMubmV4dFN5bmNUaW1lICE9PSBJbmZpbml0eSkge1xuICAgICAgY29uc3QgbmV4dEF1ZGlvVGltZSA9IHRoaXMuc3luYy5nZXRBdWRpb1RpbWUodGhpcy5uZXh0U3luY1RpbWUpO1xuICAgICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIG5leHRBdWRpb1RpbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVRpbWUodGhpcywgSW5maW5pdHkpO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2NoZWR1bGVyJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdzY2hlZHVsZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBwcm92aWRlcyBhIHNjaGVkdWxlciBzeW5jaHJvbmlzZWQgYW1vbmcgYWxsIGNsaWVudCB1c2luZyB0aGVcbiAqIFtgc3luY2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TeW5jfSBzZXJ2aWNlLiBJdCBpbnRlcm5hbGx5IHVzZXMgdGhlXG4gKiBzY2hlZHVsZXIgcHJvdmlkZWQgYnkgdGhlIFtgd2F2ZXNqc2Bde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS93YXZlc2pzL2F1ZGlvfVxuICogbGlicmFyeS5cbiAqXG4gKiBXaGVuIHNldHRpbmcgdGhlIG9wdGlvbiBgJ3N5bmMnYCB0byBgJ2ZhbHNlJ2AsIHRoZSBzY2hlZHVsaW5nIGlzIGxvY2FsXG4gKiAod2l0aG91dCBzdW5jaHJvbml6YXRpb24gdG8gdGhlIG90aGVyIGNsaWVudHMpIGFuZCB0aGUgYCdzeW5jJ2Agc2VydmljZSBpc1xuICogbm90IHJlcXVpcmVkIChhdHRlbnRpb246IHNpbmNlIGl0cyBkZWZhdWx0IHZhbHVlIGlzIGAndHJ1ZSdgLCBhbGwgcmVxdWVzdHNcbiAqIG9mIHRoZSBgJ3NjaGVkdWxlcidgIHNlcnZpY2UgaW4gdGhlIGFwcGxpY2F0aW9uIGhhdmUgdG8gZXhwbGljaXRseSBzcGVjaWZ5XG4gKiB0aGUgYCdzeW5jJ2Agb3B0aW9uIGFzIGAnZmFsc2UnYCB0byBhc3N1cmUgdGhhdCB0aGUgYCdzeW5jJ2Agc2VydmljZSBpcyBub3RcbiAqIGVuYWJsZWQpLlxuICpcbiAqIFdoaWxlIHRoaXMgc2VydmljZSBoYXMgbm8gZGlyZWN0IHNlcnZlciBjb3VudGVycGFydCwgaXRzIGRlcGVuZGVuY3kgb24gdGhlXG4gKiBbYHN5bmNgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU3luY30gc2VydmljZSBtYXkgcmVxdWlyZSB0aGUgZXhpc3RlbmNlXG4gKiBvZiBhIHNlcnZlci4gSW4gYWRkaXRpb24sIHRoZSBzZXJ2aWNlIHJlcXVpcmVzIGEgZGV2aWNlIHdpdGggYHdlYi1hdWRpb2AgYWJpbGl0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnBlcmlvZF0gLSBQZXJpb2Qgb2YgdGhlIHNjaGVkdWxlciAoZGVmYXV0cyB0byBjdXJyZW50IHZhbHVlKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5sb29rYWhlYWRdIC0gTG9va2FoZWFkIG9mIHRoZSBzY2hlZHVsZXIgKGRlZmF1dHMgdG8gY3VycmVudCB2YWx1ZSkuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnN5bmMgPSB0cnVlXSAtIEVuYWJsZSBzeW5jaHJvbml6ZWQgc2NoZWR1bGluZy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAc2VlIFtgd2F2ZXNBdWRpby5TY2hlZHVsZXJgXXtAbGluayBodHRwOi8vd2F2ZXNqcy5naXRodWIuaW8vYXVkaW8vI2F1ZGlvLXNjaGVkdWxlcn1cbiAqIEBzZWUgW2BwbGF0Zm9ybWAgc2VydmljZV17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfVxuICogQHNlZSBbYHN5bmNgIHNlcnZpY2Vde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TeW5jfVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc2NoZWR1bGVyID0gdGhpcy5yZXF1aXJlKCdzY2hlZHVsZXInLCB7IHN5bmM6IHRydWUgfSk7XG4gKlxuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZFxuICogY29uc3QgbmV4dFN5bmNUaW1lID0gdGhpcy5zY2hlZHVsZXIuZ2V0U3luY1RpbWUoKSArIDI7XG4gKiB0aGlzLnNjaGVkdWxlci5hZGQodGltZUVuZ2luZSwgbmV4dFN5bmNUaW1lLCB0cnVlKTtcbiAqL1xuY2xhc3MgU2NoZWR1bGVyIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgdGhpcy5fcGxhdGZvcm0gPSB0aGlzLnJlcXVpcmUoJ3BsYXRmb3JtJywgeyBmZWF0dXJlczogJ3dlYi1hdWRpbycgfSk7XG5cbiAgICAvLyBpbml0aWFsaXplIHN5bmMgb3B0aW9uXG4gICAgdGhpcy5fc3luYyA9IG51bGw7XG4gICAgdGhpcy5fc3luY2VkUXVldWUgPSBudWxsO1xuXG4gICAgLy8gZ2V0IGF1ZGlvIHRpbWUgYmFzZWQgc2NoZWR1bGVyXG4gICAgdGhpcy5fc2NoZWR1bGVyID0gYXVkaW8uZ2V0U2NoZWR1bGVyKCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGxvb2thaGVhZDogdGhpcy5fc2NoZWR1bGVyLmxvb2thaGVhZCxcbiAgICAgIHBlcmlvZDogdGhpcy5fc2NoZWR1bGVyLnBlcmlvZCxcbiAgICAgIHN5bmM6IHVuZGVmaW5lZCxcbiAgICB9O1xuXG4gICAgLy8gY2FsbCBzdXBlci5jb25maWd1cmUgKGFjdGl2YXRlIHN5bmMgb3B0aW9uIG9ubHkgaWYgcmVxdWlyZWQpXG4gICAgc3VwZXIuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZSBkZWZhdWx0IGBjb25maWd1cmVgIHRvIGNvbmZpZ3VyZSB0aGUgc2NoZWR1bGVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGFwcGx5IHRvIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICAvLyBjaGVjayBhbmQgc2V0IHNjaGVkdWxlciBwZXJpb2Qgb3B0aW9uXG4gICAgaWYgKG9wdGlvbnMucGVyaW9kICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChvcHRpb25zLnBlcmlvZCA+IDAuMDEwKVxuICAgICAgICB0aGlzLl9zY2hlZHVsZXIucGVyaW9kID0gb3B0aW9ucy5wZXJpb2Q7XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzY2hlZHVsZXIgcGVyaW9kOiAke29wdGlvbnMucGVyaW9kfWApO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGFuZCBzZXQgc2NoZWR1bGVyIGxvb2thaGVhZCBvcHRpb25cbiAgICBpZiAob3B0aW9ucy5sb29rYWhlYWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKG9wdGlvbnMubG9va2FoZWFkID4gMC4wMTApXG4gICAgICAgIHRoaXMuX3NjaGVkdWxlci5sb29rYWhlYWQgPSBvcHRpb25zLmxvb2thaGVhZDtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNjaGVkdWxlciBsb29rYWhlYWQ6ICR7b3B0aW9ucy5sb29rYWhlYWR9YCk7XG4gICAgfVxuXG4gICAgLy8gc2V0IHN5bmMgb3B0aW9uXG4gICAgY29uc3Qgb3B0ID0gKG9wdGlvbnMuc3luYyAhPT0gdW5kZWZpbmVkKT8gb3B0aW9ucy5zeW5jOiB0cnVlOyAvLyBkZWZhdWx0IGlzIHRydWVcbiAgICBjb25zdCBzeW5jID0gKHN5bmMgPT09IHVuZGVmaW5lZCk/IG9wdDogKHN5bmMgfHwgb3B0KTsgLy8gdHJ1dGggd2lsbCBwcmV2YWlsXG5cbiAgICAvLyBlbmFibGUgc3luYyBhdCBmaXJzdCByZXF1ZXN0IHdpdGggb3B0aW9uIHNldCB0byB0cnVlXG4gICAgaWYoc3luYyAmJiAhdGhpcy5fc3luYykge1xuICAgICAgdGhpcy5fc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuICAgICAgdGhpcy5fc3luY2VkUXVldWUgPSBuZXcgX1N5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlKHRoaXMuX3N5bmMsIHRoaXMuX3NjaGVkdWxlcilcbiAgICB9XG5cbiAgICBvcHRpb25zLnN5bmMgPSBzeW5jO1xuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdXJyZW50IGF1ZGlvIHRpbWUgb2YgdGhlIHNjaGVkdWxlci5cbiAgICovXG4gIGdldCBhdWRpb1RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdXJyZW50IHN5bmMgdGltZSBvZiB0aGUgc2NoZWR1bGVyLlxuICAgKi9cbiAgZ2V0IHN5bmNUaW1lKCkge1xuICAgIGlmKHRoaXMuX3N5bmNlZFF1ZXVlKVxuICAgICAgcmV0dXJuIHRoaXMuX3N5bmNlZFF1ZXVlLmN1cnJlbnRUaW1lO1xuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaWZmZXJlbmNlIGJldHdlZW4gdGhlIHNjaGVkdWxlcidzIGxvZ2ljYWwgYXVkaW8gdGltZSBhbmQgdGhlIGBjdXJyZW50VGltZWBcbiAgICogb2YgdGhlIGF1ZGlvIGNvbnRleHQuXG4gICAqL1xuICBnZXQgZGVsdGFUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zY2hlZHVsZXIuY3VycmVudFRpbWUgLSBhdWRpby5hdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbCBhIGZ1bmN0aW9uIGF0IGEgZ2l2ZW4gdGltZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuIC0gRnVuY3Rpb24gdG8gYmUgZGVmZXJyZWQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIC0gVGhlIHRpbWUgYXQgd2hpY2ggdGhlIGZ1bmN0aW9uIHNob3VsZCBiZSBleGVjdXRlZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbc3luY2hyb25pemVkPXRydWVdIC0gRGVmaW5lcyB3aGV0aGVyIHRoZSBmdW5jdGlvbiBjYWxsIHNob3VsZCBiZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtsb29rYWhlYWQ9ZmFsc2VdIC0gRGVmaW5lcyB3aGV0aGVyIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgYW50aWNpcGF0ZWRcbiAgICogKGUuZy4gZm9yIGF1ZGlvIGV2ZW50cykgb3IgcHJlY2lzZWx5IGF0IHRoZSBnaXZlbiB0aW1lIChkZWZhdWx0KS5cbiAgICpcbiAgICogQXR0ZW50aW9uOiBUaGUgYWN0dWFsIHN5bmNocm9uaXphdGlvbiBvZiB0aGUgc2NoZWR1bGVkIGZ1bmN0aW9uIGRlcGVuZHMgbm90XG4gICAqIG9ubHkgb2YgdGhlIGAnc3luY2hyb25pemVkJ2Agb3B0aW9uLCBidXQgYWxzbyBvZiB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGVcbiAgICogc2NoZWR1bGVyIHNlcnZpY2UuIEhvd2V2ZXIsIHRvIGFzc3VyZSBhIHRoZSBkZXNpcmVkIHN5bmNocm9uaXphdGlvbiwgdGhlXG4gICAqIG9wdGlvbiBoYXMgdG8gYmUgcHJvcGVybHkgc3BlY2lmaWVkLiBXaXRob3V0IHNwZWNpZnlpbmcgdGhlIG9wdGlvbixcbiAgICogc3luY2hyb25pemVkIHNjaGVkdWxpbmcgd2lsbCBiZSB1c2VkIHdoZW4gYXZhaWxhYmxlLlxuICAgKi9cbiAgZGVmZXIoZnVuLCB0aW1lLCBzeW5jaHJvbml6ZWQgPSAhIXRoaXMuX3N5bmMsIGxvb2thaGVhZCA9IGZhbHNlKSB7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gKHN5bmNocm9uaXplZCAmJiB0aGlzLl9zeW5jKSA/IHRoaXMuX3N5bmNlZFF1ZXVlIDogdGhpcy5fc2NoZWR1bGVyO1xuICAgIGNvbnN0IHNjaGVkdWxlclNlcnZpY2UgPSB0aGlzO1xuICAgIGxldCBlbmdpbmU7XG5cbiAgICBpZihsb29rYWhlYWQpIHtcbiAgICAgIHNjaGVkdWxlci5kZWZlcihmdW4sIHRpbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmdpbmUgPSB7XG4gICAgICAgIGFkdmFuY2VUaW1lOiBmdW5jdGlvbih0aW1lKSB7XG4gICAgICAgICAgY29uc3QgZGVsdGEgPSBzY2hlZHVsZXJTZXJ2aWNlLmRlbHRhVGltZTtcblxuICAgICAgICAgIGlmKGRlbHRhID4gMClcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuLCAxMDAwICogZGVsdGEsIHRpbWUpOyAvLyBicmlkZ2Ugc2NoZWR1bGVyIGxvb2thaGVhZCB3aXRoIHRpbWVvdXRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBmdW4odGltZSk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICBzY2hlZHVsZXIuYWRkKGVuZ2luZSwgdGltZSk7IC8vIGFkZCB3aXRob3V0IGNoZWNrc1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSB0aW1lIGVuZ2luZSB0byB0aGUgcXVldWUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGVuZ2luZSAtIEVuZ2luZSB0byBzY2hlZHVsZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBUaGUgdGltZSBhdCB3aGljaCB0aGUgZnVuY3Rpb24gc2hvdWxkIGJlIGV4ZWN1dGVkLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtzeW5jaHJvbml6ZWQ9dHJ1ZV0gLSBEZWZpbmVzIHdoZXRoZXIgdGhlIGVuZ2luZSBzaG91bGQgYmUgc3luY2hyb25pemVkIG9yIG5vdC5cbiAgICpcbiAgICogQXR0ZW50aW9uOiBUaGUgYWN0dWFsIHN5bmNocm9uaXphdGlvbiBvZiB0aGUgc2NoZWR1bGVkIHRpbWUgZW5naW5lIGRlcGVuZHNcbiAgICogbm90IG9ubHkgb2YgdGhlIGAnc3luY2hyb25pemVkJ2Agb3B0aW9uLCBidXQgYWxzbyBvZiB0aGUgY29uZmlndXJhdGlvbiBvZlxuICAgKiB0aGUgc2NoZWR1bGVyIHNlcnZpY2UuIEhvd2V2ZXIsIHRvIGFzc3VyZSBhIHRoZSBkZXNpcmVkIHN5bmNocm9uaXphdGlvbixcbiAgICogdGhlIG9wdGlvbiBoYXMgdG8gYmUgcHJvcGVybHkgc3BlY2lmaWVkLiBXaXRob3V0IHNwZWNpZnlpbmcgdGhlIG9wdGlvbixcbiAgICogc3luY2hyb25pemVkIHNjaGVkdWxpbmcgd2lsbCBiZSB1c2VkIHdoZW4gYXZhaWxhYmxlLlxuICAgKi9cbiAgYWRkKGVuZ2luZSwgdGltZSwgc3luY2hyb25pemVkID0gISF0aGlzLl9zeW5jKSB7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gKHN5bmNocm9uaXplZCAmJiB0aGlzLl9zeW5jKSA/IHRoaXMuX3N5bmNlZFF1ZXVlIDogdGhpcy5fc2NoZWR1bGVyO1xuICAgIHNjaGVkdWxlci5hZGQoZW5naW5lLCB0aW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIGdpdmVuIGVuZ2luZSBmcm9tIHRoZSBxdWV1ZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZW5naW5lIC0gRW5naW5lIHRvIHJlbW92ZSBmcm9tIHRoZSBzY2hlZHVsZXIuXG4gICAqL1xuICByZW1vdmUoZW5naW5lKSB7XG4gICAgaWYgKHRoaXMuX3NjaGVkdWxlci5oYXMoZW5naW5lKSlcbiAgICAgIHRoaXMuX3NjaGVkdWxlci5yZW1vdmUoZW5naW5lKTtcbiAgICBlbHNlIGlmICh0aGlzLl9zeW5jZWRRdWV1ZSAmJiB0aGlzLl9zeW5jZWRRdWV1ZS5oYXMoZW5naW5lKSlcbiAgICAgIHRoaXMuX3N5bmNlZFF1ZXVlLnJlbW92ZShlbmdpbmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgc2NoZWR1bGVkIGZ1bmN0aW9ucyBhbmQgdGltZSBlbmdpbmVzIChzeW5jaHJvbml6ZWQgb3Igbm90KSBmcm9tIHRoZSBzY2hlZHVsZXIuXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICBpZih0aGlzLl9zeW5jZWRRdWV1ZSlcbiAgICAgIHRoaXMuX3N5bmNlZFF1ZXVlLmNsZWFyKCk7XG5cbiAgICB0aGlzLl9zY2hlZHVsZXIuY2xlYXIoKTtcbiAgfVxufTtcblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2NoZWR1bGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgU2NoZWR1bGVyO1xuIl19