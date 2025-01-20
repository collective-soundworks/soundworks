import { getTime } from '@ircam/sc-utils';
import {
  PING_INTERVAL,
  PING_MESSAGE,
  PONG_MESSAGE,
} from '../common/constants.js';
import {
  packStringMessage,
  unpackStringMessage,
} from '../common/sockets-utils.js';
import {
  kSocketsLatencyStatsWorker,
  kSocketsDebugPreventHeartBeat,
  kSocketsDeleteSocket,
} from './ServerSockets.js';

export const kSocketClientId = Symbol('soundworks:socket-client-id');
export const kSocketTerminate = Symbol('soundworks:socket-terminate');

/**
 * Simple publish / subscribe wrapper built on top of the
 * [ws](https://github.com/websockets/ws) library.
 *
 * An instance of {@link ServerSocket} is automatically created per client
 * when it connects (see {@link SeverClient#socket}).
 *
 * _Important: In most cases, you should consider using a {@link SharedState}
 * rather than directly using the Socket instance._
 *
 * @hideconstructor
 */
class ServerSocket {
  #socket = null;
  #sockets = null;
  #listeners = new Map();
  #heartbeatId = null;

  constructor(ws, sockets) {
    /**
     * `ws` socket instance configured with `binaryType=blob` (string)
     * @type {object}
     */
    this.#socket = ws;

    /**
     * Reference to the sockets object, is mainly dedicated to allow
     * broadcasting from a given socket instance.
     *
     * @type {ServerSockets}
     * @example
     * socket.sockets.broadcast('my-room', this, 'update-value', 1);
     */
    this.#sockets = sockets;

    // @todo - review
    const msg = {
      type: 'add-measurement',
      value: {
        ping: 0,
        pong: 0,
      },
    };

    let heartbeatMissed = 0;
    // heartbeat system (run only on string socket), adapted from:
    // https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
    this.#socket.addEventListener('message', e => {
      if (e.data === PONG_MESSAGE) {
        heartbeatMissed = 0;

        msg.value.pong = getTime();
        this.#sockets[kSocketsLatencyStatsWorker].postMessage(msg);
        // do not propagate ping / pong messages
        return;
      }

      const [channel, args] = unpackStringMessage(e.data);
      this.#dispatchEvent(channel, ...args);
    });

    this.#heartbeatId = setInterval(() => {
      // we didn't receive the pong message
      if (heartbeatMissed > 0) {
        // Emit a 'close' event to go trough all the disconnection pipeline
        //
        // @note - this seems to create false positive disconnections when
        // client is busy, e.g. when loading large sound files so let's just warn
        // until we gather more feedback
        // cf. https://making.close.com/posts/reliable-websockets/
        console.warn(`ClientSocket (id: ${this[kSocketClientId]}) did not respond to ping message in time (missed: ${heartbeatMissed},  interval: ${PING_INTERVAL})`);
        // this.#dispatchEvent('close');
        // return;
      }

      heartbeatMissed += 1;
      msg.value.ping = getTime();

      this.#socket.send(PING_MESSAGE);
    }, PING_INTERVAL);

    // for testing purpose
    if (this.#sockets[kSocketsDebugPreventHeartBeat] === true) {
      clearInterval(this.#heartbeatId);
    }

    // propagate "native" events
    [
      'close',
      'error',
      'message',
      'open',
      'ping',
      'pong',
      'unexpected-response',
      'upgrade',
    ].forEach(eventName => {
      this.#socket.addEventListener(eventName, e => {
        this.#dispatchEvent(eventName, e.data);
      });
    });
  }

  /**
   * Dispatch an event to the listeners of the given channel.
   * @param {string} channel - Channel name.
   * @param {...*} args - Content of the message.
   */
  #dispatchEvent(channel, ...args) {
    if (this.#listeners.has(channel)) {
      const callbacks = this.#listeners.get(channel);
      callbacks.forEach(callback => callback(...args));
    }
  }

  /**
   * Removes all listeners and immediately close the web socket.
   *
   * Is automatically called when socket is closed on the client side or when
   * Server is stopped
   *
   * @private
   */
  [kSocketTerminate]() {
    // clear ping / pong interval
    clearInterval(this.#heartbeatId);
    // remove socket from all rooms
    this.#sockets[kSocketsDeleteSocket](this);
    // clear references to sockets
    this.#sockets = null;
    // clear all listeners
    this.#listeners.clear();
    // clear native listeners
    [
      'close',
      'error',
      'message',
      'open',
      'ping',
      'pong',
      'unexpected-response',
      'upgrade',
    ].forEach(eventName => this.#socket.removeAllListeners(eventName));
    // terminate the socket
    this.#socket.terminate();
  }

  /**
   * Reference to the @link{ServerSockets} instance.
   */
  get sockets() {
    return this.#sockets;
  }

  /**
   * Ready state of the underlying socket instance.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState}
   * @type {number}
   */
  get readyState() {
    return this.#socket.readyState;
  }

  /**
   * Send messages with JSON compatible data types on a given channel.
   *
   * @param {string} channel - Channel name.
   * @param {...*} args - Payload of the message. As many arguments as needed, of
   *  JSON compatible data types (i.e. string, number, boolean, object, array and null).
   */
  send(channel, ...args) {
    const msg = packStringMessage(channel, ...args);

    // ## Status codes:
    // CONNECTING = 0; Socket has been created. The connection is not yet open.
    // OPEN = 1; The connection is open and ready to communicate.
    // CLOSING = 2; The connection is in the process of closing.
    // CLOSED = 3; The connection is closed or couldn't be opened.
    if (this.#socket.readyState === 1) {
      this.#socket.send(msg, (err) => {
        if (err) {
          console.error(`ServerSocket failed to send message:`, channel, args, err.message);
        }
      });
    }
  }

  /**
   * Listen messages with JSON compatible data types on a given channel.
   *
   * @param {string} channel - Channel name.
   * @param {Function} callback - Callback to execute when a message is received.
   *  Arguments of the callback function will match the arguments sent using the
   *  {@link ServerSocket#send} method.
   */
  addListener(channel, callback) {
    if (!this.#listeners.has(channel)) {
      this.#listeners.set(channel, new Set());
    }

    const callbacks = this.#listeners.get(channel);
    callbacks.add(callback);
  }

  /**
   * Remove a listener of messages with JSON compatible data types from a given channel.
   *
   * @param {string} channel - Channel name.
   * @param {Function} callback - Callback to remove.
   */
  removeListener(channel, callback) {
    if (this.#listeners.has(channel)) {
      const callbacks = this.#listeners.get(channel);
      callbacks.delete(callback);

      if (callbacks.size === 0) {
        this.#listeners.delete(channel);
      }
    }
  }

  /**
   * Remove all listeners of messages with JSON compatible data types.
   *
   * @param {string} channel - Channel name.
   */
  removeAllListeners(channel = null) {
    if (channel === null) {
      this.#listeners.clear();
    } else if (this.#listeners.has(channel)) {
      this.#listeners.delete(channel);
    }
  }
}

export default ServerSocket;
