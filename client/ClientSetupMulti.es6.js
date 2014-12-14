/**
 * @fileoverview Matrix client side setup manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var ClientSetup = require('./ClientSetup');
var ioClient = require('./ioClient');

class ClientSetupMulti extends ClientSetup {
  constructor(setupArray = [], params = {}) {
    super(params);

    this.setupArray = setupArray;
    this.doneCount = 0;
  }

  start() {
    var socket = ioClient.socket;
    var foremostDiv = null;

    // start all setups
    for (let i = 0; i < this.setupArray.length; i++) {
      var setup = this.setupArray[i];

      setup.on('done', (setup) => {
        this.doneCount++;

        if (this.doneCount === this.setupArray.length)
          this.done();
      });

      setup.start();
    }
  }
}

module.exports = ClientSetupMulti;