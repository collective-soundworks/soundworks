'use strict';

var ServerPlacementManager = require('./ServerPlacementManager');

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

class ServerPlacementManagerAssignedPlaces extends ServerPlacementManager {
  constructor(params) {
    super();

    this.topologyManager = null;
    this.labels = null;
    this.order = 'random';
    this.availablePlaces = [];

    if (params) {
      var topologyManager = params.topology;

      if (topologyManager) {
        this.topologyManager = topologyManager;

        topologyManager.on('topology_init', () => {
          var maxPlaces = topologyManager.getMaxPlaces();

          for (let i = 0; i < maxPlaces; i++)
            this.availablePlaces.push(i);
        });
      } else {
        var maxPlaces = params.maxPlaces || 99;

        for (let i = 0; i < maxPlaces; i++)
          this.availablePlaces.push(i);
      }

      this.order = params.order;
    }
  }

  requestPlace(player) {
    var socket = player.socket;
    var place = null;

    switch (this.order) {
      case 'random':
        if (this.availablePlaces.length > 0) {
          // pick randomly an available place
          let index = getRandomInt(0, this.availablePlaces.length - 1);
          place = this.availablePlaces.splice(index, 1)[0];
        }

        break;

      case 'ascending':
        if (this.availablePlaces.length > 0) {
          this.availablePlaces.sort(function(a, b) {
            return a - b;
          });
          place = this.availablePlaces.splice(0, 1)[0];
        }

        break;
    }

    if (place !== null) {
      player.place = place;

      var label;

      if(this.topologyManager)
        label = this.topologyManager.getLabel(place);
      else 
        label = (place + 1).toString();

      // send to player
      socket.emit('place_available', {
        "place": place,
        "label": label
      });

      // wait for client answering
      socket.on('placement_ready', () => {
        this.emit('placement_ready', player);
      });
    } else {
      socket.emit('no_place_available');
    }
  }

  releasePlace(player) {
    this.availablePlaces.push(player.place);
    player.place = null;
  }
}

module.exports = ServerPlacementManagerAssignedPlaces;