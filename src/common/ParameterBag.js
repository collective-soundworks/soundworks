// import types from './types';
import cloneDeep from 'lodash.clonedeep';
import equal from 'fast-deep-equal';


/**
 * @typedef {Object} server.SharedStateManagerServer~schema
 *
 * Description of a schema to be register by the {@link server.ServerStateManagerServer}
 * A schema consists of a combinaison of key value pairs where the key is the
 * name of the parameter, and the value is an object describing the parameter.
 *
 * Available types are:
 * - {@link server.SharedStateManagerServer~schemaBooleanDef}
 * - {@link server.SharedStateManagerServer~schemaStringDef}
 * - {@link server.SharedStateManagerServer~schemaIntegerDef}
 * - {@link server.SharedStateManagerServer~schemaFloatDef}
 * - {@link server.SharedStateManagerServer~schemaEnumDef}
 * - {@link server.SharedStateManagerServer~schemaAnyDef}
 *
 * @example
 * {
 *   myBoolean: {
 *     type: 'boolean'
 *     default: false,
 *   },
 *   myFloat: {
 *     type: 'float'
 *     default: 0.1,
 *     min: -1,
 *     max: 1,
 *     event: true,
 *   }
 * }
 */
/**
 * @typedef {Object} server.SharedStateManagerServer~schemaBooleanDef
 *
 * @property {String} type='boolean' - Define a boolean parameter.
 * @property {Boolean} default - Default value of the parameter.
 * @property {Boolean} [nullable=false] - Define if the parameter is nullable. If
 *   set to `true` the parameter `default` is set to `null`.
 * @property {Boolean} [event=false] - Define if the parameter is a volatile, e.g.
 *   set its value back to `null` after propagation. When `true`, `nullable` is
 *   automatically set to `true` and `default` to `null`.
 * @property {Boolean} [filterChange=true] - Setting this option to `false` forces
 *   the propagation of a parameter even when its value do not change. It
 *   offers a kind of middle ground between the default bahavior (e.g. where
 *   only changed values are propagated) and the behavior of the `event` option
 *   (which has no state per se). As such, setting this options to `false` if
 *   `event=true` does not make sens.
 * @property {Boolean} [immediate=false] - Setting this option to `true` will
 *   trigger any change (e.g. call the subscribe listeners) immediately on the
 *   state that generate the update (i.e. calling `set`), before propagating the
 *   change on the network. This option can be usefull in cases the network
 *   would introduce a noticeable latency on the client. If for some reason
 *   the value is overriden server-side (e.g. in an updateHook) the listeners
 *   will be called again on when the "real" / final value will be received.
 * @property {Object} [metas={}] - Optionnal metadata of the parameter.
 */
/**
 * @typedef {Object} server.SharedStateManagerServer~schemaStringDef
 *
 * @property {String} type='string' - Define a boolean parameter.
 * @property {Mixed} default - Default value of the parameter.
 * @property {Boolean} [nullable=false] - Define if the parameter is nullable. If
 *   set to `true` the parameter `default` is set to `null`.
 * @property {Boolean} [event=false] - Define if the parameter is a volatile, e.g.
 *   set its value back to `null` after propagation. When `true`, `nullable` is
 *   automatically set to `true` and `default` to `null`.
 * @property {Boolean} [filterChange=true] - Setting this option to `false` forces
 *   the propagation of a parameter even when its value do not change. It
 *   offers a kind of middle ground between the default bahavior (e.g. where
 *   only changed values are propagated) and the behavior of the `event` option
 *   (which has no state per se). As such, setting this options to `false` if
 *   `event=true` does not make sens.
 * @property {Boolean} [immediate=false] - Setting this option to `true` will
 *   trigger any change (e.g. call the subscribe listeners) immediately on the
 *   state that generate the update (i.e. calling `set`), before propagating the
 *   change on the network. This option can be usefull in cases the network
 *   would introduce a noticeable latency on the client. If for some reason
 *   the value is overriden server-side (e.g. in an updateHook) the listeners
 *   will be called again on when the "real" / final value will be received.
 * @property {Object} [metas={}] - Optionnal metadata of the parameter.
 */
