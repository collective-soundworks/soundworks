import sio from 'socket.io';

export default {
  /**
   * Initialize the object which socket.io
   * @private
   */
  init(httpServer, config) {
    this.io = new sio(httpServer, config);;
  },

  /**
   * Register the function to apply when a client of the given `clientType`
   * is connecting to the server
   * @param {Array} clientTypes - The different type of client, should be namespaced
   * @param {Function} callback
   * @private
   */
  onConnection(clientTypes, callback) {
    clientTypes.forEach((clientType) => {
      this.io.of(clientType).on('connection', (socket) => {
        callback(clientType, socket);
      });
    });
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
   * Sends a message to all client of given `clientType` or `clientType`s. If
   * not specified, the message is sent to all clients.
   *
   * @param {String|Array} clientType - The `clientType`(s) that must receive
   *  the message.
   * @param {module:soundworks/server.Client} excludeClient - Optionnal
   *  client to ignore when broadcasting the message, typically the client
   *  at the origin of the message.
   * @param {String} channel - Channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  broadcast(clientType, excludeClient, channel, ...args) {
    let namespaces;

    if (typeof clientType === 'string')
      namespaces = [`/${clientType}`];
    else if (Array.isArray(clientType))
      namespaces = clientType.map(type => `/${type}`);
    else
      namespaces = Object.keys(this.io.nsps);

    if (excludeClient) {
      const index = namespaces.indexOf('/' + excludeClient.type);

      if (index !== -1) {
        namespaces.splice(index, 1);
        excludeClient.socket.broadcast.emit(channel, ...args);
      }
    }

    namespaces.forEach((nsp) => {
      this.io.of(nsp).emit(channel, ...args);
    });
  },
};
