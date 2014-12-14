/**
 * @fileoverview Matrix server side peformance manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ioServer = require('./ioServer');

class ServerPerformance {
  constructor() {
    this.__manager = null;
  }

  set manager(manager) {
    this.__manager = manager;
  }

  get manager() {
    return this.__manager;
  }
  
  connect(socket, player) {

  }

  disconnect(socket, player) {

  }
}

module.exports = ServerPerformance;