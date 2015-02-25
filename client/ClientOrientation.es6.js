/**
 * @fileoverview Soundworks client side orientation module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var input = require('./input');

class ClientOrientation extends ClientModule {
  constructor(options = {}) {
    super('orientation', true);

    this.angle = 0;
    this.angleZero = 0;

    this.text = options.text || "<p>Point the phone exactly in front of you, and touch the screen.</p>";

    input.enableDeviceOrientation();

    input.on('deviceorientation', (orientationData) => {
      this.angle = orientationData.alpha;
    });
  }

  start() {
    super.start();

    var contentDiv = document.createElement('div');
    contentDiv.classList.add('centered-content');
    this.view.appendChild(contentDiv);

    contentDiv.innerHTML = this.text;

    this.view.addEventListener('click', () => {
      this.angleZero = this.angle;
      this.done();
    });
  }
}

module.exports = ClientOrientation;