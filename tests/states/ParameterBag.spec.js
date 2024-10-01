import { use, assert } from 'chai';
import shallowDeepEqual from 'chai-shallow-deep-equal';

// import ParameterBag from '../src/common/ParameterBag.js';
import { default as ParameterBag, sharedOptions, types } from '../../src/common/ParameterBag.js';

use(shallowDeepEqual);

describe('# [private] ParameterBag', () => {
  // ---------------------------------------------------------------
  // MAIN API
  // ---------------------------------------------------------------
  describe('## static validateDescription(schema)', () => {
    it('should check if schema is invalid', () => {
      assert.throw(() => ParameterBag.validateDescription({
        noType: {}
      }), TypeError, `[StateManager.registerSchema] Invalid class description - param "noType": "type" key is required`);

      assert.throw(() => ParameterBag.validateDescription({
        invalidType: { type: 'invalid' }
      }), TypeError, `[StateManager.registerSchema] Invalid class description - param "invalidType": "{ type: 'invalid' }" does not exists`);

      assert.throw(() => ParameterBag.validateDescription({
        myBoolean: { type: 'boolean' }
      }), TypeError, `[StateManager.registerSchema] Invalid class description - param "myBoolean" (type "boolean"): "default" key is required`);
    });

    it(`should throw if "default" is declared when "event" is true`, () => {
      // event: true does not require `default` value
      assert.doesNotThrow(() => ParameterBag.validateDescription({
        myBoolean: { type: 'boolean', event: true }
      }));

      assert.throws(() => ParameterBag.validateDescription({
        myBoolean: { type: 'boolean', event: true, default: false }
      }));
    });

    it(`should throw if "default" is declared when "required" is true`, () => {
      // required: true does not require `default` value
      assert.doesNotThrow(() => ParameterBag.validateDescription({
        myBoolean: { type: 'boolean', required: true }
      }));

      assert.throws(() => ParameterBag.validateDescription({
        myBoolean: { type: 'boolean', required: true, default: true }
      }));
    });
  });

  describe('## constructor(schema, initValues)', () => {
    it('should validate the given schema', () => {
      assert.throws(() => new ParameterBag({
        invalidType: { type: 'invalid' }
      }), TypeError, `[StateManager.registerSchema] Invalid class description - param "invalidType": "{ type: 'invalid' }" does not exists`);
    });

    it('should check initValues consistency', () => {
      assert.throws(() => {
        new ParameterBag(
          { myBoolean: { type: 'boolean', default: 0 }},
          { myFloat: 0.1 }
        )
      }, ReferenceError, `[StateManager.create] init value defined for undefined param "myFloat"`);
    });

    it('should throw if required param is not given at initialization', () => {
      let errored = false;
      try {
        new ParameterBag({ requiredParam: { type: 'boolean', required: true, } });
      } catch(err) {
        console.log(err.message);
        errored = true;
      }

      if (!errored) { assert.fail('require param should have thrown'); }
    });

    it('should complete and deeply clone schema', () => {
      const schema = {
        myBoolean: {
          type: 'boolean',
          default: true,
        },
        myFloat: {
          type: 'float',
          default: 0,
          nullable: true,
        },
      };

      const p1 = new ParameterBag(schema);
      const p2 = new ParameterBag(schema);

      for (let name in p1._schema) {
        assert.containsAllKeys(p1._schema[name], Object.keys(sharedOptions));
        assert.containsAllKeys(p2._schema[name], Object.keys(sharedOptions));

        assert.notStrictEqual(p1._schema[name], p2._schema[name]);
        assert.notStrictEqual(p1._schema[name].metas, p2._schema[name].metas);
      }
    });

    it(`should properly coerce and assign initValues`, () => {
      const schema = {
        myBoolean: {
          type: 'boolean',
          default: false,
        },
        myFloat: {
          type: 'float',
          default: 0,
          min: 0,
        },
      };

      const params = new ParameterBag(schema, { myFloat: -1000 });
      const expected = { myBoolean: false, myFloat: 0 };
      assert.deepEqual(params.getValues(), expected);
      assert.deepEqual(params.getValuesUnsafe(), expected);
      assert.deepEqual(params.getInitValues(), expected);
    });
  });

  const schema = {
    bool: {
      type: 'boolean',
      default: false,
    },
    int: {
      type: 'integer',
      default: 0,
      min: -2,
      max: 2,
    },
    nullable: {
      type: 'any',
      default: {},
      nullable: true,
    },
    event: {
      type: 'float',
      default: null,
      event: true,
    },
    required: {
      type: 'string',
      required: true,
    },
  };

  const params = new ParameterBag(schema, {
    bool: true,
    int: -4,
    required: 'coucou',
  });

  describe(`## has(name)`, () => {
    it(`should check if param name is defined`, () => {
      assert.equal(params.has('bool'), true);
      assert.equal(params.has('not'), false);
    });
  });

  describe(`## getValues()`, () => {
    it(`should return current values`, () => {
      const expected = { bool: true, int: -2, nullable: {}, event: null, required: 'coucou' };
      assert.deepEqual(params.getValues(), expected);
    });

    it(`should return a shallow copy in internal values`, () => {
      assert.notStrictEqual(params.getValues(), params._values);
    });
  });

  describe(`## getValuesUnsafe()`, () => {
    it(`should return reference for "any" type`, () => {
      const a = params.getValuesUnsafe();
      const b = params.getValuesUnsafe();
      assert.equal(a.nullable, b.nullable);
    });
  });

  describe(`## get(name)`, () => {
    it(`should throw if name is undefined`, () => {
      assert.throw(() => params.get('doNotExists'), ReferenceError, `[SharedState] Cannot get value of undefined parameter "doNotExists"`)
    });

    it(`should return proper value`, () => {
      assert.strictEqual(params.get('bool'), true);
      assert.strictEqual(params.get('int'), -2);
      assert.deepEqual(params.get('nullable'), {});
      assert.strictEqual(params.get('event'), null);
      assert.strictEqual(params.get('required'), 'coucou');
    });
  });

  describe(`## getUnsafe(name)`, () => {
    it(`should throw if name is undefined`, () => {
      assert.throw(() => params.get('doNotExists'), ReferenceError, `[SharedState] Cannot get value of undefined parameter "doNotExists"`)
    });

    it(`should return reference`, () => {
      const a = params.getUnsafe('nullable');
      const b = params.getUnsafe('nullable');
      assert.equal(a, b);
    });
  });

  describe(`## set(name, value)`, () => {
    it(`should throw if name does not exists`, () => {
      assert.throw(() => params.set('doNotExists', false), ReferenceError, `[SharedState] Cannot set value of undefined parameter "doNotExists"`)
    });

    it(`should throw if not nullable and null given`, () => {
      assert.throw(() => params.set('bool', null), TypeError, `[SharedState] Invalid value for boolean param "bool": value is null and param is not nullable`);
    });

    it(`should return [value, updated]`, () => {
      assert.deepEqual(params.set('bool', true), [true, false]);
      assert.deepEqual(params.set('int', 42), [2, true]);
      assert.deepEqual(params.set('int', 24), [2, false]);
      assert.deepEqual(params.set('nullable', null), [null, true]);
      assert.deepEqual(params.set('event', 0.01), [0.01, true]);
    });

    // this is not relevant anymore since event are handled at upper level
    // it(`event type should be null when get after set`, () => {
      // assert.deepEqual(params.set('event', 0.01), [0.01, true]);
      // assert.strictEqual(params.get('event'), null);
    // });
  });

  describe(`## getDescription([name])`, () => {
    it(`should return the schema with proper default applied`, () => {
      assert.shallowDeepEqual(params.getDescription(), schema);
    });

    it(`should throw if name does not exists`, () => {
      assert.throw(() => params.getDescription('42'), ReferenceError,
        `[SharedState] Cannot get description of undefined parameter "42"`
      );
    });
  });

  describe(`## getDefaults()`, () => {
    it(`should return the default values of the schema`, () => {
      assert.shallowDeepEqual(params.getDefaults(), {
        bool: false,
        int: 0,
        nullable: {},
        event: null,
        required: 'coucou', // default is set to init value
      });
    });
  });
});

