/** @private */
export function packStringMessage(channel, ...args) {
  return JSON.stringify([channel, args]);
}

/** @private */
export function unpackStringMessage(data) {
  return JSON.parse(data);
}
