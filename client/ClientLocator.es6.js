/**
 * @fileoverview Soundworks client side check-in module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');
var input = require('./input');

function instructions(label) {
  return "<p>Go to</p>" +
    "<div class='checkin-label circled'><span>" + label + "</span></div>" +
    "<p><small>Touch the screen<br/>when you are ready.</small></p>";
}

class ClientLocator extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'locator', true, options.color);

    this.select = options.select || 'automatic'; // 'automatic' | 'label' | 'location'
    this.instructions = options.instructions || instructions;
    this.setup = options.setup || null;
    this.showBackground = options.showBackground ||  false;

    this.label = null;

    this._touchStartHandler = this._touchStartHandler.bind(this);
    this._touchMoveHandler = this._touchMoveHandler.bind(this);
    this._touchEndHandler = this._touchEndHandler.bind(this);
    this._sendCoordinates = this._sendCoordinates.bind(this);
    this._surfaceHandler = this._surfaceHandler.bind(this);

    this._currentCoordinates = null;
    this._positionRadius = 20;

    // Explanatory text
    let textDiv = document.createElement('div');
    textDiv.classList.add('message');
    let text = document.createElement('p');
    // text.innerHTML = "<small>Indicate your location on the map and click &ldquo;OK&rdquo;.</small>";
    text.innerHTML = "<small>Indiquez votre position sur le plan</small>";
    this._textDiv = textDiv;
    this._text = text;

    // Button
    let button = document.createElement('div');
    button.classList.add('btn');
    button.classList.add('disabled');
    button.innerHTML = "VALIDER";
    this._button = button;

    // Position circle
    let positionDiv = document.createElement('div');
    positionDiv.setAttribute('id', 'position');
    positionDiv.classList.add('position');
    positionDiv.classList.add('hidden');
    positionDiv.style.width = this._positionRadius * 2 + "px";
    positionDiv.style.height = this._positionRadius * 2 + "px";
    this._positionDiv = positionDiv;

    // Surface div
    let surfaceDiv = document.createElement('div');
    surfaceDiv.setAttribute('id', 'surface');
    surfaceDiv.classList.add('surface');
    this._surfaceDiv = surfaceDiv;

    this._textDiv.appendChild(this._text);
    this._textDiv.appendChild(this._button);
    this._surfaceDiv.appendChild(this._positionDiv);

    this._resize = this._resize.bind(this);
  }

  start() {
    super.start();

    client.send(this.name + ':request');
    client.receive(this.name + ':surface', this._surfaceHandler, false);

    window.addEventListener('resize', this._resize);
  }

  done() {
    window.removeEventListener('resize', this._resize);
    super.done();
  }

  reset() {
    client.coordinates = null;

    this._positionDiv.classList.add('hidden');
    this._button.classList.add('disabled');

    this._button.removeEventListener('click', this._sendCoordinates, false);
    this._surfaceDiv.removeEventListener('touchstart', this._touchStartHandler, false);
    this._surfaceDiv.removeEventListener('touchmove', this._touchMoveHandler, false);
    this._surfaceDiv.removeEventListener('touchend', this._touchEndHandler, false);

    // TODO: clean surface properly
    if (this.setup)
      this.setup.reset();
  }

  restart() {
    super.restart();
    client.send(this.name + ':restart', client.coordinates);
    this._button.removeEventListener('click', this._sendCoordinates, false);
    this.done();
  }

  _surfaceHandler(surface) {
    let heightWidthRatio = surface.height / surface.width;
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

    this.setup.display(this._surfaceDiv, {
      showBackground: this.showBackground
    });

    // Let the participant select his or her location
    this._surfaceDiv.addEventListener('touchstart', this._touchStartHandler, false);
    this._surfaceDiv.addEventListener('touchmove', this._touchMoveHandler, false);
    this._surfaceDiv.addEventListener('touchend', this._touchEndHandler, false);

    // Build text & button interface after receiving and displaying the surface
    this.view.appendChild(this._surfaceDiv);
    this.view.appendChild(this._textDiv);

    this._resize();
    // Send the coordinates of the selected location to server
    this._button.addEventListener('click', this._sendCoordinates, false);
  }

  _resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const orientation = width > height ? 'landscape' : 'portrait';
    this.view.classList.remove('landscape', 'portrait');
    this.view.classList.add(orientation);

    const min = Math.min(width, height);

    this._surfaceDiv.style.width = `${min}px`;
    this._surfaceDiv.style.height = `${min}px`;

    switch (orientation) {
      case 'landscape' :
        this._textDiv.style.height = `${height}px`;
        this._textDiv.style.width = `${width - height}px`;
        break;
      case 'portrait':
        this._textDiv.style.height = `${height - width}px`;
        this._textDiv.style.width = `${width}px`;
        break;
    }
  }

  _sendCoordinates() {
    if (this._currentCoordinates !== null) {
      this._button.classList.add('selected');
      client.coordinates = this._currentCoordinates;
      client.send(this.name + ':coordinates', client.coordinates);
      this.done();
    }
  }

  _touchStartHandler(e) {
    e.preventDefault();

    if (this._positionDiv.classList.contains('hidden')) {
      this._positionDiv.classList.remove('hidden');
      this._button.classList.remove('disabled');
    }

    // TODO: handle mirror
    this._positionDiv.style.left = e.changedTouches[0].clientX - this._positionRadius + "px";
    this._positionDiv.style.top = e.changedTouches[0].clientY - this._positionRadius + "px";
  }

  _touchMoveHandler(e) {
    e.preventDefault();

    // TODO: handle mirror
    this._positionDiv.style.left = e.changedTouches[0].clientX - this._positionRadius + "px";
    this._positionDiv.style.top = e.changedTouches[0].clientY - this._positionRadius + "px";

    // TODO: handle out-of-bounds
  }

  _touchEndHandler(e) {
    e.preventDefault();

    // TODO: handle mirror
    this._positionDiv.style.left = e.changedTouches[0].clientX - this._positionRadius + "px";
    this._positionDiv.style.top = e.changedTouches[0].clientY - this._positionRadius + "px";

    let x = (e.changedTouches[0].clientX - this._surfaceDiv.offsetLeft) / this._surfaceDiv.offsetWidth;
    let y = (e.changedTouches[0].clientY - this._surfaceDiv.offsetTop) / this._surfaceDiv.offsetHeight;

    this._currentCoordinates = [x, y];

    // TODO: handle out-of-bounds
  }
}

module.exports = ClientLocator;