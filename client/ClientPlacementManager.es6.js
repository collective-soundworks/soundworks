'use strict';

window.container = window.container || document.getElementById('container');
window.preparationDiv = window.preparationDiv || document.getElementById('preparation');
var audioContext = require('audio-context');
var EventEmitter = require('events').EventEmitter;
var ioClient = require('./ioClient');

window.container = window.container || document.getElementById('container');

class ClientPlacementManager extends EventEmitter {
  constructor() {
    this.label = null;
    this.place = null;

    var div = document.createElement('div');
    div.setAttribute('id', 'placement');
    div.classList.add('info');
    div.classList.add('hidden');

    this.parentDiv = div;
  }

  getPlaceInfo() {
    var placeInfo = {
      "label": this.label,
      "place": this.place,
    };
    return placeInfo;
  }

  placementReady() {
    var socket = ioClient.socket;
    socket.emit('placement_ready');
    this.emit('placement_ready', this.getPlaceInfo());
  }

}

module.exports = ClientPlacementManager;