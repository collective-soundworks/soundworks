import server from './server';
import serviceManager from './serviceManager';
import Signal from '../../utils/Signal';
import SignalAll from '../../utils/SignalAll';

// @todo - remove EventEmitter ? (Implement our own listeners)

/**
 * Internal base class for services and scenes.
 *
 * @memberof module:soundworks/server
 */
class Activity {
  /**
   * Creates an instance of the class.
   * @param {String} id - Id of the activity.
   */
  constructor(id) {
    if (id === undefined) {
      throw new Error(`Undefined id for activty ${this.constructor.name}`);
    }

    /**
     * The id of the activity. This value must match a client side
     * {@link src/client/core/Activity.js~Activity} id in order to create
     * a namespaced socket channel between the activity and its client side peer.
     * @type {String}
     * @name id
     * @instance
     * @memberof module:soundworks/server.Activity
     */
    this.id = id;

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
    this.requiredActivities = new Set();

    // register as instanciated to the server
    server.setActivity(this);

    this.requiredSignals = new SignalAll();
    this.requiredSignals.addObserver(() => this.start());
    // wait for serviceManager.start
    this.requiredSignals.add(serviceManager.signals.start);
  }

  /**
   * Add client type that should be mapped to this activity.
   * @private
   * @param {String|Array} val - The client type(s) on which the activity
   *  should be mapped
   */
  _addClientTypes(type) {
    if (arguments.length === 1) {
      if (typeof type === 'string')
        type = [type];
    } else {
      type = Array.from(arguments);
    }

    // add client types to current activity
    type.forEach((clientType) => {
      this.clientTypes.add(clientType);
    });

    // propagate value to required activities
    this.requiredActivities.forEach((activity) => {
      activity._addClientTypes(type);
    });
  }

  /**
   * Configure the activity.
   * @param {Object} options
   */
  configure(options) {
    Object.assign(this.options, options);
  }

  /**
   * Retrieve a service. The required service is added to the `requiredActivities`.
   * @param {String} id - The id of the service.
   * @param {Object} options - Some options to configure the service.
   */
  // make abstract, should be implemented by child classes (Scene and Service)
  require(id, options) {
    const instance = serviceManager.require(id, options);

    this.requiredActivities.add(instance)
    this.requiredSignals.add(instance.signals.ready);

    instance._addClientTypes(this.clientTypes);

    return instance;
  }

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
