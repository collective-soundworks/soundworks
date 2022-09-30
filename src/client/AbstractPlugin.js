import debug from 'debug';
import merge from 'lodash.merge';
import Signal from '../common/Signal.js';
import SignalAll from '../common/SignalAll.js';

const log = debug('soundworks:lifecycle');

/**
 * Base class to extend for implementing a new plugin.
 *
 * A plugin should always be provided wrapped in a factory function to allow for
 * dynamically extend this class and avoid circular dependencies.
 *
 * @example
 * function myPluginFactory(AbstractPlugin) {
 *   class MyPlugin extends AbstractPlugin {
 *     constructor(client, name, options) {
 *       super(client, name);
 *       // ...
 *     }
 *
 *     async start() {
 *       await ...
 *       this.started();
 *       await ...
 *       this.ready();
 *     }
 *   }
 *
 *   return MyPlugin;
 * }
 * // then register the factory
 * client.pluginManager.register('my-plugin', myPluginFactory, { options }, []);
 *
 * @param {client.Client} client - instance of the soundworks Client
 * @param {String} name - user defined name of the plugin
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
     * Instance of the soundworks client
     * @see {client.Client}
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
     * @type {Object}
     */
    /** @private */
    this.signals = {
      start: new SignalAll(),
      started: new Signal(),
      ready: new Signal(),
      errored: new Signal(), // @needs a payload
    };

    // start when all required signals are fired
    this.signals.start.addObserver(() => this.start());

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
   * _Important: the derived class MUST call {@link client.AbstractPlugin#started}
   * and {@link client.AbstractPlugin#ready} to notify soundworks about the
   * state of the plugin_
   *
   * @see {client.AbstractPlugin#started}
   * @see {client.AbstractPlugin#ready}
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
   * Lifecyle method to call in the {@link client.AbstractPlugin#start} method
   * when the plugin is effectively started, as it may have to
   * do some asynchonous job at start (e.g. creating a shared state, waiting for
   * user input, etc.).
   *
   * _Must be called between before {@link client.AbstractPlugin#ready}._
   *
   * @see {client.AbstractPlugin#start}
   * @see {client.AbstractPlugin#ready}
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
   * Lifecyle method to call in the {@link client.AbstractPlugin#start} method
   * when the plugin has completely finished its initialization should be
   * considered as ready. Calling this method notify soundworks that the
   * initialization process can continue or that the application can start
   * safely (cf. {@link client.AbstractExperience#start})
   *
   * @see {client.AbstractPlugin#start}
   * @see {client.AbstractPlugin#started}
   * @see {client.AbstractExperience#start}
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

