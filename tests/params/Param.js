const path = require('path');
const assert = require('chai').assert;

const { BooleanParam, StringParam } = require('../../common/params/Params.js');

describe('BooleanParam', (t) => {
  const myBoolean = new BooleanParam('my-boolean', true);

  it('should coerce properly', () => {
    assert.doesNotThrow(() => myBoolean._coerce(true));
    assert.doesNotThrow(() => myBoolean._coerce(false));
    assert.throws(() => myBoolean._coerce(0.1), TypeError, /\[BooleanParam\] Invalid value for param/);
    assert.throws(() => myBoolean._coerce(-100000), TypeError, /\[BooleanParam\] Invalid value for param/);
    assert.throws(() => myBoolean._coerce(Math.PI), TypeError, /\[BooleanParam\] Invalid value for param/);
    assert.throws(() => myBoolean._coerce(-Infinity), TypeError, /\[BooleanParam\] Invalid value for param/);
    assert.throws(() => myBoolean._coerce(NaN), TypeError, /\[BooleanParam\] Invalid value for param/);
    assert.throws(() => myBoolean._coerce(0), TypeError, /\[BooleanParam\] Invalid value for param/);
    assert.throws(() => myBoolean._coerce('10'), TypeError, /\[BooleanParam\] Invalid value for param/);
    assert.throws(() => myBoolean._coerce(null), TypeError, /\[BooleanParam\] Invalid value for param/);
    assert.throws(() => myBoolean._coerce(/abc/), TypeError, /\[BooleanParam\] Invalid value for param/);
    assert.throws(() => myBoolean._coerce(undefined), TypeError, /\[BooleanParam\] Invalid value for param/);
    assert.throws(() => myBoolean._coerce([0, 1, 2]), TypeError, /\[BooleanParam\] Invalid value for param/);
  });
});

describe('StringParam', (t) => {
  const myString = new StringParam('my-string', '');

  it('should coerce properly', () => {
    assert.doesNotThrow(() => myString._coerce('10'));
    assert.doesNotThrow(() => myString._coerce('a text'));
    assert.throws(() => myString._coerce(-100000), TypeError, /\[StringParam\] Invalid value for param/);
    assert.throws(() => myString._coerce(-Infinity), TypeError, /\[StringParam\] Invalid value for param/);
    assert.throws(() => myString._coerce(true), TypeError, /\[StringParam\] Invalid value for param/);
    assert.throws(() => myString._coerce(false), TypeError, /\[StringParam\] Invalid value for param/);
    assert.throws(() => myString._coerce(0.1), TypeError, /\[StringParam\] Invalid value for param/);
    assert.throws(() => myString._coerce(Math.PI), TypeError, /\[StringParam\] Invalid value for param/);
    assert.throws(() => myString._coerce(NaN), TypeError, /\[StringParam\] Invalid value for param/);
    assert.throws(() => myString._coerce(0), TypeError, /\[StringParam\] Invalid value for param/);
    assert.throws(() => myString._coerce(null), TypeError, /\[StringParam\] Invalid value for param/);
    assert.throws(() => myString._coerce(/abc/), TypeError, /\[StringParam\] Invalid value for param/);
    assert.throws(() => myString._coerce(undefined), TypeError, /\[StringParam\] Invalid value for param/);
    assert.throws(() => myString._coerce([0, 1, 2]), TypeError, /\[StringParam\] Invalid value for param/);
  });
});


// describe('integer', (t) => {
//   const test = paramTemplates.integer.typeCheckFunction;

//   t.doesNotThrow(() => test(-100000, {}), 'should type check properly');
//   t.doesNotThrow(() => test(-Infinity, {}), 'should type check properly');
//   t.doesNotThrow(() => test(0, {}), 'should type check properly');
//   t.throws(() => test(true, {}), 'should type check properly');
//   t.throws(() => test(false, {}), 'should type check properly');
//   t.throws(() => test(0.1, {}), 'should type check properly');
//   t.throws(() => test(Math.PI, {}), 'should type check properly');
//   t.throws(() => test(NaN, {}), 'should type check properly');
//   t.throws(() => test('10', {}), 'should type check properly');
//   t.throws(() => test(null, {}), 'should type check properly');
//   t.throws(() => test(/abc/, {}), 'should type check properly');
//   t.throws(() => test(undefined, {}), 'should type check properly');
//   t.throws(() => test([0, 1, 2], {}), 'should type check properly');


//   const def = { min: 0, max: 2 };
//   t.equal(test(-1, def), 0, 'should clip min');
//   t.equal(test(3, def), 2, 'should clip max');

//   t.end();
// });

// describe('float', (t) => {
//   const test = paramTemplates.float.typeCheckFunction;

//   t.doesNotThrow(() => test(-100000, {}), 'should type check properly');
//   t.doesNotThrow(() => test(-Infinity, {}), 'should type check properly');
//   t.doesNotThrow(() => test(0, {}), 'should type check properly');
//   t.doesNotThrow(() => test(0.1, {}), 'should type check properly');
//   t.doesNotThrow(() => test(Math.PI, {}), 'should type check properly');
//   t.throws(() => test(true, {}), 'should type check properly');
//   t.throws(() => test(false, {}), 'should type check properly');
//   t.throws(() => test(NaN, {}), 'should type check properly');
//   t.throws(() => test('10', {}), 'should type check properly');
//   t.throws(() => test(null, {}), 'should type check properly');
//   t.throws(() => test(/abc/, {}), 'should type check properly');
//   t.throws(() => test(undefined, {}), 'should type check properly');
//   t.throws(() => test([0, 1, 2], {}), 'should type check properly');


//   const def = { min: 0, max: 2 };
//   t.equal(test(-1, def), 0, 'should clip min');
//   t.equal(test(3, def), 2, 'should clip max');

//   t.end();
// });


// describe('enum', (t) => {
//   const test = paramTemplates.enum.typeCheckFunction
//   const def = { list: ['a', '1'] };

//   t.doesNotThrow(() => test('a', def), 'should type check properly');
//   t.throws(() => test('c', def), 'should type check properly');
//   t.throws(() => test(1, def), 'should type check properly');

//   t.end();
// });

