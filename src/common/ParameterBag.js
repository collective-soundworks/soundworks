import cloneDeep from 'lodash/cloneDeep.js';
import equal from 'fast-deep-equal';

import {
  isPlainObject,
} from '@ircam/sc-utils';

export const sharedOptions = {
  nullable: false,
  event: false, // if event=true, nullable=true
  required: false, // if required=true, value si required in initialization values
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
        throw new TypeError(`Invalid value (${value}) for boolean parameter '${name}'`);
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
        throw new TypeError(`Invalid value (${value}) for string parameter '${name}'`);
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
    sanitizeDescription: (def) => {
      // sanitize `null` values in received description, this prevent a bug when
      // `min` and `max` are explicitly set to `±Infinity`, the description is stringified
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
        throw new TypeError(`Invalid value (${value}) for integer parameter '${name}'`);
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
    sanitizeDescription: (def) => {
      // sanitize `null` values in received description, this prevent a bug when
      // `min` and `max` are explicitly set to `±Infinity`, the description is stringified
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
        throw new TypeError(`Invalid value (${value}) for float parameter '${name}'`);
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
        throw new TypeError(`Invalid value (${value}) for enum parameter '${name}'`);
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


/** @private */
class ParameterBag {
  static validateDescription(description) {
    for (let name in description) {
      const def = description[name];

      if (!Object.prototype.hasOwnProperty.call(def, 'type')) {
        throw new TypeError(`Invalid ParameterDescription for param '${name}': 'type' key is required`);
      }

      if (!Object.prototype.hasOwnProperty.call(types, def.type)) {
        throw new TypeError(`Invalid ParameterDescription for param '${name}': type '${def.type}' is not a valid type`);
      }

      const required = types[def.type].required;

      required.forEach(key => {
        if ((def.event === true || def.required === true) && key === 'default') {
          // do nothing:
          // - default is always null for `event` params
          // - default is always null for `required` params
          if ('default' in def && def.default !== null) {
            throw new TypeError(`Invalid ParameterDescription for param ${name}: 'default' property is set and not null while the parameter definition is declared as 'event' or 'required'`);
          }
        } else if (!Object.prototype.hasOwnProperty.call(def, key)) {
          throw new TypeError(`Invalid ParameterDescription for param "${name}"; property '${key}' key is required`);
        }
      });
    }
  }

  static getFullDescription(description) {
    const fullDescription = cloneDeep(description);

    for (let [name, def] of Object.entries(fullDescription)) {
      if (types[def.type].sanitizeDescription) {
        def = types[def.type].sanitizeDescription(def);
      }

      const { defaultOptions } = types[def.type];
      def = Object.assign({}, defaultOptions, def);
      // if event property is set to true, the param must
      // be nullable and its default value is `undefined`
      if (def.event === true) {
        def.nullable = true;
        def.default = null;
      }

      if (def.required === true) {
        def.default = null;
      }

      fullDescription[name] = def;
    }

    return fullDescription;
  }

  #description = {};
  #values = {};

  constructor(description, initValues = {}) {
    if (!isPlainObject(description)) {
      throw new TypeError(`Cannot construct ParameterBag: argument 1 must be an object`);
    }

    ParameterBag.validateDescription(description);

    description = ParameterBag.getFullDescription(description);
    initValues = cloneDeep(initValues);

    // make sure initValues make sens according to the given description
    for (let name in initValues) {
      if (!Object.prototype.hasOwnProperty.call(description, name)) {
        throw new ReferenceError(`Invalid init value for parameter '${name}': Parameter does not exists`);
      }
    }

    for (let [name, def] of Object.entries(description)) {
      if (def.required === true) {
        // throw if value is not given in init values
        if (initValues[name] === undefined || initValues[name] === null) {
          throw new TypeError(`Invalid init value for required param "${name}": Init value must be defined`);
        }

        def.default = initValues[name];
      }

      let initValue;

      if (Object.prototype.hasOwnProperty.call(initValues, name)) {
        initValue = initValues[name];
      } else {
        initValue = def.default;
      }

      this.#description[name] = def;
      // coerce init value and store in definition
      const coercedInitValue = this.set(name, initValue)[0];
      this.#description[name].initValue = coercedInitValue;
      this.#values[name] = coercedInitValue;
    }
  }

  /**
   * Define if the parameter exists.
   *
   * @param {string} name - Name of the parameter.
   * @return {Boolean}
   */
  has(name) {
    return Object.prototype.hasOwnProperty.call(this.#description, name);
  }

  /**
   * Return values of all parameters as a flat object. If a parameter is of `any`
   * type, a deep copy is made.
   *
   * @return {object}
   */
  getValues() {
    let values = {};

    for (let name in this.#values) {
      values[name] = this.get(name);
    }

    return values;
  }

  /**
   * Return values of all parameters as a flat object. Similar to `getValues` but
   * returns a reference to the underlying value in case of `any` type. May be
   * useful if the underlying value is big (e.g. sensors recordings, etc.) and
   * deep cloning expensive. Be aware that if changes are made on the returned
   * object, the state of your application will become inconsistent.
   *
   * @return {object}
   */
  getValuesUnsafe() {
    let values = {};

    for (let name in this.#values) {
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
      throw new ReferenceError(`Cannot get value of undefined parameter '${name}'`);
    }

    if (this.#description[name].type === 'any') {
      // we return a deep copy of the object as we don't want the client code to
      // be able to modify our underlying data.
      return cloneDeep(this.#values[name]);
    } else {
      return this.#values[name];
    }
  }

  /**
   * Similar to `get` but returns a reference to the underlying value in case of
   * `any` type. May be useful if the underlying value is big (e.g. sensors
   * recordings, etc.) and deep cloning expensive. Be aware that if changes are
   * made on the returned object, the state of your application will become
   * inconsistent.
   *
   * @param {string} name - Name of the parameter.
   * @return {Mixed} - Value of the parameter.
   */
  getUnsafe(name) {
    if (!this.has(name)) {
      throw new ReferenceError(`Cannot get value of undefined parameter '${name}'`);
    }

    return this.#values[name];
  }

  /**
   * Check that the value is valid according to the class definition and return it coerced.
   *
   * @param {String} name - Name of the parameter.
   * @param {Mixed} value - Value of the parameter.
   */
  coerceValue(name, value) {
    if (!this.has(name)) {
      throw new ReferenceError(`Cannot set value of undefined parameter "${name}"`);
    }

    const def = this.#description[name];

    if (value === null && def.nullable === false) {
      throw new TypeError(`Invalid value for ${def.type} param "${name}": value is null and param is not nullable`);
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
    const currentValue = this.#values[name];
    const updated = !equal(currentValue, value);

    // we store a deep copy of the object as we don't want the client to be able
    // to modify our underlying data, which leads to unexpected behavior where the
    // deep equal check to returns true, and therefore the update is not triggered.
    // @see tests/common.state-manager.spec.js
    // 'should copy stored value for "any" type to have a predictable behavior'
    if (this.#description[name].type === 'any') {
      value = cloneDeep(value);
    }

    this.#values[name] = value;

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
   * @return {object}
   */
  getDescription(name = null) {
    if (name === null) {
      return this.#description;
    }

    if (!this.has(name)) {
      throw new ReferenceError(`Cannot get description of undefined parameter "${name}"`);
    }

    return this.#description[name];
  }

  // return the default value, if initValue has been given, return init values
  getInitValues() {
    const initValues = {};

    for (let [name, def] of Object.entries(this.#description)) {
      initValues[name] = def.initValue;
    }

    return initValues;
  }

  // return the default value, if initValue has been given, return init values
  getDefaults() {
    const defaults = {};

    for (let [name, def] of Object.entries(this.#description)) {
      defaults[name] = def.default;
    }

    return defaults;
  }
}

export default ParameterBag;
