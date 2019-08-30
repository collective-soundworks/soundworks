import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import pem from 'pem';
import os from 'os';
import ejs from 'ejs';
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
     * Configuration informations, all config objects passed to the
     * [`server.init`]{@link module:soundworks/server.server.init} are merged
     * into this object.
     * @type {module:soundworks/server.server~serverConfig}
     */
    this.config = {};

    /**
     * polka instance, can allow to expose additionnal routes (e.g. REST API).
     */
    this.router = null;

    /**
     * http(s) server instance.
     */
    this.httpServer = null;

    /**
     * Key / value storage with Promise based Map API
     */
    this.db = null;

    /**
     * wrapper around `ws` server
     * @type {module:soundworks/server.sockets}
     * @default module:soundworks/server.sockets
     */
    this.sockets = new Sockets();

    /**
     *
     */
    this.serviceManager = new ServiceManager(this);

    /**
     *
     */
    this.stateManager = null;

    /**
     * key and certificates (may be generated and self-signed) for https server.
     * @todo - put in config...
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
     * @private
     * @type {Object}
     */
    this._routes = {};

    /**
     * Default for the module:soundworks/server.server~clientConfigDefinition
     * @private
     */
    this._clientConfigFunction = (clientType, serverConfig, httpRequest) => ({ clientType });
  }

    /**
   *
   * server config:
   *
   * @param {String} [options.defaultClient='player'] - Client that can access
   *   the application at its root url.
   * @param {String} [options.publicDirectory='public'] - The public directory
   *   to expose, for serving static assets.
   * @param {String} [options.port=8000] - Port on which the http(s) server will
   *   listen
   * @param {Object} [options.serveStaticOptions={}] - TBD
   * @param {Boolean} [options.useHttps=false] - Define wheter to use or not an
   *   an https server.
   * @param {Object} [options.httpsInfos=null] - if `useHttps` is `true`, object
   *   that give the path to `cert` and `key` files (`{ cert, key }`). If `null`
   *   an auto generated certificate will be generated, be aware that browsers
   *   will consider the application as not safe in the case.
   * @param {Object} [options.websocket={}] - TBD
   * @param {String} [options.env='development']
   * @param {String} [options.templateDirectory='src/server/tmpl'] - Folder in
   *   which the server will look for the `index.html` template.
   *
   * @param {Function} clientConfigFunction -
   */
  async init(config, clientConfigFunction) {
    // must be done this way to keep the instance shared (??)
    this.config = config;

    // do something for that...
    if (this.config.port === undefined) {
       this.config.port = 8000;
    }

    if (this.config.templateDirectory === undefined) {
      this.config.templateDirectory = path.join(process.cwd(), '.build', 'server', 'tmpl');
    }

    if (this.config.defaultClient === undefined) {
      this.config.defaultClient = 'player';
    }

    if (this.config.websockets === undefined) {
      this.config.websockets = {};
    }

    if (clientConfigFunction) {
      this._clientConfigFunction = clientConfigFunction;
    }

    this.serviceManager.init();

    // instanciate and configure polka
    // allows to hook middleware and routes (e.g. cors) in the router
    // between `server.init` and `server.start`
    this.router = polka();
    // compression (must be set before static)
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
    const useHttps = this.config.useHttps || false;

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
          const httpsInfos = this.config.httpsInfos;

          if (httpsInfos.key && httpsInfos.cert) {
            // use given certificate
            try {
              const key = fs.readFileSync(httpsInfos.key);
              const cert = fs.readFileSync(httpsInfos.cert);

              this._httpsInfos = { key, cert };
              const httpsServer = https.createServer(this._httpsInfos);
            } catch(err) {
              console.error(
`Invalid certificate files, please check your:
- key file: ${httpsInfos.key}
- cert file: ${httpsInfos.cert}
              `);

              throw err;
            }

            return Promise.resolve(httpsServer);
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
        // ------------------------------------------------------------
        // INIT ROUTING
        // ------------------------------------------------------------
        logger.title(`routing`);

        const routes = [];
        // open all routes except default
        for (let clientType in this._clientTypeActivitiesMap) {
          if (clientType !== this.config.defaultClient) {
            const path = this._openClientRoute(clientType, this.router);
            routes.push({ clientType, path });
          }
        }

        // open default route last
        for (let clientType in this._clientTypeActivitiesMap) {
          if (clientType === this.config.defaultClient) {
            const path = this._openClientRoute(clientType, this.router);
            routes.unshift({ clientType, path });
          }
        }

        logger.routing(routes);

        return Promise.resolve();
      }).then(() => {
        // ------------------------------------------------------------
        // START SOCKET SERVER
        // ------------------------------------------------------------
        this.sockets.start(this.httpServer, this.config.websockets, (clientType, socket) => {
          this._onSocketConnection(clientType, socket);
        });

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
          const port = this.config.port;
          const useHttps = this.config.useHttps || false;
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
      await this.listen();

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
   * Open the route for the given client.
   * @private
   */
  _openClientRoute(clientType, router) {
    let route = '/';

    if (clientType !== this.config.defaultClient) {
      route += `${clientType}`;
    }

    if (this._routes[clientType]) {
      route += this._routes[clientType];
    }

    // define template filename: `${clientType}.ejs` or `default.ejs`
    const templateDirectory = this.config.templateDirectory;
    const clientTmpl = path.join(templateDirectory, `${clientType}.ejs`);
    const defaultTmpl = path.join(templateDirectory, `default.ejs`);

    // all this can happen later
    fs.stat(clientTmpl, (err, stats) => {
      let template;

      if (err || !stats.isFile()) {
        template = defaultTmpl;
      } else {
        template = clientTmpl;
      }

      const tmplString = fs.readFileSync(template, { encoding: 'utf8' });
      const tmpl = ejs.compile(tmplString);
      // http request
      router.get(route, (req, res) => {
        const data = this._clientConfigFunction(clientType, this.config, req);
        const appIndex = tmpl({ data });
        res.end(appIndex);
      });
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
      if (this.config.env !== 'production') {
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
