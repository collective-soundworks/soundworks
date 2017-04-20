import Activity from './Activity';
import serviceManager from './serviceManager';

/**
 * Base class to be extended in order to create a new scene.
 *
 * @memberof module:soundworks/server
 * @extends module:soundworks/server.Activity
 */
class Scene extends Activity {
  constructor(id, clientType) {
    super(id);

    this.addClientTypes(clientType);
    // wait for service manager to ready before starting scene
    this.requiredSignals.add(serviceManager.signals.ready);
  }
}

export default Scene;
