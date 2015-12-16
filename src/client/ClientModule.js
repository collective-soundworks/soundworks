import { EventEmitter } from 'events';
import comm from './comm';
import View from './display/View';

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

    for (let next of this.modules) {
      if (mod !== null)
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
  }

  showNext(fromIndex) {
    const length = this.modules.length;

    for (let i = 0; i < length; i++) {
      const mod = this.modules[i];
      const isVisible = mod.show();
      if (isVisible) { break; }
    }
  }

  createPromise() {
    const promises = [];

    this.modules.forEach((mod, index) => {
      const promise = mod.createPromise();
      // hide all modules except the first one
      mod.hide();
      promise.then(() => { this.showNext(); });
      promises.push(promise);
    });

    this.showNext();

    return Promise.all(promises);
  }

  launch() {
    for (let mod of this.modules)
      mod.launch();
  }
}

/**
 * [client] Base class used to create any *Soundworks* module on the client side.
 *
 * Each module should have a {@link Module#start}, a {@link Module#reset}, a {@link Module#restart} and a {@link Module#done} methods.
 *
 * The base class optionally creates a view (a fullscreen `div` accessible through the {@link Module.view} attribute).
 * The view is added to the DOM (as a child of the `#container` element) when the module is started (with the {@link Module#start} method), and removed when the module calls its {@link Module#done} method.
 *
 * (See also {@link src/server/Module.js~Module} on the server side.)
 *
 * **Note:** a more complete example of how to write a module is in the [Example](manual/example.html) section.
 *
 * @example class MyModule extends Module {
 *   constructor(options = {}) {
 *     // This example module:
 *     // - always has a view
 *     // - has the id and class 'my-module-name'
 *     // - and uses the background color defined in the argument 'options' (if any).
 *     super('my-module-name', true, options.color || 'alizarin');
 *
 *     ... // anything the constructor needs
 *   }
 *
 *   start() {
 *     super.start();
 *
 *     // Whatever the module does (communication with the server, etc.)
 *     // ...
 *
 *     // Call the `done` method when the module has finished its initialization
 *     this.done();
 *   }
 * }
 * @todo Move example in the manual?
 */
export default class ClientModule extends Promised {
  /**
   * @param {String} name Name of the module (used as the `id` and CSS class of the `view` DOM element if it exists).
   * @param {Boolean} [createView=true] Indicates whether the module displays a `view` or not.
   * @param {[type]} [color='black'] Background color of the `view` when it exists.
   */
  constructor(name, options = {}) { // TODO: change to colorClass?
    super();

    this._bypass = options.bypass || false;

    /**
     * Name of the module.
     * @type {String}
     */
    this.name = name;

    /**
     * View of the module.
     * @type {View}
     */
    this.view = null;

    /**
     * Events to bind to the view. (cf. Backbone's syntax).
     * @type {Object}
     */
    this.events = {};

    /**
     * Additionnal options to pass to the view.
     * @type {Object}
     */
    this.viewOptions = options.viewOptions || {};

    /**
     * Defines a view constructor to be used in createDefaultView
     * @type {View}
     */
    this.viewCtor = options.viewCtor || View;

    /** @private */
    this._template = null;

    // bind com methods to the instance.
    this.send = this.send.bind(this);
    this.receive = this.receive.bind(this);
    this.removeListener = this.removeListener.bind(this);
  }

  /**
   * Share the defined templates with all `ClientModule` instances.
   * @param {Object} defs - An object containing the templates.
   * @private
   */
  static setViewTemplateDefinitions(defs) {
    ClientModule.prototype.templateDefinitions = defs;
  }

  /**
   * Share the text content configuration (name and data) with all the `ClientModule` instances
   * @param {Object} defs - The text contents of the application.
   * @private
   */
  static setViewContentDefinitions(defs) {
    ClientModule.prototype.contentDefinitions = defs;
  }

  /**
   * Sets the container of the views for all `ClientModule` instances.
   * @param {Element} $el - The element to use as a container for the module's view.
   */
  static setViewContainer($el) {
    ClientModule.prototype.$container = $el;
  }

  /**
   * Returns the template associated to the current module.
   * @returns {Function} - The template related to the `name` of the current module.
   */
  get template() {
    const template = this._template || this.templateDefinitions[this.name];
    // if (!template)
    //   throw new Error(`No template defined for module "${this.name}"`);
    return template;
  }

  set template(tmpl) {
    this._template = tmpl;
  }

  /**
   * Returns the text associated to the current module.
   * @returns {Object} - The text contents related to the `name` of the current module. The returned object is extended with a pointer to the `_globals` entry of the defined text contents.
   */
  get content() {
    const content = this._content || this.contentDefinitions[this.name];
    if (!content)
      throw new Error(`No content defined for module "${this.name}"`);

    content._globals = this.contentDefinitions._globals;
    return content;
  }

  set content(obj) {
    this._content = obj;
  }

