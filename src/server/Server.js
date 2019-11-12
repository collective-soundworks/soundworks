import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import pem from 'pem';
import os from 'os';
import polka from 'polka';
import serveStatic from 'serve-static';
import compression from 'compression';
import Client from './Client';
import Service from './Service';
import ServiceManager from './ServiceManager';
import Sockets from './Sockets';
import StateManager from './StateManager';
import Db from './Db';
import logger from './utils/logger';

/**
 * Server side entry point for a `soundworks` application.
 *
 * This object hosts configuration informations, as well as methods to
 * initialize and start the application. It is also responsible for creating
 * the static file (http) server as well as the socket server.
 *
 * @memberof @soundworks/core/server
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
     * Configuration informations. Defaults to:
     * ```
     * {
     *   env: {
     *     type: 'development',
     *     port: 8000,
     *     "websockets": {
     *       "path": "socket",
     *       "pingInterval": 5000
     *     },
     *     "useHttps": false,
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
    this.router = null;

    /**
     * http(s) server instance. The node `http` or `https` module instance
     * (cf. {@link https://nodejs.org/api/http.html})
     */
    this.httpServer = null;

    /**
     * Key / value storage with Promise based Map API
     * basically a wrapper around kvey (cf. {@link https://github.com/lukechilds/keyv})
     * @private
     */
    this.db = null;

    /**
     * Wrapper around `ws` server.
     * cf. {@link @soundworks/core/server.Sockets}
     * @type {soundworks/core/server.Sockets}
     */
    this.sockets = new Sockets();

    /**
     * The `serviceManager` instance.
     * cf. {@link @soundworks/core/server.ServiceManager}
     * @type {soundworks/core/server.ServiceManager}
     */
    this.serviceManager = new ServiceManager(this);

    /**
     * The `StateManager` instance.
     * cf. {@link @soundworks/core/server.StateManager}
     * @type {soundworks/core/server.StateManager}
     */
    this.stateManager = null;

    /**
     * key and certificates (may be generated and self-signed) for https server.
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
     * Required activities that must be started. Only used in Experience
     * and Service - do not expose.
     * @private
     */
    this.activities = new Set();

    /**
     * Optionnal routing defined for each client.
     * @type {Object}
     * @private
     */
    this._routes = {};

    /**
     * @private
     */
    this._htmlTemplateConfig = {
      engine: null,
      directory: null,
    }
  }

    /**
   *
   * server config:
   *
   * @param {String} [options.defaultClient='player'] - Client that can access
   *   the application at its root url.
   * @param {String} [options.env='development']
   * @param {String} [options.port=8000] - Port on which the http(s) server will
   *   listen
   * @param {Boolean} [options.useHttps=false] - Define wheter to use or not an
   *   an https server.
   * @param {Object} [options.httpsInfos=null] - if `useHttps` is `true`, object
   *   that give the path to `cert` and `key` files (`{ cert, key }`). If `null`
   *   an auto generated certificate will be generated, be aware that browsers
   *   will consider the application as not safe in the case.
   * @param {Object} [options.websocket={}] - TBD
   * @param {String} [options.templateDirectory='src/server/tmpl'] - Folder in
   *   which the server will look for the `index.html` template.
   *
   * @param {Function} clientConfigFunction -
   */
  async init(
    config = {
      env: {
        type: 'development',
        port: 8000,
        "websockets": {
          "path": "socket",
          "pingInterval": 5000
        },
        "useHttps": false,
      },
      app: {
        name: 'soundworks',
      }
    },
    clientConfigFunction = (clientType, serverConfig, httpRequest) => ({ clientType })
  ) {
    // must be done this way to keep the instance shared (??)
    this.config = config;
    this._clientConfigFunction = clientConfigFunction;

    this.serviceManager.init();
    // allows to hook middleware and routes (e.g. cors) in the router
    // between `server.init` and `server.start`
    this.router = polka();
    // compression (must be set before serve-static)
    this.router.use(compression());

    this.stateManager = new StateManager(this);
    this.db = new Db();

    return Promise.resolve();
  }

  async start() {
    try {
      // ------------------------------------------------------------
      // init acitvities
      // ------------------------------------------------------------
      this.activities.forEach((activity) => {
        activity.clientTypes.forEach((clientType) => {
          if (!this._clientTypeActivitiesMap[clientType]) {
            this._clientTypeActivitiesMap[clientType] = new Set();
          }

          this._clientTypeActivitiesMap[clientType].add(activity);
        });
      });

      // start http server
      const useHttps = this.config.env.useHttps || false;

      return Promise.resolve()
        // ------------------------------------------------------------
        // create HTTP(S) SERVER
        // ------------------------------------------------------------
        .then(() => {
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
                console.error(
`Invalid certificate files, please check your:
- key file: ${httpsInfos.key}
- cert file: ${httpsInfos.cert}
                `);

                throw err;
              }
            } else {
              return new Promise(async (resolve, reject) => {
                const key = await this.db.get('server:httpsKey');
                const cert = await this.db.get('server:httpsCert');

                if (key !== null && cert !== null) {
                  this._httpsInfos = { key, cert };
                  const httpsServer = https.createServer(this._httpsInfos);
                  resolve(httpsServer);
                } else {
                  // generate certificate on the fly (for development purposes)
                  pem.createCertificate({ days: 1, selfSigned: true }, async (err, keys) => {
                    if (err) {
                      return console.error(err.stack);
                    }

                    this._httpsInfos = {
                      key: keys.serviceKey,
                      cert: keys.certificate,
                    };

                    await this.db.set('server:httpsKey', this._httpsInfos.key);
                    await this.db.set('server:httpsCert', this._httpsInfos.cert);

                    const httpsServer = https.createServer(this._httpsInfos);

                    resolve(httpsServer);
                  });
                }
              });
            }
          }
        }).then(httpServer => {
          this.httpServer = httpServer;
          this.router.server = httpServer;

          return Promise.resolve();
        }).then(() => {
          if (this._htmlTemplateConfig.engine === null ||
              this._htmlTemplateConfig.directory === null) {
            throw new Error('Invalid html template configuration, please call `server.configureHtmlTemplates(engine, directory)`');
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
            if (clientType !== defaultClientType) {
              const path = this._openClientRoute(clientType, this.router);
              routes.push({ clientType, path });
            }
          }

          // open default route last
          for (let clientType in this._clientTypeActivitiesMap) {
            if (clientType === defaultClientType) {
              const path = this._openClientRoute(clientType, this.router, true);
              routes.unshift({ clientType, path });
            }
          }

          logger.clientConfigAndRouting(routes, this.config.app.clients, this.config.env.serverIp);

          return Promise.resolve();
        }).then(() => {
          // ------------------------------------------------------------
          // START SOCKET SERVER
          // ------------------------------------------------------------
          this.sockets.start(
            this.httpServer,
            this.config.env.websockets,
            (clientType, socket) => this._onSocketConnection(clientType, socket)
          );

          return Promise.resolve();
        }).then(async () => {
          // ------------------------------------------------------------
          // START SERVICE MANAGER
          // ------------------------------------------------------------
          return this.serviceManager.start();

        }).then(() => {
          // ------------------------------------------------------------
          // START HTTP SERVER
          // ------------------------------------------------------------
          return new Promise((resolve, reject) => {
            const port = this.config.env.port;
            const useHttps = this.config.env.useHttps || false;
            const protocol = useHttps ? 'https' : 'http';
            const ifaces = os.networkInterfaces();

            this.router.listen(port, () => {
              logger.title(`${protocol} server listening on`);

              Object.keys(ifaces).forEach(dev => {
                ifaces[dev].forEach(details => {
                  if (details.family === 'IPv4') {
                    logger.ip(protocol, details.address, port);
                  }
                });
              });

              resolve();
            });
          });
        });

      await this.serviceManager.start();

      return Promise.resolve();
    } catch(err) {
      console.error(err)
    }
  }

  /**
   * @example
   * ```js
   * soundworks.registerService(serviceFactory); // do not document that, maybe remove
   * // or
   * soundworks.registerService('user-defined-name', serviceFactory);
   * ```
   */
  registerService(name, factory = null, config = {}, deps = []) {
    const ctor = factory(Service);
    this.serviceManager.register(name, ctor, config, deps);
  }

  /**
   * Configure html template informations
   * @param {Object} engine - Template engine that should implement a `compile` method.
   * @param {String} directory - Path to the directory containing the templates,
   *  any filename corresponding to a registered browser client type will be used
   *  in priority, in not present fallback to `default` (i.e `${clientType}.tmpl`
   *  with fallback to `default.tmpl`. Template files must have the `.tmpl` extension.
   */
  configureHtmlTemplates(engine, directory) {
    this._htmlTemplateConfig.engine = engine;
    this._htmlTemplateConfig.directory = directory;
  }

  /**
   * Open the route for the given client.
   * @private
   */
  _openClientRoute(clientType, router, isDefault = false) {
    let route = '/';

    if (!isDefault) {
      route += `${clientType}`;
    }

    if (this._routes[clientType]) {
      route += this._routes[clientType];
    }

    // define template filename: `${clientType}.html` or `default.html`
    const templateDirectory = this._htmlTemplateConfig.directory;
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

    const tmplString = fs.readFileSync(template, 'utf8');
    const tmpl = this._htmlTemplateConfig.engine.compile(tmplString);
    // http request
    router.get(route, (req, res) => {
      const data = this._clientConfigFunction(clientType, this.config, req);
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

    socket.addListener('close', () => {
      // clean sockets
      socket.terminate();
      // remove client from activities
      activities.forEach(activity => activity.disconnect(client));
      // destroy client
      client.destroy();
    });

    socket.addListener('s:client:handshake', data => {
      // in development, if service required client-side but not server-side,
      // complain properly client-side.
      if (this.config.env.type !== 'production') {
        // check coherence between client-side and server-side service requirements
        const clientRequiredServices = data.requiredServices || [];
        const serverRequiredServices = this.serviceManager.getRequiredServices(clientType);
        const missingServices = [];

        clientRequiredServices.forEach(serviceId => {
          if (serverRequiredServices.indexOf(serviceId) === -1) {
            missingServices.push(serviceId);
          }
        });

        if (missingServices.length > 0) {
          const err = {
            type: 'services',
            data: missingServices,
          };

          socket.send('s:client:error', err);
          return;
        }
      }

      activities.forEach(activity => activity.connect(client));

      const { id, uuid } = client;
      socket.send('s:client:start', { id, uuid });
    });
  }
}

export default Server;
