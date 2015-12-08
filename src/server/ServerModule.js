// @todo - remove EventEmitter? (Implement our own listeners)
import comm from './comm';
import { EventEmitter } from 'events';

/**
 * [server] Base class used to create any *Soundworks* module on the server side.
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
 * class MyModule extends ServerModule {
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
export default class ServerModule extends EventEmitter {
  /**
    * Creates an instance of the class.
    * @param {Object} [options={}] The options.
    * @param {string} [options.name='unnamed'] The name of the module.
   */
  constructor(name) {
    super();
    /**
     * The name of the module.
     * @type {string}
     */
    this.name = name;
  }

  /**
   * Called when the `client` connects to the server.
   *
   * This method should handle the logic of the module on the server side.
   * For instance, it can take care of the communication with the client side module by setting up WebSocket message listeners and sending WebSocket messages, or it can add the client to a list to keep track of all the connected clients.
   * @param {Client} client Connected client.
   */
  connect(client) {
    // Setup an object
    client.modules[this.name] = {};
  }

  /**
   * Called when the client `client` disconnects from the server.
   *
   * This method should handle the logic when that happens.
   * For instance, it can remove the socket message listeners, or remove the client from the list that keeps track of the connected clients.
   * @param {Client} client Disconnected client.
   */
  disconnect(client) {
    // delete client.modules[this.name] // TODO?
  }

  /**
   * Get access to the global configuration (called from `server`)
   * @private
   */
  configure(appConfig, envConfig) {
    this.appConfig = appConfig;
    this.envConfig = envConfig;
  }

  /**
   * Listen a WebSocket message.
   * @param {Client} client - The client that must listen to the message.
   * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive(client, channel, callback) {
    const namespacedChannel = `${this.name}:${channel}`;
    comm.receive(client, namespacedChannel, callback);
  }

  /**
   * Sends a WebSocket message to the client.
   * @param {Client} client - The client to send the message to.
   * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(client, channel, ...args) {
    const namespacedChannel = `${this.name}:${channel}`;
    comm.send(client, namespacedChannel, ...args);
  }

  /**
   * Sends a WebSocket message to all the clients belonging to the same `clientType` as `client`. (`client` does not receive a message)
   * @param {Client} client - The client which peers must receive the message
   * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  sendPeers(client, channel, ...args) {
    const namespacedChannel = `${this.name}:${channel}`;
    comm.sendPeers(client, namespacedChannel, ...args);
  }

  /**
   * Sends a message to all client of given `clientType` or `clientType`s. If not specified, the message is sent to all clients
   * @param {String|Array} clientType - The `clientType`(s) that must receive the message.
   * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  broadcast(clientType, channel, ...args) {
    const namespacedChannel = `${this.name}:${channel}`;
    comm.broadcast(clientType, namespacedChannel, ...args);
  }
}
