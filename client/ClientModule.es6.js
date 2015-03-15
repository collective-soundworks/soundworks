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

  setCenteredViewContent(htmlContent) {
    if (this.view) {
      if (!this.__centeredViewContent) {
        let contentDiv = document.createElement('div');

        contentDiv.classList.add('centered-content');
        this.view.appendChild(contentDiv);

        this.__centeredViewContent = contentDiv;
      }

      if (htmlContent) {
        this.__centeredViewContent.innerHTML = htmlContent;
      }
    }
  }

  removeCenteredViewContent() {
    if (this.view && this.__centeredViewContent) {
      this.view.removeChild(this.__centeredViewContent);
      delete this.__centeredViewContent;
    }
  }
}

module.exports = ClientModule;