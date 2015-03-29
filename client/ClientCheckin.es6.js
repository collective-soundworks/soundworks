/**
 * @fileoverview Soundworks client side check-in module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');

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

      if(coordinates)
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

    // not yet implemented
    client.receive('checkin:location:acknowledge', (index, surface) => {
      client.index = index;

      // TODO: display surface and let the participant select his or her location
      client.coordinates = null;

      // send the coordinates of the selected location to server
      client.send('checkin:location:set', client.coordinates);
    });

    client.receive('checkin:location:unavailable', () => {
      this.setCenteredViewContent("<p>Sorry, we cannot accept any more connections at the moment, please try again later.</p>");
    });
  }
}

module.exports = ClientCheckin;