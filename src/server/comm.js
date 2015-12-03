
export default {

  /**
   * Initialize the module which socket.io
   * @private
   */
  initialize(io) {
    this.io = io;
    this._nspPrefix = /^\//;
  },

  /**
   * Listen a WebSocket message.
   * @param {Client} client - The client that must listen to the message.
   * @param {String} channel - The channel of the message
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive(client, channel, callback) {
    client.socket.on(channel, callback);
  },

  /**
   * Sends a WebSocket message to the client.
   * @param {Client} client - The client to send the message to.
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(client, channel, ...args) {
    client.socket.emit(channel, ...args);
  },

  /**
   * Sends a WebSocket message to all the clients belonging to the same `clientType` as `client`. (`client` does not receive a message)
   * @param {Client} client - The client which peers must receive the message
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  sendPeers(client, channel, ...args) {
    client.socket.broadcast.emit(channel, ...args);
  },

  /**
   * Sends a message to all client of given `clientType` or `clientType`s. If not specified, the message is sent to all clients
   * @param {String|Array} clientType - The `clientType`(s) that must receive the message.
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
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