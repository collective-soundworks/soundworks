const { packMessage, unpackMessage } = require('../utils/binary-encoder-decoder');
const channelName = 'a really strange channel $^selfkj"pçé!"';
// const test = [ 109, 121, 45, 102, 105, 114, 115, 116, 45, 116, 101, 115, 116 ];
// const uint8array = new Uint8Array(test);
// // var uint8array = new TextEncoder('utf-8').encode(channel);
// const string = new TextDecoder('utf-8').decode(uint8array);
// console.log(string);

const data = new Float32Array(10);
for (let i = 0; i < 10; i++) data[i] = i / 2 - 5;

const buffer = packBinaryMessage(channelName, data);
const [channel, data] = unpackBinaryMessage(buffer);

const repacked = packBinaryMessage(channel, data);
const res = unpackBinaryMessage(repacked);

console.log(res);
