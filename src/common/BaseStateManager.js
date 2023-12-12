import { isString, isFunction } from '@ircam/sc-utils';
import SharedState from './BaseSharedState.js';
import SharedStateCollection from './BaseSharedStateCollection.js';
import PromiseStore from './PromiseStore.js';
import {
  CREATE_REQUEST,
  CREATE_RESPONSE,
  CREATE_ERROR,
  ATTACH_REQUEST,
  ATTACH_RESPONSE,
  ATTACH_ERROR,
  OBSERVE_REQUEST,
  OBSERVE_RESPONSE,
  OBSERVE_ERROR,
  OBSERVE_NOTIFICATION,
  UNOBSERVE_NOTIFICATION,
  DELETE_SCHEMA,
} from './constants.js';

/**
 * @private
 */
class BaseStateManager {
  /**
   * @param {Number} id - Id of the node.
   * @param {Object} transport - Transport to use for synchronizing the state.
   *  Must implement a basic EventEmitter API.
   */
  constructor(id, transport) {
    this.client = { id, transport };

    this._statesById = new Map();
    this._observeListeners = new Map(); // Map <callback, observedSchemaName>
    this._cachedSchemas = new Map();
    this._observeRequestCallbacks = new Map();

    this._promiseStore = new PromiseStore();

    // ---------------------------------------------
    // CREATE
    // ---------------------------------------------

    this.client.transport.addListener(CREATE_RESPONSE, (reqId, stateId, remoteId, schemaName, schema, initValues) => {

      // cache schema when first dealing it to save some bandwidth
      if (!this._cachedSchemas.has(schemaName)) {
        this._cachedSchemas.set(schemaName, schema);
      }

      schema = this._cachedSchemas.get(schemaName);

      const state = new SharedState(stateId, remoteId, schemaName, schema, this.client, true, this, initValues);
      this._statesById.set(state.id, state);

      this._promiseStore.resolve(reqId, state);
    });

    this.client.transport.addListener(CREATE_ERROR, (reqId, msg) => {
      this._promiseStore.reject(reqId, msg);
    });

    // ---------------------------------------------
    // ATTACH (when creator, is attached by default)
    // ---------------------------------------------
    this.client.transport.addListener(ATTACH_RESPONSE, (reqId, stateId, remoteId, schemaName, schema, currentValues) => {
      // cache schema when first dealing with it to save some bandwidth
      // note: when we make the schemas dynamic at some point
      // the server should be able to invalidate the schema and send
      // it again despite the caching.
      if (!this._cachedSchemas.has(schemaName)) {
        this._cachedSchemas.set(schemaName, schema);
      }

      schema = this._cachedSchemas.get(schemaName);

      const state = new SharedState(stateId, remoteId, schemaName, schema, this.client, false, this, currentValues);
      this._statesById.set(state.id, state);

      this._promiseStore.resolve(reqId, state);
    });

    this.client.transport.addListener(ATTACH_ERROR, (reqId, msg) => {
      this._promiseStore.reject(reqId, msg);
    });

    // ---------------------------------------------
    // OBSERVE PEERS (be notified when a state is created, lazy)
    // ---------------------------------------------
    this.client.transport.addListener(OBSERVE_RESPONSE, async (reqId, ...list) => {
      // retrieve the callback that have been stored in observe to make sure
      // we don't call another callback that may have been registered earlier.
      const [callback, observedSchemaName] = this._observeRequestCallbacks.get(reqId);
      this._observeRequestCallbacks.delete(reqId);

      // now that the OBSERVE_REPOSNSE callback is executed, store it in
      // OBSERVE_NOTIFICATION listeners
      this._observeListeners.set(callback, observedSchemaName);

      const promises = list.map(([schemaName, stateId, nodeId]) => {
        if (observedSchemaName === null || observedSchemaName === schemaName) {
          return callback(schemaName, stateId, nodeId);
        } else {
          return Promise.resolve();
        }
      });

      await Promise.all(promises);

      const unsubscribe = () => {
        this._observeListeners.delete(callback);
        // no more listeners, we can stop receiving notification from the server
        if (this._observeListeners.size === 0) {
          this.client.transport.emit(UNOBSERVE_NOTIFICATION);
        }
      };

      this._promiseStore.resolve(reqId, unsubscribe);
    });

    // Observe error can occur if observed schema name does not exists
    this.client.transport.addListener(OBSERVE_ERROR, (reqId, msg) => {
      this._observeRequestCallbacks.delete(reqId);
      this._promiseStore.reject(reqId, msg);
    });

    this.client.transport.addListener(OBSERVE_NOTIFICATION, (schemaName, stateId, nodeId) => {
      this._observeListeners.forEach((observedSchemaName, callback) => {
        if (observedSchemaName === null || observedSchemaName === schemaName) {
          callback(schemaName, stateId, nodeId);
        }
      });
    });

    // ---------------------------------------------
    // Clear cache when schema is deleted
    // ---------------------------------------------
    this.client.transport.addListener(DELETE_SCHEMA, schemaName => {
      this._cachedSchemas.delete(schemaName);
    });
  }

