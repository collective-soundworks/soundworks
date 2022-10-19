import isPlainObject from 'is-plain-obj';

import Plugin from './Plugin.js';
import Server from './Server.js';
import logger from '../common/logger.js';
import { isString } from '../common/utils.js';

/**
 * Manager the plugins and their relations. Acts as a factory to ensure plugins
 * are instanciated only once.
 *
 * @memberof server
 */
class PluginManager {
  constructor(server) {
    if (!(server instanceof Server)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "new PluginManager(server)" should receive an instance of "soundworks.Server as argument"`);
    }

    /** @private */
    this._server = server;
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
   * Register a plugin (server-side) into soundworks.
   *
   * _A plugin must be registered both client-side and server-side_
   * @see {@link client.PluginManager#register}
   *
   * @param {String} id - Name of the plugin
   * @param {Function} factory - Factory function that return the plugin class
   * @param {Object} options - Options to configure the plugin
   * @param {Array} deps - List of plugins' ids the plugin depends on
   *
   * @example
   * ```js
   * server.pluginManager.register('user-defined-id', pluginFactory);
   * ```
   */
  register(id, factory = null, options = {}, deps = []) {
    // for now we don't allow to register a plugin after `client.init` has been called?
    // This is subject to change in the future as we may want to dynamically register
    // new plugins during application lifetime.
    if (this._server.status === 'inited') {
      throw new Error(`[soundworks.PluginManager] Cannot register plugin (${id}) after "server.init()"`);
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
   * If a plugin is registered after `server.init` it will be lazily instanciated
   * when `pluginManager.get(id)` is called
   *
   * @param {String} id - Id of the plugin as given when registered
   */
  async get(id) {
    if (!isString(id)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "pluginManager.get(id)" argument should be a string`);
    }

    if (!this._registeredPlugins.has(id)) {
      throw new Error(`[soundworks:PluginManager] Cannot get plugin "${id}", plugin is not registered`);
    }

    if (!this._instances.has(id)) {
      const { ctor, options } = this._registeredPlugins.get(id);
      const instance = new ctor(this._server, id, options);
      this._instances.set(id, instance);
    }

    const instance = this._instances.get(id);

    // recursively get the dependency chain
    const { deps } = this._registeredPlugins.get(id);
    const promises = deps.map(id => this.get(id));

    await Promise.all(promises);

    // 'start' has already been called, just await the start promise
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
   * Initialize all the registered plugin. Called during `Server.init()`
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

  /** private */
  checkRegisteredPlugins(registeredPlugins) {
    let missingPlugins = [];

    for (let id of registeredPlugins) {
      if (!this._instances.has(id)) {
        missingPlugins.push(id);
      }
    }

    if (missingPlugins.length > 0) {
      throw new Error(`Invalid plugin list, the following plugins registered client-side: [${missingPlugins.join(', ')}] have not been registered server-side. Registered server-side plugins are: [${Array.from(this._instances.keys()).join(', ')}].`);
    }
  }

  /** @private */
  async addClient(client, registeredPlugins = []) {
    let promises = [];

    for (let pluginName of registeredPlugins) {
      const plugin = await this.get(pluginName);
      promises.push(plugin.addClient(client));
    }

    await Promise.all(promises);
  }

  /** @private */
  async removeClient(client) {
    let promises = [];

    for (let plugin of this._instances.values()) {
      if (plugin.clients.has(client)) {
        promises.push(plugin.removeClient(client));
      }
    }

    await Promise.all(promises);
  }
}

export default PluginManager;
