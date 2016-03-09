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

var _wavesAudio2 = _interopRequireDefault(_wavesAudio);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

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
    value: function advanceTime(localTime) {
      var syncTime = this.sync.getSyncTime(localTime);
      var nextSyncTime = (0, _get3.default)((0, _getPrototypeOf2.default)(_SyncTimeSchedulingQueue.prototype), 'advanceTime', this).call(this, syncTime);
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
}(_wavesAudio2.default.SchedulingQueue);

var SERVICE_ID = 'service:scheduler';

var Scheduler = function (_Service) {
  (0, _inherits3.default)(Scheduler, _Service);

  function Scheduler() {
    (0, _classCallCheck3.default)(this, Scheduler);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Scheduler).call(this, SERVICE_ID));

    _this2._sync = _this2.require('sync');

    _this2._scheduler = _wavesAudio2.default.getScheduler();
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
      return this._scheduler.currentTime - _wavesAudio2.default.audioContext.currentTime;
    }
  }]);
  return Scheduler;
}(_Service3.default);

;

_serviceManager2.default.register(SERVICE_ID, Scheduler);

exports.default = Scheduler;
//# sourceMappingURL=data:application/json;base64,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WUFBTCxDQUFrQixLQUFsQixHQURNO0FBRU4sV0FBSyxVQUFMLENBQWdCLEtBQWhCLEdBRk07Ozs7d0JBN0JRO0FBQ2QsYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsV0FBaEIsQ0FETzs7Ozt3QkFJRDtBQUNiLGFBQU8sS0FBSyxZQUFMLENBQWtCLFdBQWxCLENBRE07Ozs7d0JBSUM7QUFDZCxhQUFPLEtBQUssVUFBTCxDQUFnQixXQUFoQixHQUE4QixxQkFBTSxZQUFOLENBQW1CLFdBQW5CLENBRHZCOzs7U0E5RFo7OztBQXVGTDs7QUFFRCx5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLFNBQXBDOztrQkFFZSIsImZpbGUiOiJTY2hlZHVsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY2xhc3MgX1N5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlIGV4dGVuZHMgYXVkaW8uU2NoZWR1bGluZ1F1ZXVlIHtcbiAgY29uc3RydWN0b3Ioc3luYywgc2NoZWR1bGVyKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3luYyA9IHN5bmM7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgdGhpcy5zY2hlZHVsZXIuYWRkKHRoaXMsIEluZmluaXR5KTtcbiAgICB0aGlzLm5leHRTeW5jVGltZSA9IEluZmluaXR5O1xuXG4gICAgLy8gY2FsbCB0aGlzLnJlc3luYyBpbiBzeW5jIGNhbGxiYWNrXG4gICAgdGhpcy5yZXN5bmMgPSB0aGlzLnJlc3luYy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3luYy5hZGRMaXN0ZW5lcih0aGlzLnJlc3luYyk7XG4gIH1cblxuICBnZXQgY3VycmVudFRpbWUgKCkge1xuICAgIHJldHVybiB0aGlzLnN5bmMuZ2V0U3luY1RpbWUodGhpcy5zY2hlZHVsZXIuY3VycmVudFRpbWUpO1xuICB9XG5cbiAgYWR2YW5jZVRpbWUobG9jYWxUaW1lKSB7XG4gICAgY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUobG9jYWxUaW1lKTtcbiAgICBjb25zdCBuZXh0U3luY1RpbWUgPSBzdXBlci5hZHZhbmNlVGltZShzeW5jVGltZSk7XG4gICAgY29uc3QgbmV4dExvY2FsVGltZSA9IHRoaXMuc3luYy5nZXRMb2NhbFRpbWUobmV4dFN5bmNUaW1lKTtcblxuICAgIHRoaXMubmV4dFN5bmNUaW1lID0gbmV4dFN5bmNUaW1lO1xuICAgIHRoaXMubmV4dExvY2FsVGltZSA9IG5leHRMb2NhbFRpbWU7IC8vIGZvciByZXN5bmMgdGVzdGluZ1xuXG4gICAgcmV0dXJuIG5leHRMb2NhbFRpbWU7XG4gIH1cblxuICByZXNldFRpbWUoc3luY1RpbWUpIHtcbiAgICBjb25zdCBsb2NhbFRpbWUgPSAodHlwZW9mIHN5bmNUaW1lICE9PSAndW5kZWZpbmVkJykgP1xuICAgICAgdGhpcy5zeW5jLmdldExvY2FsVGltZShzeW5jVGltZSkgOiB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLm5leHRTeW5jVGltZSA9IHN5bmNUaW1lO1xuICAgIHRoaXMubmV4dExvY2FsVGltZSA9IGxvY2FsVGltZTtcblxuICAgIHRoaXMubWFzdGVyLnJlc2V0RW5naW5lVGltZSh0aGlzLCBsb2NhbFRpbWUpO1xuICB9XG5cbiAgcmVzeW5jKCkge1xuICAgIGlmICh0aGlzLm5leHRTeW5jVGltZSAhPT0gSW5maW5pdHkpIHtcbiAgICAgIGNvbnN0IG5leHRMb2NhbFRpbWUgPSB0aGlzLnN5bmMuZ2V0TG9jYWxUaW1lKHRoaXMubmV4dFN5bmNUaW1lKTtcbiAgICAgIHRoaXMubWFzdGVyLnJlc2V0RW5naW5lVGltZSh0aGlzLCBuZXh0TG9jYWxUaW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIEluZmluaXR5KTtcbiAgICB9XG5cbiAgfVxuXG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzY2hlZHVsZXInO1xuXG5jbGFzcyBTY2hlZHVsZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgdGhpcy5fc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuXG4gICAgdGhpcy5fc2NoZWR1bGVyID0gYXVkaW8uZ2V0U2NoZWR1bGVyKCk7XG4gICAgdGhpcy5fc3luY2VkUXVldWUgPSBuZXcgX1N5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlKHRoaXMuX3N5bmMsIHRoaXMuX3NjaGVkdWxlcik7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGxvb2thaGVhZDogdGhpcy5fc2NoZWR1bGVyLmxvb2thaGVhZCxcbiAgICAgIHBlcmlvZDogdGhpcy5fc2NoZWR1bGVyLnBlcmlvZCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJlIHRvIGFkZCBkZXNjcmlwdG9ycyBmcm9tIG11bHRpcGxlIGNhbGxzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGFwcGx5IHRvIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5wZXJpb2QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKG9wdGlvbnMucGVyaW9kID4gMC4wMTApXG4gICAgICAgIHRoaXMuX3NjaGVkdWxlci5wZXJpb2QgPSBvcHRpb25zLnBlcmlvZDtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNjaGVkdWxlciBwZXJpb2Q6ICR7b3B0aW9ucy5wZXJpb2R9YCk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMubG9va2FoZWFkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChvcHRpb25zLmxvb2thaGVhZCA+IDAuMDEwKVxuICAgICAgICB0aGlzLl9zY2hlZHVsZXIubG9va2FoZWFkID0gb3B0aW9ucy5sb29rYWhlYWQ7XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzY2hlZHVsZXIgbG9va2FoZWFkOiAke29wdGlvbnMubG9va2FoZWFkfWApO1xuICAgIH1cblxuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBpbmhlcml0ZG9jICovXG4gIGluaXQgKCkge1xuXG4gIH1cblxuICAvKiogaW5oZXJpdGRvYyAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIGdldCBhdWRpb1RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgfVxuXG4gIGdldCBzeW5jVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luY2VkUXVldWUuY3VycmVudFRpbWU7XG4gIH1cblxuICBnZXQgZGVsdGFUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zY2hlZHVsZXIuY3VycmVudFRpbWUgLSBhdWRpby5hdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gIH1cblxuICBkZWZlcihmdW4sIHRpbWUsIHN5bmNocm9uaXplZCA9IHRydWUpIHtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSBzeW5jaHJvbml6ZWQgPyB0aGlzLl9zeW5jZWRRdWV1ZSA6IHRoaXMuX3NjaGVkdWxlcjtcbiAgICBzY2hlZHVsZXIuZGVmZXIoZnVuLCB0aW1lKVxuICB9XG5cbiAgYWRkKGVuZ2luZSwgdGltZSwgc3luY2hyb25pemVkID0gdHJ1ZSkge1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHN5bmNocm9uaXplZCA/IHRoaXMuX3N5bmNlZFF1ZXVlIDogdGhpcy5fc2NoZWR1bGVyO1xuICAgIHNjaGVkdWxlci5hZGQoZW5naW5lLCB0aW1lKTtcbiAgfVxuXG4gIHJlbW92ZShlbmdpbmUpIHtcbiAgICBpZiAodGhpcy5fc2NoZWR1bGVyLmhhcyhlbmdpbmUpKVxuICAgICAgdGhpcy5fc2NoZWR1bGVyLnJlbW92ZShlbmdpbmUpO1xuICAgIGVsc2UgaWYgKHRoaXMuX3N5bmNlZFF1ZXVlLmhhcyhlbmdpbmUpKVxuICAgICAgdGhpcy5fc3luY2VkUXVldWUucmVtb3ZlKGVuZ2luZSk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLl9zeW5jZWRRdWV1ZS5jbGVhcigpO1xuICAgIHRoaXMuX3NjaGVkdWxlci5jbGVhcigpO1xuICB9XG59O1xuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTY2hlZHVsZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBTY2hlZHVsZXI7XG4iXX0=