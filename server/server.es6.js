/**
 * @fileoverview Soundworks server side socket i/o (singleton)
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
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

function getClientIndex() {
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

function releaseClientIndex(index) {
  availableClientIndices.push(index);
}

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

    var index = getClientIndex();
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

      releaseClientIndex(client.index);
      client.index = -1;
    });

    client.send('client:start', index); // the server is ready
  });
}

function broadcast(clientType, msg, ...args) {
  if (server.io) {
    log.info({ clientType: clientType, channel: msg, arguments: args }, 'broadcast');
    server.io.of('/' + clientType).emit(msg, ...args);
  }
}

function sendOSC(address, args, url = null, port = null) {
  const oscMsg = {
    address: address,
    args: args
  };

  try {
    if (url && port)
      server.osc.send(oscMsg, url, port);
    else
      server.osc.send(oscMsg); // use defaults (as defined in the config)
  } catch (e) {
    console.log('Error while sending OSC message:', e);
  }
}

function receiveOSC(wildcard, callback) {
  const oscListener = {
    wildcard: wildcard,
    callback: callback
  };

  oscListeners.push(oscListener);
}

module.exports = server;
