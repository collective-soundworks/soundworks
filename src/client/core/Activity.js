import Process from './Process';
import Signal from '../../utils/Signal';
import SignalAll from '../../utils/SignalAll';
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
     * If `true`, defines if the activity has already started once.
     * @type {Boolean}
     * @name hasStarted
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    this.hasStarted = false;

    /**
     * Defines if the activity needs a connection to the server.
     * @type {Boolean}
     * @name hasNetwork
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    this.hasNetwork = !!hasNetwork;

    // register as a networked service, setup the socket connection
    if (this.hasNetwork)
      socket.required = true;

    /**
     * View of the activity.
     * @type {module:soundworks/client.View}
     * @name view
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    this._view = null;

    /**
     * Options of the activity.
     * @type {Object}
     * @name options
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    this.options = { viewPriority: 0 };

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
   * Set the view of service.
   *
   * @param {Object} view - any object compliant with the view interface.
   */
  set view(view) {
    this._view = view;
  }

  get view() {
    return this._view;
  }

  /**
   * Request the view manager to display the view. The call of this method
   * doesn't guarantee a synchronized rendering or any rendering at all as the
   * view manager decides which view to display based on their priority.
   *
   * @return {Promise} - a promise that resolves when the view is actually
   *  displayed in the application.
   */
  show() {
    return viewManager.register(this._view, this.options.viewPriority);
  }

  /**
   * Hide the view of the activity if it owns one.
   */
  hide() {
    viewManager.remove(this._view);
  }

  /**
   * Send a web socket message to the server on a given channel.
   * @param {String} channel - The channel of the message (is automatically
   *  namespaced with the activity's id: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(channel, ...args) {
    socket.send(`${this.id}:${channel}`, ...args);
  }

  /**
   * Send a web socket message to the server on a given channel.
   * @param {String} channel - The channel of the message (is automatically
   *  namespaced with the activity's id: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  sendVolatile(channel, ...args) {
    socket.sendVolatile(`${this.id}:${channel}`, ...args);
  }

  /**
   * Listen to web socket messages from the server on a given channel.
   * @param {String} channel - The channel of the message (is automatically
   *  namespaced with the activity's id: `${this.id}:channel`).
   * @param {Function} callback - The callback to execute when a message is received.
   */
  receive(channel, callback) {
    socket.receive(`${this.id}:${channel}`, callback);
  }

  /**
   * Stop listening for messages from the server on a given channel.
   * @param {String} channel - The channel of the message (is automatically
   *  namespaced with the activity's id: `${this.id}:channel`).
   * @param {Function} callback - The callback to remove from the stack.
   */
  removeListener(channel, callback) {
    socket.removeListener(`${this.id}:${channel}`, callback);
  }
}

Activity.prototype.viewTemplateDefinitions = {};
Activity.prototype.viewContentDefinitions = {};

export default Activity;
