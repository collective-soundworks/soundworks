import Client from './Client.js';
import {
  kClientContextManagerRegister,
} from './ClientContextManager.js';
import PromiseStore from '../common/PromiseStore.js';
import {
  CONTEXT_ENTER_REQUEST,
  CONTEXT_ENTER_RESPONSE,
  CONTEXT_ENTER_ERROR,
  CONTEXT_EXIT_REQUEST,
  CONTEXT_EXIT_RESPONSE,
  CONTEXT_EXIT_ERROR,
} from '../common/constants.js';

export const kClientContextStatus = Symbol('soundworks:client-context-status');

// share between all context, as channels are common to all contexts
const promiseStore = new PromiseStore('Context');

/**
 * Base class to extend in order to implement a new Context.
 *
 * In the `soundworks` paradigm, a client has a "role" (e.g. _player_, _controller_)
 * see {@link Client#role}) and can be in different "contexts" (e.g. different
 * part of the experience such as sections of a music piece, etc.). This class
 * provides a simple and unified way to model these recurring aspects of an application.
 *
 * You can also think of a `Context` as a state of a state machine from which a
 * client can `enter()` or `exit()` (be aware that `soundworks` does not provide
 * an implementation for the state machine).
 *
 * Optionally, a `Context` can also have a server-side counterpart to perform
 * some logic (e.g. updating some global shared state) when a client enters or exits
 * the context. In such case, `soundworks` guarantees that the server-side
 * logic is executed before the `enter()` and `exit()` promises are fulfilled.
 *
 * ```js
 * import { Client, ClientContext } from '@soundworks/core/index.js'
 *
 * const client = new Client(config);
 *
 * class MyContext extends ClientContext {
 *   async enter() {
 *     await super.enter();
 *     console.log(`client ${this.client.id} entered my context`);
 *   }
 *
 *   async exit() {
 *     await super.exit();
 *     console.log(`client ${this.client.id} exited my context`);
 *   }
 * }
 * const myContext = new MyContext(client);
 *
 * await client.start();
 * await myContext.enter();
 *
 * await new Promise(resolve => setTimeout(resolve, 2000));
 * await myContext.exit();
 * ```
 */
class ClientContext {
  #client = null;

  /**
   * @param {Client} client - The soundworks client instance.
   * @throws Will throw if the first argument is not a soundworks client instance.
   */
  constructor(client) {
    if (!(client instanceof Client)) {
      throw new TypeError(`Cannot create 'ClientContext' (${this.name}): Argument 1 must be an instance of Client`);
    }

    this.#client = client;
    this[kClientContextStatus] = 'idle';

    this.#client.socket.addListener(CONTEXT_ENTER_RESPONSE, (reqId, contextName) => {
      if (contextName !== this.name) {
        return;
      }

      promiseStore.resolve(reqId);
    });

    this.#client.socket.addListener(CONTEXT_ENTER_ERROR, (reqId, contextName, msg) => {
      if (contextName !== this.name) {
        return;
      }

      promiseStore.reject(reqId, `Cannot execute 'enter' on Context: ${msg}`);
    });

    this.#client.socket.addListener(CONTEXT_EXIT_RESPONSE, (reqId, contextName) => {
      if (contextName !== this.name) {
        return;
      }

      promiseStore.resolve(reqId);
    });

    this.#client.socket.addListener(CONTEXT_EXIT_ERROR, (reqId, contextName, msg) => {
      if (contextName !== this.name) {
        return;
      }

      promiseStore.reject(reqId, `Cannot execute 'exit' on Context: ${msg}`);
    });

    this.#client.contextManager[kClientContextManagerRegister](this);
  }

  /**
   * The soundworks client instance.
   * @type {Client}
   */
  get client() {
    return this.#client;
  }

  /**
   * Status of the context.
   * @type {'idle'|'inited'|'started'|'errored'}
   */
  get status() {
    return this[kClientContextStatus];
  }

  /**
   * Optional user-defined name of the context (defaults to the class name).
   *
   * The context manager will match the client-side and server-side contexts based
   * on this name. If the {@link ServerContextManager} don't find a corresponding
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
   * Start the context. This method is lazily called when the client enters the
   * context for the first time (cf. ${ClientContext#enter}). If you know some
   * some heavy and/or potentially long job has to be done  when starting the context
   * (e.g. call to a web service) it may be a good practice to call it explicitly.
   *
   * This method should be implemented to perform operations that are valid for the
   * whole lifetime of the context, regardless the client enters or exits the context.
   *
   * @example
   * import { Context } from '@soundworks/core/client.js';
   *
   * class MyContext extends Context {
   *   async start() {
   *     await super.start();
   *     await this.doSomeLongJob();
   *   }
   * }
   *
   * // Instantiate the context
   * const myContext = new Context(client);
   * // manually start the context to perform the long operation before the client
   * // enters the context.
   * await myContext.start();
   */
  async start() {}

  /**
   * Stop the context. This method is automatically called when `await client.stop()`
   * is called. It should be used to cleanup context wise operations made in `start()`
   * (e.g. destroy the reusable audio graph).
   *
   * _WARNING: this method should never be called manually._
   */
  async stop() {}

  /**
   * Enter the context. Implement this method to define the logic that should be
   * done (e.g. creating a shared state, etc.) when the context is entered.
   *
   * If a server-side part of the context is defined (i.e. a context with the same
   * {@link ClientContext#name}), the corresponding server-side `enter()` method
   * will be executed before the returned Promise is fulfilled.
   *
   * If the context has not been started yet, the `start` method is implicitly executed.
   *
   * @returns {Promise<void>} - Promise that resolves when the context is entered.
   * @example
   * class MyContext extends Context {
   *   async enter() {
   *     await super.enter();
   *     this.state = await this.client.stateManager.create('my-context-state');
   *   }
   *
   *   async exit() {
   *     await super.exit();
   *     await this.state.delete();
   *   }
   * }
   */
  async enter() {
    // lazily start the context if registered after `client.start()`
    if (this.status !== 'started' && this.status !== 'errored') {
      await this.#client.contextManager.get(this.name);
    }

    // we need the try/catch block to change the promise rejection into proper error
    try {
      await new Promise((resolve, reject) => {
        const reqId = promiseStore.add(resolve, reject, 'ClientContext#enter');
        this.#client.socket.send(CONTEXT_ENTER_REQUEST, reqId, this.name);
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Exit the context. Implement this method to define the logic that should be
   * done (e.g. delete a shared state, etc.) when the context is exited.
   *
   * If a server-side part of the context is defined (i.e. a context with the same
   * {@link ClientContext#name}), the corresponding server-side `exit()` method
   * will be executed before the returned Promise is fulfilled.
   *
   * @returns {Promise<void>} - Promise that resolves when the context is exited.
   * @example
   * class MyContext extends Context {
   *   async enter() {
   *     await super.enter();
   *     this.state = await this.client.stateManager.create('my-context-state');
   *   }
   *
   *   async exit() {
   *     await super.exit();
   *     await this.state.delete();
   *   }
   * }
   */
  async exit() {
    // we need the try/catch block to change the promise rejection into proper error
    try {
      await new Promise((resolve, reject) => {
        const reqId = promiseStore.add(resolve, reject, 'ClientContext#exit');
        this.#client.socket.send(CONTEXT_EXIT_REQUEST, reqId, this.name);
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default ClientContext;
