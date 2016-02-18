import Activity from './Activity';
import serviceManager from './serviceManager';
import Signal from './Signal';


export default class Scene extends Activity {
  constructor(id, hasNetwork) {
    super(id, hasNetwork);

    this.requiredSignals.addObserver((value) => {
      if (value) {
        this.start();
        this.hasStarted = true;
      } /* else {
        this.hold(); // pause / resume
      } */
    });


    this.signals.done = new Signal();
    this.requiredSignals.add(serviceManager.signals.ready);
  }

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */
  require(id, options) {
    return serviceManager.require(id, options);
  }

  /**
   * Add a signal to the required signals for start.
   * @param {Signal} signal - The signal that must be waited for.
   */
  waitFor(signal) {
    this.requiredSignals.add(signal);
  }

  /**
   * Mark the `Scene` as terminated. The call of this method is a responsibility
   * of the client code.
   */
  done() {
    this.hide();
    this.signals.done.set(true);
  }
}
