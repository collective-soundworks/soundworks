/**
 * Base class to extend for creating new soundworks plugins.
 *
 * @memberof server
 */
class Plugin {
  constructor(server, id) {
    /**
     * Instance of soundworks server.
     * @type {server.Server}
     * @see {@link server.Server}
     */
    this.server = server;

    /**
     * Id of the plugin.
     * @type {String}
     */
    this.id = id;

    /**
     * Type of the plugin, i.e. the ClassName.
     *
     * Usefull to do something based on certain types of plugin while not
     * knowing with which name they have been registered. (e.g. view for platform)

     * @type {String}
     * @readonly
     */
    this.type = this.constructor.name;

    /**
     * Options of the plugin.
     * @type {Object}
     */
    this.options = {};

    /**
     * Current status of the plugin ('idle', 'inited', 'started', 'errored')
     * @type {String}
     */
    this.status = 'idle';

    /** @private */
    this.clients = new Set();
  }

  /**
   * This method is called during the `pluginManager.start()` which is itself
   * called during `server.init()`. At this point the state manager is ready to use.
   *
   * @example
   * class MyDummyPlugin extends Plugin {
   *   async start() {
   *     this.state = await this.server.stateManager.create(`s:${this.id}`);
   *     await new Promise(resolve => setTimeout(resolve, 1000));
   *   }
   * }
   */
  // @note - we keep `start` instead of init, as we may want to stop later
  async start() {}

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
