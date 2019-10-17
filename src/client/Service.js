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
   * Interface method to override when implemnting child classes
   * The child class MUST call `this.started()` when first init step (creating
   * state etc. is done) and `this.ready()` when fully initialized.
   *
   * @todo - This granularity is especially important client side, so that
   * we can give feedback on the initialization steps (e.g. we need the state
   * to be synchronized to display usefull feedback or GUIs). This is kept
   * that server-side for symetry reasons.
   *
   * @example
   * class MyDelayService extends soundworks.Service {
   *   // ...
   *   async start() {
   *     this.state = await this.client.stateManager.attach(`s:${this.name}`);
   *     this.started();
   *     // do [async] stuff
   *     setTimeout(() => this.ready(), 3000);
   *   }
   * }
   */
  start() {
    throw new Error(`service "${this.name}.start()" not implemented`);
  }

  /**
   * Method to call when the service is effectively started, as it may do async
   * job at start (cf. platform-service.client). Must be called between `start`
   * and `ready`.
   *
   * @example
   * class MyDelayService extends soundworks.Service {
   *   // start() is executed when the `start` signal pass to `true`
   *   async start() {
   *     this.state = await this.client.stateManager.attach(`s:${this.name}`);
   *     this.started();
   *     // do [async] stuff
   *     setTimeout(() => this.ready(), 3000);
   *   }
   * }
   */
  started() {
    // @note - these check are mostly there for development help. Could be
    // replaced with decorators.
    if (this.signals.start.value === false) {
      throw new Error(`service "${this.name}" cannot "started" before "start"`);
    }

    if (this.signals.started.value === true) {
      throw new Error(`service "${this.name}" cannot be "started" twice`);
    }

    // @note - this as no strong incidence on the initialization lifecycle,
    // maybe should be enforced
    log(`> service "${this.name}" started`);
    this.signals.started.value = true;
  }

  /**
   * Method to call in the service lifecycle when it should be considered as
   * `ready` and thus allows the intialization process to continue.
   *
   * @example
   * class MyDelayService extends soundworks.Service {
   *   // ...
   *   async start() {
   *     this.state = await this.client.stateManager.attach(`s:${this.name}`);
   *     this.started();
   *     // do [async] stuff
   *     setTimeout(() => this.ready(), 3000);
   *   }
   * }
   */
  ready() {
    // @note - these check are mostly there for development help. Could be
    // replaced with decorators.
    if (this.signals.start.value === false) {
      throw new Error(`service "${this.name}" cannot "ready" before "start"`);
    }

    if (this.signals.started.value === false) {
      throw new Error(`service "${this.name}" cannot "ready" before "started"`);
    }

    if (this.signals.ready.value === true) {
      throw new Error(`service "${this.name}" cannot be "ready" twice`);
    }

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

