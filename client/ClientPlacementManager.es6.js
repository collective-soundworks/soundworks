/**
 * @fileoverview Matrix client side placement manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var audioContext = require('audio-context');
var EventEmitter = require('events').EventEmitter;
var ioClient = require('./ioClient');

class ClientPlacementManager extends EventEmitter {
  constructor() {
    this.place = null;
    this.label = null;

    var div = document.createElement('div');
    div.setAttribute('id', 'placement');
    div.classList.add('info');
    div.classList.add('hidden');
    this.parentDiv = div;
  }

  getPlaceInfo() {
    var placeInfo = {
      "place": this.place,
      "label": this.label
    };

    return placeInfo;
  }

  start() {

  }

  ready() {
    var socket = ioClient.socket;
    socket.emit('placement_ready');
    this.emit('placement_ready', this.getPlaceInfo());
  }
}

module.exports = ClientPlacementManager;