import merge from 'lodash.merge';

class BasePlugin {
  constructor(id) {
    /**
     * Id of the plugin.
     * @type {String}
     */
    this.id = id;

    /**
     * Type of the plugin, i.e. the ClassName.
     *
     * Usefull to do something based on certain types of plugin while not
     * knowing under which id they have been registered. (e.g. view for platform)
     *
     * @type {String}
     * @readonly
     */
    this.type = this.constructor.name;

    /**
     * Options of the plugin.
     * @type {Object}
     */
    this.options = {};

    /**
     * Object containing internal local state of the plugin, use `propageStateChange`
     * to propagate the state and `onStateChange` to listen to state changes.
     * The state change will also be propagated to `StateManaget.onStateChange`
     * listeners
     * @type {Object}
     */
    this.state = {};

    /**
     * Current status of the plugin ('idle', 'inited', 'started', 'errored')
     * @type {String}
     */
    this.status = 'idle';

    /** @private */
    this._onStateChangeCallbacks = new Set();
  }

  /**
   * This method is called during the `pluginManager.start()` which is itself
   * called during `server.init()`. At this point the state manager is ready to use.
   *
   * @example
   * class MyDummyPlugin extends Plugin {
   *   async start() {
   *     this.state = await this.server.stateManager.create(`s:${this.id}`);
   *     await new Promise(resolve => setTimeout(resolve, 1000));
   *   }
   * }
   */
  async start() {}

  /**
   * @private
   *
   * This method is called during the `pluginManager.stop()` which is itself
   * called during `client.stop()`. Most of the time, you wont need to implement
   * this method.
   *
   * @example
   * class MyDummyPlugin extends Plugin {
   *   async start() {
   *     this.state = await this.server.stateManager.create(`s:${this.id}`);
   *     await new Promise(resolve => setTimeout(resolve, 1000));
   *   }
   * }
   */
  async stop() {}

  /**
   * @todo - documentation
   */
  onStateChange(callback) {
    this._onStateChangeCallbacks.add(callback);
    return () => this._onStateChangeCallbacks.delete(callback);
  }

  /**
   * @todo - documentation
   */
  propagateStateChange(updates) {
    merge(this.state, updates);
    this._onStateChangeCallbacks.forEach(callback => callback(this.state));
  }
}

export default BasePlugin;
