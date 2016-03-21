import sockets from './sockets';
import server from './server';
import serviceManager from './serviceManager';
import { EventEmitter } from 'events';

// @todo - remove EventEmitter ? (Implement our own listeners)

/**
 * Base class used to create any *Soundworks* Activity on the server side.
 *
 * While the sequence of user interactions and exchanges between client and server is determined on the client side, the server side activities are ready to receive requests from the corresponding client side activities as soon as a client is connected to the server.
 *
 * Each activity should have a connect and a disconnect method.
 * Any activity mapped to the type of client `'clientType'` (thanks to the {@link server#map} method) calls its connect method when such a client connects to the server, and its disconnect method when such a client disconnects from the server.
 */
class Activity extends EventEmitter {
  /**
   * Creates an instance of the class.
   * @param {String} id - The id of the activity.
   */
  constructor(id) {
    super();

    /**
     * The id of the activity. This value must match a client side
     * {@link src/client/core/Activity.js~Activity} id in order to create
     * a namespaced socket channel between the activity and its client side peer.
     * @type {string}
     */
    this.id = id;

    /**
     * Options of the activity. These values should be updated with the
     * `this.configure` method.
     * @type {Object}
     */
    this.options = {};

    /**
     * The client types on which the activity should be mapped.
     * @type {Set}
     * @private
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
   * @type {Activity} activity
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
   * (e.g. binding listeners). When this method id called, all configuration options
   * should be setted. Also, if the activity relies on another service,
   * this dependency should be considered as instanciated.
   * The method is automatically called by the server on startup.
   */
  start() {}

  /**
   * Called when the `client` connects to the server.
   *
   * This method should handle the logic of the activity on the server side.
   * For instance, it can take care of the communication with the client side activity by setting up WebSocket message listeners and sending WebSocket messages, or it can add the client to a list to keep track of all the connected clients.
   * @param {Client} client Connected client.
   */
  connect(client) {
    // setup an object
    client.activities[this.id] = {};
  }

  /**
   * Called when the client `client` disconnects from the server.
   *
   * This method should handle the logic when that happens.
   * For instance, it can remove the socket message listeners, or remove the client from the list that keeps track of the connected clients.
   * @param {Client} client Disconnected client.
   */
  disconnect(client) {
    // delete client.activities[this.id] // maybe needed by other activities
  }

  /**
   * Listen a WebSocket message.
   * @param {Client} client - The client that must listen to the message.
   * @param {String} channel - The channel of the message (is automatically namespaced with the activity's name: `${this.id}:channel`).
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive(client, channel, callback) {
    const namespacedChannel = `${this.id}:${channel}`;
    sockets.receive(client, namespacedChannel, callback);
  }

  /**
   * Sends a WebSocket message to the client.
   * @param {Client} client - The client to send the message to.
   * @param {String} channel - The channel of the message (is automatically namespaced with the activity's name: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(client, channel, ...args) {
    const namespacedChannel = `${this.id}:${channel}`;
    sockets.send(client, namespacedChannel, ...args);
  }

  /**
   * Sends a message to all client of given `clientType` or `clientType`s. If not specified, the message is sent to all clients
   * @param {String|Array} clientType - The `clientType`(s) that must receive the message.
   * @param {String} channel - The channel of the message (is automatically namespaced with the activity's name: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  broadcast(clientType, excludeClient, channel, ...args) {
    const namespacedChannel = `${this.id}:${channel}`;
    sockets.broadcast(clientType, excludeClient, namespacedChannel, ...args);
  }
}

export default Activity;
