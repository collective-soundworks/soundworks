/**
 * @fileoverview Soundworks client side performance base class module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');

class ClientPerformance extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'performance', true, options.color || 'black');
  }

  start() {
    super.start();
    client.send(this.name + ':start');
  }

  done() {
    client.send(this.name + ':done');
    super.done();
  }
}

module.exports = ClientPerformance;