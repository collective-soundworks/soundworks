import { idGenerator, isString, isPlainObject } from '@ircam/sc-utils';
import clonedeep from 'lodash/cloneDeep.js';

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
  DELETE_SHARED_STATE_CLASS,
  GET_CLASS_DESCRIPTION_REQUEST,
  GET_CLASS_DESCRIPTION_RESPONSE,
  GET_CLASS_DESCRIPTION_ERROR,
  PRIVATE_STATES,
} from '../common/constants.js';

import SharedStatePrivate, {
  kSharedStatePrivateAttachClient,
  kSharedStatePrivateDetachClient,
} from './SharedStatePrivate.js';

import logger from '../common/logger.js';


const generateStateId = idGenerator();
const generateRemoteId = idGenerator();

export const kServerStateManagerAddClient = Symbol('soundworks:server-state-manager-add-client');
export const kServerStateManagerRemoveClient = Symbol('soundworks:server-state-manager-remove-client');
export const kServerStateManagerDeletePrivateState = Symbol('soundworks:server-state-manager-delete-private-state');
export const kServerStateManagerGetHooks = Symbol('soundworks:server-state-manager-get-hooks');
// for testing purposes
export const kStateManagerClientsByNodeId = Symbol('soundworks:server-state-clients-by-node-id');


