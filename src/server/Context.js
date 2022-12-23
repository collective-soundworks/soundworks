import Client from './Client.js';
import Server from './Server.js';

/**
 * Base class to extend in order to create the server-side counterpart of
 * a {@link client.Context}. If not defined, a default context will be created
 * and used by the server.
 *
 * @memberof server
 */
class Context {
  constructor(server, roles = []) {
    if (!(server instanceof Server)) {
      throw new Error(`[soundworks:Context] Invalid argument, context "${this.constructor.name}" should receive a "soundworks.Server" instance as first argument`);
    }

    if (roles === null) {
      throw new Error('Invalid client types');
    }

    /**
     * soundworks server
     * @type {server.Server}
     */
    this.server = server;

    /**
     * List of clients that are currently in this context
     * @type {Client[]}
     */
    this.clients = new Set();

    /**
     * Status of the context ('idle', 'inited', 'started' or 'errored')
     * @type {String}
     */
    this.status = 'idle';

    /**
     * List of client role associated with this context.
     */
    roles = Array.isArray(roles) ? roles : [roles];
    this.roles = new Set(roles);

    // register in context manager
    this.server.contextManager.register(this);
  }

  /**
   * Name of the context, default to the class name.
   * Override the `get name()` getter to use a user-defined context name.
   */
  get name() {
    return this.constructor.name;
  }

  /**
   * Method automatically called when the server starts, or lazilly called if
   * the context is created after `server.start()`
   *
   * _WARNING: this method should never be called manually._
   */
  async start() {}

  /**
   * Method automatically called when the server stops.
   *
   * _WARNING: this method should never be called manually._
   */
  async stop() {}

  /**
   * Method automatically called when the client enters the context.
   *
   * _WARNING: this method should never be called manually._
   */
  async enter(client) {
    if (!(client instanceof Client)) {
      throw new Error(`[soundworks.Context] Invalid argument, ${this.name} context ".enter()" method should receive a server-side "soundworks.Client" instance argument`);
    }

    this.clients.add(client);
  }

  /**
   * Method automatically called when the client exits the context.
   *
   * _WARNING: this method should never be called manually._
   */
  async exit(client) {
    if (!(client instanceof Client)) {
      throw new Error(`[soundworks.Context] Invalid argument, ${this.name}.exit() should receive a server-side "soundworks.Client" instance argument`);
    }

    this.clients.delete(client);
  }
}

export default Context;
