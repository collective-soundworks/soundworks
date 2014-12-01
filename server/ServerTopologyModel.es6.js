'use strict';

class ServerTopologyModel {
  constructor(readyCallback) {
    this.__labels = [];
    this.__positions = [];
    this.__readyCallback = readyCallback; // Placeholder only.
  }

  getLabel(place) {
    return this.__labels[place];
  }

  getPosition(place) {
    return this.__positions[place];
  }

  getTopology() {
    var matrixTopology = { "labels": this.__labels, "positions": this.__positions };
    return matrixTopology;
  }

  sendToClient(socket) {
    socket.emit('topology', this.getTopology());
  }
}

module.exports = ServerTopologyModel;