import Signal from '../common/Signal';
import SignalAll from '../common/SignalAll';
import debug from 'debug';
import logger from './utils/logger';

// import

const log = debug('soundworks:lifecycle');

/**
 * Base class to extend for creating new soundworks services.
 *
 * @memberof @soundworks/core/server
 */
class Service {
  constructor(server, name) { // should receive soundworks instance as argument
    /**
     * Instance of soundworks server.
     * @type {String}
     * @name server
     * @instance
     * @memberof module:@soundworks/core/server.Service
     *
     */
    this.server = server;

    /**
     * Id of the service.
     * @type {String}
     * @name name
     * @instance
     * @memberof module:@soundworks/core/server.Service
     */
    this.name = name;

    /**
     * Options of the activity. These values should be updated with the
     * `this.configure` method.
     * @type {Object}
     * @name options
     * @instance
     * @memberof module:@soundworks/core/server.Service
     */
    this.options = {};

    /**
     * Signals defining the process state.
     * @name signals
     * @type {Object}
     * @memberof module:@soundworks/core/server.Service
     */
    this.signals = {
      start: new SignalAll(),
      started: new Signal(),
      ready: new Signal(),
      errored: new Signal(),
    };

    /** @private */
    this.clientTypes = new Set();
    // register in the server
    this.server.activities.add(this);
    // start when all required signals are fired
    this.signals.start.addObserver(value => this.start());

    this.ready = this.ready.bind(this);
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
   * to be synchronized to display usefull feedback or GUIs). We mostly keep
   * that server-side for symetry reasons.
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
  start() {
    throw new Error(`service "${this.name}": "start()" not implemented or "super.start()" called`);
  }

  started() {
    // @note - these check are mostly there for development help. Could be
    // replaced with decorators.
    if (this.signals.start.value === false) {
      throw new Error(`service "${this.name}" cannot "started" before "start"`);
    }

    if (this.signals.started.value === true) {
      throw new Error(`service "${this.name}" cannot be "started" twice`);
    }

    logger.serviceStarted(this.name);
    this.signals.started.value = true;
  }

  /**
   * Method to call in the service lifecycle when it should be considered as
   * `ready` and thus allows the intialization process to continue.
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

    logger.serviceReady(this.name);
    this.signals.ready.value = true;
  }

  connect(client) {
    log(`> [client ${client.id}] connect service "${this.name}"`);
  }

  disconnect(client) {
    log(`> [client ${client.id}] disconnect service "${this.name}"`);
  }
}

export default Service;
