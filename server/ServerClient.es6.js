/**
 * @fileoverview Matrix server side player class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

class ServerClient {
	constructor(socket) {
    this.socket = socket;
    this.index = null;

    this.privateState = {};
    this.publicState = {};
  }

  getInfo() {
    var clientInfo = {
      socketId: this.socket.id,
      index: this.index,
      state: this.publicState
    };
    
    return clientInfo;
  }
}

module.exports = ServerClient;