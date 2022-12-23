export namespace sharedOptions {
    const nullable: boolean;
    const event: boolean;
    const metas: {};
    const filterChange: boolean;
    const immediate: boolean;
}
export namespace types {
    export namespace boolean {
        const required: string[];
        function coerceFunction(name: any, def: any, value: any): boolean;
    }
    export namespace string {
        const required_1: string[];
        export { required_1 as required };
        export function coerceFunction_1(name: any, def: any, value: any): string;
        export { coerceFunction_1 as coerceFunction };
    }
    export namespace integer {
        const required_2: string[];
        export { required_2 as required };
        export function sanitizeSchema(def: any): any;
        export function coerceFunction_2(name: any, def: any, value: any): number;
        export { coerceFunction_2 as coerceFunction };
    }
    export namespace float {
        const required_3: string[];
        export { required_3 as required };
        export function sanitizeSchema_1(def: any): any;
        export { sanitizeSchema_1 as sanitizeSchema };
        export function coerceFunction_3(name: any, def: any, value: any): number;
        export { coerceFunction_3 as coerceFunction };
    }
    export namespace _enum {
        const required_4: string[];
        export { required_4 as required };
        export function coerceFunction_4(name: any, def: any, value: any): any;
        export { coerceFunction_4 as coerceFunction };
    }
    export { _enum as enum };
    export namespace any {
        const required_5: string[];
        export { required_5 as required };
        export function coerceFunction_5(name: any, def: any, value: any): any;
        export { coerceFunction_5 as coerceFunction };
    }
}
export default ParameterBag;
export namespace server {
    /**
     * ~schema
     *
     * Description of a schema to be register by the {@link server.ServerStateManagerServer }
     * A schema consists of a combinaison of key value pairs where the key is the
     * name of the parameter, and the value is an object describing the parameter.
     *
     * Available types are:
     * - {@link server.SharedStateManagerServer ~schemaBooleanDef}
     * - {@link server.SharedStateManagerServer ~schemaStringDef}
     * - {@link server.SharedStateManagerServer ~schemaIntegerDef}
     * - {@link server.SharedStateManagerServer ~schemaFloatDef}
     * - {@link server.SharedStateManagerServer ~schemaEnumDef}
     * - {@link server.SharedStateManagerServer ~schemaAnyDef}
     */
    type SharedStateManagerServer = any;
}
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
     * @param {String} name - Name of the parameter.
     * @return {Boolean}
     */
    has(name: string): boolean;
    /**
     * Return values of all parameters as a flat object.
     *
     * @return {Object}
     */
    getValues(): any;
    /**
     * Return the value of the given parameter. If the parameter is of `any` type,
     * a deep copy is returned.
     *
     * @param {String} name - Name of the parameter.
     * @return {Mixed} - Value of the parameter.
     */
    get(name: string): Mixed;
    /**
     * Set the value of a parameter. If the value of the parameter is updated
     * (aka if previous value is different from new value) all registered
     * callbacks are registered.
     *
     * @param {String} name - Name of the parameter.
     * @param {Mixed} value - Value of the parameter.
     * @param {Boolean} [forcePropagation=false] - if true, propagate value even
     *    if the value has not changed.
     * @return {Array} - [new value, updated flag].
     */
    set(name: string, value: Mixed): any[];
    /**
     * Reset a parameter to its initialization values. Reset all parameters if no argument.
     * @note - prefer `state.set(state.getInitValues())`
     *         or     `state.set(state.getDefaultValues())`
     *
     * @param {String} [name=null] - Name of the parameter to reset.
     */
    /**
     * Return the given schema along with the initialization values.
     *
     * @return {Object}
     */
    getSchema(name?: any): any;
    getInitValues(): {};
    getDefaults(): {};
}
//# sourceMappingURL=ParameterBag.d.ts.map