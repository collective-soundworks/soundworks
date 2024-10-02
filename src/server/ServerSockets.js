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

export const kSocketsDeleteSocket = Symbol('soundworks:sockets-delete-socket');
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
  #sockets = new Set();

  constructor(server, config) {
    this.#server = server;
    this.#config = config;

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

      this.#sockets.add(socket);
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
    // terminate sockets
    this.#sockets.forEach(socket => socket[kSocketTerminate]());
  }

  /**
   * Remove given socket from all rooms.
   * @private
   */
  [kSocketsDeleteSocket](socket) {
    this.#sockets.delete(socket);
  }

  entries() {
    return this.#sockets.entries();
  }

  keys() {
    return this.#sockets.keys();
  }

  values() {
    return this.#sockets.values();
  }

  forEach(func) {
    return this.#sockets.forEach(func);
  }
}

export default ServerSockets;
