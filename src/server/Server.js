import EventEmitter from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';


import {
  isPlainObject,
  counter,
  getTime,
} from '@ircam/sc-utils';
import chalk from 'chalk';
import Keyv from 'keyv';
import { KeyvFile } from 'keyv-file';
import merge from 'lodash/merge.js';

import auditClassDescription from './audit-state-class-description.js';
import {
  encryptData,
  decryptData,
} from './crypto.js';
import {
  createHttpServer,
} from './create-http-server.js';
import ServerClient, {
  kServerClientToken,
} from './ServerClient.js';
import ServerContextManager, {
  kServerContextManagerStart,
  kServerContextManagerStop,
  kServerContextManagerAddClient,
  kServerContextManagerRemoveClient,
} from './ServerContextManager.js';
import ServerPluginManager, {
  kServerPluginManagerCheckRegisteredPlugins,
  kServerPluginManagerAddClient,
  kServerPluginManagerRemoveClient,
} from './ServerPluginManager.js';
import {
  kPluginManagerStart,
  kPluginManagerStop,
} from '../common/BasePluginManager.js';
import ServerStateManager, {
  kServerStateManagerAddClient,
  kServerStateManagerRemoveClient,
  kServerStateManagerHasClient,
} from './ServerStateManager.js';
import {
  kStateManagerInit,
} from '../common/BaseStateManager.js';
import {
  kSocketClientId,
  kSocketTerminate,
} from './ServerSocket.js';
import ServerSockets, {
  kSocketsStart,
  kSocketsStop,
} from './ServerSockets.js';
import logger from '../common/logger.js';
import {
  SERVER_ID,
  CLIENT_HANDSHAKE_REQUEST,
  CLIENT_HANDSHAKE_RESPONSE,
  CLIENT_HANDSHAKE_ERROR,
  AUDIT_STATE_NAME,
} from '../common/constants.js';
import VERSION from '../common/version.js';

let _dbNamespaces = new Set();

/** @private */
const DEFAULT_CONFIG = {
  env: {
    type: 'development',
    port: 8000,
    serverAddress: '',
    useHttps: false,
    httpsInfos: null,
    baseUrl: '',
    crossOriginIsolated: true,
    verbose: true,
  },
  app: {
    name: 'soundworks',
    clients: {},
  },
};

const TOKEN_VALID_DURATION = 10; // sec

export const kServerOnSocketConnection = Symbol('soundworks:server-on-socket-connection');
export const kServerIsValidConnectionToken = Symbol('soundworks:server-is-valid-connection-token');
// protected and not private for testing purposes
export const kServerOnStatusChangeCallbacks = Symbol('soundworks:server-on-status-change-callbacks');

/**
 * The `Server` class is the main entry point for soundworks server-side project.
 *
 * The `Server` instance allows to access soundworks components such as {@link ServerStateManager},
 * {@link ServerPluginManager}, {@link ServerSocket} or {@link ServerContextManager}.
 * Its is also responsible for handling the initialization lifecycle of the different
 * soundworks components.
 *
 * ```
 * import { Server } from '@soundworks/core/server';
 *
 * const server = new Server({
 *   app: {
 *     name: 'my-example-app',
 *     clients: {
 *       player: { runtime: 'browser', default: true },
 *       controller: { runtime: 'browser' },
 *       thing: { runtime: 'node' }
 *     },
 *   },
 *   env: {
 *     port: 8000,
 *   },
 * });
 *
 * await server.start();
 * ```
 */
class Server {
  #config = null;
  #version = null;
  #status = null;
  #router = null;
  #httpServer = null;
  #db = null;

  #sockets = null;
  #pluginManager = null;
  #stateManager = null;
  #contextManager = null;

  #onClientConnectCallbacks = new Set();
  #onClientDisconnectCallbacks = new Set();
  #auditState = null;
  #tokenIdGenerator = counter();
  #pendingConnectionTokens = new Set();
  #trustedClients = new Set();

  // for backward compatibility
  #useDefaultApplicationTemplate = false;

