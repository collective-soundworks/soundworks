import Context from './Context.js';
import {
  CONTEXT_ENTER_REQUEST,
  CONTEXT_ENTER_RESPONSE,
  CONTEXT_ENTER_ERROR,
  CONTEXT_EXIT_REQUEST,
  CONTEXT_EXIT_RESPONSE,
  CONTEXT_EXIT_ERROR,
} from '../common/constants.js';

// for testing purposes
export const kContextManagerContexts = Symbol('soundworks:context-manager-contexts');

/**
 * Create a dummy server side context if a proper server-side context has not
 * been declared and registered, one DefaultContext is created per unknown
 * contextName and associated to all known client types.
 *
 * @private
 */
function createNamedContextClass(contextName) {
  return class DefaultContext extends Context {
    get name() {
      return contextName;
    }
  };
}

/** @private */
class ContextCollection {
  #inner = [];

  // for testing purposes
  get length() {
    return this.#inner.length;
  }

  add(context) {
    this.#inner.push(context);
  }

  has(name) {
    return this.#inner.find(c => c.name === name) !== undefined;
  }

  get(name) {
    return this.#inner.find(c => c.name === name);
  }

  map(func) {
    return this.#inner.map(func);
  }

  filter(func) {
    return this.#inner.filter(func);
  }
}

/**
 * Manage the different server-side contexts and their lifecycle.
 *
 * The `ServerContextManager` is automatically instantiated by the {@link server.Server}.
 *
 * _WARNING: Most of the time, you should not have to manipulate the context manager directly._
 *
 * @hideconstructor
 */
class ServerContextManager {
  #server = null;

  #contextStartPromises = new Map();

  /**
   * @param {server.Server} server - Instance of the soundworks server.
   */
  constructor(server) {
    this.#server = server;

    this[kContextManagerContexts] = new ContextCollection();
  }

  /**
   * Retrieve a started context from its name.
   *
   * _WARNING: Most of the time, you should not have to call this method manually._
   *
   * @param {server.Context#name} contextName - Name of the context.
   */
  async get(contextName) {
    if (!this[kContextManagerContexts].has(contextName)) {
      throw new Error(`[soundworks:ServerContextManager] Can't get context "${contextName}", not registered`);
    }

    const context = this[kContextManagerContexts].get(contextName);

    if (this.#contextStartPromises.has(contextName)) {
      const startPromise = this.#contextStartPromises.get(contextName);
      await startPromise;
    } else {
      context.status = 'inited';

      try {
        const startPromise = context.start();
        this.#contextStartPromises.set(contextName, startPromise);
        await startPromise;
        context.status = 'started';
      } catch (err) {
        context.status = 'errored';
        throw new Error(err);
      }
    }

    return context;
  }

  /**
   * Register a context in the manager.
   * This method is called in the {@link server.Context} constructor
   *
   * @param {server.Context} context - Context instance to register.
   *
   * @private
   */
  register(context) {
    // we must await the contructor initialization end to check the name and throw
    if (this[kContextManagerContexts].has(context.name)) {
      throw new Error(`[soundworks:ServerContextManager] Context "${context.name}" already registered`);
    }

    this[kContextManagerContexts].add(context);
  }

  /**
   * Called when a client connects to the server (websocket handshake)
   *
   * @param {server.Client} client
   *
   * @private
   */
  addClient(client) {
    client.socket.addListener(CONTEXT_ENTER_REQUEST, async (reqId, contextName) => {
      // if no context found, create a DefaultContext on the fly
      if (!this[kContextManagerContexts].has(contextName)) {
        // create default context for all client types
        const ctor = createNamedContextClass(contextName);
        // this will automatically register the context in the context manager
        new ctor(this.#server);
      }

      // we ensure context is started, even lazilly after server.start()
      let context;
      try {
        context = await this.get(contextName);
      } catch (err) {
        client.socket.send(
          CONTEXT_ENTER_ERROR,
          reqId,
          contextName,
          err.message,
        );
        return;
      }

      // don't do this check with default context to allow several parallel
      // contexts client side with no server-side part.
      if (context && context.clients.has(client)) {
        client.socket.send(
          CONTEXT_ENTER_ERROR,
          reqId,
          contextName,
          `[soundworks:ServerContextManager] Client already in context (if only one context is created .enter() has been called automatically)`,
        );
        return;
      }

      // use default context if no server-side context part defined
      if (context === undefined) {
        context = this.defaultContext;
      }

      if (!context.roles.has(client.role)) {
        client.socket.send(
          CONTEXT_ENTER_ERROR,
          reqId,
          contextName,
          `[soundworks:ServerContextManager] Clients with role "${client.role}" are not declared as possible consumers of context "${contextName}"`,
        );
        return;
      }

      try {
        await context.enter(client);

        client.socket.send(CONTEXT_ENTER_RESPONSE, reqId, contextName);
      } catch (err) {
        client.socket.send(CONTEXT_ENTER_ERROR, reqId, contextName, err.message);
      }
    });

    client.socket.addListener(CONTEXT_EXIT_REQUEST, async (reqId, contextName) => {
      if (!this[kContextManagerContexts].has(contextName)) {
        client.socket.send(
          CONTEXT_EXIT_ERROR,
          reqId,
          contextName,
          `[soundworks:ServerContextManager] Cannot exit(), context ${contextName} does not exists`,
        );
        return;
      }

      let context = await this.get(contextName);

      if (context.clients.has(client)) {
        try {
          await context.exit(client);
          client.socket.send(CONTEXT_EXIT_RESPONSE, reqId, contextName);
        } catch (err) {
          client.socket.send(CONTEXT_EXIT_ERROR, reqId, contextName, err.message);
        }
      } else {
        client.socket.send(
          CONTEXT_EXIT_ERROR,
          reqId,
          contextName,
          `[soundworks:ServerContextManager] Client with role "${client.role}" is not in context "${contextName}"`,
        );
      }
    });
  }

  /**
   * Called when a client connects to the server (websocket 'close' event)
   *
   * @param {server.Client} client
   *
   * @private
   */
  async removeClient(client) {
    client.socket.removeAllListeners(CONTEXT_ENTER_REQUEST);
    client.socket.removeAllListeners(CONTEXT_EXIT_REQUEST);

    // exit from all contexts
    const promises = this[kContextManagerContexts]
      .filter(context => context.clients.has(client))
      .map(context => context.exit(client));

    await Promise.all(promises);
  }

  /**
   * Start all contexts registered before `await server.start()`.
   * Called on {@link server.Server#start}
   *
   * @private
   */
  async start() {
    const promises = this[kContextManagerContexts].map(context => this.get(context.name));
    await Promise.all(promises);
  }

  /**
   * Stop all contexts. Called on {@link server.Server#stop}
   *
   * @private
   */
  async stop() {
    const promises = this[kContextManagerContexts].map(context => context.stop());
    await Promise.all(promises);
  }
}

export default ServerContextManager;
