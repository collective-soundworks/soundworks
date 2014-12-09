'use strict';

var EventEmitter = require('events').EventEmitter;
var audioContext = require('audio-context');

window.container = window.container || document.getElementById('container');

class ClientSetupManager extends EventEmitter {
  constructor() {
    var parentDiv = document.createElement('div');
    parentDiv.setAttribute('id', 'setup');
    parentDiv.classList.add('hidden');
    container.appendChild(parentDiv);

    this.parentDiv = parentDiv;
    this.welcomeDiv = this.createWelcomeDiv();
  }

  start() {

  }

  setWelcome(str) {
    this.welcomeDiv.innerHTML = "str";
  }

  createWelcomeDiv() {
    var div = document.createElement('div');

    div.setAttribute('id', 'welcome');
    div.classList.add('info');
    div.classList.add('hidden');

    div.innerHTML = "<p>Before we start, we'll go through a little preparation process.</p>" +
      "<p>Touch the screen to start!</p>";

    this.parentDiv.appendChild(div);

    return div;
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