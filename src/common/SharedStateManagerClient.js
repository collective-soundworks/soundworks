import SharedState from './SharedState.js';
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
  idGenerator,
} from './shared-state-utils.js';

/**
 * Component dedicated at managing distributed states, accessible through {@link SharedState} instances, among the application.
 *
 * An instance of `SharedStateManagerClient` is automatically created by the
 * `soundworks.Client`.
 * @see {@link client.Client#stateManager}
 *
 * Tutorial: [https://collective-soundworks.github.io/tutorials/state-manager.html](https://collective-soundworks.github.io/tutorials/state-manager.html)
 *
 * @memberof client
 * @see {@link server.SharedStateManagerServer}
 */
class SharedStateManagerClient {
  /**
   * @param {Number} id - Id of the node.
   * @param {Object} transport - Transport to use for synchronizing the state.
   *  Must implement a basic EventEmitter API.
   */
  constructor(id, transport) {
    this.client = { id, transport };

    this._statesById = new Map();
    this._observeListeners = new Set();
    this._cachedSchemas = new Map();
    this._observeRequestCallbacks = new Map();

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

      const state = new SharedState(stateId, remoteId, schemaName, schema, this.client, true, this, initValues);
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

      const state = new SharedState(stateId, remoteId, schemaName, schema, this.client, false, this, currentValues);
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
      // retrieve the callback that have been stored in observe to make sure
      // we don't call another callback that may have been registered earlier.
      const callback = this._observeRequestCallbacks.get(reqId);
      this._observeRequestCallbacks.delete(reqId)

      list.forEach(([schemaName, stateId, nodeId]) => {
        callback(schemaName, stateId, nodeId);
      });

      resolveRequest(reqId, list);
    });

    this.client.transport.addListener(OBSERVE_NOTIFICATION, (...list) => {
      list.forEach(([schemaName, stateId, nodeId]) => {
        this._observeListeners.forEach(callback => callback(schemaName, stateId, nodeId));
      });
    });
  }

  /**
   * Create a {@link SharedState} instance from a previsouly registered schema.
   *
   * @see {@link SharedState}
   *
   * @param {String} schemaName - Name of the schema as given on registration
   *  (cf. ServerStateManager)
   * @param {Object} [initValues={}] - Default values for the state.
   *
   * @return {@link SharedState}
   */
  async create(schemaName, initValues = {}) {
    return new Promise((resolve, reject) => {
      const reqId = storeRequestPromise(resolve, reject);
      const requireSchema = this._cachedSchemas.has(schemaName) ? false : true;
      this.client.transport.emit(CREATE_REQUEST, reqId, schemaName, requireSchema, initValues);
    });
  }

  /**
   * Attach to an existing {@link SharedState} instance.
   *
   * @see {@link SharedState}
   *
   * @param {String} schemaName - Name of the schema as given on registration
   *  (cf. ServerStateManager)
   * @param {Object} [stateId=null] - Id of the state to attach to. If `null`,
   *  attach to the first state found with the given schema name (usefull for
   *  globally shared states owned by the server).
   *
   * @return {@link SharedState}
   */
  async attach(schemaName, stateId = null) {
    return new Promise((resolve, reject) => {
       // @todo - add a timeout
      const reqId = storeRequestPromise(resolve, reject);
      const requireSchema = this._cachedSchemas.has(schemaName) ? false : true;
      this.client.transport.emit(ATTACH_REQUEST, reqId, schemaName, stateId, requireSchema);
    });
  }

  /**
   * @callback client.SharedStateManagerClient~observeCallback
   * @async
   * @param {String} schemaName - name of the schema
   * @param {Number} stateId - id of the state
   * @param {Number} nodeId - id of the node that created the state
   */
  /**
   * Observe all the {@link SharedState} instances that are created on the network.
   *
   * @param {client.SharedStateManagerClient~observeCallback} callback - Function
   *  to be called when a new state is created on the network.
   *
   * @example
   * this.client.stateManager.observe(async (schemaName, stateId, nodeId) => {
   *   if (schemaName === 'something') {
   *     const state = await this.client.stateManager.attach(schemaName, stateId);
   *     console.log(state.getValues());
   *   }
   * });
   */
  observe(callback) {
    this._observeListeners.add(callback);
    // store function
    new Promise((resolve, reject) => {
      const reqId = storeRequestPromise(resolve, reject);
      // store the callback to be executed on the response
      this._observeRequestCallbacks.set(reqId, callback);
      this.client.transport.emit(OBSERVE_REQUEST, reqId);
    });

    return () => this._observeListeners.delete(callback);
  }
}

export default SharedStateManagerClient;
