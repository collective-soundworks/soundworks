import parameters from '@ircam/parameters';
import clonedeep from 'lodash.clonedeep';

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
  UPDATE_NOTIFICATION,
} from '../common/stateManagerConstants';


class State {
  constructor(id, schemaName, schema, creator, owner, manager) {
    this.id = id;
    this.schemaName = schemaName;

    this._schema = clonedeep(schema);
    this._creator = creator; // may be the server or any client
    this._owner = owner; // server by default
    this._manager = manager;

    this._parameters = parameters(schema);
    this._attachedClients = new Set(); // other peers interested in watching / controlling the state
    this._subscriptions = new Set();

    this._onDetachCallbacks = new Set();
  }

    // this would be nice to be able to attach the client from
  // server side ...or maybe not (TBC)...
  _attachClient(client) {
    this._attachedClients.add(client);
    // add client listeners for this state
    client.socket.addListener(`${UPDATE_REQUEST}-${this.id}`, (reqId, obj) => {
      this.set(obj, client.id, reqId);
    });

    if (client.id === this._creator) {
      // ---------------------------------------------
      // DELETE - only if creator
      // ---------------------------------------------
      client.socket.addListener(`${DELETE_REQUEST}-${this.id}`, (reqId) => {
        this._attachedClients.forEach(attached => {
          if (attached === client) {
            attached.socket.send(`${DELETE_RESPONSE}-${this.id}`, reqId);
          } else {
            attached.socket.send(`${DELETE_NOTIFICATION}-${this.id}`);
          }

          this._detachClient(attached);
        });

        this._manager._statesById.delete(this.id);
        // execute detach callbacks that may have been registered serve-side
        this._onDetachCallbacks.forEach(callback => callback());
        this._onDetachCallbacks.clear();
      });
    } else {
      // ---------------------------------------------
      // DETACH - only if not creator
      // ---------------------------------------------
      client.socket.addListener(`${DETACH_REQUEST}-${this.id}`, (reqId) => {
        // if (this._statesById.has(stateId)) {
        this._detachClient(client);
        client.socket.send(`${DETACH_RESPONSE}-${this.id}`, reqId);
        // } else {
        //   const msg = `Cannot detach, state "${stateId}" does not exists`;
        //   client.socket.send(DETACH_ERROR, reqId, msg);
        // }
      });
    }
  }

  _detachClient(client) {
    this._attachedClients.delete(client);
    // delete listeners
    client.socket.removeAllListeners(`${UPDATE_REQUEST}-${this.id}`);
    client.socket.removeAllListeners(`${DELETE_REQUEST}-${this.id}`);
    client.socket.removeAllListeners(`${DETACH_REQUEST}-${this.id}`);
  }

  getSchema(name = null) {
    if (name) {
      return this._schema[name];
    } else {
      return this._schema;
    }
  }

  set(obj, _requester = null, _reqId = null) {
    if (this._owner === SERVER_ID) { // state has been created by server and is owned by the server
      const updated = {};

      for (let name in obj) {
        // do that to store events return values
        updated[name] = this._parameters.set(name, obj[name]);
      }

      // propagate to attached clients
      this._attachedClients.forEach(peer => {
        if (_requester === peer.id) {
          peer.socket.send(`${UPDATE_RESPONSE}-${this.id}`, _reqId, updated);
        } else {
          peer.socket.send(`${UPDATE_NOTIFICATION}-${this.id}`, updated);
        }
      });

      // keep here as if a subscription sends a message, ordering is kept coherent
      this._subscriptions.forEach(func => func(updated));
    } else {
      // not the problem of the server - should not be possible
      console.error(`\`state.set\` should be called only when server is owner`);
    }
  }

  get(name) {
    return this._parameters.get(name);
  }

  getValues() {
    return this._parameters.getValues();
  }

  subscribe(func) {
    this._subscriptions.add(func);

  }

  detach() {
    this._subscriptions.clear();
    // if server is creator - properly delete state and notify everyone
    if (this._creator === SERVER_ID) {
      this._attachedClients.forEach(attached => {
        this._detachClient(attached);
        attached.socket.send(`${DELETE_NOTIFICATION}-${this.id}`);
      });

      this._manager._statesById.delete(this.id);
    }

    this._onDetachCallbacks.forEach(callback => callback());
    // we clear the callbacks as the server might detach before the state
    // is deleted, and we don't to trigger the callbacks twice.
    this._onDetachCallbacks.clear();

    return Promise.resolve();
  }

  onDetach(callback) {
    this._onDetachCallbacks.add(callback);
  }
}


/**
 * @todo - review
 * @note - Maybe we can assume the owner is always the server here
 * If the owner is a client, the server just send infos for
 * proper instanciations.
 *
 * @memberof @soundworks/core/server
 */
class StateManager {

  constructor() {
    this._statesById = new Map();
    this._schemas = new Map();
    this._observeListeners = new Set();
    this._observers = new Set();
  }

  _getSchemaId(schemaName, creator, owner) {
    // @fixme - in next version, should not rely on index because it prevents
    // delete schemas and thus mess up indexes...
    const index = Array.from(this._schemas.keys()).indexOf(schemaName);
    return `${index}.${creator}.${owner}`;
  }

