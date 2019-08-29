import Activity from './Activity';
import Signal from '../common/Signal';
import SignalAll from '../common/SignalAll';
import debug from 'debug';
import logger from './utils/logger';

// @todo - to be removed, move to dependency injection
import serviceManager from './serviceManager';

const log = debug('soundworks:lifecycle');

/**
 * Base class to be extended in order to create a new service.
 *
 * @memberof module:soundworks/server
 * @extends module:soundworks/server.Activity
 */
class Service extends Activity {
  constructor() { // should receive soundworks instance as argument
    super();

    /**
     * Id of the service.
     * @type {String}
     * @name name
     * @instance
     * @memberof module:soundworks/server.Activity
     */
    this.name = null;

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
    this.signals = {
      start: new SignalAll(),
      ready: new Signal()
    };

    // start when all required signals are fired
    this.signals.start.addObserver(value => this.start());
    // require at least the "start" signal of the service manager
    this.signals.start.add(serviceManager.signals.start);

    this.ready = this.ready.bind(this);
  }

  /**
   * Configure the activity.
   * @param {Object} options
   */
  configure(options) {
    Object.assign(this.options, options);
  }

  /** @inheritdoc */
  start() {
    logger.serviceStart(this.name);
    super.start();
  }

  /**
   * Method to call in the service lifecycle when it should be considered as
   * `ready` and thus allows all its dependent activities to start themselves.
   */
  ready() {
    logger.serviceReady(this.name);
    this.signals.ready.value = true;
  }

  connect(client) {
    log(`> [client ${client.id}] connect service "${this.name}"`);
    super.connect(client);
  }

  disconnect(client) {
    log(`> [client ${client.id}] disconnect service "${this.name}"`);
    super.disconnect(client);
  }
}

export default Service;
