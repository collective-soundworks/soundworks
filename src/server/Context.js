import Client from './Client.js';
import Server from './Server.js';

/**
 * Base class to extend in order to implment the optionnal server-side counterpart
 * of a {@link client.Context}. If not defined, a default context will be created
 * and used by the server.
 *
 * In the `soundworks` paradigm, a client has a "role" (e.g. _player_, _controller_)
 * see {@link client.Client#role}) and can be in different "contexts" (e.g. different
 * part of the experience such as sections of a music piece, etc.). The
 * {@link client.Context} and optionnal {@link serverContext} abstractions provide
 * a simple and unified way to model these reccuring aspects of an application.
 *
 * If a `server.Context` is recognized as the server-side counterpart of a
 * {@link client.Context}, based on their respective `name` (see {@link client.Context#name}
 * and {@link server.Context#name}), `soundworks` will ensure the logic defined
 * by the server-side Context will be executed at the beginning of the
 * {@link client.Client#enter} and {@link client.Client#exit} methods. The example
 * show how soundwords handles (and guarantees) the order of the `enter()` steps
 * between the client-side and the server-side parts of the context. The same goes
 * for the `exit()` method.
 *
 * ```
 * // client-side
 * import { Context } from '@soundworks/core/client.js';
 *
 * class MyContext extends Context {
 *   async enter() {
 *     // 1. client side context enter() starts
 *     //    server-side logic is triggered first
 *     await super.enter();
 *     // 4. server-side context enter() is fully done
 *     // some async job can be done here
 *     await new Promise(resolve => setTimeout(resolve, 1000));
 *     // 5. client-side context enter() ends
 *   }
 * }
 *
 * // Instanciate the context (assuming the `client.role` is 'test')
 * const myContext = new MyContext(client);
 *
 * // At some point in the application, the client enters the context trigerring
 * // the steps 1 to 5 described in the client-side and server-side `enter()`
 * // implementations. Note that the server-side `enter()` is never called manually.
 * await myContext.enter();
 * ```
 *
 * ```
 * // server-side
 * import { Context } from '@soundworks/core/server.js';
 *
 * class MyContext extends Context {
 *   async enter(client) {
 *     // 2. server-side context enter() starts
 *     await super.enter(client);
 *     // some async job can be done here
 *     await new Promise(resolve => setTimeout(resolve, 1000));
 *     // 3. server-side context enter() ends
 *   }
 * }
 *
 * // Instantiate the context
 * const myContext = new Context(server);
 * ```
 *
 * @memberof server
 */
class Context {
  /**
   * @param {client.Client} client - The soundworks client instance.
   * @param {string|string[]} [roles=[]] - Optionnal list of client roles that can
   *  use this context. In large applications, this may be usefull to guarantee
   *  that a context can be consumed only by specific client roles, throwing an
   *  error if any other client role tries to use it. If empty, no access policy
   *  will be used.
   * @throws Will throw if the first argument is not a soundworks server instance.
   */
  constructor(server, roles = []) {
    if (!(server instanceof Server)) {
      throw new Error(`[soundworks:Context] Invalid argument, context "${this.constructor.name}" should receive a "soundworks.Server" instance as first argument`);
    }

    /**
     * soundworks server
     * @type {server.Server}
     * @readonly
     */
    this.server = server;

    /**
     * List of clients that are currently in this context
     * @type {server.Client[]}
     */
    this.clients = new Set();

    /**
     * Status of the context ('idle', 'inited', 'started' or 'errored')
     * @type {string}
     * @readonly
     */
    this.status = 'idle';

    /**
     * List of client roles that can use this context.
     * @type {string[]}
     * @readonly
     */
    roles = Array.isArray(roles) ? roles : [roles];

    if (roles.length === 0) {
      roles = Object.keys(server.config.app.clients);
    }

    this.roles = new Set(roles);

    // register in context manager
    this.server.contextManager.register(this);
  }

  /**
   * Optionnal user-defined name of the context (defaults to the class name).
   *
   * The context manager will match the client-side and server-side contexts based
   * on this name. If the {@link server.ContextManager} don't find a corresponding
   * user-defined context with the same name, it will use a default (noop) context.
   *
   * @readonly
   * @type {string}
   * @example
   * // server-side and client-side contexts are matched based on their respective `name`
   * class MyContext extends Context {
   *   get name() {
   *     return 'my-user-defined-context-name';
   *   }
   * }
   */
  get name() {
    return this.constructor.name;
  }

  /**
   * Start the context. This method is lazilly called when a client enters the
   * context for the first time (cf. ${server.Context#enter}). If you know some
   * some heavy and/or potentially long job has to be done  when starting the context
   * (e.g. connect to a database, parsing a long file) it may be a good practice
   * to call it explicitely.
   *
   * This method should be implemented to perform operations that are valid for the
   * whole lifetime of the context, regardless a client enters or exits the context.
   *
   * @example
   * import { Context } from '@soundworks/core/server.js';
   *
   * class MyContext extends Context {
   *   async start() {
   *     await super.start();
   *     await this.doSomeLongJob();
   *   }
   * }
   *
   * // Instantiate the context
   * const myContext = new Context(server, ['test']);
   * // manually start the context to perform the long operation before the first
   * // client enters the context
   * await myContext.start();
   * ```
   */
  async start() {}

  /**
   * Stop the context. The method that is automatically called when the server
   * stops. It should be used to cleanup context wise operations made in `start()`
   * (e.g. disconnect from a database, release a file handle).
   *
   * _WARNING: this method should never be called manually._
   */
  async stop() {}

  /**
   * Enter the context. Implement this method to define the logic that should be
   * done (e.g. creating a shared state, etc.) when a client enters the context.
   *
   * If the context has not been started yet, the `start` method is implicitely executed.
   *
   * _WARNING: this method should never be called manually._
   *
   * @param {server.Client} client - Server-side representation of the client
   *  that enters the context.
   * @returns {Promise} - Promise that resolves when the context is entered.
   * @example
   * class MyContext extends Context {
   *   async enter(client) {
   *     await super.enter(client);
   *     registerTheClientSomewhere(client);
   *   }
   *
   *   async exit(client) {
   *     await super.exit(client);
   *     unregisterTheClientSomewhere(client);
   *   }
   * }
   */
  async enter(client) {
    if (!(client instanceof Client)) {
      throw new Error(`[soundworks.Context] Invalid argument, ${this.name} context ".enter()" method should receive a server-side "soundworks.Client" instance argument`);
    }

    this.clients.add(client);
  }

  /**
   * Exit the context. Implement this method to define the logic that should be
   * done (e.g. delete a shared state, etc.) when a client exits the context.
   *
   * * _WARNING: this method should never be called manually._
   *
   * @param {server.Client} client - Server-side representation of the client
   *  that exits the context.
   * @returns {Promise} - Promise that resolves when the context is exited.
   * @example
   * class MyContext extends Context {
   *   async enter(client) {
   *     await super.enter(client);
   *     this.state = await this.client.stateManager.create('my-context-state');
   *   }
   *
   *   async exit(client) {
   *     await super.exit(client);
   *     await this.state.delete();
   *   }
   * }
   */
  async exit(client) {
    if (!(client instanceof Client)) {
      throw new Error(`[soundworks.Context] Invalid argument, ${this.name}.exit() should receive a server-side "soundworks.Client" instance argument`);
    }

    this.clients.delete(client);
  }
}

export default Context;
