import sockets from './sockets';
import server from './server';
import serverServiceManager from './serverServiceManager';
import { EventEmitter } from 'events';

// @todo - remove EventEmitter ? (Implement our own listeners)

/**
 * Base class used to create any *Soundworks* activity on the server side.
 *
 * While the sequence of user interactions and exchanges between client and server is determined on the client side, the server side modules are ready to receive requests from the corresponding client side modules as soon as a client is connected to the server.
 *
 * Each module should have a {@link ServerModule#connect} and a {@link ServerModule#disconnect} methods.
 * Any module mapped to the type of client `'clientType'` (thanks to the {@link server#map} method) calls its {@link ServerModule#connect} method when such a client connects to the server, and its {@link ServerModule#disconnect} method when such a client disconnects from the server.
 *
 * (See also {@link src/client/ClientModule.js~ClientModule} on the client side.)
 *
 * **Note:** a more complete example of how to write a module is in the [Example](manual/example.html) section.
 *
 * @example
 * class MyPier extends Pier {
 *   constructor(name) {
 *     super(name);
 *
 *     // ...
 *   }
 *
 *   connect(client) {
 *     super.connect(client);
 *
 *     // ...
 *   }
 *
 *   disconnect(client) {
 *     super.disconnect(client);
 *
 *     // ...
 *   }
 * }
 */
export default class ServerActivity extends EventEmitter {
  /**
   * Creates an instance of the class.
   * @param {String} id - The id of the activity.
   */
  constructor(id) {
    super();

    /**
     * The id of the activity. This id must match a client side `Activity` id in order
     * to create the socket channel between the activity and its client side peer.
     * @type {string}
     */
    this.id = id;

    /**
     * Options of the activity. (Should be changed by calling `this.configure`)
     */
    this.options = {};

    /**
     * The client types on which the activity should be mapped.
     * @type {Set}
     * @private
     */
    this.clientTypes = new Set();

    /**
     * List of the required activities
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
   * Add the given activity as a requirement for the behavior of the
   *  current activity.
   * @private
   * @type {ServerActivity} activity
   */
  addRequiredActivity(activity) {
    this.requiredActivities.add(activity);
  }

  /**
   * Retrieve a service.
   */
  require(id, options) {
    return serverServiceManager.require(id, this, options);
  }

  /**
   * Start an activity, is automatically called on server startup.
   */
  start() {}

  /**
   * Called when the `client` connects to the server.
   *
   * This method should handle the logic of the module on the server side.
   * For instance, it can take care of the communication with the client side module by setting up WebSocket message listeners and sending WebSocket messages, or it can add the client to a list to keep track of all the connected clients.
   * @param {Client} client Connected client.
   */
  connect(client) {
    // Setup an object
    client.modules[this.id] = {};
  }

  /**
   * Called when the client `client` disconnects from the server.
   *
   * This method should handle the logic when that happens.
   * For instance, it can remove the socket message listeners, or remove the client from the list that keeps track of the connected clients.
   * @param {Client} client Disconnected client.
   */
  disconnect(client) {
    // delete client.modules[this.id] // maybe needed by other modules
  }

  /**
   * Listen a WebSocket message.
   * @param {Client} client - The client that must listen to the message.
   * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive(client, channel, callback) {
    const namespacedChannel = `${this.id}:${channel}`;
    sockets.receive(client, namespacedChannel, callback);
  }

  /**
   * Sends a WebSocket message to the client.
   * @param {Client} client - The client to send the message to.
   * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(client, channel, ...args) {
    const namespacedChannel = `${this.id}:${channel}`;
    sockets.send(client, namespacedChannel, ...args);
  }

  /**
   * Sends a message to all client of given `clientType` or `clientType`s. If not specified, the message is sent to all clients
   * @param {String|Array} clientType - The `clientType`(s) that must receive the message.
   * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  broadcast(clientType, excludeClient, channel, ...args) {
    const namespacedChannel = `${this.id}:${channel}`;
    sockets.broadcast(clientType, excludeClient, namespacedChannel, ...args);
  }
}
