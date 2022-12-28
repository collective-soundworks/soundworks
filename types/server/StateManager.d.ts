export default StateManager;
export namespace server {
    /**
     * ~ObserveCallback
     */
    type StateManager = () => any;
}
/**
 * @callback server.StateManager~ObserveCallback
 * @async
 * @param {String} schemaName - name of the schema
 * @param {Number} stateId - id of the state
 * @param {Number} nodeId - id of the node that created the state
 */
/**
 * The `StateManager` allows to create new {@link server.SharedState}s, or attach
 * to {@link server.SharedState}s created by other nodes (clients or server). It
 * can also track all the {@link server.SharedState}s created by other nodes.
 *
 * An instance of `StateManager` is automatically created by the `soundworks.Server`
 * at initialization (cf. {@link server.Server#stateManager}).
 *
 * Compared to the {@link client.StateManager}, the `server.StateManager` can also
 * create and delete schemas, as well as register update hook that are executed when
 * a state is updated.
 *
 * See {@link server.Server#stateManager}
 *
 * Tutorial: {@link https://soundworks.dev/guide/state-manager.html}
 *
 * ```
 * // server-side
 * import { Server } from '@soundworks/server/index.js';
 *
 * const server = new Server(config);
 * // declare and register the schema of a shared state.
 * server.stateManager.registerSchema('some-global-state', {
 *   myRandom: {
 *     type: 'float',
 *     default: 0,
 *   }
 * });
 *
 * await server.start();
 *
 * // create a global state server-side
 * const globalState = await server.stateManager.create('some-global-state');
 * // listen and react to the changes made by the clients
 * globalState.onUpdate(updates => console.log(updates));
 * ```
 *
 * ```
 * // client-side
 * import { Client } from '@soundworks/client.index.js';
 *
 * const client = new Client(config);
 * await client.start();
 *
 * // attach to the global state created by the server
 * const globalState = await client.stateManager.attach('some-global-state');
 *
 * // update the value of a `myRandom` parameter every seconds
 * setInterval(() => {
 *   globalState.set({ myRandom: Math.random() });
 * }, 1000);
 * ```
 *
 * @memberof server
 * @extends BaseStateManager
 * @inheritdoc
 * @hideconstructor
 */
declare class StateManager extends BaseStateManager {
    constructor();
    _clientByNodeId: Map<any, any>;
    _serverStatesById: Map<any, any>;
    _schemas: Map<any, any>;
    _observers: Set<any>;
    _hooksBySchemaName: Map<any, any>;
    /**
     * Add a client to the manager.
     *
     * This is automatically handled by the {@link server.Server} when a client connects.
     *
     * @param {Number} nodeId - Id of the client node, as given in
     *  {@link client.StateManager}
     * @param {Object} transport - Tranpsort mecanism to communicate with the
     *  client. Should implement a basic EventEmitter API.
     *
     * @private
     */
    private addClient;
    /**
     * Remove a client from the manager. Clean all created or attached states.
     *
     * This is automatically handled by the {@link server.Server} when a client disconnects.
     *
     * @param {Number} nodeId - Id of the client node, as given in
     *  {@link client.StateManager}
     *
     * @private
     */
    private removeClient;
    /**
     * Register a schema from which shared states (cf. {@link common.SharedState})
     * can be instanciated.
     *
     * @param {String} schemaName - Name of the schema.
     * @param {server.StateManager~schema} schema - Data structure
     *  describing the states that will be created from this schema.
     *
     * @see {@link server.StateManager#create}
     * @see {@link client.StateManager#create}
     *
     * @example
     * server.stateManager.registerSchema('my-schema', {
     *   myBoolean: {
     *     type: 'boolean'
     *     default: false,
     *   },
     *   myFloat: {
     *     type: 'float'
     *     default: 0.1,
     *     min: -1,
     *     max: 1
     *   }
     * })
     */
    registerSchema(schemaName: string, schema: any): void;
    /**
     * Delete a schema and all associated states.
     * When a schema is deleted, all states created from this schema are deleted
     * as well, therefore all attached clients are detached and the `onDetach`
     * and `onDelete` callbacks are called on the related states.
     *
     * @param {String} schemaName - Name of the schema.
     */
    deleteSchema(schemaName: string): void;
    /**
     * @callback server.StateManager~updateHook
     * @async
     *
     * @param {Object} updates - Update object as given on a set callback, or
     *  result of the previous hook
     * @param {Object} currentValues - Current values of the state.
     * @param {Object} [context=null] - Optionnal context passed by the creator
     *  of the update.
     *
     * @return {Object} The "real" updates to be applied on the state.
     */
    /**
     * Register a function for a given schema (e.g. will be applied on all states
     * created from this schema) that will be executed before the update values
     * are propagated. For example, this could be used to implement a preset system
     * where all the values of the state are updated from e.g. some data stored in
     * filesystem while the consumer of the state only want to update the preset name.
     *
     * The hook is associated to every state of its kind (i.e. schemaName) and
     * executed on every update (call of `set`). Note that the hooks are executed
     * server-side regarless the node on which `set` has been called and before
     * the "actual" update of the state (e.g. before the call of `onUpdate`).
     *
     * @param {String} schemaName - Kind of states on which applying the hook.
     * @param {server.StateManager~updateHook} updateHook - Function
     *   called between the `set` call and the actual update.
     *
     * @returns {Fuction} deleteHook - Handler that deletes the hook when executed.
     *
     * @example
     * server.stateManager.registerSchema('hooked', {
     *   name: { type: 'string', default: null, nullable: true },
     *   name: { numUpdates: 'integer', default: 0 },
     * });
     * server.stateManager.registerUpdateHook('hooked', updates => {
     *   return {
     *     ...updates
     *     numUpdates: currentValues.numUpdates + 1,
     *   };
     * });
     *
     * const state = await server.stateManager.create('hooked');
     *
     * await state.set({ name: 'test' });
     * const values = state.getValues();
     * assert.deepEqual(result, { name: 'test', numUpdates: 1 });
     */
    registerUpdateHook(schemaName: string, updateHook: any): Fuction;
}
import BaseStateManager from "../common/BaseStateManager.js";
//# sourceMappingURL=StateManager.d.ts.map