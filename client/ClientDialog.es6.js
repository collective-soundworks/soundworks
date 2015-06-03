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

    this._clickHandler = this._clickHandler.bind(this);
  }

  start() {
    super.start();
    this.setCenteredViewContent(this._text);
    this.view.addEventListener('click', this._clickHandler);
  }

  restart() {
    super.restart();
    this.done();
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

  _clickHandler() {
    if (this._mustActivateAudio)
      this._activateAudio();

    this.view.removeEventListener('click', this._clickHandler);
    this.done();
  }
}

module.exports = ClientDialog;