import { getTime } from '@ircam/sc-gettime';
import {
  packBinaryMessage,
  unpackBinaryMessage,
  packStringMessage,
  unpackStringMessage,
} from '../common/sockets-utils.js';

// Status codes:
//
// CONNECTING = 0;
// OPEN = 1;
// CLOSING = 2;
// CLOSED = 3;
// READY_STATES = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];

/**
 * The Socket class is a simple publish / subscribe wrapper built on top of the
 * [ws](https://github.com/websockets/ws) library. An instance of {@link server.Socket}
 * is automatically created per client when it connects (see {@link server.Client#socket}).
 *
 * _Important: In most cases, you should consider using a {@link client.SharedState}
 * rather than directly using the sockets._
 *
 * The Socket class contains two different WebSockets:
 * - a socket configured with `binaryType = 'blob'` for JSON compatible data
 *  types (i.e. string, number, boolean, object, array and null).
 * - a socket configured with `binaryType= 'arraybuffer'` for efficient streaming
 *  of binary data.
 *
 * @memberof server
 * @hideconstructor
 */
class Socket {
  constructor(ws, binaryWs, rooms, sockets, options = {}) {
    /**
     * Configuration object
     *
     * @type {object}
     */
    this.config = {
      pingInterval: 5 * 1000,
      ...options,
    };

    /**
     * `ws` socket instance configured with `binaryType=blob` (string)
     *
     * @type {object}
     * @private
     */
    this.ws = ws;

    /**
     * `ws` socket instance configured with `binaryType=arraybuffer` (TypedArray)
     *
     * @type {object}
     * @private
     */
    this.binaryWs = binaryWs;

    /**
     * Reference to the sockets object, is mainly dedicated to allow
     * broadcasting from a given socket instance.
     *
     * @type {server.Sockets}
     * @example
     * socket.sockets.broadcast('my-room', this, 'update-value', 1);
     */
    this.sockets = sockets;

    /**
     * Reference to the rooms object
     *
     * @type {Map}
     * @private
     */
    this.rooms = rooms;

    /** @private */
    this._stringListeners = new Map();
    /** @private */
    this._binaryListeners = new Map();

    // ----------------------------------------------------------
    // init string socket
    // ----------------------------------------------------------
    this.ws.addEventListener('message', e => {
      const [channel, args] = unpackStringMessage(e.data);
      this._emit(false, channel, ...args);
    });

    // broadcast all `ws` "native" events
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
      this.ws.addEventListener(eventName, e => {
        this._emit(false, eventName, e.data);
      });
    });

    // ----------------------------------------------------------
    // init binary socket
    // ----------------------------------------------------------
    this.binaryWs.addEventListener('message', e => {
      const [channel, data] = unpackBinaryMessage(e.data);
      this._emit(true, channel, data);
    });

    // broadcast all `ws` "native" events
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
      this.binaryWs.addEventListener(eventName, e => {
        this._emit(true, eventName, e.data);
      });
    });

    // heartbeat system (run only on string socket), adapted from:
    // https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
    this._isAlive = true;
    let msg = {
      type: 'add-measurement',
      value: {
        ping: 0,
        pong: 0,
      },
    };

    // heartbeat system, only on "regular" socket
    this.ws.on('pong', () => {
      this._isAlive = true;

      msg.value.pong = getTime();
      this.sockets._latencyStatsWorker.postMessage(msg);
    });

    this._intervalId = setInterval(() => {
      if (this._isAlive === false) {
        // emit a 'close' event to go trough all the disconnection pipeline
        this._emit(false, 'close');
        return;
      }

      this._isAlive = false;
      msg.value.ping = getTime();

      this.ws.ping();
    }, this.config.pingInterval);
  }

  /**
   * Removes all listeners and immediately close the two sockets. Is automatically
   * called on `server.stop()`
   *
   * @private
   */
  terminate() {
    // clear ping/pong check
    clearInterval(this._intervalId);
    // clean rooms
    for (let [_key, room] of this.rooms) {
      room.delete(this);
    }

    // clear references to sockets and rooms
    this.sockets = null;
    this.rooms = null;

    // clear all listeners
    this._stringListeners.clear();
    this._binaryListeners.clear();

    // clear "native" listeners
    [this.binaryWs, this.ws].forEach((socket) => {
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
        socket.removeAllListeners(eventName);
      });
    });

    // clear binarySocket as this is called from the string one.
    this.binaryWs.terminate();
    this.ws.terminate();
  }

  /**
   * @param {boolean} binary - Emit to either the string or binary socket.
   * @param {string} channel - Channel name.
   * @param {...*} args - Content of the message.
   * @private
   */
  _emit(binary, channel, ...args) {
    const listeners = binary ? this._binaryListeners : this._stringListeners;

    if (listeners.has(channel)) {
      const callbacks = listeners.get(channel);
      callbacks.forEach(callback => callback(...args));
    }
  }

  /**
   * @param {Function[]} listeners - List of listeners, either for the string or binary socket.
   * @param {string} channel - Channel name.
   * @param {Function} callback - The function to be added to the listeners.
   * @private
   */
  _addListener(listeners, channel, callback) {
    if (!listeners.has(channel)) {
      listeners.set(channel, new Set());
    }

    const callbacks = listeners.get(channel);
    callbacks.add(callback);
  }

  /**
   * @param {Function[]} listeners - List of listeners, either for the string or binary socket.
   * @param {string} channel - Channel name.
   * @param {Function} callback - The function to be removed from the listeners.
   * @private
   */
  _removeListener(listeners, channel, callback) {
    if (listeners.has(channel)) {
      const callbacks = listeners.get(channel);
      callbacks.delete(callback);

      if (callbacks.size === 0) {
        listeners.delete(channel);
      }
    }
  }

  /**
   * @param {Function[]} listeners - List of listeners, either for the string or binary socket.
   * @param {string} [channel=null] - Channel name of the listeners to remove. If null
   *  all the listeners are cleared.
   * @private
   */
  _removeAllListeners(listeners, channel) {
    if (channel === null) {
      listeners.clear();
    } else if (listeners.has(channel)) {
      listeners.delete(channel);
    }
  }

  /**
   * Add the socket to a room
   *
   * @param {string} roomId - Id of the room.
   */
  addToRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    const room = this.rooms.get(roomId);
    room.add(this);
  }

  /**
   * Remove the socket from a room
   *
   * @param {string} roomId - Id of the room.
   */
  removeFromRoom(roomId) {
    if (this.rooms.has(roomId)) {
      const room = this.rooms.get(roomId);
      room.delete(this);
    }
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

    // 0 CONNECTING  Socket has been created. The connection is not yet open.
    // 1 OPEN  The connection is open and ready to communicate.
    // 2 CLOSING The connection is in the process of closing.
    // 3 CLOSED  The connection is closed or couldn't be opened.
    if (this.ws.readyState === 1) {
      this.ws.send(msg, (err) => {
        if (err) {
          console.error('error sending msg:', channel, args, err);
        }
      });
    }
  }

  /**
   * Listen messages with JSON compatible data types on a given channel.
   *
   * @param {string} channel - Channel name.
   * @param {Function} callback - Callback to execute when a message is received,
   *  arguments of the callback function will match the arguments sent using the
   *  {@link server.Socket#send} method.
   */
  addListener(channel, callback) {
    this._addListener(this._stringListeners, channel, callback);
  }

  /**
   * Remove a listener of messages with JSON compatible data types from a given channel.
   *
   * @param {string} channel - Channel name.
   * @param {Function} callback - Callback to remove.
   */
  removeListener(channel, callback) {
    this._removeListener(this._stringListeners, channel, callback);
  }

  /**
   * Remove all listeners of messages with JSON compatible data types.
   *
   * @param {string} channel - Channel name.
   */
  removeAllListeners(channel = null) {
    this._removeAllListeners(this._stringListeners, channel);
  }

  /**
   * Send binary messages on a given channel.
   *
   * @param {string} channel - Channel name.
   * @param {TypedArray} typedArray - Binary data to be sent.
   */
  sendBinary(channel, typedArray) {
    const msg = packBinaryMessage(channel, typedArray);

    this.binaryWs.send(msg, (err) => {
      if (err) {
        console.error('error sending msg:', channel, typedArray);
      }
    });
  }

  /**
   * Listen binary messages on a given channel
   *
   * @param {string} channel - Channel name.
   * @param {Function} callback - Callback to execute when a message is received.
   */
  addBinaryListener(channel, callback) {
    this._addListener(this._binaryListeners, channel, callback);
  }

  /**
   * Remove a listener of binary compatible messages from a given channel
   *
   * @param {string} channel - Channel name.
   * @param {Function} callback - Callback to remove.
   */
  removeBinaryListener(channel, callback) {
    this._removeListener(this._binaryListeners, channel, callback);
  }

  /**
   * Remove all listeners of binary compatible messages on a given channel
   *
   * @param {string} channel - Channel of the message.
   */
  removeAllBinaryListeners(channel = null) {
    this._removeAllListeners(this._binaryListeners, channel);
  }
}

export default Socket;
