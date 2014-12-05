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
    this.label = null;
    this.place = null;
    this.position = null;

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
      "position": this.position
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