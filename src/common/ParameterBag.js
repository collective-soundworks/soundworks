import cloneDeep from 'lodash.clonedeep';
import equal from 'fast-deep-equal';

export const sharedOptions = {
  nullable: false,
  event: false, // if event=true, nullable=true
  metas: {},
  filterChange: true,
  immediate: false,
};

export const types = {
  boolean: {
    required: ['default'],
    get defaultOptions() {
      return Object.assign(cloneDeep(sharedOptions), {});
    },
    coerceFunction: (name, def, value) => {
      if (typeof value !== 'boolean') {
        throw new TypeError(`[SharedState] Invalid value "${value}" for boolean parameter "${name}"`);
      }

      return value;
    },
  },
  string: {
    required: ['default'],
    get defaultOptions() {
      return Object.assign(cloneDeep(sharedOptions), {});
    },
    coerceFunction: (name, def, value) => {
      if (typeof value !== 'string') {
        throw new TypeError(`[SharedState] Invalid value "${value}" for string parameter "${name}"`);
      }

      return value;
    },
  },
  integer: {
    required: ['default'],
    get defaultOptions() {
      return Object.assign(cloneDeep(sharedOptions), {
        min: -Infinity,
        max: +Infinity,
      });
    },
    sanitizeSchema: (def) => {
      // sanitize `null` values in received schema, this prevent a bug when
      // `min` and `max` are explicitely set to `±Infinity`, the schema is stringified
      // when sent over the network and therefore Infinity is transformed to `null`
      //
      // JSON.parse({ a: Infinity });
      // > { "a": null }
      if (def.min === null) {
        def.min = -Infinity;
      }

      if (def.max === null) {
        def.max = Infinity;
      }

      return def;
    },
    coerceFunction: (name, def, value) => {
      if (!(typeof value === 'number' && Math.floor(value) === value)) {
        throw new TypeError(`[SharedState] Invalid value "${value}" for integer parameter "${name}"`);
      }

      return Math.max(def.min, Math.min(def.max, value));
    },
  },
  float: {
    required: ['default'],
    get defaultOptions() {
      return Object.assign(cloneDeep(sharedOptions), {
        min: -Infinity,
        max: +Infinity,
      });
    },
    sanitizeSchema: (def) => {
      // sanitize `null` values in received schema, this prevent a bug when
      // `min` and `max` are explicitely set to `±Infinity`, the schema is stringified
      // when sent over the network and therefore Infinity is transformed to `null`
      //
      // JSON.parse({ a: Infinity });
      // > { "a": null }
      if (def.min === null) {
        def.min = -Infinity;
      }

      if (def.max === null) {
        def.max = Infinity;
      }

      return def;
    },
    coerceFunction: (name, def, value) => {
      if (typeof value !== 'number' || value !== value) { // reject NaN
        throw new TypeError(`[SharedState] Invalid value "${value}" for float parameter "${name}"`);
      }

      return Math.max(def.min, Math.min(def.max, value));
    },
  },
  enum: {
    required: ['default', 'list'],
    get defaultOptions() {
      return Object.assign(cloneDeep(sharedOptions), {});
    },
    coerceFunction: (name, def, value) => {
      if (def.list.indexOf(value) === -1) {
        throw new TypeError(`[SharedState] Invalid value "${value}" for enum parameter "${name}"`);
      }


      return value;
    },
  },
  any: {
    required: ['default'],
    get defaultOptions() {
      return Object.assign(cloneDeep(sharedOptions), {});
    },
    coerceFunction: (name, def, value) => {
      // no check as it can have any type...
      return value;
    },
  },
};


/**
 * Bag of parameters.
 * @private
 */
class ParameterBag {
  static validateSchema(schema) {
    for (let name in schema) {
      const def = schema[name];

      if (!Object.prototype.hasOwnProperty.call(def, 'type')) {
        throw new TypeError(`[StateManager.registerSchema] Invalid schema definition - param "${name}": "type" key is required`);
      }

      if (!Object.prototype.hasOwnProperty.call(types, def.type)) {
        throw new TypeError(`[StateManager.registerSchema] Invalid schema definition - param "${name}": "{ type: '${def.type}' }" does not exists`);
      }

      const required = types[def.type].required;

      required.forEach(key => {
        if (def.event === true && key === 'default') {
          // do nothing, default is always null for `event` params
        } else if (!Object.prototype.hasOwnProperty.call(def, key)) {
          throw new TypeError(`[StateManager.registerSchema] Invalid schema definition - param "${name}" (type "${def.type}"): "${key}" key is required`);
        }
      });
    }
  }

