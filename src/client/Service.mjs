import Activity from './Activity';
import serviceManager from './serviceManager';
import Signal from '../common/Signal';
import debug from 'debug';

const log = debug('soundworks:services');


/**
 * Base class to be extended in order to create a new service.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Activity
 */
class Service extends Activity {
  /**
   * @param {String} id - The id of the service (should be prefixed with `'service:'`).
   */
  constructor() {
    super();

    /**
     * Name of the service.
     * @name name
     * @type {String}
     * @instanceof Process
     */
    this.name = null;

    this.requiredStartSignals.addObserver((value) => this.start());
    this.requiredStartSignals.add(serviceManager.signals.start);

    /**
     * Is set to `true` when a signal is ready to be consumed.
     * @type {Signal}
     */
    this.signals.ready = new Signal();
    // // add the serviceManager bootstart signal to the required signals
    // this.waitFor();

    this.ready = this.ready.bind(this);
  }

  /**
   * Method to call in the service lifecycle when it should be considered as
   * `ready` and thus allows all its dependent activities to start themselves.
   */
  ready() {
    log(`"${this.id}" ready`);

    // this.stop();
    this.signals.ready.set(true);
  }

  /** @inheritdoc */
  start() {
    log(`"${this.id}" started`);
    super.start();
  }
}

export default Service;

