export const kBasePluginStatus: unique symbol;
export default BasePlugin;
/**
 * Callback executed when the plugin state is updated.
 */
export type pluginOnStateChangeCallback = (#state: BasePlugin) => any;
/**
 * Delete the registered {@link pluginOnStateChangeCallback}.
 */
export type pluginDeleteOnStateChangeCallback = () => any;
/**
 * Callback executed when the plugin state is updated.
 *
 * @callback pluginOnStateChangeCallback
 * @param {BasePlugin#state} state - Current state of the plugin.
 */
/**
 * Delete the registered {@link pluginOnStateChangeCallback}.
 *
 * @callback pluginDeleteOnStateChangeCallback
 */
/** @private */
declare class BasePlugin {
    constructor(id: any);
    /**
     * Placeholder that stores internal (local) state of the plugin. The state
     * should be modified through the `propagateStateChange` method to ensure
     * the change to be properly propagated to manager `onStateChange` callbacks.
     *
     * @type {object}
     * @protected
     * @see {@link ClientPlugin#onStateChange}
     * @see {@link ServerPlugin#onStateChange}
     * @see {@link ClientPlugin#propagateStateChange}
     * @see {@link ServerPlugin#propagateStateChange}
     */
    protected state: object;
    /**
     * User defined ID of the plugin.
     *
     * @type {string}
     * @readonly
     * @see {@link ClientPluginManager#register}
     * @see {@link ServerPluginManager#register}
     */
    readonly get id(): string;
    /**
     * Type of the plugin, i.e. the ClassName.
     *
     * Useful to do perform some logic based on certain types of plugins without
     * knowing under which `id` they have been registered. (e.g. creating some generic
     * views, etc.)
     *
     * @type {string}
     * @readonly
     */
    readonly get type(): string;
    /**
     * Current status of the plugin.
     *
     * @type {'idle'|'inited'|'started'|'errored'}
     */
    get status(): "idle" | "inited" | "started" | "errored";
    /**
     * Start the plugin.
     *
     * This method is automatically called during the client or server `init()` lifecycle
     * step. After `start()` is fulfilled the plugin should be ready to use.
     *
     * @example
     * // server-side counterpart of a plugin that creates a dedicated global shared
     * // state on which the server-side part can attach.
     * class MyPlugin extends ServerPlugin {
     *   constructor(server, id) {
     *     super(server, id);
     *
     *     this.server.stateManager.defineClass(`my-plugin:${this.id}`, {
     *       someParam: {
     *         type: 'boolean',
     *         default: false,
     *       },
     *       // ...
     *     });
     *   }
     *
     *   async start() {
     *     await super.start()
     *     this.sharedState = await this.server.stateManager.create(`my-plugin:${this.id}`);
     *   }
     *
     *   async stop() {
     *     await this.sharedState.delete();
     *   }
     * }
     */
    start(): Promise<void>;
    /**
     * Stop the plugin.
     *
     * This method is automatically called during the client or server `stop()` lifecycle step.
     *
     * @example
     * // server-side counterpart of a plugin that creates a dedicated global shared
     * // state on which the client-side part can attach.
     * class MyPlugin extends ServerPlugin {
     *   constructor(server, id) {
     *     super(server, id);
     *
     *     this.server.stateManager.defineClass(`my-plugin:${this.id}`, {
     *       someParam: {
     *         type: 'boolean',
     *         default: false,
     *       },
     *       // ...
     *     });
     *   }
     *
     *   async start() {
     *     await super.start()
     *     this.sharedState = await this.server.stateManager.create(`my-plugin:${this.id}`);
     *     this.sharedState.onUpdate(updates => this.doSomething(updates));
     *   }
     *
     *   async stop() {
     *     await this.sharedState.delete();
     *   }
     * }
     */
    stop(): Promise<void>;
    /**
     * Listen to the state changes propagated by {@link BasePlugin.propagateStateChange}
     *
     * @param {pluginOnStateChangeCallback} callback - Callback to execute when a state change is propagated.
     * @returns {pluginDeleteOnStateChangeCallback}
     *
     * @example
     * const unsubscribe = plugin.onStateChange(pluginState => console.log(pluginState));
     * // stop listening state changes
     * unsubscribe();
     */
    onStateChange(callback: pluginOnStateChangeCallback): pluginDeleteOnStateChangeCallback;
    /**
     * Apply updates to the plugin state and propagate the updated state to the
     * `onStateChange` listeners. The state changes will also be propagated
     * through the `PluginManager#onStateChange` listeners.
     *
     * @param {object} updates - Updates to be merged in the plugin state.
     *
     * @see {@link BasePlugin#onStateChange}
     * @see {@link BasePluginManager#onStateChange}
     */
    propagateStateChange(updates: object): void;
    /** @private */
    private [kBasePluginStatus];
    #private;
}
//# sourceMappingURL=BasePlugin.d.ts.map