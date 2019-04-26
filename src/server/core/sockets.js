import WebSocket from 'ws';
import querystring from 'querystring';
import {
  packBinaryMessage,
  unpackBinaryMessage,
  packStringMessage,
  unpackStringMessage,
} from '../../utils/sockets-encoder-decoder';

const noop = () => {};

/**
 * Simple wrapper with simple pubsub system built on top of `ws` socket.
 * The abstraction actually contains two different socket:
 * - one configured for string (JSON compatible) messages
 * - one configured with `binaryType=arraybuffer` for streaming data more
 *   efficiently.
 * The socket re-emits all "native" ws events.
 *
 * @see https://github.com/websockets/ws
 *
 * @memberof module:soundworks/server
 */
class Socket {
  /** @private */
  constructor(ws, binaryWs, rooms, options = {}) {
    /**
     * The `ws` socket instance configured to `blob` binary type
     * @type {Object}
     * @name ws
     * @instance
     * @memberof module:soundworks/server.Socket
     */
    this.ws = ws;

    /**
     * The `ws` socket instance configured to `arraybuffer` binary type
     * @type {Object}
     * @name binaryWs
     * @instance
     * @memberof module:soundworks/server.Socket
     */
    this.binaryWs = binaryWs;

    /**
     * Store sockets per room. The romm `'*'` store all current connections.
     * Shared instance between every socket.
     * @type {Map}
     * @name rooms
     * @instance
     * @memberof module:soundworks/server.Socket
     */
    this.rooms = rooms;

    /**
     * Configuration object
     * @type {Object}
     * @name config
     * @instance
     * @memberof module:soundworks/server.Socket
     */
    this.config = {
      pingInterval: 5 * 1000,
      ...options,
    };

    this._stringListeners = new Map();
    this._binaryListeners = new Map();

    // ----------------------------------------------------------
    // init string socket
    // ----------------------------------------------------------
    this.ws.addEventListener('message', e => {
      const [channel, args] = unpackStringMessage(e.data);
      this._emit(false, channel, ...args);
    });

    // broadcast all `ws` "native" events
    [ 'close',
      'error',
      'message',
      'open',
      'ping',
      'pong',
      'unexpected-response',
      'upgrade',
    ].forEach(eventName => {
      this.ws.addEventListener(eventName, e => {
        this._emit(false, eventName, e.data);
      });
    });

    // ----------------------------------------------------------
    // init binary socket
    // ----------------------------------------------------------
    this.binaryWs.addEventListener('message', e => {
      const [channel, data] = unpackBinaryMessage(e.data);
      this._emit(true, channel, data);
    });

    // broadcast all `ws` "native" events
    [ 'close',
      'error',
      'message',
      'open',
      'ping',
      'pong',
      'unexpected-response',
      'upgrade',
    ].forEach(eventName => {
      this.binaryWs.addEventListener(eventName, e => {
        this._emit(true, eventName, e.data);
      });
    });

    // heartbeat system (run only on string socket), adapted from:
    // https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
    this._isAlive = true;
    this._heartbeat = this._heartbeat.bind(this);

    this.ws.on('pong', this._heartbeat);

    this._intervalId = setInterval(() => {
      if (this._isAlive === false) {
        clearInterval(this._intervalId);
        // terminate both sockets
        this.ws.terminate();
        this.binaryWs.terminate();
        return;
      }

      this._isAlive = false;
      this.ws.ping(noop);
    }, this.config.pingInterval);
  }

  /**
   * @private
   * called when the string socket closes (aka client reload).
   */
  terminate() {
    clearTimeout(this._intervalId);
    // clean rooms
    for (let [key, room] of this.rooms) {
      room.delete(this);
    }

    this.rooms = null;

    // clear listeners
    this._stringListeners.clear();
    this._binaryListeners.clear();

    // clear binarySocket as this is called from the string one.
    this.binaryWs.terminate();
  }

  /** @private */
  _heartbeat() {
    this._isAlive = true;
  }

