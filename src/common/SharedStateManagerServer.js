import EventEmitter from 'events';
import ParameterBag from './params/ParameterBag.js';
import clonedeep from 'lodash.clonedeep';
import SharedStatePrivate from './SharedStatePrivate.js';
import SharedStateManagerClient from './SharedStateManagerClient.js';
import {
  // constants
  SERVER_ID,
  CREATE_REQUEST,
  CREATE_RESPONSE,
  CREATE_ERROR,
  DELETE_REQUEST,
  DELETE_RESPONSE,
  DELETE_ERROR,
  DELETE_NOTIFICATION,
  ATTACH_REQUEST,
  ATTACH_RESPONSE,
  ATTACH_ERROR,
  DETACH_REQUEST,
  DETACH_RESPONSE,
  DETACH_ERROR,
  OBSERVE_REQUEST,
  OBSERVE_RESPONSE,
  OBSERVE_NOTIFICATION,
  UPDATE_REQUEST,
  UPDATE_RESPONSE,
  UPDATE_ABORT,
  UPDATE_NOTIFICATION,
  idGenerator,
} from './shared-state-utils.js';

const generateStateId = idGenerator();
const generateRemoteId = idGenerator();

/**
 * Component dedicated at managing distributed states among the application.
 * The `SharedStateManagerServer` extends the `SharedStateManagerClient` with
 * additionnal functionnalities to register schemas and handle clients.
 *
 * An instance of `SharedStateManagerClient` is automatically created by the
 * `soundworks.Server` (cf. {@link server.Server#stateManager}).
 *
 * Tutorial: [https://collective-soundworks.github.io/tutorials/state-manager.html](https://collective-soundworks.github.io/tutorials/state-manager.html)
 *
 * @memberof server
 * @extends client.SharedStateManagerClient
 *
 * @see {@link client.SharedStateManagerClient}
 * @see {@link server.SharedState}
 * @see {@link server.Server#stateManager}
 */
class SharedStateManagerServer extends SharedStateManagerClient {
  constructor() {
    // acts as a client of itself locally
    const localClientId = -1;
    const localTransport = new EventEmitter();

    super(localClientId, localTransport);

    this._clientByNodeId = new Map();
    this._serverStatesById = new Map();
    this._schemas = new Map();
    this._observers = new Set();

    this.addClient(localClientId, localTransport);
  }

