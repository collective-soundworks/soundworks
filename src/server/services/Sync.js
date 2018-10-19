import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import { SyncServer } from '@ircam/sync';

const SERVICE_ID = 'service:sync';

/**
 * Interface for the server `'sync'` service.
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
class Sync extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);

    const startTime = process.hrtime();

    const getTimeFunction = () => {
      const now = process.hrtime(startTime);
      return now[0] + now[1] * 1e-9;
    }

    this._sync = new SyncServer(getTimeFunction);
  }

  /** @private */
  start() {
    super.start();

    this.ready();
  }

  /** @private */
  connect(client) {
    super.connect(client);

    const sendFunction = (...args) => this.send(client, 'pong', ...args);
    const receiveFunction = callback => this.receive(client, 'ping', callback);

    this._sync.start(sendFunction, receiveFunction);
  }

  /**
   * Returns the current time in the sync clock, derived from `process.hrtime()`.
   * @return {Number} - Current sync time (in _seconds_).
   */
  getSyncTime() {
    return this._sync.getSyncTime();
  }
}

serviceManager.register(SERVICE_ID, Sync);

export default Sync;