  addClient(client) {
    // ---------------------------------------------
    // CREATE
    // ---------------------------------------------
    client.socket.addListener(CREATE_REQUEST, (reqId, schemaName, synced) => {
      const creator = client.id;

      if (this._schemas.has(schemaName)) {
        const schema = this._schemas.get(schemaName);

        if (synced === false) {
          // just send back informations to the client so that he can build the state
          const id = this._getSchemaId(schemaName, creator, creator);
          client.socket.send(CREATE_RESPONSE, reqId, id, schema, creator, creator);
        } else {
          try {
            const state = this.create(schemaName, creator);
            state._attachClient(client); // attach client to the state

            client.socket.send(CREATE_RESPONSE, reqId, state.id, schemaName, schema, creator, SERVER_ID);

            // notify all nodes
            this._observeListeners.forEach(listener => listener(schemaName, creator));

            this._observers.forEach(observer => {
              // observers don't want to be notified of their own `create`
              if (observer.id !== creator) {
                observer.socket.send(OBSERVE_NOTIFICATION, [schemaName, creator]);
              }
            });
          } catch(err) {
            client.socket.send(CREATE_ERROR, reqId, err.message);
            console.error(err.message);
          }
        }
      } else {
        const msg = `Cannot create state "${schemaName}", schema does not exists`;
        client.socket.send(CREATE_ERROR, msg, reqId);
        console.error(msg);
      }
    });

    // ---------------------------------------------
    // ATTACH (when creator, is attached by default)
    // ---------------------------------------------
    client.socket.addListener(ATTACH_REQUEST, (reqId, schemaName, creatorId) => {
      if (this._schemas.has(schemaName)) {
        const id = this._getSchemaId(schemaName, creatorId, SERVER_ID);

        if (this._statesById.has(id)) {
          const state = this._statesById.get(id);
          const schema = state._schema;
          const currentValues = state.getValues();
          state._attachClient(client);

          const { _creator, _owner } = state;
          // send schema for client-side instanciation
          client.socket.send(ATTACH_RESPONSE, reqId, id, schemaName, schema, _creator, _owner, currentValues);
        } else {
          const msg = `Cannot attach, no state for schema "${schemaName}" with id ${id}`;
          client.socket.send(ATTACH_ERROR, reqId, msg);
          console.error(msg);
        }
      } else {
        const msg = `Cannot attach, schema "${schemaName}" does not exists`;
        client.socket.send(ATTACH_ERROR, reqId, msg);
        console.error(msg);
      }
    });

    // ---------------------------------------------
    // OBSERVE PEERS (be notified when a state is created, lazy)
    // ---------------------------------------------
    client.socket.addListener(OBSERVE_REQUEST, (reqId) => {
      // @note - there is room for improving network footprint here by doing
      // a msg like { schemaName: [ids] } and unpack it client side.
      const clientSchemaPairs = []; // list of [schemaName, nodeId]

      this._statesById.forEach(state => {
        if (client.id !== state._creator) {
          clientSchemaPairs.push([state.schemaName, state._creator]);
        }
      });

      client.socket.send(OBSERVE_RESPONSE, reqId, ...clientSchemaPairs);

      this._observers.add(client);
    });
  }

  removeClient(client) {
    for (let [id, state] of this._statesById) {
      // handle states created by the client
      if (state._creator == client.id) {
        // detach client nodes and send notification to peers
        state._attachedClients.forEach(attached => {
          state._detachClient(attached);

          if (attached !== client) {
            attached.socket.send(`${DELETE_NOTIFICATION}-${state.id}`);
          }
        });

        // detach server node
        state.detach();

        this._statesById.delete(state.id);

      // detach from other states
      } else if (state._attachedClients.has(client)) {
        state._detachClient(client);
      }
    }

    this._observers.delete(client);
  }

  registerSchema(schemaName, schema) {
    if (this._schemas.has(schemaName)) {
      throw new Error(`schema "${schemaName}" already registered`);
    }

    this._schemas.set(schemaName, clonedeep(schema));
  }

  create(schemaName, creator = SERVER_ID, _owner = SERVER_ID) {
    if (this._schemas.has(schemaName)) {
      const schema = this._schemas.get(schemaName);
      const id = this._getSchemaId(schemaName, creator, _owner);
      // console.log(id);
      if (!this._statesById.has(id)) {
        const state = new State(id, schemaName, schema, creator, _owner, this);
        this._statesById.set(id, state);

        // on other cases, we first want to attach and notify the creator (see line ~210)
        if (creator === SERVER_ID) {
          // notify only client nodes
          this._observers.forEach(observer => {
            observer.socket.send(OBSERVE_NOTIFICATION, [schemaName, creator]);
          });
        }

        return state;
      } else {
        throw(`Cannot create state, state "${name}" (creator: "${creator}", owner: "${_owner}") already exists`);
      }
    } else {
      throw(`Cannot create state, schema "${name}" does not exists`);
    }
  }

  attach(schemaName, nodeId) {
    if (nodeId !== SERVER_ID) {
      const id = this._getSchemaId(schemaName, nodeId, SERVER_ID);
      const state = this._statesById.get(id);
      return Promise.resolve(state);
    } else {
      return Promise.reject(`Cannot attach, server is creator of the state`);
    }
  }

  observe(func) {
    this._observeListeners.add(func);
  }
}

export default StateManager;
