'use strict';

class ServerDynamicModel {
  constructor(clientManager, topologyModel) {
    this.__clientManager = clientManager;
    this.__topologyModel = topologyModel;
  }

  addParticipant(client) {
    this.inputListener(client.socket);
  }

  inputListener(socket) {

  }

  removeParticipant(client) {
    
  }
}

module.exports = ServerDynamicModel;