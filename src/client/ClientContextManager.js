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

  constructor() {}

  /**
   * Register the context into the manager. Is called in context constructor.
   *
   * @param {ClientContext} context - The context to be registered.
   * @private
   */
  register(context) {
    if (this.#contexts.has(context.name)) {
      throw new Error(`[soundworks:context-manager] Context "${context.name}" already registered`);
    }

    this.#contexts.add(context);
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
      throw new Error(`[soundworks:ClientContextManager] Can't get context "${contextName}", not registered`);
    }

    const context = this.#contexts.get(contextName);

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
   * Start all registered contexts. Called during `client.start()`
   * @private
   */
  async start() {
    const promises = this.#contexts.map(context => this.get(context.name));
    await Promise.all(promises);
  }

  /**
   * Stop all registered contexts. Called during `client.stop()`
   * @private
   */
  async stop() {
    const promises = this.#contexts.map(context => context.stop());
    await Promise.all(promises);
  }
}

export default ClientContextManager;
