import isPlainObject from 'is-plain-obj';

import Plugin from './Plugin.js';
import Client from './Client.js';
import logger from '../common/logger.js';
import { isString } from '../common/utils.js';

/**
 * Manage the plugins and their relations. Acts as a factory to ensure plugins
 * are instanciated only once.
 *
 * @memberof client
 */
class PluginManager {
  constructor(client) {
    if (!(client instanceof Client)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "new PluginManager(client)" should receive an instance of "soundworks.Client as argument"`);
    }

    /** @private */
    this._client = client;
    /** @private */
    this._registeredPlugins = new Map();
    /** @private */
    this._instances = new Map();
    /** @private */
    this._instanceStartPromises = new Map();
    /** @private */
    this._observers = new Set();
    /** @private */
    this._pluginsStatuses = {};

    this.status = 'idle';
  }

  /**
   * Register a plugin (client-side) into soundworks.
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
   * client.pluginManager.register('user-defined-name', pluginFactory);
   * ```
   */
  register(id, factory, options = {}, deps = []) {
    // for now we don't allow to register a plugin after `client.init` has been called?
    // This is subject to change in the future as we may want to dynamically register
    // new plugins during application lifetime.
    if (this._client.status === 'inited') {
      throw new Error(`[soundworks.PluginManager] Cannot register plugin (${id}) after "client.init()"`);
    }

    if (!isString(id)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "pluginManager.register" first argument should be a string`);
    }

    const ctor = factory(Plugin);

    if (!(ctor.prototype instanceof Plugin)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "pluginManager.register" second argument should be a factory function returning a class extending Plugin`);
    }

    if (!isPlainObject(options)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "pluginManager.register" third optionnal argument should be an object`);
    }

    if (!Array.isArray(deps)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "pluginManager.register" fourth optionnal argument should be an array`);
    }

    if (this._registeredPlugins.has(id)) {
      const ctor = factory(Plugin);
      throw new Error(`[soundworks:PluginManager] Plugin "${id}" of type "${ctor.name}" already registered`);
    }

    this._registeredPlugins.set(id, { ctor, options, deps });
    this._pluginsStatuses[id] = 'idle';
  }

  /**
   * Retrieve an instance of a registered plugin according to its given id.
   * If the plugin wasn't fully started yet, the Promise will resolve once done.
   * Be aware that if the plugin depends of another one, the full chain of dependency
   * will be resolved.
   *
   * @param {String} id - Id of the plugin as given when registered
   */
  async get(id) {
    if (!isString(id)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "pluginManager.get(name)" argument should be a string`);
    }

    if (!this._registeredPlugins.has(id)) {
      throw new Error(`[soundworks:PluginManager] Cannot get plugin "${id}", plugin is not registered`);
    }

    if (!this._instances.has(id)) {
      const { ctor, options } = this._registeredPlugins.get(id);
      const instance = new ctor(this._client, id, options);
      this._instances.set(id, instance);
    }

    const instance = this._instances.get(id);

    // recursively get the dependency chain
    const { deps } = this._registeredPlugins.get(id);
    const promises = deps.map(id => this.get(id));

    await Promise.all(promises);

    // 'plugin.start' has already been called, just await the start promise
    if (this._instanceStartPromises.has(id)) {
      await this._instanceStartPromises.get(id);
    } else {
      this._propagateStatusChange(instance, 'inited');
      let errored = false;

      try {
        const startPromise = instance.start();
        this._instanceStartPromises.set(id, startPromise);

        await startPromise;
      } catch(err) {
        errored = true;
        this._propagateStatusChange(instance, 'errored');
        throw new Error(err);
      }

      // this looks silly but it prevents the try / catch to catch errors that could
      // be triggered by the propagate status callback, putting the plugin in errored state
      if (!errored) {
        this._propagateStatusChange(instance, 'started');
      }
    }

    return instance;
  }

  /**
   * Initialize all the registered plugin. Called during `Client.init()`
   * @private
   */
  async start() {
    logger.title('starting registered plugins');

    if (this.status !== 'idle') {
      throw new Error(`[soundworks:PluginManager] Cannot call "pluginManager.init()" twice`);
    }

    this.status = 'inited';
    // propagate all 'idle' statuses before start
    this._propagateStatusChange();

    const promises = Array.from(this._registeredPlugins.keys()).map(id => this.get(id));

    await Promise.all(promises);

    this.status = 'started';
  }

  // @todo - review while updating the platform init view
  /** @private */
  _propagateStatusChange(instance = null, status = null) {
    if (instance != null && status != null) {
      instance.status = status;

      const id = instance.id;
      this._pluginsStatuses[id] = status;

      const statuses = this.getStatuses();
      this._observers.forEach(observer => observer(statuses, { [id]: status }));
    } else {
      const statuses = this.getStatuses();
      this._observers.forEach(observer => observer(statuses, {}));
    }
  }

  // Observable API
  /** @private */
  observe(observer) {
    this._observers.add(observer);

    return () => {
      this._observers.delete(observer);
    };
  }

  /** @private */
  getStatuses() {
    return Object.assign({}, this._pluginsStatuses);
  }

  /** @private */
  getRegisteredPlugins() {
    return Array.from(this._registeredPlugins.keys());
  }
}

export default PluginManager;
