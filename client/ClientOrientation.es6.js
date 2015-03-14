/**
 * @fileoverview Soundworks client side orientation module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var input = require('./input');

class ClientOrientation extends ClientModule {
  constructor(options = {}) {
    super('orientation', true, options.color || 'black');

    this.angleReference = 0;

    this.__angle = 0;
    this.__text = options.text || "Point the phone exactly in front of you, and touch the screen.";

    input.enableDeviceOrientation();

    input.on('deviceorientation', (orientationData) => {
      this.__angle = orientationData.alpha;
    });
  }

  start() {
    super.start();
    this.setCenteredViewContent('<p>' + this.__text + '</p>');

    this.view.addEventListener('click', () => {
      this.angleReference = this.__angle;
      this.done();
    });
  }
}

module.exports = ClientOrientation;