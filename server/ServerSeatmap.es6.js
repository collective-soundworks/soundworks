/**
 * @fileoverview Soundworks server side seat map module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require("./ServerModule");

class ServerSeatmap extends ServerModule {
  constructor(options = {}) {
    super();

    this.type = options.type || 'matrix';

    this.labels = [];
    this.positions = [];
    this.width = 1;
    this.height = 1;

    if (this.type === 'matrix') {
      this.__initMatrixParams(options);
      this.__initMatrix();
    }
  }

  connect(client) {
    client.socket.on('seatmap_request', () => {
      client.socket.emit('seatmap_init', {
        "labels": this.labels,
        "positions": this.positions,
        "width": this.width,
        "height": this.height,
        "maxWidthDivision": this.cols,
        "maxHeightDivision": this.rows
      });
    });
  }

  getNumPlaces() {
    return this.labels.length;
  }

  getLabel(index) {
    if (index < this.labels.length)
      return this.labels[index];

    return (index + 1).toString();
  }

  __initMatrixParams(options) {
    this.cols = options.cols || 3;
    this.rows = options.rows || 4;
    this.colSpacing = options.colSpacing || 2;
    this.rowSpacing = options.rowSpacing || 2;
    this.colMargin = options.colMargin || this.colSpacing / 2;
    this.rowMargin = options.rowMargin || this.rowSpacing / 2;
  }

  __initMatrix() {
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
  }
}

module.exports = ServerSeatmap;