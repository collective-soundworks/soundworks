/**
 * @fileoverview Matrix server side player class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var Client = require('./ServerClient');

class Player extends Client {
	constructor(socket, place = null, position = null) {
    super(socket);

    this.place = place;

    this.privateState = {};
    this.publicState = {};
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