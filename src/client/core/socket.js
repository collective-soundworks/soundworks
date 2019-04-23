import debug from 'debug';
// import sio from 'socket.io-client';

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

const socket = {
  /**
   * Store the instance of Socket.io Manager.
   */
  socket: null,

  _listeners: new Map(),
  _stateListeners: new Set(),
  _state: null,

  /**
   * Initialize a namespaced connection with given options.
   *
   * @param {String} namespace - Correspond to the `client.type` {@link client}.
   * @param {Object} options - Options of the socket.
   * @param {String} options.url - The url where the socket should connect.
   * @param {Array<String>} options.transports - The transports to use for the socket (cf. socket.io).
   * @param {Array<String>} options.path - Defines where socket should find the `socket.io` file.
   */
  init(clientType, options) {
    const path = 'test';
    const protocol = window.location.protocol.replace(/^http?/, 'ws');
    const { hostname, port } = window.location;
    const url = `${protocol}//${hostname}:${port}/${path}?clientType=${clientType}`;

    this.ws = new WebSocket(url);
    log(`initialized - url: ${url}`);

    this.ws.addEventListener('message', e => {
      // console.log('message', e.data);
      const [channel, args] = JSON.parse(e.data);
      this.emit(channel, args);
    });

    this.ws.addEventListener('error', (...args) => {
      // console.error('error', ...args);
    });

    this._listenSocketState();
  },

  _listenSocketState() {
    [
      'open',
      'close',
      // 'error',
      'upgrade',
    ].forEach(eventName => {
      this.ws.addEventListener(eventName, () => {
        // @todo - just re-emit using the existing event system...
        this._state = eventName;
        this._stateListeners.forEach((listener) => listener(this._state));
      });
    });
  },

  emit(channel, args) {
    const listeners = this._listeners.get(channel);
    listeners.forEach(callback => callback(...args));
  },

  /**
   * Listen to the different states of the socket.
   *
   * @param {Function} callback - The function to be called when the state
   *  of the socket changes, the given function is called with the name of the
   *  event as argument.
   * @see {http://socket.io/docs/client-api/#socket}
   */
  addStateListener(callback) {
    this._stateListeners.add(callback);

    if (this._state !== null) {
      callback(this._state);
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

export default socket;
