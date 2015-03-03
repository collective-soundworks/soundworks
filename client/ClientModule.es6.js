/**
 * @fileoverview Soundworks client side module base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var container = window.container || (window.container = document.getElementById('container'));

class ClientModule extends EventEmitter {
  constructor(name, hasView = true, viewColor = 'black') {
    super();

    this.view = null;
    this.viewContent = null;

    if (hasView) {
      var div = document.createElement('div');
      div.setAttribute('id', name);
      div.classList.add(name);
      div.classList.add('module');
      div.classList.add(viewColor);

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

  __createViewContent() {
    if (this.view) {
      let centeredDiv = document.createElement('div');
      centeredDiv.classList.add('centered-content');
      this.view.appendChild(centeredDiv);
      this.viewContent = centeredDiv;
    }
  }
}

module.exports = ClientModule;