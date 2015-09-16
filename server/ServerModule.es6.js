/**
 * @fileoverview Soundworks server side module base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;

class ServerModule extends EventEmitter {
  constructor(name = 'unnamed') {
    super();

    this.name = name;
  }

  connect(client) {
    client.modules[this.name] = {};
  }

  disconnect(client) {
    // delete client.modules[this.name] // ?
  }
}

module.exports = ServerModule;