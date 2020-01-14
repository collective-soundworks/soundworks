import EventEmitter from 'events';
import parameters from '@ircam/parameters';
import clonedeep from 'lodash.clonedeep';
import ClientStateManager from './ClientStateManager';

function* idGenerator() {
  for (let i = 0; true; i++) {
    yield i;
  }
}

const generateStateId = idGenerator();
const generateRemoteId = idGenerator();

import {
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
} from './stateManagerConstants';

/**
 * The "real" state, this instance is kept private by the server.
 * @private
 */
class ServerState {
  constructor(id, schemaName, schema, manager, initValues = {}) {
    this.id = id;
    this.schemaName = schemaName;

    // this._schema = clonedeep(schema);
    this._manager = manager;
    this._parameters = parameters(schema, initValues);
    this._attachedClients = new Map(); // other peers interested in watching / controlling the state

    this._creatorRemoteId = null;
    this._creatorId = null;
  }

  _attachClient(remoteId, client, isCreator = false) {
    this._attachedClients.set(remoteId, client);

    if (isCreator) {
      this._creatorRemoteId = remoteId;
      this._creatorId = client.id;
    }

    // attach client listeners
    client.transport.addListener(`${UPDATE_REQUEST}-${this.id}-${remoteId}`, (reqId, updates) => {
      const updated = {};
      let dirty = false;

      for (let name in updates) {
        const currentValue = this._parameters.get(name);
        // get new value this way to store events return values
        const newValue = this._parameters.set(name, updates[name]);

        if (newValue !== currentValue) {
          updated[name] = newValue;
          dirty = true;
        }
      }

      if (dirty) {
        // send response to requester
        client.transport.emit(`${UPDATE_RESPONSE}-${this.id}-${remoteId}`, reqId, updated)

        // --------------------------------------------------------------------
        // WARNING - MAKE SURE WE DON'T HAVE PROBLEM W/ THAT
        // --------------------------------------------------------------------
        // @todo - propagate server-side last, because if a subscription function sends a
        // message to a client, network messages order are kept coherent
        // this._subscriptions.forEach(func => func(updated));
        for (let [peerRemoteId, peer] of this._attachedClients.entries()) {
          // propagate notification to all other attached clients
          if (remoteId !== peerRemoteId) {
            peer.transport.emit(`${UPDATE_NOTIFICATION}-${this.id}-${peerRemoteId}`, updated);
          }
        }
      } else {
        // propagate back to requester that the update has been aborted w/
        // updates, ignore all other attached clients.
        client.transport.emit(`${UPDATE_ABORT}-${this.id}-${remoteId}`, reqId, updates);
      }
    });

    if (isCreator) {
      // delete only if creator
      client.transport.addListener(`${DELETE_REQUEST}-${this.id}-${remoteId}`, (reqId) => {
        // --------------------------------------------------------------------
        // WARNING - MAKE SURE WE DON'T HAVE PROBLEM W/ THAT
        // --------------------------------------------------------------------
        // @todo - propagate server-side last, because if a subscription function sends a
        // message to a client, network messages order are kept coherent
        // this._subscriptions.forEach(func => func(updated));
        for (let [remoteId, attached] of this._attachedClients.entries()) {
          this._detachClient(remoteId, attached);

          if (remoteId === this._creatorRemoteId) {
            attached.transport.emit(`${DELETE_RESPONSE}-${this.id}-${remoteId}`, reqId);
          } else {
            attached.transport.emit(`${DELETE_NOTIFICATION}-${this.id}-${remoteId}`);
          }
        }

        this._manager._statesById.delete(this.id);
      });
    } else {
      // detach only if not creator
      client.transport.addListener(`${DETACH_REQUEST}-${this.id}-${remoteId}`, (reqId) => {
        this._detachClient(remoteId, client);
        client.transport.emit(`${DETACH_RESPONSE}-${this.id}-${remoteId}`, reqId);
      });
    }
  }

  _detachClient(remoteId, client) {
    this._attachedClients.delete(remoteId);
    // delete listeners
    client.transport.removeAllListeners(`${UPDATE_REQUEST}-${this.id}-${remoteId}`);
    client.transport.removeAllListeners(`${DELETE_REQUEST}-${this.id}-${remoteId}`);
    client.transport.removeAllListeners(`${DETACH_REQUEST}-${this.id}-${remoteId}`);
  }
}


/**
 * The server extends the ClientStateManager with additionnal functionnalities
 * such as registering schema and other ClientStateManager instances.
 */
class ServerStateManager extends ClientStateManager {
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
          const state = new ServerState(stateId, schemaName, schema, this, initValues);

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
      const clientSchemaPairs = [];

      this._serverStatesById.forEach(state => {
        const { schemaName, id, _creatorId } = state;
        clientSchemaPairs.push([schemaName, id, _creatorId]);
      });

      client.transport.emit(OBSERVE_RESPONSE, reqId, ...clientSchemaPairs);

      this._observers.add(client);
    });
  }

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

  registerSchema(schemaName, schema) {
    if (this._schemas.has(schemaName)) {
      throw new Error(`schema "${schemaName}" already registered`);
    }

    this._schemas.set(schemaName, clonedeep(schema));
  }

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

export default ServerStateManager;
