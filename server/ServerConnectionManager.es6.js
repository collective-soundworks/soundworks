var server = require('./ServerIOSingleton');
var EventEmitter = require('events').EventEmitter;

'use strict';

class ServerConnectionManager extends EventEmitter {
  constructor() {
    server.io.of('/play').on('connection', (socket) => {
      console.log('global connection', socket.id);
      this.emit('connected', socket);

      socket.on('disconnect', () => {
        this.emit('disconnected', socket);
      })
    });
  }
}

module.exports = ServerConnectionManager;

// TODO: handle /admin.html page