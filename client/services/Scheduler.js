'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wavesAudio = require('waves-audio');

var _wavesAudio2 = _interopRequireDefault(_wavesAudio);

var _coreService = require('../core/Service');

var _coreService2 = _interopRequireDefault(_coreService);

var _coreServiceManager = require('../core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

var _SyncTimeSchedulingQueue = (function (_audio$SchedulingQueue) {
  _inherits(_SyncTimeSchedulingQueue, _audio$SchedulingQueue);

  function _SyncTimeSchedulingQueue(sync, scheduler) {
    _classCallCheck(this, _SyncTimeSchedulingQueue);

    _get(Object.getPrototypeOf(_SyncTimeSchedulingQueue.prototype), 'constructor', this).call(this);

    this.sync = sync;
    this.scheduler = scheduler;
    this.scheduler.add(this, Infinity);
    this.nextSyncTime = Infinity;

    // call this.resync in sync callback
    this.resync = this.resync.bind(this);
    this.sync.addListener(this.resync);
  }

  _createClass(_SyncTimeSchedulingQueue, [{
    key: 'advanceTime',
    value: function advanceTime(localTime) {
      // console.log('advanceTime', localTime);
      var syncTime = this.sync.getSyncTime(localTime);
      var nextSyncTime = _get(Object.getPrototypeOf(_SyncTimeSchedulingQueue.prototype), 'advanceTime', this).call(this, syncTime);
      var nextLocalTime = this.sync.getLocalTime(nextSyncTime);

      this.nextSyncTime = nextSyncTime;
      this.nextLocalTime = nextLocalTime; // for resync testing

      return nextLocalTime;
    }
  }, {
    key: 'resetTime',
    value: function resetTime(syncTime) {
      var localTime = typeof syncTime !== 'undefined' ? this.sync.getLocalTime(syncTime) : undefined;

      this.nextSyncTime = syncTime;
      this.nextLocalTime = localTime;

      this.master.resetEngineTime(this, localTime);
    }
  }, {
    key: 'resync',
    value: function resync() {
      if (this.nextSyncTime !== Infinity) {
        var nextLocalTime = this.sync.getLocalTime(this.nextSyncTime);
        this.master.resetEngineTime(this, nextLocalTime);
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
})(_wavesAudio2['default'].SchedulingQueue);

var SERVICE_ID = 'service:scheduler';

var Scheduler = (function (_Service) {
  _inherits(Scheduler, _Service);

  function Scheduler() {
    _classCallCheck(this, Scheduler);

    _get(Object.getPrototypeOf(Scheduler.prototype), 'constructor', this).call(this, SERVICE_ID);

    this._sync = this.require('sync');

    this._scheduler = _wavesAudio2['default'].getScheduler();
    this._syncedQueue = new _SyncTimeSchedulingQueue(this._sync, this._scheduler);

    var defaults = {
      lookahead: this._scheduler.lookahead,
      period: this._scheduler.period
    };

    this.configure(defaults);
  }

  /**
   * Override default configure to add descriptors from multiple calls.
   * @param {Object} options - The options to apply to the service.
   */

  _createClass(Scheduler, [{
    key: 'configure',
    value: function configure(options) {
      if (options.period !== undefined) {
        if (options.period > 0.010) this._scheduler.period = options.period;else throw new Error('Invalid scheduler period: ' + options.period);
      }

      if (options.lookahead !== undefined) {
        if (options.lookahead > 0.010) this._scheduler.lookahead = options.lookahead;else throw new Error('Invalid scheduler lookahead: ' + options.lookahead);
      }

      _get(Object.getPrototypeOf(Scheduler.prototype), 'configure', this).call(this, options);
    }

    /** inheritdoc */
  }, {
    key: 'init',
    value: function init() {}

    /** inheritdoc */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Scheduler.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.ready();
    }
  }, {
    key: 'defer',
    value: function defer(fun, time) {
      var synchronized = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      var scheduler = synchronized ? this._syncedQueue : this._scheduler;
      scheduler.defer(fun, time);
    }
  }, {
    key: 'add',
    value: function add(engine, time) {
      var synchronized = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      var scheduler = synchronized ? this._syncedQueue : this._scheduler;
      scheduler.add(engine, time);
    }
  }, {
    key: 'remove',
    value: function remove(engine) {
      if (this._scheduler.has(engine)) this._scheduler.remove(engine);else if (this._syncedQueue.has(engine)) this._syncedQueue.remove(engine);
    }
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
  }, {
    key: 'syncTime',
    get: function get() {
      return this._syncedQueue.currentTime;
    }
  }, {
    key: 'deltaTime',
    get: function get() {
      return this._scheduler.currentTime - _wavesAudio2['default'].audioContext.currentTime;
    }
  }]);

  return Scheduler;
})(_coreService2['default']);

;

_coreServiceManager2['default'].register(SERVICE_ID, Scheduler);

exports['default'] = Scheduler;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvU2NoZWR1bGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQWtCLGFBQWE7Ozs7MkJBQ1gsaUJBQWlCOzs7O2tDQUNWLHdCQUF3Qjs7OztJQUU3Qyx3QkFBd0I7WUFBeEIsd0JBQXdCOztBQUNqQixXQURQLHdCQUF3QixDQUNoQixJQUFJLEVBQUUsU0FBUyxFQUFFOzBCQUR6Qix3QkFBd0I7O0FBRTFCLCtCQUZFLHdCQUF3Qiw2Q0FFbEI7O0FBRVIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDM0IsUUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDOzs7QUFHN0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxRQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDcEM7O2VBWkcsd0JBQXdCOztXQWtCakIscUJBQUMsU0FBUyxFQUFFOztBQUVyQixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNsRCxVQUFNLFlBQVksOEJBckJoQix3QkFBd0IsNkNBcUJhLFFBQVEsQ0FBQyxDQUFDO0FBQ2pELFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUzRCxVQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztBQUNqQyxVQUFJLENBQUMsYUFBYSxHQUFHLGFB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QztLQUNyRTs7O1NBaEVHLFNBQVM7OztBQXVGZCxDQUFDOztBQUVGLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7O3FCQUVoQyxTQUFTIiwiZmlsZSI6Ii9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvU2NoZWR1bGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNsYXNzIF9TeW5jVGltZVNjaGVkdWxpbmdRdWV1ZSBleHRlbmRzIGF1ZGlvLlNjaGVkdWxpbmdRdWV1ZSB7XG4gIGNvbnN0cnVjdG9yKHN5bmMsIHNjaGVkdWxlcikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN5bmMgPSBzeW5jO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgIHRoaXMuc2NoZWR1bGVyLmFkZCh0aGlzLCBJbmZpbml0eSk7XG4gICAgdGhpcy5uZXh0U3luY1RpbWUgPSBJbmZpbml0eTtcblxuICAgIC8vIGNhbGwgdGhpcy5yZXN5bmMgaW4gc3luYyBjYWxsYmFja1xuICAgIHRoaXMucmVzeW5jID0gdGhpcy5yZXN5bmMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN5bmMuYWRkTGlzdGVuZXIodGhpcy5yZXN5bmMpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRUaW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5zeW5jLmdldFN5bmNUaW1lKHRoaXMuc2NoZWR1bGVyLmN1cnJlbnRUaW1lKTtcbiAgfVxuXG4gIGFkdmFuY2VUaW1lKGxvY2FsVGltZSkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdhZHZhbmNlVGltZScsIGxvY2FsVGltZSk7XG4gICAgY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUobG9jYWxUaW1lKTtcbiAgICBjb25zdCBuZXh0U3luY1RpbWUgPSBzdXBlci5hZHZhbmNlVGltZShzeW5jVGltZSk7XG4gICAgY29uc3QgbmV4dExvY2FsVGltZSA9IHRoaXMuc3luYy5nZXRMb2NhbFRpbWUobmV4dFN5bmNUaW1lKTtcblxuICAgIHRoaXMubmV4dFN5bmNUaW1lID0gbmV4dFN5bmNUaW1lO1xuICAgIHRoaXMubmV4dExvY2FsVGltZSA9IG5leHRMb2NhbFRpbWU7IC8vIGZvciByZXN5bmMgdGVzdGluZ1xuXG4gICAgcmV0dXJuIG5leHRMb2NhbFRpbWU7XG4gIH1cblxuICByZXNldFRpbWUoc3luY1RpbWUpIHtcbiAgICBjb25zdCBsb2NhbFRpbWUgPSAodHlwZW9mIHN5bmNUaW1lICE9PSAndW5kZWZpbmVkJykgP1xuICAgICAgdGhpcy5zeW5jLmdldExvY2FsVGltZShzeW5jVGltZSkgOiB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLm5leHRTeW5jVGltZSA9IHN5bmNUaW1lO1xuICAgIHRoaXMubmV4dExvY2FsVGltZSA9IGxvY2FsVGltZTtcblxuICAgIHRoaXMubWFzdGVyLnJlc2V0RW5naW5lVGltZSh0aGlzLCBsb2NhbFRpbWUpO1xuICB9XG5cbiAgcmVzeW5jKCkge1xuICAgIGlmICh0aGlzLm5leHRTeW5jVGltZSAhPT0gSW5maW5pdHkpIHtcbiAgICAgIGNvbnN0IG5leHRMb2NhbFRpbWUgPSB0aGlzLnN5bmMuZ2V0TG9jYWxUaW1lKHRoaXMubmV4dFN5bmNUaW1lKTtcbiAgICAgIHRoaXMubWFzdGVyLnJlc2V0RW5naW5lVGltZSh0aGlzLCBuZXh0TG9jYWxUaW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIEluZmluaXR5KTtcbiAgICB9XG5cbiAgfVxuXG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzY2hlZHVsZXInO1xuXG5jbGFzcyBTY2hlZHVsZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgdGhpcy5fc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuXG4gICAgdGhpcy5fc2NoZWR1bGVyID0gYXVkaW8uZ2V0U2NoZWR1bGVyKCk7XG4gICAgdGhpcy5fc3luY2VkUXVldWUgPSBuZXcgX1N5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlKHRoaXMuX3N5bmMsIHRoaXMuX3NjaGVkdWxlcik7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGxvb2thaGVhZDogdGhpcy5fc2NoZWR1bGVyLmxvb2thaGVhZCxcbiAgICAgIHBlcmlvZDogdGhpcy5fc2NoZWR1bGVyLnBlcmlvZCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJlIHRvIGFkZCBkZXNjcmlwdG9ycyBmcm9tIG11bHRpcGxlIGNhbGxzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGFwcGx5IHRvIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5wZXJpb2QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKG9wdGlvbnMucGVyaW9kID4gMC4wMTApXG4gICAgICAgIHRoaXMuX3NjaGVkdWxlci5wZXJpb2QgPSBvcHRpb25zLnBlcmlvZDtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNjaGVkdWxlciBwZXJpb2Q6ICR7b3B0aW9ucy5wZXJpb2R9YCk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMubG9va2FoZWFkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChvcHRpb25zLmxvb2thaGVhZCA+IDAuMDEwKVxuICAgICAgICB0aGlzLl9zY2hlZHVsZXIubG9va2FoZWFkID0gb3B0aW9ucy5sb29rYWhlYWQ7XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzY2hlZHVsZXIgbG9va2FoZWFkOiAke29wdGlvbnMubG9va2FoZWFkfWApO1xuICAgIH1cblxuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBpbmhlcml0ZG9jICovXG4gIGluaXQgKCkge1xuXG4gIH1cblxuICAvKiogaW5oZXJpdGRvYyAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIGdldCBhdWRpb1RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgfVxuXG4gIGdldCBzeW5jVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luY2VkUXVldWUuY3VycmVudFRpbWU7XG4gIH1cblxuICBnZXQgZGVsdGFUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zY2hlZHVsZXIuY3VycmVudFRpbWUgLSBhdWRpby5hdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gIH1cblxuICBkZWZlcihmdW4sIHRpbWUsIHN5bmNocm9uaXplZCA9IHRydWUpIHtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSBzeW5jaHJvbml6ZWQgPyB0aGlzLl9zeW5jZWRRdWV1ZSA6IHRoaXMuX3NjaGVkdWxlcjtcbiAgICBzY2hlZHVsZXIuZGVmZXIoZnVuLCB0aW1lKVxuICB9XG5cbiAgYWRkKGVuZ2luZSwgdGltZSwgc3luY2hyb25pemVkID0gdHJ1ZSkge1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHN5bmNocm9uaXplZCA/IHRoaXMuX3N5bmNlZFF1ZXVlIDogdGhpcy5fc2NoZWR1bGVyO1xuICAgIHNjaGVkdWxlci5hZGQoZW5naW5lLCB0aW1lKTtcbiAgfVxuXG4gIHJlbW92ZShlbmdpbmUpIHtcbiAgICBpZiAodGhpcy5fc2NoZWR1bGVyLmhhcyhlbmdpbmUpKVxuICAgICAgdGhpcy5fc2NoZWR1bGVyLnJlbW92ZShlbmdpbmUpO1xuICAgIGVsc2UgaWYgKHRoaXMuX3N5bmNlZFF1ZXVlLmhhcyhlbmdpbmUpKVxuICAgICAgdGhpcy5fc3luY2VkUXVldWUucmVtb3ZlKGVuZ2luZSk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLl9zeW5jZWRRdWV1ZS5jbGVhcigpO1xuICAgIHRoaXMuX3NjaGVkdWxlci5jbGVhcigpO1xuICB9XG59O1xuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTY2hlZHVsZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBTY2hlZHVsZXI7XG4iXX0=