  constructor(schema, initValues = {}) {
    if (!schema) {
      throw new Error(`[ParameterBag] schema is mandatory`);
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
      if (!Object.prototype.hasOwnProperty.call(schema, name)) {
        throw new ReferenceError(`[StateManager.create] init value defined for undefined param "${name}"`);
      }
    }

    for (let [name, def] of Object.entries(schema)) {
      if (types[def.type].sanitizeSchema) {
        def = types[def.type].sanitizeSchema(def);
      }

      const { defaultOptions } = types[def.type];
      def = Object.assign({}, defaultOptions, def);
      // if event property is set to true, the param must
      // be nullable and its default value is `undefined`
      if (def.event === true) {
        def.nullable = true;
        def.default = null;
      }

      let initValue;

      if (Object.prototype.hasOwnProperty.call(initValues, name)) {
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
   * @param {string} name - Name of the parameter.
   * @return {Boolean}
   */
  has(name) {
    return Object.prototype.hasOwnProperty.call(this._schema, name);
  }

  /**
   * Return values of all parameters as a flat object. If a parameter is of `any`
   * type, a deep copy is made.
   *
   * @return {object}
   */
  getValues() {
    let values = {};

    for (let name in this._values) {
      values[name] = this.get(name);
    }

    return values;
  }

  /**
   * Return values of all parameters as a flat object. Similar to `getValues` but
   * returns a reference to the underlying value in case of `any` type. May be
   * usefull if the underlying value is big (e.g. sensors recordings, etc.) and
   * deep cloning expensive. Be aware that if changes are made on the returned
   * object, the state of your application will become inconsistent.
   *
   * @return {object}
   */
  getValuesUnsafe() {
    let values = {};

    for (let name in this._values) {
      values[name] = this.getUnsafe(name);
    }

    return values;
  }

  /**
   * Return the value of the given parameter. If the parameter is of `any` type,
   * a deep copy is returned.
   *
   * @param {string} name - Name of the parameter.
   * @return {Mixed} - Value of the parameter.
   */
  get(name) {
    if (!this.has(name)) {
      throw new ReferenceError(`[SharedState] Cannot get value of undefined parameter "${name}"`);
    }

    if (this._schema[name].type === 'any') {
      // we return a deep copy of the object as we don't want the client code to
      // be able to modify our underlying data.
      return cloneDeep(this._values[name]);
    } else {
      return this._values[name];
    }
  }

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
  getUnsafe(name) {
    if (!this.has(name)) {
      throw new ReferenceError(`[SharedState] Cannot get value of undefined parameter "${name}"`);
    }

    return this._values[name];
  }

  /**
   * Check that the value is valid according to the schema and return it coerced
   * to the schema definition
   *
   * @param {String} name - Name of the parameter.
   * @param {Mixed} value - Value of the parameter.
   */
  coerceValue(name, value) {
    if (!this.has(name)) {
      throw new ReferenceError(`[SharedState] Cannot set value of undefined parameter "${name}"`);
    }

    const def = this._schema[name];

    if (value === null && def.nullable === false) {
      throw new TypeError(`[SharedState] Invalid value for ${def.type} param "${name}": value is null and param is not nullable`);
    } else if (value === null && def.nullable === true) {
      value = null;
    } else {
      const { coerceFunction } = types[def.type];
      value = coerceFunction(name, def, value);
    }

    return value;
  }

  /**
   * Set the value of a parameter. If the value of the parameter is updated
   * (aka if previous value is different from new value) all registered
   * callbacks are registered.
   *
   * @param {string} name - Name of the parameter.
   * @param {Mixed} value - Value of the parameter.
   * @return {Array} - [new value, updated flag].
   */
  set(name, value) {
    value = this.coerceValue(name, value);
    const currentValue = this._values[name];
    const updated = !equal(currentValue, value);

    // we store a deep copy of the object as we don't want the client to be able
    // to modify our underlying data, which leads to unexpected behavior where the
    // deep equal check to returns true, and therefore the update is not triggered.
    // @see tests/common.state-manager.spec.js
    // 'should copy stored value for "any" type to have a predictable behavior'
    if (this._schema[name].type === 'any') {
      value = cloneDeep(value);
    }

    this._values[name] = value;

    // return tuple so that the state manager can handle the `filterChange` option
    return [value, updated];
  }

  /**
   * Reset a parameter to its initialization values. Reset all parameters if no argument.
   * @note - prefer `state.set(state.getInitValues())`
   *         or     `state.set(state.getDefaultValues())`
   *
   * @param {string} [name=null] - Name of the parameter to reset.
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
   * @return {object}
   */
  getSchema(name = null) {
    if (name === null) {
      return this._schema;
    } else {
      if (!this.has(name)) {
        throw new ReferenceError(`[SharedState] Cannot get schema description of undefined parameter "${name}"`);
      }

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
