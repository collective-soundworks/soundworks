/**
 * @fileoverview Matrix server side topology manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;

class ServerTopology extends EventEmitter {
  constructor() {
    super();

    this.labels = [];
    this.positions = [];
    this.width = 1;
    this.height = 1;
  }

  init() {

  }

  connect(socket, player = {}) {
    socket.on('topology_request', () => {
      socket.emit('topology_init', this.getinfo());
    });
  }

  disconnect(socket, player = {}) {

  }

  getInfo() {
    return {
      "labels": this.labels,
      "positions": this.positions,
      "width": this.width,
      "height": this.height,
      "maxWidthDivision": this.labels.length,
      "maxHeightDivision": this.labels.length
    };
  }

  getMaxPlaces() {
    return this.labels.length;
  }

  getLabel(place) {
    if (place < this.labels.length)
      return this.labels[place];

    return (place + 1).toString();
  }
}

module.exports = ServerTopology;