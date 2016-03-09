import Process from './Process';
import Signal from './Signal';
import SignalAll from './SignalAll';
import socket from './socket';
import View from '../views/View';
import viewManager from './viewManager';


/**
 * Base class for services and scenes. Basically a process with view and optionnal network abilities.
 */
export default class Activity extends Process {
  constructor(id, hasNetwork = true) {
    super(id);

    /**
     * If `true`, define if the process has been started once.
     * @type {Boolean}
     */
    this.hasStarted = false;

    /**
     * Register as a networked service.
     */
    if (hasNetwork) {
      this.hasNetwork = true;
      socket.required = true;
    }

    /**
     * View of the activity.
     * @type {View}
     */
    this.view = null;

    /**
     * Events to bind to the view. (cf. Backbone's syntax).
     * @type {Object}
     */
    this.viewEvents = {};

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
     * The view template of the view (use `lodash.template` syntax).
     * @type {String}
     */
    this.viewTemplate = null;

    /**
     * Options of the process.
     * @type {Object}
     */
    this.options = {};
    this.configure({ viewPriority: 0 });

    /**
     * Define which signal the `Activity` requires to start.
     * @private
     */
    this.requiredSignals = new SignalAll();

    this.send = this.send.bind(this);
    this.sendVolatile = this.sendVolatile.bind(this);
    this.receive = this.receive.bind(this);
    this.removeListener = this.removeListener.bind(this);
  }

  /**
   * Interface method to be implemented in child classes.
   * Define what to do when a service is required by an `Activity`.
   */
  require() {}

  /**
   * Configure the process with the given options.
   * @param {Object} options
   */
  configure(options) {
    Object.assign(this.options, options);
  }

  /**
   * Share the defined view templates with all `Activity` instances.
   * @param {Object} defs - An object containing the view templates.
   * @private
   */
  static setViewTemplateDefinitions(defs) {
    Activity.prototype.viewTemplateDefinitions = defs;
  }

  /**
   * Share the view content configuration (name and data) with all the `Activity` instances
   * @param {Object} defs - The view contents of the application.
   * @private
   */
  static setViewContentDefinitions(defs) {
    Activity.prototype.viewContentDefinitions = defs;
  }

  /**
   * Returns the view template associated to the current activity.
   * @returns {Function} - The view template related to the `name` of the current activity.
   */
  get viewTemplate() {
    const viewTemplate = this._viewTemplate || this.viewTemplateDefinitions[this.id];
    // if (!viewTemplate)
    //   throw new Error(`No view template defined for activity "${this.id}"`);
    return viewTemplate;
  }

  set viewTemplate(tmpl) {
    this._viewTemplate tmpl;
  }

  /**
   * Returns the text associated to the current activity.
   * @returns {Object} - The view contents related to the `name` of the current activity. The returned object is extended with a pointer to the `globals` entry of the defined view contents.
   */
  get viewContent() {
    const viewContent = this._viewContent || this.viewContentDefinitions[this.id];

    if (viewContent)
      viewContent.globals = this.viewContentDefinitions.globals;

    return viewContent;
  }

  set viewContent(obj) {
    this._viewContent = obj;
  }

  /**
   * Create the view of the activity according to its attributes.
   */
  createView() {
    const options = Object.assign({
      id: this.id,
      className: 'activity',
      priority: this.options.viewPriority,
    }, this.viewOptions);

    return new this.viewCtor(this.viewTemplate, this.viewContent, this.viewEvents, options);
  }

  /**
   * Display the view of a activity if it owns one.
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
   * @param {String} channel - The channel of the message (is automatically namespaced with the activity's name: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(channel, ...args) {
    socket.send(`${this.id}:${channel}`, ...args)
  }

  /**
   * Sends a WebSocket message to the server side socket.
   * @param {String} channel - The channel of the message (is automatically namespaced with the activity's name: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  sendVolatile(channel, ...args) {
    socket.sendVolatile(`${this.id}:${channel}`, ...args)
  }

  /**
   * Listen a WebSocket message from the server.
   * @param {String} channel - The channel of the message (is automatically namespaced with the activity's name: `${this.id}:channel`).
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive(channel, callback) {
    socket.receive(`${this.id}:${channel}`, callback);
  }

  /**
   * Stop listening to a message from the server.
   * @param {String} channel - The channel of the message (is automatically namespaced with the activity's name: `${this.id}:channel`).
   * @param {...*} callback - The callback to cancel.
   */
  removeListener(channel, callback) {
    socket.removeListener(`${this.id}:${channel}`, callback);
  }
}
