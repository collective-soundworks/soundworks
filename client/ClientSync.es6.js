/**
 * @fileoverview Soundworks client side time syncronization module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var Sync = require('sync/client');
var client = require('./client');
var audioContext = require('waves-audio').audioContext;

class ClientSync extends ClientModule {
  constructor(options = {}) {
    super('sync', true, options.color || 'black');

    this.ready = false;

    this.sync = new Sync(() => audioContext.currentTime);

    this.setCenteredViewContent('<p class="soft-blink">Clock syncing, stand by…</p>');
  }

  start() {
    super.start();

    this.sync.start(client.send, client.receive);
    this.sync.on('sync:stats', (stats) => {
      if (!this.ready) {
        this.ready = true;
        this.done();
      }
      this.emit('sync:stats', stats);
    });
  }

  getLocalTime(syncTime) {
    return this.sync.getLocalTime(syncTime);
  }

  getSyncTime(localTime) {
    return this.sync.getSyncTime(localTime);
  }
}

module.exports = ClientSync;