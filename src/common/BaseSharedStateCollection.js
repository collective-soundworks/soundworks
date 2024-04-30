/** @private */
class BaseSharedStateCollection {
  constructor(stateManager, schemaName, filter = null, options = {}) {
    this._stateManager = stateManager;
    this._schemaName = schemaName;
    this._filter = filter;
    this._options = Object.assign({ excludeLocal: false }, options);

    this._schema = null;
    this._states = [];

    this._onUpdateCallbacks = new Set();
    this._onAttachCallbacks = new Set();
    this._onDetachCallbacks = new Set();
    this._unobserve = null;
  }

  /** @private */
  async _init() {
    this._schema = await this._stateManager.getSchema(this._schemaName);

    // if filter is set, check that it contains only valid param names
    if (this._filter !== null) {
      const keys = Object.keys(this._schema);

      for (let filter of this._filter) {
        if (!keys.includes(filter)) {
          throw new ReferenceError(`[SharedStateCollection] Invalid filter key (${filter}) for schema "${this._schemaName}"`)
        }
      }
    }

    this._unobserve = await this._stateManager.observe(this._schemaName, async (schemaName, stateId) => {
      const state = await this._stateManager.attach(schemaName, stateId, this._filter);
      this._states.push(state);

      state.onDetach(() => {
        const index = this._states.indexOf(state);
        this._states.splice(index, 1);

        this._onDetachCallbacks.forEach(callback => callback(state));
      });

      state.onUpdate((newValues, oldValues, context) => {
        Array.from(this._onUpdateCallbacks).forEach(callback => {
          callback(state, newValues, oldValues, context);
        });
      });

      this._onAttachCallbacks.forEach(callback => callback(state));
    }, this._options);
  }

  /**
   * Size of the collection, alias `size`
   * @type {number}
   * @readonly
   */
  get length() {
    return this._states.length;
  }

  /**
   * Size of the collection, , alias `length`
   * @type {number}
   * @readonly
   */
  get size() {
    return this._states.length;
  }

  /**
   * Name of the schema from which the collection has been created.
   * @type {String}
   * @readonly
   */
  get schemaName() {
    return this._schemaName;
  }

  /**
   * Definition of schema from which the collection has been created.
   *
   * @param {string} [name=null] - If given, returns only the definition
   *  corresponding to the given param name.
   * @throws Throws if `name` does not correspond to an existing field
   *  of the schema.
   * @return {object}
   * @example
   * const schema = collection.getSchema();
   */
  getSchema(name = null) {
    if (name) {
      return this._schema[name];
    }

    return this._schema;
  }

  /**
   * Get the default values as declared in the schema.
   *
   * @return {object}
   * @example
   * const defaults = state.getDefaults();
   */
  getDefaults() {
    const defaults = {};
    for (let name in this._schema) {
      defaults[name] = this._schema[name].default;
    }
    return defaults;
  }

  /**
   * Return the current values of all the states in the collection.
   * @return {Object[]}
   */
  getValues() {
    return this._states.map(state => state.getValues());
  }

  /**
   * Return the current values of all the states in the collection.
   *
   * Similar to `getValues` but returns a reference to the underlying value in
   * case of `any` type. May be usefull if the underlying value is big (e.g.
   * sensors recordings, etc.) and deep cloning expensive. Be aware that if
   * changes are made on the returned object, the state of your application will
   * become inconsistent.
   *
   * @return {Object[]}
   */
  getValuesUnsafe() {
    return this._states.map(state => state.getValues());
  }

  /**
   * Return the current param value of all the states in the collection.
   *
   * @param {String} name - Name of the parameter
   * @return {any[]}
   */
  get(name) {
    // we can delegate to the state.get(name) method for throwing in case of filtered
    // keys, as the Promise.all will reject on first reject Promise
    return this._states.map(state => state.get(name));
  }

  /**
   * Similar to `get` but returns a reference to the underlying value in case of
   * `any` type. May be usefull if the underlying value is big (e.g. sensors
   * recordings, etc.) and deep cloning expensive. Be aware that if changes are
   * made on the returned object, the state of your application will become
   * inconsistent.
   *
   * @param {String} name - Name of the parameter
   * @return {any[]}
   */
  getUnsafe(name) {
    // we can delegate to the state.get(name) method for throwing in case of filtered
    // keys, as the Promise.all will reject on first reject Promise
    return this._states.map(state => state.get(name));
  }

