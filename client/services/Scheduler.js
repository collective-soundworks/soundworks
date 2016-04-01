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
      var nextSyncTime = (0, _get3.default)((0, _getPrototypeOf2.default)(_SyncTimeSchedulingQueue.prototype), 'advanceTime', this).call(this, syncTime);
      var nextAudioTime = this.sync.getAudioTime(nextSyncTime);

      this.nextSyncTime = nextSyncTime;
      this.nextAudioTime = nextAudioTime; // for resync testing

      return nextAudioTime;
    }
  }, {
    key: 'resetTime',
    value: function resetTime(syncTime) {
      var audioTime = typeof syncTime !== 'undefined' ? this.sync.getAudioTime(syncTime) : undefined;

      this.nextSyncTime = syncTime;
      this.nextAudioTime = audioTime;

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
 * While this service has no direct server counterpart, it's dependency to the
 * [`sync`]{@link module:soundworks/client.Sync} service requires the existance
 * of a server. Also, the service requires a device with `WebAudio` ability.
 *
 * @param {Object} options
 * @param {Number} options.period - Period of the scheduler.
 * @param {Number} options.lookahead - Lookahead of the scheduler.
 *
 * @memberof module:soundworks/client
 * @see [`wavesAudio.Scheduler`]{@link http://wavesjs.github.io/audio/#audio-scheduler}
 * @see [`sync service`]{@link module:soundworks/client.Sync}
 *
 * @example
 * // inside the experience constructor
 * this.scheduler = this.require('scheduler');
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

    _this2._sync = _this2.require('sync');
    _this2._platform = _this2.require('platform', { features: 'web-audio' });

    _this2._scheduler = audio.getScheduler();
    _this2._syncedQueue = new _SyncTimeSchedulingQueue(_this2._sync, _this2._scheduler);

    var defaults = {
      lookahead: _this2._scheduler.lookahead,
      period: _this2._scheduler.period
    };

    _this2.configure(defaults);
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
      if (options.period !== undefined) {
        if (options.period > 0.010) this._scheduler.period = options.period;else throw new Error('Invalid scheduler period: ' + options.period);
      }

      if (options.lookahead !== undefined) {
        if (options.lookahead > 0.010) this._scheduler.lookahead = options.lookahead;else throw new Error('Invalid scheduler lookahead: ' + options.lookahead);
      }

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
     */
    value: function defer(fun, time) {
      var synchronized = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
      var lookahead = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      var scheduler = synchronized ? this._syncedQueue : this._scheduler;
      var schedulerService = this;
      var engine = void 0;

      if (lookahead) {
        scheduler.defer(fun, time);
      } else {
        engine = {
          advanceTime: function advanceTime(time) {
            var delta = schedulerService.deltaTime;

            console.log("delta:", delta);

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
     * @param {Boolean} [synchronized=true] - Defines whether the engine should be
     *  synchronized or not.
     * @see [`wavesAudio.TimeEngine`]{@link http://wavesjs.github.io/audio/#audio-time-engine}
     */

  }, {
    key: 'add',
    value: function add(engine, time) {
      var synchronized = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      var scheduler = synchronized ? this._syncedQueue : this._scheduler;
      scheduler.add(engine, time);
    }

    /**
     * Remove the given engine from the queue.
     * @param {Function} engine - Engine to remove from the queue.
     * @see [`wavesAudio.TimeEngine`]{@link http://wavesjs.github.io/audio/#audio-time-engine}
     */

  }, {
    key: 'remove',
    value: function remove(engine) {
      if (this._scheduler.has(engine)) this._scheduler.remove(engine);else if (this._syncedQueue.has(engine)) this._syncedQueue.remove(engine);
    }

    /**
     * Remove all engine from the scheduling queues (synchronized and not synchronized).
     */

  }, {
    key: 'clear',
    value: function clear() {
      this._syncedQueue.clear();
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
      return this._syncedQueue.currentTime;
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
//# sourceMappingURL=data:application/json;base64,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QVIsRUFDRCxXQUFXLEdBQVgsRUFBZ0IsT0FBTyxLQUFQLEVBQWMsSUFBOUI7QUFERixpQkFHRSxJQUFJLElBQUosRUFIRjtXQUxXO1NBRGYsQ0FESzs7QUFjTCxrQkFBVSxHQUFWLENBQWMsTUFBZCxFQUFzQixJQUF0QjtBQWRLLE9BRlA7Ozs7Ozs7Ozs7Ozs7O3dCQTRCRSxRQUFRLE1BQTJCO1VBQXJCLHFFQUFlLG9CQUFNOztBQUNyQyxVQUFNLFlBQVksZUFBZSxLQUFLLFlBQUwsR0FBb0IsS0FBSyxVQUFMLENBRGhCO0FBRXJDLGdCQUFVLEdBQVYsQ0FBYyxNQUFkLEVBQXNCLElBQXRCLEVBRnFDOzs7Ozs7Ozs7OzsyQkFVaEMsUUFBUTtBQUNiLFVBQUksS0FBSyxVQUFMLENBQWdCLEdBQWhCLENBQW9CLE1BQXBCLENBQUosRUFDRSxLQUFLLFVBQUwsQ0FBZ0IsTUFBaEIsQ0FBdUIsTUFBdkIsRUFERixLQUVLLElBQUksS0FBSyxZQUFMLENBQWtCLEdBQWxCLENBQXNCLE1BQXRCLENBQUosRUFDSCxLQUFLLFlBQUwsQ0FBa0IsTUFBbEIsQ0FBeUIsTUFBekIsRUFERzs7Ozs7Ozs7OzRCQU9DO0FBQ04sV0FBSyxZQUFMLENBQWtCLEtBQWxCLEdBRE07QUFFTixXQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsR0FGTTs7Ozt3QkFoRlE7QUFDZCxhQUFPLEtBQUssVUFBTCxDQUFnQixXQUFoQixDQURPOzs7Ozs7Ozs7d0JBT0Q7QUFDYixhQUFPLEtBQUssWUFBTCxDQUFrQixXQUFsQixDQURNOzs7Ozs7Ozs7O3dCQVFDO0FBQ2QsYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsV0FBaEIsR0FBOEIsTUFBTSxZQUFOLENBQW1CLFdBQW5CLENBRHZCOzs7U0F0RVo7OztBQTJJTDs7QUFFRCx5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLFNBQXBDOztrQkFFZSIsImZpbGUiOiJTY2hlZHVsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jbGFzcyBfU3luY1RpbWVTY2hlZHVsaW5nUXVldWUgZXh0ZW5kcyBhdWRpby5TY2hlZHVsaW5nUXVldWUge1xuICBjb25zdHJ1Y3RvcihzeW5jLCBzY2hlZHVsZXIpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zeW5jID0gc3luYztcbiAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICB0aGlzLnNjaGVkdWxlci5hZGQodGhpcywgSW5maW5pdHkpO1xuICAgIHRoaXMubmV4dFN5bmNUaW1lID0gSW5maW5pdHk7XG5cbiAgICAvLyBjYWxsIHRoaXMucmVzeW5jIGluIHN5bmMgY2FsbGJhY2tcbiAgICB0aGlzLnJlc3luYyA9IHRoaXMucmVzeW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zeW5jLmFkZExpc3RlbmVyKHRoaXMucmVzeW5jKTtcbiAgfVxuXG4gIGdldCBjdXJyZW50VGltZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3luYy5nZXRTeW5jVGltZSh0aGlzLnNjaGVkdWxlci5jdXJyZW50VGltZSk7XG4gIH1cblxuICBhZHZhbmNlVGltZShhdWRpb1RpbWUpIHtcbiAgICBjb25zdCBzeW5jVGltZSA9IHRoaXMuc3luYy5nZXRTeW5jVGltZShhdWRpb1RpbWUpO1xuICAgIGNvbnN0IG5leHRTeW5jVGltZSA9IHN1cGVyLmFkdmFuY2VUaW1lKHN5bmNUaW1lKTtcbiAgICBjb25zdCBuZXh0QXVkaW9UaW1lID0gdGhpcy5zeW5jLmdldEF1ZGlvVGltZShuZXh0U3luY1RpbWUpO1xuXG4gICAgdGhpcy5uZXh0U3luY1RpbWUgPSBuZXh0U3luY1RpbWU7XG4gICAgdGhpcy5uZXh0QXVkaW9UaW1lID0gbmV4dEF1ZGlvVGltZTsgLy8gZm9yIHJlc3luYyB0ZXN0aW5nXG5cbiAgICByZXR1cm4gbmV4dEF1ZGlvVGltZTtcbiAgfVxuXG4gIHJlc2V0VGltZShzeW5jVGltZSkge1xuICAgIGNvbnN0IGF1ZGlvVGltZSA9ICh0eXBlb2Ygc3luY1RpbWUgIT09ICd1bmRlZmluZWQnKSA/XG4gICAgICB0aGlzLnN5bmMuZ2V0QXVkaW9UaW1lKHN5bmNUaW1lKSA6IHVuZGVmaW5lZDtcblxuICAgIHRoaXMubmV4dFN5bmNUaW1lID0gc3luY1RpbWU7XG4gICAgdGhpcy5uZXh0QXVkaW9UaW1lID0gYXVkaW9UaW1lO1xuXG4gICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIGF1ZGlvVGltZSk7XG4gIH1cblxuICByZXN5bmMoKSB7XG4gICAgaWYgKHRoaXMubmV4dFN5bmNUaW1lICE9PSBJbmZpbml0eSkge1xuICAgICAgY29uc3QgbmV4dEF1ZGlvVGltZSA9IHRoaXMuc3luYy5nZXRBdWRpb1RpbWUodGhpcy5uZXh0U3luY1RpbWUpO1xuICAgICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIG5leHRBdWRpb1RpbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVRpbWUodGhpcywgSW5maW5pdHkpO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2NoZWR1bGVyJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdzY2hlZHVsZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBwcm92aWRlcyBhIHNjaGVkdWxlciBzeW5jaHJvbmlzZWQgYW1vbmcgYWxsIGNsaWVudCB1c2luZyB0aGVcbiAqIFtgc3luY2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TeW5jfSBzZXJ2aWNlLiBJdCBpbnRlcm5hbGx5IHVzZXMgdGhlXG4gKiBzY2hlZHVsZXIgcHJvdmlkZWQgYnkgdGhlIFtgd2F2ZXNqc2Bde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS93YXZlc2pzL2F1ZGlvfVxuICogbGlicmFyeS5cbiAqXG4gKiBXaGlsZSB0aGlzIHNlcnZpY2UgaGFzIG5vIGRpcmVjdCBzZXJ2ZXIgY291bnRlcnBhcnQsIGl0J3MgZGVwZW5kZW5jeSB0byB0aGVcbiAqIFtgc3luY2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TeW5jfSBzZXJ2aWNlIHJlcXVpcmVzIHRoZSBleGlzdGFuY2VcbiAqIG9mIGEgc2VydmVyLiBBbHNvLCB0aGUgc2VydmljZSByZXF1aXJlcyBhIGRldmljZSB3aXRoIGBXZWJBdWRpb2AgYWJpbGl0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMucGVyaW9kIC0gUGVyaW9kIG9mIHRoZSBzY2hlZHVsZXIuXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5sb29rYWhlYWQgLSBMb29rYWhlYWQgb2YgdGhlIHNjaGVkdWxlci5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAc2VlIFtgd2F2ZXNBdWRpby5TY2hlZHVsZXJgXXtAbGluayBodHRwOi8vd2F2ZXNqcy5naXRodWIuaW8vYXVkaW8vI2F1ZGlvLXNjaGVkdWxlcn1cbiAqIEBzZWUgW2BzeW5jIHNlcnZpY2VgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU3luY31cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnNjaGVkdWxlciA9IHRoaXMucmVxdWlyZSgnc2NoZWR1bGVyJyk7XG4gKiAvLyB3aGVuIHRoZSBleHBlcmllbmNlIGhhcyBzdGFydGVkXG4gKiBjb25zdCBuZXh0U3luY1RpbWUgPSB0aGlzLnNjaGVkdWxlci5nZXRTeW5jVGltZSgpICsgMjtcbiAqIHRoaXMuc2NoZWR1bGVyLmFkZCh0aW1lRW5naW5lLCBuZXh0U3luY1RpbWUsIHRydWUpO1xuICovXG5jbGFzcyBTY2hlZHVsZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICB0aGlzLl9zeW5jID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG4gICAgdGhpcy5fcGxhdGZvcm0gPSB0aGlzLnJlcXVpcmUoJ3BsYXRmb3JtJywgeyBmZWF0dXJlczogJ3dlYi1hdWRpbycgfSk7XG5cbiAgICB0aGlzLl9zY2hlZHVsZXIgPSBhdWRpby5nZXRTY2hlZHVsZXIoKTtcbiAgICB0aGlzLl9zeW5jZWRRdWV1ZSA9IG5ldyBfU3luY1RpbWVTY2hlZHVsaW5nUXVldWUodGhpcy5fc3luYywgdGhpcy5fc2NoZWR1bGVyKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgbG9va2FoZWFkOiB0aGlzLl9zY2hlZHVsZXIubG9va2FoZWFkLFxuICAgICAgcGVyaW9kOiB0aGlzLl9zY2hlZHVsZXIucGVyaW9kLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGUgZGVmYXVsdCBgY29uZmlndXJlYCB0byBjb25maWd1cmUgdGhlIHNjaGVkdWxlci5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBhcHBseSB0byB0aGUgc2VydmljZS5cbiAgICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMucGVyaW9kICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChvcHRpb25zLnBlcmlvZCA+IDAuMDEwKVxuICAgICAgICB0aGlzLl9zY2hlZHVsZXIucGVyaW9kID0gb3B0aW9ucy5wZXJpb2Q7XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzY2hlZHVsZXIgcGVyaW9kOiAke29wdGlvbnMucGVyaW9kfWApO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmxvb2thaGVhZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAob3B0aW9ucy5sb29rYWhlYWQgPiAwLjAxMClcbiAgICAgICAgdGhpcy5fc2NoZWR1bGVyLmxvb2thaGVhZCA9IG9wdGlvbnMubG9va2FoZWFkO1xuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc2NoZWR1bGVyIGxvb2thaGVhZDogJHtvcHRpb25zLmxvb2thaGVhZH1gKTtcbiAgICB9XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCBhdWRpbyB0aW1lIG9mIHRoZSBzY2hlZHVsZXIuXG4gICAqL1xuICBnZXQgYXVkaW9UaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zY2hlZHVsZXIuY3VycmVudFRpbWU7XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCBzeW5jIHRpbWUgb2YgdGhlIHNjaGVkdWxlci5cbiAgICovXG4gIGdldCBzeW5jVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luY2VkUXVldWUuY3VycmVudFRpbWU7XG4gIH1cblxuICAvKipcbiAgICogRGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBzY2hlZHVsZXIncyBsb2dpY2FsIGF1ZGlvIHRpbWUgYW5kIHRoZSBgY3VycmVudFRpbWVgXG4gICAqIG9mIHRoZSBhdWRpbyBjb250ZXh0LlxuICAgKi9cbiAgZ2V0IGRlbHRhVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2NoZWR1bGVyLmN1cnJlbnRUaW1lIC0gYXVkaW8uYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGwgYSBmdW5jdGlvbiBhdCBhIGdpdmVuIHRpbWUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1biAtIEZ1bmN0aW9uIHRvIGJlIGRlZmVycmVkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIFRoZSB0aW1lIGF0IHdoaWNoIHRoZSBmdW5jdGlvbiBzaG91bGQgYmUgZXhlY3V0ZWQuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3N5bmNocm9uaXplZD10cnVlXSAtIERlZmluZXMgd2hldGhlciB0aGUgZnVuY3Rpb24gY2FsbCBzaG91bGQgYmVcbiAgICogQHBhcmFtIHtCb29sZWFufSBbbG9va2FoZWFkPWZhbHNlXSAtIERlZmluZXMgd2hldGhlciB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkIGFudGljaXBhdGVkXG4gICAqIChlLmcuIGZvciBhdWRpbyBldmVudHMpIG9yIHByZWNpc2VseSBhdCB0aGUgZ2l2ZW4gdGltZSAoZGVmYXVsdCkuXG4gICAqL1xuICBkZWZlcihmdW4sIHRpbWUsIHN5bmNocm9uaXplZCA9IHRydWUsIGxvb2thaGVhZCA9IGZhbHNlKSB7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gc3luY2hyb25pemVkID8gdGhpcy5fc3luY2VkUXVldWUgOiB0aGlzLl9zY2hlZHVsZXI7XG4gICAgY29uc3Qgc2NoZWR1bGVyU2VydmljZSA9IHRoaXM7XG4gICAgbGV0IGVuZ2luZTtcblxuICAgIGlmKGxvb2thaGVhZCkge1xuICAgICAgc2NoZWR1bGVyLmRlZmVyKGZ1biwgdGltZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVuZ2luZSA9IHtcbiAgICAgICAgYWR2YW5jZVRpbWU6IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICAgICAgICBjb25zdCBkZWx0YSA9IHNjaGVkdWxlclNlcnZpY2UuZGVsdGFUaW1lO1xuXG4gICAgICAgICAgY29uc29sZS5sb2coXCJkZWx0YTpcIiwgZGVsdGEpO1xuXG4gICAgICAgICAgaWYoZGVsdGEgPiAwKVxuICAgICAgICAgICAgc2V0VGltZW91dChmdW4sIDEwMDAgKiBkZWx0YSwgdGltZSk7IC8vIGJyaWRnZSBzY2hlZHVsZXIgbG9va2FoZWFkIHdpdGggdGltZW91dFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZ1bih0aW1lKTtcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIHNjaGVkdWxlci5hZGQoZW5naW5lLCB0aW1lKTsgLy8gYWRkIHdpdGhvdXQgY2hlY2tzXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHRpbWUgZW5naW5lIHRvIHRoZSBxdWV1ZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZW5naW5lIC0gRW5naW5lIHRvIHNjaGVkdWxlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIFRoZSB0aW1lIGF0IHdoaWNoIHRoZSBmdW5jdGlvbiBzaG91bGQgYmUgZXhlY3V0ZWQuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3N5bmNocm9uaXplZD10cnVlXSAtIERlZmluZXMgd2hldGhlciB0aGUgZW5naW5lIHNob3VsZCBiZVxuICAgKiAgc3luY2hyb25pemVkIG9yIG5vdC5cbiAgICogQHNlZSBbYHdhdmVzQXVkaW8uVGltZUVuZ2luZWBde0BsaW5rIGh0dHA6Ly93YXZlc2pzLmdpdGh1Yi5pby9hdWRpby8jYXVkaW8tdGltZS1lbmdpbmV9XG4gICAqL1xuICBhZGQoZW5naW5lLCB0aW1lLCBzeW5jaHJvbml6ZWQgPSB0cnVlKSB7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gc3luY2hyb25pemVkID8gdGhpcy5fc3luY2VkUXVldWUgOiB0aGlzLl9zY2hlZHVsZXI7XG4gICAgc2NoZWR1bGVyLmFkZChlbmdpbmUsIHRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZ2l2ZW4gZW5naW5lIGZyb20gdGhlIHF1ZXVlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBlbmdpbmUgLSBFbmdpbmUgdG8gcmVtb3ZlIGZyb20gdGhlIHF1ZXVlLlxuICAgKiBAc2VlIFtgd2F2ZXNBdWRpby5UaW1lRW5naW5lYF17QGxpbmsgaHR0cDovL3dhdmVzanMuZ2l0aHViLmlvL2F1ZGlvLyNhdWRpby10aW1lLWVuZ2luZX1cbiAgICovXG4gIHJlbW92ZShlbmdpbmUpIHtcbiAgICBpZiAodGhpcy5fc2NoZWR1bGVyLmhhcyhlbmdpbmUpKVxuICAgICAgdGhpcy5fc2NoZWR1bGVyLnJlbW92ZShlbmdpbmUpO1xuICAgIGVsc2UgaWYgKHRoaXMuX3N5bmNlZFF1ZXVlLmhhcyhlbmdpbmUpKVxuICAgICAgdGhpcy5fc3luY2VkUXVldWUucmVtb3ZlKGVuZ2luZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBlbmdpbmUgZnJvbSB0aGUgc2NoZWR1bGluZyBxdWV1ZXMgKHN5bmNocm9uaXplZCBhbmQgbm90IHN5bmNocm9uaXplZCkuXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLl9zeW5jZWRRdWV1ZS5jbGVhcigpO1xuICAgIHRoaXMuX3NjaGVkdWxlci5jbGVhcigpO1xuICB9XG59O1xuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTY2hlZHVsZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBTY2hlZHVsZXI7XG4iXX0=