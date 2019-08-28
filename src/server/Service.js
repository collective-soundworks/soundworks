import Activity from './Activity';
import Signal from '../common/Signal';
import debug from 'debug';
// @todo - to be removed
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
     * Is set to `true` when a signal is ready to be consumed.
     * @type {Signal}
     */
    this.signals.ready = new Signal();

    // start when all required signals are fired
    this.requiredStartSignals.addObserver(value => this.start());
    // require at least the "start" signal of the service manager
    this.requiredStartSignals.add(serviceManager.signals.start);

    this.ready = this.ready.bind(this);
  }

  /** @inheritdoc */
  start() {
    log(`> service "${this.name}" start`);
    super.start();
  }

  /**
   * Method to call in the service lifecycle when it should be considered as
   * `ready` and thus allows all its dependent activities to start themselves.
   */
  ready() {
    log(`> service "${this.name}" ready`);
    this.signals.ready.set(true);
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
