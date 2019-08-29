// @todo - to be removed, move to dependency injection
import server from './server';

/**
 * Internal base class for Service and Experience
 *
 * @memberof module:soundworks/server
 */
class Activity {
  constructor() {
    /**
     * The client types on which the activity should be mapped.
     * @type {Set}
     * @name clientTypes
     * @instance
     * @memberof module:soundworks/server.Activity
     */
    this.clientTypes = new Set();

    // register as instanciated to the server
    server.setActivity(this);
  }

  /**
   * @private
   *
   * This method is required by the server to know which client should connect
   * to which activity.
   * Add client type that should be mapped to this activity.
   *
   * @param {String|Array} val - The client type(s) on which the activity
   *  should be mapped
   */
  _addClientTypes(clientTypes) {
    if (typeof clientTypes === 'string') {
      clientTypes = [clientTypes];
    }

    // add client types to current activity
    clientTypes.forEach((clientType) => {
      this.clientTypes.add(clientType);
    });
  }

  /**
   * Interface method to be implemented by activities. As part of an activity
   * lifecycle, the method should define the behavior of the activity when started
   * (e.g. binding listeners). When this method is called, all configuration options
   * should be defined.
   * The method is automatically called by the server on startup.
   */
  start() {}

  /**
   * Called when the `client` connects to the server. This method should handle
   * the particular logic of the activity on the server side according to the
   * connected client (e.g. adding socket listeners).
   * @param {module:soundworks/server.Client} client
   */
  connect(client) {}

  /**
   * Called when the client `client` disconnects from the server. This method
   * should handle the particular logic of the activity on the server side when
   * a client disconnect (e.g. removing socket listeners).
   * @param {module:soundworks/server.Client} client
   */
  disconnect(client) {}
}

export default Activity;