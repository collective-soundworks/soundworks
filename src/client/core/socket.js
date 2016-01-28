import io from 'socket.io-client';

export default {
  /**
   * Store the instance of Socket.io Manager.
   */
  socket: null,

  /**
   * Is set to `true` when a `ClientActivity` is instanciated. Is checked by the `client` to initialize the connection or not.
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
    this.socket = io(`${options.url}/${namespace}`, {
      transports: options.transports
    });

    return this;
  },

  /**
   * Sends a WebSocket message to the server side socket.
   * @param {String} channel - The channel of the message.
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(channel, ...args) {
    this.socket.emit(channel, ...args);
  },

  sendVolatile(channel, ...args) {
    this.socket.volatile.emit(channel, ...args);
  },

  /**
   * Listen a WebSocket message from the server.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive(channel, callback) {
    this.socket.removeListener(channel, callback);
    this.socket.on(channel, callback);
  },

  /**
   * Stop listening to a message from the server.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to cancel.
   */
  removeListener(channel, callback) {
    this.socket.removeListener(channel, callback);
  },
};
