
export default {

  initialize(io) {
    this.io = io;
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
    this.io.of(`/${clientType}`).emit(channel, ...args);
  },
};