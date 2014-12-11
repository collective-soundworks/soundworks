/**
 * @fileoverview Matrix server side soloist manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

class ServerSoloistManager {
  constructor() {
    this.playerManager = null;
  }

  init(playerManger) {
    this.playerManager = playerManger;
  }

  addPlayer(player) {
    
  }

  removePlayer(player) {
    
  }

}

module.exports = ServerSoloistManager;