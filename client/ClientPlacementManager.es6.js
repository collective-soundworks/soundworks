window.container = window.container || document.getElementById('container');
window.preparationDiv = window.preparationDiv || document.getElementById('preparation');
var audioContext = require('audio-context');
var EventEmitter = require('events').EventEmitter;
var ioClient = require('./ioClient');

window.container = window.container || document.getElementById('container');

'use strict';

function beep() {
  var time = audioContext.currentTime;
  var duration = 0.2;
  var attack = 0.001;

  var g = audioContext.createGain();
  g.connect(audioContext.destination);
  g.gain.value = 0;
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(0.5, time + attack);
  g.gain.exponentialRampToValueAtTime(0.0000001, time + duration);
  g.gain.setValueAtTime(0, time);

  var o = audioContext.createOscillator();
  o.connect(g);
  o.frequency.value = 600;
  o.start(time);
  o.stop(time + duration);
}

class ClientPlacementManager extends EventEmitter {
  constructor() {
    this.__label = null;
    this.__place = null;
    this.__position = null;

    this.__placementDiv = this.createPlacementDiv();
  }

  createPlacementDiv() {
    var placementDiv = document.createElement('div');

    placementDiv.setAttribute('id', 'placement');
    placementDiv.classList.add('info');
    placementDiv.classList.add('hidden');

    preparationDiv.appendChild(placementDiv);

    return placementDiv;
  }

  displayPlacementDiv() {
    this.__placementDiv.classList.remove('hidden');
  }

  getPlaceInfo() {
    var placeInfo = {
      "label": this.__label,
      "place": this.__place,
      "position": this.__position
    };
    return placeInfo;
  }

  hidePlacementDiv() {
    this.__placementDiv.classList.add('hidden');
  }

  placementReady() {
    var socket = ioClient.socket;
    socket.emit('placement_ready');
    this.emit('placement_ready', this.getPlaceInfo());
  }

}

module.exports = ClientPlacementManager;