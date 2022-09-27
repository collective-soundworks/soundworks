const assert = require('chai').assert;

const { packBinaryMessage, unpackBinaryMessage } = require('../common/sockets-encoder-decoder.js');

describe(`common::<packBinaryMessage, unpackBinaryMessage>`, () => {
  it('should pack/unpack Float32Array', () => {
    const channel = 'a really strange channel $^selfkj"pçé!"';

    const data = new Float32Array(20);
    for (let i = 0; i < 20; i++) data[i] = i / 2 - 5;

    const buffer = packBinaryMessage(channel, data);
    const unpacked = unpackBinaryMessage(buffer);

    const repacked = packBinaryMessage(unpacked[0], unpacked[1]);
    const [finalChannel, finalData] = unpackBinaryMessage(repacked);

    assert.equal(channel, finalChannel);
    assert.deepStrictEqual(data, finalData);
  });

  it('should pack/unpack Float64Array', () => {
    const channel = 'a really strange channel $^selfkj"pçé!"';

    const data = new Float64Array(20);
    for (let i = 0; i < 20; i++) data[i] = i / 2 - 5;

    const buffer = packBinaryMessage(channel, data);
    const unpacked = unpackBinaryMessage(buffer);

    const repacked = packBinaryMessage(unpacked[0], unpacked[1]);
    const [finalChannel, finalData] = unpackBinaryMessage(repacked);

    assert.equal(channel, finalChannel);
    assert.deepStrictEqual(data, finalData);
  });

  it('should pack/unpack Uint8Array', () => {
    const channel = 'a really strange channel $^selfkj"pçé!"';

    const data = new Uint8Array(20);
    for (let i = 0; i < 20; i++) data[i] = i;

    const buffer = packBinaryMessage(channel, data);
    const unpacked = unpackBinaryMessage(buffer);

    const repacked = packBinaryMessage(unpacked[0], unpacked[1]);
    const [finalChannel, finalData] = unpackBinaryMessage(repacked);

    assert.equal(channel, finalChannel);
    assert.deepStrictEqual(data, finalData);
  });

  it('should pack/unpack Uint16Array', () => {
    const channel = 'a really strange channel $^selfkj"pçé!"';

    const data = new Uint16Array(20);
    for (let i = 0; i < 20; i++) data[i] = i;

    const buffer = packBinaryMessage(channel, data);
    const unpacked = unpackBinaryMessage(buffer);

    const repacked = packBinaryMessage(unpacked[0], unpacked[1]);
    const [finalChannel, finalData] = unpackBinaryMessage(repacked);

    assert.equal(channel, finalChannel);
    assert.deepStrictEqual(data, finalData);
  });
});
