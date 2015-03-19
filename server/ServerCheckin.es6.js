/**
 * @fileoverview Soundworks server side check-in module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');

var defaultSurface = {
  width: 10, // meters
  height: 10, // meters
  spacing: 1 // meters
};

class ServerCheckin extends ServerModule {
  constructor(options = {}) {
    super();

    this.maxPlayers = options.maxPlayers || 10000;

    var setup = options.setup || null;

    if (setup) {
      this.surface = setup.surface || defaultSurface;
      this.labels = setup.labels;
      this.positions = setup.positions;

      if (setup.labels) {
        if (this.maxPlayers > setup.labels.length)
          this.maxPlayers = setup.labels.length;

        if (this.maxPlayers > setup.positions.length)
          this.maxPlayers = setup.positions.length;
      }
    }

    if (this.maxPlayers > Number.MAX_SAFE_INTEGER)
      this.maxPlayers = Number.MAX_SAFE_INTEGER;

    this.__availableIndices = [];

    for (let i = 0; i < this.maxPlayers; i++)
      this.__availableIndices.push(i);
  }

  connect(client) {
    super.connect(client);

    client.player = {};

    client.receive('checkin:automatic:request', (order) => {
      this._requestSelectAutomatic(client, order);
    });

    client.receive('checkin:label:request', () => {
      this._requestSelectLabel(client);
    });

    client.receive('checkin:position:request', () => {
      this._requestSelectPosition(client);
    });
  }

  disconnect(client) {
    if (client.player) {
      this._releaseIndex(client.player.index);
      delete client.player;
      super.disconnect();
    }
  }

  _getIndex(order) {
    if (this.__availableIndices.length > 0) {
      if (order === 'random') {
        let random = Math.floor(Math.random() * this.__availableIndices.length); // pick randomly an available index

        return this.__availableIndices.splice(random, 1)[0];
      } else {
        this.__availableIndices.sort(function(a, b) {
          return a - b;
        });

        return this.__availableIndices.splice(0, 1)[0];
      }
    }

    return undefined;
  }

  _releaseIndex(index) {
    this.__availableIndices.push(index);
  }

  _requestSelectAutomatic(client, order) {
    var index = this._getIndex(order);

    if (index !== null) {
      client.player.index = index;

      var label = null;

      if (this.labels)
        label = this.labels(index);

      client.send('checkin:automatic:acknowledge', index, label);
    }
  }

  _requestSelectLabel(client) {
    // client.send('checkin:label:options', options);
    // client.receive('checkin:label:set', this.label);
    // client.send('checkin:label:acknowledge', index);
  }

  _connectSelectPosition(client) {
    // client.send('checkin:position:acknowledge', index, surface);
    // client.receive('checkin:position:set', this.position);
  }
}

module.exports = ServerCheckin;