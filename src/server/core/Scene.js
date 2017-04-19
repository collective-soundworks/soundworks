import Activity from '../core/Activity';

/**
 * Base class to be extended in order to create a new scene.
 *
 * @memberof module:soundworks/server
 * @extends module:soundworks/server.Activity
 */
class Scene extends Activity {
  constructor(id, clientType) {
    super(id);

    this.addClientType(clientType);
    // add serviceManager.signals.ready as requiredSignal
    // this.requiredSignals.add(serviceManager.signals.ready);
  }

  // override require
  // require(id, options) {
  //   return serviceManager.require(id, this, options);
  // }
}

export default Scene;