  /**
   * @param {ServerConfig} config - Configuration object for the server.
   * @throws
   * - If `config.app.clients` is empty.
   * - If a `node` client is defined but `config.env.serverAddress` is not defined.
   * - if `config.env.useHttps` is `true` and `config.env.httpsInfos` is not `null`
   *   (which generates self signed certificated), `config.env.httpsInfos.cert` and
   *   `config.env.httpsInfos.key` should point to valid cert files.
   */
  constructor(config) {
    if (!isPlainObject(config)) {
      throw new Error(`[soundworks:Server] Cannot construct 'Server': Parameter 1 must be an object`);
    }

    this.#config = merge({}, DEFAULT_CONFIG, config);

    // ---------------------------------------------------------------------
    // Deprecation checks for config
    // ---------------------------------------------------------------------

    // `target` renamed to `runtime`
    for (let role in this.#config.app.clients) {
      const clientConfig = this.#config.app.clients[role];

      if (clientConfig.target) {
        logger.deprecated('ClientDescription#target', 'ClientDescription#runtime (or run `npx soundworks --upgrade-config` to upgrade your config files)', '4.0.0-alpha.29');
        clientConfig.runtime = clientConfig.target;
        delete clientConfig.target;
      }
    }

    // `env.subpath` to `env.baseUrl`
    if ('subpath' in this.#config.env) {
      logger.deprecated('ServerConfig#subpath', 'ServerConfig#baseUrl (or run `npx soundworks --upgrade-config` to upgrade your config files)', '4.0.0-alpha.29');
      this.#config.env.baseUrl = this.#config.env.subpath;
      delete this.#config.env.subpath;
    }

    // ---------------------------------------------------------------------
    // ---------------------------------------------------------------------

    if (Object.keys(this.#config.app.clients).length === 0) {
      throw new Error(`[soundworks:Server] Cannot construct 'Server': At least one ClientDescription must be declared in 'config.app.clients'`);
    }

    for (let name in this.#config.app.clients) {
      // runtime property is mandatory
      if (!['node', 'browser'].includes(this.#config.app.clients[name].runtime)) {
        throw new Error(`[soundworks:Server] Cannot construct 'Server': Invalid 'ClientDescription' for client '${name}': 'runtime' property must be either 'node' or 'browser'`);
      }
    }

    // @peeka - remove this check
    // [2024-05-29] Override default `config.env.serverAddress`` provided from
    // template `loadConfig` to '' so that browser clients can default to
    // window.location.hostname and node clients to `127.0.0.1`
    if (process.env.ENV === undefined && this.config.env.serverAddress === '127.0.0.1') {
      this.config.env.serverAddress = '';
    }

    if (this.#config.env.useHttps && this.#config.env.httpsInfos !== null) {
      const httpsInfos = this.#config.env.httpsInfos;

      if (!isPlainObject(this.#config.env.httpsInfos)) {
        throw new Error(`[soundworks:Server] Invalid "env.httpsInfos" config, should be null or object { cert, key }`);
      }

      if (!('cert' in httpsInfos) || !('key' in httpsInfos)) {
        throw new Error(`[soundworks:Server] Invalid "env.httpsInfos" config, should contain both "cert" and "key" entries`);
      }
      // @todo - move that to constructor
      if (httpsInfos.cert !== null && !fs.existsSync(httpsInfos.cert)) {
        throw new Error(`[soundworks:Server] Invalid "env.httpsInfos" config, "cert" file not found`);
      }

      if (httpsInfos.key !== null && !fs.existsSync(httpsInfos.key)) {
        throw new Error(`[soundworks:Server] Invalid "env.httpsInfos" config, "key" file not found`);
      }
    }

    // private
    this.#version = VERSION;
    this.#sockets = new ServerSockets(this, { path: 'socket' });
    this.#pluginManager = new ServerPluginManager(this);
    this.#stateManager = new ServerStateManager();
    this.#contextManager = new ServerContextManager(this);
    this.#status = 'idle';
    this.#db = this.createNamespacedDb('core');
    // protected
    this[kServerOnStatusChangeCallbacks] = new Set();

    // register audit state schema
    this.#stateManager.defineClass(AUDIT_STATE_NAME, auditClassDescription);

    logger.configure(this.#config.env.verbose);
  }

  /**
   * Given config object merged with the following defaults:
   * @example
   * {
   *   env: {
   *     type: 'development',
   *     port: 8000,
   *     serverAddress: null,
   *     baseUrl: '',
   *     useHttps: false,
   *     httpsInfos: null,
   *     crossOriginIsolated: true,
   *     verbose: true,
   *   },
   *   app: {
   *     name: 'soundworks',
   *     clients: {},
   *   }
   * }
   * @type {ServerConfig}
   */
  get config() {
    return this.#config;
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
   * Id of the server, a constant set to -1
   * @type {number}
   * @readonly
   */
  get id() {
    return SERVER_ID;
  }

  /**
   * Status of the server.
   *
   * @type {'idle'|'inited'|'started'|'errored'}
   */
  get status() {
    return this.#status;
  }

  /**
   * Instance of the express router.
   *
   * The router can be used to open new route, for example to expose a directory
   * of static assets (in default soundworks applications only the `public` is exposed).
   *
   * @see {@link https://github.com/expressjs/express}
   * @example
   * import { Server } from '@soundworks/core/server.js';
   * import express from 'express';
   *
   * // create the soundworks server instance
   * const server = new Server(config);
   *
   * // expose assets located in the `soundfiles` directory on the network
   * server.router.use('/soundfiles', express.static('soundfiles')));
   */
  get router() {
    return this.#router;
  }

  set router(router) {
    this.#router = router;
  }

  /**
   * Raw Node.js `http` or `https` instance
   *
   * @see {@link https://nodejs.org/api/http.html}
   * @see {@link https://nodejs.org/api/https.html}
   */
  get httpServer() {
    return this.#httpServer;
  }


  /**
   * Simple key / value filesystem database with Promise based Map API.
   *
   * Basically a tiny wrapper around the {@link https://github.com/lukechilds/keyv} package.
   */
  get db() {
    return this.#db;
  }

  /**
   * Instance of the {@link ServerSockets} class.
   *
   * @type {ServerSockets}
   */
  get sockets() {
    return this.#sockets;
  }

  /**
   * Instance of the {@link ServerPluginManager} class.
   *
   * @type {ServerPluginManager}
   */
  get pluginManager() {
    return this.#pluginManager;
  }

  /**
   * Instance of the {@link ServerStateManager} class.
   *
   * @type {ServerStateManager}
   */
  get stateManager() {
    return this.#stateManager;
  }

  /**
   * Instance of the {@link ServerContextManager} class.
   *
   * @type {ServerContextManager}
   */
  get contextManager() {
    return this.#contextManager;
  }

  /** @private */
  async #dispatchStatus(status) {
    this.#status = status;

    // if launched in a child process, forward status to parent process
    if (process.send !== undefined) {
      process.send(`soundworks:server:${status}`);
    }

    // execute all callbacks in parallel
    const promises = [];

    for (let callback of this[kServerOnStatusChangeCallbacks]) {
      promises.push(callback(status));
    }

    await Promise.all(promises);
  }

  /**
   * Register a callback to execute when status change.
   *
   * Status are dispatched in the following order:
   * - 'http-server-ready'
   * - 'inited'
   * - 'started'
   * - 'stopped'
   * during the lifecycle of the server. If an error occurs the 'errored' status is propagated.
   *
   * @param {function} callback
   */
  onStatusChange(callback) {
    this[kServerOnStatusChangeCallbacks].add(callback);
    return () => this[kServerOnStatusChangeCallbacks].delete(callback);
  }

  /**
   * Attach and retrieve the global audit state of the application.
   *
   * The audit state is a {@link SharedState} instance that keeps track of
   * global information about the application such as, the number of connected
   * clients, network latency estimation, etc.
   *
   * The audit state is created by the server on start up.
   *
   * @returns {Promise<SharedState>}
   * @throws Will throw if called before `server.init()`
   *
   * @example
   * const auditState = await server.getAuditState();
   * auditState.onUpdate(() => console.log(auditState.getValues()), true);
   */
  async getAuditState() {
    if (this.#status === 'idle') {
      throw new Error(`[soundworks.Server] Cannot access audit state before init`);
    }

    return this.#auditState;
  }

  /**
   * The `init` method is part of the initialization lifecycle of the `soundworks`
   * server. Most of the time, the `init` method will be implicitly called by the
   * {@link Server#start} method.
   *
   * In some situations you might want to call this method manually, in such cases
   * the method should be called before the {@link Server#start} method.
   *
   * What it does:
   * 1) Create the audit state
   * 2) Create the HTTP(s) server
   * 3) Initialize registered plugins
   *
   * Between steps 2 and 3, the 'http-server-ready' event status is dispatched so
   * that consumer code can register its router before plugin initialization:
   * ```js
   * server.onStatusChange(status => {
   *   if (status === 'http-server-ready') {
   *     server.httpServer.on('request', router);
   *   }
   * });
   * ```
   *
   * After `await server.init()` is fulfilled, the {@link Server#stateManager}
   * and all registered plugins can be safely used.
   *
   * @example
   * const server = new Server(config);
   * await server.init();
   * await server.start();
   * // or implicitly called by start
   * const server = new Server(config);
   * await server.start(); // init is called implicitly
   */
  async init() {
    // init `ServerStateManager` and global "audit" state
    this.#stateManager[kStateManagerInit](SERVER_ID, new EventEmitter());

    const numClients = {};
    for (let name in this.#config.app.clients) {
      numClients[name] = 0;
    }

    this.#auditState = await this.#stateManager.create(AUDIT_STATE_NAME, { numClients });

    // backward compatibility for `useDefaultApplicationTemplate`
    if (this.#useDefaultApplicationTemplate === true) {
      const { configureHttpRouter } = await import('@soundworks/helpers/server.js');
      configureHttpRouter(this);
    }

    // create HTTP(S) SERVER
    try {
      this.#httpServer = await createHttpServer(this);
      await this.#dispatchStatus('http-server-ready');
    } catch (err) {
      logger.error(err.message);
      await this.#dispatchStatus('errored');
      throw err;
    }

    // start `ServerPluginManager`
    await this.#pluginManager[kPluginManagerStart]();
    await this.#dispatchStatus('inited');
  }

  /**
   * The `start` method is part of the initialization lifecycle of the `soundworks`
   * server. The `start` method will implicitly call the {@link Server#init}
   * method if it has not been called manually.
   *
   * What it does:
   * - implicitly call {@link Server#init} if not done manually
   * - launch the HTTP and WebSocket servers
   * - start all created contexts. To this end, you will have to call `server.init`
   * manually and instantiate the contexts between `server.init()` and `server.start()`
   *
   * After `await server.start()` the server is ready to accept incoming connections
   *
   * @example
   * import { Server } from '@soundworks/core/server.js'
   *
   * const server = new Server(config);
   * await server.start();
   */
  async start() {
    if (this.#status === 'idle') {
      await this.init();
    }

    if (this.#status === 'started') {
      throw new Error(`[soundworks:Server] Cannot call "server.start()" twice`);
    }

    if (this.#status !== 'inited') {
      throw new Error(`[soundworks:Server] Cannot "server.start()" before "server.init()"`);
    }

    // state `ServerContextManager`
    await this.#contextManager[kServerContextManagerStart]();
    // start `SocketServer`
    await this.#sockets[kSocketsStart]();
    // start httpServer
    return new Promise(resolve => {
      const port = this.#config.env.port;
      const protocol = this.#config.env.useHttps ? 'https' : 'http';
      const interfaces = os.networkInterfaces();

      this.#httpServer.listen(port, async () => {
        logger.title(`${protocol} server listening on`);

        Object.keys(interfaces).forEach(dev => {
          interfaces[dev].forEach(details => {
            if (details.family === 'IPv4') {
              logger.ip(protocol, details.address, port);
            }
          });
        });

        await this.#dispatchStatus('started');

        if (this.#config.env.type === 'development') {
          logger.log(`\n> press "${chalk.bold('Ctrl + C')}" to exit`);
        }

        resolve();
      });
    });
  }

  /**
   * Stops all started contexts, plugins, close all the socket connections and
   * the http(s) server.
   *
   * In most situations, you might not need to call this method. However, it can
   * be useful for unit testing or similar situations where you want to create
   * and delete several servers in the same process.
   *
   * @example
   * import { Server } from '@soundworks/core/server.js'
   *
   * const server = new Server(config);
   * await server.start();
   *
   * await new Promise(resolve => setTimeout(resolve, 1000));
   * await server.stop();
   */
  async stop() {
    if (this.#status !== 'started') {
      throw new Error(`[soundworks:Server] Cannot stop() before start()`);
    }

    await this.#contextManager[kServerContextManagerStop]();
    await this.#pluginManager[kPluginManagerStop]();

    this.#sockets[kSocketsStop]();

    this.#httpServer.close(err => {
      if (err) {
        throw new Error(err.message);
      }
    });

    await this.#dispatchStatus('stopped');
  }

