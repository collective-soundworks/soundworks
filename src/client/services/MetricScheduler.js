import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import * as audio from 'waves-audio';
const audioScheduler = audio.getScheduler();

const SERVICE_ID = 'service:metric-scheduler';

class SyncSchedulerHook extends audio.TimeEngine {
  constructor(syncScheduler, metricScheduler) {
    super();

    this.nextPosition = Infinity;
    this.nextTime = Infinity;

    this.syncScheduler = syncScheduler;
    this.metricScheduler = metricScheduler;

    syncScheduler.add(this, Infinity); // add hook to sync (master) scheduler
  }

  advanceTime(syncTime) {
    const metricScheduler = this.metricScheduler;
    const nextPosition = metricScheduler._advancePosition(syncTime, this.nextPosition, metricScheduler._metricSpeed);
    const nextTime = metricScheduler.getSyncTimeAtMetricPosition(nextPosition);

    this.nextPosition = nextPosition;
    this.nextTime = nextTime;

    return nextTime;
  }

  reschedule() {
    const metricScheduler = this.metricScheduler;
    const nextPosition = metricScheduler._engineQueue.time;
    const syncTime = metricScheduler.getSyncTimeAtMetricPosition(nextPosition);

    if (syncTime !== this.nextTime) {
      this.nextPosition = nextPosition;
      this.nextTime = syncTime;

      this.resetTime(syncTime);
    }
  }
}

class SyncEventEngine extends audio.TimeEngine {
  constructor(syncScheduler, metricScheduler) {
    super();

    this.syncScheduler = syncScheduler;
    this.metricScheduler = metricScheduler;

    this.syncTime = undefined;
    this.metricPosition = undefined;
    this.tempo = undefined;
    this.tempoUnit = undefined;
    this.event = undefined;

    syncScheduler.add(this, Infinity);
  }

  advanceTime(syncTime) {
    this.metricScheduler._sync(this.syncTime, this.metricPosition, this.tempo, this.tempoUnit, this.event);
    return Infinity;
  }

  set(syncTime, metricPosition, tempo, tempoUnit, event) {
    this.syncTime = syncTime;
    this.metricPosition = metricPosition;
    this.tempo = tempo;
    this.tempoUnit = tempoUnit;
    this.event = event;

    this.resetTime(syncTime);
  }


  reset(syncTime, metricPosition, tempo, tempoUnit, event) {
    this.syncTime = undefined;
    this.metricPosition = undefined;
    this.tempo = undefined;
    this.tempoUnit = undefined;
    this.event = undefined;

    this.resetTime(Infinity);
  }
}

class BeatEngine extends audio.TimeEngine {
  constructor(metro) {
    super();

    this.metro = metro;
    audioScheduler.add(this, Infinity);
  }

  // generate next beat
  advanceTime(audioTime) {
    const metro = this.metro;

    metro.beatCount++;

    const cont = metro.callback(metro.measureCount, metro.beatCount);

    if (cont === undefined || cont === true) {
      if (metro.beatCount >= metro.numBeats - 1)
        return Infinity;

      return audioTime + metro.beatPeriod;
    }

    metro.resetPosition(Infinity);
    return Infinity;
  }

  destroy() {
    this.metro = null;

    if (this.master)
      this.master.remove(this);
  }
}

class MetronomeEngine extends audio.TimeEngine {
  constructor(startPosition, numBeats, beatLength, callback) {
    super();

    this.startPosition = startPosition;
    this.numBeats = numBeats;
    this.beatLength = beatLength;
    this.callback = callback;

    this.measureLength = numBeats * beatLength;
    this.beatPeriod = 0;
    this.measureCount = 0;
    this.beatCount = 0;

    if (numBeats > 1)
      this.beatEngine = new BeatEngine(this);
  }

  // return position of next measure
  syncSpeed(syncTime, metricPosition, metricSpeed) {
    if (metricSpeed <= 0 && this.beatEngine)
      this.beatEngine.resetTime(Infinity);
  }

  // return position of next measure
  syncPosition(syncTime, metricPosition, metricSpeed) {
    let nextMeasurePosition = this.startPosition;

    if (this.beatEngine)
      this.beatEngine.resetTime(Infinity);

    if (metricPosition >= this.startPosition) {
      const relativePosition = metricPosition - this.startPosition;
      const floatMeasures = relativePosition / this.measureLength;
      const measureCount = Math.ceil(floatMeasures);

      this.beatPeriod = this.beatLength / metricSpeed;
      this.measureCount = measureCount - 1;
      this.beatCount = 0;

      nextMeasurePosition = measureCount * this.measureLength;
    }

    return nextMeasurePosition;
  }

