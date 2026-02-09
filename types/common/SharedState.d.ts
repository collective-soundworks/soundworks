export const kSharedStatePromiseStore: unique symbol;
export default SharedState;
/**
 * Callback executed when updates are applied on a {@link SharedState}.
 */
export type sharedStateOnUpdateCallback = (newValues: any, oldValues: any) => any;
/**
 * Delete the registered {@link sharedStateOnUpdateCallback}.
 */
export type sharedStateDeleteOnUpdateCallback = () => any;
/**
 * Callback executed when updates are applied on a {@link SharedState}.
 *
 * @callback sharedStateOnUpdateCallback
 * @param {Object} newValues - Key / value pairs of the updates that have been
 *  applied to the state.
 * @param {Object} oldValues - Key / value pairs of the updated params before
 *  the updates has been applied to the state.
 */
/**
 * Delete the registered {@link sharedStateOnUpdateCallback}.
 *
 * @callback sharedStateDeleteOnUpdateCallback
 */
/**
 * The `SharedState` is one of the most important and versatile abstraction provided
 * by `soundworks`. It represents a set of parameters that are synchronized across
 * every nodes of the application (clients and server) that declared some interest
 * to the shared state.
 *
 * A `SharedState` instance is created according to a shared state class definition
 * which is composed of a {@link SharedStateClassName} and of a {@link SharedStateClassDescription}
 * registered in the {@link ServerStateManager}. Any number of `SharedState`s
 * can be created from a single class definition.
 *
 * A shared state can be created both by the clients or by the server, in which case
 * it is generally considered as a global state of the application. Similarly any
 * node of the application (clients or server) can declare interest and "attach" to
 * a state created by another node. All node attached to a state can modify its values
 * and/or react to the modifications applied by other nodes.
 *
 * Tutorial: {@link https://soundworks.dev/guide/state-manager.html}
 *
 * ```
 * // server-side
 * import { Server } from '@soundworks/server/index.js';
 *
 * const server = new Server(config);
 * // define a shared state class
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
 */
