/**
 * @fileoverview Matrix server side placement manager automatically assigning places
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerSetupPlacement = require('./ServerSetupPlacement');

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

class ServerSetupPlacementAssigned extends ServerSetupPlacement {
  constructor(params) {
    super();

    this.topology = params.topology;
    this.order = params.order || 'random';
    this.availablePlaces = [];

    if (this.topology) {
      this.topology.on('topology_init', () => {
        var maxPlaces = this.topology.getMaxPlaces();

        for (let i = 0; i < maxPlaces; i++)
          this.availablePlaces.push(i);
      });
    } else {
      var maxPlaces = params.maxPlaces || 99;

      for (let i = 0; i < maxPlaces; i++)
        this.availablePlaces.push(i);
    }
  }

  connect(socket, player) {
    socket.on('placement_request', () => {
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

        if (this.topology)
          label = this.topology.getLabel(place);
        else
          label = (place + 1).toString();

        socket.emit('placement_available', {
          place: place,
          label: label
        });
      } else {
        socket.emit('placement_unavailable');
      }
    });
  }

  disconnect(socket, player) {
    if(player.place !== null) {
      this.availablePlaces.push(player.place);
      player.place = null;
    }
  }
}

module.exports = ServerSetupPlacementAssigned;