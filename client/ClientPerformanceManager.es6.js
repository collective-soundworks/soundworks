'use strict';

window.container = window.container || document.getElementById('container');

class ClientPerformanceManager {
  constructor(topologyManager) {
    this.topologyManager = topologyManager;

    this.label = null;
    this.place = null;

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

  updateTopology(topology) {

  }
}

module.exports = ClientPerformanceManager;