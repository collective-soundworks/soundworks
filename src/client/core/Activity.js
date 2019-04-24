import Process from './Process';
import Signal from '../../utils/Signal';
import SignalAll from '../../utils/SignalAll';
import socket from './socket';
import View from '../views/View';
import viewManager from './viewManager';


/**
 * Internal base class for services and scenes. Basically a process with view
 * and network abilities.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Process
 */
class Activity extends Process {
  /**
   * @param {String} id - Id of the activity.
   */
  constructor(id) {
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
     * Options of the activity.
     * @type {Object}
     * @name options
     * @instance
     * @memberof module:soundworks/client.Activity
     */
    this.options = { viewPriority: 0 };

    /**
     * View of the activity.
     * @type {module:soundworks/client.View}
     * @name view
     * @instance
     * @memberof module:soundworks/client.Activity
     * @private
     */
    this._view = null;

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
   * Interface method to be implemented by child classes.
   * Define what to do when a service is required by an `Activity`.
   */
  require() {}

  /**
   * Add a signal to the required signals in order for the `Scene` instance
   * to start.
   * @param {Signal} signal - The signal that must be waited for.
   * @private
   */
  waitFor(signal) {
    this.requiredSignals.add(signal);
  }

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
   *
   * @param {String} channel - The channel of the message (is automatically
   *  namespaced with the activity's id: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send(channel, ...args) {
    socket.send(`${this.id}:${channel}`, ...args);
  }

  /**
   * Send a web socket message to the server on a given channel.
   *
   * @param {String} channel - The channel of the message (is automatically
   *  namespaced with the activity's id: `${this.id}:channel`).
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  sendVolatile(channel, ...args) {
    socket.sendVolatile(`${this.id}:${channel}`, ...args);
  }

  /**
   * Listen to web socket messages from the server on a given channel.
   *
   * @param {String} channel - The channel of the message (is automatically
   *  namespaced with the activity's id: `${this.id}:channel`).
   * @param {Function} callback - The callback to execute when a message is received.
   */
  receive(channel, callback) {
    socket.receive(`${this.id}:${channel}`, callback);
  }

  /**
   * Stop listening for messages from the server on a given channel.
   *
   * @param {String} channel - The channel of the message (is automatically
   *  namespaced with the activity's id: `${this.id}:channel`).
   * @param {Function} callback - The callback to remove from the stack.
   */
  stopReceiving(channel, callback) {
    socket.removeListener(`${this.id}:${channel}`, callback);
  }
}

export default Activity;
