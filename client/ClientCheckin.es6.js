/**
 * @fileoverview Soundworks client side check-in module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');
var input = require('./input');

function instructions(label) {
  return "<p>Go to</p>" +
    "<div class='checkin-label circled'><span>" + label + "</span></div>" +
    "<p><small>Touch the screen<br/>when you are ready.</small></p>";
}

class ClientCheckin extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'checkin', true, options.color);

    this.instructions = options.instructions || instructions;

    this.index = -1;
    this.label = null;
  }

  start() {
    super.start();

    client.send('checkin:request', this.order);

    client.receive('checkin:acknowledge', (index, label, coordinates) => {
      this.index = index;

      if (coordinates)
        client.coordinates = coordinates;

      if (label) {
        this.label = label;

        let htmlContent = this.instructions(label);

        this.setCenteredViewContent(htmlContent);

        this.view.addEventListener('click', () => {
          this.done();
        });
      } else {
        this.done();
      }
    });

    client.receive('checkin:unavailable', () => {
      this.setCenteredViewContent("<p>Sorry, we cannot accept any more connections at the moment, please try again later.</p>");
    });
  }
}

module.exports = ClientCheckin;