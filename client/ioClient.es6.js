/**
 * @fileoverview Matrix client side socket i/o (singleton)
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
"use strict";

class SocketIoClient {
  constructor() {
    this.socket = null;
  }

  init(namespace) {
    this.socket = io(namespace);
  }
}

module.exports = new SocketIoClient();