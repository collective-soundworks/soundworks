import BasePlugin from '../common/BasePlugin.js';

/**
 * Callback executed when the plugin state is updated.
 *
 * @callback server.Plugin~onStateChangeCallback
 * @param {server.Plugin#state} state - Current state of the plugin.
 */

/**
 * Delete the registered {@link server.Plugin~onStateChangeCallback}.
 *
 * @callback server.Plugin~deleteOnStateChangeCallback
 */

/**
 * Base class to extend in order to create the server-side counterpart of a
 * `soundworks` plugin.
 *
 * In the `soundworks` paradigm, a plugin is a component that allows to extend
 * the framework capabilities by encapsulating common and reusable logic in
 * an application wise perspective. For example, plugins are available to handle
 * clock synchronization, to deal with the file system, etc. Plugin should always
 * have both a client-side and a server-side part.
 *
 * See [https://soundworks.dev/guide/ecosystem](https://soundworks.dev/guide/ecosystem)
 * for more informations on the available plugins.
 *
 * _Creating new plugins should be considered an advanced usage._
 *
 * @memberof server
 * @extends BasePlugin
 * @inheritdoc
 */
class Plugin extends BasePlugin {
  /**
   * @param {server.Server} server - The soundworks server instance.
   * @param {string} id - User defined id of the plugin as defined in
   *  {@link server.PluginManager#register}.
   */
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
