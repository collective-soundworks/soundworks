import { isPlainObject } from '@ircam/sc-utils';

import ParameterBag from './ParameterBag.js';
import PromiseStore from './PromiseStore.js';
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
  kStateManagerDeleteState,
} from './BaseStateManager.js';

import logger from './logger.js';

// for testing purposes
export const kSharedStatePromiseStore = Symbol('soundworks:shared-state-promise-store');

/**
 * Callback executed when updates are applied on a {@link SharedState}.
 *
 * @callback sharedStateOnUpdateCallback
 * @param {Object} newValues - Key / value pairs of the updates that have been
 *  applied to the state.
 * @param {Object} oldValues - Key / value pairs of the updated params before
 *  the updates has been applied to the state.
 */

/**
 * Delete the registered {@link sharedStateOnUpdateCallback}.
 *
 * @callback sharedStateDeleteOnUpdateCallback
 */

/**
 * The `SharedState` is one of the most important and versatile abstraction provided
 * by `soundworks`. It represents a set of parameters that are synchronized accross
 * every nodes of the application (clients and server) that declared some interest
 * to the shared state.
 *
 * A `SharedState` instance is created according to a shared state class definition
 * which is composed of a {@link SharedStateClassName} and of a {@link SharedStateClassDescription}
 * registered in the {@link ServerStateManager}. Any number of `SharedState`s
 * can be created from a single class definition.
 *
 * A shared state can be created both by the clients or by the server, in which case
 * it is generally considered as a global state of the application. Similarly any
 * node of the application (clients or server) can declare interest and "attach" to
 * a state created by another node. All node attached to a state can modify its values
 * and/or react to the modifications applied by other nodes.
 *
 * Tutorial: {@link https://soundworks.dev/guide/state-manager.html}
 *
 * ```
 * // server-side
 * import { Server } from '@soundworks/server/index.js';
 *
 * const server = new Server(config);
 * // define a shared state class
 * server.stateManager.defineClass('some-global-state', {
 *   myRandom: {
 *     type: 'float',
 *     default: 0,
 *   }
 * });
 *
 * await server.start();
 *
 * // create a global state server-side
 * const globalState = await server.stateManager.create('some-global-state');
 * // listen and react to the changes made by the clients
 * globalState.onUpdate(updates => console.log(updates));
 * ```
 *
 * ```
 * // client-side
 * import { Client } from '@soundworks/client.index.js';
 *
 * const client = new Client(config);
 * await client.start();
 *
 * // attach to the global state created by the server
 * const globalState = await client.stateManager.attach('some-global-state');
 *
 * // update the value of a `myRandom` parameter every seconds
 * setInterval(() => {
 *   globalState.set({ myRandom: Math.random() });
 * }, 1000);
 * ```
 */
class SharedState {
  #id = null;
  #remoteId = null;
  #className = null;
  #isOwner = null;
  #client = null;
  #manager = null;
  #filter = null;
  // true is the state has been detached or deleted
  #detached = false;
  #parameters = null;
  #onUpdateCallbacks = new Set();
  #onDetachCallbacks = new Set();
  #onDeleteCallbacks = new Set();

