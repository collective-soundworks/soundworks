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
      this.players.push(client);
    });

    client.receive('performance:done', () => {
      arrayRemove(this.players, client);
    });
  }

  disconnect(client) {
    arrayRemove(this.players, client);

    super.disconnect(client);
  }
}

module.exports = ServerPerformance;