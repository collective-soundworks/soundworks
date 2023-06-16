import BasePluginManager from '../common/BasePluginManager.js';
import Plugin from './Plugin.js';
import Server from './Server.js';

/**
 * Callback executed when a plugin internal state is updated.
 *
 * @callback server.PluginManager~onStateChangeCallback
 * @param {object<server.Plugin#id, server.Plugin>} fullState - List of all plugins.
 * @param {server.Plugin|null} initiator - Plugin that initiated the update or `null`
 *  if the change was initiated by the state manager (i.e. when the initialization
 *  of the plugins starts).
 */

/**
 * Delete the registered {@link server.PluginManager~onStateChangeCallback}.
 *
 * @callback server.PluginManager~deleteOnStateChangeCallback
 */

/**
 * The `PluginManager` allows to register and retrieve `soundworks` plugins.
 *
 * Plugins should always be registered both client-side and server-side,
 * and before {@link client.Client#start} or {@link server.Server#start}
 * to be properly initialized.
 *
 * In some sitautions, you might want to register the same plugin factory several times
 * using different ids (e.g. for watching several parts of the file system, etc.).
 *
 * Refer to the plugins' documentation for more precise examples, and the specific API
 * they expose. See [https://soundworks.dev/guide/ecosystem](https://soundworks.dev/guide/ecosystem)
 * for more informations on the available plugins.
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
 * @memberof server
 * @extends BasePluginManager
 * @inheritdoc
 * @hideconstructor
 */
class PluginManager extends BasePluginManager {
  constructor(server) {
    if (!(server instanceof Server)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "new PluginManager(server)" should receive an instance of "soundworks.Server" as argument`);
    }

    super(server);
  }

  register(id, factory = null, options = {}, deps = []) {
    const ctor = factory(Plugin);

    if (!(ctor.prototype instanceof Plugin)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "pluginManager.register" second argument should be a factory function returning a class extending the "Plugin" base class`);
    }

    super.register(id, ctor, options, deps);
  }

  /**
   * Retrieve an fully started instance of a registered plugin.
   *
   * Be aware that the `get` method resolves only when the plugin is fully 'started',
   * which is what we want 99.99% of the time. As such, and to prevent the application
   * to be stuck in some kind of Promise dead lock, this method will throw if
   * used before `server.init()` (or `server.start()`).
   *
   * To handle the remaining 0.01% cases and access plugin instances during their
   * initialization (e.g. to display initialization screen, etc.), you should rely
   * on the `onStateChange` method.
   *
   * _Note: the async API is designed to enable the dynamic creation of plugins
   * (hopefully without brealing changes) in a future release._
   *
   * @param {server.Plugin#id} id - Id of the plugin as defined when registered.
   * @returns {server.Plugin}
   * @see {@link server.PluginManager#onStateChange}
   *
   * @private
   */
  async get(id) {
    if (this.status !== 'started') {
      throw new Error(`[soundworks.PluginManager] Cannot get plugin before "server.init()"`);
    }

    return super.unsafeGet(id);
  }

  // server only methods

  /** private */
  checkRegisteredPlugins(registeredPlugins) {
    let missingPlugins = [];

    for (let id of registeredPlugins) {
      if (!this._instances.has(id)) {
        missingPlugins.push(id);
      }
    }

    if (missingPlugins.length > 0) {
      throw new Error(`Invalid plugin list, the following plugins registered client-side: [${missingPlugins.join(', ')}] have not been registered server-side. Registered server-side plugins are: [${Array.from(this._instances.keys()).join(', ')}].`);
    }
  }

  /** @private */
  async addClient(client, registeredPlugins = []) {
    let promises = [];

    for (let pluginName of registeredPlugins) {
      const plugin = await this.get(pluginName);
      const promise = plugin.addClient(client);
      promises.push(promise);
    }

    await Promise.all(promises);
  }

  /** @private */
  async removeClient(client) {
    let promises = [];

    for (let plugin of this._instances.values()) {
      if (plugin.clients.has(client)) {
        promises.push(plugin.removeClient(client));
      }
    }

    await Promise.all(promises);
  }
}

export default PluginManager;
