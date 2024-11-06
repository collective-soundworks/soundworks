export const kServerStateManagerAddClient: unique symbol;
export const kServerStateManagerRemoveClient: unique symbol;
export const kServerStateManagerHasClient: unique symbol;
export const kServerStateManagerDeletePrivateState: unique symbol;
export const kServerStateManagerGetUpdateHooks: unique symbol;
export const kStateManagerClientsByNodeId: unique symbol;
export default ServerStateManager;
export type serverStateManagerCreateHook = () => any;
export type serverStateManagerUpdateHook = () => any;
export type serverStateManagerDeleteHook = () => any;
/**
 * @callback serverStateManagerCreateHook
 * @async
 *
 * @param {object} initValues - Initialization values object as given when the
 *  shared state is created
 */
/**
 * @callback serverStateManagerUpdateHook
 * @async
 *
 * @param {object} updates - Update object as given on a `set` callback, or
 *  result of the previous hook.
 * @param {object} currentValues - Current values of the state.
 * @returns {object} The "real" updates to be applied on the state.
 */
/**
 * @callback serverStateManagerDeleteHook
 * @async
 *
 * @param {object} currentValues - Update object as given on a `set` callback, or
 *  result of the previous hook.
 */
/**
 * The `StateManager` allows to create new {@link SharedState}s, or attach
 * to {@link SharedState}s created by other nodes (clients or server). It
 * can also track all the {@link SharedState}s created by other nodes.
 *
 * An instance of `StateManager` is automatically created by the `soundworks.Server`
 * at initialization (cf. {@link Server#stateManager}).
 *
 * Compared to the {@link ClientStateManager}, the `ServerStateManager` can also
 * define and delete shared state classes, as well as register hooks executed at
 * lifecycle phases of a shared state
 *
 * See {@link Server#stateManager}
 *
 * Tutorial: {@link https://soundworks.dev/guide/state-manager.html}
 *
 * ```
 * // server-side
 * import { Server } from '@soundworks/server/index.js';
 *
 * const server = new Server(config);
 * // declare and register the class of a shared state.
 * server.stateManager.defineClass('some-global-state', {
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
 * @extends BaseStateManager
 * @inheritdoc
 * @hideconstructor
 */
