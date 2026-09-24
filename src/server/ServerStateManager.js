import {
  counter,
  isString,
  isPlainObject,
  isFunction,
} from '@ircam/sc-utils';

import BaseStateManager, {
  kStateManagerInit,
} from '../common/BaseStateManager.js';
import BatchedTransport from '../common/BatchedTransport.js';
import ParameterBag from '../common/ParameterBag.js';
import {
  CREATE_REQUEST,
  CREATE_RESPONSE,
  CREATE_ERROR,
  DELETE_NOTIFICATION,
  ATTACH_REQUEST,
  ATTACH_RESPONSE,
  ATTACH_ERROR,
  OBSERVE_REQUEST,
  OBSERVE_RESPONSE,
  OBSERVE_ERROR,
  OBSERVE_NOTIFICATION,
  UNOBSERVE_NOTIFICATION,
  // DELETE_SHARED_STATE_CLASS,
  GET_CLASS_DESCRIPTION_REQUEST,
  GET_CLASS_DESCRIPTION_RESPONSE,
  GET_CLASS_DESCRIPTION_ERROR,
  PRIVATE_STATES,
} from '../common/constants.js';

import SharedStatePrivate, {
  kSharedStatePrivateAttachClient,
  kSharedStatePrivateDetachClient,
  kSharedStatePrivateGetValues,
} from './SharedStatePrivate.js';

import warnings from '../common/logs/warnings.js';


const generateStateId = counter();
const instanceIdGenerator = counter();

export const kServerStateManagerAddClient = Symbol('soundworks:server-state-manager-add-client');
export const kServerStateManagerRemoveClient = Symbol('soundworks:server-state-manager-remove-client');
export const kServerStateManagerHasClient = Symbol('soundworks:server-state-manager-has-client');
export const kServerStateManagerDeletePrivateState = Symbol('soundworks:server-state-manager-delete-private-state');
export const kServerStateManagerGetUpdateHooks = Symbol('soundworks:server-state-manager-get-update-hooks');
// for testing purposes
export const kStateManagerClientsByNodeId = Symbol('soundworks:server-state-clients-by-node-id');


/**
 * @callback serverStateManagerCreateHook
 * @async
 *
 * @param {object} initValues - Initialization values object as given when the
 *  shared state is created
 */

/**
 * @callback serverStateManagerUpdateHook
 * @async
 *
 * @param {object} updates - Update object as given on a `set` callback, or
 *  result of the previous hook.
 * @param {object} currentValues - Current values of the state.
 * @returns {object} The "real" updates to be applied on the state.
 */

/**
 * @callback serverStateManagerDeleteHook
 * @async
 *
 * @param {object} currentValues - Update object as given on a `set` callback, or
 *  result of the previous hook.
 */

/**
 * The `StateManager` allows to create new {@link SharedState}s, or attach
 * to {@link SharedState}s created by other nodes (clients or server). It
 * can also track all the {@link SharedState}s created by other nodes.
 *
 * An instance of `StateManager` is automatically created by the `soundworks.Server`
 * at initialization (cf. {@link Server#stateManager}).
 *
 * Compared to the {@link ClientStateManager}, the `ServerStateManager` can also
 * define and delete shared state classes, as well as register hooks executed at
 * lifecycle phases of a shared state
 *
 * See {@link Server#stateManager}
 *
 * Tutorial: {@link https://soundworks.dev/guide/state-manager.html}
 *
 * ```
 * // server-side
 * import { Server } from '@soundworks/server/index.js';
 *
 * const server = new Server(config);
 * // declare and register the class of a shared state.
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
 *
 * @extends BaseStateManager
 * @inheritdoc
 * @hideconstructor
 */
class ServerStateManager extends BaseStateManager {
  #sharedStatePrivateById = new Map();
  #classes = new Map();
  #observers = new Set();
  #createHooksByClassName = new Map();
  #updateHooksByClassName = new Map();
  #deleteHooksByClassName = new Map();

  constructor() {
    super();
    /** @private */
    this[kStateManagerClientsByNodeId] = new Map();
  }

  /** @private */
  [kStateManagerInit](id, transport) {
    super[kStateManagerInit](id, transport);
    // add itself as client of the state manager server
    this[kServerStateManagerAddClient](id, transport);
  }

  /** @private */
  async [kServerStateManagerDeletePrivateState](state) {
    this.#sharedStatePrivateById.delete(state.id);
    // @todo - could use getValuesUnsafe instead
    let currentValues = state[kSharedStatePrivateGetValues]();
    const hooks = this.#deleteHooksByClassName.get(state.className);

    for (let hook of hooks.values()) {
      const result = await hook(currentValues);

      if (result === null) { // explicit abort
        break;
      } else if (result === undefined) { // implicit continue
        continue;
      } else {
        currentValues = result;
      }
    }
  }

