/**
 * @fileoverview Soundworks client side performance base class module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');

class ClientPerformance extends ClientModule {
  constructor(options = {}) {
    super('performance', true, options.color || 'black');
  }

  start() {
    super.start();

    client.send('performance:start');
  }

  done() {
    client.send('performance:done');

    super.done();
  }
}

module.exports = ClientPerformance;