declare class SharedState {
    constructor({ stateId, instanceId, className, classDescription, isOwner, manager, initValues, filter, }: {
        stateId: any;
        instanceId: any;
        className: any;
        classDescription: any;
        isOwner: any;
        manager: any;
        initValues: any;
        filter: any;
    });
    /**
     * Id of the state
     * @type {Number}
     */
    get id(): number;
    /**
     * Name of the underlying {@link SharedState} class.
     * @type {String}
     */
    get className(): string;
    /**
     * @deprecated Use {@link SharedState#className} instead.
     */
    get schemaName(): string;
    /**
     * Indicates if the node is the owner of the state, i.e. if it created the state.
     * @type {Boolean}
     */
    get isOwner(): boolean;
    /**
     * Return the underlying {@link SharedStateClassDescription} or the
     * {@link SharedStateParameterDescription} if `paramName` is given.
     *
     * @param {string} [paramName=null] - If defined, returns the parameter
     *  description of the given parameter name rather than the full class description.
     * @return {SharedStateClassDescription|SharedStateParameterDescription}
     * @throws Throws if `paramName` is not null and does not exists.
     * @example
     * const classDescription = state.getDescription();
     * const paramDescription = state.getDescription('my-param');
     */
    getDescription(paramName?: string): SharedStateClassDescription | SharedStateParameterDescription;
    /**
     * @deprecated Use {@link SharedState#getDescription} instead.
     */
    getSchema(paramName?: any): any;
    /**
     * Update the values of the state.
     *
     * The returned `Promise` resolves on an object that contains the applied updates,
     * and resolves after all the `onUpdate` callbacks have resolved themselves
     *
     * @overload
     * @param {object} updates - Key / value pairs of updates to apply to the state.
     * @returns {Promise<Object>} - Promise to the (coerced) updates.
     */
    set(updates: object): Promise<any>;
    /**
     * Update the values of the state.
     *
     * The returned `Promise` resolves on an object that contains the applied updates,
     * and resolves after all the `onUpdate` callbacks have resolved themselves
     *
     * @overload
     * @param {SharedStateParameterName} name - Name of the parameter.
     * @param {*} value - Value of the parameter.
     * @returns {Promise<Object>} - Promise to the (coerced) updates.
     */
    set(name: SharedStateParameterName, value: any): Promise<any>;
    /**
     * Get the value of a parameter of the state.
     *
     * Be aware that in case of 'any' type, the returned value is deeply copied.
     * While this prevents from pollution of the state by mutating the reference,
     * this can also lead to performance issues when the parameter contains large
     * data. In such cases you should use the {@link SharedState#getUnsafe} method
     * and make sure to treat the returned object as readonly.
     *
     * @param {SharedStateParameterName} name - Name of the param.
     * @return {any}
     * @throws Throws if `name` does not exists.
     * @example
     * const value = state.get('paramName');
     */
    get(name: SharedStateParameterName): any;
    /**
     * Get an unsafe reference to the value of a parameter of the state.
     *
     * Similar to `get` but returns a reference to the underlying value in case of
     * `any` type. Can be useful if the underlying value is large (e.g. sensors
     * recordings, etc.) and deep cloning expensive. Be aware that if changes are
     * made on the returned object, the state of your application will become
     * inconsistent.
     *
     * @param {SharedStateParameterName} name - Name of the param.
     * @return {any}
     * @throws Throws if `name` does not exists.
     * @example
     * const value = state.getUnsafe('paramName');
     */
    getUnsafe(name: SharedStateParameterName): any;
    /**
     * Get all the key / value pairs of the state.
     *
     * If a parameter is of `any` type, a deep copy is made.
     *
     * @return {object}
     * @example
     * const values = state.getValues();
     */
    getValues(): object;
    /**
     * Get all the key / value pairs of the state.
     *
     * Similar to `getValues` but returns a reference to the underlying value in
     * case of `any` type. Can be useful if the underlying value is big (e.g.
     * sensors recordings, etc.) and deep cloning expensive. Be aware that if
     * changes are made on the returned object, the state of your application will
     * become inconsistent.
     *
     * @return {object}
     * @example
     * const values = state.getValues();
     */
    getValuesUnsafe(): object;
    /**
     * Get the values with which the state has been created. May defer from the
     * default values declared in the class description.
     *
     * @return {object}
     * @example
     * const initValues = state.getInitValues();
     */
    getInitValues(): object;
    /**
     * Get the default values as declared in the class description.
     *
     * @return {object}
     * @example
     * const defaults = state.getDefaults();
     */
    getDefaults(): object;
    /**
     * Detach from the state. If the client is the creator of the state, the state
     * is deleted and all attached nodes get notified.
     *
     * @example
     * const state = await client.state.attach('globals');
     * // later
     * await state.detach();
     */
    detach(): Promise<any>;
    /**
     * Delete the state. Only the creator/owner of the state can use this method.
     *
     * All nodes attached to the state will be detached, triggering any registered
     * `onDetach` callbacks. The creator of the state will also have its own `onDelete`
     * callback triggered. The local `onDetach` and `onDelete` callbacks will be
     * executed *before* the returned Promise resolves
     *
     * @throws Throws if the method is called by a node which is not the owner of
     * the state.
     * @example
     * const state = await client.stateManager.create('my-class-name');
     * // later
     * await state.delete();
     */
    delete(): Promise<any>;
    /**
     * Subscribe to state updates.
     *
     * @param {sharedStateOnUpdateCallback} callback
     *  Callback to execute when an update is applied on the state.
     * @param {Boolean} [executeListener=false] - Execute the callback immediately
     *  with current state values. Note that `oldValues` will be set to `{}`.
     * @returns {sharedStateDeleteOnUpdateCallback}
     * @example
     * const unsubscribe = state.onUpdate(async (newValues, oldValues) =>  {
     *   for (let [key, value] of Object.entries(newValues)) {
     *      switch (key) {
     *        // do something
     *      }
     *   }
     * });
     *
     * // later
     * unsubscribe();
     */
    onUpdate(listener: any, executeListener?: boolean): sharedStateDeleteOnUpdateCallback;
    /**
     * Register a function to execute when detaching from the state. The function
     * will be executed before the `detach` promise resolves.
     *
     * @param {Function} callback - Callback to execute when detaching from the state.
     *   Whether the client as called `detach`, or the state has been deleted by its
     *   creator.
     */
    onDetach(callback: Function): () => boolean;
    /**
     * Register a function to execute when the state is deleted. Only called if the
     * node was the creator of the state. Is called after `onDetach` and executed
     * before the `delete` Promise resolves.
     *
     * @param {Function} callback - Callback to execute when the state is deleted.
     */
    onDelete(callback: Function): () => boolean;
    /** @private */
    private [kSharedStatePromiseStore];
    #private;
}
//# sourceMappingURL=SharedState.d.ts.map