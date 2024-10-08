import EventEmitter from 'node:events';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import os from 'node:os';
import {
  X509Certificate,
  createPrivateKey,
} from 'node:crypto';

import {
  isPlainObject,
  idGenerator,
  getTime,
} from '@ircam/sc-utils';
import chalk from 'chalk';
import compression from 'compression';
import express from 'express';
import equal from 'fast-deep-equal';
import Keyv from 'keyv';
import { KeyvFile } from 'keyv-file';
import merge from 'lodash/merge.js';
import pem from 'pem';
import compile from 'template-literal';

import auditSchema from './audit-schema.js';
import {
  encryptData,
  decryptData,
} from './crypto.js';
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
    subpath: '',
    useHttps: false,
    httpsInfos: null,
    crossOriginIsolated: true,
    verbose: true,
  },
  app: {
    name: 'soundworks',
    clients: {},
  },
};

const TOKEN_VALID_DURATION = 20; // sec

export const kServerOnSocketConnection = Symbol('soundworks:server-on-socket-connection');
export const kServerIsProtectedRole = Symbol('soundworks:server-is-protected-role');
export const kServerIsValidConnectionToken = Symbol('soundworks:server-is-valid-connection-token');
// for testing purposes
export const kServerOnStatusChangeCallbacks = Symbol('soundworks:server-on-status-change-callbacks');
export const kServerApplicationTemplateOptions = Symbol('soundworks:server-application-template-options');

