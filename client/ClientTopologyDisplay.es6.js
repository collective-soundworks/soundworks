var utils = require('./ClientUtils');

'use strict';

class ClientTopologyDisplay {
  constructor(topology, parent) {
    this.__labels = topology.labels;
    this.__positions = topology.positions;

    this.__height = this.getTopoHeight();
    this.__width = this.getTopoWidth();

    this.__parent = parent;
  }

  getTopoHeight() {
    var max = utils.getMaxOfArray(this.__positions.map((p) => p[1]));
    var min = utils.getMinOfArray(this.__positions.map((p) => p[1]));
    var height = max - min;

    return height;
  }

  getTopoWidth() {
    var max = utils.getMaxOfArray(this.__positions.map((p) => p[0]));
    var min = utils.getMinOfArray(this.__positions.map((p) => p[0]));
    var width = max - min;

    return width;
  }
}

module.exports = ClientTopologyDisplay;