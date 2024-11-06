import { isBrowser, isPlainObject } from '@ircam/sc-utils';

import ClientContextManager, {
  kClientContextManagerStart,
  kClientContextManagerStop,
} from './ClientContextManager.js';
import ClientPluginManager from './ClientPluginManager.js';
import {
  kPluginManagerStart,
  kPluginManagerStop,
} from '../common/BasePluginManager.js';
import ClientSocket, {
  kSocketTerminate,
} from './ClientSocket.js';
import ClientStateManager from './ClientStateManager.js';
import {
  kStateManagerInit,
} from '../common/BaseStateManager.js';

import {
  CLIENT_HANDSHAKE_REQUEST,
  CLIENT_HANDSHAKE_RESPONSE,
  CLIENT_HANDSHAKE_ERROR,
  AUDIT_STATE_NAME,
} from '../common/constants.js';
import logger from '../common/logger.js';
import VERSION from '../common/version.js';

// for testing purposes
export const kClientVersionTest = Symbol('soundworks:client-version-test');
export const kClientOnStatusChangeCallbacks = Symbol('soundworks:client-on-status-change-callbacks');

/**
 * The `Client` class is the main entry point for the client-side of a soundworks
 * application.
 *
 * A `soundworks` client can run seamlessly in a browser or in a Node.js runtime.
 *
 * It provides an access to the different soundworks components such as the {@link ClientStateManager},
 * {@link ClientPluginManager}, {@link ClientSocket} and the {@link ClientContextManager}.
 *
 * ```
 * import { Client } from '@soundworks/core/client.js';
 * // create a `Client` instance
 * const client = new Client({
 *   role: 'player',
 *   env: {
 *     useHttps: false,
 *     serverAddress: 'localhost',
 *     port: 8000,
 *   },
 * });
 * // start the client
 * await client.start();
 * ```
 */
class Client {
  #config = null;
  #version = null;
  #role = null;
  #id = null;
  #uuid = null;
  #runtime = null;
  #socket = null;
  #contextManager = null;
  #pluginManager = null;
  #stateManager = null;
  #status = 'idle';
  // Token of the client if connected through HTTP authentication.
  #token = null;
  #auditState = null;

  /**
   * @param {ClientConfig} config - Configuration of the soundworks client.
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

    this.#config = config;

    if (!this.#config.env) {
      this.#config.env = {};
    }

    this.#version = VERSION;
    // allow override though config for testing
    if (config[kClientVersionTest]) {
      this.#version = config[kClientVersionTest];
    }

    this.#role = config.role;
    this.#runtime = isBrowser() ? 'browser' : 'node';
    this.#socket = new ClientSocket(this.#role, this.#config, {
      path: 'socket',
      retryConnectionRefusedTimeout: 1000,
    });
    this.#contextManager = new ClientContextManager();
    this.#pluginManager = new ClientPluginManager(this);
    this.#stateManager = new ClientStateManager();
    this.#status = 'idle';

    this[kClientOnStatusChangeCallbacks] = new Set();

    logger.configure(!!config.env.verbose);
  }

  /**
   * Package version.
   *
   * @type {string}
   */
  get version() {
    return this.#version;
  }

  /**
   * Role of the client in the application.
   *
   * @type {string}
   */
  get role() {
    return this.#role;
  }

  /**
   * Configuration object.
   *
   * @type {ClientConfig}
   */
  get config() {
    return this.#config;
  }

  /**
   * Session id of the client.
   *
   * Incremeted positive integer generated and retrieved by the server during
   * `client.init`. The counter is reset when the server restarts.
   *
   * @type {number}
   */
  get id() {
    return this.#id;
  }

  /**
   * Unique session uuid of the client (uuidv4).
   *
   * Generated and retrieved by the server during {@link Client#init}.
   * @type {string}
   */
  get uuid() {
    return this.#uuid;
  }

  /**
   * Runtime platform on which the client is executed, i.e. 'browser' or 'node'.
   *
   * @type {'node'|'browser'}
   */
  get runtime() {
    return this.#runtime;
  }

  /**
   * @deprecated Use {@link Client#runtime} instead.
   */
  get target() {
    logger.deprecated('Client#target', 'Client#runtime', '4.0.0-alpha.29');
    return this.runtime;
  }

  /**
   * Instance of the {@link client.Socket} class.
   *
   * @see {@link ClientSocket}
   * @type {ClientSocket}
   */
  get socket() {
    return this.#socket;
  }

  /**
   * Instance of the {@link ClientContextManager} class.
   *
   * The context manager can be safely used after `client.init()` has been fulfilled.
   *
   * @see {@link ClientContextManager}
   * @type {ClientContextManager}
   */
  get contextManager() {
    return this.#contextManager;
  }

  /**
   * Instance of the {@link ClientPluginManager} class.
   *
   * The context manager can be safely used after `client.init()` has been fulfilled.
   *
   * @see {@link ClientPluginManager}
   * @type {ClientPluginManager}
   */
  get pluginManager() {
    return this.#pluginManager;
  }

  /**
   * Instance of the {@link ClientStateManager} class.
   *
   * The context manager can be safely used after `client.init()` has been fulfilled.
   *
   * @see {@link ClientStateManager}
   * @type {ClientStateManager}
   */
  get stateManager() {
    return this.#stateManager;
  }

  /**
   * Status of the client.
   *
   * @type {'idle'|'inited'|'started'|'errored'}
   */
  get status() {
    return this.#status;
  }

