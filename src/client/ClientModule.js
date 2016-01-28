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

  showNext() {
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

    // /**
    //  * Name of the module.
    //  * @type {String}
    //  */
    // this.name = name;

    // /**
    //  * View of the module.
    //  * @type {View}
    //  */
    // this.view = null;

    // /**
    //  * Events to bind to the view. (cf. Backbone's syntax).
    //  * @type {Object}
    //  */
    // this.events = {};

    // /**
    //  * Additionnal options to pass to the view.
    //  * @type {Object}
    //  */
    // this.viewOptions = options.viewOptions || {};

    // /**
    //  * Defines a view constructor to be used in `createView`.
    //  * @type {View}
    //  */
    // this.viewCtor = options.viewCtor || View;

    // /** @private */
    // this._template = null;

    // bind com methods to the instance.
    // this.send = this.send.bind(this);
    // this.receive = this.receive.bind(this);
    // this.removeListener = this.removeListener.bind(this);

    /**
     * For module lifecycle. Is set to true when the module starts and back to false when `done`
     * @type {boolean}
     * @private
     */
    this._isActive = false;

    /**
     * For module lifecycle. Is set to true when done for the first time.
     * Allow to resync with server without restarting the module.
     * @type {boolean}
     * @private
     */
    this._isDone = false;
  }

  // MOVED TO ACTIVITY
  // /**
  //  * Share the defined templates with all `ClientModule` instances.
  //  * @param {Object} defs - An object containing the templates.
  //  * @private
  //  */
  // static setViewTemplateDefinitions(defs) {
  //   ClientModule.prototype.templateDefinitions = defs;
  // }

  // /**
  //  * Share the text content configuration (name and data) with all the `ClientModule` instances
  //  * @param {Object} defs - The text contents of the application.
  //  * @private
  //  */
  // static setViewContentDefinitions(defs) {
  //   ClientModule.prototype.contentDefinitions = defs;
  // }

  // /**
  //  * Sets the container of the views for all `ClientModule` instances.
  //  * @param {Element} $el - The element to use as a container for the module's view.
  //  */
  // static setViewContainer($el) {
  //   ClientModule.prototype.$container = $el;
  // }

  // /**
  //  * Returns the template associated to the current module.
  //  * @returns {Function} - The template related to the `name` of the current module.
  //  */
  // get template() {
  //   const template = this._template || this.templateDefinitions[this.name];
  //   // if (!template)
  //   //   throw new Error(`No template defined for module "${this.name}"`);
  //   return template;
  // }

  // set template(tmpl) {
  //   this._template = tmpl;
  // }

  // /**
  //  * Returns the text associated to the current module.
  //  * @returns {Object} - The text contents related to the `name` of the current module. The returned object is extended with a pointer to the `globals` entry of the defined text contents.
  //  */
  // get content() {
  //   const content = this._content || this.contentDefinitions[this.name];

  //   if (content)
  //     content.globals = this.contentDefinitions.globals;

  //   return content;
  // }

  // set content(obj) {
  //   this._content = obj;
  // }

  // /**
  //  * Create the view of the module according to its attributes.
  //  */
  // createView() {
  //   const options = Object.assign({
  //     id: this.name,
  //     className: 'module'
  //   }, this.viewOptions);

  //   return new this.viewCtor(this.template, this.content, this.events, options);
  // }
  // !MOVED TO ACTIVITY

  /**
   * @todo - doc
   * @private
   */
  launch() {
    // console.log(`${this.name}:launch`, this._isActive, this._isDone);
    if (this._isDone)
      this.restart();
    else if (this._isActive)
      this.reset();
    else
      this.start();
  }

  /**
   * Interface method to override in order to initialize module state and optionnaly it's view.
   * The module should return to a default state when this method is called.
   */
  init() {
    // console.log(`${this.name}:init`);
  }

  /**
   * Handle the logic and steps that starts the module.
   * Is mainly used to attach listeners to communication with the server or other modules (e.g. motionInput). If the module has a view, it is attach to the DOM.
   *
   * **Note:** the method is called automatically when necessary, you should not call it manually.
   * @abstract
   */
  start() {
    // console.log(`${this.name}:start`);
    if (this.view) {
      this.view.render();
      this.view.appendTo(this.$container);
    }

    this._isActive = true;
  }

  /**
   * This method should be considered as the opposite of {@link ClientModule#start}, removing listeners from socket or other module (aka motionInput).
   * It is internally called at 2 different moment of the module's lifecycle:
   * - when the module is {@link ClientModule#done}
   * - when the module has to restart because of a socket reconnection during the active state of the module. In this particular case the module is stopped, initialized and started again.
   *
   * **Note:** the method is called automatically when necessary, you should not call it manually.
   * @abstract
   */
  stop() {
    // console.log(`${this.name}:stop`);
    if (this.view) {
      this.view.remove();
      this.view = null;
    }

    this._isActive = false;
  }

  /**
   * Should be called when the module has finished its initialization (*i.e.* when the module has done its duty, or when it may run in the background for the rest of the scenario after it finished its initialization process), to allow subsequent steps of the scenario to start.
   *
   * For instance, the {@link Loader} module calls its {@link ClientModule#done} method when files are loaded, and the {@link ClientSync} module calls it when the first synchronization process is finished (while the module keeps running in the background afterwards).
   * As an exception, the last module of the scenario (usually the {@link Performance} module) may not call its {@link Module#done} method.
   *
   * If the module has a `view`, the `done` method removes it from the DOM.
   * The method internally call {@link ClientModule#stop} where socket listeners and so on should be removed.
   *
   * **Note:** you should not override this method.
   */
  done() {
    // console.log(`${this.name}:done`);
    this.stop();

    if (this.resolvePromised)
      this.resolvePromised();

    this._isDone = true;
  }

  /**
   * Reset an active module to it's default state.
   *
   * **Note:** the method is called automatically when necessary, you should not call it manually.
   * @abstract
   */
  reset() {
    // console.log(`${this.name}:reset`);
    this.stop();
    this.init();
    this.start();
  }

  /**
   * * @todo - This prepare the installation of a server side persistance. Most of the module should override it for now.
   *
   * Restarts a module after it has been considered as `done`.
   * The main objective of this method is to restore the distributed state betweeen the client and the server after a disconnection.
   * The method is called automatically when a lost connection with the server is resumed (because of a server crash) and {@link ClientModule#done} has already been called.
   *
   * If the server crashes, all in memory informations about the shared state of the application are lost. On the client side, the modules that had finished their initialization must resynchronize with the server to restore the global (and distributed) state of the application.
   *
   * **Note:** the method is called automatically when necessary, you should not call it manually.
   * @abstract
   */
  restart() {
    // console.log(`${this.name}:restart`);
    this.init();
    this.start();
  }

  /**
   * Display the view of a module if it owns one and is not done.
   * @return {Boolean} - true if the module has a view and is not done, false otherwise.
   * @private
   */
  show() {
    if (this.view && !this._isDone) {
      if (!this.view.isVisible)
        this.view.show();

      return true;
    }

    return false;
  }

  /**
   * Display the view of a module if it owns one and is not done.
   * @private
   */
  hide() {
    if (this.view && !this._done)
      this.view.hide();
  }

  // MOVED TO CLIENT ACTIVITY
  // /**
  //  * Sends a WebSocket message to the server side socket.
  //  * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
  //  * @param {...*} args - Arguments of the message (as many as needed, of any type).
  //  */
  // send(channel, ...args) {
  //   comm.send(`${this.name}:${channel}`, ...args)
  // }

  // /**
  //  * Sends a WebSocket message to the server side socket.
  //  * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
  //  * @param {...*} args - Arguments of the message (as many as needed, of any type).
  //  */
  // sendVolatile(channel, ...args) {
  //   comm.sendVolatile(`${this.name}:${channel}`, ...args)
  // }

  // /**
  //  * Listen a WebSocket message from the server.
  //  * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
  //  * @param {...*} callback - The callback to execute when a message is received.
  //  */
  // receive(channel, callback) {
  //   comm.receive(`${this.name}:${channel}`, callback);
  // }

  // /**
  //  * Stop listening to a message from the server.
  //  * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
  //  * @param {...*} callback - The callback to cancel.
  //  */
  // removeListener(channel, callback) {
  //   comm.removeListener(`${this.name}:${channel}`, callback);
  // }
  // !MOVED TO CLIENT ACTIVITY
}

ClientModule.sequential = function(...modules) {
  return new Sequential(modules);
};

ClientModule.parallel = function(...modules) {
  return new Parallel(modules);
};
