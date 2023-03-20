import { isBrowser, isPlainObject } from '@ircam/sc-utils';

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
import logger from '../common/logger.js';

/**
 * Configuration object for a client running in a browser runtime.
 *
 * @typedef BrowserClientConfig
 * @memberof client
 * @type {object}
 * @property {string} role - Role of the client in the application (e.g. 'player', 'controller').
 * @property {object} [app] - Application configration object.
 * @property {string} [app.name=''] - Name of the application.
 * @property {string} [app.author=''] - Name of the author.
 * @property {object} [env] - Environment configration object.
 * @property {string} [env.websockets={}] - Configuration options for websockets.
 * @property {string} [env.subpath=''] - If running behind a proxy, path to the application.
 */

/**
 * Configuration object for a client running in a node runtime.
 *
 * @typedef NodeClientConfig
 * @memberof client
 * @type {object}
 * @property {string} role - Role of the client in the application (e.g. 'player', 'controller').
 * @property {object} [app] - Application configration object.
 * @property {string} [app.name=''] - Name of the application.
 * @property {string} [app.author=''] - Name of the author.
 * @property {object} env - Environment configration object.
 * @property {boolean} env.serverAddress - Domain name or IP of the server.
 * @property {boolean} env.useHttps - Define is the server run in http or in https.
 * @property {boolean} env.port - Port on which the server is listening.
 * @property {string} [env.websockets={}] - Configuration options for websockets.
 * @property {string} [env.subpath=''] - If running behind a proxy, path to the application.
 */

/**
 * The `Client` class is the main entry point for the client-side of a soundworks
 * application.
 *
 * A `Client` instance allows to access soundworks components such as {@link client.StateManager},
 * {@link client.PluginManager},{@link client.Socket} or {@link client.ContextManager}.
 * Its is also responsible for handling the initialization lifecycles of the different
 * soundworks components.
 *
 * ```
 * import { Client } from '@soundworks/core/client.js';
 * // create a new soundworks `Client` instance
 * const client = new Client({ role: 'player' });
 * // init and start the client
 * await client.start();
 * ```
 *
 * @memberof client
 */
class Client {
  /**
   * @param {client.BrowserClientConfig|client.NodeClientConfig} config -
   *  Configuration of the soundworks client.
   * @throws Will throw if the given config object is invalid.
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
     * Configuration object.
     *
     * @type {client.BrowserClientConfig|client.NodeClientConfig}
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
     * Runtime platform on which the client is executed, i.e. 'browser' or 'node'.
     *
     * @type {string}
     */
    this.target = isBrowser() ? 'browser' : 'node';

    /**
     * Instance of the {@link client.ContextManager} class.
     *
     * The context manager can be safely used after `client.init()` has been fulfilled.
     *
     * @see {@link client.ContextManager}
     * @type {client.ContextManager}
     */
    this.contextManager = new ContextManager();

    /**
     * Instance of the {@link client.PluginManager} class.
     *
     * The context manager can be safely used after `client.init()` has been fulfilled.
     *
     * @see {@link client.PluginManager}
     * @type {client.PluginManager}
     */
    this.pluginManager = new PluginManager(this);

    /**
     * Instance of the {@link client.StateManager} class.
     *
     * The context manager can be safely used after `client.init()` has been fulfilled.
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

    /**
     * Token of the client if connected through HTTP authentication.
     * @private
     */
    this.token = null;

    /** @private */
    this._onStatusChangeCallbacks = new Set();
    /** @private */
    this._auditState = null;

