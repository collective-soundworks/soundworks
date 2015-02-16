/**
 * @fileoverview Matrix server side socket i/o (singleton)
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var http = require('http');
var IO = require('socket.io');
var ServerClient = require('./ServerClient');

var __expressApp = null;
var __httpServer = null;
//var __clients = [];

// function __arrayRemove(array, value) {
//   var index = array.indexOf(value);

//   if (index >= 0) {
//     array.splice(index, 1);
//     return true;
//   }

//   return false;
// }

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
    // __clients.push(client);

    var client = new ServerClient(socket);

    socket.on('disconnect', () => {
      for (let mod of modules)
        mod.disconnect(client);

      // __arrayRemove(__clients, client);
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