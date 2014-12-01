var ServerPlayerManager = require('./ServerPlayerManager');
var ServerConnectionManager = require('./ServerConnectionManager');
var ServerDynamicModel = require('./ServerDynamicModel');
var ServerPlacementManager = require('./ServerPlacementManager');
var ServerPreparationManager = require('./ServerPreparationManager');
var ServerSync = require('./ServerSync');
var ServerTopologyModel = require('./ServerTopologyModel');

'use strict';

class ServerMatrix {
  constructor(matrixParameters) {
    var topologyModel = new ServerTopologyModel(matrixParameters, this.setup);
  }

  setup() {
    var topologyModel = this;
    var clientManager = new ServerPlayerManager();
    var connectionManager = new ServerConnectionManager();
    var dynamicModel = new ServerDynamicModel();
    var placementManager = new ServerPlacementManager(topologyModel);
    var preparationManager = new ServerPreparationManager(placementManager);

    connectionManager.on('connected', (socket) => {
      topologyModel.sendToClient(socket);
      clientManager.connect(socket);
    });

    connectionManager.on('disconnected', (socket) => {
      clientManager.disconnect(socket);
    });

    clientManager.on('connected', (client) => {
      placementManager.requestPlace(client);
    });

    clientManager.on('disconnected', (client) => {
      dynamicModel.removeParticipant(client);
      placementManager.releasePlace(client);
    });

    preparationManager.on('ready', (client) => {
      clientManager.clientReady(client);
    });

    clientManager.on('playing', (client) => {
      dynamicModel.addParticipant(client);
    });
  }
}

module.exports = ServerMatrix;