import comm from './comm';
import ejs from 'ejs';
import express from 'express';
import fs from 'fs';
import http from 'http';
import logger from './logger';
import IO from 'socket.io';
import osc from 'osc';
import path from 'path';
import Client from './Client';

// globals
// @todo hide this into client

const oscListeners = [];

const defaultAppConfig = {
  publicFolder: path.join(process.cwd(), 'public'),
  defaultClient: 'player',
  socketIO: {
    transports: ['websocket'],
    pingTimeout: 60000,
    pingInterval: 50000
    // @note: EngineIO defaults
    // pingTimeout: 3000,
    // pingInterval: 1000,
    // upgradeTimeout: 10000,
    // maxHttpBufferSize: 10E7,
  },
};

const defaultEnvConfig = {
  port: 8000,
  osc: {
    localAddress: '127.0.0.1',
    localPort: 57121,
    remoteAddress: '127.0.0.1',
    remotePort: 57120,
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
 * For instance, this object allows setting up, configuring and starting the server with the method `start` while the method `map` allows for managing the mapping between different types of clients and their required server modules.
 * Additionally, the method `broadcast` allows to send messages to all connected clients via WebSockets or OSC.
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
   * Application configuration information.
   * @type {Object}
   * @private
   */
  appConfig: {}, // host env config informations (dev / prod)

  /**
   * Environment configuration information (development / production).
   * @type {Object}
   * @private
   */
  envConfig: {}, // host env config informations (dev / prod)

  /**
   * OSC object.
   * @type {Object}
   * @private
   */
  osc: null,

  /**
   * Start the server.
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
  start(appConfig = {}, envConfig = {}) {
    // @todo - add 1 level of merging to Object.assign
    appConfig = Object.assign(defaultAppConfig, appConfig);
    envConfig = Object.assign(defaultEnvConfig, envConfig);
    this.appConfig = appConfig;
    this.envConfig = envConfig;

    // configure express and http server
    const expressApp = new express();
    expressApp.set('port', process.env.PORT || envConfig.port);
    expressApp.set('view engine', 'ejs');
    expressApp.use(express.static(appConfig.publicFolder));

    const httpServer = http.createServer(expressApp);
    httpServer.listen(expressApp.get('port'), function() {
      const url = `http://127.0.0.1:${expressApp.get('port')}`;
      console.log('[HTTP SERVER] Server listening on', url);
    });

    this.expressApp = expressApp;
    this.httpServer = httpServer;

    this.io = new IO(httpServer, appConfig.socketIO);
    comm.initialize(this.io);
    logger.initialize(envConfig.logger);

    // configure OSC
    if (envConfig.osc) {
      this.osc = new osc.UDPPort({
        // This is the port we're listening on.
        // @note rename to receiveAddress / receivePort
        localAddress: envConfig.osc.localAddress,
        localPort: envConfig.osc.localPort,
        // This is the port we use to send messages.
        // @note rename to sendAddress / sendPort
        remoteAddress: envConfig.osc.remoteAddress,
        remotePort: envConfig.osc.remotePort,
      });

      this.osc.on('ready', () => {
        const receive = `${envConfig.osc.localAddress}:${envConfig.osc.localPort}`;
        const send = `${envConfig.osc.remoteAddress}:${envConfig.osc.remotePort}`;
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
  map(clientType, ...modules) {
    const url = (clientType !== this.appConfig.defaultClient) ? `/${clientType}` : '/';
    // cache compiled template
    const tmplPath = path.join(process.cwd(), 'views', clientType + '.ejs');
    const tmplString = fs.readFileSync(tmplPath, { encoding: 'utf8' });
    const tmpl = ejs.compile(tmplString);

    // @todo refactor
    // write env config into templates
    this.expressApp.get(url, (req, res) => {
      const envConfigCopy = Object.assign({}, this.envConfig);
      // remove logger configuration
      envConfigCopy.logger = undefined;
      res.send(tmpl({
        envConfig: JSON.stringify(envConfigCopy)
      }));
    });

    modules.forEach((mod) => { mod.configure(this.appConfig, this.envConfig) })

    this.io.of(clientType).on('connection', (socket) => {
      const client = new Client(clientType, socket);
      modules.forEach((mod) => { mod.connect(client) });

      // global lifecycle of the client
      comm.receive(client, 'disconnect', () => {
        modules.forEach((mod) => { mod.disconnect(client) });
        client.destroy();
        logger.info({ socket: socket, clientType: clientType }, 'disconnect');
      });

      comm.send(client, 'client:start', client.index); // the server is ready
      logger.info({ socket: socket, clientType: clientType }, 'connection');
    });
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
