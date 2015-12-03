// @todo - remove EventEmitter? (Implement our own listeners)
import comm from './comm';
import { EventEmitter } from 'events';

/**
 * The {@link Module} base class is used to create a *Soundworks* module on the server side.
 * Each module should have a {@link Module#connect} and a {@link Module#disconnect} method.
 * Any module mapped to the type of client `clientType` (thanks to the {@link server#map} method) would call its {@link Module#connect} method when such a client connects to the server, and its {@link Module#disconnect} method when such a client disconnects from the server.
 * @example
 * class MyModule extends serverSide.Module {
 *   constructor('my-module-name') {
 *     ... // anything the constructor needs
 *   }
 *
 *   connect(client) {
 *     ... // what the module has to do when a client connects to the server
 *   }
 *
 *   disconnect(client) {
 *     ... // what the module has to do when a client disconnects from the server
 *   }
 * }
 */
export default class Module extends EventEmitter {
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
   * This method should handle the logic of the module on the server side. For instance, it can take care of the communication with the client side module by setting up WebSocket message listeners and sending WebSocket messages, or it can add the client to a list to keep track of all the connected clients.
   * @param {ModuleClient} client - The connected client.
   */
  connect(client) {
    // Setup an object
    client.modules[this.name] = {};
  }

  /**
   * Called when the client `client` disconnects from the server.
   * This method should handle the logic when that happens. For instance, it can remove the socket message listeners, or remove the client from the list that keeps track of the connected clients.
   * @param {ModuleClient} client - The disconnected client.
   */
  disconnect(client) {
    // delete client.modules[this.name] // TODO?
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




