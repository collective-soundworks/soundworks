var ClientPlacementManager = require('./ClientPlacementManager');
var ClientDisplayInterface = require('./ClientDisplayInterface');
var ClientInput = require('./ClientInput');
var ClientDynamicModel = require('./ClientDynamicModel');
// var ClientSyncModule = require('./Client.SyncModule');


'use strict';

class ClientMatrix {
  constructor() {

    socket.on('topology', (topology) => {
      var input = new ClientInput();
      var placementManager = new ClientPlacementManager();
      var dynamicModel = new ClientDynamicModel(input);

      placementManager.on('ready', (placeInfo) => {
        dynamicModel.start(placeInfo);
      });

    });

  }
}

module.exports = ClientMatrix;