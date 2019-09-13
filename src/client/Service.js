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
  constructor(client, name) {
    if (!(client)) {
      throw new Error(`[service] 1rst argument should be an instance of Client`);
    }

    if (!name) {
      throw new Error(`[service] 2nd argument should be a valid name`);
    }
    /**
     * Instance of soundworks client
     * @type {String}
     * @name client
     * @instance
     * @memberof module:@soundworks/core/server.Service
     */
    this.client = client;

    /**
     * Name of the service, as defined on registration.
     * @type {String}
     * @name name
     * @type {String}
     * @instance
     * @memberof @soundworks/core/client.Service
     */
    this.name = name;

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
      started: new Signal(),
      ready: new Signal(),
      errored: new Signal(), // @needs a payload
    };

    // start when all required signals are fired
    this.signals.start.addObserver(value => this.start());

    this.started = this.started.bind(this);
    this.ready = this.ready.bind(this);
    this.error = this.error.bind(this);
  }

  configure(defaults, options) {
    return Object.assign(this.options, defaults, options);
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
   * Method to call when the service is effectively started, as it may do async
   * job at start (cf. platform-service.client).
   * Should be called between `start` and `ready`
   *
   * @example
   * class MyDelayService extends soundworks.Service {
   *   // ...
   *   start() {
   *     setTimeout(() => this.ready(), 3000);
   *   }
   * }
   */
  started() {
    // @note - this as no strong incidence on the initialization lifecycle,
    // maybe should be enforced
    log(`> service "${this.name}" started`);
    this.signals.started.value = true;
  }

  /**
   * Method to call in the service lifecycle when it should be considered as
   * `ready` and thus allows the intialization process to continue.
   */
  ready() {
    log(`> service "${this.name}" ready`);
    this.signals.ready.value = true;
  }

  error(msg) {
    log(`> service "${this.name}" error: ${msg}`);
    this.signals.errored.msg = msg;
    this.signals.errored.value = true;
  }
}

export default Service;

