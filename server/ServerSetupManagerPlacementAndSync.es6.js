'use strict';

var ServerSetupManager = require('./ServerSetupManager');

class ServerSetupManagerPlacementAndSync extends ServerSetupManager {
  constructor(topologyManager, placementManager, syncManager) {
    super(topologyManager);

    this.placementManager = placementManager;
    this.syncManager = syncManager;

    this.placementManager.on('placement_ready', (player) => {
      player.publicState.placed = true;

      if (player.publicState.synced)
        this.setupReady(player);
    });

    this.syncManager.on('sync_ready', (player) => {
      player.publicState.synced = true;

      if (player.publicState.placed)
        this.setupReady(player);
    });
  }

  addPlayer(player) {
    player.publicState.placed = false;
    player.publicState.synced = false;

    this.syncManager.initSync(player);
    this.placementManager.requestPlace(player);
  }

  removePlayer(player) {
    this.placementManager.releasePlace(player);
  }

  updateTopology() {
    this.placementManager.updateTopology();
  }

  setupReady(player) {
    delete player.publicState.placed;
    delete player.publicState.synced;
    this.emit('setup_ready', player);
  }
}

module.exports = ServerSetupManagerPlacementAndSync;