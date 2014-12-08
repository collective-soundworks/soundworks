'use strict';

var ServerPlacementManager = require('./ServerPlacementManager');

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

class ServerPlacementManagerAssignedPlaces extends ServerPlacementManager {
  constructor(topologyManager) {
    super(topologyManager);
  }

  requestPlace(player) {
    var socket = player.socket;

    if (this.availablePlaces.length > 0) {
      // Get place and position
      var index = getRandomInt(0, this.availablePlaces.length - 1);
      var place = this.availablePlaces.splice(index, 1)[0]; // TODO: handle different assignment methods (here, random)
      var label = this.topologyManager.getLabel(place);

      player.place = place;

      // Send to player
      socket.emit('place_available', {
        "place": place,
        "label": label
      });

      // Wait for callback
      socket.on('placement_ready', () => {
        this.emit('placement_ready', player);
      });
    } else {
      socket.emit('no_place_available');
    }
  }
}

module.exports = ServerPlacementManagerAssignedPlaces;