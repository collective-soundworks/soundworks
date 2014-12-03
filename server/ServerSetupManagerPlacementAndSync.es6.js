var ServerSetupManager = require('./ServerSetupManager');

'use strict';

class ServerSetupManagerPlacementAndSync extends ServerSetupManager {
  constructor(placementManager, syncManager) {
    this.__placementManager = placementManager;
    this.__syncManager = syncManager;

    // TODO: use Promises
    this.__placementManager.on('placement_ready', (player) => {
      player.publicState.placed = true;

      if (player.publicState.synced)
        this.setupReady(player);
    });

    this.__syncManager.on('sync_ready', (player) => {
      player.publicState.synced = true;

      if (player.publicState.placed)
        this.setupReady(player);
    });
  }

  addPlayer(player) {
    player.publicState.placed = false;
    player.publicState.synced = false;

    this.__placementManager.requestPlace(player);
    this.__syncManager.startSync(player);
  }

  removePlayer(player) {
    this.__placementManager.releasePlace(player);
  }

  setupReady(player) {
    delete player.publicState.placed;
    delete player.publicState.synced;
    this.emit('setup_ready', player);
  }
}

module.exports = ServerSetupManagerPlacementAndSync;