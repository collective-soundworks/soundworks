/**
 * @fileoverview Soundworks client side check-in module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');

class ClientCheckin extends ClientModule {
  constructor(options = {}) {
    super('checkin', true);

    this.index = null;
    this.label = null;
    this.dialog = (options.dialog === true);
  }

  start() {
    super.start();

    var contentDiv = document.createElement('div');
    contentDiv.classList.add('centered-content');
    this.view.appendChild(contentDiv);

    var socket = client.socket;
    socket.emit('checkin_request');

    socket.on('checkin_info', (info) => {
      this.index = info.index;
      this.label = info.label;

      if (this.dialog) {
        contentDiv.innerHTML = "<p>Go to position</p>" +
          "<div class='checkin-label circled'><span>" + this.label + "</span></div>" +
          "<p class='small'>Touch the screen<br/>when you are ready.</p>";

        this.view.addEventListener('click', () => {
          this.done();
        });
      } else {
        this.done();
      }
    });

    socket.on('checkin_failed', () => {
      contentDiv.innerHTML = "<p>All seats are taken, please try again later.</p>";
    });
  }
}

module.exports = ClientCheckin;