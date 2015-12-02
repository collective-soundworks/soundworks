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

  send(channel, ...args) {
    if (!this._socket) { return; }

    this._socket.emit(channel, ...args);
  },

  receive(channel, callback) {
    if (!this._socket) { return; }

    this._socket.removeListener(channel, callback);
    this._socket.on(channel, callback);
  },

  removeListener(channel, callback) {
    if (!this._socket) { return; }

    this._socket.removeListener(channel, callback);
  }
};
