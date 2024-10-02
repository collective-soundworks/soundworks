import { isString, isFunction, isPlainObject } from '@ircam/sc-utils';
import SharedState from './SharedState.js';
import SharedStateCollection from './SharedStateCollection.js';
import BatchedTransport from './BatchedTransport.js';
import ParameterBag from './ParameterBag.js';
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
  DELETE_SHARED_STATE_CLASS,
  GET_CLASS_DESCRIPTION_REQUEST,
  GET_CLASS_DESCRIPTION_RESPONSE,
  GET_CLASS_DESCRIPTION_ERROR,
} from './constants.js';
import logger from './logger.js';

export const kStateManagerInit = Symbol('soundworks:state-manager-init');
export const kStateManagerDeleteState = Symbol('soundworks:state-manager-delete-state');
// for testing purposes
export const kStateManagerClient = Symbol('soundworks:state-manager-client');

/**
 * Callback executed when a state is created on the network.
 *
 * @callback stateManagerObserveCallback
 * @async
 * @param {string} className - name of the class
 * @param {number} stateId - id of the state
 * @param {number} nodeId - id of the node that created the state
 */
/**
 * Callback to execute in order to remove a {@link stateManagerObserveCallback}
 * from the list of observer.
 *
 * @callback stateManagerDeleteObserveCallback
 */

/** @private */
class BaseStateManager {
  #statesById = new Map();
  #cachedClasses = new Map(); // <shemaName, definition>
  #observeListeners = new Set(); // Set <[observedClassName, callback, options]>
  #observeRequestCallbacks = new Map(); // Map <reqId, [observedClassName, callback, options]>
  #promiseStore = null;
  #status = 'idle';

  constructor() {
    this.#promiseStore = new PromiseStore('BaseStateManager');
    /** @private */
    this[kStateManagerClient] = null;

  }

  /** @private */
  #filterObserve(observedClassName, className, creatorId, options) {
    let filter = true;

    if (observedClassName === null || observedClassName === className) {
      filter = false;
    }
    // filter state created by client if excludeLocal is true
    if (options.excludeLocal === true && creatorId === this[kStateManagerClient].id) {
      filter = true;
    }

