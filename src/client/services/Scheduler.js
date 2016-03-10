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

class Scheduler extends Service {
  constructor () {
    super(SERVICE_ID);

    this._sync = this.require('sync');

    this._scheduler = audio.getScheduler();
    this._syncedQueue = new _SyncTimeSchedulingQueue(this._sync, this._scheduler);

    const defaults = {
      lookahead: this._scheduler.lookahead,
      period: this._scheduler.period,
    };

    this.configure(defaults);
  }

  /**
   * Override default configure to add descriptors from multiple calls.
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

  /** inheritdoc */
  init () {

  }

  /** inheritdoc */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.ready();
  }

  get audioTime() {
    return this._scheduler.currentTime;
  }

  get syncTime() {
    return this._syncedQueue.currentTime;
  }

  get deltaTime() {
    return this._scheduler.currentTime - audio.audioContext.currentTime;
  }

  defer(fun, time, synchronized = true) {
    const scheduler = synchronized ? this._syncedQueue : this._scheduler;
    scheduler.defer(fun, time)
  }

  add(engine, time, synchronized = true) {
    const scheduler = synchronized ? this._syncedQueue : this._scheduler;
    scheduler.add(engine, time);
  }

  remove(engine) {
    if (this._scheduler.has(engine))
      this._scheduler.remove(engine);
    else if (this._syncedQueue.has(engine))
      this._syncedQueue.remove(engine);
  }

  clear() {
    this._syncedQueue.clear();
    this._scheduler.clear();
  }
};

serviceManager.register(SERVICE_ID, Scheduler);

export default Scheduler;
