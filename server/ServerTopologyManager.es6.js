var EventEmitter = require('events').EventEmitter;

'use strict';

class ServerTopologyManager extends EventEmitter {
  constructor(emitReady = true) {
    this.__labels = [];
    this.__positions = [];

    // emit ready event asynchronously
    if (emitReady) {
      setTimeout(() => {
        this.emit('ready');
      }, 0);
    }
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

  sendToClient(socket) {
    socket.emit('topology', this.getTopology());
  }
}

module.exports = ServerTopologyManager;
