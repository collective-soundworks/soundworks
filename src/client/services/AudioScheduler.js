import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import * as audio from 'waves-audio';

const SERVICE_ID = 'service:audio-scheduler';

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
class AudioScheduler extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor () {
    super(SERVICE_ID, false);

    this._platform = this.require('platform', { features: 'web-audio' });

    // initialize sync option
    this._sync = null;
    this._syncedQueue = null;

    // get audio time based scheduler
    this._scheduler = audio.getScheduler();

    const defaults = {
      lookahead: this._scheduler.lookahead,
      period: this._scheduler.period,
    };

    // call super.configure (activate sync option only if required)
    super.configure(defaults);
  }

  /**
   * Override default `configure` to configure the scheduler.
   *
   * @param {Object} options - The options to apply to the service.
   * @private
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
  get currentTime() {
    return this._scheduler.currentTime;
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
   * Remove all scheduled functions and time engines (synchronized or not) from
   * the scheduler.
   */
  clear() {
    this._scheduler.clear();
  }
}

serviceManager.register(SERVICE_ID, AudioScheduler);

export default AudioScheduler;
