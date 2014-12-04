var ServerPlacementManager = require('./ServerPlacementManager');

'use strict';

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

class ServerPlacementManagerAssignedPlaces extends ServerPlacementManager {
  constructor(topoModel) {
    super(topoModel);
  }

  requestPlace(player) {
    var socket = player.socket;

    if (this.__availablePlaces.length > 0) {
      // Get place and position
      var index = getRandomInt(0, this.__availablePlaces.length - 1);
      var place = this.__availablePlaces.splice(index, 1)[0]; // TODO: handle different assignment methods (here, random).
      var label = this.__topoModel.getLabel(place);
      var position = this.__topoModel.getPosition(place);

      player.place = place;
      player.position = position;

      console.log("totototototootot")
      console.log(socket.id);

      // Send to player
      socket.emit('place_available', {
        "label": label,
        "place": place,
        "position": position
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