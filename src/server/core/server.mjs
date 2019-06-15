import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import pem from 'pem';
import os from 'os';
import chalk from 'chalk';
import ejs from 'ejs';
import polka from 'polka';
import serveStatic from 'serve-static';
import columnify from 'columnify';
import compression from 'compression';
import Client from './Client';
import serviceManager from './serviceManager';
import sockets from './sockets';
import cache from '../utils/cache';

/**
 * @typedef {Object} module:soundworks/server.server~serverConfig
 * @memberof module:soundworks/server.server
 *
 * @property {String} appName - Name of the application, used in the `.ejs`
 *  template and by default in the `platform` service to populate its view.
 * @property {String} env - Name of the environnement ('production' enable
 *  cache in express application).
 * @property {String} version - Version of application, can be used to force
 *  reload css and js files from server (cf. `html/default.ejs`)
 * @property {String} defaultClient - Name of the default client type,
 *  i.e. the client that can access the application at its root URL
 * @property {String} assetsDomain - Define from where the assets (static files)
 *  should be loaded, this value can refer to a separate server for scalability.
 *  The value should be used client-side to configure the `audio-buffer-manager`
 *  service.
 * @property {Number} port - Port used to open the http server, in production
 *  this value is typically 80
 *
 * @property {Object} setup - Describe the location where the experience takes
 *  places, theses values are used by the `placer`, `checkin` and `locator`
 *  services. If one of these service is required, this entry mandatory.
 * @property {Object} setup.area - Description of the area.
 * @property {Number} setup.area.width - Width of the area.
 * @property {Number} setup.area.height - Height of the area.
 * @property {String} setup.area.background - Path to an image to be used in
 *  the area representation.
 * @property {Array} setup.labels - Optionnal list of predefined labels.
 * @property {Array} setup.coordinates - Optionnal list of predefined coordinates.
 * @property {Array} setup.maxClientsPerPosition - Maximum number of clients
 *  allowed in a position.
 * @property {Number} setup.capacity - Maximum number of positions (may limit
 * or be limited by the number of labels and/or coordinates).
 *
 * @property {Object} websockets - Websockets configuration (socket.io)
 * @property {String} websockets.url - Optionnal url where the socket should
 *  connect.
 * @property {Array} websockets.transports - List of the transport mecanims that
 *  should be used to open or emulate the socket.
 *
 * @property {Boolean} useHttps -  Define if the HTTP server should be launched
 *  using secure connections. For development purposes when set to `true` and no
 *  certificates are given (cf. `httpsInfos`), a self-signed certificate is
 *  created.
 * @property {Object} httpsInfos - Paths to the key and certificate to be used
 *  in order to launch the https server. Both entries are required otherwise a
 *  self-signed certificate is generated.
 * @property {String} httpsInfos.cert - Path to the certificate.
 * @property {String} httpsInfos.key - Path to the key.
 *
 * @property {String} password - Password to be used by the `auth` service.
 *
 * @property {Object} osc - Configuration of the `osc` service.
 * @property {String} osc.receiveAddress - IP of the currently running server.
 * @property {Number} osc.receivePort - Port listening for incomming messages.
 * @property {String} osc.sendAddress - IP of the remote application.
 * @property {Number} osc.sendPort - Port where the remote application is
 *  listening for messages
 *
 * @property {String} publicDirectory - Location of the public directory
 *  (accessible through http(s) requests).
 * @property {Object} serveStaticOptions - Options for the serve static middleware
 *  cf. [https://github.com/expressjs/serve-static](https://github.com/expressjs/serve-static)
 * @property {String} templateDirectory - Directory where the server templating
 *  system looks for the `ejs` templates.
 * @property {String} errorReporterDirectory - Directory where error reported
 *  from the clients are written.
 */


