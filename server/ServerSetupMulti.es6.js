/**
 * @fileoverview Matrix server side setup manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerSetup = require('./ServerSetup');

class ServerSetupMulti extends ServerSetup {
  constructor(setupArray) {
    this.setupArray = setupArray;
  }

  connect(socket, player) {
    for (let setup of this.setupArray)
      setup.connect(socket, player);
  }

  disconnect(socket, player) {
    for (let setup of this.setupArray)
      setup.disconnect(socket, player);
  }
}

module.exports = ServerSetupMulti;