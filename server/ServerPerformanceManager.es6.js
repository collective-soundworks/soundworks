'use strict';

class ServerPerformanceManager {
  constructor(clientManager, topologyManager) {
    this.__clientManager = clientManager;
    this.__topologyManager = topologyManager;
  }

  addParticipant(client) {
    this.inputListener(client.socket);
  }

  inputListener(socket) {

  }

  removeParticipant(client) {

  }
}

module.exports = ServerPerformanceManager;