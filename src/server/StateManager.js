import { idGenerator, isString, isPlainObject } from '@ircam/sc-utils';
import clonedeep from 'lodash/cloneDeep.js';

import BaseStateManager from '../common/BaseStateManager.js';
import BatchedTransport from '../common/BatchedTransport.js';
import ParameterBag from '../common/ParameterBag.js';
import SharedStatePrivate from '../common/SharedStatePrivate.js';
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


const generateStateId = idGenerator();
const generateRemoteId = idGenerator();

const kIsObservableState = Symbol('StateManager::isObservableState');

/**
 * @typedef {object} server.StateManager~schema
 *
 * Description of a schema to be registered by the {@link server.StateManager#registerSchema}
 *
 * A schema is the blueprint, or definition from which shared states can be created.
 *
 * It consists of a set of key / value pairs where the key is the name of
 * the parameter, and the value is an object describing the parameter.
 *
 * The value can be of any of the foolowing types:
 * - {@link server.StateManager~schemaBooleanDefinition}
 * - {@link server.StateManager~schemaStringDefinition}
 * - {@link server.StateManager~schemaIntegerDefinition}
 * - {@link server.StateManager~schemaFloatDefinition}
 * - {@link server.StateManager~schemaEnumDefinition}
 * - {@link server.StateManager~schemaAnyDefinition}
 *
 * @example
 * const mySchema = {
 *   triggerSound: {
 *     type: 'boolean',
 *     event: true,
 *   },
 *   volume: {
 *     type: 'float'
 *     default: 0,
 *     min: -80,
 *     max: 6,
 *   }
 * };
 *
 * server.stateManager.registerSchema('my-schema-name', mySchema);
 */
/**
 * Describe a {@link server.StateManager~schema} entry of "boolean" type.
 *
 * @typedef {object} server.StateManager~schemaBooleanDefinition
 * @property {string} type='boolean' - Define a boolean parameter.
 * @property {boolean} default - Default value of the parameter.
 * @property {boolean} [nullable=false] - Define if the parameter is nullable. If
 *   set to `true` the parameter `default` is set to `null`.
 * @property {boolean} [event=false] - Define if the parameter is a volatile, e.g.
 *   set its value back to `null` after propagation. When `true`, `nullable` is
 *   automatically set to `true` and `default` to `null`.
 * @property {boolean} [filterChange=true] - Setting this option to `false` forces
 *   the propagation of a parameter even when its value do not change. It
 *   offers a kind of middle ground between the default bahavior (e.g. where
 *   only changed values are propagated) and the behavior of the `event` option
 *   (which has no state per se). As such, setting this options to `false` if
 *   `event=true` does not make sens.
 * @property {boolean} [immediate=false] - Setting this option to `true` will
 *   trigger any change (e.g. call the `onUpdate` listeners) immediately on the
 *   state that generate the update (i.e. calling `set`), before propagating the
 *   change on the network. This option can be usefull in cases the network
 *   would introduce a noticeable latency on the client. If for some reason
 *   the value is overriden server-side (e.g. in an `updateHook`) the listeners
 *   will be called again on when the "real" / final value will be received.
 * @property {object} [metas={}] - Optionnal metadata of the parameter.
 */
/**
 * Describe a {@link server.StateManager~schema} entry of "string" type.
 *
 * @typedef {object} server.StateManager~schemaStringDefinition
 * @property {string} type='string' - Define a boolean parameter.
 * @property {string} default - Default value of the parameter.
 * @property {boolean} [nullable=false] - Define if the parameter is nullable. If
 *   set to `true` the parameter `default` is set to `null`.
 * @property {boolean} [event=false] - Define if the parameter is a volatile, e.g.
 *   set its value back to `null` after propagation. When `true`, `nullable` is
 *   automatically set to `true` and `default` to `null`.
 * @property {boolean} [filterChange=true] - Setting this option to `false` forces
 *   the propagation of a parameter even when its value do not change. It
 *   offers a kind of middle ground between the default bahavior (e.g. where
 *   only changed values are propagated) and the behavior of the `event` option
 *   (which has no state per se). As such, setting this options to `false` if
 *   `event=true` does not make sens.
 * @property {boolean} [immediate=false] - Setting this option to `true` will
 *   trigger any change (e.g. call the `onUpdate` listeners) immediately on the
 *   state that generate the update (i.e. calling `set`), before propagating the
 *   change on the network. This option can be usefull in cases the network
 *   would introduce a noticeable latency on the client. If for some reason
 *   the value is overriden server-side (e.g. in an `updateHook`) the listeners
 *   will be called again on when the "real" / final value will be received.
 * @property {object} [metas={}] - Optionnal metadata of the parameter.
 */
