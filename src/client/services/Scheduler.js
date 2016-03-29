import * as audio from 'waves-audio';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

class _SyncTimeSchedulingQueue extends audio.SchedulingQueue {
  constructor(sync, scheduler) {
    super();

    this.sync = sync;
    this.scheduler = scheduler;
    this.scheduler.add(this, Infinity);
    this.nextSyncTime = Infinity;

    // call this.resync in sync callback
    this.resync = this.resync.bind(this);
    this.sync.addListener(this.resync);
  }

  get currentTime () {
    return this.sync.getSyncTime(this.scheduler.currentTime);
  }

  advanceTime(audioTime) {
    const syncTime = this.sync.getSyncTime(audioTime);
    const nextSyncTime = super.advanceTime(syncTime);
    const nextAudioTime = this.sync.getAudioTime(nextSyncTime);

    this.nextSyncTime = nextSyncTime;
    this.nextAudioTime = nextAudioTime; // for resync testing

    return nextAudioTime;
  }

  resetTime(syncTime) {
    const audioTime = (typeof syncTime !== 'undefined') ?
      this.sync.getAudioTime(syncTime) : undefined;

    this.nextSyncTime = syncTime;
    this.nextAudioTime = audioTime;

    this.master.resetEngineTime(this, audioTime);
  }

  resync() {
    if (this.nextSyncTime !== Infinity) {
      const nextAudioTime = this.sync.getAudioTime(this.nextSyncTime);
      this.master.resetEngineTime(this, nextAudioTime);
    } else {
      this.master.resetEngineTime(this, Infinity);
    }
  }
}

const SERVICE_ID = 'service:scheduler';

/**
 * Interface for the client `'scheduler'` service.
 *
 * This service provides a scheduler synchronised among all client using the
 * [`sync`]{@link module:soundworks/client.Sync} service. It internally uses the
 * scheduler provided by the [`wavesjs`]{@link https://github.com/wavesjs/audio}
 * library.
 *
 * While this service has no direct server counterpart, it's dependency to the
 * [`sync`]{@link module:soundworks/client.Sync} service requires the existance
 * of a server. Also, the service requires a device with `WebAudio` ability.
 *
 * @param {Object} options
 * @param {Number} options.period - Period of the scheduler.
 * @param {Number} options.lookahead - Lookahead of the scheduler.
 *
 * @memberof module:soundworks/client
 * @see [`wavesAudio.Scheduler`]{@link http://wavesjs.github.io/audio/#audio-scheduler}
 * @see [`sync service`]{@link module:soundworks/client.Sync}
 *
 * @example
 * // inside the experience constructor
 * this.scheduler = this.require('scheduler');
 * // when the experience has started
 * const nextSyncTime = this.scheduler.getSyncTime() + 2;
 * this.scheduler.add(timeEngine, nextSyncTime, true);
 */
class Scheduler extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor () {
    super(SERVICE_ID);

    this._sync = this.require('sync');
    this._platform = this.require('platform', { features: 'web-audio' });

    this._scheduler = audio.getScheduler();
    this._syncedQueue = new _SyncTimeSchedulingQueue(this._sync, this._scheduler);

    const defaults = {
      lookahead: this._scheduler.lookahead,
      period: this._scheduler.period,
    };

    this.configure(defaults);
  }

  /**
   * Override default `configure` to configure the scheduler.
   * @private
   * @param {Object} options - The options to apply to the service.
   */
  configure(options) {
    if (options.period !== undefined) {
      if (options.period > 0.010)
        this._scheduler.period = options.period;
      else
        throw new Error(`Invalid scheduler period: ${options.period}`);
    }

    if (options.lookahead !== undefined) {
      if (options.lookahead > 0.010)
        this._scheduler.lookahead = options.lookahead;
      else
        throw new Error(`Invalid scheduler lookahead: ${options.lookahead}`);
    }

    super.configure(options);
  }

  /** @private */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.ready();
  }

  /**
   * Current audio time of the scheduler.
   */
  get audioTime() {
    return this._scheduler.currentTime;
  }

  /**
   * Current sync time of the scheduler.
   */
  get syncTime() {
    return this._syncedQueue.currentTime;
  }

  /**
   * Difference between the scheduler's logical audio time and the `currentTime`
   * of the audio context.
   */
  get deltaTime() {
    return this._scheduler.currentTime - audio.audioContext.currentTime;
  }

  /**
   * Call a function at a given time.
   * @param {Function} fun - Function to be deferred.
   * @param {Number} time - The time at which the function should be executed.
   * @param {Number} [synchronized=true] - Defines if the function call should be
   *  synchronized or not.
   */
  defer(fun, time, synchronized = true) {
    const scheduler = synchronized ? this._syncedQueue : this._scheduler;
    scheduler.defer(fun, time)
  }

  /**
   * Add a time engine to the queue.
   * @param {Function} engine - Engine to schedule.
   * @param {Number} time - The time at which the function should be executed.
   * @param {Number} [synchronized=true] - Defines if the engine should be
   *  synchronized or not.
   * @see [`wavesAudio.TimeEngine`]{@link http://wavesjs.github.io/audio/#audio-time-engine}
   */
  add(engine, time, synchronized = true) {
    const scheduler = synchronized ? this._syncedQueue : this._scheduler;
    scheduler.add(engine, time);
  }

  /**
   * Remove the given engine from the queue.
   * @param {Function} engine - Engine to remove from the queue.
   * @see [`wavesAudio.TimeEngine`]{@link http://wavesjs.github.io/audio/#audio-time-engine}
   */
  remove(engine) {
    if (this._scheduler.has(engine))
      this._scheduler.remove(engine);
    else if (this._syncedQueue.has(engine))
      this._syncedQueue.remove(engine);
  }

  /**
   * Remove all engine from the scheduling queues (synchronized and not synchronized).
   */
  clear() {
    this._syncedQueue.clear();
    this._scheduler.clear();
  }
};

serviceManager.register(SERVICE_ID, Scheduler);

export default Scheduler;