  /** @private */
  [kServerStateManagerGetUpdateHooks](className) {
    return this.#updateHooksByClassName.get(className);
  }

  /** @private */
  [kServerStateManagerHasClient](nodeId) {
    return this[kStateManagerClientsByNodeId].has(nodeId);
  }

  /**
   * Add a client to the manager.
   *
   * This is automatically handled by the {@link Server} when a client connects.
   *
   * @param {number} nodeId - Unique id of the client node
   * @param {object} transport - Transport mechanism to communicate with the
   *  client. Must implement a basic EventEmitter API.
   *
   * @private
   */
  [kServerStateManagerAddClient](nodeId, transport) {
    const batchedTransport = new BatchedTransport(transport);
    const client = {
      id: nodeId,
      transport: batchedTransport,
    };

    this[kStateManagerClientsByNodeId].set(nodeId, client);

    client.transport.addListener(CREATE_REQUEST, this.#onCreateRequest(client));
    client.transport.addListener(ATTACH_REQUEST, this.#onAttachRequest(client));
    client.transport.addListener(OBSERVE_REQUEST, this.#onObserveRequest(client));
    client.transport.addListener(UNOBSERVE_NOTIFICATION, this.#onUnobserveNotification(client));
    client.transport.addListener(GET_CLASS_DESCRIPTION_REQUEST, this.#onClassDescriptionRequest(client));
  }

  /**
   * Remove a client from the manager and clean all related states.
   *
   * This method is automatically called by the {@link Server} when a client disconnects.
   *
   * @param {number} nodeId - Id of the client node, as given in
   *  {@link client.StateManager}
   *
   * @private
   */
  [kServerStateManagerRemoveClient](nodeId) {
    // remove from observers
    const client = this[kStateManagerClientsByNodeId].get(nodeId);
    this.#observers.delete(client);
    // delete from client list
    this[kStateManagerClientsByNodeId].delete(nodeId);

    // loop through all states to clean them
    for (let state of this.#sharedStatePrivateById.values()) {
      let shouldDelete = nodeId === state.ownerId;

      // loop through clients of this state
      for (let [instanceId, clientInfos] of state.attachedClients) {
        const { client, isOwner } = clientInfos;

        // if client is the disconnected one, remove from the state known clients
        if (nodeId === client.id) {
          state[kSharedStatePrivateDetachClient](instanceId, client);
        }

        // notify client of state deletion if not owner
        if (shouldDelete && !isOwner) {
          client.transport.emit(`${DELETE_NOTIFICATION}-${state.id}-${instanceId}`);
        }
      }

      if (shouldDelete) {
        // clean private state
        this[kServerStateManagerDeletePrivateState](state);
      }
    }
  }

  #isObservableState(state) {
    // is observable if not in private states list
    return !PRIVATE_STATES.includes(state.className);
  }

  #onCreateRequest = client => {
    return async (reqId, className, initValues = {}) => {
      if (!this.#classes.has(className)) {
        const msg = `Undefined SharedStateClassName '${className}'`;
        client.transport.emit(CREATE_ERROR, reqId, msg);
        return;
      }

      try {
        const classDescription = this.#classes.get(className);
        const stateId = generateStateId();
        const instanceId = instanceIdGenerator();

        // apply create hooks on init values
        const hooks = this.#createHooksByClassName.get(className);
        let hookAborted = false;

        for (let hook of hooks.values()) {
          const result = await hook(initValues);

          if (result === null) { // explicit abort
            hookAborted = true;
            break;
          } else if (result === undefined) { // implicit continue
            continue;
          } else {
            initValues = result;
          }
        }

        if (hookAborted) {
          throw new Error(`A 'serverStateManagerCreateHook' explicitly aborted state creation of class '${className}' by returning 'null'`);
        }

        const state = new SharedStatePrivate(this, className, classDescription, stateId, initValues);
        // attach client to the state as owner
        const isOwner = true;
        const filter = null;
        state[kSharedStatePrivateAttachClient](instanceId, client, isOwner, filter);

        this.#sharedStatePrivateById.set(stateId, state);

        const currentValues = state.parameters.getValues();

        client.transport.emit(
          CREATE_RESPONSE,
          reqId,
          stateId,
          instanceId,
          className,
          classDescription,
          currentValues,
        );

        const isObservable = this.#isObservableState(state);

        if (isObservable) {
          this.#observers.forEach(observer => {
            observer.transport.emit(OBSERVE_NOTIFICATION, className, stateId, client.id);
          });
        }
      } catch (err) {
        client.transport.emit(CREATE_ERROR, reqId, err.message);
      }
    };
  };

  #onAttachRequest = client => {
    return (reqId, className, stateId = null, filter = null) => {
      if (!this.#classes.has(className)) {
        const msg = `Undefined SharedStateClassName '${className}'`;
        client.transport.emit(ATTACH_ERROR, reqId, msg);
        return;
      }

      let state = null;

      if (stateId !== null && this.#sharedStatePrivateById.has(stateId)) {
        state = this.#sharedStatePrivateById.get(stateId);
      } else if (stateId === null) {
        // if no `stateId` given, we try to find the first state with the given
        // `className` in the list, this allow a client to attach to a global
        // state created by the server (or some persistent client) without
        // having to know the `stateId` (e.g. some global state...)
        for (let existingState of this.#sharedStatePrivateById.values()) {
          if (existingState.className === className) {
            state = existingState;
            break;
          }
        }
      }

      if (state !== null) {
        // @note - we use a unique remote id to allow a client to attach
        // several times to the same state.
        // i.e. same state -> several remote attach on the same node
        const instanceId = instanceIdGenerator();
        const isOwner = false;
        const currentValues = state.parameters.getValues();
        const classDescription = this.#classes.get(className);

        // if filter given, check that all filter entries are valid class keys
        // @todo - improve error reporting: report invalid filters
        if (filter !== null) {
          const keys = Object.keys(classDescription);
          const isValid = filter.reduce((acc, key) => acc && keys.includes(key), true);

          if (!isValid) {
            const msg = `Invalid filter (${filter.join(', ')}) for class '${className}'`;
            return client.transport.emit(ATTACH_ERROR, reqId, msg);
          }
        }

        state[kSharedStatePrivateAttachClient](instanceId, client, isOwner, filter);

        client.transport.emit(
          ATTACH_RESPONSE,
          reqId,
          state.id,
          instanceId,
          className,
          classDescription,
          currentValues,
          filter,
        );

      } else {
        const msg = `No existing state for class "${className}" with stateId: "${stateId}"`;
        client.transport.emit(ATTACH_ERROR, reqId, msg);
      }
    };
  };

