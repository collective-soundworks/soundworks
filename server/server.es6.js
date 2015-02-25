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
  map: map
};

function start(app, path, port) {
  app.set('port', port || process.env.PORT || 8000);
  app.set('view engine', 'jade');
  app.use(express.static(path));

  httpServer = http.createServer(app);
  expressApp = app;

  httpServer.listen(app.get('port'), function() {
    console.log('Server listening on port', app.get('port'));
  });

  if (httpServer)
    server.io = new IO(httpServer);
}

function map(url, title, ...modules) {
  var namespace = url.substr(1);

  if (url === '/player')
    url = '/';

  expressApp.get(url, function(req, res) {
    res.render(namespace, {
      title: title
    });
  });

  server.io.of(namespace).on('connection', (socket) => {
    var client = new ServerClient(socket);

    socket.on('disconnect', () => {
      for (let mod of modules)
        mod.disconnect(client);
    });

    // client/server handshake: send "start" when client is "ready"
    socket.on('client_ready', () => {
      for (let mod of modules)
        mod.connect(client);

      socket.emit('server_ready');
    });
  });
}

module.exports = server;