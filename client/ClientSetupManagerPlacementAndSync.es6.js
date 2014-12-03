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

    this.state = {
      placed: false,
      synced: false
    }
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
    this.__placementManager.on('placement_ready', () => {
      this.state.placed = true;
      this.__placementManager.hidePlacementDiv();
      if (!this.state.synced)
        this.displayStandbyDiv();
      else {
        this.emit('setup_ready');
        this.hideParentDiv();
      }
    });
    // 3.2 When sync is ready…
    this.__syncManager.on('sync_ready', () => {
      this.state.synced = true;
      if (this.state.placed) {
        this.emit('setup_ready');
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

    this.__parentpDiv.appendChild(standbyDiv);

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