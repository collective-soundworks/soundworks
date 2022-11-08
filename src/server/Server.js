import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import os from 'node:os';
import { X509Certificate, createPrivateKey } from 'node:crypto';

import chalk from 'chalk';
import compression from 'compression';
import express from 'express';
import isPlainObject from 'is-plain-obj';
import Keyv from 'keyv';
import { KeyvFile } from 'keyv-file';
import merge from 'lodash.merge';
import pem from 'pem';
import compile from 'template-literal';

import Client from './Client.js';
import ContextManager from './ContextManager.js';
import PluginManager from './PluginManager.js';
import StateManager from './StateManager.js';
import Sockets from './Sockets.js';
import logger from '../common/logger.js';
import {
  CLIENT_HANDSHAKE_REQUEST,
  CLIENT_HANDSHAKE_RESPONSE,
  CLIENT_HANDSHAKE_ERROR,
} from '../common/constants.js';

let _dbNamespaces = new Set();

const DEFAULT_CONFIG = {
  env: {
    type: 'development',
    port: 8000,
    subpath: '',
    websockets: {
      path: 'socket',
      pingInterval: 5000,
    },
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

/**
 * Server side entry point for a `soundworks` application.
 *
 * This object hosts configuration informations, as well as methods to
 * initialize and start the application. It is also responsible for creating
 * the static file (http) server as well as the socket server.
 *
 * @memberof server
 *
 * @param {Object} config
 * @param {String} [config.defaultClient='player'] - Client that can access
 *   the application at its root url.
 * @param {String} [config.env='development']
 * @param {String} [config.port=8000] - Port on which the http(s) server will
 *   listen
 * @param {String} [config.subpath] - If the application runs behind a
 *   proxy server (e.g. https://my-domain.com/my-app/`), path to the
 *   application root (i.e. 'my-app')
 * @param {Boolean} [config.useHttps=false] - Define wheter to use or not an
 *   an https server. In production, it's generally better to set this value
 *   to false, and delegate the https handling to a proxy server (e.g. nginx)
 * @param {Object} [config.httpsInfos=null] - if `useHttps` is `true`, object
 *   that declare the path to `cert` and `key` files (`{ cert, key }`). If `null`
 *   an auto generated certificate will be generated, be aware that browsers
 *   will consider the application as not safe in the case (which is generally
 *   fine for development purpose).
 *
 * @example
 * import { Server } from '@soundworks/core/server';
 * const server = new Server({
 *   app: {
 *     name: 'my-example-app',
 *     clients: { myClient: { target: 'node' } },
 *   },
 *   env: {
 *     port: 8888,
 *   },
 * });
 * await server.init();
 * await server.start();
 */
class Server {
  constructor(config) {
    if (!isPlainObject(config)) {
      throw new Error(`[soundworks:Server] Invalid argument for Server constructor, config should be an object`);
    }
    /**
     * Configuration informations.
     * Defaults to:
     * ```
     * {
     *   env: {
     *     type: 'development',
     *     port: 8000,
     *     subfolder: '',
     *     useHttps: false,
     *     httpsInfos: null,
     *   },
     *   app: {
     *     name: 'soundworks',
     *     clients: {},
     *   },
     * }
     * ```
     */
    this.config = merge({}, DEFAULT_CONFIG, config);

    // parse config
    if (Object.keys(this.config.app.clients).length === 0) {
      throw new Error(`[soundworks:Server] Invalid "app.clients" config, at least one client should be declared`);
    }

    if (this.config.env.useHttps && this.config.env.httpsInfos !== null) {
      const httpsInfos = this.config.env.httpsInfos;

      if (!isPlainObject(this.config.env.httpsInfos)) {
        throw new Error(`[soundworks:Server] Invalid "env.httpsInfos" config, should be null or object { cert, key }`);
      }

      if (!('cert' in httpsInfos) || !('key' in httpsInfos)) {
        throw new Error(`[soundworks:Server] Invalid "env.httpsInfos" config, should contain both "cert" and "key" entries`);
      }
      // @todo - move that to constructor
      if (!fs.existsSync(httpsInfos.cert)) {
        throw new Error(`[soundworks:Server] Invalid "env.httpsInfos" config, "cert" file not found`);
      }

      if (!fs.existsSync(httpsInfos.key)) {
        throw new Error(`[soundworks:Server] Invalid "env.httpsInfos" config, "key" file not found`);
      }
    }

    /**
     * Router. Internally use polka.
     * (cf. {@link https://github.com/lukeed/polka})
     */
    this.router = express();
    // compression (must be set before serve-static)
    this.router.use(compression());

    /**
     * Http(s) server instance. The node `http` or `https` module instance
     * (cf. {@link https://nodejs.org/api/http.html})
     */
    this.httpServer = null;

    /**
     * Key / value storage with Promise based Map API
     * basically a wrapper around kvey (cf. {@link https://github.com/lukechilds/keyv})
     * @private
     */
    this.db = this.createNamespacedDb('core');

    /**
     * The {@link server.Sockets} instance. A small wrapper around
     * [`ws`](https://github.com/websockets/ws) server.
     * @see {@link server.Sockets}
     * @type {server.Sockets}
     */
    this.sockets = new Sockets();

    /**
     * The {@link server.PluginManager} instance.
     * @see {@link server.PluginManager}
     * @type {server.PluginManager}
     */
    this.pluginManager = new PluginManager(this);

    /**
     * The {@link server.StateManager} instance.
     * @see {@link server.StateManager}
     * @type {server.StateManager}
     */
    this.stateManager = new StateManager();

    /**
     * The {@link server.ContextManager} instance.
     *
     */
    this.contextManager = new ContextManager(this);

    /**
     * If https is required, will contain informations about the certificates
     * (self-signed, validity dates, etc.)
     */
    this.httpsInfos = null;

    /**
     * Current status of the server ['idle', 'inited', 'started']
     */
    this.status = 'idle';

    /** @private */
    this._applicationTemplateConfig = {
      templateEngine: null,
      templatePath: null,
      clientConfigFunction: null,
    };

    /** @private */
    this._listeners = new Map();

    logger.configure(this.config.env.verbose);
  }

  /**
   * Method to be called before `start` in the initialization lifecycle of the
   * soundworks server.
   *
   * What it does:
   * - prepapre http(s) server and routing according to the informations
   * declared in `config.app.clients`
   * - starts all registered plugins
   *
   * After `await server.init()`, you can safely use the StateManager, as well
   * as any registered Plugins.
   *
   * @example
   * // defaults to
   * const server = new Server(config);
   * await server.init();
   * await server.start();
   */
  async init() {
    // basic http authentication
    if (this.config.env.auth) {
      this.router.use((req, res, next) => {

        const isProtected  = this.config.env.auth.clients
          .map(type => req.path.endsWith(`/${type}`))
          .reduce((acc, value) => acc || value, false);

        if (isProtected) {
          // authentication middleware
          const auth = this.config.env.auth;
          // parse login and password from headers
          const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
          const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

          // verify login and password are set and correct
          if (login && password && login === auth.login && password === auth.password) {
            // -> access granted...
            return next();
          }

          // -> access denied...
          res.writeHead(401, {
            'WWW-Authenticate':'Basic',
            'Content-Type':'text/plain',
          });
          res.end('Authentication required.');
        } else {
          // route not protected
          return next();
        }
      });
    }

    // start http server
    const useHttps = this.config.env.useHttps || false;

    // ------------------------------------------------------------
    // create HTTP(S) SERVER
    // ------------------------------------------------------------
    if (!useHttps) {
      this.httpServer = http.createServer(this.router);
    } else {
      const httpsInfos = this.config.env.httpsInfos;

      // if certs have been given in config
      if (httpsInfos !== null) {
        try {
          // existance of file is checked in contructor
          let cert = fs.readFileSync(httpsInfos.cert);
          let key = fs.readFileSync(httpsInfos.key);

          let x509 = null;
          // this fails with self-signed certificates for whatever reason...
          try {
            x509 = new X509Certificate(cert);
          } catch(err) {
            this._dispatchStatus('errored');
            throw new Error(`[soundworks:Server] Invalid https cert file`);
          }

          try {
            const keyObj = createPrivateKey(key);

            if (!x509.checkPrivateKey(keyObj)) {
              this._dispatchStatus('errored');
              throw new Error(`[soundworks:Server] Invalid https key file`);
            }
          } catch(err) {
            this._dispatchStatus('errored');
            throw new Error(`[soundworks:Server] Invalid https key file`);
          }

          // check is certificate is still valid
          const now = Date.now();
          const certExpire = Date.parse(x509.validTo);
          const isValid = now < certExpire;

          const diff = certExpire - now;
          const daysRemaining = Math.round(diff / 1000 / 60 / 60 / 24);

          this.httpsInfos = {
            selfSigned: false,
            CN: x509.subject.split('=')[1],
            altNames: x509.subjectAltName.split(',').map(e => e.trim().split(':')[1]),
            validFrom: x509.validFrom,
            validTo: x509.validTo,
            isValid: isValid,
            daysRemaining: daysRemaining,
          };

          this.httpServer = https.createServer({ key, cert }, this.router);
        } catch(err) {
          logger.error(`
Invalid certificate files, please check your:
- key file: ${httpsInfos.key}
- cert file: ${httpsInfos.cert}
          `);

          this._dispatchStatus('errored');
          throw err;
        }
      } else {
        // generate certs
        // --------------------------------------------------------
        const cert = await this.db.get('httpsCert');
        const key = await this.db.get('httpsKey');

        if (key && cert) {
          this.httpsInfos = { selfSigned: true };
          this.httpServer = https.createServer({ cert, key }, this.router);
        } else {
          this.httpServer = await new Promise((resolve, reject) => {
            // generate certificate on the fly (for development purposes)
            pem.createCertificate({ days: 1, selfSigned: true }, async (err, keys) => {
              if (err) {
                logger.error(err.stack);
                this._dispatchStatus('errored');

                reject(err);
                return;
              }

              const cert = keys.certificate;
              const key = keys.serviceKey;

              this.httpsInfos = { selfSigned: true };
              // we store the generated cert so that we don't have to re-accept
              // the cert each time the server restarts in development
              await this.db.set('httpsCert', cert);
              await this.db.set('httpsKey', key);

              const httpsServer = https.createServer({ cert, key }, this.router);

              resolve(httpsServer);
            });
          });
        }
      }
    }

    let nodeOnly = true;
    // do not throw if no browser clients are defined, very usefull for
    // cleaning tests in particular
    for (let clientType in this.config.app.clients) {
      if (this.config.app.clients[clientType].target === 'browser') {
        nodeOnly = false;
      }
    }

    if (!nodeOnly) {
      if (this._applicationTemplateConfig.templateEngine === null
        || this._applicationTemplateConfig.templatePath === null
        || this._applicationTemplateConfig.clientConfigFunction === null
      ) {
        throw new Error('[soundworks:Server] A browser client has been found in "config.app.clients" but configuration for html templating is missing. You should probably call `server.setDefaultTemplateConfig()` if you use the soundworks-template and/or refer (at your own risks) to the documentation of `setCustomTemplateConfig()`');
      }
    }

    // ------------------------------------------------------------
    // INIT ROUTING
    // ------------------------------------------------------------
    logger.title(`configured clients and routing`);

    const routes = [];
    const clientsConfig = [];

    for (let clientType in this.config.app.clients) {
      const config = Object.assign({}, this.config.app.clients[clientType]);
      config.clientType = clientType;
      clientsConfig.push(config);
    }

    // sort default client last to open the route at the end
    clientsConfig
      .sort(a => a.default === true ? 1 : -1)
      .forEach(config => {
        const path = this._openClientRoute(this.router, config);
        routes.push({ clientType: config.clientType, path });
      });

    logger.clientConfigAndRouting(routes, this.config);

    // ------------------------------------------------------------
    // START PLUGIN MANAGER
    // ------------------------------------------------------------
    await this.pluginManager.start();

    await this._dispatchStatus('inited');

    return Promise.resolve();
  }

  /**
   * Method to be called when `init` step is done in the initialization
   * lifecycle of the soundworks server.
   *
   * What it does:
   * - starts all registered contexts (context are automatically registered
   * when instantiated)
   * - start the web socket server
   * - launch the HTTP server on given port
   *
   * After `await server.start()` the server is ready to accept incoming connexions
   */
  async start() {
    if (this.status !== 'inited') {
      throw new Error(`[soundworks:Server] Cannot start() before init()`);
    }
    // ------------------------------------------------------------
    // START CONTEXT MANAGER
    // ------------------------------------------------------------
    await this.contextManager.start();

    // ------------------------------------------------------------
    // START SOCKET SERVER
    // ------------------------------------------------------------
    this.sockets.start(
      this.httpServer,
      this.config.env.websockets,
      (clientType, socket) => this._onSocketConnection(clientType, socket),
    );

    // ------------------------------------------------------------
    // START HTTP SERVER
    // ------------------------------------------------------------
    return new Promise(resolve => {
      const port = this.config.env.port;
      const useHttps = this.config.env.useHttps || false;
      const protocol = useHttps ? 'https' : 'http';
      const ifaces = os.networkInterfaces();

      this.httpServer.listen(port, async () => {
        logger.title(`${protocol} server listening on`);

        Object.keys(ifaces).forEach(dev => {
          ifaces[dev].forEach(details => {
            if (details.family === 'IPv4') {
              logger.ip(protocol, details.address, port);
            }
          });
        });

        if (this.httpsInfos !== null) {
          logger.title(`https certificates infos`);

          // this.httpsInfos.selfSigned = true;
          if (this.httpsInfos.selfSigned) {
            logger.log(`    self-signed: ${this.httpsInfos.selfSigned ? 'true' : 'false'}`);
            logger.log(chalk.yellow`    > INVALID CERTIFICATE (self-signed)`);

          } else {
            logger.log(`    valid from: ${this.httpsInfos.validFrom}`);
            logger.log(`    valid to:   ${this.httpsInfos.validTo}`);

            // this.httpsInfos.isValid = false; // for testing
            if (!this.httpsInfos.isValid) {
              logger.error(chalk.red`    -------------------------------------------`);
              logger.error(chalk.red`    > INVALID CERTIFICATE`);
              logger.error(chalk.red`    i.e. you pretend to be safe but you are not`);
              logger.error(chalk.red`    -------------------------------------------`);
            } else {
              // this.httpsInfos.daysRemaining = 2; // for testing
              if (this.httpsInfos.daysRemaining < 5) {
                logger.log(chalk.red`    > CERTIFICATE IS VALID... BUT ONLY ${this.httpsInfos.daysRemaining} DAYS LEFT, PLEASE CONSIDER UPDATING YOUR CERTS!`);
              } else if (this.httpsInfos.daysRemaining < 15) {
                logger.log(chalk.yellow`    > CERTIFICATE IS VALID - only ${this.httpsInfos.daysRemaining} days left, be careful...`);
              } else {
                logger.log(chalk.green`    > CERTIFICATE IS VALID (${this.httpsInfos.daysRemaining} days left)`);
              }
            }

          }
        }

        await this._dispatchStatus('started');

        resolve();
      });
    });
  }

  // @todo - handle gracefull close of the server (but define what it means first...)
  /**
   * Stop the server, close all existing WebSocket connections.
   * Mainly usefull for test.
   */
  async stop() {
    if (this.status !== 'started') {
      throw new Error(`[soundworks:Server] Cannot stop() before start()`);
    }

    await this.contextManager.stop();
    await this.pluginManager.stop();

    this.sockets.terminate();
    this.httpServer.close(err => {
      if (err) {
        throw new Error(err.message);
      }
    });

    await this._dispatchStatus('stopped');

    return Promise.resolve();
  }

  /**
   * Open the route for a given client.
   * @private
   */
  _openClientRoute(router, config) {
    const { clientType, target } = config;
    const isDefault = (config.default === true);
    // only browser targets need a route
    if (target === 'node') {
      return;
    }

    let route = '/';

    if (!isDefault) {
      route += `${clientType}`;
    }

    // define template filename: `${clientType}.html` or `default.html`
    const {
      templatePath,
      templateEngine,
      clientConfigFunction,
    } = this._applicationTemplateConfig;

    const clientTmpl = path.join(templatePath, `${clientType}.tmpl`);
    const defaultTmpl = path.join(templatePath, `default.tmpl`);

    // make it sync
    let template;

    try {
      const stats = fs.statSync(clientTmpl);
      template = stats.isFile() ? clientTmpl : defaultTmpl;
    } catch(err) {
      template = defaultTmpl;
    }

    let tmplString;

    try {
      tmplString = fs.readFileSync(template, 'utf8');
    } catch(err) {
      throw new Error(`[soundworks:Server] html template file "${template}" not found`);
    }

    const tmpl = templateEngine.compile(tmplString);
    // http request
    router.get(route, (req, res) => {
      const data = clientConfigFunction(clientType, this.config, req);

      // CORS / COOP / COEP headers for `crossOriginIsolated pages,
      // enables `sharedArrayBuffers` and high precision timers
      // cf. https://web.dev/why-coop-coep/
      if (this.config.env.crossOriginIsolated) {
        res.writeHead(200, {
          'Cross-Origin-Resource-Policy': 'same-origin',
          'Cross-Origin-Embedder-Policy': 'require-corp',
          'Cross-Origin-Opener-Policy': 'same-origin',
        });
      }

      const appIndex = tmpl(data);
      res.end(appIndex);
    });

    // return route infos for logging on server start
    return route;
  }

  /**
   * Socket connection callback.
   * @private
   */
  _onSocketConnection(clientType, socket) {
    const client = new Client(clientType, socket);

    socket.addListener('close', async () => {
      // clean context manager, await before cleaning state manager
      await this.contextManager.removeClient(client);
      // remove client from pluginManager
      await this.pluginManager.removeClient(client);
      // clean state manager
      await this.stateManager.removeClient(client.id);
      // clean sockets
      socket.terminate();
      // destroy client
      client.destroy();
    });

    socket.addListener(CLIENT_HANDSHAKE_REQUEST, async payload => {
      const { clientType, registeredPlugins } = payload;
      const clientTypes = Object.keys(this.config.app.clients);

      if (clientTypes.indexOf(clientType) === -1) {
        socket.send(CLIENT_HANDSHAKE_ERROR, {
          type: 'invalid-client-type',
          message: `Invalid client type, please check server configuration (valid client types are: ${clientTypes.join(', ')})`,
        });
        return;
      }

      try {
        this.pluginManager.checkRegisteredPlugins(registeredPlugins);
      } catch(err) {
        socket.send(CLIENT_HANDSHAKE_ERROR, {
          type: 'invalid-plugin-list',
          message: err.message,
        });
        return;
      }

      // add client to state manager
      await this.stateManager.addClient(client.id, {
        emit: client.socket.send.bind(client.socket),
        addListener: client.socket.addListener.bind(client.socket),
        removeAllListeners: client.socket.removeAllListeners.bind(client.socket),
      });
      // add client to plugin manager
      // server-side, all plugins are active for the lifetime of the client
      await this.pluginManager.addClient(client, registeredPlugins);
      // add client to context manager
      await this.contextManager.addClient(client);

      const { id, uuid } = client;
      socket.send(CLIENT_HANDSHAKE_RESPONSE, { id, uuid });
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

  addListener(channel, callback) {
    if (!this._listeners.has(channel)) {
      const listeners = new Set();
      this._listeners.set(channel, listeners);
    }

    const listeners = this._listeners.get(channel);
    listeners.add(callback);
  }

  removeListener(channel, callback) {
    if (this._listeners.has(channel)) {
      const listeners = this._listeners.get(channel);
      listeners.delete(callback);

      if (listeners.size === 0) {
        this._listeners.delete(channel);
      }
    }
  }

  /**
   * Configure the server to work out-of-the box with the soundworks-template
   * directory tree structure.
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
   */
  setDefaultTemplateConfig() {
    this._applicationTemplateConfig = {
      templateEngine: { compile },
      templatePath: path.join('.build', 'server', 'tmpl'),
      clientConfigFunction: (clientType, config, _httpRequest) => {
        return {
          clientType: clientType,
          app: {
            name: config.app.name,
            author: config.app.author,
          },
          env: {
            type: config.env.type,
            websockets: config.env.websockets,
            subpath: config.env.subpath,
          },
        };
      },
    };

    this.router.use(express.static('public'));
    this.router.use('/build', express.static(path.join('.build', 'public')));
  }

  /**
   * Define your own template path, template engine, and clientConfig function.
   * This method is for very advanced use-cases and only be used if you know what
   * you are doing. As such its behavior could probably be improved a lot...
   *
   * If you end up using this, please contact me to explain your use-case :)
   */
  setCustomTemplateConfig(options) {
    Object.assign(this._applicationTemplateConfig, options);
  }

  /** @private */
  async _dispatchStatus(status) {
    this.status = status;

    // if launched in a child process, forward status to parent process
    if (process.send !== undefined) {
      process.send(`soundworks:server:${status}`);
    }

    if (this._listeners.has(status)) {
      const listeners = this._listeners.get(status);

      for (let callback of listeners) {
        await callback();
      }
    }
  }
}

export default Server;
