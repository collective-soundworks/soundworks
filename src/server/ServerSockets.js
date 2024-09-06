import querystring from 'node:querystring';
import {
  Worker,
} from 'node:worker_threads';

import {
  default as WebSocket,
  WebSocketServer,
} from 'ws';

import {
  kServerOnSocketConnection,
  kServerIsProtectedRole,
} from './Server.js';
import ServerSocket, {
  kSocketTerminate,
} from './ServerSocket.js';

// @note - fs.readFileSync creates some cwd() issues...
import networkLatencyWorker from './audit-network-latency.worker.js';

export const kSocketsStart = Symbol('soundworks:sockets-start');
export const kSocketsStop = Symbol('soundworks:sockets-stop');

export const kSocketsRemoveFromAllRooms = Symbol('soundworks:sockets-remove-from-all-rooms');
export const kSocketsLatencyStatsWorker = Symbol('soundworks:sockets-latency-stats-worker');
export const kSocketsDebugPreventHeartBeat = Symbol('soundworks:sockets-debug-prevent-heartbeat');

/**
 * Manage all {@link ServerSocket} instances.
 *
 * _Important: In most cases, you should consider using a {@link SharedState}
 * rather than directly using the ServerSocket instance._
 */
class ServerSockets {
  #server = null;
  #config = null;
  #wsServer = null;
  #rooms = new Map();

  constructor(server, config) {
    this.#server = server;
    this.#config = config;
    // Init special `'*'` room which stores all current connections.
    this.#rooms.set('*', new Set());

    this[kSocketsLatencyStatsWorker] = null;
    this[kSocketsDebugPreventHeartBeat] = false;
  }

  /**
   * Initialize sockets, all sockets are added to two rooms by default:
   * - to the room corresponding to the client `role`
   * - to the '*' room that holds all connected sockets
   * @private
   */
  async [kSocketsStart]() {
    // Audit for network latency estimation, the worker is written in cjs so that we
    // can make builds for Max, move back to modules once Max support modules
    this[kSocketsLatencyStatsWorker] = new Worker(networkLatencyWorker, { eval: true });

    const auditState = await this.#server.getAuditState();

    auditState.onUpdate(updates => {
      if ('averageNetworkLatencyWindow' in updates || 'averageNetworkLatencyPeriod' in updates) {
        this[kSocketsLatencyStatsWorker].postMessage({
          type: 'config',
          value: {
            averageLatencyWindow: updates.averageNetworkLatencyWindow,
            averageLatencyPeriod: updates.averageNetworkLatencyPeriod,
          },
        });
      }
    }, true);

    this[kSocketsLatencyStatsWorker].on('message', msg => {
      if (msg.type === 'computed-average-latency') {
        auditState.set({ averageNetworkLatency: msg.value });
      }
    });

    // Init ws server
    this.#wsServer = new WebSocketServer({
      noServer: true,
      path: `/${this.#config.path}`,
    });

    this.#wsServer.on('connection', (ws, req) => {
      const { role, token } = querystring.parse(req.url.split('?')[1]);
      const socket = new ServerSocket(ws, this);

      socket.addToRoom('*');
      socket.addToRoom(role);

      this.#server[kServerOnSocketConnection](role, socket, token);
    });

    // Prevent socket with protected role to connect if token is invalid
    this.#server.httpServer.on('upgrade', async (req, socket, head) => {
      const { role, token } = querystring.parse(req.url.split('?')[1]);

      if (this.#server[kServerIsProtectedRole](role)) {
        // we don't have any IP in the upgrade request object,
        // so we just check the connection token is pending and valid
        if (!this.#server[kServerIsValidConnectionToken](token)) {
          socket.destroy('not allowed');
        }
      }

      this.#wsServer.handleUpgrade(req, socket, head, (ws) => {
        this.#wsServer.emit('connection', ws, req);
      });
    });
  }

  /**
   * Terminate all existing sockets.
   * @private
   */
  [kSocketsStop]() {
    // terminate stat worker thread
    this[kSocketsLatencyStatsWorker].terminate();
    // clean sockets
    const sockets = this.#rooms.get('*');
    sockets.forEach(socket => socket[kSocketTerminate]());
  }

  /**
   * Remove given socket from all rooms.
   * @private
   */
  [kSocketsRemoveFromAllRooms](socket) {
    for (let [_, room] of this.#rooms) {
      room.delete(socket);
    }
  }

  /**
   * Add a socket to a room.
   *
   * _Note that in most cases, you should use a {@link SharedState} instead_
   *
   * @param {ServerSocket} socket - Socket to add to the room.
   * @param {String} roomId - Id of the room.
   */
  addToRoom(socket, roomId) {
    if (!this.#rooms.has(roomId)) {
      this.#rooms.set(roomId, new Set());
    }

    const room = this.#rooms.get(roomId);
    room.add(socket);
  }

  /**
   * Remove a socket from a room.
   *
   * _Note that in most cases, you should use a {@link SharedState} instead_
   *
   * @param {ServerSocket} socket - Socket to remove from the room.
   * @param {String} roomId - Id of the room.
   */
  removeFromRoom(socket, roomId) {
    if (this.#rooms.has(roomId)) {
      const room = this.#rooms.get(roomId);
      room.delete(socket);
    }
  }

  /**
   * Send a message to all clients os given room(s). If no room is specified,
   * the message is sent to all clients.
   *
   * _Note that in most cases, you should use a {@link SharedState} instead_
   *
   * @param {String|Array} roomsIds - Ids of the rooms that must receive
   *  the message. If `null` the message is sent to all clients.
   * @param {ServerSocket} excludeSocket - Optionnal socket to ignore when
   *  broadcasting the message, typically the client at the origin of the message.
   * @param {String} channel - Channel name.
   * @param {...*} args - Payload of the message. As many arguments as needed, of
   *  JSON compatible data types (i.e. string, number, boolean, object, array and null).
   */
  broadcast(roomIds, excludeSocket, channel, ...args) {
    let targets = new Set();

    if (typeof roomIds === 'string' || Array.isArray(roomIds)) {
      if (typeof roomIds === 'string') {
        roomIds = [roomIds];
      }

      roomIds.forEach(roomId => {
        if (this.#rooms.has(roomId)) {
          const room = this.#rooms.get(roomId);
          room.forEach(socket => targets.add(socket));
        }
      });
    } else {
      targets = this.#rooms.get('*');
    }

    targets.forEach(socket => {
      if (socket.readyState === WebSocket.OPEN && socket !== excludeSocket) {
        socket.send(channel, ...args);
      }
    });
  }
}

export default ServerSockets;
