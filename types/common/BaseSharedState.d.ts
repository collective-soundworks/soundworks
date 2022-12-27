export default BaseSharedState;
declare class BaseSharedState {
    constructor(id: any, remoteId: any, schemaName: any, schema: any, client: any, isOwner: any, manager: any, initValues?: {});
    id: any;
    remoteId: any;
    schemaName: any;
    /** @private */
    private _isOwner;
    /** @private */
    private _client;
    /** @private */
    private _manager;
    /** @private */
    private _parameters;
    /** @private */
    private _onUpdateCallbacks;
    /** @private */
    private _onDetachCallbacks;
    /** @private */
    private _onDeleteCallbacks;
    /** @private */
    private _clearDetach;
    /**
     * Detach from the state. If the client is the creator of the state, the state
     * is deleted and all attached nodes get notified
     */
    detach(): Promise<any>;
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
     */
    set(updates: object, context?: mixed): Promise<any>;
    /**
     * Get the value of a paramter of the state.
     *
     * @param {string} name - Name of the param.
     * @throws Throws if `name` does not correspond to an existing field
     *  of the state.
     * @return {mixed}
     */
    get(name: string): mixed;
    /**
     * Get all the key / value pairs of the state.
     *
     * @return {object}
     */
    getValues(): object;
    /**
     * Get the schema from which the state has been created.
     *
     * @param {string} [name=null] - If given, returns only the definition corresponding
     *  to the given param name.
     * @throws Throws if `name` does not correspond to an existing field
     *  of the state.
     * @return {object}
     */
    getSchema(name?: string): object;
    /**
     * Get the values with which the state has been created. May defer from the
     * default values declared in the schema.
     *
     * @return {Object}
     */
    getInitValues(): any;
    /**
     * Get the default values as declared in the schema.
     *
     * @return {Object}
     */
    getDefaults(): any;
    /**
     * Delete the state. Only the creator/owner of the state can use this method.
     *
     * @throws Throws if the method is called by a node which is not the owner of
     * the state.
     */
    delete(): Promise<any>;
    /**
     * @callback common.SharedState~updateCallback
     * @param {Object} newValues - Key / value pairs of the updates that have been
     *  applied to the state.
     * @param {Object} oldValues - Key / value pairs of the updated params before
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
     */
    /**
     * Subscribe to state updates.
     *
     * @param {common.SharedState~updateCallback} callback - Callback to execute
     *  when an update is applied on the state.
     * @param {Boolean} [executeListener=false] - Execute the given callback immediately
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
//# sourceMappingURL=BaseSharedState.d.ts.map