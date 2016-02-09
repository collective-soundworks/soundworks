import sockets from './sockets';
import ejs from 'ejs';
import express from 'express';
import fs from 'fs';
import http from 'http';
import logger from '../utils/logger';
import IO from 'socket.io';
import osc from 'osc';
import path from 'path';
import Client from './Client';
import serverServiceManager from './serverServiceManager';

// @todo - move into osc service.
const oscListeners = [];

/**
 * Set of configuration parameters defined by a particular application.
 * These parameters typically inclusd a setup and control parameters values.
 */
const exampleAppConfig = {
  appName: 'Soundworks', // title of the application (for <title> tag)
  version: '0.0.1', // version of the application (bypass browser cache)
  playerSetup: {
    width: 10, // width of the setup area in meters
    height: 10, // height of the setup area in meters
    labels: undefined, // predefined labels (optional)
    coordinates: undefined, // predefined coordinates on the setup area (optional)
    background: undefined, // URL of a background image fitting the setup area (optional)
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
  publicFolder: path.join(process.cwd(), 'public'),
  templateFolder: path.join(process.cwd(), 'views'),
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
};

/**
 * Configuration parameters of the Soundworks framework.
 * These parameters allow for configuring components of the framework such as Express and SocketIO.
 */
const defaultEnvConfig = {
  port: 8000,
  // osc: {
  //   receiveAddress: '127.0.0.1',
  //   receivePort: 57121,
  //   sendAddress: '127.0.0.1',
  //   sendPort: 57120,
  // },
  osc: null,
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
 * For instance, this object allows setting up, configuring and starting the server with the method `start` while the method `map` allows for managing the mapping between different types of clients and their required server modules.
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
   */
  expressApp: null,
  /**
   * Http server
   * @type {Object}
   */
  httpServer: null,

  /**
   * Configuration informations.
   * @type {Object}
   */
  config: {},

  /**
   * OSC object.
   * @todo - Move into service
   * @type {Object}
   * @private
   */
  osc: null,

  /**
   * Mapping between a `clientType` and its related activities
   */
  _maps: {},

  /**
   * Activities to be started
   */
  _activities: new Set(),

  /**
   * Initialize the server with the given config objects.
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
    // --------------------------------------------------
    // configure express and http server
    // --------------------------------------------------

    const expressApp = new express();
    expressApp.set('port', process.env.PORT || this.config.port);
    expressApp.set('view engine', 'ejs');
    expressApp.use(express.static(this.config.publicFolder));

    const httpServer = http.createServer(expressApp);
    httpServer.listen(expressApp.get('port'), function() {
      const url = `http://127.0.0.1:${expressApp.get('port')}`;
      console.log('[HTTP SERVER] Server listening on', url);
    });

    this.expressApp = expressApp;
    this.httpServer = httpServer;

    this.io = new IO(httpServer, this.config.socketIO);
    sockets.initialize(this.io);
    logger.initialize(this.config.logger);

    // --------------------------------------------------
    // start all activities and create routes
    // --------------------------------------------------

    this._activities.forEach((activity) => activity.start());
    // map `clientType` to their respective activities
    for (let clientType in this._maps) {
      const activity = this._maps[clientType];
      this._map(clientType, activity);
    }

    // --------------------------------------------------
    // @todo - move into a proper service.
    // configure OSC - should be optionnal
    if (this.config.osc) {
      const oscConfig = this.config.osc;

      this.osc = new osc.UDPPort({
        // This is the port we're listening on.
        localAddress: oscConfig.receiveAddress,
        localPort: oscConfig.receivePort,
        // This is the port we use to send messages.
        remoteAddress: oscConfig.sendAddress,
        remotePort: oscConfig.sendPort,
      });

      this.osc.on('ready', () => {
        const receive = `${oscConfig.receiveAddress}:${oscConfig.receivePort}`;
        const send = `${oscConfig.sendAddress}:${oscConfig.sendPort}`;
        console.log(`[OSC over UDP] Receiving on ${receive}`);
        console.log(`[OSC over UDP] Sending on ${send}`);
      });

      this.osc.on('message', (oscMsg) => {
        const address = oscMsg.address;

        for (let i = 0; i < oscListeners.length; i++) {
          if (address === oscListeners[i].wildcard)
            oscListeners[i].callback(oscMsg);
        }
      });

      this.osc.open();
    }
    // --------------------------------------------------
  },

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */
  require(id, options) {
    return serverServiceManager.require(id, options);
  },

  /**
   * Function used by activities to registered their concerned client type into the server
   * @param {Array<String>} clientTypes - An array of client type.
   * @param {Activity} activity - The activity concerned with the given `clientTypes`.
   * @private
   */
  setMap(clientTypes, activity) {
    clientTypes.forEach((clientType) => {
      if (!this._maps[clientType])
        this._maps[clientType] = new Set();

      this._maps[clientType].add(activity);
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
   * Indicate that the clients of type `clientType` require the modules `...modules` on the server side.
   * Additionally, this method routes the connections from the corresponding URL to the corresponding view.
   * More specifically:
   * - A client connecting to the server through the root URL `http://my.server.address:port/` is considered as a `'player'` client and displays the view `player.ejs`;
   * - A client connecting to the server through the URL `http://my.server.address:port/clientType` is considered as a `clientType` client, and displays the view `clientType.ejs`.
   * @param {String} clientType Client type (as defined by the method {@link client.init} on the client side).
   * @param {...ClientModule} modules Modules to map to that client type.
   */
  _map(clientType, modules) {
    // @todo - allow to pass some variable in the url -> define how bind it to sockets...
    const url = (clientType !== this.config.defaultClient) ? `/${clientType}` : '/';

    // use template with `clientType` name or default if not defined
    const clientTmpl = path.join(this.config.templateFolder, `${clientType}.ejs`);
    const defaultTmpl = path.join(this.config.templateFolder, `default.ejs`);
    const template = fs.existsSync(clientTmpl) ? clientTmpl : defaultTmpl;

    const tmplString = fs.readFileSync(template, { encoding: 'utf8' });
    const tmpl = ejs.compile(tmplString);

    this.expressApp.get(url, (req, res) => {
      res.send(tmpl({
        socketIO: JSON.stringify(this.config.socketIO),
        appName: this.config.appName,
        clientType: clientType,
        defaultType: this.config.defaultClient,
        assetsDomain: this.config.assetsDomain,
      }));

      // this.io.of(clientType).on('connection', this._onConnection(clientType, modules));
    });

    // wait for socket connnection
    this.io.of(clientType).on('connection', this._onConnection(clientType, modules));
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

      // @todo - refactor handshake and uid definition.
      sockets.send(client, 'client:start', client.uid); // the server is ready
      logger.info({ socket, clientType }, 'connection');
    }
  },

  /**
   * Send an OSC message.
   * @param {String} wildcard Wildcard of the OSC message.
   * @param {Array} args Arguments of the OSC message.
   * @param {String} [url=null] URL to send the OSC message to (if not specified, uses the address defined in the OSC config or in the options of the {@link server.start} method).
   * @param {Number} [port=null] Port to send the message to (if not specified, uses the port defined in the OSC config or in the options of the {@link server.start} method).
   */
  sendOSC(wildcard, args, url = null, port = null) {
    const oscMsg = {
      address: wildcard,
      args: args
    };

    try {
      if (url && port) {
        this.osc.send(oscMsg, url, port);
      } else {
        this.osc.send(oscMsg); // use defaults (as defined in the config)
      }
    } catch (e) {
      console.log('Error while sending OSC message:', e);
    }
  },

  /**
   * Listen for OSC message and execute a callback function.
   * The server listens to OSC messages at the address and port defined in the config or in the options of the {@link server.start} method.
   *
   * @param {String} wildcard Wildcard of the OSC message.
   * @param {Function} callback Callback function executed when the OSC message is received.
   */
  receiveOSC(wildcard, callback) {
    const oscListener = {
      wildcard: wildcard,
      callback: callback
    };

    oscListeners.push(oscListener);
  }
};
