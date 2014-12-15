/**
 * @fileoverview Matrix client side performance manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ioClient = require('./ioClient');
var container = window.container = window.container || document.getElementById('container');

class ClientPerformance {
  constructor(params = {}) {
    this.displayDiv = null;

    if (params.display !== false) {
      var div = document.createElement('div');
      div.setAttribute('id', 'performance');
      div.classList.add('performance');
      div.classList.add('hidden');
      container.appendChild(div);
      this.displayDiv = div;
    }
    
    var socket = ioClient.socket;

    socket.on('players_init', (playerList) => {
      this.initPlayers(playerList);
    });

    socket.on('player_add', (player) => {
      this.addPlayer(player);
    });

    socket.on('player_remove', (player) => {
      this.removePlayer(player);
    });
  }

  initPlayers(players) {

  }

  addPlayer(player) {

  }

  removePlayer(player) {

  }

  start() {
    if (this.displayDiv)
      this.displayDiv.classList.remove('hidden');
  }

  done() {
    if (this.displayDiv)
      this.displayDiv.classList.add('hidden');

    this.emit('done', this);
  }
}

module.exports = ClientPerformance;