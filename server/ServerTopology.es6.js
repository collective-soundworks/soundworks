/**
 * @fileoverview Matrix server side topology manager creating regular matrices
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require("./ServerModule");

class ServerTopology extends ServerModule {
  constructor(namespaces, params = {}) {
    super(namespaces);

    this.type = params.type || 'matrix';

    this.labels = [];
    this.positions = [];
    this.width = 1;
    this.height = 1;

    if (this.type === 'matrix')
      this.__initMatrixParams(params);
  }

  init() {
    if (this.type === 'matrix')
      this.__initMatrix();

    this.emit('topology_init');
  }

  connect(client) {
    client.socket.on('topology_request', () => {
      client.socket.emit('topology_init', {
        "labels": this.labels,
        "positions": this.positions,
        "width": this.width,
        "height": this.height,
        "maxWidthDivision": this.cols,
        "maxHeightDivision": this.rows
      });
    });
  }

  disconnect(client) {

  }

  getNumPlaces() {
    return this.labels.length;
  }

  getLabel(index) {
    if (index < this.labels.length)
      return this.labels[index];

    return (index + 1).toString();
  }

  __initMatrixParams(params) {
    this.cols = params.cols || 3;
    this.rows = params.rows || 4;
    this.colSpacing = params.colSpacing || 2;
    this.rowSpacing = params.rowSpacing || 2;
    this.colMargin = params.colMargin || this.colSpacing / 2;
    this.rowMargin = params.rowMargin || this.rowSpacing / 2;
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

module.exports = ServerTopology;