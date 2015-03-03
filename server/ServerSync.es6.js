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
    debug('new sync');
  }

  connect(client) {
    super.connect();

    this.sync.start(client.socket);
    debug('started');
  }

  getLocalTime(masterTime) {
    return this.sync.getLocalTime(masterTime);
  }

  getMasterTime(localTime) {
    return this.sync.getMasterTime(localTime);
  }

} // class ServerSync

module.exports = ServerSync;
