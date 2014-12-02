var ServerPlayerManager = require('./ServerPlayerManager');
var ServerConnectionManager = require('./ServerConnectionManager');
var ServerPerformanceManager = require('./ServerPerformanceManager');
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
    var performanceManager = new ServerPerformanceManager();
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
      performanceManager.removeParticipant(client);
      placementManager.releasePlace(client);
    });

    preparationManager.on('ready', (client) => {
      clientManager.clientReady(client);
    });

    clientManager.on('playing', (client) => {
      performanceManager.addParticipant(client);
    });
  }
}

module.exports = ServerMatrix;