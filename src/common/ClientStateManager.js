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
  UPDATE_ABORT,
  UPDATE_NOTIFICATION,
} from './stateManagerConstants';


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

/** @private */
class State {
  constructor(id, remoteId, schemaName, schema, client, isCreator, manager, initValues = {}) {
    this.id = id;
    this.remoteId = remoteId;
    this.schemaName = schemaName;

    this._schema = clonedeep(schema);
    this._isCreator = isCreator; // may be the server or any client
    this._client = client;
    this._manager = manager;
    this._parameters = parameters(schema, initValues);
    this._subscriptions = new Set();

    this._onDetachCallbacks = new Set();
    this._onDeleteCallbacks = new Set();

    // add listener for state updates
    client.transport.addListener(`${UPDATE_RESPONSE}-${id}-${this.remoteId}`, (reqId, updates) => {
      const updated = this._commit(updates);
      resolveRequest(reqId, updated);
    });

    // retrieve values but do not propagate to subscriptions
    client.transport.addListener(`${UPDATE_ABORT}-${id}-${this.remoteId}`, (reqId, updates) => {
      const updated = this._commit(updates, false);
      resolveRequest(reqId, updated);
    });

    client.transport.addListener(`${UPDATE_NOTIFICATION}-${id}-${this.remoteId}`, (updates) => {
      this._commit(updates);
    });

    // ---------------------------------------------
    // DELETE initiated by creator, or schema deleted
    // ---------------------------------------------
    client.transport.addListener(`${DELETE_NOTIFICATION}-${id}-${this.remoteId}`, () => {
      this._manager._statesById.delete(this.id);
      this._clearTransport();

      this._onDetachCallbacks.forEach(callback => callback());
      this._onDeleteCallbacks.forEach(callback => callback());
    });


    if (this._isCreator) {
      // ---------------------------------------------
      // DELETE (can only delete if creator)
      // ---------------------------------------------
      client.transport.addListener(`${DELETE_RESPONSE}-${id}-${this.remoteId}`, (reqId) => {
        this._manager._statesById.delete(this.id);
        this._clearTransport();

        this._onDetachCallbacks.forEach(callback => callback());
        this._onDeleteCallbacks.forEach(callback => callback());
        resolveRequest(reqId, this);
      });

      client.transport.addListener(`${DELETE_ERROR}-${id}`, (reqId, msg) => {
        rejectRequest(reqId, msg);
      });

    } else {
      // ---------------------------------------------
      // DETACH
      // ---------------------------------------------
      client.transport.addListener(`${DETACH_RESPONSE}-${id}-${this.remoteId}`, (reqId) => {
        this._manager._statesById.delete(this.id);
        this._clearTransport();

        this._onDetachCallbacks.forEach(func => func());
        resolveRequest(reqId, this);
      });

      // the state does not exists anymore in the server (should not happen)
      client.transport.addListener(`${DETACH_ERROR}-${id}`, (reqId, msg) => {
        rejectRequest(reqId, msg);
      });

    }
  }

  _clearTransport() {
    // remove listeners
    this._client.transport.removeAllListeners(`${UPDATE_RESPONSE}-${this.id}-${this.remoteId}`);
    this._client.transport.removeAllListeners(`${UPDATE_NOTIFICATION}-${this.id}-${this.remoteId}`);
    this._client.transport.removeAllListeners(`${DELETE_RESPONSE}-${this.id}-${this.remoteId}`);
    this._client.transport.removeAllListeners(`${DELETE_NOTIFICATION}-${this.id}-${this.remoteId}`);
    this._client.transport.removeAllListeners(`${DETACH_RESPONSE}-${this.id}-${this.remoteId}`);
  }

  /** @private */
  _commit(obj, propagate = true) {
    const updated = {};

    for (let name in obj) {
      updated[name] = this._parameters.set(name, obj[name]);
    }

    // if the `UPDATE_REQUEST` as been aborted by the server, do not propagate
    if (propagate) {
      this._subscriptions.forEach(listener => listener(updated));
    }

    return updated;
  }

