import BasePlugin from '../common/BasePlugin.js';

/**
 * Base class to extend for creating new soundworks plugins.
 *
 * @memberof server
 * @augments BasePlugin
 */
class Plugin extends BasePlugin {
  constructor(server, id) {
    super(id);

    /**
     * Instance of soundworks server.
     * @type {server.Server}
     * @see {@link server.Server}
     */
    this.server = server;

    /** @private */
    this.clients = new Set();
  }

  /**
   * Method called when a client, which registered the client-side plugin,
   * connects to the application.
   *
   * @param {server.Client} client
   */
  async addClient(client) {
    this.clients.add(client);
  }

  /**
   * Method called when a client, which registered the client-side plugin,
   * disconnects from the application.
   *
   * @param {server.Client} client
   */
  async removeClient(client) {
    this.clients.delete(client);
  }
}

export default Plugin;
