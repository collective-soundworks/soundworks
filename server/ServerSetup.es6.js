/**
 * @fileoverview Soundworks server side seat map module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require("./ServerModule");

class ServerSetup extends ServerModule {
  constructor(options = {}) {
    super(options.name || 'setup');

    this.width = 1;
    this.height = 1;
    this.spacing = 1;
    this.labels = [];
    this.coordinates = [];

    this.specific = {};
  }

  connect(client) {
    super.connect(client);

    client.receive('setup:request', () => {
      client.send('setup:init', {
        "width": this.width,
        "height": this.height,
        "spacing": this.spacing,
        "labels": this.labels,
        "coordinates": this.coordinates
      });
    });
  }

  getNumPositions() {
    if(this.labels.length || this.coordinates.length) {
      var numLabels = this.labels.length || Infinity;
      var numPositions = this.coordinates.length || Infinity;

      return Math.min(numLabels, numPositions);
    }
    
    return 0;
  }

  getLabel(index) {
    if (index < this.labels.length)
      return this.labels[index];

    return (index + 1).toString();
  }

  getCoordinates(index) {
    if (index < this.coordinates.length)
      return this.coordinates[index];

    return null;
  }

  generate(type, params = {}) {
    switch (type) {
      case 'matrix':
        var cols = params.cols || 3;
        var rows = params.rows || 4;
        var colSpacing = params.colSpacing || 1;
        var rowSpacing = params.rowSpacing || 1;
        var colMargin = params.colMargin || colSpacing / 2;
        var rowMargin = params.rowMargin || rowSpacing / 2;

        this.specific.matrix = {};
        this.specific.matrix.cols = cols;
        this.specific.matrix.rows = rows;

        this.width = colSpacing * (cols - 1) + 2 * colMargin;
        this.height = rowSpacing * (rows - 1) + 2 * rowMargin;
        this.spacing = Math.min(colSpacing, rowSpacing);

        var count = 0;

        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            count++;

            var label = count.toString();
            var coordinates = [(colMargin + i * colSpacing) / this.width, (rowMargin + j * rowSpacing) / this.height];

            this.labels.push(label);
            this.coordinates.push(coordinates);
          }
        }

        break;

      default:
        break;
    }
  }
}

module.exports = ServerSetup;