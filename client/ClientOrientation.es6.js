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

    this.angleReference = 0;

    this.__angle = 0;
    this.__text = options.text || "<p>Point the phone exactly in front of you, and touch the screen.</p>";

    input.enableDeviceOrientation();

    input.on('deviceorientation', (orientationData) => {
      this.__angle = orientationData.alpha;
    });
  }

  start() {
    super.start();

    var contentDiv = document.createElement('div');
    contentDiv.classList.add('centered-content');
    this.view.appendChild(contentDiv);

    contentDiv.innerHTML = this.__text;

    this.view.addEventListener('click', () => {
      this.angleReference = this.__angle;
      this.done();
    });
  }
}

module.exports = ClientOrientation;