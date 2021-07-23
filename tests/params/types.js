const path = require('path');
const assert = require('chai').assert;

const types = require('../../common/params/types.js').default;

console.log('* ------------------------------------- *');
console.log('* types for ParameterBag');
console.log('* ------------------------------------- *');

console.log(types);

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

