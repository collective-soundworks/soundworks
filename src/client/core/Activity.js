import Process from './Process';
import Signal from './Signal';
import SignalAll from './SignalAll';
import socket from './socket';
import View from '../views/View';
import viewManager from './viewManager';


/**
 * Internal base class for services and scenes. Basically a process with view
 * and optionnal network abilities.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Process
 */
class Activity extends Process {
  /**
   * @param {String} id - Id of the activity.
   * @param {Boolean} hasNetwork - Define if the activity needs a socket
   *  connection or not.
   */
  constructor(id, hasNetwork = true) {
    super(id);

    /**
     * If `true`, define if the activity has already been started once.
     * @type {Boolean}
     * @name hasStarted
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    this.hasStarted = false;

    // register as a networked service
    if (hasNetwork) {
      this.hasNetwork = true;
      socket.required = true;
    }

    /**
     * View of the activity.
     * @type {module:soundworks/client.View}
     * @name view
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    this.view = null;

    /**
     * Events to bind to the view. (mimic the Backbone's syntax).
     * @type {Object}
     * @name viewEvents
     * @instance
     * @memberof module:soundworks/client.Activity
     * @example
     * this.viewEvents = {
     *   "touchstart .button": (e) => {
     *     // do somthing
     *   },
     *   // etc...
     * };
     */
    this.viewEvents = {};

    /**
     * Additionnal options to pass to the view.
     * @type {Object}
     * @name viewOptions
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    this.viewOptions = {};

    /**
     * View constructor to be used in
     * [`Activity#createView`]{@link module:soundworks/client.Activity#createView}.
     * @type {module:soundworks/client.View}
     * @default module:soundworks/client.View
     * @name viewCtor
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    this.viewCtor = View;

    /**
     * Options of the activity.
     * @type {Object}
     * @name options
     * @instance
     * @memberof module:soundworks/client.Activity
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
   * Configure the activity with the given options.
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
   * Share the view content configuration (name and data) with all the
   * `Activity` instances
   * @param {Object} defs - The view contents of the application.
   * @private
   */
  static setViewContentDefinitions(defs) {
    Activity.prototype.viewContentDefinitions = defs;
  }

  /**
   * The template related to the `id` of the activity.
   * @type {String}
   * @see {@link module:soundworks/client.defaultViewTemplates}
   */
  get viewTemplate() {
    const viewTemplate = this._viewTemplate || this.viewTemplateDefinitions[this.id];
    // if (!viewTemplate)
    //   throw new Error(`No view template defined for activity "${this.id}"`);
    return viewTemplate;
  }

  set viewTemplate(tmpl) {
    this._viewTemplate = tmpl;
  }

  /**
   * The view contents related to the `id` of the activity. The object is
   * extended with a pointer to the `globals` entry of the defined view contents.
   * @type {Object}
   * @see {@link module:soundworks/client.defaultViewContent}
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
   * Create the view of the activity according to its `viewCotr`, `viewTemplate`,
   * `viewContent`, `viewEvents` and `viewOptions` attributes.
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
   * Request the view manager to display the view. The call of this method
   * doesn't garantee a synchronized rendering of the view as the view manager
   * decide which view to display based on their priority.
   */
  show() {
    if (!this.view) { return; }

    this.view.render();
    viewManager.register(this.view);
  }

  /**
   * Hide the view of the activity if it owns one.
   */
  hide() {
    if (!this.view) { return; }

    viewManager.remove(this.view);
  }

  /**
   * Sends a WebSocket message to the server side socket.
   * @param {String} channel - The channel of the message (is automatically
   *  namespaced with the activity's id: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(channel, ...args) {
    socket.send(`${this.id}:${channel}`, ...args);
  }

  /**
   * Sends a WebSocket message to the server side socket.
   * @param {String} channel - The channel of the message (is automatically
   *  namespaced with the activity's id: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  sendVolatile(channel, ...args) {
    socket.sendVolatile(`${this.id}:${channel}`, ...args);
  }

  /**
   * Listen a WebSocket message from the server.
   * @param {String} channel - The channel of the message (is automatically
   *  namespaced with the activity's id: `${this.id}:channel`).
   * @param {Function} callback - The callback to execute when a message is received.
   */
  receive(channel, callback) {
    socket.receive(`${this.id}:${channel}`, callback);
  }

  /**
   * Stop listening to a message from the server.
   * @param {String} channel - The channel of the message (is automatically
   *  namespaced with the activity's id: `${this.id}:channel`).
   * @param {Function} callback - The callback to remove from the stack.
   */
  removeListener(channel, callback) {
    socket.removeListener(`${this.id}:${channel}`, callback);
  }
}

export default Activity;

