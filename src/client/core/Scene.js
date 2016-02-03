import Activity from './Activity';
import serviceManager from './serviceManager';
import Signal from './Signal';


export default class Scene extends Activity {
  constructor(id, hasNetwork) {
    super(id, hasNetwork);

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
}
