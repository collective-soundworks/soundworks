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
    private _stateChangeObservers;
    status: string;
    /**
     * Register a plugin into soundworks.
     *
     * _A plugin must always be registered both on client-side and on server-side_
     * @see {@link client.PluginManager#register}
     *
     * @param {String} id - Unique id of the plugin, allow to register the same
     *  plugin factory under different ids.
     * @param {Function} factory - Factory function that return the plugin class
     * @param {Object} [options={}] - Options to configure the plugin
     * @param {Array} [deps=[]] - List of plugins' names the plugin depends on, i.e.
     *  the plugin initialization will start only after the plugins it depends on are
     *  fully started themselves.
     *
     * @example
     * // client-side
     * client.pluginManager.register('user-defined-name', pluginFactory);
     * // server-side
     * server.pluginManager.register('user-defined-name', pluginFactory);
     */
    register(id: string, ctor: any, options?: any, deps?: any[]): void;
    /** @private */
    private start;
    stop(): Promise<void>;
    /**
     * Retrieve an fully started instance of a registered plugin.
     *
     * Be aware that the `get` method resolves when the plugin is fully 'started',
     * which is what we cant 99.9% of the time, as such this method should not be
     * used before `client|server.init()` is fullfilled. To access plugin instances
     * before this point, e.g. to display initialization screen, etc., you should
     * therefore rely on the `onStateChange` method.
     *
     * Note that this API is deisgned to enable dynamic creation of plugins in the
     * future, instanciating and starting (resolving its full chain of dependency
     * chain) if needed.
     *
     * @param {String} id - Id of the plugin as defined on registration
     */
    get(id: string): Promise<any>;
    /**
     * Propagate a notification each time a plugin is updated (status or inner state).
     * The callback will receive the list of all plugins as first parameter, and the
     * plugin instance that initiated the state change event as second parameter.
     */
    onStateChange(observer: any): () => boolean;
    /** @private */
    private _propagateStateChange;
}
//# sourceMappingURL=BasePluginManager.d.ts.map