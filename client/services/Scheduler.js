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

    this.sync = this.require('sync');

    this.queue = undefined;
    this.scheduler = _wavesAudio2['default'].getScheduler();
    this.scheduler.lookahead = 0.2; // in seconds (100 ms for video)
    this.queue = new _SyncTimeSchedulingQueue(this.sync, this.scheduler);
  }

  _createClass(Scheduler, [{
    key: 'init',
    value: function init() {}
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Scheduler.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.ready();
    }
  }, {
    key: 'getSyncScheduler',
    value: function getSyncScheduler() {
      return this.queue;
    }
  }, {
    key: 'getLocalTime',
    value: function getLocalTime() {
      return this.scheduler.currentTime;
    }
  }, {
    key: 'getSyncTime',
    value: function getSyncTime() {
      return this.queue.currentTime;
    }
  }, {
    key: 'getDeltaTime',
    value: function getDeltaTime() {
      var audioContext = _wavesAudio2['default'].audioContext;
      return this.scheduler.currentTime - audioContext.currentTime;
    }
  }]);

  return Scheduler;
})(_coreService2['default']);

;

_coreServiceManager2['default'].register(SERVICE_ID, Scheduler);

exports['default'] = Scheduler;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvU2NoZWR1bGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQWtCLGFBQWE7Ozs7MkJBQ1gsaUJBQWlCOzs7O2tDQUNWLHdCQUF3Qjs7OztJQUc3Qyx3QkFBd0I7WUFBeEIsd0JBQXdCOztBQUNqQixXQURQLHdCQUF3QixDQUNoQixJQUFJLEVBQUUsU0FBUyxFQUFFOzBCQUR6Qix3QkFBd0I7O0FBRTFCLCtCQUZFLHdCQUF3Qiw2Q0FFbEI7QUFDUixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixRQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbkMsUUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7O0FBRTdCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsUUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ3BDOztlQVZHLHdCQUF3Qjs7V0FnQmpCLHFCQUFDLFNBQVMsRUFBRTtBQUNyQixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNsRCxVQUFNLFlBQVksOEJBbEJoQix3QkFBd0IsNkNBa0JhLFFBQVEsQ0FBQyxDQUFDO0FBQ2pELFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUzRCxVQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztBQUNqQyxVQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQzs7QUFFbkMsYUFBTyxhQUFhLENBQUM7S0FDdEI7OztXQUVRLG1CQUFDLFFBQVEsRUFBRTtBQUNsQixVQUFNLFNBQVMsR0FBRyxBQUFDLE9BQU8sUUFBUSxLQUFLLFdBQVcsR0FDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsU0FBUyxDQUFDOztBQUUvQyxVQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDOUM7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFFBQVEsRUFBRTtBQUNsQyxZQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDaEUsWUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO09BQ2xELE1BQU07QUFDTCxZQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7T0FDN0M7S0FDRjs7O1NBN0JlLGVBQUc7QUFDakIsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQzFEOzs7U0FkRyx3QkFBd0I7R0FBUyx3QkFBTSxlQUFlOztBQTZDNUQsSUFBTSxVQUFVLEdBQUcsbUJBQW1CLENBQUM7O0lBRWpDLFNBQVM7WUFBVCxTQUFTOztBQUNELFdBRFIsU0FBUyxHQUNFOzBCQURYLFNBQVM7O0FBRVgsK0JBRkUsU0FBUyw2Q0FFTCxVQUFVLEVBQUU7O0FBRWxCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFakMsUUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7QUFDdkIsUUFBSSxDQUFDLFNBQVMsR0FBRyx3QkFBTSxZQUFZLEVBQUUsQ0FBQztBQUN0QyxRQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFDL0IsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLHdCQUF3QixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ3RFOztlQVZHLFNBQVM7O1dBWVIsZ0JBQUcsRUFFUDs7O1dBRUksaUJBQUc7QUFDTixpQ0FqQkUsU0FBUyx1Q0FpQkc7O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQ2xCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFZCxVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDZDs7O1dBRWdCLDRCQUFHO0FBQ2xCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNuQjs7O1dBRVksd0JBQUc7QUFDZCxhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO0tBQ25DOzs7V0FFVyx1QkFBRztBQUNiLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7S0FDL0I7OztXQUVXLHdCQUFHO0FBQ2IsVUFBTSxZQUFZLEdBQUcsd0JBQU0sWUFBWSxDQUFDO0FBQ3hDLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQztLQUM5RDs7O1NBeENHLFNBQVM7OztBQXlDZCxDQUFDOztBQUVGLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7O3FCQUVoQyxTQUFTIiwiZmlsZSI6Ii9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvU2NoZWR1bGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cblxuY2xhc3MgX1N5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlIGV4dGVuZHMgYXVkaW8uU2NoZWR1bGluZ1F1ZXVlIHtcbiAgY29uc3RydWN0b3Ioc3luYywgc2NoZWR1bGVyKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN5bmMgPSBzeW5jO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgIHRoaXMuc2NoZWR1bGVyLmFkZCh0aGlzLCBJbmZpbml0eSk7XG4gICAgdGhpcy5uZXh0U3luY1RpbWUgPSBJbmZpbml0eTtcbiAgICAvLyBjYWxsIHRoaXMucmVzeW5jIGluIHN5bmMgY2FsbGJhY2tcbiAgICB0aGlzLnJlc3luYyA9IHRoaXMucmVzeW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zeW5jLmFkZExpc3RlbmVyKHRoaXMucmVzeW5jKTtcbiAgfVxuXG4gIGdldCBjdXJyZW50VGltZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3luYy5nZXRTeW5jVGltZSh0aGlzLnNjaGVkdWxlci5jdXJyZW50VGltZSk7XG4gIH1cblxuICBhZHZhbmNlVGltZShsb2NhbFRpbWUpIHtcbiAgICBjb25zdCBzeW5jVGltZSA9IHRoaXMuc3luYy5nZXRTeW5jVGltZShsb2NhbFRpbWUpO1xuICAgIGNvbnN0IG5leHRTeW5jVGltZSA9IHN1cGVyLmFkdmFuY2VUaW1lKHN5bmNUaW1lKTtcbiAgICBjb25zdCBuZXh0TG9jYWxUaW1lID0gdGhpcy5zeW5jLmdldExvY2FsVGltZShuZXh0U3luY1RpbWUpO1xuXG4gICAgdGhpcy5uZXh0U3luY1RpbWUgPSBuZXh0U3luY1RpbWU7XG4gICAgdGhpcy5uZXh0TG9jYWxUaW1lID0gbmV4dExvY2FsVGltZTsgLy8gZm9yIHJlc3luYyB0ZXN0aW5nXG5cbiAgICByZXR1cm4gbmV4dExvY2FsVGltZTtcbiAgfVxuXG4gIHJlc2V0VGltZShzeW5jVGltZSkge1xuICAgIGNvbnN0IGxvY2FsVGltZSA9ICh0eXBlb2Ygc3luY1RpbWUgIT09ICd1bmRlZmluZWQnKSA/XG4gICAgICB0aGlzLnN5bmMuZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKSA6IHVuZGVmaW5lZDtcblxuICAgIHRoaXMubWFzdGVyLnJlc2V0RW5naW5lVGltZSh0aGlzLCBsb2NhbFRpbWUpO1xuICB9XG5cbiAgcmVzeW5jKCkge1xuICAgIGlmICh0aGlzLm5leHRTeW5jVGltZSAhPT0gSW5maW5pdHkpIHtcbiAgICAgIGNvbnN0IG5leHRMb2NhbFRpbWUgPSB0aGlzLnN5bmMuZ2V0TG9jYWxUaW1lKHRoaXMubmV4dFN5bmNUaW1lKTtcbiAgICAgIHRoaXMubWFzdGVyLnJlc2V0RW5naW5lVGltZSh0aGlzLCBuZXh0TG9jYWxUaW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIEluZmluaXR5KTtcbiAgICB9XG4gIH1cblxufVxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2NoZWR1bGVyJztcblxuY2xhc3MgU2NoZWR1bGVyIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIHRoaXMuc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuXG4gICAgdGhpcy5xdWV1ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnNjaGVkdWxlciA9IGF1ZGlvLmdldFNjaGVkdWxlcigpO1xuICAgIHRoaXMuc2NoZWR1bGVyLmxvb2thaGVhZCA9IDAuMjsgLy8gaW4gc2Vjb25kcyAoMTAwIG1zIGZvciB2aWRlbylcbiAgICB0aGlzLnF1ZXVlID0gbmV3IF9TeW5jVGltZVNjaGVkdWxpbmdRdWV1ZSh0aGlzLnN5bmMsIHRoaXMuc2NoZWR1bGVyKTtcbiAgfVxuXG4gIGluaXQgKCkge1xuXG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIGdldFN5bmNTY2hlZHVsZXIgKCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXVlO1xuICB9XG5cbiAgZ2V0TG9jYWxUaW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5zY2hlZHVsZXIuY3VycmVudFRpbWU7XG4gIH1cblxuICBnZXRTeW5jVGltZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucXVldWUuY3VycmVudFRpbWU7XG4gIH1cblxuICBnZXREZWx0YVRpbWUoKSB7XG4gICAgY29uc3QgYXVkaW9Db250ZXh0ID0gYXVkaW8uYXVkaW9Db250ZXh0O1xuICAgIHJldHVybiB0aGlzLnNjaGVkdWxlci5jdXJyZW50VGltZSAtIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgfVxufTtcblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2NoZWR1bGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgU2NoZWR1bGVyO1xuXG4iXX0=