import debug from 'debug';

const log = debug('soundworks:socket');

/*
close
  Fired when a connection with a websocket is closed.
  Also available via the onclose property
error
  Fired when a connection with a websocket has been closed because of an error, such as whensome data couldn't be sent.
  Also available via the onerror property.
message
  Fired when data is received through a websocket.
  Also available via the onmessage property.
open
  Fired when a connection with a websocket is opened.
  Also available via the onopen property.
*/

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

  _listeners: new Map(),

  /**
   * Initialize a websocket connection with the server.
   * @param {String} clientType - `client.type` {@link client}.
   * @param {Object} options - Options of the socket.
   * @param {Array<String>} options.path - Defines where socket should find the `socket.io` file.
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
    const path = 'test';
    const protocol = window.location.protocol.replace(/^http?/, 'ws');
    const { hostname, port } = window.location;
    const url = `${protocol}//${hostname}:${port}/${path}?clientType=${clientType}`;

    this.ws = new WebSocket(url);
    log(`initialized - url: ${url}`);

    // parse incoming messages for pubsub
    this.ws.addEventListener('message', e => {
      const [channel, args] = JSON.parse(e.data);
      this.emit(channel, ...args);
    });

    // broadcast all `WebSockets` "native" events
    [ 'open',
      'close',
      'error',
      'upgrade',
      'message',
    ].forEach(eventName => {
      this.ws.addEventListener(eventName, (e) => {
        this.emit(eventName, e.data);
      });
    });
  },

  emit(channel, ...args) {
    if (this._listeners.has(channel)) {
      const listeners = this._listeners.get(channel);
      listeners.forEach(callback => callback(...args));
    }
  },

  /**
   * Sends a WebSocket message to the server side socket.
   *
   * @param {String} channel - The channel of the message.
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(channel, ...args) {
    const msg = JSON.stringify([channel, args]);
    this.ws.send(msg);
  },

  /**
   * Listen a WebSocket message from the server.
   *
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive(channel, callback) {
    if (!this._listeners.has(channel)) {
      this._listeners.set(channel, new Set());
    }

    const listeners = this._listeners.get(channel);
    listeners.add(callback);
  },

  /**
   * Stop listening to a message from the server.
   *
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to cancel.
   */
  removeListener(channel, callback) {
    if (this._listeners.has(channel)) {
      const listeners = this._listeners.get(channel);
      listeners.delete(callback);
    }
  },
};

// aliases
socket.on = socket.receive;
socket.off = socket.removeListener;

export default socket;
