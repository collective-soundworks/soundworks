/**
 * @fileoverview Matrix client side performance manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var audioContext = require('audio-context');
var ClientSetupMulti = require('./ClientSetupMulti');
var ioClient = require('./ioClient');
var container = window.container = window.container || document.getElementById('container');
var defaultWelcome =
  "<p>Before we start, we'll go through a little preparation process.</p>" +
  "<p>Touch the screen to start!</p>";

class ClientManager {
  constructor(setup, performance, topology = null, params = {}) {
    this.displayDiv = null;

    if (Array.isArray(setup))
      setup = new ClientSetupMulti(setup);

    if (params.display !== false) {
      var div = document.createElement('div');
      div.setAttribute('id', 'welcome');
      div.classList.add('info');
      div.classList.add('fullscreen');
      div.classList.add('hidden');
      container.appendChild(div);
      div.innerHTML = params.welcome || defaultWelcome;
      this.displayDiv = div;
    }

    this.topology = topology;
    this.setup = setup;
    this.performance = performance;
  }

  start() {
    if (this.displayDiv) {
      // install click listener
      this.displayDiv.addEventListener('click', () => {
        this.displayDiv.classList.add('hidden');
        this.__activateAudio();
        this.__startSetup();
      });

      this.displayDiv.classList.remove('hidden');
    } else {
      this.__startSetup();
    }
  }

  __activateAudio() {
    var o = audioContext.createOscillator();
    var g = audioContext.createGain();
    g.gain.value = 0;
    o.connect(g);
    g.connect(audioContext.destination);
    o.start(0);
    o.stop(audioContext.currentTime + 0.000001);
  }

  __startSetup() {
    if (this.topology)
      this.topology.request();

    if (this.setup) {
      this.setup.on('done', (setup) => {
        // send ready to server
        var socket = ioClient.socket;
        socket.emit('client_ready');

        this.performance.start();
      });

      this.setup.start();
    } else {
      this.performance.start();
    }
  }
}

module.exports = ClientManager;