import Client from './Client';
import compression from 'compression';
import ejs from 'ejs';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import IO from 'socket.io';
import logger from '../utils/logger';
import path from 'path';
import pem from 'pem';
import serviceManager from './serviceManager';
import sockets from './sockets';

/**
 * Server side entry point for a `soundworks` application.
 *
 * This object host configuration informations, as well as methods to
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
   * SocketIO server.
   * @type {Object}
   * @private
   */
  io: null,

  /**
   * Configuration informations, all config objects passed to the
   * [`server.init`]{@link module:soundworks/server.server.init} are merged
   * into this object.
   * @type {Object}
   */
  config: {},

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


  _clientConfigDefinition: (clientType, serverConfig, httpRequest) => {
    return { clientType };
  },

  /**
   * Map client types with an activity.
   * @param {Array<String>} clientTypes - List of client type.
   * @param {Activity} activity - Activity concerned with the given `clientTypes`.
   * @private
   */
  _setMap(clientTypes, activity) {
    clientTypes.forEach((clientType) => {
      if (!this._clientTypeActivitiesMap[clientType])
        this._clientTypeActivitiesMap[clientType] = new Set();

      this._clientTypeActivitiesMap[clientType].add(activity);
    });
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
   * Return a service configured with the given options.
   * @param {String} id - Identifier of the service.
   * @param {Object} options - Options to configure the service.
   */
  require(id, options) {
    return serviceManager.require(id, null, options);
  },

  /**
   * Initialize the server with the given config objects.
   * @param {...Object} configs - Configuration.
   */
  init(...configs) {
    configs.forEach((config) => {
      for (let key in config) {
        const entry = config[key];

        if (typeof entry === 'object' && entry !== null) {
          this.config[key] = this.config[key] || {};
          this.config[key] = Object.assign(this.config[key], entry);
        } else {
          this.config[key] = entry;
        }
      }
    });
  },

  _populateDefaultConfig() {
    // mandatory configuration options
    if (this.config.port === undefined)
       this.config.port = 8000;

    if (this.config.enableGZipCompression === undefined)
      this.config.enableGZipCompression = true;

    if (this.config.publicDirectory === undefined)
      this.config.publicDirectory = path.join(process.cwd(), 'public');

    if (this.config.templateDirectory === undefined)
      this.config.templateDirectory = path.join(process.cwd(), 'html');

    if (this.config.defaultClient === undefined)
      this.config.defaultClient = 'player';

    if (this.config.socketIO === undefined)
      this.config.socketIO = {};
  },

  /**
   * Start the application:
   * - launch the HTTP server.
   * - launch the socket server.
   * - start all registered activities.
   * - define routes and and activities mapping for all client types.
   */
  start() {
    this._populateDefaultConfig();

    if (this.config.logger !== undefined)
      logger.initialize(this.config.logger);

    // configure express
    const expressApp = new express();
    expressApp.set('port', process.env.PORT || this.config.port);
    expressApp.set('view engine', 'ejs');

    // compression
    if (this.config.enableGZipCompression)
      expressApp.use(compression());

    // public folder
    expressApp.use(express.static(this.config.publicDirectory));

    // use https
    const useHttps = this.config.useHttps || false;
    // launch http(s) server
    if (!useHttps) {
      this._runHttpServer(expressApp);
    } else {
      const httpsInfos = this.config.httpsInfos;

      // use given certificate
      if (httpsInfos.key && httpsInfos.cert) {
        const key = fs.readFileSync(httpsInfos.key);
        const cert = fs.readFileSync(httpsInfos.cert);

        this._runHttpsServer(expressApp, key, cert);
      // generate certificate on the fly (for development purposes)
      } else {
        pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
          this._runHttpsServer(expressApp, keys.serviceKey, keys.certificate);
        });
      }
    }
  },

  /**
   * Register a route for a given `clientType`, allow to define a more complex
   * routing (additionnal route parameters) for a given type of client.
   * @param {String} clientType - Type of the client.
   * @param {String|RegExp} route - Template of the route that should be append.
   *  to the client type
   * @example
   * ```
   * // allow `conductor` clients to connect to `http://site.com/conductor/1`
   * server.registerRoute('conductor', '/:param')
   * ```
   */
  defineRoute(clientType, route) {
    this._routes[clientType] = route;
  },


  setClientConfigDefinition(func) {
    this._clientConfigDefinition = func;
  },

  /**
   * Launch a http server.
   */
  _runHttpServer(expressApp) {
    const httpServer = http.createServer(expressApp);
    this._initSockets(httpServer);
    this._initActivities(expressApp);

    httpServer.listen(expressApp.get('port'), function() {
      const url = `http://127.0.0.1:${expressApp.get('port')}`;
      console.log('[HTTP SERVER] Server listening on', url);
    });
  },

  /**
   * Launch a https server.
   */
  _runHttpsServer(expressApp, key, cert) {
    const httpsServer = https.createServer({ key, cert }, expressApp);
    this._initSockets(httpsServer);
    this._initActivities(expressApp);

    httpsServer.listen(expressApp.get('port'), function() {
      const url = `https://127.0.0.1:${expressApp.get('port')}`;
      console.log('[HTTPS SERVER] Server listening on', url);
    });
  },

  /**
   * Init websocket server.
   * @private
   */
  _initSockets(httpServer) {
    this.io = new IO(httpServer, this.config.socketIO);

    if (this.config.cordova && this.config.cordova.socketIO) // IO add some configuration options to the object
      this.config.cordova.socketIO = Object.assign({}, this.config.socketIO, this.config.cordova.socketIO);

    sockets.initialize(this.io);
  },

  /**
   * Start all activities and map the routes (clientType / activities mapping).
   * @private
   */
  _initActivities(expressApp) {
    this._activities.forEach((activity) => activity.start());

    this._activities.forEach((activity) => {
      this._setMap(activity.clientTypes, activity);
    });

    // map `clientType` to their respective activities
    for (let clientType in this._clientTypeActivitiesMap) {
      if (clientType !== this.config.defaultClient) {
        const activities = this._clientTypeActivitiesMap[clientType];
        this._map(clientType, activities, expressApp);
      }
    }

    // make sure `defaultClient` (aka `player`) is mapped last
    for (let clientType in this._clientTypeActivitiesMap) {
      if (clientType === this.config.defaultClient) {
        const activities = this._clientTypeActivitiesMap[clientType];
        this._map(clientType, activities, expressApp);
      }
    }
  },

  /**
   * Map a client type to a route, a set of activities.
   * Additionnally listen for their socket connection.
   * @private
   */
  _map(clientType, activities, expressApp) {
    let route = '';

    if (this._routes[clientType])
      route += this._routes[clientType];

    if (clientType !== this.config.defaultClient)
      route = `/${clientType}${route}`;

    // define template filename: `${clientType}.ejs` or `default.ejs`
    const templateDirectory = this.config.templateDirectory;
    const clientTmpl = path.join(templateDirectory, `${clientType}.ejs`);
    const defaultTmpl = path.join(templateDirectory, `default.ejs`);

    fs.stat(clientTmpl, (err, stats) => {
      let template;

      if (err || !stats.isFile())
        template = defaultTmpl;
      else
        template = clientTmpl;

      const tmplString = fs.readFileSync(template, { encoding: 'utf8' });
      const tmpl = ejs.compile(tmplString);

      // http request
      expressApp.get(route, (req, res) => {
        const data = this._clientConfigDefinition(clientType, this.config, req);
        const appIndex = tmpl({ data });
        res.send(appIndex);
      });

      // socket connnection
      this.io.of(clientType).on('connection', (socket) => {
        this._onSocketConnection(clientType, socket, activities);
      });
    });
  },

  /**
   * Socket connection callback.
   * @private
   */
  _onSocketConnection(clientType, socket, activities) {
    const client = new Client(clientType, socket);

    // global lifecycle of the client
    sockets.receive(client, 'disconnect', () => {
      activities.forEach((activity) => activity.disconnect(client));
      client.destroy();

      logger.info({ socket, clientType }, 'disconnect');
    });

    sockets.receive(client, 'handshake', (data) => {
      client.urlParams = data.urlParams;
      // @todo - handle reconnection (ex: `data` contains an `uuid`)
      activities.forEach((activity) => activity.connect(client));
      sockets.send(client, 'client:start', client.uuid);

      logger.info({ socket, clientType }, 'handshake');
    });
  },
};

export default server;
