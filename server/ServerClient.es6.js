/**
 * @fileoverview Soundworks server side client class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

class ServerClient {
	constructor(clientType, socket) {
    this.type = clientType;
    this.index = -1;
    this.coordinates = null;

    this.modules = {};
    this.socket = socket;
  }

  send(msg, ...args) {
    this.socket.emit(msg, ...args);
  }

  receive(msg, callback) {
    this.socket.on(msg, callback);
  }

  broadcast(msg, ...args) {
    this.socket.broadcast.emit(msg, ...args);
  }
}

module.exports = ServerClient;