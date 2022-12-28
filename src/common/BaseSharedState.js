import ParameterBag from './ParameterBag.js';
import {
  DELETE_REQUEST,
  DELETE_RESPONSE,
  DELETE_ERROR,
  DELETE_NOTIFICATION,
  DETACH_REQUEST,
  DETACH_RESPONSE,
  DETACH_ERROR,
  UPDATE_REQUEST,
  UPDATE_RESPONSE,
  UPDATE_ABORT,
  UPDATE_NOTIFICATION,
} from './constants.js';
import {
  storeRequestPromise,
  resolveRequest,
  rejectRequest,
} from './promise-store.js';

class BaseSharedState {
  constructor(id, remoteId, schemaName, schema, client, isOwner, manager, initValues = {}) {
    this.id = id;
    this.remoteId = remoteId;
    this.schemaName = schemaName;

    /** @private */
    this._isOwner = isOwner; // may be the server or any client
    /** @private */
    this._client = client;
    /** @private */
    this._manager = manager;

    try {
      /** @private */
      this._parameters = new ParameterBag(schema, initValues);
    } catch(err) {
      console.error(err.stack);

      throw new Error(`Error creating or attaching state "${schemaName}" w/ values:\n
${JSON.stringify(initValues, null, 2)}`);
    }

    /** @private */
    this._onUpdateCallbacks = new Set();
    /** @private */
    this._onDetachCallbacks = new Set();
    /** @private */
    this._onDeleteCallbacks = new Set();

    // add listener for state updates
    this._client.transport.addListener(`${UPDATE_RESPONSE}-${this.id}-${this.remoteId}`, async (reqId, updates, context) => {
      const updated = await this._commit(updates, context, true, true);
      resolveRequest(reqId, updated);
    });

    // retrieve values but do not propagate to subscriptions
    this._client.transport.addListener(`${UPDATE_ABORT}-${this.id}-${this.remoteId}`, async (reqId, updates, context) => {
      const updated = await this._commit(updates, context, false, true);
      resolveRequest(reqId, updated);
    });

    this._client.transport.addListener(`${UPDATE_NOTIFICATION}-${this.id}-${this.remoteId}`, async (updates, context) => {
      // https://github.com/collective-soundworks/soundworks/issues/18
      //
      // # note: 2002-10-03
      //
      // `setTimeout(async () => this._commit(updates, context, true, false));`
      // appears to be the only way to push the update commit in the next event
      // cycle so that `attach` can resolve before the update notification is
      // actually dispatched. The alternative:
      // `Promise.resolve().then(() => this._commit(updates, context, true, false))``
      // does not behave as expected...
      //
      // However this breaks the reliability of:
      // ```
      // /* given a0, a1 and a2 being 3 similar attached states */
      // await state.set({ int: i });
      //
      // assert.equal(a0.get('int'), i);
      // assert.equal(a1.get('int'), i);
      // assert.equal(a2.get('int'), i);
      // ```
      // which is far more important than the edge case reported in the issue
      // therefore this wont be fixed for now
      this._commit(updates, context, true, false);
    });

    // ---------------------------------------------
    // DELETE initiated by creator, or schema deleted
    // ---------------------------------------------
    this._client.transport.addListener(`${DELETE_NOTIFICATION}-${this.id}-${this.remoteId}`, () => {
      this._manager._statesById.delete(this.id);
      this._clearTransport();

      this._onDetachCallbacks.forEach(callback => callback());
      this._onDeleteCallbacks.forEach(callback => callback());

      this._clearDetach();
    });


    if (this._isOwner) {
      // ---------------------------------------------
      // DELETE (can only delete if creator)
      // ---------------------------------------------
      this._client.transport.addListener(`${DELETE_RESPONSE}-${this.id}-${this.remoteId}`, (reqId) => {
        this._manager._statesById.delete(this.id);
        this._clearTransport();

        this._onDetachCallbacks.forEach(callback => callback());
        this._onDeleteCallbacks.forEach(callback => callback());

        this._clearDetach();
        resolveRequest(reqId, this);
      });

      this._client.transport.addListener(`${DELETE_ERROR}-${this.id}`, (reqId, msg) => {
        rejectRequest(reqId, msg);
      });

    } else {
      // ---------------------------------------------
      // DETACH
      // ---------------------------------------------
      this._client.transport.addListener(`${DETACH_RESPONSE}-${this.id}-${this.remoteId}`, (reqId) => {
        this._manager._statesById.delete(this.id);
        this._clearTransport();

        this._onDetachCallbacks.forEach(func => func());

        this._clearDetach();
        resolveRequest(reqId, this);
      });

      // the state does not exists anymore in the server (should not happen)
      this._client.transport.addListener(`${DETACH_ERROR}-${this.id}`, (reqId, msg) => {
        rejectRequest(reqId, msg);
      });

    }
  }

