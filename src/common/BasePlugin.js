import merge from 'lodash.merge';

class BasePlugin {
  /**
   * @param {string} id - User-defined id of the plugin.
   */
  constructor(id) {
    /**
     * User defined Id of the plugin.
     *
     * @type {string}
     */
    this.id = id;

    /**
     * Type of the plugin, i.e. the ClassName.
     *
     * Usefull to do something based on certain types of plugins while not
     * knowing under which id they have been registered. (e.g. view for platform)
     *
     * @type {string}
     * @readonly
     */
    this.type = this.constructor.name;

    /**
     * Options of the plugin.
     *
     * @type {object}
     */
    this.options = {};

    /**
     * Internal local state of the plugin.
     *
     * @type {object}
     * @see {@link BasePlugin.onStateChange}
     * @see {@link BasePlugin.propagateStateChange}
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
   * Start the plugin. This method is automatically called during the
   * `pluginManager.start()` which is itself called during the `init` lifecyle step.
   * After this point the plugin should be ready to use.
   *
   * @example
   * class MyDummyPlugin extends Plugin {
   *   async start() {
   *     this.sharedState = await this.server.stateManager.create(`s:${this.id}`);
   *     await new Promise(resolve => setTimeout(resolve, 1000));
   *   }
   *
   *   async stop() {
   *     await this.sharedState.delete();
   *   }
   * }
   */
  async start() {}

  /**
   * Start the plugin. This method is automatically called during the
   * `pluginManager.start()` which is itself called during the `init` lifecyle step.
   *
   * @example
   * class MyDummyPlugin extends Plugin {
   *   async start() {
   *     this.sharedState = await this.server.stateManager.create(`s:${this.id}`);
   *     await new Promise(resolve => setTimeout(resolve, 1000));
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
   * @param {Function} callback - Function to be executed when a state change is
   *  propagated. The callback receives the plugin state as first argument.
   * @returns {Function} - Remove the listener from the callback list when executed.
   * @see {@link BasePlugin.propagateStateChange}
   * @see {@link server.StateManaget#onStateChange}
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
   * Apply updates to the plugin {@link server.Plugin#state} and propagate the
   * updated state to the listeners. The state changes will also be propagated
   * to the {@link server.StateManaget#onStateChange} listeners.
   *
   * @param {object} updates - Updates to be merged in the plugin state.
   * @see {@link BasePlugin.onStateChange}
   * @see {@link server.StateManaget#onStateChange}
   */
  propagateStateChange(updates) {
    merge(this.state, updates);
    this._onStateChangeCallbacks.forEach(callback => callback(this.state));
  }
}

export default BasePlugin;
