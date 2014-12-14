/**
 * @fileoverview Matrix client side topology manager displaying arbitrary static topologies
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientTopology = require('./ClientTopology');
var ioClient = require("./ioClient");

class ClientTopologyGeneric extends ClientTopology {
  constructor(params) {
    super(params);
  }

  init(topology) {
    super.init(topology);

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
  }

  displayPlayer(place, visible = true, className = 'player') {
    if (this.displayDiv) {
      var tiles = Array.prototype.slice.call(this.displayDiv.childNodes); // .childNode returns a NodeList
      var index = tiles.map((t) => parseInt(t.dataset.place)).indexOf(place);
      var tile = tiles[index];

      if (tile) {
        if (visible)
          tile.classList.add(className);
        else
          tile.classList.remove(className);
      }
    }
  }
}

module.exports = ClientTopologyGeneric;