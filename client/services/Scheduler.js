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

var Scheduler = function (_Service) {
  (0, _inherits3.default)(Scheduler, _Service);

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
   * Override default configure to add descriptors from multiple calls.
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

    /** inheritdoc */

  }, {
    key: 'init',
    value: function init() {}

    /** inheritdoc */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Scheduler.prototype), 'start', this).call(this);

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
      return this._scheduler.currentTime - audio.audioContext.currentTime;
    }
  }]);
  return Scheduler;
}(_Service3.default);

;

_serviceManager2.default.register(SERVICE_ID, Scheduler);

exports.default = Scheduler;
//# sourceMappingURL=data:application/json;base64,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bEIsQ0FBc0IsTUFBdEIsQ0FBSixFQUNILEtBQUssWUFBTCxDQUFrQixNQUFsQixDQUF5QixNQUF6QixFQURHOzs7OzRCQUlDO0FBQ04sV0FBSyxZQUFMLENBQWtCLEtBQWxCLEdBRE07QUFFTixXQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsR0FGTTs7Ozt3QkE3QlE7QUFDZCxhQUFPLEtBQUssVUFBTCxDQUFnQixXQUFoQixDQURPOzs7O3dCQUlEO0FBQ2IsYUFBTyxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsQ0FETTs7Ozt3QkFJQztBQUNkLGFBQU8sS0FBSyxVQUFMLENBQWdCLFdBQWhCLEdBQThCLE1BQU0sWUFBTixDQUFtQixXQUFuQixDQUR2Qjs7O1NBL0RaOzs7QUF3Rkw7O0FBRUQseUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxTQUFwQzs7a0JBRWUiLCJmaWxlIjoiU2NoZWR1bGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY2xhc3MgX1N5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlIGV4dGVuZHMgYXVkaW8uU2NoZWR1bGluZ1F1ZXVlIHtcbiAgY29uc3RydWN0b3Ioc3luYywgc2NoZWR1bGVyKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3luYyA9IHN5bmM7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgdGhpcy5zY2hlZHVsZXIuYWRkKHRoaXMsIEluZmluaXR5KTtcbiAgICB0aGlzLm5leHRTeW5jVGltZSA9IEluZmluaXR5O1xuXG4gICAgLy8gY2FsbCB0aGlzLnJlc3luYyBpbiBzeW5jIGNhbGxiYWNrXG4gICAgdGhpcy5yZXN5bmMgPSB0aGlzLnJlc3luYy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3luYy5hZGRMaXN0ZW5lcih0aGlzLnJlc3luYyk7XG4gIH1cblxuICBnZXQgY3VycmVudFRpbWUgKCkge1xuICAgIHJldHVybiB0aGlzLnN5bmMuZ2V0U3luY1RpbWUodGhpcy5zY2hlZHVsZXIuY3VycmVudFRpbWUpO1xuICB9XG5cbiAgYWR2YW5jZVRpbWUoYXVkaW9UaW1lKSB7XG4gICAgY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoYXVkaW9UaW1lKTtcbiAgICBjb25zdCBuZXh0U3luY1RpbWUgPSBzdXBlci5hZHZhbmNlVGltZShzeW5jVGltZSk7XG4gICAgY29uc3QgbmV4dEF1ZGlvVGltZSA9IHRoaXMuc3luYy5nZXRBdWRpb1RpbWUobmV4dFN5bmNUaW1lKTtcblxuICAgIHRoaXMubmV4dFN5bmNUaW1lID0gbmV4dFN5bmNUaW1lO1xuICAgIHRoaXMubmV4dEF1ZGlvVGltZSA9IG5leHRBdWRpb1RpbWU7IC8vIGZvciByZXN5bmMgdGVzdGluZ1xuXG4gICAgcmV0dXJuIG5leHRBdWRpb1RpbWU7XG4gIH1cblxuICByZXNldFRpbWUoc3luY1RpbWUpIHtcbiAgICBjb25zdCBhdWRpb1RpbWUgPSAodHlwZW9mIHN5bmNUaW1lICE9PSAndW5kZWZpbmVkJykgP1xuICAgICAgdGhpcy5zeW5jLmdldEF1ZGlvVGltZShzeW5jVGltZSkgOiB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLm5leHRTeW5jVGltZSA9IHN5bmNUaW1lO1xuICAgIHRoaXMubmV4dEF1ZGlvVGltZSA9IGF1ZGlvVGltZTtcblxuICAgIHRoaXMubWFzdGVyLnJlc2V0RW5naW5lVGltZSh0aGlzLCBhdWRpb1RpbWUpO1xuICB9XG5cbiAgcmVzeW5jKCkge1xuICAgIGlmICh0aGlzLm5leHRTeW5jVGltZSAhPT0gSW5maW5pdHkpIHtcbiAgICAgIGNvbnN0IG5leHRBdWRpb1RpbWUgPSB0aGlzLnN5bmMuZ2V0QXVkaW9UaW1lKHRoaXMubmV4dFN5bmNUaW1lKTtcbiAgICAgIHRoaXMubWFzdGVyLnJlc2V0RW5naW5lVGltZSh0aGlzLCBuZXh0QXVkaW9UaW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIEluZmluaXR5KTtcbiAgICB9XG5cbiAgfVxuXG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzY2hlZHVsZXInO1xuXG5jbGFzcyBTY2hlZHVsZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgdGhpcy5fc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuICAgIHRoaXMuX3BsYXRmb3JtID0gdGhpcy5yZXF1aXJlKCdwbGF0Zm9ybScsIHsgZmVhdHVyZXM6ICd3ZWItYXVkaW8nIH0pO1xuXG4gICAgdGhpcy5fc2NoZWR1bGVyID0gYXVkaW8uZ2V0U2NoZWR1bGVyKCk7XG4gICAgdGhpcy5fc3luY2VkUXVldWUgPSBuZXcgX1N5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlKHRoaXMuX3N5bmMsIHRoaXMuX3NjaGVkdWxlcik7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGxvb2thaGVhZDogdGhpcy5fc2NoZWR1bGVyLmxvb2thaGVhZCxcbiAgICAgIHBlcmlvZDogdGhpcy5fc2NoZWR1bGVyLnBlcmlvZCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJlIHRvIGFkZCBkZXNjcmlwdG9ycyBmcm9tIG11bHRpcGxlIGNhbGxzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGFwcGx5IHRvIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5wZXJpb2QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKG9wdGlvbnMucGVyaW9kID4gMC4wMTApXG4gICAgICAgIHRoaXMuX3NjaGVkdWxlci5wZXJpb2QgPSBvcHRpb25zLnBlcmlvZDtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNjaGVkdWxlciBwZXJpb2Q6ICR7b3B0aW9ucy5wZXJpb2R9YCk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMubG9va2FoZWFkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChvcHRpb25zLmxvb2thaGVhZCA+IDAuMDEwKVxuICAgICAgICB0aGlzLl9zY2hlZHVsZXIubG9va2FoZWFkID0gb3B0aW9ucy5sb29rYWhlYWQ7XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzY2hlZHVsZXIgbG9va2FoZWFkOiAke29wdGlvbnMubG9va2FoZWFkfWApO1xuICAgIH1cblxuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBpbmhlcml0ZG9jICovXG4gIGluaXQgKCkge1xuXG4gIH1cblxuICAvKiogaW5oZXJpdGRvYyAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIGdldCBhdWRpb1RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgfVxuXG4gIGdldCBzeW5jVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luY2VkUXVldWUuY3VycmVudFRpbWU7XG4gIH1cblxuICBnZXQgZGVsdGFUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zY2hlZHVsZXIuY3VycmVudFRpbWUgLSBhdWRpby5hdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gIH1cblxuICBkZWZlcihmdW4sIHRpbWUsIHN5bmNocm9uaXplZCA9IHRydWUpIHtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSBzeW5jaHJvbml6ZWQgPyB0aGlzLl9zeW5jZWRRdWV1ZSA6IHRoaXMuX3NjaGVkdWxlcjtcbiAgICBzY2hlZHVsZXIuZGVmZXIoZnVuLCB0aW1lKVxuICB9XG5cbiAgYWRkKGVuZ2luZSwgdGltZSwgc3luY2hyb25pemVkID0gdHJ1ZSkge1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHN5bmNocm9uaXplZCA/IHRoaXMuX3N5bmNlZFF1ZXVlIDogdGhpcy5fc2NoZWR1bGVyO1xuICAgIHNjaGVkdWxlci5hZGQoZW5naW5lLCB0aW1lKTtcbiAgfVxuXG4gIHJlbW92ZShlbmdpbmUpIHtcbiAgICBpZiAodGhpcy5fc2NoZWR1bGVyLmhhcyhlbmdpbmUpKVxuICAgICAgdGhpcy5fc2NoZWR1bGVyLnJlbW92ZShlbmdpbmUpO1xuICAgIGVsc2UgaWYgKHRoaXMuX3N5bmNlZFF1ZXVlLmhhcyhlbmdpbmUpKVxuICAgICAgdGhpcy5fc3luY2VkUXVldWUucmVtb3ZlKGVuZ2luZSk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLl9zeW5jZWRRdWV1ZS5jbGVhcigpO1xuICAgIHRoaXMuX3NjaGVkdWxlci5jbGVhcigpO1xuICB9XG59O1xuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTY2hlZHVsZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBTY2hlZHVsZXI7XG4iXX0=