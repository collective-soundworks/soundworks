import { BATCHED_TRANSPORT_CHANNEL } from './constants.js';

/**
 * This class proxies transports, i.e. WebSockets, to batch message sends
 * @private
 */
class BatchedTransport {
  #transport = null;
  #listeners = new Map();
  #stack = [];
  #sending = false;

  constructor(transport) {
    this.#transport = transport;

    this.#transport.addListener(BATCHED_TRANSPORT_CHANNEL, stack => {
      stack.forEach(entry => {
        const [channel, args] = entry;
        // server side the transport is the same EventEmitter instance
        // for both state manager server and client, so channel might not exist
        // one side or the other.
        if (this.#listeners.has(channel)) {
          const callbacks = this.#listeners.get(channel);
          callbacks.forEach(callback => callback(...args));
        }
      });
    });
  }

  addListener(channel, callback) {
    if (!this.#listeners.has(channel)) {
      this.#listeners.set(channel, new Set());
    }

    const callbacks = this.#listeners.get(channel);
    callbacks.add(callback);
  }

  async emit(channel, ...args) {
    this.#stack.push([channel, args]);

    if (!this.#sending) {
      this.#sending = true;
      await false;
      this.#sending = false;
      const stack = this.#stack;
      this.#stack = [];
      this.#transport.emit(BATCHED_TRANSPORT_CHANNEL, stack);
    }
  }

  removeListener(channel, callback) {
    if (!this.#listeners.has(channel)) {
      const callbacks = this.#listeners.get(channel);
      callbacks.delete(callback);
    }
  }

  removeAllListeners(channel = null) {
    if (channel === null) {
      this.#listeners.clear();
    } else if (this.#listeners.has(channel)) {
      const callbacks = this.#listeners.get(channel);
      callbacks.clear();
    }
  }
}

export default BatchedTransport;
