/**
 * @fileoverview Soundworks client side module base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var container = window.container || (window.container = document.getElementById('container'));

class ClientModule extends EventEmitter {
  constructor(id, display = true) {
    super();

    this.displayDiv = null;

    if (display) {
      var moduleWrapper = document.createElement('div');
      moduleWrapper.setAttribute('id', id);
      moduleWrapper.classList.add('module');
      
      this.displayDiv = moduleWrapper;
    }

    this.isDone = false;
  }

  start() {
    if (this.displayDiv)
      container.appendChild(this.displayDiv);
  }

  done() {
    if (this.displayDiv)
      container.removeChild(this.displayDiv);

    if (!this.isDone) {
      this.isDone = true;
      this.emit('done', this);
    }
  }
}

module.exports = ClientModule;