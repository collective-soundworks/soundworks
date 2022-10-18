import logger from '../common/logger.js';

/**
 * Base class to extend for creating new soundworks plugins.
 *
 * @memberof server
 */
class Plugin {
  constructor(client, id) {
    /**
     * Instance of soundworks client.
     * @type {client.Client}
     * @see {@link client.Client}
     */
    this.client = client;

    /**
     * Id of the plugin.
     * @type {String}
     */
    this.id = id;

    /**
     * Type of the plugin, i.e. the ClassName.
     *
     * Usefull to do something based on certain types of plugin while not
     * knowing under which id they have been registered. (e.g. view for platform)
     *
     * @type {String}
     * @readonly
     */
    this.type = this.constructor.name;

    /**
     * Options of the plugin.
     * @type {Object}
     */
    this.options = {};

    /**
     * Current status of the plugin ('idle', 'inited', 'started', 'errored')
     * @type {String}
     */
    this.status = 'idle';
  }

  /**
   * This method is called during the `pluginManager.start()` which is itself
   * called during `server.init()`. At this point the state manager is ready to use.
   *
   * @example
   * class MyDummyPlugin extends Plugin {
   *   async start() {
   *     this.state = await this.server.stateManager.create(`s:${this.id}`);
   *     await new Promise(resolve => setTimeout(resolve, 1000));
   *   }
   * }
   */
  async start() {
    logger.log(`> plugin "${this.id}" start`);
  }

  /**
   * @private
   * This method is called during the `pluginManager.stop()` which is itself
   * called during `client.stop()`. Most of the time, you wont need to implement
   * this method.
   *
   * @example
   * class MyDummyPlugin extends Plugin {
   *   async start() {
   *     this.state = await this.server.stateManager.create(`s:${this.id}`);
   *     await new Promise(resolve => setTimeout(resolve, 1000));
   *   }
   * }
   */
  async stop() {
    logger.log(`> plugin "${this.id}" stop`);
  }

  // @todo
  /**
  //  * Interface method to implement if specific logic should be done when a
  //  * {@link client.Client} enters the plugin.
  //  */
  // async activate() {}

  // /**
  //  * Interface method to implement if specific logic should be done when a
  //  * {@link client.Client} exists the plugin.
  //  */
  // async deactivate() {}
}

export default Plugin;
