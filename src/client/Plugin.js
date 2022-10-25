import BasePlugin from '../common/BasePlugin.js';

/**
 * Base class to extend for creating new soundworks plugins.
 *
 * @memberof server
 * @augments BasePlugin
 */
class Plugin extends BasePlugin {
  constructor(client, id) {
    super(id);

    /**
     * Instance of soundworks client.
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
