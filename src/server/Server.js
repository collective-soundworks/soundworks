import fs from 'fs';
import http from 'http';
import https from 'https';
import chalk from 'chalk';
import merge from 'lodash.merge';
import path from 'path';
import pem from 'pem';
import os from 'os';
import polka from 'polka';
import compression from 'compression';
import Client from './Client.js';
import PluginManager from './PluginManager.js';
import Sockets from './Sockets.js';
import SharedStateManagerServer from '../common/SharedStateManagerServer.js';
import logger from '../common/logger.js';
import Keyv from 'keyv';
import KeyvFile from 'keyv-file';

let _dbNamespaces = new Set();

/**
 * Server side entry point for a `soundworks` application.
 *
 * This object hosts configuration informations, as well as methods to
 * initialize and start the application. It is also responsible for creating
 * the static file (http) server as well as the socket server.
 *
 * @memberof server
 *
 * @example
 * import * as soundworks from 'soundworks/server';
 * import MyExperience from './MyExperience';
 *
 * soundworks.server.init(config);
 * const myExperience = new MyExperience();
 * soundworks.server.start();
 */
class Server {
  constructor() {
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
     *   },
     *   app: {
     *     name: 'soundworks',
     *   },
     * }
     * ```
     */
    this.config = {};

    /**
     * Router. Internally use polka.
     * (cf. {@link https://github.com/lukeed/polka})
     */
    this.router = polka();
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
     * The {@link server.SharedStateManagerServer} instance.
     * @see {@link server.SharedStateManagerServer}
     * @type {server.SharedStateManagerServer}
     */
    this.stateManager = new SharedStateManagerServer();

    /**
     * Template engine that should implement a `compile` method.
     * @type {Object}
     */
    this.templateEngine = null;

    /**
     * Path to the directory containing the templates.
     * Any filename corresponding to a registered browser client type will be used
     * in priority, if not present fallback to `default`, i.e `${clientType}.tmpl`
     * fallbacks to `default.tmpl`. Template files should have the `.tmpl` extension.
     * @param {String}
     */
    this.templateDirectory = null;

    // private stuff

    /**
     * Required activities that must be started. Only used in Experience
     * and Plugin - do not expose.
     * @private
     */
    this.activities = new Set();

    /**
     * Key and certificates (may be generated and self-signed) for https server.
     * @todo - put in config...
     * @private
     */
    this._httpsInfos = null;

    /**
     * Mapping between a `clientType` and its related activities.
     * @private
     */
    this._clientTypeActivitiesMap = {};

    /**
     * Optionnal routing defined for each client.
     * @type {Object}
     * @private
     */
    this._routes = {};

    /** @private */
    this._htmlTemplateConfig = {
      engine: null,
      directory: null,
    };

    /** @private */
    this._listeners = new Map();
  }

  /**
   *
   * Method to be called before `start` in the initialization lifecycle of the
   * soundworks server.
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
   *   an https server.
   * @param {Object} [config.httpsInfos=null] - if `useHttps` is `true`, object
   *   that give the path to `cert` and `key` files (`{ cert, key }`). If `null`
   *   an auto generated certificate will be generated, be aware that browsers
   *   will consider the application as not safe in the case.
   *
   * @param {Function} clientConfigFunction - function that filters / defines
   *   the configuration object that will be sent to a connecting client.
   *
   * @example
   * // defaults to
   * await server.init(
   *   {
   *     env: {
   *       type: 'development',
   *       port: 8000,
   *       subpath: '',
   *       useHttps: false,
   *     },
   *     app: {
   *       name: 'soundworks',
   *       author: 'someone'
   *     }
   *   },
   *   (clientType, serverConfig, httpRequest) => {
   *     return { clientType, ...serverConfig };
   *   }
   * );
   */
  async init(
    config,
    clientConfigFunction = (clientType, _serverConfig, _httpRequest) => ({ clientType }),
  ) {
    const defaultConfig = {
      env: {
        type: 'development',
        port: 8000,
        subpath: '',
        websockets: {
          path: 'socket',
          pingInterval: 5000,
        },
        useHttps: false,
        crossOriginIsolated: true,
        verbose: true,
      },
      app: {
        name: 'soundworks',
      },
    };

    this.config = merge({}, defaultConfig, config);

    logger.configure(this.config.env.verbose);

    // @note: do not remove
    // backward compatibility w/ assetsDomain and `soundworks-template`
    // cf. https://github.com/collective-soundworks/soundworks/issues/35
    // see also '@soundworks/plugin-audio-buffer-loader' (could be updated more
    // easily as the `assetsDomain` entry was not documented)
    // - we need to handle 3 cases:
    //   + old config style / old template
    //   + new config style / old template
    //   + new template
    // @note: keep `websocket.path` as defined should be enough
    if (!this.config.env.assetsDomain && this.config.env.subpath !== undefined) {
      const subpath = this.config.env.subpath.replace(/^\//, '').replace(/\/$/, '');

      if (subpath) {
        this.config.env.assetsDomain = `/${subpath}/`;
      } else {
        this.config.env.assetsDomain = `/`;
      }
    }

    this._clientConfigFunction = clientConfigFunction;

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

    await this._emit('inited');

    return Promise.resolve();
  }

  /**
   * Method to be called when `init` step is done in the initialization
   *  lifecycle of the soundworks server. Basically initialize plugins,
   *  define the routing and start the http-server.
   */
  async start() {
    // ------------------------------------------------------------
    // init acitvities
    // ------------------------------------------------------------

    // we should at least have one activity registered for each client here
    // i.e. the Experience so it's ok
    this.activities.forEach((activity) => {
      activity.clientTypes.forEach((clientType) => {

        if (!(clientType in this.config.app.clients)) {
          throw new Error(`[soundworks:core] no config found for client type ${clientType}`);
        }

        if (!this._clientTypeActivitiesMap[clientType]) {
          this._clientTypeActivitiesMap[clientType] = new Set();
        }

        this._clientTypeActivitiesMap[clientType].add(activity);
      });
    });

    // start http server
    const useHttps = this.config.env.useHttps || false;

    return Promise.resolve()
      // ------------------------------------------------------------
      // create HTTP(S) SERVER
      // ------------------------------------------------------------
      .then(async () => {
        // create http server
        if (!useHttps) {
          const httpServer = http.createServer();
          return Promise.resolve(httpServer);
        } else {
          const httpsInfos = this.config.env.httpsInfos;

          if (httpsInfos.key && httpsInfos.cert) {
            // use given certificate
            try {
              const key = fs.readFileSync(httpsInfos.key);
              const cert = fs.readFileSync(httpsInfos.cert);

              this._httpsInfos = { key, cert };

              const httpsServer = https.createServer(this._httpsInfos);
              return Promise.resolve(httpsServer);
            } catch(err) {
              console.error(`
