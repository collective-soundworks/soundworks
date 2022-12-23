import BasePlugin from '../common/BasePlugin.js';

/**
 * Base class to extend for creating new soundworks plugins.
 *
 * @memberof client
 * @extends BasePlugin
 */
class Plugin extends BasePlugin {
  /**
   * @param {client.Client} client - The soundworks client instance.
   * @param {string} id - User defined id of the plugin as defined in
   *  {@link client.PluginManager#register}.
   * @see {@link client.PluginManager#register}
   */
  constructor(client, id) {
    super(id);

    /**
     * Instance of soundworks client.
     *
     * @type {client.Client}
     * @see {@link client.Client}
     */
    this.client = client;
  }

  // @todo
  // /**
  //  * Interface method to implement if specific logic should be done when a
  //  * {@link client.Client} enters the plugin.
  //  */
  // async activate() {}
  //
  // /**
  //  * Interface method to implement if specific logic should be done when a
  //  * {@link client.Client} exists the plugin.
  //  */
  // async deactivate() {}
}

export default Plugin;
