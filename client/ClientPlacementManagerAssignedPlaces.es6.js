'use strict';

var ClientPlacementManager = require('./ClientPlacementManager');
var ioClient = require('./ioClient');

class ClientPlacementManagerAssignedPlaces extends ClientPlacementManager {
  constructor(params) {
    super();

    this.showDialog = (params && params.dialog);

    var socket = ioClient.socket;

    socket.on('place_available', (placeInfo) => {
      this.place = placeInfo.place;
      this.label = placeInfo.label;
    });

    socket.on('no_place_available', () => {
      this.parentDiv.innerHTML = "<p>All seats are taken, please try again later! =)</p>";
    });
  }

  start() {
    if (this.showDialog) {
      this.parentDiv.innerHTML = "<p>Go to position</p>" +
        "<div class='position circle'><span>" + this.label + "</span></div>" +
        "<p class='small'>Touch the screen<br/>when you are ready.</p>";

      this.parentDiv.addEventListener('click', () => {
        this.parentDiv.classList.add('hidden');
        this.ready();
      });

      this.parentDiv.classList.remove('hidden');
    } else {
      this.ready();
    }
  }
}

module.exports = ClientPlacementManagerAssignedPlaces;