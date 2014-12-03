var EventEmitter = require('events').EventEmitter;

"use strict";

class ServerSyncManager extends EventEmitter {
  constructor(iterations = 10) {
    this.__iterations = iterations;
  }

  listen(player) {
    var socket = player.socket;

    socket.on('sync_ping', (id, pingTime_clientTime) => {
      // console.log('ping', id, pingTime_clientTime);
      var pongTime_serverTime = Date.now() / 1000;
      socket.emit('sync_pong', id, pingTime_clientTime, pongTime_serverTime);
    });

    socket.on('sync_stats', (maxTravelTime, avgTravelTime, avgTimeOffset) => {
      var ready = (player.pingLatency === 0);

      player.pingLatency = maxTravelTime / 2;

      if (ready)
        this.emit('sync_ready');
    });


  }

  startSync(player) {
    var socket = player.socket;
    socket.emit('start_sync');
    this.listen(player);
  }
}

module.exports = ServerSyncManager;