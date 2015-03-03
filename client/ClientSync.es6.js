/**
 * @fileoverview Soundworks client side time syncronization module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var Sync = require('sync/client');
var client = require('./client');

class ClientSync extends ClientModule {
  constructor(options = {}) {
    super('sync', true, options.color || 'black');

    this.sync = new Sync();

    this.setViewText('Clock syncing, stand by…', 'soft-blink');
  }

  start() {
    super.start();

    var ready = false;

    this.sync.start(client.socket, (stats) => {
      if (!ready) {
        ready = true;
        this.done();
      }
    });
  }

  getLocalTime(serverTime) {
    return this.sync.getLocalTime(serverTime);
  }

  getServerTime(localTime) {
    return this.sync.getServerTime(localTime);
  }
}

module.exports = ClientSync;