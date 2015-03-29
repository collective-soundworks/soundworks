/**
 * @fileoverview Soundworks server side check-in module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');

var maxRandomClients = 1000;

class ServerCheckin extends ServerModule {
  constructor(options = {}) {
    super(options.name || 'checkin');

    this.setup = options.setup || null;
    this.maxClients = options.maxClients || Infinity;

    if (this.maxClients > Number.MAX_SAFE_INTEGER)
      this.maxClients = Number.MAX_SAFE_INTEGER;

    if (this.setup) {
      var numPlaces = this.setup.getNumPositions();

      if (this.maxClients > numPlaces)
        this.maxClients = numPlaces;
    }

    this._availableIndices = [];
    this._nextAscendingIndex = 0;

    if (this.maxClients <= maxRandomClients) {
      for (let i = 0; i < this.maxClients; i++)
        this._availableIndices.push(i);
    }
  }

  connect(client) {
    super.connect(client);

    client.receive('checkin:automatic:request', (order) => {
      this._requestSelectAutomatic(client, order);
    });

    client.receive('checkin:label:request', () => {
      this._requestSelectLabel(client);
    });

    client.receive('checkin:location:request', () => {
      this._requestSelectLocation(client);
    });
  }

  disconnect(client) {
    super.disconnect(client);

    if (client.index >= 0)
      this._releaseIndex(client.index);
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
    } else if (this._nextAscendingIndex < this.maxClients) {
      return this._nextAscendingIndex++;
    }

    return -1;
  }

  _releaseIndex(index) {
    this._availableIndices.push(index);
  }

  _requestSelectAutomatic(client, order) {
    var index = -1;

    if (this.maxClients > maxRandomClients)
      order = 'ascending';

    if (order === 'random')
      index = this._getRandomIndex();
    else // if (order === 'acsending')
      index = this._getAscendingIndex();

    if (index >= 0) {
      client.index = index;

      var label = null;
      var coordinates = null;

      if (this.setup) {
        label = this.setup.getLabel(index);
        coordinates = this.setup.getCoordinates(index);
      }

      client.modules.checkin.label = label;
      client.coordinates = coordinates;

      client.send('checkin:automatic:acknowledge', index, label, coordinates);
    } else {
      client.send('checkin:automatic:unavailable');      
    }
  }

  _requestSelectLabel(client) {
    throw new Error("Checkin with label selection not yet implemented");
    // var options = this.setup.getOptions();
    // client.send('checkin:label:options', options);
    // client.receive('checkin:label:set', label);
    // client.send('checkin:label:acknowledge', index);
  }

  _requestSelectLocation(client) {
    throw new Error("Checkin with location selection not yet implemented");
    // var surface = this.setup.getSurface();
    // client.send('checkin:location:acknowledge', index, surface);
    // client.receive('checkin:location:set', coordinates);
  }
}

module.exports = ServerCheckin;