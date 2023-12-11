import { assert } from 'chai';
import equal from 'fast-deep-equal';

// make sure the lib works well for our cases
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
