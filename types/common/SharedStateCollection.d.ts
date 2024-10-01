export default SharedStateCollection;
export type sharedStateCollectionOnUpdateCallback = (state: SharedState, newValues: any, oldValues: any, context?: Mixed) => any;
/**
 * @callback sharedStateCollectionOnUpdateCallback
 * @param {SharedState} state - State that triggered the update.
 * @param {Object} newValues - Key / value pairs of the updates that have been
 *  applied to the state.
 * @param {Object} oldValues - Key / value pairs of the updated params before
 *  the updates has been applied to the state.
 * @param {Mixed} [context=null] - Optionnal context object that has been passed
 *  with the values updates in the `set` call.
 */
/**
 * The `SharedStateCollection` interface represent a collection of all states
 * created from a given schema name on the network.
 *
 * It can optionnaly exclude the states created by the current node.
 *
 * See {@link ClientStateManager#getCollection} and
 * {@link ServerStateManager#getCollection} for factory methods API
 *
 * ```
 * const collection = await client.stateManager.getCollection('my-schema');
 * const allValues = collection.getValues();
 * collection.onUpdate((state, newValues, oldValues, context) => {
 *   // do something
 * });
 * ```
 * @hideconstructor
 */
declare class SharedStateCollection {
    constructor(stateManager: any, className: any, filter?: any, options?: {});
    /** @private */
    private _init;
    /**
     * Size of the collection, alias `size`
     * @type {number}
     * @readonly
     */
    readonly get length(): number;
    /**
     * Size of the collection, , alias `length`
     * @type {number}
     */
    get size(): number;
    /**
     * Name of the class from which the collection has been created.
     * @type {String}
     */
    get className(): string;
    /**
     * @deprecated Use ${@link SharedStateCollection#className} instead.
     */
    get schemaName(): string;
    /**
     * @deprecated Use {@link SharedStateCollection#getDescription} instead.
     */
    getSchema(paramName?: any): any;
    /**
     * Return the underlying {@link SharedStateClassDescription} or the
     * {@link SharedStateParameterDescription} if `paramName` is given.
     *
     * @param {string} [paramName=null] - If defined, returns the parameter
     *  description of the given parameter name rather than the full class description.
     * @return {SharedStateClassDescription|SharedStateParameterDescription}
     * @throws Throws if `paramName` is not null and does not exists.
     * @example
     * const classDescription = collection.getDescription();
     * const paramDescription = collection.getDescription('my-param');
     */
    getDescription(paramName?: string): SharedStateClassDescription | SharedStateParameterDescription;
    /**
     * Get the default values as declared in the schema.
     *
     * @return {object}
     * @example
     * const defaults = state.getDefaults();
     */
    getDefaults(): object;
    /**
     * Return the current values of all the states in the collection.
     * @return {Object[]}
     */
    getValues(): any[];
    /**
     * Return the current values of all the states in the collection.
     *
     * Similar to `getValues` but returns a reference to the underlying value in
     * case of `any` type. May be usefull if the underlying value is big (e.g.
     * sensors recordings, etc.) and deep cloning expensive. Be aware that if
     * changes are made on the returned object, the state of your application will
     * become inconsistent.
     *
     * @return {Object[]}
     */
    getValuesUnsafe(): any[];
    /**
     * Return the current param value of all the states in the collection.
     *
     * @param {String} name - Name of the parameter
     * @return {any[]}
     */
    get(name: string): any[];
    /**
     * Similar to `get` but returns a reference to the underlying value in case of
     * `any` type. May be usefull if the underlying value is big (e.g. sensors
     * recordings, etc.) and deep cloning expensive. Be aware that if changes are
     * made on the returned object, the state of your application will become
     * inconsistent.
     *
     * @param {String} name - Name of the parameter
     * @return {any[]}
     */
    getUnsafe(name: string): any[];
    /**
     * Update all states of the collection with given values.
     * @param {object} updates - key / value pairs of updates to apply to the state.
     * @param {mixed} [context=null] - optionnal contextual object that will be propagated
     *   alongside the updates of the state. The context is valid only for the
     *   current call and will be passed as third argument to all update listeners.
     */
    set(updates: object, context?: mixed): Promise<any[]>;
    /**
     * Subscribe to any state update of the collection.
     *
     * @param {sharedStateCollectionOnUpdateCallback}
     *  callback - Callback to execute when an update is applied on a state.
     * @param {Boolean} [executeListener=false] - Execute the callback immediately
     *  for all underlying states with current state values. (`oldValues` will be
     *  set to `{}`, and `context` to `null`)
     * @returns {Function} - Function that delete the registered listener.
     */
    onUpdate(callback: sharedStateCollectionOnUpdateCallback, executeListener?: boolean): Function;
    /**
     * Register a function to execute when a state is added to the collection.
     *
     * @param {Function} callback - callback to execute  when a state is added to
     *   the collection.
     * @param {Function} executeListener - execute the callback with the states
     *   already present in the collection.
     * @returns {Function} - Function that delete the registered listener.
     */
    onAttach(callback: Function, executeListener?: Function): Function;
    /**
     * Register a function to execute when a state is removed from the collection.
     *
     * @param {Function} callback - callback to execute  when a state is removed
     *   from the collection.
     * @returns {Function} - Function that delete the registered listener.
     */
    onDetach(callback: Function): Function;
    /**
     * Detach from the collection, i.e. detach all underlying shared states.
     * @type {number}
     */
    detach(): Promise<void>;
    /**
     * Execute the given function once for each states of the collection (see `Array.forEach`).
     *
     * @param {Function} func - A function to execute for each element in the array.
     *  Its return value is discarded.
     */
    forEach(func: Function): void;
    /**
     * Creates a new array populated with the results of calling a provided function
     * on every state of the collection (see `Array.map`).
     *
     * @param {Function} func - A function to execute for each element in the array.
     *  Its return value is added as a single element in the new array.
     */
    map(func: Function): any[];
    /**
     * Creates a shallow copy of a portion of the collection, filtered down to just
     * the estates that pass the test implemented by the provided function (see `Array.filter`).
     *
     * @param {Function} func - A function to execute for each element in the array.
     *  It should return a truthy to keep the element in the resulting array, and a f
     *  alsy value otherwise.
     */
    filter(func: Function): any[];
    /**
     * Sort the elements of the collection in place (see `Array.sort`).
     *
     * @param {Function} func - Function that defines the sort order.
     */
    sort(func: Function): void;
    /**
     * Returns the first element of the collection that satisfies the provided testing
     * function. If no values satisfy the testing function, undefined is returned.
     *
     * @param {Function} func - Function to execute for each element in the array.
     *  It should return a truthy value to indicate a matching element has been found.
     * @return {}
     */
    find(func: Function): any;
    /**
     * Iterable API, e.g. for use in `for .. of` loops
     */
    [Symbol.iterator](): {
        next: () => {
            value: any;
            done: boolean;
        };
    };
    #private;
}
