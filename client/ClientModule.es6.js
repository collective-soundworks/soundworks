/**
 * @fileoverview Soundworks client side module base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var container = window.container || (window.container = document.getElementById('container'));

class ClientModule extends EventEmitter {
  constructor(id, hasDisplay = true) {
    super();

    this.view = null;

    if (hasDisplay) {
      var div = document.createElement('div');
      div.setAttribute('id', id);
      div.classList.add('module');
      
      this.view = div;
    }

    this.isDone = false;
  }

  start() {
    if (this.view)
      container.appendChild(this.view);
  }

  done() {
    if (this.view)
      container.removeChild(this.view);

    if (!this.isDone) {
      this.isDone = true;
      this.emit('done', this);
    }
  }
}

module.exports = ClientModule;