  /**
   * Create a default view from module attributes.
   */
  createDefaultView() {
    const options = Object.assign({ id: this.name, className: 'module' }, this.viewOptions);
    return new this.viewCtor(this.template, this.content, this.events, options);
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
   * Handle the logic and steps that lead to the initialization of the module.
   *
   * For instance, it takes care of the communication with the module on the server side by sending WebSocket messages and setting up WebSocket message listeners.
   *
   * Additionally, if the module has a `view`, the `start` method creates the corresponding HTML element and appends it to the DOM’s main container element (`div#container`).
   *
   * **Note:** the method is called automatically when necessary, you should not call it manually.
   * @abstract
   */
  start() {
    // allow to bypass a module from its options
    if (this._bypass) { this.done(); }

    if (!this._isStarted) {
      if (this.view) {
        this.view.render();
        this.view.appendTo(this.$container);
      }

      this._isStarted = true;
    }
  }

  /**
   * Restart the module.
   *
   * The method is called automatically when a lost connection with the server is resumed (for instance because of a server crash), if the module had already finished its initialization (*i.e.* if it had called its {@link Module#done} method).
   * The method should send to the server the current state of the module.
   *
   * (Indeed, if the server crashes, it will reset all the information it has about all the clients.
   * On the client side, the modules that had finished their initialization process should send their state to the server so that it can be up to date with the real state of the scenario.)
   *
   * For instance, this method in the {@link Locator} module sends the coordinates of the client to the server.
   *
   * **Note:** the method is called automatically when necessary, you should not call it manually.
   * @abstract
   */
  restart() {
    this._isDone = false;
  }

  /**
   * Reset the module to the state it had before calling the {@link Module#start} method.
   *
   * The method is called automatically when a lost connection with the server is resumed (for instance because of a server crash), if the module had not finished its initialization (*i.e.* if it had not called its {@link Module#done} method).
   * In that case, the module cleans whatever it was doing and starts again from scratch.
   *
   * **Note:** the method is called automatically when necessary, you should not call it manually.
   * @abstract
   */
  reset() {
    if (this.view) {
      this.view.remove();
    }

    // this.init();
    this._isStarted = false;
  }

  /**
   * Should be called when the module has finished its initialization (*i.e.* when the module has done its duty, or when it may run in the background for the rest of the scenario after it finished its initialization process), to allow subsequent steps of the scenario to start.
   *
   * For instance, the {@link Loader} module calls its {@link Module#done} method when files are loaded, and the {@link Sync} module calls it when the first synchronization process is finished (while the module keeps running in the background afterwards).
   * As an exception, the last module of the scenario (usually the {@link Performance} module) may not call its {@link Module#done} method.
   *
   * If the module has a `view`, the `done` method removes it from the DOM.
   *
   * **Note:** you should not override this method.
   */
  done() {
    this._isDone = true;

    if (this.view)
      this.view.remove();

    if (this.resolvePromised)
      this.resolvePromised();
  }

  // /**
  //  * Set an arbitrary centered HTML content to the module's `view` (if any).
  //  * @param {String} htmlContent The HTML content to append to the `view`.
  //  */
  // setCenteredViewContent(htmlContent) {
  //   if (this.view) {
  //     if (!this._centeredViewContent) {
  //       let contentDiv = document.createElement('div');

  //       contentDiv.classList.add('centered-content');
  //       this.view.appendChild(contentDiv);

  //       this._centeredViewContent = contentDiv;
  //     }

  //     if (htmlContent) {
  //       if (htmlContent instanceof HTMLElement) {
  //         if (this._centeredViewContent.firstChild) {
  //           this._centeredViewContent.removeChild(this._centeredViewContent.firstChild);
  //         }

  //         this._centeredViewContent.appendChild(htmlContent);
  //       } else {
  //         // is a string
  //         this._centeredViewContent.innerHTML = htmlContent;
  //       }
  //     }
  //   }
  // }

  // /**
  //  * Removes the centered HTML content (set by {@link Module#setCenteredViewContent}) from the `view`.
  //  */
  // removeCenteredViewContent() {
  //   if (this.view && this._centeredViewContent) {
  //     this.view.removeChild(this._centeredViewContent);
  //     delete this._centeredViewContent;
  //   }
  // }

  /**
   * `z-index` CSS property of the view.
   * @todo - prepend would do the trick ?
   * @param {Number} value Value of the `z-index`.
   */
  set zIndex(value) {
    if (this.view) {
      this.view.$el.style.zIndex = value;
    }
  }

  show() {
    if (this.view && !this._isDone) {
      if (!this.view.isVisible) {
        this.view.show();
      }

      return true;
    }

    return false;
  }

  hide() {
    if (this.view && !this._done) { this.view.hide(); }
  }

  /**
   * Sends a WebSocket message to the server side socket.
   * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(channel, ...args) {
    comm.send(`${this.name}:${channel}`, ...args)
  }

  /**
   * Sends a WebSocket message to the server side socket.
   * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  sendVolatile(channel, ...args) {
    comm.sendVolatile(`${this.name}:${channel}`, ...args)
  }

  /**
   * Listen a WebSocket message from the server.
   * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive(channel, callback) {
    comm.receive(`${this.name}:${channel}`, callback);
  }

  /**
   * Stop listening to a message from the server.
   * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
   * @param {...*} callback - The callback to cancel.
   */
  removeListener(channel, callback) {
    comm.removeListener(`${this.name}:${channel}`, callback);
  }
}

ClientModule.sequential = function(...modules) {
  return new Sequential(modules);
};

ClientModule.parallel = function(...modules) {
  return new Parallel(modules);
};
