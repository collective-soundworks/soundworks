export namespace sharedOptions {
    let nullable: boolean;
    let event: boolean;
    let metas: {};
    let filterChange: boolean;
    let immediate: boolean;
}
export namespace types {
    export namespace boolean {
        let required: string[];
        const defaultOptions: any;
        function coerceFunction(name: any, def: any, value: any): boolean;
    }
    export namespace string {
        let required_1: string[];
        export { required_1 as required };
        const defaultOptions_1: any;
        export { defaultOptions_1 as defaultOptions };
        export function coerceFunction_1(name: any, def: any, value: any): string;
        export { coerceFunction_1 as coerceFunction };
    }
    export namespace integer {
        let required_2: string[];
        export { required_2 as required };
        const defaultOptions_2: any;
        export { defaultOptions_2 as defaultOptions };
        export function sanitizeSchema(def: any): any;
        export function coerceFunction_2(name: any, def: any, value: any): number;
        export { coerceFunction_2 as coerceFunction };
    }
    export namespace float {
        let required_3: string[];
        export { required_3 as required };
        const defaultOptions_3: any;
        export { defaultOptions_3 as defaultOptions };
        export function sanitizeSchema_1(def: any): any;
        export { sanitizeSchema_1 as sanitizeSchema };
        export function coerceFunction_3(name: any, def: any, value: any): number;
        export { coerceFunction_3 as coerceFunction };
    }
    export namespace _enum {
        let required_4: string[];
        export { required_4 as required };
        const defaultOptions_4: any;
        export { defaultOptions_4 as defaultOptions };
        export function coerceFunction_4(name: any, def: any, value: any): any;
        export { coerceFunction_4 as coerceFunction };
    }
    export { _enum as enum };
    export namespace any {
        let required_5: string[];
        export { required_5 as required };
        const defaultOptions_5: any;
        export { defaultOptions_5 as defaultOptions };
        export function coerceFunction_5(name: any, def: any, value: any): any;
        export { coerceFunction_5 as coerceFunction };
    }
}
export default ParameterBag;
/**
 * Bag of parameters.
 * @private
 */
declare class ParameterBag {
    static validateSchema(schema: any): void;
    constructor(schema: any, initValues?: {});
    /**
     * List of parameters.
     *
     * @type {Object<String, Param>}
     * @name _params
     * @memberof ParameterBag
     * @instance
     * @private
     */
    private _values;
    /**
     * List of schema with init values.
     *
     * @type {Object<String, paramDefinition>}
     * @name _schema
     * @memberof ParameterBag
     * @instance
     * @private
     */
    private _schema;
    /**
     * Define if the parameter exists.
     *
     * @param {string} name - Name of the parameter.
     * @return {Boolean}
     */
    has(name: string): boolean;
    /**
     * Return values of all parameters as a flat object. If a parameter is of `any`
     * type, a deep copy is made.
     *
     * @return {object}
     */
    getValues(): object;
    /**
     * Return values of all parameters as a flat object. Similar to `getValues` but
     * returns a reference to the underlying value in case of `any` type. May be
     * usefull if the underlying value is big (e.g. sensors recordings, etc.) and
     * deep cloning expensive. Be aware that if changes are made on the returned
     * object, the state of your application will become inconsistent.
     *
     * @return {object}
     */
    getValuesUnsafe(): object;
    /**
     * Return the value of the given parameter. If the parameter is of `any` type,
     * a deep copy is returned.
     *
     * @param {string} name - Name of the parameter.
     * @return {Mixed} - Value of the parameter.
     */
    get(name: string): Mixed;
    /**
     * Similar to `get` but returns a reference to the underlying value in case of
     * `any` type. May be usefull if the underlying value is big (e.g. sensors
     * recordings, etc.) and deep cloning expensive. Be aware that if changes are
     * made on the returned object, the state of your application will become
     * inconsistent.
     *
     * @param {string} name - Name of the parameter.
     * @return {Mixed} - Value of the parameter.
     */
    getUnsafe(name: string): Mixed;
    /**
     * Check that the value is valid according to the schema and return it coerced
     * to the schema definition
     *
     * @param {String} name - Name of the parameter.
     * @param {Mixed} value - Value of the parameter.
     */
    coerceValue(name: string, value: Mixed): Mixed;
    /**
     * Set the value of a parameter. If the value of the parameter is updated
     * (aka if previous value is different from new value) all registered
     * callbacks are registered.
     *
     * @param {string} name - Name of the parameter.
     * @param {Mixed} value - Value of the parameter.
     * @return {Array} - [new value, updated flag].
     */
    set(name: string, value: Mixed): any[];
    /**
     * Reset a parameter to its initialization values. Reset all parameters if no argument.
     * @note - prefer `state.set(state.getInitValues())`
     *         or     `state.set(state.getDefaultValues())`
     *
     * @param {string} [name=null] - Name of the parameter to reset.
     */
    /**
     * Return the given schema along with the initialization values.
     *
     * @return {object}
     */
    getSchema(name?: any): object;
    getInitValues(): {};
    getDefaults(): {};
}
//# sourceMappingURL=ParameterBag.d.ts.map