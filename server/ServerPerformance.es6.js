/**
 * @fileoverview Soundworks server side performance base class module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');

class ServerPerformance extends ServerModule {
  constructor(options = {}) {
    super(options.name || 'performance');

    this.clients = [];
  }

  connect(client) {
    super.connect(client);

    client.receive('performance:start', () => {
      this.enter(client);
    });

    client.receive('performance:done', () => {
      this.exit(client);
    });
  }

  disconnect(client) {
    super.disconnect(client);

    if (client.modules.performance.entered)
      this.exit(client);
  }

  enter(client) {
    this.clients.push(client);
    client.modules.performance.entered = true;
  }

  exit(client) {
    let index = this.clients.indexOf(client);

    client.modules.performance.entered = false;

    if (index >= 0)
      this.clients.splice(index, 1);
  }
}

module.exports = ServerPerformance;