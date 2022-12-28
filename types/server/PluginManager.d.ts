export default PluginManager;
export namespace server {
    /**
     * ~onStateChangeCallback
     */
    type PluginManager = (: object, initiator: server.Plugin | null) => any;
}
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
 * are called for proper initialization.
 *
 * In some sitautions, you might want to register the same plugin factory several times
 * using different ids (e.g. for watching several parts of the file system, etc.).
 *
 * Refer to the plugins' documentation for more precise examples, and the specific API
 * they expose. See [https://soundworks.dev/guide/ecosystem](https://soundworks.dev/guide/ecosystem)
 * for more informations on the available plugins.
 *
 * ```
 * import { Server } from '@soundworks/core/server.js';
 * import platformPlugin from '@soundworks/plugin-sync/server.js';
 *
 * const server = new Server(config);
 * // register the plugin before `server.start()`
 * server.pluginManager.register('sync', pluginSync);
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
declare class PluginManager extends BasePluginManager {
    register(id: any, factory?: any, options?: {}, deps?: any[]): void;
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
     * _Note: the async API is designed to enable the dynamic creation of plugins (hopefully
     * without brealing changes) in a future release._
     *
     * @param {server.Plugin#id} id - Id of the plugin as defined when registered.
     * @returns {server.Plugin}
     * @see {@link server.PluginManager#onStateChange}
     *
     * @private
     */
    private get;
    /** private */
    checkRegisteredPlugins(registeredPlugins: any): void;
    /** @private */
    private addClient;
    /** @private */
    private removeClient;
}
import BasePluginManager from "../common/BasePluginManager.js";
//# sourceMappingURL=PluginManager.d.ts.map