  /**
   * Add a client. This is automatically handle by `soundworks` when a client
   * connects.
   *
   * @param {Number} nodeId - Id of the client node, as given in
   *  {@link client.SharedStateManagerClient}
   * @param {Object} transport - Tranpsort mecanism to communicate with the
   *  client. Should implement a basic EventEmitter API.
   *
   * @private
   */
  addClient(nodeId, transport) {
    const client = { id: nodeId, transport };
    this._clientByNodeId.set(nodeId, client);

    // ---------------------------------------------
    // CREATE
    // ---------------------------------------------
    client.transport.addListener(CREATE_REQUEST, (reqId, schemaName, requireSchema, initValues = {}) => {
      if (this._schemas.has(schemaName)) {
        try {
          const schema = this._schemas.get(schemaName);
          const stateId = generateStateId.next().value;
          const remoteId = generateRemoteId.next().value;
          // id, schemaName, schema, manager, initValues = {}
          const state = new SharedStatePrivate(stateId, schemaName, schema, this, initValues);

          state._attachClient(remoteId, client, true); // attach client to the state
          this._serverStatesById.set(stateId, state);

          const currentValues = state._parameters.getValues();
          const sendedSchema = requireSchema ? schema : null;

          client.transport.emit(CREATE_RESPONSE, reqId, stateId, remoteId, schemaName, sendedSchema, currentValues);

          this._observers.forEach(observer => {
            observer.transport.emit(OBSERVE_NOTIFICATION, [schemaName, stateId, nodeId]);
          });
        } catch(err) {
          client.transport.emit(CREATE_ERROR, reqId, err.message);
          console.error(err.message);
        }
      } else {
        const msg = `Cannot create state "${schemaName}", schema does not exists`;
        console.error(msg);
        client.transport.emit(CREATE_ERROR, reqId, msg);
      }
    });

    // ---------------------------------------------
    // ATTACH (when creator, is attached by default)
    // ---------------------------------------------
    client.transport.addListener(ATTACH_REQUEST, (reqId, schemaName, stateId = null, requireSchema = true) => {
      if (this._schemas.has(schemaName)) {
        let state = null;


        if (stateId !== null && this._serverStatesById.has(stateId)) {
          state = this._serverStatesById.get(stateId);
        } else if (stateId === null) {
          // if no `stateId` given, we try to find the first state with the given
          // `schemaName` in the list, this allow a client to attach to a global
          // state created by the server (or some persistant client) without
          // having to know the `stateId` (e.g. some global state...)
          for (let existingState of this._serverStatesById.values()) {
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
          const schema = this._schemas.get(schemaName);
          const currentValues = state._parameters.getValues();

          state._attachClient(remoteId, client, false);
          // send schema for client-side instanciation
          const sendedSchema = requireSchema ? schema : null;
          client.transport.emit(ATTACH_RESPONSE, reqId, state.id, remoteId, schemaName, sendedSchema, currentValues);
        } else {
          const msg = `Cannot attach, no existing state for schema "${schemaName}" with stateId: "${stateId}"`;
          client.transport.emit(ATTACH_ERROR, reqId, msg);
          console.error(msg);
        }
      } else {
        const msg = `Cannot attach, schema "${schemaName}" does not exists`;
        client.transport.emit(ATTACH_ERROR, reqId, msg);
        console.error(msg);
      }
    });

    // ---------------------------------------------
    // OBSERVE PEERS (be notified when a state is created, lazy)
    // ---------------------------------------------
    client.transport.addListener(OBSERVE_REQUEST, (reqId) => {
      const statesInfos = [];

      this._serverStatesById.forEach(state => {
        const { schemaName, id, _creatorId } = state;
        statesInfos.push([schemaName, id, _creatorId]);
      });

      client.transport.emit(OBSERVE_RESPONSE, reqId, ...statesInfos);

      this._observers.add(client);
    });
  }

  /**
   * Remove a client. This is automatically handle by `soundworks` when a client
   * connects.
   *
   * @param {Number} nodeId - Id of the client node, as given in
   *  {@link client.SharedStateManagerClient}
   *
   * @private
   */
  removeClient(nodeId) {
    for (let [id, state] of this._serverStatesById.entries()) {
      let deleteState = false;

      // define if the client is the creator of the state, in which case
      // everybody must delete it
      for (let [remoteId, attachedClient] of state._attachedClients.entries()) {
        if (nodeId === attachedClient.id && remoteId === state._creatorRemoteId) {
          deleteState = true;
        }
      }

      for (let [remoteId, attachedClient] of state._attachedClients.entries()) {
        if (nodeId === attachedClient.id) {
          state._detachClient(remoteId, attachedClient);
        }

        if (deleteState) {
          if (remoteId !== state._creatorRemoteId) {
            // send notification to other attached nodes
            attachedClient.transport.emit(`${DELETE_NOTIFICATION}-${state.id}-${remoteId}`);
          }

          this._serverStatesById.delete(state.id);
        }
      }
    }

    // if is an observer, delete it
    const client = this._clientByNodeId.get(nodeId);
    this._observers.delete(client);
    this._clientByNodeId.delete(nodeId);
  }

  /**
   * Register a schema. The schema definition follows the convention described
   * here [https://github.com/ircam-jstools/parameters#booleandefinition--object](https://github.com/ircam-jstools/parameters#booleandefinition--object) (@todo - document somewhere else).
   *
   * @param {String} schemaName - Name of the schema.
   * @param {Object} schema - Description of the state data structure.
   */
  registerSchema(schemaName, schema) {
    if (this._schemas.has(schemaName)) {
      throw new Error(`[stateManager] schema "${schemaName}" already registered`);
    }

    ParameterBag.validateSchema(schema);

    this._schemas.set(schemaName, clonedeep(schema));
  }

  /**
   * Delete a schema and all associated states.
   * When a schema is deleted, all attached clients are detached
   * and the `onDetach` and `onDelete` callbacks are called.
   *
   * @param {String} schemaName - Name of the schema.
   */
  deleteSchema(schemaName) {
    for (let [id, state] of this._serverStatesById.entries()) {
      if (state.schemaName === schemaName) {
        for (let [remoteId, attached] of state._attachedClients.entries()) {
          state._detachClient(remoteId, attached);
          attached.transport.emit(`${DELETE_NOTIFICATION}-${state.id}-${remoteId}`);
        }

        this._serverStatesById.delete(this.id);
      }
    }

    this._schemas.delete(schemaName);
  }
}

export default SharedStateManagerServer;
