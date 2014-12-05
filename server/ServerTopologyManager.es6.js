var EventEmitter = require('events').EventEmitter;

'use strict';

class ServerTopologyManager extends EventEmitter {
  constructor() {
    this.labels = [];
    this.positions = [];
  }

  init() {

  }

  getLabel(place) {
    return this.labels[place];
  }

  getPosition(place) {
    return this.positions[place];
  }

  sendInit(socket) {
    socket.emit('init_topology', {
      "labels": this.labels,
      "positions": this.positions
    });
  }
}

module.exports = ServerTopologyManager;