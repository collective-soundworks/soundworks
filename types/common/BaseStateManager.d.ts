export const kStateManagerInit: unique symbol;
export const kStateManagerDeleteState: unique symbol;
export const kStateManagerClient: unique symbol;
export default BaseStateManager;
/**
 * Callback executed when a state is created on the network.
 */
export type stateManagerObserveCallback = () => any;
/**
 * Callback to execute in order to remove a {@link stateManagerObserveCallback }
 * from the list of observer.
 */
export type stateManagerDeleteObserveCallback = () => any;
/**
 * Callback executed when a state is created on the network.
 *
 * @callback stateManagerObserveCallback
 * @async
 * @param {string} schemaName - name of the schema
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
     * Return the schema from a given registered schema name
     *
     * @param {String} schemaName - Name of the schema as given on registration
     *  (cf. ServerStateManager)
     * @return {SharedStateSchema}
     * @example
     * const schema = await client.stateManager.getSchema('my-class');
     */
    getSchema(schemaName: string): SharedStateSchema;
    /**
     * Create a {@link SharedState} instance from a registered schema.
     *
     * @param {string} schemaName - Name of the schema as given on registration
     *  (cf. ServerStateManager)
     * @param {Object.<string, any>} [initValues={}] - Default values for the state.
     * @returns {Promise<SharedState>}
     * @example
     * const state = await client.stateManager.create('my-class');
     */
    create(schemaName: string, initValues?: {
        [x: string]: any;
    }): Promise<SharedState>;
    /**
     * Attach to an existing {@link SharedState} instance.
     *
     * @overload
     * @param {string} schemaName
     * @returns {Promise<SharedState>}
     *
     * @example
     * const state = await client.stateManager.attach('my-class');
     */
    attach(schemaName: string): Promise<SharedState>;
    /**
     * Attach to an existing {@link SharedState} instance.
     *
     * @overload
     * @param {string} schemaName - Name of the schema
     * @param {number} stateId - Id of the state
     * @returns {Promise<SharedState>}
     *
     * @example
     * const state = await client.stateManager.attach('my-class', stateId);
     */
    attach(schemaName: string, stateId: number): Promise<SharedState>;
    /**
     * Attach to an existing {@link SharedState} instance.
     *
     * @overload
     * @param {string} schemaName - Name of the schema
     * @param {string[]} filter - List of parameters of interest
     * @returns {Promise<SharedState>}
     *
     * @example
     * const state = await client.stateManager.attach('my-class', ['some-param']);
     */
    attach(schemaName: string, filter: string[]): Promise<SharedState>;
    /**
     * Attach to an existing {@link SharedState} instance.
     *
     * @overload
     * @param {string} schemaName - Name of the schema
     * @param {number} stateId - Id of the state
     * @param {string[]} filter - List of parameters of interest
     * @returns {Promise<SharedState>}
     *
     * @example
     * const state = await client.stateManager.attach('my-class', stateId, ['some-param']);
     */
    attach(schemaName: string, stateId: number, filter: string[]): Promise<SharedState>;
    /**
     * Observe all the {@link SharedState} instances that are created on the network.
     *
     * @overload
     * @param {stateManagerObserveCallback} callback - Function to execute when a
     *   new {@link SharedState} is created on the network.
     * @example
     * client.stateManager.observe(async (schemaName, stateId) => {
     *   if (schemaName === 'my-shared-state-class') {
     *     const attached = await client.stateManager.attach(schemaName, stateId);
     *   }
     * });
     */
    observe(callback: stateManagerObserveCallback): any;
    /**
     * Observe all the {@link SharedState} instances of given {@link SharedStateClassName}
     * that are created on the network.
     *
     * @overload
     * @param {SharedStateClassName} schemaName - Observe only ${@link SharedState}
     *   of given name.
     * @param {stateManagerObserveCallback} callback - Function to execute when a
     *   new {@link SharedState} is created on the network.
     * @example
     * client.stateManager.observe('my-shared-state-class', async (schemaName, stateId) => {
     *   const attached = await client.stateManager.attach(schemaName, stateId);
     * });
     */
    observe(schemaName: SharedStateClassName, callback: stateManagerObserveCallback): any;
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
     * client.stateManager.observe(async (schemaName, stateId) => {
     *   if (schemaName === 'my-shared-state-class') {
     *     const attached = await client.stateManager.attach(schemaName, stateId);
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
     * @param {SharedStateClassName} schemaName - Observe only ${@link SharedState}
     *   of given name.
     * @param {stateManagerObserveCallback} callback - Function to execute when a
     *   new {@link SharedState} is created on the network.
     * @param {object} options - Options.
     * @param {boolean} options.excludeLocal=false - If set to true, exclude states
     *   created by the same node from the collection.
     * @example
     * client.stateManager.observe('my-shared-state-class', async (schemaName, stateId) => {
     *   const attached = await client.stateManager.attach(schemaName, stateId);
     * }, { excludeLocal: true });
     */
    observe(schemaName: SharedStateClassName, callback: stateManagerObserveCallback, options: {
        excludeLocal: boolean;
    }): any;
    /**
     * Returns a collection of all the states created from the schema name.
     *
     * @overload
     * @param {string} schemaName - Name of the schema.
     * @returns {Promise<SharedStateCollection>}
     *
     * @example
     * const collection = await client.stateManager.getCollection(schemaName);
     */
    getCollection(schemaName: string): Promise<SharedStateCollection>;
    /**
     * Returns a collection of all the states created from the schema name.
     *
     * @overload
     * @param {string} schemaName - Name of the schema.
     * @param {SharedStateParameterName[]} filter - Filter parameter of interest for each
     *  state of the collection.
     * @returns {Promise<SharedStateCollection>}
     *
     * @example
     * const collection = await client.stateManager.getCollection(schemaName, ['my-param']);
     */
    getCollection(schemaName: string, filter: SharedStateParameterName[]): Promise<SharedStateCollection>;
    /**
     * Returns a collection of all the states created from the schema name.
     *
     * @overload
     * @param {string} schemaName - Name of the schema.
     * @param {object} options - Options.
     * @param {boolean} options.excludeLocal=false - If set to true, exclude states
     *  created by the same node from the collection.
     * @returns {Promise<SharedStateCollection>}
     *
     * @example
     * const collection = await client.stateManager.getCollection(schemaName, { excludeLocal: true });
     */
    getCollection(schemaName: string, options: {
        excludeLocal: boolean;
    }): Promise<SharedStateCollection>;
    /**
     * Returns a collection of all the states created from the schema name.
     *
     * @overload
     * @param {string} schemaName - Name of the schema.
     * @param {SharedStateParameterName[]} filter - Filter parameter of interest for each
     *  state of the collection.
     * @param {object} options - Options.
     * @param {boolean} options.excludeLocal=false - If set to true, exclude states
     *  created by the same node from the collection.
     * @returns {Promise<SharedStateCollection>}
     *
     * @example
     * const collection = await client.stateManager.getCollection(schemaName, ['my-param'], { excludeLocal: true });
     */
    getCollection(schemaName: string, filter: SharedStateParameterName[], options: {
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
