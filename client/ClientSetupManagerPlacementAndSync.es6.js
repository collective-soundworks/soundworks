'use strict';

window.container = window.container || document.getElementById('container'); // TODO: make module?
var ClientSetupManager = require('./ClientSetupManager');

class ClientSetupManagerPlacementAndSync extends ClientSetupManager {
  constructor(placementManager, syncManager) {
    super();

    this.placementManager = placementManager;
    this.syncManager = syncManager;

    this.standbyDiv = this.createStandbyDiv();
    this.parentDiv.appendChild(placementManager.parentDiv);

    this.state = {
      placed: false,
      synced: false
    };

    this.placeInfo = null;
  }

  start() {
    this.welcomeDiv.addEventListener('click', () => {
      this.activateWebAudioAPI();
      this.syncManager.start();
      this.welcomeDiv.classList.add('hidden');
    });

    // 1. Display screens
    this.parentDiv.classList.remove('hidden');
    this.welcomeDiv.classList.remove('hidden');

    // 2. When sync is started…
    this.syncManager.on('sync_started', () => {
      this.placementManager.start();
    });

    // 3.1 When placement is ready…
    this.placementManager.on('placement_ready', (placeInfo) => {
      this.state.placed = true;
      this.placeInfo = placeInfo;

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

      this.standbyDiv.classList.add('hidden');

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
    var div = document.createElement('div');

    div.setAttribute('id', 'standby');
    div.classList.add('info');
    div.classList.add('hidden');

    div.innerHTML = "<p>Finishing setup&hellip;</p>";

    this.parentDiv.appendChild(div);

    return div;
  }
}

module.exports = ClientSetupManagerPlacementAndSync;