'use strict';

const Sync = require('sync/server');
const ServerModule = require('./ServerModule');
// import ServerModule from './ServerModule.es6.js';

/**
 * The {@link ServerSync} module takes care of the synchronization process on the server side.
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
class ServerSync extends ServerModule {
// export default class ServerSync extends ServerModule {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [name='sync'] Name of the module.
   */
  constructor(options = {}) {
    super(options.name || 'sync');

    this._hrtimeStart = process.hrtime();
    this._sync = new Sync(() => {
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
    return this.sync.getSyncTime();
  }
}

module.exports = ServerSync;
