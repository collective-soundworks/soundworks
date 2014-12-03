window.container = window.container || document.getElementById('container');
var EventEmitter = require('events').EventEmitter;

'use strict';

class ClientSetupManager extends EventEmitter {
  constructor() {
    var parentDiv = document.createElement('div');
    parentDiv.setAttribute('id', 'setup');
    parentDiv.classList.add('hidden');
    container.appendChild(parentDiv);
    
    this.__parentDiv = parentDiv;
  }

  displayParentDiv() {
    this.__parentDiv.classList.remove('hidden');
  }

  hideParentDiv() {
    this.__parentDiv.classList.add('hidden');
  }

  start() {
    
  }
}
module.exports = ClientSetupManager;