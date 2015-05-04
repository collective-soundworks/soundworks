/**
 * @fileoverview Soundworks client side performance base class module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');

class ClientPerformance extends ClientModule {
  constructor(name = 'performance', master = true, viewColor = 'black') {
    super(name, true, viewColor);

    this.master = master;
  }

  start() {
    super.start();

    if(this.master)
      client.send('performance:start');
  }

  done() {
    if(this.master)
      client.send('performance:done');

    super.done();
  }
}

module.exports = ClientPerformance;