/**
 @typedef {Object} server.SharedStateManagerServer~schemaIntegerDef
 *
 * @property {String} type='integer' - Define a boolean parameter.
 * @property {Mixed} default - Default value of the parameter.
 * @property {Number} [min=-Infinity] - Minimum value of the parameter.
 * @property {Number} [max=+Infinity] - Maximum value of the parameter.
 * @property {Boolean} [nullable=false] - Define if the parameter is nullable. If
 *   set to `true` the parameter `default` is set to `null`.
 * @property {Boolean} [event=false] - Define if the parameter is a volatile, e.g.
 *   set its value back to `null` after propagation. When `true`, `nullable` is
 *   automatically set to `true` and `default` to `null`.
 * @property {Boolean} [filterChange=true] - Setting this option to `false` forces
 *   the propagation of a parameter even when its value do not change. It
 *   offers a kind of middle ground between the default bahavior (e.g. where
 *   only changed values are propagated) and the behavior of the `event` option
 *   (which has no state per se). As such, setting this options to `false` if
 *   `event=true` does not make sens.
 * @property {Boolean} [immediate=false] - Setting this option to `true` will
 *   trigger any change (e.g. call the subscribe listeners) immediately on the
 *   state that generate the update (i.e. calling `set`), before propagating the
 *   change on the network. This option can be usefull in cases the network
 *   would introduce a noticeable latency on the client. If for some reason
 *   the value is overriden server-side (e.g. in an updateHook) the listeners
 *   will be called again on when the "real" / final value will be received.
 * @property {Object} [metas={}] - Optionnal metadata of the parameter.
 */
/**
 * @typedef {Object} server.SharedStateManagerServer~schemaFloatDef
 *
 * @property {String} [type='float'] - Float parameter.
 * @property {Mixed} default - Default value.
 * @property {Number} [min=-Infinity] - Minimum value.
 * @property {Number} [max=+Infinity] - Maximum value.
 * @property {Boolean} [nullable=false] - Define if the parameter is nullable. If
 *   set to `true` the parameter `default` is set to `null`.
 * @property {Boolean} [event=false] - Define if the parameter is a volatile, e.g.
 *   set its value back to `null` after propagation. When `true`, `nullable` is
 *   automatically set to `true` and `default` to `null`.
 * @property {Boolean} [filterChange=true] - Setting this option to `false` forces
 *   the propagation of a parameter even when its value do not change. It
 *   offers a kind of middle ground between the default bahavior (e.g. where
 *   only changed values are propagated) and the behavior of the `event` option
 *   (which has no state per se). As such, setting this options to `false` if
 *   `event=true` does not make sens.
 * @property {Boolean} [immediate=false] - Setting this option to `true` will
 *   trigger any change (e.g. call the subscribe listeners) immediately on the
 *   state that generate the update (i.e. calling `set`), before propagating the
 *   change on the network. This option can be usefull in cases the network
 *   would introduce a noticeable latency on the client. If for some reason
 *   the value is overriden server-side (e.g. in an updateHook) the listeners
 *   will be called again on when the "real" / final value will be received.
 * @property {Object} [metas={}] - Optionnal metadata of the parameter.
 */
/**
 * @typedef {Object} server.SharedStateManagerServer~schemaEnumDef
 *
 * @property {String} [type='enum'] - Enum parameter.
 * @property {Mixed} default - Default value of the parameter.
 * @property {Array} list - Possible values of the parameter.
 * @property {Boolean} [nullable=false] - Define if the parameter is nullable. If
 *   set to `true` the parameter `default` is set to `null`.
 * @property {Boolean} [event=false] - Define if the parameter is a volatile, e.g.
 *   set its value back to `null` after propagation. When `true`, `nullable` is
 *   automatically set to `true` and `default` to `null`.
 * @property {Boolean} [filterChange=true] - Setting this option to `false` forces
 *   the propagation of a parameter even when its value do not change. It
 *   offers a kind of middle ground between the default bahavior (e.g. where
 *   only changed values are propagated) and the behavior of the `event` option
 *   (which has no state per se). As such, setting this options to `false` if
 *   `event=true` does not make sens.
 * @property {Boolean} [immediate=false] - Setting this option to `true` will
 *   trigger any change (e.g. call the subscribe listeners) immediately on the
 *   state that generate the update (i.e. calling `set`), before propagating the
 *   change on the network. This option can be usefull in cases the network
 *   would introduce a noticeable latency on the client. If for some reason
 *   the value is overriden server-side (e.g. in an updateHook) the listeners
 *   will be called again on when the "real" / final value will be received.
 * @property {Object} [metas={}] - Optionnal metadata of the parameter.
 */
