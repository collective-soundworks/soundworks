import { assert } from 'chai';
import { encryptData, decryptData } from '../src/server/crypto.js';

describe('crypto', () => {
  it(`should encrypt / decrypt messages`, () => {
    const data = { a: true, b: 42 };
    const encrypted = encryptData(data);
    // console.log(encrypted);
    const decrypted = decryptData(encrypted);
    // console.log(decrypted);

    assert.deepEqual(data, decrypted);
  });
});