/**
 * The `Server` class is the main entry point for the server-side of a soundworks
 * application.
 *
 * The `Server` instance allows to access soundworks components such as {@link ServerStateManager},
 * {@link ServerPluginManager}, {@link ServerSocket} or {@link ServerContextManager}.
 * Its is also responsible for handling the initialization lifecycles of the different
 * soundworks components.
 *
 * ```
 * import { Server } from '@soundworks/core/server';
 *
 * const server = new Server({
 *   app: {
 *     name: 'my-example-app',
 *     clients: {
 *       player: { target: 'browser', default: true },
 *       controller: { target: 'browser' },
 *       thing: { target: 'node' }
 *     },
 *   },
 *   env: {
 *     port: 8000,
 *   },
 * });
 *
 * await server.start();
 * ```
 *
 * According to the clients definitions provided in `config.app.clients`, the
 * server will automatically create a dedicated route for each browser client role.
 * For example, given the config object of the example above that defines two
 * different client roles for browser targets (i.e. `player` and `controller`):
 *
 * ```
 * config.app.clients = {
 *   player: { target: 'browser', default: true },
 *   controller: { target: 'browser' },
 * }
 * ```
 *
 * The server will listen to the following URLs:
 * - `http://127.0.0.1:8000/` for the `player` role, which is defined as the default client.
 * - `http://127.0.0.1:8000/controller` for the `controller` role.
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

  // If `https` is required, hold informations about the certificates, e.g. if
  // self-signed, the dates of validity of the certificates, etc.
  #httpsInfos = null;
  #onClientConnectCallbacks = new Set();
  #onClientDisconnectCallbacks = new Set();
  #auditState = null;
  #pendingConnectionTokens = new Set();
  #trustedClients = new Set();

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
      throw new Error(`[soundworks:Server] Invalid argument for Server constructor, config should be an object`);
    }

    this.#config = merge({}, DEFAULT_CONFIG, config);

    // parse config
    if (Object.keys(this.#config.app.clients).length === 0) {
      throw new Error(`[soundworks:Server] Invalid "app.clients" config, at least one client should be declared`);
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

    this.#version = VERSION;
    // @note: we use express() instead of express.Router() because all 404 and
    // error stuff is handled by default
    // compression must be set before `express.static()`
    this.#router = express();
    this.#router.use(compression());
    this.#sockets = new ServerSockets(this, { path: 'socket' });
    this.#pluginManager = new ServerPluginManager(this);
    this.#stateManager = new ServerStateManager();
    this.#contextManager = new ServerContextManager(this);
    this.#status = 'idle';
    this.#db = this.createNamespacedDb('core');

    this[kServerOnStatusChangeCallbacks] = new Set();
    this[kServerApplicationTemplateOptions] = {
      templateEngine: null,
      templatePath: null,
      clientConfigFunction: null,
    };

    // register audit state schema
    this.#stateManager.registerSchema(AUDIT_STATE_NAME, auditSchema);

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
   *     subpath: '',
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
   * Register a callback to execute when status change
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
   * global informations about the application such as, the number of connected
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
   * - create the audit state
   * - prepapre http(s) server and routing according to the informations
   * declared in `config.app.clients`
   * - initialize all registered plugins
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
   * await server.start(); // init is called implicitely
   */
  async init() {
    this.#stateManager[kStateManagerInit](SERVER_ID, new EventEmitter());

    const numClients = {};
    for (let name in this.#config.app.clients) {
      numClients[name] = 0;
    }
    /** @private */
    this.#auditState = await this.#stateManager.create(AUDIT_STATE_NAME, { numClients });

    // basic http authentication
    if (this.#config.env.auth) {
      const ids = idGenerator();

      const soundworksAuth = (req, res, next) => {
        let role = null;

        for (let [_role, config] of Object.entries(this.#config.app.clients)) {
          if (req.path === config.route) {
            role = _role;
          }
        }

        // route that are not client entry points just pass through the middleware
        if (role === null) {
          next();
          return;
        }

        const isProtected  = this[kServerIsProtectedRole](role);

        if (isProtected) {
          // authentication middleware
          const auth = this.#config.env.auth;
          // parse login and password from headers
          const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
          const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

          // verify login and password are set and correct
          if (login && password && login === auth.login && password === auth.password) {
            // -> access granted...
            // generate token for web socket to check connections
            const id = ids.next().value;
            const ip = req.ip;
            const time = getTime();
            const token = { id, ip, time };
            const encryptedToken = encryptData(token);

            this.#pendingConnectionTokens.add(encryptedToken);

            setTimeout(() => {
              this.#pendingConnectionTokens.delete(encryptedToken);
            }, TOKEN_VALID_DURATION * 1000);

            // pass to the response object to be send to the client
            res.swToken = encryptedToken;

            return next();
          }

          // show login / password modal
          res.writeHead(401, {
            'WWW-Authenticate':'Basic',
            'Content-Type':'text/plain',
          });

          res.end('Authentication required.');
        } else {
          // route is not protected
          return next();
        }
      };

      this.#router.use(soundworksAuth);
    }

    // ------------------------------------------------------------
    // create HTTP(S) SERVER
    // ------------------------------------------------------------
    const useHttps = this.#config.env.useHttps || false;

    if (!useHttps) {
      this.#httpServer = http.createServer(this.#router);
    } else {
      const httpsInfos = this.#config.env.httpsInfos;
      let useSelfSigned = false;

      if (!httpsInfos || equal(httpsInfos, { cert: null, key: null })) {
        useSelfSigned = true;
      }

      if (!useSelfSigned) {
        try {
          // existance of file is checked in contructor
          let cert = fs.readFileSync(httpsInfos.cert);
          let key = fs.readFileSync(httpsInfos.key);

          let x509 = null;
          // this fails with self-signed certificates for whatever reason...
          try {
            x509 = new X509Certificate(cert);
          } catch (err) {
            this.#dispatchStatus('errored');
            throw new Error(`[soundworks:Server] Invalid https cert file`);
          }

          try {
            const keyObj = createPrivateKey(key);

            if (!x509.checkPrivateKey(keyObj)) {
              this.#dispatchStatus('errored');
              throw new Error(`[soundworks:Server] Invalid https key file`);
            }
          } catch (err) {
            this.#dispatchStatus('errored');
            throw new Error(`[soundworks:Server] Invalid https key file`);
          }

          // check is certificate is still valid
          const now = Date.now();
          const certExpire = Date.parse(x509.validTo);
          const isValid = now < certExpire;

          const diff = certExpire - now;
          const daysRemaining = Math.round(diff / 1000 / 60 / 60 / 24);

          this.#httpsInfos = {
            selfSigned: false,
            CN: x509.subject.split('=')[1],
            altNames: x509.subjectAltName.split(',').map(e => e.trim().split(':')[1]),
            validFrom: x509.validFrom,
            validTo: x509.validTo,
            isValid: isValid,
            daysRemaining: daysRemaining,
          };

          this.#httpServer = https.createServer({ key, cert }, this.#router);
        } catch (err) {
          logger.error(`
Invalid certificate files, please check your:
- key file: ${httpsInfos.key}
- cert file: ${httpsInfos.cert}
          `);

          this.#dispatchStatus('errored');
          throw err;
        }
      } else {
        // generate certs
        // --------------------------------------------------------
        const cert = await this.#db.get('httpsCert');
        const key = await this.#db.get('httpsKey');

        if (key && cert) {
          this.#httpsInfos = { selfSigned: true };
          this.#httpServer = https.createServer({ cert, key }, this.#router);
        } else {
          this.#httpServer = await new Promise((resolve, reject) => {
            // generate certificate on the fly (for development purposes)
            pem.createCertificate({ days: 1, selfSigned: true }, async (err, keys) => {
              if (err) {
                logger.error(err.stack);
                this.#dispatchStatus('errored');

                reject(err);
                return;
              }

              const cert = keys.certificate;
              const key = keys.serviceKey;

              this.#httpsInfos = { selfSigned: true };
              // we store the generated cert so that we don't have to re-accept
              // the cert each time the server restarts in development
              await this.#db.set('httpsCert', cert);
              await this.#db.set('httpsKey', key);

              const httpsServer = https.createServer({ cert, key }, this.#router);

              resolve(httpsServer);
            });
          });
        }
      }
    }

    let nodeOnly = true;
    // do not throw if no browser clients are defined, very usefull for
    // cleaning tests in particular
    for (let role in this.#config.app.clients) {
      if (this.#config.app.clients[role].target === 'browser') {
        nodeOnly = false;
      }
    }

    if (!nodeOnly) {
      if (this[kServerApplicationTemplateOptions].templateEngine === null
        || this[kServerApplicationTemplateOptions].templatePath === null
        || this[kServerApplicationTemplateOptions].clientConfigFunction === null
      ) {
        throw new Error('[soundworks:Server] A browser client has been found in "config.app.clients" but configuration for html templating is missing. You should probably call `server.useDefaultApplicationTemplate()` if you use the soundworks-template and/or refer (at your own risks) to the documentation of `setCustomTemplateConfig()`');
      }
    }

    // ------------------------------------------------------------
    // INIT ROUTING
    // ------------------------------------------------------------
    logger.title(`configured clients and routing`);

    const routes = [];
    const clientsConfig = [];

    for (let role in this.#config.app.clients) {
      const config = Object.assign({}, this.#config.app.clients[role]);
      config.role = role;
      clientsConfig.push(config);
    }

    // sort default client last to open the route at the end
    clientsConfig
      .sort(a => a.default === true ? 1 : -1)
      .forEach(config => {
        const path = this.#openClientRoute(this.#router, config);
        routes.push({ role: config.role, path });
      });

    logger.clientConfigAndRouting(routes, this.#config);

    // ------------------------------------------------------------
    // START PLUGIN MANAGER
    // ------------------------------------------------------------
    await this.#pluginManager[kPluginManagerStart]();

    await this.#dispatchStatus('inited');

    return Promise.resolve();
  }

  /**
   * The `start` method is part of the initialization lifecycle of the `soundworks`
   * server. The `start` method will implicitly call the {@link Server#init}
   * method if it has not been called manually.
   *
   * What it does:
   * - implicitely call {@link Server#init} if not done manually
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

    // ------------------------------------------------------------
    // START CONTEXT MANAGER
    // ------------------------------------------------------------
    await this.#contextManager[kServerContextManagerStart]();

    // ------------------------------------------------------------
    // START SOCKET SERVER
    // ------------------------------------------------------------
    await this.#sockets[kSocketsStart]();

    // ------------------------------------------------------------
    // START HTTP SERVER
    // ------------------------------------------------------------
    return new Promise(resolve => {
      const port = this.#config.env.port;
      const useHttps = this.#config.env.useHttps || false;
      const protocol = useHttps ? 'https' : 'http';
      const ifaces = os.networkInterfaces();

      this.#httpServer.listen(port, async () => {
        logger.title(`${protocol} server listening on`);

        Object.keys(ifaces).forEach(dev => {
          ifaces[dev].forEach(details => {
            if (details.family === 'IPv4') {
              logger.ip(protocol, details.address, port);
            }
          });
        });

        if (this.#httpsInfos !== null) {
          logger.title(`https certificates infos`);

          // this.#httpsInfos.selfSigned = true;
          if (this.#httpsInfos.selfSigned) {
            logger.log(`    self-signed: ${this.#httpsInfos.selfSigned ? 'true' : 'false'}`);
            logger.log(chalk.yellow`    > INVALID CERTIFICATE (self-signed)`);

          } else {
            logger.log(`    valid from: ${this.#httpsInfos.validFrom}`);
            logger.log(`    valid to:   ${this.#httpsInfos.validTo}`);

            // this.#httpsInfos.isValid = false; // for testing
            if (!this.#httpsInfos.isValid) {
              logger.error(chalk.red`    -------------------------------------------`);
              logger.error(chalk.red`    > INVALID CERTIFICATE                      `);
              logger.error(chalk.red`    i.e. you pretend to be safe but you are not`);
              logger.error(chalk.red`    -------------------------------------------`);
            } else {
              // this.#httpsInfos.daysRemaining = 2; // for testing
              if (this.#httpsInfos.daysRemaining < 5) {
                logger.log(chalk.red`    > CERTIFICATE IS VALID... BUT ONLY ${this.#httpsInfos.daysRemaining} DAYS LEFT, PLEASE CONSIDER UPDATING YOUR CERTS!`);
              } else if (this.#httpsInfos.daysRemaining < 15) {
                logger.log(chalk.yellow`    > CERTIFICATE IS VALID - only ${this.#httpsInfos.daysRemaining} days left, be careful...`);
              } else {
                logger.log(chalk.green`    > CERTIFICATE IS VALID (${this.#httpsInfos.daysRemaining} days left)`);
              }
            }

          }
        }

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
   * be usefull for unit testing or similar situations where you want to create
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

  /**
   * Open the route for a given client.
   * @private
   */
  #openClientRoute(router, config) {
    const { role, target } = config;
    const isDefault = (config.default === true);
    // only browser targets need a route
    if (target === 'node') {
      return;
    }

    let route = '/';

    if (!isDefault) {
      route += `${role}`;
    }

    this.#config.app.clients[role].route = route;

    // define template filename: `${role}.html` or `default.html`
    const {
      templatePath,
      templateEngine,
      clientConfigFunction,
    } = this[kServerApplicationTemplateOptions];

    const clientTmpl = path.join(templatePath, `${role}.tmpl`);
    const defaultTmpl = path.join(templatePath, `default.tmpl`);

    // make it sync
    let template;

    try {
      const stats = fs.statSync(clientTmpl);
      template = stats.isFile() ? clientTmpl : defaultTmpl;
    } catch (err) {
      template = defaultTmpl;
    }

    let tmplString;

    try {
      tmplString = fs.readFileSync(template, 'utf8');
    } catch (err) {
      throw new Error(`[soundworks:Server] html template file "${template}" not found`);
    }

    const tmpl = templateEngine.compile(tmplString);

    const soundworksClientHandler = (req, res) => {
      const data = clientConfigFunction(role, this.#config, req);

      // if the client has gone through the connection middleware (add succedeed),
      // add the token to the data object
      if (res.swToken) {
        data.token = res.swToken;
      }

      // CORS / COOP / COEP headers for `crossOriginIsolated pages,
      // enables `sharedArrayBuffers` and high precision timers
      // cf. https://web.dev/why-coop-coep/
      if (this.#config.env.crossOriginIsolated) {
        res.writeHead(200, {
          'Cross-Origin-Resource-Policy': 'same-origin',
          'Cross-Origin-Embedder-Policy': 'require-corp',
          'Cross-Origin-Opener-Policy': 'same-origin',
        });
      }

      const appIndex = tmpl(data);
      res.end(appIndex);
    };

    // http request
    router.get(route, soundworksClientHandler);

    // return route infos for logging on server start
    return route;
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
    if (this[kServerIsProtectedRole](role) && this[kServerIsValidConnectionToken](connectionToken)) {
      const { ip } = decryptData(connectionToken);
      const newData = { ip, id: client.id };
      const newToken = encryptData(newData);

      client[kServerClientToken] = newToken;

      this.#pendingConnectionTokens.delete(connectionToken);
      this.#trustedClients.add(client);
    }

    socket.addListener('close', async () => {
      // do nothing if client role is invalid
      if (roles.includes(role)) {
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
        logger.warnVersionDiscepancies(role, version, this.#version);
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

      const { id, uuid, token } = client;
      socket.send(CLIENT_HANDSHAKE_RESPONSE, { id, uuid, token, version: this.#version });
    });
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
   * Configure the server to work _out-of-the-box_ within the soundworks application
   * template provided by `@soundworks/create.
   *
   * - uses [template-literal](https://www.npmjs.com/package/template-literal) package
   * as html templateEngine
   * - define `.build/server/tmpl` as the directory in which html template can be
   * found
   * - define the `clientConfigFunction` function that return client compliant
   * config object to be injected in the html template.
   *
   * Also expose two public directory:
   * - the `public` directory which is exposed behind the root path
   * - the `./.build/public` directory which is exposed behind the `build` path
   *
   * _Note: except in very rare cases (so rare that they are quite difficult to imagine),
   * you should rely on these defaults._
   */
  useDefaultApplicationTemplate() {
    const buildDirectory = path.join('.build', 'public');

    const useMinifiedFile = {};
    const roles = Object.keys(this.#config.app.clients);

    roles.forEach(role => {
      if (this.#config.env.type === 'production') {
        // check if minified file exists
        const minifiedFilePath = path.join(buildDirectory, `${role}.min.js`);

        if (fs.existsSync(minifiedFilePath)) {
          useMinifiedFile[role] = true;
        } else {
          console.log(chalk.yellow(`    > Minified file not found for client "${role}", falling back to normal build file (use \`npm run build:production && npm start\` to use minified files)`));
          useMinifiedFile[role] = false;
        }
      } else {
        useMinifiedFile[role] = false;
      }
    });

    this[kServerApplicationTemplateOptions] = {
      templateEngine: { compile },
      templatePath: path.join('.build', 'server', 'tmpl'),
      clientConfigFunction: (role, config, _httpRequest) => {
        return {
          role: role,
          app: {
            name: config.app.name,
            author: config.app.author,
          },
          env: {
            type: config.env.type,
            // use to configure the socket if the server is running on a different
            // location than the one the client was served from (cf. #90)
            useHttps: config.env.useHttps,
            serverAddress: config.env.serverAddress,
            port: config.env.port,
            // other config, to review
            websockets: config.env.websockets,
            subpath: config.env.subpath,
            useMinifiedFile: useMinifiedFile[role],
          },
        };
      },
    };

    this.#router.use(express.static('public'));
    this.#router.use('/build', express.static(buildDirectory));
  }

  /**
   * Define custom template path, template engine, and clientConfig function.
   * This method is proposed for very advanced use-cases and should very probably
   * be improved. If you consider using this for some reason, please get in touch
   * first to explain your use-case :)
   */
  setCustomApplicationTemplateOptions(options) {
    Object.assign(this[kServerApplicationTemplateOptions], options);
  }



//
  /** @private */
  [kServerIsProtectedRole](role) {
    if (this.#config.env.auth && Array.isArray(this.#config.env.auth.clients)) {
      return this.#config.env.auth.clients.includes(role);
    }

    return false;
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

    // token is valid only for 30 seconds (this is arbitrary)
    if (now > data.time + TOKEN_VALID_DURATION) {
      // delete the token, is too old
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
   * @returns {Boolean}
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
   * @param {Number} clientId - Id of the client
   * @param {Number} clientIp - Ip of the client
   * @param {String} token - Token to be tested
   * @returns {Boolean}
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
}

export default Server;
