export default SharedState;
/**
 * Representation of a shared state.
 *
 * @memberof server
 *
 * @see {server.StateManager}
 */
/**
 * Representation of a shared state.
 *
 * @memberof client
 *
 * @see {client.StateManager}
 */
declare class SharedState {
    constructor(id: any, remoteId: any, schemaName: any, schema: any, client: any, isOwner: any, manager: any, initValues?: {});
    id: any;
    remoteId: any;
    schemaName: any;
    _isOwner: any;
    _client: any;
    _manager: any;
    _parameters: ParameterBag;
    _onUpdateCallbacks: Set<any>;
    _onDetachCallbacks: Set<any>;
    _onDeleteCallbacks: Set<any>;
    _clearDetach(): void;
    /**
     * Detach from the state. If the client is the creator of the state, the state
     * is deleted and all attached nodes get notified
     *
     * @async
     * @see {common.SharedState#onDetach}
     * @see {common.SharedState#onDelete}
     * @see {client.SharedStateManagerClient#create}
     * @see {server.SharedStateManagerClient#create}
     * @see {client.SharedStateManagerClient#attach}
     * @see {server.SharedStateManagerClient#attach}
     */
    detach(): Promise<any>;
    _clearTransport(): void;
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
     * @async
     * @param {Object} updates - key / value pairs of updates to apply to the state.
     * @param {Mixed} [context=null] - optionnal contextual object that will be propagated
     *   alongside the updates of the state. The context is valid only for the
     *   current call and will be passed as third argument to all update listeners.
     * @return {Promise<Object>} A promise to the (coerced) updates.
     *
     * @see {common.SharedState~updateCallback}
     */
    set(updates: any, context?: Mixed): Promise<any>;
    /**
     * Get a value of the state by its name
     *
     * @param {String} name - Name of the param. Throws an error if the name is invalid.
     * @return {Mixed}
     */
    get(name: string): Mixed;
    /**
     * Get a all the key / value pairs of the state.
     *
     * @return {Object}
     */
    getValues(): any;
    /**
     * Get the schema that describes the state.
     *
     * @param {String} [name=null] - If given, returns only the definition
     *  of the given param name. Throws an error if the name is invalid.
     * @return {Object}
     */
    getSchema(name?: string): any;
    /**
     * Get the values with which the state has been initialized.
     *
     * @return {Object}
     */
    getInitValues(): any;
    /**
     * Get the default values that has been declared in the schema.
     *
     * @return {Object}
     */
    getDefaults(): any;
    /**
     * Delete the state. Only the creator/owner of the state (i.e. a state created using
     * `create`) can use this method. If a non-owner call this method (i.e. a
     * state created using `attach`), an error will be thrown.
     *
     * @async
     * @see {common.SharedState#onDetach}
     * @see {common.SharedState#onDelete}
     * @see {client.SharedStateManagerClient#create}
     * @see {server.SharedStateManagerClient#create}
     * @see {client.SharedStateManagerClient#attach}
     * @see {server.SharedStateManagerClient#attach}
     */
    delete(): Promise<any>;
    /**
     * @callback common.SharedState~updateCallback
     * @param {Object} newValues - key / value pairs of the updates that have been
     *  applied to the state.
     * @param {Object} oldValues - key / value pairs of the updated params before
     *  the updates has been applied to the state.
     * @param {Mixed} [context=null] - Optionnal context object that has been passed
     *  with the values updates in the `set` call.
     *
     * @example
     * state.onUpdate(async (newValues, oldValues[, context=null]) =>  {
     *   for (let [key, value] of Object.entries(newValues)) {
     *      switch (key) {
     *        // do something
     *      }
     *   }
     * });
     *
     * @see {common.SharedState#set}
     * @see {common.SharedState#onUpdate}
     */
    /**
     * Subscribe to state updates
     *
     * @param {common.SharedState~updateCallback} callback - callback to execute
     *  when an update is applied on the state.
     * @param {Boolean} [executeListener=false] - execute the given callback immediately
     *  with current state values. (`oldValues` will be set to `{}`, and `context` to `null`)
     *
     * @example
     * state.onUpdate(async (newValues, oldValues) =>  {
     *   for (let [key, value] of Object.entries(newValues)) {
     *      switch (key) {
     *        // do something
     *      }
     *   }
     * });
     */
    onUpdate(listener: any, executeListener?: boolean): () => void;
    /**
     * Register a function to execute when detaching from the state
     *
     * @param {Function} callback - callback to execute when detaching from the state.
     *   wether the client as called `detach`, or the state has been deleted by its
     *   creator.
     */
    onDetach(callback: Function): () => boolean;
    /**
     * Register a function to execute when the state is deleted. Only called if the
     * node was the creator of the state. Is called after `onDetach`
     *
     * @param {Function} callback - callback to execute when the state is deleted.
     */
    onDelete(callback: Function): () => boolean;
}
import ParameterBag from "./ParameterBag.js";
//# sourceMappingURL=SharedState.d.ts.map