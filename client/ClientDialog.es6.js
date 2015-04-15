/**
 * @fileoverview Soundworks client side dialog module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var audioContext = require('waves-audio').audioContext;

class ClientDialog extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'dialog', true, options.color);

    this._mustActivateAudio = options.activateAudio || false;
    this._text = options.text || "Hello!";
  }

  start() {
    super.start();
    this.setCenteredViewContent(this._text);

    // install click listener
    this.view.addEventListener('click', () => {
      if (this._mustActivateAudio)
        this._activateAudio();

      this.done();
    });
  }

  _activateAudio() {
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