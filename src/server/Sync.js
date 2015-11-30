import SyncServer from 'sync/server';
import Module from './Module';


/**
 * [server] Synchronize the local clock on a master clock shared by the server and the clients.
 *
 * (See also {@link src/client/Sync.js~Sync} on the client side.)
 *
 * @example const sync = new Sync();
 *
 * const nowSync = sync.getSyncTime(); // current time in the sync clock time
 */
export default class Sync extends Module {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [name='sync'] Name of the module.
   */
  constructor(options = {}) {
    super(options.name || 'sync');

    this._hrtimeStart = process.hrtime();

    this._sync = new SyncServer(() => {
      const time = process.hrtime(this._hrtimeStart);
      return time[0] + time[1] * 1e-9;
    });
  }

  /**
   * @private
   * @todo ?
   */
  connect(client) {
    super.connect(client);
    this._sync.start((cmd, ...args) => client.send(cmd, ...args), (cmd, callback) => client.receive(cmd, callback));
  }

  /**
   * Returns the current time in the sync clock.
   * @return {Number} Current sync time (in seconds).
   */
  getSyncTime() {
    return this._sync.getSyncTime();
  }
}