/**
 * Describe a {@link server.StateManager~schema} entry of "integer" type.
 *
 * @typedef {object} server.StateManager~schemaIntegerDefinition
 * @property {string} type='integer' - Define a boolean parameter.
 * @property {number} default - Default value of the parameter.
 * @property {number} [min=-Infinity] - Minimum value of the parameter.
 * @property {number} [max=+Infinity] - Maximum value of the parameter.
 * @property {boolean} [nullable=false] - Define if the parameter is nullable. If
 *   set to `true` the parameter `default` is set to `null`.
 * @property {boolean} [event=false] - Define if the parameter is a volatile, e.g.
 *   set its value back to `null` after propagation. When `true`, `nullable` is
 *   automatically set to `true` and `default` to `null`.
 * @property {boolean} [filterChange=true] - Setting this option to `false` forces
 *   the propagation of a parameter even when its value do not change. It
 *   offers a kind of middle ground between the default bahavior (e.g. where
 *   only changed values are propagated) and the behavior of the `event` option
 *   (which has no state per se). As such, setting this options to `false` if
 *   `event=true` does not make sens.
 * @property {boolean} [immediate=false] - Setting this option to `true` will
 *   trigger any change (e.g. call the `onUpdate` listeners) immediately on the
 *   state that generate the update (i.e. calling `set`), before propagating the
 *   change on the network. This option can be usefull in cases the network
 *   would introduce a noticeable latency on the client. If for some reason
 *   the value is overriden server-side (e.g. in an `updateHook`) the listeners
 *   will be called again on when the "real" / final value will be received.
 * @property {object} [metas={}] - Optionnal metadata of the parameter.
 */
/**
 * Describe a {@link server.StateManager~schema} entry of "float" type.
 *
 * @typedef {object} server.StateManager~schemaFloatDefinition
 * @property {string} [type='float'] - Float parameter.
 * @property {number} default - Default value.
 * @property {number} [min=-Infinity] - Minimum value.
 * @property {number} [max=+Infinity] - Maximum value.
 * @property {boolean} [nullable=false] - Define if the parameter is nullable. If
 *   set to `true` the parameter `default` is set to `null`.
 * @property {boolean} [event=false] - Define if the parameter is a volatile, e.g.
 *   set its value back to `null` after propagation. When `true`, `nullable` is
 *   automatically set to `true` and `default` to `null`.
 * @property {boolean} [filterChange=true] - Setting this option to `false` forces
 *   the propagation of a parameter even when its value do not change. It
 *   offers a kind of middle ground between the default bahavior (e.g. where
 *   only changed values are propagated) and the behavior of the `event` option
 *   (which has no state per se). As such, setting this options to `false` if
 *   `event=true` does not make sens.
 * @property {boolean} [immediate=false] - Setting this option to `true` will
 *   trigger any change (e.g. call the `onUpdate` listeners) immediately on the
 *   state that generate the update (i.e. calling `set`), before propagating the
 *   change on the network. This option can be usefull in cases the network
 *   would introduce a noticeable latency on the client. If for some reason
 *   the value is overriden server-side (e.g. in an `updateHook`) the listeners
 *   will be called again on when the "real" / final value will be received.
 * @property {object} [metas={}] - Optionnal metadata of the parameter.
 */
