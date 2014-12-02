var ServerPreparationManager = require('./ServerPreparationManager');

'use strict';

class ServerPreparationManagerPlacementAndSync extends ServerPreparationManager {
  constructor(placementManager, syncManager) {
    this.__placementManager = placementManager;
    this.__syncManager = syncManager;

    this.__state = {
      placementManager: (placementManager === null),
      syncManager: (syncManager === null)
    };

    // TODO: use Promises
    if (placementManager !== null) {
      this.__placementManager.on('placement_ready', (client) => {
        this.__state.placementManager = true;
        if (this.__state.placementManager && this.__state.syncManager) {
          this.emit('ready', client);
        }
      });
    }

    if (syncManager !== null) {
      this.__syncManager.on('sync_ready', (client) => {
        this.__state.syncManager = true;
        if (this.__state.placementManager && this.__state.syncManager) {
          this.emit('ready', client);
        }
      });
    }
  }
}

module.exports = ServerPreparationManagerPlacementAndSync;