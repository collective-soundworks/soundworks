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

      this.measureCount++;

      // whether metronome continues (default is true)
      var cont = this.callback(this.measureCount, 0);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1ldHJpY1NjaGVkdWxlci5qcyJdLCJuYW1lcyI6WyJhdWRpbyIsImF1ZGlvU2NoZWR1bGVyIiwiZ2V0U2NoZWR1bGVyIiwiU0VSVklDRV9JRCIsIkVQU0lMT04iLCJTeW5jU2NoZWR1bGVySG9vayIsInN5bmNTY2hlZHVsZXIiLCJtZXRyaWNTY2hlZHVsZXIiLCJuZXh0UG9zaXRpb24iLCJJbmZpbml0eSIsIm5leHRUaW1lIiwiYWRkIiwic3luY1RpbWUiLCJfYWR2YW5jZVBvc2l0aW9uIiwiX21ldHJpY1NwZWVkIiwiZ2V0U3luY1RpbWVBdE1ldHJpY1Bvc2l0aW9uIiwiX2VuZ2luZVF1ZXVlIiwidGltZSIsInJlc2V0VGltZSIsIlRpbWVFbmdpbmUiLCJTeW5jRXZlbnRFbmdpbmUiLCJ1bmRlZmluZWQiLCJtZXRyaWNQb3NpdGlvbiIsInRlbXBvIiwidGVtcG9Vbml0IiwiZXZlbnQiLCJfc3luYyIsIkJlYXRFbmdpbmUiLCJtZXRybyIsImF1ZGlvVGltZSIsImNvbnQiLCJjYWxsYmFjayIsIm1lYXN1cmVDb3VudCIsImJlYXRDb3VudCIsIm51bUJlYXRzIiwiYmVhdFBlcmlvZCIsInJlc2V0UG9zaXRpb24iLCJtYXN0ZXIiLCJyZW1vdmUiLCJNZXRyb25vbWVFbmdpbmUiLCJzdGFydFBvc2l0aW9uIiwiYmVhdExlbmd0aCIsInN0YXJ0T25CZWF0IiwibWVhc3VyZUxlbmd0aCIsImJlYXRFbmdpbmUiLCJtZXRyaWNTcGVlZCIsInJlbGF0aXZlUG9zaXRpb24iLCJmbG9hdE1lYXN1cmVzIiwiTWF0aCIsImZsb29yIiwibWVhc3VyZVBoYXNlIiwiZmxvYXRCZWF0cyIsIm5leHRCZWF0Q291bnQiLCJjZWlsIiwiY3VycmVudFRpbWUiLCJuZXh0QmVhdERlbGF5IiwiZGVzdHJveSIsIk1ldHJpY1NjaGVkdWxlciIsIl9zeW5jU2NoZWR1bGVyIiwicmVxdWlyZSIsIlByaW9yaXR5UXVldWUiLCJfZW5naW5lU2V0IiwiX21ldHJvbm9tZUVuZ2luZU1hcCIsIl90ZW1wbyIsIl90ZW1wb1VuaXQiLCJfc3luY1RpbWUiLCJfbWV0cmljUG9zaXRpb24iLCJfc3luY1NjaGVkdWxlckhvb2siLCJfc3luY0V2ZW50RW5naW5lIiwiX2xpc3RlbmVycyIsIl9jYWxsaW5nRXZlbnRMaXN0ZW5lcnMiLCJfb25Jbml0IiwiYmluZCIsIl9vblN5bmMiLCJfb25DbGVhciIsInNlbmQiLCJyZWNlaXZlIiwibGlzdGVuZXJzIiwiZ2V0IiwiZGF0YSIsImdldE1ldHJpY1Bvc2l0aW9uQXRTeW5jVGltZSIsImNsZWFyIiwicXVldWUiLCJlbmdpbmUiLCJuZXh0RW5naW5lUG9zaXRpb24iLCJzeW5jUG9zaXRpb24iLCJpbnNlcnQiLCJzeW5jU3BlZWQiLCJyZXNjaGVkdWxlIiwia2V5IiwiaGVhZCIsImFkdmFuY2VQb3NpdGlvbiIsImRlbGV0ZSIsIm1vdmUiLCJfY2FsbEV2ZW50TGlzdGVuZXJzIiwiX3Jlc2NoZWR1bGVNZXRyaWNFbmdpbmVzIiwicmVzZXQiLCJfY2xlYXJTeW5jRXZlbnQiLCJzZXQiLCJyZWFkeSIsIl9jbGVhckVuZ2luZXMiLCJfc2V0U3luY0V2ZW50IiwiZ2V0U3luY1RpbWVBdEF1ZGlvVGltZSIsImdldEF1ZGlvVGltZUF0U3luY1RpbWUiLCJmdW4iLCJsb29rYWhlYWQiLCJzY2hlZHVsZXJTZXJ2aWNlIiwidGltZW91dCIsInBvc2l0aW9uIiwic3BlZWQiLCJjbGVhclRpbWVvdXQiLCJkZWx0YSIsImRlbHRhVGltZSIsInNldFRpbWVvdXQiLCJtYXgiLCJtZXRyaWNEaXYiLCJ0ZW1wb1NjYWxlIiwiYXVkaW9Db250ZXh0IiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlBLEs7Ozs7OztBQUNaLElBQU1DLGlCQUFpQkQsTUFBTUUsWUFBTixFQUF2Qjs7QUFFQSxJQUFNQyxhQUFhLDBCQUFuQjs7QUFFQSxJQUFNQyxVQUFVLEtBQWhCOztJQUVNQyxpQjs7O0FBQ0osNkJBQVlDLGFBQVosRUFBMkJDLGVBQTNCLEVBQTRDO0FBQUE7O0FBQUE7O0FBRzFDLFVBQUtDLFlBQUwsR0FBb0JDLFFBQXBCO0FBQ0EsVUFBS0MsUUFBTCxHQUFnQkQsUUFBaEI7O0FBRUEsVUFBS0gsYUFBTCxHQUFxQkEsYUFBckI7QUFDQSxVQUFLQyxlQUFMLEdBQXVCQSxlQUF2Qjs7QUFFQUQsa0JBQWNLLEdBQWQsUUFBd0JGLFFBQXhCLEVBVDBDLENBU1A7QUFUTztBQVUzQzs7OztnQ0FFV0csUSxFQUFVO0FBQ3BCLFVBQU1MLGtCQUFrQixLQUFLQSxlQUE3QjtBQUNBLFVBQU1DLGVBQWVELGdCQUFnQk0sZ0JBQWhCLENBQWlDRCxRQUFqQyxFQUEyQyxLQUFLSixZQUFoRCxFQUE4REQsZ0JBQWdCTyxZQUE5RSxDQUFyQjtBQUNBLFVBQU1KLFdBQVdILGdCQUFnQlEsMkJBQWhCLENBQTRDUCxZQUE1QyxDQUFqQjs7QUFFQSxXQUFLQSxZQUFMLEdBQW9CQSxZQUFwQjtBQUNBLFdBQUtFLFFBQUwsR0FBZ0JBLFFBQWhCOztBQUVBLGFBQU9BLFFBQVA7QUFDRDs7O2lDQUVZO0FBQ1gsVUFBTUgsa0JBQWtCLEtBQUtBLGVBQTdCO0FBQ0EsVUFBTUMsZUFBZUQsZ0JBQWdCUyxZQUFoQixDQUE2QkMsSUFBbEQ7QUFDQSxVQUFNTCxXQUFXTCxnQkFBZ0JRLDJCQUFoQixDQUE0Q1AsWUFBNUMsQ0FBakI7O0FBRUEsVUFBSUksYUFBYSxLQUFLRixRQUF0QixFQUFnQztBQUM5QixhQUFLRixZQUFMLEdBQW9CQSxZQUFwQjtBQUNBLGFBQUtFLFFBQUwsR0FBZ0JFLFFBQWhCOztBQUVBLGFBQUtNLFNBQUwsQ0FBZU4sUUFBZjtBQUNEO0FBQ0Y7OztFQW5DNkJaLE1BQU1tQixVOztJQXNDaENDLGU7OztBQUNKLDJCQUFZZCxhQUFaLEVBQTJCQyxlQUEzQixFQUE0QztBQUFBOztBQUFBOztBQUcxQyxXQUFLRCxhQUFMLEdBQXFCQSxhQUFyQjtBQUNBLFdBQUtDLGVBQUwsR0FBdUJBLGVBQXZCOztBQUVBLFdBQUtLLFFBQUwsR0FBZ0JTLFNBQWhCO0FBQ0EsV0FBS0MsY0FBTCxHQUFzQkQsU0FBdEI7QUFDQSxXQUFLRSxLQUFMLEdBQWFGLFNBQWI7QUFDQSxXQUFLRyxTQUFMLEdBQWlCSCxTQUFqQjtBQUNBLFdBQUtJLEtBQUwsR0FBYUosU0FBYjs7QUFFQWYsa0JBQWNLLEdBQWQsU0FBd0JGLFFBQXhCO0FBWjBDO0FBYTNDOzs7O2dDQUVXRyxRLEVBQVU7QUFDcEIsV0FBS0wsZUFBTCxDQUFxQm1CLEtBQXJCLENBQTJCLEtBQUtkLFFBQWhDLEVBQTBDLEtBQUtVLGNBQS9DLEVBQStELEtBQUtDLEtBQXBFLEVBQTJFLEtBQUtDLFNBQWhGLEVBQTJGLEtBQUtDLEtBQWhHO0FBQ0EsYUFBT2hCLFFBQVA7QUFDRDs7O3dCQUVHRyxRLEVBQVVVLGMsRUFBZ0JDLEssRUFBT0MsUyxFQUFXQyxLLEVBQU87QUFDckQsV0FBS2IsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxXQUFLVSxjQUFMLEdBQXNCQSxjQUF0QjtBQUNBLFdBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFdBQUtDLFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0EsV0FBS0MsS0FBTCxHQUFhQSxLQUFiOztBQUVBLFdBQUtQLFNBQUwsQ0FBZU4sUUFBZjtBQUNEOzs7MEJBRUtBLFEsRUFBVVUsYyxFQUFnQkMsSyxFQUFPQyxTLEVBQVdDLEssRUFBTztBQUN2RCxXQUFLYixRQUFMLEdBQWdCUyxTQUFoQjtBQUNBLFdBQUtDLGNBQUwsR0FBc0JELFNBQXRCO0FBQ0EsV0FBS0UsS0FBTCxHQUFhRixTQUFiO0FBQ0EsV0FBS0csU0FBTCxHQUFpQkgsU0FBakI7QUFDQSxXQUFLSSxLQUFMLEdBQWFKLFNBQWI7O0FBRUEsV0FBS0gsU0FBTCxDQUFlVCxRQUFmO0FBQ0Q7OztFQXZDMkJULE1BQU1tQixVOztJQTBDOUJRLFU7OztBQUNKLHNCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUE7O0FBR2pCLFdBQUtBLEtBQUwsR0FBYUEsS0FBYjtBQUNBM0IsbUJBQWVVLEdBQWYsU0FBeUJGLFFBQXpCO0FBSmlCO0FBS2xCOztBQUVEOzs7OztnQ0FDWW9CLFMsRUFBVztBQUNyQixVQUFNRCxRQUFRLEtBQUtBLEtBQW5COztBQUVBLFVBQU1FLE9BQU9GLE1BQU1HLFFBQU4sQ0FBZUgsTUFBTUksWUFBckIsRUFBbUNKLE1BQU1LLFNBQXpDLENBQWI7QUFDQUwsWUFBTUssU0FBTjs7QUFFQSxVQUFJSCxTQUFTVCxTQUFULElBQXNCUyxTQUFTLElBQW5DLEVBQXlDO0FBQ3ZDLFlBQUlGLE1BQU1LLFNBQU4sSUFBbUJMLE1BQU1NLFFBQTdCLEVBQ0UsT0FBT3pCLFFBQVA7O0FBRUYsZUFBT29CLFlBQVlELE1BQU1PLFVBQXpCO0FBQ0Q7O0FBRURQLFlBQU1RLGFBQU4sQ0FBb0IzQixRQUFwQjtBQUNBLGFBQU9BLFFBQVA7QUFDRDs7OzhCQUVTO0FBQ1IsV0FBS21CLEtBQUwsR0FBYSxJQUFiOztBQUVBLFVBQUksS0FBS1MsTUFBVCxFQUNFLEtBQUtBLE1BQUwsQ0FBWUMsTUFBWixDQUFtQixJQUFuQjtBQUNIOzs7RUEvQnNCdEMsTUFBTW1CLFU7O0lBa0N6Qm9CLGU7OztBQUNKLDJCQUFZQyxhQUFaLEVBQTJCTixRQUEzQixFQUFxQ08sVUFBckMsRUFBaURDLFdBQWpELEVBQThEWCxRQUE5RCxFQUF3RTtBQUFBOztBQUFBOztBQUd0RSxXQUFLUyxhQUFMLEdBQXFCQSxhQUFyQjtBQUNBLFdBQUtOLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsV0FBS08sVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxXQUFLQyxXQUFMLEdBQW1CQSxXQUFuQjtBQUNBLFdBQUtYLFFBQUwsR0FBZ0JBLFFBQWhCOztBQUVBLFdBQUtZLGFBQUwsR0FBcUJULFdBQVdPLFVBQWhDO0FBQ0EsV0FBS04sVUFBTCxHQUFrQixDQUFsQjtBQUNBLFdBQUtILFlBQUwsR0FBb0IsQ0FBcEI7QUFDQSxXQUFLQyxTQUFMLEdBQWlCLENBQWpCOztBQUVBLFFBQUlDLFdBQVcsQ0FBZixFQUNFLE9BQUtVLFVBQUwsR0FBa0IsSUFBSWpCLFVBQUosUUFBbEI7QUFmb0U7QUFnQnZFOztBQUVEOzs7Ozs4QkFDVWYsUSxFQUFVVSxjLEVBQWdCdUIsVyxFQUFhO0FBQy9DLFVBQUlBLGVBQWUsQ0FBZixJQUFvQixLQUFLRCxVQUE3QixFQUNFLEtBQUtBLFVBQUwsQ0FBZ0IxQixTQUFoQixDQUEwQlQsUUFBMUI7QUFDSDs7QUFFRDs7OztpQ0FDYUcsUSxFQUFVVSxjLEVBQWdCdUIsVyxFQUFhO0FBQ2xELFVBQU1MLGdCQUFnQixLQUFLQSxhQUEzQjs7QUFFQSxVQUFJLEtBQUtJLFVBQVQsRUFDRSxLQUFLQSxVQUFMLENBQWdCMUIsU0FBaEIsQ0FBMEJULFFBQTFCOztBQUVGO0FBQ0E7QUFDQWEsd0JBQWtCbEIsT0FBbEI7O0FBRUEsV0FBSytCLFVBQUwsR0FBa0IsS0FBS00sVUFBTCxHQUFrQkksV0FBcEM7QUFDQSxXQUFLWixTQUFMLEdBQWlCLENBQWpCOztBQUVBLFVBQUlYLGtCQUFrQmtCLGFBQXRCLEVBQXFDO0FBQ25DLFlBQU1NLG1CQUFtQnhCLGlCQUFpQmtCLGFBQTFDO0FBQ0EsWUFBTU8sZ0JBQWdCRCxtQkFBbUIsS0FBS0gsYUFBOUM7QUFDQSxZQUFJWCxlQUFlZ0IsS0FBS0MsS0FBTCxDQUFXRixhQUFYLENBQW5CO0FBQ0EsWUFBTUcsZUFBZUgsZ0JBQWdCZixZQUFyQzs7QUFFQSxZQUFJLEtBQUtZLFVBQUwsSUFBbUIsS0FBS0YsV0FBNUIsRUFBeUM7QUFDdkMsY0FBTVMsYUFBYSxLQUFLakIsUUFBTCxHQUFnQmdCLFlBQW5DO0FBQ0EsY0FBTUUsZ0JBQWdCSixLQUFLSyxJQUFMLENBQVVGLFVBQVYsSUFBd0IsS0FBS2pCLFFBQW5EOztBQUVBLGVBQUtGLFlBQUwsR0FBb0JBLFlBQXBCLENBSnVDLENBSUw7QUFDbEMsZUFBS0MsU0FBTCxHQUFpQm1CLGFBQWpCLENBTHVDLENBS1A7O0FBRWhDLGNBQUdBLGtCQUFrQixDQUFyQixFQUF3QjtBQUN0QixnQkFBTXZCLFlBQVk1QixlQUFlcUQsV0FBakM7QUFDQSxnQkFBTUMsZ0JBQWdCLENBQUNILGdCQUFnQkQsVUFBakIsSUFBK0IsS0FBS2hCLFVBQTFEO0FBQ0EsaUJBQUtTLFVBQUwsQ0FBZ0IxQixTQUFoQixDQUEwQlcsWUFBWTBCLGFBQXRDO0FBQ0Q7QUFDRjs7QUFFRCxZQUFHTCxlQUFlLENBQWxCLEVBQ0VsQjs7QUFFRixhQUFLQSxZQUFMLEdBQW9CQSxZQUFwQjs7QUFFQSxlQUFPUSxnQkFBZ0JSLGVBQWUsS0FBS1csYUFBM0M7QUFDRDs7QUFFRCxXQUFLWCxZQUFMLEdBQW9CLENBQXBCO0FBQ0EsYUFBT1EsYUFBUDtBQUNEOztBQUVEOzs7O29DQUNnQjVCLFEsRUFBVVUsYyxFQUFnQnVCLFcsRUFBYTtBQUNyRCxVQUFNaEIsWUFBWTVCLGVBQWVxRCxXQUFqQzs7QUFFQSxXQUFLdEIsWUFBTDs7QUFFQTtBQUNBLFVBQU1GLE9BQU8sS0FBS0MsUUFBTCxDQUFjLEtBQUtDLFlBQW5CLEVBQWlDLENBQWpDLENBQWI7O0FBRUEsV0FBS0MsU0FBTCxHQUFpQixDQUFqQjs7QUFFQSxVQUFJSCxTQUFTVCxTQUFULElBQXNCUyxTQUFTLElBQW5DLEVBQXlDO0FBQ3ZDLFlBQUksS0FBS2MsVUFBVCxFQUNFLEtBQUtBLFVBQUwsQ0FBZ0IxQixTQUFoQixDQUEwQlcsWUFBWSxLQUFLTSxVQUEzQzs7QUFFRixlQUFPYixpQkFBaUIsS0FBS3FCLGFBQTdCO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLQyxVQUFULEVBQ0UsS0FBS0EsVUFBTCxDQUFnQjFCLFNBQWhCLENBQTBCVCxRQUExQjs7QUFFRixhQUFPQSxRQUFQO0FBQ0Q7Ozs4QkFFUztBQUNSLFVBQUksS0FBS21DLFVBQVQsRUFDRSxLQUFLQSxVQUFMLENBQWdCWSxPQUFoQjs7QUFFRixVQUFJLEtBQUtuQixNQUFULEVBQ0UsS0FBS0EsTUFBTCxDQUFZQyxNQUFaLENBQW1CLElBQW5CO0FBQ0g7OztFQXJHMkJ0QyxNQUFNbUIsVTs7SUF3RzlCc0MsZTs7O0FBQ0osNkJBQWM7QUFBQTs7QUFBQSx5SkFDTnRELFVBRE0sRUFDTSxJQUROOztBQUdaLFdBQUt1RCxjQUFMLEdBQXNCLE9BQUtDLE9BQUwsQ0FBYSxnQkFBYixDQUF0Qjs7QUFFQSxXQUFLM0MsWUFBTCxHQUFvQixJQUFJaEIsTUFBTTRELGFBQVYsRUFBcEI7QUFDQSxXQUFLQyxVQUFMLEdBQWtCLG1CQUFsQjtBQUNBLFdBQUtDLG1CQUFMLEdBQTJCLG1CQUEzQjs7QUFFQSxXQUFLQyxNQUFMLEdBQWMsRUFBZCxDQVRZLENBU007QUFDbEIsV0FBS0MsVUFBTCxHQUFrQixJQUFsQixDQVZZLENBVVk7QUFDeEIsV0FBS2xELFlBQUwsR0FBb0IsSUFBcEIsQ0FYWSxDQVdjOztBQUUxQixXQUFLbUQsU0FBTCxHQUFpQixDQUFqQjtBQUNBLFdBQUtDLGVBQUwsR0FBdUIsQ0FBdkI7O0FBRUEsV0FBS0Msa0JBQUwsR0FBMEIsSUFBMUI7QUFDQSxXQUFLQyxnQkFBTCxHQUF3QixJQUF4Qjs7QUFFQSxXQUFLQyxVQUFMLEdBQWtCLG1CQUFsQjtBQUNBLFdBQUtDLHNCQUFMLEdBQThCLEtBQTlCOztBQUVBO0FBQ0E7O0FBRUEsV0FBS0MsT0FBTCxHQUFlLE9BQUtBLE9BQUwsQ0FBYUMsSUFBYixRQUFmO0FBQ0EsV0FBS0MsT0FBTCxHQUFlLE9BQUtBLE9BQUwsQ0FBYUQsSUFBYixRQUFmO0FBQ0EsV0FBS0UsUUFBTCxHQUFnQixPQUFLQSxRQUFMLENBQWNGLElBQWQsUUFBaEI7QUEzQlk7QUE0QmI7Ozs7NEJBRU87QUFDTjs7QUFFQSxXQUFLTCxrQkFBTCxHQUEwQixJQUFJOUQsaUJBQUosQ0FBc0IsS0FBS3FELGNBQTNCLEVBQTJDLElBQTNDLENBQTFCO0FBQ0EsV0FBS1UsZ0JBQUwsR0FBd0IsSUFBSWhELGVBQUosQ0FBb0IsS0FBS3NDLGNBQXpCLEVBQXlDLElBQXpDLENBQXhCOztBQUVBLFdBQUtpQixJQUFMLENBQVUsU0FBVjtBQUNBLFdBQUtDLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLEtBQUtMLE9BQTFCO0FBQ0EsV0FBS0ssT0FBTCxDQUFhLE9BQWIsRUFBc0IsS0FBS0YsUUFBM0I7QUFDQSxXQUFLRSxPQUFMLENBQWEsTUFBYixFQUFxQixLQUFLSCxPQUExQjtBQUNEOzs7MkJBRU07QUFDTDtBQUNEOzs7d0NBRW1CaEQsSyxFQUFPO0FBQ3pCLFVBQU1vRCxZQUFZLEtBQUtSLFVBQUwsQ0FBZ0JTLEdBQWhCLENBQW9CckQsS0FBcEIsQ0FBbEI7O0FBRUEsVUFBSW9ELFNBQUosRUFBZTtBQUNiLGFBQUtQLHNCQUFMLEdBQThCLElBQTlCOztBQUVBLFlBQU1TLE9BQU87QUFDWG5FLG9CQUFVLEtBQUtxRCxTQURKO0FBRVgzQywwQkFBZ0IsS0FBSzRDLGVBRlY7QUFHWDNDLGlCQUFPLEtBQUt3QyxNQUhEO0FBSVh2QyxxQkFBVyxLQUFLd0M7QUFKTCxTQUFiOztBQUhhO0FBQUE7QUFBQTs7QUFBQTtBQVViLDBEQUFxQmEsU0FBckI7QUFBQSxnQkFBUzlDLFFBQVQ7O0FBQ0VBLHFCQUFTTixLQUFULEVBQWdCc0QsSUFBaEI7QUFERjtBQVZhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBYWIsYUFBS1Qsc0JBQUwsR0FBOEIsS0FBOUI7QUFDRDtBQUNGOzs7K0NBRTBCO0FBQ3pCLFVBQU0xRCxXQUFXLEtBQUtBLFFBQXRCO0FBQ0EsVUFBTVUsaUJBQWlCLEtBQUswRCwyQkFBTCxDQUFpQ3BFLFFBQWpDLENBQXZCOztBQUVBLFdBQUtJLFlBQUwsQ0FBa0JpRSxLQUFsQjs7QUFFQSxVQUFJLEtBQUtuRSxZQUFMLEdBQW9CLENBQXhCLEVBQTJCO0FBQ3pCO0FBQ0EsWUFBTStCLGNBQWMsS0FBSy9CLFlBQXpCO0FBQ0EsWUFBTW9FLFFBQVEsS0FBS2xFLFlBQW5COztBQUh5QjtBQUFBO0FBQUE7O0FBQUE7QUFLekIsMkRBQW1CLEtBQUs2QyxVQUF4QixpSEFBb0M7QUFBQSxnQkFBM0JzQixNQUEyQjs7QUFDbEMsZ0JBQU1DLHFCQUFxQkQsT0FBT0UsWUFBUCxDQUFvQnpFLFFBQXBCLEVBQThCVSxjQUE5QixFQUE4Q3VCLFdBQTlDLENBQTNCO0FBQ0FxQyxrQkFBTUksTUFBTixDQUFhSCxNQUFiLEVBQXFCQyxrQkFBckI7QUFDRDtBQVJ3QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUzFCLE9BVEQsTUFVSztBQUNIO0FBREc7QUFBQTtBQUFBOztBQUFBO0FBRUgsMkRBQW1CLEtBQUt2QixVQUF4QixpSEFBb0M7QUFBQSxnQkFBM0JzQixPQUEyQjs7QUFDbEMsZ0JBQUlBLFFBQU9JLFNBQVgsRUFDRUosUUFBT0ksU0FBUCxDQUFpQjNFLFFBQWpCLEVBQTJCVSxjQUEzQixFQUEyQyxDQUEzQztBQUNIO0FBTEU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1KOztBQUVELFdBQUs2QyxrQkFBTCxDQUF3QnFCLFVBQXhCO0FBQ0Q7OztvQ0FFZTtBQUNkLFdBQUt4RSxZQUFMLENBQWtCaUUsS0FBbEI7QUFDQSxXQUFLcEIsVUFBTCxDQUFnQm9CLEtBQWhCOztBQUZjO0FBQUE7QUFBQTs7QUFBQTtBQUlkLHlEQUEwQixLQUFLbkIsbUJBQS9CO0FBQUE7QUFBQSxjQUFVMkIsR0FBVjtBQUFBLGNBQWVOLE1BQWY7O0FBQ0VBLGlCQUFPM0IsT0FBUDtBQURGO0FBSmM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFPZCxXQUFLTSxtQkFBTCxDQUF5Qm1CLEtBQXpCOztBQUVBLFdBQUtkLGtCQUFMLENBQXdCcUIsVUFBeEI7QUFDRDs7O3FDQUVnQjVFLFEsRUFBVVUsYyxFQUFnQnVCLFcsRUFBYTtBQUN0RCxVQUFNc0MsU0FBUyxLQUFLbkUsWUFBTCxDQUFrQjBFLElBQWpDO0FBQ0EsVUFBTU4scUJBQXFCRCxPQUFPUSxlQUFQLENBQXVCL0UsUUFBdkIsRUFBaUNVLGNBQWpDLEVBQWlEdUIsV0FBakQsQ0FBM0I7O0FBRUEsVUFBSXVDLHVCQUF1Qi9ELFNBQTNCLEVBQ0UsS0FBS3dDLFVBQUwsQ0FBZ0IrQixNQUFoQixDQUF1QlQsTUFBdkI7O0FBRUYsYUFBTyxLQUFLbkUsWUFBTCxDQUFrQjZFLElBQWxCLENBQXVCVixNQUF2QixFQUErQkMsa0JBQS9CLENBQVA7QUFDRDs7OzBCQUVLeEUsUSxFQUFVVSxjLEVBQWdCQyxLLEVBQU9DLFMsRUFBV0MsSyxFQUFPO0FBQ3ZELFdBQUt3QyxTQUFMLEdBQWlCckQsUUFBakI7QUFDQSxXQUFLc0QsZUFBTCxHQUF1QjVDLGNBQXZCOztBQUVBLFdBQUt5QyxNQUFMLEdBQWN4QyxLQUFkO0FBQ0EsV0FBS3lDLFVBQUwsR0FBa0J4QyxTQUFsQjtBQUNBLFdBQUtWLFlBQUwsR0FBb0JTLFFBQVFDLFNBQVIsR0FBb0IsRUFBeEM7O0FBRUEsVUFBSUMsS0FBSixFQUNFLEtBQUtxRSxtQkFBTCxDQUF5QnJFLEtBQXpCOztBQUVGLFdBQUtzRSx3QkFBTDtBQUNEOzs7c0NBRWlCO0FBQ2hCLFdBQUszQixnQkFBTCxDQUFzQjRCLEtBQXRCO0FBQ0Q7OztrQ0FFYXBGLFEsRUFBVVUsYyxFQUFnQkMsSyxFQUFPQyxTLEVBQVdDLEssRUFBTztBQUMvRCxXQUFLd0UsZUFBTDs7QUFFQSxVQUFJckYsV0FBVyxLQUFLQSxRQUFwQixFQUNFLEtBQUt3RCxnQkFBTCxDQUFzQjhCLEdBQXRCLENBQTBCdEYsUUFBMUIsRUFBb0NVLGNBQXBDLEVBQW9EQyxLQUFwRCxFQUEyREMsU0FBM0QsRUFBc0VDLEtBQXRFLEVBREYsS0FHRSxLQUFLQyxLQUFMLENBQVdkLFFBQVgsRUFBcUJVLGNBQXJCLEVBQXFDQyxLQUFyQyxFQUE0Q0MsU0FBNUMsRUFBdURDLEtBQXZEO0FBQ0g7Ozs0QkFFT2IsUSxFQUFVVSxjLEVBQWdCQyxLLEVBQU9DLFMsRUFBVztBQUNsRCxXQUFLRSxLQUFMLENBQVdkLFFBQVgsRUFBcUJVLGNBQXJCLEVBQXFDQyxLQUFyQyxFQUE0Q0MsU0FBNUM7QUFDQSxXQUFLMkUsS0FBTDtBQUNEOzs7K0JBRVU7QUFDVCxXQUFLRixlQUFMO0FBQ0EsV0FBS0csYUFBTDtBQUNEOzs7NEJBRU94RixRLEVBQVVVLGMsRUFBZ0JDLEssRUFBT0MsUyxFQUFXQyxLLEVBQU87QUFDekQsV0FBSzRFLGFBQUwsQ0FBbUJ6RixRQUFuQixFQUE2QlUsY0FBN0IsRUFBNkNDLEtBQTdDLEVBQW9EQyxTQUFwRCxFQUErREMsS0FBL0Q7QUFDRDs7QUFFRDs7Ozs7Ozs7O0FBbURBOzs7OztpREFLNkJJLFMsRUFBVztBQUN0QyxVQUFJLEtBQUtrQyxNQUFMLEdBQWMsQ0FBbEIsRUFBcUI7QUFDbkIsWUFBTW5ELFdBQVcsS0FBSzhDLGNBQUwsQ0FBb0I0QyxzQkFBcEIsQ0FBMkN6RSxTQUEzQyxDQUFqQjtBQUNBLGVBQU8sS0FBS3FDLGVBQUwsR0FBdUIsQ0FBQ3RELFdBQVcsS0FBS3FELFNBQWpCLElBQThCLEtBQUtuRCxZQUFqRTtBQUNEOztBQUVELGFBQU8sS0FBS29ELGVBQVo7QUFDRDs7QUFFRDs7Ozs7Ozs7Z0RBSzRCdEQsUSxFQUFVO0FBQ3BDLFVBQUksS0FBS21ELE1BQUwsR0FBYyxDQUFsQixFQUNFLE9BQU8sS0FBS0csZUFBTCxHQUF1QixDQUFDdEQsV0FBVyxLQUFLcUQsU0FBakIsSUFBOEIsS0FBS25ELFlBQWpFOztBQUVGLGFBQU8sS0FBS29ELGVBQVo7QUFDRDs7QUFFRDs7Ozs7Ozs7Z0RBSzRCNUMsYyxFQUFnQjtBQUMxQyxVQUFNdUIsY0FBYyxLQUFLL0IsWUFBekI7O0FBRUEsVUFBSVEsaUJBQWlCYixRQUFqQixJQUE2Qm9DLGNBQWMsQ0FBL0MsRUFDRSxPQUFPLEtBQUtvQixTQUFMLEdBQWlCLENBQUMzQyxpQkFBaUIsS0FBSzRDLGVBQXZCLElBQTBDckIsV0FBbEU7O0FBRUYsYUFBT3BDLFFBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7aURBSzZCYSxjLEVBQWdCO0FBQzNDLFVBQU11QixjQUFjLEtBQUsvQixZQUF6Qjs7QUFFQSxVQUFJUSxpQkFBaUJiLFFBQWpCLElBQTZCb0MsY0FBYyxDQUEvQyxFQUFrRDtBQUNoRCxZQUFNakMsV0FBVyxLQUFLcUQsU0FBTCxHQUFpQixDQUFDM0MsaUJBQWlCLEtBQUs0QyxlQUF2QixJQUEwQ3JCLFdBQTVFO0FBQ0EsZUFBTyxLQUFLYSxjQUFMLENBQW9CNkMsc0JBQXBCLENBQTJDM0YsUUFBM0MsQ0FBUDtBQUNEOztBQUVELGFBQU9ILFFBQVA7QUFDRDs7O3FDQUVnQmdCLEssRUFBT00sUSxFQUFVO0FBQ2hDLFVBQUk4QyxZQUFZLEtBQUtSLFVBQUwsQ0FBZ0JTLEdBQWhCLENBQW9CckQsS0FBcEIsQ0FBaEI7O0FBRUEsVUFBSSxDQUFDb0QsU0FBTCxFQUFnQjtBQUNkQSxvQkFBWSxtQkFBWjtBQUNBLGFBQUtSLFVBQUwsQ0FBZ0I2QixHQUFoQixDQUFvQnpFLEtBQXBCLEVBQTJCb0QsU0FBM0I7QUFDRDs7QUFFREEsZ0JBQVVsRSxHQUFWLENBQWNvQixRQUFkO0FBQ0Q7Ozt3Q0FFbUJBLFEsRUFBVTtBQUM1QixVQUFJOEMsWUFBWSxLQUFLUixVQUFMLENBQWdCUyxHQUFoQixDQUFvQnJELEtBQXBCLENBQWhCOztBQUVBLFVBQUlvRCxTQUFKLEVBQ0VBLFVBQVV2QyxNQUFWLENBQWlCUCxRQUFqQjtBQUNIOztBQUVEOzs7Ozs7Ozs7Ozs2QkFRU3lFLEcsRUFBS2xGLGMsRUFBbUM7QUFBQSxVQUFuQm1GLFNBQW1CLHVFQUFQLEtBQU87O0FBQy9DLFVBQU1DLG1CQUFtQixJQUF6QjtBQUNBLFVBQU12QixTQUFTO0FBQ2J3QixpQkFBUyxJQURJO0FBRWJwQixpQkFGYSxxQkFFSHRFLElBRkcsRUFFRzJGLFFBRkgsRUFFYUMsS0FGYixFQUVvQjtBQUMvQixjQUFJQSxVQUFVLENBQWQsRUFDRUMsYUFBYSxLQUFLSCxPQUFsQjtBQUNILFNBTFk7QUFNYnRCLG9CQU5hLHdCQU1BcEUsSUFOQSxFQU1NMkYsUUFOTixFQU1nQkMsS0FOaEIsRUFNdUI7QUFDbENDLHVCQUFhLEtBQUtILE9BQWxCOztBQUVBLGNBQUlyRixrQkFBa0JzRixRQUF0QixFQUNFLE9BQU90RixjQUFQOztBQUVGLGlCQUFPYixRQUFQO0FBQ0QsU0FiWTtBQWNia0YsdUJBZGEsMkJBY0cxRSxJQWRILEVBY1MyRixRQWRULEVBY21CQyxLQWRuQixFQWMwQjtBQUNyQyxjQUFNRSxRQUFRTCxpQkFBaUJNLFNBQS9COztBQUVBLGNBQUlELFFBQVEsQ0FBWixFQUNFLEtBQUtKLE9BQUwsR0FBZU0sV0FBV1QsR0FBWCxFQUFnQixPQUFPTyxLQUF2QixFQUE4QkgsUUFBOUIsQ0FBZixDQURGLENBQzBEO0FBRDFELGVBR0VKLElBQUlJLFFBQUo7O0FBRUYsaUJBQU9uRyxRQUFQO0FBQ0Q7QUF2QlksT0FBZjs7QUEwQkEsV0FBS0UsR0FBTCxDQUFTd0UsTUFBVCxFQUFpQjdELGNBQWpCLEVBNUIrQyxDQTRCYjtBQUNuQzs7O3dCQUVHNkQsTSxFQUE2QztBQUFBLFVBQXJDM0MsYUFBcUMsdUVBQXJCLEtBQUtsQixjQUFnQjs7QUFDL0MsV0FBS3VDLFVBQUwsQ0FBZ0JsRCxHQUFoQixDQUFvQndFLE1BQXBCOztBQUVBLFVBQU03RCxpQkFBaUIwQixLQUFLa0UsR0FBTCxDQUFTMUUsYUFBVCxFQUF3QixLQUFLbEIsY0FBN0IsQ0FBdkI7O0FBRUE7QUFDQSxVQUFJLENBQUMsS0FBS2dELHNCQUFOLElBQWdDLEtBQUt4RCxZQUFMLEdBQW9CLENBQXhELEVBQTJEO0FBQ3pELFlBQU1GLFdBQVcsS0FBS0EsUUFBdEI7QUFDQSxZQUFNd0UscUJBQXFCRCxPQUFPRSxZQUFQLENBQW9CekUsUUFBcEIsRUFBOEJVLGNBQTlCLEVBQThDLEtBQUtSLFlBQW5ELENBQTNCOztBQUVBLGFBQUtFLFlBQUwsQ0FBa0JzRSxNQUFsQixDQUF5QkgsTUFBekIsRUFBaUNDLGtCQUFqQztBQUNBLGFBQUtqQixrQkFBTCxDQUF3QnFCLFVBQXhCO0FBQ0Q7QUFDRjs7OzJCQUVNTCxNLEVBQVE7QUFDYixVQUFNdkUsV0FBVyxLQUFLQSxRQUF0QjtBQUNBLFVBQU1VLGlCQUFpQixLQUFLMEQsMkJBQUwsQ0FBaUNwRSxRQUFqQyxDQUF2Qjs7QUFFQTtBQUNBLFVBQUl1RSxPQUFPSSxTQUFYLEVBQ0VKLE9BQU9JLFNBQVAsQ0FBaUIzRSxRQUFqQixFQUEyQlUsY0FBM0IsRUFBMkMsQ0FBM0M7O0FBRUYsVUFBSSxLQUFLdUMsVUFBTCxDQUFnQitCLE1BQWhCLENBQXVCVCxNQUF2QixLQUFrQyxDQUFDLEtBQUtiLHNCQUF4QyxJQUFrRSxLQUFLeEQsWUFBTCxHQUFvQixDQUExRixFQUE2RjtBQUMzRixhQUFLRSxZQUFMLENBQWtCc0IsTUFBbEIsQ0FBeUI2QyxNQUF6QjtBQUNBLGFBQUtoQixrQkFBTCxDQUF3QnFCLFVBQXhCO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7aUNBUWF6RCxRLEVBQStGO0FBQUEsVUFBckZHLFFBQXFGLHVFQUExRSxDQUEwRTtBQUFBLFVBQXZFaUYsU0FBdUUsdUVBQTNELENBQTJEO0FBQUEsVUFBeERDLFVBQXdELHVFQUEzQyxDQUEyQztBQUFBLFVBQXhDNUUsYUFBd0MsdUVBQXhCLENBQXdCO0FBQUEsVUFBckJFLFdBQXFCLHVFQUFQLEtBQU87O0FBQzFHLFVBQU1ELGFBQWEsS0FBSzBFLFlBQVlDLFVBQWpCLENBQW5CO0FBQ0EsVUFBTWpDLFNBQVMsSUFBSTVDLGVBQUosQ0FBb0JDLGFBQXBCLEVBQW1DTixRQUFuQyxFQUE2Q08sVUFBN0MsRUFBeURDLFdBQXpELEVBQXNFWCxRQUF0RSxDQUFmOztBQUVBLFdBQUsrQixtQkFBTCxDQUF5Qm9DLEdBQXpCLENBQTZCbkUsUUFBN0IsRUFBdUNvRCxNQUF2QztBQUNBLFdBQUt4RSxHQUFMLENBQVN3RSxNQUFULEVBQWlCM0MsYUFBakI7QUFDRDs7QUFFRDs7Ozs7OztvQ0FJZ0JULFEsQ0FBUyxrQixFQUFxQjtBQUM1QyxVQUFNb0QsU0FBUyxLQUFLckIsbUJBQUwsQ0FBeUJnQixHQUF6QixDQUE2Qi9DLFFBQTdCLENBQWY7O0FBRUEsVUFBSW9ELE1BQUosRUFBWTtBQUNWLGFBQUtyQixtQkFBTCxDQUF5QjhCLE1BQXpCLENBQWdDN0QsUUFBaEM7QUFDQSxhQUFLTyxNQUFMLENBQVk2QyxNQUFaO0FBQ0Q7QUFDRjs7O3dCQXhOZTtBQUNkLGFBQU9sRixlQUFlcUQsV0FBdEI7QUFDRDs7O3dCQUVjO0FBQ2IsYUFBTyxLQUFLSSxjQUFMLENBQW9COUMsUUFBM0I7QUFDRDs7O3dCQUVpQjtBQUNoQixhQUFPLEtBQUs4QyxjQUFMLENBQW9COUMsUUFBM0I7QUFDRDs7O3dCQUVvQjtBQUNuQixVQUFJLEtBQUttRCxNQUFMLEdBQWMsQ0FBbEIsRUFDRSxPQUFPLEtBQUtHLGVBQUwsR0FBdUIsQ0FBQyxLQUFLUixjQUFMLENBQW9COUMsUUFBcEIsR0FBK0IsS0FBS3FELFNBQXJDLElBQWtELEtBQUtuRCxZQUFyRjs7QUFFRixhQUFPLEtBQUtvRCxlQUFaO0FBQ0Q7Ozt3QkFFcUI7QUFDcEIsYUFBTyxLQUFLNUMsY0FBWjtBQUNEOztBQUVEOzs7Ozs7O3dCQUlnQjtBQUNkLGFBQU9yQixlQUFlcUQsV0FBZixHQUE2QnRELE1BQU1xSCxZQUFOLENBQW1CL0QsV0FBdkQ7QUFDRDs7QUFFRDs7Ozs7Ozt3QkFJWTtBQUNWLGFBQU8sS0FBS1MsTUFBWjtBQUNEOztBQUVEOzs7Ozs7O3dCQUlnQjtBQUNkLGFBQU8sS0FBS0MsVUFBWjtBQUNEOzs7OztBQThLSCx5QkFBZXNELFFBQWYsQ0FBd0JuSCxVQUF4QixFQUFvQ3NELGVBQXBDOztrQkFFZUEsZSIsImZpbGUiOiJNZXRyaWNTY2hlZHVsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0ICogYXMgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuY29uc3QgYXVkaW9TY2hlZHVsZXIgPSBhdWRpby5nZXRTY2hlZHVsZXIoKTtcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOm1ldHJpYy1zY2hlZHVsZXInO1xuXG5jb25zdCBFUFNJTE9OID0gMWUtMTI7XG5cbmNsYXNzIFN5bmNTY2hlZHVsZXJIb29rIGV4dGVuZHMgYXVkaW8uVGltZUVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKHN5bmNTY2hlZHVsZXIsIG1ldHJpY1NjaGVkdWxlcikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm5leHRQb3NpdGlvbiA9IEluZmluaXR5O1xuICAgIHRoaXMubmV4dFRpbWUgPSBJbmZpbml0eTtcblxuICAgIHRoaXMuc3luY1NjaGVkdWxlciA9IHN5bmNTY2hlZHVsZXI7XG4gICAgdGhpcy5tZXRyaWNTY2hlZHVsZXIgPSBtZXRyaWNTY2hlZHVsZXI7XG5cbiAgICBzeW5jU2NoZWR1bGVyLmFkZCh0aGlzLCBJbmZpbml0eSk7IC8vIGFkZCBob29rIHRvIHN5bmMgKG1hc3Rlcikgc2NoZWR1bGVyXG4gIH1cblxuICBhZHZhbmNlVGltZShzeW5jVGltZSkge1xuICAgIGNvbnN0IG1ldHJpY1NjaGVkdWxlciA9IHRoaXMubWV0cmljU2NoZWR1bGVyO1xuICAgIGNvbnN0IG5leHRQb3NpdGlvbiA9IG1ldHJpY1NjaGVkdWxlci5fYWR2YW5jZVBvc2l0aW9uKHN5bmNUaW1lLCB0aGlzLm5leHRQb3NpdGlvbiwgbWV0cmljU2NoZWR1bGVyLl9tZXRyaWNTcGVlZCk7XG4gICAgY29uc3QgbmV4dFRpbWUgPSBtZXRyaWNTY2hlZHVsZXIuZ2V0U3luY1RpbWVBdE1ldHJpY1Bvc2l0aW9uKG5leHRQb3NpdGlvbik7XG5cbiAgICB0aGlzLm5leHRQb3NpdGlvbiA9IG5leHRQb3NpdGlvbjtcbiAgICB0aGlzLm5leHRUaW1lID0gbmV4dFRpbWU7XG5cbiAgICByZXR1cm4gbmV4dFRpbWU7XG4gIH1cblxuICByZXNjaGVkdWxlKCkge1xuICAgIGNvbnN0IG1ldHJpY1NjaGVkdWxlciA9IHRoaXMubWV0cmljU2NoZWR1bGVyO1xuICAgIGNvbnN0IG5leHRQb3NpdGlvbiA9IG1ldHJpY1NjaGVkdWxlci5fZW5naW5lUXVldWUudGltZTtcbiAgICBjb25zdCBzeW5jVGltZSA9IG1ldHJpY1NjaGVkdWxlci5nZXRTeW5jVGltZUF0TWV0cmljUG9zaXRpb24obmV4dFBvc2l0aW9uKTtcblxuICAgIGlmIChzeW5jVGltZSAhPT0gdGhpcy5uZXh0VGltZSkge1xuICAgICAgdGhpcy5uZXh0UG9zaXRpb24gPSBuZXh0UG9zaXRpb247XG4gICAgICB0aGlzLm5leHRUaW1lID0gc3luY1RpbWU7XG5cbiAgICAgIHRoaXMucmVzZXRUaW1lKHN5bmNUaW1lKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgU3luY0V2ZW50RW5naW5lIGV4dGVuZHMgYXVkaW8uVGltZUVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKHN5bmNTY2hlZHVsZXIsIG1ldHJpY1NjaGVkdWxlcikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN5bmNTY2hlZHVsZXIgPSBzeW5jU2NoZWR1bGVyO1xuICAgIHRoaXMubWV0cmljU2NoZWR1bGVyID0gbWV0cmljU2NoZWR1bGVyO1xuXG4gICAgdGhpcy5zeW5jVGltZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLm1ldHJpY1Bvc2l0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudGVtcG8gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy50ZW1wb1VuaXQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5ldmVudCA9IHVuZGVmaW5lZDtcblxuICAgIHN5bmNTY2hlZHVsZXIuYWRkKHRoaXMsIEluZmluaXR5KTtcbiAgfVxuXG4gIGFkdmFuY2VUaW1lKHN5bmNUaW1lKSB7XG4gICAgdGhpcy5tZXRyaWNTY2hlZHVsZXIuX3N5bmModGhpcy5zeW5jVGltZSwgdGhpcy5tZXRyaWNQb3NpdGlvbiwgdGhpcy50ZW1wbywgdGhpcy50ZW1wb1VuaXQsIHRoaXMuZXZlbnQpO1xuICAgIHJldHVybiBJbmZpbml0eTtcbiAgfVxuXG4gIHNldChzeW5jVGltZSwgbWV0cmljUG9zaXRpb24sIHRlbXBvLCB0ZW1wb1VuaXQsIGV2ZW50KSB7XG4gICAgdGhpcy5zeW5jVGltZSA9IHN5bmNUaW1lO1xuICAgIHRoaXMubWV0cmljUG9zaXRpb24gPSBtZXRyaWNQb3NpdGlvbjtcbiAgICB0aGlzLnRlbXBvID0gdGVtcG87XG4gICAgdGhpcy50ZW1wb1VuaXQgPSB0ZW1wb1VuaXQ7XG4gICAgdGhpcy5ldmVudCA9IGV2ZW50O1xuXG4gICAgdGhpcy5yZXNldFRpbWUoc3luY1RpbWUpO1xuICB9XG5cbiAgcmVzZXQoc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCB0ZW1wbywgdGVtcG9Vbml0LCBldmVudCkge1xuICAgIHRoaXMuc3luY1RpbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5tZXRyaWNQb3NpdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRlbXBvID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudGVtcG9Vbml0ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZXZlbnQgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLnJlc2V0VGltZShJbmZpbml0eSk7XG4gIH1cbn1cblxuY2xhc3MgQmVhdEVuZ2luZSBleHRlbmRzIGF1ZGlvLlRpbWVFbmdpbmUge1xuICBjb25zdHJ1Y3RvcihtZXRybykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm1ldHJvID0gbWV0cm87XG4gICAgYXVkaW9TY2hlZHVsZXIuYWRkKHRoaXMsIEluZmluaXR5KTtcbiAgfVxuXG4gIC8vIGdlbmVyYXRlIG5leHQgYmVhdFxuICBhZHZhbmNlVGltZShhdWRpb1RpbWUpIHtcbiAgICBjb25zdCBtZXRybyA9IHRoaXMubWV0cm87XG5cbiAgICBjb25zdCBjb250ID0gbWV0cm8uY2FsbGJhY2sobWV0cm8ubWVhc3VyZUNvdW50LCBtZXRyby5iZWF0Q291bnQpO1xuICAgIG1ldHJvLmJlYXRDb3VudCsrO1xuXG4gICAgaWYgKGNvbnQgPT09IHVuZGVmaW5lZCB8fCBjb250ID09PSB0cnVlKSB7XG4gICAgICBpZiAobWV0cm8uYmVhdENvdW50ID49IG1ldHJvLm51bUJlYXRzKVxuICAgICAgICByZXR1cm4gSW5maW5pdHk7XG5cbiAgICAgIHJldHVybiBhdWRpb1RpbWUgKyBtZXRyby5iZWF0UGVyaW9kO1xuICAgIH1cblxuICAgIG1ldHJvLnJlc2V0UG9zaXRpb24oSW5maW5pdHkpO1xuICAgIHJldHVybiBJbmZpbml0eTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5tZXRybyA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5tYXN0ZXIpXG4gICAgICB0aGlzLm1hc3Rlci5yZW1vdmUodGhpcyk7XG4gIH1cbn1cblxuY2xhc3MgTWV0cm9ub21lRW5naW5lIGV4dGVuZHMgYXVkaW8uVGltZUVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKHN0YXJ0UG9zaXRpb24sIG51bUJlYXRzLCBiZWF0TGVuZ3RoLCBzdGFydE9uQmVhdCwgY2FsbGJhY2spIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zdGFydFBvc2l0aW9uID0gc3RhcnRQb3NpdGlvbjtcbiAgICB0aGlzLm51bUJlYXRzID0gbnVtQmVhdHM7XG4gICAgdGhpcy5iZWF0TGVuZ3RoID0gYmVhdExlbmd0aDtcbiAgICB0aGlzLnN0YXJ0T25CZWF0ID0gc3RhcnRPbkJlYXQ7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuXG4gICAgdGhpcy5tZWFzdXJlTGVuZ3RoID0gbnVtQmVhdHMgKiBiZWF0TGVuZ3RoO1xuICAgIHRoaXMuYmVhdFBlcmlvZCA9IDA7XG4gICAgdGhpcy5tZWFzdXJlQ291bnQgPSAwO1xuICAgIHRoaXMuYmVhdENvdW50ID0gMDtcblxuICAgIGlmIChudW1CZWF0cyA+IDEpXG4gICAgICB0aGlzLmJlYXRFbmdpbmUgPSBuZXcgQmVhdEVuZ2luZSh0aGlzKTtcbiAgfVxuXG4gIC8vIHJldHVybiBwb3NpdGlvbiBvZiBuZXh0IG1lYXN1cmVcbiAgc3luY1NwZWVkKHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgbWV0cmljU3BlZWQpIHtcbiAgICBpZiAobWV0cmljU3BlZWQgPD0gMCAmJiB0aGlzLmJlYXRFbmdpbmUpXG4gICAgICB0aGlzLmJlYXRFbmdpbmUucmVzZXRUaW1lKEluZmluaXR5KTtcbiAgfVxuXG4gIC8vIHJldHVybiBwb3NpdGlvbiBvZiBuZXh0IG1lYXN1cmVcbiAgc3luY1Bvc2l0aW9uKHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgbWV0cmljU3BlZWQpIHtcbiAgICBjb25zdCBzdGFydFBvc2l0aW9uID0gdGhpcy5zdGFydFBvc2l0aW9uO1xuXG4gICAgaWYgKHRoaXMuYmVhdEVuZ2luZSlcbiAgICAgIHRoaXMuYmVhdEVuZ2luZS5yZXNldFRpbWUoSW5maW5pdHkpO1xuXG4gICAgLy8gc2luY2Ugd2UgYXJlIGFueXdheSBhIGxpdHRsZSBpbiBhZHZhbmNlLCBtYWtlIHN1cmUgdGhhdCB3ZSBkb24ndCBza2lwXG4gICAgLy8gdGhlIHN0YXJ0IHBvaW50IGR1ZSB0byByb3VuZGluZyBlcnJvcnNcbiAgICBtZXRyaWNQb3NpdGlvbiAtPSBFUFNJTE9OO1xuXG4gICAgdGhpcy5iZWF0UGVyaW9kID0gdGhpcy5iZWF0TGVuZ3RoIC8gbWV0cmljU3BlZWQ7XG4gICAgdGhpcy5iZWF0Q291bnQgPSAwO1xuXG4gICAgaWYgKG1ldHJpY1Bvc2l0aW9uID49IHN0YXJ0UG9zaXRpb24pIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUG9zaXRpb24gPSBtZXRyaWNQb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb247XG4gICAgICBjb25zdCBmbG9hdE1lYXN1cmVzID0gcmVsYXRpdmVQb3NpdGlvbiAvIHRoaXMubWVhc3VyZUxlbmd0aDtcbiAgICAgIGxldCBtZWFzdXJlQ291bnQgPSBNYXRoLmZsb29yKGZsb2F0TWVhc3VyZXMpO1xuICAgICAgY29uc3QgbWVhc3VyZVBoYXNlID0gZmxvYXRNZWFzdXJlcyAtIG1lYXN1cmVDb3VudDtcblxuICAgICAgaWYgKHRoaXMuYmVhdEVuZ2luZSAmJiB0aGlzLnN0YXJ0T25CZWF0KSB7XG4gICAgICAgIGNvbnN0IGZsb2F0QmVhdHMgPSB0aGlzLm51bUJlYXRzICogbWVhc3VyZVBoYXNlO1xuICAgICAgICBjb25zdCBuZXh0QmVhdENvdW50ID0gTWF0aC5jZWlsKGZsb2F0QmVhdHMpICUgdGhpcy5udW1CZWF0cztcblxuICAgICAgICB0aGlzLm1lYXN1cmVDb3VudCA9IG1lYXN1cmVDb3VudDsgLy8gY3VycmVudCBtZWFzdXJlXG4gICAgICAgIHRoaXMuYmVhdENvdW50ID0gbmV4dEJlYXRDb3VudDsgLy8gbmV4dCBiZWF0XG5cbiAgICAgICAgaWYobmV4dEJlYXRDb3VudCAhPT0gMCkge1xuICAgICAgICAgIGNvbnN0IGF1ZGlvVGltZSA9IGF1ZGlvU2NoZWR1bGVyLmN1cnJlbnRUaW1lO1xuICAgICAgICAgIGNvbnN0IG5leHRCZWF0RGVsYXkgPSAobmV4dEJlYXRDb3VudCAtIGZsb2F0QmVhdHMpICogdGhpcy5iZWF0UGVyaW9kO1xuICAgICAgICAgIHRoaXMuYmVhdEVuZ2luZS5yZXNldFRpbWUoYXVkaW9UaW1lICsgbmV4dEJlYXREZWxheSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYobWVhc3VyZVBoYXNlID4gMClcbiAgICAgICAgbWVhc3VyZUNvdW50Kys7XG5cbiAgICAgIHRoaXMubWVhc3VyZUNvdW50ID0gbWVhc3VyZUNvdW50O1xuXG4gICAgICByZXR1cm4gc3RhcnRQb3NpdGlvbiArIG1lYXN1cmVDb3VudCAqIHRoaXMubWVhc3VyZUxlbmd0aDtcbiAgICB9XG5cbiAgICB0aGlzLm1lYXN1cmVDb3VudCA9IDA7XG4gICAgcmV0dXJuIHN0YXJ0UG9zaXRpb247XG4gIH1cblxuICAvLyBnZW5lcmF0ZSBuZXh0IG1lYXN1cmVcbiAgYWR2YW5jZVBvc2l0aW9uKHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgbWV0cmljU3BlZWQpIHtcbiAgICBjb25zdCBhdWRpb1RpbWUgPSBhdWRpb1NjaGVkdWxlci5jdXJyZW50VGltZTtcblxuICAgIHRoaXMubWVhc3VyZUNvdW50Kys7XG5cbiAgICAvLyB3aGV0aGVyIG1ldHJvbm9tZSBjb250aW51ZXMgKGRlZmF1bHQgaXMgdHJ1ZSlcbiAgICBjb25zdCBjb250ID0gdGhpcy5jYWxsYmFjayh0aGlzLm1lYXN1cmVDb3VudCwgMCk7XG5cbiAgICB0aGlzLmJlYXRDb3VudCA9IDE7XG5cbiAgICBpZiAoY29udCA9PT0gdW5kZWZpbmVkIHx8IGNvbnQgPT09IHRydWUpIHtcbiAgICAgIGlmICh0aGlzLmJlYXRFbmdpbmUpXG4gICAgICAgIHRoaXMuYmVhdEVuZ2luZS5yZXNldFRpbWUoYXVkaW9UaW1lICsgdGhpcy5iZWF0UGVyaW9kKTtcblxuICAgICAgcmV0dXJuIG1ldHJpY1Bvc2l0aW9uICsgdGhpcy5tZWFzdXJlTGVuZ3RoO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmJlYXRFbmdpbmUpXG4gICAgICB0aGlzLmJlYXRFbmdpbmUucmVzZXRUaW1lKEluZmluaXR5KTtcblxuICAgIHJldHVybiBJbmZpbml0eTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuYmVhdEVuZ2luZSlcbiAgICAgIHRoaXMuYmVhdEVuZ2luZS5kZXN0cm95KCk7XG5cbiAgICBpZiAodGhpcy5tYXN0ZXIpXG4gICAgICB0aGlzLm1hc3Rlci5yZW1vdmUodGhpcyk7XG4gIH1cbn1cblxuY2xhc3MgTWV0cmljU2NoZWR1bGVyIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgdGhpcy5fc3luY1NjaGVkdWxlciA9IHRoaXMucmVxdWlyZSgnc3luYy1zY2hlZHVsZXInKTtcblxuICAgIHRoaXMuX2VuZ2luZVF1ZXVlID0gbmV3IGF1ZGlvLlByaW9yaXR5UXVldWUoKTtcbiAgICB0aGlzLl9lbmdpbmVTZXQgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5fbWV0cm9ub21lRW5naW5lTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5fdGVtcG8gPSA2MDsgLy8gdGVtcG8gaW4gYmVhdHMgcGVyIG1pbnV0ZSAoQlBNKVxuICAgIHRoaXMuX3RlbXBvVW5pdCA9IDAuMjU7IC8vIHRlbXBvIHVuaXQgZXhwcmVzc2VkIGluIGZyYWN0aW9ucyBvZiBhIHdob2xlIG5vdGVcbiAgICB0aGlzLl9tZXRyaWNTcGVlZCA9IDAuMjU7IC8vIHdob2xlIG5vdGVzIHBlciBzZWNvbmRcblxuICAgIHRoaXMuX3N5bmNUaW1lID0gMDtcbiAgICB0aGlzLl9tZXRyaWNQb3NpdGlvbiA9IDA7XG5cbiAgICB0aGlzLl9zeW5jU2NoZWR1bGVySG9vayA9IG51bGw7XG4gICAgdGhpcy5fc3luY0V2ZW50RW5naW5lID0gbnVsbDtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9jYWxsaW5nRXZlbnRMaXN0ZW5lcnMgPSBmYWxzZTtcblxuICAgIC8vIGNvbnN0IGRlZmF1bHRzID0ge307XG4gICAgLy8gdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fb25Jbml0ID0gdGhpcy5fb25Jbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25TeW5jID0gdGhpcy5fb25TeW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25DbGVhciA9IHRoaXMuX29uQ2xlYXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLl9zeW5jU2NoZWR1bGVySG9vayA9IG5ldyBTeW5jU2NoZWR1bGVySG9vayh0aGlzLl9zeW5jU2NoZWR1bGVyLCB0aGlzKTtcbiAgICB0aGlzLl9zeW5jRXZlbnRFbmdpbmUgPSBuZXcgU3luY0V2ZW50RW5naW5lKHRoaXMuX3N5bmNTY2hlZHVsZXIsIHRoaXMpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG4gICAgdGhpcy5yZWNlaXZlKCdpbml0JywgdGhpcy5fb25Jbml0KTtcbiAgICB0aGlzLnJlY2VpdmUoJ2NsZWFyJywgdGhpcy5fb25DbGVhcik7XG4gICAgdGhpcy5yZWNlaXZlKCdzeW5jJywgdGhpcy5fb25TeW5jKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgX2NhbGxFdmVudExpc3RlbmVycyhldmVudCkge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQoZXZlbnQpO1xuXG4gICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgdGhpcy5fY2FsbGluZ0V2ZW50TGlzdGVuZXJzID0gdHJ1ZTtcblxuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgc3luY1RpbWU6IHRoaXMuX3N5bmNUaW1lLFxuICAgICAgICBtZXRyaWNQb3NpdGlvbjogdGhpcy5fbWV0cmljUG9zaXRpb24sXG4gICAgICAgIHRlbXBvOiB0aGlzLl90ZW1wbyxcbiAgICAgICAgdGVtcG9Vbml0OiB0aGlzLl90ZW1wb1VuaXQsXG4gICAgICB9O1xuXG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiBsaXN0ZW5lcnMpXG4gICAgICAgIGNhbGxiYWNrKGV2ZW50LCBkYXRhKTtcblxuICAgICAgdGhpcy5fY2FsbGluZ0V2ZW50TGlzdGVuZXJzID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgX3Jlc2NoZWR1bGVNZXRyaWNFbmdpbmVzKCkge1xuICAgIGNvbnN0IHN5bmNUaW1lID0gdGhpcy5zeW5jVGltZTtcbiAgICBjb25zdCBtZXRyaWNQb3NpdGlvbiA9IHRoaXMuZ2V0TWV0cmljUG9zaXRpb25BdFN5bmNUaW1lKHN5bmNUaW1lKTtcblxuICAgIHRoaXMuX2VuZ2luZVF1ZXVlLmNsZWFyKCk7XG5cbiAgICBpZiAodGhpcy5fbWV0cmljU3BlZWQgPiAwKSB7XG4gICAgICAvLyBwb3NpdGlvbiBlbmdpbmVzXG4gICAgICBjb25zdCBtZXRyaWNTcGVlZCA9IHRoaXMuX21ldHJpY1NwZWVkO1xuICAgICAgY29uc3QgcXVldWUgPSB0aGlzLl9lbmdpbmVRdWV1ZTtcblxuICAgICAgZm9yIChsZXQgZW5naW5lIG9mIHRoaXMuX2VuZ2luZVNldCkge1xuICAgICAgICBjb25zdCBuZXh0RW5naW5lUG9zaXRpb24gPSBlbmdpbmUuc3luY1Bvc2l0aW9uKHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgbWV0cmljU3BlZWQpO1xuICAgICAgICBxdWV1ZS5pbnNlcnQoZW5naW5lLCBuZXh0RW5naW5lUG9zaXRpb24pO1xuICAgICAgfVxuICAgIH3CoFxuICAgIGVsc2Uge1xuICAgICAgLy8gc3RvcCBlbmdpbmVzXG4gICAgICBmb3IgKGxldCBlbmdpbmUgb2YgdGhpcy5fZW5naW5lU2V0KSB7XG4gICAgICAgIGlmIChlbmdpbmUuc3luY1NwZWVkKVxuICAgICAgICAgIGVuZ2luZS5zeW5jU3BlZWQoc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCAwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9zeW5jU2NoZWR1bGVySG9vay5yZXNjaGVkdWxlKCk7XG4gIH1cblxuICBfY2xlYXJFbmdpbmVzKCkge1xuICAgIHRoaXMuX2VuZ2luZVF1ZXVlLmNsZWFyKCk7XG4gICAgdGhpcy5fZW5naW5lU2V0LmNsZWFyKCk7XG5cbiAgICBmb3IgKGxldCBba2V5LCBlbmdpbmVdIG9mIHRoaXMuX21ldHJvbm9tZUVuZ2luZU1hcClcbiAgICAgIGVuZ2luZS5kZXN0cm95KCk7XG5cbiAgICB0aGlzLl9tZXRyb25vbWVFbmdpbmVNYXAuY2xlYXIoKTtcblxuICAgIHRoaXMuX3N5bmNTY2hlZHVsZXJIb29rLnJlc2NoZWR1bGUoKTtcbiAgfVxuXG4gIF9hZHZhbmNlUG9zaXRpb24oc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCBtZXRyaWNTcGVlZCkge1xuICAgIGNvbnN0IGVuZ2luZSA9IHRoaXMuX2VuZ2luZVF1ZXVlLmhlYWQ7XG4gICAgY29uc3QgbmV4dEVuZ2luZVBvc2l0aW9uID0gZW5naW5lLmFkdmFuY2VQb3NpdGlvbihzeW5jVGltZSwgbWV0cmljUG9zaXRpb24sIG1ldHJpY1NwZWVkKTtcblxuICAgIGlmIChuZXh0RW5naW5lUG9zaXRpb24gPT09IHVuZGVmaW5lZClcbiAgICAgIHRoaXMuX2VuZ2luZVNldC5kZWxldGUoZW5naW5lKTtcblxuICAgIHJldHVybiB0aGlzLl9lbmdpbmVRdWV1ZS5tb3ZlKGVuZ2luZSwgbmV4dEVuZ2luZVBvc2l0aW9uKTtcbiAgfVxuXG4gIF9zeW5jKHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgdGVtcG8sIHRlbXBvVW5pdCwgZXZlbnQpIHtcbiAgICB0aGlzLl9zeW5jVGltZSA9IHN5bmNUaW1lO1xuICAgIHRoaXMuX21ldHJpY1Bvc2l0aW9uID0gbWV0cmljUG9zaXRpb247XG5cbiAgICB0aGlzLl90ZW1wbyA9IHRlbXBvO1xuICAgIHRoaXMuX3RlbXBvVW5pdCA9IHRlbXBvVW5pdDtcbiAgICB0aGlzLl9tZXRyaWNTcGVlZCA9IHRlbXBvICogdGVtcG9Vbml0IC8gNjA7XG5cbiAgICBpZiAoZXZlbnQpXG4gICAgICB0aGlzLl9jYWxsRXZlbnRMaXN0ZW5lcnMoZXZlbnQpO1xuXG4gICAgdGhpcy5fcmVzY2hlZHVsZU1ldHJpY0VuZ2luZXMoKTtcbiAgfVxuXG4gIF9jbGVhclN5bmNFdmVudCgpIHtcbiAgICB0aGlzLl9zeW5jRXZlbnRFbmdpbmUucmVzZXQoKTtcbiAgfVxuXG4gIF9zZXRTeW5jRXZlbnQoc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCB0ZW1wbywgdGVtcG9Vbml0LCBldmVudCkge1xuICAgIHRoaXMuX2NsZWFyU3luY0V2ZW50KCk7XG5cbiAgICBpZiAoc3luY1RpbWUgPiB0aGlzLnN5bmNUaW1lKVxuICAgICAgdGhpcy5fc3luY0V2ZW50RW5naW5lLnNldChzeW5jVGltZSwgbWV0cmljUG9zaXRpb24sIHRlbXBvLCB0ZW1wb1VuaXQsIGV2ZW50KTtcbiAgICBlbHNlXG4gICAgICB0aGlzLl9zeW5jKHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgdGVtcG8sIHRlbXBvVW5pdCwgZXZlbnQpO1xuICB9XG5cbiAgX29uSW5pdChzeW5jVGltZSwgbWV0cmljUG9zaXRpb24sIHRlbXBvLCB0ZW1wb1VuaXQpIHtcbiAgICB0aGlzLl9zeW5jKHN5bmNUaW1lLCBtZXRyaWNQb3NpdGlvbiwgdGVtcG8sIHRlbXBvVW5pdCk7XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgX29uQ2xlYXIoKSB7XG4gICAgdGhpcy5fY2xlYXJTeW5jRXZlbnQoKTtcbiAgICB0aGlzLl9jbGVhckVuZ2luZXMoKTtcbiAgfVxuXG4gIF9vblN5bmMoc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCB0ZW1wbywgdGVtcG9Vbml0LCBldmVudCkge1xuICAgIHRoaXMuX3NldFN5bmNFdmVudChzeW5jVGltZSwgbWV0cmljUG9zaXRpb24sIHRlbXBvLCB0ZW1wb1VuaXQsIGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdXJyZW50IGF1ZGlvIHRpbWUuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgYXVkaW9UaW1lKCkge1xuICAgIHJldHVybiBhdWRpb1NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgfVxuXG4gIGdldCBzeW5jVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luY1NjaGVkdWxlci5zeW5jVGltZTtcbiAgfVxuXG4gIGdldCBjdXJyZW50VGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luY1NjaGVkdWxlci5zeW5jVGltZTtcbiAgfVxuXG4gIGdldCBtZXRyaWNQb3NpdGlvbigpIHtcbiAgICBpZiAodGhpcy5fdGVtcG8gPiAwKVxuICAgICAgcmV0dXJuIHRoaXMuX21ldHJpY1Bvc2l0aW9uICsgKHRoaXMuX3N5bmNTY2hlZHVsZXIuc3luY1RpbWUgLSB0aGlzLl9zeW5jVGltZSkgKiB0aGlzLl9tZXRyaWNTcGVlZDtcblxuICAgIHJldHVybiB0aGlzLl9tZXRyaWNQb3NpdGlvbjtcbiAgfVxuXG4gIGdldCBjdXJyZW50UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljUG9zaXRpb247XG4gIH1cblxuICAvKipcbiAgICogRGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBhdWRpbyBzY2hlZHVsZXIncyBsb2dpY2FsIGF1ZGlvIHRpbWUgYW5kIHRoZSBgY3VycmVudFRpbWVgXG4gICAqIG9mIHRoZSBhdWRpbyBjb250ZXh0LlxuICAgKi9cbiAgZ2V0IGRlbHRhVGltZSgpIHtcbiAgICByZXR1cm4gYXVkaW9TY2hlZHVsZXIuY3VycmVudFRpbWUgLSBhdWRpby5hdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCB0ZW1wby5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIFRlbXBvIGluIEJQTS5cbiAgICovXG4gIGdldCB0ZW1wbygpIHtcbiAgICByZXR1cm4gdGhpcy5fdGVtcG87XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCB0ZW1wbyB1bml0LlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gVGVtcG8gdW5pdCBpbiByZXNwZWN0IHRvIHdob2xlIG5vdGUuXG4gICAqL1xuICBnZXQgdGVtcG9Vbml0KCkge1xuICAgIHJldHVybiB0aGlzLl90ZW1wb1VuaXQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0IG1ldHJpYyBwb3NpdGlvbiBjb3Jyc3BvbmRpbmcgdG8gYSBnaXZlbiBhdWRpbyB0aW1lIChyZWdhcmRpbmcgdGhlIGN1cnJlbnQgdGVtcG8pLlxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHRpbWUgLSB0aW1lXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBtZXRyaWMgcG9zaXRpb25cbiAgICovXG4gIGdldE1ldHJpY1Bvc2l0aW9uQXRBdWRpb1RpbWUoYXVkaW9UaW1lKSB7XG4gICAgaWYgKHRoaXMuX3RlbXBvID4gMCkge1xuICAgICAgY29uc3Qgc3luY1RpbWUgPSB0aGlzLl9zeW5jU2NoZWR1bGVyLmdldFN5bmNUaW1lQXRBdWRpb1RpbWUoYXVkaW9UaW1lKTtcbiAgICAgIHJldHVybiB0aGlzLl9tZXRyaWNQb3NpdGlvbiArIChzeW5jVGltZSAtIHRoaXMuX3N5bmNUaW1lKSAqIHRoaXMuX21ldHJpY1NwZWVkO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9tZXRyaWNQb3NpdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbWV0cmljIHBvc2l0aW9uIGNvcnJzcG9uZGluZyB0byBhIGdpdmVuIHN5bmMgdGltZSAocmVnYXJkaW5nIHRoZSBjdXJyZW50IHRlbXBvKS5cbiAgICogQHBhcmFtICB7TnVtYmVyfSB0aW1lIC0gdGltZVxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gbWV0cmljIHBvc2l0aW9uXG4gICAqL1xuICBnZXRNZXRyaWNQb3NpdGlvbkF0U3luY1RpbWUoc3luY1RpbWUpIHtcbiAgICBpZiAodGhpcy5fdGVtcG8gPiAwKVxuICAgICAgcmV0dXJuIHRoaXMuX21ldHJpY1Bvc2l0aW9uICsgKHN5bmNUaW1lIC0gdGhpcy5fc3luY1RpbWUpICogdGhpcy5fbWV0cmljU3BlZWQ7XG5cbiAgICByZXR1cm4gdGhpcy5fbWV0cmljUG9zaXRpb247XG4gIH1cblxuICAvKipcbiAgICogR2V0IHN5bmMgdGltZSBjb3JyZXNwb25kaW5nIHRvIGEgZ2l2ZW4gbWV0cmljIHBvc2l0aW9uIChyZWdhcmRpbmcgdGhlIGN1cnJlbnQgdGVtcG8pLlxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHBvc2l0aW9uIC0gbWV0cmljIHBvc2l0aW9uXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBzeW5jIHRpbWVcbiAgICovXG4gIGdldFN5bmNUaW1lQXRNZXRyaWNQb3NpdGlvbihtZXRyaWNQb3NpdGlvbikge1xuICAgIGNvbnN0IG1ldHJpY1NwZWVkID0gdGhpcy5fbWV0cmljU3BlZWQ7XG5cbiAgICBpZiAobWV0cmljUG9zaXRpb24gPCBJbmZpbml0eSAmJiBtZXRyaWNTcGVlZCA+IDApXG4gICAgICByZXR1cm4gdGhpcy5fc3luY1RpbWUgKyAobWV0cmljUG9zaXRpb24gLSB0aGlzLl9tZXRyaWNQb3NpdGlvbikgLyBtZXRyaWNTcGVlZDtcblxuICAgIHJldHVybiBJbmZpbml0eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYXVkaW8gdGltZSBjb3JyZXNwb25kaW5nIHRvIGEgZ2l2ZW4gbWV0cmljIHBvc2l0aW9uIChyZWdhcmRpbmcgdGhlIGN1cnJlbnQgdGVtcG8pLlxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHBvc2l0aW9uIC0gbWV0cmljIHBvc2l0aW9uXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBhdWRpbyB0aW1lXG4gICAqL1xuICBnZXRBdWRpb1RpbWVBdE1ldHJpY1Bvc2l0aW9uKG1ldHJpY1Bvc2l0aW9uKSB7XG4gICAgY29uc3QgbWV0cmljU3BlZWQgPSB0aGlzLl9tZXRyaWNTcGVlZDtcblxuICAgIGlmIChtZXRyaWNQb3NpdGlvbiA8IEluZmluaXR5ICYmIG1ldHJpY1NwZWVkID4gMCkge1xuICAgICAgY29uc3Qgc3luY1RpbWUgPSB0aGlzLl9zeW5jVGltZSArIChtZXRyaWNQb3NpdGlvbiAtIHRoaXMuX21ldHJpY1Bvc2l0aW9uKSAvIG1ldHJpY1NwZWVkO1xuICAgICAgcmV0dXJuIHRoaXMuX3N5bmNTY2hlZHVsZXIuZ2V0QXVkaW9UaW1lQXRTeW5jVGltZShzeW5jVGltZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEluZmluaXR5O1xuICB9XG5cbiAgYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2spIHtcbiAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldChldmVudCk7XG5cbiAgICBpZiAoIWxpc3RlbmVycykge1xuICAgICAgbGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLnNldChldmVudCwgbGlzdGVuZXJzKTtcbiAgICB9XG5cbiAgICBsaXN0ZW5lcnMuYWRkKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldChldmVudCk7XG5cbiAgICBpZiAobGlzdGVuZXJzKVxuICAgICAgbGlzdGVuZXJzLnJlbW92ZShjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbCBhIGZ1bmN0aW9uIGF0IGEgZ2l2ZW4gbWV0cmljIHBvc2l0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW4gLSBGdW5jdGlvbiB0byBiZSBkZWZlcnJlZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1ldHJpY1Bvc2l0aW9uIC0gVGhlIG1ldHJpYyBwb3NpdGlvbiBhdCB3aGljaCB0aGUgZnVuY3Rpb24gc2hvdWxkIGJlIGV4ZWN1dGVkLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtsb29rYWhlYWQ9ZmFsc2VdIC0gRGVmaW5lcyB3aGV0aGVyIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWRcbiAgICogIGFudGljaXBhdGVkIChlLmcuIGZvciBhdWRpbyBldmVudHMpIG9yIHByZWNpc2VseSBhdCB0aGUgZ2l2ZW4gdGltZSAoZGVmYXVsdCkuXG4gICAqL1xuICBhZGRFdmVudChmdW4sIG1ldHJpY1Bvc2l0aW9uLCBsb29rYWhlYWQgPSBmYWxzZSkge1xuICAgIGNvbnN0IHNjaGVkdWxlclNlcnZpY2UgPSB0aGlzO1xuICAgIGNvbnN0IGVuZ2luZSA9IHtcbiAgICAgIHRpbWVvdXQ6IG51bGwsXG4gICAgICBzeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgICAgIGlmIChzcGVlZCA9PT0gMClcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgIH0sXG4gICAgICBzeW5jUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuXG4gICAgICAgIGlmIChtZXRyaWNQb3NpdGlvbiA+PSBwb3NpdGlvbilcbiAgICAgICAgICByZXR1cm4gbWV0cmljUG9zaXRpb247XG5cbiAgICAgICAgcmV0dXJuIEluZmluaXR5O1xuICAgICAgfSxcbiAgICAgIGFkdmFuY2VQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSBzY2hlZHVsZXJTZXJ2aWNlLmRlbHRhVGltZTtcblxuICAgICAgICBpZiAoZGVsdGEgPiAwKVxuICAgICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoZnVuLCAxMDAwICogZGVsdGEsIHBvc2l0aW9uKTsgLy8gYnJpZGdlIHNjaGVkdWxlciBsb29rYWhlYWQgd2l0aCB0aW1lb3V0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBmdW4ocG9zaXRpb24pO1xuXG4gICAgICAgIHJldHVybiBJbmZpbml0eTtcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIHRoaXMuYWRkKGVuZ2luZSwgbWV0cmljUG9zaXRpb24pOyAvLyBhZGQgd2l0aG91dCBjaGVja3NcbiAgfVxuXG4gIGFkZChlbmdpbmUsIHN0YXJ0UG9zaXRpb24gPSB0aGlzLm1ldHJpY1Bvc2l0aW9uKSB7XG4gICAgdGhpcy5fZW5naW5lU2V0LmFkZChlbmdpbmUpO1xuXG4gICAgY29uc3QgbWV0cmljUG9zaXRpb24gPSBNYXRoLm1heChzdGFydFBvc2l0aW9uLCB0aGlzLm1ldHJpY1Bvc2l0aW9uKTtcblxuICAgIC8vIHNjaGVkdWxlIGVuZ2luZVxuICAgIGlmICghdGhpcy5fY2FsbGluZ0V2ZW50TGlzdGVuZXJzICYmIHRoaXMuX21ldHJpY1NwZWVkID4gMCkge1xuICAgICAgY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmNUaW1lO1xuICAgICAgY29uc3QgbmV4dEVuZ2luZVBvc2l0aW9uID0gZW5naW5lLnN5bmNQb3NpdGlvbihzeW5jVGltZSwgbWV0cmljUG9zaXRpb24sIHRoaXMuX21ldHJpY1NwZWVkKTtcblxuICAgICAgdGhpcy5fZW5naW5lUXVldWUuaW5zZXJ0KGVuZ2luZSwgbmV4dEVuZ2luZVBvc2l0aW9uKTtcbiAgICAgIHRoaXMuX3N5bmNTY2hlZHVsZXJIb29rLnJlc2NoZWR1bGUoKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmUoZW5naW5lKSB7XG4gICAgY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmNUaW1lO1xuICAgIGNvbnN0IG1ldHJpY1Bvc2l0aW9uID0gdGhpcy5nZXRNZXRyaWNQb3NpdGlvbkF0U3luY1RpbWUoc3luY1RpbWUpO1xuXG4gICAgLy8gc3RvcCBlbmdpbmVcbiAgICBpZiAoZW5naW5lLnN5bmNTcGVlZClcbiAgICAgIGVuZ2luZS5zeW5jU3BlZWQoc3luY1RpbWUsIG1ldHJpY1Bvc2l0aW9uLCAwKTtcblxuICAgIGlmICh0aGlzLl9lbmdpbmVTZXQuZGVsZXRlKGVuZ2luZSkgJiYgIXRoaXMuX2NhbGxpbmdFdmVudExpc3RlbmVycyAmJiB0aGlzLl9tZXRyaWNTcGVlZCA+IDApIHtcbiAgICAgIHRoaXMuX2VuZ2luZVF1ZXVlLnJlbW92ZShlbmdpbmUpO1xuICAgICAgdGhpcy5fc3luY1NjaGVkdWxlckhvb2sucmVzY2hlZHVsZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBwZXJpb2RpYyBjYWxsYmFjayBzdGFydGluZyBhdCBhIGdpdmVuIG1ldHJpYyBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBjYWxsYmFjayBmdW5jdGlvbiAoY3ljbGUsIGJlYXQpXG4gICAqIEBwYXJhbSB7SW50ZWdlcn0gbnVtQmVhdHMgLSBudW1iZXIgb2YgYmVhdHMgKHRpbWUgc2lnbmF0dXJlIG51bWVyYXRvcilcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1ldHJpY0RpdiAtIG1ldHJpYyBkaXZpc2lvbiBvZiB3aG9sZSBub3RlICh0aW1lIHNpZ25hdHVyZSBkZW5vbWluYXRvcilcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRlbXBvU2NhbGUgLSBsaW5lYXIgdGVtcG8gc2NhbGUgZmFjdG9yIChpbiByZXNwZWN0IHRvIG1hc3RlciB0ZW1wbylcbiAgICogQHBhcmFtIHtJbnRlZ2VyfSBzdGFydFBvc2l0aW9uIC0gbWV0cmljIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSBiZWF0XG4gICAqL1xuICBhZGRNZXRyb25vbWUoY2FsbGJhY2ssIG51bUJlYXRzID0gNCwgbWV0cmljRGl2ID0gNCwgdGVtcG9TY2FsZSA9IDEsIHN0YXJ0UG9zaXRpb24gPSAwLCBzdGFydE9uQmVhdCA9IGZhbHNlKSB7XG4gICAgY29uc3QgYmVhdExlbmd0aCA9IDEgLyAobWV0cmljRGl2ICogdGVtcG9TY2FsZSk7XG4gICAgY29uc3QgZW5naW5lID0gbmV3IE1ldHJvbm9tZUVuZ2luZShzdGFydFBvc2l0aW9uLCBudW1CZWF0cywgYmVhdExlbmd0aCwgc3RhcnRPbkJlYXQsIGNhbGxiYWNrKTtcblxuICAgIHRoaXMuX21ldHJvbm9tZUVuZ2luZU1hcC5zZXQoY2FsbGJhY2ssIGVuZ2luZSk7XG4gICAgdGhpcy5hZGQoZW5naW5lLCBzdGFydFBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgcGVyaW9kaWMgY2FsbGJhY2suXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqL1xuICByZW1vdmVNZXRyb25vbWUoY2FsbGJhY2sgLyosIGVuZFBvc2l0aW9uICovICkge1xuICAgIGNvbnN0IGVuZ2luZSA9IHRoaXMuX21ldHJvbm9tZUVuZ2luZU1hcC5nZXQoY2FsbGJhY2spO1xuXG4gICAgaWYgKGVuZ2luZSkge1xuICAgICAgdGhpcy5fbWV0cm9ub21lRW5naW5lTWFwLmRlbGV0ZShjYWxsYmFjayk7XG4gICAgICB0aGlzLnJlbW92ZShlbmdpbmUpO1xuICAgIH1cbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBNZXRyaWNTY2hlZHVsZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBNZXRyaWNTY2hlZHVsZXI7XG4iXX0=