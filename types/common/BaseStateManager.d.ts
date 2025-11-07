export const kStateManagerInit: unique symbol;
export const kStateManagerDeleteState: unique symbol;
export const kStateManagerClient: unique symbol;
export default BaseStateManager;
/**
 * Callback executed when a state is created on the network.
 */
export type stateManagerObserveCallback = () => any;
/**
 * Callback to execute in order to remove a {@link stateManagerObserveCallback}
 * from the list of observer.
 */
export type stateManagerDeleteObserveCallback = () => any;
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
declare class BaseStateManager {
    /**
     * Validates the given class description.
     *
     * @throws Throws if the class description is invalid
     * @param {*} classDescription
     * @returns undefined
     */
    validateClassDescription(classDescription: any): void;
    /**
     * Return a class description from a given class name
     *
     * @param {SharedStateClassName} className - Name of the shared state class.
     *  (cf. ServerStateManager)
     * @return {SharedStateClassDescription}
     * @example
     * const classDescription = await client.stateManager.getClassDescription('my-class');
     */
    getClassDescription(className: SharedStateClassName): SharedStateClassDescription;
    /**
     * @deprecated Use {@link BaseStateManager#getClassDescription} instead.
     */
    getSchema(className: any): Promise<any>;
    /**
     * Create a {@link SharedState} instance from a registered class.
     *
     * @param {SharedStateClassName} className - Name of the class.
     * @param {Object.<string, any>} [initValues={}] - Default values of the created shared state.
     * @returns {Promise<SharedState>}
     * @example
     * const state = await client.stateManager.create('my-class');
     */
    create(className: SharedStateClassName, initValues?: {
        [x: string]: any;
    }): Promise<SharedState>;
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
    attach(className: SharedStateClassName): Promise<SharedState>;
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
    attach(className: SharedStateClassName, stateId: number): Promise<SharedState>;
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
    attach(className: SharedStateClassName, filter: string[]): Promise<SharedState>;
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
    attach(className: SharedStateClassName, stateId: number, filter: string[]): Promise<SharedState>;
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
    observe(callback: stateManagerObserveCallback): any;
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
    observe(className: SharedStateClassName, callback: stateManagerObserveCallback): any;
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
    observe(callback: stateManagerObserveCallback, options: {
        excludeLocal: boolean;
    }): any;
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
    observe(className: SharedStateClassName, callback: stateManagerObserveCallback, options: {
        excludeLocal: boolean;
    }): any;
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
    getCollection(className: SharedStateClassName): Promise<SharedStateCollection>;
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
    getCollection(className: SharedStateClassName, filter: SharedStateParameterName[]): Promise<SharedStateCollection>;
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
    getCollection(className: SharedStateClassName, options: {
        excludeLocal: boolean;
    }): Promise<SharedStateCollection>;
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
    getCollection(className: SharedStateClassName, filter: SharedStateParameterName[], options: {
        excludeLocal: boolean;
    }): Promise<SharedStateCollection>;
    /** @private */
    private [kStateManagerDeleteState];
    /**
     * Executed on `client.init`
     * @param {Number} id - Id of the node.
     * @param {Object} transport - Transport to use for synchronizing the states.
     *  Must implement a basic EventEmitter API.
     *
     * @private
     */
    private [kStateManagerInit];
    /** @private */
    private [kStateManagerClient];
    #private;
}
import SharedState from './SharedState.js';
import SharedStateCollection from './SharedStateCollection.js';
