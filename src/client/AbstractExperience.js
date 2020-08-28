import debug from 'debug';

const log = debug('soundworks:lifecycle');

/**
 * Base class to extend for implementing a client of a soundworks application.
 *
 * @memberof client
 */
class AbstractExperience {
  constructor(client) {
    // @todo - check that it's a soundworks instance
    if (!client) {
      throw new Error(`${this.constructor.name} should receive the "Client" instance as first argument`);
    }

    this.client = client;
  }

  /**
   * Require a registered plugin.
   * @see {client.PluginManager#register}
   *
   * @param {String} name - Name of the plugin as given when registered.
   */
  require(name) {
    return this.client.pluginManager.get(name, true);
  }

  /**
   * Start the experience. This lifecycle method is called by the soundworks
   * client when all the required plugins are `ready` and thus the `Experience``
   * can start with all the necessary informations and plugins ready to be consumed.
   */
  start() {
    log(`> experience "${this.constructor.name}" start`);
    this.client.socket.send('s:exp:enter');
  }
}

export default AbstractExperience;
