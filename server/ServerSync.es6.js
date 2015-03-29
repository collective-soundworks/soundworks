/**
 * @fileoverview Soundworks server side time synchronization module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');
var Sync = require('sync/server');

class ServerSync extends ServerModule {
  constructor(options = {}) {
    super(options.name || 'sync');
    
    this.sync = new Sync(() => {
      let time = process.hrtime();
      return time[0] + time[1] * 1e-9;
    });
  }

  connect(client) {
    super.connect(client);
    this.sync.start((cmd, ...args) => client.send(cmd, ...args), (cmd, callback) => client.receive(cmd, callback));
  }

  getSyncTime() {
    return this.sync.getSyncTime();
  }
}

module.exports = ServerSync;