/**
 * @fileoverview Soundworks server side setup module
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

    this.type = undefined;
  }

  connect(client) {
    super.connect(client);

    client.receive('setup:request', () => {
      client.send('setup:init', {
        "width": this.width,
        "height": this.height,
        "spacing": this.spacing,
        "labels": this.labels,
        "coordinates": this.coordinates,
        "type": this.type
      });
    });
  }

  getCoordinates(index) {
    if (index < this.coordinates.length)
      return this.coordinates[index];

    return null;
  }

  getLabel(index) {
    if (index < this.labels.length)
      return this.labels[index];

    return (index + 1).toString();
  }

  getNumPositions() {
    if(this.labels.length || this.coordinates.length) {
      var numLabels = this.labels.length || Infinity;
      var numPositions = this.coordinates.length || Infinity;

      return Math.min(numLabels, numPositions);
    }
    
    return 0;
  }

  getSurface() {
    let surface = {
      height: this.height,
      width: this.width
      // TODO: allow other shapes
    }

    return surface;
  }

  generate(type, params = {}) {
    this.type = type;

    switch (type) {
      case 'matrix':
        let cols = params.cols || 3;
        let rows = params.rows || 4;
        let colSpacing = params.colSpacing || 1;
        let rowSpacing = params.rowSpacing || 1;
        let colMargin = params.colMargin || colSpacing / 2;
        let rowMargin = params.rowMargin || rowSpacing / 2;

        this.specific.matrix = {};
        this.specific.matrix.cols = cols;
        this.specific.matrix.rows = rows;

        this.width = colSpacing * (cols - 1) + 2 * colMargin;
        this.height = rowSpacing * (rows - 1) + 2 * rowMargin;
        this.spacing = Math.min(colSpacing, rowSpacing);

        let count = 0;

        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            count++;

            let label = count.toString();
            let coordinates = [(colMargin + i * colSpacing) / this.width, (rowMargin + j * rowSpacing) / this.height];

            this.labels.push(label);
            this.coordinates.push(coordinates);
          }
        }

        break;

      case 'surface':
        let height = params.height || 4;
        let width = params.width || 6;

        this.height = height;
        this.width = width;

        // TODO: allow other shapes
        break;

      default:
        break;
    }
  }
}

module.exports = ServerSetup;