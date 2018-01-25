'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

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

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _wavesAudio = require('waves-audio');

var audio = _interopRequireWildcard(_wavesAudio);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audioScheduler = audio.getScheduler();

var SERVICE_ID = 'service:metric-scheduler';

var EPSILON = 1e-12;

var SyncSchedulerHook = function (_audio$TimeEngine) {
  (0, _inherits3.default)(SyncSchedulerHook, _audio$TimeEngine);

  function SyncSchedulerHook(syncScheduler, metricScheduler) {
    (0, _classCallCheck3.default)(this, SyncSchedulerHook);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SyncSchedulerHook.__proto__ || (0, _getPrototypeOf2.default)(SyncSchedulerHook)).call(this));

    _this.nextPosition = Infinity;
    _this.nextTime = Infinity;

    _this.syncScheduler = syncScheduler;
    _this.metricScheduler = metricScheduler;

    syncScheduler.add(_this, Infinity); // add hook to sync (master) scheduler
    return _this;
  }

  (0, _createClass3.default)(SyncSchedulerHook, [{
    key: 'advanceTime',
    value: function advanceTime(syncTime) {
      var metricScheduler = this.metricScheduler;
      var nextPosition = metricScheduler._advancePosition(syncTime, this.nextPosition, metricScheduler._metricSpeed);
      var nextTime = metricScheduler.getSyncTimeAtMetricPosition(nextPosition);

      this.nextPosition = nextPosition;
      this.nextTime = nextTime;

      return nextTime;
    }
  }, {
    key: 'reschedule',
    value: function reschedule() {
      var metricScheduler = this.metricScheduler;
      var nextPosition = metricScheduler._engineQueue.time;
      var syncTime = metricScheduler.getSyncTimeAtMetricPosition(nextPosition);

      if (syncTime !== this.nextTime) {
        this.nextPosition = nextPosition;
        this.nextTime = syncTime;

        this.resetTime(syncTime);
      }
    }
  }]);
  return SyncSchedulerHook;
}(audio.TimeEngine);

var SyncEventEngine = function (_audio$TimeEngine2) {
  (0, _inherits3.default)(SyncEventEngine, _audio$TimeEngine2);

  function SyncEventEngine(syncScheduler, metricScheduler) {
    (0, _classCallCheck3.default)(this, SyncEventEngine);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (SyncEventEngine.__proto__ || (0, _getPrototypeOf2.default)(SyncEventEngine)).call(this));

    _this2.syncScheduler = syncScheduler;
    _this2.metricScheduler = metricScheduler;

    _this2.syncTime = undefined;
    _this2.metricPosition = undefined;
    _this2.tempo = undefined;
    _this2.tempoUnit = undefined;
    _this2.event = undefined;

    syncScheduler.add(_this2, Infinity);
    return _this2;
  }

  (0, _createClass3.default)(SyncEventEngine, [{
    key: 'advanceTime',
    value: function advanceTime(syncTime) {
      this.metricScheduler._sync(this.syncTime, this.metricPosition, this.tempo, this.tempoUnit, this.event);
      return Infinity;
    }
  }, {
    key: 'set',
    value: function set(syncTime, metricPosition, tempo, tempoUnit, event) {
      this.syncTime = syncTime;
      this.metricPosition = metricPosition;
      this.tempo = tempo;
      this.tempoUnit = tempoUnit;
      this.event = event;

      this.resetTime(syncTime);
    }
  }, {
    key: 'reset',
    value: function reset(syncTime, metricPosition, tempo, tempoUnit, event) {
      this.syncTime = undefined;
      this.metricPosition = undefined;
      this.tempo = undefined;
      this.tempoUnit = undefined;
      this.event = undefined;

      this.resetTime(Infinity);
    }
  }]);
  return SyncEventEngine;
}(audio.TimeEngine);

var BeatEngine = function (_audio$TimeEngine3) {
  (0, _inherits3.default)(BeatEngine, _audio$TimeEngine3);

  function BeatEngine(metro) {
    (0, _classCallCheck3.default)(this, BeatEngine);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (BeatEngine.__proto__ || (0, _getPrototypeOf2.default)(BeatEngine)).call(this));

    _this3.metro = metro;
    audioScheduler.add(_this3, Infinity);
    return _this3;
  }

  // generate next beat


  (0, _createClass3.default)(BeatEngine, [{
    key: 'advanceTime',
    value: function advanceTime(audioTime) {
      var metro = this.metro;

      var cont = metro.callback(metro.measureCount, metro.beatCount);
      metro.beatCount++;

      if (cont === undefined || cont === true) {
        if (metro.beatCount >= metro.numBeats) return Infinity;

        return audioTime + metro.beatPeriod;
      }

      metro.resetPosition(Infinity);
      return Infinity;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.metro = null;

      if (this.master) this.master.remove(this);
    }
  }]);
  return BeatEngine;
}(audio.TimeEngine);

var MetronomeEngine = function (_audio$TimeEngine4) {
  (0, _inherits3.default)(MetronomeEngine, _audio$TimeEngine4);

  function MetronomeEngine(startPosition, numBeats, beatLength, startOnBeat, callback) {
    (0, _classCallCheck3.default)(this, MetronomeEngine);

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (MetronomeEngine.__proto__ || (0, _getPrototypeOf2.default)(MetronomeEngine)).call(this));

    _this4.startPosition = startPosition;
    _this4.numBeats = numBeats;
    _this4.beatLength = beatLength;
    _this4.startOnBeat = startOnBeat;
    _this4.callback = callback;

    _this4.measureLength = numBeats * beatLength;
    _this4.beatPeriod = 0;
    _this4.measureCount = 0;
    _this4.beatCount = 0;

    if (numBeats > 1) _this4.beatEngine = new BeatEngine(_this4);
    return _this4;
  }

  // return position of next measure


  (0, _createClass3.default)(MetronomeEngine, [{
    key: 'syncSpeed',
    value: function syncSpeed(syncTime, metricPosition, metricSpeed) {
      if (metricSpeed <= 0 && this.beatEngine) this.beatEngine.resetTime(Infinity);
    }

    // return position of next measure

  }, {
    key: 'syncPosition',
    value: function syncPosition(syncTime, metricPosition, metricSpeed) {
      var startPosition = this.startPosition;

      if (this.beatEngine) this.beatEngine.resetTime(Infinity);

      // since we are anyway a little in advance, make sure that we don't skip
      // the start point due to rounding errors
      metricPosition -= EPSILON;

      this.beatPeriod = this.beatLength / metricSpeed;
      this.beatCount = 0;

      if (metricPosition >= startPosition) {
        var relativePosition = metricPosition - startPosition;
        var floatMeasures = relativePosition / this.measureLength;
        var measureCount = Math.floor(floatMeasures);
        var measurePhase = floatMeasures - measureCount;

        if (this.beatEngine && this.startOnBeat) {
          var floatBeats = this.numBeats * measurePhase;
          var nextBeatCount = Math.ceil(floatBeats) % this.numBeats;

          this.measureCount = measureCount; // current measure
          this.beatCount = nextBeatCount; // next beat

          if (nextBeatCount !== 0) {
            var audioTime = audioScheduler.currentTime;
            var nextBeatDelay = (nextBeatCount - floatBeats) * this.beatPeriod;
            this.beatEngine.resetTime(audioTime + nextBeatDelay);
          }
        }

        if (measurePhase > 0) measureCount++;

        this.measureCount = measureCount;

        return startPosition + measureCount * this.measureLength;
      }

      this.measureCount = 0;
      return startPosition;
    }

    // generate next measure

  }, {
    key: 'advancePosition',
    value: function advancePosition(syncTime, metricPosition, metricSpeed) {
      var audioTime = audioScheduler.currentTime;

      // whether metronome continues (default is true)
      var cont = this.callback(this.measureCount, 0);

      // @fixme / recheck - outputs:
      // 14 0
      // 15 1
      // 15 2
      // 15 3
      // 15 0
      // 16 1
      this.measureCount++;
      this.beatCount = 1;

      if (cont === undefined || cont === true) {
        if (this.beatEngine) this.beatEngine.resetTime(audioTime + this.beatPeriod);

        return metricPosition + this.measureLength;
      }

      if (this.beatEngine) this.beatEngine.resetTime(Infinity);

      return Infinity;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.beatEngine) this.beatEngine.destroy();

      if (this.master) this.master.remove(this);
    }
  }]);
  return MetronomeEngine;
}(audio.TimeEngine);

