/**
 * @fileoverview Matrix client side setup manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var audioContext = require('audio-context');

var container = window.container = window.container || document.getElementById('container');

class ClientSetupManager extends EventEmitter {
  constructor() {
    var div;

    // creat parent div
    div = document.createElement('div');
    div.setAttribute('id', 'setup');
    div.classList.add('hidden');
    this.parentDiv = div;

    // create welcome dialog
    div = document.createElement('div');
    div.setAttribute('id', 'welcome');
    div.classList.add('info');
    div.classList.add('hidden');
    div.innerHTML = "<p>Before we start, we'll go through a little preparation process.</p>" + "<p>Touch the screen to start!</p>";
    this.welcomeDiv = div;

    container.appendChild(this.parentDiv);
    this.parentDiv.appendChild(this.welcomeDiv);
  }

  setWelcome(str) {
    this.welcomeDiv.innerHTML = "str";
  }

  start() {

  }

  activateWebAudioAPI() {
    var o = audioContext.createOscillator();
    var g = audioContext.createGain();
    g.gain.value = 0;
    o.connect(g);
    g.connect(audioContext.destination);
    o.start(0);
    o.stop(audioContext.currentTime + 0.000001);
  }
}

module.exports = ClientSetupManager;