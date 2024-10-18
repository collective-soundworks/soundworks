import logger from './logger.js';

/**
 * @callback sharedStateCollectionOnUpdateCallback
 * @param {SharedState} state - State that triggered the update.
 * @param {Object} newValues - Key / value pairs of the updates that have been
 *  applied to the state.
 * @param {Object} oldValues - Key / value pairs of the updated params before
 *  the updates has been applied to the state.
 */

/**
 * Delete the registered {@link sharedStateCollectionOnUpdateCallback}.
 *
 * @callback sharedStateCollectionDeleteOnUpdateCallback
 */


/**
 * The `SharedStateCollection` interface represent a collection of all states
 * created from a given class name on the network.
 *
 * It can optionnaly exclude the states created by the current node.
 *
 * See {@link ClientStateManager#getCollection} and
 * {@link ServerStateManager#getCollection} for factory methods API
 *
 * ```
 * const collection = await client.stateManager.getCollection('my-class');
 * const allValues = collection.getValues();
 * collection.onUpdate((state, newValues, oldValues) => {
 *   // do something
 * });
 * ```
 * @hideconstructor
 */
class SharedStateCollection {
  #stateManager = null;
  #className = null;
  #filter = null;
  #options = null;
  #classDescription = null;
  #states = [];
  #onUpdateCallbacks = new Set();
  #onAttachCallbacks = new Set();
  #onDetachCallbacks = new Set();
  #onChangeCallbacks = new Set();
  #unobserve = null;

  constructor(stateManager, className, filter = null, options = {}) {
    this.#stateManager = stateManager;
    this.#className = className;
    this.#filter = filter;
    this.#options = Object.assign({ excludeLocal: false }, options);
  }

  /** @private */
  async _init() {
    this.#classDescription = await this.#stateManager.getClassDescription(this.#className);

    // if filter is set, check that it contains only valid param names
    if (this.#filter !== null) {
      const keys = Object.keys(this.#classDescription);

      for (let filter of this.#filter) {
        if (!keys.includes(filter)) {
          throw new ReferenceError(`[SharedStateCollection] Invalid filter key (${filter}) for class "${this.#className}"`)
        }
      }
    }

    this.#unobserve = await this.#stateManager.observe(this.#className, async (className, stateId) => {
      const state = await this.#stateManager.attach(className, stateId, this.#filter);
      this.#states.push(state);

      state.onDetach(() => {
        const index = this.#states.indexOf(state);
        this.#states.splice(index, 1);

        this.#onDetachCallbacks.forEach(callback => callback(state));
        this.#onChangeCallbacks.forEach(callback => callback());
      });

      state.onUpdate((newValues, oldValues) => {
        this.#onUpdateCallbacks.forEach(callback => callback(state, newValues, oldValues));
        this.#onChangeCallbacks.forEach(callback => callback());
      });

      this.#onAttachCallbacks.forEach(callback => callback(state));
      this.#onChangeCallbacks.forEach(callback => callback());
    }, this.#options);
  }

  /**
   * Size of the collection, alias `size`
   * @type {number}
   * @readonly
   */
  get length() {
    return this.#states.length;
  }

  /**
   * Size of the collection, , alias `length`
   * @type {number}
   */
  get size() {
    return this.#states.length;
  }

  /**
   * Name of the class from which the collection has been created.
   * @type {String}
   */
  get className() {
    return this.#className;
  }

  /**
   * @deprecated Use {@link SharedStateCollection#className} instead.
   */
  get schemaName() {
    logger.deprecated('SharedStateCollection#schemaName', 'SharedStateCollection#className', '4.0.0-alpha.29');
    return this.className;
  }

  /**
   * @deprecated Use {@link SharedStateCollection#getDescription} instead.
   */
  getSchema(paramName = null) {
    logger.deprecated('SharedStateCollection#getSchema', 'SharedStateCollection#getDescription', '4.0.0-alpha.29');
    return this.getDescription(paramName);
  }

