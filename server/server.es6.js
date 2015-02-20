/**
 * @fileoverview Soundworks server side socket i/o (singleton)
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var http = require('http');
var IO = require('socket.io');
var ServerClient = require('./ServerClient');

var __expressApp = null;
var __httpServer = null;

var server = {
  io: null,
  start: start,
  map: map
};

function start(app) {
  __httpServer = http.createServer(app);
  __expressApp = app;

  __httpServer.listen(app.get('port'), function() {
    console.log('Server listening on port', app.get('port'));
  });

  if (__httpServer)
    server.io = new IO(__httpServer);
}

function map(url, title, ...modules) {
  var namespace = url.substr(1);

  if (url === '/player')
    url = '/';

  __expressApp.get(url, function(req, res) {
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