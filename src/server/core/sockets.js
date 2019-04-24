// import sio from 'socket.io';
import WebSocket from 'ws';
import querystring from 'querystring';

const noop = () => {};

/**
 * Simple wrapper with simple pubsub system built on top of `ws` socket.
 * The socket re-emits all "native" ws events.
 *
 * @see https://github.com/websockets/ws
 *
 * @memberof module:soundworks/server
 */
class Socket {
  /** @private */
  constructor(ws, options = {}) {
    /**
     * The `ws` socket instance
     * @type {Object}
     * @name ws
     * @instance
     * @memberof module:soundworks/server.Socket
     */
    this.ws = ws;

    /**
     * Configuration object
     * @type {Object}
     * @name config
     * @instance
     * @memberof module:soundworks/server.Socket
     */
    this.config = Object.assign({
      pingInterval: 5 * 1000,
    }, options);

    this._listeners = new Map();
    // init to `true` to send first ping
    this._isAlive = true;

    this._heartbeat = this._heartbeat.bind(this);

    this.ws.addEventListener('message', e => {
      const [channel, args] = JSON.parse(e.data);
      this.emit(channel, ...args);
    });

    this.ws.on('pong', this._heartbeat);

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
        this.emit(eventName, e.data);
      });
    });

    // adapted from: https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
    this._intervalId = setInterval(() => {
      if (this._isAlive === false) {
        clearInterval(this._intervalId);
        this.ws.terminate();
        return;
      }

      this._isAlive = false;
      this.ws.ping(noop);
    }, this.config.pingInterval);

    // aliases
    this.on = this.receive.bind(this);
    this.off =  this.removeListener.bind(this);
  }

  _heartbeat() {
    this._isAlive = true;
  }

  destroy() {
    clearTimeout(this._intervalId);
    this._listeners.clear();
  }

  emit(channel, ...args) {
    if (this._listeners.has(channel)) {
      const listeners = this._listeners.get(channel);
      // console.log(channel, args, listeners);
      listeners.forEach(callback => callback(...args));
    }
  }

  send(channel, ...args) {
    const msg = JSON.stringify([channel, args]);

    this.ws.send(msg, (err) => {
      if (err) {
        // @todo - error handling (retry?)
        console.error('error sending msg:', channel, args);
      } else {
        // console.log('msg successfully send:', channel, args);
      }
    });
  }

  receive(channel, callback) {
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
}

/**
 * Internal base class for services and scenes.
 *
 * @todo - binary socket using:
 * https://github.com/websockets/ws#multiple-servers-sharing-a-single-https-server
 *
 * @memberof module:soundworks/server
 */
const sockets = {
  rooms: new Map(),

  /**
   * Initialize sockets
   * @private
   */
  start(httpServer, config, onConnectionCallback) {
    const path = 'test';

    this.wss = new WebSocket.Server({
      server: httpServer,
      path: `/${path}`, // @note - update according to existing config files (aka cosima-apps)
    });

    this.wss.on('connection', (ws, req) => {
      const { clientType } = querystring.decode(req.url.split('?')[1]);
      const socket = new Socket(ws);

      this.addToRoom(socket, '*');
      this.addToRoom(socket, clientType);

      onConnectionCallback(clientType, socket);
    });
  },

  /**
   * Add a socket to a given room
   * @param {Socket} socket - Socket to register in the room.
   * @param {String} roomId - Id of the room
   */
  addToRoom(socket, roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    const room = this.rooms.get(roomId);
    room.add(socket);
  },

  /**
   * Remove a socket to a given room
   * @param {Socket} socket - Socket to register in the room.
   * @param {String} [roomId=null] - Id of the room
   */
  removeFromRoom(socket, id) {
    if (this.rooms.has(id)) {
      const room = this.rooms.get(id);
      room.delete(socket);
    }
  },

  /**
   * Remove a socket to all rooms
   * @param {Socket} socket - Socket to register in the room.
   */
  removeFromAllRooms(socket) {
    for (let [key, room] of this.rooms) {
      room.delete(socket);
    }
  },

  /**
   * Sends a WebSocket message to the client.
   * @param {Client} client - The client to send the message to.
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(client, channel, ...args) {
    client.socket.send(channel, ...args);
  },

  /**
   * Sends a message to all client of given `clientType` or `clientType`s. If
   * not specified, the message is sent to all clients.
   *
   * @param {String|Array} roomsIds - The ids of the rooms that must receive
   *  the message. If null is send to all clients.
   * @param {module:soundworks/server.Client} excludeClient - Optionnal
   *  client to ignore when broadcasting the message, typically the client
   *  at the origin of the message.
   * @param {String} channel - Channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  broadcast(roomIds, excludeClient, channel, ...args) {
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
        if (excludeClient !== null) {
          if (socket !== excludeClient.socket) {
            socket.send(channel, ...args);
          }
        } else {
          socket.send(channel, ...args);
        }
      }
    });
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
   * Stop listening to a message from the server.
   * @param {Client} client - The client to send the message to.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to cancel.
   */
  removeListener(client, channel, callback) {
    client.socket.removeListener(channel, callback);
  },
};

export default sockets;
