import EventEmitter from '../../utils/EventEmitter';
import Signal from '../../utils/Signal';

/**
 * A process defines the simpliest unit of the framework.
 * It is defined by a signal `active` and 2 methods: `start` and `stop`.
 *
 * @memberof module:soundworks/client
 */
class Process extends EventEmitter {
  constructor(id) {
    super();

    if (id === undefined)
      throw new Error(`Undefined id for process ${this.constructor.name}`);

    /**
     * Name of the process.
     * @name id
     * @type {String}
     * @instanceof Process
     */
    this.id = id;

    /**
     * Signals defining the process state.
     * @name signal
     * @type {Object}
     * @instanceof Process
     */
    this.signals = {};
    this.signals.active = new Signal();
  }

  /**
   * Start the process.
   */
  start() {
    this.signals.active.set(true);
  }

  /**
   * Stop the process.
   */
  stop() {
    this.signals.active.set(false);
  }
}

export default Process;
