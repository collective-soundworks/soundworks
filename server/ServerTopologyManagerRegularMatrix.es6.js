ServerTopologyManager = require("./ServerTopologyManager");

'use strict';

class ServerTopologyManagerRegularMatrix extends ServerTopologyManager {
  constructor(matrixParams) { // TODO: refactor (make it prettier), convert to private variables.
    super();

    var X = matrixParams.X,
      Y = matrixParams.Y,
      spacingX = matrixParams.spacingX || 2,
      spacingY = matrixParams.spacingY || 2,
      marginX = matrixParams.marginX || spacingX / 2,
      marginY = matrixParams.marginY || spacingY / 2;

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

module.exports = ServerTopologyManagerRegularMatrix;