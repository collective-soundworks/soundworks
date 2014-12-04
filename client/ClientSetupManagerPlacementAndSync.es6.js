window.container = window.container || document.getElementById('container'); // TODO: make module?
var ClientSetupManager = require('./ClientSetupManager');

'use strict';

class ClientSetupManagerPlacementAndSync extends ClientSetupManager {
  constructor(placementManager, syncManager) {
    super();

    this.__standbyDiv = this.createStandbyDiv();

    this.__placementManager = placementManager;
    this.__syncManager = syncManager;

    this.__parentDiv.appendChild(syncManager.__syncDiv);
    this.__parentDiv.appendChild(placementManager.__placementDiv);

    this.__state = {
      placed: false,
      synced: false
    }

    this.__placeInfo = null;
  }

  start() {
    // 1. Display screens
    this.displayParentDiv();
    this.__syncManager.displaySyncDiv();
    // 2. When sync is started…
    this.__syncManager.on('sync_started', () => {
      this.__syncManager.hideSyncDiv();
      this.__placementManager.displayPlacementDiv();
    });
    // 3.1 When placement is ready…
    this.__placementManager.on('placement_ready', (placeInfo) => {
      this.__state.placed = true;
      this.__placeInfo = placeInfo
      this.__placementManager.hidePlacementDiv();
      if (!this.__state.synced)
        this.displayStandbyDiv();
      else {
        this.emit('setup_ready', this.__placeInfo);
        this.hideParentDiv();
      }
    });
    // 3.2 When sync is ready…
    this.__syncManager.on('sync_ready', () => {
      this.__state.synced = true;
      if (this.__state.placed) {
        this.emit('setup_ready', this.__placeInfo);
        this.hideParentDiv();
      }
    });
  }

  /*
   * Preparation '#standby' div (HTML)
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  createStandbyDiv() {
    var standbyDiv = document.createElement('div');

    standbyDiv.setAttribute('id', 'standby');
    standbyDiv.classList.add('info');
    standbyDiv.classList.add('hidden');

    standbyDiv.innerHTML = "<p>Finishing setup&hellip;</p>";

    this.__parentDiv.appendChild(standbyDiv);

    return standbyDiv;
  }

  displayStandbyDiv() {
    this.__standbyDiv.classList.remove('hidden');
  }

  hideStandbyDiv() {
    this.__standbyDiv.classList.add('hidden');
  }


}

module.exports = ClientSetupManagerPlacementAndSync;