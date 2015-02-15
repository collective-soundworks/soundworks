/**
 * @fileoverview Matrix client side placement manager automatically assigning places
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');

class ClientPlacement extends ClientModule {
  constructor(params = {}) {
    super('placement', false);

    this.index = null;
    this.label = null;
  }

  start() {
    super.start();
    
    var socket = client.socket;

    socket.on('placement_available', (placeInfo) => {
      this.index = placeInfo.index;
      this.label = placeInfo.label;

      if (this.displayDiv) {
        this.displayDiv.innerHTML = "<p>Go to position</p>" +
          "<div class='position circle'><span>" + this.label + "</span></div>" +
          "<p class='small'>Touch the screen<br/>when you are ready.</p>";

        this.displayDiv.classList.remove('hidden');

        this.displayDiv.addEventListener('click', () => {
          this.displayDiv.classList.add('hidden');
          this.done();
        });
      } else {
        this.done();
      }
    });

    if (this.displayDiv) {
      socket.on('placement_unavailable', () => {
        this.displayDiv.innerHTML = "<p>All seats are taken, please try again later! =)</p>";
        this.displayDiv.classList.remove('hidden');
      });
    }

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