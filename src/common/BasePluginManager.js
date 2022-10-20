import isPlainObject from 'is-plain-obj';

import logger from './logger.js';
import { isString } from './utils.js';

/**
 * Shared functionnality between server-side and client-size plugin manager
 */
class BasePluginManager {
  constructor(node) {
    /**
     * @private
     * node may be either a soundworks server or a soundworks client
     */
    this._node = node;
    /** @private */
    this._registeredPlugins = new Map();
    /** @private */
    this._instances = new Map();
    /** @private */
    this._instanceStartPromises = new Map();
    /** @private */
    this._stateChangeObservers = new Set();

    this.status = 'idle';
  }

  /**
   * Register a plugin into soundworks.
   *
   * _A plugin must be registered both client-side and server-side_
   * @see {@link client.PluginManager#register}
   *
   * @param {String} id - Unique id of the plugin, allow to register the same
   *  plugin factory under different ids.
   * @param {Function} factory - Factory function that return the plugin class
   * @param {Object} options - Options to configure the plugin
   * @param {Array} deps - List of plugins' names the plugin depends on
   *
   * @example
   * ```js
   * // client-side
   * client.pluginManager.register('user-defined-name', pluginFactory);
   * // server-side
   * server.pluginManager.register('user-defined-name', pluginFactory);
   * ```
   */
  register(id, ctor, options = {}, deps = []) {
    // For now we don't allow to register a plugin after `client|server.init()`.
    // This is subject to change in the future as we may want to dynamically
    // register new plugins during application lifetime.
    if (this._node.status === 'inited') {
      throw new Error(`[soundworks.PluginManager] Cannot register plugin (${id}) after "client.init()"`);
    }

    if (!isString(id)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "pluginManager.register" first argument should be a string`);
    }

    if (!isPlainObject(options)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "pluginManager.register" third optionnal argument should be an object`);
    }

    if (!Array.isArray(deps)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "pluginManager.register" fourth optionnal argument should be an array`);
    }

    if (this._registeredPlugins.has(id)) {
      throw new Error(`[soundworks:PluginManager] Plugin "${id}" of type "${ctor.name}" already registered`);
    }

    this._registeredPlugins.set(id, { ctor, options, deps });
  }

  /**
   * Initialize all the registered plugin. Called during `Client.init()` or `Server.init()`
   * @private
   */
  async start() {
    logger.title('starting registered plugins');

    if (this.status !== 'idle') {
      throw new Error(`[soundworks:PluginManager] Cannot call "pluginManager.init()" twice`);
    }

    this.status = 'inited';
    // instanciate all plugins
    for (let [id, { ctor, options }] of this._registeredPlugins.entries()) {
      const instance = new ctor(this._node, id, options);
      this._instances.set(id, instance);
    }

    // propagate all 'idle' statuses before start
    this._propagateStateChange();

    const promises = Array.from(this._registeredPlugins.keys()).map(id => this.get(id));

    await Promise.all(promises);

    this.status = 'started';
  }

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
  async get(id) {
    if (!isString(id)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "pluginManager.get(name)" argument should be a string`);
    }

    if (!this._registeredPlugins.has(id)) {
      throw new Error(`[soundworks:PluginManager] Cannot get plugin "${id}", plugin is not registered`);
    }

    // @note - For now, all instances are created at the beginning of `start()`
    // to be able to properly propagate the states. the code bellow should allow
    // to dynamically register and launch plugins at runtime, but this is
    // forbidden for now.
    //
    // if (!this._instances.has(id)) {
    //   const { ctor, options } = this._registeredPlugins.get(id);
    //   const instance = new ctor(this._node, id, options);
    //   this._instances.set(id, instance);
    // }

    const instance = this._instances.get(id);

    // recursively get the dependency chain
    const { deps } = this._registeredPlugins.get(id);
    const promises = deps.map(id => this.get(id));

    await Promise.all(promises);

    // 'plugin.start' has already been called, just await the start promise
    if (this._instanceStartPromises.has(id)) {
      await this._instanceStartPromises.get(id);
    } else {
      this._propagateStateChange(instance, 'inited');
      let errored = false;

      try {
        const startPromise = instance.start();
        this._instanceStartPromises.set(id, startPromise);

        await startPromise;
      } catch(err) {
        errored = true;
        this._propagateStateChange(instance, 'errored');
        throw new Error(err);
      }

      // this looks silly but it prevents the try / catch to catch errors that could
      // be triggered by the propagate status callback, putting the plugin in errored state
      if (!errored) {
        this._propagateStateChange(instance, 'started');
      }
    }

    return instance;
  }

  /**
   * Propagate a notification each time a plugin is updated (status or inner state)
   */
  onStateChange(observer) {
    this._stateChangeObservers.add(observer);
    return () => this._stateChangeObservers.delete(observer);
  }

  /** @private */
  _propagateStateChange(instance = null, status = null) {
    if (instance != null && status != null) {
      instance.status = status;

      const fullState = Object.fromEntries(this._instances);
      this._stateChangeObservers.forEach(observer => observer(fullState, instance));
    } else {
      const fullState = Object.fromEntries(this._instances);
      this._stateChangeObservers.forEach(observer => observer(fullState, null));
    }
  }
}

export default BasePluginManager;
