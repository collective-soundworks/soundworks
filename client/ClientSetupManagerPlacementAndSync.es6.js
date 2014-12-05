window.container = window.container || document.getElementById('container'); // TODO: make module?
var ClientSetupManager = require('./ClientSetupManager');

'use strict';

class ClientSetupManagerPlacementAndSync extends ClientSetupManager {
  constructor(placementManager, syncManager) {
    super();

    this.placementManager = placementManager;
    this.syncManager = syncManager;

    this.standbyDiv = this.createStandbyDiv();

    this.parentDiv.appendChild(syncManager.parentDiv);
    this.parentDiv.appendChild(placementManager.parentDiv);

    this.state = {
      placed: false,
      synced: false
    };

    this.placeInfo = null;
  }

  start() {
    // 1. Display screens
    this.parentDiv.classList.remove('hidden');
    this.syncManager.parentDiv.classList.remove('hidden');
    
    // 2. When sync is started…
    this.syncManager.on('sync_started', () => {
      this.syncManager.parentDiv.classList.add('hidden');
      this.placementManager.parentDiv.classList.remove('hidden');
    });

    // 3.1 When placement is ready…
    this.placementManager.on('placement_ready', (placeInfo) => {
      this.state.placed = true;
      this.placeInfo = placeInfo;

      this.placementManager.parentDiv.classList.add('hidden');

      if (!this.state.synced)
        this.standbyDiv.classList.remove('hidden');
      else {
        this.emit('setup_ready', this.placeInfo);
        this.parentDiv.classList.add('hidden');
      }
    });

    // 3.2 When sync is ready…
    this.syncManager.on('sync_ready', () => {
      this.state.synced = true;
      if (this.state.placed) {
        this.emit('setup_ready', this.placeInfo);
        this.parentDiv.classList.add('hidden');
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

    this.parentDiv.appendChild(standbyDiv);

    return standbyDiv;
  }
}

module.exports = ClientSetupManagerPlacementAndSync;