var ServerPreparationManager = require('./ServerPreparationManager');

'use strict';

class ServerPreparationManagerPlacement extends ServerPreparationManager {
  constructor(placementManager) {
    this.__placementManager = placementManager;
    this.__state = { placementManager: false };

    this.__placementManager.on('placement_ready', (client) => {
      this.__state.placementManager = true;
      this.emit('ready', client);
    });
  }
}

module.exports = ServerPreparationManagerPlacement;