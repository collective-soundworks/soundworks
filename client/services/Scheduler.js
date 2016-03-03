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

    /** private */
  }, {
    key: 'init',
    value: function init() {}

    /** private */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL1NjaGVkdWxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUFrQixhQUFhOzs7OzJCQUNYLGlCQUFpQjs7OztrQ0FDVix3QkFBd0I7Ozs7SUFFN0Msd0JBQXdCO1lBQXhCLHdCQUF3Qjs7QUFDakIsV0FEUCx3QkFBd0IsQ0FDaEIsSUFBSSxFQUFFLFNBQVMsRUFBRTswQkFEekIsd0JBQXdCOztBQUUxQiwrQkFGRSx3QkFBd0IsNkNBRWxCOztBQUVSLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuQyxRQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQzs7O0FBRzdCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsUUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ3BDOztlQVpHLHdCQUF3Qjs7V0FrQmpCLHFCQUFDLFNBQVMsRUFBRTtBQUNyQixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNsRCxVQUFNLFlBQVksOEJBcEJoQix3QkFBd0IsNkNBb0JhLFFBQVEsQ0FBQyxDQUFDO0FBQ2pELFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUzRCxVQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztBQUNqQyxVQUFJ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LFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQzs7cUJBRWhDLFNBQVMiLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvU2NoZWR1bGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNsYXNzIF9TeW5jVGltZVNjaGVkdWxpbmdRdWV1ZSBleHRlbmRzIGF1ZGlvLlNjaGVkdWxpbmdRdWV1ZSB7XG4gIGNvbnN0cnVjdG9yKHN5bmMsIHNjaGVkdWxlcikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN5bmMgPSBzeW5jO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgIHRoaXMuc2NoZWR1bGVyLmFkZCh0aGlzLCBJbmZpbml0eSk7XG4gICAgdGhpcy5uZXh0U3luY1RpbWUgPSBJbmZpbml0eTtcblxuICAgIC8vIGNhbGwgdGhpcy5yZXN5bmMgaW4gc3luYyBjYWxsYmFja1xuICAgIHRoaXMucmVzeW5jID0gdGhpcy5yZXN5bmMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN5bmMuYWRkTGlzdGVuZXIodGhpcy5yZXN5bmMpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRUaW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5zeW5jLmdldFN5bmNUaW1lKHRoaXMuc2NoZWR1bGVyLmN1cnJlbnRUaW1lKTtcbiAgfVxuXG4gIGFkdmFuY2VUaW1lKGxvY2FsVGltZSkge1xuICAgIGNvbnN0IHN5bmNUaW1lID0gdGhpcy5zeW5jLmdldFN5bmNUaW1lKGxvY2FsVGltZSk7XG4gICAgY29uc3QgbmV4dFN5bmNUaW1lID0gc3VwZXIuYWR2YW5jZVRpbWUoc3luY1RpbWUpO1xuICAgIGNvbnN0IG5leHRMb2NhbFRpbWUgPSB0aGlzLnN5bmMuZ2V0TG9jYWxUaW1lKG5leHRTeW5jVGltZSk7XG5cbiAgICB0aGlzLm5leHRTeW5jVGltZSA9IG5leHRTeW5jVGltZTtcbiAgICB0aGlzLm5leHRMb2NhbFRpbWUgPSBuZXh0TG9jYWxUaW1lOyAvLyBmb3IgcmVzeW5jIHRlc3RpbmdcblxuICAgIHJldHVybiBuZXh0TG9jYWxUaW1lO1xuICB9XG5cbiAgcmVzZXRUaW1lKHN5bmNUaW1lKSB7XG4gICAgY29uc3QgbG9jYWxUaW1lID0gKHR5cGVvZiBzeW5jVGltZSAhPT0gJ3VuZGVmaW5lZCcpID9cbiAgICAgIHRoaXMuc3luYy5nZXRMb2NhbFRpbWUoc3luY1RpbWUpIDogdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIGxvY2FsVGltZSk7XG4gIH1cblxuICByZXN5bmMoKSB7XG4gICAgaWYgKHRoaXMubmV4dFN5bmNUaW1lICE9PSBJbmZpbml0eSkge1xuICAgICAgY29uc3QgbmV4dExvY2FsVGltZSA9IHRoaXMuc3luYy5nZXRMb2NhbFRpbWUodGhpcy5uZXh0U3luY1RpbWUpO1xuICAgICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIG5leHRMb2NhbFRpbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVRpbWUodGhpcywgSW5maW5pdHkpO1xuICAgIH1cbiAgfVxuXG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzY2hlZHVsZXInO1xuXG5jbGFzcyBTY2hlZHVsZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgdGhpcy5fc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuXG4gICAgdGhpcy5fc2NoZWR1bGVyID0gYXVkaW8uZ2V0U2NoZWR1bGVyKCk7XG4gICAgdGhpcy5fc3luY2VkUXVldWUgPSBuZXcgX1N5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlKHRoaXMuX3N5bmMsIHRoaXMuX3NjaGVkdWxlcik7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGxvb2thaGVhZDogdGhpcy5fc2NoZWR1bGVyLmxvb2thaGVhZCxcbiAgICAgIHBlcmlvZDogdGhpcy5fc2NoZWR1bGVyLnBlcmlvZCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJlIHRvIGFkZCBkZXNjcmlwdG9ycyBmcm9tIG11bHRpcGxlIGNhbGxzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGFwcGx5IHRvIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZihvcHRpb25zLnBlcmlvZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZihvcHRpb25zLnBlcmlvZCA+IDAuMDEwKVxuICAgICAgICB0aGlzLl9zY2hlZHVsZXIucGVyaW9kID0gb3B0aW9ucy5wZXJpb2Q7XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzY2hlZHVsZXIgcGVyaW9kOiAke29wdGlvbnMucGVyaW9kfWApO1xuICAgIH1cblxuICAgIGlmKG9wdGlvbnMubG9va2FoZWFkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmKG9wdGlvbnMubG9va2FoZWFkID4gMC4wMTApXG4gICAgICAgIHRoaXMuX3NjaGVkdWxlci5sb29rYWhlYWQgPSBvcHRpb25zLmxvb2thaGVhZDtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNjaGVkdWxlciBsb29rYWhlYWQ6ICR7b3B0aW9ucy5sb29rYWhlYWR9YCk7XG4gICAgfVxuXG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIHByaXZhdGUgKi9cbiAgaW5pdCAoKSB7XG5cbiAgfVxuXG4gIC8qKiBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgZ2V0IGF1ZGlvVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2NoZWR1bGVyLmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgZ2V0IHN5bmNUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jZWRRdWV1ZS5jdXJyZW50VGltZTtcbiAgfVxuXG4gIGdldCBkZWx0YVRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NjaGVkdWxlci5jdXJyZW50VGltZSAtIGF1ZGlvLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgfVxuXG4gIGRlZmVyKGZ1biwgdGltZSwgc3luY2hyb25pemVkID0gdHJ1ZSkge1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHN5bmNocm9uaXplZD8gdGhpcy5fc3luY2VkUXVldWU6IHRoaXMuX3NjaGVkdWxlcjtcbiAgICBzY2hlZHVsZXIuZGVmZXIoZnVuLCB0aW1lKVxuICB9XG5cbiAgYWRkKGVuZ2luZSwgdGltZSwgc3luY2hyb25pemVkID0gdHJ1ZSkge1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHN5bmNocm9uaXplZD8gdGhpcy5fc3luY2VkUXVldWU6IHRoaXMuX3NjaGVkdWxlcjtcbiAgICBzY2hlZHVsZXIuYWRkKGVuZ2luZSwgdGltZSk7XG4gIH1cblxuICByZW1vdmUoZW5naW5lKSB7XG4gICAgaWYodGhpcy5fc2NoZWR1bGVyLmhhcyhlbmdpbmUpKVxuICAgICAgdGhpcy5fc2NoZWR1bGVyLnJlbW92ZShlbmdpbmUpO1xuICAgIGVsc2UgaWYodGhpcy5fc3luY2VkUXVldWUuaGFzKGVuZ2luZSkpXG4gICAgICB0aGlzLl9zeW5jZWRRdWV1ZS5yZW1vdmUoZW5naW5lKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX3N5bmNlZFF1ZXVlLmNsZWFyKCk7XG4gICAgdGhpcy5fc2NoZWR1bGVyLmNsZWFyKCk7XG4gIH1cbn07XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNjaGVkdWxlcik7XG5cbmV4cG9ydCBkZWZhdWx0IFNjaGVkdWxlcjtcbiJdfQ==