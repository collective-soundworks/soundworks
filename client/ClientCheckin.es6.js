/**
 * @fileoverview Soundworks client side check-in module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');

class ClientCheckin extends ClientModule {
  constructor(options = {}) {
    super('checkin', options.display || false);

    this.index = null;
    this.label = null;
  }

  start() {
    super.start();

    var socket = client.socket;
    var contentDiv = null;

    if (this.displayDiv) {
      contentDiv = document.createElement('div');
      contentDiv.classList.add('centered-content');
      this.displayDiv.appendChild(contentDiv);
    }

    socket.emit('checkin_request');

    socket.on('checkin_info', (info) => {
      this.index = info.index;
      this.label = info.label;

      if (this.displayDiv) {
        contentDiv.innerHTML = "<p>Go to position</p>" +
          "<div class='checkin-label circled'><span>" + this.label + "</span></div>" +
          "<p class='small'>Touch the screen<br/>when you are ready.</p>";

        this.displayDiv.addEventListener('click', () => {
          this.done();
        });
      } else {
        this.done();
      }
    });

    socket.on('checkin_failed', () => {
      if (this.displayDiv) {
        contentDiv.innerHTML = "<p>All seats are taken, please try again later! =)</p>";
      }
    });
  }
}

module.exports = ClientCheckin;