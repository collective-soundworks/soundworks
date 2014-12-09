'use strict';

var EventEmitter = require('events').EventEmitter;

// this placement manager simply returns increasing place numbers and reuses released place numbers

class ServerPlacementManager extends EventEmitter {
  constructor() {

  }

  requestPlace(player) {

  }

  releasePlace(player) {

  }
}

module.exports = ServerPlacementManager;