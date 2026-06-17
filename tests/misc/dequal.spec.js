import { assert } from 'chai';
import { dequal } from 'dequal';

// make sure the lib works well for our cases
describe('dequal', () => {
  it('should work as expected for all our types', () => {
    assert.equal(dequal(true, true), true);
    assert.equal(dequal('str', 'str'), true);
    assert.equal(dequal(1, 1), true);
    assert.equal(dequal(0.1, 0.1), true);
    assert.equal(dequal(['a', 'b', 'c'], ['a', 'b', 'c']), true);
    assert.equal(dequal({ a: true }, { a: true }), true);
    assert.equal(dequal({ a: true, b: [0, 1] }, { a: true, b: [0, 1] }), true);
    assert.equal(dequal({ a: true, b: [0, 1] }, { a: true, b: [0, 2] }), false);
  });
});
