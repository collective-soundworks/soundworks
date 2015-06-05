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
    super(options.name || 'checkin', options.hasView || true, options.color);

    this.instructions = options.instructions || instructions;

    this.index = -1;
    this.label = null;
    this._bypassView = options.bypassView || false;

    this._acknowledgementHandler = this._acknowledgementHandler.bind(this);
    this._unavailableHandler = this._unavailableHandler.bind(this);
    this._viewClickHandler = this._viewClickHandler.bind(this);
  }

  start() {
    super.start();

    client.send(this.name + ':request');

    client.receive(this.name + ':acknowledge', this._acknowledgementHandler);
    client.receive(this.name + ':unavailable', this._unavailableHandler);
  }

  reset() {
    super.reset();

    client.removeListener(this.name + ':acknowledge', this._acknowledgementHandler);
    client.removeListener(this.name + ':unavailable', this._unavailableHandler);
    this.view.removeEventListener('click', this._viewClickHandler, false);
  }

  restart() {
    super.restart();

    client.send(this.name + ':restart', this.index, this.label, client.coordinates);
    this.done();
  }

  _acknowledgementHandler(index, label, coordinates) {
    this.index = index;

    if (coordinates)
      client.coordinates = coordinates;

    if (label) {
      this.label = label;

      if (!this._bypassView) {
        let htmlContent = this.instructions(label);
        this.setCenteredViewContent(htmlContent);
        this.view.addEventListener('click', this._viewClickHandler, false);
      } else {
        this.done();
      }

    } else {
      this.done();
    }
  }

  _unavailableHandler() {
    this.setCenteredViewContent("<p>Sorry, we cannot accept any more connections at the moment, please try again later.</p>");
  }

  _viewClickHandler() {
    this.done();
  }
}

module.exports = ClientCheckin;