var MetricScheduler = function (_Service) {
  (0, _inherits3.default)(MetricScheduler, _Service);

  function MetricScheduler() {
    (0, _classCallCheck3.default)(this, MetricScheduler);

    var _this5 = (0, _possibleConstructorReturn3.default)(this, (MetricScheduler.__proto__ || (0, _getPrototypeOf2.default)(MetricScheduler)).call(this, SERVICE_ID, true));

    _this5._syncScheduler = _this5.require('sync-scheduler');

    _this5._engineQueue = new audio.PriorityQueue();
    _this5._engineSet = new _set2.default();
    _this5._metronomeEngineMap = new _map2.default();

    _this5._tempo = 60; // tempo in beats per minute (BPM)
    _this5._tempoUnit = 0.25; // tempo unit expressed in fractions of a whole note
    _this5._metricSpeed = 0.25; // whole notes per second

    _this5._syncTime = 0;
    _this5._metricPosition = 0;

    _this5._syncSchedulerHook = null;
    _this5._syncEventEngine = null;

    _this5._listeners = new _map2.default();
    _this5._callingEventListeners = false;

    // const defaults = {};
    // this.configure(defaults);

    _this5._onInit = _this5._onInit.bind(_this5);
    _this5._onSync = _this5._onSync.bind(_this5);
    _this5._onClear = _this5._onClear.bind(_this5);
    return _this5;
  }

  (0, _createClass3.default)(MetricScheduler, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(MetricScheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(MetricScheduler.prototype), 'start', this).call(this);

      this._syncSchedulerHook = new SyncSchedulerHook(this._syncScheduler, this);
      this._syncEventEngine = new SyncEventEngine(this._syncScheduler, this);

      this.send('request');
      this.receive('init', this._onInit);
      this.receive('clear', this._onClear);
      this.receive('sync', this._onSync);
    }
  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)(MetricScheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(MetricScheduler.prototype), 'stop', this).call(this);
    }
  }, {
    key: '_callEventListeners',
    value: function _callEventListeners(event) {
      var listeners = this._listeners.get(event);

      if (listeners) {
        this._callingEventListeners = true;

        var data = {
          syncTime: this._syncTime,
          metricPosition: this._metricPosition,
          tempo: this._tempo,
          tempoUnit: this._tempoUnit
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(listeners), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var callback = _step.value;

            callback(event, data);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this._callingEventListeners = false;
      }
    }
  }, {
    key: '_rescheduleMetricEngines',
    value: function _rescheduleMetricEngines() {
      var syncTime = this.syncTime;
      var metricPosition = this.getMetricPositionAtSyncTime(syncTime);

      this._engineQueue.clear();

      if (this._metricSpeed > 0) {
        // position engines
        var metricSpeed = this._metricSpeed;
        var queue = this._engineQueue;

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = (0, _getIterator3.default)(this._engineSet), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var engine = _step2.value;

            var nextEnginePosition = engine.syncPosition(syncTime, metricPosition, metricSpeed);
            queue.insert(engine, nextEnginePosition);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      } else {
        // stop engines
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = (0, _getIterator3.default)(this._engineSet), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _engine = _step3.value;

            if (_engine.syncSpeed) _engine.syncSpeed(syncTime, metricPosition, 0);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }

      this._syncSchedulerHook.reschedule();
    }
  }, {
    key: '_clearEngines',
    value: function _clearEngines() {
      this._engineQueue.clear();
      this._engineSet.clear();

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = (0, _getIterator3.default)(this._metronomeEngineMap), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _step4$value = (0, _slicedToArray3.default)(_step4.value, 2),
              key = _step4$value[0],
              engine = _step4$value[1];

          engine.destroy();
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      this._metronomeEngineMap.clear();

      this._syncSchedulerHook.reschedule();
    }
  }, {
    key: '_advancePosition',
    value: function _advancePosition(syncTime, metricPosition, metricSpeed) {
      var engine = this._engineQueue.head;
      var nextEnginePosition = engine.advancePosition(syncTime, metricPosition, metricSpeed);

      if (nextEnginePosition === undefined) this._engineSet.delete(engine);

      return this._engineQueue.move(engine, nextEnginePosition);
    }
  }, {
    key: '_sync',
    value: function _sync(syncTime, metricPosition, tempo, tempoUnit, event) {
      this._syncTime = syncTime;
      this._metricPosition = metricPosition;

      this._tempo = tempo;
      this._tempoUnit = tempoUnit;
      this._metricSpeed = tempo * tempoUnit / 60;

      if (event) this._callEventListeners(event);

      this._rescheduleMetricEngines();
    }
  }, {
    key: '_clearSyncEvent',
    value: function _clearSyncEvent() {
      this._syncEventEngine.reset();
    }
  }, {
    key: '_setSyncEvent',
    value: function _setSyncEvent(syncTime, metricPosition, tempo, tempoUnit, event) {
      this._clearSyncEvent();

      if (syncTime > this.syncTime) this._syncEventEngine.set(syncTime, metricPosition, tempo, tempoUnit, event);else this._sync(syncTime, metricPosition, tempo, tempoUnit, event);
    }
  }, {
    key: '_onInit',
    value: function _onInit(syncTime, metricPosition, tempo, tempoUnit) {
      this._sync(syncTime, metricPosition, tempo, tempoUnit);
      this.ready();
    }
  }, {
    key: '_onClear',
    value: function _onClear() {
      this._clearSyncEvent();
      this._clearEngines();
    }
  }, {
    key: '_onSync',
    value: function _onSync(syncTime, metricPosition, tempo, tempoUnit, event) {
      this._setSyncEvent(syncTime, metricPosition, tempo, tempoUnit, event);
    }

    /**
     * Current audio time.
     * @type {Number}
     */

  }, {
    key: 'getMetricPositionAtAudioTime',


    /**
     * Get metric position corrsponding to a given audio time (regarding the current tempo).
     * @param  {Number} time - time
     * @return {Number} - metric position
     */
    value: function getMetricPositionAtAudioTime(audioTime) {
      if (this._tempo > 0) {
        var syncTime = this._syncScheduler.getSyncTimeAtAudioTime(audioTime);
        return this._metricPosition + (syncTime - this._syncTime) * this._metricSpeed;
      }

      return this._metricPosition;
    }

    /**
     * Get metric position corrsponding to a given sync time (regarding the current tempo).
     * @param  {Number} time - time
     * @return {Number} - metric position
     */

  }, {
    key: 'getMetricPositionAtSyncTime',
    value: function getMetricPositionAtSyncTime(syncTime) {
      if (this._tempo > 0) return this._metricPosition + (syncTime - this._syncTime) * this._metricSpeed;

      return this._metricPosition;
    }

    /**
     * Get sync time corresponding to a given metric position (regarding the current tempo).
     * @param  {Number} position - metric position
     * @return {Number} - sync time
     */

  }, {
    key: 'getSyncTimeAtMetricPosition',
    value: function getSyncTimeAtMetricPosition(metricPosition) {
      var metricSpeed = this._metricSpeed;

      if (metricPosition < Infinity && metricSpeed > 0) return this._syncTime + (metricPosition - this._metricPosition) / metricSpeed;

      return Infinity;
    }

    /**
     * Get audio time corresponding to a given metric position (regarding the current tempo).
     * @param  {Number} position - metric position
     * @return {Number} - audio time
     */

  }, {
    key: 'getAudioTimeAtMetricPosition',
    value: function getAudioTimeAtMetricPosition(metricPosition) {
      var metricSpeed = this._metricSpeed;

      if (metricPosition < Infinity && metricSpeed > 0) {
        var syncTime = this._syncTime + (metricPosition - this._metricPosition) / metricSpeed;
        return this._syncScheduler.getAudioTimeAtSyncTime(syncTime);
      }

      return Infinity;
    }
  }, {
    key: 'addEventListener',
    value: function addEventListener(event, callback) {
      var listeners = this._listeners.get(event);

      if (!listeners) {
        listeners = new _set2.default();
        this._listeners.set(event, listeners);
      }

      listeners.add(callback);
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(callback) {
      var listeners = this._listeners.get(event);

      if (listeners) listeners.remove(callback);
    }

    /**
     * Call a function at a given metric position.
     *
     * @param {Function} fun - Function to be deferred.
     * @param {Number} metricPosition - The metric position at which the function should be executed.
     * @param {Boolean} [lookahead=false] - Defines whether the function is called
     *  anticipated (e.g. for audio events) or precisely at the given time (default).
     */

  }, {
    key: 'addEvent',
    value: function addEvent(fun, metricPosition) {
      var lookahead = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var schedulerService = this;
      var engine = {
        timeout: null,
        syncSpeed: function syncSpeed(time, position, speed) {
          if (speed === 0) clearTimeout(this.timeout);
        },
        syncPosition: function syncPosition(time, position, speed) {
          clearTimeout(this.timeout);

          if (metricPosition >= position) return metricPosition;

          return Infinity;
        },
        advancePosition: function advancePosition(time, position, speed) {
          var delta = schedulerService.deltaTime;

          if (delta > 0) this.timeout = setTimeout(fun, 1000 * delta, position); // bridge scheduler lookahead with timeout
          else fun(position);

          return Infinity;
        }
      };

      this.add(engine, metricPosition); // add without checks
    }
  }, {
    key: 'add',
    value: function add(engine) {
      var startPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.metricPosition;

      this._engineSet.add(engine);

      var metricPosition = Math.max(startPosition, this.metricPosition);

      // schedule engine
      if (!this._callingEventListeners && this._metricSpeed > 0) {
        var syncTime = this.syncTime;
        var nextEnginePosition = engine.syncPosition(syncTime, metricPosition, this._metricSpeed);

        this._engineQueue.insert(engine, nextEnginePosition);
        this._syncSchedulerHook.reschedule();
      }
    }
  }, {
    key: 'remove',
    value: function remove(engine) {
      var syncTime = this.syncTime;
      var metricPosition = this.getMetricPositionAtSyncTime(syncTime);

      // stop engine
      if (engine.syncSpeed) engine.syncSpeed(syncTime, metricPosition, 0);

      if (this._engineSet.delete(engine) && !this._callingEventListeners && this._metricSpeed > 0) {
        this._engineQueue.remove(engine);
        this._syncSchedulerHook.reschedule();
      }
    }

    /**
     * Add a periodic callback starting at a given metric position.
     * @param {Function} callback - callback function (cycle, beat)
     * @param {Integer} numBeats - number of beats (time signature numerator)
     * @param {Number} metricDiv - metric division of whole note (time signature denominator)
     * @param {Number} tempoScale - linear tempo scale factor (in respect to master tempo)
     * @param {Integer} startPosition - metric start position of the beat
     */

  }, {
    key: 'addMetronome',
    value: function addMetronome(callback) {
      var numBeats = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
      var metricDiv = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;
      var tempoScale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var startPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var startOnBeat = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

      var beatLength = 1 / (metricDiv * tempoScale);
      var engine = new MetronomeEngine(startPosition, numBeats, beatLength, startOnBeat, callback);

      this._metronomeEngineMap.set(callback, engine);
      this.add(engine, startPosition);
    }

    /**
     * Remove periodic callback.
     * @param {Function} callback callback function
     */

  }, {
    key: 'removeMetronome',
    value: function removeMetronome(callback /*, endPosition */) {
      var engine = this._metronomeEngineMap.get(callback);

      if (engine) {
        this._metronomeEngineMap.delete(callback);
        this.remove(engine);
      }
    }
  }, {
    key: 'audioTime',
    get: function get() {
      return audioScheduler.currentTime;
    }
  }, {
    key: 'syncTime',
    get: function get() {
      return this._syncScheduler.syncTime;
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this._syncScheduler.syncTime;
    }
  }, {
    key: 'metricPosition',
    get: function get() {
      if (this._tempo > 0) return this._metricPosition + (this._syncScheduler.syncTime - this._syncTime) * this._metricSpeed;

      return this._metricPosition;
    }
  }, {
    key: 'currentPosition',
    get: function get() {
      return this.metricPosition;
    }

    /**
     * Difference between the audio scheduler's logical audio time and the `currentTime`
     * of the audio context.
     */

  }, {
    key: 'deltaTime',
    get: function get() {
      return audioScheduler.currentTime - audio.audioContext.currentTime;
    }

    /**
     * Current tempo.
     * @return {Number} - Tempo in BPM.
     */

  }, {
    key: 'tempo',
    get: function get() {
      return this._tempo;
    }

    /**
     * Current tempo unit.
     * @return {Number} - Tempo unit in respect to whole note.
     */

  }, {
    key: 'tempoUnit',
    get: function get() {
      return this._tempoUnit;
    }
  }]);
  return MetricScheduler;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, MetricScheduler);

