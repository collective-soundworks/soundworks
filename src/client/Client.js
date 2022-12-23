import isPlainObject from 'is-plain-obj';

import ContextManager from './ContextManager.js';
import PluginManager from './PluginManager.js';
import Socket from './Socket.js';
import StateManager from './StateManager.js';
import {
  CLIENT_HANDSHAKE_REQUEST,
  CLIENT_HANDSHAKE_RESPONSE,
  CLIENT_HANDSHAKE_ERROR,
  AUDIT_STATE_NAME,
} from '../common/constants.js';
import { isBrowser } from '../common/utils.js';
import logger from '../common/logger.js';

/**
 * Create a new soundworks client.
 *
 * The `Client` is the main entry point to access *soundworks* components
 * such as {@link client.Socket}, {@link client.PluginManager},
 * {@link client.StateManager} or {@link client.ContextManager}.
 * The client is responsible for the initialization lifecycle of the application.
 *
 * @memberof client
 * @throws Will throw if the given config object is invalid.
 * @example
 * import { Client } from '@soundworks/core/client.js';
 *
 * // create a new soundworks `Client` instance
 * const client = new Client({ role: 'player' });
 * // init and start the client
 * await client.start();
 */
class Client {
  /**
   * @param {object} config - Configuration of the soundworks client.
   */
  constructor(config) {
    if (!isPlainObject(config)) {
      throw new Error(`[soundworks:Client] Invalid argument for Client constructor, config should be an object`);
    }

    if (!('role' in config)) {
      throw new Error('[soundworks:Client] Invalid config object, "config.role" should be defined');
    }

    // for node clients env.https is requires to open the websocket
    if (!isBrowser()) {
      if (!('env' in config)) {
        throw new Error('[soundworks:Client] Invalid config object, "config.env" { useHttps, serverAddress, port } should be defined');
      }

      let missing = [];

      if (!('useHttps' in config.env)) {
        missing.push('useHttps');
      }

      if (!('serverAddress' in config.env)) {
        missing.push('serverAddress');
      }

      if (!('port' in config.env)) {
        missing.push('port');
      }

      if (missing.length) {
        throw new Error(`[soundworks:Client] Invalid config object, "config.env" is missing: ${missing.join(', ')}`);
      }
    }

    /**
     * Role of the client in the application.
     *
     * @type {string}
     */
    this.role = config.role;

    /**
     * Configuration object, typically contains the configuration sent by the
     * server.
     *
     * @todo typedef
     * @type {object}
     * @see {@link server.Server}.
     */
    this.config = config;

    if (!this.config.env) {
      this.config.env = {};
    }

    // minimal configuration for websockets
    this.config.env.websockets = Object.assign({
      path: 'socket',
      pingInterval: 5000,
    }, config.env.websockets);

    /**
     * Session id of the client (incremeted positive number), generated and
     * retrieved by the server during `client.init`. The counter is reset when
     * the server restarts.
     *
     * @type {number}
     */
    this.id = null;

    /**
     * Unique session uuid of the client (uuidv4), generated and retrieved by
     * the server during {@link client.Client#init}.
     *
     * @type {string}
     */
    this.uuid = null;

    /**
     * Instance of the {@link client.Socket} class that handle websockets communications with
     * the server.
     *
     * @see {@link client.Socket}
     * @type {client.Socket}
     */
    this.socket = new Socket();

    /**
     * Target platform of the client, i.e. 'browser' or 'node'.
     *
     * @type {string}
     */
    this.target = isBrowser() ? 'browser' : 'node';

    /**
     * Instance of the {@link client.ContextManager} class.
     *
     * The context manager requires the socket to be connected therefore it can be
     * accessed and used only after `client.init()` has been fulfilled.
     *
     * @see {@link client.ContextManager}
     * @type {client.ContextManager}
     */
    this.contextManager = new ContextManager();

    /**
     * Instance of the {@link client.PluginManager} class.
     *
     * The plugin manager requires the socket to be connected therefore it can be
     * accessed and used only after `client.init()` has been fulfilled.
     *
     * @see {@link client.PluginManager}
     * @type {client.PluginManager}
     */
    this.pluginManager = new PluginManager(this);

    /**
     * Instance of the {@link client.StateManager} class.
     *
     * The state manager requires the socket to be connected therefore it can be
     * accessed and used only after `client.init()` has been fulfilled.
     *
     * @see {@link client.StateManager}
     * @type {client.StateManager}
     */
    this.stateManager = null;

    /**
     * Status of the client, 'idle', 'inited', 'started' or 'errored'.
     *
     * @type {string}
     */
    this.status = 'idle';

    /** @private */
    this._auditState = null;

    logger.configure(!!config.env.verbose);
  }

