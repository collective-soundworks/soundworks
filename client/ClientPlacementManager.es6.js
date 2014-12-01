window.container = window.container || document.getElementById('container');
var EventEmitter = require('events').EventEmitter;
var AudioCue = require('./ClientAudioCue');

'use strict';

class ClientPlacementManager extends EventEmitter {
  constructor() {
    this.__label = null;
    this.__place = null;
    this.__position = null;

    this.__placementDiv = this.createPlacementDiv();
  }

  clientReady() {
    socket.emit('placement_ready');
    this.emit('ready', this.getPlaceInfo());

    AudioCue.beep();
    this.hidePlacementDiv();
  }

  createPlacementDiv() {
    var placementDiv = document.createElement('div');

    placementDiv.setAttribute('id', 'placement');
    placementDiv.classList.add('info');
    
    container.appendChild(placementDiv);
    
    return placementDiv;
  }

  getPlaceInfo() {
    var placeInfo = { "label": this.__label, "place": this.__place, "position": this.__position };
    return placeInfo;
  }

  hidePlacementDiv() {
    this.__placementDiv.classList.add('hidden');
  }

}

module.exports = ClientPlacementManager;