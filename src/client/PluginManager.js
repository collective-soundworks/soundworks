import BasePluginManager from '../common/BasePluginManager.js';
import Plugin from './Plugin.js';
import Client from './Client.js';

/**
 * Manage the plugins lifecycle and their possible inter-dependencies.
 *
 * @memberof client
 * @extends BasePluginManager
 * @inheritdoc
 */
class PluginManager extends BasePluginManager {
  /**
   * @param {client.Client} client - The soundworks client instance.
   */
  constructor(client) {
    if (!(client instanceof Client)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "new PluginManager(client)" should receive an instance of "soundworks.Client as argument"`);
    }

    super(client);
  }

  register(id, factory, options = {}, deps = []) {
    const ctor = factory(Plugin);

    if (!(ctor.prototype instanceof Plugin)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "pluginManager.register" second argument should be a factory function returning a class extending Plugin`);
    }

    super.register(id, ctor, options, deps);
  }

  // client only methods
  // ------------------------------------------------------------

  /**
   * @protected
   * @ignore
   */
  getRegisteredPlugins() {
    return Array.from(this._registeredPlugins.keys());
  }
}

export default PluginManager;
