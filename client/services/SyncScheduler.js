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

var _wavesMasters = require('waves-masters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    var _this = (0, _possibleConstructorReturn3.default)(this, (SyncScheduler.__proto__ || (0, _getPrototypeOf2.default)(SyncScheduler)).call(this, SERVICE_ID, false));

    _this._sync = _this.require('sync');
    _this._scheduler = null;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(SyncScheduler, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)(SyncScheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(SyncScheduler.prototype), 'start', this).call(this);

      // init scheduler based on sync-time
      var getTimeFunction = function getTimeFunction() {
        return _this2._sync.getSyncTime();
      };
      this._scheduler = new _wavesMasters.Scheduler(getTimeFunction);

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

      var scheduler = this._scheduler;
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
      this._scheduler.add(engine, time);
    }

    /**
     * Remove the given engine from the queue.
     *
     * @param {Function} engine - Engine to remove from the scheduler.
     */

  }, {
    key: 'remove',
    value: function remove(engine) {
      this._scheduler.remove(engine);
    }

    /**
     * Remove all scheduled functions and time engines from the scheduler.
     */

  }, {
    key: 'clear',
    value: function clear() {
      this._scheduler.clear();
    }
  }, {
    key: 'audioTime',
    get: function get() {
      return this._sync.getAudioTime(this._scheduler.currentTime);
    }

    /**
     * Current sync time of the scheduler.
     * @instance
     * @type {Number}
     */

  }, {
    key: 'syncTime',
    get: function get() {
      return this._scheduler.currentTime;
    }

    /**
     * Current sync time of the scheduler (alias `this.syncTime`).
     * @instance
     * @type {Number}
     */

  }, {
    key: 'currentTime',
    get: function get() {
      return this._scheduler.currentTime;
    }

    /**
     * Difference between the scheduler's logical time and the current `syncTime`
     * @instance
     * @type {Number}
     */

  }, {
    key: 'deltaTime',
    get: function get() {
      return this._scheduler.currentTime - this._sync.getSyncTime();
    }
  }]);
  return SyncScheduler;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SyncScheduler);

