const assert = require('chai').assert;
const ParameterBag = require('../../common/ParameterBag.js').default;
const { sharedOptions } = require('../../common/ParameterBag.js');

console.log('* ------------------------------------- *');
console.log('* class ParameterBag');
console.log('* ------------------------------------- *');

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

  it(`event type should be null when get after set`, () => {
    assert.deepEqual(params.set('event', 0.01), [0.01, true]);
    assert.strictEqual(params.get('event'), null);
  });
});

describe(`getSchema([name])`, () => {
  it(`should return schema`, () => {
    console.log(params.getSchema());
    console.log(params.getSchema('bool'));
  });
});








































