window.container = window.container || document.getElementById('container');

'use strict';

class ClientPerformanceGui {
  constructor() {
    var parentDiv = document.createElement('div');
    parentDiv.setAttribute('id', 'performance');
    parentDiv.classList.add('hidden');
    container.appendChild(parentDiv);
    
    this.__parentDiv = parentDiv;
  }

  display() {
    this.__parentDiv.classList.remove('hidden');
  }

  hide() {
    this.__parentDiv.classList.add('hidden');
  }
}

module.exports = ClientPerformanceGui;