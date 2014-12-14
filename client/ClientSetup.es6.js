/**
 * @fileoverview Matrix client side setup manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var container = window.container = window.container || document.getElementById('container');

class ClientSetup extends EventEmitter {
  constructor(params = {}) {
    this.displayDiv = null;

    if (params.display !== false) {
      var div = document.createElement('div');
      div.setAttribute('id', 'setup');
      div.classList.add('info');
      div.classList.add('fullscreen');
      div.classList.add('hidden');
      container.appendChild(div);
      this.displayDiv = div;
    }

    this.ok = false;
  }

  start() {
    if (this.displayDiv)
      this.displayDiv.classList.remove('hidden');
  }

  done() {
    if (this.displayDiv)
      this.displayDiv.classList.add('hidden');

    this.ok = true;
    this.emit('done', this);
  }
}

module.exports = ClientSetup;