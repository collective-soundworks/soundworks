ServerTopologyModel = require("./ServerTopologyModel");

'use strict';

class ServerTopologyModelSimpleMatrix extends ServerTopologyModel {
  constructor(matrixProperties, readyCallback) { // TODO: refactor (make it prettier), convert to private variables.
    super(readyCallback);

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

    for (let j = 0; j < Y; j++) {
      for (let i = 0; i < X; i++) {
        this.__positions.push([(marginX + i * spacingX) / this.width, (marginY + j * spacingY) / this.height]);
        this.__labels.push(count.toString());
        this.__indices.push([i, j]);
        count++;
      }
    }

    this.__readyCallback();
  }

  getTopology() {
    return {
      "labels": this.__labels,
      "positions": this.__positions,
      "height": this.height,
      "width": this.width,
      "X": this.X,
      "Y": this.Y,
      "indices": this.__indices
    };
  }
}

module.exports = ServerTopologyModelSimpleMatrix;