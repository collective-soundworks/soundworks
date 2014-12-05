'use strict';

class ServerPerformanceManager {
  constructor(topologyManager) {
    this.topologyManager = topologyManager;
    this.playerManager = null;
  }

  init(playerManager) {
  	this.playerManager = playerManager;
  }

  addPlayer(player) {
    
  }

  removePlayer(player) {

  }

  updateTopology(player) {

  }
}

module.exports = ServerPerformanceManager;