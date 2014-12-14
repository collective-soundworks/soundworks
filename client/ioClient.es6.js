/**
 * @fileoverview Matrix client side socket i/o (singleton)
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
"use strict";

class SocketIoClient {
  constructor() {
    this.socket = null;

    this.ready = false;
    this.starter = null;
  }

  init(namespace) {
    var socket = io(namespace);

    socket.on('client_start', () => {
      this.ready = true;

      if(this.starter)
        this.starter();
    });

    this.socket = socket;
  }

  start(starter) {
    this.starter = starter;

    if(this.ready)
      starter();
  }
}

module.exports = new SocketIoClient();