  /**
   * Return the underlying {@link SharedStateClassDescription} or the
   * {@link SharedStateParameterDescription} if `paramName` is given.
   *
   * @param {string} [paramName=null] - If defined, returns the parameter
   *  description of the given parameter name rather than the full class description.
   * @return {SharedStateClassDescription|SharedStateParameterDescription}
   * @throws Throws if `paramName` is not null and does not exists.
   * @example
   * const classDescription = collection.getDescription();
   * const paramDescription = collection.getDescription('my-param');
   */
  getDescription(paramName = null) {
    if (paramName) {
      if (!(paramName in this.#classDescription)) {
        throw new ReferenceError(`Cannot execute "getDescription" on "SharedStateCollection": Parameter "${paramName}" does not exists`);
      }

      return this.#classDescription[paramName];
    }

    return this.#classDescription;
  }

  /**
   * Get the default values as declared in the class description.
   *
   * @return {object}
   * @example
   * const defaults = state.getDefaults();
   */
  getDefaults() {
    const defaults = {};
    for (let name in this.#classDescription) {
      defaults[name] = this.#classDescription[name].default;
    }
    return defaults;
  }

  /**
   * Return the current values of all the states in the collection.
   * @return {Object[]}
   */
  getValues() {
    return this.#states.map(state => state.getValues());
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
    return this.#states.map(state => state.getValues());
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
    return this.#states.map(state => state.get(name));
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
    return this.#states.map(state => state.get(name));
  }

  /**
   * Update all states of the collection with given values.
   *
   * The returned `Promise` resolves on a list of objects that contains the applied updates,
   * and resolves after all the `onUpdate` callbacks have resolved themselves
   *
   * @overload
   * @param {object} updates - key / value pairs of updates to apply to the collection.
   * @returns {Promise<Array<Object>>} - Promise to the list of (coerced) updates.
   */
  /**
   * Update all states of the collection with given values.
   *
   * The returned `Promise` resolves on a list of objects that contains the applied updates,
   * and resolves after all the `onUpdate` callbacks have resolved themselves
   *
   * @overload
   * @param {SharedStateParameterName} name - Name of the parameter.
   * @param {*} value - Value of the parameter.
   * @returns {Promise<Array<Object>>} - Promise to the list of (coerced) updates.
   */
  /**
   * Update all states of the collection with given values.
   *
   * The returned `Promise` resolves on a list of objects that contains the applied updates,
   * and resolves after all the `onUpdate` callbacks have resolved themselves
   *
   * Alternative signatures:
   * - `await collection.set(updates)`
   * - `await collection.set(name, value)`
   *
   * @param {object} updates - key / value pairs of updates to apply to the collection.
   * @returns {Promise<Array<Object>>} - Promise to the list of (coerced) updates.
   * @example
   * const collection = await client.stateManager.getCollection('globals');
   * const updates = await collection.set({ myParam: Math.random() });
   */
  async set(...args) {
    // we can delegate to the state.set(update) method for throwing in case of
    // filtered keys, as the Promise.all will reject on first reject Promise
    const promises = this.#states.map(state => state.set(...args));
    return Promise.all(promises);
  }

  /**
   * Subscribe to any state update of the collection.
   *
   * @param {sharedStateCollectionOnUpdateCallback}
   *  callback - Callback to execute when an update is applied on a state.
   * @param {Boolean} [executeListener=false] - Execute the callback immediately
   *  with current state values. Note that `oldValues` will be set to `{}`.
   * @returns {sharedStateCollectionDeleteOnUpdateCallback} - Function that delete
   *  the registered listener.
   */
  onUpdate(callback, executeListener = false) {
    this.#onUpdateCallbacks.add(callback);

    if (executeListener === true) {
      // filter `event: true` parameters from currentValues, having them here is
      // misleading as we are in the context of a callback, not from an active read
      const description = this.getDescription();

      this.#states.forEach(state => {
        const currentValues = state.getValues();

        for (let name in description) {
          if (description[name].event === true) {
            delete currentValues[name];
          }
        }

        callback(state, currentValues, {});
      });
    }

    return () => this.#onUpdateCallbacks.delete(callback);
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
      this.#states.forEach(state => callback(state));
    }

    this.#onAttachCallbacks.add(callback);

    return () => this.#onAttachCallbacks.delete(callback);
  }

  /**
   * Register a function to execute when a state is removed from the collection.
   *
   * @param {Function} callback - callback to execute  when a state is removed
   *   from the collection.
   * @returns {Function} - Function that delete the registered listener.
   */
  onDetach(callback) {
    this.#onDetachCallbacks.add(callback);

    return () => this.#onDetachCallbacks.delete(callback);
  }

  /**
   * Register a function to execute on any change (i.e. create, delete or update)
   * that occurs on the the collection.
   *
   * @param {Function} callback - callback to execute when a change occurs.
   * @returns {Function} - Function that delete the registered listener.
   * @example
   * const collection = await client.stateManager.getCollection('player');
   * collection.onChange(() => renderApp(), true);
   */
  onChange(callback, executeListener = false) {
    if (executeListener === true) {
      callback();
    }

    this.#onChangeCallbacks.add(callback);

    return () => this.#onChangeCallbacks.delete(callback);
  }

  /**
   * Detach from the collection, i.e. detach all underlying shared states.
   * @type {number}
   */
  async detach() {
    this.#unobserve();
    this.#onAttachCallbacks.clear();
    this.#onUpdateCallbacks.clear();

    const promises = this.#states.map(state => state.detach());
    await Promise.all(promises);

    this.#onDetachCallbacks.clear();
    this.#onChangeCallbacks.clear();
  }

  /**
   * Execute the given function once for each states of the collection (see `Array.forEach`).
   *
   * @param {Function} func - A function to execute for each element in the array.
   *  Its return value is discarded.
   */
  forEach(func) {
    this.#states.forEach(func);
  }

  /**
   * Creates a new array populated with the results of calling a provided function
   * on every state of the collection (see `Array.map`).
   *
   * @param {Function} func - A function to execute for each element in the array.
   *  Its return value is added as a single element in the new array.
   */
  map(func) {
    return this.#states.map(func);
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
    return this.#states.filter(func);
  }

  /**
   * Sort the elements of the collection in place (see `Array.sort`).
   *
   * @param {Function} func - Function that defines the sort order.
   */
  sort(func) {
    this.#states.sort(func);
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
    return this.#states.find(func);
  }

  /**
   * Iterable API, e.g. for use in `for .. of` loops
   */
  [Symbol.iterator]() {
    let index = 0;

    return {
      next: () => {
        if (index >= this.#states.length) {
          return { value: undefined, done: true };
        } else {
          return { value: this.#states[index++], done: false };
        }
      },
    };
  }
}

export default SharedStateCollection;
