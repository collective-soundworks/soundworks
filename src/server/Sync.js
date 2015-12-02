import SyncServer from 'sync/server';
import Module from './Module';


/**
 * The {@link Sync} module takes care of the synchronization process on the server side.
 * @example
 * // Require the Soundworks library (server side)
 * const serverSide = require('soundworks/server'); // TODO
 *
 * // Create Sync module
 * const sync = new serverSide.Sync();
 *
 * // Get sync time
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

    const sendFunction = (cmd, ...args) => this.send(client, cmd, ...args);
    const receiveFunction = (cmd, callback) => this.receive(client, cmd, callback);

    this._sync.start(sendFunction, receiveFunction);
  }

  /**
   * Returns the current time in the sync clock.
   * @return {Number} Current sync time (in seconds).
   */
  getSyncTime() {
    return this._sync.getSyncTime();
  }
}

