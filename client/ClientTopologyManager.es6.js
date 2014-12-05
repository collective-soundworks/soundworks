var EventEmitter = require('events').EventEmitter;

'use strict';

class ClientTopologyManager extends EventEmitter {
  constructor() {
    this.topology = null;

    var div = document.createElement('div');
    div.setAttribute('id', 'topology');
    div.classList.add('topology');
    div.classList.add('hidden');

    this.parentDiv = div;
  }
}

module.exports = ClientTopologyManager;