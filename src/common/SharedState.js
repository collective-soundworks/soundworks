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

// -----------------------------------------------------------
// define a common namespace...
// -----------------------------------------------------------

/**
 * Representation of a shared state. The class and its instances are the same
 * client-side and server-side.
 *
 * @memberof common
 *
 * @see {client.SharedStateManagerClient}
 * @see {server.SharedStateManagerServer}
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
      // cf. https://github.com/collective-soundworks/soundworks/issues/18
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

      this._clearDetach();
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

        this._clearDetach();
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

        this._clearDetach();
        resolveRequest(reqId, this);
      });

      // the state does not exists anymore in the server (should not happen)
      client.transport.addListener(`${DETACH_ERROR}-${id}`, (reqId, msg) => {
        rejectRequest(reqId, msg);
      });

    }
  }

  _clearDetach() {
    this._onDetachCallbacks.clear();
    this._onDeleteCallbacks.clear();

    // Monkey patch detach so it throws we called twice. Doing nothing blocks
    // the process on a second `detach` call as the Promise was never resolved
    this.detach = () => {
      throw new Error(`State "${this.schemaName} (${this.id})" already detached, cannot detach twice`);
    };
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


  /**
   * Get the schema that describes the state.
   *
   * @return {Object}
   */
  getSchema() {
    return this._schema;
  }

  /**
   * Updates values of the state.
   *
   * @async
   * @param {Object} updates - key / value pairs of updates to apply to the state
   * @return {Object}
   */
  async set(updates) {
    return new Promise((resolve, reject) => {
      const reqId = storeRequestPromise(resolve, reject);
      this._client.transport.emit(`${UPDATE_REQUEST}-${this.id}-${this.remoteId}`, reqId, updates);
    });
  }

  /**
   * Get a value of the state by its name
   *
   * @param {String} name - Name of the param
   * @return {Mixed}
   */
  get(name) {
    return this._parameters.get(name);
  }

  /**
   * Get a all the key / value pairs of the state.
   *
   * @return {Object}
   */
  getValues() {
    return this._parameters.getValues();
  }

  /**
   * @callback common.SharedState~subscribeCallback
   * @param {Object} updates - key / value pairs of the updates that have been
   *   applied to the state
   */
  /**
   * Subscribe to state updates
   *
   * @param {common.SharedState~subscribeCallback} callback - callback to execute
   *   when an update is commited on the state.
   * @example
   * state.subscribe(async (updates) =>  {
   *   for (let [key, value] of Object.entries(updates)) {
   *      // dispatch
   *   }
   * }
   */
  subscribe(listener) {
    this._subscriptions.add(listener);

    return () => {
      this._subscriptions.delete(listener);
    };
  }

  /**
   * Detach from the state. If the client is the creator of the state, the state
   * is deleted and all attached nodes get notified
   *
   * @async
   * @see {common.SharedState#onDetach}
   * @see {common.SharedState#onDelete}
   * @see {client.SharedStateManagerClient#create}
   * @see {server.SharedStateManagerClient#create}
   * @see {client.SharedStateManagerClient#attach}
   * @see {server.SharedStateManagerClient#attach}
   */
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

  /**
   * Register a function to execute when detaching from the state
   *
   * @param {Function} callback - callback to execute when detaching from the state.
   *   wether the client as called `detach`, or the state has been deleted by its
   *   creator.
   */
  onDetach(callback) {
    this._onDetachCallbacks.add(callback);
    return () => this._onDetachCallbacks.delete(callback);
  }

  /**
   * Register a function to execute when the state is deleted. Only called if the
   * node was the creator of the state. Is called after `onDetach`
   *
   * @param {Function} callback - callback to execute when the state is deleted.
   */
  onDelete(callback) {
    this._onDeleteCallbacks.add(callback);
    return () => this._onDeleteCallbacks.delete(callback);
  }
}

export default SharedState;
