/**
 * @fileoverview Matrix server side player manager
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var Player = require('./ServerPlayer');
var ServerManager = require('./ServerManager');
var ioServer = require('./ioServer');

class ServerPlayerManager extends ServerManager {
  constructor(setup, performance, topology) {
    this.pending = [];
    this.playing = [];
    this.sockets = {};

    super('/play', setup, performance, topology);
  }

  connect(socket) {
    socket.join('setingup');

    var player = this.__registerPlayer(socket);

    if (this.topology)
      this.topology.connect(socket, player);

    if (this.setup)
      this.setup.connect(socket, player);

    // console.log(
    //   '[ServerPlayerManager][connect] Player ' + socket.id + ' connected.\n' +
    //   'this.pending: ' + this.pending.map((c) => c.socket.id) + '\n' +
    //   'this.playing: ' + this.playing.map((c) => c.socket.id)
    // );

    return player;
  }

  ready(socket, player) {
    socket.leave('setingup');

    if (this.__promotePlayer(player)) {
      socket.join('performing');
      this.performance.connect(socket, player);
    }

    // console.log(
    //   '[ServerPlayerManager][ready] Player ' + player.socket.id + ' playing.\n' +
    //   'this.pending: ' + this.pending.map((c) => c.socket.id) + '\n' +
    //   'this.playing: ' + this.playing.map((c) => c.socket.id)
    // );
  }

  disconnect(socket, player) {
    this.__unregisterPlayer(socket, player);

    if (this.setup)
      this.setup.disconnect(socket, player);

    this.performance.disconnect(socket, player);

    // console.log(
    //   '[ServerPlayerManager][disconnect] Player ' + socket.id + ' disconnected.\n' +
    //   'this.pending: ' + this.pending.map((c) => c.socket.id) + '\n' +
    //   'this.playing: ' + this.playing.map((c) => c.socket.id)
    // );
  }

  __registerPlayer(socket) {
    var player = new Player(socket);

    this.pending.push(player);
    this.sockets[socket.id] = player;

    return player;
  }

  __promotePlayer(player) {
    var index = this.pending.indexOf(player);

    if (index > -1) {
      var socket = player.socket;

      this.pending.splice(index, 1);
      this.playing.push(player);

      var playerList = this.playing.map((c) => c.getInfo());
      socket.emit('players_init', playerList);
      socket.broadcast.emit('player_add', player.getInfo());

      return true;
    }

    return false;
  }

  __unregisterPlayer(socket, player) {
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
      socket.broadcast.emit('player_remove', player.getInfo());

      playerArray.splice(index, 1); // remove player from pending or playing array
      delete this.sockets[socket.id];
    }
  }
}

module.exports = ServerPlayerManager;