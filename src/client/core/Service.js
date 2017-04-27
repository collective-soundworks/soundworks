import Activity from './Activity';
import debug from 'debug';
import serviceManager from './serviceManager';
import Signal from '../../utils/Signal';

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
   * @param {Boolean} hasNetwork - Define if the service needs an access to the socket
   *  connection.
   */
  constructor(id, hasNetwork) {
    super(id, hasNetwork);

    this.requiredSignals.addObserver((value) => {
      if (value) {
        this.start();
        this.hasStarted = true;
      } else {
        this.stop();
      }
    });

    /**
     * Is set to `true` when a signal is ready to be consumed.
     * @type {Signal}
     */
    this.signals.ready = new Signal();
    // add the serviceManager bootstart signal to the required signals
    this.waitFor(serviceManager.signals.start);

    this.ready = this.ready.bind(this);
  }

  /**
   * Allow to require another service as a dependencies. When a service is
   * dependent from another service its `start` method is delayed until all
   * its dependencies are themselves `ready`.
   * @param {String} id - id of the service to require.
   * @param {Object} options - configuration object to be passed to the service.
   */
  require(id, options) {
    const service = serviceManager.require(id, options);
    const signal = service.signals.ready;

    if (signal)
      this.waitFor(signal);
    else
      throw new Error(`signal "continue" doesn't exist on service :`, service);

    return service;
  }

  /**
   * Method to call in the service lifecycle when it should be considered as
   * `ready` and thus allows all its dependent activities to start themselves.
   */
  ready() {
    log(`"${this.id}" ready`);

    this.stop();
    this.signals.ready.set(true);
  }

  /** @inheritdoc */
  start() {
    log(`"${this.id}" started`);
    super.start();
  }

  /** @inheritdoc */
  stop() {
    log(`"${this.id}" stopped`);
    super.stop();
  }
}

export default Service;

