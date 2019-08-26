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


function* idGenerator() {
  for (let i = 0; true; i++) {
    yield i;
  }
}

const generateRequestId = idGenerator();
const requestPromises = new Map();

function storeRequestPromise(resolve, reject) {
  const reqId = generateRequestId.next().value;
  requestPromises.set(reqId, { resolve, reject });

  return reqId;
}

function resolveRequest(reqId, data) {
  const { resolve } = requestPromises.get(reqId);
  requestPromises.delete(reqId);

  resolve(data);
}

function rejectRequest(reqId, data) {
  const { resolve, reject } = requestPromises.get(reqId);
  requestPromises.delete(reqId);

  reject(data);
}

class State {
  constructor(id, schemaName, schema, creator, owner, client, manager, initValues = {}) {
    this.id = id;
    this.schemaName = schemaName;

    this._schema = clonedeep(schema);
    this._creator = creator; // may be the server or any client
    this._owner = owner; // server by default

    this._client = client;
    this._manager = manager;

    this._parameters = parameters(schema, initValues);
    this._subscriptions = new Set();

    this._onDetachCallbacks = new Set();

    // add listener for state updates
    if (owner !== client.id) {
      client.socket.addListener(`${UPDATE_RESPONSE}-${id}`, (reqId, updates) => {
        const updated = this._commit(updates);
        resolveRequest(reqId, updated);
      });

      client.socket.addListener(`${UPDATE_NOTIFICATION}-${id}`, (updates) => {
        this._commit(updates);
      });

      if (creator === client.id) {
        // ---------------------------------------------
        // DELETE (can only delete if creator)
        // ---------------------------------------------
        client.socket.addListener(`${DELETE_RESPONSE}-${id}`, (reqId) => {
          this._manager._statesById.delete(this.id);
          this._clearTransport();

          this._onDetachCallbacks.forEach(callback => callback());
          resolveRequest(reqId, this);
        });

        client.socket.addListener(`${DELETE_ERROR}-${id}`, (reqId, msg) => {
          rejectRequest(reqId, msg);
        });

      } else {

        // ---------------------------------------------
        // DELETE initiated by creator
        // ---------------------------------------------
        client.socket.addListener(`${DELETE_NOTIFICATION}-${id}`, () => {
          this._manager._statesById.delete(this.id);
          this._clearTransport();

          this._onDetachCallbacks.forEach(callback => callback());
        });

        // ---------------------------------------------
        // DETACH
        // ---------------------------------------------
        client.socket.addListener(`${DETACH_RESPONSE}-${id}`, (reqId) => {
          this._manager._statesById.delete(this.id);
          this._clearTransport();

          this._onDetachCallbacks.forEach(func => func());
          resolveRequest(reqId, this);
        });

        // the state does not exists anymore in the server
        client.socket.addListener(`${DETACH_ERROR}-${id}`, (reqId, msg) => {
          rejectRequest(reqId, msg);
        });

      }
    }
  }

  _clearTransport() {
    // remove listeners
    this._client.socket.removeAllListeners(`${UPDATE_RESPONSE}-${this.id}`);
    this._client.socket.removeAllListeners(`${UPDATE_NOTIFICATION}-${this.id}`);
    this._client.socket.removeAllListeners(`${DELETE_RESPONSE}-${this.id}`);
    this._client.socket.removeAllListeners(`${DELETE_NOTIFICATION}-${this.id}`);
    this._client.socket.removeAllListeners(`${DETACH_RESPONSE}-${this.id}`);
  }

  /** @private */
  _commit(obj) {
    const updated = {};

    for (let name in obj) {
      updated[name] = this._parameters.set(name, obj[name]);
    }

    this._subscriptions.forEach(listener => listener(updated));
    return updated;
  }

  getSchema() {
    return this._schema;
  }

  set(updates) {
    if (this._owner !== this._client.id) {
      return new Promise((resolve, reject) => {
        const reqId = storeRequestPromise(resolve, reject);
        this._client.socket.send(`${UPDATE_REQUEST}-${this.id}`, reqId, updates);
      });
    } else {
      // local state
      const updated = this._commit(updates);
      return Promise.resolve(updated);
    }
  }