  constructor(id, remoteId, className, classDescription, client, isOwner, manager, initValues, filter) {
    this.#id = id;
    this.#remoteId = remoteId;
    this.#className = className;
    this.#isOwner = isOwner; // may be any node
    this.#client = client;
    this.#manager = manager;
    this.#filter = filter;

    try {
      this.#parameters = new ParameterBag(classDescription, initValues);
    } catch (err) {
      console.error(err.stack);

      throw new Error(`Error creating or attaching state "${className}" w/ values:\n
${JSON.stringify(initValues, null, 2)}`);
    }

    /** @private */
    this[kSharedStatePromiseStore] = new PromiseStore(this.constructor.name);

    // add listener for state updates
    this.#client.transport.addListener(`${UPDATE_RESPONSE}-${this.#id}-${this.#remoteId}`, async (reqId, updates) => {
      const updated = await this.#commit(updates, true, true);
      this[kSharedStatePromiseStore].resolve(reqId, updated);
    });

    // retrieve values but do not propagate to subscriptions
    this.#client.transport.addListener(`${UPDATE_ABORT}-${this.#id}-${this.#remoteId}`, async (reqId, updates) => {
      const updated = await this.#commit(updates, false, true);
      this[kSharedStatePromiseStore].resolve(reqId, updated);
    });

    this.#client.transport.addListener(`${UPDATE_NOTIFICATION}-${this.#id}-${this.#remoteId}`, async (updates) => {
      // https://github.com/collective-soundworks/soundworks/issues/18
      //
      // # note: 2002-10-03
      //
      // `setTimeout(async () => this.#commit(updates, true, false));`
      // appears to be the only way to push the update commit in the next event
      // cycle so that `attach` can resolve before the update notification is
      // actually dispatched. The alternative:
      // `Promise.resolve().then(() => this.#commit(updates, true, false))``
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
      this.#commit(updates, true, false);
    });

    // ---------------------------------------------
    // state has been deleted by its creator or the class has been deleted
    // ---------------------------------------------
    this.#client.transport.addListener(`${DELETE_NOTIFICATION}-${this.#id}-${this.#remoteId}`, async () => {
      this.#manager[kStateManagerDeleteState](this.#id);
      this.#clearTransport();

      for (let callback of this.#onDetachCallbacks) {
        try {
          await callback();
        } catch (err) {
          console.error(err.message);
        }
      }

      if (this.#isOwner) {
        for (let callback of this.#onDeleteCallbacks) {
          await callback();
        }
      }

      this.#onDetachCallbacks.clear();
      this.#onDeleteCallbacks.clear();
      this[kSharedStatePromiseStore].flush();
    });


    if (this.#isOwner) {
      // ---------------------------------------------
      // the creator has called `.delete()`
      // ---------------------------------------------
      this.#client.transport.addListener(`${DELETE_RESPONSE}-${this.#id}-${this.#remoteId}`, async (reqId) => {
        this.#manager[kStateManagerDeleteState](this.#id);
        this.#clearTransport();

        for (let callback of this.#onDetachCallbacks) {
          await callback();
        }

        for (let callback of this.#onDeleteCallbacks) {
          await callback();
        }

        this.#onDetachCallbacks.clear();
        this.#onDeleteCallbacks.clear();
        this[kSharedStatePromiseStore].resolve(reqId, this);
        this[kSharedStatePromiseStore].flush();
      });

      this.#client.transport.addListener(`${DELETE_ERROR}-${this.#id}`, (reqId, msg) => {
        this[kSharedStatePromiseStore].reject(reqId, msg);
      });

    } else {
      // ---------------------------------------------
      // the attached node has called `.detach()`
      // ---------------------------------------------
      this.#client.transport.addListener(`${DETACH_RESPONSE}-${this.#id}-${this.#remoteId}`, async (reqId) => {
        this.#manager[kStateManagerDeleteState](this.#id);
        this.#clearTransport();

        for (let callback of this.#onDetachCallbacks) {
          await callback();
        }

        this.#onDetachCallbacks.clear();
        this.#onDeleteCallbacks.clear();
        this[kSharedStatePromiseStore].resolve(reqId, this);
        this[kSharedStatePromiseStore].flush();
      });

      // the state does not exists anymore in the server (should not happen)
      this.#client.transport.addListener(`${DETACH_ERROR}-${this.#id}`, (reqId, msg) => {
        this.#onDetachCallbacks.clear();
        this.#onDeleteCallbacks.clear();
        this[kSharedStatePromiseStore].reject(reqId, msg);
        this[kSharedStatePromiseStore].flush();
      });
    }
  }

  /**
   * Id of the state
   * @type {Number}
   */
  get id() {
    return this.#id;
  }

  /**
   * Name of the underlying {@link SharedState} class.
   * @type {String}
   */
  get className() {
    return this.#className;
  }

  /**
   * @deprecated Use {@link SharedState#className} instead.
   */
  get schemaName() {
    logger.deprecated('SharedState#schemaName', 'SharedState#className', '4.0.0-alpha.29');
    return this.className;
  }

  /**
   * Indicates if the node is the owner of the state, i.e. if it created the state.
   * @type {Boolean}
   */
  get isOwner() {
    return this.#isOwner;
  }

  #clearTransport() {
    // remove listeners
    this.#client.transport.removeAllListeners(`${UPDATE_RESPONSE}-${this.#id}-${this.#remoteId}`);
    this.#client.transport.removeAllListeners(`${UPDATE_NOTIFICATION}-${this.#id}-${this.#remoteId}`);
    this.#client.transport.removeAllListeners(`${UPDATE_ABORT}-${this.#id}-${this.#remoteId}`);
    this.#client.transport.removeAllListeners(`${DELETE_NOTIFICATION}-${this.#id}-${this.#remoteId}`);

    if (this.#isOwner) {
      this.#client.transport.removeAllListeners(`${DELETE_RESPONSE}-${this.#id}-${this.#remoteId}`);
      this.#client.transport.removeAllListeners(`${DELETE_ERROR}-${this.#id}-${this.#remoteId}`);
    } else {
      this.#client.transport.removeAllListeners(`${DETACH_RESPONSE}-${this.#id}-${this.#remoteId}`);
      this.#client.transport.removeAllListeners(`${DETACH_ERROR}-${this.#id}-${this.#remoteId}`);
    }
  }

  async #commit(updates, propagate = true, initiator = false) {
    const newValues = {};
    const oldValues = {};

    for (let name in updates) {
      const { immediate, event } = this.#parameters.getDescription(name);
      // @note 20211209 - we had an issue here server-side, because if the value
      // is an object or an array, the reference is shared by everybody, therefore
      // `changed` is always false and the new value is never propagated...
      // FIXED - `state.get` now returns a deep copy when `type` is `any`
      const oldValue = this.#parameters.get(name);
      const [newValue, changed] = this.#parameters.set(name, updates[name]);

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
      this.#onUpdateCallbacks.forEach(listener => {
        promises.push(listener(newValues, oldValues));
      });
    }

    // on a given client, `await state.set(update)` resolves after all
    // update callbacks have themselves resolved
    await Promise.all(promises);

    // reset events to null after propagation of all listeners
    for (let name in newValues) {
      const { event } = this.#parameters.getDescription(name);

      if (event) {
        this.#parameters.set(name, null);
      }
    }

    return newValues;
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
   * const classDescription = state.getDescription();
   * const paramDescription = state.getDescription('my-param');
   */
  getDescription(paramName = null) {
    return this.#parameters.getDescription(paramName);
  }

  /**
   * @deprecated Use {@link SharedState#getDescription} instead.
   */
  getSchema(paramName = null) {
    logger.deprecated('SharedState#getSchema', 'SharedState#getDescription', '4.0.0-alpha.29');
    return this.getDescription(paramName);
  }

  /**
   * Update values of the state.
   *
   * The returned `Promise` resolves on an object that contains the applied updates,
   * and resolves after all the `onUpdate` callbacks have resolved themselves, i.e.:
   *
   * ```js
   * server.stateManager.defineClass('test', {
   *   myBool: { type: 'boolean', default: false },
   * });
   * const a = await server.stateManager.create('a');
   *
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
   * @param {object} updates - Key / value pairs of updates to apply to the state.
   * @returns {Promise<Object>} A promise to the (coerced) updates.
   *
   * @example
   * const state = await client.stateManager.attach('globals');
   * const updates = await state.set({ myParam: Math.random() });
   */
  async set(updates) {
    if (this.#detached) {
      return;
    }

    if (isPlainObject(arguments[0]) && isPlainObject(arguments[1])) {
      logger.deprecated('SharedState.set(updates, context)', 'a regular parameter set with `event=true` behavior', '4.0.0-alpha.29');
    }

    if (!isPlainObject(updates)) {
      throw new TypeError(`[SharedState] State "${this.#className}": state.set(updates) should receive an object as first parameter`);
    }

    const newValues = {};
    const oldValues = {};
    const localParams = {};
    const sharedParams = {};
    let hasLocalParam = false;
    let hasSharedParam = false;
    let forwardParams = undefined;
    let propagateNow = false;

    for (let name in updates) {
      // Try to coerce value early, so that eventual errors are triggered early
      // on the node requesting the update, and not only on the server side
      // This throws if name does not exists
      this.#parameters.coerceValue(name, updates[name]);

      // Check that name is in filter list, if any
      if (this.#filter !== null) {
        if (!this.#filter.includes(name)) {
          throw new DOMException(`[SharedState] State "${this.#className}": cannot set parameter '${name}', parameter is not in filter list`, 'NotSupportedError');
        }
      }

      // `immediate` option behavior
      //
      // If immediate=true
      //  - call listeners if value changed
      //  - go through normal server path
      //  - retrigger only if response from server is different from current value
      // If immediate=true && (filterChange=false || event=true)
      //  - call listeners with value regarless it changed
      //  - go through normal server path
      //  - if the node is initiator of the update (UPDATE_RESPONSE), (re-)check
      //    to prevent execute the listeners twice

      // `local` option behavior
      //
      // - If the `updates` object only contains local variables, we can call the
      // update listeners and return a fulfilled promise immediately
      // - If parameters that require network communication are present, we call the
      // update callback onces with the local payload, then we need to wait for the server
      // response, call update listeners with server response and resolve promise with
      // the full payload, i.e. reintegrating the local params in the resolve payload

      const { local, immediate, filterChange, event } = this.#parameters.getDescription(name);

      if (immediate || local) {
        const oldValue = this.#parameters.get(name);
        const [newValue, changed] = this.#parameters.set(name, updates[name]);

        // prepare data for immediate propagation of listeners
        if (changed || filterChange === false || event) {
          oldValues[name] = oldValue;
          newValues[name] = newValue;
          propagateNow = true;
        }
      }

      // define params that must go through network or not
      if (local) {
        hasLocalParam = true;
        // get sanitize value for fulfilling promise
        localParams[name] = this.#parameters.get(name);
      } else {
        // note that immediate are shared params too
        hasSharedParam = true;
        sharedParams[name] = updates[name];
      }
    }

    // propagate immediate params if changed
    if (propagateNow) {
      this.#onUpdateCallbacks.forEach(listener => listener(newValues, oldValues));
    }

    // check if we can resolve immediately or if we need to go through network
    if (hasLocalParam) {
      if (!hasSharedParam) {
        return Promise.resolve(localParams);
      } else {
        // store local params to fulfill promise with all values, see PromiseStore
        forwardParams = localParams;
      }
    }

    // override updates to be shared on network without local params
    updates = sharedParams;

    // go through server-side normal behavior
    return new Promise((resolve, reject) => {
      const reqId = this[kSharedStatePromiseStore].add(resolve, reject, 'SharedState#set', forwardParams);
      this.#client.transport.emit(`${UPDATE_REQUEST}-${this.#id}-${this.#remoteId}`, reqId, updates);
    });
  }

  /**
   * Get the value of a parameter of the state.
   *
   * Be aware that in case of 'any' typethe returned value is deeply copied.
   * While this prevents from pollution of the state by mutating the reference,
   * this can also lead to performance issues when the parameter contains large
   * data. In such cases you should use the {@link SharedState#getUnsafe} method
   * and make sure to treat the returned object as readonly.
   *
   * @param {SharedStateParameterName} name - Name of the param.
   * @return {any}
   * @throws Throws if `name` does not exists.
   * @example
   * const value = state.get('paramName');
   */
  get(name) {
    if (!this.#parameters.has(name)) {
      throw new ReferenceError(`[SharedState] State "${this.#className}": Cannot get value of undefined parameter "${name}"`);
    }

    if (this.#filter !== null) {
      if (!this.#filter.includes(name)) {
        throw new DOMException(`[SharedState] State "${this.#className}": cannot get parameter '${name}', parameter is not in filter list`, 'NotSupportedError');
      }
    }

    return this.#parameters.get(name);
  }

  /**
   * Get an unsafe reference to the value of a parameter of the state.
   *
   * Similar to `get` but returns a reference to the underlying value in case of
   * `any` type. Can be usefull if the underlying value is large (e.g. sensors
   * recordings, etc.) and deep cloning expensive. Be aware that if changes are
   * made on the returned object, the state of your application will become
   * inconsistent.
   *
   * @param {SharedStateParameterName} name - Name of the param.
   * @return {any}
   * @throws Throws if `name` does not exists.
   * @example
   * const value = state.getUnsafe('paramName');
   */
  getUnsafe(name) {
    if (!this.#parameters.has(name)) {
      throw new ReferenceError(`[SharedState] State "${this.#className}": Cannot get value of undefined parameter "${name}"`);
    }

    if (this.#filter !== null) {
      if (!this.#filter.includes(name)) {
        throw new DOMException(`[SharedState] State "${this.#className}": cannot get parameter '${name}', parameter is not in filter list`, 'NotSupportedError');
      }
    }

    return this.#parameters.getUnsafe(name);
  }

  /**
   * Get all the key / value pairs of the state.
   *
   * If a parameter is of `any` type, a deep copy is made.
   *
   * @return {object}
   * @example
   * const values = state.getValues();
   */
  getValues() {
    const values = this.#parameters.getValues();

    if (this.#filter !== null) {
      for (let name in values) {
        if (!this.#filter.includes(name)) {
          delete values[name];
        }
      }
    }

    return values;
  }

  /**
   * Get all the key / value pairs of the state.
   *
   * Similar to `getValues` but returns a reference to the underlying value in
   * case of `any` type. Can be usefull if the underlying value is big (e.g.
   * sensors recordings, etc.) and deep cloning expensive. Be aware that if
   * changes are made on the returned object, the state of your application will
   * become inconsistent.
   *
   * @return {object}
   * @example
   * const values = state.getValues();
   */
  getValuesUnsafe() {
    const values = this.#parameters.getValuesUnsafe();

    if (this.#filter !== null) {
      for (let name in values) {
        if (!this.#filter.includes(name)) {
          delete values[name];
        }
      }
    }

    return values;
  }

  /**
   * Get the values with which the state has been created. May defer from the
   * default values declared in the class description.
   *
   * @return {object}
   * @example
   * const initValues = state.getInitValues();
   */
  getInitValues() {
    return this.#parameters.getInitValues();
  }

  /**
   * Get the default values as declared in the class description.
   *
   * @return {object}
   * @example
   * const defaults = state.getDefaults();
   */
  getDefaults() {
    return this.#parameters.getDefaults();
  }

  /**
   * Detach from the state. If the client is the creator of the state, the state
   * is deleted and all attached nodes get notified.
   *
   * @example
   * const state = await client.state.attach('globals');
   * // later
   * await state.detach();
   */
  async detach() {
    if (this.#detached) {
      throw new Error(`[SharedState] State "${this.#className} (${this.#id})" already detached, cannot detach twice`);
    }

    this.#detached = true; // mark detached early
    this.#onUpdateCallbacks.clear();

    if (this.#isOwner) {
      return new Promise((resolve, reject) => {
        const reqId = this[kSharedStatePromiseStore].add(resolve, reject, 'SharedState#delete');
        this.#client.transport.emit(`${DELETE_REQUEST}-${this.#id}-${this.#remoteId}`, reqId);
      });
    } else {
      return new Promise((resolve, reject) => {
        const reqId = this[kSharedStatePromiseStore].add(resolve, reject, 'SharedState#detach');
        this.#client.transport.emit(`${DETACH_REQUEST}-${this.#id}-${this.#remoteId}`, reqId);
      });
    }
  }

  /**
   * Delete the state. Only the creator/owner of the state can use this method.
   *
   * All nodes attached to the state will be detached, triggering any registered
   * `onDetach` callbacks. The creator of the state will also have its own `onDelete`
   * callback triggered. The local `onDeatch` and `onDelete` callbacks will be
   * executed *before* the returned Promise resolves
   *
   * @throws Throws if the method is called by a node which is not the owner of
   * the state.
   * @example
   * const state = await client.stateManaager.create('my-class-name');
   * // later
   * await state.delete();
   */
  async delete() {
    if (this.#isOwner) {
      if (this.#detached) {
        throw new Error(`[SharedState] State "${this.#className} (${this.#id})" already deleted, cannot delete twice`);
      }

      return this.detach();
    } else {
      throw new Error(`[SharedState] Cannot delete state "${this.#className}", only the owner of the state (i.e. the node that created it) can delete the state. Use "detach" instead.`);
    }
  }

  /**
   * Subscribe to state updates.
   *
   * @param {sharedStateOnUpdateCallback} callback
   *  Callback to execute when an update is applied on the state.
   * @param {Boolean} [executeListener=false] - Execute the callback immediately
   *  with current state values. Note that `oldValues` will be set to `{}`.
   * @returns {sharedStateDeleteOnUpdateCallback}
   * @example
   * const unsubscribe = state.onUpdate(async (newValues, oldValues) =>  {
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
    this.#onUpdateCallbacks.add(listener);

    if (executeListener === true) {
      const currentValues = this.getValues();
      // filter `event: true` parameters from currentValues, having them here is
      // misleading as we are in the context of a callback, not from an active read
      const classDescription = this.getDescription();

      for (let name in classDescription) {
        if (classDescription[name].event === true) {
          delete currentValues[name];
        }
      }

      listener(currentValues, {});
    }

    return () => {
      this.#onUpdateCallbacks.delete(listener);
    };
  }

  /**
   * Register a function to execute when detaching from the state. The function
   * will be executed before the `detach` promise resolves.
   *
   * @param {Function} callback - Callback to execute when detaching from the state.
   *   Whether the client as called `detach`, or the state has been deleted by its
   *   creator.
   */
  onDetach(callback) {
    this.#onDetachCallbacks.add(callback);
    return () => this.#onDetachCallbacks.delete(callback);
  }

  /**
   * Register a function to execute when the state is deleted. Only called if the
   * node was the creator of the state. Is called after `onDetach` and executed
   * before the `delete` Promise resolves.
   *
   * @param {Function} callback - Callback to execute when the state is deleted.
   */
  onDelete(callback) {
    this.#onDeleteCallbacks.add(callback);
    return () => this.#onDeleteCallbacks.delete(callback);
  }
}

export default SharedState;
