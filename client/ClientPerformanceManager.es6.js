'use strict';

window.container = window.container || document.getElementById('container');

class ClientPerformanceManager {
  constructor() {
    this.place = null;
    this.label = null;

    // GUI parent div
    var parentDiv = document.createElement('div');
    parentDiv.setAttribute('id', 'performance');
    parentDiv.classList.add('hidden');
    container.appendChild(parentDiv);

    this.parentDiv = parentDiv;
  }

  setPlayers(players) {

  }

  start(placeInfo) {
    this.place = placeInfo.place;
    this.label = placeInfo.label;
  }

  addPlayer(player) {

  }

  removePlayer(player) {

  }
}

module.exports = ClientPerformanceManager;