export const kStateManagerDeleteState: unique symbol;
export const kStateManagerClient: unique symbol;
export default BaseStateManager;
/** @private */
declare class BaseStateManager {
    /**
     * Executed on `client.init`
     * @param {Number} id - Id of the node.
     * @param {Object} transport - Transport to use for synchronizing the states.
     *  Must implement a basic EventEmitter API.
     *
     * @private
     */
    private init;
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
     * Attach to an existing `SharedState` instance.
     *
     * Alternative signatures:
     * - `stateManager.attach(schemaName)`
     * - `stateManager.attach(schemaName, stateId)`
     * - `stateManager.attach(schemaName, filter)`
     * - `stateManager.attach(schemaName, stateId, filter)`
     *
     * @param {string} schemaName - Name of the schema as given on registration
     *  (cf. ServerStateManager)
     * @param {number|string[]} [stateIdOrFilter=null] - Id of the state to attach to. If `null`,
     *  attach to the first state found with the given schema name (usefull for
     *  globally shared states owned by the server).
     * @param {string[]} [filter=null] - Filter parameters of interest in the
     *  returned state. If set to `null`, no filter applied.
     * @returns {Promise<SharedState>}
     *
     * @example
     * const state = await client.stateManager.attach('my-schema');
     */
    attach(schemaName: string, stateIdOrFilter?: number | string[], filter?: string[], ...args: any[]): Promise<SharedState>;
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
     * @param {server.StateManager~ObserveCallback|client.StateManager~ObserveCallback}
     *  callback - Function to be called when a new state is created on the network.
     * @param {object} options - Options.
     * @param {boolean} [options.excludeLocal = false] - If set to true, exclude states
     *  created locallly, i.e. by the same node, from the collection.
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
    [kStateManagerDeleteState](stateId: any): void;
    [kStateManagerClient]: {
        id: number;
        transport: BatchedTransport;
    };
    #private;
}
import SharedState from './SharedState.js';
import SharedStateCollection from './SharedStateCollection.js';
import BatchedTransport from './BatchedTransport.js';
