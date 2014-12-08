'use strict';

var EventEmitter = require('events').EventEmitter;

class ServerTopologyManager extends EventEmitter {
  constructor() {
    
  }

  init() {

  }

  sendInit(socket) {

  }

  getLabel(place) {
    return place.toString(); // by default the label is the place number
  }
}

module.exports = ServerTopologyManager;