import BasePlugin from '../common/BasePlugin.js';

/**
 * Base class to extend in order to create the server-side counterpart of a
 * soundworks plugin.
 *
 * @memberof server
 *
 * @augments BasePlugin
 * @param {server.Server} server - Instance of the soundworks server.
 * @param {String} id - User defined id of the plugin, as given in {@link server.PluginManager#register}.
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
   * Method called when a client (which registered the client-side plugin),
   * connects to the application. Override this method if you need to perform
   * some particular logic (e.g. creating a shared state) for each clients.
   *
   * @param {server.Client} client
   */
  async addClient(client) {
    this.clients.add(client);
  }

  /**
   * Method called when a client (which registered the client-side plugin),
   * disconnects from the application. Override this method if you need to perform
   * some particular logic (e.g. creating a shared state) for each clients.
   *
   * @param {server.Client} client
   */
  async removeClient(client) {
    this.clients.delete(client);
  }
}

export default Plugin;
