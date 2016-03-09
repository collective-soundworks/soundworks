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



/**
 * Set of configuration parameters defined by a particular application.
 * These parameters typically inclusd a setup and control parameters values.
 */
const exampleAppConfig = {
  appName: 'Soundworks', // title of the application (for <title> tag)
  version: '0.0.1', // version of the application (allow to bypass browser cache)
  /**
   * @param {Object} [setup={}] - Setup defining dimensions and predefined positions (labels and/or coordinates).
   * @attribute {Object} [setup.area=null] - The dimensions of the area.
   * @attribute {Number} [setup.area.height] - The height of the area.
   * @attribute {Number} [setup.area.width] - The width of the area.
   * @attribute {String} [setup.area.background] - The optionnal background (image) of the area.
   * @attribute {Array<String>} [setup.labels] - List of predefined labels.
   * @attribute {Array<Array>} [setup.coordinates] - List of predefined coordinates
   *  given as an array `[x:Number, y:Number]`.
   * @attribute {Number} [setup.capacity=Infinity] - Maximum number of places
   *  (may limit or be limited by the number of labels and/or coordinates defined by the setup).
   * @ttribute {Number} [setup.maxClientsPerPosition=1] - The maximum number of clients
   *  allowed in one position.
   */
  setup: {
    area: {
      width: 10,
      height: 10,
      background: undefined,
    },
    labels: undefined,
    coordinates: undefined,
    maxClientsPerPosition: 1,
    capacity: Infinity,
  },
  controlParameters: {
    tempo: 120, // tempo in BPM
    volume: 0, // master volume in dB
  },
};

/**
 * Configuration parameters of the Soundworks framework.
 * These parameters allow for configuring components of the framework such as Express and SocketIO.
 */
const defaultFwConfig = {
  useHttps: false,
  publicFolder: path.join(process.cwd(), 'public'),
  templateFolder: path.join(process.cwd(), 'html'),
  defaultClient: 'player',
  assetsDomain: '', // override to download assets from a different serveur (nginx)
  socketIO: {
    url: '',
    transports: ['websocket'],
    pingTimeout: 60000, // configure client side too ?
    pingInterval: 50000, // configure client side too ?
    // @note: EngineIO defaults
    // pingTimeout: 3000,
    // pingInterval: 1000,
    // upgradeTimeout: 10000,
    // maxHttpBufferSize: 10E7,
  },
  errorReporterDirectory: 'logs/clients',
  dbDirectory: 'db',
};

/**
 * Configuration parameters of the Soundworks framework.
 * These parameters allow for configuring components of the framework such as Express and SocketIO.
 */
const defaultEnvConfig = {
  port: 8000,
  osc: {
    receiveAddress: '127.0.0.1',
    receivePort: 57121,
    sendAddress: '127.0.0.1',
    sendPort: 57120,
  },
  logger: {
    name: 'soundworks',
    level: 'info',
    streams: [{
      level: 'info',
      stream: process.stdout,
    }, /*{
      level: 'info',
      path: path.join(process.cwd(), 'logs', 'soundworks.log'),
    }*/]
  }
};

/**
 * The `server` object contains the basic methods of the server.
 * For instance, this object allows setting up, configuring and starting the server with the method `start` while the method `map` allows for managing the mapping between different types of clients and their required server activities.
 * @type {Object}
 */
