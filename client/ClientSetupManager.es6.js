window.container = window.container || document.getElementById('container');
var EventEmitter = require('events').EventEmitter;

'use strict';

class ClientSetupManager extends EventEmitter {
  constructor() {
    var parentDiv = document.createElement('div');
    parentDiv.setAttribute('id', 'setup');
    parentDiv.classList.add('hidden');
    container.appendChild(parentDiv);
    
    this.parentDiv = parentDiv;
  }

  start() {
    
  }
}
module.exports = ClientSetupManager;