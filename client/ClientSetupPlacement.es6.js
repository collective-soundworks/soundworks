/**
 * @fileoverview Matrix client side placement manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var audioContext = require('audio-context');
var ClientSetup = require('./ClientSetup');
var ioClient = require('./ioClient');

class ClientSetupPlacement extends ClientSetup {
  constructor(params) {
    super(params);

    this.place = null;
    this.label = null;

    if (this.displayDiv) {
      this.displayDiv.setAttribute('id', 'placement');
      this.displayDiv.classList.add('placement');
    }
  }

  getPlaceInfo() {
    var placeInfo = {
      "place": this.place,
      "label": this.label
    };

    return placeInfo;
  }
}

module.exports = ClientSetupPlacement;