  // generate next measure
  advancePosition(syncTime, metricPosition, metricSpeed) {
    const audioTime = audioScheduler.currentTime;

    this.measureCount++;
    this.beatCount = 0;

    const cont = this.callback(this.measureCount, 0);

    if (cont === undefined || cont === true) {
      if (this.beatEngine)
        this.beatEngine.resetTime(audioTime + this.beatPeriod);

      return metricPosition + this.measureLength;
    }

    if (this.beatEngine)
      this.beatEngine.resetTime(Infinity);

    return Infinity;
  }

  destroy() {
    if (this.beatEngine)
      this.beatEngine.destroy();

    if (this.master)
      this.master.remove(this);
  }
}

class MetricScheduler extends Service {
  constructor() {
    super(SERVICE_ID, true);

    this._syncScheduler = this.require('sync-scheduler');

    this._engineQueue = new audio.PriorityQueue();
    this._engineSet = new Set();
    this._metronomeEngineMap = new Map();

    this._tempo = 60; // tempo in beats per minute (BPM)
    this._tempoUnit = 0.25; // tempo unit expressed in fractions of a whole note
    this._metricSpeed = 0.25; // whole notes per second

    this._syncTime = 0;
    this._metricPosition = 0;

    this._syncSchedulerHook = null;
    this._syncEventEngine = null;

    this._listeners = new Map();
    this._callingEventListeners = false;

    // const defaults = {};
    // this.configure(defaults);

    this._onInit = this._onInit.bind(this);
    this._onSync = this._onSync.bind(this);
    this._onClear = this._onClear.bind(this);
  }

  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this._syncSchedulerHook = new SyncSchedulerHook(this._syncScheduler, this);
    this._syncEventEngine = new SyncEventEngine(this._syncScheduler, this);;

