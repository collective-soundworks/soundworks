/**
 * @fileoverview Matrix server side module export and start function
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ConnectionManager = require('./ServerConnectionManager');
var PlayerManager = require('./ServerPlayerManager');

function start(setupManager, performanceManager, topologyManager = null) {
  var connectionManager = new ConnectionManager();
  var playerManager = new PlayerManager();
  
  performanceManager.init(playerManager);
  setupManager.init();

  if(topologyManager)
    topologyManager.init(); // this is last and may call listeners installed by the others

  // when a new player connects to the server
  connectionManager.on('connected', (socket) => {
    if(topologyManager)
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
