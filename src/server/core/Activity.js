import sockets from './sockets';
import server from './server';
import serviceManager from './serviceManager';
import { EventEmitter } from 'events';

// @todo - remove EventEmitter ? (Implement our own listeners)

/**
 * Internal base class for services and scenes.
 *
 * @memberof module:soundworks/server
 */
class Activity extends EventEmitter {
  /**
   * Creates an instance of the class.
   * @param {String} id - Id of the activity.
   */
  constructor(id) {
    super();

    /**
     * The id of the activity. This value must match a client side
     * {@link src/client/core/Activity.js~Activity} id in order to create
     * a namespaced socket channel between the activity and its client side peer.
     * @type {String}
     * @name id
     * @instance
     * @memberof module:soundworks/server.Activity
     */
    this.id = id;

    /**
     * Options of the activity. These values should be updated with the
     * `this.configure` method.
     * @type {Object}
     * @name options
     * @instance
     * @memberof module:soundworks/server.Activity
     */
    this.options = {};

    /**
     * The client types on which the activity should be mapped.
     * @type {Set}
     * @name clientTypes
     * @instance
     * @memberof module:soundworks/server.Activity
     */
    this.clientTypes = new Set();

    /**
     * List of the activities the current activity needs in order to work.
     * @type {Set}
     * @private
     */
    this.requiredActivities = new Set();

    // register as existing to the server
    server.setActivity(this);
  }

  /**
   * Configure the activity.
   * @param {Object} options
   */
  configure(options) {
    Object.assign(this.options, options);
  }

  /**
   * Add client type that should be mapped to this activity.
   * @private
   * @param {String|Array} val - The client type(s) on which the activity
   *  should be mapped
   */
  addClientType(value) {
    if (arguments.length === 1) {
      if (typeof value === 'string')
        value = [value];
    } else {
      value = Array.from(arguments);
    }

    // add client types to current activity
    value.forEach((clientType) => {
      this.clientTypes.add(clientType);
    });

    // propagate value to required activities
    this.requiredActivities.forEach((activity) => {
      activity.addClientType(value);
    });
  }

  /**
   * Add the given activity as a requirement for the current activity.
   * @private
   * @param {module:soundworks/server.Activity} activity
   */
  addRequiredActivity(activity) {
    this.requiredActivities.add(activity);
  }

  /**
   * Retrieve a service. The required service is added to the `requiredActivities`.
   * @param {String} id - The id of the service.
   * @param {Object} options - Some options to configure the service.
   */
  require(id, options) {
    return serviceManager.require(id, this, options);
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
  connect(client) {
    // setup an object
    client.activities[this.id] = {};
  }

  /**
   * Called when the client `client` disconnects from the server. This method
   * should handle the particular logic of the activity on the server side when
   * a client disconnect (e.g. removing socket listeners).
   * @param {module:soundworks/server.Client} client
   */
  disconnect(client) {
    // delete client.activities[this.id] // maybe needed by other activities
  }

  /**
   * Listen to a web socket message from a given client.
   * @param {module:soundworks/server.Client} client - Client that must listen to the message.
   * @param {String} channel - Channel of the message (is automatically namespaced
   *  with the activity's name: `${this.id}:channel`).
   * @param {Function} callback - Callback to execute when a message is received.
   */
  receive(client, channel, callback) {
    const namespacedChannel = `${this.id}:${channel}`;
    sockets.receive(client, namespacedChannel, callback);
  }

  /**
   * Send a web socket message to a given client.
   * @param {module:soundworks/server.Client} client - Client to send the message to.
   * @param {String} channel - Channel of the message (is automatically namespaced
   * with the activity's id: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(client, channel, ...args) {
    const namespacedChannel = `${this.id}:${channel}`;
    sockets.send(client, namespacedChannel, ...args);
  }

  /**
   * Send a message to all client of given `clientType`(s).
   * @param {String|Array<String>|null} clientType - The `clientType`(s) that should
   *  receive the message. If `null`, the message is send to all clients.
   * @param {module:soundworks/server.Client} excludeClient - Client to should
   *  not receive the message (typically the original sender of the message).
   * @param {String} channel - Channel of the message (is automatically namespaced
   * with the activity's id: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  broadcast(clientType, excludeClient, channel, ...args) {
    const namespacedChannel = `${this.id}:${channel}`;
    sockets.broadcast(clientType, excludeClient, namespacedChannel, ...args);
  }
}

export default Activity;