    return filter;
  }

  /** @private */
  [kStateManagerDeleteState](stateId) {
    this.#statesById.delete(stateId);
  }

  /**
   * Executed on `client.init`
   * @param {Number} id - Id of the node.
   * @param {Object} transport - Transport to use for synchronizing the states.
   *  Must implement a basic EventEmitter API.
   *
   * @private
   */
  [kStateManagerInit](id, transport) {
    const batchedTransport = new BatchedTransport(transport);
    this[kStateManagerClient] = { id, transport: batchedTransport };

    // ---------------------------------------------
    // CREATE
    // ---------------------------------------------
    this[kStateManagerClient].transport.addListener(CREATE_RESPONSE, (reqId, stateId, remoteId, className, classDescription, initValues) => {
      // cache class description to save some bandwidth
      // @note: when we make the class dynamic, we will need some mecanism to
      // invalidate the cached description
      if (!this.#cachedClasses.has(className)) {
        this.#cachedClasses.set(className, classDescription);
      }

      classDescription = this.#cachedClasses.get(className);

      const state = new SharedState(stateId, remoteId, className, classDescription, this[kStateManagerClient], true, this, initValues, null);

      this.#statesById.set(state.id, state);
      this.#promiseStore.resolve(reqId, state);
    });

    this[kStateManagerClient].transport.addListener(CREATE_ERROR, (reqId, msg) => {
      this.#promiseStore.reject(reqId, msg);
    });

    // ---------------------------------------------
    // ATTACH (when creator, is attached by default)
    // ---------------------------------------------
    this[kStateManagerClient].transport.addListener(ATTACH_RESPONSE, (reqId, stateId, remoteId, className, classDescription, currentValues, filter) => {
      // cache class description to save some bandwidth
      // @note: when we make the class dynamic, we will need some mecanism to
      // invalidate the cached description
      if (!this.#cachedClasses.has(className)) {
        this.#cachedClasses.set(className, classDescription);
      }

      classDescription = this.#cachedClasses.get(className);

      const state = new SharedState(stateId, remoteId, className, classDescription, this[kStateManagerClient], false, this, currentValues, filter);

      this.#statesById.set(state.id, state);
      this.#promiseStore.resolve(reqId, state);
    });

    this[kStateManagerClient].transport.addListener(ATTACH_ERROR, (reqId, msg) => {
      this.#promiseStore.reject(reqId, msg);
    });

    // ---------------------------------------------
    // OBSERVE PEERS (be notified when a state is created, lazy)
    // ---------------------------------------------
    this[kStateManagerClient].transport.addListener(OBSERVE_RESPONSE, async (reqId, ...list) => {
      // retrieve the callback that have been stored in `observe()` to make sure
      // we don't call another callback that may have been registered earlier.
      const observeInfos = this.#observeRequestCallbacks.get(reqId);
      const [observedClassName, callback, options] = observeInfos;
      // move observeInfos from `_observeRequestCallbacks` to `_observeListeners`
      // to guarantee future order of execution
      this.#observeRequestCallbacks.delete(reqId);
      this.#observeListeners.add(observeInfos);

      const promises = list.map(([className, stateId, nodeId]) => {
        const filter = this.#filterObserve(observedClassName, className, nodeId, options);

        if (!filter) {
          return callback(className, stateId, nodeId);
        } else {
          return Promise.resolve();
        }
      });

      await Promise.all(promises);

      const unsubscribe = () => {
        this.#observeListeners.delete(observeInfos);
        // no more listeners, we can stop receiving notifications from the server
        if (this.#observeListeners.size === 0) {
          this[kStateManagerClient].transport.emit(UNOBSERVE_NOTIFICATION);
        }
      };

      this.#promiseStore.resolve(reqId, unsubscribe);
    });

    // Observe error occur if observed class name does not exists
    this[kStateManagerClient].transport.addListener(OBSERVE_ERROR, (reqId, msg) => {
      this.#observeRequestCallbacks.delete(reqId);
      this.#promiseStore.reject(reqId, msg);
    });

    this[kStateManagerClient].transport.addListener(OBSERVE_NOTIFICATION, (className, stateId, nodeId) => {
      this.#observeListeners.forEach(observeInfos => {
        const [observedClassName, callback, options] = observeInfos;
        const filter = this.#filterObserve(observedClassName, className, nodeId, options);

        if (!filter) {
          callback(className, stateId, nodeId);
        }
      });
    });

    // ---------------------------------------------
    // Clear cache when a shared state class is deleted
    // ---------------------------------------------
    this[kStateManagerClient].transport.addListener(DELETE_SHARED_STATE_CLASS, className => {
      this.#cachedClasses.delete(className);
    });

    // ---------------------------------------------
    // Get class description
    // ---------------------------------------------
    this[kStateManagerClient].transport.addListener(GET_CLASS_DESCRIPTION_RESPONSE, (reqId, className, classDescription) => {
      if (!this.#cachedClasses.has(className)) {
        this.#cachedClasses.set(className, classDescription);
      }
      // return a full class description
      const parameterBag = new ParameterBag(classDescription);
      this.#promiseStore.resolve(reqId, parameterBag.getDescription());
    });

    this[kStateManagerClient].transport.addListener(GET_CLASS_DESCRIPTION_ERROR, (reqId, msg) => {
      this.#promiseStore.reject(reqId, msg);
    });

    this.#status = 'inited';
  }

  /**
   * Return a class description from a given class name
   *
   * @param {SharedStateClassName} className - Name of the shared state class.
   *  (cf. ServerStateManager)
   * @return {SharedStateClassDescription}
   * @example
   * const classDescription = await client.stateManager.getClassDescription('my-class');
   */
  async getClassDescription(className) {
    if (this.#status !== 'inited') {
      throw new DOMException(`Cannot execute 'getClassDescription' on 'StateManager': state manager is not inited. This method can be safely called only once 'client' or 'server' is inited itself`, 'InvalidStateError');
    }

    if (this.#cachedClasses.has(className)) {
      const classDescription = this.#cachedClasses.get(className);
      // return a full class description
      const parameterBag = new ParameterBag(classDescription);
      return parameterBag.getDescription();
    }

    return new Promise((resolve, reject) => {
      const reqId = this.#promiseStore.add(resolve, reject, 'BaseStateManager#getClassDescription');
      this[kStateManagerClient].transport.emit(GET_CLASS_DESCRIPTION_REQUEST, reqId, className);
    });
  }

  /**
   * @deprecated Use {@link BaseStateManager#getClassDescription} instead.
   */
  async getSchema(className) {
    logger.deprecated('BaseStateManager#getSchema', 'BaseStateManager#getClassDescription', '4.0.0-alpha.29');
    return this.getClassDescription(className);
  }

  /**
   * Create a {@link SharedState} instance from a registered class.
   *
   * @param {SharedStateClassName} className - Name of the class.
   * @param {Object.<string, any>} [initValues={}] - Default values of the created shared state.
   * @returns {Promise<SharedState>}
   * @example
   * const state = await client.stateManager.create('my-class');
   */
  async create(className, initValues = {}) {
    if (this.#status !== 'inited') {
      throw new DOMException(`Cannot execute 'create' on 'StateManager': state manager is not inited. This method can be safely called only once 'client' or 'server' is inited itself`, 'InvalidStateError');
    }

    return new Promise((resolve, reject) => {
      const reqId = this.#promiseStore.add(resolve, reject, 'BaseStateManager#create');
      const requireDescription = this.#cachedClasses.has(className) ? false : true;
      this[kStateManagerClient].transport.emit(CREATE_REQUEST, reqId, className, requireDescription, initValues);
    });
  }

  /**
   * Attach to an existing {@link SharedState} instance.
   *
   * @overload
   * @param {SharedStateClassName} className - Name of the class.
   * @returns {Promise<SharedState>}
   *
   * @example
   * const state = await client.stateManager.attach('my-class');
   */
  /**
   * Attach to an existing {@link SharedState} instance.
   *
   * @overload
   * @param {SharedStateClassName} className - Name of the class.
   * @param {number} stateId - Id of the state
   * @returns {Promise<SharedState>}
   *
   * @example
   * const state = await client.stateManager.attach('my-class', stateId);
   */
  /**
   * Attach to an existing {@link SharedState} instance.
   *
   * @overload
   * @param {SharedStateClassName} className - Name of the class.
   * @param {string[]} filter - List of parameters of interest
   * @returns {Promise<SharedState>}
   *
   * @example
   * const state = await client.stateManager.attach('my-class', ['some-param']);
   */
  /**
   * Attach to an existing {@link SharedState} instance.
   *
   * @overload
   * @param {SharedStateClassName} className - Name of the class.
   * @param {number} stateId - Id of the state
   * @param {string[]} filter - List of parameters of interest
   * @returns {Promise<SharedState>}
   *
   * @example
   * const state = await client.stateManager.attach('my-class', stateId, ['some-param']);
   */
  /**
   * Attach to an existing {@link SharedState} instance.
   *
   * Alternative signatures:
   * - `stateManager.attach(className)`
   * - `stateManager.attach(className, stateId)`
   * - `stateManager.attach(className, filter)`
   * - `stateManager.attach(className, stateId, filter)`
   *
   * @param {SharedStateClassName} className - Name of the class.
   * @param {number|string[]} [stateIdOrFilter] - Id of the state to attach to. If `null`,
   *  attach to the first state found with the given class name (usefull for
   *  globally shared states owned by the server).
   * @param {string[]} [filter] - List of parameters of interest in the
   *  returned state. If set to `null`, no filter is applied.
   * @returns {Promise<SharedState>}
   *
   * @example
   * const state = await client.stateManager.attach('my-class');
   */
  async attach(className, stateIdOrFilter = null, filter = null) {
    if (this.#status !== 'inited') {
      throw new DOMException(`Cannot execute 'attach' on 'StateManager': state manager is not inited. This method can be safely called only once 'client' or 'server' is inited itself`, 'InvalidStateError');
    }

    let stateId = null;

    if (!isString(className)) {
      throw new TypeError(`Cannot execute 'attach' on 'StateManager': argument 1 should be either a number or an array`);
    }

    if (arguments.length === 2) {
      if (stateIdOrFilter === null) {
        stateId = null;
        filter = null;
      } else if (Number.isFinite(stateIdOrFilter)) {
        stateId = stateIdOrFilter;
        filter = null;
      } else if (Array.isArray(stateIdOrFilter)) {
        stateId = null;
        filter = stateIdOrFilter;
      } else {
        throw new TypeError(`Cannot execute 'attach' on 'StateManager': argument 2 should be either null, a number or an array`);
      }
    }

    if (arguments.length === 3) {
      stateId = stateIdOrFilter;

      if (stateId !== null && !Number.isFinite(stateId)) {
        throw new TypeError(`Cannot execute 'attach' on 'StateManager': argument 2 should be either null or a number`);
      }

      if (filter !== null && !Array.isArray(filter)) {
        throw new TypeError(`Cannot execute 'attach' on 'StateManager': argument 3 should be either null or an array`);
      }
    }

    return new Promise((resolve, reject) => {
      const reqId = this.#promiseStore.add(resolve, reject, 'BaseStateManager#attach');
      const requireDescription = this.#cachedClasses.has(className) ? false : true;
      this[kStateManagerClient].transport.emit(ATTACH_REQUEST, reqId, className, stateId, requireDescription, filter);
    });
  }

  /**
   * Observe all the {@link SharedState} instances that are created on the network.
   *
   * @overload
   * @param {stateManagerObserveCallback} callback - Function to execute when a
   *   new {@link SharedState} is created on the network.
   * @example
   * client.stateManager.observe(async (className, stateId) => {
   *   if (className === 'my-shared-state-class') {
   *     const attached = await client.stateManager.attach(className, stateId);
   *   }
   * });
   */
  /**
   * Observe all the {@link SharedState} instances of given {@link SharedStateClassName}
   * that are created on the network.
   *
   * @overload
   * @param {SharedStateClassName} className - Observe only ${@link SharedState}
   *   of given name.
   * @param {stateManagerObserveCallback} callback - Function to execute when a
   *   new {@link SharedState} is created on the network.
   * @example
   * client.stateManager.observe('my-shared-state-class', async (className, stateId) => {
   *   const attached = await client.stateManager.attach(className, stateId);
   * });
   */
  /**
   * Observe all the {@link SharedState} instances of given excluding the ones
   * created by the current node.
   *
   * @overload
   * @param {stateManagerObserveCallback} callback - Function to execute when a
   *   new {@link SharedState} is created on the network.
   * @param {object} options - Options.
   * @param {boolean} options.excludeLocal=false - If set to true, exclude states
   *   created by the same node from the collection.
   * @example
   * client.stateManager.observe(async (className, stateId) => {
   *   if (className === 'my-shared-state-class') {
   *     const attached = await client.stateManager.attach(className, stateId);
   *   }
   * }, { excludeLocal: true });
   */
  /**
   * Observe all the {@link SharedState} instances of given {@link SharedStateClassName}
   * that are created on the network, excluding the ones created by the current node.
   *
   * @overload
   * @param {SharedStateClassName} className - Observe only ${@link SharedState}
   *   of given name.
   * @param {stateManagerObserveCallback} callback - Function to execute when a
   *   new {@link SharedState} is created on the network.
   * @param {object} options - Options.
   * @param {boolean} options.excludeLocal=false - If set to true, exclude states
   *   created by the same node from the collection.
   * @example
   * client.stateManager.observe('my-shared-state-class', async (className, stateId) => {
   *   const attached = await client.stateManager.attach(className, stateId);
   * }, { excludeLocal: true });
   */
  /**
   * Observe all the {@link SharedState} instances that are created on the network.
   *
   * Notes:
   * - The order of execution is not guaranted between nodes, i.e. a state attached
   * in the `observe` callback can be instantiated before the `async create` method
   * resolves on the creator node.
   * - Filtering, i.e. `observedClassName` and `options.excludeLocal` are handled
   * on the node side, the server just notify all state creation activity and
   * the node executes the given callbacks according to the different filter rules.
   * Such strategy allows to simply share the observe notifications between all observers.
   *
   * Alternative signatures:
   * - `stateManager.observe(callback)`
   * - `stateManager.observe(className, callback)`
   * - `stateManager.observe(callback, options)`
   * - `stateManager.observe(className, callback, options)`
   *
   * @param {SharedStateClassName} [className] - Optionnal class name to filter the observed
   *  states.
   * @param {stateManagerObserveCallback}
   *  callback - Function to be called when a new state is created on the network.
   * @param {object} options - Options.
   * @param {boolean} [options.excludeLocal = false] - If set to true, exclude states
   *  created locally, i.e. by the same node, from the collection.
   * @returns {Promise<stateManagerDeleteObserveCallback>} - Returns a Promise that resolves when the given
   *  callback as been executed on each existing states. The promise value is a
   *  function which allows to stop observing the states on the network.
   *
   * @example
   * client.stateManager.observe(async (className, stateId) => {
   *   if (className === 'my-shared-state-class') {
   *     const attached = await client.stateManager.attach(className, stateId);
   *   }
   * });
   */
  async observe(...args) {
    if (this.#status !== 'inited') {
      throw new DOMException(`Cannot execute 'observe' on 'StateManager': state manager is not inited. This method can be safely called only once 'client' or 'server' is inited itself`, 'InvalidStateError');
    }

    const defaultOptions = {
      excludeLocal: false,
    };

    let observedClassName;
    let callback;
    let options;

    switch (args.length) {
      case 1: {
        // variation: .observe(callback)
        if (!isFunction(args[0])) {
          throw new TypeError(`[stateManager] Invalid arguments, argument 1 should be a function"`);
        }

        observedClassName = null;
        callback = args[0];
        options = defaultOptions;
        break;
      }
      case 2: {
        // variation: .observe(className, callback)
        if (isString(args[0])) {
          if (!isFunction(args[1])) {
            throw new TypeError(`[stateManager] Invalid arguments, argument 2 should be a function"`);
          }

          observedClassName = args[0];
          callback = args[1];
          options = defaultOptions;

        // variation: .observe(callback, options)
        } else if (isFunction(args[0])) {
          if (!isPlainObject(args[1])) {
            throw new TypeError(`[stateManager] Invalid arguments, argument 2 should be an object"`);
          }

          observedClassName = null;
          callback = args[0];
          options = Object.assign(defaultOptions, args[1]);

        } else {
          throw new TypeError(`[stateManager] Invalid signature, refer to the StateManager.observe documentation"`);
        }

        break;
      }
      case 3: {
        // variation: .observe(className, callback, options)
        if (!isString(args[0])) {
          throw new TypeError(`[stateManager] Invalid arguments, argument 1 should be a string"`);
        }

        if (!isFunction(args[1])) {
          throw new TypeError(`[stateManager] Invalid arguments, argument 2 should be a function"`);
        }

        if (!isPlainObject(args[2])) {
          throw new TypeError(`[stateManager] Invalid arguments, argument 2 should be an object"`);
        }

        observedClassName = args[0];
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
      const reqId = this.#promiseStore.add(resolve, reject, 'BaseStateManager#observe');
      // store the callback for execution on the response. the returned Promise
      // is fullfiled once callback has been executed with each existing states
      const observeInfos = [observedClassName, callback, options];
      this.#observeRequestCallbacks.set(reqId, observeInfos);

      // NOTE: do not store in `_observeListeners` yet as it can produce race
      // conditions, e.g.:
      // ```
      // await client.stateManager.observe(async (className, stateId, nodeId) => {});
      // // client now receives OBSERVE_NOTIFICATIONS
      // await otherClient.stateManager.create('a');
      // // second observer added in between
      // client.stateManager.observe(async (className, stateId, nodeId) => {});
      // ````
      // OBSERVE_NOTIFICATION is received before the OBSERVE_RESPONSE, then the
      // second observer is called twice:
      // - OBSERVE_RESPONSE 1 []
      // - OBSERVE_NOTIFICATION [ 'a', 1, 0 ]
      // - OBSERVE_NOTIFICATION [ 'a', 1, 0 ] // this should not happen
      // - OBSERVE_RESPONSE 1 [ [ 'a', 1, 0 ] ]
      //
      // cf. unit test `observe should properly behave in race condition`

      this[kStateManagerClient].transport.emit(OBSERVE_REQUEST, reqId, observedClassName);
    });
  }

  /**
   * Returns a collection of all the states created from a given shared state class.
   *
   * @overload
   * @param {SharedStateClassName} className - Name of the shared state class.
   * @returns {Promise<SharedStateCollection>}
   *
   * @example
   * const collection = await client.stateManager.getCollection(className);
   */
  /**
   * Returns a collection of all the states created from a given shared state class.
   *
   * @overload
   * @param {SharedStateClassName} className - Name of the shared state class.
   * @param {SharedStateParameterName[]} filter - Filter parameter of interest for each
   *  state of the collection.
   * @returns {Promise<SharedStateCollection>}
   *
   * @example
   * const collection = await client.stateManager.getCollection(className, ['my-param']);
   */
  /**
   * Returns a collection of all the states created from a given shared state class.
   *
   * @overload
   * @param {SharedStateClassName} className - Name of the shared state class.
   * @param {object} options - Options.
   * @param {boolean} options.excludeLocal=false - If set to true, exclude states
   *  created by the same node from the collection.
   * @returns {Promise<SharedStateCollection>}
   *
   * @example
   * const collection = await client.stateManager.getCollection(className, { excludeLocal: true });
   */
  /**
   * Returns a collection of all the states created from a given shared state class.
   *
   * @overload
   * @param {SharedStateClassName} className - Name of the shared state class.
   * @param {SharedStateParameterName[]} filter - Filter parameter of interest for each
   *  state of the collection.
   * @param {object} options - Options.
   * @param {boolean} options.excludeLocal=false - If set to true, exclude states
   *  created by the same node from the collection.
   * @returns {Promise<SharedStateCollection>}
   *
   * @example
   * const collection = await client.stateManager.getCollection(className, ['my-param'], { excludeLocal: true });
   */
  /**
   * Returns a collection of all the states created from a given shared state class.
   *
   * Alternative signatures:
   * - `stateManager.getCollection(className)`
   * - `stateManager.getCollection(className, filter)`
   * - `stateManager.getCollection(className, options)`
   * - `stateManager.getCollection(className, filter, options)`
   *
   * @param {SharedStateClassName} className - Name of the shared state class.
   * @param {array|null} [filter=null] - Filter parameter of interest for each
   *  state of the collection. If set to `null`, no filter applied.
   * @param {object} [options={}] - Options.
   * @param {boolean} [options.excludeLocal=false] - If set to true, exclude states
   *  created by the same node from the collection.
   * @returns {Promise<SharedStateCollection>}
   *
   * @example
   * const collection = await client.stateManager.getCollection(className);
   */
  async getCollection(className, filterOrOptions = null, options = {}) {
    if (this.#status !== 'inited') {
      throw new DOMException(`Cannot execute 'getCollection' on 'StateManager': state manager is not inited. This method can be safely called only once 'client' or 'server' is inited itself`, 'InvalidStateError');
    }

    if (!isString(className)) {
      throw new TypeError(`Cannot execute 'getCollection' on 'StateManager': 'className' should be a string"`);
    }

    let filter;

    if (arguments.length === 2) {
      if (filterOrOptions === null) {
        filter = null;
        options = null;
      } else if (Array.isArray(filterOrOptions)) {
        filter = filterOrOptions;
        options = {};
      } else if (typeof filterOrOptions === 'object') {
        filter = null;
        options = filterOrOptions;
      } else {
        throw new TypeError(`Cannot execute 'getCollection' on 'StateManager': argument 2 should be either null, an array or an object"`);
      }
    }

    if (arguments.length === 3) {
      filter = filterOrOptions;

      if (filter !== null && !Array.isArray(filter)) {
        throw new TypeError(`Cannot execute 'getCollection' on 'StateManager': 'filter' should be either an array or null"`);
      }

      if (options === null || typeof options !== 'object') {
        throw new TypeError(`Cannot execute 'getCollection' on 'StateManager': 'options' should be an object"`);
      }
    }

    const collection = new SharedStateCollection(this, className, filter, options);
    await collection._init();

    return collection;
  }
}

export default BaseStateManager;

