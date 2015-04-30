/**
 * @fileoverview Soundworks client side orientation module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var input = require('./input');

class ClientOrientation extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'orientation', true, options.color);

    this.angleReference = 0;

    this._angle = 0;
    this._text = options.text || "Point the phone exactly in front of you, and touch the screen.";

    input.enableDeviceOrientation();

    input.on('deviceorientation', (orientationData) => {
      this._angle = orientationData.alpha;
    });
  }

  start() {
    super.start();
    this.setCenteredViewContent('<p>' + this._text + '</p>');

    this.view.addEventListener('click', () => {
      this.angleReference = this._angle;
      this.done();
    });
  }
}

module.exports = ClientOrientation;