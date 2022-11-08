import equal from 'fast-deep-equal';
import { default as chai, assert } from 'chai';
import shallowDeepEqual from 'chai-shallow-deep-equal';

import ParameterBag from '../src/common/ParameterBag.js';
import { sharedOptions, types } from '../src/common/ParameterBag.js';

chai.use(shallowDeepEqual);

describe('common::ParameterBag (private)', () => {
  // ---------------------------------------------------------------
  // MAIN API
  // ---------------------------------------------------------------
  describe('static validateSchema(schema)', () => {
    it('should check if schema is invalid', () => {
      assert.throw(() => ParameterBag.validateSchema({
        noType: {}
      }), TypeError, `[stateManager] Invalid schema definition - param "noType": "type" key is required`);

      assert.throw(() => ParameterBag.validateSchema({
        invalidType: { type: 'invalid' }
      }), TypeError, `[stateManager] Invalid schema definition - param "invalidType": "{ type: 'invalid' }" does not exists`);

      assert.throw(() => ParameterBag.validateSchema({
        myBoolean: { type: 'boolean' }
      }), TypeError, `[stateManager] Invalid schema definition - param "myBoolean" (type "boolean"): "default" key is required`);
    });

    it(`should allow "default" to not be declared when "event" is true`, () => {
      // event: true does not require `default` value
      assert.doesNotThrow(() => ParameterBag.validateSchema({
        myBoolean: { type: 'boolean', event: true }
      }));
    })
  });

  describe('constructor(schema, initValues)', () => {
    it('should validate the given schema', () => {
      assert.throws(() => new ParameterBag({
        invalidType: { type: 'invalid' }
      }), TypeError, `[stateManager] Invalid schema definition - param "invalidType": "{ type: 'invalid' }" does not exists`);
    });

    it('should check initValues consistency', () => {
      assert.throws(() => {
        new ParameterBag(
          { myBoolean: { type: 'boolean', default: 0 }},
          { myFloat: 0.1 }
        )
      }, ReferenceError, `[stateManager] init value defined for undefined param "myFloat"`);
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
      assert.deepEqual(params._values, expected);
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
  };

  const params = new ParameterBag(schema, {
    bool: true,
    int: -4,
  });

  describe(`has(name)`, () => {
    it(`should check if param name is defined`, () => {
      assert.equal(params.has('bool'), true);
      assert.equal(params.has('not'), false);
    });
  });

  describe(`getValues()`, () => {
    it(`should return current values`, () => {
      const expected = { bool: true, int: -2, nullable: {}, event: null };
      assert.deepEqual(params.getValues(), expected);
    });

    it(`should return a shallow copy in internal values`, () => {
      assert.notStrictEqual(params.getValues(), params._values);
    });
  });

  describe(`get(name)`, () => {
    it(`should throw if name is undefined`, () => {
      assert.throw(() => params.get('doNotExists'), ReferenceError, `[stateManager] Cannot get value of undefined parameter "doNotExists"`)
    });

    it(`should return proper value`, () => {
      assert.strictEqual(params.get('bool'), true);
      assert.strictEqual(params.get('int'), -2);
      assert.deepEqual(params.get('nullable'), {});
      assert.strictEqual(params.get('event'), null);
    });
  });

  describe(`set(name, value)`, () => {
    it(`should throw if name does not exists`, () => {
      assert.throw(() => params.set('doNotExists', false), ReferenceError, `[stateManager] Cannot set value of undefined parameter "doNotExists"`)
    });

    it(`should throw if not nullable and null given`, () => {
      assert.throw(() => params.set('bool', null), TypeError, `[stateManager] Invalid value for boolean param "bool": value is null and param is not nullable`);
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

  describe(`getSchema([name])`, () => {
    it(`should return the schema with proper default applied`, () => {
      assert.shallowDeepEqual(params.getSchema(), schema);
    });

    it(`should throw if name does not exists`, () => {
      assert.throw(() => params.getSchema('42'), ReferenceError,
        `[stateManager] Cannot get schema description of undefined parameter "42"`
      );
    });
  });

  // ---------------------------------------------------------------
  // TYPES
  // ---------------------------------------------------------------
  describe('ParameterBag::types', () => {
    describe('boolean type', () => {
      const coerce = types.boolean.coerceFunction;

      it('should coerce properly', () => {
        assert.doesNotThrow(() => coerce('b', {}, true));
        assert.doesNotThrow(() => coerce('b', {}, false));
        assert.throws(() => coerce('b', {}, 0.1), TypeError, /\[stateManager\] Invalid value for boolean param "b": (.*)/);
        assert.throws(() => coerce('b', {}, -100000), TypeError, /\[stateManager\] Invalid value for boolean param "b": (.*)/);
        assert.throws(() => coerce('b', {}, Math.PI), TypeError, /\[stateManager\] Invalid value for boolean param "b": (.*)/);
        assert.throws(() => coerce('b', {}, -Infinity), TypeError, /\[stateManager\] Invalid value for boolean param "b": (.*)/);
        assert.throws(() => coerce('b', {}, NaN), TypeError, /\[stateManager\] Invalid value for boolean param "b": (.*)/);
        assert.throws(() => coerce('b', {}, 0), TypeError, /\[stateManager\] Invalid value for boolean param "b": (.*)/);
        assert.throws(() => coerce('b', {}, '10'), TypeError, /\[stateManager\] Invalid value for boolean param "b": (.*)/);
        assert.throws(() => coerce('b', {}, null), TypeError, /\[stateManager\] Invalid value for boolean param "b": (.*)/);
        assert.throws(() => coerce('b', {}, /abc/), TypeError, /\[stateManager\] Invalid value for boolean param "b": (.*)/);
        assert.throws(() => coerce('b', {}, undefined), TypeError, /\[stateManager\] Invalid value for boolean param "b": (.*)/);
        assert.throws(() => coerce('b', {}, [0, 1, 2]), TypeError, /\[stateManager\] Invalid value for boolean param "b": (.*)/);
      });
    });

    describe('string type', () => {
      const coerce = types.string.coerceFunction;

      it('should coerce properly', () => {
        assert.doesNotThrow(() => coerce('s', {}, '10'));
        assert.doesNotThrow(() => coerce('s', {}, 'a text'));
        assert.throws(() => coerce('s', {}, -100000), TypeError, /\[stateManager\] Invalid value for string param "s": (.*)/);
        assert.throws(() => coerce('s', {}, -Infinity), TypeError, /\[stateManager\] Invalid value for string param "s": (.*)/);
        assert.throws(() => coerce('s', {}, true), TypeError, /\[stateManager\] Invalid value for string param "s": (.*)/);
        assert.throws(() => coerce('s', {}, false), TypeError, /\[stateManager\] Invalid value for string param "s": (.*)/);
        assert.throws(() => coerce('s', {}, 0.1), TypeError, /\[stateManager\] Invalid value for string param "s": (.*)/);
        assert.throws(() => coerce('s', {}, Math.PI), TypeError, /\[stateManager\] Invalid value for string param "s": (.*)/);
        assert.throws(() => coerce('s', {}, NaN), TypeError, /\[stateManager\] Invalid value for string param "s": (.*)/);
        assert.throws(() => coerce('s', {}, 0), TypeError, /\[stateManager\] Invalid value for string param "s": (.*)/);
        assert.throws(() => coerce('s', {}, null), TypeError, /\[stateManager\] Invalid value for string param "s": (.*)/);
        assert.throws(() => coerce('s', {}, /abc/), TypeError, /\[stateManager\] Invalid value for string param "s": (.*)/);
        assert.throws(() => coerce('s', {}, undefined), TypeError, /\[stateManager\] Invalid value for string param "s": (.*)/);
        assert.throws(() => coerce('s', {}, [0, 1, 2]), TypeError, /\[stateManager\] Invalid value for string param "s": (.*)/);
      });
    });

    describe('integer type', () => {
      const coerce = types.integer.coerceFunction;

      it('should coerce properly', () => {
        const def = types.integer.defaultOptions;
        assert.doesNotThrow(() => coerce('i', def, -100000));
        assert.doesNotThrow(() => coerce('i', def, -Infinity));
        assert.doesNotThrow(() => coerce('i', def, 0));

        assert.equal(coerce('i', def, -100000), -100000);
        assert.equal(coerce('i', def, -Infinity), -Infinity);
        assert.equal(coerce('i', def, 0), 0);

        assert.throws(() => coerce('i', def, true), TypeError, /\[stateManager\] Invalid value for integer param "i": (.*)/);
        assert.throws(() => coerce('i', def, false), TypeError, /\[stateManager\] Invalid value for integer param "i": (.*)/);
        assert.throws(() => coerce('i', def, 0.1), TypeError, /\[stateManager\] Invalid value for integer param "i": (.*)/);
        assert.throws(() => coerce('i', def, Math.PI), TypeError, /\[stateManager\] Invalid value for integer param "i": (.*)/);
        assert.throws(() => coerce('i', def, NaN), TypeError, /\[stateManager\] Invalid value for integer param "i": (.*)/);
        assert.throws(() => coerce('i', def, '10'), TypeError, /\[stateManager\] Invalid value for integer param "i": (.*)/);
        assert.throws(() => coerce('i', def, null), TypeError, /\[stateManager\] Invalid value for integer param "i": (.*)/);
        assert.throws(() => coerce('i', def, /abc/), TypeError, /\[stateManager\] Invalid value for integer param "i": (.*)/);
        assert.throws(() => coerce('i', def, undefined), TypeError, /\[stateManager\] Invalid value for integer param "i": (.*)/);
        assert.throws(() => coerce('i', def, [0, 1, 2]), TypeError, /\[stateManager\] Invalid value for integer param "i": (.*)/);
      });

      it('should clip properly', () => {
        const def = { min: 0, max: 2 };
        assert.equal(coerce('i', def, -1), 0, 'should clip min');
        assert.equal(coerce('i', def, 3), 2, 'should clip max');
      });;
    });

    describe('float type', () => {
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

        assert.throws(() => coerce('f', def, true), TypeError, /\[stateManager\] Invalid value for float param "f": (.*)/);
        assert.throws(() => coerce('f', def, false), TypeError, /\[stateManager\] Invalid value for float param "f": (.*)/);
        assert.throws(() => coerce('f', def, NaN), TypeError, /\[stateManager\] Invalid value for float param "f": (.*)/);
        assert.throws(() => coerce('f', def, '10'), TypeError, /\[stateManager\] Invalid value for float param "f": (.*)/);
        assert.throws(() => coerce('f', def, null), TypeError, /\[stateManager\] Invalid value for float param "f": (.*)/);
        assert.throws(() => coerce('f', def, /abc/), TypeError, /\[stateManager\] Invalid value for float param "f": (.*)/);
        assert.throws(() => coerce('f', def, undefined), TypeError, /\[stateManager\] Invalid value for float param "f": (.*)/);
        assert.throws(() => coerce('f', def, [0, 1, 2]), TypeError, /\[stateManager\] Invalid value for float param "f": (.*)/);
      });

      it('should clip properly', () => {
        const def = { min: -0.3, max: Math.PI };
        assert.equal(coerce('f', def, -1), -0.3, 'should clip min');
        assert.equal(coerce('f', def, 6), Math.PI, 'should clip max');
      });;
    });

    describe('enum type', () => {
      const coerce = types.enum.coerceFunction;

      it('should coerce properly', () => {
        const def = { list: ['a', 1] };

        assert.doesNotThrow(() => coerce('e', def, 'a'));
        assert.doesNotThrow(() => coerce('e', def, 1));
        assert.throws(() => coerce('e', def, 'e'), TypeError, /\[stateManager\] Invalid value for enum param "e": (.*)/);
        assert.throws(() => coerce('e', def, '1'), TypeError, /\[stateManager\] Invalid value for enum param "e": (.*)/);
      });
    });
  });


  // ---------------------------------------------------------------
  // DEEP-EQUAL
  // ---------------------------------------------------------------
  describe('deep-equal', () => {
    it('should work as expected for all our types', () => {
      assert.equal(equal(true, true), true);
      assert.equal(equal('str', 'str'), true);
      assert.equal(equal(1, 1), true);
      assert.equal(equal(0.1, 0.1), true);
      assert.equal(equal(['a', 'b', 'c'], ['a', 'b', 'c']), true);
      assert.equal(equal({ a: true }, { a: true }), true);
      assert.equal(equal({ a: true, b: [0, 1] }, { a: true, b: [0, 1] }), true);
      assert.equal(equal({ a: true, b: [0, 1] }, { a: true, b: [0, 2] }), false);
    });
  });
});






































