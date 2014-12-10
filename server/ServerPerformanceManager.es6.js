/**
 * @fileoverview Matrix server side peformance manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
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
}

module.exports = ServerPerformanceManager;