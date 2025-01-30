import { isPlainObject, isString } from '@ircam/sc-utils';

import {
  kBasePluginStatus,
} from './BasePlugin.js';

import logger from './logger.js';

export const kPluginManagerStart = Symbol('soundworks:plugin-manager-start');
export const kPluginManagerStop = Symbol('soundworks:plugin-manager-stop');
export const kPluginManagerInstances = Symbol('soundworks:plugin-manager-instances');

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
class BasePluginManager {
  // node may be either the server or a client
  #node = null;
  #status = 'idle';
  #dependencies = new Map();
  #instanceStartPromises = new Map();
  #onStateChangeCallbacks = new Set();

  constructor(node) {
    this.#node = node;
    /** @private */
    this[kPluginManagerInstances] = new Map();
  }

  #propagateStateChange(instance = null, status = null) {
    if (instance !== null) {
      // status is null if we forward some inner state change from the instance
      if (status !== null) {
        instance[kBasePluginStatus] = status;
      }

      const fullState = Object.fromEntries(this[kPluginManagerInstances]);
      this.#onStateChangeCallbacks.forEach(callback => callback(fullState, instance));
    } else {
      const fullState = Object.fromEntries(this[kPluginManagerInstances]);
      this.#onStateChangeCallbacks.forEach(callback => callback(fullState, null));
    }
  }

  /**
   * Initialize all registered plugins.
   *
   * Executed during the {@link Client#init} or {@link Client#stop} initialization step.
   *
   * @private
   */
  async [kPluginManagerStart]() {
    logger.title('starting registered plugins');

    if (this.#status !== 'idle') {
      throw new DOMException(`Cannot execute 'kPluginManagerStart' on BasePluginManager: Lifecycle methods must be called in following order: kPluginManagerStart, kPluginManagerStop`, 'InvalidAccessError');
    }

    this.#status = 'inited';
    // instantiate all plugins
    for (let instance of this[kPluginManagerInstances].values()) {
      instance.onStateChange(() => this.#propagateStateChange(instance, null));
    }

    // propagate all 'idle' status before start
    this.#propagateStateChange(null, null);

    const promises = Array.from(this[kPluginManagerInstances].keys()).map(id => this.getUnsafe(id));

    try {
      await Promise.all(promises);
      this.#status = 'started';
    } catch (err) {
      this.#status = 'errored';
      throw err; // throw initial error
    }
  }

  /** @private */
  async [kPluginManagerStop]() {
    if (this.#status !== 'started') {
      throw new DOMException(`Cannot execute 'kPluginManagerStop' on BasePluginManager: Lifecycle methods must be called in following order: kPluginManagerStart, kPluginManagerStop`, 'InvalidAccessError');
    }

    for (let instance of this[kPluginManagerInstances].values()) {
      await instance.stop();
    }
  }

  /**
   * Status of the plugin manager
   *
   * @type {'idle'|'inited'|'started'|'errored'}
   */
  get status() {
    return this.#status;
  }

  /**
   * Alias for existing plugins (i.e. plugin-scripting), remove once updated
   * @private
   * @deprecated
   */
  async unsafeGet(id) {
    return this.getUnsafe(id);
  }

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
  async getUnsafe(id) {
    if (!isString(id)) {
      throw new TypeError(`Cannot execute 'get' on BasePluginManager: Argument 1 must be of type string`);
    }

    if (!this[kPluginManagerInstances].has(id)) {
      throw new ReferenceError(`Cannot execute 'get' on BasePluginManager: Plugin '${id}' is not registered`);
    }

    // @note - For now, all instances are created at the beginning of `start()`
    // to be able to properly propagate the states. The code bellow should allow
    // to dynamically register and launch plugins at runtime.
    //
    // if (!this[kPluginManagerInstances].has(id)) {
    //   const { ctor, options } = this.#dependencies.get(id);
    //   const instance = new ctor(this.#node, id, options);
    //   this[kPluginManagerInstances].set(id, instance);
    // }

    const instance = this[kPluginManagerInstances].get(id);

    // recursively get the dependency chain
    const deps = this.#dependencies.get(id);
    const promises = deps.map(id => this.getUnsafe(id));

    await Promise.all(promises);

    // 'plugin.start' has already been called, just await the start promise
    if (this.#instanceStartPromises.has(id)) {
      await this.#instanceStartPromises.get(id);
    } else {
      this.#propagateStateChange(instance, 'inited');
      let errored = false;

      try {
        const startPromise = instance.start();
        this.#instanceStartPromises.set(id, startPromise);

        await startPromise;
      } catch (err) {
        errored = true;
        this.#propagateStateChange(instance, 'errored');
        throw err;
      }

      // this looks silly but it prevents the try / catch to catch errors that could
      // be triggered by the propagate status callback, putting the plugin in errored state
      if (!errored) {
        this.#propagateStateChange(instance, 'started');
      }
    }

    return instance;
  }

  /**
   * Register a plugin into the manager.
   *
   * _A plugin must always be registered both on client-side and on server-side_
   *
   * Plugins must be registered between the instantiation of {@link Client} and {@link Server},
   * and their respective initialization, i.e.:
   *
   * ```js
   * const client = new Client(config);
   * client.pluginManager.register('my-plugin', plugin);
   * await client.start();
   * ```
   *
   * Refer to the plugins documentation to check their configuration options and API.
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
  register(id, ctor, options = {}, deps = []) {
    // For now we don't allow to register a plugin after `client|server.init()`.
    // This is subject to change in the future as we may want to dynamically
    // register new plugins during application lifetime.
    if (this.#node.status === 'inited') {
      throw new DOMException(`Cannot execute 'register' on BasePluginManager: Host (client or server) has already been initialized`, 'InvalidAccessError');
    }

    if (!isString(id)) {
      throw new TypeError(`Cannot execute 'register' on BasePluginManager: Argument 1 must be a string`);
    }

    if (!isPlainObject(options)) {
      throw new TypeError(`Cannot execute 'register' on BasePluginManager: Argument 3 must be an object`);
    }

    if (!Array.isArray(deps)) {
      throw new TypeError(`Cannot execute 'register' on BasePluginManager: Argument 3 must be an array`);
    }

    if (this[kPluginManagerInstances].has(id)) {
      throw new DOMException(`Cannot execute 'register' on BasePluginManager: A plugin with same id (${id}) has already registered`, 'NotSupportedError');
    }

    // We instantiate the plugin here, so that a plugin can register another one
    // in its own constructor.
    //
    // The dependencies must be created first, so that the instance can call
    // addDependency in its constructor
    this.#dependencies.set(id, deps);

    const instance = new ctor(this.#node, id, options);
    this[kPluginManagerInstances].set(id, instance);
  }

  /**
   * Manually add a dependency to a given plugin.
   *
   * Useful to require a plugin within a plugin
   */
  addDependency(pluginId, dependencyId) {
    const deps = this.#dependencies.get(pluginId);
    deps.push(dependencyId);
  }

  /**
   * Returns the list of the registered plugins ids
   * @returns {string[]}
   */
  getRegisteredPlugins() {
    return Array.from(this[kPluginManagerInstances].keys());
  }

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
  onStateChange(callback) {
    this.#onStateChangeCallbacks.add(callback);
    return () => this.#onStateChangeCallbacks.delete(callback);
  }
}

export default BasePluginManager;
