var EventEmitter = require('events').EventEmitter;

"use strict";

class ServerSyncManager extends EventEmitter {
  constructor(iterations = 10) {
    this.__iterations = iterations;
  }

  initSync(player) {
    var socket = player.socket;
    socket.emit('init_sync');
    this.listen(player);
  }

  listen(player) {
    var socket = player.socket;

    socket.on('sync_ping', (id, pingTime_clientTime) => {
      // console.log('ping', id, pingTime_clientTime);
      var pongTime_serverTime = Date.now() / 1000;
      socket.emit('sync_pong', id, pingTime_clientTime, pongTime_serverTime);
    });

    socket.on('sync_stats', (maxTravelTime, avgTravelTime, avgTimeOffset) => {
      var firstSync = (player.pingLatency === 0);

      player.pingLatency = maxTravelTime / 2;

      //  Send 'sync_ready' event after the first sync process only
      if (firstSync)
        this.emit('sync_ready', player);
    });

  }

  startSync(player) {
    var socket = player.socket;
    socket.emit('start_sync');
    this.listen(player);
  }
}

module.exports = ServerSyncManager;