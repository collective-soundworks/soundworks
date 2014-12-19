/**
 * @fileoverview Matrix server side player class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

class Client {
	constructor(socket) {
    this.socket = socket;
    this.pingLatency = 0;
  }

  getInfo() {
    var clientInfo = {
      socketId: this.socket.id
    };
    
    return clientInfo;
  }
}
  

module.exports = Client;