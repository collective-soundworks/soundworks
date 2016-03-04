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
      console.log('scheduler', localTime);
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

      console.log(engine);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvU2NoZWR1bGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQWtCLGFBQWE7Ozs7MkJBQ1gsaUJBQWlCOzs7O2tDQUNWLHdCQUF3Qjs7OztJQUU3Qyx3QkFBd0I7WUFBeEIsd0JBQXdCOztBQUNqQixXQURQLHdCQUF3QixDQUNoQixJQUFJLEVBQUUsU0FBUyxFQUFFOzBCQUR6Qix3QkFBd0I7O0FBRTFCLCtCQUZFLHdCQUF3Qiw2Q0FFbEI7O0FBRVIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDM0IsUUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDOzs7QUFHN0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxRQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDcEM7O2VBWkcsd0JBQXdCOztXQWtCakIscUJBQUMsU0FBUyxFQUFFO0FBQ3JCLGFBQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2xELFVBQU0sWUFBWSw4QkFyQmhCLHdCQUF3Qiw2Q0FxQmEsUUFBUSxDQUFDLENBQUM7QUFDakQsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRTNELFVBQUksQ0FB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WUFBWSxDQUFDLFdBQVcsQ0FBQztLQUNyRTs7O1NBaEVHLFNBQVM7OztBQXdGZCxDQUFDOztBQUVGLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7O3FCQUVoQyxTQUFTIiwiZmlsZSI6Ii9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvU2NoZWR1bGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNsYXNzIF9TeW5jVGltZVNjaGVkdWxpbmdRdWV1ZSBleHRlbmRzIGF1ZGlvLlNjaGVkdWxpbmdRdWV1ZSB7XG4gIGNvbnN0cnVjdG9yKHN5bmMsIHNjaGVkdWxlcikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN5bmMgPSBzeW5jO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgIHRoaXMuc2NoZWR1bGVyLmFkZCh0aGlzLCBJbmZpbml0eSk7XG4gICAgdGhpcy5uZXh0U3luY1RpbWUgPSBJbmZpbml0eTtcblxuICAgIC8vIGNhbGwgdGhpcy5yZXN5bmMgaW4gc3luYyBjYWxsYmFja1xuICAgIHRoaXMucmVzeW5jID0gdGhpcy5yZXN5bmMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN5bmMuYWRkTGlzdGVuZXIodGhpcy5yZXN5bmMpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRUaW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5zeW5jLmdldFN5bmNUaW1lKHRoaXMuc2NoZWR1bGVyLmN1cnJlbnRUaW1lKTtcbiAgfVxuXG4gIGFkdmFuY2VUaW1lKGxvY2FsVGltZSkge1xuICAgIGNvbnNvbGUubG9nKCdzY2hlZHVsZXInLCBsb2NhbFRpbWUpO1xuICAgIGNvbnN0IHN5bmNUaW1lID0gdGhpcy5zeW5jLmdldFN5bmNUaW1lKGxvY2FsVGltZSk7XG4gICAgY29uc3QgbmV4dFN5bmNUaW1lID0gc3VwZXIuYWR2YW5jZVRpbWUoc3luY1RpbWUpO1xuICAgIGNvbnN0IG5leHRMb2NhbFRpbWUgPSB0aGlzLnN5bmMuZ2V0TG9jYWxUaW1lKG5leHRTeW5jVGltZSk7XG5cbiAgICB0aGlzLm5leHRTeW5jVGltZSA9IG5leHRTeW5jVGltZTtcbiAgICB0aGlzLm5leHRMb2NhbFRpbWUgPSBuZXh0TG9jYWxUaW1lOyAvLyBmb3IgcmVzeW5jIHRlc3RpbmdcblxuICAgIHJldHVybiBuZXh0TG9jYWxUaW1lO1xuICB9XG5cbiAgcmVzZXRUaW1lKHN5bmNUaW1lKSB7XG4gICAgY29uc3QgbG9jYWxUaW1lID0gKHR5cGVvZiBzeW5jVGltZSAhPT0gJ3VuZGVmaW5lZCcpID9cbiAgICAgIHRoaXMuc3luYy5nZXRMb2NhbFRpbWUoc3luY1RpbWUpIDogdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIGxvY2FsVGltZSk7XG4gIH1cblxuICByZXN5bmMoKSB7XG4gICAgaWYgKHRoaXMubmV4dFN5bmNUaW1lICE9PSBJbmZpbml0eSkge1xuICAgICAgY29uc3QgbmV4dExvY2FsVGltZSA9IHRoaXMuc3luYy5nZXRMb2NhbFRpbWUodGhpcy5uZXh0U3luY1RpbWUpO1xuICAgICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIG5leHRMb2NhbFRpbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVRpbWUodGhpcywgSW5maW5pdHkpO1xuICAgIH1cbiAgfVxuXG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzY2hlZHVsZXInO1xuXG5jbGFzcyBTY2hlZHVsZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgdGhpcy5fc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuXG4gICAgdGhpcy5fc2NoZWR1bGVyID0gYXVkaW8uZ2V0U2NoZWR1bGVyKCk7XG4gICAgdGhpcy5fc3luY2VkUXVldWUgPSBuZXcgX1N5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlKHRoaXMuX3N5bmMsIHRoaXMuX3NjaGVkdWxlcik7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGxvb2thaGVhZDogdGhpcy5fc2NoZWR1bGVyLmxvb2thaGVhZCxcbiAgICAgIHBlcmlvZDogdGhpcy5fc2NoZWR1bGVyLnBlcmlvZCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJlIHRvIGFkZCBkZXNjcmlwdG9ycyBmcm9tIG11bHRpcGxlIGNhbGxzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGFwcGx5IHRvIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5wZXJpb2QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKG9wdGlvbnMucGVyaW9kID4gMC4wMTApXG4gICAgICAgIHRoaXMuX3NjaGVkdWxlci5wZXJpb2QgPSBvcHRpb25zLnBlcmlvZDtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNjaGVkdWxlciBwZXJpb2Q6ICR7b3B0aW9ucy5wZXJpb2R9YCk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMubG9va2FoZWFkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChvcHRpb25zLmxvb2thaGVhZCA+IDAuMDEwKVxuICAgICAgICB0aGlzLl9zY2hlZHVsZXIubG9va2FoZWFkID0gb3B0aW9ucy5sb29rYWhlYWQ7XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzY2hlZHVsZXIgbG9va2FoZWFkOiAke29wdGlvbnMubG9va2FoZWFkfWApO1xuICAgIH1cblxuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBpbmhlcml0ZG9jICovXG4gIGluaXQgKCkge1xuXG4gIH1cblxuICAvKiogaW5oZXJpdGRvYyAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIGdldCBhdWRpb1RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgfVxuXG4gIGdldCBzeW5jVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luY2VkUXVldWUuY3VycmVudFRpbWU7XG4gIH1cblxuICBnZXQgZGVsdGFUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zY2hlZHVsZXIuY3VycmVudFRpbWUgLSBhdWRpby5hdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gIH1cblxuICBkZWZlcihmdW4sIHRpbWUsIHN5bmNocm9uaXplZCA9IHRydWUpIHtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSBzeW5jaHJvbml6ZWQgPyB0aGlzLl9zeW5jZWRRdWV1ZSA6IHRoaXMuX3NjaGVkdWxlcjtcbiAgICBzY2hlZHVsZXIuZGVmZXIoZnVuLCB0aW1lKVxuICB9XG5cbiAgYWRkKGVuZ2luZSwgdGltZSwgc3luY2hyb25pemVkID0gdHJ1ZSkge1xuICAgIGNvbnNvbGUubG9nKGVuZ2luZSk7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gc3luY2hyb25pemVkID8gdGhpcy5fc3luY2VkUXVldWUgOiB0aGlzLl9zY2hlZHVsZXI7XG4gICAgc2NoZWR1bGVyLmFkZChlbmdpbmUsIHRpbWUpO1xuICB9XG5cbiAgcmVtb3ZlKGVuZ2luZSkge1xuICAgIGlmICh0aGlzLl9zY2hlZHVsZXIuaGFzKGVuZ2luZSkpXG4gICAgICB0aGlzLl9zY2hlZHVsZXIucmVtb3ZlKGVuZ2luZSk7XG4gICAgZWxzZSBpZiAodGhpcy5fc3luY2VkUXVldWUuaGFzKGVuZ2luZSkpXG4gICAgICB0aGlzLl9zeW5jZWRRdWV1ZS5yZW1vdmUoZW5naW5lKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX3N5bmNlZFF1ZXVlLmNsZWFyKCk7XG4gICAgdGhpcy5fc2NoZWR1bGVyLmNsZWFyKCk7XG4gIH1cbn07XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNjaGVkdWxlcik7XG5cbmV4cG9ydCBkZWZhdWx0IFNjaGVkdWxlcjtcbiJdfQ==