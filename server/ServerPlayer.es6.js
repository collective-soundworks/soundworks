'use strict';

class Player {
	constructor(socket, place = null, position = null) {
    this.place = place;
    this.position = position;
    this.socket = socket;
    this.userData = {};
    this.__userData = {};
  }

  getInfo() {
    var playerInfo = {
      place: this.place,
      position: this.position,
      socket: {
        id: this.socket.id
      },
      userData: this.userData
    };
    
    return playerInfo;
  }
}
  

module.exports = Player;