import Activity from './Activity';
import Signal from '../common/Signal';
import SignalAll from '../common/SignalAll';
import debug from 'debug';

const log = debug('soundworks:lifecycle');

/**
 * Base class to be extended in order to create a new service.
 *
 * @memberof @soundworks/core/client
 */
class Service {
  constructor() {
    /**
     * Name of the service, as defined on registration.
     * @type {String}
     * @name name
     * @type {String}
     * @instance
     * @memberof @soundworks/core/client.Service
     */
    this.name = null;

    /**
     * Options of the activity.
     * @type {Object}
     * @name options
     * @instance
     * @memberof @soundworks/core/client.Service
     */
    this.options = {};

    /**
     * Signals defining the process state.
     * @name signal
     * @type {Object}
     * @instance
     * @memberof @soundworks/core/client.Service
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

  /**
   * Method where the initialization logic of a child Service should be
   * implemented. When ready, the initialization step should call `this.ready`
   * in order to inform the serviceManager that the service is ready to be
   * consumed by the client, and thus allow to continue the initialization
   * process.
   *
   * @example
   * class MyDelayService extends soundworks.Service {
   *   // ...
   *   start() {
   *     setTimeout(() => this.ready(), 3000);
   *   }
   * }
   */
  start() {
    log(`> service "${this.name}" start`);
  }

  /**
   * Method to call in the service lifecycle when it should be considered as
   * `ready` and thus allows the intialization process to continue.
   */
  ready() {
    log(`> service "${this.name}" ready`);
    this.signals.ready.value = true;
  }
}

export default Service;

