export default BaseSharedState;
declare class BaseSharedState {
    constructor(id: any, remoteId: any, schemaName: any, schema: any, client: any, isOwner: any, manager: any, initValues: any, filter: any);
    /** @private */
    private _id;
    /** @private */
    private _remoteId;
    /** @private */
    private _schemaName;
    /** @private */
    private _isOwner;
    /** @private */
    private _client;
    /** @private */
    private _manager;
    /** @private */
    private _filter;
    /**
     * true is the state has been detached or deleted
     * @private
     */
    private _detached;
    _promiseStore: PromiseStore;
    /** @private */
    private _parameters;
    /** @private */
    private _onUpdateCallbacks;
    /** @private */
    private _onDetachCallbacks;
    /** @private */
    private _onDeleteCallbacks;
    /**
     * Id of the state
     * @type {Number}
     * @readonly
     */
    readonly get id(): number;
    /**
     * Unique id of the state for the current node
     * @readonly
     * @type {Number}
     * @private
     */
    private readonly get remoteId();
    /**
     * Name of the schema
     * @type {String}
     * @readonly
     */
    readonly get schemaName(): string;
    /**
     * Indicates if the node is the owner of the state
     * @type {Boolean}
     * @readonly
     */
    readonly get isOwner(): boolean;
    /** @private */
    private _clearTransport;
    /** @private */
    private _commit;
    /**
     * Update values of the state.
     *
     * The returned `Promise` resolves on the applied updates, when all the `onUpdate`
     * callbacks have resolved themselves, i.e.:
     *
     * ```js
     * server.stateManager.registerSchema('test', {
     *   myBool: { type: 'boolean', default: false },
     * });
     * const a = await server.stateManager.create('a');
     * let asyncCallbackCalled = false;
     *
     * a.onUpdate(updates => {
     *   return new Promise(resolve => {
     *     setTimeout(() => {
     *       asyncCallbackCalled = true;
     *       resolve();
     *     }, 100);
     *   });
     * });
     *
     * const updates = await a.set({ myBool: true });
     * assert.equal(asyncCallbackCalled, true);
     * assert.deepEqual(updates, { myBool: true });
     * ```
     *
     * @param {object} updates - key / value pairs of updates to apply to the state.
     * @param {mixed} [context=null] - optionnal contextual object that will be propagated
     *   alongside the updates of the state. The context is valid only for the
     *   current call and will be passed as third argument to all update listeners.
     * @returns {Promise<Object>} A promise to the (coerced) updates.
     * @example
     * const state = await client.state.attach('globals');
     * const updates = await state.set({ myParam: Math.random() });
     */
    set(updates: object, context?: mixed): Promise<any>;
    /**
     * Get the value of a parameter of the state. If the parameter is of `any` type,
     * a deep copy is returned.
     *
     * @param {string} name - Name of the param.
     * @throws Throws if `name` does not correspond to an existing field
     *  of the state.
     * @return {mixed}
     * @example
     * const value = state.get('paramName');
     */
    get(name: string): mixed;
    /**
     * Similar to `get` but returns a reference to the underlying value in case of
     * `any` type. May be usefull if the underlying value is big (e.g. sensors
     * recordings, etc.) and deep cloning expensive. Be aware that if changes are
     * made on the returned object, the state of your application will become
     * inconsistent.
     *
     * @param {string} name - Name of the param.
     * @throws Throws if `name` does not correspond to an existing field
     *  of the state.
     * @return {mixed}
     * @example
     * const value = state.getUnsafe('paramName');
     */
    getUnsafe(name: string): mixed;
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
     * case of `any` type. May be usefull if the underlying value is big (e.g.
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
     * Definition of schema from which the state has been created.
     *
     * @param {string} [name=null] - If given, returns only the definition
     *  corresponding to the given param name.
     * @throws Throws if `name` does not correspond to an existing field
     *  of the schema.
     * @return {object}
     * @example
     * const schema = state.getSchema();
     */
    getSchema(name?: string): object;
    /**
     * Get the values with which the state has been created. May defer from the
     * default values declared in the schema.
     *
     * @return {object}
     * @example
     * const initValues = state.getInitValues();
     */
    getInitValues(): object;
    /**
     * Get the default values as declared in the schema.
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
     * callback triggered. The local `onDeatch` and `onDelete` callbacks will be
     * executed *before* the returned Promise resolves
     *
     * @throws Throws if the method is called by a node which is not the owner of
     * the state.
     * @example
     * const state = await client.state.create('my-schema-name');
     * // later
     * await state.delete();
     */
    delete(): Promise<any>;
    /**
     * Subscribe to state updates.
     *
     * @param {client.SharedState~onUpdateCallback|server.SharedState~onUpdateCallback} callback
     *  Callback to execute when an update is applied on the state.
     * @param {Boolean} [executeListener=false] - Execute the callback immediately
     *  with current state values. (`oldValues` will be set to `{}`, and `context` to `null`)
     * @returns {client.SharedState~deleteOnUpdateCallback|server.SharedState~deleteOnUpdateCallback}
     * @example
     * const unsubscribe = state.onUpdate(async (newValues, oldValues, context) =>  {
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
    onUpdate(listener: any, executeListener?: boolean): client.SharedState;
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
}
import PromiseStore from './PromiseStore.js';
//# sourceMappingURL=BaseSharedState.d.ts.map