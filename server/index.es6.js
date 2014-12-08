'use strict';

var ConnectionManager = require('./ServerConnectionManager');
var PlayerManager = require('./ServerPlayerManager');

function start(topologyManager, setupManager, performanceManager) {
  var connectionManager = new ConnectionManager();
  var playerManager = new PlayerManager();
  
  setupManager.init();
  performanceManager.init(playerManager);

  topologyManager.on('topology_update', () => {
    setupManager.updateTopology();
    performanceManager.updateTopology();
  });

  topologyManager.init();

  // when a new player connects to the server
  connectionManager.on('connected', (socket) => {
    topologyManager.sendInit(socket);
    var player = playerManager.register(socket);
    setupManager.addPlayer(player);
  });

  // when a player disconnects from the server
  connectionManager.on('disconnected', (socket) => {
    var player = playerManager.unregister(socket);
    performanceManager.removePlayer(player);
    setupManager.removePlayer(player);
  });

  // when the setup proceedure succeeded
  setupManager.on('setup_ready', (player) => {
    playerManager.playerReady(player);
    performanceManager.addPlayer(player);
  });
}

module.exports = {
  ioServer: require('./ioServer'),
  PerformanceManager: require('./ServerPerformanceManager'),
  PlacementManager: require('./ServerPlacementManager'),
  PlacementManagerAssignedPlaces: require('./ServerPlacementManagerAssignedPlaces'),
  Player: require('./ServerPlayer'),
  SetupManager: require('./ServerSetupManager'),
  SetupManagerPlacementAndSync: require('./ServerSetupManagerPlacementAndSync'),
  SoloistManager: require('./ServerSoloistManager'),
  SoloistManagerRandomUrn: require('./ServerSoloistManagerRandomUrn'),
  SyncManager: require('./ServerSyncManager'),
  TopologyManager: require('./ServerTopologyManager'),
  TopologyManagerRegularMatrix: require('./ServerTopologyManagerRegularMatrix'),
  start: start
};
