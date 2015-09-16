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

    client.receive(this.name + ':start', () => {
      this.enter(client);
    });

    client.receive(this.name + ':done', () => {
      this.exit(client);
    });
  }

  disconnect(client) {
    super.disconnect(client);

    if (client.modules[this.name].entered)
      this.exit(client);
  }

  enter(client) {
    this.clients.push(client);
    client.modules[this.name].entered = true;
  }

  exit(client) {
    let index = this.clients.indexOf(client);

    client.modules[this.name].entered = false;

    if (index >= 0)
      this.clients.splice(index, 1);
  }
}

module.exports = ServerPerformance;
