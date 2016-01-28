import Signal from './Signal';
import SignalAll from './SignalAll';
import socket from './socket';
import View from '../display/View';
import viewManager from './viewManager';


/**
 * Base class for services and scenes. Basically a process with view and optionnal network abilities.
 */
export default class Activity {
  constructor(id, hasNetwork = true) {

    /**
     * Name of the module.
     * @type {String}
     */
    this.id = id;

    /**
     * If `true`, define if the process has been started once.
     * @type {Boolean}
     */
    this.hasStarted = false;

    /**
     * Register as a networked service.
     */
    if (hasNetwork)
      socket.required = true;

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
    this.viewOptions = {};

    /**
     * Defines a view constructor to be used in `createView`.
     * @type {View}
     */
    this.viewCtor = View;

    /**
     * The template of the view (use `lodash.template` syntax).
     * @type {String}
     */
    this.template = null;

    /**
     * Signals defining the process state.
     * @type {Object}
     */
    this.signals = {};
    this.signals.active = new Signal();

    /**
     * Options of the process.
     * @type {Object}
     */
    this.options = {};
    this.configure({ viewPriority: 0 });

    this.send = this.send.bind(this);
    this.sendVolatile = this.sendVolatile.bind(this);
    this.receive = this.receive.bind(this);
    this.removeListener = this.removeListener.bind(this);
  }

  /**
   * Configure the process with the given options.
   * @param {Object} options
   */
  configure(options) {
    Object.assign(this.options, options);
  }


  /**
   * Share the defined templates with all `Activity` instances.
   * @param {Object} defs - An object containing the templates.
   * @private
   */
  static setViewTemplateDefinitions(defs) {
    Activity.prototype.templateDefinitions = defs;
  }

  /**
   * Share the text content configuration (name and data) with all the `Activity` instances
   * @param {Object} defs - The text contents of the application.
   * @private
   */
  static setViewContentDefinitions(defs) {
    Activity.prototype.contentDefinitions = defs;
  }

  /**
   * Returns the template associated to the current module.
   * @returns {Function} - The template related to the `name` of the current module.
   */
  get template() {
    const template = this._template || this.templateDefinitions[this.id];
    // if (!template)
    //   throw new Error(`No template defined for module "${this.id}"`);
    return template;
  }

  set template(tmpl) {
    this._template = tmpl;
  }

  /**
   * Returns the text associated to the current module.
   * @returns {Object} - The text contents related to the `name` of the current module. The returned object is extended with a pointer to the `globals` entry of the defined text contents.
   */
  get content() {
    const content = this._content || this.contentDefinitions[this.id];

    if (content)
      content.globals = this.contentDefinitions.globals;

    return content;
  }

  set content(obj) {
    this._content = obj;
  }

  /**
   * Create the view of the module according to its attributes.
   */
  createView() {
    const options = Object.assign({
      id: this.id,
      className: 'module',
      priority: this.options.viewPriority,
    }, this.viewOptions);

    return new this.viewCtor(this.template, this.content, this.events, options);
  }


  /**
   * Handle the logic and steps that starts the module.
   * Is mainly used to attach listeners to communication with the server or other modules (e.g. motionInput). If the module has a view, it is attach to the DOM.
   *
   * **Note:** the method is called automatically when necessary, you should not call it manually.
   * @abstract
   */
  start() {
    this.signals.active.set(true);
  }

  /**
   * This method should be considered as the opposite of {@link Activity#start}, removing listeners from socket or other module (aka motionInput).
   * It is internally called at 2 different moment of the module's lifecycle:
   * - when the module is {@link Activity#done}
   * - when the module has to restart because of a socket reconnection during the active state of the module. In this particular case the module is stopped, initialized and started again.
   *
   * **Note:** the method is called automatically when necessary, you should not call it manually.
   * @abstract
   */
  stop() {
    this.signals.active.set(false);
  }

  /**
   * Display the view of a module if it owns one.
   */
  show() {
    if (!this.view) { return; }

    this.view.render();
    viewManager.register(this.view);
  }

  /**
   * Hide the view of an activity if it owns one.
   */
  hide() {
    if (!this.view) { return; }

    viewManager.remove(this.view);
  }

  /**
   * Sends a WebSocket message to the server side socket.
   * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(channel, ...args) {
    console.log(`${this.id}:${channel}`);
    socket.send(`${this.id}:${channel}`, ...args)
  }

  /**
   * Sends a WebSocket message to the server side socket.
   * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  sendVolatile(channel, ...args) {
    socket.sendVolatile(`${this.id}:${channel}`, ...args)
  }

  /**
   * Listen a WebSocket message from the server.
   * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive(channel, callback) {
    socket.receive(`${this.id}:${channel}`, callback);
  }

  /**
   * Stop listening to a message from the server.
   * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
   * @param {...*} callback - The callback to cancel.
   */
  removeListener(channel, callback) {
    socket.removeListener(`${this.id}:${channel}`, callback);
  }
}
