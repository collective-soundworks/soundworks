var EventEmitter = require('events').EventEmitter;

'use strict';

class ServerTopologyManager extends EventEmitter {
  constructor() {
    this.__labels = [];
    this.__positions = [];
  }

  getLabel(place) {
    return this.__labels[place];
  }

  getPosition(place) {
    return this.__positions[place];
  }

  getTopology() {
    var topology = {
      "labels": this.__labels,
      "positions": this.__positions
    };
    return topology;
  }

  send(socket) {
    socket.emit('topology', this.getTopology());
  }
}

module.exports = ServerTopologyManager;
