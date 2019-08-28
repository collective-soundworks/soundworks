import server from './server';
import serviceManager from './serviceManager';
import Signal from '../common/Signal';
import SignalAll from '../common/SignalAll';

// @todo - remove EventEmitter ? (Implement our own listeners)

/**
 * Internal base class for services and scenes.
 *
 * @memberof module:soundworks/server
 */
class Activity {
  constructor() {
    /**
     * Options of the activity. These values should be updated with the
     * `this.configure` method.
     * @type {Object}
     * @name options
     * @instance
     * @memberof module:soundworks/server.Activity
     */
    this.options = {};

    /**
     * Signals defining the process state.
     * @name signal
     * @type {Object}
     * @instanceof Process
     */
    this.signals = {};
    this.signals.start = new Signal();

    /**
     * The client types on which the activity should be mapped.
     * @type {Set}
     * @name clientTypes
     * @instance
     * @memberof module:soundworks/server.Activity
     */
    this.clientTypes = new Set();

    /**
     * List of the activities the current activity needs in order to work.
     * @type {Set}
     * @private
     */
    // this._requiredActivities = new Set();

    // register as instanciated to the server
    server.setActivity(this);

    this.requiredStartSignals = new SignalAll();
    // this._requiredStartSignals.addObserver(() => this.start());
    // // wait for serviceManager.start
    // this._requiredStartSignals.add(serviceManager.signals.start);
  }

  /**
   * @private
   *
   * This method is required by the server to know which client should connect
   * to which activity.
   * Add client type that should be mapped to this activity.
   *
   * @param {String|Array} val - The client type(s) on which the activity
   *  should be mapped
   */
  _addClientTypes(clientTypes) {
    // if (arguments.length === 1) {
      if (typeof clientTypes === 'string') {
        clientTypes = [clientTypes];
      }
    // } else {
    //   clientTypes = Array.from(arguments);
    // }

    // add client types to current activity
    clientTypes.forEach((clientType) => {
      this.clientTypes.add(clientType);
    });

    // // propagate value to required activities
    // this._requiredActivities.forEach((activity) => {
    //   activity._addClientTypes(clientTypes);
    // });
  }

  /**
   * Configure the activity.
   * @param {Object} options
   */
  configure(options) {
    Object.assign(this.options, options);
  }

  /**
   * Retrieve a service. The required service is added to the `_requiredActivities`.
   * @param {String} id - The id of the service.
   * @param {Object} options - Some options to configure the service.
   */
  // make abstract, should be implemented by child classes (Scene and Service)
  // require(id, options) {
  //   const instance = serviceManager.require(id, options);

  //   this._requiredActivities.add(instance)
  //   this._requiredStartSignals.add(instance.signals.ready);

  //   instance._addClientTypes(this.clientTypes);

  //   return instance;
  // }

  /**
   * Interface method to be implemented by activities. As part of an activity
   * lifecycle, the method should define the behavior of the activity when started
   * (e.g. binding listeners). When this method is called, all configuration options
   * should be defined.
   * The method is automatically called by the server on startup.
   */
  start() {}

  /**
   * Called when the `client` connects to the server. This method should handle
   * the particular logic of the activity on the server side according to the
   * connected client (e.g. adding socket listeners).
   * @param {module:soundworks/server.Client} client
   */
  connect(client) {}

  /**
   * Called when the client `client` disconnects from the server. This method
   * should handle the particular logic of the activity on the server side when
   * a client disconnect (e.g. removing socket listeners).
   * @param {module:soundworks/server.Client} client
   */
  disconnect(client) {}
}

export default Activity;
