import { delay } from '@ircam/sc-utils';

import { BATCHED_TRANSPORT_CHANNEL } from './constants.js';

/**
 * This class proxies transports given the SharedStateManager to batch messages
 *
 * @param {number} [options.wait=0] - Wait for given number of milliseconds
 *  for stacking messages before emitting on the network. If 0 is given, network
 *  message is emitted on next microtask
 * @private
 */
class BatchedTransport {
  constructor(transport, {
    transportBatchTimeout = 0, // in ms
  } = {}) {
    if (!Number.isFinite(transportBatchTimeout) || transportBatchTimeout < 0) {
      throw new TypeError(`Failed to construct BatchedTransport: The provided option 'transportBatchTimeout' must equal to or  greater than 0`);
    }

    this._transport = transport;
    this._listeners = new Map();
    this._stack = [];
    this._transportBatchTimeout = transportBatchTimeout;
    this._sending = false;

    this._transport.addListener(BATCHED_TRANSPORT_CHANNEL, stack => {
      stack.forEach(entry => {
        const [channel, args] = entry;
        // server side the transport is the same EventEmitter instance
        // for both state manager server and client, so channel might not exist
        // one side or the other.
        if (this._listeners.has(channel)) {
          const callbacks = this._listeners.get(channel);
          callbacks.forEach(callback => callback(...args));
        }
      });
    });
  }

  addListener(channel, callback) {
    if (!this._listeners.has(channel)) {
      this._listeners.set(channel, new Set());
    }

    const callbacks = this._listeners.get(channel);
    callbacks.add(callback);
  }

  async emit(channel, ...args) {
    this._stack.push([channel, args]);

    if (!this._sending) {
      this._sending = true;

      if (this._transportBatchTimeout === 0) {
        await false;
      } else {
        await delay(this._transportBatchTimeout);
      }

      this._sending = false;
      const stack = this._stack;
      this._stack = [];
      this._transport.emit(BATCHED_TRANSPORT_CHANNEL, stack);
    }
  }

  removeListener(channel, callback) {
    if (!this._listeners.has(channel)) {
      const callbacks = this._listeners.get(channel);
      callbacks.delete(callback);
    }
  }

  removeAllListeners(channel = null) {
    if (channel === null) {
      this._listeners.clear();
    } else if (this._listeners.has(channel)) {
      const callbacks = this._listeners.get(channel);
      callbacks.clear();
    }
  }
}

export default BatchedTransport;
