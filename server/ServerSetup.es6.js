/**
 * @fileoverview Soundworks server side seat map module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require("./ServerModule");

class ServerSetup extends ServerModule {
  constructor(options = {}) {
    super();

    this.width = 1;
    this.height = 1;
    this.spacing = 1;
    this.labels = [];
    this.positions = [];
  }

  connect(client) {
    super.connect(client);

    client.receive('setup:request', () => {
      client.send('setup:init', {
        "width": this.width,
        "height": this.height,
        "spacing": this.spacing,
        "labels": this.labels,
        "positions": this.positions,
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

  getPosition(index) {
    if (index < this.positions.length)
      return this.positions[index];

    return null;
  }

  generate(type, options = {}) {
    switch (type) {
      case 'matrix':
        var cols = options.cols || 3;
        var rows = options.rows || 4;
        var colSpacing = options.colSpacing || 1;
        var rowSpacing = options.rowSpacing || 1;
        var colMargin = options.colMargin || this.colSpacing / 2;
        var rowMargin = options.rowMargin || this.rowSpacing / 2;

        this.width = colSpacing * (this.cols - 1) + 2 * colMargin;
        this.height = rowSpacing * (this.rows - 1) + 2 * rowMargin;
        this.spacing = Math.min(colSpacing, rowSpacing);

        var count = 0;

        for (let j = 0; j < this.rows; j++) {
          for (let i = 0; i < this.cols; i++) {
            count++;

            var label = count.toString();
            var position = [(colMargin + i * colSpacing) / this.width, (rowMargin + j * rowSpacing) / this.height];

            this.labels.push(label);
            this.positions.push(position);
          }
        }

        break;

      default:
        break;
    }
  }
}

module.exports = ServerSetup;