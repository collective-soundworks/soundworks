/**
 * @fileoverview Matrix server side synchronization manager
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');

class ServerSync extends ServerModule {
  constructor(namespaces) {
    super(namespaces);
  }

  connect(client) {
    var socket = client.socket;

    socket.on('sync_ping', (id, pingTime_clientTime) => {
      var pongTime_serverTime = Date.now() / 1000;
      socket.emit('sync_pong', id, pingTime_clientTime, pongTime_serverTime);
    });

    socket.on('sync_stats', (minTravelTime, maxTravelTime, avgTravelTime, avgTimeOffset) => {
      client.privateState.pingLatency = maxTravelTime / 2;
    });
  }

  disconnect(client) {
    
  }
}

module.exports = ServerSync;