// import sio from 'socket.io';
import WebSocket from 'ws';
import querystring from 'querystring';

// console.log(WebSocket);
class Socket {
  constructor(ws) {
    this.ws = ws;

    this._listeners = new Map();

    this.ws.on('message', value => {
      const [channel, args] = JSON.parse(value);
      const listeners = this._listeners.get(channel);
      console.log('message', channel, args, listeners);

      listeners.forEach(callback => callback(...args));
    });

    // @todo - listen for error messages
  }

  send(channel, args) {
    const msg = JSON.stringify([channel, args]);
    console.log('send', channel, args);
    this.ws.send(msg);
  }

  receive(channel, callback) {
    console.log('register callback', channel);
    if (!this._listeners.has(channel)) {
      this._listeners.set(channel, new Set());
    }

    const listeners = this._listeners.get(channel);
    listeners.add(callback);
  }

  removeListener(channel, callback) {
    if (this._listeners.has(channel)) {
      const listeners = this._listeners.get(channel);
      listeners.delete(callback);
    }
  }

  removeAllListeners() {
    console.warn('@todo - implement Socket.removeAllListeners');
  }
}


export default {
  /**
   * Initialize the object which socket.io
   * @private
   */
  init(httpServer, config) {
    const path = 'test';

    this.wss = new WebSocket.Server({
      server: httpServer,
      path: `/${path}`, // @note - update according to existing config files (aka cosima-apps)
    });

    // this.io = new sio(httpServer, config);;
  },

  /**
   * Register the function to apply when a client of the given `clientType`
   * is connecting to the server
   * @param {Array} clientTypes - The different type of client, should be namespaced
   * @param {Function} callback
   * @private
   */
  onConnection(clientTypes, callback) {
    this.wss.on('connection', (ws, req) => {
      const { clientType } = querystring.decode(req.url.split('?')[1]);
      const socket = new Socket(ws);

      // @todo - probably not useful, remove
      if (clientTypes.indexOf(clientType) !== -1) {
        callback(clientType, socket);
      } else {
        throw new Error(`[sockets] Undefined clientType: "${clientType}"`);
      }
    });
    // clientTypes.forEach((clientType) => {
    //   this.io.of(clientType).on('connection', (socket) => {
    //     callback(clientType, socket);
    //   });
    // });
  },

  /**
   * Listen a WebSocket message.
   * @param {Client} client - The client that must listen to the message.
   * @param {String} channel - The channel of the message
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive(client, channel, callback) {
    client.socket.receive(channel, callback);
  },

  /**
   * Sends a WebSocket message to the client.
   * @param {Client} client - The client to send the message to.
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(client, channel, ...args) {
    client.socket.send(channel, args);
  },


  /**
   * Stop listening to a message from the server.
   *
   * @param {Client} client - The client to send the message to.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to cancel.
   */
  removeListener(client, channel, callback) {
    client.socket.removeListener(channel, callback);
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
    // if (!this.io) // @todo - remove that, fix server initialization order instead
    //   return;

    // let namespaces;

    // if (typeof clientType === 'string')
    //   namespaces = [`/${clientType}`];
    // else if (Array.isArray(clientType))
    //   namespaces = clientType.map(type => `/${type}`);
    // else
    //   namespaces = Object.keys(this.io.nsps);

    // if (excludeClient) {
    //   const index = namespaces.indexOf('/' + excludeClient.type);

    //   if (index !== -1) {
    //     namespaces.splice(index, 1);
    //     excludeClient.socket.broadcast.emit(channel, ...args);
    //   }
    // }

    // namespaces.forEach((nsp) => this.io.of(nsp).emit(channel, ...args));
  },
};
