import audio from 'waves-audio';
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

  advanceTime(localTime) {
    const syncTime = this.sync.getSyncTime(localTime);
    const nextSyncTime = super.advanceTime(syncTime);
    const nextLocalTime = this.sync.getLocalTime(nextSyncTime);

    this.nextSyncTime = nextSyncTime;
    this.nextLocalTime = nextLocalTime; // for resync testing

    return nextLocalTime;
  }

  resetTime(syncTime) {
    const localTime = (typeof syncTime !== 'undefined') ?
      this.sync.getLocalTime(syncTime) : undefined;

    this.master.resetEngineTime(this, localTime);
  }

  resync() {
    if (this.nextSyncTime !== Infinity) {
      const nextLocalTime = this.sync.getLocalTime(this.nextSyncTime);
      this.master.resetEngineTime(this, nextLocalTime);
    } else {
      this.master.resetEngineTime(this, Infinity);
    }
  }

}

const SERVICE_ID = 'service:scheduler';

class Scheduler extends Service {
  constructor () {
    super(SERVICE_ID);

    this.sync = this.require('sync');

    this.queue = undefined;
    this.scheduler = audio.getScheduler();
    this.scheduler.lookahead = 0.2; // in seconds (100 ms for video)
    this.queue = new _SyncTimeSchedulingQueue(this.sync, this.scheduler);
  }

  init () {

  }

  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.ready();
  }

  getSyncScheduler () {
    return this.queue;
  }

  getLocalTime () {
    return this.scheduler.currentTime;
  }

  getSyncTime () {
    return this.queue.currentTime;
  }

  getDeltaTime() {
    const audioContext = audio.audioContext;
    return this.scheduler.currentTime - audioContext.currentTime;
  }
};

serviceManager.register(SERVICE_ID, Scheduler);

export default Scheduler;