  onClientConnect(callback) {
    this.#onClientConnectCallbacks.add(callback);
    return () => this.#onClientConnectCallbacks.delete(callback);
  }

  onClientDisconnect(callback) {
    this.#onClientDisconnectCallbacks.add(callback);
    return () => this.#onClientDisconnectCallbacks.delete(callback);
  }

  /**
   * Socket connection callback.
   * @private
   */
  [kServerOnSocketConnection](role, socket, connectionToken) {
    const client = new ServerClient(role, socket);
    socket[kSocketClientId] = client.id;
    const roles = Object.keys(this.#config.app.clients);

    // this has been validated
    if (this.isProtectedClientRole(role) && this[kServerIsValidConnectionToken](connectionToken)) {
      const { ip } = decryptData(connectionToken);
      const newData = { ip, id: client.id };
      const newToken = encryptData(newData);

      client[kServerClientToken] = newToken;

      this.#pendingConnectionTokens.delete(connectionToken);
      this.#trustedClients.add(client);
    }

    socket.addListener('close', async () => {
      // cleanup if role is valid and client finished handshake
      if (roles.includes(role) && this.#stateManager[kServerStateManagerHasClient](client.id)) {
        // decrement audit state counter
        const numClients = this.#auditState.get('numClients');
        numClients[role] -= 1;
        this.#auditState.set({ numClients });

        // delete token
        if (this.#trustedClients.has(client)) {
          this.#trustedClients.delete(client);
        }

        // if something goes wrong here, the 'close' event is called again and
        // again and again... let's just log the error and terminate the socket
        try {
          // clean context manager, await before cleaning state manager
          await this.#contextManager[kServerContextManagerRemoveClient](client);
          // remove client from pluginManager
          await this.#pluginManager[kServerPluginManagerRemoveClient](client);
          // clean state manager
          await this.#stateManager[kServerStateManagerRemoveClient](client.id);

          this.#onClientDisconnectCallbacks.forEach(callback => callback(client));
        } catch (err) {
          console.error(err);
        }
      }

      // clean sockets
      socket[kSocketTerminate]();
    });

    socket.addListener(CLIENT_HANDSHAKE_REQUEST, async payload => {
      const { role, version, registeredPlugins } = payload;

      if (!roles.includes(role)) {
        console.error(`[soundworks.Server] A client with invalid role ("${role}") attempted to connect`);

        socket.send(CLIENT_HANDSHAKE_ERROR, {
          type: 'invalid-client-type',
          message: `Invalid client role, please check server configuration (valid client roles are: ${roles.join(', ')})`,
        });
        return;
      }

      if (version !== this.#version) {
        logger.warnVersionDiscrepancies(role, version, this.#version);
      }

      try {
        this.#pluginManager[kServerPluginManagerCheckRegisteredPlugins](registeredPlugins);
      } catch (err) {
        socket.send(CLIENT_HANDSHAKE_ERROR, {
          type: 'invalid-plugin-list',
          message: err.message,
        });
        return;
      }

      // increment audit state
      const numClients = this.#auditState.get('numClients');
      numClients[role] += 1;
      this.#auditState.set({ numClients });

      const transport = {
        emit: client.socket.send.bind(client.socket),
        addListener: client.socket.addListener.bind(client.socket),
        removeAllListeners: client.socket.removeAllListeners.bind(client.socket),
      };
      // add client to state manager
      await this.#stateManager[kServerStateManagerAddClient](client.id, transport);
      // add client to plugin manager
      // server-side, all plugins are active for the lifetime of the client
      await this.#pluginManager[kServerPluginManagerAddClient](client, registeredPlugins);
      // add client to context manager
      await this.#contextManager[kServerContextManagerAddClient](client);

      this.#onClientConnectCallbacks.forEach(callback => callback(client));

      const { id, uuid } = client;
      socket.send(CLIENT_HANDSHAKE_RESPONSE, { id, uuid, version: this.#version });
    });
  }

  // make public
  /** @private */
  isProtectedClientRole(role) {
    if (this.#config.env.auth && Array.isArray(this.#config.env.auth.clients)) {
      return this.#config.env.auth.clients.includes(role);
    }

    return false;
  }

  /**
   * Generate a token to secure client connection.
   *
   * The token should be passed to the client-side `Client` config object, it will
   * be internally used to check the WebSocket connection and reject it if the
   * token is invalid.
   */
  generateAuthToken(req) {
    const id = this.#tokenIdGenerator;
    const ip = req.ip;
    const time = getTime();
    const token = { id, ip, time };
    const encryptedToken = encryptData(token);

    this.#pendingConnectionTokens.add(encryptedToken);

    setTimeout(() => {
      this.#pendingConnectionTokens.delete(encryptedToken);
    }, TOKEN_VALID_DURATION * 1000);

    return encryptedToken;
  }

  /** @private */
  [kServerIsValidConnectionToken](token) {
    // token should be in pending token list
    if (!this.#pendingConnectionTokens.has(token)) {
      return false;
    }

    // check the token is not too old
    const data = decryptData(token);
    const now = getTime();

    if (now > data.time + TOKEN_VALID_DURATION) {
      this.#pendingConnectionTokens.delete(token);
      return false;
    } else {
      return true;
    }
  }

  /**
   * Check if the given client is trusted, i.e. config.env.type == 'production'
   * and the client is protected behind a password.
   *
   * @param {ServerClient} client - Client to be tested
   * @returns {boolean}
   */
  isTrustedClient(client) {
    if (this.#config.env.type !== 'production') {
      return true;
    } else {
      return this.#trustedClients.has(client);
    }
  }

  /**
   * Check if the token from a client is trusted, i.e. config.env.type == 'production'
   * and the client is protected behind a password.
   *
   * @param {number} clientId - Id of the client
   * @param {string} clientIp - Ip of the client
   * @param {string} token - Token to be tested
   * @returns {boolean}
   */
  // for stateless interactions, e.g. POST files
  isTrustedToken(clientId, clientIp, token) {
    if (this.#config.env.type !== 'production') {
      return true;
    } else {
      for (let client of this.#trustedClients) {
        if (client.id === clientId && client[kServerClientToken] === token) {
          // check that given token is consistent with client ip and id
          const { id, ip } = decryptData(client[kServerClientToken]);

          if (clientId === id && clientIp === ip) {
            return true;
          }
        }

      }

      return false;
    }
  }

  /**
   * Create namespaced databases for core and plugins
   * (kind of experimental API do not expose in doc for now)
   *
   * @note - introduced in v3.1.0-beta.1
   * @note - used by core and plugin-audio-streams
   * @private
   */
  createNamespacedDb(namespace = null) {
    if (namespace === null || !(typeof namespace === 'string')) {
      throw new Error(`[soundworks:Server] Invalid namespace for ".createNamespacedDb(namespace)", namespace is mandatory and should be a string`);
    }

    if (_dbNamespaces.has(namespace)) {
      throw new Error(`[soundworks:Server] Invalid namespace for ".createNamespacedDb(namespace)", namespace "${namespace}" already exists`);
    }

    // KeyvFile uses fs-extra.outputFile internally so we don't need to create
    // the directory, it will be lazily created if something is written in the db
    // @see https://github.com/zaaack/keyv-file/blob/52502077c78226b3d69a615c80b88e53be096979/index.ts#L157
    const filename = path.join(process.cwd(), '.data', `soundworks-${namespace}.db`);
    // @note - keyv-file doesn't seems to works
    const store = new KeyvFile({ filename });
    const db = new Keyv({ namespace, store });
    db.on('error', err => logger.error(`[soundworks:Server] db ${namespace} error: ${err}`));

    return db;
  }

  /**
   * @deprecated
   */
  useDefaultApplicationTemplate() {
    logger.deprecated('Server#useDefaultApplicationTemplate', '`configureHttpRouter(server)` from the `@soundworks/helpers/server.js` package', '4.0.0-alpha.29');
    this.#useDefaultApplicationTemplate = true;
  }
}

export default Server;
