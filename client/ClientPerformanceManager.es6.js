/**
 * @fileoverview Matrix client side performance manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var container = window.container = window.container || document.getElementById('container');

class ClientPerformanceManager {
  constructor() {
    this.place = null;
    this.label = null;

    // GUI parent div
    var div = document.createElement('div');
    div.setAttribute('id', 'performance');
    div.classList.add('hidden');
    this.parentDiv = div;

    container.appendChild(this.parentDiv);
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