/**
 * Describe a {@link server.StateManager~schema} entry of "enum" type.
 *
 * @typedef {object} server.StateManager~schemaEnumDefinition
 * @property {string} [type='enum'] - Enum parameter.
 * @property {string} default - Default value of the parameter.
 * @property {Array} list - Possible values of the parameter.
 * @property {boolean} [nullable=false] - Define if the parameter is nullable. If
 *   set to `true` the parameter `default` is set to `null`.
 * @property {boolean} [event=false] - Define if the parameter is a volatile, e.g.
 *   set its value back to `null` after propagation. When `true`, `nullable` is
 *   automatically set to `true` and `default` to `null`.
 * @property {boolean} [filterChange=true] - Setting this option to `false` forces
 *   the propagation of a parameter even when its value do not change. It
 *   offers a kind of middle ground between the default bahavior (e.g. where
 *   only changed values are propagated) and the behavior of the `event` option
 *   (which has no state per se). As such, setting this options to `false` if
 *   `event=true` does not make sens.
 * @property {boolean} [immediate=false] - Setting this option to `true` will
 *   trigger any change (e.g. call the `onUpdate` listeners) immediately on the
 *   state that generate the update (i.e. calling `set`), before propagating the
 *   change on the network. This option can be usefull in cases the network
 *   would introduce a noticeable latency on the client. If for some reason
 *   the value is overriden server-side (e.g. in an `updateHook`) the listeners
 *   will be called again on when the "real" / final value will be received.
 * @property {object} [metas={}] - Optionnal metadata of the parameter.
 */
/**
 * Describe a {@link server.StateManager~schema} entry of "any" type.
 *
 * Note that the `any` type always return a shallow copy of the state internal
 * value. Mutating the returned value will therefore not modify the internal state.
 *
 * @typedef {object} server.StateManager~schemaAnyDefinition
 * @property {string} [type='any'] - Parameter of any type.
 * @property {*} default - Default value of the parameter.
 * @property {boolean} [nullable=false] - Define if the parameter is nullable. If
 *   set to `true` the parameter `default` is set to `null`.
 * @property {boolean} [event=false] - Define if the parameter is a volatile, e.g.
 *   set its value back to `null` after propagation. When `true`, `nullable` is
 *   automatically set to `true` and `default` to `null`.
 * @property {boolean} [filterChange=true] - Setting this option to `false` forces
 *   the propagation of a parameter even when its value do not change. It
 *   offers a kind of middle ground between the default bahavior (e.g. where
 *   only changed values are propagated) and the behavior of the `event` option
 *   (which has no state per se). As such, setting this options to `false` if
 *   `event=true` does not make sens.
 * @property {boolean} [immediate=false] - Setting this option to `true` will
 *   trigger any change (e.g. call the `onUpdate` listeners) immediately on the
 *   state that generate the update (i.e. calling `set`), before propagating the
 *   change on the network. This option can be usefull in cases the network
 *   would introduce a noticeable latency on the client. If for some reason
 *   the value is overriden server-side (e.g. in an `updateHook`) the listeners
 *   will be called again on when the "real" / final value will be received.
 * @property {object} [metas={}] - Optionnal metadata of the parameter.
 */

/**
 * @callback server.StateManager~ObserveCallback
 * @async
 * @param {string} schemaName - name of the schema
 * @param {number} stateId - id of the state
 * @param {number} nodeId - id of the node that created the state
 */

/**
 * @callback server.StateManager~updateHook
 * @async
 *
 * @param {object} updates - Update object as given on a set callback, or
 *  result of the previous hook
 * @param {object} currentValues - Current values of the state.
 * @param {object} [context=null] - Optionnal context passed by the creator
 *  of the update.
 *
 * @return {object} The "real" updates to be applied on the state.
 */

