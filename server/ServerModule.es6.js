'use strict';

const EventEmitter = require('events').EventEmitter; // TODO: remove EventEmitter? (Implement our own listeners)

/**
 * The `ServerPerformance` base class constitutes a basis on which to build a performance on the server side.
 */
export default class ServerModule extends EventEmitter {
  /**
    * Creates an instance of the class.
    * @param {Object} [options = {}] The options.
    * @param {string} [options.name = 'unnamed'] The name of the module.
   */
  constructor(name = 'unnamed') {
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
   * @param {ServerClient} client The connected client.
   */
  connect(client) {
    // Setup an object
    client.modules[this.name] = {};
  }

  /**
   * Called when the client `client` disconnects from the server.
   * This method should handle the logic when that happens. For instance, it can remove the socket message listeners, or remove the client from the list that keeps track of the connected clients.
   * @param {ServerClient} client The disconnected client.
   */
  disconnect(client) {
    // delete client.modules[this.name] // TODO?
  }
}
