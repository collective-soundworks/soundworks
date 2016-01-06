import { audioContext } from 'waves-audio';
import SyncClient from 'sync/client';
import client from './client';
import ClientModule from './ClientModule';
import SegmentedView from './display/SegmentedView';

/**
 * [client] Synchronize the local clock on a master clock shared by the server and the clients.
 *
 * Both the clients and the server can use this master clock as a common time reference.
 * For instance, this allows all the clients to do something exactly at the same time, such as blinking the screen or playing a sound in a synchronized manner.
 *
 * The module always has a view (that displays "Clock syncing, stand by…", until the very first synchronization process is done).
 *
 * The module finishes its initialization as soon as the client clock is in sync with the master clock.
 * Then, the synchronization process keeps running in the background to resynchronize the clocks from times to times.
 *
 * **Note:** the module is based on [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * (See also {@link src/server/ServerSync.js~ServerSync} on the server side.)
 *
 * @example const sync = new ClientSync();
 *
 * const nowLocal = sync.getLocalTime(); // current time in local clock time
 * const nowSync = sync.getSyncTime(); // current time in sync clock time
 * @emits 'sync:stats' each time the module (re)synchronizes the local clock on the sync clock.
 * The `'sync:stats'` event goes along with the `report` object that has the following properties:
 * - `timeOffset`, current estimation of the time offset between the client clock and the sync clock;
 * - `travelTime`, current estimation of the travel time for a message to go from the client to the server and back;
 * - `travelTimeMax`, current estimation of the maximum travel time for a message to go from the client to the server and back.
 */
export default class ClientSync extends ClientModule {
  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='sync'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   */
  constructor(options = {}) {
    super(options.name || 'sync', options);

    this._sync = new SyncClient(() => audioContext.currentTime);
    this.viewCtor = SegmentedView || options.viewCtor;

    this.init();
  }

  init() {
    this._ready = false;
    this.view = this.createView();
  }

  /**
   * Start the synchronization process.
   * @private
   */
  start() {
    super.start();
    this._sync.start(this.send, this.receive, (status, report) => {
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
    if (message === 'sync:status') {
      if (report.status === 'training' || report.status === 'sync') {
        if (!this._ready) {
          this._ready = true;
          this.done();
        }
      }

      this.emit('status', report);
    }
  }
}
