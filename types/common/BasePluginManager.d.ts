export const kPluginManagerStart: unique symbol;
export const kPluginManagerStop: unique symbol;
export const kPluginManagerInstances: unique symbol;
export default BasePluginManager;
/**
 * Callback executed when a plugin internal state is updated.
 */
export type pluginManagerOnStateChangeCallback = (: object, initiator: ClientPlugin | ServerPlugin | null) => any;
/**
 * Delete the registered {@link pluginManagerOnStateChangeCallback }.
 */
export type pluginManagerDeleteOnStateChangeCallback = () => any;
/**
 * Callback executed when a plugin internal state is updated.
 *
 * @callback pluginManagerOnStateChangeCallback
 * @param {object<string, ClientPlugin|ServerPlugin>} fullState - List of all plugins.
 * @param {ClientPlugin|ServerPlugin|null} initiator - Plugin that initiated the
 *  update. The value is `null` if the change was initiated by the state manager
 *  (e.g. when the initialization of the plugins starts).
 */
/**
 * Delete the registered {@link pluginManagerOnStateChangeCallback}.
 *
 * @callback pluginManagerDeleteOnStateChangeCallback
 */
/** @private */
declare class BasePluginManager {
    constructor(node: any);
    /**
     * Status of the plugin manager
     *
     * @type {'idle'|'inited'|'started'|'errored'}
     */
    get status(): "idle" | "inited" | "started" | "errored";
    /**
     * Alias for existing plugins (i.e. plugin-scriptin), remove once updated
     * @private
     */
    private unsafeGet;
    /**
     * Retrieve an fully started instance of a registered plugin without checking
     * that the pluginManager is started.
     *
     * This method is required for starting the plugin manager itself and to require
     * a plugin from within another plugin.
     *
     * _Warning: Unless you are developing your own plugins, you should not have to use
     * this method_
     */
    getUnsafe(id: any): Promise<any>;
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
     * @param {Function} ctor - The class returned by the plugin factory method.
     * @param {object} [options={}] - Options to configure the plugin.
     * @param {array} [deps=[]] - List of plugins' names the plugin depends on, i.e.
     *  the plugin initialization will begin only after the plugins it depends on are
     *  fully started themselves.
     * @see {@link ClientPluginManager#register}
     * @see {@link ServerPluginManager#register}
     * @example
     * // client-side
     * client.pluginManager.register('user-defined-id', pluginFactory);
     * // server-side
     * server.pluginManager.register('user-defined-id', pluginFactory);
     */
    register(id: string, ctor: Function, options?: object, deps?: any[]): void;
    /**
     * Manually add a dependency to a given plugin.
     *
     * Usefull to require a plugin within a plugin
     */
    addDependency(pluginId: any, dependencyId: any): void;
    /**
     * Returns the list of the registered plugins ids
     * @returns {string[]}
     */
    getRegisteredPlugins(): string[];
    /**
     * Propagate a notification each time a plugin is updated (status or inner state).
     * The callback will receive the list of all plugins as first parameter, and the
     * plugin instance that initiated the state change event as second parameter.
     *
     * _In most cases, you should not have to rely on this method._
     *
     * @param {pluginManagerOnStateChangeCallback} callback - Callback to execute on state change
     * @returns {pluginManagerDeleteOnStateChangeCallback} - Clear the subscription when executed
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
    onStateChange(callback: pluginManagerOnStateChangeCallback): pluginManagerDeleteOnStateChangeCallback;
    /**
     * Initialize all registered plugins.
     *
     * Executed during the `Client.init()` or `Server.init()` initialization step.
     *
     * @private
     */
    private [kPluginManagerStart];
    /** @private */
    private [kPluginManagerStop];
    /** #private */
    [kPluginManagerInstances]: Map<any, any>;
    #private;
}