/**
 * Server side entry point for a `soundworks` application.
 *
 * This object hosts configuration informations, as well as methods to
 * initialize and start the application. It is also responsible for creating
 * the static file (http) server as well as the socket server.
 *
 * @memberof module:soundworks/server
 * @namespace
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
  // config: {},

  /**
   * Constructor used to instanciate `Client` instances.
   * @type {module:soundworks/server.Client}
   * @default module:soundworks/server.Client
   */
  // clientCtor: Client,

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

  // get clientTypes() {
  //   return Object.keys(this._clientTypeActivitiesMap);
  // },

  /**
   * Return a service configured with the given options.
   * @param {String} id - Identifier of the service.
   * @param {Object} options - Options to configure the service.
   */
  // require(id, options) {
  //   return serviceManager.require(id, options);
  // },

  /**
   * Default for the module:soundworks/server.server~clientConfigDefinition
   * @private
   */
  _clientConfigFunction: (clientType, serverConfig, httpRequest) => {
    return { clientType };
  },

  /**
   * @callback module:soundworks/server.server~clientConfigDefinition
   * @param {String} clientType - Type of the client.
   * @param {Object} serverConfig - Configuration of the server.
   * @param {Object} httpRequest - Http request for the `index.html`
   * @return {Object}
   */
  /**
   * Set the {@link module:soundworks/server.server~clientConfigDefinition} with
   * a user defined function.
   * @param {module:soundworks/server.server~clientConfigDefinition} func - A
   *  function that returns the data that will be used to populate the `index.html`
   *  template. The function could (and should) be used to pass configuration
   *  to the soundworks client.
   * @see {@link module:soundworks/client.client~init}
   */
  // setClientConfigDefinition(func) {
    // this._clientConfigFunction = func;
  // },

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

  serveStatic() {
    // public static folder
    const { publicDirectory, serveStaticOptions } = this.config;
    this.router.use(serveStatic(publicDirectory, serveStaticOptions));

    return Promise.resolve();
  },

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
    console.log(chalk.yellow(`+ available clients:`));

    const routes = [];
    // open all routes except default
    for (let clientType in this._clientTypeActivitiesMap) {
      if (clientType !== this.config.defaultClient) {
        const route = this._openClientRoute(clientType, this.router);
        routes.push({ clientType: `[${clientType}]`, route: chalk.green(route) });
      }
    }

    // open default route last
    for (let clientType in this._clientTypeActivitiesMap) {
      if (clientType === this.config.defaultClient) {
        const route = this._openClientRoute(clientType, this.router);
        routes.unshift({ clientType: `[${clientType}]`, route: chalk.green(route) });
      }
    }

    console.log(columnify(routes, {
      showHeaders: false,
      config: {
        clientType: { align: 'right' },
      },
    }));

    return Promise.resolve();
  },

  startSocketServer() {
    sockets.start(this.httpServer, this.config.websockets, (clientType, socket) => {
      this._onSocketConnection(clientType, socket);
    });

    return Promise.resolve();
  },

  listen() {
    const promise = new Promise((resolve, reject) => {
      const port = this.config.port;
      const useHttps = this.config.useHttps || false;
      const protocol = useHttps ? 'https' : 'http';
      const ifaces = os.networkInterfaces();

      this.router.listen(port, () => {
        // log infos
        console.log(chalk.yellow(`+ ${protocol} server listening on:`));

        Object.keys(ifaces).forEach(dev => {
          ifaces[dev].forEach(details => {
            if (details.family === 'IPv4') {
              console.log(`    ${protocol}://${details.address}:${chalk.green(port)}`);
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

    // all this can append later
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

    // check coherence between client-side and server-side service requirements
    const serverRequiredServices = serviceManager.getRequiredServices(clientType);
    const serverServicesList = serviceManager.getServiceList();

    socket.addListener('s:client:handshake', data => {
      // in development, if service required client-side but not server-side,
      // complain properly client-side.
      if (this.config.env !== 'production') {
        const clientRequiredServices = data.requiredServices || [];
        const missingServices = [];

        clientRequiredServices.forEach((serviceId) => {
          if (
            // check that it's not a client-side only servive
            serverServicesList.indexOf(serviceId) !== -1 &&
            serverRequiredServices.indexOf(serviceId) === -1
          ) {
            missingServices.push(serviceId);
          }
        });

        if (missingServices.length > 0) {
          const err = {
            type: 'services',
            payload: missingServices,
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
