/**
 * @fileoverview Soundworks server side client class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

class ServerClient {
	constructor(socket) {
    this.socket = socket;
    this.index = null;
    this.data = {};
  }
}

module.exports = ServerClient;