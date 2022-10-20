import BasePluginManager from '../common/BasePluginManager.js';
import Plugin from './Plugin.js';
import Server from './Server.js';

/**
 * Manage the plugins lifecycle and their possible inter-dependencies.
 *
 * @memberof server
 */
class PluginManager extends BasePluginManager {
  constructor(server) {
    if (!(server instanceof Server)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "new PluginManager(server)" should receive an instance of "soundworks.Server as argument"`);
    }

    super(server);
  }

  register(id, factory = null, options = {}, deps = []) {
    const ctor = factory(Plugin);

    if (!(ctor.prototype instanceof Plugin)) {
      throw new Error(`[soundworks.PluginManager] Invalid argument, "pluginManager.register" second argument should be a factory function returning a class extending Plugin`);
    }

    super.register(id, ctor, options, deps);
  }

  // server only methods

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
      const promise = plugin.addClient(client);
      promises.push(promise);
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