  /** @private */
  _emit(binary, channel, ...args) {
    const listeners = binary ? this._binaryListeners : this._stringListeners;

    if (listeners.has(channel)) {
      const callbacks = listeners.get(channel);
      callbacks.forEach(callback => callback(...args));
    }
  }

  /** @private */
  _addListener(listeners, channel, callback) {
    if (!listeners.has(channel)) {
      listeners.set(channel, new Set());
    }

    const callbacks = listeners.get(channel);
    callbacks.add(callback);
  }

  /** @private */
  _removeListener(listeners, channel, callback) {
    if (listeners.has(channel)) {
      const callbacks = listeners.get(channel);
      callbacks.delete(callback);
    }
  }

  /**
   * Add the socket to a room
   * @param {String} roomId - Id of the room
   */
  addToRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    const room = this.rooms.get(roomId);
    room.add(this);
  }

  /**
   * Remove the socket from a room
   * @param {String} roomId - Id of the room
   */
  removeFromRoom(roomId) {
    if (this.rooms.has(roomId)) {
      const room = this.rooms.get(roomId);
      room.delete(this);
    }
  }

  /**
   * Sends JSON compatible messages on a given channel
   *
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type)
   */
  send(channel, ...args) {
    const msg = packStringMessage(channel, ...args);

    this.ws.send(msg, (err) => {
      if (err) {
        console.error('error sending msg:', channel, args);
      }
    });
  }

  /**
   * Listen JSON compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to execute when a message is received
   */
  addListener(channel, callback) {
    this._addListener(this._stringListeners, channel, callback);
  }

  /**
   * Remove a listener from JSON compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to cancel
   */
  removeListener(channel, callback) {
    this._removeListener(this._stringListeners, channel, callback);
  }

  /**
   * Sends binary messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {TypedArray} typedArray - Data to send
   */
  sendBinary(channel, typedArray) {
    const msg = packBinaryMessage(channel, typedArray);

    this.binaryWs.send(msg, (err) => {
      if (err) {
        console.error('error sending msg:', channel, typedArray);
      }
    });
  }

  /**
   * Listen binary messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to execute when a message is received
   */
  addBinaryListener(channel, callback) {
    this._addListener(this._binaryListeners, channel, callback);
  }

  /**
   * Remove a listener from binary compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to cancel
   */
  removeBinaryListener(channel, callback) {
    this._removeListener(this._binaryListeners, channel, callback);
  }
}

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
   */
  rooms: new Map(),

  /**
   * Initialize sockets
   * @private
   */
  start(httpServer, config, onConnectionCallback) {
    const path = 'socket'; // should remove origin

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
        const socket = new Socket(stringWs, binaryWs, this.rooms, config);

        socket.addToRoom('*');
        socket.addToRoom(clientType);

        onConnectionCallback(clientType, socket);
      }
    });
  },

  /**
   * Add a socket to a room (keep for backward compatibility).
   *
   * @param {Socket} socket - Socket to register in the room.
   * @param {String} roomId - Id of the room
   */
  addToRoom(socket, roomId) {
    socket.addToRoom(roomId);
  },

  /**
   * Remove a socket from a room (keep for backward compatibility).
   *
   * @param {Socket} socket - Socket to register in the room.
   * @param {String} [roomId=null] - Id of the room
   */
  removeFromRoom(socket, roomId) {
    socket.removeFromRoom(roomId);
  },

  /**
   * Send JSON compatible messages to a client on a given channel
   *
   * @param {Client} client - Client to send the message to
   * @param {String} channel - Channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type),
   *  must be compatible with JSON serialization.
   */
  send(client, channel, ...args) {
    client.socket.send(channel, ...args);
  },

  /**
   * Send a string message to all client of given `clientType` or `clientType`s. If
   * not specified, the message is sent to all clients.
   *
   * @param {String|Array} roomsIds - The ids of the rooms that must receive
   *  the message. If null is send to all clients.
   * @param {module:soundworks/server.Socket} excludeSocket - Optionnal
   *  socket to ignore when broadcasting the message, typically the client
   *  at the origin of the message.
   * @param {String} channel - Channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  broadcast(roomIds, excludeSocket, channel, ...args) {
    let targets;

    if (typeof roomsIds === 'string' || Array.isArray(roomIds)) {
      if (typeof roomsIds === 'string') {
        roomIds = [roomIds];
      }

      targets = new Set();

      roomIds.forEach(roomId => {
        if (this.rooms.has(roomId)) {
          const room = this.rooms.get(roomId);
          room.forEach(socket => targets.add(socket));
        }
      });
    } else {
      targets = this.rooms.get('*');
    }

    targets.forEach(socket => {
      if (socket.ws.readyState === WebSocket.OPEN) {
        if (excludeSocket !== null) {
          if (socket !== excludeSocket) {
            socket.send(channel, ...args);
          }
        } else {
          socket.send(channel, ...args);
        }
      }
    });
  },

  /**
   * Listen JSON compatible messages from a client on a given channel
   *
   * @param {Client} client - Client that listens for the message
   * @param {String} channel - Channel of the message
   * @param {Function} callback - Callback to execute when a message is received
   */
  addListener(client, channel, callback) {
    client.socket.addListener(channel, callback);
  },

  /**
   * Remove a listener from JSON compatible messages from a client on a given channel
   *
   * @param {Client} client - Client to send the message to
   * @param {String} channel - Channel of the message
   * @param {Function} callback - Callback to cancel
   */
  removeListener(client, channel, callback) {
    client.socket.removeListener(channel, callback);
  },


  /**
   * Send binary messages to a client on a given channel
   *
   * @param {Client} client - Client to send the message to
   * @param {String} channel - Channel of the message
   * @param {TypedArray} typedArray - Data to send
   */
  sendBinary(client, channel, typedArray) {
    client.socket.sendBinary(channel, typedArray);
  },

  // /**
  //  * Sends a message to all client of given `clientType` or `clientType`s. If
  //  * not specified, the message is sent to all clients.
  //  *
  //  * @param {String|Array} roomsIds - The ids of the rooms that must receive
  //  *  the message. If null is send to all clients.
  //  * @param {module:soundworks/server.Socket} excludeSocket - Optionnal
  //  *  socket to ignore when broadcasting the message, typically the client
  //  *  at the origin of the message.
  //  * @param {String} channel - Channel of the message
  //  * @param {...*} args - Arguments of the message (as many as needed, of any type).
  //  */
  // broadcast(roomIds, excludeSocket, channel, ...args) {
  //   let targets;

  //   if (typeof roomsIds === 'string' || Array.isArray(roomIds)) {
  //     if (typeof roomsIds === 'string') {
  //       roomIds = [roomIds];
  //     }

  //     targets = new Set();

  //     roomIds.forEach(roomId => {
  //       if (this.rooms.has(roomId)) {
  //         const room = this.rooms.get(roomId);
  //         room.forEach(socket => targets.add(socket));
  //       }
  //     });
  //   } else {
  //     targets = this.rooms.get('*');
  //   }

  //   targets.forEach(socket => {
  //     if (socket.ws.readyState === WebSocket.OPEN) {
  //       if (excludeSocket !== null) {
  //         if (socket !== excludeSocket) {
  //           socket.send(channel, ...args);
  //         }
  //       } else {
  //         socket.send(channel, ...args);
  //       }
  //     }
  //   });
  // },

  /**
   * Listen binary messages from a client on a given channel
   *
   * @param {Client} client - Client that must listen to the message
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to execute when a message is received
   */
  addBinaryListener(client, channel, callback) {
    client.socket.addBinaryListener(channel, callback);
  },

  /**
   * Remove a listener from binary compatible messages form a client on a given channel
   *
   * @param {Client} client - Client that must stop to listen for the message
   * @param {String} channel - Channel of the message
   * @param {...*} callback - Callback to cancel
   */
  removeBinaryListener(client, channel, callback) {
    client.socket.removeBinaryListener(channel, callback);
  },
};

export default sockets;
