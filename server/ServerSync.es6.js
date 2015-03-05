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
    
    this.sync = new Sync(() => {
      let time = process.hrtime();
      return time[0] + time[1] * 1e-9;
    });
  }

  connect(client) {
    super.connect();
    this.sync.start((cmd, ...args) => client.send(cmd, ...args), (cmd, callback) => client.receive(cmd, callback));
  }

  getLocalTime(syncTime) {
    return this.sync.getLocalTime(syncTime);
  }

  getSyncTime(localTime) {
    return this.sync.getSyncTime(localTime);
  }
}

module.exports = ServerSync;