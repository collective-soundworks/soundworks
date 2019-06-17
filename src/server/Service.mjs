import Activity from './Activity';
import Signal from '../common/Signal';

/**
 * Base class to be extended in order to create a new service.
 *
 * @memberof module:soundworks/server
 * @extends module:soundworks/server.Activity
 */
class Service extends Activity {
  constructor(...args) {
    super(...args);

    /**
     * Name of the service.
     * @type {String}
     * @name name
     * @instance
     * @memberof module:soundworks/server.Activity
     */
    this.name = null;

    this.signals = {};
    this.signals.ready = new Signal();
  }

  ready() {
    this.signals.ready.set(true);
  }
}

export default Service;
