import types from './types';
import cloneDeep from 'lodash.cloneDeep';
import equal from 'fast-deep-equal';

/**
 * Generic class for typed parameters.
 *
 * @param {String} name - Name of the parameter.
 * @param {Array} definitionTemplate - List of mandatory keys in the param
 *  definition.
 * @param {Function} coerceFunction - Function that coerce the type of the
 *  parameter.
 * @param {Object} def - Definition of the parameter.
 * @param {Mixed} value - Value of the parameter.
 * @private
 */
// export class Param {
//   // new Param(name, coerceFunction, def, initValue)
//   constructor(name, coerceFunction, def, initValue) {
//     this.name = name;
//     this.def = def;
//     this.coerce = coerceFunction;

//     this.set(initValue);
//   }

//   /**
//    * Get current value.
//    *
//    * @return {Mixed}
//    */
//   get() {
//     return this.value;
//   }

//   *
//    * Update current value.
//    *
//    * @param {Mixed} value - New value of the parameter.
//    * @return {Boolean} - `true` if the param has been updated, `false` otherwise.

//   set(value) {
//     if (value === null && this.def.nullable === false) {
//       throw new TypeError(`[stateManager] Invalid value for ${this.def.type} param "${this.name}": value is null and param is not nullable`);
//     } else if (value === null && this.def.nullable === true) {
//       value = value;
//     } else {
//       value = this.coerce(this.name, this.def, value);
//     }

//     const changed = (this.value !== value);
//     this.value = value;

//     return changed;
//   }
// }

/**
 * Bag of parameters.
 * @private
 */
class ParameterBag {
  static validateSchema(schema) {
    for (let name in schema) {
      const def = schema[name];

      if (!def.hasOwnProperty('type')) {
        throw new TypeError(`[stateManager] Invalid schema definition - param "${name}": "type" key is required`);
      }

      if (!types.hasOwnProperty(def.type)) {
        throw new TypeError(`[stateManager] Invalid schema definition - param "${name}": "{ type: '${def.type}' }" does not exists`);
      }

      const required = types[def.type].required;

      required.forEach(function(key) {
        if (def.event === true && key === 'default') {
          // do nothing, default is always null for `event` params
        } else if (!def.hasOwnProperty(key)) {
          throw new TypeError(`[stateManager] Invalid schema definition - param "${name}" (type "${def.type}"): "${key}" key is required`);
        }
      });
    }
  }

  constructor(schema, initValues = {}) {
    if (!schema) {
      throw new Error(`[stateManager] schema is mandatory`);
    }

    schema = cloneDeep(schema);
    initValues = cloneDeep(initValues);

    /**
     * List of parameters.
     *
     * @type {Object<String, Param>}
     * @name _params
     * @memberof ParameterBag
     * @instance
     * @private
     */
    this._values = {};

    /**
     * List of schema with init values.
     *
     * @type {Object<String, paramDefinition>}
     * @name _schema
     * @memberof ParameterBag
     * @instance
     * @private
     */
    this._schema = {};

    ParameterBag.validateSchema(schema);

    // make shure initValues make sens according to the given schema
    for (let name in initValues) {
      if (!schema.hasOwnProperty(name)) {
        throw new ReferenceError(`[stateManager] init value defined for undefined param "${name}"`);
      }
    }

    for (let [name, def] of Object.entries(schema)) {
      const {
        defaultOptions,
        coerceFunction
      } = types[def.type];

      def = Object.assign({}, defaultOptions, def);
      // if event property is set to true, the param must
      // be nullable and its default value is `undefined`
      if (def.event === true) {
        def.nullable = true;
        def.default = null;
      }

      let initValue;

      if (initValues.hasOwnProperty(name)) {
        initValue = initValues[name];
      } else {
        initValue = def.default;
      }


      this._schema[name] = def;
      // coerce init value and store in definition
      initValue = this.set(name, initValue)[0];

      this._schema[name].initValue = initValue;
      this._values[name] = initValue;

    }
  }

  /**
   * Define if the parameter exists.
   *
   * @param {String} name - Name of the parameter.
   * @return {Boolean}
   */
  has(name) {
    return this._schema.hasOwnProperty(name);
  }

  /**
   * Return values of all parameters as a flat object.
   *
   * @return {Object}
   */
  getValues() {
    return Object.assign({}, this._values);
  }

  /**
   * Return the value of the given parameter.
   *
   * @param {String} name - Name of the parameter.
   * @return {Mixed} - Value of the parameter.
   */
  get(name) {
    if (!this.has(name)) {
      throw new ReferenceError(`[stateManager] Cannot get value of undefined parameter "${name}"`);
    }

    return this._values[name];
  }

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
  set(name, value) {
    if (!this.has(name)) {
      throw new ReferenceError(`[stateManager] Cannot set value of undefined parameter "${name}"`);
    }

    const def = this._schema[name];
    const { coerceFunction } = types[def.type];

    if (value === null && def.nullable === false) {
      throw new TypeError(`[stateManager] Invalid value for ${def.type} param "${name}": value is null and param is not nullable`);
    } else if (value === null && def.nullable === true) {
      value = value;
    } else {
      value = coerceFunction(name, def, value);
    }

    const currentValue = this._values[name];
    const updated = !equal(currentValue, value);
    this._values[name] = value;

    if (def.event === true) {
      this._values[name] = null;
    }

    // return tuple so that the state manager can handle the `filterChange` option
    return [value, updated];
  }

  /**
   * Reset a parameter to its init value. Reset all parameters if no argument.
   *
   * @param {String} [name=null] - Name of the parameter to reset.
   */
  // reset(name = null) {
  //   if (name !== null) {
  //     this._params[name] = this._initValues[name];
  //   } else {
  //     for (let name in this.params) {
  //       this._params[name].reset();
  //     }
  //   }
  // }


  /**
   * Return the given schema along with the initialization values.
   *
   * @return {Object}
   */
  getSchema(name = null) {
    if (name === null) {
      return this._schema;
    } else {
      return this._schema[name];
    }
  }

  // return the default value, if initValue has been given, return init values
  getInitValues() {
    const initValues = {};
    for (let [name, def] of Object.entries(this._schema)) {
      initValues[name] = def.initValue;
    }
    return initValues;
  }

    // return the default value, if initValue has been given, return init values
  getDefaults() {
    const defaults = {};
    for (let [name, def] of Object.entries(this._schema)) {
      defaults[name] = def.defaults;
    }
    return defaults;
  }
}

export default ParameterBag;
