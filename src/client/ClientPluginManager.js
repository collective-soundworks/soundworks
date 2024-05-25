import BasePluginManager from '../common/BasePluginManager.js';
import ClientPlugin from './ClientPlugin.js';
import Client from './Client.js';

/**
 * The `PluginManager` allows to register and retrieve `soundworks` plugins.
 *
 * Plugins should always be registered both client-side and server-side,
 * and before {@link Client#start} or {@link server.Server#start}
 * to be properly initialized.
 *
 * In some sitautions, you might want to register the same plugin factory several times
 * using different ids (e.g. for watching several parts of the file system, etc.).
 *
 * Refer to the plugins' documentation for more precise examples, and the specific API
 * they expose. See [https://soundworks.dev/guide/ecosystem](https://soundworks.dev/guide/ecosystem)
 * for more informations on the available plugins.
 *
 * See {@link Client#pluginManager}
 *
 * ```
 * // client-side
 * import { Client } from '@soundworks/core/client.js';
 * import syncPlugin from '@soundworks/plugin-sync/client.js';
 *
 * const client = new Client(config);
 * // register the plugin before `client.start()`
 * client.pluginManager.register('sync', syncPlugin);
 *
 * await client.start();
 *
 * const sync = await client.pluginManager.get('sync');
 *
 * setInterval(() => {
 *   // log the estimated global synced clock alongside the local clock.
 *   console.log(sync.getSyncTime(), sync.getLocalTime());
 * }, 1000);
 * ```
 *
 * ```
 * // server-side
 * import { Server } from '@soundworks/core/server.js';
 * import syncPlugin from '@soundworks/plugin-sync/server.js';
 *
 * const server = new Server(config);
 * // register the plugin before `server.start()`
 * server.pluginManager.register('sync', syncPlugin);
 *
 * await server.start();
 *
 * const sync = await server.pluginManager.get('sync');
 *
 * setInterval(() => {
 *   // log the estimated global synced clock alongside the local clock.
 *   console.log(sync.getSyncTime(), sync.getLocalTime());
 * }, 1000);
 * ```
 *
 * @extends BasePluginManager
 * @inheritdoc
 * @hideconstructor
 */
class ClientPluginManager extends BasePluginManager {
  /**
   * @param {Client} client - The soundworks client instance.
   */
  constructor(client) {
    if (!(client instanceof Client)) {
      throw new Error(`[soundworks.ClientPluginManager] Invalid argument, "new ClientPluginManager(client)" should receive an instance of "soundworks.Client" as argument`);
    }

    super(client);
  }

  /**
   * Register a plugin.
   * @param {string} id - User defined id, must match the id given on server-side.
   * @param {function} factory - Factory function of the plugin.
   * @param {Object.<string, any>} [options] - Options to be given to the plugin at instanciation.
   * @param {string[]} [deps] - List of plugin ids that should be properly initialized
   *  before initializing this plugin.
   */
  register(id, factory, options = {}, deps = []) {
    const ctor = factory(ClientPlugin);

    if (!(ctor.prototype instanceof ClientPlugin)) {
      throw new Error(`[soundworks.ClientPluginManager] Invalid argument, "pluginManager.register" second argument should be a factory function returning a class extending the "Plugin" base class`);
    }

    super.register(id, ctor, options, deps);
  }

  /**
   * Retrieve an fully started instance of a registered plugin.
   *
   * Be aware that the `get` method resolves only when the plugin is fully 'started',
   * which is what we want 99.99% of the time. As such, and to prevent the application
   * to be stuck in some kind of Promise dead lock, this method will throw if
   * used before `client.init()` (or `client.start()`).
   *
   * To handle the remaining 0.01% cases and access plugin instances during their
   * initialization (e.g. to display initialization screen, etc.), you should rely
   * on the `onStateChange` method.
   *
   * _Note: the async API is designed to enable the dynamic creation of plugins
   * in a future release._
   *
   * @param {string} id - Id of the plugin as defined when registered.
   * @returns {Promise<ClientPlugin>}
   * @see {@link ClientPluginManager#onStateChange}
   */
  async get(id) {
    if (this.status !== 'started') {
      throw new Error(`[soundworks.ClientPluginManager] Cannot get plugin before "client.init()"`);
    }

    return super.unsafeGet(id);
  }
}

export default ClientPluginManager;
