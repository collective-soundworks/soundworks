import Server from './Server.js';
import BasePluginManager, {
  kPluginManagerInstances,
} from '../common/BasePluginManager.js';
import { kServerPluginName } from './ServerPlugin.js';

export const kServerPluginManagerCheckRegisteredPlugins = Symbol('soundworks:server-plugin-manager-check-registered-plugins');
export const kServerPluginManagerAddClient = Symbol('soundworks:server-plugin-manager-add-client');
export const kServerPluginManagerRemoveClient = Symbol('soundworks:server-plugin-manager-remove-client');

/**
 * The `PluginManager` allows to register and retrieve `soundworks` plugins.
 *
 * Plugins should always be registered both client-side and server-side,
 * and before {@link Client#start} or {@link Server#start}
 * to be properly initialized.
 *
 * In some situations, you might want to register the same plugin factory several times
 * using different ids (e.g. for watching several parts of the file system, etc.).
 *
 * Refer to the plugins' documentation for more precise examples, and the specific API
 * they expose. See [https://soundworks.dev/guide/ecosystem](https://soundworks.dev/guide/ecosystem)
 * for more information on the available plugins.
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
 * @template T
 */
class ServerPluginManager extends BasePluginManager {
  /** @hideconstructor */
  constructor(server) {
    if (!(server instanceof Server)) {
      throw new TypeError(`Cannot construct 'ServerPluginManager': Argument 1 must be an instance of Server`);
    }

    super(server);
  }

  /** @private */
  [kServerPluginManagerCheckRegisteredPlugins](registeredPlugins) {
    let missingPlugins = [];

    for (let id of registeredPlugins) {
      if (!this[kPluginManagerInstances].has(id)) {
        missingPlugins.push(id);
      }
    }

    if (missingPlugins.length > 0) {
      throw new DOMException(`Invalid 'ServerPluginManager' internal state: The following plugins registered on the client-side: [${missingPlugins.join(', ')}] have not been registered on the server-side. Plugins registered on the server-side are: [${Array.from(this[kPluginManagerInstances].keys()).join(', ')}].`, 'InvalidStateError');
    }
  }

  /** @private */
  async [kServerPluginManagerAddClient](client, registeredPlugins = []) {
    let promises = [];

    for (let pluginName of registeredPlugins) {
      const plugin = await this.get(pluginName);
      const promise = plugin.addClient(client);
      promises.push(promise);
    }

    await Promise.all(promises);
  }

  /** @private */
  async [kServerPluginManagerRemoveClient](client) {
    let promises = [];

    for (let plugin of this[kPluginManagerInstances].values()) {
      if (plugin.clients.has(client)) {
        promises.push(plugin.removeClient(client));
      }
    }

    await Promise.all(promises);
  }

  /**
   * Register a plugin into the manager.
   *
   * _A plugin must always be registered both on client-side and on server-side_
   *
   * Refer to the plugin documentation to check its options and proper way of
   * registering it.
   *
   * @param {string} id - Unique id of the plugin. Enables the registration of the
   *  same plugin factory under different ids.
   * @param {T<ServerPlugin>} ctor - The server-side Class of the plugin.
   * @param {object} [options={}] - Options to configure the plugin.
   * @param {array} [deps=[]] - List of plugins' names the plugin depends on, i.e.
   *  the plugin initialization will start only after the plugins it depends on are
   *  fully started themselves.
   * @see {@link ClientPluginManager#register}
   * @see {@link ServerPluginManager#register}
   * @example
   * // client-side
   * client.pluginManager.register('user-defined-id', pluginFactory);
   * // server-side
   * server.pluginManager.register('user-defined-id', pluginFactory);
   */
  register(id, ctor, options = {}, deps = []) {
    // Note that other arguments are checked on the BasePluginManager
    if (!ctor || ctor[kServerPluginName] !== 'ServerPlugin') {
      throw new TypeError(`Cannot execute 'register' on ServerPluginManager (id: ${id}): argument 2 must be a class that extends 'ServerPlugin'`);
    }

    super.register(id, ctor, options, deps);
  }

  /**
   * Retrieve a fully started instance of a registered plugin.
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
   * (hopefully without breaking changes) in a future release._
   *
   * @param {ServerPlugin#id} id - Id of the plugin as defined when registered.
   * @returns {Promise<T<ServerPlugin>>}
   */
  async get(id) {
    if (this.status !== 'started') {
      throw new DOMException(`Cannot execute 'get' on ServerPluginManager: 'Server#init' has not been called yet`, 'NotSupportedError');
    }

    return super.getUnsafe(id);
  }
}

export default ServerPluginManager;
