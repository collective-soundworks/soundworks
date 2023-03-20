import { Worker } from 'node:worker_threads';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import querystring from 'querystring';
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';

import Socket from './Socket.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Manager all {@link server.Socket} instances.
 *
 * Most of the time, you shouldn't have to use this class instance directely, but
 * it could be usefull in some situations, for broadcasting messages, creating rooms, etc.
 *
 * @memberof server
 */
class Sockets {
  constructor() {
    /** @private */
    this._wss = null;
    /** @private */
    this._rooms = new Map();
    // The special `'*'` romm stores all current connections.
    this._rooms.set('*', new Set());
    /** @private */
    this._initializationCache = new Map();

    /** @private */
    this._latencyStatsWorker = null; // protected - used in Socket instances
    /** @private */
    this._auditState = null;

  }

  /**
   * Initialize sockets, all sockets are added to two rooms by default:
   * - to the room corresponding to the client `role`
   * - to the '*' room that holds all connected sockets
   *
   * @private
   */
  async start(server, config, onConnectionCallback) {
    // init audit stuff for network latency estimation
    const workerPathname = path.join(__dirname, 'audit-network-latency.worker.js');
    this._latencyStatsWorker = new Worker(workerPathname);
    this._auditState = await server.getAuditState();

    this._auditState.onUpdate(updates => {
      if ('averageNetworkLatencyWindow' in updates || 'averageNetworkLatencyPeriod' in updates) {
        this._latencyStatsWorker.postMessage({
          type: 'config',
          value: {
            averageLatencyWindow: updates.averageNetworkLatencyWindow,
            averageLatencyPeriod: updates.averageNetworkLatencyPeriod,
          },
        });
      }
    }, true);

    this._latencyStatsWorker.on('message', msg => {
      if (msg.type === 'computed-average-latency') {
        this._auditState.set({ averageNetworkLatency: msg.value });
      }
    });

    // init ws server
    this._wss = new WebSocketServer({
      noServer: true,
      path: `/${config.path}`, // @note - update according to existing config files (aka cosima-apps)
    });

    this._wss.on('connection', (ws, req) => {
      const queryString = querystring.decode(req.url.split('?')[1]);
      const { role, key, token } = queryString;
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
        socket.addToRoom(role);

        onConnectionCallback(role, socket, token);
      }
    });

    // check if client can connect
    server.httpServer.on('upgrade', async (req, socket, head) => {
      const queryString = querystring.decode(req.url.split('?')[1]);

      const { role, token } = queryString;

      if (server.isProtected(role)) {
        // we don't have any ip in the upgrade request, so we just check the
        // connection token is pending
        const allowed = server.isValidConnectionToken(token);

        if (!allowed) {
          socket.destroy('not allowed');
        }
      }

      this._wss.handleUpgrade(req, socket, head, (ws) => {
        this._wss.emit('connection', ws, req);
      });
    });
  }

  /**
   * Terminate all existing sockets
   *
   * @private
   */
  terminate() {
    // terminate stat worker thread
    this._latencyStatsWorker.terminate();
    // clean sockets
    const sockets = this._rooms.get('*');
    sockets.forEach(socket => socket.terminate());
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
   * @param {String} roomId - Id of the room.
   */
  addToRoom(socket, roomId) {
    socket.addToRoom(roomId);
  }

  /**
   * Remove a socket from a room
   *
   * @param {server.Socket} socket - Socket to remove from the room.
   * @param {String} roomId - Id of the room.
   */
  removeFromRoom(socket, roomId) {
    socket.removeFromRoom(roomId);
  }

  /**
   * Send a message of JSON compatible data types to all client of given room(s).
   * If no room is specified, the message is sent to all clients.
   *
   *
   * @param {String|Array} roomsIds - Ids of the rooms that must receive
   *  the message. If `null` the message is sent to all clients.
   * @param {server.Socket} excludeSocket - Optionnal socket to ignore when
   *  broadcasting the message, typically the client at the origin of the message.
   * @param {String} channel - Channel name.
   * @param {...*} args - Payload of the message. As many arguments as needed, of
   *  JSON compatible data types (i.e. string, number, boolean, object, array and null).
   */
  broadcast(roomIds, excludeSocket, channel, ...args) {
    this._broadcast(false, roomIds, excludeSocket, channel, ...args);
  }

  /**
   * Send a binary message to all client of given room(s). If no room is specified
   * specified, the message is sent to all clients.
   *
   * @param {String|Array} roomsIds - Ids of the rooms that must receive
   *  the message. If `null` the message is sent to all clients.
   * @param {server.Socket} excludeSocket - Optionnal socket to ignore when
   *  broadcasting the message, typically the client at the origin of the message.
   * @param {string} channel - Channel name.
   * @param {TypedArray} typedArray - Binary data to be sent.
   */
  broadcastBinary(roomIds, excludeSocket, channel, typedArray) {
    this._broadcast(true, roomIds, excludeSocket, channel, typedArray);
  }
}

export default Sockets;
