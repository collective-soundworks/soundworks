/**
 * @fileoverview Soundworks server side check-in module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');

var maxRandomClients = 9999;

class ServerCheckin extends ServerModule {
  constructor(options = {}) {
    super(options.name || 'checkin');

    this.setup = options.setup || null;
    this.maxClients = options.maxClients || Infinity;
    this.order = options.order || 'ascending'; // 'ascending' | 'random'

    if (this.maxClients > Number.MAX_SAFE_INTEGER)
      this.maxClients = Number.MAX_SAFE_INTEGER;

    if (this.setup) {
      var numPlaces = this.setup.getNumPositions();

      if (this.maxClients > numPlaces && numPlaces > 0)
        this.maxClients = numPlaces;
    }

    this._availableIndices = [];
    this._nextAscendingIndex = 0;

    if (this.maxClients > maxRandomClients)
      order = 'ascending';
    else if (this.order === 'random') {
      this._nextAscendingIndex = this.maxClients;

      for (let i = 0; i < this.maxClients; i++)
        this._availableIndices.push(i);
    }
  }

  _getRandomIndex() {
    var numAvailable = this._availableIndices.length;

    if (numAvailable > 0) {
      let random = Math.floor(Math.random() * numAvailable);
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
    } else if (this._nextAscendingIndex < this.maxClients) {
      return this._nextAscendingIndex++;
    }

    return -1;
  }

  _releaseIndex(index) {
    this._availableIndices.push(index);
  }

  connect(client) {
    super.connect(client);

    client.receive('checkin:request', () => {
      var index = -1;
      var order = this.order;

      if (this.order === 'random')
        index = this._getRandomIndex();
      else // if (order === 'acsending')
        index = this._getAscendingIndex();

      if (index >= 0) {
        client.modules.checkin.index = index;

        var label = null;
        var coordinates = null;

        if (this.setup) {
          label = this.setup.getLabel(index);
          coordinates = this.setup.getCoordinates(index);
        }

        client.modules.checkin.label = label;
        client.coordinates = coordinates;

        client.send('checkin:acknowledge', index, label, coordinates);
      } else {
        client.send('checkin:unavailable');
      }
    });

    client.receive('checkin:restart', (index, label, coordinates) => {
      // TODO: check if that's ok on random mode
      if (index > this._nextAscendingIndex) {
        for (let i = this._nextAscendingIndex; i < index; i++)
          this._availableIndices.push(i);

        this._nextAscendingIndex = index + 1;
      } else if (index === this._nextAscendingIndex) {
        this._nextAscendingIndex++;
      } else {
        let i = this._availableIndices.indexOf(index);

        if (i > -1)
          this._availableIndices.splice(i, 1);
      }

      client.modules.checkin.index = index;

      if (this.setup) {
        client.modules.checkin.label = label;
        client.coordinates = coordinates;
      }
    })
  }

  disconnect(client) {
    super.disconnect(client);

    var index = client.modules.checkin.index;

    if (index >= 0)
      this._releaseIndex(index);
  }
}

module.exports = ServerCheckin;