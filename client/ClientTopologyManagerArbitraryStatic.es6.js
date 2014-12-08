'use strict';

var ClientTopologyManager = require('./ClientTopologyManager');
var ioClient = require("./ioClient");

class ClientTopologyManagerArbitraryStatic extends ClientTopologyManager {
  constructor(params) {
    super();

    var useDisplay = (params && params.display);

    var socket = ioClient.socket;
    socket.on('init_topology', (topology) => {
      this.topology = topology;

      if (useDisplay) {
        var div = this.parentDiv;
        var topologyRatio = topology.height / topology.width;
        var screenHeight = window.innerHeight;
        var screenWidth = window.innerWidth;
        var screenRatio = screenHeight / screenWidth;
        var topologyHeightPx;
        var topologyWidthPx;

        if (screenRatio > topologyRatio) { // TODO: refine sizes, with container, etc.
          topologyHeightPx = screenWidth * topologyRatio;
          topologyWidthPx = screenWidth;
        } else {
          topologyHeightPx = screenHeight;
          topologyWidthPx = screenHeight / topologyRatio;
        }

        var tileSize = topologyWidthPx / this.topology.X;
        var tileMargin = tileSize / 10;

        div.style.height = topologyHeightPx + "px";
        div.style.width = topologyWidthPx + "px";

        var positions = topology.positions;

        for (let i = 0; i < positions.length; i++) {
          let tile = document.createElement('div');
          tile.classList.add('tile');
          tile.setAttribute('data-place', i);
          tile.setAttribute('data-x', positions[i][0]);
          tile.setAttribute('data-y', positions[i][1]);
          tile.style.height = tileSize - 2 * tileMargin + "px";
          tile.style.width = tileSize - 2 * tileMargin + "px";
          tile.style.left = positions[i][0] * topologyWidthPx - (tileSize - 2 * tileMargin) / 2 + "px";
          tile.style.top = positions[i][1] * topologyHeightPx - (tileSize - 2 * tileMargin) / 2 + "px";
          div.appendChild(tile);
        }
      }

      this.emit("topology_update", topology);
    });
  }

  getTileByPlace(place) {
    var tiles = Array.prototype.slice.call(this.parentDiv.childNodes); // .childNode returns a NodeList
    var index = tiles.map((t) => parseInt(t.dataset.place)).indexOf(place);
    return tiles[index];
  }

  addClassToTile(tilePlace, className) {
    var tile = this.getTileByPlace(tilePlace);
    if (tile)
      tile.classList.add(className);
    else
      console.log("Error: tile " + tilePlace + " not found.");
  }

  removeClassFromTile(tilePlace, className) {
    var tile = this.getTileByPlace(tilePlace);
    if (tile)
      tile.classList.remove(className);
    else
      console.log("Error: tile " + tilePlace + " not found.");
  }
}

module.exports = ClientTopologyManagerArbitraryStatic;