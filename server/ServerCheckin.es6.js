/**
 * @fileoverview Soundworks server side check-in module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

class ServerCheckin extends ServerModule {
  constructor(options = {}) {
    super();

    this.seatmap = options.seatmap || null;
    this.order = options.order || 'random';
    this.numPlaces = options.numPlaces || 9999;
    
    this.__availableIndices = [];

    if (this.seatmap)
      this.numPlaces = this.seatmap.getNumPlaces();

    for (let i = 0; i < this.numPlaces; i++)
        this.__availableIndices.push(i);
  }

  connect(client) {
    var socket = client.socket;

    socket.on('checkin_request', () => {
      var index = null;

      switch (this.order) {
        case 'random':
          if (this.__availableIndices.length > 0) {
            // pick randomly an available index
            let i = getRandomInt(0, this.__availableIndices.length - 1);
            index = this.__availableIndices.splice(i, 1)[0];
          }

          break;

        case 'ascending':
          if (this.__availableIndices.length > 0) {
            this.__availableIndices.sort(function(a, b) {
              return a - b;
            });
            index = this.__availableIndices.splice(0, 1)[0];
          }

          break;
      }

      if (index !== null) {
        client.index = index;

        var label;

        if (this.seatmap)
          label = this.seatmap.getLabel(index);
        else
          label = (index + 1).toString();

        socket.emit('checkin_info', {
          index: index,
          label: label
        });
      } else {
        socket.emit('checkin_failed');
      }
    });
  }

  disconnect(client) {
    if(client.index !== null) {
      this.__availableIndices.push(client.index);
    }
  }
}

module.exports = ServerCheckin;
