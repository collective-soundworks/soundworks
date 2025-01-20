import {
  kClientContextStatus,
} from './ClientContext.js';

export const kClientContextManagerStart = Symbol('soundworks:client-context-manager-start');
export const kClientContextManagerStop = Symbol('soundworks:client-context-manager-stop');
export const kClientContextManagerRegister = Symbol('soundworks:client-context-manager-register');

/** @private */
class ContextCollection {
  #inner = [];

  constructor() {
    this.#inner = [];
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
}

/**
 * Manage the different contexts and their lifecycle.
 *
 * See {@link Client#contextManager}
 *
 * _WARNING: In most cases, you should not have to manipulate the context manager directly._
 *
 * @hideconstructor
 */
class ClientContextManager {
  #contexts = new ContextCollection();
  #contextStartPromises = new Map();

  /**
   * Register the context into the manager. Is called in context constructor.
   *
   * @param {ClientContext} context - The context to be registered.
   * @private
   */
  [kClientContextManagerRegister](context) {
    if (this.#contexts.has(context.name)) {
      throw new DOMException(`Cannot register '${context.name}': a Context with same name has already been registered`, 'NotSupportedError');
    }

    this.#contexts.add(context);
  }

  /**
   * Start all registered contexts. Called during `client.start()`
   * @private
   */
  async [kClientContextManagerStart]() {
    const promises = this.#contexts.map(context => this.get(context.name));
    await Promise.all(promises);
  }

  /**
   * Stop all registered contexts. Called during `client.stop()`
   * @private
   */
  async [kClientContextManagerStop]() {
    const promises = this.#contexts.map(context => context.stop());
    await Promise.all(promises);
  }

  /**
   * Retrieve a started context from its name.
   *
   * _WARNING: Most of the time, you should not have to call this method manually._
   *
   * @param {string} contextName - Name of the context.
   * @returns {Promise<ClientContext>}
   */
  async get(contextName) {
    if (!this.#contexts.has(contextName)) {
      throw new ReferenceError(`Cannot execute 'get' on ClientContextManager: Context '${contextName}' is not registered`);
    }

    const context = this.#contexts.get(contextName);

    if (this.#contextStartPromises.has(contextName)) {
      const startPromise = this.#contextStartPromises.get(contextName);
      await startPromise;
    } else {
      context[kClientContextStatus] = 'inited';

      try {
        const startPromise = context.start();
        this.#contextStartPromises.set(contextName, startPromise);
        await startPromise;
        context[kClientContextStatus] = 'started';
      } catch (err) {
        context[kClientContextStatus] = 'errored';
        throw new Error(`Cannot execute 'get' on ClientContextManager: ${err.message}`);
      }
    }

    return context;
  }
}

export default ClientContextManager;
