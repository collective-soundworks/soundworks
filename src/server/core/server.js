import Client from './Client';
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

// import default configuration
import { default as defaultAppConfig } from '../config/app';
import { default as defaultFwConfig } from '../config/fw';
import { default as defaultEnvConfig } from '../config/env';


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
 * soundworks.server.init({ appName: 'MyApplication' });
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
   * @param {...Object} configs - configuration object to be merge with the
   *  default `soundworks` config.
   *
   * @see {@link module:soundworks/server.app}
   * @see {@link module:soundworks/server.env}
   * @see {@link module:soundworks/server.fw}
   */
  init(...configs) {
    // merge default configuration objects
    this.config = Object.assign(this.config, defaultAppConfig, defaultFwConfig, defaultEnvConfig);
    // merge given configurations objects with defaults (1 level depth)
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

  /**
   * Start the application:
   * - launch the HTTP server.
   * - launch the socket server.
   * - start all registered activities.
   * - define routes and and activities mapping for all client types.
   */
  start() {
    logger.initialize(this.config.logger);

    // --------------------------------------------------
    // configure express and http(s) server
    // --------------------------------------------------
    const expressApp = new express();
    expressApp.set('port', process.env.PORT || this.config.port);
    expressApp.set('view engine', 'ejs');
    expressApp.use(express.static(this.config.publicFolder));

    let httpServer;

    if (!this.config.useHttps) {
      httpServer = http.createServer(expressApp);
      this._initSockets(httpServer);
      this._initActivities(expressApp);

      httpServer.listen(expressApp.get('port'), function() {
        const url = `http://127.0.0.1:${expressApp.get('port')}`;
        console.log('[HTTP SERVER] Server listening on', url);
      });
    } else {
      pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
        httpServer = https.createServer({
          key: keys.serviceKey,
          cert: keys.certificate
        }, expressApp);

        this._initSockets(httpServer);
        this._initActivities(expressApp);

        httpServer.listen(expressApp.get('port'), function() {
          const url = `https://127.0.0.1:${expressApp.get('port')}`;
          console.log('[HTTP SERVER] Server listening on', url);
        });
      });
    }
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
      this._setMap(activity.clientTypes, activity)
    });

    // map `clientType` to their respective activities
    for (let clientType in this._clientTypeActivitiesMap) {
      const activity = this._clientTypeActivitiesMap[clientType];
      this._map(clientType, activity, expressApp);
    }
  },

  /**
   * Map a client type to a route, a set of activities.
   * Additionnally listen for their socket connection.
   * @private
   */
  _map(clientType, activities, expressApp) {
    // @todo - allow to pass some variable in the url -> define how bind it to sockets...
    const url = (clientType !== this.config.defaultClient) ? `/${clientType}` : '/';

    // use template with `clientType` name or default if not defined
    const clientTmpl = path.join(this.config.templateFolder, `${clientType}.ejs`);
    const defaultTmpl = path.join(this.config.templateFolder, `default.ejs`);
    const template = fs.existsSync(clientTmpl) ? clientTmpl : defaultTmpl;

    const tmplString = fs.readFileSync(template, { encoding: 'utf8' });
    const tmpl = ejs.compile(tmplString);

    expressApp.get(url, (req, res) => {
      let includeCordovaTags = false;
      let socketConfig = JSON.stringify(this.config.socketIO);

      if (req.query.cordova) {
        includeCordovaTags = true;
        socketConfig = JSON.stringify(this.config.cordova.socketIO);
      }

      if (req.query.clientType)
        clientType = req.query.clientType;

      res.send(tmpl({
        socketIO: socketConfig,
        appName: this.config.appName,
        clientType: clientType,
        defaultType: this.config.defaultClient,
        assetsDomain: this.config.assetsDomain,
        // export html for cordova use
        includeCordovaTags: includeCordovaTags,
      }));
    });

    // wait for socket connnection
    this.io.of(clientType).on('connection', this._onConnection(clientType, activities));
  },

  /**
   * Socket connection callback.
   * @private
   */
  _onConnection(clientType, activities) {
    return (socket) => {
      const client = new Client(clientType, socket);
      activities.forEach((activity) => activity.connect(client));

      // global lifecycle of the client
      sockets.receive(client, 'disconnect', () => {
        activities.forEach((activity) => activity.disconnect(client));
        client.destroy();
        logger.info({ socket, clientType }, 'disconnect');
      });

      // @todo - refactor handshake and uuid definition.
      sockets.send(client, 'client:start', client.uuid);
      logger.info({ socket, clientType }, 'connection');
    }
  },
};

export default server;
