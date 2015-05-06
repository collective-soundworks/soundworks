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

class ClientCheckin extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'checkin', true, options.color);

    this.select = options.select || 'automatic'; // 'automatic' | 'label' | 'location'
    this.instructions = options.instructions || instructions;
    this.setup = options.setup || null;
    this.showBackground = options.showBackground || false;

    switch (this.select) {
      case 'automatic':
        this.order = options.order || 'ascending'; // 'ascending' | 'random'
        break;

      case 'label':
        break;

      case 'location':
        break;
    }

    this.label = null;

    this._touchStartHandler = this._touchStartHandler.bind(this);
    this._touchMoveHandler = this._touchMoveHandler.bind(this);
    this._touchEndHandler = this._touchEndHandler.bind(this);

    this._positionRadius = 20;
  }

  start() {
    super.start();

    switch (this.select) {
      case 'automatic':
        this._startSelectAutomatic();
        break;

      case 'label':
        this._startSelectLabel();
        break;

      case 'location':
        this._startSelectLocation();
        break;
    }
  }

  _startSelectAutomatic() {
    client.send('checkin:automatic:request', this.order);

    client.receive('checkin:automatic:acknowledge', (index, label, coordinates) => {
      client.index = index;

      if (coordinates)
        client.coordinates = coordinates;

      if (label) {
        this.label = label;

        let htmlContent = this.instructions(label);

        this.setCenteredViewContent(htmlContent);

        this.view.addEventListener('click', () => {
          this.done();
        });
      } else {
        this.done();
      }
    });

    client.receive('checkin:automatic:unavailable', () => {
      this.setCenteredViewContent("<p>Sorry, we cannot accept any more connections at the moment, please try again later.</p>");
    });
  }

  _startSelectLabel() {
    client.send('checkin:label:request');

    // not yet implemented
    client.receive('checkin:label:options', (options) => {
      // TODO: construct selection from options and let the participant select a label
      this.label = null;

      client.send('checkin:label:set', this.label);
    });

    client.receive('checkin:label:acknowledge', (index) => {
      client.index = index;
      this.done();
    });
  }

  _startSelectLocation() {
    client.send('checkin:location:request');

    client.receive('checkin:location:acknowledge', (index, surface) => {
      client.index = index;

      // Display surface
      let surfaceDiv = document.createElement('div');
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

      surfaceDiv.setAttribute('id', 'surface');
      surfaceDiv.classList.add('surface');
      // surfaceDiv.style.height = heightPx + "px";
      // surfaceDiv.style.width = widthPx + "px";
      this._surfaceDiv = surfaceDiv;

      this.setup.display(surfaceDiv, {
        showBackground: this.showBackground
      });

      this.view.appendChild(surfaceDiv);

      // Let the participant select his or her location
      surfaceDiv.addEventListener('touchstart', this._touchStartHandler, false);
      // surfaceDiv.addEventListener('mousedown', this._touchStartHandler, false);
      surfaceDiv.addEventListener('touchmove', this._touchMoveHandler, false);
      // surfaceDiv.addEventListener('mousemove', this._touchMoveHandler, false);
      surfaceDiv.addEventListener('touchend', this._touchEndHandler, false);
      // surfaceDiv.addEventListener('mouseup', this._touchEndHandler, false);

      // Display explanatory text
      let textDiv = document.createElement('div');
      textDiv.classList.add('centered-content');

      let text = document.createElement('p');
      text.innerHTML = "<small>Indicate your location on the map and click &ldquo;OK&rdquo;.</small>"

      let button = document.createElement('div');
      button.classList.add('btn');
      button.classList.add('disabled');
      button.innerHTML = "OK";
      this._button = button;

      textDiv.appendChild(text);
      textDiv.appendChild(button);
      this.view.appendChild(textDiv);

      // Send the coordinates of the selected location to server
      button.addEventListener('click', () => {
        if (client.coordinates !== null) {
          button.classList.add('selected');
          client.send('checkin:location:set', client.coordinates);
          this.done();
        }
      }, false);
    });

    client.receive('checkin:location:unavailable', () => {
      this.setCenteredViewContent("<p>Sorry, we cannot accept any more connections at the moment, please try again later.</p>");
    });
  }

  _touchStartHandler(e) {
    e.preventDefault();

    if (!this._positionDiv) {
      let positionDiv = document.createElement('div');
      positionDiv.setAttribute('id', 'position');
      positionDiv.classList.add('position');
      positionDiv.style.width = this._positionRadius * 2 + "px";
      positionDiv.style.height = this._positionRadius * 2 + "px";
      this._positionDiv = positionDiv;
      this._surfaceDiv.appendChild(this._positionDiv);

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

    client.coordinates = [x, y];

    // TODO: handle out-of-bounds
  }
}

module.exports = ClientCheckin;