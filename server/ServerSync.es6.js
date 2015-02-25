/**
 * @fileoverview Soundworks server side time synchronization module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');
var Sync = require('sync/server');

class ServerSync extends ServerModule {
  constructor(options = {}) {
    super();
    this.sync = new Sync(options);
  }

  connect(client) {
    client.data.sync = {};

    this.sync.start(client.socket, (stats) => {
      client.data.sync.latency = stats.maxTravelTime / 2;
    });
  }
}

module.exports = ServerSync;