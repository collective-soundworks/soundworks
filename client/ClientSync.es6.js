/**
 * @fileoverview Soundworks client side time syncronization module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var Sync = require('sync/client');
var client = require('./client');

class ClientSync extends ClientModule {
  constructor(params = {}) {
    super('sync', true);

    this.sync = new Sync();

    if (this.displayDiv) {
      this.displayDiv.style.zIndex = -10;
      this.displayDiv.innerHTML = "<p>Please stand by while synchronizing clock...</p>";
    }
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
    return this.sync.getLocalTime(localTime);
  }
}

module.exports = ClientSync;