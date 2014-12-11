/**
 * @fileoverview Matrix server side socket i/o (singleton)
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var http = require('http');
var IO = require('socket.io');

class SocketIoServer {
  constructor() {
    this.server = null;
    this.io = null;
  }

  init(app) {
    var server = http.createServer(app);

    server.listen(app.get('port'), function() {
      console.log('Server listening on port', app.get('port'));
    });

    this.server = server;

    if (server)
      this.io = new IO(server);
  }
}

// Everyone will use this instance with the same instantiated IO.
module.exports = new SocketIoServer();