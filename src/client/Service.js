import Activity from './Activity';
import Signal from '../common/Signal';
import SignalAll from '../common/SignalAll';
import debug from 'debug';

const log = debug('soundworks:lifecycle');

/**
 * Base class to be extended in order to create a new service.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Activity
 */
class Service {
  constructor() {
    /**
     * Id of the service.
     * @type {String}
     * @name name
     * @type {String}
     * @instanceof Process
     */
    this.name = null;

    /**
     * Options of the activity.
     * @type {Object}
     * @name options
     * @instance
     * @memberof module:soundworks/client.Activity
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
      ready: new Signal(),
    };

    // start when all required signals are fired
    this.signals.start.addObserver(value => this.start());
    this.ready = this.ready.bind(this);
  }

  /**
   * Configure the activity with the given options.
   * @param {Object} options
   */
  configure(options) {
    Object.assign(this.options, options);
  }

  /** @inheritdoc */
  start() {
    log(`> service "${this.name}" start`);
  }

  /**
   * Method to call in the service lifecycle when it should be considered as
   * `ready` and thus allows all its dependent activities to start themselves.
   */
  ready() {
    log(`> service "${this.name}" ready`);
    this.signals.ready.value = true;
  }
}

export default Service;

