import WebSocket from 'ws';
import querystring from 'querystring';
import Socket from './Socket';

/** @private */
const initializationCache = new Map();

/**
 * Internal base class for services and scenes.
 *
 * @todo - binary socket using:
 * https://github.com/websockets/ws#multiple-servers-sharing-a-single-https-server
 *
 * @memberof module:soundworks/server
 */
const sockets = {
  /**
   * Store sockets per room. The romm `'*'` store all current connections.
   * @private
   */
  _rooms: new Map(),

  /**
   * Initialize sockets, all sockets are added by default added to two rooms:
   * - to the room corresponding to the client `clientType`
   * - to the '*' that holds all connected sockets
   * @private
   */
  start(httpServer, config, onConnectionCallback) {
    const path = 'socket'; // should remove origin

    // init global room
    this._rooms.set('*', new Set());

    this.wss = new WebSocket.Server({
      server: httpServer,
      path: `/${path}`, // @note - update according to existing config files (aka cosima-apps)
    });

    this.wss.on('connection', (ws, req) => {
      const queryString = querystring.decode(req.url.split('?')[1]);
      const { clientType, key } = queryString;
      const binary = !!(parseInt(queryString.binary));

      if (binary) {
        ws.binaryType = 'arraybuffer';
      }

      if (!initializationCache.has(key)) {
        initializationCache.set(key, { ws, binary });
      } else {
        const cached = initializationCache.get(key);
        initializationCache.delete(key);

        // should be in order, but just to be sure
        const stringWs = cached.binary ? ws : cached.ws;
        const binaryWs = cached.binary ? cached.ws : ws;
        const socket = new Socket(stringWs, binaryWs, this._rooms, this, config);

        socket.addToRoom('*');
        socket.addToRoom(clientType);

        onConnectionCallback(clientType, socket);
      }
    });
  },

  /** @private */
  _broadcast(binary, roomIds, excludeSocket, channel, ...args) {
    const method = binary ? 'sendBinary' : 'send';
    let targets = new Set();

    if (typeof roomsIds === 'string' || Array.isArray(roomIds)) {
      if (typeof roomsIds === 'string') {
        roomIds = [roomIds];
      }

      roomIds.forEach(roomId => {
        if (this._rooms.has(roomId)) {
          const room = this._rooms.get(roomId);
          room.forEach(socket => targets.add(socket));
        }
      });
    } else {
      targets = this._rooms.get('*');
    }

    targets.forEach(socket => {
      if (socket.ws.readyState === WebSocket.OPEN) {
        if (excludeSocket !== null) {
          if (socket !== excludeSocket) {
            socket[method](channel, ...args);
          }
        } else {
          socket[method](channel, ...args);
        }
      }
    });
  },

  /**
   * Add a socket to a room
   *
   * @param {Socket} socket - Socket to register in the room.
   * @param {String} roomId - Id of the room
   */
  addToRoom(socket, roomId) {
    socket.addToRoom(roomId);
  },

  /**
   * Remove a socket from a room
   *
   * @param {Socket} socket - Socket to register in the room.
   * @param {String} [roomId=null] - Id of the room
   */
  removeFromRoom(socket, roomId) {
    socket.removeFromRoom(roomId);
  },

  /**
   * Send JSON compatible messages to a socket on a given channel
   *
   * @param {module:soundworks/server.Socket} socket - Client to send the message to
   * @param {String} channel - Channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type),
   *  must be compatible with JSON serialization.
   */
  send(socket, channel, ...args) {
    socket.send(channel, ...args);
  },

  /**
   * Send a string message to all client of given room(s). If no room
   * not specified, the message is sent to all clients
   *
   * @param {String|Array} roomsIds - Ids of the rooms that must receive
   *  the message. If null the message is sent to all clients
   * @param {module:soundworks/server.Socket} excludeSocket - Optionnal
   *  socket to ignore when broadcasting the message, typically the client
   *  at the origin of the message
   * @param {String} channel - Channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type)
   */
  broadcast(roomIds, excludeSocket, channel, ...args) {
    this._broadcast(false, roomIds, excludeSocket, channel, ...args);
  },

  /**
   * Listen JSON compatible messages from a socket on a given channel
   *
   * @param {module:soundworks/server.Socket} socket - Socket that should listen for the message
   * @param {String} channel - Channel of the message
   * @param {Function} callback - Callback to execute when a message is received
   */
  addListener(socket, channel, callback) {
    socket.addListener(channel, callback);
  },

  /**
   * Remove a listener from JSON compatible messages from a socket on a given channel
   *
   * @param {module:soundworks/server.Socket} socket - Socket to send the message to
   * @param {String} channel - Channel of the message
   * @param {Function} callback - Callback to cancel
   */
  removeListener(socket, channel, callback) {
    socket.removeListener(channel, callback);
  },


  /**
   * Send binary messages to a socket on a given channel
   *
   * @param {module:soundworks/server.Socket} socket - Socket to send the message to
   * @param {String} channel - Channel of the message
   * @param {TypedArray} typedArray - Data to send
   */
  sendBinary(socket, channel, typedArray) {
    socket.sendBinary(channel, typedArray);
  },

  /**
   * Send a binary message (TypedArray) to all client of given room(s). If no room
   * not specified, the message is sent to all clients
   *
   * @param {String|Array} roomsIds - Ids of the rooms that must receive
   *  the message. If null the message is sent to all clients
   * @param {module:soundworks/server.Socket} excludeSocket - Optionnal
   *  socket to ignore when broadcasting the message, typically the client
   *  at the origin of the message
   * @param {String} channel - Channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type)
   */
  broadcastBinary(roomIds, excludeSocket, channel, typedArray) {
    this._broadcast(true, roomIds, excludeSocket, channel, typedArray);
  },

  /**
   * Listen binary messages from a socket on a given channel
   *
   * @param {module:soundworks/server.Socket} socket - Client that must listen to the message
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to execute when a message is received
   */
  addBinaryListener(socket, channel, callback) {
    client.socket.addBinaryListener(channel, callback);
  },

  /**
   * Remove a listener from binary compatible messages form a socket on a given channel
   *
   * @param {module:soundworks/server.Socket} socket - Client that must stop to listen for the message
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to cancel
   */
  removeBinaryListener(socket, channel, callback) {
    client.socket.removeBinaryListener(channel, callback);
  },
};

export default sockets;
