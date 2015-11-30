import { audioContext } from 'waves-audio';
import SyncClient from 'sync/client';
import client from './client';
import Module from './Module';


/**
 * [client] Synchronize the local clock on a master clock shared by the server and the clients.
 *
 * The module always has a view (that displays "Clock syncing, stand by…", until the very first synchronization process is done).
 *
 * The module finishes its initialization as soon as the client clock is in sync with the master clock.
 * Then, the synchronization process keeps running in the background to resynchronize the clocks from times to times.
 *
 * (See also {@link src/server/Sync.js~Sync} on the server side.)
 *
 * @example const sync = new Sync();
 *
 * const nowLocal = sync.getLocalTime(); // current time in local clock time
 * const nowSync = sync.getSyncTime(); // current time in sync clock time
 */
export default class Sync extends Module {
  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='sync'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   */
  constructor(options = {}) {
    super(options.name || 'sync', true, options.color || 'black');

    this._ready = false;
    this._sync = new SyncClient(() => audioContext.currentTime);

    this.setCenteredViewContent('<p class="soft-blink">Clock syncing, stand by&hellip;</p>');
  }

  /**
   * Start the synchronization process.
   * @private
   */
  start() {
    super.start();
    this._sync.start(client.send, client.receive, (status, report) => {
      this._syncStatusReport(status, report);
    });
  }

  /**
   * @private
   */
  restart() {
    // TODO
  }

  /**
   * Return the time in the local clock.
   * If no arguments are provided, returns the current local time (*i.e.* `audioContext.currentTime`).
   * @param {Number} syncTime Time in the sync clock (in seconds).
   * @return {Number} Time in the local clock corresponding to `syncTime` (in seconds).
   * @todo add optional argument?
   */
  getLocalTime(syncTime) {
    return this._sync.getLocalTime(syncTime);
  }

  /**
   * Return the time in the sync clock.
   * If no arguments are provided, returns the current sync time.
   * @param {Number} localTime Time in the local clock (in seconds).
   * @return {Number} Time in the sync clock corresponding to `localTime` (in seconds)
   * @todo add optional argument?
   */
  getSyncTime(localTime) {
    return this._sync.getSyncTime(localTime);
  }

  _syncStatusReport(message, report) {
    if(message === 'sync:status') {
      if(report.status === 'training' || report.status === 'sync') {
        if(!this._ready) {
          this._ready = true;
          this.done();
        }
      }
      this.emit('sync:status', report);
    }
  }
}
