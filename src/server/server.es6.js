'use strict';

const ejs = require('ejs');
const express = require('express');
const fs = require('fs');
const http = require('http');
const log = require('./logger');
const IO = require('socket.io');
const osc = require('osc');
const path = require('path');

const ServerClient = require('./ServerClient');
// import ServerClient from './ServerClient.es6.js';

/**
 * The `server` object contains the basic methods of the server.
 * For instance, this object allows setting up, configuring and starting the server with the method `start` while the method `map` allows for managing the mapping between different types of clients and their required server modules.
 * Additionally, the method `broadcast` allows to send messages to all connected clients via WebSockets or OSC.
 */
const server = {
  io: null,
  start: start,
  map: map,
  broadcast: broadcast,
  envConfig: {}, // host env config informations (dev / prod)
  osc: null,
  sendOSC: sendOSC,
  receiveOSC: receiveOSC
};

let availableClientIndices = [];
let nextClientIndex = 0;
let oscListeners = [];
let expressApp = null;
let httpServer = null;

function _getClientIndex() {
  var index = -1;

  if (availableClientIndices.length > 0) {
    availableClientIndices.sort(function(a, b) {
      return a - b;
    });

    index = availableClientIndices.splice(0, 1)[0];
  } else {
    index = nextClientIndex++;
  }

  return index;
}

function _releaseClientIndex(index) {
  availableClientIndices.push(index);
}

/**
 * Starts the server.
 * @param {Object} app Express application.
 * @param {String} publicPath Public static directory of the Express app.
 * @param {Number} port Port.
 * @param {Object} [options={}] Options.
 * @param {Object} [options.socketIO={}] socket.io options. The socket.io config object can have the following properties:
 * - `transports:String`: communication transport (defaults to `'websocket'`);
 * - `pingTimeout:Number`: timeout (in milliseconds) before trying to reestablish a connection between a lost client and a server (defautls to `60000`);
 * - `pingInterval:Number`: time interval (in milliseconds) to send a ping to a client to check the connection (defaults to `50000`).
 * @param {Object} [options.osc={}] OSC options. The OSC config object can have the following properties:
 * - `localAddress:String`: address of the local machine to receive OSC messages (defaults to `'127.0.0.1'`);
 * - `localPort:Number`: port of the local machine to receive OSC messages (defaults to `57121`);
 * - `remoteAddress:String`: address of the device to send default OSC messages to (defaults to `'127.0.0.1'`);
 * - `remotePort:Number`: port of the device to send default OSC messages to (defaults to `57120`).
 * @param {Object} [options.env={}] Environnement options (set by the user, depends on the scenario).
 */
function start(app, publicPath, port, options = {}) {
  const socketIOOptions = (options.socketIO || {});
  const socketConfig = {
    transports: socketIOOptions.transports || ['websocket'],
    pingTimeout: socketIOOptions.pingTimeout || 60000,
    pingInterval: socketIOOptions.pingInterval || 50000,
  };

  server.envConfig = options.env;

  app.set('port', process.env.PORT || port || 8000);
  app.set('view engine', 'ejs');
  app.use(express.static(publicPath));

  httpServer = http.createServer(app);
  expressApp = app;

  httpServer.listen(app.get('port'), function() {
    console.log('Server listening on port', app.get('port'));
  });

  // Engine IO defaults
  // this.pingTimeout = opts.pingTimeout || 3000;
  // this.pingInterval = opts.pingInterval || 1000;
  // this.upgradeTimeout = opts.upgradeTimeout || 10000;
  // this.maxHttpBufferSize = opts.maxHttpBufferSize || 10E7;

  if (httpServer) {
    server.io = new IO(httpServer, socketConfig);
  }

  // OSC
  if (options.osc) {
    server.osc = new osc.UDPPort({
      // This is the port we're listening on.
      localAddress: options.osc.localAddress || '127.0.0.1',
      localPort: options.osc.localPort || 57121,

      // This is the port we use to send messages.
      remoteAddress: options.osc.remoteAddress || '127.0.0.1',
      remotePort: options.osc.remotePort || 57120,
    });

    server.osc.on('ready', () => {
      console.log('Listening for OSC over UDP on port ' + options.osc.localPort + '.');
    });

    server.osc.on('message', (oscMsg) => {
      const address = oscMsg.address;

      for (let i = 0; i < oscListeners.length; i++) {
        if (address === oscListeners[i].wildcard)
          oscListeners[i].callback(oscMsg);
      }
    });

    server.osc.open();
  }
}

