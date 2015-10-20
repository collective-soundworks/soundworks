'use strict';

const EventEmitter = require('events').EventEmitter;
const container = window.container || (window.container = document.getElementById('container'));

class Promised extends EventEmitter {
  constructor() {
    this.resolvePromised = null;
  }

  createPromise() {
    return new Promise((resolve) => this.resolvePromised = resolve);
  }

  launch() {

  }
}

class Sequential extends Promised {
  constructor(modules) {
    super();

    this.modules = modules;
  }

  createPromise() {
    let mod = null;
    let promise = null;

    for(let next of this.modules) {
      if(mod !== null)
        promise.then(() => next.launch());

      mod = next;
      promise = mod.createPromise();
    }

    return promise;
  }

  launch() {
    return this.modules[0].launch();
  }
}

class Parallel extends Promised {
  constructor(modules) {
    super();

    this.modules = modules;

    // set z-index of parallel modules
    let zIndex = modules.length;
    for(let mod of modules) {
      mod.zIndex = zIndex;
      zIndex--;
    }
  }

  createPromise() {
    return Promise.all(this.modules.map((mod) => mod.createPromise()));
  }

  launch() {
    for(let mod of this.modules)
      mod.launch();
  }
}

export default class ClientModule extends Promised {
  constructor(name, createView = true, color = 'black') { // TODO: change to colorClass?
    super();

    this.name = name;

    this.view = null;
    this.ownsView = false;
    this.showsView = false;

    if (createView) {
      var div = document.createElement('div');
      div.setAttribute('id', name);
      div.classList.add(name);
      div.classList.add('module');
      div.classList.add(color);

      this.view = div;
      this.ownsView = true;
    }

    this.isStarted = false;
    this.isDone = false;
  }

  start() {
    if(!this.isStarted) {
      if (this.view) {
        container.appendChild(this.view);
        this.showsView = true;
      }

      this.isStarted = true;
    }
  }

  reset() {
    this.isStarted = false;
  }

  restart() {
    this.isDone = false;
  }

  launch() {
    if (this.isDone) {
      this.restart();
    } else {
      if (this.isStarted)
        this.reset();

      this.start();
    }
  }

  done() {
    this.isDone = true;

    if (this.view && this.showsView && this.ownsView) {
      container.removeChild(this.view);
      this.showsView = false;
    }

    if (this.resolvePromised)
      this.resolvePromised();
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
        if (htmlContent instanceof HTMLElement) {
          if (this._centeredViewContent.firstChild) {
            this._centeredViewContent.removeChild(this._centeredViewContent.firstChild);
          }

          this._centeredViewContent.appendChild(htmlContent);
        } else {
          // is a string
          this._centeredViewContent.innerHTML = htmlContent;
        }
      }
    }
  }

  removeCenteredViewContent() {
    if (this.view && this._centeredViewContent) {
      this.view.removeChild(this._centeredViewContent);
      delete this._centeredViewContent;
    }
  }

  set zIndex(value) {
    if(this.view)
      this.view.style.zIndex = value;
  }
}

ClientModule.sequential = function(...modules) {
  return new Sequential(modules);
};

ClientModule.parallel = function(...modules) {
  return new Parallel(modules);
};

module.exports = ClientModule;
