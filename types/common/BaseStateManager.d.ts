export default BaseStateManager;
/**
 * @private
 */
declare class BaseStateManager {
    /**
     * @param {Number} id - Id of the node.
     * @param {Object} transport - Transport to use for synchronizing the state.
     *  Must implement a basic EventEmitter API.
     */
    constructor(id: number, transport: any);
    client: {
        id: number;
        transport: any;
    };
    _statesById: Map<any, any>;
    _observeListeners: Set<any>;
    _cachedSchemas: Map<any, any>;
    _observeRequestCallbacks: Map<any, any>;
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
    create(schemaName: string, initValues?: any): client.SharedState | server.SharedState;
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
    attach(schemaName: string, stateId?: any): client.SharedState | server.SharedState;
    /**
     * Observe all the `SharedState` instances that are created on the network.
     * This can be usefull for clients with some controller role that might want to track
     * the state of all other clients of the application, to monitor them and/or take
     * control over them from a single point.
     *
     * @todo Optionnal schema name
     * @param {server.StateManager~ObserveCallback|client.StateManager~ObserveCallback}
     *  callback - Function to be called when a new state is created on the network.
     * @returns {Promise<Function>} - Return a Promise that resolves when the callback
     *  as been executed for the first time. The promise value is a function which
     *  allows to stop observing the network.
     * @example
     * client.stateManager.observe(async (schemaName, stateId, nodeId) => {
     *   if (schemaName === 'something') {
     *     const state = await this.client.stateManager.attach(schemaName, stateId);
     *     console.log(state.getValues());
     *   }
     * });
     */
    observe(callback: any): Promise<Function>;
}
//# sourceMappingURL=BaseStateManager.d.ts.map