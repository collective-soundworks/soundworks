import io from 'socket.io-client';

export default {
  _socket: null,

  initialize(clientType, options) {
    const socketUrl = `${options.socketUrl}/${clientType}`;

    this._socket = io(socketUrl, {
      transports: options.transports,
    });

    return this;
  },

  send(msg, ...args) {
    if (!this._socket) { return; }

    this._socket.emit(msg, ...args);
  },

  receive(msg, callback) {
    if (!this._socket) { return; }

    this._socket.removeListener(msg, callback);
    this._socket.on(msg, callback);
  },

  removeListener(msg, callback) {
    if (!this._socket) { return; }

    this._socket.removeListener(msg, callback);
  }
};
