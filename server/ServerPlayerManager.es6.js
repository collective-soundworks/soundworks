/**
 * @fileoverview Matrix server side player manager
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var Player = require('./ServerPlayer');
var EventEmitter = require('events').EventEmitter;

class ServerPlayerManager extends EventEmitter {
  constructor(topologyManager) {
    this.topologyManager = topologyManager;
    this.pending = [];
    this.playing = [];
    this.sockets = {};
  }

  register(socket) {
    var player = new Player(socket);

    this.pending.push(player);
    this.sockets[socket.id] = player;
    socket.join('setup');

    // console.log(
    //   '[ServerPlayerManager][connect] Player ' + socket.id + ' connected.\n' +
    //   'this.pending: ' + this.pending.map((c) => c.socket.id) + '\n' +
    //   'this.playing: ' + this.playing.map((c) => c.socket.id)
    // );

    return player;
  }

  unregister(socket) {
    var player = this.sockets[socket.id];
    var index = this.pending.indexOf(player);
    var playerArray = null;

    if (index > -1) {
      playerArray = this.pending;
    } else {
      index = this.playing.indexOf(player);

      if (index >= 0)
        playerArray = this.playing;
    }

    if (playerArray) {
      player.socket.broadcast.emit('player_remove', player.getInfo());
      playerArray.splice(index, 1); // remove player from pending or playing array
      delete this.sockets[socket.id];

      // console.log(
      //   '[ServerPlayerManager][disconnect] Player ' + socket.id + ' disconnected.\n' +
      //   'this.pending: ' + this.pending.map((c) => c.socket.id) + '\n' +
      //   'this.playing: ' + this.playing.map((c) => c.socket.id)
      // );
    }

    return player;
  }

  playerReady(player) {
    var index = this.pending.indexOf(player);

    if (index > -1) {
      this.pending.splice(index, 1);
      this.playing.push(player);

      var playerList = this.playing.map((c) => c.getInfo());
      player.socket.emit('players_init', playerList);
      player.socket.broadcast.emit('player_add', player.getInfo());

      player.socket.leave('setup');
      player.socket.join('performance');
    }

    // console.log(
    //   '[ServerPlayerManager][playerReady] Player ' + player.socket.id + ' playing.\n' +
    //   'this.pending: ' + this.pending.map((c) => c.socket.id) + '\n' +
    //   'this.playing: ' + this.playing.map((c) => c.socket.id)
    // );
  }
}

module.exports = ServerPlayerManager;