import BasePlugin from '../common/BasePlugin.js';

export const kServerPluginName = Symbol.for('soundworks:server-plugin-name');

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
 * for more information on the available plugins.
 *
 * _Creating new plugins should be considered an advanced usage._
 *
 * @extends {BasePlugin}
 * @inheritdoc
 */
export default class ServerPlugin extends BasePlugin {
  // Note: we need this workaround in plugin tests, because the test app and
  // the tested plugin will import different versions of ServerPlugin
  static [kServerPluginName] = 'ServerPlugin';

  #server = null;
  #clients = new Set();

  /**
   * @param {Server} server - The soundworks server instance.
   * @param {string} id - User defined id of the plugin as defined in {@link ServerPluginManager#register}.
   */
  constructor(server, id) {
    super(id);
    this.#server = server;
  }

  /**
   * Instance of soundworks server.
   * @type {Server}
   * @see {@link Server}
   */
  get server() {
    return this.#server;
  }

  /**
   * Set of the clients registered in the plugin.
   * @type {Set<ServerClient>}
   * @see {@link ServerClient}
   */
  get clients() {
    return this.#clients;
  }

  /**
   * Method called when a client (which registered the client-side plugin),
   * connects to the application. Override this method if you need to perform
   * some particular logic (e.g. creating a shared state) for each clients.
   *
   * @param {ServerClient} client
   */
  async addClient(client) {
    this.#clients.add(client);
  }

  /**
   * Method called when a client (which registered the client-side plugin),
   * disconnects from the application. Override this method if you need to perform
   * some particular logic (e.g. creating a shared state) for each clients.
   *
   * @param {ServerClient} client
   */
  async removeClient(client) {
    this.#clients.delete(client);
  }
}
