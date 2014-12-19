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

    super('/play', setup, performance, topology);
  }

  connect(socket) {
    socket.join('settingup');

    var player = this.__registerPlayer(socket);

    if (this.topology)
      this.topology.connect(socket, player);

    if (this.setup)
      this.setup.connect(socket, player);

    return player;
  }

  ready(socket, player) {
    socket.leave('settingup');

    if (this.__promotePlayer(player)) {
      socket.join('performing');
      this.performance.connect(socket, player);
    }
  }

  disconnect(socket, player) {
    this.__unregisterPlayer(socket, player);

    if (this.setup)
      this.setup.disconnect(socket, player);

    this.performance.disconnect(socket, player);
  }

  __registerPlayer(socket) {
    var player = new Player(socket);

    this.pending.push(player);

    return player;
  }

  __promotePlayer(player) {
    var io = ioServer.io;
    var index = this.pending.indexOf(player);

    if (index > -1) {
      var socket = player.socket;

      this.pending.splice(index, 1);
      this.playing.push(player);

      var playerList = this.playing.map((c) => c.getInfo());
      socket.emit('players_init', playerList);
      socket.emit('player_add', player.getInfo()); // ('/play' namespace)
      io.of('/env').emit('player_add', player.getInfo()); // TODO: generalize with list of namespaces Object.keys(io.nsps)

      return true;
    }

    return false;
  }

  __unregisterPlayer(socket, player) {
    var io = ioServer.io;
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
      socket.broadcast.emit('player_remove', player.getInfo()); // ('/play' namespace)
      io.of('/env').emit('player_remove', player.getInfo()); // TODO: generalize with list of namespaces Object.keys(io.nsps)

      playerArray.splice(index, 1); // remove player from pending or playing array
    }
  }
}

// Logging boilerplate
// -------------------
// console.log(
//   '[ServerPlayerManager][method name] Player ' + socket.id + ' disconnected.\n' +
//   'this.pending: ' + this.pending.map((c) => c.socket.id) + '\n' +
//   'this.playing: ' + this.playing.map((c) => c.socket.id)
// );

module.exports = ServerPlayerManager;