/**
 * @fileoverview Soundworks server side time synchronization module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');
var Sync = require('sync/server');

class ServerSync extends ServerModule {
  constructor(params = {}) {
    super();
    this.sync = new Sync(params);
  }

  connect(client) {
    this.sync.start(client.socket, (stats) => {
      client.privateState.pingLatency = stats.maxTravelTime / 2;
    });
  }
}

module.exports = ServerSync;