exports.default = SyncScheduler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmNTY2hlZHVsZXIuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIlN5bmNTY2hlZHVsZXIiLCJfc3luYyIsInJlcXVpcmUiLCJfc2NoZWR1bGVyIiwiZ2V0VGltZUZ1bmN0aW9uIiwiZ2V0U3luY1RpbWUiLCJTY2hlZHVsZXIiLCJyZWFkeSIsImF1ZGlvVGltZSIsInN5bmNUaW1lIiwiZ2V0QXVkaW9UaW1lIiwiZnVuIiwidGltZSIsImxvb2thaGVhZCIsInNjaGVkdWxlciIsInNjaGVkdWxlclNlcnZpY2UiLCJlbmdpbmUiLCJkZWZlciIsImFkdmFuY2VUaW1lIiwiZGVsdGEiLCJkZWx0YVRpbWUiLCJzZXRUaW1lb3V0IiwiYWRkIiwicmVtb3ZlIiwiY2xlYXIiLCJjdXJyZW50VGltZSIsIlNlcnZpY2UiLCJzZXJ2aWNlTWFuYWdlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxhQUFhLHdCQUFuQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNkJNQyxhOzs7QUFDSjtBQUNBLDJCQUFlO0FBQUE7O0FBQUEsb0pBQ1BELFVBRE8sRUFDSyxLQURMOztBQUdiLFVBQUtFLEtBQUwsR0FBYSxNQUFLQyxPQUFMLENBQWEsTUFBYixDQUFiO0FBQ0EsVUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUphO0FBS2Q7O0FBRUQ7Ozs7OzRCQUNRO0FBQUE7O0FBQ047O0FBRUE7QUFDQSxVQUFNQyxrQkFBa0IsU0FBbEJBLGVBQWtCO0FBQUEsZUFBTSxPQUFLSCxLQUFMLENBQVdJLFdBQVgsRUFBTjtBQUFBLE9BQXhCO0FBQ0EsV0FBS0YsVUFBTCxHQUFrQixJQUFJRyx1QkFBSixDQUFjRixlQUFkLENBQWxCOztBQUVBLFdBQUtHLEtBQUw7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQW9DQTs7Ozs7OzJDQU11QkMsUyxFQUFXO0FBQ2hDLGFBQU8sS0FBS1AsS0FBTCxDQUFXSSxXQUFYLENBQXVCRyxTQUF2QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzsyQ0FNdUJDLFEsRUFBVTtBQUMvQixhQUFPLEtBQUtSLEtBQUwsQ0FBV1MsWUFBWCxDQUF3QkQsUUFBeEIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7OzswQkFRTUUsRyxFQUFLQyxJLEVBQXlCO0FBQUEsVUFBbkJDLFNBQW1CLHVFQUFQLEtBQU87O0FBQ2xDLFVBQU1DLFlBQVksS0FBS1gsVUFBdkI7QUFDQSxVQUFNWSxtQkFBbUIsSUFBekI7QUFDQSxVQUFJQyxlQUFKOztBQUVBLFVBQUlILFNBQUosRUFBZTtBQUNiQyxrQkFBVUcsS0FBVixDQUFnQk4sR0FBaEIsRUFBcUJDLElBQXJCO0FBQ0QsT0FGRCxNQUVPO0FBQ0xJLGlCQUFTO0FBQ1BFLHVCQUFhLHFCQUFTTixJQUFULEVBQWU7QUFDMUIsZ0JBQU1PLFFBQVFKLGlCQUFpQkssU0FBL0I7O0FBRUEsZ0JBQUlELFFBQVEsQ0FBWixFQUNFRSxXQUFXVixHQUFYLEVBQWdCLE9BQU9RLEtBQXZCLEVBQThCUCxJQUE5QixFQURGLENBQ3VDO0FBRHZDLGlCQUdFRCxJQUFJQyxJQUFKO0FBQ0g7QUFSTSxTQUFUOztBQVdBRSxrQkFBVVEsR0FBVixDQUFjTixNQUFkLEVBQXNCSixJQUF0QixFQVpLLENBWXdCO0FBQzlCO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozt3QkFNSUksTSxFQUFRSixJLEVBQU07QUFDaEIsV0FBS1QsVUFBTCxDQUFnQm1CLEdBQWhCLENBQW9CTixNQUFwQixFQUE0QkosSUFBNUI7QUFDRDs7QUFFRDs7Ozs7Ozs7MkJBS09JLE0sRUFBUTtBQUNiLFdBQUtiLFVBQUwsQ0FBZ0JvQixNQUFoQixDQUF1QlAsTUFBdkI7QUFDRDs7QUFFRDs7Ozs7OzRCQUdRO0FBQ04sV0FBS2IsVUFBTCxDQUFnQnFCLEtBQWhCO0FBQ0Q7Ozt3QkExR2U7QUFDZCxhQUFPLEtBQUt2QixLQUFMLENBQVdTLFlBQVgsQ0FBd0IsS0FBS1AsVUFBTCxDQUFnQnNCLFdBQXhDLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS2U7QUFDYixhQUFPLEtBQUt0QixVQUFMLENBQWdCc0IsV0FBdkI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS2tCO0FBQ2hCLGFBQU8sS0FBS3RCLFVBQUwsQ0FBZ0JzQixXQUF2QjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLZ0I7QUFDZCxhQUFPLEtBQUt0QixVQUFMLENBQWdCc0IsV0FBaEIsR0FBOEIsS0FBS3hCLEtBQUwsQ0FBV0ksV0FBWCxFQUFyQztBQUNEOzs7RUF0RHlCcUIsaUI7O0FBc0k1QkMseUJBQWVDLFFBQWYsQ0FBd0I3QixVQUF4QixFQUFvQ0MsYUFBcEM7O2tCQUVlQSxhIiwiZmlsZSI6IlN5bmNTY2hlZHVsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHsgU2NoZWR1bGVyIH0gZnJvbSAnd2F2ZXMtbWFzdGVycyc7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzeW5jLXNjaGVkdWxlcic7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnc3luYy1zY2hlZHVsZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoZSBgc3luYy1zY2hlZHVsZXJgIHByb3ZpZGVzIGEgc2NoZWR1bGVyIHN5bmNocm9uaXNlZCBhbW9uZyBhbGwgY2xpZW50IHVzaW5nIHRoZVxuICogW2BzeW5jYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlN5bmN9IHNlcnZpY2UuXG4gKlxuICogV2hpbGUgdGhpcyBzZXJ2aWNlIGhhcyBubyBkaXJlY3Qgc2VydmVyIGNvdW50ZXJwYXJ0LCBpdHMgZGVwZW5kZW5jeSBvbiB0aGVcbiAqIFtgc3luY2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TeW5jfSBzZXJ2aWNlIHdoaWNoIHJlcXVpcmVzIHRoZVxuICogZXhpc3RlbmNlIG9mIGEgc2VydmVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucGVyaW9kXSAtIFBlcmlvZCBvZiB0aGUgc2NoZWR1bGVyIChkZWZhdXRzIHRvXG4gKiAgY3VycmVudCB2YWx1ZSkuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubG9va2FoZWFkXSAtIExvb2thaGVhZCBvZiB0aGUgc2NoZWR1bGVyIChkZWZhdXRzXG4gKiAgdG8gY3VycmVudCB2YWx1ZSkuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQHNlZSBbYHdhdmVzQXVkaW8uU2NoZWR1bGVyYF17QGxpbmsgaHR0cDovL3dhdmVzanMuZ2l0aHViLmlvL2F1ZGlvLyNhdWRpby1zY2hlZHVsZXJ9XG4gKiBAc2VlIFtgcGxhdGZvcm1gIHNlcnZpY2Vde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAqIEBzZWUgW2BzeW5jYCBzZXJ2aWNlXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU3luY31cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnN5bmNTY2hlZHVsZXIgPSB0aGlzLnJlcXVpcmUoJ3NjaGVkdWxlcicpO1xuICpcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWRcbiAqIGNvbnN0IG5leHRTeW5jVGltZSA9IHRoaXMuc3luY1NjaGVkdWxlci5jdXJyZW50ICsgMjtcbiAqIHRoaXMuc3luY1NjaGVkdWxlci5hZGQodGltZUVuZ2luZSwgbmV4dFN5bmNUaW1lKTtcbiAqL1xuY2xhc3MgU3luY1NjaGVkdWxlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICB0aGlzLl9zeW5jID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG4gICAgdGhpcy5fc2NoZWR1bGVyID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgLy8gaW5pdCBzY2hlZHVsZXIgYmFzZWQgb24gc3luYy10aW1lXG4gICAgY29uc3QgZ2V0VGltZUZ1bmN0aW9uID0gKCkgPT4gdGhpcy5fc3luYy5nZXRTeW5jVGltZSgpO1xuICAgIHRoaXMuX3NjaGVkdWxlciA9IG5ldyBTY2hlZHVsZXIoZ2V0VGltZUZ1bmN0aW9uKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdXJyZW50IGF1ZGlvIHRpbWUgb2YgdGhlIHNjaGVkdWxlci5cbiAgICogQGluc3RhbmNlXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgYXVkaW9UaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldEF1ZGlvVGltZSh0aGlzLl9zY2hlZHVsZXIuY3VycmVudFRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgc3luYyB0aW1lIG9mIHRoZSBzY2hlZHVsZXIuXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHN5bmNUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zY2hlZHVsZXIuY3VycmVudFRpbWU7XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCBzeW5jIHRpbWUgb2YgdGhlIHNjaGVkdWxlciAoYWxpYXMgYHRoaXMuc3luY1RpbWVgKS5cbiAgICogQGluc3RhbmNlXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgY3VycmVudFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaWZmZXJlbmNlIGJldHdlZW4gdGhlIHNjaGVkdWxlcidzIGxvZ2ljYWwgdGltZSBhbmQgdGhlIGN1cnJlbnQgYHN5bmNUaW1lYFxuICAgKiBAaW5zdGFuY2VcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBkZWx0YVRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NjaGVkdWxlci5jdXJyZW50VGltZSAtIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgc3luYyB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gZ2l2ZW4gYXVkaW8gdGltZS5cbiAgICpcbiAgICogQHBhcmFtICB7TnVtYmVyfSBhdWRpb1RpbWUgLSBhdWRpbyB0aW1lLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gc3luYyB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gZ2l2ZW4gYXVkaW8gdGltZS5cbiAgICovXG4gIGdldFN5bmNUaW1lQXRBdWRpb1RpbWUoYXVkaW9UaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUoYXVkaW9UaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYXVkaW8gdGltZSBjb3JyZXNwb25kaW5nIHRvIGdpdmVuIHN5bmMgdGltZS5cbiAgICpcbiAgICogQHBhcmFtICB7TnVtYmVyfSBzeW5jVGltZSAtIHN5bmMgdGltZS5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIGF1ZGlvIHRpbWUgY29ycmVzcG9uZGluZyB0byBnaXZlbiBzeW5jIHRpbWUuXG4gICAqL1xuICBnZXRBdWRpb1RpbWVBdFN5bmNUaW1lKHN5bmNUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0QXVkaW9UaW1lKHN5bmNUaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsIGEgZnVuY3Rpb24gYXQgYSBnaXZlbiB0aW1lLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW4gLSBGdW5jdGlvbiB0byBiZSBkZWZlcnJlZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBUaGUgdGltZSBhdCB3aGljaCB0aGUgZnVuY3Rpb24gc2hvdWxkIGJlIGV4ZWN1dGVkLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtsb29rYWhlYWQ9ZmFsc2VdIC0gRGVmaW5lcyB3aGV0aGVyIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWRcbiAgICogIGFudGljaXBhdGVkIChlLmcuIGZvciBhdWRpbyBldmVudHMpIG9yIHByZWNpc2VseSBhdCB0aGUgZ2l2ZW4gdGltZSAoZGVmYXVsdCkuXG4gICAqL1xuICBkZWZlcihmdW4sIHRpbWUsIGxvb2thaGVhZCA9IGZhbHNlKSB7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gdGhpcy5fc2NoZWR1bGVyO1xuICAgIGNvbnN0IHNjaGVkdWxlclNlcnZpY2UgPSB0aGlzO1xuICAgIGxldCBlbmdpbmU7XG5cbiAgICBpZiAobG9va2FoZWFkKSB7XG4gICAgICBzY2hlZHVsZXIuZGVmZXIoZnVuLCB0aW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW5naW5lID0ge1xuICAgICAgICBhZHZhbmNlVGltZTogZnVuY3Rpb24odGltZSkge1xuICAgICAgICAgIGNvbnN0IGRlbHRhID0gc2NoZWR1bGVyU2VydmljZS5kZWx0YVRpbWU7XG5cbiAgICAgICAgICBpZiAoZGVsdGEgPiAwKVxuICAgICAgICAgICAgc2V0VGltZW91dChmdW4sIDEwMDAgKiBkZWx0YSwgdGltZSk7IC8vIGJyaWRnZSBzY2hlZHVsZXIgbG9va2FoZWFkIHdpdGggdGltZW91dFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZ1bih0aW1lKTtcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIHNjaGVkdWxlci5hZGQoZW5naW5lLCB0aW1lKTsgLy8gYWRkIHdpdGhvdXQgY2hlY2tzXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHRpbWUgZW5naW5lIHRvIHRoZSBxdWV1ZS5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZW5naW5lIC0gRW5naW5lIHRvIHNjaGVkdWxlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIFRoZSB0aW1lIGF0IHdoaWNoIHRoZSBmdW5jdGlvbiBzaG91bGQgYmUgZXhlY3V0ZWQuXG4gICAqL1xuICBhZGQoZW5naW5lLCB0aW1lKSB7XG4gICAgdGhpcy5fc2NoZWR1bGVyLmFkZChlbmdpbmUsIHRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZ2l2ZW4gZW5naW5lIGZyb20gdGhlIHF1ZXVlLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBlbmdpbmUgLSBFbmdpbmUgdG8gcmVtb3ZlIGZyb20gdGhlIHNjaGVkdWxlci5cbiAgICovXG4gIHJlbW92ZShlbmdpbmUpIHtcbiAgICB0aGlzLl9zY2hlZHVsZXIucmVtb3ZlKGVuZ2luZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBzY2hlZHVsZWQgZnVuY3Rpb25zIGFuZCB0aW1lIGVuZ2luZXMgZnJvbSB0aGUgc2NoZWR1bGVyLlxuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5fc2NoZWR1bGVyLmNsZWFyKCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU3luY1NjaGVkdWxlcik7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bmNTY2hlZHVsZXI7XG4iXX0=