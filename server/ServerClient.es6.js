/**
 * @fileoverview Soundworks server side client class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

const log = require('./logger');

class ServerClient {
	constructor(clientType, socket) {
    this.type = clientType;
    this.index = -1;
    this.coordinates = null;

    this.modules = {};
    this.socket = socket;
  }

  send(msg, ...args) {
    log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.send');
    this.socket.emit(msg, ...args);
  }

  sendVolatile(msg, ...args) {
    log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.sendVolatile');
    this.socket.volatile.emit(msg, ...args);
  }

  receive(msg, callback) {
    var _callback = (function(...args) {
      log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.receive');
      callback.apply(this.socket, args);
    }).bind(this);

    this.socket.on(msg, _callback);
  }

  broadcast(msg, ...args) {
    log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.broadcast');
    this.socket.broadcast.emit(msg, ...args);
  }
}

module.exports = ServerClient;