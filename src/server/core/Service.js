import Activity from '../core/Activity';

/**
 * Base class to be extended in order to create a new service.
 *
 * @memberof module:soundworks/server
 * @extends module:soundworks/server.Activity
 */
class Service extends Activity {
  // constructor(...args) {
  //   super(...args);
  //
       // this should be in Activity
  //   this.signals = {};
  //   this.signals.ready = new Signal();

  //   this.requiredSignals = new SignalAll();
  //   this.requiredSignals.addObserver(() => this.start);
  //   // wait for serviceManager.start
  //   this.requiredSignals.add(serviceManager.signals.start);
  // }

  require(id, options) {
    const instance = serviceManager.require(id, this, options);
    this.requiredSignals.add(instance.signals.ready);
  }
}

export default Service;
