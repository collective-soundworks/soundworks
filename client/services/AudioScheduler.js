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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _wavesAudio = require('waves-audio');

var audio = _interopRequireWildcard(_wavesAudio);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:audio-scheduler';

/**
 * Interface for the client `'audio-scheduler'` service.
 *
 * The `audio-scheduler` provides an access to the basic audio scheduler using the
 * scheduler provided by the [`wavesjs`]{@link https://github.com/wavesjs/audio}
 * library.
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
 *
 * @example
 * // inside the experience constructor
 * this.audioScheduler = this.require('audio-scheduler');
 *
 * // when the experience has started
 * const nextTime = this.audioScheduler.currentTime + 2;
 * this.audioScheduler.add(timeEngine, nextTime);
 */

var AudioScheduler = function (_Service) {
  (0, _inherits3.default)(AudioScheduler, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function AudioScheduler() {
    (0, _classCallCheck3.default)(this, AudioScheduler);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AudioScheduler.__proto__ || (0, _getPrototypeOf2.default)(AudioScheduler)).call(this, SERVICE_ID, false));

    _this._platform = _this.require('platform', { features: 'web-audio' });

    // initialize sync option
    _this._sync = null;
    _this._syncedQueue = null;

    // get audio time based scheduler
    _this._scheduler = audio.getScheduler();

    var defaults = {
      lookahead: _this._scheduler.lookahead,
      period: _this._scheduler.period
    };

    // call super.configure (activate sync option only if required)
    (0, _get3.default)(AudioScheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(AudioScheduler.prototype), 'configure', _this).call(_this, defaults);
    return _this;
  }

  /**
   * Override default `configure` to configure the scheduler.
   *
   * @param {Object} options - The options to apply to the service.
   * @private
   */


  (0, _createClass3.default)(AudioScheduler, [{
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

      (0, _get3.default)(AudioScheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(AudioScheduler.prototype), 'configure', this).call(this, options);
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)(AudioScheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(AudioScheduler.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.ready();
    }

    /**
     * Current audio time of the scheduler.
     * @type {Number}
     * @instance
     */

  }, {
    key: 'defer',


    /**
     * Call a function at a given time.
     *
     * @param {Function} fun - Function to be deferred.
     * @param {Number} time - The time at which the function should be executed.
     * @param {Boolean} [lookahead=false] - Defines whether the function is called
     *  anticipated (e.g. for audio events) or precisely at the given time (default).
     */
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
     * Remove all scheduled functions and time engines (synchronized or not) from
     * the scheduler.
     */

  }, {
    key: 'clear',
    value: function clear() {
      this._scheduler.clear();
    }
  }, {
    key: 'audioTime',
    get: function get() {
      return this._scheduler.currentTime;
    }

    /**
     * Current audio time of the scheduler (alias `this.audioTime`).
     * @type {Number}
     * @instance
     */

  }, {
    key: 'currentTime',
    get: function get() {
      return this._scheduler.currentTime;
    }

    /**
     * Difference between the scheduler's logical audio time and the `currentTime`
     * of the audio context.
     * @type {Number}
     * @instance
     */

  }, {
    key: 'deltaTime',
    get: function get() {
      return this._scheduler.currentTime - audio.audioContext.currentTime;
    }
  }]);
  return AudioScheduler;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, AudioScheduler);

