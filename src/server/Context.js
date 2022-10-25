import Client from './Client.js';
import Server from './Server.js';

/**
 * Base class to extend in order to create the server-side counterpert of
 * a soundworks client.
 *
 * The user defined `Experience`s are the main components of a soundworks application.
 *
 * @memberof server
 */
class Context {
  constructor(server, clientTypes = []) {
    if (!(server instanceof Server)) {
      throw new Error(`[soundworks:Context] Invalid argument, context "${this.constructor.name}" should receive a "soundworks.Server" instance as first argument`);
    }

    if (clientTypes === null) {
      throw new Error('Invalid client types');
    }

    this.server = server;

    /**
     * List of clients that are currently in this context
     * @instance
     * @type {Client[]}
     */
    this.clients = new Set();

    /**
     * status of the context ['idle', 'inited', 'started', 'errored']
     */
    this.status = 'idle';

    /**
     * List of client types associated with this server-side experience.
     */
    clientTypes = Array.isArray(clientTypes) ? clientTypes : [clientTypes];
    this.clientTypes = new Set(clientTypes);

    // register in context manager
    this.server.contextManager.register(this);
  }

  /**
   * Getter that returns the name of the context, override to use a user-defined name
   */
  get name() {
    return this.constructor.name;
  }

  /**
   * Method automatically called when the server starts. Or lazilly called if
   * the context was created after `server.start()`
   * WARNING: this method should never be called manually.
   */
  async start() {}

  /**
   * Method automatically called when the server stops.
   * WARNING: this method should never be called manually.
   */
  async stop() {}

  /**
   * Method automatically called when the client enters the context.
   * WARNING: this method should never be called manually.
   */
  async enter(client) {
    if (!(client instanceof Client)) {
      throw new Error(`[soundworks.Context] Invalid argument, ${this.name} context ".enter()" method should receive a server-side "soundworks.Client" instance argument`);
    }

    this.clients.add(client);
  }

  /**
   * Method automatically called when the client exits the context.
   * WARNING: this method should never be called manually.
   */
  async exit(client) {
    if (!(client instanceof Client)) {
      throw new Error(`[soundworks.Context] Invalid argument, ${this.name}.exit() should receive a server-side "soundworks.Client" instance argument`);
    }

    this.clients.delete(client);
  }
}

export default Context;
