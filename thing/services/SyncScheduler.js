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

var audioScheduler = audio.getScheduler(); /**
                                            * @todo - review
                                            * - use libpd current time
                                            */

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

    // init audio time based scheduler, sync service, and queue
    // this._platform = this.require('platform', { features: 'web-audio' });
    var _this2 = (0, _possibleConstructorReturn3.default)(this, (SyncScheduler.__proto__ || (0, _getPrototypeOf2.default)(SyncScheduler)).call(this, SERVICE_ID, false));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmNTY2hlZHVsZXIuanMiXSwibmFtZXMiOlsiYXVkaW8iLCJhdWRpb1NjaGVkdWxlciIsImdldFNjaGVkdWxlciIsIlN5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlIiwic3luYyIsInNjaGVkdWxlciIsImFkZCIsIkluZmluaXR5IiwibmV4dFN5bmNUaW1lIiwicmVzeW5jIiwiYmluZCIsImFkZExpc3RlbmVyIiwiYXVkaW9UaW1lIiwibmV4dEF1ZGlvVGltZSIsImdldEF1ZGlvVGltZSIsInN5bmNUaW1lIiwidW5kZWZpbmVkIiwiZ2V0U3luY1RpbWUiLCJtYXN0ZXIiLCJyZXNldEVuZ2luZVRpbWUiLCJjdXJyZW50VGltZSIsIlNjaGVkdWxpbmdRdWV1ZSIsIlNFUlZJQ0VfSUQiLCJTeW5jU2NoZWR1bGVyIiwiX3N5bmMiLCJyZXF1aXJlIiwiX3N5bmNlZFF1ZXVlIiwicmVhZHkiLCJmdW4iLCJ0aW1lIiwibG9va2FoZWFkIiwic2NoZWR1bGVyU2VydmljZSIsImVuZ2luZSIsImRlZmVyIiwiYWR2YW5jZVRpbWUiLCJkZWx0YSIsImRlbHRhVGltZSIsInNldFRpbWVvdXQiLCJyZW1vdmUiLCJjbGVhciIsImF1ZGlvQ29udGV4dCIsIlNlcnZpY2UiLCJzZXJ2aWNlTWFuYWdlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlBLEs7Ozs7OztBQUNaLElBQU1DLGlCQUFpQkQsTUFBTUUsWUFBTixFQUF2QixDLENBUEE7Ozs7O0lBU01DLHVCOzs7QUFDSixtQ0FBWUMsSUFBWixFQUFrQkMsU0FBbEIsRUFBNkI7QUFBQTs7QUFBQTs7QUFHM0IsVUFBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsVUFBS0MsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxVQUFLQSxTQUFMLENBQWVDLEdBQWYsUUFBeUJDLFFBQXpCO0FBQ0EsVUFBS0MsWUFBTCxHQUFvQkQsUUFBcEI7O0FB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LE1BQWQsRUFBc0JILElBQXRCLEVBWkssQ0FZd0I7QUFDOUI7QUFDRjs7QUFFRDs7Ozs7Ozs7O3dCQU1JRyxNLEVBQVFILEksRUFBTTtBQUNoQixXQUFLSCxZQUFMLENBQWtCcEIsR0FBbEIsQ0FBc0IwQixNQUF0QixFQUE4QkgsSUFBOUI7QUFDRDs7QUFFRDs7Ozs7Ozs7MkJBS09HLE0sRUFBUTtBQUNiLFdBQUtOLFlBQUwsQ0FBa0JZLE1BQWxCLENBQXlCTixNQUF6QjtBQUNEOztBQUVEOzs7Ozs7NEJBR1E7QUFDTixXQUFLTixZQUFMLENBQWtCYSxLQUFsQjtBQUNEOzs7d0JBM0dlO0FBQ2QsYUFBT3RDLGVBQWVtQixXQUF0QjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLZTtBQUNiLGFBQU8sS0FBS00sWUFBTCxDQUFrQk4sV0FBekI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS2tCO0FBQ2hCLGFBQU8sS0FBS00sWUFBTCxDQUFrQk4sV0FBekI7QUFDRDs7QUFFRDs7Ozs7Ozs7O3dCQU1nQjtBQUNkLGFBQU9uQixlQUFlbUIsV0FBZixHQUE2QnBCLE1BQU13QyxZQUFOLENBQW1CcEIsV0FBdkQ7QUFDRDs7O0VBdER5QnFCLGlCOztBQXNJNUJDLHlCQUFlQyxRQUFmLENBQXdCckIsVUFBeEIsRUFBb0NDLGFBQXBDOztrQkFFZUEsYSIsImZpbGUiOiJTeW5jU2NoZWR1bGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAdG9kbyAtIHJldmlld1xuICogLSB1c2UgbGlicGQgY3VycmVudCB0aW1lXG4gKi9cbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgKiBhcyBhdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5jb25zdCBhdWRpb1NjaGVkdWxlciA9IGF1ZGlvLmdldFNjaGVkdWxlcigpO1xuXG5jbGFzcyBTeW5jVGltZVNjaGVkdWxpbmdRdWV1ZSBleHRlbmRzIGF1ZGlvLlNjaGVkdWxpbmdRdWV1ZSB7XG4gIGNvbnN0cnVjdG9yKHN5bmMsIHNjaGVkdWxlcikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN5bmMgPSBzeW5jO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgIHRoaXMuc2NoZWR1bGVyLmFkZCh0aGlzLCBJbmZpbml0eSk7XG4gICAgdGhpcy5uZXh0U3luY1RpbWUgPSBJbmZpbml0eTtcblxuICAgIC8vIGNhbGwgdGhpcy5yZXN5bmMgaW4gc3luYyBjYWxsYmFja1xuICAgIHRoaXMucmVzeW5jID0gdGhpcy5yZXN5bmMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN5bmMuYWRkTGlzdGVuZXIodGhpcy5yZXN5bmMpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRUaW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5zeW5jLmdldFN5bmNUaW1lKHRoaXMuc2NoZWR1bGVyLmN1cnJlbnRUaW1lKTtcbiAgfVxuXG4gIGFkdmFuY2VUaW1lKGF1ZGlvVGltZSkge1xuICAgIGNvbnN0IG5leHRTeW5jVGltZSA9IHN1cGVyLmFkdmFuY2VUaW1lKHRoaXMubmV4dFN5bmNUaW1lKTtcbiAgICBjb25zdCBuZXh0QXVkaW9UaW1lID0gdGhpcy5zeW5jLmdldEF1ZGlvVGltZShuZXh0U3luY1RpbWUpO1xuXG4gICAgdGhpcy5uZXh0U3luY1RpbWUgPSBuZXh0U3luY1RpbWU7XG5cbiAgICByZXR1cm4gbmV4dEF1ZGlvVGltZTtcbiAgfVxuXG4gIHJlc2V0VGltZShzeW5jVGltZSkge1xuICAgIGlmIChzeW5jVGltZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcblxuICAgIHRoaXMubmV4dFN5bmNUaW1lID0gc3luY1RpbWU7XG5cbiAgICBjb25zdCBhdWRpb1RpbWUgPSB0aGlzLnN5bmMuZ2V0QXVkaW9UaW1lKHN5bmNUaW1lKTtcbiAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVRpbWUodGhpcywgYXVkaW9UaW1lKTtcbiAgfVxuXG4gIHJlc3luYygpIHtcbiAgICBpZiAodGhpcy5uZXh0U3luY1RpbWUgIT09IEluZmluaXR5KSB7XG4gICAgICBjb25zdCBuZXh0QXVkaW9UaW1lID0gdGhpcy5zeW5jLmdldEF1ZGlvVGltZSh0aGlzLm5leHRTeW5jVGltZSk7XG4gICAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVRpbWUodGhpcywgbmV4dEF1ZGlvVGltZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWFzdGVyLnJlc2V0RW5naW5lVGltZSh0aGlzLCBJbmZpbml0eSk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzeW5jLXNjaGVkdWxlcic7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnc3luYy1zY2hlZHVsZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoZSBgc3luYy1zY2hlZHVsZXJgIHByb3ZpZGVzIGEgc2NoZWR1bGVyIHN5bmNocm9uaXNlZCBhbW9uZyBhbGwgY2xpZW50IHVzaW5nIHRoZVxuICogW2BzeW5jYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlN5bmN9IHNlcnZpY2UuXG4gKlxuICogV2hpbGUgdGhpcyBzZXJ2aWNlIGhhcyBubyBkaXJlY3Qgc2VydmVyIGNvdW50ZXJwYXJ0LCBpdHMgZGVwZW5kZW5jeSBvbiB0aGVcbiAqIFtgc3luY2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TeW5jfSBzZXJ2aWNlIHdoaWNoIHJlcXVpcmVzIHRoZVxuICogZXhpc3RlbmNlIG9mIGEgc2VydmVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucGVyaW9kXSAtIFBlcmlvZCBvZiB0aGUgc2NoZWR1bGVyIChkZWZhdXRzIHRvXG4gKiAgY3VycmVudCB2YWx1ZSkuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubG9va2FoZWFkXSAtIExvb2thaGVhZCBvZiB0aGUgc2NoZWR1bGVyIChkZWZhdXRzXG4gKiAgdG8gY3VycmVudCB2YWx1ZSkuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQHNlZSBbYHdhdmVzQXVkaW8uU2NoZWR1bGVyYF17QGxpbmsgaHR0cDovL3dhdmVzanMuZ2l0aHViLmlvL2F1ZGlvLyNhdWRpby1zY2hlZHVsZXJ9XG4gKiBAc2VlIFtgcGxhdGZvcm1gIHNlcnZpY2Vde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAqIEBzZWUgW2BzeW5jYCBzZXJ2aWNlXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU3luY31cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnN5bmNTY2hlZHVsZXIgPSB0aGlzLnJlcXVpcmUoJ3NjaGVkdWxlcicpO1xuICpcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWRcbiAqIGNvbnN0IG5leHRTeW5jVGltZSA9IHRoaXMuc3luY1NjaGVkdWxlci5jdXJyZW50ICsgMjtcbiAqIHRoaXMuc3luY1NjaGVkdWxlci5hZGQodGltZUVuZ2luZSwgbmV4dFN5bmNUaW1lKTtcbiAqL1xuY2xhc3MgU3luY1NjaGVkdWxlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICAvLyBpbml0IGF1ZGlvIHRpbWUgYmFzZWQgc2NoZWR1bGVyLCBzeW5jIHNlcnZpY2UsIGFuZCBxdWV1ZVxuICAgIC8vIHRoaXMuX3BsYXRmb3JtID0gdGhpcy5yZXF1aXJlKCdwbGF0Zm9ybScsIHsgZmVhdHVyZXM6ICd3ZWItYXVkaW8nIH0pO1xuICAgIHRoaXMuX3N5bmMgPSB0aGlzLnJlcXVpcmUoJ3N5bmMnKTtcbiAgICB0aGlzLl9zeW5jZWRRdWV1ZSA9IG51bGw7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuX3N5bmNlZFF1ZXVlID0gbmV3IFN5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlKHRoaXMuX3N5bmMsIGF1ZGlvU2NoZWR1bGVyKTtcbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCBhdWRpbyB0aW1lIG9mIHRoZSBzY2hlZHVsZXIuXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGF1ZGlvVGltZSgpIHtcbiAgICByZXR1cm4gYXVkaW9TY2hlZHVsZXIuY3VycmVudFRpbWU7XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCBzeW5jIHRpbWUgb2YgdGhlIHNjaGVkdWxlci5cbiAgICogQGluc3RhbmNlXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3luY1RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmNlZFF1ZXVlLmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgc3luYyB0aW1lIG9mIHRoZSBzY2hlZHVsZXIgKGFsaWFzIGB0aGlzLnN5bmNUaW1lYCkuXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGN1cnJlbnRUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jZWRRdWV1ZS5jdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaWZmZXJlbmNlIGJldHdlZW4gdGhlIHNjaGVkdWxlcidzIGxvZ2ljYWwgYXVkaW8gdGltZSBhbmQgdGhlIGBjdXJyZW50VGltZWBcbiAgICogb2YgdGhlIGF1ZGlvIGNvbnRleHQuXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGRlbHRhVGltZSgpIHtcbiAgICByZXR1cm4gYXVkaW9TY2hlZHVsZXIuY3VycmVudFRpbWUgLSBhdWRpby5hdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHN5bmMgdGltZSBjb3JyZXNwb25kaW5nIHRvIGdpdmVuIGF1ZGlvIHRpbWUuXG4gICAqXG4gICAqIEBwYXJhbSAge051bWJlcn0gYXVkaW9UaW1lIC0gYXVkaW8gdGltZS5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIHN5bmMgdGltZSBjb3JyZXNwb25kaW5nIHRvIGdpdmVuIGF1ZGlvIHRpbWUuXG4gICAqL1xuICBnZXRTeW5jVGltZUF0QXVkaW9UaW1lKGF1ZGlvVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldFN5bmNUaW1lKGF1ZGlvVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGF1ZGlvIHRpbWUgY29ycmVzcG9uZGluZyB0byBnaXZlbiBzeW5jIHRpbWUuXG4gICAqXG4gICAqIEBwYXJhbSAge051bWJlcn0gc3luY1RpbWUgLSBzeW5jIHRpbWUuXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBhdWRpbyB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gZ2l2ZW4gc3luYyB0aW1lLlxuICAgKi9cbiAgZ2V0QXVkaW9UaW1lQXRTeW5jVGltZShzeW5jVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldEF1ZGlvVGltZShzeW5jVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbCBhIGZ1bmN0aW9uIGF0IGEgZ2l2ZW4gdGltZS5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuIC0gRnVuY3Rpb24gdG8gYmUgZGVmZXJyZWQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIC0gVGhlIHRpbWUgYXQgd2hpY2ggdGhlIGZ1bmN0aW9uIHNob3VsZCBiZSBleGVjdXRlZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbbG9va2FoZWFkPWZhbHNlXSAtIERlZmluZXMgd2hldGhlciB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkXG4gICAqICBhbnRpY2lwYXRlZCAoZS5nLiBmb3IgYXVkaW8gZXZlbnRzKSBvciBwcmVjaXNlbHkgYXQgdGhlIGdpdmVuIHRpbWUgKGRlZmF1bHQpLlxuICAgKi9cbiAgZGVmZXIoZnVuLCB0aW1lLCBsb29rYWhlYWQgPSBmYWxzZSkge1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHRoaXMuX3N5bmNlZFF1ZXVlO1xuICAgIGNvbnN0IHNjaGVkdWxlclNlcnZpY2UgPSB0aGlzO1xuICAgIGxldCBlbmdpbmU7XG5cbiAgICBpZihsb29rYWhlYWQpIHtcbiAgICAgIHNjaGVkdWxlci5kZWZlcihmdW4sIHRpbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmdpbmUgPSB7XG4gICAgICAgIGFkdmFuY2VUaW1lOiBmdW5jdGlvbih0aW1lKSB7XG4gICAgICAgICAgY29uc3QgZGVsdGEgPSBzY2hlZHVsZXJTZXJ2aWNlLmRlbHRhVGltZTtcblxuICAgICAgICAgIGlmKGRlbHRhID4gMClcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuLCAxMDAwICogZGVsdGEsIHRpbWUpOyAvLyBicmlkZ2Ugc2NoZWR1bGVyIGxvb2thaGVhZCB3aXRoIHRpbWVvdXRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBmdW4odGltZSk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICBzY2hlZHVsZXIuYWRkKGVuZ2luZSwgdGltZSk7IC8vIGFkZCB3aXRob3V0IGNoZWNrc1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSB0aW1lIGVuZ2luZSB0byB0aGUgcXVldWUuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGVuZ2luZSAtIEVuZ2luZSB0byBzY2hlZHVsZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBUaGUgdGltZSBhdCB3aGljaCB0aGUgZnVuY3Rpb24gc2hvdWxkIGJlIGV4ZWN1dGVkLlxuICAgKi9cbiAgYWRkKGVuZ2luZSwgdGltZSkge1xuICAgIHRoaXMuX3N5bmNlZFF1ZXVlLmFkZChlbmdpbmUsIHRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZ2l2ZW4gZW5naW5lIGZyb20gdGhlIHF1ZXVlLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBlbmdpbmUgLSBFbmdpbmUgdG8gcmVtb3ZlIGZyb20gdGhlIHNjaGVkdWxlci5cbiAgICovXG4gIHJlbW92ZShlbmdpbmUpIHtcbiAgICB0aGlzLl9zeW5jZWRRdWV1ZS5yZW1vdmUoZW5naW5lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIHNjaGVkdWxlZCBmdW5jdGlvbnMgYW5kIHRpbWUgZW5naW5lcyBmcm9tIHRoZSBzY2hlZHVsZXIuXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLl9zeW5jZWRRdWV1ZS5jbGVhcigpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFN5bmNTY2hlZHVsZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBTeW5jU2NoZWR1bGVyO1xuIl19