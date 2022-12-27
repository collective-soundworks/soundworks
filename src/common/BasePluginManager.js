import isPlainObject from 'is-plain-obj';

import logger from './logger.js';
import { isString } from './utils.js';

/**
 * Shared functionnality between server-side and client-size plugin manager
 *
 * @private
 */
class BasePluginManager {
  constructor(node) {
    // node may be either a soundworks server or a soundworks client
    /** @private */
    this._node = node;
    /** @private */
    this._registeredPlugins = new Map();
    /** @private */
    this._instances = new Map();
    /** @private */
    this._instanceStartPromises = new Map();
    /** @private */
    this._onStateChangeCallbacks = new Set();

    this.status = 'idle';
  }

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
   * Initialize all the registered plugin. Executed during the `Client.init()` or
   * `Server.init()` initialization step.
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
      instance.onStateChange(_values => this._propagateStateChange(instance));
    }

    // propagate all 'idle' statuses before start
    this._propagateStateChange();

    const promises = Array.from(this._registeredPlugins.keys()).map(id => this.get(id));
    await Promise.all(promises);

    this.status = 'started';
  }

  async stop() {
    for (let instance of this._instances.values()) {
      await instance.stop();
    }
  }

  /**
   * Retrieve an fully started instance of a registered plugin.
   *
   * Be aware that the `get` method resolves only when the plugin is fully 'started',
   * which is what we want 99.99% of the time. As such this method should NEVER be
   * used before `client|server.init()` (or `client|server.start()`), in which case
   * your application would be stuck in some kind of Promise dead lock.
   *
   * To handle the remaining 0.01% cases and access plugin instances during their
   * initialization (e.g. to display initialization screen, etc.), you should rely
   * on the `onStateChange` method.
   *
   * _Note: the API is designed to enable the dynamic creation of plugins (hopefully
   * without brealing changes) in a future release._
   *
   * @param {client.Plugin#id|client.Plugin#id} id - Id of the plugin as defined when registered.
   * @returns {client.Plugin|server.Plugin}
   * @see {@link client.PluginManager#onStateChange}
   * @see {@link server.PluginManager#onStateChange}
   */
  async get(id) {
    if (!isString(id)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "pluginManager.get(name)" argument should be a string`);
    }

    if (!this._registeredPlugins.has(id)) {
      throw new Error(`[soundworks:PluginManager] Cannot get plugin "${id}", plugin is not registered`);
    }

    // @note - For now, all instances are created at the beginning of `start()`
    // to be able to properly propagate the states. The code bellow should allow
    // to dynamically register and launch plugins at runtime.
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
        throw err;
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
  onStateChange(callback) {
    this._onStateChangeCallbacks.add(callback);
    return () => this._onStateChangeCallbacks.delete(callback);
  }

  /** @private */
  _propagateStateChange(instance = null, status = null) {
    if (instance !== null) {
      // status is null if wew forward some inner state change from the instance
      if (status !== null) {
        instance.status = status;
      }

      const fullState = Object.fromEntries(this._instances);
      this._onStateChangeCallbacks.forEach(callback => callback(fullState, instance));
    } else {
      const fullState = Object.fromEntries(this._instances);
      this._onStateChangeCallbacks.forEach(callback => callback(fullState, null));
    }
  }
}

export default BasePluginManager;