/**
 * Indicates that the clients of type `clientType` require the modules `...modules` on the server side.
 * Additionally, this method routes the connections from the corresponding URL to the corresponding view.
 * More specifically:
 * - A client connecting to the server through the root URL `http://my.server.address:port/` is considered as a `'player'` client and displays the view `player.ejs`;
 * - A client connecting to the server through the URL `http://my.server.address:port/clientType` is considered as a `clientType` client, and displays the view `clientType.ejs`.
 * @param {String} clientType Client type (as defined by the method {@link client.init} on the client side).
 * @param {...ClientModule} modules Modules to map to that client type.
 */
function map(clientType, ...modules) {
  var url = '/';

  // cache compiled template
  const tmplPath= path.join(process.cwd(), 'views', clientType + '.ejs');
  const tmplString = fs.readFileSync(tmplPath, { encoding: 'utf8' });
  const tmpl = ejs.compile(tmplString);

  if (clientType !== 'player')
    url += clientType;

  expressApp.get(url, function(req, res) {
    res.send(tmpl({ envConfig: JSON.stringify(server.envConfig) }));
  });

  server.io.of(clientType).on('connection', (socket) => {
    log.info({ socket: socket, clientType: clientType }, 'connection');
    var client = new ServerClient(clientType, socket);

    var index = _getClientIndex();
    client.index = index;

    for (let mod of modules) {
      mod.connect(client);
    }

    client.receive('disconnect', () => {
      log.info({ socket: socket, clientType: clientType }, 'disconnect');
      for (let i = modules.length - 1; i >= 0; i--) {
        var mod = modules[i];
        mod.disconnect(client);
      }

      _releaseClientIndex(client.index);
      client.index = -1;
    });

    client.send('client:start', index); // the server is ready
  });
}

/**
 * Sends a WebSocket message to all the clients of type `clientType`.
 *
 * **Note:** on the client side, the clients receive the message with the method {@link client.receive}.
 * @param {String} clientType Client type (as defined by the method {@link client.init} on the client side).
 * @param {String} msg Name of the message to send.
 * @param {...*} args Arguments of the message (as many as needed, of any type).
 * @todo solve ... problem
 */
function broadcast(clientType, msg, ...args) {
  if (server.io) {
    log.info({ clientType: clientType, channel: msg, arguments: args }, 'broadcast');
    server.io.of('/' + clientType).emit(msg, ...args);
  }
}

/**
 * Sends an OSC message.
 * @param {String} wildcard Wildcard of the OSC message.
 * @param {Array} args Arguments of the OSC message.
 * @param {String} [url=null] URL to send the OSC message to (if not specified, uses the address defined in the OSC config or in the options of the {@link server.start} method).
 * @param {Number} [port=null] Port to send the message to (if not specified, uses the port defined in the OSC config or in the options of the {@link server.start} method).
 */
function sendOSC(wildcard, args, url = null, port = null) {
  const oscMsg = {
    address: wildcard,
    args: args
  };

  if (url && port)
    server.osc.send(oscMsg, url, port);
  else
    server.osc.send(oscMsg); // use defaults (as defined in the config)
}

/**
 * Executes a callback function when it receives an OSC message.
 * The server listens to OSC messages at the address and port defined in the config or in the options of the {@link server.start} method.
 *
 * @param {String} wildcard Wildcard of the OSC message.
 * @param {Function} callback Callback function executed when the OSC message is received.
 */
function receiveOSC(wildcard, callback) {
  const oscListener = {
    wildcard: wildcard,
    callback: callback
  };

  oscListeners.push(oscListener);
}

// export default server;
module.exports = server;
