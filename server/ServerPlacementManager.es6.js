var EventEmitter = require('events').EventEmitter;

'use strict';

class ServerPlacementManager extends EventEmitter {
  constructor(topoModel) {
    this.__topoModel = topoModel;
    this.__availablePlaces = []; // Indices of topoModel .__positions and .__labels arrays.

    for (let i = 0; i < this.__topoModel.__labels.length; i++)
      this.__availablePlaces.push(i);
  }

  requestPlace(client) {
    if (this.__availablePlaces.length > 0) {
      var place = this.__availablePlaces.splice(0, 1)[0];
      client.place = place;
      client.position = this.__topoModel.__positions[place];
    }

    this.emit('placement_ready', client);
  }

  releasePlace(client) {
    var place = client.place;

    if (place !== null) {
      this.__availablePlaces.push(place);
      client.place = null;
      client.position = null;
    }
  }
}

module.exports = ServerPlacementManager;