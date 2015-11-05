'use strict';

const EventEmitter = require('events').EventEmitter;
const container = window.container || (window.container = document.getElementById('container'));

/**
 * @private
 */
class Promised extends EventEmitter {
  constructor() {
    super();
    /**
     * [resolvePromised description]
     * @todo description
     * @type {function}
     * @private
     */
    this.resolvePromised = null;
  }

  createPromise() {
    return new Promise((resolve) => this.resolvePromised = resolve);
  }

  launch() {

  }
}

/**
 * @private
 */
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

/**
 * @private
 */
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

/**
 * The {@link ClientModule} base class is used to create a *Soundworks* module on the client side.
 * Each module should have a {@link ClientModule#start} and a {@link ClientModule#done} method.
 * The {@link ClientModule#done} method must be called when the module can hand over the control to the subsequent modules (*i.e.* when the module has done its duty, or when it may run in the background for the rest of the scenario after it finished its initialization process).
 * The base class optionally creates a view — a fullscreen `div` accessible through the {@link ClientModule.view} attribute — that is added to the DOM when the module is started and removed when the module calls its {@link ClientModule#done} method.
 * (Specifically, the `view` element is added to the `#container` DOM element.)
 *
 * @example
 * class MyModule extends ClientModule {
 *   constructor(options = {}) {
 *     // Here, MyModule would always have a view,
 *     // with the id and class 'my-module-name',
 *     // and possibly the background color
 *     // defined by the argument 'options'.
 *     super('my-module-name', true, options.color || 'alizarin');
 *
 *     ... // anything the constructor needs
 *   }
 *
 *   start() {
 *     super.start();
 *
 *     ... // what the module has to do
 *         // (communication with the server, etc.)
 *
 *     this.done(); // call this method when the module can
 *                  // hand over the control to a subsequent module
 *   }
 * }
 */
class ClientModule extends Promised {
// export default class ClientModule extends Promised {
  /**
   * Creates an instance of the class.
   * @param {String} name Name of the module (used as the `id` and CSS class of the `view` if it exists).
   * @param {Boolean} [createView=true] Indicates whether the module has and displays a `view` or not.
   * @param {[type]} [color='black'] Background color of the `view` when it exists.
   */
  constructor(name, createView = true, color = 'black') { // TODO: change to colorClass?
    super();

    /**
     * Name of the module.
     * @type {String}
     */
    this.name = name;

    /**
     * View of the module.
     * The view is a DOM element (a full screen `div`) in which the content of the module is displayed.
     * This element is a child of the main container `div#container`, which is the only child of the `body` element.
     * A module may or may not have a view, as indicated by the argument `hasView:Boolean` of the {@link ClientModule#constructor}.
     * When that is the case, the view is created and added to the DOM when the {@link ClientModule#start} method is called, and is removed from the DOM when the {@link ClientModule#done} method is called.
     * @type {DOMElement}
     */
    this.view = null;

    this._ownsView = false;
    this._showsView = false;
    this._isStarted = false;
    this._isDone = false;

    if (createView) {
      var div = document.createElement('div');
      div.setAttribute('id', name);
      div.classList.add(name);
      div.classList.add('module');
      div.classList.add(color);

      this.view = div;
      this._ownsView = true;
    }
  }

  /**
   * Handles the logic of the module on the client side.
   * For instance, it takes care of the communication with the module on the server side by sending WebSocket messages and setting up WebSocket message listeners.
   * Additionally, if the module has a `view`, the `start` method creates the corresponding HTML element and appends it to the DOM’s main container element (`div#container`).
   *
   * **Note:** the method is called automatically when necessary, you should not call it manually.
   * @abstract
   */
  start() {
    if(!this._isStarted) {
      if (this.view) {
        container.appendChild(this.view);
        this._showsView = true;
      }

      this._isStarted = true;
    }
  }

  /**
   * Resets the module to the state it had before calling the {@link ClientModule#start} method.
   *
   * **Note:** the method is called automatically when necessary (for instance to reset the module after a server crash if the module had not called its {@link ClientModule#done} method yet), you should not call it manually.
   * @abstract
   */
  reset() {
    this._isStarted = false;
  }

  /**
   * Restarts the module.
   *
   * **Note:** the method is called automatically when necessary (for instance to restart the module after a server crash if the module had already called its {@link ClientModule#done} method), you should not call it manually.
   * @abstract
   */
  restart() {
    this._isDone = false;
  }

  /**
   * @private
   */
  launch() {
    if (this._isDone) {
      this.restart();
    } else {
      if (this._isStarted)
        this.reset();

      this.start();
    }
  }

  /**
   * Should be called when the module can hand over the control to a subsequent module (for instance at the end of the `start` method you write).
   * If the module has a `view`, the `done` method removes it from the DOM.
   *
   * **Note:** you should not override this method.
   */
  done() {
    this._isDone = true;

    if (this.view && this._showsView && this._ownsView) {
      container.removeChild(this.view);
      this._showsView = false;
    }

    if (this.resolvePromised)
      this.resolvePromised();
  }

  /**
   * Set an arbitrary centered HTML content to the module's `view`.
   * The method should be called only if the module has a `view`.
   * @param {String} htmlContent The HTML content to append to the `view`.
   */
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

  /**
   * Removes the centered HTML content (set by {@link ClientModule#setCenteredViewContent}) from the `view`.
   */
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
