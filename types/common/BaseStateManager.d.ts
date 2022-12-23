export default BaseStateManager;
export namespace common {
    type StateManagerObserveCallback = () => any;
}
/**
 * @callback common.StateManagerObserveCallback
 * @async
 *
 * @param {String} schemaName - name of the schema
 * @param {Number} stateId - id of the state
 * @param {Number} nodeId - id of the node that created the state
 */
/**
 * Component dedicated at managing distributed states, accessible through {@link common.SharedState} instances, among the application.
 *
 * An instance of `StateManager` is automatically created by the
 * `soundworks.Client` at initialization (cf. {@link client.Client#stateManager}).
 *
 * Tutorial: [https://collective-soundworks.github.io/tutorials/state-manager.html](https://collective-soundworks.github.io/tutorials/state-manager.html)
 *
 * @see {@link common.SharedState}
 * @see {@link client.StateManager}
 * @see {@link client.Client#stateManager}
 * @see {@link server.StateManager}
 * @see {@link server.Server#stateManager}
 *
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
     * Create a {@link common.SharedState} instance from a previsouly registered schema.
     *
     * @see {@link common.SharedState}
     *
     * @param {String} schemaName - Name of the schema as given on registration
     *  (cf. ServerStateManager)
     * @param {Object} [initValues={}] - Default values for the state.
     *
     * @return {@link common.SharedState}
     */
    create(schemaName: string, initValues?: any): any;
    /**
     * Attach to an existing {@link common.SharedState} instance.
     *
     * @see {@link common.SharedState}
     *
     * @param {String} schemaName - Name of the schema as given on registration
     *  (cf. ServerStateManager)
     * @param {Object} [stateId=null] - Id of the state to attach to. If `null`,
     *  attach to the first state found with the given schema name (usefull for
     *  globally shared states owned by the server).
     *
     * @return {@link common.SharedState}
     */
    attach(schemaName: string, stateId?: any): any;
    /**
     * Observe all the {@link common.SharedState} instances that are created on the network.
     *
     * @param {common.StateManagerObserveCallback} callback - Function
     *  to be called when a new state is created on the network.
     *
     * @return Promise<Function> - Return a Promise that resolves when the callback
     *  as been executed for the first time. The promise value is a function which
     *  allows to stop observing the network.
     *
     * @example
     * this.client.stateManager.observe(async (schemaName, stateId, nodeId) => {
     *   if (schemaName === 'something') {
     *     const state = await this.client.stateManager.attach(schemaName, stateId);
     *     console.log(state.getValues());
     *   }
     * });
     */
    observe(callback: common.StateManagerObserveCallback): Promise<any>;
}
//# sourceMappingURL=BaseStateManager.d.ts.map