var ClientPlacementManager = require('./ClientPlacementManager');
var ioClient = require('./ioClient');

'use strict';

class ClientPlacementManagerAssignedPlaces extends ClientPlacementManager {
  constructor() {
    super();

    var socket = ioClient.socket;
    socket.on('place_available', this.updateInstructions.bind(this));
    socket.on('no_place_available', this.updateInstructions.bind(this));
  }

  updateInstructions(placeInfo = null) {
    if (placeInfo) {
      this.place = placeInfo.place;
      this.position = placeInfo.position;
      this.label = placeInfo.label;

      this.parentDiv.innerHTML = "<p>Go to position</p>" + 
        "<div class='position circle'><span>" + this.label + "</span></div>" +
        "<p class='small'>Touch the screen<br/>when you are ready.</p>";

      this.parentDiv.addEventListener('click', this.placementReady.bind(this));
    } else {
      this.parentDiv.innerHTML = "<p>All seats are taken, please try again later! =)</p>";
    }
  }

}

module.exports = ClientPlacementManagerAssignedPlaces;