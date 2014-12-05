var ioClient = require('./ioClient');

function listenPlayerManager(performanceManager) {
  var socket  = ioClient.socket;

  socket.on('players_set', (playerList) => {
    performanceManager.setPlayers(playerList);
  });

  socket.on('player_add', (player) => {
    performanceManager.addPlayer(player);
  });

  socket.on('player_remove', (player) => {
    performanceManager.removePlayer(player);
  });
}

function start(topologyManager, setupManager, performanceManager) {
  listenPlayerManager(performanceManager);

  if (setupManager)
    setupManager.start();

  if (topologyManager) {
    topologyManager.on('topology_update', (topology) => {
      performanceManager.updateTopology();
    });
  }

  if (setupManager) {
    setupManager.on('setup_ready', (placeInfo) => {
      performanceManager.start(placeInfo);
    });
  } else
    performanceManager.start(placeInfo);
}

module.exports = {
  ioClient: ioClient,
  inputModule: require('./inputModule'),
  PerformanceManager: require('./ClientPerformanceManager'),
  PlacementManager: require('./ClientPlacementManager'),
  PlacementManagerAssignedPlaces: require('./ClientPlacementManagerAssignedPlaces'),
  SetupManager: require('./ClientSetupManager'),
  SetupManagerPlacementAndSync: require('./ClientSetupManagerPlacementAndSync'),
  SyncManager: require('./ClientSyncManager'),
  TopologyManager: require('./ClientTopologyManager'),
  TopologyManagerArbitraryStatic: require('./ClientTopologyManagerArbitraryStatic'),
  start: start
};