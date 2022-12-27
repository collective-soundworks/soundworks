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
 * are called for proper initialization.
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
 * import { Client } from '@soundworks/core/client.js';
 * import platformPlugin from '@soundworks/plugin-sync/client.js';
 *
 * const client = new Client(config);
 * // register the plugin before `client.start()`
 * client.pluginManager.register('sync', pluginSync);
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
      throw new Error(`[soundworks.PluginManager] Invalid argument, "new PluginManager(client)" should receive an instance of "soundworks.Client as argument"`);
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

  // client only methods
  // ------------------------------------------------------------

  /**
   * @protected
   * @ignore
   */
  getRegisteredPlugins() {
    return Array.from(this._registeredPlugins.keys());
  }
}

export default PluginManager;
