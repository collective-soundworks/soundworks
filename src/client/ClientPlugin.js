import BasePlugin from '../common/BasePlugin.js';

/**
 * Callback executed when the plugin state is updated.
 *
 * @callback ClientPlugin~onStateChangeCallback
 * @param {ClientPlugin#state} state - Current state of the plugin.
 */

/**
 * Delete the registered {@link ClientPlugin~onStateChangeCallback}.
 *
 * @callback ClientPlugin~deleteOnStateChangeCallback
 */

/**
 * Base class to extend in order to create the client-side counterpart of a
 * `soundworks` plugin.
 *
 * In the `soundworks` paradigm, a plugin is a component that allows to extend
 * the framework capabilities by encapsulating common and reusable logic in
 * an application wise perspective. For example, plugins are available to handle
 * clock synchronization, to deal with the file system, etc. Plugin should always
 * have both a client-side and a server-side part.
 *
 * See [https://soundworks.dev/guide/ecosystem](https://soundworks.dev/guide/ecosystem)
 * for more information on the available plugins.
 *
 * _Creating new plugins should be considered an advanced usage._
 *
 * @extends BasePlugin
 * @inheritdoc
 */
class ClientPlugin extends BasePlugin {
  #client = null;
  /**
   * @param {Client} client - A soundworks client instance.
   * @param {string} id - User defined id of the plugin as defined in
   *  {@link ClientPluginManager#register}.
   */
  constructor(client, id) {
    super(id);

    this.#client = client;
  }

  /**
   * Instance of soundworks client.
   *
   * @type {Client}
   * @see {@link Client}
   */
  get client() {
    return this.#client;
  }

  // @todo
  // /**
  //  * Interface method to implement if specific logic should be done when a
  //  * {@link Client} enters the plugin.
  //  */
  // async activate() {}
  //
  // /**
  //  * Interface method to implement if specific logic should be done when a
  //  * {@link Client} exists the plugin.
  //  */
  // async deactivate() {}
}

export default ClientPlugin;
