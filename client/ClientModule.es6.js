/**
 * @fileoverview Soundworks client side module base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var client = require('./client');
var container = window.container || (window.container = document.getElementById('container'));

class ClientModule extends EventEmitter {
  constructor(name, hasView = true, color = 'black') {
    super();

    this.hasView = hasView;
    this.view = null;
    this.name = name;

    if (hasView) {
      var div = document.createElement('div');
      div.setAttribute('id', name);
      div.classList.add(name);
      div.classList.add('module');
      div.classList.add(color);

      this.view = div;
    }

    this.isStarted = false;
    this.isDone = false;
    this.isRestarted = false;
  }

  start() {
    this.isStarted = true;

    if (this.view)
      container.appendChild(this.view);
  }

  reset() {
    if (this.isStarted && !this.isDone && this.view && !!this.view.parentNode)
      container.removeChild(this.view);

    this.isStarted = false;
  }

  restart() {
    this.isDone = false;
    this.isRestarted = true;
  }

  launch() {
    if (this.isDone === true) {
      this.restart();
    } else {
      if (this.isStarted === true)
        this.reset();

      this.start();
    }
  }

  done() {
    if (this.hasView && this.view && !this.isRestarted)
      container.removeChild(this.view);

    if (!this.isDone) {
      this.isDone = true;
      this.emit('done', this);
    }
  }

  setZIndex(zIndex) {
    this.view.style.zIndex = zIndex;
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