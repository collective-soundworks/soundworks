var ClientTopologyDisplay = require('./ClientTopologyDisplay');

'use strict';

class ClientTopologyDisplayMatrix extends ClientTopologyDisplay {
  constructor(topology, parent) {
    super(topology, parent);

    this.__height = topology.height;
    this.__width = topology.width;

    this.__X = topology.X;
    this.__Y = topology.Y;

    var topologyRatio = this.__height / this.__width;
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

    var tileSize = topologyWidthPx / this.__X;
    var tileMargin = tileSize / 10;

    this.__parent.style.height = topologyHeightPx + "px";
    this.__parent.style.width = topologyWidthPx + "px";

    for (let i = 0; i < this.__positions.length; i++) {
      let tile = document.createElement('div');
      tile.classList.add('tile');
      tile.setAttribute('data-place', i);
      tile.setAttribute('data-x', this.__positions[i][0]);
      tile.setAttribute('data-y', this.__positions[i][1]);
      tile.style.height = tileSize - 2 * tileMargin + "px";
      tile.style.width = tileSize - 2 * tileMargin + "px";
      tile.style.left = this.__positions[i][0] * topologyWidthPx - (tileSize - 2 * tileMargin) / 2 + "px";
      tile.style.top = this.__positions[i][1] * topologyHeightPx - (tileSize - 2 * tileMargin) / 2 + "px";
      this.__parent.appendChild(tile);
    }
  }

  addClassToTile(tilePlace, className) {
    var tile = this.getTileByPlace(tilePlace);
    if(tile)
      tile.classList.add(className);
    else
      console.log("Error: tile " + tilePlace + " not found.");
  }

  getTileByPlace(place) {
    var tiles = Array.prototype.slice.call(this.__parent.childNodes); // .childNode returns a NodeList
    var index = tiles.map((t) => parseInt(t.dataset.place)).indexOf(place);
    return tiles[index];
  }

  removeClassFromTile(tilePlace, className) {
    var tile = this.getTileByPlace(tilePlace);
    if(tile)
      tile.classList.remove(className);
    else
      console.log("Error: tile " + tilePlace + " not found.");
  }  
}

module.exports = ClientTopologyDisplayMatrix;