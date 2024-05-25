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
  DELETE_SCHEMA,
  GET_SCHEMA_REQUEST,
  GET_SCHEMA_RESPONSE,
  GET_SCHEMA_ERROR,
  PRIVATE_STATES,
} from '../common/constants.js';

import SharedStatePrivate, {
  kSharedStatePrivateAttachClient,
  kSharedStatePrivateDetachClient,
} from './SharedStatePrivate.js';


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
 * register and delete schemas, as well as register update hook that are executed when
 * a state is updated.
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
 * // declare and register the schema of a shared state.
 * server.stateManager.registerSchema('some-global-state', {
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
  #schemas = new Map();
  #observers = new Set();
  #hooksBySchemaName = new Map(); // protected

  constructor() {
    super();
    /** @private */
    this[kStateManagerClientsByNodeId] = new Map();
  }

  #isObservableState(state) {
    const { schemaName, isCollectionController } = state;
    // is observable only if not in private state and not a controller state
    return !PRIVATE_STATES.includes(schemaName) && !isCollectionController;
  }

  /** @private */
  [kServerStateManagerDeletePrivateState](id) {
    this.#sharedStatePrivateById.delete(id);
  }

  /** @private */
  [kServerStateManagerGetHooks](schemaName) {
    return this.#hooksBySchemaName.get(schemaName);
  }

  /** @private */
  [kStateManagerInit](id, transport) {
    super[kStateManagerInit](id, transport);
    // add itself as client of the state manager server
    this[kServerStateManagerAddClient](id, transport);
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
      (reqId, schemaName, requireSchema, initValues = {}) => {
        if (this.#schemas.has(schemaName)) {
          try {
            const schema = this.#schemas.get(schemaName);
            const stateId = generateStateId.next().value;
            const remoteId = generateRemoteId.next().value;
            const state = new SharedStatePrivate(stateId, schemaName, schema, this, initValues);

            // attach client to the state as owner
            const isOwner = true;
            const filter = null;
            state[kSharedStatePrivateAttachClient](remoteId, client, isOwner, filter);

            this.#sharedStatePrivateById.set(stateId, state);

            const currentValues = state.parameters.getValues();
            const schemaOption = requireSchema ? schema : null;

            client.transport.emit(
              CREATE_RESPONSE,
              reqId, stateId, remoteId, schemaName, schemaOption, currentValues,
            );

            const isObservable = this.#isObservableState(state);

            if (isObservable) {
              this.#observers.forEach(observer => {
                observer.transport.emit(OBSERVE_NOTIFICATION, schemaName, stateId, nodeId);
              });
            }
          } catch (err) {
            const msg = `[stateManager] Cannot create state "${schemaName}", ${err.message}`;
            console.error(msg);

            client.transport.emit(CREATE_ERROR, reqId, msg);
          }
        } else {
          const msg = `[stateManager] Cannot create state "${schemaName}", schema does not exists`;
          console.error(msg);

          client.transport.emit(CREATE_ERROR, reqId, msg);
        }
      },
    );

    // ---------------------------------------------
    // ATTACH (when creator, is attached by default)
    // ---------------------------------------------
    client.transport.addListener(
      ATTACH_REQUEST,
      (reqId, schemaName, stateId = null, requireSchema = true, filter = null) => {
        if (this.#schemas.has(schemaName)) {
          let state = null;

          if (stateId !== null && this.#sharedStatePrivateById.has(stateId)) {
            state = this.#sharedStatePrivateById.get(stateId);
          } else if (stateId === null) {
            // if no `stateId` given, we try to find the first state with the given
            // `schemaName` in the list, this allow a client to attach to a global
            // state created by the server (or some persistant client) without
            // having to know the `stateId` (e.g. some global state...)
            for (let existingState of this.#sharedStatePrivateById.values()) {
              if (existingState.schemaName === schemaName) {
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
            const schema = this.#schemas.get(schemaName);
            const schemaOption = requireSchema ? schema : null;

            // if filter given, check that all filter entries are valid schema keys
            // @todo - improve error reportin: report invalid filters
            if (filter !== null) {
              const keys = Object.keys(schema);
              const isValid = filter.reduce((acc, key) => acc && keys.includes(key), true);

              if (!isValid) {
                const msg = `[stateManager] Cannot attach, invalid filter (${filter.join(', ')}) for schema "${schemaName}"`;
                console.error(msg);

                return client.transport.emit(ATTACH_ERROR, reqId, msg);
              }
            }

            state[kSharedStatePrivateAttachClient](remoteId, client, isOwner, filter);

            client.transport.emit(
              ATTACH_RESPONSE,
              reqId, state.id, remoteId, schemaName, schemaOption, currentValues, filter,
            );

          } else {
            const msg = `[stateManager] Cannot attach, no existing state for schema "${schemaName}" with stateId: "${stateId}"`;
            console.error(msg);

            client.transport.emit(ATTACH_ERROR, reqId, msg);
          }
        } else {
          const msg = `[stateManager] Cannot attach, schema "${schemaName}" does not exists`;
          console.error(msg);

          client.transport.emit(ATTACH_ERROR, reqId, msg);
        }
      },
    );

    // ---------------------------------------------
    // OBSERVE PEERS (be notified when a state is created, lazy)
    // ---------------------------------------------
    client.transport.addListener(OBSERVE_REQUEST, (reqId, observedSchemaName) => {
      if (observedSchemaName === null || this.#schemas.has(observedSchemaName)) {
        const statesInfos = [];

        this.#sharedStatePrivateById.forEach(state => {
          const isObservable = this.#isObservableState(state);

          if (isObservable) {
            const { schemaName, id, creatorId } = state;
            statesInfos.push([schemaName, id, creatorId]);
          }
        });

        // add client to observers first because if some synchronous server side
        // callback throws, the client would never be added to the list
        this.#observers.add(client);

        client.transport.emit(OBSERVE_RESPONSE, reqId, ...statesInfos);
      } else {
        const msg = `[stateManager] Cannot observe, schema "${observedSchemaName}" does not exists`;
        client.transport.emit(OBSERVE_ERROR, reqId, msg);
      }
    });

    client.transport.addListener(UNOBSERVE_NOTIFICATION, () => {
      this.#observers.delete(client);
    });

    // ---------------------------------------------
    // GET SCHEMA
    // ---------------------------------------------
    client.transport.addListener(GET_SCHEMA_REQUEST, (reqId, schemaName) => {
      if (this.#schemas.has(schemaName)) {
        const schema = this.#schemas.get(schemaName);
        client.transport.emit(GET_SCHEMA_RESPONSE, reqId, schemaName, schema);
      } else {
        const msg = `[stateManager] Cannot get schema, schema "${schemaName}" does not exists`;
        client.transport.emit(GET_SCHEMA_ERROR, reqId, msg);
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

  /**
   * Register a schema from which shared states (cf. {@link common.SharedState})
   * can be instanciated.
   *
   * @param {string} schemaName - Name of the schema.
   * @param {ServerStateManagerSchema} schema - Data structure
   *  describing the states that will be created from this schema.
   *
   * @see {@link ServerStateManager#create}
   * @see {@link ClientStateManager#create}
   *
   * @example
   * server.stateManager.registerSchema('my-schema', {
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
   * })
   */
  registerSchema(schemaName, schema) {
    if (!isString(schemaName)) {
      throw new Error(`[stateManager.registerSchema] Invalid schema name "${schemaName}", should be a string`);
    }

    if (this.#schemas.has(schemaName)) {
      throw new Error(`[stateManager.registerSchema] cannot register schema with name: "${schemaName}", schema name already exists`);
    }

    if (!isPlainObject(schema)) {
      throw new Error(`[stateManager.registerSchema] Invalid schema, should be an object`);
    }

    ParameterBag.validateSchema(schema);

    this.#schemas.set(schemaName, clonedeep(schema));
    // create hooks list
    this.#hooksBySchemaName.set(schemaName, new Set());
  }

  /**
   * Delete a schema and all associated states.
   *
   * When a schema is deleted, all states created from this schema are deleted
   * as well, therefore all attached clients are detached and the `onDetach`
   * and `onDelete` callbacks are called on the related states.
   *
   * @param {string} schemaName - Name of the schema.
   */
  deleteSchema(schemaName) {
    // @note: deleting schema
    for (let [_, state] of this.#sharedStatePrivateById) {
      if (state.schemaName === schemaName) {
        for (let [remoteId, clientInfos] of state.attachedClients) {
          const attached = clientInfos.client;
          state[kSharedStatePrivateDetachClient](remoteId, attached);
          attached.transport.emit(`${DELETE_NOTIFICATION}-${state.id}-${remoteId}`);
        }

        this.#sharedStatePrivateById.delete(state.id);
      }
    }

    // clear schema cache of all connected clients
    for (let client of this[kStateManagerClientsByNodeId].values()) {
      client.transport.emit(`${DELETE_SCHEMA}`, schemaName);
    }

    this.#schemas.delete(schemaName);
    // delete registered hooks
    this.#hooksBySchemaName.delete(schemaName);
  }

  /**
   * Register a function for a given schema (e.g. will be applied on all states
   * created from this schema) that will be executed before the update values
   * are propagated. For example, this could be used to implement a preset system
   * where all the values of the state are updated from e.g. some data stored in
   * filesystem while the consumer of the state only want to update the preset name.
   *
   * The hook is associated to every state of its kind (i.e. schemaName) and
   * executed on every update (call of `set`). Note that the hooks are executed
   * server-side regarless the node on which `set` has been called and before
   * the "actual" update of the state (e.g. before the call of `onUpdate`).
   *
   * @param {string} schemaName - Kind of states on which applying the hook.
   * @param {serverStateManagerUpdateHook} updateHook - Function
   *   called between the `set` call and the actual update.
   *
   * @returns {Fuction} deleteHook - Handler that deletes the hook when executed.
   *
   * @example
   * server.stateManager.registerSchema('hooked', {
   *   name: { type: 'string', default: null, nullable: true },
   *   name: { numUpdates: 'integer', default: 0 },
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
   * await state.set({ name: 'test' });
   * const values = state.getValues();
   * assert.deepEqual(result, { name: 'test', numUpdates: 1 });
   */
  registerUpdateHook(schemaName, updateHook) {
    // throw error if schemaName has not been registered
    if (!this.#schemas.has(schemaName)) {
      throw new Error(`[stateManager.registerUpdateHook] cannot register update hook for schema name "${schemaName}", schema name does not exists`);
    }

    const hooks = this.#hooksBySchemaName.get(schemaName);
    hooks.add(updateHook);

    return () => hooks.delete(updateHook);
  }
}

export default ServerStateManager;
