import {
  Worker,
} from 'node:worker_threads';

import querystring from 'querystring';
import {
  default as WebSocket,
  WebSocketServer,
} from 'ws';

import Socket, {
  kSocketTerminate,
} from './Socket.js';
import networkLatencyWorker from './audit-network-latency.worker.js';


export const kSocketsRemoveFromAllRooms = Symbol('soundworks:sockets-remove-from-all-rooms');
export const kSocketsLatencyStatsWorker = Symbol('soundworks:sockets-latency-stats-worker');
export const kSocketsDebugPreventHeartBeat = Symbol('soundworks:sockets-debug-prevent-heartbeat');

/**
 * Manage all {@link server.Socket} instances.
 *
 * _Important: In most cases, you should consider using a {@link client.SharedState}
 * rather than directly using the Socket instance._
 *
 * @memberof server
 */
class Sockets {
  #wsServer = null;
  #rooms = new Map();

  constructor() {
    // Init special `'*'` room which stores all current connections.
    this.#rooms.set('*', new Set());

    this[kSocketsLatencyStatsWorker] = null;
    this[kSocketsDebugPreventHeartBeat] = false;
  }

  /**
   * Initialize sockets, all sockets are added to two rooms by default:
   * - to the room corresponding to the client `role`
   * - to the '*' room that holds all connected sockets
   *
   * @private
   */
  async start(server, config, onConnectionCallback) {
    // Audit for network latency estimation, the worker is written in cjs so that we
    // can make builds for Max, move back to modules once Max support modules
    this[kSocketsLatencyStatsWorker] = new Worker(networkLatencyWorker, { eval: true });

    const auditState = await server.getAuditState();

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
      path: `/${config.path}`,
    });

    this.#wsServer.on('connection', (ws, req) => {
      const queryString = querystring.decode(req.url.split('?')[1]);
      const { role, token } = queryString;
      const socket = new Socket(ws, this);

      socket.addToRoom('*');
      socket.addToRoom(role);

      onConnectionCallback(role, socket, token);
    });

    // Prevent socket with protected role to connect is token is invalid
    server.httpServer.on('upgrade', async (req, socket, head) => {
      const queryString = querystring.decode(req.url.split('?')[1]);
      const { role, token } = queryString;

      if (server.isProtected(role)) {
        // we don't have any IP in the upgrade request object,
        // so we just check the connection token is pending and valid
        if (!server.isValidConnectionToken(token)) {
          socket.destroy('not allowed');
        }
      }

      this.#wsServer.handleUpgrade(req, socket, head, (ws) => {
        this.#wsServer.emit('connection', ws, req);
      });
    });
  }

  /**
   * Terminate all existing sockets
   * @private
   */
  terminate() {
    // terminate stat worker thread
    this[kSocketsLatencyStatsWorker].terminate();
    // clean sockets
    const sockets = this.#rooms.get('*');
    sockets.forEach(socket => socket[kSocketTerminate]());
  }

  /**
   * Add a socket to a room.
   *
   * _Note that in most cases, you should use a shared state instead_
   *
   * @param {server.Socket} socket - Socket to add to the room.
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
   * _Note that in most cases, you should use a shared state instead_
   *
   * @param {server.Socket} socket - Socket to remove from the room.
   * @param {String} roomId - Id of the room.
   */
  removeFromRoom(socket, roomId) {
    if (this.#rooms.has(roomId)) {
      const room = this.#rooms.get(roomId);
      room.delete(socket);
    }
  }

  [kSocketsRemoveFromAllRooms](socket) {
    for (let [_key, room] of this.#rooms) {
      room.delete(socket);
    }
  }

  /**
   * Send a message to all clients os given room(s). If no room is specified,
   * the message is sent to all clients.
   *
   * _Note that in most cases, you should use a shared state instead_
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
    const targets = new Set();

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

export default Sockets;
