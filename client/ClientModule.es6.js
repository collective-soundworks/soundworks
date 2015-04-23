/**
 * @fileoverview Soundworks client side module base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var client = require('./client');
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

    this.clientListeners = [];
    this.isDone = false;
  }

  addClientListener(msg, callback) {
    this.clientListeners.push({
      msg: msg,
      callback: callback
    });
  }

  removeAllClientListeners() {
    for (let listener of this.clientListeners) {
      client.removeListener(listener.msg, listener.callback);
    }

    this.clientListeners = [];
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
      this.removeAllClientListeners();
      this.emit('done', this);
    }
  }

  setCenteredViewContent(htmlContent) {
    if (this.view) {
      if (!this._centeredViewContent) {
        let contentDiv = document.createElement('div');

        contentDiv.classList.add('centered-content');
        this.view.appendChild(contentDiv);

        this._centeredViewContent = contentDiv;
      }

      if (htmlContent) {
        this._centeredViewContent.innerHTML = htmlContent;
      }
    }
  }

  removeCenteredViewContent() {
    if (this.view && this._centeredViewContent) {
      this.view.removeChild(this._centeredViewContent);
      delete this._centeredViewContent;
    }
  }
}

module.exports = ClientModule;