Invalid certificate files, please check your:
- key file: ${httpsInfos.key}
- cert file: ${httpsInfos.cert}
              `);

              throw err;
            }
          } else {
            const key = await this.db.get('httpsKey');
            const cert = await this.db.get('httpsCert');

            if (key && cert) {
              this._httpsInfos = { key, cert };
              const httpsServer = https.createServer(this._httpsInfos);
              return Promise.resolve(httpsServer);
            } else {
              return new Promise(resolve => {
                // generate certificate on the fly (for development purposes)
                pem.createCertificate({ days: 1, selfSigned: true }, async (err, keys) => {
                  if (err) {
                    return console.error(err.stack);
                  }

                  this._httpsInfos = {
                    key: keys.serviceKey,
                    cert: keys.certificate,
                  };

                  await this.db.set('httpsKey', this._httpsInfos.key);
                  await this.db.set('httpsCert', this._httpsInfos.cert);

                  const httpsServer = https.createServer(this._httpsInfos);

                  resolve(httpsServer);
                });
              });
            }
          }
        }
      }).then(httpServer => {
        this.httpServer = httpServer;
        this.router.server = httpServer;

        return Promise.resolve();
      }).then(() => {
        let nodeOnly = true;

        // do not throw if no browser clients are defined, very usefull for
        // cleaning tests in particular
        for (let clientType in this.config.app.clients) {
          if (this.config.app.clients[clientType].target === 'browser') {
            nodeOnly = false;
          }
        }

        if (!nodeOnly) {
          if (this.templateEngine === null) {
            throw new Error('Undefined "server.templateEngine": please provide a valid template engine');
          }

          if (this.templateDirectory === null) {
            throw new Error('Undefined "server.templateDirectory": please provide a valid template directory');
          }
        }

        // ------------------------------------------------------------
        // INIT ROUTING
        // ------------------------------------------------------------
        logger.title(`configured clients and routing`);

        const routes = [];
        let defaultClientType = null;

        for (let clientType in this.config.app.clients) {
          if (this.config.app.clients[clientType].default === true) {
            defaultClientType = clientType;
          }
        }
        // we must open default route last
        for (let clientType in this._clientTypeActivitiesMap) {
          // do nothing if client type is not registered in config
          if (!(clientType in this.config.app.clients)) {
            continue;
          }

          if (clientType !== defaultClientType) {
            const clientTarget = this.config.app.clients[clientType].target;
            const path = this._openClientRoute(clientType, clientTarget, this.router);
            routes.push({ clientType, path });
          }
        }

        // open default route last
        for (let clientType in this._clientTypeActivitiesMap) {
          // do nothing if client type is not registered in config
          if (!(clientType in this.config.app.clients)) {
            continue;
          }

          if (clientType === defaultClientType) {
            const clientTarget = this.config.app.clients[clientType].target;
            const path = this._openClientRoute(clientType, clientTarget, this.router, true);
            routes.unshift({ clientType, path });
          }
        }

        logger.clientConfigAndRouting(routes, this.config);

        return Promise.resolve();
      }).then(() => {
        // ------------------------------------------------------------
        // START SOCKET SERVER
        // ------------------------------------------------------------
        this.sockets.start(
          this.httpServer,
          this.config.env.websockets,
          (clientType, socket) => this._onSocketConnection(clientType, socket),
        );

        return Promise.resolve();
      }).then(async () => {
        // ------------------------------------------------------------
        // START SERVICE MANAGER
        // ------------------------------------------------------------
        return this.pluginManager.start();

      }).then(() => {
        // ------------------------------------------------------------
        // START HTTP SERVER
        // ------------------------------------------------------------
        return new Promise(resolve => {
          const port = this.config.env.port;
          const useHttps = this.config.env.useHttps || false;
          const protocol = useHttps ? 'https' : 'http';
          const ifaces = os.networkInterfaces();

          this.router.listen(port, async () => {
            logger.title(`${protocol} server listening on`);

            Object.keys(ifaces).forEach(dev => {
              ifaces[dev].forEach(details => {
                if (details.family === 'IPv4') {
                  logger.ip(protocol, details.address, port);
                }
              });
            });

            await this._emit('started');

            resolve();
          });
        });
      });
  }

  // @todo - handle gracefull close of the server
  async stop() {
    this.sockets.terminate();
    this.httpServer.close();

    await this._emit('stopped');

    return Promise.resolve();
  }

  /**
   * Open the route for the given client.
   * @private
   */
  _openClientRoute(clientType, target, router, isDefault = false) {
    // only browser targets need a route
    if (target === 'node') {
      return;
    }

    let route = '/';

    if (!isDefault) {
      route += `${clientType}`;
    }

    // @todo - define what is this... looks completely not used and not usable...
    if (this._routes[clientType]) {
      route += this._routes[clientType];
    }

    // define template filename: `${clientType}.html` or `default.html`
    const templateDirectory = this.templateDirectory;
    const clientTmpl = path.join(templateDirectory, `${clientType}.tmpl`);
    const defaultTmpl = path.join(templateDirectory, `default.tmpl`);

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
      throw new Error(`[@soundworks/core] html template file "${template}" not found`);
    }

    const tmpl = this.templateEngine.compile(tmplString);
    // http request
    router.get(route, (req, res) => {
      const data = this._clientConfigFunction(clientType, this.config, req);

      // @note: do not remove
      // backward compatibility w/ assetsDomain and `soundworks-template`
      // cf. https://github.com/collective-soundworks/soundworks/issues/35
      if (this.config.env.subpath && !data.env.subpath) {
        data.env.subpath = this.config.env.subpath;
      }

      // cors / coop / coep headers for `crossOriginIsolated pages, enables
      // sharedArrayBuffers and high precision timers
      // this is the default behavior
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
    const activities = this._clientTypeActivitiesMap[clientType];

    if (activities == undefined) {
      logger.error(`[soundworks:core] No activity registered for "${clientType}", make sure an Experience has been created for this client`);
    }

    socket.addListener('close', () => {
      console.log('server: socket.close()');
      // clean sockets
      socket.terminate();
      // remove client from activities
      if (activities) {
        activities.forEach(activity => activity.disconnect(client));
      }
      // destroy client
      client.destroy();
    });

    socket.addListener('s:client:handshake', data => {
      // client should throw error if no activity registered server-side (cf. #16)
      if (activities === undefined) {
        const err = {
          type: 'no-activity',
        };

        socket.send('s:client:error', err);
        return;
      }

      // check coherence between client-side and server-side plugin requirements
      const clientRequiredPlugins = data.requiredPlugins || [];
      const serverRequiredPlugins = this.pluginManager.getRequiredPlugins(clientType);
      const missingPlugins = [];

      clientRequiredPlugins.forEach(pluginId => {
        if (serverRequiredPlugins.indexOf(pluginId) === -1) {
          missingPlugins.push(pluginId);
        }
      });

      if (missingPlugins.length > 0) {
        const err = {
          type: 'plugins',
          data: missingPlugins,
        };

        socket.send('s:client:error', err);
        return;
      }

      activities.forEach(activity => activity.connect(client));

      const { id, uuid } = client;
      socket.send('s:client:start', { id, uuid });
    });
  }

  /**
   * Create namespaced databases for core and plugins
   * (kind of experiemental API do not expose in doc for now)
   *
   * @note - introduced in v3.1.0-beta.1
   * @note - used by core and plugin-audio-streams
   * @private
   */
  createNamespacedDb(namespace = null) {
    if (namespace === null || !(typeof namespace === 'string')) {
      throw new Error(`[soundworks:core] Invalid namespace for ".createNamespacedDb(namespace)", namespace is mandatory and should be a string`);
    }

    if (_dbNamespaces.has(namespace)) {
      throw new Error(`[soundworks:core] Invalid namespace for ".createNamespacedDb(namespace)", namespace "${namespace}" already exists`);
    }

    const dbDirectory = path.join(process.cwd(), '.data');

    if (!fs.existsSync(dbDirectory)) {
      fs.mkdirSync(dbDirectory);
    }

    const filename = path.join(dbDirectory, `soundworks-${namespace}.db`);
    // at note keyv-file doesn't seems to works
    const store = new KeyvFile({ filename });
    const db = new Keyv({ namespace, store });
    db.on('error', err => console.log(chalk.red('[soundworks:core] db ${namespace} error:'), err));

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

  /** @private */
  async _emit(channel) {
    if (this._listeners.has(channel)) {
      const listeners = this._listeners.get(channel);

      for (let callback of listeners) {
        await callback();
      }
    }
  }
}

export default Server;
