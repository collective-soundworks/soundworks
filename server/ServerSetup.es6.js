/**
 * @fileoverview Matrix server side setup manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;

class ServerSetup extends EventEmitter {
  constructor() {

  }

  connect(socket, client) {

  }

  disconnect(socket, client) {

  }
}

module.exports = ServerSetup;