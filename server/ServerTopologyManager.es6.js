'use strict';

var EventEmitter = require('events').EventEmitter;

class ServerTopologyManager extends EventEmitter {
  constructor() {
    this.labels = [];
    this.positions = [];
  }

  init() {

  }

  sendInit(socket) {

  }

  getMaxPlaces() {
    return this.labels.length;
  }

  getLabel(place) {
    if(place < this.labels.length)
      return this.labels[place];

    return (place + 1).toString();
  }
}

module.exports = ServerTopologyManager;