    this.send('request');
    this.receive('init', this._onInit);
    this.receive('clear', this._onClear);
    this.receive('sync', this._onSync);
  }

  stop() {
    super.stop();
  }

  _callEventListeners(event) {
    const listeners = this._listeners.get(event);

    if (listeners) {
      this._callingEventListeners = true;

      const data = {
        syncTime: this._syncTime,
        metricPosition: this._metricPosition,
        tempo: this._tempo,
        tempoUnit: this._tempoUnit,
      };

      for (let callback of listeners)
        callback(data);

      this._callingEventListeners = false;
    }
  }

  _rescheduleMetricEngines() {
    const syncTime = this.currentSyncTime;
    const metricPosition = this.getMetricPositionAtSyncTime(syncTime);

    this._engineQueue.clear();

    if (this._metricSpeed > 0) {
      // position engines
      const metricSpeed = this._metricSpeed;
      const queue = this._engineQueue;

      for (let engine of this._engineSet) {
        const nextEnginePosition = engine.syncPosition(syncTime, metricPosition, metricSpeed);
        queue.insert(engine, nextEnginePosition);
      }
    } 
    else {
      // stop engines
      for (let engine of this._engineSet) {
        if(engine.syncSpeed)
          engine.syncSpeed(syncTime, metricPosition, 0);
      }
    }

    this._syncSchedulerHook.reschedule();
  }

  _clearEngines() {
    this._engineQueue.clear();
    this._engineSet.clear();

    for (let [key, engine] of this._metronomeEngineMap)
      engine.destroy();

    this._syncSchedulerHook.reschedule();
  }

  _advancePosition(syncTime, metricPosition, metricSpeed) {
    const engine = this._engineQueue.head;
    const nextEnginePosition = engine.advancePosition(syncTime, metricPosition, metricSpeed);

    if (nextEnginePosition === undefined)
      this._engineSet.delete(engine);

    return this._engineQueue.move(engine, nextEnginePosition);
  }

  _sync(syncTime, metricPosition, tempo, tempoUnit, event) {
    this._syncTime = syncTime;
    this._metricPosition = metricPosition;

    this._tempo = tempo;
    this._tempoUnit = tempoUnit;
    this._metricSpeed = tempo * tempoUnit / 60;

    if (event)
      this._callEventListeners(event);

    this._rescheduleMetricEngines();
  }

  _clearSyncEvent() {
    this._syncEventEngine.reset();
  }

  _setSyncEvent(syncTime, metricPosition, tempo, tempoUnit, event) {
    this._clearSyncEvent();

    if (syncTime > this.currentSyncTime)
      this._syncEventEngine.set(syncTime, metricPosition, tempo, tempoUnit, event);
    else
      this._sync(syncTime, metricPosition, tempo, tempoUnit, event);
  }

  _onInit(syncTime, metricPosition, tempo, tempoUnit) {
    this._sync(syncTime, metricPosition, tempo, tempoUnit);
    this.ready();
  }

  _onClear() {
    this._clearSyncEvent();
    this._clearEngines();
  }

  _onSync(syncTime, metricPosition, tempo, tempoUnit, event) {
    this._setSyncEvent(syncTime, metricPosition, tempo, tempoUnit, event);
  }

  get currentAudioTime() {
    return audioScheduler.currentTime;
  }

  get currentSyncTime() {
    return this._syncScheduler.currentTime;
  }

  get currentMetricPosition() {
    return this._metricPosition + (this._syncScheduler.currentTime - this._syncTime) * this._metricSpeed;
  }

  /**
   * Difference between the audio scheduler's logical audio time and the `currentTime`
   * of the audio context.
   */
  get deltaTime() {
    return audioScheduler.currentTime - audio.audioContext.currentTime;
  }

  /**
   * Get metric position corrsponding to a given sync time (regarding the current tempo).
   * @param  {Number} time - time
   * @return {Number} - metric position
   */
  getMetricPositionAtSyncTime(syncTime) {
    return this._metricPosition + (syncTime - this._syncTime) * this._metricSpeed;
  }

  /**
   * Get sync time corrsponding to a given metric position (regarding the current tempo).
   * @param  {Number} position - metric position
   * @return {Number} - time
   */
  getSyncTimeAtMetricPosition(metricPosition) {
    const metricSpeed = this._metricSpeed;

    if (metricPosition < Infinity && metricSpeed > 0)
      return this._syncTime + (metricPosition - this._metricPosition) / metricSpeed;

    return Infinity;
  }

  addEventListener(event, callback) {
    let listeners = this._listeners.get(event);

    if (!listeners) {
      listeners = new Set();
      this._listeners.set(event, listeners);
    }

    listeners.add(callback);
  }

  removeEventListener(callback) {
    let listeners = this._listeners.get(event);

    if (listeners)
      listeners.remove(callback);
  }

  /**
   * Call a function at a given metric position.
   *
   * @param {Function} fun - Function to be deferred.
   * @param {Number} metricPosition - The metric position at which the function should be executed.
   * @param {Boolean} [lookahead=false] - Defines whether the function is called
   *  anticipated (e.g. for audio events) or precisely at the given time (default).
   */
  defer(fun, metricPosition, lookahead = false) {
    const scheduler = this._engineQueue;
    const schedulerService = this;
    let engine;

    if (lookahead) {
      scheduler.defer(fun, metricPosition);
    } else {
      engine = {
        advanceTime: function(metricPosition) {
          const delta = schedulerService.deltaTime;

          if (delta > 0)
            setTimeout(fun, 1000 * delta, metricPosition); // bridge scheduler lookahead with timeout
          else
            fun(metricPosition);
        },
      };

      scheduler.add(engine, metricPosition); // add without checks
    }
  }

  add(engine, startPosition = this.currentMetricPosition) {
    this._engineSet.add(engine);

    const metricPosition = Math.max(startPosition, this.currentMetricPosition);

    // schedule engine
    if (!this._callingEventListeners && this._metricSpeed > 0) {
      const syncTime = this.currentSyncTime;
      const nextEnginePosition = engine.syncPosition(syncTime, metricPosition, this._metricSpeed);

      this._engineQueue.insert(engine, nextEnginePosition);
      this._syncSchedulerHook.reschedule();
    }
  }

  remove(engine) {
    if (this._engineSet.delete(engine) && !this._callingEventListeners && this._metricSpeed > 0) {
      this._engineQueue.remove(engine);
      this._syncSchedulerHook.reschedule();
    }
  }

  /**
   * Add a periodic callback starting at a given metric position.
   * @param {Function} callback - callback function (cycle, beat)
   * @param {Integer} numBeats - number of beats (time signature numerator)
   * @param {Number} measureDiv - divisions per measure (time signature denominator)
   * @param {Number} tempoScale - linear tempo scale factor (in respect to master tempo)
   * @param {Integer} startPosition - metric start position of the beat
   */
  addMetronome(callback, numBeats = 4, measureDiv = 4, tempoScale = 1, startPosition = 0) {
    const beatLength = tempoScale / measureDiv;
    const engine = new MetronomeEngine(startPosition, numBeats, beatLength, callback);

    this._metronomeEngineMap.set(callback, engine);
    this.add(engine, startPosition);
  }

  /**
   * Remove periodic callback.
   * @param {Function} callback callback function
   */
  removeMetronome(callback) {
    const engine = this._metronomeEngineMap.get(callback);

    if (engine) {
      this._metronomeEngineMap.delete(callback);
      this.remove(engine);
    }
  }
}

serviceManager.register(SERVICE_ID, MetricScheduler);

export default MetricScheduler;
