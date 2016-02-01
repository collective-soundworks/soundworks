import SyncServer from 'sync/server';
import Pier from '../core/Pier';


/**
 * Synchronize the local clock on a master clock shared by the server and the clients.
 *
 * Both the clients and the server can use this master clock as a common time reference.
 * For instance, this allows all the clients to do something exactly at the same time, such as blinking the screen or playing a sound in a synchronized manner.
 *
 * **Note:** the module is based on [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * (See also {@link src/client/ClientSync.js~ClientSync} on the client side.)
 *
 * @example const sync = new ServerSync();
 *
 * const nowSync = sync.getSyncTime(); // current time in the sync clock time
 */
export default class ServerSync extends Pier {
  constructor() {
    super('service:sync');

    this._hrtimeStart = process.hrtime();

    this._sync = new SyncServer(() => {
      const time = process.hrtime(this._hrtimeStart);
      return time[0] + time[1] * 1e-9;
    });
  }

  /**
   * @private
   */
  connect(client) {
    super.connect(client);

    const send = (cmd, ...args) => this.send(client, cmd, ...args);
    const receive = (cmd, callback) => this.receive(client, cmd, callback);

    this._sync.start(send, receive);
  }

  /**
   * Returns the current time in the sync clock.
   * @return {Number} - Current sync time (in seconds).
   */
  getSyncTime() {
    return this._sync.getSyncTime();
  }
}
