import parameters from '@ircam/parameters';
import clonedeep from 'lodash.clonedeep';
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
  // promises handling
  storeRequestPromise,
  resolveRequest,
  rejectRequest,
} from './shared-state-utils.js';

/**
 * Local representation of a shared state.
 *
 */
class SharedState {
  constructor(id, remoteId, schemaName, schema, client, isCreator, manager, initValues = {}) {
    this.id = id;
    this.remoteId = remoteId;
    this.schemaName = schemaName;

    this._schema = clonedeep(schema);
    this._isCreator = isCreator; // may be the server or any client
    this._client = client;
    this._manager = manager;

    try {
      this._parameters = parameters(schema, initValues);
    } catch(err) {
      console.error(err.stack);
      throw new Error(`Error creating or attaching state "${schemaName}" w/ values:\n
${JSON.stringify(initValues, null, 2)}`);
    }
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

  async set(updates) {
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

  async detach() {
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
    return () => this._onDetachCallbacks.delete(callback);
  }

  onDelete(callback) {
    this._onDeleteCallbacks.add(callback);
    return () => this._onDeleteCallbacks.delete(callback);
  }
}

export default SharedState;
