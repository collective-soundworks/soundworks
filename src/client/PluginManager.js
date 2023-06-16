import BasePluginManager from '../common/BasePluginManager.js';
import Plugin from './Plugin.js';
import Client from './Client.js';

/**
 * Callback executed when a plugin internal state is updated.
 *
 * @callback client.PluginManager~onStateChangeCallback
 * @param {object<client.Plugin#id, client.Plugin>} fullState - List of all plugins.
 * @param {client.Plugin|null} initiator - Plugin that initiated the update or `null`
 *  if the change was initiated by the state manager (i.e. when the initialization
 *  of the plugins starts).
 */

/**
 * Delete the registered {@link client.PluginManager~onStateChangeCallback}.
 *
 * @callback client.PluginManager~deleteOnStateChangeCallback
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
 * See {@link client.Client#pluginManager}
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
 * @memberof client
 * @extends BasePluginManager
 * @inheritdoc
 * @hideconstructor
 */
class PluginManager extends BasePluginManager {
  /**
   * @param {client.Client} client - The soundworks client instance.
   */
  constructor(client) {
    if (!(client instanceof Client)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "new PluginManager(client)" should receive an instance of "soundworks.Client" as argument`);
    }

    super(client);
  }

  register(id, factory, options = {}, deps = []) {
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
   * used before `client.init()` (or `client.start()`).
   *
   * To handle the remaining 0.01% cases and access plugin instances during their
   * initialization (e.g. to display initialization screen, etc.), you should rely
   * on the `onStateChange` method.
   *
   * _Note: the async API is designed to enable the dynamic creation of plugins
   * (hopefully without brealing changes) in a future release._
   *
   * @param {client.Plugin#id} id - Id of the plugin as defined when registered.
   * @returns {client.Plugin}
   * @see {@link client.PluginManager#onStateChange}
   *
   * @private
   */
  async get(id) {
    if (this.status !== 'started') {
      throw new Error(`[soundworks.PluginManager] Cannot get plugin before "client.init()"`);
    }

    return super.unsafeGet(id);
  }
}

export default PluginManager;
