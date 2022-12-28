export default BasePluginManager;
/**
 * Shared functionnality between server-side and client-size plugin manager
 *
 * @private
 */
declare class BasePluginManager {
    constructor(node: any);
    /** @private */
    private _node;
    /** @private */
    private _registeredPlugins;
    /** @private */
    private _instances;
    /** @private */
    private _instanceStartPromises;
    /** @private */
    private _onStateChangeCallbacks;
    status: string;
    /**
     * Register a plugin into soundworks.
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
     * @see {@link client.PluginManager#register}
     * @see {@link server.PluginManager#register}
     * @example
     * // client-side
     * client.pluginManager.register('user-defined-id', pluginFactory);
     * // server-side
     * server.pluginManager.register('user-defined-id', pluginFactory);
     */
    register(id: string, ctor: any, options?: object, deps?: any[]): void;
    /**
     * Initialize all the registered plugin. Executed during the `Client.init()` or
     * `Server.init()` initialization step.
     * @private
     */
    private start;
    stop(): Promise<void>;
    /**
     * Retrieve an fully started instance of a registered plugin, without checking
     * that the pluginManager is started. This is important for starting the plugin
     * manager itself.
     *
     * @private
     */
    private getUnsafe;
    /**
     * Propagate a notification each time a plugin is updated (status or inner state).
     * The callback will receive the list of all plugins as first parameter, and the
     * plugin instance that initiated the state change event as second parameter.
     *
     * _In most cases, you should not have to rely on this method._
     *
     * @param {client.PluginManager~onStateChangeCallback|server.PluginManager~onStateChangeCallback} callback
     *  Callback to be executed on state change
     * @param {client.PluginManager~deleteOnStateChangeCallback|client.PluginManager~deleteOnStateChangeCallback}
     *  Function to execute to listening for changes.
     * @example
     * const unsubscribe = client.pluginManager.onStateChange(pluginList, initiator => {
     *   // log the current status of all plugins
     *   for (let name in pluginList) {
     *     console.log(name, pluginList[name].status);
     *   }
     *   // if the change was initiated by a plugin, log its status and state
     *   if (initiator !== null) {
     *.    console.log(initiator.name, initiator.status, initiator.state);
     *   }
     * });
     * // stop listening for updates later
     * unsubscribe();
     */
    onStateChange(callback: any): () => boolean;
    /** @private */
    private _propagateStateChange;
}
//# sourceMappingURL=BasePluginManager.d.ts.map