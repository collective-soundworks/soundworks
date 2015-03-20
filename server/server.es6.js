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

  if (httpServer)
    server.io = new IO(httpServer);
}

function map(namespace, title, ...modules) {
  var ioNamespace = namespace.substr(1);
  var view = namespace.substr(1);
  var url = namespace;

  if (url === '/player')
    url = '/';

  expressApp.get(url, function(req, res) {
    res.render(view, {
      title: title
    });
  });

  server.io.of(ioNamespace).on('connection', (socket) => {
    var client = new ServerClient(socket);

    // client/server handshake: send "start" when client is "ready"
    client.receive('client_ready', () => {
      for (let mod of modules)
        mod.connect(client);

      client.receive('disconnect', () => {
        for (let i = modules.length - 1; i >= 0; i--) {
          var mod = modules[i];
          mod.disconnect(client);
        }
      });

      client.send('server_ready');
    });
  });
}

function broadcast(namespace, msg, ...args) {
  if (server.io)
    server.io.of(namespace).emit(msg, ...args);
}

module.exports = server;