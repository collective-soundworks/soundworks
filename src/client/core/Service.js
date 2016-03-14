import Activity from './Activity';
import debug from 'debug';
import serviceManager from './serviceManager';
import Signal from './Signal';
import SignalAll from './SignalAll';

const log = debug('soundworks:services');

export default class Service extends Activity {
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
    this.requiredSignals.add(serviceManager.signals.start);
  }

  ready() {
    this.stop();
    log(`"${this.id}" ready`);
    this.signals.ready.set(true);
  }

  require(id, options) {
    const service = serviceManager.require(id, options);
    const signal = service.signals.ready;

    if (signal)
      this.requiredSignals.add(signal);
    else
      throw new Error(`signal "continue" doesn't exist on service :`, service);

    return service;
  }

  start() {
    log(`"${this.id}" started`);
    super.start();
  }

  stop() {
    log(`"${this.id}" stopped`);
    super.stop();
  }
}

