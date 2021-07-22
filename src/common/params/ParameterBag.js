import types from './types';

/**
 * Generic class for typed parameters.
 *
 * @param {String} name - Name of the parameter.
 * @param {Array} definitionTemplate - List of mandatory keys in the param
 *  definition.
 * @param {Function} typeCheckFunction - Function to be used in order to check
 *  the value against the param definition.
 * @param {Object} definition - Definition of the parameter.
 * @param {Mixed} value - Value of the parameter.
 * @private
 */
class Param {
  constructor(name, definitionTemplate, typeCheckFunction, definition, value) {
    definitionTemplate.forEach(function(key) {
      if (definition.hasOwnProperty(key) === false)
        throw new Error(`Invalid definition for param "${name}", ${key} is not defined`);
    });

    this.name = name;
    this.type = definition.type;
    this.definition = definition;

    if (this.definition.nullable === true && value === null) {
      this.value = null;
    } else {
      this.value = typeCheckFunction(value, definition, name);
    }

    this._typeCheckFunction = typeCheckFunction;
  }

  /**
   * Returns the current value.
   * @return {Mixed}
   */
  getValue() {
    return this.value;
  }

  /**
   * Update the current value.
   * @param {Mixed} value - New value of the parameter.
   * @return {Boolean} - `true` if the param has been updated, false otherwise
   *  (e.g. if the parameter already had this value).
   */
  setValue(value) {
    if (this.definition.constant === true) {
      throw new Error(`Invalid assignement to constant param "${this.name}"`);
    }

    if (!(this.definition.nullable === true && value === null)) {
      value = this._typeCheckFunction(value, this.definition, this.name);
    }

    if (this.value !== value) {
      this.value = value;
      return true;
    }

    return false;
  }
}


/**
 * Bag of parameters. Main interface of the library
 * @private
 */
class ParameterBag {
  static validateSchema(schema) {
    for (let name in schema) {
      const def = schema[name];

      if (!def.hasOwnProperty('type')) {
        throw new TypeError(`[schema] Invalid definition for param "${name}": "type" key is required`);
      }

      if (!types.hasOwnProperty(def.type)) {
        throw new TypeError(`[schema] Invalid definition for param "${name}": "{ type: ${def.type} }" does not exists`);
      }

      const required = types[def.type].required;

      required.forEach(function(key) {
        if (!def.hasOwnProperty(key)) {
          throw new Error(`[schema] Invalid definition for param "${name}" of type: "${def.type}": "${key}" key is required`);
        }
      });
    }
  }

  constructor(schema, initValues) {

    /**
     * List of parameters.
     *
     * @type {Object<String, Param>}
     * @name _params
     * @memberof ParameterBag
     * @instance
     * @private
     */
    this._params = {};

    /**
     * List of schema with init values.
     *
     * @type {Object<String, paramDefinition>}
     * @name _schema
     * @memberof ParameterBag
     * @instance
     * @private
     */
    this._schema = schema;

    for (let name in initValues) {
      if (schema.hasOwnProperty(name) === false) {
        throw new Error(`Unknown param "${name}"`);
      }
    }

    for (let name in schema) {
      if (this._params.hasOwnProperty(name) === true) {
        throw new Error(`Parameter "${name}" already defined`);
      }

      const definition = schema[name];

      if (!paramTemplates[definition.type]) {
        throw new Error(`Unknown param type "${definition.type}"`);
      }

      const {
        definitionTemplate,
        typeCheckFunction
      } = paramTemplates[definition.type];

      // if event property is set to true, the param must
      // be nullable and its default value is `undefined`
      if (definition.event === true) {
        definition.nullable = true;
        definition.default = null;
      }

      let initValue;

      if (initValues.hasOwnProperty(name) === true) {
        initValue = initValues[name];
      } else {
        initValue = definition.default;
      }

      // store init value in definition
      definition.initValue = initValue;

      this._params[name] = new Param(name, definitionTemplate, typeCheckFunction, definition, value);
    }
  }

  /**
   * Return the given schema along with the initialization values.
   *
   * @return {Object}
   */
  getschema(name = null) {
    if (name !== null) {
      return this._schema[name];
    } else {
      return this._schema;
    }
  }

  /**
   * Return values of all parameters as a flat object.
   *
   * @return {Object}
   */
  getValues() {
    const values = {};

    for (let name in this._params) {
      values[name] = this._params[name].value;
    }

    return values;
  }

  /**
   * Return the value of the given parameter.
   *
   * @param {String} name - Name of the parameter.
   * @return {Mixed} - Value of the parameter.
   */
  get(name) {
    if (!this._params[name])
      throw new Error(`Cannot read property value of undefined parameter "${name}"`);

    return this._params[name].value;
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
   * @return {Mixed} - New value of the parameter.
   */
  set(name, value, forcePropagation = false) {
    const param = this._params[name];
    const updated = param.setValue(value);
    value = param.getValue();

    if (param.definition.event === true) {
      param.setValue(null);
    }

    if (updated || forcePropagation) {
      const metas = param.definition.metas;
      // trigger global listeners
      for (let listener of this._globalListeners) {
        listener(name, value, metas);
      }

      // trigger param listeners
      for (let listener of this._paramsListeners[name]) {
        listener(value, metas);
      }
    }

    return value;
  }

  /**
   * Define if the `name` parameter exists or not.
   *
   * @param {String} name - Name of the parameter.
   * @return {Boolean}
   */
  has(name) {
    return this._params.hasOwnProperty(name);
  }

  /**
   * Reset a parameter to its init value. Reset all parameters if no argument.
   *
   * @param {String} [name=null] - Name of the parameter to reset.
   */
  reset(name = null) {
    if (name !== null) {
      this._params[name].reset();
    } else {
      for (let name in this.params) {
        this._params[name].reset();
      }
    }
  }


  getSchema(name = null) {

  }

  // return the default value, if initValue has been given, return init values
  getDefaults(name = null) {

  }
}

export default ParameterBag;
