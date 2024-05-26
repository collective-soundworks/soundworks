export const kStateManagerInit: unique symbol;
export const kStateManagerDeleteState: unique symbol;
export const kStateManagerClient: unique symbol;
export default BaseStateManager;
export type stateManagerObserveCallback = () => any;
/**
 * @callback stateManagerObserveCallback
 * @async
 * @param {string} schemaName - name of the schema
 * @param {number} stateId - id of the state
 * @param {number} nodeId - id of the node that created the state
 */
/** @private */
declare class BaseStateManager {
    /**
     * Return the schema from a given registered schema name
     *
     * @param {String} schemaName - Name of the schema as given on registration
     *  (cf. ServerStateManager)
     * @example
     * const schema = await client.stateManager.getSchema('my-schema');
     */
    getSchema(schemaName: string): Promise<any>;
    /**
     * Create a `SharedState` instance from a registered schema.
     *
     * @param {string} schemaName - Name of the schema as given on registration
     *  (cf. ServerStateManager)
     * @param {Object.<string, any>} [initValues={}] - Default values for the state.
     * @returns {Promise<SharedState>}
     * @example
     * const state = await client.stateManager.create('my-schema');
     */
    create(schemaName: string, initValues?: {
        [x: string]: any;
    }): Promise<SharedState>;
    /**
     * @overload
     * @param {string} schemaName
     */
    attach(schemaName: string): any;
    /**
     * @overload
     * @param {string} schemaName - Name of the schema
     * @param {number} stateId - Id of the state
     */
    attach(schemaName: string, stateId: number): any;
    /**
     * @overload
     * @param {string} schemaName - Name of the schema
     * @param {string[]} filter - List of parameters of interest
     */
    attach(schemaName: string, filter: string[]): any;
    /**
     * @overload
     * @param {string} schemaName - Name of the schema
     * @param {number} stateId - Id of the state
     * @param {string[]} filter - List of parameters of interest
     */
    attach(schemaName: string, stateId: number, filter: string[]): any;
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
     * - `stateManager.observe(callback)`
     * - `stateManager.observe(schemaName, callback)`
     * - `stateManager.observe(callback, options)`
     * - `stateManager.observe(schemaName, callback, options)`
     *
     * @param {string} [schemaName] - optionnal schema name to filter the observed
     *  states.
     * @param {stateManagerObserveCallback}
     *  callback - Function to be called when a new state is created on the network.
     * @param {object} options - Options.
     * @param {boolean} [options.excludeLocal = false] - If set to true, exclude states
     *  created locally, i.e. by the same node, from the collection.
     * @returns {Promise<Function>} - Returns a Promise that resolves when the given
     *  callback as been executed on each existing states. The promise value is a
     *  function which allows to stop observing the states on the network.
     *
     * @example
     * client.stateManager.observe(async (schemaName, stateId) => {
     *   if (schemaName === 'something') {
     *     const state = await this[kStateManagerClient].stateManager.attach(schemaName, stateId);
     *     console.log(state.getValues());
     *   }
     * });
     */
    observe(...args: any[]): Promise<Function>;
    /**
     * Returns a collection of all the states created from the schema name.
     *
     * Alternative signatures:
     * - `stateManager.getCollection(schemaName)`
     * - `stateManager.getCollection(schemaName, filter)`
     * - `stateManager.getCollection(schemaName, options)`
     * - `stateManager.getCollection(schemaName, filter, options)`
     *
     * @param {string} schemaName - Name of the schema.
     * @param {array|null} [filter=null] - Filter parameter of interest for each
     *  state of the collection. If set to `null`, no filter applied.
     * @param {object} [options={}] - Options.
     * @param {boolean} [options.excludeLocal=false] - If set to true, exclude states
     *  created by the same node from the collection.
     * @returns {Promise<SharedStateCollection>}
     *
     * @example
     * const collection = await client.stateManager.getCollection(schemaName);
     */
    getCollection(schemaName: string, filterOrOptions?: any, options?: {
        excludeLocal?: boolean;
    }, ...args: any[]): Promise<SharedStateCollection>;
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
