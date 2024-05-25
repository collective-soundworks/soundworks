export default ClientPluginManager;
/**
 * The `PluginManager` allows to register and retrieve `soundworks` plugins.
 *
 * Plugins should always be registered both client-side and server-side,
 * and before {@link Client#start} or {@link Server#start}
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
declare class ClientPluginManager extends BasePluginManager {
    /**
     * @param {Client} client - The soundworks client instance.
     */
    constructor(client: Client);
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
     * @param {Function} factory - Factory function that returns the Plugin class.
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
    register(id: string, factory: Function, options?: object, deps?: any[]): void;
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
    get(id: string): Promise<ClientPlugin>;
}
import BasePluginManager from '../common/BasePluginManager.js';
import ClientPlugin from './ClientPlugin.js';
import Client from './Client.js';
