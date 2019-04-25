import debug from 'debug';
import {
  packBinaryMessage,
  unpackBinaryMessage,
  packStringMessage,
  unpackStringMessage,
} from '../../utils/sockets-encoder-decoder';

const log = debug('soundworks:socket');

// close
//   Fired when a connection with a websocket is closed.
//   Also available via the onclose property
// error
//   Fired when a connection with a websocket has been closed because of an error, such as whensome data couldn't be sent.
//   Also available via the onerror property.
// message
//   Fired when data is received through a websocket.
//   Also available via the onmessage property.
// open
//   Fired when a connection with a websocket is opened.
//   Also available via the onopen property.

/**
@todo
  - use isomorphic ws ? (does seems like a perfect idea)
  - review stateListener, not very elegant... (maybe v3)
  -
*/

/**
 * Simple wrapper with simple pubsub system built on top of `ws` socket.
 * The socket re-emits all "native" ws events.
 *
 * @see https://github.com/websockets/ws
 *
 * @memberof module:soundworks/client
 */
const socket = {
  /**
   * WebSocket instance (string protocol - binaryType = 'string').
   */
  ws: null,

  _stringListeners: new Map(),
  _binaryListeners: new Map(),

  /**
   * Initialize a websocket connection with the server
   * @param {String} clientType - `client.type` {@link client}
   * @param {Object} options - Options of the socket
   * @param {Array<String>} options.path - Defines where socket should find the `socket.io` file
   */
  init(clientType, options) {
    /**
     * Configuration object
     * @type {Object}
     * @name config
     * @instance
     * @memberof module:soundworks/client.socket
     */
    this.config = Object.assign({
      pingInterval: 5 * 1000,
    }, options);

    // open the web socket
    const path = 'socket';
    const protocol = window.location.protocol.replace(/^http?/, 'ws');
    const { hostname, port } = window.location;
    const url = `${protocol}//${hostname}:${port}/${path}?clientType=${clientType}`;

    // ----------------------------------------------------------
    // init string socket
    // ----------------------------------------------------------
    const stringSocketUrl = `${url}&binary=0`;
    this.ws = new WebSocket(stringSocketUrl);
    log(`string socket initialized - url: ${stringSocketUrl}`);

    // parse incoming messages for pubsub
    this.ws.addEventListener('message', e => {
      const [channel, args] = JSON.parse(e.data);
      this._emit(false, channel, ...args);
    });

    // broadcast all `WebSockets` "native" events
    [ 'open',
      'close',
      'error',
      'upgrade',
      'message',
    ].forEach(eventName => {
      this.ws.addEventListener(eventName, (e) => {
        this._emit(false, eventName, e.data);
      });
    });

    // ----------------------------------------------------------
    // init binary socket
    // ----------------------------------------------------------
    const binarySocketUrl = `${url}&binary=1`;
    this.binaryWs = new WebSocket(binarySocketUrl);
    this.binaryWs.binaryType = 'arraybuffer';
    log(`binary socket initialized - url: ${binarySocketUrl}`);

    // parse incoming messages for pubsub
    this.binaryWs.addEventListener('message', e => {
      const [channel, args] = JSON.parse(e.data);
      this._emit(true, channel, ...args);
    });

    // broadcast all `WebSockets` "native" events
    [ 'open',
      'close',
      'error',
      'upgrade',
      'message',
    ].forEach(eventName => {
      this.binaryWs.addEventListener(eventName, (e) => {
        this._emit(true, eventName, e.data);
      });
    });
  },

  _emit(binary, channel, ...args) {
    const listeners = binary ? this._binaryListeners : this._stringListeners;

    if (listeners.has(channel)) {
      const callbacks = this._stringListeners.get(channel);
      callbacks.forEach(callback => callback(...args));
    }
  },

  /**
   * Sends JSON compatible WebSocket messages on a given channel
   *
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type)
   */
  send(channel, ...args) {
    const msg = JSON.stringify([channel, args]);
    this.ws.send(msg);
  },

  /**
   * Listen JSON compatible WebSocket messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to execute when a message is received
   */
  receive(channel, callback) {
    if (!this._stringListeners.has(channel)) {
      this._stringListeners.set(channel, new Set());
    }

    const listeners = this._stringListeners.get(channel);
    listeners.add(callback);
  },

  /**
   * Remove a listener from JSON compatible WebSocket messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to cancel
   */
  removeListener(channel, callback) {
    if (this._stringListeners.has(channel)) {
      const listeners = this._stringListeners.get(channel);
      listeners.delete(callback);
    }
  },

  /**
   * Sends binary WebSocket messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {TypedArray} typedArray - Data to send
   */
  sendBinary(channel, typedArray) {

  },

  /**
   * Listen binary WebSocket messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to execute when a message is received
   */
  receiveBinary(channel, typedArray) {

  },

  /**
   * Remove a listener from binary compatible WebSocket messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to cancel
   */
  removeBinaryListener(channel, callback) {
    // if (this._stringListeners.has(channel)) {
    //   const listeners = this._stringListeners.get(channel);
    //   listeners.delete(callback);
    // }
  },
};

// aliases
socket.on = socket.receive;

export default socket;
