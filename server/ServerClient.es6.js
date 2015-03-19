/**
 * @fileoverview Soundworks server side client class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

class ServerClient {
	constructor(socket) {
    this.socket = socket;
    this.namespace = socket.nsp;
    this.modules = {};
    this.player = null;
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