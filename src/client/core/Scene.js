import Activity from './Activity';
import serviceManager from './serviceManager';
import Signal from './Signal';


export default class Scene extends Activity {
  constructor(id, hasNetwork) {
    super(id, hasNetwork);

    this.signals.done = new Signal();
    this.requiredSignals.add(serviceManager.signals.ready);
  }

  require(id, options) {
    return serviceManager.require(id, options);
  }
}
