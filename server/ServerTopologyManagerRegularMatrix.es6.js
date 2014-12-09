'use strict';

var ServerTopologyManager = require("./ServerTopologyManager");

class ServerTopologyManagerRegularMatrix extends ServerTopologyManager {
  constructor(params) {
    super();

    this.cols = params.cols || params.X;
    this.rows = params.rows || params.Y;
    this.colSpacing = params.colSpacing || 2;
    this.rowSpacing = params.rowSpacing || 2;
    this.colMargin = params.colMargin || this.colSpacing / 2;
    this.rowMargin = params.rowMargin || this.rowSpacing / 2;
  }

  init() {
    this.width = this.colSpacing * (this.cols - 1) + 2 * this.colMargin;
    this.height = this.rowSpacing * (this.rows - 1) + 2 * this.rowMargin;

    var count = 0;

    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        count++;

        var label = count.toString();
        var position = [(this.colMargin + i * this.colSpacing) / this.width, (this.rowMargin + j * this.rowSpacing) / this.height];

        this.labels.push(label);
        this.positions.push(position);
      }
    }

    this.emit('topology_init');
  }

  sendInit(socket) {
    socket.emit('topology_init', {
      "width": this.width,
      "height": this.height,
      "maxWidthDivision": this.cols,
      "maxHeightDivision": this.rows,
      "labels": this.labels,
      "positions": this.positions,
    });
  }
}

module.exports = ServerTopologyManagerRegularMatrix;