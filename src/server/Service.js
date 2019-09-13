import Signal from '../common/Signal';
import SignalAll from '../common/SignalAll';
import debug from 'debug';
import logger from './utils/logger';

// import

const log = debug('soundworks:lifecycle');

/**
 * Base class to be extended in order to create a new service.
 *
 * @memberof @soundworks/core/server
 */
class Service {
  constructor(server, name) { // should receive soundworks instance as argument
    /**
     * Instance of soundworks server
     * @type {String}
     * @name server
     * @instance
     * @memberof module:@soundworks/core/server.Service
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
     * @name signal
     * @type {Object}
     * @instanceof Process
     */
    this.signals = {
      start: new SignalAll(),
      started: new Signal(),
      ready: new Signal(),
      errored: new Signal(),
    };

    /**
     *
     */
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

  /** @inheritdoc */
  start() {
    // logger.serviceStart(this.name);
  }

  started() {
    // @note - this as no strong incidence on the initialization lifecycle,
    // maybe should be enforced
    logger.serviceStart(this.name);
    this.signals.started.value = true;
  }

  /**
   * Method to call in the service lifecycle when it should be considered as
   * `ready` and thus allows all its dependent activities to start themselves.
   */
  ready() {
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
