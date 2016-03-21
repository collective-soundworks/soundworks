import { EventEmitter } from 'events';
import Signal from './Signal';

/**
 * A process defines the simpliest unit of the framework.
 * It is defined by a signal `active` and 2 methods: `start` and `stop`.
 *
 * @memberof module:soundworks/client
 */
class Process extends EventEmitter {
  constructor(id) {
    super();
    /**
     * Name of the process.
     * @type {String}
     */
    this.id = id;

    /**
     * Signals defining the process state.
     * @type {Object}
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
