/**
 * @fileoverview Matrix client side topology manager displaying arbitrary static topologies
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require("./client");

class ClientTopology extends ClientModule {
  constructor(params = {}) {
    super('topology', params.display || false);

    this.topology = null;
  }

  start() {
    super.start();

    var socket = client.socket;
    socket.on('topology_init', (topology) => {
      this.__init(topology);
      this.emit("topology_init", topology);
    });

    socket.emit('topology_request');
  }

  __init(topology) {
    this.topology = topology;

    var div = this.displayDiv;

    if (div) {
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

      var xTileSize = topologyWidthPx / this.topology.maxWidthDivision;
      var yTileSize = topologyHeightPx / this.topology.maxHeightDivision;
      var tileSize = Math.min(xTileSize, yTileSize);

      var tileMargin = tileSize / 10;

      div.style.height = topologyHeightPx + "px";
      div.style.width = topologyWidthPx + "px";

      var positions = topology.positions;

      for (let i = 0; i < positions.length; i++) {
        let tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-index', i);
        tile.setAttribute('data-x', positions[i][0]);
        tile.setAttribute('data-y', positions[i][1]);
        tile.style.height = tileSize - 2 * tileMargin + "px";
        tile.style.width = tileSize - 2 * tileMargin + "px";
        tile.style.left = positions[i][0] * topologyWidthPx - (tileSize - 2 * tileMargin) / 2 + "px";
        tile.style.top = positions[i][1] * topologyHeightPx - (tileSize - 2 * tileMargin) / 2 + "px";
        div.appendChild(tile);
      }
    }
  }

  displayPlayer(index, visible = true, className = 'player') {
    if (this.displayDiv) {
      var tiles = Array.prototype.slice.call(this.displayDiv.childNodes); // .childNode returns a NodeList
      var tileIndex = tiles.map((t) => parseInt(t.dataset.index)).indexOf(index);
      var tile = tiles[tileIndex];

      if (tile) {
        if (visible)
          tile.classList.add(className);
        else
          tile.classList.remove(className);
      }
    }
  }
}

module.exports = ClientTopology;