  /** @private */
  _clearDetach() {
    this._onDetachCallbacks.clear();
    this._onDeleteCallbacks.clear();

    // Monkey patch detach so it throws if called twice. Doing nothing blocks
    // the process on a second `detach` call as the Promise never resolves
    this.detach = () => {
      throw new Error(`[stateManager] State "${this.schemaName} (${this.id})" already detached, cannot detach twice`);
    };
  }

  /** @private */
  _clearTransport() {
    // remove listeners
    this._client.transport.removeAllListeners(`${UPDATE_RESPONSE}-${this.id}-${this.remoteId}`);
    this._client.transport.removeAllListeners(`${UPDATE_NOTIFICATION}-${this.id}-${this.remoteId}`);
    this._client.transport.removeAllListeners(`${DELETE_RESPONSE}-${this.id}-${this.remoteId}`);
    this._client.transport.removeAllListeners(`${DELETE_NOTIFICATION}-${this.id}-${this.remoteId}`);
    this._client.transport.removeAllListeners(`${DETACH_RESPONSE}-${this.id}-${this.remoteId}`);
  }

  /** @private */
  async _commit(updates, context, propagate = true, initiator = false) {
    const newValues = {};
    const oldValues = {};

    for (let name in updates) {
      const { immediate, event } = this._parameters.getSchema(name);
      // @note 20211209 - we had an issue here server-side, because if the value
      // is an object or an array, the reference is shared by everybody, therefore
      // `changed` is always false and the new value is never propagated...
      // FIXED - `state.get` now returns a deep copy when `type` is `any`
      const oldValue = this._parameters.get(name);
      const [newValue, changed] = this._parameters.set(name, updates[name]);

      // handle immediate stuff
      if (initiator && immediate) {
        // @note - we don't need to check filterChange here because the value
        // has been updated in parameters on the `set` side so can rely on `changed`
        // to avoid retrigger listeners.
        // If the value has been overriden by the server, `changed` will true
        // anyway so it should behave correctly.
        if (!changed || event) {
          continue;
        }
      }

      newValues[name] = newValue;
      oldValues[name] = oldValue;
    }

    // if the `UPDATE_REQUEST` as been aborted by the server, do not propagate
    let promises = [];

    if (propagate && Object.keys(newValues).length > 0) {
      this._onUpdateCallbacks.forEach(listener => {
        promises.push(listener(newValues, oldValues, context));
      });
    }

    // on a given client, `await state.set(update)` resolves after all
    // update callbacks have themselves resolved
    await Promise.all(promises);

    // reset events to null after propagation of all listeners
    for (let name in newValues) {
      const { event } = this._parameters.getSchema(name);

      if (event) {
        this._parameters.set(name, null);
      }
    }

    return newValues;
  }

  /**
   * Update values of the state.
   *
   * The returned `Promise` resolves on the applied updates, when all the `onUpdate`
   * callbacks have resolved themselves, i.e.:
   *
   * ```js
   * server.stateManager.registerSchema('test', {
   *   myBool: { type: 'boolean', default: false },
   * });
   * const a = await server.stateManager.create('a');
   * let asyncCallbackCalled = false;
   *
   * a.onUpdate(updates => {
   *   return new Promise(resolve => {
   *     setTimeout(() => {
   *       asyncCallbackCalled = true;
   *       resolve();
   *     }, 100);
   *   });
   * });
   *
   * const updates = await a.set({ myBool: true });
   * assert.equal(asyncCallbackCalled, true);
   * assert.deepEqual(updates, { myBool: true });
   * ```
   *
   * @param {object} updates - key / value pairs of updates to apply to the state.
   * @param {mixed} [context=null] - optionnal contextual object that will be propagated
   *   alongside the updates of the state. The context is valid only for the
   *   current call and will be passed as third argument to all update listeners.
   * @returns {Promise<Object>} A promise to the (coerced) updates.
   * @example
   * const state = await client.state.attach('globals');
   * const updates = await state.set({ myParam: Math.random() });
   */
  async set(updates, context = null) {
    // handle immediate option
    const immediateNewValues = {};
    const immediateOldValues = {};
    let propagateNow = false;

    for (let name in updates) {
      // throw early (client-side and not only server-side) if parameter is undefined
      if (!this._parameters.has(name)) {
        throw new ReferenceError(`[stateManager] Cannot set value of undefined parameter "${name}"`);
      }

      // @note: general idea...
      // if immediate=true
      //  - call listeners if value changed
      //  - go through normal server path
      //  - retrigger only if response from server is different from current value
      // if immediate=true && (filterChange=false || event=true)
      //  - call listeners with value regarless it changed
      //  - go through normal server path
      //  - if the node is initiator of the update (UPDATE_RESPONSE), (re-)check
      //    to prevent execute the listeners twice

      const { immediate, filterChange, event } = this._parameters.getSchema(name);

      if (immediate) {
        const oldValue = this._parameters.get(name);
        const [newValue, changed] = this._parameters.set(name, updates[name]);

        if (changed || filterChange === false || event) {
          immediateOldValues[name] = oldValue;
          immediateNewValues[name] = newValue;
          propagateNow = true;
        }
      }
    }

    if (propagateNow) {
      this._onUpdateCallbacks.forEach(listener => listener(immediateNewValues, immediateOldValues, context));
    }

    // go through server-side normal behavior
    return new Promise((resolve, reject) => {
      const reqId = storeRequestPromise(resolve, reject);
      this._client.transport.emit(`${UPDATE_REQUEST}-${this.id}-${this.remoteId}`, reqId, updates, context);
    });
  }

