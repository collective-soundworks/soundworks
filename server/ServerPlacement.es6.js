/**
 * @fileoverview Matrix server side placement manager automatically assigning places
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

class ServerPlacement extends ServerModule {
  constructor(params) {
    super();

    this.topology = params.topology || null;
    this.order = params.order || 'random';
    this.availableIndices = [];

    var numPlaces = params.numPlaces || 9999;
    if (this.topology)
      numPlaces = this.topology.getNumPlaces();

    for (let i = 0; i < numPlaces; i++)
        this.availableIndices.push(i);
  }

  connect(client) {
    var socket = client.socket;

    socket.on('placement_request', () => {
      var index = null;

      switch (this.order) {
        case 'random':
          if (this.availableIndices.length > 0) {
            // pick randomly an available index
            let i = getRandomInt(0, this.availableIndices.length - 1);
            index = this.availableIndices.splice(i, 1)[0];
          }

          break;

        case 'ascending':
          if (this.availableIndices.length > 0) {
            this.availableIndices.sort(function(a, b) {
              return a - b;
            });
            index = this.availableIndices.splice(0, 1)[0];
          }

          break;
      }

      if (index !== null) {
        client.index = index;

        var label;

        if (this.topology)
          label = this.topology.getLabel(index);
        else
          label = (index + 1).toString();

        socket.emit('placement_available', {
          index: index,
          label: label
        });
      } else {
        socket.emit('placement_unavailable');
      }
    });
  }

  disconnect(client) {
    if(client.index !== null) {
      this.availableIndices.push(client.index);
    }
  }
}

module.exports = ServerPlacement;
