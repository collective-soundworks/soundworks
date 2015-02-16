/**
 * @fileoverview Matrix server side setup manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;

class ServerModule extends EventEmitter {
  constructor() {
    super();

  }

  connect(client) {

  }

  disconnect(client) {

  }
}

module.exports = ServerModule;