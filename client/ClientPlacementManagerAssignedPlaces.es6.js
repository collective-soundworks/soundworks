var ClientPlacementManager = require('./ClientPlacementManager');

'use strict';

class ClientPlacementManagerAssignedPlaces extends ClientPlacementManager {
  constructor() {
    super();

    socket.on('place_available', this.updateInstructions.bind(this));
    socket.on('no_place_available', this.updateInstructions.bind(this))
  }

  updateInstructions(placeInfo = null) {
    if (placeInfo) {
      this.__place = placeInfo.place;
      this.__position = placeInfo.position;
      this.__label = placeInfo.label;

      this.__placementDiv.innerHTML = "<p>Go to position</p>" + 
        "<div class='position circle'><span>" + this.__label + "</span></div>" +
        "<p class='small'>Touch the screen<br/>when you are ready.</p>";

      this.__placementDiv.addEventListener('click', this.clientReady.bind(this));
    } else {
      this.__placementDiv.innerHTML = "<p>All seats are taken, please try again later! =)</p>";
    }
  }

}

module.exports = ClientPlacementManagerAssignedPlaces;