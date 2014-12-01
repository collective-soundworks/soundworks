var ClientTopologyDisplay = require('./ClientTopologyDisplay');

'use strict';

var ClientTopologyDisplayMatrix = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(ClientTopologyDisplayMatrix, super$0);var proto$0={};
  function ClientTopologyDisplayMatrix(topology, parent) {
    super$0.call(this, topology, parent);

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

    for (var i = 0; i < this.__positions.length; i++) {
      var tile = document.createElement('div');
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
  }if(super$0!==null)SP$0(ClientTopologyDisplayMatrix,super$0);ClientTopologyDisplayMatrix.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":ClientTopologyDisplayMatrix,"configurable":true,"writable":true}});DP$0(ClientTopologyDisplayMatrix,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.addClassToTile = function(tilePlace, className) {
    var tile = this.getTileByPlace(tilePlace);
    if(tile)
      tile.classList.add(className);
    else
      console.log("Error: tile " + tilePlace + " not found.");
  };

  proto$0.getTileByPlace = function(place) {
    var tiles = Array.prototype.slice.call(this.__parent.childNodes); // .childNode returns a NodeList
    var index = tiles.map(function(t)  {return parseInt(t.dataset.place)}).indexOf(place);
    return tiles[index];
  };

  proto$0.removeClassFromTile = function(tilePlace, className) {
    var tile = this.getTileByPlace(tilePlace);
    if(tile)
      tile.classList.remove(className);
    else
      console.log("Error: tile " + tilePlace + " not found.");
  };  
MIXIN$0(ClientTopologyDisplayMatrix.prototype,proto$0);proto$0=void 0;return ClientTopologyDisplayMatrix;})(ClientTopologyDisplay);

module.exports = ClientTopologyDisplayMatrix;