// @todo - remove EventEmitter? (Implement our own listeners)
import { EventEmitter } from 'events';


/**
 * [server] Base class used to create a *Soundworks* module on the server side.
 *
 * Each module should have a {@link Module#connect} and a {@link Module#disconnect} method.
 * Any module mapped to the type of client `clientType` (thanks to the {@link server#map} method) calls its {@link Module#connect} method when such a client connects to the server, and its {@link Module#disconnect} method when such a client disconnects from the server.
 *
 * (See also {@link src/client/Module.js~Module} on the client side.)
 *
 * @example
 * class MyModule extends Module {
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
   * @param {Client} client Connected client.
   */
  connect(client) {
    // Setup an object
    client.modules[this.name] = {};
  }

  /**
   * Called when the client `client` disconnects from the server.
   * This method should handle the logic when that happens. For instance, it can remove the socket message listeners, or remove the client from the list that keeps track of the connected clients.
   * @param {Client} client Disconnected client.
   */
  disconnect(client) {
    // delete client.modules[this.name] // TODO?
  }
}
