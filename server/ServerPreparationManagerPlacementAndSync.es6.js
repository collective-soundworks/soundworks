var ServerPreparationManager = require('./ServerPreparationManager');

'use strict';

class ServerPreparationManagerPlaceAndSync extends ServerPreparationManager {
  constructor(placementManager, syncModule) {
    this.__placementManager = placementManager;
    this.__syncModule = syncModule;

    this.__state = { placementManager: false, syncModule: false };

    // TODO: use Promises
    this.__placementManager.on('placement_ready', (client) => {
      this.__state.placementManager = true;
      if (this.__state.placementManager && this.__state.syncModule) {
        this.emit('ready', client);
      }
    });

    this.__syncModule.on('sync_ready', (client) => {
      this.__state.syncModule = true;
      if (this.__state.placementManager && this.__state.syncModule) {
        this.emit('ready', client);
      }
    });
  }
  
}

module.exports = ServerPreparationManagerPlaceAndSync;