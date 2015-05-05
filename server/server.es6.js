/**
 * @fileoverview Soundworks server side socket i/o (singleton)
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var express = require('express');
var http = require('http');
var IO = require('socket.io');
var ServerClient = require('./ServerClient');

var expressApp = null;
var httpServer = null;

var server = {
  io: null,
  start: start,
  map: map,
  broadcast: broadcast
};

function start(app, publicPath, port) {
  app.set('port', port || process.env.PORT || 8000);
  app.set('view engine', 'ejs');
  app.use(express.static(publicPath));

  httpServer = http.createServer(app);
  expressApp = app;

  httpServer.listen(app.get('port'), function() {
    console.log('Server listening on port', app.get('port'));
  });

  // Engine IO defaults
  // this.pingTimeout = opts.pingTimeout || 60000;
  // this.pingInterval = opts.pingInterval || 25000;
  // this.upgradeTimeout = opts.upgradeTimeout || 10000;
  // this.maxHttpBufferSize = opts.maxHttpBufferSize || 10E7;

  if (httpServer) {
    server.io = new IO(httpServer, {
      transports: ['websocket'],
      pingTimeout: 60000,
      pingInterval: 50000
      // pingTimeout: 3000,
      // pingInterval: 1000
    });
  }
}

var logIndex = 0;

function map(clientType, ...modules) {
  var url = '/';

  if (clientType !== 'player')
    url += clientType;

  expressApp.get(url, function(req, res) {
    res.render(clientType, {});
  });

  server.io.of(clientType).on('connection', (socket) => {
    console.log(logIndex++, 'connection');
    var client = new ServerClient(clientType, socket);

    // client/server handshake: send "start" when client is "ready"
    // client.receive('client:ready', () => {
    for (let mod of modules) {
      mod.connect(client);
    }

    client.receive('disconnect', () => {
      for (let i = modules.length - 1; i >= 0; i--) {
        var mod = modules[i];
        mod.disconnect(client);
      }
    });

    client.send('server:ready');
    // });
  });
}

function broadcast(clientType, msg, ...args) {
  if (server.io)
    server.io.of('/' + clientType).emit(msg, ...args);
}

module.exports = server;