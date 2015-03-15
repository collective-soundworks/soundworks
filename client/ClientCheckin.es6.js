/**
 * @fileoverview Soundworks client side check-in module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');

class ClientCheckin extends ClientModule {
  constructor(options = {}) {
    super('checkin', options.dialog || false, options.color || 'black');

    this.index = null;
    this.label = null;
  }

  start() {
    super.start();

    client.send('checkin_request');

    client.receive('checkin_info', (info) => {
      this.index = info.index;
      this.label = info.label;

      if (this.view) {
        let htmlContent = "<p>Go to position</p>" +
          "<div class='checkin-label circled'><span>" + this.label + "</span></div>" +
          "<p><small>Touch the screen<br/>when you are ready.</small></p>";

        this.setCenteredViewContent(htmlContent);
        
        this.view.addEventListener('click', () => {
          this.done();
        });
      } else {
        this.done();
      }
    });

    client.receive('checkin_failed', () => {
      this.setCenteredViewContent("<p>All seats are taken, please try again later.</p>");
    });
  }
}

module.exports = ClientCheckin;