    logger.configure(!!config.env.verbose);
  }

  /**
   * The `init` method is part of the initialization lifecycle of the `soundworks`
   * client. Most of the time, the `init` method will be implicitly called by the
   * {@link client.Client#start} method.
   *
   * In some situations you might want to call this method manually, in such cases
   * the method should be called before the {@link client.Client#start} method.
   *
   * What it does:
   * - connect the sockets to be server
   * - perform the handshake with soundworks server (retrieve id, etc.)
   * - launch the state manager
   * - initialize all registered plugin
   *
   * After `await client.init()` is fulfilled, the {@link client.Client#stateManager},
   * the {@link client.Client#pluginManager} and the {@link client.Client#socket}
   * can be safely used.
   *
   * @example
   * import { Client } from '@soundworks/core/client.js'
   *
   * const client = new Client(config);
   * // optionnal explicit call of `init` before `start`
   * await client.init();
   * await client.start();
   */
  async init() {
    // init socket communications (string and binary)
    await this.socket.init(this.role, this.config);

    // we need the try/catch block to change the promise rejection into proper error
    try {
      await new Promise((resolve, reject) => {
        // wait for handshake response before starting stateManager and pluginManager
        this.socket.addListener(CLIENT_HANDSHAKE_RESPONSE, async ({ id, uuid, token }) => {
          this.id = id;
          this.uuid = uuid;
          this.token = token;

          resolve();
        });

        this.socket.addListener(CLIENT_HANDSHAKE_ERROR, (err) => {
          let msg = ``;

          switch (err.type) {
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
    } catch (err) {
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

    await this._dispatchStatus('inited');
  }

  /**
   * The `start` method is part of the initialization lifecycle of the `soundworks`
   * client. The `start` method will implicitly call the {@link client.Client#init}
   * method if it has not been called manually.
   *
   * What it does:
   * - implicitly call {@link client.Client#init} if not done manually
   * - start all created contexts. For that to happen, you will have to call `client.init`
   * manually and instantiate the contexts between `client.init()` and `client.start()`
   *
   * @example
   * import { Client } from '@soundworks/core/client.js'
   *
   * const client = new Client(config);
   * await client.start();
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

    await this._dispatchStatus('started');
  }

  /**
   * Stops all started contexts, plugins and terminates the socket connections.
   *
   * In most situations, you might not need to call this method. However, it can
   * be usefull for unit testing or similar situations where you want to create
   * and delete several clients in the same process.
   *
   * @example
   * import { Client } from '@soundworks/core/client.js'
   *
   * const client = new Client(config);
   * await client.start();
   *
   * await new Promise(resolve => setTimeout(resolve, 1000));
   * await client.stop();
   */
  async stop() {
    if (this.status !== 'started') {
      throw new Error(`[soundworks:Client] Cannot "client.stop()" before "client.start()"`);
    }

    await this.contextManager.stop();
    await this.pluginManager.stop();
    await this.socket.terminate();

    await this._dispatchStatus('stopped');
  }

  /**
   * Attach and retrieve the global audit state of the application.
   *
   * The audit state is a {@link client.SharedState} instance that keeps track of
   * global informations about the application such as, the number of connected
   * clients, network latency estimation, etc. It is usefull for controller client
   * roles to give the user an overview about the state of the application.
   *
   * The audit state is lazily attached to the client only if this method is called.
   *
   * @returns {Promise<client.SharedState>}
   * @throws Will throw if called before `client.init()`
   * @see {@link client.SharedState}
   * @example
   * const auditState = await client.getAuditState();
   * auditState.onUpdate(() => console.log(auditState.getValues()), true);
   */
  async getAuditState() {
    if (this.status === 'idle') {
      throw new Error(`[soundworks.Client] Cannot access audit state before "client.init()"`);
    }

    if (this._auditState === null) {
      this._auditState = await this.stateManager.attach(AUDIT_STATE_NAME);
    }

    return this._auditState;
  }

  /**
   * Listen for the status change ('inited', 'started', 'stopped') of the client.
   *
   * @param {Function} callback - Listener to the status change.
   * @returns {Function} Delete the listener.
   */
  onStatusChange(callback) {
    this._onStatusChangeCallbacks.add(callback);

    return () => this._onStatusChangeCallbacks.delete(callback);
  }

  /** @private */
  async _dispatchStatus(status) {
    this.status = status;

    // if node target and launched in a child process, forward status to parent process
    if (this.target === 'node' && process.send !== undefined) {
      process.send(`soundworks:client:${status}`);
    }

    // execute all callbacks in parallel
    const promises = [];

    for (let callback of this._onStatusChangeCallbacks) {
      promises.push(callback(status));
    }

    await Promise.all(promises);
  }
}

export default Client;