exports.default = AudioScheduler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvU2NoZWR1bGVyLmpzIl0sIm5hbWVzIjpbImF1ZGlvIiwiU0VSVklDRV9JRCIsIkF1ZGlvU2NoZWR1bGVyIiwiX3BsYXRmb3JtIiwicmVxdWlyZSIsImZlYXR1cmVzIiwiX3N5bmMiLCJfc3luY2VkUXVldWUiLCJfc2NoZWR1bGVyIiwiZ2V0U2NoZWR1bGVyIiwiZGVmYXVsdHMiLCJsb29rYWhlYWQiLCJwZXJpb2QiLCJvcHRpb25zIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJoYXNTdGFydGVkIiwiaW5pdCIsInJlYWR5IiwiZnVuIiwidGltZSIsInNjaGVkdWxlciIsInNjaGVkdWxlclNlcnZpY2UiLCJlbmdpbmUiLCJkZWZlciIsImFkdmFuY2VUaW1lIiwiZGVsdGEiLCJkZWx0YVRpbWUiLCJzZXRUaW1lb3V0IiwiYWRkIiwicmVtb3ZlIiwiY2xlYXIiLCJjdXJyZW50VGltZSIsImF1ZGlvQ29udGV4dCIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlBLEs7Ozs7OztBQUVaLElBQU1DLGFBQWEseUJBQW5COztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXlCTUMsYzs7O0FBQ0o7QUFDQSw0QkFBZTtBQUFBOztBQUFBLHNKQUNQRCxVQURPLEVBQ0ssS0FETDs7QUFHYixVQUFLRSxTQUFMLEdBQWlCLE1BQUtDLE9BQUwsQ0FBYSxVQUFiLEVBQXlCLEVBQUVDLFVBQVUsV0FBWixFQUF6QixDQUFqQjs7QUFFQTtBQUNBLFVBQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0EsVUFBS0MsWUFBTCxHQUFvQixJQUFwQjs7QUFFQTtBQUNBLFVBQUtDLFVBQUwsR0FBa0JSLE1BQU1TLFlBQU4sRUFBbEI7O0FBRUEsUUFBTUMsV0FBVztBQUNmQyxpQkFBVyxNQUFLSCxVQUFMLENBQWdCRyxTQURaO0FBRWZDLGNBQVEsTUFBS0osVUFBTCxDQUFnQkk7QUFGVCxLQUFqQjs7QUFLQTtBQUNBLHNKQUFnQkYsUUFBaEI7QUFsQmE7QUFtQmQ7O0FBRUQ7Ozs7Ozs7Ozs7OEJBTVVHLE8sRUFBUztBQUNqQjtBQUNBLFVBQUlBLFFBQVFELE1BQVIsS0FBbUJFLFNBQXZCLEVBQWtDO0FBQ2hDLFlBQUlELFFBQVFELE1BQVIsR0FBaUIsS0FBckIsRUFDRSxLQUFLSixVQUFMLENBQWdCSSxNQUFoQixHQUF5QkMsUUFBUUQsTUFBakMsQ0FERixLQUdFLE1BQU0sSUFBSUcsS0FBSixnQ0FBdUNGLFFBQVFELE1BQS9DLENBQU47QUFDSDs7QUFFRDtBQUNBLFVBQUlDLFFBQVFGLFNBQVIsS0FBc0JHLFNBQTFCLEVBQXFDO0FBQ25DLFlBQUlELFFBQVFGLFNBQVIsR0FBb0IsS0FBeEIsRUFDRSxLQUFLSCxVQUFMLENBQWdCRyxTQUFoQixHQUE0QkUsUUFBUUYsU0FBcEMsQ0FERixLQUdFLE1BQU0sSUFBSUksS0FBSixtQ0FBMENGLFFBQVFGLFNBQWxELENBQU47QUFDSDs7QUFFRCxzSkFBZ0JFLE9BQWhCO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1E7QUFDTjs7QUFFQSxVQUFJLENBQUMsS0FBS0csVUFBVixFQUNFLEtBQUtDLElBQUw7O0FBRUYsV0FBS0MsS0FBTDtBQUNEOztBQUVEOzs7Ozs7Ozs7O0FBNEJBOzs7Ozs7OzswQkFRTUMsRyxFQUFLQyxJLEVBQXlCO0FBQUEsVUFBbkJULFNBQW1CLHVFQUFQLEtBQU87O0FBQ2xDLFVBQU1VLFlBQVksS0FBS2IsVUFBdkI7QUFDQSxVQUFNYyxtQkFBbUIsSUFBekI7QUFDQSxVQUFJQyxlQUFKOztBQUVBLFVBQUdaLFNBQUgsRUFBYztBQUNaVSxrQkFBVUcsS0FBVixDQUFnQkwsR0FBaEIsRUFBcUJDLElBQXJCO0FBQ0QsT0FGRCxNQUVPO0FBQ0xHLGlCQUFTO0FBQ1BFLHVCQUFhLHFCQUFTTCxJQUFULEVBQWU7QUFDMUIsZ0JBQU1NLFFBQVFKLGlCQUFpQkssU0FBL0I7O0FBRUEsZ0JBQUdELFFBQVEsQ0FBWCxFQUNFRSxXQUFXVCxHQUFYLEVBQWdCLE9BQU9PLEtBQXZCLEVBQThCTixJQUE5QixFQURGLENBQ3VDO0FBRHZDLGlCQUdFRCxJQUFJQyxJQUFKO0FBQ0g7QUFSTSxTQUFUOztBQVdBQyxrQkFBVVEsR0FBVixDQUFjTixNQUFkLEVBQXNCSCxJQUF0QixFQVpLLENBWXdCO0FBQzlCO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozt3QkFNSUcsTSxFQUFRSCxJLEVBQU07QUFDaEIsV0FBS1osVUFBTCxDQUFnQnFCLEdBQWhCLENBQW9CTixNQUFwQixFQUE0QkgsSUFBNUI7QUFDRDs7QUFFRDs7Ozs7Ozs7MkJBS09HLE0sRUFBUTtBQUNiLFdBQUtmLFVBQUwsQ0FBZ0JzQixNQUFoQixDQUF1QlAsTUFBdkI7QUFDRDs7QUFFRDs7Ozs7Ozs0QkFJUTtBQUNOLFdBQUtmLFVBQUwsQ0FBZ0J1QixLQUFoQjtBQUNEOzs7d0JBL0VlO0FBQ2QsYUFBTyxLQUFLdkIsVUFBTCxDQUFnQndCLFdBQXZCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUtrQjtBQUNoQixhQUFPLEtBQUt4QixVQUFMLENBQWdCd0IsV0FBdkI7QUFDRDs7QUFFRDs7Ozs7Ozs7O3dCQU1nQjtBQUNkLGFBQU8sS0FBS3hCLFVBQUwsQ0FBZ0J3QixXQUFoQixHQUE4QmhDLE1BQU1pQyxZQUFOLENBQW1CRCxXQUF4RDtBQUNEOzs7OztBQTZESCx5QkFBZUUsUUFBZixDQUF3QmpDLFVBQXhCLEVBQW9DQyxjQUFwQzs7a0JBRWVBLGMiLCJmaWxlIjoiQXVkaW9TY2hlZHVsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0ICogYXMgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6YXVkaW8tc2NoZWR1bGVyJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdhdWRpby1zY2hlZHVsZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoZSBgYXVkaW8tc2NoZWR1bGVyYCBwcm92aWRlcyBhbiBhY2Nlc3MgdG8gdGhlIGJhc2ljIGF1ZGlvIHNjaGVkdWxlciB1c2luZyB0aGVcbiAqIHNjaGVkdWxlciBwcm92aWRlZCBieSB0aGUgW2B3YXZlc2pzYF17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3dhdmVzanMvYXVkaW99XG4gKiBsaWJyYXJ5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucGVyaW9kXSAtIFBlcmlvZCBvZiB0aGUgc2NoZWR1bGVyIChkZWZhdXRzIHRvXG4gKiAgY3VycmVudCB2YWx1ZSkuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubG9va2FoZWFkXSAtIExvb2thaGVhZCBvZiB0aGUgc2NoZWR1bGVyIChkZWZhdXRzXG4gKiAgdG8gY3VycmVudCB2YWx1ZSkuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQHNlZSBbYHdhdmVzQXVkaW8uU2NoZWR1bGVyYF17QGxpbmsgaHR0cDovL3dhdmVzanMuZ2l0aHViLmlvL2F1ZGlvLyNhdWRpby1zY2hlZHVsZXJ9XG4gKiBAc2VlIFtgcGxhdGZvcm1gIHNlcnZpY2Vde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLmF1ZGlvU2NoZWR1bGVyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1zY2hlZHVsZXInKTtcbiAqXG4gKiAvLyB3aGVuIHRoZSBleHBlcmllbmNlIGhhcyBzdGFydGVkXG4gKiBjb25zdCBuZXh0VGltZSA9IHRoaXMuYXVkaW9TY2hlZHVsZXIuY3VycmVudFRpbWUgKyAyO1xuICogdGhpcy5hdWRpb1NjaGVkdWxlci5hZGQodGltZUVuZ2luZSwgbmV4dFRpbWUpO1xuICovXG5jbGFzcyBBdWRpb1NjaGVkdWxlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICB0aGlzLl9wbGF0Zm9ybSA9IHRoaXMucmVxdWlyZSgncGxhdGZvcm0nLCB7IGZlYXR1cmVzOiAnd2ViLWF1ZGlvJyB9KTtcblxuICAgIC8vIGluaXRpYWxpemUgc3luYyBvcHRpb25cbiAgICB0aGlzLl9zeW5jID0gbnVsbDtcbiAgICB0aGlzLl9zeW5jZWRRdWV1ZSA9IG51bGw7XG5cbiAgICAvLyBnZXQgYXVkaW8gdGltZSBiYXNlZCBzY2hlZHVsZXJcbiAgICB0aGlzLl9zY2hlZHVsZXIgPSBhdWRpby5nZXRTY2hlZHVsZXIoKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgbG9va2FoZWFkOiB0aGlzLl9zY2hlZHVsZXIubG9va2FoZWFkLFxuICAgICAgcGVyaW9kOiB0aGlzLl9zY2hlZHVsZXIucGVyaW9kLFxuICAgIH07XG5cbiAgICAvLyBjYWxsIHN1cGVyLmNvbmZpZ3VyZSAoYWN0aXZhdGUgc3luYyBvcHRpb24gb25seSBpZiByZXF1aXJlZClcbiAgICBzdXBlci5jb25maWd1cmUoZGVmYXVsdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIGRlZmF1bHQgYGNvbmZpZ3VyZWAgdG8gY29uZmlndXJlIHRoZSBzY2hlZHVsZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gYXBwbHkgdG8gdGhlIHNlcnZpY2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIC8vIGNoZWNrIGFuZCBzZXQgc2NoZWR1bGVyIHBlcmlvZCBvcHRpb25cbiAgICBpZiAob3B0aW9ucy5wZXJpb2QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKG9wdGlvbnMucGVyaW9kID4gMC4wMTApXG4gICAgICAgIHRoaXMuX3NjaGVkdWxlci5wZXJpb2QgPSBvcHRpb25zLnBlcmlvZDtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNjaGVkdWxlciBwZXJpb2Q6ICR7b3B0aW9ucy5wZXJpb2R9YCk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgYW5kIHNldCBzY2hlZHVsZXIgbG9va2FoZWFkIG9wdGlvblxuICAgIGlmIChvcHRpb25zLmxvb2thaGVhZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAob3B0aW9ucy5sb29rYWhlYWQgPiAwLjAxMClcbiAgICAgICAgdGhpcy5fc2NoZWR1bGVyLmxvb2thaGVhZCA9IG9wdGlvbnMubG9va2FoZWFkO1xuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc2NoZWR1bGVyIGxvb2thaGVhZDogJHtvcHRpb25zLmxvb2thaGVhZH1gKTtcbiAgICB9XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCBhdWRpbyB0aW1lIG9mIHRoZSBzY2hlZHVsZXIuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgZ2V0IGF1ZGlvVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2NoZWR1bGVyLmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgYXVkaW8gdGltZSBvZiB0aGUgc2NoZWR1bGVyIChhbGlhcyBgdGhpcy5hdWRpb1RpbWVgKS5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGluc3RhbmNlXG4gICAqL1xuICBnZXQgY3VycmVudFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaWZmZXJlbmNlIGJldHdlZW4gdGhlIHNjaGVkdWxlcidzIGxvZ2ljYWwgYXVkaW8gdGltZSBhbmQgdGhlIGBjdXJyZW50VGltZWBcbiAgICogb2YgdGhlIGF1ZGlvIGNvbnRleHQuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgZ2V0IGRlbHRhVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2NoZWR1bGVyLmN1cnJlbnRUaW1lIC0gYXVkaW8uYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGwgYSBmdW5jdGlvbiBhdCBhIGdpdmVuIHRpbWUuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1biAtIEZ1bmN0aW9uIHRvIGJlIGRlZmVycmVkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIFRoZSB0aW1lIGF0IHdoaWNoIHRoZSBmdW5jdGlvbiBzaG91bGQgYmUgZXhlY3V0ZWQuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2xvb2thaGVhZD1mYWxzZV0gLSBEZWZpbmVzIHdoZXRoZXIgdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZFxuICAgKiAgYW50aWNpcGF0ZWQgKGUuZy4gZm9yIGF1ZGlvIGV2ZW50cykgb3IgcHJlY2lzZWx5IGF0IHRoZSBnaXZlbiB0aW1lIChkZWZhdWx0KS5cbiAgICovXG4gIGRlZmVyKGZ1biwgdGltZSwgbG9va2FoZWFkID0gZmFsc2UpIHtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSB0aGlzLl9zY2hlZHVsZXI7XG4gICAgY29uc3Qgc2NoZWR1bGVyU2VydmljZSA9IHRoaXM7XG4gICAgbGV0IGVuZ2luZTtcblxuICAgIGlmKGxvb2thaGVhZCkge1xuICAgICAgc2NoZWR1bGVyLmRlZmVyKGZ1biwgdGltZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVuZ2luZSA9IHtcbiAgICAgICAgYWR2YW5jZVRpbWU6IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICAgICAgICBjb25zdCBkZWx0YSA9IHNjaGVkdWxlclNlcnZpY2UuZGVsdGFUaW1lO1xuXG4gICAgICAgICAgaWYoZGVsdGEgPiAwKVxuICAgICAgICAgICAgc2V0VGltZW91dChmdW4sIDEwMDAgKiBkZWx0YSwgdGltZSk7IC8vIGJyaWRnZSBzY2hlZHVsZXIgbG9va2FoZWFkIHdpdGggdGltZW91dFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZ1bih0aW1lKTtcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIHNjaGVkdWxlci5hZGQoZW5naW5lLCB0aW1lKTsgLy8gYWRkIHdpdGhvdXQgY2hlY2tzXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHRpbWUgZW5naW5lIHRvIHRoZSBxdWV1ZS5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZW5naW5lIC0gRW5naW5lIHRvIHNjaGVkdWxlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIFRoZSB0aW1lIGF0IHdoaWNoIHRoZSBmdW5jdGlvbiBzaG91bGQgYmUgZXhlY3V0ZWQuXG4gICAqL1xuICBhZGQoZW5naW5lLCB0aW1lKSB7XG4gICAgdGhpcy5fc2NoZWR1bGVyLmFkZChlbmdpbmUsIHRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZ2l2ZW4gZW5naW5lIGZyb20gdGhlIHF1ZXVlLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBlbmdpbmUgLSBFbmdpbmUgdG8gcmVtb3ZlIGZyb20gdGhlIHNjaGVkdWxlci5cbiAgICovXG4gIHJlbW92ZShlbmdpbmUpIHtcbiAgICB0aGlzLl9zY2hlZHVsZXIucmVtb3ZlKGVuZ2luZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBzY2hlZHVsZWQgZnVuY3Rpb25zIGFuZCB0aW1lIGVuZ2luZXMgKHN5bmNocm9uaXplZCBvciBub3QpIGZyb21cbiAgICogdGhlIHNjaGVkdWxlci5cbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX3NjaGVkdWxlci5jbGVhcigpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIEF1ZGlvU2NoZWR1bGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgQXVkaW9TY2hlZHVsZXI7XG4iXX0=