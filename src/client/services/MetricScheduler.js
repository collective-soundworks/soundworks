import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import * as audio from 'waves-audio';
const audioScheduler = audio.getScheduler();

const SERVICE_ID = 'service:metric-scheduler';

const EPSILON = 1e-12;

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

    const cont = metro.callback(metro.measureCount, metro.beatCount);
    metro.beatCount++;

    if (cont === undefined || cont === true) {
      if (metro.beatCount >= metro.numBeats)
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
  constructor(startPosition, numBeats, beatLength, startOnBeat, callback) {
    super();

    this.startPosition = startPosition;
    this.numBeats = numBeats;
    this.beatLength = beatLength;
    this.startOnBeat = startOnBeat;
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
    const startPosition = this.startPosition;

    if (this.beatEngine)
      this.beatEngine.resetTime(Infinity);

    // since we are anyway a little in advance, make sure that we don't skip
    // the start point due to rounding errors
    metricPosition -= EPSILON;

    this.beatPeriod = this.beatLength / metricSpeed;
    this.beatCount = 0;

    if (metricPosition >= startPosition) {
      const relativePosition = metricPosition - startPosition;
      const floatMeasures = relativePosition / this.measureLength;
      let measureCount = Math.floor(floatMeasures);
      const measurePhase = floatMeasures - measureCount;

      if (this.beatEngine && this.startOnBeat) {
        const floatBeats = this.numBeats * measurePhase;
        const nextBeatCount = Math.ceil(floatBeats) % this.numBeats;

        this.beatCount = nextBeatCount; // next beat

        if (nextBeatCount !== 0) {
          const audioTime = audioScheduler.currentTime;
          const nextBeatDelay = (nextBeatCount - floatBeats) * this.beatPeriod;
          this.beatEngine.resetTime(audioTime + nextBeatDelay);
        }
      }

      if (measurePhase > 0)
        measureCount++;

      this.measureCount = measureCount - 1;

      return startPosition + measureCount * this.measureLength;
    }

    this.measureCount = -1;
    return startPosition;
  }

  // generate next measure
  advancePosition(syncTime, metricPosition, metricSpeed) {
    const audioTime = audioScheduler.currentTime;

    this.measureCount++;

    // whether metronome continues (default is true)
    const cont = this.callback(this.measureCount, 0);

    this.beatCount = 1;

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

    this._syncSchedulerHook = new SyncSchedulerHook(this._syncScheduler, this);
    this._syncEventEngine = new SyncEventEngine(this._syncScheduler, this);

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
        callback(event, data);

      this._callingEventListeners = false;
    }
  }

  _rescheduleMetricEngines() {
    const syncTime = this.syncTime;
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
        if (engine.syncSpeed)
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

    this._metronomeEngineMap.clear();

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

    if (syncTime > this.syncTime)
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

  /**
   * Current audio time.
   * @type {Number}
   */
  get audioTime() {
    return audioScheduler.currentTime;
  }

  get syncTime() {
    return this._syncScheduler.syncTime;
  }

  get currentTime() {
    return this._syncScheduler.syncTime;
  }

  get metricPosition() {
    if (this._tempo > 0)
      return this._metricPosition + (this._syncScheduler.syncTime - this._syncTime) * this._metricSpeed;

    return this._metricPosition;
  }

  get currentPosition() {
    return this.metricPosition;
  }

  /**
   * Difference between the audio scheduler's logical audio time and the `currentTime`
   * of the audio context.
   */
  get deltaTime() {
    return audioScheduler.currentTime - audio.audioContext.currentTime;
  }

  /**
   * Current tempo.
   * @return {Number} - Tempo in BPM.
   */
  get tempo() {
    return this._tempo;
  }

  /**
   * Current tempo unit.
   * @return {Number} - Tempo unit in respect to whole note.
   */
  get tempoUnit() {
    return this._tempoUnit;
  }

  /**
   * Get metric position corrsponding to a given audio time (regarding the current tempo).
   * @param  {Number} time - time
   * @return {Number} - metric position
   */
  getMetricPositionAtAudioTime(audioTime) {
    if (this._tempo > 0) {
      const syncTime = this._syncScheduler.getSyncTimeAtAudioTime(audioTime);
      return this._metricPosition + (syncTime - this._syncTime) * this._metricSpeed;
    }

    return this._metricPosition;
  }

  /**
   * Get metric position corrsponding to a given sync time (regarding the current tempo).
   * @param  {Number} time - time
   * @return {Number} - metric position
   */
  getMetricPositionAtSyncTime(syncTime) {
    if (this._tempo > 0)
      return this._metricPosition + (syncTime - this._syncTime) * this._metricSpeed;

    return this._metricPosition;
  }

  /**
   * Get sync time corresponding to a given metric position (regarding the current tempo).
   * @param  {Number} position - metric position
   * @return {Number} - sync time
   */
  getSyncTimeAtMetricPosition(metricPosition) {
    const metricSpeed = this._metricSpeed;

    if (metricPosition < Infinity && metricSpeed > 0)
      return this._syncTime + (metricPosition - this._metricPosition) / metricSpeed;

    return Infinity;
  }

  /**
   * Get audio time corresponding to a given metric position (regarding the current tempo).
   * @param  {Number} position - metric position
   * @return {Number} - audio time
   */
  getAudioTimeAtMetricPosition(metricPosition) {
    const metricSpeed = this._metricSpeed;

    if (metricPosition < Infinity && metricSpeed > 0) {
      const syncTime = this._syncTime + (metricPosition - this._metricPosition) / metricSpeed;
      return this._syncScheduler.getAudioTimeAtSyncTime(syncTime);
    }

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
  addEvent(fun, metricPosition, lookahead = false) {
    const schedulerService = this;
    const engine = {
      timeout: null,
      syncSpeed(time, position, speed) {
        if (speed === 0)
          clearTimeout(this.timeout);
      },
      syncPosition(time, position, speed) {
        clearTimeout(this.timeout);

        if (metricPosition >= position)
          return metricPosition;

        return Infinity;
      },
      advancePosition(time, position, speed) {
        const delta = schedulerService.deltaTime;

        if (delta > 0)
          this.timeout = setTimeout(fun, 1000 * delta, position); // bridge scheduler lookahead with timeout
        else
          fun(position);

        return Infinity;
      },
    };

    this.add(engine, metricPosition); // add without checks
  }

  add(engine, startPosition = this.metricPosition) {
    this._engineSet.add(engine);

    const metricPosition = Math.max(startPosition, this.metricPosition);

    // schedule engine
    if (!this._callingEventListeners && this._metricSpeed > 0) {
      const syncTime = this.syncTime;
      const nextEnginePosition = engine.syncPosition(syncTime, metricPosition, this._metricSpeed);

      this._engineQueue.insert(engine, nextEnginePosition);
      this._syncSchedulerHook.reschedule();
    }
  }

  remove(engine) {
    const syncTime = this.syncTime;
    const metricPosition = this.getMetricPositionAtSyncTime(syncTime);

    // stop engine
    if (engine.syncSpeed)
      engine.syncSpeed(syncTime, metricPosition, 0);

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
  addMetronome(callback, numBeats = 4, metricDiv = 4, tempoScale = 1, startPosition = 0, startOnBeat = false) {
    const beatLength = 1 / (metricDiv * tempoScale);
    const engine = new MetronomeEngine(startPosition, numBeats, beatLength, startOnBeat, callback);

    this._metronomeEngineMap.set(callback, engine);
    this.add(engine, startPosition);
  }

  /**
   * Remove periodic callback.
   * @param {Function} callback callback function
   */
  removeMetronome(callback /*, endPosition */ ) {
    const engine = this._metronomeEngineMap.get(callback);

    if (engine) {
      this._metronomeEngineMap.delete(callback);
      this.remove(engine);
    }
  }
}

serviceManager.register(SERVICE_ID, MetricScheduler);

export default MetricScheduler;
