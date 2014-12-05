var EventEmitter = require('events').EventEmitter;

'use strict';

class ServerPlacementManager extends EventEmitter {
  constructor(topologyManager) {
    this.topologyManager = topologyManager;
    this.availablePlaces = [];
  }

  requestPlace(player) {
    if (this.availablePlaces.length > 0) {
      var place = this.availablePlaces.splice(0, 1)[0];
      player.place = place;
      player.position = this.topologyManager.positions[place];
    }

    this.emit('placement_ready', player);
  }

  releasePlace(player) {
    var place = player.place;

    if (place !== null) {
      this.availablePlaces.push(place);
      player.place = null;
      player.position = null;
    }
  }

  updateTopology() {
    for (let i = 0; i < this.topologyManager.labels.length; i++)
      this.availablePlaces.push(i);
  }
}

module.exports = ServerPlacementManager;