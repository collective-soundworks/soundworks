/**
 * @fileoverview Soundworks client side dialog module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var audioContext = require('audio-context');
var ClientModule = require('./ClientModule');

class ClientDialog extends ClientModule {
  constructor(params = {}) {
    super(params.id || 'gui', true);

    this.text = params.text;
    this.__mustActivateAudio = params.activateAudio || false;
  }

  start() {
    var contentDiv = document.createElement('div');
    contentDiv.classList.add('centered-content');
    this.displayDiv.appendChild(contentDiv);

    contentDiv.innerHTML = this.text;
    super.start();

    if (this.displayDiv) {
      // install click listener
      this.displayDiv.addEventListener('click', () => {
        if (this.__mustActivateAudio)
          this.__activateAudio();

        this.done();
      });
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
}

module.exports = ClientDialog;