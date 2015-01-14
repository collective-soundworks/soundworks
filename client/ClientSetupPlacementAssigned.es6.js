/**
 * @fileoverview Matrix client side placement manager automatically assigning places
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientSetupPlacement = require('./ClientSetupPlacement');
var ioClient = require('./ioClient');

class ClientSetupPlacementAssigned extends ClientSetupPlacement {
  constructor(params) {
    super(params);

    if (this.displayDiv)
      this.displayDiv.classList.add('hidden');
  }

  start() {
    var socket = ioClient.socket;

    socket.on('placement_available', (placeInfo) => {
      this.place = placeInfo.place;
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
}

module.exports = ClientSetupPlacementAssigned;