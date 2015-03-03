/**
 * @fileoverview Soundworks client side time syncronization module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

const debug = require('debug')('soundworks:client:sync');

var ClientModule = require('./ClientModule');
var Sync = require('sync/client');
var client = require('./client');

class ClientSync extends ClientModule {
  constructor(options = {}) {
    super('sync', true);

    this.sync = new Sync();

    if (this.view) {
      var contentDiv = document.createElement('div');
      contentDiv.classList.add('centered-content');
      this.view.appendChild(contentDiv);

      contentDiv.innerHTML = "<p>Clock syncing, stand by…</p>";
    }
  }

  start() {
    super.start();

    debug('start');
    this.sync.start(client.socket);
    debug('started');
    
    let ready = false;
    if (!ready) {
      ready = true;
      debug('ready');
      this.done();
    }
    
  }

  getLocalTime(masterTime) {
    return this.sync.getLocalTime(masterTime);
  }

  getMasterTime(localTime) {
    return this.sync.getMasterTime(localTime);
  }
}

module.exports = ClientSync;