/**
 * @callback serverStateManagerUpdateHook
 * @async
 *
 * @param {object} updates - Update object as given on a set callback, or
 *  result of the previous hook
 * @param {object} currentValues - Current values of the state.
 * @param {object} [context=null] - Optionnal context passed by the creator
 *  of the update.
 *
 * @returns {object} The "real" updates to be applied on the state.
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
  #hooksByClassName = new Map(); // protected

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
  [kServerStateManagerDeletePrivateState](id) {
    this.#sharedStatePrivateById.delete(id);
  }

  /** @private */
  [kServerStateManagerGetHooks](className) {
    return this.#hooksByClassName.get(className);
  }

  /**
   * Add a client to the manager.
   *
   * This is automatically handled by the {@link Server} when a client connects.
   *
   * @param {number} nodeId - Id of the client node, as given in
   *  {@link client.StateManager}
   * @param {object} transport - Transport mecanism to communicate with the
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

    // ---------------------------------------------
    // CREATE
    // ---------------------------------------------
    client.transport.addListener(
      CREATE_REQUEST,
      (reqId, className, requireDescription, initValues = {}) => {
        if (this.#classes.has(className)) {
          try {
            const classDescription = this.#classes.get(className);
            const stateId = generateStateId.next().value;
            const remoteId = generateRemoteId.next().value;
            const state = new SharedStatePrivate(this, className, classDescription, stateId, initValues);

            // attach client to the state as owner
            const isOwner = true;
            const filter = null;
            state[kSharedStatePrivateAttachClient](remoteId, client, isOwner, filter);

            this.#sharedStatePrivateById.set(stateId, state);

            const currentValues = state.parameters.getValues();
            const classDescriptionOption = requireDescription ? classDescription : null;

            client.transport.emit(
              CREATE_RESPONSE,
              reqId,
              stateId,
              remoteId,
              className,
              classDescriptionOption,
              currentValues,
            );

            const isObservable = this.#isObservableState(state);

            if (isObservable) {
              this.#observers.forEach(observer => {
                observer.transport.emit(OBSERVE_NOTIFICATION, className, stateId, nodeId);
              });
            }
          } catch (err) {
            const msg = `[stateManager] Cannot create state "${className}", ${err.message}`;
            client.transport.emit(CREATE_ERROR, reqId, msg);
          }
        } else {
          const msg = `[stateManager] Cannot create state "${className}", class is not defined`;
          client.transport.emit(CREATE_ERROR, reqId, msg);
        }
      },
    );

    // ---------------------------------------------
    // ATTACH (when creator, is attached by default)
    // ---------------------------------------------
    client.transport.addListener(
      ATTACH_REQUEST,
      (reqId, className, stateId = null, requireDescription = true, filter = null) => {
        if (this.#classes.has(className)) {
          let state = null;

          if (stateId !== null && this.#sharedStatePrivateById.has(stateId)) {
            state = this.#sharedStatePrivateById.get(stateId);
          } else if (stateId === null) {
            // if no `stateId` given, we try to find the first state with the given
            // `className` in the list, this allow a client to attach to a global
            // state created by the server (or some persistant client) without
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
            const remoteId = generateRemoteId.next().value;
            const isOwner = false;
            const currentValues = state.parameters.getValues();
            const classDescription = this.#classes.get(className);
            const classDescriptionOption = requireDescription ? classDescription : null;

            // if filter given, check that all filter entries are valid class keys
            // @todo - improve error reporting: report invalid filters
            if (filter !== null) {
              const keys = Object.keys(classDescription);
              const isValid = filter.reduce((acc, key) => acc && keys.includes(key), true);

              if (!isValid) {
                const msg = `[stateManager] Cannot attach, invalid filter (${filter.join(', ')}) for class "${className}"`;
                return client.transport.emit(ATTACH_ERROR, reqId, msg);
              }
            }

            state[kSharedStatePrivateAttachClient](remoteId, client, isOwner, filter);

            client.transport.emit(
              ATTACH_RESPONSE,
              reqId,
              state.id,
              remoteId,
              className,
              classDescriptionOption,
              currentValues,
              filter,
            );

          } else {
            const msg = `[stateManager] Cannot attach, no existing state for class "${className}" with stateId: "${stateId}"`;
            client.transport.emit(ATTACH_ERROR, reqId, msg);
          }
        } else {
          const msg = `[stateManager] Cannot attach, class "${className}" does not exists`;
          client.transport.emit(ATTACH_ERROR, reqId, msg);
        }
      },
    );

    // ---------------------------------------------
    // OBSERVE PEERS (be notified when a state is created, lazy)
    // ---------------------------------------------
    client.transport.addListener(OBSERVE_REQUEST, (reqId, observedClassName) => {
      if (observedClassName === null || this.#classes.has(observedClassName)) {
        const list = [];

        this.#sharedStatePrivateById.forEach(state => {
          const isObservable = this.#isObservableState(state);

          if (isObservable) {
            const { className, id, creatorId } = state;
            list.push([className, id, creatorId]);
          }
        });

        // add client to observers first because if some synchronous server side
        // callback throws, the client would never be added to the list
        this.#observers.add(client);

        client.transport.emit(OBSERVE_RESPONSE, reqId, ...list);
      } else {
        const msg = `[stateManager] Cannot observe class "${observedClassName}", class does not exists`;
        client.transport.emit(OBSERVE_ERROR, reqId, msg);
      }
    });

    client.transport.addListener(UNOBSERVE_NOTIFICATION, () => {
      this.#observers.delete(client);
    });

    // ---------------------------------------------
    // GET CLASS DESCRIPTION
    // ---------------------------------------------
    client.transport.addListener(GET_CLASS_DESCRIPTION_REQUEST, (reqId, className) => {
      if (this.#classes.has(className)) {
        const classDescription = this.#classes.get(className);
        client.transport.emit(
          GET_CLASS_DESCRIPTION_RESPONSE,
          reqId,
          className,
          classDescription
        );
      } else {
        const msg = `[stateManager] Cannot get class "${className}", class does not exists`;
        client.transport.emit(GET_CLASS_DESCRIPTION_ERROR, reqId, msg);
      }
    });
  }

  /**
   * Remove a client from the manager. Clean all created or attached states.
   *
   * This is automatically handled by the {@link Server} when a client disconnects.
   *
   * @param {number} nodeId - Id of the client node, as given in
   *  {@link client.StateManager}
   *
   * @private
   */
  [kServerStateManagerRemoveClient](nodeId) {
    for (let [_id, state] of this.#sharedStatePrivateById.entries()) {
      let deleteState = false;

      // define if the client is the creator of the state, in which case
      // everybody must delete it
      for (let [remoteId, clientInfos] of state.attachedClients) {
        const attachedClient = clientInfos.client;

        if (nodeId === attachedClient.id && remoteId === state.creatorRemoteId) {
          deleteState = true;
        }
      }

      for (let [remoteId, clientInfos] of state.attachedClients) {
        const attachedClient = clientInfos.client;

        if (nodeId === attachedClient.id) {
          state[kSharedStatePrivateDetachClient](remoteId, attachedClient);
        }

        if (deleteState) {
          if (remoteId !== state.creatorRemoteId) {
            // send notification to other attached nodes
            attachedClient.transport.emit(`${DELETE_NOTIFICATION}-${state.id}-${remoteId}`);
          }

          this.#sharedStatePrivateById.delete(state.id);
        }
      }
    }

    // if is an observer, delete it
    const client = this[kStateManagerClientsByNodeId].get(nodeId);
    this.#observers.delete(client);
    this[kStateManagerClientsByNodeId].delete(nodeId);
  }

  #isObservableState(state) {
    // is observable if not in private states list
    return !PRIVATE_STATES.includes(state.className);
  }

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
      throw new Error(`[stateManager.defineClass] Invalid class name "${className}", should be a string`);
    }

    if (this.#classes.has(className)) {
      throw new Error(`[stateManager.defineClass] Cannot define class with name: "${className}", class already exists`);
    }

    if (!isPlainObject(classDescription)) {
      throw new Error(`[stateManager.defineClass] Invalid class description, should be an object`);
    }

    ParameterBag.validateDescription(classDescription);

    this.#classes.set(className, clonedeep(classDescription));
    // create hooks list
    this.#hooksByClassName.set(className, new Set());
  }

  /**
   * @deprecated Use {@link ServerStateManager#defineClass} instead.
   */
  registerSchema(className, classDescription) {
    logger.deprecated('ServerStateManager#registerSchema', 'ServerStateManager#defineClass', '4.0.0-alpha.29');
    this.defineClass(className, classDescription);
  }

  /**
   * Delete a whole class of {@link ShareState}.
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
        for (let [remoteId, clientInfos] of state.attachedClients) {
          const attached = clientInfos.client;
          state[kSharedStatePrivateDetachClient](remoteId, attached);
          attached.transport.emit(`${DELETE_NOTIFICATION}-${state.id}-${remoteId}`);
        }

        this.#sharedStatePrivateById.delete(state.id);
      }
    }

    // clear class cache of all connected clients
    for (let client of this[kStateManagerClientsByNodeId].values()) {
      client.transport.emit(`${DELETE_SHARED_STATE_CLASS}`, className);
    }

    this.#classes.delete(className);
    // delete registered hooks
    this.#hooksByClassName.delete(className);
  }

  /**
   * @deprecated Use {@link ServerStateManager#defineClass} instead.
   */
  deleteSchema(className) {
    logger.deprecated('ServerStateManager#deleteSchema', 'ServerStateManager#deleteClass', '4.0.0-alpha.29');
    this.deleteClass(className);
  }

  /**
   * Register a function for a given shared state class the be executed between
   * `set` instructions and `onUpdate` callback(s).
   *
   * For example, this could be used to implement a preset system
   * where all the values of the state are updated from e.g. some data stored in
   * filesystem while the consumer of the state only want to update the preset name.
   *
   * The hook is associated to each states created from the given class name
   * executed on each update (i.e. `state.set(updates)`). Note that the hooks are
   * executed server-side regarless the node on which `set` has been called and
   * before the call of the `onUpdate` callback of the shared state.
   *
   * @param {string} className - Kind of states on which applying the hook.
   * @param {serverStateManagerUpdateHook} updateHook - Function called between
   *  the `set` call and the actual update.
   *
   * @returns {Fuction} deleteHook - Handler that deletes the hook when executed.
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
    // throw error if className has not been registered
    if (!this.#classes.has(className)) {
      throw new Error(`[stateManager.registerUpdateHook] Cannot register update hook for class "${className}", class does not exists`);
    }

    const hooks = this.#hooksByClassName.get(className);
    hooks.add(updateHook);

    return () => hooks.delete(updateHook);
  }
}

export default ServerStateManager;
