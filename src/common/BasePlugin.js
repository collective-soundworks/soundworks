import merge from 'lodash/merge.js';

export const kBasePluginStatus = Symbol('soundworks:base-plugin-status');

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
class BasePlugin {
  #id = null;
  #onStateChangeCallbacks = new Set();

  constructor(id) {
    this.#id = id;
    /** @private */
    this[kBasePluginStatus] = 'idle';

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
    this.state = {};
  }

  /**
   * User defined ID of the plugin.
   *
   * @type {string}
   * @readonly
   * @see {@link ClientPluginManager#register}
   * @see {@link ServerPluginManager#register}
   */
  get id() {
    return this.#id;
  }

  /**
   * Type of the plugin, i.e. the ClassName.
   *
   * Usefull to do perform some logic based on certain types of plugins without
   * knowing under which `id` they have been registered. (e.g. creating some generic
   * views, etc.)
   *
   * @type {string}
   * @readonly
   */
  get type() {
    return this.constructor.name;
  }

  /**
   * Current status of the plugin.
   *
   * @type {'idle'|'inited'|'started'|'errored'}
   */
  get status() {
    return this[kBasePluginStatus];
  }

  /**
   * Start the plugin.
   *
   * This method is automatically called during the client or server `init()` lifecyle
   * step. After `start()` is fulfilled the plugin should be ready to use.
   *
   * @example
   * // server-side couterpart of a plugin that creates a dedicated global shared
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
  async start() {}

  /**
   * Stop the plugin.
   *
   * This method is automatically called during the client or server `stop()` lifecyle step.
   *
   * @example
   * // server-side couterpart of a plugin that creates a dedicated global shared
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
  async stop() {}

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
  onStateChange(callback) {
    this.#onStateChangeCallbacks.add(callback);
    return () => this.#onStateChangeCallbacks.delete(callback);
  }

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
  propagateStateChange(updates) {
    merge(this.state, updates);
    this.#onStateChangeCallbacks.forEach(callback => callback(this.state));
  }
}

export default BasePlugin;
