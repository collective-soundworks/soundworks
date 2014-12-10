/**
 * @fileoverview Matrix client side exported modules and start function
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ioClient = require('./ioClient');

function listenPlayerManager(performanceManager) {
  var socket = ioClient.socket;

  socket.on('players_init', (playerList) => {
    performanceManager.initPlayers(playerList);
  });

  socket.on('player_add', (player) => {
    performanceManager.addPlayer(player);
  });

  socket.on('player_remove', (player) => {
    performanceManager.removePlayer(player);
  });
}

function start(setupManager, performanceManager, topologyManager = null) {
  listenPlayerManager(performanceManager);

  setupManager.on('setup_ready', (placeInfo) => {
    performanceManager.start(placeInfo);
  });

  setupManager.start();
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
  TopologyManagerGeneric: require('./ClientTopologyManagerGeneric'),
  start: start
};