/**
 * The `StateManager` allows to create new {@link server.SharedState}s, or attach
 * to {@link server.SharedState}s created by other nodes (clients or server). It
 * can also track all the {@link server.SharedState}s created by other nodes.
 *
 * An instance of `StateManager` is automatically created by the `soundworks.Server`
 * at initialization (cf. {@link server.Server#stateManager}).
 *
 * Compared to the {@link client.StateManager}, the `server.StateManager` can also
 * create and delete schemas, as well as register update hook that are executed when
 * a state is updated.
 *
 * See {@link server.Server#stateManager}
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
 * @memberof server
 * @extends BaseStateManager
 * @inheritdoc
 * @hideconstructor
 */
class StateManager extends BaseStateManager {
  constructor() {
    super();

    this._clientByNodeId = new Map();
    this._sharedStatePrivateById = new Map();
    this._schemas = new Map();
    this._observers = new Set();
    this._hooksBySchemaName = new Map(); // protected
  }

  init(id, transport) {
    super.init(id, transport);
    // add itself as client of the state manager server
    this.addClient(id, transport);
  }

  [kIsObservableState](state) {
    const { schemaName, isCollectionController } = state;
    // is observable only if not in private state and not a controller state
    return !PRIVATE_STATES.includes(schemaName) && !isCollectionController;
  }

