import cloneDeep from 'lodash.cloneDeep';

/**
 * Dictionnary of the available types. Each key correspond to the type of the
 * implemented param while the corresponding object value should the
 * {@link `paramdef`} of the defined type.
 *
 * typedef {Object} paramTemplates
 * @type {Object<String, paramTemplate>}
 */

export const sharedOptions = {
  nullable: false,
  event: false, // if event=true, nullable=true
  // filterChange: true,
  // immediate: false,
  metas: {},
}

/**
 * def of a parameter. The def should at least contain the entries
 * `type` and `default`. Every parameter can also accept optionnal configuration.
 * Available defs are:
 * - {@link booleandef}
 * - {@link integerdef}
 * - {@link floatdef}
 * - {@link stringdef}
 * - {@link enumdef}
 */
export default {
  /**
   * @typedef {Object} booleanTypedef
   *
   * @property {String} [type='boolean'] - Define a boolean parameter.
   * @property {Boolean} default - Default value of the parameter.
   * @property {Boolean} [nullable=false] - Define if the parameter is nullable.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
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

  /**
   * @typedef {Object} stringTypedef
   *
   * @property {String} [type='string'] - Define a boolean parameter.
   * @property {Mixed} default - Default value of the parameter.
   * @property {Boolean} [nullable=false] - Define if the parameter is nullable.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
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

  /**
   * @typedef {Object} integerTypedef
   *
   * @property {String} [type='integer'] - Define a boolean parameter.
   * @property {Mixed} default - Default value of the parameter.
   * @property {Mixed} default - Default value of the parameter.
   * @property {Number} [min=-Infinity] - Minimum value of the parameter.
   * @property {Number} [max=+Infinity] - Maximum value of the parameter.
   * @property {Boolean} [nullable=false] - Define if the parameter is nullable.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
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

  /**
   * @typedef {Object} floatTypedef
   *
   * @property {String} [type='float'] - Float parameter.
   * @property {Mixed} default - Default value.
   * @property {Number} [min=-Infinity] - Minimum value.
   * @property {Number} [max=+Infinity] - Maximum value.
   * @property {Boolean} [nullable=false] - Define if the parameter is nullable.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
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

  /**
   * @typedef {Object} enumTypedef
   *
   * @property {String} [type='enum'] - Enum parameter.
   * @property {Mixed} default - Default value of the parameter.
   * @property {Array} list - Possible values of the parameter.
   * @property {Boolean} [nullable=false] - Define if the parameter is nullable.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
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

  /**
   * @typedef {Object} anyTypedef
   * @property {String} [type='any'] - Parameter of any type.
   * @property {Mixed} default - Default value of the parameter.
   * @property {Boolean} [nullable=false] - Define if the parameter is nullable.
   * @property {Boolean} [event=false] - Define if the parameter is a volatile, e.g.
   *    set its value back to `null` after propagation of its value. When `true`,
   *    `nullable` is automatically set to `true` and `default` to `null`.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
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