  get(name) {
    return this._parameters.get(name);
  }

  getValues() {
    return this._parameters.getValues();
  }

  subscribe(listener) {
    this._subscriptions.add(listener);

    return () => {
      this._subscriptions.delete(listener);
    };
  }

  detach() {
    this._subscriptions.clear();

    if (this._client.id !== this._creator) {
      return new Promise((resolve, reject) => {
        const reqId = storeRequestPromise(resolve, reject);
        this._client.socket.send(`${DETACH_REQUEST}-${this.id}`, reqId);
      });
    } else {
      return new Promise((resolve, reject) => {
        const reqId = storeRequestPromise(resolve, reject);
        this._client.socket.send(`${DELETE_REQUEST}-${this.id}`, reqId);
      });
    }
  }

  onDetach(callback) {
    this._onDetachCallbacks.add(callback);
  }
}

class StateManager {
  constructor(client) {
    this.client = client;

    this._statesById = new Map();
    this._observeListeners = new Set();

    // ---------------------------------------------
    // CREATE
    // ---------------------------------------------
    this.client.socket.addListener(CREATE_RESPONSE, (reqId, id, schemaName, schema, creator, owner) => {
      const state = new State(id, schemaName, schema, creator, owner, this.client, this);
      this._statesById.set(state.id, state);

      resolveRequest(reqId, state);
    });

    this.client.socket.addListener(CREATE_ERROR, (msg, reqId) => {
      rejectRequest(reqId, msg);
    });

    // ---------------------------------------------
    // ATTACH (when creator, is attached by default)
    // ---------------------------------------------
    // @note - we have room to improve network footprint by letting know the
    // server that the client already know the schema, and that the server
    // doesn't need to send it again (sends null instead).
    // in this case, if we manage to make that dynamic at some point (dynamic
    // schema) the server should be able to invalidate the schema and send
    // it again despite that.
    this.client.socket.addListener(ATTACH_RESPONSE, (reqId, id, schemaName, schema, creator, owner, currentValues) => {
      const state = new State(id, schemaName, schema, creator, owner, this.client, this, currentValues);
      this._statesById.set(state.id, state);

      resolveRequest(reqId, state);
    });

    this.client.socket.addListener(ATTACH_ERROR, (reqId, msg) => {
      rejectRequest(reqId, msg);
    });

    // ---------------------------------------------
    // OBSERVE PEERS (be notified when a state is created, lazy)
    // ---------------------------------------------
    this.client.socket.addListener(OBSERVE_RESPONSE, (reqId, ...list) => {
      if (list) { // if only client there, list could be empty
        list.forEach(([schemaName, nodeId]) => {
          this._observeListeners.forEach(callback => callback(schemaName, nodeId));
        });
      }

      resolveRequest(reqId, list);
    });

    this.client.socket.addListener(OBSERVE_NOTIFICATION, (...list) => {
      list.forEach(([schemaName, nodeId]) => {
        this._observeListeners.forEach(callback => callback(schemaName, nodeId));
      });
    });
  }

  async create(schemaName, synced = true) {
    return new Promise((resolve, reject) => {
      const reqId = storeRequestPromise(resolve, reject); // @todo - add a timeout
      this.client.socket.send(CREATE_REQUEST, reqId, schemaName, synced);
    });
  }

  async attach(schemaName, peerId = SERVER_ID) {
    return new Promise((resolve, reject) => {
      const reqId = storeRequestPromise(resolve, reject); // @todo - add a timeout
      this.client.socket.send(ATTACH_REQUEST, reqId, schemaName, peerId);
    });
  }

  observe(callback) {
    this._observeListeners.add(callback);
    // store function
    new Promise((resolve, reject) => {
      const reqId = storeRequestPromise(resolve, reject);
      this.client.socket.send(OBSERVE_REQUEST, reqId);
    });
  }
}

export default StateManager;
