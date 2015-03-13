/**
 * @fileoverview Soundworks server side performance base class module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');

function arrayRemove(array, value) {
  let index = array.indexOf(value);
  if (index >= 0)
    array.splice(index, 1);
}

class ServerPerformance extends ServerModule {
  constructor() {
    super();

    this.players = [];
  }

  connect(client) {
    super.connect(client);

    client.receive('performance:start', () => {
      this.addPlayer(client);
    });

    client.receive('performance:done', () => {
      this.removePlayer(client);
    });
  }

  disconnect(client) {
    this.removePlayer(client);

    super.disconnect(client);
  }

  addPlayer(client) {
    this.players.push(client);
  }

  removePlayer(client) {
    let index = this.players.indexOf(value);
    if (index >= 0)
      this.players.splice(index, 1);
  }
}

module.exports = ServerPerformance;