  /**
   * Get the value of a paramter of the state.
   *
   * @param {string} name - Name of the param.
   * @throws Throws if `name` does not correspond to an existing field
   *  of the state.
   * @return {mixed}
   * @example
   * const value = state.get('name');
   */
  get(name) {
    return this._parameters.get(name);
  }

  /**
   * Get all the key / value pairs of the state.
   *
   * @return {object}
   * @example
   * const values = state.getValues();
   */
  getValues() {
    return this._parameters.getValues();
  }

  /**
   * Get the schema from which the state has been created.
   *
   * @param {string} [name=null] - If given, returns only the definition corresponding
   *  to the given param name.
   * @throws Throws if `name` does not correspond to an existing field
   *  of the state.
   * @return {object}
   * @example
   * const schema = state.getSchema();
   */
  getSchema(name = null) {
    return this._parameters.getSchema(name);
  }

  /**
   * Get the values with which the state has been created. May defer from the
   * default values declared in the schema.
   *
   * @return {object}
   * @example
   * const initValues = state.getInitValues();
   */
  getInitValues() {
    return this._parameters.getInitValues();
  }

  /**
   * Get the default values as declared in the schema.
   *
   * @return {object}
   * @example
   * const defaults = state.getDefaults();
   */
  getDefaults() {
    return this._parameters.getDefaults();
  }

  /**
   * Detach from the state. If the client is the creator of the state, the state
   * is deleted and all attached nodes get notified
   *
   * @example
   * const state = await client.state.attach('globals');
   * // later
   * await state.detach();
   */
  async detach() {
    this._onUpdateCallbacks.clear();

    if (this._isOwner) {
      return new Promise((resolve, reject) => {
        const reqId = storeRequestPromise(resolve, reject);
        this._client.transport.emit(`${DELETE_REQUEST}-${this.id}-${this.remoteId}`, reqId);
      });
    } else {
      return new Promise((resolve, reject) => {
        const reqId = storeRequestPromise(resolve, reject);
        this._client.transport.emit(`${DETACH_REQUEST}-${this.id}-${this.remoteId}`, reqId);
      });
    }
  }

  /**
   * Delete the state. Only the creator/owner of the state can use this method.
   * All nodes attached to the state will be deteched, triggering the `onDetach`
   * callback. The creator of the state will also have its `onDelete` callback
   * triggered.
   *
   * @throws Throws if the method is called by a node which is not the owner of
   * the state.
   * @example
   * const state = await client.state.create('my-schema-name');
   * // later
   * await state.delete();
   */
  async delete() {
    if (this._isOwner) {
      return this.detach();
    } else {
      throw new Error(`[stateManager] can delete state "${this.schemaName}", only owner of the state (i.e. the node that "create[d]" it) can delete it`);
    }
  }

  /**
   * Subscribe to state updates.
   *
   * @param {client.SharedState~onUpdateCallback|client.SharedState~onUpdateCallback} callback
   *  Callback to execute when an update is applied on the state.
   * @param {Boolean} [executeListener=false] - Execute the callback immediately
   *  with current state values. (`oldValues` will be set to `{}`, and `context` to `null`)
   * @returns {client.SharedState~deleteOnUpdateCallback|server.SharedState~deleteOnUpdateCallback}
   * @example
   * const unsubscribe = state.onUpdate(async (newValues, oldValues, context) =>  {
   *   for (let [key, value] of Object.entries(newValues)) {
   *      switch (key) {
   *        // do something
   *      }
   *   }
   * });
   *
   * // later
   * unsubscribe();
   */
  onUpdate(listener, executeListener = false) {
    this._onUpdateCallbacks.add(listener);

    if (executeListener === true) {
      const currentValues = this.getValues();
      const oldValues = {};
      const context = null;
      listener(currentValues, oldValues, context);
    }

    return () => {
      this._onUpdateCallbacks.delete(listener);
    };
  }

  /**
   * Register a function to execute when detaching from the state
   *
   * @param {Function} callback - callback to execute when detaching from the state.
   *   wether the client as called `detach`, or the state has been deleted by its
   *   creator.
   */
  onDetach(callback) {
    this._onDetachCallbacks.add(callback);
    return () => this._onDetachCallbacks.delete(callback);
  }

  /**
   * Register a function to execute when the state is deleted. Only called if the
   * node was the creator of the state. Is called after `onDetach`
   *
   * @param {Function} callback - callback to execute when the state is deleted.
   */
  onDelete(callback) {
    this._onDeleteCallbacks.add(callback);
    return () => this._onDeleteCallbacks.delete(callback);
  }
}

export default BaseSharedState;