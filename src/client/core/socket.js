import debug from 'debug';
import io from 'socket.io-client';

const log = debug('soundworks:socket');

const socket = {
  /**
   * Store the instance of Socket.io Manager.
   */
  socket: null,

  /**
   * Is set to `true` when a `Activity` is instanciated. Is checked by the `client` to initialize the connection or not.
   */
  required: false,

  /**
   * Initialize a namespaced connection with given transport options.
   * @param {String} namespace - Correspond to the `client.type` {@link client}.
   * @param {Object} options - Options of the socket.
   * @param {String} options.url - The url where the socket should connect.
   * @param {Array<String>} options.transports - The transports to use for the socket (cf. socket.io).
   */
  initialize(namespace, options) {
    const url = `${options.url}/${namespace}`;

    this.socket = io(url, { transports: options.transports });
    log(`initialized - url: "${url}" - transports: ${options.transports}`);

    this._stateListeners = new Set();
    this._state = null;

    this._listenSocketState();

    return this;
  },

  /**
   * Listen to the different states of the socket.
   * @param {Function} callback - The function to be called when the state
   *  of the socket changes, the given function is called with the name of the
   *  event as argument.
   * @see {http://socket.io/docs/client-api/#socket}
   */
  addStateListener(callback) {
    this._stateListeners.add(callback);

    if (this._state !== null)
      callback(this._state);
  },

  _listenSocketState() {
    // see: http://socket.io/docs/client-api/#socket
    [ 'connect',
      'reconnect',
      'disconnect',
      'connect_error',
      'reconnect_attempt',
      'reconnecting',
      'reconnect_error',
      'reconnect_failed'
    ].forEach((eventName) => {
      this.socket.on(eventName, () => {
        this._state = eventName;
        this._stateListeners.forEach((listener) => listener(this._state));
      });
    });
  },

  /**
   * Sends a WebSocket message to the server side socket.
   * @param {String} channel - The channel of the message.
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(channel, ...args) {
    this.socket.emit(channel, ...args);
    log(`send - channel: "${channel}"`, ...args);
  },

  sendVolatile(channel, ...args) {
    this.socket.volatile.emit(channel, ...args);
    log(`sendVolatile - channel: "${channel}"`, ...args);
  },

  /**
   * Listen a WebSocket message from the server.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive(channel, callback) {
    this.socket.removeListener(channel, callback);
    this.socket.on(channel, callback);
    log(`receive listener - channel: "${channel}"`);
  },

  /**
   * Stop listening to a message from the server.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to cancel.
   */
  removeListener(channel, callback) {
    this.socket.removeListener(channel, callback);
    log(`remove listener - channel: "${channel}"`);
  },
};

export default socket;
