import { isString, isFunction, isPlainObject } from '@ircam/sc-utils';
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

export const kCreateCollectionController = Symbol('BaseStateManager::createCollectionController');
export const kAttachInCollection = Symbol('BaseStateManager::attachInCollection');

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

    this._statesById = new Map(); // <id, state>
    this._cachedSchemas = new Map(); // <shemaName, definition>

    this._observeListeners = new Set(); // Set <[observedSchemaName, callback, options]>
    this._observeRequestCallbacks = new Map(); // Map <reqId, [observedSchemaName, callback, options]>

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
      const observeInfos = this._observeRequestCallbacks.get(reqId);
      const [observedSchemaName, callback, options] = observeInfos;

      // move observeInfos from `_observeRequestCallbacks` to `_observeListeners`
      // to guarantee order of execution, @see not in `.observe`
      this._observeRequestCallbacks.delete(reqId);
      this._observeListeners.add(observeInfos);

      const promises = list.map(([schemaName, stateId, nodeId]) => {
        const filter = this._filterObserve(observedSchemaName, schemaName, nodeId, options);

        if (!filter) {
          return callback(schemaName, stateId, nodeId);
        } else {
          return Promise.resolve();
        }
      });

      await Promise.all(promises);

      const unsubscribe = () => {
        this._observeListeners.delete(observeInfos);

        // no more listeners, we can stop receiving notifications from the server
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
      this._observeListeners.forEach(observeInfos => {
        const [observedSchemaName, callback, options] = observeInfos;
        const filter = this._filterObserve(observedSchemaName, schemaName, nodeId, options);

        if (!filter) {
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

  /** @private */
  _filterObserve(observedSchemaName, schemaName, creatorId, options) {
    let filter = true;
    // schema name filter filer
    if (observedSchemaName === null || observedSchemaName === schemaName) {
      filter = false;
    }
    // filter state created by client if excludeLocal is true
    if (options.excludeLocal === true && creatorId === this.client.id) {
      filter = true;
    }

    return filter;
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
      const reqId = this._promiseStore.add(resolve, reject, 'create-request');
      const requireSchema = this._cachedSchemas.has(schemaName) ? false : true;
      this.client.transport.emit(CREATE_REQUEST, reqId, schemaName, requireSchema, initValues);
    });
  }


  /**
   * @private
   */
  async [kCreateCollectionController](schemaName) {
    return new Promise((resolve, reject) => {
      const reqId = this._promiseStore.add(resolve, reject, 'create-collection-controller-request');
      const requireSchema = this._cachedSchemas.has(schemaName) ? false : true;
      this.client.transport.emit(CREATE_REQUEST, reqId, schemaName, requireSchema, {}, true);
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
      const reqId = this._promiseStore.add(resolve, reject, 'attach-request');
      const requireSchema = this._cachedSchemas.has(schemaName) ? false : true;
      this.client.transport.emit(ATTACH_REQUEST, reqId, schemaName, stateId, requireSchema);
    });
  }

  async [kAttachInCollection](schemaName, stateId) {
    return new Promise((resolve, reject) => {
      const reqId = this._promiseStore.add(resolve, reject, 'attach-in-collection-request');
      const requireSchema = this._cachedSchemas.has(schemaName) ? false : true;
      this.client.transport.emit(ATTACH_REQUEST, reqId, schemaName, stateId, requireSchema, true);
    });
  }

  /**
   * Observe all the `SharedState` instances that are created on the network.
   * This can be usefull for clients with some controller role that might want to track
   * the state of all other clients of the application, to monitor them and/or take
   * control over them from a single point.
   *
   * Notes:
   * - The order of execution is not guaranted between nodes, i.e. an state attached
   * in the `observe` callback could be created before the `async create` method resolves.
   * - Filtering, i.e. `observedSchemaName` and `options.excludeLocal` are handled
   * on the node side, the server just notify all state creation activity and
   * the node executes the given callbacks according to the different filter rules.
   * Such strategy allows to share the observe notifications between all observers.
   *
   * Alternative signatures:
   * - .observe(callback)
   * - .observe(schemaName, callback)
   * - .observe(callback, options)
   * - .observe(schemaName, callback, options)
   *
   * @param {string} [schemaName] - optionnal schema name to filter the observed
   *  states.
   * @param {server.StateManager~ObserveCallback|client.StateManager~ObserveCallback}
   *  callback - Function to be called when a new state is created on the network.
   * @param {object} options - Options.
   * @param {boolean} [options.excludeLocal = false] - If set to true, exclude states
   *  created locallly, i.e. by the same node, from the collection.
   * @returns {Promise<Function>} - Returns a Promise that resolves when the given
   *  callback as been executed on each existing states. The promise value is a
   *  function which allows to stop observing the states on the network.
   * @example
   * client.stateManager.observe(async (schemaName, stateId) => {
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

    const defaultOptions = {
      excludeLocal: false,
    };

    let observedSchemaName;
    let callback;
    let options;

    switch (args.length) {
      case 1: {
        // variation: .observe(callback)
        if (!isFunction(args[0])) {
          throw new TypeError(`[stateManager] Invalid arguments, argument 1 should be a function"`);
        }

        observedSchemaName = null;
        callback = args[0];
        options = defaultOptions;
        break;
      }
      case 2: {
        // variation: .observe(schemaName, callback)
        if (isString(args[0])) {
          if (!isFunction(args[1])) {
            throw new TypeError(`[stateManager] Invalid arguments, argument 2 should be a function"`);
          }

          observedSchemaName = args[0];
          callback = args[1];
          options = defaultOptions;

        // variation: .observe(callback, options) API
        } else if (isFunction(args[0])) {
          if (!isPlainObject(args[1])) {
            throw new TypeError(`[stateManager] Invalid arguments, argument 2 should be an object"`);
          }

          observedSchemaName = null;
          callback = args[0];
          options = Object.assign(defaultOptions, args[1]);

        } else {
          throw new Error(`[stateManager] Invalid signature, refer to the StateManager.observe documentation"`);
        }

        break;
      }
      case 3: {
        // variation: .observe(schemaName, callback, options)
        if (!isString(args[0])) {
          throw new TypeError(`[stateManager] Invalid arguments, argument 1 should be a string"`);
        }

        if (!isFunction(args[1])) {
          throw new TypeError(`[stateManager] Invalid arguments, argument 2 should be a function"`);
        }

        if (!isPlainObject(args[2])) {
          throw new TypeError(`[stateManager] Invalid arguments, argument 2 should be an object"`);
        }

        observedSchemaName = args[0];
        callback = args[1];
        options = Object.assign(defaultOptions, args[2]);

        break;
      }
      // throw in all other cases
      default: {
        throw new Error(`[stateManager] Invalid signature, refer to the StateManager.observe documentation"`);
      }
    }

    // resend request to get updated list of states
    return new Promise((resolve, reject) => {
      const reqId = this._promiseStore.add(resolve, reject, 'observe-request');
      // store the callback for execution on the response. the returned Promise
      // is fullfiled once callback has been executed with each existing states
      const observeInfos = [observedSchemaName, callback, options];
      this._observeRequestCallbacks.set(reqId, observeInfos);

      // NOTE: do not store in `_observeListeners` yet as it can produce race
      // conditions, e.g.:
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
      // - OBSERVE_NOTIFICATION [ 'a', 1, 0 ] // this should not happen
      // - OBSERVE_RESPONSE 1 [ [ 'a', 1, 0 ] ]
      //
      // cf. unit test `observe should properly behave in race condition`

      this.client.transport.emit(OBSERVE_REQUEST, reqId, observedSchemaName);
    });
  }

  /**
   * Returns a collection of all the states created from the schema name.
   *
   * @param {string} schemaName - Name of the schema.
   * @param {object} options - Options.
   * @param {boolean} [options.excludeLocal = false] - If set to true, exclude states
   *  created locallly, i.e. by the same node, from the collection.
   * @returns {server.SharedStateCollection|client.SharedStateCollection}
   */
  async getCollection(schemaName, options) {
    const collection = new SharedStateCollection(this, schemaName, options);

    try {
      await collection._init();
    } catch (err) {
      console.log(err.message)
      throw new Error(`Cannot create collection, schema "${schemaName}" does not exists`);
    }

    return collection;
  }
}

export default BaseStateManager;

