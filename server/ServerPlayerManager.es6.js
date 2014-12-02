var Player = require('./ServerPlayer');
var EventEmitter = require('events').EventEmitter;

'use strict';

class ServerPlayerManager extends EventEmitter {
  constructor() {
    this.__pending = [];
    this.__playing = [];
    this.__sockets = {};
  }

  connect(socket) {
    var client = new Player(socket);

    this.__pending.push(client);
    this.__sockets[socket.id] = client;
    socket.join('pending');

    // console.log(
    //   '[ServerClientManager][connect] Client ' + socket.id + ' connected.\n' +
    //   'this.__pending: ' + this.__pending.map((c) => c.socket.id) + '\n' +
    //   'this.__playing: ' + this.__playing.map((c) => c.socket.id)
    // );

    this.emit('connected', client);
  }

  disconnect(socket) {
    var client = this.__sockets[socket.id];
    var index = this.__pending.indexOf(client);
    var clientArray = null;

    if (index > -1) {
      clientArray = this.__pending;
    } else {
      index = this.__playing.indexOf(client);

      if (index >= 0)
        clientArray = this.__playing;
    }

    if (clientArray) {
      client.socket.broadcast.emit('remove_player', client.getInfo());
      clientArray.splice(index, 1); // remove client from pending or playing array
      delete this.__sockets[socket.id];

      // console.log(
      //   '[ServerClientManager][disconnect] Client ' + socket.id + ' disconnected.\n' +
      //   'this.__pending: ' + this.__pending.map((c) => c.socket.id) + '\n' +
      //   'this.__playing: ' + this.__playing.map((c) => c.socket.id)
      // );
      
      this.emit('disconnected', client);
    }
  }

  clientReady(client) {
    var index = this.__pending.indexOf(client);

    if (index > -1) {
      this.__pending.splice(index, 1);
      this.__playing.push(client);

      var currentState = this.__playing.map((c) => c.getInfo());
      client.socket.emit('current_state', currentState);
      client.socket.broadcast.emit('new_player', client.getInfo());

      client.socket.leave('pending');
      client.socket.join('playing');

      this.emit('playing', client);
    }

    // console.log(
    //   '[ServerClientManager][clientReady] Client ' + client.socket.id + ' playing.\n' +
    //   'this.__pending: ' + this.__pending.map((c) => c.socket.id) + '\n' +
    //   'this.__playing: ' + this.__playing.map((c) => c.socket.id)
    // );
  }
}

module.exports = ServerPlayerManager;