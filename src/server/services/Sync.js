import Activity from '../core/Activity';
import serviceManager from '../core/serviceManager';
import SyncModule from 'sync/server';

const SERVICE_ID = 'service:sync';
/**
 * Interface of the server `'sync'` service.
 *
 * This service acts as the master clock provider for the client sync service,
 * in order to synchronize the clocks of the different clients to its own clock.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Sync}*__
 *
 * **Note:** the service is based on [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.sync = this.require('sync');
 * // when the experience has started
 * const syncTime = this.sync.getSyncTime();
 */
class Sync extends Activity {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);
  }

  /** @private */
  start() {
    super.start();

    this._hrtimeStart = process.hrtime();

    this._sync = new SyncModule(() => {
      const time = process.hrtime(this._hrtimeStart);
      return time[0] + time[1] * 1e-9;
    });
  }

  /** @private */
  connect(client) {
    super.connect(client);

    const send = (cmd, ...args) => this.send(client, cmd, ...args);
    const receive = (cmd, callback) => this.receive(client, cmd, callback);

    this._sync.start(send, receive);
  }

  /**
   * Returns the current time in the sync clock, devired from `process.hrtime()`.
   * @return {Number} - Current sync time (in _seconds_).
   */
  getSyncTime() {
    return this._sync.getSyncTime();
  }
}

serviceManager.register(SERVICE_ID, Sync);

export default Sync;