  /**
   * Create a `SharedState` instance from a registered schema.
   *
   * @param {String} schemaName - Name of the schema as given on registration
   *  (cf. ServerStateManager)
   * @param {Object} [initValues={}] - Default values for the state.
   * @returns {client.SharedState|server.SharedState}
   * @see {@link client.SharedState}
   * @see {@link server.SharedState}
   * @example
   * const state = await client.stateManager.create('my-schema');
   */
  async create(schemaName, initValues = {}) {
    return new Promise((resolve, reject) => {
      const reqId = this._promiseStore.add(resolve, reject, 'create-create');
      const requireSchema = this._cachedSchemas.has(schemaName) ? false : true;
      this.client.transport.emit(CREATE_REQUEST, reqId, schemaName, requireSchema, initValues);
    });
  }

  /**
   * Attach to an existing `SharedState` instance.
   *
   * @param {String} schemaName - Name of the schema as given on registration
   *  (cf. ServerStateManager)
   * @param {Object} [stateId=null] - Id of the state to attach to. If `null`,
   *  attach to the first state found with the given schema name (usefull for
   *  globally shared states owned by the server).
   * @returns {client.SharedState|server.SharedState}
   * @see {@link client.SharedState}
   * @see {@link server.SharedState}
   * @example
   * const state = await client.stateManager.attach('my-schema');
   */
  async attach(schemaName, stateId = null) {
    return new Promise((resolve, reject) => {
      // @todo - add a timeout
      const reqId = this._promiseStore.add(resolve, reject, 'attach-request');
      const requireSchema = this._cachedSchemas.has(schemaName) ? false : true;
      this.client.transport.emit(ATTACH_REQUEST, reqId, schemaName, stateId, requireSchema);
    });
  }

  /**
   * Observe all the `SharedState` instances that are created on the network.
   * This can be usefull for clients with some controller role that might want to track
   * the state of all other clients of the application, to monitor them and/or take
   * control over them from a single point.
   *
   * Notes:
   * - The states that are created by the same node are not propagated through
   * the observe callback.
   * - The order of execution is not guaranted, i.e. an state attached in the
   * `observe` callback could be created before the `async create` method resolves.
   *
   * @param {String} [schemaName] - optionnal schema name to filter the observed
   *  states.
   * @param {server.StateManager~ObserveCallback|client.StateManager~ObserveCallback}
   *  callback - Function to be called when a new state is created on the network.
   * @returns {Promise<Function>} - Returns a Promise that resolves when the given
   *  callback as been executed on each existing states. The promise value is a
   *  function which allows to stop observing the states on the network.
   * @example
   * client.stateManager.observe(async (schemaName, stateId, nodeId) => {
   *   if (schemaName === 'something') {
   *     const state = await this.client.stateManager.attach(schemaName, stateId);
   *     console.log(state.getValues());
   *   }
   * });
   */
  // note: all filtering is done only on client-side as it is really more simple to
  // handle this way and the network overhead is very low for observe notifications:
  // i.e. schemaName, stateId, nodeId
  async observe(...args) {
    let observedSchemaName;
    let callback;

    if (args.length === 1) {
      observedSchemaName = null;
      callback = args[0];

      if (!isFunction(callback)) {
        throw new Error(`[stateManager] Invalid arguments, valid signatures are "stateManager.observe(callback)" or "stateManager.observe(schemaName, callback)"`);
      }
    } else if (args.length === 2) {
      observedSchemaName = args[0];
      callback = args[1];

      if (!isString(observedSchemaName) || !isFunction(callback)) {
        throw new Error(`[stateManager] Invalid arguments, valid signatures are "stateManager.observe(callback)" or "stateManager.observe(schemaName, callback)"`);
      }
    } else {
      throw new Error(`[stateManager] Invalid arguments, valid signatures are "stateManager.observe(callback)" or "stateManager.observe(schemaName, callback)"`);
    }

    // resend request to get updated list of states
    return new Promise((resolve, reject) => {
      const reqId = this._promiseStore.add(resolve, reject, 'observe-request');
      // store the callback for execution on the response. the returned Promise
      // is fullfiled once callback has been executed with each existing states
      this._observeRequestCallbacks.set(reqId, [callback, observedSchemaName]);

      // NOTE: do not store in `_observeListeners` yet as it can produce races, e.g.:
      // cf. test `observe should properly behave in race condition`
      // ```
      // await client.stateManager.observe(async (schemaName, stateId, nodeId) => {});
      // // client now receives OBSERVE_NOTIFICATIONS
      // await otherClient.stateManager.create('a');
      // // second observer added in between
      // client.stateManager.observe(async (schemaName, stateId, nodeId) => {});
      // ````
      // OBSERVE_NOTIFICATION is received before the OBSERVE_RESPONSE, then the
      // second observer is called twice:
      // - OBSERVE_RESPONSE 1 []
      // - OBSERVE_NOTIFICATION [ 'a', 1, 0 ]
      // - OBSERVE_NOTIFICATION [ 'a', 1, 0 ] // this should not be executed
      // - OBSERVE_RESPONSE 1 [ [ 'a', 1, 0 ] ]

      this.client.transport.emit(OBSERVE_REQUEST, reqId, observedSchemaName);
    });
  }

  /**
   * Returns a collection of all the states created from the schema name. Except
   * the ones created by the current node.
   *
   * @param {string} schemaName - Name of the schema.
   * @returns {server.SharedStateCollection|client.SharedStateCollection}
   */
  async getCollection(schemaName) {
    const collection = new SharedStateCollection(this, schemaName);

    try {
      await collection._init();
      return collection;
    } catch(err) {
      throw new Error(`Cannot create collection, schema "${schemaName}" does not exists`);
    }
  }
}

export default BaseStateManager;

