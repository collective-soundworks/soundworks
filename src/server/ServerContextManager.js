import Server from './Server.js';
import ServerContext, {
  kServerContextStatus,
} from './ServerContext.js';
import {
  CONTEXT_ENTER_REQUEST,
  CONTEXT_ENTER_RESPONSE,
  CONTEXT_ENTER_ERROR,
  CONTEXT_EXIT_REQUEST,
  CONTEXT_EXIT_RESPONSE,
  CONTEXT_EXIT_ERROR,
} from '../common/constants.js';

export const kServerContextManagerStart = Symbol('soundworks:server-context-manager-start');
export const kServerContextManagerStop = Symbol('soundworks:server-context-manager-stop');
export const kServerContextManagerAddClient = Symbol('soundworks:server-context-manager-add-client');
export const kServerContextManagerRemoveClient = Symbol('soundworks:server-context-manager-remove-client');
export const kServerContextManagerRegister = Symbol('soundworks:server-context-manager-register');
// for testing purposes
export const kServerContextManagerContexts = Symbol('soundworks:server-context-manager-contexts');

/**
 * Create a dummy server side context if a proper server-side context has not
 * been declared and registered. Ane DefaultContext is created per unknown
 * contextName and associated to all known client types.
 * @private
 */
function createNamedContextClass(contextName) {
  return class DefaultContext extends ServerContext {
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
 * The `ServerContextManager` is automatically instantiated by the {@link Server}.
 *
 * _WARNING: Most of the time, you should not have to manipulate the context manager directly._
 *
 * @hideconstructor
 */
class ServerContextManager {
  #server = null;

  #contextStartPromises = new Map();

  /**
   * @param {Server} server - Instance of the soundworks server.
   */
  constructor(server) {
    if (!(server instanceof Server)) {
      throw new TypeError(`Cannot construct 'ServerContextManager': argument 1 must be an instance of Server`);
    }

    this.#server = server;

    this[kServerContextManagerContexts] = new ContextCollection();
  }

  /**
   * Register a context in the manager.
   * This method is called in the {@link ServerContext} constructor
   *
   * @param {ServerContext} context - Context instance to register.
   *
   * @private
   */
  [kServerContextManagerRegister](context) {
    // we must await the constructor initialization end to check the name and throw
    if (this[kServerContextManagerContexts].has(context.name)) {
      throw new DOMException(`Cannot register '${context.name}': a Context with same name has already been registered`, 'NotSupportedError');
    }

    this[kServerContextManagerContexts].add(context);
  }

  /**
   * Start all contexts registered before `await server.start()`.
   * Called on {@link Server#start}
   *
   * @private
   */
  async [kServerContextManagerStart]() {
    const promises = this[kServerContextManagerContexts].map(context => this.get(context.name));
    await Promise.all(promises);
  }

  /**
   * Stop all contexts. Called on {@link Server#stop}
   *
   * @private
   */
  async [kServerContextManagerStop]() {
    const promises = this[kServerContextManagerContexts].map(context => context.stop());
    await Promise.all(promises);
  }

  /**
   * Called when a client connects to the server (websocket handshake)
   *
   * @param {ServerClient} client
   *
   * @private
   */
  [kServerContextManagerAddClient](client) {
    client.socket.addListener(CONTEXT_ENTER_REQUEST, async (reqId, contextName) => {
      // if no context found, create a DefaultContext on the fly
      if (!this[kServerContextManagerContexts].has(contextName)) {
        // create default context for all client types
        const ctor = createNamedContextClass(contextName);
        // this will automatically register the context in the context manager
        new ctor(this.#server);
      }

      // we ensure context is started, even lazily after server.start()
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
          `Client already in context: if only one context is created 'enter' is called automatically)`,
        );
        return;
      }

      // use default context if no server-side context part defined
      if (context === undefined) {
        context = this.defaultContext;
      }

      if (context.roles.size > 0 && !context.roles.has(client.role)) {
        client.socket.send(
          CONTEXT_ENTER_ERROR,
          reqId,
          contextName,
          `Clients with role "${client.role}" are not declared as possible consumers of "${contextName}"`,
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
      if (!this[kServerContextManagerContexts].has(contextName)) {
        client.socket.send(
          CONTEXT_EXIT_ERROR,
          reqId,
          contextName,
          `Context ${contextName} does not exists`,
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
          `Client with role "${client.role}" is not entered in context "${contextName}"`,
        );
      }
    });
  }

  /**
   * Called when a client connects to the server (websocket 'close' event)
   *
   * @param {ServerClient} client
   *
   * @private
   */
  async [kServerContextManagerRemoveClient](client) {
    client.socket.removeAllListeners(CONTEXT_ENTER_REQUEST);
    client.socket.removeAllListeners(CONTEXT_EXIT_REQUEST);

    // exit from all contexts
    const promises = this[kServerContextManagerContexts]
      .filter(context => context.clients.has(client))
      .map(context => context.exit(client));

    await Promise.all(promises);
  }

  /**
   * Retrieve a started context from its name.
   *
   * _WARNING: Most of the time, you should not have to call this method manually._
   *
   * @param {ServerContext#name} contextName - Name of the context.
   */
  async get(contextName) {
    if (!this[kServerContextManagerContexts].has(contextName)) {
      throw new ReferenceError(`Cannot execute 'get' on ServerContextManager: Context '${contextName}' is not defined`);
    }

    const context = this[kServerContextManagerContexts].get(contextName);

    if (this.#contextStartPromises.has(contextName)) {
      const startPromise = this.#contextStartPromises.get(contextName);
      await startPromise;
    } else {
      context[kServerContextStatus] = 'inited';

      try {
        const startPromise = context.start();
        this.#contextStartPromises.set(contextName, startPromise);
        await startPromise;
        context[kServerContextStatus] = 'started';
      } catch (err) {
        context[kServerContextStatus] = 'errored';
        throw new Error(err);
      }
    }

    return context;
  }
}

export default ServerContextManager;
