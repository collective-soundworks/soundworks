'use strict';

import ServerModule from './ServerModule.es6.js';

/**
 * The `ServerPerformance` base class constitutes a basis on which to build a performance on the server side.
 * Its particularity is to keep track of the clients who are currently in the performance with the array `this.clients`, and to have the `enter` and `exit` methods that inform the module when the client entered the performance (*i.e.* when the `performance` on the client side called its `start` method) and left it (*i.e.* when the `performance` on the client side called its `done` method, or if the client disconnected from the server).
 *
 */
class ServerPerformance extends ServerModule {
  /**
    * Creates an instance of the class.
    * @param {Object} [options={}] Options.
    * @param {string} [options.name='performance'] Name of the module.
   */
  constructor(options = {}) {
    super(options.name || 'performance');

    /**
     * Contains the list of the clients who are currently in the performance (*i.e.* who started the performance and have not exited it yet).
     * @type {ServerClient[]}
     */
    this.clients = [];
  }

  /**
   * Called when the client connects to the server.
   * @param {ServerClient} client The connected client.
   */
  connect(client) {
    super.connect(client);

    // Listen for the `'performance:start'` socket message from the client.
    client.receive(this.name + ':start', () => {
      this.enter(client);
    });

    // Listen for the `'performance:done'` socket message from the client.
    client.receive(this.name + ':done', () => {
      this.exit(client);
    });
  }

  /**
   * Called when the client disconnects from the server.
   * @param {ServerClient} client The connected client.
   */
  disconnect(client) {
    super.disconnect(client);

    // Call the `exit` method if the client previously entered the performance.
    if (client.modules[this.name].entered)
      this.exit(client);
  }

  /**
   * Called when the client starts the performance on the client side.
   * @param {ServerClient} client The client that starts the performance.
   */
  enter(client) {
    // Add the client to the `this.clients` array.
    this.clients.push(client);

    // Set flag.
    client.modules[this.name].entered = true;
  }

  /**
   * Called when the client exits the performance on the client side (*i.e.* when the `done` method of the client side module is called, or when the client disconnects from the server).
   * @param {ServerClient} client The client that exits the performance.
   */
  exit(client) {
    // Remove the client from the `this.clients` array.
    const index = this.clients.indexOf(client);
    if (index >= 0)
      this.clients.splice(index, 1);

    // Remove flag.
    client.modules[this.name].entered = false;
  }
}