  /**
   * Add a client to the manager.
   *
   * This is automatically handled by the {@link server.Server} when a client connects.
   *
   * @param {number} nodeId - Id of the client node, as given in
   *  {@link client.StateManager}
   * @param {object} transport - Transport mecanism to communicate with the
   *  client. Must implement a basic EventEmitter API.
   *
   * @private
   */
  addClient(nodeId, transport) {
    const batchedTransport = new BatchedTransport(transport);
    const client = {
      id: nodeId,
      transport: batchedTransport,
    };

    this._clientByNodeId.set(nodeId, client);

    // ---------------------------------------------
    // CREATE
    // ---------------------------------------------
    client.transport.addListener(
      CREATE_REQUEST,
      (reqId, schemaName, requireSchema, initValues = {}) => {
        if (this._schemas.has(schemaName)) {
          try {
            const schema = this._schemas.get(schemaName);
            const stateId = generateStateId.next().value;
            const remoteId = generateRemoteId.next().value;
            const state = new SharedStatePrivate(stateId, schemaName, schema, this, initValues);

            // attach client to the state as owner
            const isOwner = true;
            const filter = null;
            state._attachClient(remoteId, client, isOwner, filter);

            this._sharedStatePrivateById.set(stateId, state);

            const currentValues = state._parameters.getValues();
            const schemaOption = requireSchema ? schema : null;

            client.transport.emit(
              CREATE_RESPONSE,
              reqId, stateId, remoteId, schemaName, schemaOption, currentValues,
            );

            const isObservable = this[kIsObservableState](state);

            if (isObservable) {
              this._observers.forEach(observer => {
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
        if (this._schemas.has(schemaName)) {
          let state = null;

          if (stateId !== null && this._sharedStatePrivateById.has(stateId)) {
            state = this._sharedStatePrivateById.get(stateId);
          } else if (stateId === null) {
            // if no `stateId` given, we try to find the first state with the given
            // `schemaName` in the list, this allow a client to attach to a global
            // state created by the server (or some persistant client) without
            // having to know the `stateId` (e.g. some global state...)
            for (let existingState of this._sharedStatePrivateById.values()) {
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
            const currentValues = state._parameters.getValues();
            const schema = this._schemas.get(schemaName);
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

            state._attachClient(remoteId, client, isOwner, filter);

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
      if (observedSchemaName === null || this._schemas.has(observedSchemaName)) {
        const statesInfos = [];

        this._sharedStatePrivateById.forEach(state => {
          const isObservable = this[kIsObservableState](state);

          if (isObservable) {
            const { schemaName, id, _creatorId } = state;
            statesInfos.push([schemaName, id, _creatorId]);
          }
        });

        // add client to observers first because if some synchronous server side
        // callback throws, the client would never be added to the list
        this._observers.add(client);

        client.transport.emit(OBSERVE_RESPONSE, reqId, ...statesInfos);
      } else {
        const msg = `[stateManager] Cannot observe, schema "${observedSchemaName}" does not exists`;
        client.transport.emit(OBSERVE_ERROR, reqId, msg);
      }
    });

    client.transport.addListener(UNOBSERVE_NOTIFICATION, () => {
      this._observers.delete(client);
    });

    // ---------------------------------------------
    // GET SCHEMA
    // ---------------------------------------------
    client.transport.addListener(GET_SCHEMA_REQUEST, (reqId, schemaName) => {
      if (this._schemas.has(schemaName)) {
        const schema = this._schemas.get(schemaName);
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
   * This is automatically handled by the {@link server.Server} when a client disconnects.
   *
   * @param {number} nodeId - Id of the client node, as given in
   *  {@link client.StateManager}
   *
   * @private
   */
  removeClient(nodeId) {
    for (let [_id, state] of this._sharedStatePrivateById.entries()) {
      let deleteState = false;

      // define if the client is the creator of the state, in which case
      // everybody must delete it
      for (let [remoteId, clientInfos] of state._attachedClients) {
        const attachedClient = clientInfos.client;

        if (nodeId === attachedClient.id && remoteId === state._creatorRemoteId) {
          deleteState = true;
        }
      }

      for (let [remoteId, clientInfos] of state._attachedClients) {
        const attachedClient = clientInfos.client;

        if (nodeId === attachedClient.id) {
          state._detachClient(remoteId, attachedClient);
        }

        if (deleteState) {
          if (remoteId !== state._creatorRemoteId) {
            // send notification to other attached nodes
            attachedClient.transport.emit(`${DELETE_NOTIFICATION}-${state.id}-${remoteId}`);
          }

          this._sharedStatePrivateById.delete(state.id);
        }
      }
    }

    // if is an observer, delete it
    const client = this._clientByNodeId.get(nodeId);
    this._observers.delete(client);
    this._clientByNodeId.delete(nodeId);
  }

  /**
   * Register a schema from which shared states (cf. {@link common.SharedState})
   * can be instanciated.
   *
   * @param {string} schemaName - Name of the schema.
   * @param {server.StateManager~schema} schema - Data structure
   *  describing the states that will be created from this schema.
   *
   * @see {@link server.StateManager#create}
   * @see {@link client.StateManager#create}
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

    if (this._schemas.has(schemaName)) {
      throw new Error(`[stateManager.registerSchema] cannot register schema with name: "${schemaName}", schema name already exists`);
    }

    if (!isPlainObject(schema)) {
      throw new Error(`[stateManager.registerSchema] Invalid schema, should be an object`);
    }

    ParameterBag.validateSchema(schema);

    this._schemas.set(schemaName, clonedeep(schema));
    // create hooks list
    this._hooksBySchemaName.set(schemaName, new Set());
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
    for (let [_id, state] of this._sharedStatePrivateById) {
      if (state.schemaName === schemaName) {
        for (let [remoteId, clientInfos] of state._attachedClients) {
          const attached = clientInfos.client;
          state._detachClient(remoteId, attached);
          attached.transport.emit(`${DELETE_NOTIFICATION}-${state.id}-${remoteId}`);
        }

        this._sharedStatePrivateById.delete(state.id);
      }
    }

    // clear schema cache of all connected clients
    for (let client of this._clientByNodeId.values()) {
      client.transport.emit(`${DELETE_SCHEMA}`, schemaName);
    }

    this._schemas.delete(schemaName);
    // delete registered hooks
    this._hooksBySchemaName.delete(schemaName);
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
   * @param {server.StateManager~updateHook} updateHook - Function
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
    if (!this._schemas.has(schemaName)) {
      throw new Error(`[stateManager.registerUpdateHook] cannot register update hook for schema name "${schemaName}", schema name does not exists`);
    }

    const hooks = this._hooksBySchemaName.get(schemaName);
    hooks.add(updateHook);

    return () => hooks.delete(updateHook);
  }
}

export default StateManager;
