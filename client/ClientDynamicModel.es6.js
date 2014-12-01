var ClientDisplayInterface = require('./ClientDisplayInterface');

'use strict';

class ClientDynamicModel {
  constructor(input) {
    this.__label = null;
    this.__place = null;
    this.__position = null;

    this.__input = input;
  }

  start(placeInfo) {
    this.__label = placeInfo.label;
    this.__place = placeInfo.place;
    this.__position = placeInfo.position;

    var displayInterface = new ClientDisplayInterface();
  }

}

module.exports = ClientDynamicModel;