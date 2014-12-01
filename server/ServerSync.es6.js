'use strict';

class ServerSync {
	constructor() {
    this.__pingLimit = 10;
    this.__serverStartTime = Date.now() / 1000;
  }

  pingRequest(socket) {
    socket.emit('ping_request');
  }

  setPingLimit(n) {
    this.__pingLimit = n;
  }

  startInitialSyncWithClient(socket) {
    socket.emit('init_sync', {
      pingLimit: this.__pingLimit,
      serverStartTime: this.__serverStartTime
    });

    this.startSyncWithClient(socket);
  }

  startSyncWithClient(socket) {
    this.pingRequest(socket);

    socket.on('ping', (pingTime_clientTime) => {
      var pongTime_serverTime = Date.now() / 1000;
      socket.emit('pong', {
        pingTime_clientTime: pingTime_clientTime,
        pongTime_serverTime: pongTime_serverTime
      });
    });
  }

}

module.exports = new ServerSync();