declare class ServerStateManager extends BaseStateManager {
    /**
     * Define a generic class from which {@link SharedState}s can be created.
     *
     * @param {SharedStateClassName} className - Name of the class.
     * @param {SharedStateClassDescription} classDescription - Description of the class.
     *
     * @see {@link ServerStateManager#create}
     * @see {@link ClientStateManager#create}
     *
     * @example
     * server.stateManager.defineClass('my-class', {
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
     * });
     */
    defineClass(className: SharedStateClassName, classDescription: SharedStateClassDescription): void;
    /**
     * @deprecated Use {@link ServerStateManager#defineClass} instead.
     */
    registerSchema(className: any, classDescription: any): void;
    /**
     * Delete a whole class of {@link ShareState}.
     *
     * All {@link SharedState} instances created from this class will be deleted
     * as well, triggering their eventual `onDetach` and `onDelete` callbacks.
     *
     * @param {SharedStateClassName} className - Name of the shared state class to delete.
     */
    deleteClass(className: SharedStateClassName): void;
    /**
     * @deprecated Use {@link ServerStateManager#defineClass} instead.
     */
    deleteSchema(className: any): void;
    /**
     * Register a function for a given class of shared state class to be executed
     * when a state is created.
     *
     * For example, this can be usefull to retrieve some initialization values stored
     * in the filesystem, given the value (e.g. a hostname) of one the parameters.
     *
     * The hook is associated to each states created from the given class name.
     * Note that the hooks are executed server-side regarless the node on which
     * `create` has been called.
     *
     * Multiple hook can be added to the same `className`, they will be executed in
     * order of registration.
     *
     * @param {string} className - Kind of states on which applying the hook.
     * @param {serverStateManagerUpdateHook} createHook - Function called on when
     *  a state of `className` is created on the network.
     *
     * @returns {function} deleteHook - Handler that deletes the hook when executed.
     *
     * @example
     * server.stateManager.defineClass('hooked', {
     *   name: { type: 'string', required: true },
     *   hookTriggered: { type: 'boolean', default: false },
     * });
     * server.stateManager.registerCreateHook('hooked', initValues => {
     *   return {
     *     ...initValues
     *     hookTriggered: true,
     *   };
     * });
     *
     * const state = await server.stateManager.create('hooked', {
     *   name: 'coucou',
     * });
     *
     * const values = state.getValues();
     * assert.deepEqual(result, { value: 'coucou', hookTriggered: true });
     */
    registerCreateHook(className: string, createHook: serverStateManagerUpdateHook): Function;
    /**
     * Register a function for a given class of shared state class to be executed
     * when a state is deleted.
     *
     * For example, this can be usefull to store the values of a given shared state
     * in the filesystem.
     *
     * The hook is associated to each states created from the given class name.
     * Note that the hooks are executed server-side regarless the node on which
     * `delete` has been called.
     *
     * Multiple hook can be added to the same `className`, they will be executed in
     * order of registration.
     *
     * @param {string} className - Kind of states on which applying the hook.
     * @param {serverStateManagerUpdateHook} createHook - Function called on when
     *  a state of `className` is created on the network.
     *
     * @returns {function} deleteHook - Handler that deletes the hook when executed.
     *
     * @example
     * server.stateManager.defineClass('hooked', {
     *   name: { type: 'string', required: true },
     *   hookTriggered: { type: 'boolean', default: false },
     * });
     * server.stateManager.registerDeleteHook('hooked', async currentValues => {
     *   await doSomethingWithValues(currentValues)
     * });
     *
     * const state = await server.stateManager.create('hooked');
     * // later
     * await state.delete();
     */
    registerDeleteHook(className: string, deleteHook: any): Function;
    /**
     * Register a function for a given class of shared state to be executed between
     * `set` instructions and `onUpdate` callback(s).
     *
     * For example, this can be used to implement a preset system where all the values
     * of the state are updated from e.g. some data stored in filesystem while the
     * consumer of the state only want to update the preset name.
     *
     * The hook is associated to each states created from the given class name and
     * executed on each update (i.e. `state.set(updates)`). Note that the hooks are
     * executed server-side regarless the node on which `set` has been called and
     * before the call of the `onUpdate` callback of the shared state.
     *
     * Multiple hook can be added to the same `className`, they will be executed in
     * order of registration.
     *
     * @param {string} className - Kind of states on which applying the hook.
     * @param {serverStateManagerUpdateHook} updateHook - Function called on each update,
     *  to eventually modify the updates before they are actually applied.
     *
     * @returns {function} deleteHook - Handler that deletes the hook when executed.
     *
     * @example
     * server.stateManager.defineClass('hooked', {
     *   value: { type: 'string', default: null, nullable: true },
     *   numUpdates: { type: 'integer', default: 0 },
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
     * await state.set({ value: 'test' });
     * const values = state.getValues();
     * assert.deepEqual(result, { value: 'test', numUpdates: 1 });
     */
    registerUpdateHook(className: string, updateHook: serverStateManagerUpdateHook): Function;
    /** @private */
    private [kStateManagerInit];
    /** @private */
    private [kServerStateManagerDeletePrivateState];
    /** @private */
    private [kServerStateManagerGetUpdateHooks];
    /** @private */
    private [kServerStateManagerHasClient];
    /**
     * Add a client to the manager.
     *
     * This is automatically handled by the {@link Server} when a client connects.
     *
     * @param {number} nodeId - Unique id of the client node
     * @param {object} transport - Transport mecanism to communicate with the
     *  client. Must implement a basic EventEmitter API.
     *
     * @private
     */
    private [kServerStateManagerAddClient];
    /**
     * Remove a client from the manager. Clean all created or attached states.
     *
     * This is automatically handled by the {@link Server} when a client disconnects.
     *
     * @param {number} nodeId - Id of the client node, as given in
     *  {@link client.StateManager}
     *
     * @private
     */
    private [kServerStateManagerRemoveClient];
    /** @private */
    private [kStateManagerClientsByNodeId];
    #private;
}
import BaseStateManager from '../common/BaseStateManager.js';
import { kStateManagerInit } from '../common/BaseStateManager.js';
