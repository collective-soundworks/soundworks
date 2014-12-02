var ClientPlacementManager = require('./ClientPlacementManager');
var ClientDisplayInterface = require('./ClientDisplayInterface');
var ClientInput = require('./ClientInput');
var ClientPerformanceManager = require('./ClientPerformanceManager');
// var ClientSyncModule = require('./Client.SyncModule');


'use strict';

class ClientMatrix {
  constructor() {

    socket.on('topology', (topology) => {
      var input = new ClientInput();
      var placementManager = new ClientPlacementManager();
      var performanceManager = new ClientPerformanceManager(input);

      placementManager.on('ready', (placeInfo) => {
        performanceManager.start(placeInfo);
      });

    });

  }
}

module.exports = ClientMatrix;