  getSchema() {
    return this._schema;
  }

  set(updates) {
    return new Promise((resolve, reject) => {
      const reqId = storeRequestPromise(resolve, reject);
      this._client.transport.emit(`${UPDATE_REQUEST}-${this.id}-${this.remoteId}`, reqId, updates);
    });
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

    if (this._isCreator) {
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

  onDetach(callback) {
    this._onDetachCallbacks.add(callback);
  }

  onDelete(callback) {
    this._onDeleteCallbacks.add(callback);
  }
}

/**
 * Component dedicated at managing distributed states among a lot of clients
 * focusing on application logic rather than network communication.
 *
 * @memberof @soundworks/core/client
 */
class ClientStateManager {
  constructor(id, transport) {
    this.client = { id, transport };

    this._statesById = new Map();
    this._observeListeners = new Set();
    this._cachedSchemas = new Map();

    // ---------------------------------------------
    // CREATE
    // ---------------------------------------------

    // @todo - ask for schema in request if not cached.
    this.client.transport.addListener(CREATE_RESPONSE, (reqId, stateId, remoteId, schemaName, schema, initValues) => {
      // cache schema when first dealing it to save some bandwidth
      if (!this._cachedSchemas.has(schemaName)) {
        this._cachedSchemas.set(schemaName, schema);
      }

      schema = this._cachedSchemas.get(schemaName);

      const state = new State(stateId, remoteId, schemaName, schema, this.client, true, this, initValues);
      this._statesById.set(state.id, state);

      resolveRequest(reqId, state);
    });

    this.client.transport.addListener(CREATE_ERROR, (reqId, msg) => {
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
    this.client.transport.addListener(ATTACH_RESPONSE, (reqId, stateId, remoteId, schemaName, schema, currentValues) => {
      // cache schema when first dealing it to save some bandwidth
      if (!this._cachedSchemas.has(schemaName)) {
        this._cachedSchemas.set(schemaName, schema);
      }

      schema = this._cachedSchemas.get(schemaName);

      const state = new State(stateId, remoteId, schemaName, schema, this.client, false, this, currentValues);
      this._statesById.set(state.id, state);

      resolveRequest(reqId, state);
    });

    this.client.transport.addListener(ATTACH_ERROR, (reqId, msg) => {
      rejectRequest(reqId, msg);
    });

    // ---------------------------------------------
    // OBSERVE PEERS (be notified when a state is created, lazy)
    // ---------------------------------------------
    this.client.transport.addListener(OBSERVE_RESPONSE, (reqId, ...list) => {
      if (list) { // if only client there, list could be empty
        list.forEach(([schemaName, stateId, nodeId]) => {
          this._observeListeners.forEach(callback => callback(schemaName, stateId, nodeId));
        });
      }

      resolveRequest(reqId, list);
    });

    this.client.transport.addListener(OBSERVE_NOTIFICATION, (...list) => {
      list.forEach(([schemaName, stateId, nodeId]) => {
        this._observeListeners.forEach(callback => callback(schemaName, stateId, nodeId));
      });
    });
  }

  async create(schemaName, initValues = {}) {
    return new Promise((resolve, reject) => {
      const reqId = storeRequestPromise(resolve, reject);
      const requireSchema = this._cachedSchemas.has(schemaName) ? false : true;
      this.client.transport.emit(CREATE_REQUEST, reqId, schemaName, requireSchema, initValues);
    });
  }

  async attach(schemaName, stateId = null) {
    return new Promise((resolve, reject) => {
       // @todo - add a timeout
      const reqId = storeRequestPromise(resolve, reject);
      const requireSchema = this._cachedSchemas.has(schemaName) ? false : true;
      this.client.transport.emit(ATTACH_REQUEST, reqId, schemaName, stateId, requireSchema);
    });
  }

  observe(callback) {
    this._observeListeners.add(callback);
    // store function
    new Promise((resolve, reject) => {
      const reqId = storeRequestPromise(resolve, reject);
      this.client.transport.emit(OBSERVE_REQUEST, reqId);
    });
  }
}

export default ClientStateManager;
