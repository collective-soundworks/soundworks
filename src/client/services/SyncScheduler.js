import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import { Scheduler } from 'waves-masters';

const SERVICE_ID = 'service:sync-scheduler';

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
class SyncScheduler extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor () {
    super(SERVICE_ID, false);

    this._sync = this.require('sync');
    this._scheduler = null;
  }

  /** @private */
  start() {
    super.start();

    // init scheduler based on sync-time
    const getTimeFunction = () => this._sync.getSyncTime();
    this._scheduler = new Scheduler(getTimeFunction);

    this.ready();
  }

  /**
   * Current audio time of the scheduler.
   * @instance
   * @type {Number}
   */
  get audioTime() {
    return this._sync.getAudioTime(this._scheduler.currentTime);
  }

  /**
   * Current sync time of the scheduler.
   * @instance
   * @type {Number}
   */
  get syncTime() {
    return this._scheduler.currentTime;
  }

  /**
   * Current sync time of the scheduler (alias `this.syncTime`).
   * @instance
   * @type {Number}
   */
  get currentTime() {
    return this._scheduler.currentTime;
  }

  /**
   * Difference between the scheduler's logical time and the current `syncTime`
   * @instance
   * @type {Number}
   */
  get deltaTime() {
    return this._scheduler.currentTime - this._sync.getSyncTime();
  }

  /**
   * Get sync time corresponding to given audio time.
   *
   * @param  {Number} audioTime - audio time.
   * @return {Number} - sync time corresponding to given audio time.
   */
  getSyncTimeAtAudioTime(audioTime) {
    return this._sync.getSyncTime(audioTime);
  }

  /**
   * Get audio time corresponding to given sync time.
   *
   * @param  {Number} syncTime - sync time.
   * @return {Number} - audio time corresponding to given sync time.
   */
  getAudioTimeAtSyncTime(syncTime) {
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
  defer(fun, time, lookahead = false) {
    const scheduler = this._scheduler;
    const schedulerService = this;
    let engine;

    if (lookahead) {
      scheduler.defer(fun, time);
    } else {
      engine = {
        advanceTime: function(time) {
          const delta = schedulerService.deltaTime;

          if (delta > 0)
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
   *
   * @param {Function} engine - Engine to schedule.
   * @param {Number} time - The time at which the function should be executed.
   */
  add(engine, time) {
    this._scheduler.add(engine, time);
  }

  /**
   * Remove the given engine from the queue.
   *
   * @param {Function} engine - Engine to remove from the scheduler.
   */
  remove(engine) {
    this._scheduler.remove(engine);
  }

  /**
   * Remove all scheduled functions and time engines from the scheduler.
   */
  clear() {
    this._scheduler.clear();
  }
}

serviceManager.register(SERVICE_ID, SyncScheduler);

export default SyncScheduler;
