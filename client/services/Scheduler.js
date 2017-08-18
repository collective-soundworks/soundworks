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

    var _this = (0, _possibleConstructorReturn3.default)(this, (_SyncTimeSchedulingQueue.__proto__ || (0, _getPrototypeOf2.default)(_SyncTimeSchedulingQueue)).call(this));

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
      var nextSyncTime = (0, _get3.default)(_SyncTimeSchedulingQueue.prototype.__proto__ || (0, _getPrototypeOf2.default)(_SyncTimeSchedulingQueue.prototype), 'advanceTime', this).call(this, this.nextSyncTime);
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

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (Scheduler.__proto__ || (0, _getPrototypeOf2.default)(Scheduler)).call(this, SERVICE_ID));

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
    (0, _get3.default)(Scheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(Scheduler.prototype), 'configure', _this2).call(_this2, defaults);
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
      (0, _get3.default)(Scheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(Scheduler.prototype), 'configure', this).call(this, options);
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)(Scheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(Scheduler.prototype), 'start', this).call(this);

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
      var synchronized = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !!this._sync;
      var lookahead = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

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
      var synchronized = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !!this._sync;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjaGVkdWxlci5qcyJdLCJuYW1lcyI6WyJhdWRpbyIsIl9TeW5jVGltZVNjaGVkdWxpbmdRdWV1ZSIsInN5bmMiLCJzY2hlZHVsZXIiLCJhZGQiLCJJbmZpbml0eSIsIm5leHRTeW5jVGltZSIsInJlc3luYyIsImJpbmQiLCJhZGRMaXN0ZW5lciIsImF1ZGlvVGltZSIsInN5bmNUaW1lIiwiZ2V0U3luY1RpbWUiLCJuZXh0QXVkaW9UaW1lIiwiZ2V0QXVkaW9UaW1lIiwidW5kZWZpbmVkIiwibWFzdGVyIiwicmVzZXRFbmdpbmVUaW1lIiwiY3VycmVudFRpbWUiLCJTY2hlZHVsaW5nUXVldWUiLCJTRVJWSUNFX0lEIiwiU2NoZWR1bGVyIiwiX3BsYXRmb3JtIiwicmVxdWlyZSIsImZlYXR1cmVzIiwiX3N5bmMiLCJfc3luY2VkUXVldWUiLCJfc2NoZWR1bGVyIiwiZ2V0U2NoZWR1bGVyIiwiZGVmYXVsdHMiLCJsb29rYWhlYWQiLCJwZXJpb2QiLCJvcHRpb25zIiwiRXJyb3IiLCJvcHQiLCJoYXNTdGFydGVkIiwiaW5pdCIsInJlYWR5IiwiZnVuIiwidGltZSIsInN5bmNocm9uaXplZCIsInNjaGVkdWxlclNlcnZpY2UiLCJlbmdpbmUiLCJkZWZlciIsImFkdmFuY2VUaW1lIiwiZGVsdGEiLCJkZWx0YVRpbWUiLCJzZXRUaW1lb3V0IiwiaGFzIiwicmVtb3ZlIiwiY2xlYXIiLCJhdWRpb0NvbnRleHQiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEs7O0FBQ1o7Ozs7QUFDQTs7Ozs7Ozs7SUFFTUMsd0I7OztBQUNKLG9DQUFZQyxJQUFaLEVBQWtCQyxTQUFsQixFQUE2QjtBQUFBOztBQUFBOztBQUczQixVQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxVQUFLQyxTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLFVBQUtBLFNBQUwsQ0FBZUMsR0FBZixRQUF5QkMsUUFBekI7QUFDQSxVQUFLQyxZQUFMLEdBQW9CRCxRQUFwQjs7QUFFQTtBQUNBLFVBQUtFLE1BQUwsR0FBYyxNQUFLQSxNQUFMLENBQVlDLElBQVosT0FBZDtBQUNBLFVBQUtOLElBQUwsQ0FBVU8sV0FBVixDQUFzQixNQUFLRixNQUEzQjtBQVYyQjtBQVc1Qjs7OztnQ0FNV0csUyxFQUFXO0FBQ3JCLFVBQU1DLFdBQVcsS0FBS1QsSUFBTCxDQUFVVSxXQUFWLENBQXNCRixTQUF0QixDQUFqQjtBQUNBLFVBQU1KLHFMQUFpQyxLQUFLQSxZQUF0QyxDQUFOO0FBQ0EsVUFBTU8sZ0JBQWdCLEtBQUtYLElBQUwsQ0FBVVksWUFBVixDQUF1QlIsWUFBdkIsQ0FBdEI7O0FBRUEsV0FBS0EsWUFBTCxHQUFvQkEsWUFBcEI7O0FBRUEsYUFBT08sYUFBUDtBQUNEOzs7OEJBRVNGLFEsRUFBVTtBQUNsQixVQUFHQSxhQUFhSSxTQUFoQixFQUNFSixXQUFXLEtBQUtULElBQUwsQ0FBVVUsV0FBVixFQUFYOztBQUVGLFdBQUtOLFlBQUwsR0FBb0JLLFFBQXBCOztBQUVBLFVBQU1ELFlBQVksS0FBS1IsSUFBTCxDQUFVWSxZQUFWLENBQXVCSCxRQUF2QixDQUFsQjtBQUNBLFdBQUtLLE1BQUwsQ0FBWUMsZUFBWixDQUE0QixJQUE1QixFQUFrQ1AsU0FBbEM7QUFDRDs7OzZCQUVRO0FBQ1AsVUFBSSxLQUFLSixZQUFMLEtBQXNCRCxRQUExQixFQUFvQztBQUNsQyxZQUFNUSxnQkFBZ0IsS0FBS1gsSUFBTCxDQUFVWSxZQUFWLENBQXVCLEtBQUtSLFlBQTVCLENBQXRCO0FBQ0EsYUFBS1UsTUFBTCxDQUFZQyxlQUFaLENBQTRCLElBQTVCLEVBQWtDSixhQUFsQztBQUNELE9BSEQsTUFHTztBQUNMLGFBQUtHLE1BQUwsQ0FBWUMsZUFBWixDQUE0QixJQUE1QixFQUFrQ1osUUFBbEM7QUFDRDtBQUNGOzs7d0JBL0JrQjtBQUNqQixhQUFPLEtBQUtILElBQUwsQ0FBVVUsV0FBVixDQUFzQixLQUFLVCxTQUFMLENBQWVlLFdBQXJDLENBQVA7QUFDRDs7O0VBaEJvQ2xCLE1BQU1tQixlOztBQWdEN0MsSUFBTUMsYUFBYSxtQkFBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUNNQyxTOzs7QUFDSjtBQUNBLHVCQUFlO0FBQUE7O0FBQUEsNklBQ1BELFVBRE87O0FBR2IsV0FBS0UsU0FBTCxHQUFpQixPQUFLQyxPQUFMLENBQWEsVUFBYixFQUF5QixFQUFFQyxVQUFVLFdBQVosRUFBekIsQ0FBakI7O0FBRUE7QUFDQSxXQUFLQyxLQUFMLEdBQWEsSUFBYjtBQUNBLFdBQUtDLFlBQUwsR0FBb0IsSUFBcEI7O0FBRUE7QUFDQSxXQUFLQyxVQUFMLEdBQWtCM0IsTUFBTTRCLFlBQU4sRUFBbEI7O0FBRUEsUUFBTUMsV0FBVztBQUNmQyxpQkFBVyxPQUFLSCxVQUFMLENBQWdCRyxTQURaO0FBRWZDLGNBQVEsT0FBS0osVUFBTCxDQUFnQkksTUFGVDtBQUdmN0IsWUFBTWE7QUFIUyxLQUFqQjs7QUFNQTtBQUNBLDhJQUFnQmMsUUFBaEI7QUFuQmE7QUFvQmQ7O0FBRUQ7Ozs7Ozs7Ozs4QkFLVUcsTyxFQUFTO0FBQ2pCO0FBQ0EsVUFBSUEsUUFBUUQsTUFBUixLQUFtQmhCLFNBQXZCLEVBQWtDO0FBQ2hDLFlBQUlpQixRQUFRRCxNQUFSLEdBQWlCLEtBQXJCLEVBQ0UsS0FBS0osVUFBTCxDQUFnQkksTUFBaEIsR0FBeUJDLFFBQVFELE1BQWpDLENBREYsS0FHRSxNQUFNLElBQUlFLEtBQUosZ0NBQXVDRCxRQUFRRCxNQUEvQyxDQUFOO0FBQ0g7O0FBRUQ7QUFDQSxVQUFJQyxRQUFRRixTQUFSLEtBQXNCZixTQUExQixFQUFxQztBQUNuQyxZQUFJaUIsUUFBUUYsU0FBUixHQUFvQixLQUF4QixFQUNFLEtBQUtILFVBQUwsQ0FBZ0JHLFNBQWhCLEdBQTRCRSxRQUFRRixTQUFwQyxDQURGLEtBR0UsTUFBTSxJQUFJRyxLQUFKLG1DQUEwQ0QsUUFBUUYsU0FBbEQsQ0FBTjtBQUNIOztBQUVEO0FBQ0EsVUFBTUksTUFBT0YsUUFBUTlCLElBQVIsS0FBaUJhLFNBQWxCLEdBQThCaUIsUUFBUTlCLElBQXRDLEdBQTRDLElBQXhELENBbEJpQixDQWtCNkM7QUFDOUQsVUFBTUEsT0FBUUEsU0FBU2EsU0FBVixHQUFzQm1CLEdBQXRCLEdBQTRCaEMsUUFBUWdDLEdBQWpELENBbkJpQixDQW1Cc0M7O0FBRXZEO0FBQ0EsVUFBR2hDLFFBQVEsQ0FBQyxLQUFLdUIsS0FBakIsRUFBd0I7QUFDdEIsYUFBS0EsS0FBTCxHQUFhLEtBQUtGLE9BQUwsQ0FBYSxNQUFiLENBQWI7QUFDQSxhQUFLRyxZQUFMLEdBQW9CLElBQUl6Qix3QkFBSixDQUE2QixLQUFLd0IsS0FBbEMsRUFBeUMsS0FBS0UsVUFBOUMsQ0FBcEI7QUFDRDs7QUFFREssY0FBUTlCLElBQVIsR0FBZUEsSUFBZjtBQUNBLDRJQUFnQjhCLE9BQWhCO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1E7QUFDTjs7QUFFQSxVQUFJLENBQUMsS0FBS0csVUFBVixFQUNFLEtBQUtDLElBQUw7O0FBRUYsV0FBS0MsS0FBTDtBQUNEOztBQUVEOzs7Ozs7OztBQXlCQTs7Ozs7Ozs7Ozs7Ozs7MEJBY01DLEcsRUFBS0MsSSxFQUFzRDtBQUFBLFVBQWhEQyxZQUFnRCx1RUFBakMsQ0FBQyxDQUFDLEtBQUtmLEtBQTBCO0FBQUEsVUFBbkJLLFNBQW1CLHVFQUFQLEtBQU87O0FBQy9ELFVBQU0zQixZQUFhcUMsZ0JBQWdCLEtBQUtmLEtBQXRCLEdBQStCLEtBQUtDLFlBQXBDLEdBQW1ELEtBQUtDLFVBQTFFO0FBQ0EsVUFBTWMsbUJBQW1CLElBQXpCO0FBQ0EsVUFBSUMsZUFBSjs7QUFFQSxVQUFHWixTQUFILEVBQWM7QUFDWjNCLGtCQUFVd0MsS0FBVixDQUFnQkwsR0FBaEIsRUFBcUJDLElBQXJCO0FBQ0QsT0FGRCxNQUVPO0FBQ0xHLGlCQUFTO0FBQ1BFLHVCQUFhLHFCQUFTTCxJQUFULEVBQWU7QUFDMUIsZ0JBQU1NLFFBQVFKLGlCQUFpQkssU0FBL0I7O0FBRUEsZ0JBQUdELFFBQVEsQ0FBWCxFQUNFRSxXQUFXVCxHQUFYLEVBQWdCLE9BQU9PLEtBQXZCLEVBQThCTixJQUE5QixFQURGLENBQ3VDO0FBRHZDLGlCQUdFRCxJQUFJQyxJQUFKO0FBQ0g7QUFSTSxTQUFUOztBQVdBcEMsa0JBQVVDLEdBQVYsQ0FBY3NDLE1BQWQsRUFBc0JILElBQXRCLEVBWkssQ0FZd0I7QUFDOUI7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7O3dCQVlJRyxNLEVBQVFILEksRUFBbUM7QUFBQSxVQUE3QkMsWUFBNkIsdUVBQWQsQ0FBQyxDQUFDLEtBQUtmLEtBQU87O0FBQzdDLFVBQU10QixZQUFhcUMsZ0JBQWdCLEtBQUtmLEtBQXRCLEdBQStCLEtBQUtDLFlBQXBDLEdBQW1ELEtBQUtDLFVBQTFFO0FBQ0F4QixnQkFBVUMsR0FBVixDQUFjc0MsTUFBZCxFQUFzQkgsSUFBdEI7QUFDRDs7QUFFRDs7Ozs7OzsyQkFJT0csTSxFQUFRO0FBQ2IsVUFBSSxLQUFLZixVQUFMLENBQWdCcUIsR0FBaEIsQ0FBb0JOLE1BQXBCLENBQUosRUFDRSxLQUFLZixVQUFMLENBQWdCc0IsTUFBaEIsQ0FBdUJQLE1BQXZCLEVBREYsS0FFSyxJQUFJLEtBQUtoQixZQUFMLElBQXFCLEtBQUtBLFlBQUwsQ0FBa0JzQixHQUFsQixDQUFzQk4sTUFBdEIsQ0FBekIsRUFDSCxLQUFLaEIsWUFBTCxDQUFrQnVCLE1BQWxCLENBQXlCUCxNQUF6QjtBQUNIOztBQUVEOzs7Ozs7NEJBR1E7QUFDTixVQUFHLEtBQUtoQixZQUFSLEVBQ0UsS0FBS0EsWUFBTCxDQUFrQndCLEtBQWxCOztBQUVGLFdBQUt2QixVQUFMLENBQWdCdUIsS0FBaEI7QUFDRDs7O3dCQS9GZTtBQUNkLGFBQU8sS0FBS3ZCLFVBQUwsQ0FBZ0JULFdBQXZCO0FBQ0Q7O0FBRUQ7Ozs7Ozt3QkFHZTtBQUNiLFVBQUcsS0FBS1EsWUFBUixFQUNFLE9BQU8sS0FBS0EsWUFBTCxDQUFrQlIsV0FBekI7O0FBRUYsYUFBT0gsU0FBUDtBQUNEOztBQUVEOzs7Ozs7O3dCQUlnQjtBQUNkLGFBQU8sS0FBS1ksVUFBTCxDQUFnQlQsV0FBaEIsR0FBOEJsQixNQUFNbUQsWUFBTixDQUFtQmpDLFdBQXhEO0FBQ0Q7Ozs7O0FBNEVGOztBQUVELHlCQUFla0MsUUFBZixDQUF3QmhDLFVBQXhCLEVBQW9DQyxTQUFwQzs7a0JBRWVBLFMiLCJmaWxlIjoiU2NoZWR1bGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY2xhc3MgX1N5bmNUaW1lU2NoZWR1bGluZ1F1ZXVlIGV4dGVuZHMgYXVkaW8uU2NoZWR1bGluZ1F1ZXVlIHtcbiAgY29uc3RydWN0b3Ioc3luYywgc2NoZWR1bGVyKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3luYyA9IHN5bmM7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgdGhpcy5zY2hlZHVsZXIuYWRkKHRoaXMsIEluZmluaXR5KTtcbiAgICB0aGlzLm5leHRTeW5jVGltZSA9IEluZmluaXR5O1xuXG4gICAgLy8gY2FsbCB0aGlzLnJlc3luYyBpbiBzeW5jIGNhbGxiYWNrXG4gICAgdGhpcy5yZXN5bmMgPSB0aGlzLnJlc3luYy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3luYy5hZGRMaXN0ZW5lcih0aGlzLnJlc3luYyk7XG4gIH1cblxuICBnZXQgY3VycmVudFRpbWUgKCkge1xuICAgIHJldHVybiB0aGlzLnN5bmMuZ2V0U3luY1RpbWUodGhpcy5zY2hlZHVsZXIuY3VycmVudFRpbWUpO1xuICB9XG5cbiAgYWR2YW5jZVRpbWUoYXVkaW9UaW1lKSB7XG4gICAgY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoYXVkaW9UaW1lKTtcbiAgICBjb25zdCBuZXh0U3luY1RpbWUgPSBzdXBlci5hZHZhbmNlVGltZSh0aGlzLm5leHRTeW5jVGltZSk7XG4gICAgY29uc3QgbmV4dEF1ZGlvVGltZSA9IHRoaXMuc3luYy5nZXRBdWRpb1RpbWUobmV4dFN5bmNUaW1lKTtcblxuICAgIHRoaXMubmV4dFN5bmNUaW1lID0gbmV4dFN5bmNUaW1lO1xuXG4gICAgcmV0dXJuIG5leHRBdWRpb1RpbWU7XG4gIH1cblxuICByZXNldFRpbWUoc3luY1RpbWUpIHtcbiAgICBpZihzeW5jVGltZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcblxuICAgIHRoaXMubmV4dFN5bmNUaW1lID0gc3luY1RpbWU7XG5cbiAgICBjb25zdCBhdWRpb1RpbWUgPSB0aGlzLnN5bmMuZ2V0QXVkaW9UaW1lKHN5bmNUaW1lKTtcbiAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVRpbWUodGhpcywgYXVkaW9UaW1lKTtcbiAgfVxuXG4gIHJlc3luYygpIHtcbiAgICBpZiAodGhpcy5uZXh0U3luY1RpbWUgIT09IEluZmluaXR5KSB7XG4gICAgICBjb25zdCBuZXh0QXVkaW9UaW1lID0gdGhpcy5zeW5jLmdldEF1ZGlvVGltZSh0aGlzLm5leHRTeW5jVGltZSk7XG4gICAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVRpbWUodGhpcywgbmV4dEF1ZGlvVGltZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWFzdGVyLnJlc2V0RW5naW5lVGltZSh0aGlzLCBJbmZpbml0eSk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzY2hlZHVsZXInO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ3NjaGVkdWxlcidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIHByb3ZpZGVzIGEgc2NoZWR1bGVyIHN5bmNocm9uaXNlZCBhbW9uZyBhbGwgY2xpZW50IHVzaW5nIHRoZVxuICogW2BzeW5jYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlN5bmN9IHNlcnZpY2UuIEl0IGludGVybmFsbHkgdXNlcyB0aGVcbiAqIHNjaGVkdWxlciBwcm92aWRlZCBieSB0aGUgW2B3YXZlc2pzYF17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3dhdmVzanMvYXVkaW99XG4gKiBsaWJyYXJ5LlxuICpcbiAqIFdoZW4gc2V0dGluZyB0aGUgb3B0aW9uIGAnc3luYydgIHRvIGAnZmFsc2UnYCwgdGhlIHNjaGVkdWxpbmcgaXMgbG9jYWxcbiAqICh3aXRob3V0IHN1bmNocm9uaXphdGlvbiB0byB0aGUgb3RoZXIgY2xpZW50cykgYW5kIHRoZSBgJ3N5bmMnYCBzZXJ2aWNlIGlzXG4gKiBub3QgcmVxdWlyZWQgKGF0dGVudGlvbjogc2luY2UgaXRzIGRlZmF1bHQgdmFsdWUgaXMgYCd0cnVlJ2AsIGFsbCByZXF1ZXN0c1xuICogb2YgdGhlIGAnc2NoZWR1bGVyJ2Agc2VydmljZSBpbiB0aGUgYXBwbGljYXRpb24gaGF2ZSB0byBleHBsaWNpdGx5IHNwZWNpZnlcbiAqIHRoZSBgJ3N5bmMnYCBvcHRpb24gYXMgYCdmYWxzZSdgIHRvIGFzc3VyZSB0aGF0IHRoZSBgJ3N5bmMnYCBzZXJ2aWNlIGlzIG5vdFxuICogZW5hYmxlZCkuXG4gKlxuICogV2hpbGUgdGhpcyBzZXJ2aWNlIGhhcyBubyBkaXJlY3Qgc2VydmVyIGNvdW50ZXJwYXJ0LCBpdHMgZGVwZW5kZW5jeSBvbiB0aGVcbiAqIFtgc3luY2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TeW5jfSBzZXJ2aWNlIG1heSByZXF1aXJlIHRoZSBleGlzdGVuY2VcbiAqIG9mIGEgc2VydmVyLiBJbiBhZGRpdGlvbiwgdGhlIHNlcnZpY2UgcmVxdWlyZXMgYSBkZXZpY2Ugd2l0aCBgd2ViLWF1ZGlvYCBhYmlsaXR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucGVyaW9kXSAtIFBlcmlvZCBvZiB0aGUgc2NoZWR1bGVyIChkZWZhdXRzIHRvIGN1cnJlbnQgdmFsdWUpLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmxvb2thaGVhZF0gLSBMb29rYWhlYWQgb2YgdGhlIHNjaGVkdWxlciAoZGVmYXV0cyB0byBjdXJyZW50IHZhbHVlKS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc3luYyA9IHRydWVdIC0gRW5hYmxlIHN5bmNocm9uaXplZCBzY2hlZHVsaW5nLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBzZWUgW2B3YXZlc0F1ZGlvLlNjaGVkdWxlcmBde0BsaW5rIGh0dHA6Ly93YXZlc2pzLmdpdGh1Yi5pby9hdWRpby8jYXVkaW8tc2NoZWR1bGVyfVxuICogQHNlZSBbYHBsYXRmb3JtYCBzZXJ2aWNlXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm19XG4gKiBAc2VlIFtgc3luY2Agc2VydmljZV17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlN5bmN9XG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5zY2hlZHVsZXIgPSB0aGlzLnJlcXVpcmUoJ3NjaGVkdWxlcicsIHsgc3luYzogdHJ1ZSB9KTtcbiAqXG4gKiAvLyB3aGVuIHRoZSBleHBlcmllbmNlIGhhcyBzdGFydGVkXG4gKiBjb25zdCBuZXh0U3luY1RpbWUgPSB0aGlzLnNjaGVkdWxlci5nZXRTeW5jVGltZSgpICsgMjtcbiAqIHRoaXMuc2NoZWR1bGVyLmFkZCh0aW1lRW5naW5lLCBuZXh0U3luY1RpbWUsIHRydWUpO1xuICovXG5jbGFzcyBTY2hlZHVsZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICB0aGlzLl9wbGF0Zm9ybSA9IHRoaXMucmVxdWlyZSgncGxhdGZvcm0nLCB7IGZlYXR1cmVzOiAnd2ViLWF1ZGlvJyB9KTtcblxuICAgIC8vIGluaXRpYWxpemUgc3luYyBvcHRpb25cbiAgICB0aGlzLl9zeW5jID0gbnVsbDtcbiAgICB0aGlzLl9zeW5jZWRRdWV1ZSA9IG51bGw7XG5cbiAgICAvLyBnZXQgYXVkaW8gdGltZSBiYXNlZCBzY2hlZHVsZXJcbiAgICB0aGlzLl9zY2hlZHVsZXIgPSBhdWRpby5nZXRTY2hlZHVsZXIoKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgbG9va2FoZWFkOiB0aGlzLl9zY2hlZHVsZXIubG9va2FoZWFkLFxuICAgICAgcGVyaW9kOiB0aGlzLl9zY2hlZHVsZXIucGVyaW9kLFxuICAgICAgc3luYzogdW5kZWZpbmVkLFxuICAgIH07XG5cbiAgICAvLyBjYWxsIHN1cGVyLmNvbmZpZ3VyZSAoYWN0aXZhdGUgc3luYyBvcHRpb24gb25seSBpZiByZXF1aXJlZClcbiAgICBzdXBlci5jb25maWd1cmUoZGVmYXVsdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIGRlZmF1bHQgYGNvbmZpZ3VyZWAgdG8gY29uZmlndXJlIHRoZSBzY2hlZHVsZXIuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gYXBwbHkgdG8gdGhlIHNlcnZpY2UuXG4gICAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIC8vIGNoZWNrIGFuZCBzZXQgc2NoZWR1bGVyIHBlcmlvZCBvcHRpb25cbiAgICBpZiAob3B0aW9ucy5wZXJpb2QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKG9wdGlvbnMucGVyaW9kID4gMC4wMTApXG4gICAgICAgIHRoaXMuX3NjaGVkdWxlci5wZXJpb2QgPSBvcHRpb25zLnBlcmlvZDtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNjaGVkdWxlciBwZXJpb2Q6ICR7b3B0aW9ucy5wZXJpb2R9YCk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgYW5kIHNldCBzY2hlZHVsZXIgbG9va2FoZWFkIG9wdGlvblxuICAgIGlmIChvcHRpb25zLmxvb2thaGVhZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAob3B0aW9ucy5sb29rYWhlYWQgPiAwLjAxMClcbiAgICAgICAgdGhpcy5fc2NoZWR1bGVyLmxvb2thaGVhZCA9IG9wdGlvbnMubG9va2FoZWFkO1xuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc2NoZWR1bGVyIGxvb2thaGVhZDogJHtvcHRpb25zLmxvb2thaGVhZH1gKTtcbiAgICB9XG5cbiAgICAvLyBzZXQgc3luYyBvcHRpb25cbiAgICBjb25zdCBvcHQgPSAob3B0aW9ucy5zeW5jICE9PSB1bmRlZmluZWQpPyBvcHRpb25zLnN5bmM6IHRydWU7IC8vIGRlZmF1bHQgaXMgdHJ1ZVxuICAgIGNvbnN0IHN5bmMgPSAoc3luYyA9PT0gdW5kZWZpbmVkKT8gb3B0OiAoc3luYyB8fCBvcHQpOyAvLyB0cnV0aCB3aWxsIHByZXZhaWxcblxuICAgIC8vIGVuYWJsZSBzeW5jIGF0IGZpcnN0IHJlcXVlc3Qgd2l0aCBvcHRpb24gc2V0IHRvIHRydWVcbiAgICBpZihzeW5jICYmICF0aGlzLl9zeW5jKSB7XG4gICAgICB0aGlzLl9zeW5jID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG4gICAgICB0aGlzLl9zeW5jZWRRdWV1ZSA9IG5ldyBfU3luY1RpbWVTY2hlZHVsaW5nUXVldWUodGhpcy5fc3luYywgdGhpcy5fc2NoZWR1bGVyKVxuICAgIH1cblxuICAgIG9wdGlvbnMuc3luYyA9IHN5bmM7XG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgYXVkaW8gdGltZSBvZiB0aGUgc2NoZWR1bGVyLlxuICAgKi9cbiAgZ2V0IGF1ZGlvVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2NoZWR1bGVyLmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgc3luYyB0aW1lIG9mIHRoZSBzY2hlZHVsZXIuXG4gICAqL1xuICBnZXQgc3luY1RpbWUoKSB7XG4gICAgaWYodGhpcy5fc3luY2VkUXVldWUpXG4gICAgICByZXR1cm4gdGhpcy5fc3luY2VkUXVldWUuY3VycmVudFRpbWU7XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIERpZmZlcmVuY2UgYmV0d2VlbiB0aGUgc2NoZWR1bGVyJ3MgbG9naWNhbCBhdWRpbyB0aW1lIGFuZCB0aGUgYGN1cnJlbnRUaW1lYFxuICAgKiBvZiB0aGUgYXVkaW8gY29udGV4dC5cbiAgICovXG4gIGdldCBkZWx0YVRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NjaGVkdWxlci5jdXJyZW50VGltZSAtIGF1ZGlvLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsIGEgZnVuY3Rpb24gYXQgYSBnaXZlbiB0aW1lLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW4gLSBGdW5jdGlvbiB0byBiZSBkZWZlcnJlZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBUaGUgdGltZSBhdCB3aGljaCB0aGUgZnVuY3Rpb24gc2hvdWxkIGJlIGV4ZWN1dGVkLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtzeW5jaHJvbml6ZWQ9dHJ1ZV0gLSBEZWZpbmVzIHdoZXRoZXIgdGhlIGZ1bmN0aW9uIGNhbGwgc2hvdWxkIGJlXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2xvb2thaGVhZD1mYWxzZV0gLSBEZWZpbmVzIHdoZXRoZXIgdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZCBhbnRpY2lwYXRlZFxuICAgKiAoZS5nLiBmb3IgYXVkaW8gZXZlbnRzKSBvciBwcmVjaXNlbHkgYXQgdGhlIGdpdmVuIHRpbWUgKGRlZmF1bHQpLlxuICAgKlxuICAgKiBBdHRlbnRpb246IFRoZSBhY3R1YWwgc3luY2hyb25pemF0aW9uIG9mIHRoZSBzY2hlZHVsZWQgZnVuY3Rpb24gZGVwZW5kcyBub3RcbiAgICogb25seSBvZiB0aGUgYCdzeW5jaHJvbml6ZWQnYCBvcHRpb24sIGJ1dCBhbHNvIG9mIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZVxuICAgKiBzY2hlZHVsZXIgc2VydmljZS4gSG93ZXZlciwgdG8gYXNzdXJlIGEgdGhlIGRlc2lyZWQgc3luY2hyb25pemF0aW9uLCB0aGVcbiAgICogb3B0aW9uIGhhcyB0byBiZSBwcm9wZXJseSBzcGVjaWZpZWQuIFdpdGhvdXQgc3BlY2lmeWluZyB0aGUgb3B0aW9uLFxuICAgKiBzeW5jaHJvbml6ZWQgc2NoZWR1bGluZyB3aWxsIGJlIHVzZWQgd2hlbiBhdmFpbGFibGUuXG4gICAqL1xuICBkZWZlcihmdW4sIHRpbWUsIHN5bmNocm9uaXplZCA9ICEhdGhpcy5fc3luYywgbG9va2FoZWFkID0gZmFsc2UpIHtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSAoc3luY2hyb25pemVkICYmIHRoaXMuX3N5bmMpID8gdGhpcy5fc3luY2VkUXVldWUgOiB0aGlzLl9zY2hlZHVsZXI7XG4gICAgY29uc3Qgc2NoZWR1bGVyU2VydmljZSA9IHRoaXM7XG4gICAgbGV0IGVuZ2luZTtcblxuICAgIGlmKGxvb2thaGVhZCkge1xuICAgICAgc2NoZWR1bGVyLmRlZmVyKGZ1biwgdGltZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVuZ2luZSA9IHtcbiAgICAgICAgYWR2YW5jZVRpbWU6IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICAgICAgICBjb25zdCBkZWx0YSA9IHNjaGVkdWxlclNlcnZpY2UuZGVsdGFUaW1lO1xuXG4gICAgICAgICAgaWYoZGVsdGEgPiAwKVxuICAgICAgICAgICAgc2V0VGltZW91dChmdW4sIDEwMDAgKiBkZWx0YSwgdGltZSk7IC8vIGJyaWRnZSBzY2hlZHVsZXIgbG9va2FoZWFkIHdpdGggdGltZW91dFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZ1bih0aW1lKTtcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIHNjaGVkdWxlci5hZGQoZW5naW5lLCB0aW1lKTsgLy8gYWRkIHdpdGhvdXQgY2hlY2tzXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHRpbWUgZW5naW5lIHRvIHRoZSBxdWV1ZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZW5naW5lIC0gRW5naW5lIHRvIHNjaGVkdWxlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIFRoZSB0aW1lIGF0IHdoaWNoIHRoZSBmdW5jdGlvbiBzaG91bGQgYmUgZXhlY3V0ZWQuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3N5bmNocm9uaXplZD10cnVlXSAtIERlZmluZXMgd2hldGhlciB0aGUgZW5naW5lIHNob3VsZCBiZSBzeW5jaHJvbml6ZWQgb3Igbm90LlxuICAgKlxuICAgKiBBdHRlbnRpb246IFRoZSBhY3R1YWwgc3luY2hyb25pemF0aW9uIG9mIHRoZSBzY2hlZHVsZWQgdGltZSBlbmdpbmUgZGVwZW5kc1xuICAgKiBub3Qgb25seSBvZiB0aGUgYCdzeW5jaHJvbml6ZWQnYCBvcHRpb24sIGJ1dCBhbHNvIG9mIHRoZSBjb25maWd1cmF0aW9uIG9mXG4gICAqIHRoZSBzY2hlZHVsZXIgc2VydmljZS4gSG93ZXZlciwgdG8gYXNzdXJlIGEgdGhlIGRlc2lyZWQgc3luY2hyb25pemF0aW9uLFxuICAgKiB0aGUgb3B0aW9uIGhhcyB0byBiZSBwcm9wZXJseSBzcGVjaWZpZWQuIFdpdGhvdXQgc3BlY2lmeWluZyB0aGUgb3B0aW9uLFxuICAgKiBzeW5jaHJvbml6ZWQgc2NoZWR1bGluZyB3aWxsIGJlIHVzZWQgd2hlbiBhdmFpbGFibGUuXG4gICAqL1xuICBhZGQoZW5naW5lLCB0aW1lLCBzeW5jaHJvbml6ZWQgPSAhIXRoaXMuX3N5bmMpIHtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSAoc3luY2hyb25pemVkICYmIHRoaXMuX3N5bmMpID8gdGhpcy5fc3luY2VkUXVldWUgOiB0aGlzLl9zY2hlZHVsZXI7XG4gICAgc2NoZWR1bGVyLmFkZChlbmdpbmUsIHRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZ2l2ZW4gZW5naW5lIGZyb20gdGhlIHF1ZXVlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBlbmdpbmUgLSBFbmdpbmUgdG8gcmVtb3ZlIGZyb20gdGhlIHNjaGVkdWxlci5cbiAgICovXG4gIHJlbW92ZShlbmdpbmUpIHtcbiAgICBpZiAodGhpcy5fc2NoZWR1bGVyLmhhcyhlbmdpbmUpKVxuICAgICAgdGhpcy5fc2NoZWR1bGVyLnJlbW92ZShlbmdpbmUpO1xuICAgIGVsc2UgaWYgKHRoaXMuX3N5bmNlZFF1ZXVlICYmIHRoaXMuX3N5bmNlZFF1ZXVlLmhhcyhlbmdpbmUpKVxuICAgICAgdGhpcy5fc3luY2VkUXVldWUucmVtb3ZlKGVuZ2luZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBzY2hlZHVsZWQgZnVuY3Rpb25zIGFuZCB0aW1lIGVuZ2luZXMgKHN5bmNocm9uaXplZCBvciBub3QpIGZyb20gdGhlIHNjaGVkdWxlci5cbiAgICovXG4gIGNsZWFyKCkge1xuICAgIGlmKHRoaXMuX3N5bmNlZFF1ZXVlKVxuICAgICAgdGhpcy5fc3luY2VkUXVldWUuY2xlYXIoKTtcblxuICAgIHRoaXMuX3NjaGVkdWxlci5jbGVhcigpO1xuICB9XG59O1xuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTY2hlZHVsZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBTY2hlZHVsZXI7XG4iXX0=