/**
 * @typedef {Object} server.SharedStateManagerServer~schemaAnyDef
 *
 * @property {String} [type='any'] - Parameter of any type.
 * @property {Mixed} default - Default value of the parameter.
 * @property {Boolean} [nullable=false] - Define if the parameter is nullable. If
 *   set to `true` the parameter `default` is set to `null`.
 * @property {Boolean} [event=false] - Define if the parameter is a volatile, e.g.
 *   set its value back to `null` after propagation. When `true`, `nullable` is
 *   automatically set to `true` and `default` to `null`.
 * @property {Boolean} [filterChange=true] - Setting this option to `false` forces
 *   the propagation of a parameter even when its value do not change. It
 *   offers a kind of middle ground between the default bahavior (e.g. where
 *   only changed values are propagated) and the behavior of the `event` option
 *   (which has no state per se). As such, setting this options to `false` if
 *   `event=true` does not make sens.
 * @property {Boolean} [immediate=false] - Setting this option to `true` will
 *   trigger any change (e.g. call the subscribe listeners) immediately on the
 *   state that generate the update (i.e. calling `set`), before propagating the
 *   change on the network. This option can be usefull in cases the network
 *   would introduce a noticeable latency on the client. If for some reason
 *   the value is overriden server-side (e.g. in an updateHook) the listeners
 *   will be called again on when the "real" / final value will be received.
 * @property {Object} [metas={}] - Optionnal metadata of the parameter.
 */

export const sharedOptions = {
  nullable: false,
  event: false, // if event=true, nullable=true
  metas: {},
  filterChange: true,
  // immediate: false,
}

export const types = {
  boolean: {
    required: ['default'],
    get defaultOptions() {
      return Object.assign(cloneDeep(sharedOptions), {});
    },
    coerceFunction: (name, def, value) => {
      if (typeof value !== 'boolean') {
        throw new TypeError(`[stateManager] Invalid value for boolean param "${name}": ${value}`);
      }

      return value;
    }
  },
  string: {
    required: ['default'],
    get defaultOptions() {
      return Object.assign(cloneDeep(sharedOptions), {});
    },
    coerceFunction: (name, def, value) => {
      if (typeof value !== 'string') {
        throw new TypeError(`[stateManager] Invalid value for string param "${name}": ${value}`);
      }

      return value;
    }
  },
  integer: {
    required: ['default'],
    get defaultOptions() {
      return Object.assign(cloneDeep(sharedOptions), {
        min: -Infinity,
        max: +Infinity,
      });
    },
    coerceFunction: (name, def, value) => {
      if (!(typeof value === 'number' && Math.floor(value) === value)) {
        throw new TypeError(`[stateManager] Invalid value for integer param "${name}": ${value}`);
      }

      return Math.max(def.min, Math.min(def.max, value));
    }
  },
  float: {
    required: ['default'],
    get defaultOptions() {
      return Object.assign(cloneDeep(sharedOptions), {
        min: -Infinity,
        max: +Infinity,
      });
    },
    coerceFunction: (name, def, value) => {
      if (typeof value !== 'number' || value !== value) { // reject NaN
        throw new TypeError(`[stateManager] Invalid value for float param "${name}": ${value}`);
      }

      return Math.max(def.min, Math.min(def.max, value));
    }
  },
  enum: {
    required: ['default', 'list'],
    get defaultOptions() {
      return Object.assign(cloneDeep(sharedOptions), {});
    },
    coerceFunction: (name, def, value) => {
      if (def.list.indexOf(value) === -1) {
        throw new TypeError(`[stateManager] Invalid value for enum param "${name}": ${value}`);
      }


      return value;
    }
  },
  any: {
    required: ['default'],
    get defaultOptions() {
      return Object.assign(cloneDeep(sharedOptions), {});
    },
    coerceFunction: (name, def, value) => {
      // no check as it can have any type...
      return value;
    }
  }
}


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
   * Reset a parameter to its initialization values. Reset all parameters if no argument.
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
      if (!this.has(name)) {
        throw new ReferenceError(`[stateManager] Cannot get schema description of undefined parameter "${name}"`);
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
