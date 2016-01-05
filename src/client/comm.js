import io from 'socket.io-client';

export default {
  socket: null,

  initialize(clientType, options) {
    const socketUrl = `${options.socketUrl}/${clientType}`;

    this.socket = io(socketUrl, {
      transports: options.transports,
    });

    return this;
  },

  /**
   * Sends a WebSocket message to the server side socket.
   * @param {String} channel - The channel of the message.
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(channel, ...args) {
    // if (!this.socket) { return; }
    this.socket.emit(channel, ...args);
  },

  sendVolatile(channel, ...args) {
    // if (!this.socket) { return; }
    this.socket.volatile.emit(channel, ...args);
  },

  /**
   * Listen a WebSocket message from the server.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive(channel, callback) {
    // if (!this.socket) { return; }
    this.socket.removeListener(channel, callback);
    this.socket.on(channel, callback);
  },

  /**
   * Stop listening to a message from the server.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to cancel.
   */
  removeListener(channel, callback) {
    // if (!this.socket) { return; }
    this.socket.removeListener(channel, callback);
  }
};