export default {

  /**
   * WebSocket server.
   * @type {Object}
   * @private
   */
  io: null,

  /**
   * Express application
   * @type {Object}
   * @private
   */
  // expressApp: null,

  /**
   * Http server
   * @type {Object}
   * @private
   */
  // httpServer: null,

  /**
   * Configuration informations.
   * @type {Object}
   */
  config: {},

  /**
   * Mapping between a `clientType` and its related activities
   */
  _clientTypeActivitiesMap: {},

  /**
   * Activities to be started
   */
  _activities: new Set(),

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */
  require(id, options) {
    return serviceManager.require(id, null, options);
  },

  /**
   * Function used by activities to registered their concerned client type into the server
   * @param {Array<String>} clientTypes - An array of client type.
   * @param {Activity} activity - The activity concerned with the given `clientTypes`.
   * @private
   */
  setMap(clientTypes, activity) {
    clientTypes.forEach((clientType) => {
      if (!this._clientTypeActivitiesMap[clientType])
        this._clientTypeActivitiesMap[clientType] = new Set();

      this._clientTypeActivitiesMap[clientType].add(activity);
    });
  },

  /**
   * Function used by activities to register themselves as active activities
   * @param {Activity} activity
   * @private
   */
  setActivity(activity) {
    this._activities.add(activity);
  },


  /**
   * Initialize the server with the given config objects.
   * @todo - move this doc to configuration objects.
   *
   * @param {...Object} configs - Object of application configuration.
   *
   * @todo - rewrite doc properly for this method.
   * @param {Object} [appConfig={}] Application configuration options.
   * @attribute {String} [appConfig.publicFolder='./public'] Path to the public folder.
   * @attribute {Object} [appConfig.socketIO={}] socket.io options. The socket.io config object can have the following properties:
   * - `transports:String`: communication transport (defaults to `'websocket'`);
   * - `pingTimeout:Number`: timeout (in milliseconds) before trying to reestablish a connection between a lost client and a server (defautls to `60000`);
   * - `pingInterval:Number`: time interval (in milliseconds) to send a ping to a client to check the connection (defaults to `50000`).
   * @param {Object} [envConfig={}] Environment configuration options.
   * @attribute {Number} [envConfig.port=8000] Port of the HTTP server.
   * @attribute {Object} [envConfig.osc={}] OSC options. The OSC config object can have the following properties:
   * - `localAddress:String`: address of the local machine to receive OSC messages (defaults to `'127.0.0.1'`);
   * - `localPort:Number`: port of the local machine to receive OSC messages (defaults to `57121`);
   * - `remoteAddress:String`: address of the device to send default OSC messages to (defaults to `'127.0.0.1'`);
   * - `remotePort:Number`: port of the device to send default OSC messages to (defaults to `57120`).
   */
  init(...configs) {
        // merge default configuration objects
    this.config = Object.assign(this.config, exampleAppConfig, defaultFwConfig, defaultEnvConfig);
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
   * Start the server:
   * - launch the HTTP server.
   * - launch the socket server.
   * - start all registered activities.
   * - define routes and associate client types and activities.
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
   */
  _initSockets(httpServer) {
    this.io = new IO(httpServer, this.config.socketIO);

    if (this.config.cordova && this.config.cordova.socketIO) // IO add some configuration options to the object
      this.config.cordova.socketIO = Object.assign({}, this.config.socketIO, this.config.cordova.socketIO);

    sockets.initialize(this.io);
  },

  /**
   * Start all activities and map the routes (clientType / activities mapping).
   */
  _initActivities(expressApp) {
    this._activities.forEach((activity) => activity.start());

    this._activities.forEach((activity) => {
      this.setMap(activity.clientTypes, activity)
    });

    // map `clientType` to their respective activities
    for (let clientType in this._clientTypeActivitiesMap) {
      const activity = this._clientTypeActivitiesMap[clientType];
      this._map(clientType, activity, expressApp);
    }
  },

  /**
   * Indicate that the clients of type `clientType` require the activities `...activities` on the server side.
   * Additionally, this method routes the connections from the corresponding URL to the corresponding view.
   * More specifically:
   * - A client connecting to the server through the root URL `http://my.server.address:port/` is considered as a `'player'` client and displays the view `player.ejs`;
   * - A client connecting to the server through the URL `http://my.server.address:port/clientType` is considered as a `clientType` client, and displays the view `clientType.ejs`.
   * @param {String} clientType Client type (as defined by the method {@link client.init} on the client side).
   * @param {...Activity} activities Activities to map to that client type.
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
   */
  _onConnection(clientType, activities) {
    return (socket) => {
      const client = new Client(clientType, socket);
      activities.forEach((activity) => activity.connect(client));

      // global lifecycle of the client
      sockets.receive(client, 'disconnect', () => {
        activities.forEach((activity) => activity.disconnect(client));
        // @todo - should remove all listeners on the client
        client.destroy();
        logger.info({ socket, clientType }, 'disconnect');
      });

      // @todo - refactor handshake and uuid definition.
      sockets.send(client, 'client:start', client.uuid); // the server is ready
      logger.info({ socket, clientType }, 'connection');
    }
  },
};