  /**
   * Update all states of the collection with given values.
   * @param {object} updates - key / value pairs of updates to apply to the state.
   * @param {mixed} [context=null] - optionnal contextual object that will be propagated
   *   alongside the updates of the state. The context is valid only for the
   *   current call and will be passed as third argument to all update listeners.
   */
  async set(updates, context = null) {
    // we can delegate to the state.set(update) method for throwing in case of
    // filtered keys, as the Promise.all will reject on first reject Promise
    const promises = this._states.map(state => state.set(updates, context));
    return Promise.all(promises);
  }

  /**
   * Subscribe to any state update of the collection.
   *
   * @param {server.SharedStateCollection~onUpdateCallback|client.SharedStateCollection~onUpdateCallback}
   *  callback - Callback to execute when an update is applied on a state.
   * @param {Boolean} [executeListener=false] - Execute the callback immediately
   *  for all underlying states with current state values. (`oldValues` will be
   *  set to `{}`, and `context` to `null`)
   * @returns {Function} - Function that delete the registered listener.
   */
  onUpdate(callback, executeListener = false) {
    this._onUpdateCallbacks.add(callback);

    if (executeListener === true) {
      this._states.forEach(state => {
        const currentValues = state.getValues();
        const oldValues = {};
        const context = null;

        callback(state, currentValues, oldValues, context);
      });
    }

    return () => this._onUpdateCallbacks.delete(callback);
  }

  /**
   * Register a function to execute when a state is added to the collection.
   *
   * @param {Function} callback - callback to execute  when a state is added to
   *   the collection.
   * @param {Function} executeListener - execute the callback with the states
   *   already present in the collection.
   * @returns {Function} - Function that delete the registered listener.
   */
  onAttach(callback, executeListener = false) {
    if (executeListener === true) {
      this._states.forEach(state => callback(state));
    }

    this._onAttachCallbacks.add(callback);

    return () => this._onAttachCallbacks.delete(callback);
  }

  /**
   * Register a function to execute when a state is removed from the collection.
   *
   * @param {Function} callback - callback to execute  when a state is removed
   *   from the collection.
   * @returns {Function} - Function that delete the registered listener.
   */
  onDetach(callback) {
    this._onDetachCallbacks.add(callback);

    return () => this._onDetachCallbacks.delete(callback);
  }

  /**
   * Detach from the collection, i.e. detach all underlying shared states.
   * @type {number}
   */
  async detach() {
    this._unobserve();
    this._onUpdateCallbacks.clear();

    const promises = this._states.map(state => state.detach());
    await Promise.all(promises);

    this._onDetachCallbacks.clear();
  }

  /**
   * Execute the given function once for each states of the collection (see `Array.forEach`).
   *
   * @param {Function} func - A function to execute for each element in the array.
   *  Its return value is discarded.
   */
  forEach(func) {
    this._states.forEach(func);
  }

  /**
   * Creates a new array populated with the results of calling a provided function
   * on every state of the collection (see `Array.map`).
   *
   * @param {Function} func - A function to execute for each element in the array.
   *  Its return value is added as a single element in the new array.
   */
  map(func) {
    return this._states.map(func);
  }

  /**
   * Creates a shallow copy of a portion of the collection, filtered down to just
   * the estates that pass the test implemented by the provided function (see `Array.filter`).
   *
   * @param {Function} func - A function to execute for each element in the array.
   *  It should return a truthy to keep the element in the resulting array, and a f
   *  alsy value otherwise.
   */
  filter(func) {
    return this._states.filter(func);
  }

  /**
   * Sort the elements of the collection in place (see `Array.sort`).
   *
   * @param {Function} func - Function that defines the sort order.
   */
  sort(func) {
    this._states.sort(func);
  }

  /**
   * Returns the first element of the collection that satisfies the provided testing
   * function. If no values satisfy the testing function, undefined is returned.
   *
   * @param {Function} func - Function to execute for each element in the array.
   *  It should return a truthy value to indicate a matching element has been found.
   * @return {}
   */
  find(func) {
    return this._states.find(func);
  }

  /**
   * Iterable API, e.g. for use in `for .. of` loops
   */
  [Symbol.iterator]() {
    let index = 0;

    return {
      next: () => {
        if (index >= this._states.length) {
          return { value: undefined, done: true };
        } else {
          return { value: this._states[index++], done: false };
        }
      },
    };
  }
}

export default BaseSharedStateCollection;
