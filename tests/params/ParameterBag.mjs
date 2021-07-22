// const assert = require('chai').assert;
// const ParameterBag = require('../../common/params/ParameterBag.js').default;

import { assert } from 'chai';
import ParameterBag from '../../common/params/ParameterBag.js';

console.log(ParameterBag);

describe('ParameterBag', () => {
  it('static validateSchema(schema)', () => {
    assert.throws(() => ParameterBag.validateSchema({
      noType: {}
    }), TypeError, `[schema] Invalid definition for param "noType": "type" key is required`)
  });
});
