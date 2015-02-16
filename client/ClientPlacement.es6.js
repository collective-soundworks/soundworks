/**
 * @fileoverview Matrix client side placement manager automatically assigning places
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');

class ClientPlacement extends ClientModule {
  constructor(params = {}) {
    super('placement', params.display || false);

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


    socket.on('placement_available', (placeInfo) => {
      this.index = placeInfo.index;
      this.label = placeInfo.label;

      if (contentDiv) {
        contentDiv.innerHTML = "<p>Go to position</p>" +
          "<div class='placement-label circled'><span>" + this.label + "</span></div>" +
          "<p class='small'>Touch the screen<br/>when you are ready.</p>";

        this.displayDiv.classList.remove('hidden');

        this.displayDiv.addEventListener('click', () => {
          this.done();
        });
      } else {
        this.done();
      }
    });

    socket.on('placement_unavailable', () => {
      if (contentDiv) {
        content.innerHTML = "<p>All seats are taken, please try again later! =)</p>";
        this.displayDiv.classList.remove('hidden');
      }
    });

    socket.emit('placement_request');
  }

  getPlaceInfo() {
    var placeInfo = {
      "index": this.index,
      "label": this.label
    };

    return placeInfo;
  }
}

module.exports = ClientPlacement;