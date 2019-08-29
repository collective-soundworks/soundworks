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
import serviceManager from './serviceManager';
import sockets from './sockets';
import cache from './utils/cache';
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
const server = {
  /**
   * Configuration informations, all config objects passed to the
   * [`server.init`]{@link module:soundworks/server.server.init} are merged
   * into this object.
   * @type {module:soundworks/server.server~serverConfig}
   */
  config: {},

  /**
   * wrapper around `ws` server
   * @type {module:soundworks/server.sockets}
   * @default module:soundworks/server.sockets
   */
  sockets: sockets,

  /**
   * polka instance, can allow to expose additionnal routes (e.g. REST API).
   */
  router: null,

  /**
   * http(s) server instance.
   */
  httpServer: null,

  /**
   * key and certificates (may be generated and self-signed) for https server.
   * @todo - put in config...
   */
  httpsInfos: null,

  /**
   * Mapping between a `clientType` and its related activities.
   * @private
   */
  _clientTypeActivitiesMap: {},

  /**
   * Required activities that must be started.
   * @private
   */
  _activities: new Set(),

  /**
   * Optionnal routing defined for each client.
   * @private
   * @type {Object}
   */
  _routes: {},

  /**
   * Default for the module:soundworks/server.server~clientConfigDefinition
   * @private
   */
  _clientConfigFunction: (clientType, serverConfig, httpRequest) => {
    return { clientType };
  },

  /**
   * Register a route for a given `clientType`, allow to define a more complex
   * routing (additionnal route parameters) for a given type of client.
   * @param {String} clientType - Type of the client.
   * @param {String|RegExp} route - Template of the route that should be append.
   *  to the client type
   *
   * @note: used by Orbe?
   *
   * @example
   * ```
   * // allow `conductor` clients to connect to `http://site.com/conductor/1`
   * server.registerRoute('conductor', '/:param')
   * ```
   */
  defineRoute(clientType, route) {
    this._routes[clientType] = route;
  },

  /**
   * Function used by activities to register themselves as active activities
   * @param {Activity} activity - Activity to be registered.
   * @private
   */
  setActivity(activity) {
    this._activities.add(activity);
  },

  /**
   * Initialize the server with the given configuration.
   * At the end of the init step the express router is available.
   *
   * @param {module:soundworks/server.server~serverConfig} config -
   *  Configuration of the application.
   */
  init(config, clientConfigFunction) {
    this.config = config;
    this._clientConfigFunction = clientConfigFunction;

    // instanciate and configure polka
    // this allows to hook middleware and routes (e.g. cors) in the express
    // instance between `server.init` and `server.start`
    this.router = polka();
    // compression (must be set before static)
    this.router.use(compression());

    return Promise.resolve();
  },

  // /** @private */
  // serveStatic() {
  //   // public static folder
  //   const { publicDirectory, serveStaticOptions } = this.config;
  //   this.router.use(serveStatic(publicDirectory, serveStaticOptions));

  //   return Promise.resolve();
  // },

  /** @private */
  initActivities() {
        // map activities to their respective client type(s) and start them all
    this._activities.forEach((activity) => {
      activity.clientTypes.forEach((clientType) => {
        if (!this._clientTypeActivitiesMap[clientType]) {
          this._clientTypeActivitiesMap[clientType] = new Set();
        }

        this._clientTypeActivitiesMap[clientType].add(activity);
      });
    });

    return Promise.resolve();
  },

  /** @private */
  createHttpServer() {
    // start http server
    const useHttps = this.config.useHttps || false;

    return Promise.resolve()
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

              this.httpsInfos = { key, cert };
              const httpsServer = https.createServer(this.httpsInfos);
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
            return new Promise((resolve, reject) => {
              const key = cache.read('server', 'httpsKey');
              const cert = cache.read('server', 'httpsCert');

              if (key !== null && cert !== null) {
                this.httpsInfos = { key, cert };
                const httpsServer = https.createServer(this.httpsInfos);
                resolve(httpsServer);
              } else {
                // generate certificate on the fly (for development purposes)
                pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
                  if (err) {
                    return console.error(err.stack);
                  }

                  this.httpsInfos = {
                    key: keys.serviceKey,
                    cert: keys.certificate,
                  };

                  cache.write('server', 'httpsKey', this.httpsInfos.key);
                  cache.write('server', 'httpsCert', this.httpsInfos.cert);

                  const httpsServer = https.createServer(this.httpsInfos);

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
      });
  },

  initRouting() {
    // init routing for each client type
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
  },

  /** @private */
  startSocketServer() {
    sockets.start(this.httpServer, this.config.websockets, (clientType, socket) => {
      this._onSocketConnection(clientType, socket);
    });

    return Promise.resolve();
  },

  /** @private */
  listen() {
    const promise = new Promise((resolve, reject) => {
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

    return promise;
  },

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
  },

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
      activities.forEach((activity) => activity.disconnect(client));
      // destroy client
      client.destroy();
    });

    socket.addListener('s:client:handshake', data => {
      // in development, if service required client-side but not server-side,
      // complain properly client-side.
      if (this.config.env !== 'production') {
        // check coherence between client-side and server-side service requirements
        const clientRequiredServices = data.requiredServices || [];
        const serverRequiredServices = serviceManager.getRequiredServices(clientType);
        const missingServices = [];

        clientRequiredServices.forEach((serviceId) => {
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
  },
};

export default server;