// ---------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------
describe('# [private] ParameterBag::types', () => {
  describe('## boolean type', () => {
    const coerce = types.boolean.coerceFunction;

    it('should coerce properly', () => {
      assert.doesNotThrow(() => coerce('b', {}, true));
      assert.doesNotThrow(() => coerce('b', {}, false));
      assert.throws(() => coerce('b', {}, 0.1), TypeError, /\[SharedState\] Invalid value "(.*)" for boolean parameter "b"/);
      assert.throws(() => coerce('b', {}, -100000), TypeError, /\[SharedState\] Invalid value "(.*)" for boolean parameter "b"/);
      assert.throws(() => coerce('b', {}, Math.PI), TypeError, /\[SharedState\] Invalid value "(.*)" for boolean parameter "b"/);
      assert.throws(() => coerce('b', {}, -Infinity), TypeError, /\[SharedState\] Invalid value "(.*)" for boolean parameter "b"/);
      assert.throws(() => coerce('b', {}, NaN), TypeError, /\[SharedState\] Invalid value "(.*)" for boolean parameter "b"/);
      assert.throws(() => coerce('b', {}, 0), TypeError, /\[SharedState\] Invalid value "(.*)" for boolean parameter "b"/);
      assert.throws(() => coerce('b', {}, '10'), TypeError, /\[SharedState\] Invalid value "(.*)" for boolean parameter "b"/);
      assert.throws(() => coerce('b', {}, null), TypeError, /\[SharedState\] Invalid value "(.*)" for boolean parameter "b"/);
      assert.throws(() => coerce('b', {}, /abc/), TypeError, /\[SharedState\] Invalid value "(.*)" for boolean parameter "b"/);
      assert.throws(() => coerce('b', {}, undefined), TypeError, /\[SharedState\] Invalid value "(.*)" for boolean parameter "b"/);
      assert.throws(() => coerce('b', {}, [0, 1, 2]), TypeError, /\[SharedState\] Invalid value "(.*)" for boolean parameter "b"/);
    });
  });

  describe('## string type', () => {
    const coerce = types.string.coerceFunction;

    it('should coerce properly', () => {
      assert.doesNotThrow(() => coerce('s', {}, '10'));
      assert.doesNotThrow(() => coerce('s', {}, 'a text'));
      assert.throws(() => coerce('s', {}, -100000), TypeError, /\[SharedState\] Invalid value "(.*)" for string parameter "s"/);
      assert.throws(() => coerce('s', {}, -Infinity), TypeError, /\[SharedState\] Invalid value "(.*)" for string parameter "s"/);
      assert.throws(() => coerce('s', {}, true), TypeError, /\[SharedState\] Invalid value "(.*)" for string parameter "s"/);
      assert.throws(() => coerce('s', {}, false), TypeError, /\[SharedState\] Invalid value "(.*)" for string parameter "s"/);
      assert.throws(() => coerce('s', {}, 0.1), TypeError, /\[SharedState\] Invalid value "(.*)" for string parameter "s"/);
      assert.throws(() => coerce('s', {}, Math.PI), TypeError, /\[SharedState\] Invalid value "(.*)" for string parameter "s"/);
      assert.throws(() => coerce('s', {}, NaN), TypeError, /\[SharedState\] Invalid value "(.*)" for string parameter "s"/);
      assert.throws(() => coerce('s', {}, 0), TypeError, /\[SharedState\] Invalid value "(.*)" for string parameter "s"/);
      assert.throws(() => coerce('s', {}, null), TypeError, /\[SharedState\] Invalid value "(.*)" for string parameter "s"/);
      assert.throws(() => coerce('s', {}, /abc/), TypeError, /\[SharedState\] Invalid value "(.*)" for string parameter "s"/);
      assert.throws(() => coerce('s', {}, undefined), TypeError, /\[SharedState\] Invalid value "(.*)" for string parameter "s"/);
      assert.throws(() => coerce('s', {}, [0, 1, 2]), TypeError, /\[SharedState\] Invalid value "(.*)" for string parameter "s"/);
    });
  });

  describe('## integer type', () => {
    const coerce = types.integer.coerceFunction;

    it('should coerce properly', () => {
      const def = types.integer.defaultOptions;
      assert.doesNotThrow(() => coerce('i', def, -100000));
      assert.doesNotThrow(() => coerce('i', def, -Infinity));
      assert.doesNotThrow(() => coerce('i', def, 0));

      assert.equal(coerce('i', def, -100000), -100000);
      assert.equal(coerce('i', def, -Infinity), -Infinity);
      assert.equal(coerce('i', def, 0), 0);

      assert.throws(() => coerce('i', def, true), TypeError, /\[SharedState\] Invalid value "(.*)" for integer parameter "i"/);
      assert.throws(() => coerce('i', def, false), TypeError, /\[SharedState\] Invalid value "(.*)" for integer parameter "i"/);
      assert.throws(() => coerce('i', def, 0.1), TypeError, /\[SharedState\] Invalid value "(.*)" for integer parameter "i"/);
      assert.throws(() => coerce('i', def, Math.PI), TypeError, /\[SharedState\] Invalid value "(.*)" for integer parameter "i"/);
      assert.throws(() => coerce('i', def, NaN), TypeError, /\[SharedState\] Invalid value "(.*)" for integer parameter "i"/);
      assert.throws(() => coerce('i', def, '10'), TypeError, /\[SharedState\] Invalid value "(.*)" for integer parameter "i"/);
      assert.throws(() => coerce('i', def, null), TypeError, /\[SharedState\] Invalid value "(.*)" for integer parameter "i"/);
      assert.throws(() => coerce('i', def, /abc/), TypeError, /\[SharedState\] Invalid value "(.*)" for integer parameter "i"/);
      assert.throws(() => coerce('i', def, undefined), TypeError, /\[SharedState\] Invalid value "(.*)" for integer parameter "i"/);
      assert.throws(() => coerce('i', def, [0, 1, 2]), TypeError, /\[SharedState\] Invalid value "(.*)" for integer parameter "i"/);
    });

    it('should clip properly', () => {
      const def = { min: 0, max: 2 };
      assert.equal(coerce('i', def, -1), 0, 'should clip min');
      assert.equal(coerce('i', def, 3), 2, 'should clip max');
    });;
  });

  describe('## float type', () => {
    const coerce = types.float.coerceFunction;

    it('should coerce properly', () => {
      const def = types.float.defaultOptions;
      assert.doesNotThrow(() => coerce('f', def, -100000));
      assert.doesNotThrow(() => coerce('f', def, -Infinity));
      assert.doesNotThrow(() => coerce('f', def, 0));
      assert.doesNotThrow(() => coerce('f', def, 0.1));
      assert.doesNotThrow(() => coerce('f', def, Math.PI));

      assert.equal(coerce('f', def, -100000), -100000);
      assert.equal(coerce('f', def, -Infinity), -Infinity);
      assert.equal(coerce('f', def, 0), 0);
      assert.equal(coerce('f', def, 0.1), 0.1);
      assert.equal(coerce('f', def, Math.PI), Math.PI);

      assert.throws(() => coerce('f', def, true), TypeError, /\[SharedState\] Invalid value "(.*)" for float parameter "f"/);
      assert.throws(() => coerce('f', def, false), TypeError, /\[SharedState\] Invalid value "(.*)" for float parameter "f"/);
      assert.throws(() => coerce('f', def, NaN), TypeError, /\[SharedState\] Invalid value "(.*)" for float parameter "f"/);
      assert.throws(() => coerce('f', def, '10'), TypeError, /\[SharedState\] Invalid value "(.*)" for float parameter "f"/);
      assert.throws(() => coerce('f', def, null), TypeError, /\[SharedState\] Invalid value "(.*)" for float parameter "f"/);
      assert.throws(() => coerce('f', def, /abc/), TypeError, /\[SharedState\] Invalid value "(.*)" for float parameter "f"/);
      assert.throws(() => coerce('f', def, undefined), TypeError, /\[SharedState\] Invalid value "(.*)" for float parameter "f"/);
      assert.throws(() => coerce('f', def, [0, 1, 2]), TypeError, /\[SharedState\] Invalid value "(.*)" for float parameter "f"/);
    });

    it('should clip properly', () => {
      const def = { min: -0.3, max: Math.PI };
      assert.equal(coerce('f', def, -1), -0.3, 'should clip min');
      assert.equal(coerce('f', def, 6), Math.PI, 'should clip max');
    });;
  });

  describe('## enum type', () => {
    const coerce = types.enum.coerceFunction;

    it('should coerce properly', () => {
      const def = { list: ['a', 1] };

      assert.doesNotThrow(() => coerce('e', def, 'a'));
      assert.doesNotThrow(() => coerce('e', def, 1));
      assert.throws(() => coerce('e', def, 'e'), TypeError, /\[SharedState\] Invalid value "(.*)" for enum parameter "e"/);
      assert.throws(() => coerce('e', def, '1'), TypeError, /\[SharedState\] Invalid value "(.*)" for enum parameter "e"/);
    });
  });
});
