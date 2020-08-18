import WebSocket from 'ws';
import querystring from 'querystring';
import Socket from './Socket.js';

/**
 * Websocket server that creates and host all {@link server.Socket} instance.
 *
 * (@note - could be usefull for broadcasting messages, creating rooms, etc.
 *
 * @memberof server
 */
class Sockets {
  constructor() {
    /**
     * Store sockets per room. The romm `'*'` store all current connections.
     * @private
     */
    this._rooms = new Map();

    this._initializationCache = new Map();
  }

  /**
   * Initialize sockets, all sockets are added by default added to two rooms:
   * - to the room corresponding to the client `clientType`
   * - to the '*' that holds all connected sockets
   *
   * @private
   */
  start(httpServer, config, onConnectionCallback) {
    const path = config.path;
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

      if (!this._initializationCache.has(key)) {
        this._initializationCache.set(key, { ws, binary });
      } else {
        const cached = this._initializationCache.get(key);
        this._initializationCache.delete(key);

        // should be in order, but just to be sure
        const stringWs = cached.binary ? ws : cached.ws;
        const binaryWs = cached.binary ? cached.ws : ws;
        const socket = new Socket(stringWs, binaryWs, this._rooms, this, config);

        socket.addToRoom('*');
        socket.addToRoom(clientType);

        onConnectionCallback(clientType, socket);
      }
    });
  }

  /** @private */
  _broadcast(binary, roomIds, excludeSocket, channel, ...args) {
    const method = binary ? 'sendBinary' : 'send';
    let targets = new Set();

    if (typeof roomIds === 'string' || Array.isArray(roomIds)) {
      if (typeof roomIds === 'string') {
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
  }

  /**
   * Add a socket to a room
   *
   * @param {server.Socket} socket - Socket to add to the room.
   * @param {String} roomId - Id of the room
   */
  addToRoom(socket, roomId) {
    socket.addToRoom(roomId);
  }

  /**
   * Remove a socket from a room
   *
   * @param {server.Socket} socket - Socket to remove from the room.
   * @param {String} [roomId=null] - Id of the room
   */
  removeFromRoom(socket, roomId) {
    socket.removeFromRoom(roomId);
  }

  /**
   * Send a string message to all client of given room(s). If no room
   * not specified, the message is sent to all clients
   *
   * @param {String|Array} roomsIds - Ids of the rooms that must receive
   *  the message. If null the message is sent to all clients
   * @param {server.Socket} excludeSocket - Optionnal
   *  socket to ignore when broadcasting the message, typically the client
   *  at the origin of the message
   * @param {String} channel - Channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type)
   */
  broadcast(roomIds, excludeSocket, channel, ...args) {
    this._broadcast(false, roomIds, excludeSocket, channel, ...args);
  }

  /**
   * Send a binary message (TypedArray) to all client of given room(s). If no room
   * not specified, the message is sent to all clients
   *
   * @param {String|Array} roomsIds - Ids of the rooms that must receive
   *  the message. If null the message is sent to all clients
   * @param {server.Socket} excludeSocket - Optionnal
   *  socket to ignore when broadcasting the message, typically the client
   *  at the origin of the message
   * @param {String} channel - Channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type)
   */
  broadcastBinary(roomIds, excludeSocket, channel, typedArray) {
    this._broadcast(true, roomIds, excludeSocket, channel, typedArray);
  }
};

export default Sockets;
