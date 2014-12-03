'use strict';

class Player {
	constructor(socket, place = null, position = null) {
    // Topology
    this.place = place;
    this.position = position;
    // States
    this.privateState = {};
    this.publicState = {};
    // Connection
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