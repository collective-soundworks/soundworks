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
 * Manager the different contexts and their lifecycle.
 * Most of the time, you should not ahve to manipulate the context manager directly
 */
class ContextManager {
  constructor() {
    /** @private */
    this._contexts = new ContextCollection();
    /** @private */
    this._contextStartPromises = new Map();
  }

  /** @private */
  register(context) {
    if (this._contexts.has(context.name)) {
      throw new Error(`[soundworks:context-manager] Context "${context.name}" already registered`);
    }

    this._contexts.add(context);
  }

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
      } catch(err) {
        context.status = 'errored';
        throw new Error(err);
      }
    }

    return context;
  }

  async start() {
    const promises = this._contexts.map(context => this.get(context.name));
    await Promise.all(promises);
  }

  async stop() {
    const promises = this._contexts.map(context => context.stop());
    await Promise.all(promises);
  }
}

export default ContextManager;
