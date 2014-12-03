var Player = require('./ServerPlayer');
var EventEmitter = require('events').EventEmitter;

'use strict';

class ServerPlayerManager extends EventEmitter {
  constructor() {
    this.__pending = [];
    this.__playing = [];
    this.__sockets = {};
  }

  register(socket) {
    var player = new Player(socket);

    this.__pending.push(player);
    this.__sockets[socket.id] = player;
    socket.join('setup');

    // console.log(
    //   '[ServerPlayerManager][connect] Player ' + socket.id + ' connected.\n' +
    //   'this.__pending: ' + this.__pending.map((c) => c.socket.id) + '\n' +
    //   'this.__playing: ' + this.__playing.map((c) => c.socket.id)
    // );

    this.emit('player_registered', player);
  }

  unregister(socket) {
    var player = this.__sockets[socket.id];
    var index = this.__pending.indexOf(player);
    var playerArray = null;

    if (index > -1) {
      playerArray = this.__pending;
    } else {
      index = this.__playing.indexOf(player);

      if (index >= 0)
        playerArray = this.__playing;
    }

    if (playerArray) {
      player.socket.broadcast.emit('remove_player', player.getInfo());
      playerArray.splice(index, 1); // remove player from pending or playing array
      delete this.__sockets[socket.id];

      // console.log(
      //   '[ServerPlayerManager][disconnect] Player ' + socket.id + ' disconnected.\n' +
      //   'this.__pending: ' + this.__pending.map((c) => c.socket.id) + '\n' +
      //   'this.__playing: ' + this.__playing.map((c) => c.socket.id)
      // );
      
      this.emit('player_unregistered', player);
    }
  }

  playerReady(player) {
    var index = this.__pending.indexOf(player);

    if (index > -1) {
      this.__pending.splice(index, 1);
      this.__playing.push(player);

      var currentState = this.__playing.map((c) => c.getInfo());
      player.socket.emit('current_state', currentState);
      player.socket.broadcast.emit('new_player', player.getInfo());

      player.socket.leave('setup');
      player.socket.join('performance');

      this.emit('player_ready', player);
    }

    // console.log(
    //   '[ServerPlayerManager][playerReady] Player ' + player.socket.id + ' playing.\n' +
    //   'this.__pending: ' + this.__pending.map((c) => c.socket.id) + '\n' +
    //   'this.__playing: ' + this.__playing.map((c) => c.socket.id)
    // );
  }
}

module.exports = ServerPlayerManager;