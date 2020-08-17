import debug from 'debug';
import merge from 'lodash.merge';
import Signal from '../common/Signal.js';
import SignalAll from '../common/SignalAll.js';

const log = debug('soundworks:lifecycle');

/**
 * Base class to be extended in order to create a new plugin.
 *
 * @memberof client
 */
class AbstractPlugin {
  constructor(client, name) {
    if (!(client)) {
      throw new Error(`[plugin] 1rst argument should be an instance of Client`);
    }

    if (!name) {
      throw new Error(`[plugin] 2nd argument should be a valid name`);
    }

    /**
     * Instance of soundworks client
     * @type {String}
     */
    this.client = client;

    /**
     * Name of the plugin, as defined on registration.
     * @type {String}
     */
    this.name = name;

    /**
     * Options of the plugin.
     * @type {Object}
     */
    this.options = {};

    /**
     * Signals defining the process state.
     * @name signals
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

  /**
   * Helper function to merge default options and user-defined options.
   *
   * @example
   * this.options = this.configure(defaults, options);
   */
  configure(defaults, options) {
    return merge({}, defaults, options);
  }

  /**
   * Interface method to override when implementing child class.
   *
   * _The child class MUST call {@link client.AbstractPlugin#started} and
   * {@link client.AbstractPlugin#ready}_
   *
   * @example
   * class MyDelayPlugin extends AbstractPlugin {
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
    throw new Error(`plugin "${this.name}": "start()" not implemented or "super.start()" called`);
  }

  /**
   * Method to call when the plugin is effectively started, as it may have to
   * do some asynchonous job at start (e.g. creating a shared state).
   *
   * _Must be called between before {@link client.AbstractPlugin#ready}._
   *
   * @example
   * class MyDelayPlugin extends AbstractPlugin {
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
      throw new Error(`plugin "${this.name}" cannot "started" before "start"`);
    }

    if (this.signals.started.value === true) {
      throw new Error(`plugin "${this.name}" cannot be "started" twice`);
    }

    // @note - this as no strong incidence on the initialization lifecycle,
    // maybe should be enforced
    log(`> plugin "${this.name}" started`);
    this.signals.started.value = true;
  }

  /**
   * Method to call in the plugin lifecycle when it should be considered as
   * ready and thus allow the initialization process to continue or the
   * application to start safely (cf. {@link client.AbstractExperience#start})
   *
   * @example
   * class MyDelayPlugin extends AbstractPlugin {
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
      throw new Error(`plugin "${this.name}" cannot "ready" before "start"`);
    }

    if (this.signals.started.value === false) {
      throw new Error(`plugin "${this.name}" cannot "ready" before "started"`);
    }

    if (this.signals.ready.value === true) {
      throw new Error(`plugin "${this.name}" cannot be "ready" twice`);
    }

    log(`> plugin "${this.name}" ready`);
    this.signals.ready.value = true;
  }

  error(msg) {
    log(`> plugin "${this.name}" error: ${msg}`);
    this.signals.errored.msg = msg;
    this.signals.errored.value = true;
  }
}

export default AbstractPlugin;