exports.default = MetricScheduler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1ldHJpY1NjaGVkdWxlci5qcyJdLCJuYW1lcyI6WyJhdWRpbyIsImF1ZGlvU2NoZWR1bGVyIiwiZ2V0U2NoZWR1bGVyIiwiU0VSVklDRV9JRCIsIkVQU0lMT04iLCJTeW5jU2NoZWR1bGVySG9vayIsInN5bmNTY2hlZHVsZXIiLCJtZXRyaWNTY2hlZHVsZXIiLCJuZXh0UG9zaXRpb24iLCJJbmZpbml0eSIsIm5leHRUaW1lIiwiYWRkIiwic3luY1RpbWUiLCJfYWR2YW5jZVBvc2l0aW9uIiwiX21ldHJpY1NwZWVkIiwiZ2V0U3luY1RpbWVBdE1ldHJpY1Bvc2l0aW9uIiwiX2VuZ2luZVF1ZXVlIiwidGltZSIsInJlc2V0VGltZSIsIlRpbWVFbmdpbmUiLCJTeW5jRXZlbnRFbmdpbmUiLCJ1bmRlZmluZWQiLCJtZXRyaWNQb3NpdGlvbiIsInRlbXBvIiwidGVtcG9Vbml0IiwiZXZlbnQiLCJfc3luYyIsIkJlYXRFbmdpbmUiLCJtZXRybyIsImF1ZGlvVGltZSIsImNvbnQiLCJjYWxsYmFjayIsIm1lYXN1cmVDb3VudCIsImJlYXRDb3VudCIsIm51bUJlYXRzIiwiYmVhdFBlcmlvZCIsInJlc2V0UG9zaXRpb24iLCJtYXN0ZXIiLCJyZW1vdmUiLCJNZXRyb25vbWVFbmdpbmUiLCJzdGFydFBvc2l0aW9uIiwiYmVhdExlbmd0aCIsInN0YXJ0T25CZWF0IiwibWVhc3VyZUxlbmd0aCIsImJlYXRFbmdpbmUiLCJtZXRyaWNTcGVlZCIsInJlbGF0aXZlUG9zaXRpb24iLCJmbG9hdE1lYXN1cmVzIiwiTWF0aCIsImZsb29yIiwibWVhc3VyZVBoYXNlIiwiZmxvYXRCZWF0cyIsIm5leHRCZWF0Q291bnQiLCJjZWlsIiwiY3VycmVudFRpbWUiLCJuZXh0QmVhdERlbGF5IiwiZGVzdHJveSIsIk1ldHJpY1NjaGVkdWxlciIsIl9zeW5jU2NoZWR1bGVyIiwicmVxdWlyZSIsIlByaW9yaXR5UXVldWUiLCJfZW5naW5lU2V0IiwiX21ldHJvbm9tZUVuZ2luZU1hcCIsIl90ZW1wbyIsIl90ZW1wb1VuaXQiLCJfc3luY1RpbWUiLCJfbWV0cmljUG9zaXRpb24iLCJfc3luY1NjaGVkdWxlckhvb2siLCJfc3luY0V2ZW50RW5naW5lIiwiX2xpc3RlbmVycyIsIl9jYWxsaW5nRXZlbnRMaXN0ZW5lcnMiLCJfb25Jbml0IiwiYmluZCIsIl9vblN5bmMiLCJfb25DbGVhciIsInNlbmQiLCJyZWNlaXZlIiwibGlzdGVuZXJzIiwiZ2V0IiwiZGF0YSIsImdldE1ldHJpY1Bvc2l0aW9uQXRTeW5jVGltZSIsImNsZWFyIiwicXVldWUiLCJlbmdpbmUiLCJuZXh0RW5naW5lUG9zaXRpb24iLCJzeW5jUG9zaXRpb24iLCJpbnNlcnQiLCJzeW5jU3BlZWQiLCJyZXNjaGVkdWxlIiwia2V5IiwiaGVhZCIsImFkdmFuY2VQb3NpdGlvbiIsImRlbGV0ZSIsIm1vdmUiLCJfY2FsbEV2ZW50TGlzdGVuZXJzIiwiX3Jlc2NoZWR1bGVNZXRyaWNFbmdpbmVzIiwicmVzZXQiLCJfY2xlYXJTeW5jRXZlbnQiLCJzZXQiLCJyZWFkeSIsIl9jbGVhckVuZ2luZXMiLCJfc2V0U3luY0V2ZW50IiwiZ2V0U3luY1RpbWVBdEF1ZGlvVGltZSIsImdldEF1ZGlvVGltZUF0U3luY1RpbWUiLCJmdW4iLCJsb29rYWhlYWQiLCJzY2hlZHVsZXJTZXJ2aWNlIiwidGltZW91dCIsInBvc2l0aW9uIiwic3BlZWQiLCJjbGVhclRpbWVvdXQiLCJkZWx0YSIsImRlbHRhVGltZSIsInNldFRpbWVvdXQiLCJtYXgiLCJtZXRyaWNEaXYiLCJ0ZW1wb1NjYWxlIiwiYXVkaW9Db250ZXh0IiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlBLEs7Ozs7OztBQUNaLElBQU1DLGlCQUFpQkQsTUFBTUUsWUFBTixFQUF2Qjs7QUFFQSxJQUFNQyxhQUFhLDBCQUFuQjs7QUFFQSxJQUFNQyxVQUFVLEtBQWhCOztJ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eUI4QixNQUF6QixDQUFnQzdELFFBQWhDO0FBQ0EsYUFBS08sTUFBTCxDQUFZNkMsTUFBWjtBQUNEO0FBQ0Y7Ozt3QkF4TmU7QUFDZCxhQUFPbEYsZUFBZXFELFdBQXRCO0FBQ0Q7Ozt3QkFFYztBQUNiLGFBQU8sS0FBS0ksY0FBTCxDQUFvQjlDLFFBQTNCO0FBQ0Q7Ozt3QkFFaUI7QUFDaEIsYUFBTyxLQUFLOEMsY0FBTCxDQUFvQjlDLFFBQTNCO0FBQ0Q7Ozt3QkFFb0I7QUFDbkIsVUFBSSxLQUFLbUQsTUFBTCxHQUFjLENBQWxCLEVBQ0UsT0FBTyxLQUFLRyxlQUFMLEdBQXVCLENBQUMsS0FBS1IsY0FBTCxDQUFvQjlDLFFBQXBCLEdBQStCLEtBQUtxRCxTQUFyQyxJQUFrRCxLQUFLbkQsWUFBckY7O0FBRUYsYUFBTyxLQUFLb0QsZUFBWjtBQUNEOzs7d0JBRXFCO0FBQ3BCLGFBQU8sS0FBSzVDLGNBQVo7QUFDRDs7QUFFRDs7Ozs7Ozt3QkFJZ0I7QUFDZCxhQUFPckIsZUFBZXFELFdBQWYsR0FBNkJ0RCxNQUFNcUgsWUFBTixDQUFtQi9ELFdBQXZEO0FBQ0Q7O0FBRUQ7Ozs7Ozs7d0JBSVk7QUFDVixhQUFPLEtBQUtTLE1BQVo7QUFDRDs7QUFFRDs7Ozs7Ozt3QkFJZ0I7QUFDZCxhQUFPLEtBQUtDLFVBQVo7QUFDRDs7Ozs7QUE4S0gseUJBQWVzRCxRQUFmLENBQXdCbkgsVUFBeEIsRUFBb0NzRCxlQUFwQzs7a0JBRWVBLGUiLCJmaWxlIjoiTWV0cmljU2NoZWR1bGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCAqIGFzIGF1ZGlvIGZyb20gJ3dhdmVzLWF1ZGlvJztcbmNvbnN0IGF1ZGlvU2NoZWR1bGVyID0gYXVkaW8uZ2V0U2NoZWR1bGVyKCk7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTptZXRyaWMtc2NoZWR1bGVyJztcblxuY29uc3QgRVBTSUxPTiA9IDFlLTEyO1xuXG5jbGFzcyBTeW5jU2NoZWR1bGVySG9vayBleHRlbmRzIGF1ZGlvLlRpbWVFbmdpbmUge1xuICBjb25zdHJ1Y3RvcihzeW5jU2NoZWR1bGVyLCBtZXRyaWNTY2hlZHVsZXIpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5uZXh0UG9zaXRpb24gPSBJbmZpbml0eTtcbiAgICB0aGlzLm5leHRUaW1lID0gSW5maW5pdHk7XG5cbiAgICB0aGlzLnN5bmNTY2hlZHVsZXIgPSBzeW5jU2NoZWR1bGVyO1xuICAgIHRoaXMubWV0cmljU2NoZWR1bGVyID0gbWV0cmljU2NoZWR1bGVyO1xuXG4gICAgc3luY1NjaGVkdWxlci5hZGQodGhpcywgSW5maW5pdHkpOyAvLyBhZGQgaG9vayB0byBzeW5jIChtYXN0ZXIpIHNjaGVkdWxlclxuICB9XG5cbiAgYWR2YW5jZVRpbWUoc3luY1RpbWUpIHtcbiAgICBjb25zdCBtZXRyaWNTY2hlZHVsZXIgPSB0aGlzLm1ldHJpY1NjaGVkdWxlcjtcbiAgICBjb25zdCBuZXh0UG9zaXRpb24gPSBtZXRyaWNTY2hlZHVsZXIuX2FkdmFuY2VQb3NpdGlvbihzeW5jVGltZSwgdGhpcy5uZXh0UG9zaXRpb24sIG1ldHJpY1NjaGVkdWxlci5fbWV0cmljU3BlZWQpO1xuICAgIGNvbnN0IG5leHRUaW1lID0gbWV0cmljU2NoZWR1bGVyLmdldFN5bmNUaW1lQXRNZXRyaWNQb3NpdGlvbihuZXh0UG9zaXRpb24pO1xuXG4gICAgdGhpcy5uZXh0UG9zaXRpb24gPSBuZXh0UG9zaXRpb247XG4gICAgdGhpcy5uZXh0VGltZSA9IG5leHRUaW1lO1xuXG4gICAgcmV0dXJuIG5leHRUaW1lO1xuICB9XG5cbiAgcmVzY2hlZHVsZSgpIHtcbiAgICBjb25zdCBtZXRyaWNTY2hlZHVsZXIgPSB0aGlzLm1ldHJpY1NjaGVkdWxlcjtcbiAgICBjb25zdCBuZXh0UG9zaXRpb24gPSBtZXRyaWNTY2hlZHVsZXIuX2VuZ2luZVF1ZXVlLnRpbWU7XG4gICAgY29uc3Qgc3luY1RpbWUgPSBtZXRyaWNTY2hlZHVsZXIuZ2V0U3luY1RpbWVBdE1ldHJpY1Bvc2l0aW9uKG5leHRQb3NpdGlvbik7XG5cbiAgICBpZiAoc3luY1RpbWUgIT09IHRoaXMubmV4dFRpbWUpIHtcbiAgICAgIHRoaXMubmV4dFBvc2l0aW9uID0gbmV4dFBvc2l0aW9uO1xuICAgICAgdGhpcy5uZXh0VGltZSA9IHN5bmNUaW1lO1xuXG4gICAgICB0aGlzLnJlc2V0VGltZShzeW5jVGltZSk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFN5bmNFdmVudEVuZ2luZSBleHRlbmRzIGF1ZGlvLlRpbWVFbmdpbmUge1xuICBjb25zdHJ1Y3RvcihzeW5jU2NoZWR1bGVyLCBtZXRyaWNTY2hlZHVsZXIpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zeW5jU2NoZWR1bGVyID0gc3luY1NjaGVkdWxlcjtcbiAgICB0aGlzLm1ldHJpY1NjaGVkdWxlciA9IG1ldHJpY1NjaGVkdWxlcjtcblxuICAgIHRoaXMuc3luY1RpbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5tZXRyaWNQb3NpdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRlbXBvID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudGVtcG9Vbml0ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZXZlbnQgPSB1bmRlZmluZWQ7XG5cbiAgICBzeW5jU2NoZWR1bGVyLmFkZCh0aGlzLCBJbmZpbml0eSk7XG4gIH1cblxuICBhZHZhbmNlVGltZShzeW5jVGltZSkge1xuICAgIHRoaXMubWV0cmljU2NoZWR1bGVyLl9zeW5jKHRoaXMuc3luY1RpbWUsIHRoaXMubWV0cmljUG9zaXRpb24sIHRoaXMudGVtcG8sIHRoaXMudGVtcG9Vbml0LCB0aGlzLmV2ZW50KTtcbiAgICByZXR1cm4gSW5maW5pdHk7XG4gIH1cblxuICBzZXQoc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCB0ZW1wbywgdGVtcG9Vbml0LCBldmVudCkge1xuICAgIHRoaXMuc3luY1RpbWUgPSBzeW5jVGltZTtcbiAgICB0aGlzLm1ldHJpY1Bvc2l0aW9uID0gbWV0cmljUG9zaXRpb247XG4gICAgdGhpcy50ZW1wbyA9IHRlbXBvO1xuICAgIHRoaXMudGVtcG9Vbml0ID0gdGVtcG9Vbml0O1xuICAgIHRoaXMuZXZlbnQgPSBldmVudDtcblxuICAgIHRoaXMucmVzZXRUaW1lKHN5bmNUaW1lKTtcbiAgfVxuXG4gIHJlc2V0KHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgdGVtcG8sIHRlbXBvVW5pdCwgZXZlbnQpIHtcbiAgICB0aGlzLnN5bmNUaW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMubWV0cmljUG9zaXRpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy50ZW1wbyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRlbXBvVW5pdCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmV2ZW50ID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5yZXNldFRpbWUoSW5maW5pdHkpO1xuICB9XG59XG5cbmNsYXNzIEJlYXRFbmdpbmUgZXh0ZW5kcyBhdWRpby5UaW1lRW5naW5lIHtcbiAgY29uc3RydWN0b3IobWV0cm8pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5tZXRybyA9IG1ldHJvO1xuICAgIGF1ZGlvU2NoZWR1bGVyLmFkZCh0aGlzLCBJbmZpbml0eSk7XG4gIH1cblxuICAvLyBnZW5lcmF0ZSBuZXh0IGJlYXRcbiAgYWR2YW5jZVRpbWUoYXVkaW9UaW1lKSB7XG4gICAgY29uc3QgbWV0cm8gPSB0aGlzLm1ldHJvO1xuXG4gICAgY29uc3QgY29udCA9IG1ldHJvLmNhbGxiYWNrKG1ldHJvLm1lYXN1cmVDb3VudCwgbWV0cm8uYmVhdENvdW50KTtcbiAgICBtZXRyby5iZWF0Q291bnQrKztcblxuICAgIGlmIChjb250ID09PSB1bmRlZmluZWQgfHwgY29udCA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKG1ldHJvLmJlYXRDb3VudCA+PSBtZXRyby5udW1CZWF0cylcbiAgICAgICAgcmV0dXJuIEluZmluaXR5O1xuXG4gICAgICByZXR1cm4gYXVkaW9UaW1lICsgbWV0cm8uYmVhdFBlcmlvZDtcbiAgICB9XG5cbiAgICBtZXRyby5yZXNldFBvc2l0aW9uKEluZmluaXR5KTtcbiAgICByZXR1cm4gSW5maW5pdHk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMubWV0cm8gPSBudWxsO1xuXG4gICAgaWYgKHRoaXMubWFzdGVyKVxuICAgICAgdGhpcy5tYXN0ZXIucmVtb3ZlKHRoaXMpO1xuICB9XG59XG5cbmNsYXNzIE1ldHJvbm9tZUVuZ2luZSBleHRlbmRzIGF1ZGlvLlRpbWVFbmdpbmUge1xuICBjb25zdHJ1Y3RvcihzdGFydFBvc2l0aW9uLCBudW1CZWF0cywgYmVhdExlbmd0aCwgc3RhcnRPbkJlYXQsIGNhbGxiYWNrKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3RhcnRQb3NpdGlvbiA9IHN0YXJ0UG9zaXRpb247XG4gICAgdGhpcy5udW1CZWF0cyA9IG51bUJlYXRzO1xuICAgIHRoaXMuYmVhdExlbmd0aCA9IGJlYXRMZW5ndGg7XG4gICAgdGhpcy5zdGFydE9uQmVhdCA9IHN0YXJ0T25CZWF0O1xuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuICAgIHRoaXMubWVhc3VyZUxlbmd0aCA9IG51bUJlYXRzICogYmVhdExlbmd0aDtcbiAgICB0aGlzLmJlYXRQZXJpb2QgPSAwO1xuICAgIHRoaXMubWVhc3VyZUNvdW50ID0gMDtcbiAgICB0aGlzLmJlYXRDb3VudCA9IDA7XG5cbiAgICBpZiAobnVtQmVhdHMgPiAxKVxuICAgICAgdGhpcy5iZWF0RW5naW5lID0gbmV3IEJlYXRFbmdpbmUodGhpcyk7XG4gIH1cblxuICAvLyByZXR1cm4gcG9zaXRpb24gb2YgbmV4dCBtZWFzdXJlXG4gIHN5bmNTcGVlZChzeW5jVGltZSwgbWV0cmljUG9zaXRpb24sIG1ldHJpY1NwZWVkKSB7XG4gICAgaWYgKG1ldHJpY1NwZWVkIDw9IDAgJiYgdGhpcy5iZWF0RW5naW5lKVxuICAgICAgdGhpcy5iZWF0RW5naW5lLnJlc2V0VGltZShJbmZpbml0eSk7XG4gIH1cblxuICAvLyByZXR1cm4gcG9zaXRpb24gb2YgbmV4dCBtZWFzdXJlXG4gIHN5bmNQb3NpdGlvbihzeW5jVGltZSwgbWV0cmljUG9zaXRpb24sIG1ldHJpY1NwZWVkKSB7XG4gICAgY29uc3Qgc3RhcnRQb3NpdGlvbiA9IHRoaXMuc3RhcnRQb3NpdGlvbjtcblxuICAgIGlmICh0aGlzLmJlYXRFbmdpbmUpXG4gICAgICB0aGlzLmJlYXRFbmdpbmUucmVzZXRUaW1lKEluZmluaXR5KTtcblxuICAgIC8vIHNpbmNlIHdlIGFyZSBhbnl3YXkgYSBsaXR0bGUgaW4gYWR2YW5jZSwgbWFrZSBzdXJlIHRoYXQgd2UgZG9uJ3Qgc2tpcFxuICAgIC8vIHRoZSBzdGFydCBwb2ludCBkdWUgdG8gcm91bmRpbmcgZXJyb3JzXG4gICAgbWV0cmljUG9zaXRpb24gLT0gRVBTSUxPTjtcblxuICAgIHRoaXMuYmVhdFBlcmlvZCA9IHRoaXMuYmVhdExlbmd0aCAvIG1ldHJpY1NwZWVkO1xuICAgIHRoaXMuYmVhdENvdW50ID0gMDtcblxuICAgIGlmIChtZXRyaWNQb3NpdGlvbiA+PSBzdGFydFBvc2l0aW9uKSB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBvc2l0aW9uID0gbWV0cmljUG9zaXRpb24gLSBzdGFydFBvc2l0aW9uO1xuICAgICAgY29uc3QgZmxvYXRNZWFzdXJlcyA9IHJlbGF0aXZlUG9zaXRpb24gLyB0aGlzLm1lYXN1cmVMZW5ndGg7XG4gICAgICBsZXQgbWVhc3VyZUNvdW50ID0gTWF0aC5mbG9vcihmbG9hdE1lYXN1cmVzKTtcbiAgICAgIGNvbnN0IG1lYXN1cmVQaGFzZSA9IGZsb2F0TWVhc3VyZXMgLSBtZWFzdXJlQ291bnQ7XG5cbiAgICAgIGlmICh0aGlzLmJlYXRFbmdpbmUgJiYgdGhpcy5zdGFydE9uQmVhdCkge1xuICAgICAgICBjb25zdCBmbG9hdEJlYXRzID0gdGhpcy5udW1CZWF0cyAqIG1lYXN1cmVQaGFzZTtcbiAgICAgICAgY29uc3QgbmV4dEJlYXRDb3VudCA9IE1hdGguY2VpbChmbG9hdEJlYXRzKSAlIHRoaXMubnVtQmVhdHM7XG5cbiAgICAgICAgdGhpcy5tZWFzdXJlQ291bnQgPSBtZWFzdXJlQ291bnQ7IC8vIGN1cnJlbnQgbWVhc3VyZVxuICAgICAgICB0aGlzLmJlYXRDb3VudCA9IG5leHRCZWF0Q291bnQ7IC8vIG5leHQgYmVhdFxuXG4gICAgICAgIGlmKG5leHRCZWF0Q291bnQgIT09IDApIHtcbiAgICAgICAgICBjb25zdCBhdWRpb1RpbWUgPSBhdWRpb1NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgICAgICAgICBjb25zdCBuZXh0QmVhdERlbGF5ID0gKG5leHRCZWF0Q291bnQgLSBmbG9hdEJlYXRzKSAqIHRoaXMuYmVhdFBlcmlvZDtcbiAgICAgICAgICB0aGlzLmJlYXRFbmdpbmUucmVzZXRUaW1lKGF1ZGlvVGltZSArIG5leHRCZWF0RGVsYXkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmKG1lYXN1cmVQaGFzZSA+IDApXG4gICAgICAgIG1lYXN1cmVDb3VudCsrO1xuXG4gICAgICB0aGlzLm1lYXN1cmVDb3VudCA9IG1lYXN1cmVDb3VudDtcblxuICAgICAgcmV0dXJuIHN0YXJ0UG9zaXRpb24gKyBtZWFzdXJlQ291bnQgKiB0aGlzLm1lYXN1cmVMZW5ndGg7XG4gICAgfVxuXG4gICAgdGhpcy5tZWFzdXJlQ291bnQgPSAwO1xuICAgIHJldHVybiBzdGFydFBvc2l0aW9uO1xuICB9XG5cbiAgLy8gZ2VuZXJhdGUgbmV4dCBtZWFzdXJlXG4gIGFkdmFuY2VQb3NpdGlvbihzeW5jVGltZSwgbWV0cmljUG9zaXRpb24sIG1ldHJpY1NwZWVkKSB7XG4gICAgY29uc3QgYXVkaW9UaW1lID0gYXVkaW9TY2hlZHVsZXIuY3VycmVudFRpbWU7XG5cbiAgICAvLyB3aGV0aGVyIG1ldHJvbm9tZSBjb250aW51ZXMgKGRlZmF1bHQgaXMgdHJ1ZSlcbiAgICBjb25zdCBjb250ID0gdGhpcy5jYWxsYmFjayh0aGlzLm1lYXN1cmVDb3VudCwgMCk7XG5cbiAgICAvLyBAZml4bWUgLyByZWNoZWNrIC0gb3V0cHV0czpcbiAgICAvLyAxNCAwXG4gICAgLy8gMTUgMVxuICAgIC8vIDE1IDJcbiAgICAvLyAxNSAzXG4gICAgLy8gMTUgMFxuICAgIC8vIDE2IDFcbiAgICB0aGlzLm1lYXN1cmVDb3VudCsrO1xuICAgIHRoaXMuYmVhdENvdW50ID0gMTtcblxuICAgIGlmIChjb250ID09PSB1bmRlZmluZWQgfHwgY29udCA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKHRoaXMuYmVhdEVuZ2luZSlcbiAgICAgICAgdGhpcy5iZWF0RW5naW5lLnJlc2V0VGltZShhdWRpb1RpbWUgKyB0aGlzLmJlYXRQZXJpb2QpO1xuXG4gICAgICByZXR1cm4gbWV0cmljUG9zaXRpb24gKyB0aGlzLm1lYXN1cmVMZW5ndGg7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYmVhdEVuZ2luZSlcbiAgICAgIHRoaXMuYmVhdEVuZ2luZS5yZXNldFRpbWUoSW5maW5pdHkpO1xuXG4gICAgcmV0dXJuIEluZmluaXR5O1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5iZWF0RW5naW5lKVxuICAgICAgdGhpcy5iZWF0RW5naW5lLmRlc3Ryb3koKTtcblxuICAgIGlmICh0aGlzLm1hc3RlcilcbiAgICAgIHRoaXMubWFzdGVyLnJlbW92ZSh0aGlzKTtcbiAgfVxufVxuXG5jbGFzcyBNZXRyaWNTY2hlZHVsZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICB0aGlzLl9zeW5jU2NoZWR1bGVyID0gdGhpcy5yZXF1aXJlKCdzeW5jLXNjaGVkdWxlcicpO1xuXG4gICAgdGhpcy5fZW5naW5lUXVldWUgPSBuZXcgYXVkaW8uUHJpb3JpdHlRdWV1ZSgpO1xuICAgIHRoaXMuX2VuZ2luZVNldCA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLl9tZXRyb25vbWVFbmdpbmVNYXAgPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLl90ZW1wbyA9IDYwOyAvLyB0ZW1wbyBpbiBiZWF0cyBwZXIgbWludXRlIChCUE0pXG4gICAgdGhpcy5fdGVtcG9Vbml0ID0gMC4yNTsgLy8gdGVtcG8gdW5pdCBleHByZXNzZWQgaW4gZnJhY3Rpb25zIG9mIGEgd2hvbGUgbm90ZVxuICAgIHRoaXMuX21ldHJpY1NwZWVkID0gMC4yNTsgLy8gd2hvbGUgbm90ZXMgcGVyIHNlY29uZFxuXG4gICAgdGhpcy5fc3luY1RpbWUgPSAwO1xuICAgIHRoaXMuX21ldHJpY1Bvc2l0aW9uID0gMDtcblxuICAgIHRoaXMuX3N5bmNTY2hlZHVsZXJIb29rID0gbnVsbDtcbiAgICB0aGlzLl9zeW5jRXZlbnRFbmdpbmUgPSBudWxsO1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2NhbGxpbmdFdmVudExpc3RlbmVycyA9IGZhbHNlO1xuXG4gICAgLy8gY29uc3QgZGVmYXVsdHMgPSB7fTtcbiAgICAvLyB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9vbkluaXQgPSB0aGlzLl9vbkluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblN5bmMgPSB0aGlzLl9vblN5bmMuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNsZWFyID0gdGhpcy5fb25DbGVhci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuX3N5bmNTY2hlZHVsZXJIb29rID0gbmV3IFN5bmNTY2hlZHVsZXJIb29rKHRoaXMuX3N5bmNTY2hlZHVsZXIsIHRoaXMpO1xuICAgIHRoaXMuX3N5bmNFdmVudEVuZ2luZSA9IG5ldyBTeW5jRXZlbnRFbmdpbmUodGhpcy5fc3luY1NjaGVkdWxlciwgdGhpcyk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2luaXQnLCB0aGlzLl9vbkluaXQpO1xuICAgIHRoaXMucmVjZWl2ZSgnY2xlYXInLCB0aGlzLl9vbkNsZWFyKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3N5bmMnLCB0aGlzLl9vblN5bmMpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICBfY2FsbEV2ZW50TGlzdGVuZXJzKGV2ZW50KSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldChldmVudCk7XG5cbiAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICB0aGlzLl9jYWxsaW5nRXZlbnRMaXN0ZW5lcnMgPSB0cnVlO1xuXG4gICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICBzeW5jVGltZTogdGhpcy5fc3luY1RpbWUsXG4gICAgICAgIG1ldHJpY1Bvc2l0aW9uOiB0aGlzLl9tZXRyaWNQb3NpdGlvbixcbiAgICAgICAgdGVtcG86IHRoaXMuX3RlbXBvLFxuICAgICAgICB0ZW1wb1VuaXQ6IHRoaXMuX3RlbXBvVW5pdCxcbiAgICAgIH07XG5cbiAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIGxpc3RlbmVycylcbiAgICAgICAgY2FsbGJhY2soZXZlbnQsIGRhdGEpO1xuXG4gICAgICB0aGlzLl9jYWxsaW5nRXZlbnRMaXN0ZW5lcnMgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBfcmVzY2hlZHVsZU1ldHJpY0VuZ2luZXMoKSB7XG4gICAgY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmNUaW1lO1xuICAgIGNvbnN0IG1ldHJpY1Bvc2l0aW9uID0gdGhpcy5nZXRNZXRyaWNQb3NpdGlvbkF0U3luY1RpbWUoc3luY1RpbWUpO1xuXG4gICAgdGhpcy5fZW5naW5lUXVldWUuY2xlYXIoKTtcblxuICAgIGlmICh0aGlzLl9tZXRyaWNTcGVlZCA+IDApIHtcbiAgICAgIC8vIHBvc2l0aW9uIGVuZ2luZXNcbiAgICAgIGNvbnN0IG1ldHJpY1NwZWVkID0gdGhpcy5fbWV0cmljU3BlZWQ7XG4gICAgICBjb25zdCBxdWV1ZSA9IHRoaXMuX2VuZ2luZVF1ZXVlO1xuXG4gICAgICBmb3IgKGxldCBlbmdpbmUgb2YgdGhpcy5fZW5naW5lU2V0KSB7XG4gICAgICAgIGNvbnN0IG5leHRFbmdpbmVQb3NpdGlvbiA9IGVuZ2luZS5zeW5jUG9zaXRpb24oc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCBtZXRyaWNTcGVlZCk7XG4gICAgICAgIHF1ZXVlLmluc2VydChlbmdpbmUsIG5leHRFbmdpbmVQb3NpdGlvbik7XG4gICAgICB9XG4gICAgfcKgXG4gICAgZWxzZSB7XG4gICAgICAvLyBzdG9wIGVuZ2luZXNcbiAgICAgIGZvciAobGV0IGVuZ2luZSBvZiB0aGlzLl9lbmdpbmVTZXQpIHtcbiAgICAgICAgaWYgKGVuZ2luZS5zeW5jU3BlZWQpXG4gICAgICAgICAgZW5naW5lLnN5bmNTcGVlZChzeW5jVGltZSwgbWV0cmljUG9zaXRpb24sIDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3N5bmNTY2hlZHVsZXJIb29rLnJlc2NoZWR1bGUoKTtcbiAgfVxuXG4gIF9jbGVhckVuZ2luZXMoKSB7XG4gICAgdGhpcy5fZW5naW5lUXVldWUuY2xlYXIoKTtcbiAgICB0aGlzLl9lbmdpbmVTZXQuY2xlYXIoKTtcblxuICAgIGZvciAobGV0IFtrZXksIGVuZ2luZV0gb2YgdGhpcy5fbWV0cm9ub21lRW5naW5lTWFwKVxuICAgICAgZW5naW5lLmRlc3Ryb3koKTtcblxuICAgIHRoaXMuX21ldHJvbm9tZUVuZ2luZU1hcC5jbGVhcigpO1xuXG4gICAgdGhpcy5fc3luY1NjaGVkdWxlckhvb2sucmVzY2hlZHVsZSgpO1xuICB9XG5cbiAgX2FkdmFuY2VQb3NpdGlvbihzeW5jVGltZSwgbWV0cmljUG9zaXRpb24sIG1ldHJpY1NwZWVkKSB7XG4gICAgY29uc3QgZW5naW5lID0gdGhpcy5fZW5naW5lUXVldWUuaGVhZDtcbiAgICBjb25zdCBuZXh0RW5naW5lUG9zaXRpb24gPSBlbmdpbmUuYWR2YW5jZVBvc2l0aW9uKHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgbWV0cmljU3BlZWQpO1xuXG4gICAgaWYgKG5leHRFbmdpbmVQb3NpdGlvbiA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy5fZW5naW5lU2V0LmRlbGV0ZShlbmdpbmUpO1xuXG4gICAgcmV0dXJuIHRoaXMuX2VuZ2luZVF1ZXVlLm1vdmUoZW5naW5lLCBuZXh0RW5naW5lUG9zaXRpb24pO1xuICB9XG5cbiAgX3N5bmMoc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCB0ZW1wbywgdGVtcG9Vbml0LCBldmVudCkge1xuICAgIHRoaXMuX3N5bmNUaW1lID0gc3luY1RpbWU7XG4gICAgdGhpcy5fbWV0cmljUG9zaXRpb24gPSBtZXRyaWNQb3NpdGlvbjtcblxuICAgIHRoaXMuX3RlbXBvID0gdGVtcG87XG4gICAgdGhpcy5fdGVtcG9Vbml0ID0gdGVtcG9Vbml0O1xuICAgIHRoaXMuX21ldHJpY1NwZWVkID0gdGVtcG8gKiB0ZW1wb1VuaXQgLyA2MDtcblxuICAgIGlmIChldmVudClcbiAgICAgIHRoaXMuX2NhbGxFdmVudExpc3RlbmVycyhldmVudCk7XG5cbiAgICB0aGlzLl9yZXNjaGVkdWxlTWV0cmljRW5naW5lcygpO1xuICB9XG5cbiAgX2NsZWFyU3luY0V2ZW50KCkge1xuICAgIHRoaXMuX3N5bmNFdmVudEVuZ2luZS5yZXNldCgpO1xuICB9XG5cbiAgX3NldFN5bmNFdmVudChzeW5jVGltZSwgbWV0cmljUG9zaXRpb24sIHRlbXBvLCB0ZW1wb1VuaXQsIGV2ZW50KSB7XG4gICAgdGhpcy5fY2xlYXJTeW5jRXZlbnQoKTtcblxuICAgIGlmIChzeW5jVGltZSA+IHRoaXMuc3luY1RpbWUpXG4gICAgICB0aGlzLl9zeW5jRXZlbnRFbmdpbmUuc2V0KHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgdGVtcG8sIHRlbXBvVW5pdCwgZXZlbnQpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuX3N5bmMoc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCB0ZW1wbywgdGVtcG9Vbml0LCBldmVudCk7XG4gIH1cblxuICBfb25Jbml0KHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgdGVtcG8sIHRlbXBvVW5pdCkge1xuICAgIHRoaXMuX3N5bmMoc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCB0ZW1wbywgdGVtcG9Vbml0KTtcbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICBfb25DbGVhcigpIHtcbiAgICB0aGlzLl9jbGVhclN5bmNFdmVudCgpO1xuICAgIHRoaXMuX2NsZWFyRW5naW5lcygpO1xuICB9XG5cbiAgX29uU3luYyhzeW5jVGltZSwgbWV0cmljUG9zaXRpb24sIHRlbXBvLCB0ZW1wb1VuaXQsIGV2ZW50KSB7XG4gICAgdGhpcy5fc2V0U3luY0V2ZW50KHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgdGVtcG8sIHRlbXBvVW5pdCwgZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgYXVkaW8gdGltZS5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBhdWRpb1RpbWUoKSB7XG4gICAgcmV0dXJuIGF1ZGlvU2NoZWR1bGVyLmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgZ2V0IHN5bmNUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jU2NoZWR1bGVyLnN5bmNUaW1lO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jU2NoZWR1bGVyLnN5bmNUaW1lO1xuICB9XG5cbiAgZ2V0IG1ldHJpY1Bvc2l0aW9uKCkge1xuICAgIGlmICh0aGlzLl90ZW1wbyA+IDApXG4gICAgICByZXR1cm4gdGhpcy5fbWV0cmljUG9zaXRpb24gKyAodGhpcy5fc3luY1NjaGVkdWxlci5zeW5jVGltZSAtIHRoaXMuX3N5bmNUaW1lKSAqIHRoaXMuX21ldHJpY1NwZWVkO1xuXG4gICAgcmV0dXJuIHRoaXMuX21ldHJpY1Bvc2l0aW9uO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNQb3NpdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaWZmZXJlbmNlIGJldHdlZW4gdGhlIGF1ZGlvIHNjaGVkdWxlcidzIGxvZ2ljYWwgYXVkaW8gdGltZSBhbmQgdGhlIGBjdXJyZW50VGltZWBcbiAgICogb2YgdGhlIGF1ZGlvIGNvbnRleHQuXG4gICAqL1xuICBnZXQgZGVsdGFUaW1lKCkge1xuICAgIHJldHVybiBhdWRpb1NjaGVkdWxlci5jdXJyZW50VGltZSAtIGF1ZGlvLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdXJyZW50IHRlbXBvLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gVGVtcG8gaW4gQlBNLlxuICAgKi9cbiAgZ2V0IHRlbXBvKCkge1xuICAgIHJldHVybiB0aGlzLl90ZW1wbztcbiAgfVxuXG4gIC8qKlxuICAgKiBDdXJyZW50IHRlbXBvIHVuaXQuXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBUZW1wbyB1bml0IGluIHJlc3BlY3QgdG8gd2hvbGUgbm90ZS5cbiAgICovXG4gIGdldCB0ZW1wb1VuaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RlbXBvVW5pdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbWV0cmljIHBvc2l0aW9uIGNvcnJzcG9uZGluZyB0byBhIGdpdmVuIGF1ZGlvIHRpbWUgKHJlZ2FyZGluZyB0aGUgY3VycmVudCB0ZW1wbykuXG4gICAqIEBwYXJhbSAge051bWJlcn0gdGltZSAtIHRpbWVcbiAgICogQHJldHVybiB7TnVtYmVyfSAtIG1ldHJpYyBwb3NpdGlvblxuICAgKi9cbiAgZ2V0TWV0cmljUG9zaXRpb25BdEF1ZGlvVGltZShhdWRpb1RpbWUpIHtcbiAgICBpZiAodGhpcy5fdGVtcG8gPiAwKSB7XG4gICAgICBjb25zdCBzeW5jVGltZSA9IHRoaXMuX3N5bmNTY2hlZHVsZXIuZ2V0U3luY1RpbWVBdEF1ZGlvVGltZShhdWRpb1RpbWUpO1xuICAgICAgcmV0dXJuIHRoaXMuX21ldHJpY1Bvc2l0aW9uICsgKHN5bmNUaW1lIC0gdGhpcy5fc3luY1RpbWUpICogdGhpcy5fbWV0cmljU3BlZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX21ldHJpY1Bvc2l0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBtZXRyaWMgcG9zaXRpb24gY29ycnNwb25kaW5nIHRvIGEgZ2l2ZW4gc3luYyB0aW1lIChyZWdhcmRpbmcgdGhlIGN1cnJlbnQgdGVtcG8pLlxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHRpbWUgLSB0aW1lXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBtZXRyaWMgcG9zaXRpb25cbiAgICovXG4gIGdldE1ldHJpY1Bvc2l0aW9uQXRTeW5jVGltZShzeW5jVGltZSkge1xuICAgIGlmICh0aGlzLl90ZW1wbyA+IDApXG4gICAgICByZXR1cm4gdGhpcy5fbWV0cmljUG9zaXRpb24gKyAoc3luY1RpbWUgLSB0aGlzLl9zeW5jVGltZSkgKiB0aGlzLl9tZXRyaWNTcGVlZDtcblxuICAgIHJldHVybiB0aGlzLl9tZXRyaWNQb3NpdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgc3luYyB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gYSBnaXZlbiBtZXRyaWMgcG9zaXRpb24gKHJlZ2FyZGluZyB0aGUgY3VycmVudCB0ZW1wbykuXG4gICAqIEBwYXJhbSAge051bWJlcn0gcG9zaXRpb24gLSBtZXRyaWMgcG9zaXRpb25cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIHN5bmMgdGltZVxuICAgKi9cbiAgZ2V0U3luY1RpbWVBdE1ldHJpY1Bvc2l0aW9uKG1ldHJpY1Bvc2l0aW9uKSB7XG4gICAgY29uc3QgbWV0cmljU3BlZWQgPSB0aGlzLl9tZXRyaWNTcGVlZDtcblxuICAgIGlmIChtZXRyaWNQb3NpdGlvbiA8IEluZmluaXR5ICYmIG1ldHJpY1NwZWVkID4gMClcbiAgICAgIHJldHVybiB0aGlzLl9zeW5jVGltZSArIChtZXRyaWNQb3NpdGlvbiAtIHRoaXMuX21ldHJpY1Bvc2l0aW9uKSAvIG1ldHJpY1NwZWVkO1xuXG4gICAgcmV0dXJuIEluZmluaXR5O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhdWRpbyB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gYSBnaXZlbiBtZXRyaWMgcG9zaXRpb24gKHJlZ2FyZGluZyB0aGUgY3VycmVudCB0ZW1wbykuXG4gICAqIEBwYXJhbSAge051bWJlcn0gcG9zaXRpb24gLSBtZXRyaWMgcG9zaXRpb25cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIGF1ZGlvIHRpbWVcbiAgICovXG4gIGdldEF1ZGlvVGltZUF0TWV0cmljUG9zaXRpb24obWV0cmljUG9zaXRpb24pIHtcbiAgICBjb25zdCBtZXRyaWNTcGVlZCA9IHRoaXMuX21ldHJpY1NwZWVkO1xuXG4gICAgaWYgKG1ldHJpY1Bvc2l0aW9uIDwgSW5maW5pdHkgJiYgbWV0cmljU3BlZWQgPiAwKSB7XG4gICAgICBjb25zdCBzeW5jVGltZSA9IHRoaXMuX3N5bmNUaW1lICsgKG1ldHJpY1Bvc2l0aW9uIC0gdGhpcy5fbWV0cmljUG9zaXRpb24pIC8gbWV0cmljU3BlZWQ7XG4gICAgICByZXR1cm4gdGhpcy5fc3luY1NjaGVkdWxlci5nZXRBdWRpb1RpbWVBdFN5bmNUaW1lKHN5bmNUaW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gSW5maW5pdHk7XG4gIH1cblxuICBhZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGV2ZW50KTtcblxuICAgIGlmICghbGlzdGVuZXJzKSB7XG4gICAgICBsaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMuc2V0KGV2ZW50LCBsaXN0ZW5lcnMpO1xuICAgIH1cblxuICAgIGxpc3RlbmVycy5hZGQoY2FsbGJhY2spO1xuICB9XG5cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGV2ZW50KTtcblxuICAgIGlmIChsaXN0ZW5lcnMpXG4gICAgICBsaXN0ZW5lcnMucmVtb3ZlKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsIGEgZnVuY3Rpb24gYXQgYSBnaXZlbiBtZXRyaWMgcG9zaXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1biAtIEZ1bmN0aW9uIHRvIGJlIGRlZmVycmVkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbWV0cmljUG9zaXRpb24gLSBUaGUgbWV0cmljIHBvc2l0aW9uIGF0IHdoaWNoIHRoZSBmdW5jdGlvbiBzaG91bGQgYmUgZXhlY3V0ZWQuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2xvb2thaGVhZD1mYWxzZV0gLSBEZWZpbmVzIHdoZXRoZXIgdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZFxuICAgKiAgYW50aWNpcGF0ZWQgKGUuZy4gZm9yIGF1ZGlvIGV2ZW50cykgb3IgcHJlY2lzZWx5IGF0IHRoZSBnaXZlbiB0aW1lIChkZWZhdWx0KS5cbiAgICovXG4gIGFkZEV2ZW50KGZ1biwgbWV0cmljUG9zaXRpb24sIGxvb2thaGVhZCA9IGZhbHNlKSB7XG4gICAgY29uc3Qgc2NoZWR1bGVyU2VydmljZSA9IHRoaXM7XG4gICAgY29uc3QgZW5naW5lID0ge1xuICAgICAgdGltZW91dDogbnVsbCxcbiAgICAgIHN5bmNTcGVlZCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgaWYgKHNwZWVkID09PSAwKVxuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgfSxcbiAgICAgIHN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG5cbiAgICAgICAgaWYgKG1ldHJpY1Bvc2l0aW9uID49IHBvc2l0aW9uKVxuICAgICAgICAgIHJldHVybiBtZXRyaWNQb3NpdGlvbjtcblxuICAgICAgICByZXR1cm4gSW5maW5pdHk7XG4gICAgICB9LFxuICAgICAgYWR2YW5jZVBvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHNjaGVkdWxlclNlcnZpY2UuZGVsdGFUaW1lO1xuXG4gICAgICAgIGlmIChkZWx0YSA+IDApXG4gICAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChmdW4sIDEwMDAgKiBkZWx0YSwgcG9zaXRpb24pOyAvLyBicmlkZ2Ugc2NoZWR1bGVyIGxvb2thaGVhZCB3aXRoIHRpbWVvdXRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGZ1bihwb3NpdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIEluZmluaXR5O1xuICAgICAgfSxcbiAgICB9O1xuXG4gICAgdGhpcy5hZGQoZW5naW5lLCBtZXRyaWNQb3NpdGlvbik7IC8vIGFkZCB3aXRob3V0IGNoZWNrc1xuICB9XG5cbiAgYWRkKGVuZ2luZSwgc3RhcnRQb3NpdGlvbiA9IHRoaXMubWV0cmljUG9zaXRpb24pIHtcbiAgICB0aGlzLl9lbmdpbmVTZXQuYWRkKGVuZ2luZSk7XG5cbiAgICBjb25zdCBtZXRyaWNQb3NpdGlvbiA9IE1hdGgubWF4KHN0YXJ0UG9zaXRpb24sIHRoaXMubWV0cmljUG9zaXRpb24pO1xuXG4gICAgLy8gc2NoZWR1bGUgZW5naW5lXG4gICAgaWYgKCF0aGlzLl9jYWxsaW5nRXZlbnRMaXN0ZW5lcnMgJiYgdGhpcy5fbWV0cmljU3BlZWQgPiAwKSB7XG4gICAgICBjb25zdCBzeW5jVGltZSA9IHRoaXMuc3luY1RpbWU7XG4gICAgICBjb25zdCBuZXh0RW5naW5lUG9zaXRpb24gPSBlbmdpbmUuc3luY1Bvc2l0aW9uKHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgdGhpcy5fbWV0cmljU3BlZWQpO1xuXG4gICAgICB0aGlzLl9lbmdpbmVRdWV1ZS5pbnNlcnQoZW5naW5lLCBuZXh0RW5naW5lUG9zaXRpb24pO1xuICAgICAgdGhpcy5fc3luY1NjaGVkdWxlckhvb2sucmVzY2hlZHVsZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShlbmdpbmUpIHtcbiAgICBjb25zdCBzeW5jVGltZSA9IHRoaXMuc3luY1RpbWU7XG4gICAgY29uc3QgbWV0cmljUG9zaXRpb24gPSB0aGlzLmdldE1ldHJpY1Bvc2l0aW9uQXRTeW5jVGltZShzeW5jVGltZSk7XG5cbiAgICAvLyBzdG9wIGVuZ2luZVxuICAgIGlmIChlbmdpbmUuc3luY1NwZWVkKVxuICAgICAgZW5naW5lLnN5bmNTcGVlZChzeW5jVGltZSwgbWV0cmljUG9zaXRpb24sIDApO1xuXG4gICAgaWYgKHRoaXMuX2VuZ2luZVNldC5kZWxldGUoZW5naW5lKSAmJiAhdGhpcy5fY2FsbGluZ0V2ZW50TGlzdGVuZXJzICYmIHRoaXMuX21ldHJpY1NwZWVkID4gMCkge1xuICAgICAgdGhpcy5fZW5naW5lUXVldWUucmVtb3ZlKGVuZ2luZSk7XG4gICAgICB0aGlzLl9zeW5jU2NoZWR1bGVySG9vay5yZXNjaGVkdWxlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHBlcmlvZGljIGNhbGxiYWNrIHN0YXJ0aW5nIGF0IGEgZ2l2ZW4gbWV0cmljIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIGNhbGxiYWNrIGZ1bmN0aW9uIChjeWNsZSwgYmVhdClcbiAgICogQHBhcmFtIHtJbnRlZ2VyfSBudW1CZWF0cyAtIG51bWJlciBvZiBiZWF0cyAodGltZSBzaWduYXR1cmUgbnVtZXJhdG9yKVxuICAgKiBAcGFyYW0ge051bWJlcn0gbWV0cmljRGl2IC0gbWV0cmljIGRpdmlzaW9uIG9mIHdob2xlIG5vdGUgKHRpbWUgc2lnbmF0dXJlIGRlbm9taW5hdG9yKVxuICAgKiBAcGFyYW0ge051bWJlcn0gdGVtcG9TY2FsZSAtIGxpbmVhciB0ZW1wbyBzY2FsZSBmYWN0b3IgKGluIHJlc3BlY3QgdG8gbWFzdGVyIHRlbXBvKVxuICAgKiBAcGFyYW0ge0ludGVnZXJ9IHN0YXJ0UG9zaXRpb24gLSBtZXRyaWMgc3RhcnQgcG9zaXRpb24gb2YgdGhlIGJlYXRcbiAgICovXG4gIGFkZE1ldHJvbm9tZShjYWxsYmFjaywgbnVtQmVhdHMgPSA0LCBtZXRyaWNEaXYgPSA0LCB0ZW1wb1NjYWxlID0gMSwgc3RhcnRQb3NpdGlvbiA9IDAsIHN0YXJ0T25CZWF0ID0gZmFsc2UpIHtcbiAgICBjb25zdCBiZWF0TGVuZ3RoID0gMSAvIChtZXRyaWNEaXYgKiB0ZW1wb1NjYWxlKTtcbiAgICBjb25zdCBlbmdpbmUgPSBuZXcgTWV0cm9ub21lRW5naW5lKHN0YXJ0UG9zaXRpb24sIG51bUJlYXRzLCBiZWF0TGVuZ3RoLCBzdGFydE9uQmVhdCwgY2FsbGJhY2spO1xuXG4gICAgdGhpcy5fbWV0cm9ub21lRW5naW5lTWFwLnNldChjYWxsYmFjaywgZW5naW5lKTtcbiAgICB0aGlzLmFkZChlbmdpbmUsIHN0YXJ0UG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBwZXJpb2RpYyBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICovXG4gIHJlbW92ZU1ldHJvbm9tZShjYWxsYmFjayAvKiwgZW5kUG9zaXRpb24gKi8gKSB7XG4gICAgY29uc3QgZW5naW5lID0gdGhpcy5fbWV0cm9ub21lRW5naW5lTWFwLmdldChjYWxsYmFjayk7XG5cbiAgICBpZiAoZW5naW5lKSB7XG4gICAgICB0aGlzLl9tZXRyb25vbWVFbmdpbmVNYXAuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICAgIHRoaXMucmVtb3ZlKGVuZ2luZSk7XG4gICAgfVxuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIE1ldHJpY1NjaGVkdWxlcik7XG5cbmV4cG9ydCBkZWZhdWx0IE1ldHJpY1NjaGVkdWxlcjtcbiJdfQ==