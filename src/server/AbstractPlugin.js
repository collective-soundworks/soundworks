import debug from 'debug';
import merge from 'lodash.merge';
import Signal from '../common/Signal.js';
import SignalAll from '../common/SignalAll.js';
import logger from './utils/logger.js';

const log = debug('soundworks:lifecycle');

/**
 * Base class to extend for creating new soundworks plugins.
 *
 * @memberof server
 */
class AbstractPlugin {
  constructor(server, name) { // should receive soundworks instance as argument
    /**
     * Instance of soundworks server.
     * @type {server.Server}
     * @see {@link server.Server}
     */
    this.server = server;

    /**
     * Name of the plugin.
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
     * @type {Object}
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
    this.signals.start.addObserver(value => {
      logger.pluginStart(this.name)
      this.start();
    });
    // log errors if any
    this.signals.errored.addObserver(value => logger.pluginErrored(this.name));

    this.ready = this.ready.bind(this);
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
   * _The child class MUST call {@link server.AbstractPlugin#started} and
   * {@link server.AbstractPlugin#ready}_
   *
   * @example
   * class MyDelayPlugin extends AbstractPlugin {
   *   // start() is executed when the `start` signal pass to `true`
   *   async start() {
   *     this.state = await this.server.stateManager.create(`s:${this.name}`);
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
   * _Must be called between before {@link server.AbstractPlugin#ready}._
   *
   * @example
   * class MyDelayPlugin extends AbstractPlugin {
   *   // start() is executed when the `start` signal pass to `true`
   *   async start() {
   *     this.state = await this.server.stateManager.create(`s:${this.name}`);
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

    logger.pluginStarted(this.name);
    this.signals.started.value = true;
  }

  /**
   * Method to call in the plugin lifecycle when it should be considered as
   * ready and thus allow the initialization process to continue or the
   * application to start safely (cf. {@link server.AbstractExperience#start}).
   *
   * @example
   * class MyDelayPlugin extends AbstractPlugin {
   *   // start() is executed when the `start` signal pass to `true`
   *   async start() {
   *     this.state = await this.server.stateManager.create(`s:${this.name}`);
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

    logger.pluginReady(this.name);
    this.signals.ready.value = true;
  }

  error(msg) {
    console.log(`> plugin "${this.name}" error: ${msg}`);
    this.signals.errored.msg = msg;
    this.signals.errored.value = true;
  }

  /**
   * Interface method to implement if specific logic should be done when a
   * {@link server.Client} connects to the plugin.
   *
   * @param {server.Client} client
   */
  connect(client) {
    log(`> [client ${client.id}] connect to plugin "${this.name}"`);
  }

  /**
   * Interface method to implement if specific logic should be done when a
   * {@link server.Client} disconnects from the plugin.
   *
   * @param {server.Client} client
   */
  disconnect(client) {
    log(`> [client ${client.id}] disconnect from plugin "${this.name}"`);
  }
}

export default AbstractPlugin;
