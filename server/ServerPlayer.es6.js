/**
 * @fileoverview Matrix server side player class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

class Player {
	constructor(socket, place = null, position = null) {
    this.place = place;

    this.privateState = {};
    this.publicState = {};

    this.socket = socket;
    this.pingLatency = 0;
  }

  getInfo() {
    var playerInfo = {
      place: this.place,
      position: this.position,
      socketId: this.socket.id,
      state: this.publicState
    };
    
    return playerInfo;
  }
}
  

module.exports = Player;