    /** @private */
  async #dispatchStatus(status) {
    this.#status = status;

    // if node target and launched in a child process, forward status to parent process
    if (this.#runtime === 'node' && process.send !== undefined) {
      process.send(`soundworks:client:${status}`);
    }

    // execute all callbacks in parallel
    const promises = [];

    for (let callback of this[kClientOnStatusChangeCallbacks]) {
      promises.push(callback(status));
    }

    await Promise.all(promises);
  }

  /**
   * The `init` method is part of the initialization lifecycle of the `soundworks`
   * client. Most of the time, this method will be implicitly executed by the
   * {@link Client#start} method.
   *
   * In some situations you might want to call this method manually, in such cases
   * the method should be called before the {@link Client#start} method.
   *
   * What it does:
   * - connect the sockets to be server
   * - perform the handshake with soundworks server (retrieve id, etc.)
   * - launch the state manager
   * - initialize all registered plugin
   *
   * After `await client.init()` is fulfilled, the {@link Client#stateManager},
   * the {@link Client#pluginManager} and the {@link Client#socket}
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
    // init socket communications
    await this.#socket.init();

    // we need the try/catch block to change the promise rejection into proper error
    try {
      await new Promise((resolve, reject) => {
        // wait for handshake response before starting stateManager and pluginManager
        this.#socket.addListener(CLIENT_HANDSHAKE_RESPONSE, async ({ id, uuid, token, version }) => {
          this.#id = id;
          this.#uuid = uuid;
          this.#token = token;

          if (version !== this.#version) {
            logger.warnVersionDiscepancies(this.#role, this.#version, version);
          }

          resolve();
        });

        this.#socket.addListener(CLIENT_HANDSHAKE_ERROR, (err) => {
          let msg = ``;

          switch (err.type) {
            case 'invalid-client-type':
              msg = `[soundworks:Client] ${err.message}`;
              break;
            case 'invalid-plugin-list':
              msg = `[soundworks:Client] ${err.message}`;
              break;
            default:
              msg = `[soundworks:Client] Undefined error: ${err.message}`;
              break;
          }

          // These are development errors, we can just hang. If we terminate the
          // socket, a reload is triggered by the launcher which is bad in terms of DX
          reject(msg);
        });

        // send handshake request
        const payload = {
          role: this.#role,
          version: this.#version,
          registeredPlugins: this.#pluginManager.getRegisteredPlugins(),
        };

        this.#socket.send(CLIENT_HANDSHAKE_REQUEST, payload);
      });
    } catch (msg) {
      throw new Error(msg);
    }

    // init state manager
    this.#stateManager[kStateManagerInit](this.id, {
      emit: this.#socket.send.bind(this.#socket), // need to alias this
      addListener: this.#socket.addListener.bind(this.#socket),
      removeAllListeners: this.#socket.removeAllListeners.bind(this.#socket),
    });

    await this.#pluginManager[kPluginManagerStart]();

    await this.#dispatchStatus('inited');
  }

  /**
   * The `start` method is part of the initialization lifecycle of the `soundworks`
   * client. This method will implicitly execute {@link Client#init} method if it
   * has not been called manually.
   *
   * What it does:
   * - implicitly call {@link Client#init} if not done manually
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
    if (this.#status === 'idle') {
      await this.init();
    }

    if (this.#status === 'started') {
      throw new Error(`[soundworks:Server] Cannot call "client.start()" twice`);
    }

    await this.#contextManager[kClientContextManagerStart]();
    await this.#dispatchStatus('started');
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
    if (this.#status !== 'started') {
      throw new Error(`[soundworks:Client] Cannot "client.stop()" before "client.start()"`);
    }

    await this.#contextManager[kClientContextManagerStop]();
    await this.#pluginManager[kPluginManagerStop]();
    await this.#socket[kSocketTerminate]();

    await this.#dispatchStatus('stopped');
  }

  /**
   * Attach and retrieve the global audit state of the application.
   *
   * The audit state is a {@link SharedState} instance that keeps track of
   * global informations about the application such as, the number of connected
   * clients, network latency estimation, etc. It is usefull for controller client
   * roles to give the user an overview about the state of the application.
   *
   * The audit state is lazily attached to the client only if this method is called.
   *
   * @returns {Promise<SharedState>}
   * @throws Will throw if called before `client.init()`
   * @see {@link SharedState}
   * @example
   * const auditState = await client.getAuditState();
   * auditState.onUpdate(() => console.log(auditState.getValues()), true);
   */
  async getAuditState() {
    if (this.#status === 'idle') {
      throw new Error(`[soundworks.Client] Cannot access audit state before "client.init()"`);
    }

    if (this.#auditState === null) {
      this.#auditState = await this.#stateManager.attach(AUDIT_STATE_NAME);
    }

    return this.#auditState;
  }

  /**
   * Listen for the status change ('inited', 'started', 'stopped') of the client.
   *
   * @param {Function} callback - Listener to the status change.
   * @returns {Function} Function that delete the listener when executed.
   */
  onStatusChange(callback) {
    this[kClientOnStatusChangeCallbacks].add(callback);
    return () => this[kClientOnStatusChangeCallbacks].delete(callback);
  }
}

Object.defineProperties(Client.prototype, {
  [Symbol.toStringTag]: {
    __proto__: null,
    writable: false,
    enumerable: false,
    configurable: true,
    value: 'Client',
  },
});

export default Client;
