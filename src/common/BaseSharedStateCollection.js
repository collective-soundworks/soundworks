/**
 * @private
 */
class BaseSharedStateCollection {
  constructor(stateManager, schemaName) {
    this._stateManager = stateManager;
    this._schemaName = schemaName;
    this._states = [];
    this._onUpdateCallbacks = new Set();
    this._onAttachCallbacks = new Set();
    this._onDetachCallbacks = new Set();
    this._unobserve = null;
  }

  async _init() {
    this._unobserve = await this._stateManager.observe(this._schemaName, async (schemaName, stateId, nodeId) => {
      const state = await this._stateManager.attach(schemaName, stateId);

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
    });
  }

  /**
   * Size of the collection
   * @type {number}
   */
  get length() {
    return this._states.length;
  }

  /**
   * Detach from the collection, i.e. detach all underlying shared states.
   * @type {number}
   */
  async detach() {
    this._unobserve();

    const promises = Array.from(this._states).map(state => state.detach());
    await Promise.all(promises);

    this._onUpdateCallbacks.clear();
    this._onDetachCallbacks.clear();
  }

  /**
   * Return the current values of all the states in the collection.
   * @return {Object[]}
   */
  getValues() {
    return this._states.map(state => state.getValues());
  }

  /**
   * Return the current param value of all the states in the collection.
   *
   * @param {String} name - Name of the parameter
   * @return {any[]}
   */
  get(name) {
    return this._states.map(state => state.get(name));
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
   */
  onAttach(callback) {
    this._onAttachCallbacks.add(callback);
  }

  /**
   * Register a function to execute when a state is removed from the collection.
   *
   * @param {Function} callback - callback to execute  when a state is removed
   *   from the collection.
   */
  onDetach(callback) {
    this._onDetachCallbacks.add(callback);
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
}

export default BaseSharedStateCollection;
