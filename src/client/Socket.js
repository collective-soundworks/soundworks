import debug from 'debug';
import WebSocket from 'isomorphic-ws';
import {
  packBinaryMessage,
  unpackBinaryMessage,
  packStringMessage,
  unpackStringMessage,
} from '../common/sockets-encoder-decoder';

const log = debug('soundworks:socket');
// https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
const isBrowser = new Function("try {return this===window;}catch(e){ return false;}");

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

// @todo - use isomorphic ws ? (does seems like a perfect idea)

/**
 * Simple wrapper with simple pubsub system built on top of `ws` socket.
 * The abstraction actually open two different socket:
 * - one configured for string (JSON compatible) messages
 * - one configured with `binaryType=arraybuffer` for streaming data more
 *   efficiently.
 * The sockets also re-emits all "native" ws events.
 *
 * @see https://github.com/websockets/ws
 *
 * @memberof module:soundworks/client
 */
class Socket {
  constructor() {
    /**
     * WebSocket instance (string protocol - binaryType = 'string').
     */
    this.ws = null;

    this._stringListeners = new Map();
    this._binaryListeners = new Map();
  }

  /**
   * Initialize a websocket connection with the server
   * @param {String} clientType - `client.type` {@link client}
   * @param {Object} options - Options of the socket
   * @param {Array<String>} options.path - Defines where socket should find the `socket.io` file
   */
  init(clientType, config) {
    // unique key that allows to associate the two sockets to the same client.
    // note: the key is only used to pair to two sockets, so its usage is very
    // limited in time therefore a random number should hopefully be sufficient.
    const key = (Math.random() + '').replace(/^0./, '');

    // open web sockets
    const { path } = config.websockets;
    let url;

    if (isBrowser()) {
      const protocol = window.location.protocol.replace(/^http?/, 'ws');
      const { hostname, port } = window.location;
      url = `${protocol}//${hostname}:${port}/${path}`;
    } else {
      const protocol = config.useHttps ? 'wss:' : 'ws:';
      const { ip, port } = config;
      url = `${protocol}//${ip}:${port}/${path}`;
    }

    const queryParams = `clientType=${clientType}&key=${key}`;

    // ----------------------------------------------------------
    // init string socket
    // ----------------------------------------------------------
    const stringSocketUrl = `${url}?binary=0&${queryParams}`;

    this.ws = new WebSocket(stringSocketUrl);
    log(`string socket initialized - url: ${stringSocketUrl}`);

    const stringSocketPromise = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve);
    });

    // parse incoming messages for pubsub
    this.ws.addEventListener('message', e => {
      const [channel, args] = unpackStringMessage(e.data);
      this._emit(false, channel, ...args);
    });

    // broadcast all `WebSocket` native events
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
    const binarySocketUrl = `${url}?binary=1&${queryParams}`;

    this.binaryWs = new WebSocket(binarySocketUrl);
    this.binaryWs.binaryType = 'arraybuffer';
    log(`binary socket initialized - url: ${binarySocketUrl}`);

    const binarySocketPromise = new Promise((resolve, reject) => {
      this.binaryWs.addEventListener('open', resolve);
    });

    // parse incoming messages for pubsub
    this.binaryWs.addEventListener('message', e => {
      const [channel, data] = unpackBinaryMessage(e.data);
      this._emit(true, channel, data);
    });

    // broadcast all `WebSocket` native events
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

    // wait for both socket to be opened
    return Promise.all([stringSocketPromise, binarySocketPromise]);
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
      listeners.delete(channel);
    }
  }

  /**
   * Send JSON compatible messages on a given channel
   *
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type)
   */
  send(channel, ...args) {
    const msg = packStringMessage(channel, ...args);
    this.ws.send(msg);
  }

  /**
   * Listen JSON compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to execute when a message is received
   */
  addListener(channel, callback) {
    this._addListener(this._stringListeners, channel, callback);
  }

  /**
   * Remove a listener from JSON compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to remove
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
   * Send binary messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {TypedArray} typedArray - Data to send
   */
  sendBinary(channel, typedArray) {
    const msg = packBinaryMessage(channel, typedArray);
    this.binaryWs.send(msg);
  }

  /**
   * Listen binary messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to execute when a message is received
   */
  addBinaryListener(channel, callback) {
    this._addListener(this._binaryListeners, channel, callback);
  }

  /**
   * Remove a listener from binary compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to cancel
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
};

export default Socket;
