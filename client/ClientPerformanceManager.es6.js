'use strict';

class ClientPerformanceManager {
  constructor(inputManager, performanceGui) {
    this.__label = null;
    this.__place = null;
    this.__position = null;

    this.__inputManager = inputManager;
    this.__performanceGui = performanceGui;
  }

  start(placeInfo) {
    this.__label = placeInfo.label;
    this.__place = placeInfo.place;
    this.__position = placeInfo.position;

    if (this.__performanceGui)
      this.__performanceGui.display();
  }

}

module.exports = ClientPerformanceManager;