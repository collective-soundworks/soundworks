/**
 * @fileoverview Matrix server side placement manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerSetup = require('./ServerSetup');

class ServerSetupPlacement extends ServerSetup {
  constructor() {
    super();
  }
}

module.exports = ServerSetupPlacement;