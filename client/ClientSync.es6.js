/**
 * @fileoverview Soundworks client side time syncronization module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var Sync = require('sync/client');
var client = require('./client');
var audioContext = require('audio-context');

class ClientSync extends ClientModule {
  constructor(options = {}) {
    super('sync', true, options.color || 'black');

    this.sync = new Sync(
      () => audioContext.currentTime, (cmd, ...args) => {
        client.send(cmd, ...args);
      }, (cmd, callback) => {
        client.receive(cmd, callback);
      });

    this.setViewText('Clock syncing, stand by…', 'soft-blink');
  }

  start() {
    super.start();

    this.sync.start(client.socket);
    
    let ready = false;
    if (!ready) {
      ready = true;
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
