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
    const nextSyncTime = super.advanceTime(this.nextSyncTime);
    const nextAudioTime = this.sync.getAudioTime(nextSyncTime);

    this.nextSyncTime = nextSyncTime;

    return nextAudioTime;
  }

  resetTime(syncTime) {
    if(syncTime === undefined)
      syncTime = this.sync.getSyncTime();

    this.nextSyncTime = syncTime;

    const audioTime = this.sync.getAudioTime(syncTime);
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
class Scheduler extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor () {
    super(SERVICE_ID);

    this._platform = this.require('platform', { features: 'web-audio' });

    // initialize sync option
    this._sync = null;
    this._syncedQueue = null;

    // get audio time based scheduler
    this._scheduler = audio.getScheduler();

    const defaults = {
      lookahead: this._scheduler.lookahead,
      period: this._scheduler.period,
      sync: undefined,
    };

    // call super.configure (activate sync option only if required)
    super.configure(defaults);
  }

  /**
   * Override default `configure` to configure the scheduler.
   * @private
   * @param {Object} options - The options to apply to the service.
   */
  configure(options) {
    // check and set scheduler period option
    if (options.period !== undefined) {
      if (options.period > 0.010)
        this._scheduler.period = options.period;
      else
        throw new Error(`Invalid scheduler period: ${options.period}`);
    }

    // check and set scheduler lookahead option
    if (options.lookahead !== undefined) {
      if (options.lookahead > 0.010)
        this._scheduler.lookahead = options.lookahead;
      else
        throw new Error(`Invalid scheduler lookahead: ${options.lookahead}`);
    }

    // set sync option
    const opt = (options.sync !== undefined)? options.sync: true; // default is true
    const sync = (sync === undefined)? opt: (sync || opt); // truth will prevail

    // enable sync at first request with option set to true
    if(sync && !this._sync) {
      this._sync = this.require('sync');
      this._syncedQueue = new _SyncTimeSchedulingQueue(this._sync, this._scheduler)
    }

    options.sync = sync;
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
    if(this._syncedQueue)
      return this._syncedQueue.currentTime;

    return undefined;
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
  defer(fun, time, synchronized = !!this._sync, lookahead = false) {
    const scheduler = (synchronized && this._sync) ? this._syncedQueue : this._scheduler;
    const schedulerService = this;
    let engine;

    if(lookahead) {
      scheduler.defer(fun, time);
    } else {
      engine = {
        advanceTime: function(time) {
          const delta = schedulerService.deltaTime;

          if(delta > 0)
            setTimeout(fun, 1000 * delta, time); // bridge scheduler lookahead with timeout
          else
            fun(time);
        },
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
  add(engine, time, synchronized = !!this._sync) {
    const scheduler = (synchronized && this._sync) ? this._syncedQueue : this._scheduler;
    scheduler.add(engine, time);
  }

  /**
   * Remove the given engine from the queue.
   * @param {Function} engine - Engine to remove from the scheduler.
   */
  remove(engine) {
    if (this._scheduler.has(engine))
      this._scheduler.remove(engine);
    else if (this._syncedQueue && this._syncedQueue.has(engine))
      this._syncedQueue.remove(engine);
  }

  /**
   * Remove all scheduled functions and time engines (synchronized or not) from the scheduler.
   */
  clear() {
    if(this._syncedQueue)
      this._syncedQueue.clear();

    this._scheduler.clear();
  }
};

serviceManager.register(SERVICE_ID, Scheduler);

export default Scheduler;
