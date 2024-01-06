import { BATCHED_TRANSPORT_CHANNEL } from './constants.js'

class BatchedTransport {
  constructor(transport) {
    this._transport = transport;
    this._stack = [];
    this._listeners = new Map();
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
        };
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
      this._sending = await false;
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
