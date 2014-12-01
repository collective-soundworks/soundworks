ServerTopologyModel = require("./ServerTopologyModel");

'use strict';

var ServerTopologyModelSimpleMatrix = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(ServerTopologyModelSimpleMatrix, super$0);var proto$0={};
  function ServerTopologyModelSimpleMatrix(matrixProperties, readyCallback) { // TODO: refactor (make it prettier), convert to private variables.
    super$0.call(this, readyCallback);

    var X = matrixProperties.X,
      Y = matrixProperties.Y,
      spacingX = matrixProperties.spacingX || 2,
      spacingY = matrixProperties.spacingY || 2,
      marginX = matrixProperties.marginX || spacingX / 2,
      marginY = matrixProperties.marginY || spacingY / 2;

    this.height = spacingY * (Y - 1) + 2 * marginY;
    this.width = spacingX * (X - 1) + 2 * marginX;
    this.X = X;
    this.Y = Y;
    this.__indices = [];

    var count = 1;

    for (var j = 0; j < Y; j++) {
      for (var i = 0; i < X; i++) {
        this.__positions.push([(marginX + i * spacingX) / this.width, (marginY + j * spacingY) / this.height]);
        this.__labels.push(count.toString());
        this.__indices.push([i, j]);
        count++;
      }
    }

    this.__readyCallback();
  }if(super$0!==null)SP$0(ServerTopologyModelSimpleMatrix,super$0);ServerTopologyModelSimpleMatrix.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":ServerTopologyModelSimpleMatrix,"configurable":true,"writable":true}});DP$0(ServerTopologyModelSimpleMatrix,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.getTopology = function() {
    return {
      "labels": this.__labels,
      "positions": this.__positions,
      "height": this.height,
      "width": this.width,
      "X": this.X,
      "Y": this.Y,
      "indices": this.__indices
    };
  };
MIXIN$0(ServerTopologyModelSimpleMatrix.prototype,proto$0);proto$0=void 0;return ServerTopologyModelSimpleMatrix;})(ServerTopologyModel);

module.exports = ServerTopologyModelSimpleMatrix;