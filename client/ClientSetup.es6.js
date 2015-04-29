/**
 * @fileoverview Soundworks client side seat map module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');

class ClientSetup extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'setup', false);

    this.width = 1;
    this.height = 1;
    this.spacing = 1;
    this.labels = [];
    this.coordinates = [];
    this.type = undefined;

    this._xFactor = 1;
    this._yFactor = 1;
  }

  start() {
    super.start();

    client.send('setup:request');

    client.receive('setup:init', (setup) => {
      this.width = setup.width;
      this.height = setup.height;
      this.spacing = setup.spacing;
      this.labels = setup.labels;
      this.coordinates = setup.coordinates;
      this.type = setup.type;

      this.done();
    });
  }

  display(div, options = {}) {
    div.classList.add('setup');

    if (options && options.transform){
      switch (options.transform) {
        case 'rotate180':
          div.setAttribute('data-xfactor', -1);
          div.setAttribute('data-yfactor', -1);
          break;

        case 'flipX':
          div.setAttribute('data-xfactor', -1);
          div.setAttribute('data-yfactor', 1);
          break;

        case 'flipY':
          div.setAttribute('data-xfactor', 1);
          div.setAttribute('data-yfactor', -1);
          break;

        default:
          div.setAttribute('data-xfactor', 1);
          div.setAttribute('data-yfactor', 1);
          break;
      }
    } 

    let heightWidthRatio = this.height / this.width;
    let screenHeight = window.innerHeight;
    let screenWidth = window.innerWidth;
    let screenRatio = screenHeight / screenWidth;
    let heightPx, widthPx;

    if (screenRatio > heightWidthRatio) { // TODO: refine sizes, with container, etc.
      heightPx = screenWidth * heightWidthRatio;
      widthPx = screenWidth;
    } else {
      heightPx = screenHeight;
      widthPx = screenHeight / heightWidthRatio;
    }

    div.style.height = heightPx + "px";
    div.style.width = widthPx + "px";

    switch (this.type) {
      case 'matrix':
        let positionWidth = widthPx / this.width * this.spacing;
        let positionHeight = heightPx / this.height * this.spacing;
        let positionSize = 0.75 * Math.min(positionWidth, positionHeight);
        let coordinates = this.coordinates;

        this.addPositionPlaceholders(div, coordinates, positionSize);
        break;

      case 'surface':
        // todo
        break;
    }

  }

  addPositionPlaceholders(div, coordinates, size) {
    let containerHeight = div.offsetHeight;
    let containerWidth = div.offsetWidth;

    for (let i = 0; i < coordinates.length; i++) {
      let position = document.createElement('div');
      position.classList.add('position');

      let xOffset = position.coordinates[0] * containerWidth;
      let yOffset = position.coordinates[1] * containerHeight;
      let xFactor = parseInt(div.dataset.xfactor);
      let yFactor = parseInt(div.dataset.yfactor);

      position.setAttribute('data-index', i);
      position.style.height = size + "px";
      position.style.width = size + "px";
      positionDiv.style.left = 0.5 * containerWidth - (0.5 * containerWidth - xOffset) * xFactor - size * 0.5 + "px";
      positionDiv.style.top = 0.5 * containerHeight - (0.5 * containerHeight - yOffset) * yFactor - size * 0.5 + "px";

      div.appendChild(position);
    }
  }

  addPositions(div, positions, size) {
    let containerHeight = div.offsetHeight;
    let containerWidth = div.offsetWidth;

    for (let position of positions) {
      let positionDiv = document.createElement('div');
      positionDiv.classList.add('position');
      positionDiv.classList.add('player');

      let xOffset = position.coordinates[0] * containerWidth;
      let yOffset = position.coordinates[1] * containerHeight;
      let xFactor = parseInt(div.dataset.xfactor);
      let yFactor = parseInt(div.dataset.yfactor);

      positionDiv.setAttribute('data-index', position.index);
      positionDiv.style.height = size + "px";
      positionDiv.style.width = size + "px";
      positionDiv.style.left = 0.5 * containerWidth - (0.5 * containerWidth - xOffset) * xFactor - size * 0.5 + "px";
      positionDiv.style.top = 0.5 * containerHeight - (0.5 * containerHeight - yOffset) * yFactor - size * 0.5 + "px";

      div.appendChild(positionDiv);
    }
  }

  removePositions(div, positions) { // TODO: remove div;
    for (let position of positions) {
      let positionDiv = document.querySelector('[data-index="' + position.index + '"]');
      if (!!positionDiv)
        positionDiv.parentNode.removeChild(positionDiv);
    }
  }

  addClassToPosition(div, index, className) {
    var positions = Array.prototype.slice.call(div.childNodes); // .childNode returns a NodeList
    var positionIndex = positions.map((t) => parseInt(t.dataset.index)).indexOf(index);
    var position = positions[positionIndex];

    if (position)
      position.classList.add(className);
  }

  removeClassFromPosition(div, index, className) {
    var positions = Array.prototype.slice.call(div.childNodes); // .childNode returns a NodeList
    var positionIndex = positions.map((t) => parseInt(t.dataset.index)).indexOf(index);
    var position = positions[positionIndex];

    if (position)
      position.classList.remove(className);
  }
}

module.exports = ClientSetup;