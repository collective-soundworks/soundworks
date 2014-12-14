/**
 * @fileoverview Matrix client side topology manager
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var ioClient = require('./ioClient');

class ClientTopology extends EventEmitter {
  constructor(params = {}) {
    this.topology = null;
    this.displayDiv = null;

    if (params.display !== false) {
      var div = document.createElement('div');
      div.setAttribute('id', 'topology');
      div.classList.add('topology');
      div.classList.add('hidden');
      this.displayDiv = div;
    }
  }

  request() {
    var socket = ioClient.socket;

    socket.on('topology_init', (topology) => {
      this.init(topology);
      this.emit("topology_init", topology);
    });

    socket.emit('topology_request');
  }

  init(topology) {
    this.topology = topology;
  }
}

module.exports = ClientTopology;