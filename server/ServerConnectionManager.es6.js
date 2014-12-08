'use strict';

var ioServer = require('./ioServer');
var EventEmitter = require('events').EventEmitter;

class ServerConnectionManager extends EventEmitter {
  constructor() {
    var io = ioServer.io;
    io.of('/play').on('connection', (socket) => {
      this.emit('connected', socket);

      socket.on('disconnect', () => {
        this.emit('disconnected', socket);
      });
    });
  }
}

module.exports = ServerConnectionManager;

// TODO: handle /admin.html page