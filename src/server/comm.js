
export default {

  initialize(io) {
    this.io = io;
    this._nspPrefix = /^\//;
  },

  receive(client, channel, callback) {
    client.socket.on(channel, callback);
  },

  send(client, channel, ...args) {
    client.socket.emit(channel, ...args);
  },

  // sendPeers
  sendPeers(client, channel, ...args) {
    client.socket.broadcast.emit(channel, ...args);
  },

  broadcast(clientType, channel, ...args) {
    let namespaces;

    if (typeof clientType === 'string') {
      namespaces = ['/' + clientType.replace(this._nspPrefix, '')];
    } else if (Array.isArray(clientType)) {
      namespaces = clientType.map((type) => {
        return '/' + type.replace(this._nspPrefix, '');
      });
    } else {
      namespaces = Object.keys(this.io.nsps);
    }

    namespaces.forEach((nsp) => { this.io.of(nsp).emit(channel, ...args); });
  },

};