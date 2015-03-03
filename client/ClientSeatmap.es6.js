/**
 * @fileoverview Soundworks client side seat map module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require("./client");

class ClientSeatmap extends ClientModule {
  constructor(options = {}) {
    super('seatmap', false);

    this.map = null;
  }

  start() {
    super.start();

    var socket = client.socket;

    socket.emit('seatmap_request');

    socket.on('seatmap_init', (map) => {
      this.map = map;
      this.done();
    });
  }

  display(div) {
    if (this.map) {
      div.classList.add('seatmap');
      var mapRatio = this.map.height / this.map.width;
      var screenHeight = window.innerHeight;
      var screenWidth = window.innerWidth;
      var screenRatio = screenHeight / screenWidth;
      var mapHeightPx;
      var mapWidthPx;

      if (screenRatio > mapRatio) { // TODO: refine sizes, with container, etc.
        mapHeightPx = screenWidth * mapRatio;
        mapWidthPx = screenWidth;
      } else {
        mapHeightPx = screenHeight;
        mapWidthPx = screenHeight / mapRatio;
      }

      var xTileSize = mapWidthPx / this.map.maxWidthDivision;
      var yTileSize = mapHeightPx / this.map.maxHeightDivision;
      var tileSize = Math.min(xTileSize, yTileSize);

      var tileMargin = tileSize / 10;

      div.style.height = mapHeightPx + "px";
      div.style.width = mapWidthPx + "px";

      var positions = this.map.positions;

      for (let i = 0; i < positions.length; i++) {
        let tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-index', i);
        tile.setAttribute('data-x', positions[i][0]);
        tile.setAttribute('data-y', positions[i][1]);
        tile.style.height = tileSize - 2 * tileMargin + "px";
        tile.style.width = tileSize - 2 * tileMargin + "px";
        tile.style.left = positions[i][0] * mapWidthPx - (tileSize - 2 * tileMargin) / 2 + "px";
        tile.style.top = positions[i][1] * mapHeightPx - (tileSize - 2 * tileMargin) / 2 + "px";
        div.appendChild(tile);
      }
    }
  }

  addClassToTile(div, index, className = 'player') {
    var tiles = Array.prototype.slice.call(div.childNodes); // .childNode returns a NodeList
    var tileIndex = tiles.map((t) => parseInt(t.dataset.index)).indexOf(index);
    var tile = tiles[tileIndex];

    if (tile)
      tile.classList.add(className);
  }

  removeClassFromTile(div, index, className = 'player') {
    var tiles = Array.prototype.slice.call(div.childNodes); // .childNode returns a NodeList
    var tileIndex = tiles.map((t) => parseInt(t.dataset.index)).indexOf(index);
    var tile = tiles[tileIndex];

    if (tile)
      tile.classList.remove(className);
  }
}

module.exports = ClientSeatmap;