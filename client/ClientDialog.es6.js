/**
 * @fileoverview Soundworks client side dialog module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var audioContext = require('waves-audio').audioContext;

class ClientDialog extends ClientModule {
  constructor(options = {}) {
    super(options.id || 'dialog', true, options.color || 'black');

    this.__mustActivateAudio = options.activateAudio || false;
    this.__text = options.text;
  }

  start() {
    super.start();
    this.setCenteredViewContent('<p>' + this.__text + '</p>');

    // install click listener
    this.view.addEventListener('click', () => {
      if (this.__mustActivateAudio)
        this.__activateAudio();

      this.done();
    });
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