  /**
   * Method to be called before {@link client.Client#start} in the
   * initialization lifecycle of the soundworks client.
   *
   * - connect the sockets to be server
   * - do the handshake with soundwoks server (retrieve id, etc.)
   * - launch the state manager
   * - init registered plugin
   *
   * After calling `await client.init()`, the stateManaher and the pluginManager
   * can be safely used.
   *
   * @see {@link server.Server}
   */
  async init() {
    // init socket communications (string and binary)
    await this.socket.init(this.role, this.config);

    // we need the try/catch block to change the promise rejection into proper error
    try {
      await new Promise((resolve, reject) => {
        // wait for handshake response before starting stateManager and pluginManager
        this.socket.addListener(CLIENT_HANDSHAKE_RESPONSE, async ({ id, uuid }) => {
          this.id = id;
          this.uuid = uuid;

          resolve();
        });

        this.socket.addListener(CLIENT_HANDSHAKE_ERROR, (err) => {
          let msg = ``;

          switch(err.type) {
            case 'invalid-client-type':
              msg = `[soundworks:Client] ${err.message}`;
              break;
            case 'invalid-plugin-list':
              msg = `[soundworks:Client] ${err.message}`;
              break;
            default:
              msg = `Undefined error`;
              break;
          }

          this.socket.terminate();
          reject(msg);
        });

        // send handshake request
        const payload = {
          role: this.role,
          registeredPlugins: this.pluginManager.getRegisteredPlugins(),
        };

        this.socket.send(CLIENT_HANDSHAKE_REQUEST, payload);
      });
    } catch(err) {
      throw new Error(err);
    }

    // ------------------------------------------------------------
    // CREATE STATE MANAGER
    // ------------------------------------------------------------
    this.stateManager = new StateManager(this.id, {
      emit: this.socket.send.bind(this.socket), // need to alias this
      addListener: this.socket.addListener.bind(this.socket),
      removeAllListeners: this.socket.removeAllListeners.bind(this.socket),
    });

    // ------------------------------------------------------------
    // INIT PLUGIN MANAGER
    // ------------------------------------------------------------
    await this.pluginManager.start();

    this.status = 'inited';

    return Promise.resolve();
  }

  /**
   * Method to be called when {@link client.Client#init} has finished in the
   * initialization lifecycle of the soundworks client.
   *
   * - starts all the registered contexts
   *
   * @see {@link server.Server#start}
   */
  async start() {
    if (this.status === 'idle') {
      await this.init();
    }

    if (this.status === 'started') {
      throw new Error(`[soundworks:Server] Cannot call "client.start()" twice`);
    }

    if (this.status !== 'inited') {
      throw new Error(`[soundworks:Server] Cannot "client.start()" before "client.init()"`);
    }

    // ------------------------------------------------------------
    // START CONTEXT MANAGER
    // ------------------------------------------------------------
    await this.contextManager.start();

    this.status = 'started';
  }

  /**
   * Stop the client. Stops all started contexts, plugins and terminates the socket
   * connections.
   */
  async stop() {
    if (this.status !== 'started') {
      throw new Error(`[soundworks:Client] Cannot stop() before start()`);
    }

    await this.contextManager.stop();
    await this.pluginManager.stop();
    await this.socket.terminate();
  }

  /**
   * Get the global audit state of the application. The audit state is lazily
   * attached to the client only if this method is called.
   *
   * @throws Will throw if called before `client.init()`
   */
  async getAuditState() {
    if (this.status === 'idle') {
      throw new Error(`[soundworks.Client] Cannot access audit state before init`);
    }

    if (this._auditState === null) {
      this._auditState = await this.stateManager.attach(AUDIT_STATE_NAME);
    }

    return this._auditState;
  }
}

export default Client;
