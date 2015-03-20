/**
 * @fileoverview Soundworks server side check-in module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');

var maxRandomPlayers = 10000;

class ServerCheckin extends ServerModule {
  constructor(options = {}) {
    super();

    this.setup = options.setup || null;
    this.maxPlayers = options.maxPlayers || 10000;

    if (this.setup) {
      var numPlaces = this.setup.getNumPlaces();

      if (this.maxPlayers > numPlaces)
        this.maxPlayers = numPlaces;
    }

    if (this.maxPlayers > Number.MAX_SAFE_INTEGER)
      this.maxPlayers = Number.MAX_SAFE_INTEGER;

    this._availableIndices = [];
    this._nextAscendingIndex = 0;

    if (this.maxPlayers <= maxRandomPlayers) {
      for (let i = 0; i < this.maxPlayers; i++)
        this._availableIndices.push(i);
    }
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

  _getRandomIndex() {
    var numAvailable = this._availableIndices.length;

    if (numAvailable > 0) {
      let random = Math.floor(Math.random() * numAvailable); // pick randomly an available index
      return this._availableIndices.splice(random, 1)[0];
    }

    return -1;
  }

  _getAscendingIndex() {
    if (this._availableIndices.length > 0) {
      this._availableIndices.sort(function(a, b) {
        return a - b;
      });

      return this._availableIndices.splice(0, 1)[0];
    } else if (this._nextAscendingIndex < this.maxPlayers) {
      return this._nextAscendingIndex++;
    }

    return -1;
  }

  _releaseIndex(index) {
    this._availableIndices.push(index);
  }

  _requestSelectAutomatic(client, order) {
    var index = -1;

    if (this.maxPlayers > maxRandomPlayers)
      order = 'ascending';

    if (order === 'random')
      index = this._getRandomIndex();
    else // if (order === 'acsending')
      index = this._getAscendingIndex();

    if (index >= 0) {
      client.player.index = index;

      var label = null;

      if (this.setup)
        label = this.setup.getLabel(index);

      client.send('checkin:automatic:acknowledge', index, label);
    } else {
      client.send('checkin:automatic:unavailable');      
    }
  }

  _requestSelectLabel(client) {
    // var options = this.setup.getOptions();
    // client.send('checkin:label:options', options);
    // client.receive('checkin:label:set', this.label);
    // client.send('checkin:label:acknowledge', index);
  }

  _requestSelectPosition(client) {
    // var surface = this.setup.getSurface();
    // client.send('checkin:position:acknowledge', index, surface);
    // client.receive('checkin:position:set', this.position);
  }
}

module.exports = ServerCheckin;