  /**
   * @todo - Something seems to be wrong here. If a client observe different classes,
   * what happens if it unobserve one of them.
   * Looks to be tested cf. `should properly behave with several observers`
   * but the logic is not clear, the should be documented properly
   */
  #onObserveRequest = client => {
    // Note that `observedClassName` is only handled client-side, this allows
    // to have several observe in parallel without much bookkeeping at the price
    // of not minimizing network load
    return (reqId, observedClassName) => {
      if (observedClassName === null || this.#classes.has(observedClassName)) {
        const list = [];

        this.#sharedStatePrivateById.forEach(state => {
          const isObservable = this.#isObservableState(state);

          if (isObservable) {
            const { className, id, ownerId } = state;
            list.push([className, id, ownerId]);
          }
        });

        // Add client to observers first because if some synchronous server side
        // callback throws, the client would never be added to the list
        this.#observers.add(client);

        client.transport.emit(OBSERVE_RESPONSE, reqId, ...list);
      } else {
        const msg = `Undefined SharedStateClassName '${observedClassName}'`;
        client.transport.emit(OBSERVE_ERROR, reqId, msg);
      }
    };
  };

  #onUnobserveNotification = client => {
    return () => this.#observers.delete(client);
  };

  #onClassDescriptionRequest = client => {
    return (reqId, className) => {
      if (!this.#classes.has(className)) {
        const msg = `Undefined SharedStateClassName '${className}'`;
        client.transport.emit(GET_CLASS_DESCRIPTION_ERROR, reqId, msg);
        return;
      }

      const classDescription = this.#classes.get(className);

      client.transport.emit(
        GET_CLASS_DESCRIPTION_RESPONSE,
        reqId,
        className,
        classDescription,
      );
    };
  };

  /**
   * Define a generic class from which {@link SharedState}s can be created.
   *
   * @param {SharedStateClassName} className - Name of the class.
   * @param {SharedStateClassDescription} classDescription - Description of the class.
   *
   * @see {@link ServerStateManager#create}
   * @see {@link ClientStateManager#create}
   *
   * @example
   * server.stateManager.defineClass('my-class', {
   *   myBoolean: {
   *     type: 'boolean'
   *     default: false,
   *   },
   *   myFloat: {
   *     type: 'float'
   *     default: 0.1,
   *     min: -1,
   *     max: 1
   *   }
   * });
   */
  defineClass(className, classDescription) {
    if (!isString(className)) {
      throw new TypeError(`Cannot execute 'defineClass' (${className}) on ServerStateManager: argument 1 must be of type SharedStateClassName`);
    }

    if (!isPlainObject(classDescription)) {
      throw new TypeError(`Cannot execute 'defineClass' (${className}) on ServerStateManager: argument 2 must be of type SharedStateClassDescription`);
    }

    if (this.#classes.has(className)) {
      throw new DOMException(`Cannot execute 'defineClass'(${className})  on ServerStateManager: SharedState class '${className}' is already defined`, 'NotSupportedError');
    }

    try {
      ParameterBag.validateDescription(classDescription);
    } catch (err) {
      throw new TypeError(`Cannot execute 'defineClass' (${className}) on ServerStateManager: ${err.message}`);
    }

    this.#classes.set(className, structuredClone(classDescription));
    // create hooks list
    this.#createHooksByClassName.set(className, new Set());
    this.#updateHooksByClassName.set(className, new Set());
    this.#deleteHooksByClassName.set(className, new Set());
  }

  /**
   * Delete a whole class of {@link SharedState}.
   *
   * All {@link SharedState} instances created from this class will be deleted
   * as well, triggering their eventual `onDetach` and `onDelete` callbacks.
   *
   * @param {SharedStateClassName} className - Name of the shared state class to delete.
   */
  deleteClass(className) {
    // @note: deleting schema
    for (let [_, state] of this.#sharedStatePrivateById) {
      if (state.className === className) {
        for (let [instanceId, clientInfos] of state.attachedClients) {
          const attached = clientInfos.client;
          state[kSharedStatePrivateDetachClient](instanceId, attached);
          attached.transport.emit(`${DELETE_NOTIFICATION}-${state.id}-${instanceId}`);
        }

        this[kServerStateManagerDeletePrivateState](state);
      }
    }

    // ---------------------------------------------
    // note 2025-05-05: client-side caching of class descriptions has been removed
    // because it could create concurrency issues
    // cf. `should be able to recreate a class with the same name` unit test
    // ---------------------------------------------
    // for (let client of this[kStateManagerClientsByNodeId].values()) {
    //   client.transport.emit(`${DELETE_SHARED_STATE_CLASS}`, className);
    // }

    this.#classes.delete(className);
    // delete registered hooks
    this.#createHooksByClassName.delete(className);
    this.#updateHooksByClassName.delete(className);
    this.#deleteHooksByClassName.delete(className);
  }

  /**
   * Check wether a {@link SharedState} is defined or not, given its {@link SharedStateClassName}
   *
   * @param {SharedStateClassName} className - Name of the shared state class to delete.
   * @returns {boolean}
   */
  isClassDefined(className) {
    return this.#classes.has(className);
  }

  /**
   * Register a function for a given class of shared state class to be executed
   * when a state is created.
   *
   * For example, this can be useful to retrieve some initialization values stored
   * in the filesystem, given the value (e.g. a hostname) of one the parameters.
   *
   * The hook is associated to each states created from the given class name.
   * Note that the hooks are executed server-side regardless the node on which
   * `create` has been called.
   *
   * Multiple hook can be added to the same `className`, they will be executed in
   * order of registration.
   *
   * @param {string} className - Kind of states on which applying the hook.
   * @param {serverStateManagerUpdateHook} createHook - Function called on when
   *  a state of `className` is created on the network.
   *
   * @returns {function} deleteHook - Handler that deletes the hook when executed.
   *
   * @example
   * server.stateManager.defineClass('hooked', {
   *   name: { type: 'string', required: true },
   *   hookTriggered: { type: 'boolean', default: false },
   * });
   * server.stateManager.registerCreateHook('hooked', initValues => {
   *   return {
   *     ...initValues
   *     hookTriggered: true,
   *   };
   * });
   *
   * const state = await server.stateManager.create('hooked', {
   *   name: 'coucou',
   * });
   *
   * const values = state.getValues();
   * assert.deepEqual(result, { value: 'coucou', hookTriggered: true });
   */
  registerCreateHook(className, createHook) {
    if (!this.#classes.has(className)) {
      throw new TypeError(`Cannot execute 'registerCreateHook' (${className}) on BaseStateManager: SharedState class '${className}' is not defined`);
    }

    if (!isFunction(createHook)) {
      throw new TypeError(`Cannot execute 'registerCreateHook' (${className}) on BaseStateManager: argument 2 must be a function`);
    }

    const hooks = this.#createHooksByClassName.get(className);
    hooks.add(createHook);

    return () => hooks.delete(createHook);
  }

  /**
   * Register a function for a given class of shared state class to be executed
   * when a state is deleted.
   *
   * For example, this can be useful to store the values of a given shared state
   * in the filesystem.
   *
   * The hook is associated to each states created from the given class name.
   * Note that the hooks are executed server-side regardless the node on which
   * `delete` has been called.
   *
   * Multiple hook can be added to the same `className`, they will be executed in
   * order of registration.
   *
   * @param {string} className - Kind of states on which applying the hook.
   * @param {serverStateManagerUpdateHook} createHook - Function called on when
   *  a state of `className` is created on the network.
   *
   * @returns {function} deleteHook - Handler that deletes the hook when executed.
   *
   * @example
   * server.stateManager.defineClass('hooked', {
   *   name: { type: 'string', required: true },
   *   hookTriggered: { type: 'boolean', default: false },
   * });
   * server.stateManager.registerDeleteHook('hooked', async currentValues => {
   *   await doSomethingWithValues(currentValues)
   * });
   *
   * const state = await server.stateManager.create('hooked');
   * // later
   * await state.delete();
   */
  registerDeleteHook(className, deleteHook) {
    if (!this.#classes.has(className)) {
      throw new TypeError(`Cannot execute 'registerDeleteHook' (${className}) on BaseStateManager: SharedState class '${className}' is not defined`);
    }

    if (!isFunction(deleteHook)) {
      throw new TypeError(`Cannot execute 'registerDeleteHook' (${className}) on BaseStateManager: argument 2 must be a function`);
    }

    const hooks = this.#deleteHooksByClassName.get(className);
    hooks.add(deleteHook);

    return () => hooks.delete(deleteHook);
  }

  /**
   * Register a function for a given class of shared state to be executed between
   * `set` instructions and `onUpdate` callback(s).
   *
   * For example, this can be used to implement a preset system where all the values
   * of the state are updated from e.g. some data stored in filesystem while the
   * consumer of the state only want to update the preset name.
   *
   * The hook is associated to each states created from the given class name and
   * executed on each update (i.e. `state.set(updates)`). Note that the hooks are
   * executed server-side regardless the node on which `set` has been called and
   * before the call of the `onUpdate` callback of the shared state.
   *
   * Multiple hook can be added to the same `className`, they will be executed in
   * order of registration.
   *
   * @param {string} className - Kind of states on which applying the hook.
   * @param {serverStateManagerUpdateHook} updateHook - Function called on each update,
   *  to eventually modify the updates before they are actually applied.
   *
   * @returns {function} deleteHook - Handler that deletes the hook when executed.
   *
   * @example
   * server.stateManager.defineClass('hooked', {
   *   value: { type: 'string', default: null, nullable: true },
   *   numUpdates: { type: 'integer', default: 0 },
   * });
   * server.stateManager.registerUpdateHook('hooked', updates => {
   *   return {
   *     ...updates
   *     numUpdates: currentValues.numUpdates + 1,
   *   };
   * });
   *
   * const state = await server.stateManager.create('hooked');
   *
   * await state.set({ value: 'test' });
   * const values = state.getValues();
   * assert.deepEqual(result, { value: 'test', numUpdates: 1 });
   */
  registerUpdateHook(className, updateHook) {
    if (!this.#classes.has(className)) {
      throw new TypeError(`Cannot execute 'registerUpdateHook' (${className}) on BaseStateManager: SharedState class '${className}' is not defined`);
    }

    if (!isFunction(updateHook)) {
      throw new TypeError(`Cannot execute 'registerUpdateHook' (${className}) on BaseStateManager: argument 2 must be a function`);
    }

    const hooks = this.#updateHooksByClassName.get(className);
    hooks.add(updateHook);

    return () => hooks.delete(updateHook);
  }

  // ---------------------------------------------------------------------------
  // DEPRECATED
  // ---------------------------------------------------------------------------

  /**
   * @deprecated Use {@link ServerStateManager#defineClass} instead.
   */
  registerSchema(className, classDescription) {
    warnings.deprecated('ServerStateManager#registerSchema', 'ServerStateManager#defineClass', '4.0.0-alpha.29');
    this.defineClass(className, classDescription);
  }

  /**
   * @deprecated Use {@link ServerStateManager#defineClass} instead.
   */
  deleteSchema(className) {
    warnings.deprecated('ServerStateManager#deleteSchema', 'ServerStateManager#deleteClass', '4.0.0-alpha.29');
    this.deleteClass(className);
  }

}

export default ServerStateManager;
