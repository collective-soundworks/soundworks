/**
 * @fileoverview Soundworks client side check-in module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');

class ClientCheckin extends ClientModule {
  constructor(options = {}) {
    super('checkin', true, options.color);

    this.select = options.select || 'automatic'; // 'automatic' | 'label' | 'position'

    switch (this.select) {
      case 'automatic':
        this.order = options.order || 'ascending'; // 'ascending' | 'random'
        break;

      case 'label':
        break;

      case 'position':
        break;
    }

    this.index = null;
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

      case 'position':
        this._startSelectPosition();
        break;
    }
  }

  _startSelectAutomatic() {
    client.send('checkin:automatic:request', this.order);

    client.receive('checkin:automatic:acknowledge', (index, label) => {
      this.index = index;

      if (label) {
        this.label = label;

        let htmlContent = "<p>Go to</p>" +
          "<div class='checkin-label circled'><span>" + this.label + "</span></div>" +
          "<p><small>Touch the screen<br/>when you are ready.</small></p>";

        this.setCenteredViewContent(htmlContent);

        this.view.addEventListener('click', () => {
          this.done();
        });
      } else {
        this.done();
      }
    });

    client.receive('checkin:automatic:unavailable', () => {
      this.setCenteredViewContent("<p>Sorry, we cannot accept any more players at the moment, please try again later.</p>");
    });
  }

  _startSelectLabel() {
    client.send('checkin:label:request');

    // not yet implemented
    client.receive('checkin:label:options', (options) => {
      // TODO: construct selection from options and let the user select a label
      this.label = null;

      client.send('checkin:label:set', this.label);
    });

    client.receive('checkin:label:acknowledge', (index) => {
      this.index = index;
      this.done();
    });
  }

  _startSelectPosition() {
    client.send('checkin:position:request');

    // not yet implemented
    client.receive('checkin:position:acknowledge', (index, surface) => {
      this.index = index;

      // TODO: display surface and let the user select a position
      this.position = null;

      // send selected position to server
      client.send('checkin:position:set', this.position);
    });

    client.receive('checkin:position:unavailable', () => {
      this.setCenteredViewContent("<p>Sorry, we cannot accept any more players at the moment, please try again later.</p>");
    });
  }
}

module.exports = ClientCheckin;