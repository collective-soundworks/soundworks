import 'fast-text-encoding';
import root from 'window-or-global';

const encoder = new root.TextEncoder('utf-8');
const decoder = new root.TextDecoder('utf-8');

const types = [
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
  'BigInt64Array',
  'BigUint64Array',
];

// @note - probably some room for optimizations

/** @private */
export function packBinaryMessage(channel, data) {
  const channelBuffer = encoder.encode(channel);
  const channelSize = channelBuffer.byteLength;
  const startOffset = Math.ceil((channelSize + 3) / data.BYTES_PER_ELEMENT) * data.BYTES_PER_ELEMENT;
  const bufferSize = startOffset + data.byteLength;
  const typeName = data.constructor.name;
  const typeIndex = types.indexOf(typeName);

  if (typeIndex === -1) {
    throw new Error(`Invalid TypedArray type: ${typeName}`);
  }

  const view = new Uint8Array(bufferSize);
  view[0] = channelSize;
  view[1] = typeIndex;
  view[2] = startOffset;

  view.set(channelBuffer, 3, channelSize);
  view.set(new Uint8Array(data.buffer), startOffset, data.byteLength);

  return view.buffer;
}

/** @private */
export function unpackBinaryMessage(buffer /* arraybuffer */) {
  const infos = new Uint8Array(buffer, 0, 3);
  const channelSize = infos[0];
  const typeIndex = infos[1];
  const startOffset = infos[2];

  // need to slice as the library recreates a UInt8Array from the whole buffer
  // @todo - see if this copy could be avoided (probably needs a pull request)
  const channelBuffer = new Uint8Array(buffer.slice(3, 3 + channelSize));
  const channel = decoder.decode(channelBuffer);
  const type = types[typeIndex];
  // slice (copy) the underlying ArrayBuffer to create a clean TypedArray
  const data = new root[type](buffer.slice(startOffset));

  return [channel, data];
}

/** @private */
export function packStringMessage(channel, ...args) {
  return JSON.stringify([channel, args]);
}

/** @private */
export function unpackStringMessage(data) {
  return JSON.parse(data);
}
