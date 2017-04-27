import Activity from '../core/Activity';
import Signal from '../../utils/Signal';

/**
 * Base class to be extended in order to create a new service.
 *
 * @memberof module:soundworks/server
 * @extends module:soundworks/server.Activity
 */
class Service extends Activity {
  constructor(...args) {
    super(...args);

    this.signals = {};
    this.signals.ready = new Signal();
  }

  ready() {
    this.signals.ready.set(true);
  }
}

export default Service;
