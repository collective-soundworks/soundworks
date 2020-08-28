import {
  packBinaryMessage,
  unpackBinaryMessage,
  packStringMessage,
  unpackStringMessage,
} from '../common/sockets-encoder-decoder.js';

const noop = () => {};
let counter = 0;
const CONNECTING = 0;
const OPEN = 1;
const CLOSING = 2;
const CLOSED = 3;
const READY_STATES = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];

/**
 * Simple wrapper with simple pubsub system built on top of `ws` sockets.
 * The abstraction contains two different socket:
 * - one configured for string (JSON compatible) messages
 * - one configured with `binaryType=arraybuffer` for streaming data more
 *   efficiently.
 *
 * @see https://github.com/websockets/ws
 *
 * @memberof server
 */
class Socket {
  constructor(ws, binaryWs, rooms, sockets, options = {}) {

    /**
     * Reference to the sockets object, is mainly dedicated to allow
     * broadcasting from a given socket instance.
     * @type {server.Sockets}
     * @example
     * socket.sockets.broadcast('my-room', this, 'update-value', 1);
     */
    this.sockets = sockets;

    /**
     * `ws` socket instance configured with `binaryType=blob` (string)
     * @private
     * @type {Object}
     */
    this.ws = ws;

    /**
     * `ws` socket instance configured with `binaryType=arraybuffer` (TypedArray)
     * @private
     * @type {Object}
     */
    this.binaryWs = binaryWs;

    /**
     * `ws` socket instance configured with `binaryType=arraybuffer` (TypedArray)
     * @private
     * @type {Map}
     */
    this.rooms = rooms

    /**
     * Configuration object
     * @type {Object}
     */
    this.config = {
      pingInterval: 5 * 1000,
      ...options,
    };

    this._stringListeners = new Map();
    this._binaryListeners = new Map();

    // ----------------------------------------------------------
    // init string socket
    // ----------------------------------------------------------
    this.ws.addEventListener('message', e => {
      const [channel, args] = unpackStringMessage(e.data);
      this._emit(false, channel, ...args);
    });

    // broadcast all `ws` "native" events
    [ 'close',
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
    [ 'close',
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
    // heartbeat system, only on "regular" socket
    this.ws.on('pong', () => {
      this._isAlive = true
    });

    this._intervalId = setInterval(() => {
      if (this._isAlive === false) {
        // emit a 'close' event to go trough all the disconnection pipeline
        this._emit(false, 'close');
        return;
        // return this.ws.terminate();
      }

      this._isAlive = false;
      this.ws.ping(noop);
    }, this.config.pingInterval);

    this.ws.addListener('error', (err) => {
      // console.log(this.clientId, err);
    });
  }

  /**
   * Called when the string socket closes (aka client reload).
   */
  /** @private */
  terminate() {
    clearInterval(this._intervalId);
    // clean rooms
    for (let [key, room] of this.rooms) {
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
      [ 'close',
        'error',
        'message',
        'open',
        'ping',
        'pong',
        'unexpected-response',
        'upgrade'
      ].forEach(eventName => {
        socket.removeAllListeners(eventName);
      })
    });

    // clear binarySocket as this is called from the string one.
    this.binaryWs.terminate();
    this.ws.terminate();
  }

  /** @private */
  _emit(binary, channel, ...args) {
    const listeners = binary ? this._binaryListeners : this._stringListeners;

    if (listeners.has(channel)) {
      const callbacks = listeners.get(channel);
      callbacks.forEach(callback => callback(...args));
    }
  }

  /** @private */
  _addListener(listeners, channel, callback) {
    if (!listeners.has(channel)) {
      listeners.set(channel, new Set());
    }

    const callbacks = listeners.get(channel);
    callbacks.add(callback);
  }

  /** @private */
  _removeListener(listeners, channel, callback) {
    if (listeners.has(channel)) {
      const callbacks = listeners.get(channel);
      callbacks.delete(callback);

      if (callbacks.size === 0) {
        listeners.delete(channel);
      }
    }
  }

  /** @private */
  _removeAllListeners(listeners, channel) {
    if (listeners.has(channel)) {
      listeners.delete(channel)
    }
  }

  /**
   * Add the socket to a room
   * @param {String} roomId - Id of the room
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
   * @param {String} roomId - Id of the room
   */
  removeFromRoom(roomId) {
    if (this.rooms.has(roomId)) {
      const room = this.rooms.get(roomId);
      room.delete(this);
    }
  }

  /**
   * Sends JSON compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type)
   */
  send(channel, ...args) {
    const msg = packStringMessage(channel, ...args);

    this.ws.send(msg, (err) => {
      if (err) {
        console.error('error sending msg:', channel, args, err);
      }
    });
  }

  /**
   * Listen JSON compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {Function} callback - Callback to execute when a message is received
   */
  addListener(channel, callback) {
    this._addListener(this._stringListeners, channel, callback);
  }

  /**
   * Remove a listener from JSON compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {Function} callback - Callback to cancel
   */
  removeListener(channel, callback) {
    this._removeListener(this._stringListeners, channel, callback);
  }

  /**
   * Remove all listeners from JSON compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   */
  removeAllListeners(channel) {
    this._removeAllListeners(this._stringListeners, channel);
  }

  /**
   * Sends binary messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {TypedArray} typedArray - Data to send
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
   * @param {String} channel - Channel of the message
   * @param {Function} callback - Callback to execute when a message is received
   */
  addBinaryListener(channel, callback) {
    this._addListener(this._binaryListeners, channel, callback);
  }

  /**
   * Remove a listener from binary compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {Function} callback - Callback to cancel
   */
  removeBinaryListener(channel, callback) {
    this._removeListener(this._binaryListeners, channel, callback);
  }

  /**
   * Remove all listeners from binary compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   */
  removeAllBinaryListeners(channel) {
    this._removeAllListeners(this._binaryListeners, channel);
  }
}

export default Socket;
