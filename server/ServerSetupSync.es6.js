/**
 * @fileoverview Matrix server side synchronization manager
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerSetup = require('./ServerSetup');

class ServerSetupSync extends ServerSetup {
  constructor() {

  }

  connect(socket, player) {
    socket.on('sync_ping', (id, pingTime_clientTime) => {
      var pongTime_serverTime = Date.now() / 1000;
      socket.emit('sync_pong', id, pingTime_clientTime, pongTime_serverTime);
    });

    socket.on('sync_stats', (minTravelTime, maxTravelTime, avgTravelTime, avgTimeOffset) => {
      player.pingLatency = maxTravelTime / 2;
    });
  }
}

module.exports = ServerSetupSync;