/**
 * @fileoverview Soundworks server side performance base class module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');

class ServerPerformance extends ServerModule {
  constructor() {
    super();

    this.players = [];
  }

  connect(client) {
    super.connect(client);

    client.modules.performance = {};

    client.receive('performance:start', () => {
      this.enter(client);
    });

    client.receive('performance:done', () => {
      this.exit(client);
    });
  }

  disconnect(client) {
    super.disconnect(client);

    if (client.modules.performance)
      this.exit(client);
  }

  enter(client) {
    this.players.push(client);
  }

  exit(client) {
    let index = this.players.indexOf(client);

    if (index >= 0)
      this.players.splice(index, 1);
  }
}

module.exports = ServerPerformance;