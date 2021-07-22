/**
 * Dictionnary of the available types. Each key correspond to the type of the
 * implemented param while the corresponding object value should the
 * {@link `paramDefinition`} of the defined type.
 *
 * typedef {Object} paramTemplates
 * @type {Object<String, paramTemplate>}
 */

/**
 * Definition of a parameter. The definition should at least contain the entries
 * `type` and `default`. Every parameter can also accept optionnal configuration.
 * Available definitions are:
 * - {@link booleanDefinition}
 * - {@link integerDefinition}
 * - {@link floatDefinition}
 * - {@link stringDefinition}
 * - {@link enumDefinition}
 */
export default {
  /**
   * @typedef {Object} booleanTypeDefinition
   *
   * @property {String} [type='boolean'] - Define a boolean parameter.
   * @property {Boolean} default - Default value of the parameter.
   * @property {Boolean} [nullable=false] - Define if the parameter is nullable.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  boolean: {
    required: ['default'],
    ensureDefinition(definition) {
      const defaults = {
        nullable: false,
        metas: {},
      };

      return Object.assign(defaults, definition);
    },
    ensureValue(value, definition, name) {
      if (typeof value !== 'boolean') {
        throw new Error(`Invalid value for boolean param "${name}": ${value}`);
      }

      return value;
    }
  },

  /**
   * @typedef {Object} stringTypeDefinition
   *
   * @property {String} [type='string'] - Define a boolean parameter.
   * @property {Mixed} default - Default value of the parameter.
   * @property {Boolean} [nullable=false] - Define if the parameter is nullable.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  string: {
    required: ['default'],
    ensureDefinition(definition) {
      const defaults = {
        nullable: false,
        metas: {},
      };

      return Object.assign(defaults, definition);
    },
    ensureValue(value, definition, name) {
      if (typeof value !== 'string') {
        throw new Error(`Invalid value for string param "${name}": ${value}`);
      }

      return value;
    }
  },

  /**
   * @typedef {Object} integerTypeDefinition
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
    ensureDefinition(definition) {
      const defaults = {
        nullable: false,
        min: -Infinity,
        max: +Infinity,
        metas: {},
      };

      return Object.assign(defaults, definition);
    },
    ensureValue(value, definition, name) {
      if (!(typeof value === 'number' && Math.floor(value) === value)) {
        throw new Error(`Invalid value for integer param "${name}": ${value}`);
      }

      return Math.max(definition.min, Math.min(definition.max, value));
    }
  },

  /**
   * @typedef {Object} floatTypeDefinition
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
    ensureDefinition(definition) {
      const defaults = {
        nullable: false,
        min: -Infinity,
        max: +Infinity,
        metas: {},
      };

      return Object.assign(defaults, definition);
    },
    ensureValue(value, definition, name) {
      if (typeof value !== 'number' || value !== value) { // reject NaN
        throw new Error(`Invalid value for float param "${name}": ${value}`);
      }

      return Math.max(definition.min, Math.min(definition.max, value));
    }
  },

  /**
   * @typedef {Object} enumTypeDefinition
   *
   * @property {String} [type='enum'] - Enum parameter.
   * @property {Mixed} default - Default value of the parameter.
   * @property {Array} list - Possible values of the parameter.
   * @property {Boolean} [nullable=false] - Define if the parameter is nullable.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  enum: {
    required: ['default', 'list'],
    ensureDefinition(definition) {
      const defaults = {
        nullable: false,
        metas: {},
      };

      return Object.assign(defaults, definition);
    },
    ensureValue(value, definition, name) {
      if (definition.list.indexOf(value) === -1) {
        throw new Error(`Invalid value for enum param "${name}": ${value}`);
      }

      return value;
    }
  },

  /**
   * @typedef {Object} anyTypeDefinition
   * @property {String} [type='any'] - Parameter of any type.
   * @property {Mixed} default - Default value of the parameter.
   * @property {Boolean} [constant=false] - Define if the parameter is constant.
   * @property {Boolean} [nullable=false] - Define if the parameter is nullable.
   * @property {Boolean} [event=false] - Define if the parameter is a volatile, e.g.
   *    set its value back to `null` after propagation of its value. When `true`,
   *    `nullable` is automatically set to `true` and `default` to `null`.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  any: {
    definitionTemplate: ['default'],
    ensureValue(value, definition, name) {
      // no check as it can have any type...
      return value;
    }
  }
}
