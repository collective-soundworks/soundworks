const assert = require('chai').assert;
const equal = require('fast-deep-equal');

console.log('* ------------------------------------- *');
console.log('* checking fast-deep-equal library...');
console.log('* ------------------------------------- *');

describe('checking fast-deep-equal library...', (
  it('should work as expected for all our types', () => {
    assert.equal(equal(true, true), true);
    assert.equal(equal('str', 'str'), true);
    assert.equal(equal(1, 1), true);
    assert.equal(equal(0.1, 0.1), true);
    assert.equal(equal(['a', 'b', 'c'], ['a', 'b', 'c']), true);
    assert.equal(equal({ a: true }, { a: true }), true);
    assert.equal(equal({ a: true, b: [0, 1] }, { a: true, b: [0, 1] }), true);
    assert.equal(equal({ a: true, b: [0, 1] }, { a: true, b: [0, 2] }), false);
  })
));
