ServerTopologyManager = require("./ServerTopologyManager");

'use strict';

class ServerTopologyManagerRegularMatrix extends ServerTopologyManager {
  constructor(matrixParams) {
    super();

    this.X = matrixParams.X;
    this.Y = matrixParams.Y;
    this.spacingX = matrixParams.spacingX || 2;
    this.spacingY = matrixParams.spacingY || 2;
    this.marginX = matrixParams.marginX || this.spacingX / 2;
    this.marginY = matrixParams.marginY || this.spacingY / 2;
  }

  init() {
    this.height = this.spacingY * (this.Y - 1) + 2 * this.marginY;
    this.width = this.spacingX * (this.X - 1) + 2 * this.marginX;

    var count = 1;

    for (let j = 0; j < this.Y; j++) {
      for (let i = 0; i < this.X; i++) {
        this.positions.push([(this.marginX + i * this.spacingX) / this.width, (this.marginY + j * this.spacingY) / this.height]);
        this.labels.push(count.toString());
        count++;
      }
    }

    this.emit('topology_update');
  }

  sendInit(socket) {
    socket.emit('init_topology', {
      "X": this.X,
      "Y": this.Y,
      "height": this.height,
      "width": this.width,
      "labels": this.labels,
      "positions": this.positions,
    });
  }
}

module.exports = ServerTopologyManagerRegularMatrix;