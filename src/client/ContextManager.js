/** @private */
class ContextCollection {
  constructor() {
    this.inner = [];
  }

  add(context) {
    this.inner.push(context);
  }

  has(name) {
    return this.inner.find(c => c.name === name) !== undefined;
  }

  get(name) {
    return this.inner.find(c => c.name === name);
  }

  map(func) {
    return this.inner.map(func);
  }
}

/**
 * Manage the different contexts and their lifecycle.
 *
 * See {@link client.Client#contextManager}
 *
 * _WARNING: In most cases, you should not have to manipulate the context manager directly._
 *
 * @memberof client
 * @hideconstructor
 */
class ContextManager {
  constructor() {
    /** @private */
    this._contexts = new ContextCollection();
    /** @private */
    this._contextStartPromises = new Map();
  }

  /**
   * Register the context into the manager. Is called in context constructor.
   *
   * @param {client.Context} context - The context to be registered.
   * @private
   */
  register(context) {
    if (this._contexts.has(context.name)) {
      throw new Error(`[soundworks:context-manager] Context "${context.name}" already registered`);
    }

    this._contexts.add(context);
  }

  /**
   * Retrieve a started context from its name.
   *
   * _WARNING: Most of the time, you should not have to call this method manually._
   *
   * @param {client.Context#name} contextName - Name of the context.
   */
  async get(contextName) {
    if (!this._contexts.has(contextName)) {
      throw new Error(`[soundworks:ContextManager] Can't get context "${contextName}", not registered`);
    }

    const context = this._contexts.get(contextName);

    if (this._contextStartPromises.has(contextName)) {
      const startPromise = this._contextStartPromises.get(contextName);
      await startPromise;
    } else {
      context.status = 'inited';

      try {
        const startPromise = context.start();
        this._contextStartPromises.set(contextName, startPromise);
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
   *
   * @private
   */
  async start() {
    const promises = this._contexts.map(context => this.get(context.name));
    await Promise.all(promises);
  }

  /**
   * Stop all registered contexts. Called during `client.stop()`
   *
   * @private
   */
  async stop() {
    const promises = this._contexts.map(context => context.stop());
    await Promise.all(promises);
  }
}

export default ContextManager;
