import merge from 'lodash.merge';

/**
 * @private
 */
class BasePlugin {
  constructor(id) {
    /** @private */
    this._id = id;
    /** @private */
    this._type = this.constructor.name;

    /**
     * Options of the plugin.
     *
     * @type {object}
     */
    this.options = {};

    /**
     * Placeholder that stores internal (local) state of the plugin. The state
     * should be modified through the `propagateStateChange` method to ensure
     * the change to be properly propagated to `onStateChange` callbacks.
     *
     * @type {object}
     * @protected
     * @see {@link client.Plugin#onStateChange}
     * @see {@link server.Plugin#onStateChange}
     * @see {@link client.Plugin#propagateStateChange}
     * @see {@link server.Plugin#propagateStateChange}
     */
    this.state = {};

    /**
     * Current status of the plugin, i.e. 'idle', 'inited', 'started', 'errored'
     *
     * @type {string}
     */
    this.status = 'idle';

    /** @private */
    this._onStateChangeCallbacks = new Set();
  }

  /**
   * User defined ID of the plugin.
   *
   * @type {string}
   * @readonly
   * @see {@link client.PluginManager#register}
   * @see {@link server.PluginManager#register}
   */
  get id() {
    return this._id;
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
    return this._type;
  }

  /**
   * Start the plugin. This method is automatically called during the client or
   * server `init()` lifecyle step. After `start()` is fulfilled the plugin should
   * be ready to use.
   *
   * @example
   * // server-side couterpart of a plugin that creates a dedicated global shared
   * // state on which the server-side part can attach.
   * class MyPlugin extends Plugin {
   *   constructor(server, id) {
   *     super(server, id);
   *
   *     this.server.stateManager.registerSchema(`my-plugin:${this.id}`, {
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
   * Stop the plugin. This method is automatically called during the client or server
   * `stop()` lifecyle step.
   *
   * @example
   * // server-side couterpart of a plugin that creates a dedicated global shared
   * // state on which the server-side part can attach.
   * class MyPlugin extends Plugin {
   *   constructor(server, id) {
   *     super(server, id);
   *
   *     this.server.stateManager.registerSchema(`my-plugin:${this.id}`, {
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
   * @param {client.Plugin~onStateChangeCallback|server.Plugin~onStateChangeCallback} callback -
   *  Callback to execute when a state change is propagated.
   * @returns {client.Plugin~deleteOnStateChangeCallback|server.Plugin~deleteOnStateChangeCallback}
   *  Execute the function to delete the listener from the callback list.
   * @see {@link client.Plugin#propagateStateChange}
   * @see {@link server.Plugin#propagateStateChange}
   * @example
   * const unsubscribe = plugin.onStateChange(pluginState => console.log(pluginState));
   * // stop listening state changes
   * unsubscribe();
   */
  onStateChange(callback) {
    this._onStateChangeCallbacks.add(callback);
    return () => this._onStateChangeCallbacks.delete(callback);
  }

  /**
   * Apply updates to the plugin state and propagate the updated state to the
   * `onStateChange` listeners. The state changes will also be propagated
   * through the `PluginManager#onStateChange` listeners.
   *
   * @param {object} updates - Updates to be merged in the plugin state.
   * @see {@link client.Plugin#onStateChange}
   * @see {@link server.Plugin#onStateChange}
   * @see {@link client.PluginManager#onStateChange}
   * @see {@link server.PluginManager#onStateChange}
   */
  propagateStateChange(updates) {
    merge(this.state, updates);
    this._onStateChangeCallbacks.forEach(callback => callback(this.state));
  }
}

export default BasePlugin;
