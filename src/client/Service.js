import Activity from './Activity';
import Signal from '../common/Signal';
import debug from 'debug';
// @todo - to be removed
import serviceManager from './serviceManager';

const log = debug('soundworks:lifecycle');

/**
 * Base class to be extended in order to create a new service.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Activity
 */
class Service extends Activity {
  constructor() {
    super();

    /**
     * Id of the service.
     * @type {String}
     * @name name
     * @type {String}
     * @instanceof Process
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
}

export default Service;

