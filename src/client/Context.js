import Client from './Client.js';
import {
  CONTEXT_ENTER_REQUEST,
  CONTEXT_ENTER_RESPONSE,
  CONTEXT_ENTER_ERROR,
  CONTEXT_EXIT_REQUEST,
  CONTEXT_EXIT_RESPONSE,
  CONTEXT_EXIT_ERROR,
} from '../common/constants.js';
import {
  storeRequestPromise,
  resolveRequest,
  rejectRequest,
} from '../common/promise-store.js';

/**
 * Base class to extend for implementing a client of a soundworks application.
 *
 * @memberof client
 */
class Context {
  /**
   * @param {client.Client} client - The soundworks client instance.
   * @throws Will throw if the first argument is not a soundworks client instance.
   */
  constructor(client) {
    if (!(client instanceof Client)) {
      throw new Error(`[soundworks:Context] Invalid argument, context "${this.name}" should receive a "soundworks.Client" instance as first argument`);
    }

    /**
     * The soundworks client instance
     */
    this.client = client;

    /**
     * Status os the context ['idle', 'inited', 'started', 'errored']
     */
    this.status = 'idle';

    this.client.socket.addListener(CONTEXT_ENTER_RESPONSE, (reqId, contextName) => {
      if (contextName !== this.name) {
        return;
      }

      resolveRequest(reqId);
    });

    this.client.socket.addListener(CONTEXT_ENTER_ERROR, (reqId, contextName, msg) => {
      if (contextName !== this.name) {
        return;
      }

      rejectRequest(reqId, msg);
    });

    this.client.socket.addListener(CONTEXT_EXIT_RESPONSE, (reqId, contextName) => {
      if (contextName !== this.name) {
        return;
      }

      resolveRequest(reqId);
    });

    this.client.socket.addListener(CONTEXT_EXIT_ERROR, (reqId, contextName, msg) => {
      if (contextName !== this.name) {
        return;
      }

      rejectRequest(reqId, msg);
    });

    this.client.contextManager.register(this);
  }

  /**
   * Getter that returns the name of the context, override to use a user-defined name
   *
   * @returns {string} - Name of the context.
   */
  get name() {
    return this.constructor.name;
  }


  /**
   * Start the context, this method is automatically called when `await client.start()`
   * is called.
   *
   * Should be overriden to handle application wise behavior regardeless the client
   * enters or exists the context.
   */
  async start() {}

  /**
   * Stop the context, this method is automatically called when `await client.stop()`
   * is called.
   *
   * Should be overriden to handle application wise behavior regardeless the client
   * enters or exists the context.
   */
  async stop() {}

  /**
   * Enter the context. If a server-side part of the context is defined (i.e. a
   * context with the same class name or user-defined name), the corresponding
   * server-side `enter()` method will be executed before the returned Promise
   * resolves.
   *
   * If the context has not been started yet, the `start` method is lazily called.
   *
   * @returns {Promise} - Promise that resolves when the context is entered.
   */
  async enter() {
    // lazily start the context if registered after `client.start()`
    if (this.status !== 'started' && this.status !== 'errored') {
      await this.client.contextManager.get(this.name);
    }

    // we need the try/catch block to change the promise rejection into proper error
    try {
      await new Promise((resolve, reject) => {
        const reqId = storeRequestPromise(resolve, reject);
        this.client.socket.send(CONTEXT_ENTER_REQUEST, reqId, this.name);
      });
    } catch(err) {
      throw new Error(err);
    }
  }

  /**
   * Exit the context. If a server-side part of the context is defined (i.e. a
   * context with the same class name or user-defined name), the corresponding
   * server-side `exit()` method will be executed before the returned Promise
   * resolves.
   *
   *
   * @returns {Promise} - Promise that resolves when the context is exited.
   */
  async exit() {
    // we need the try/catch block to change the promise rejection into proper error
    try {
      await new Promise((resolve, reject) => {
        const reqId = storeRequestPromise(resolve, reject);
        this.client.socket.send(CONTEXT_EXIT_REQUEST, reqId, this.name);
      });
    } catch(err) {
      throw new Error(err);
    }
  }
}

export default Context;
