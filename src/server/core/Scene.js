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
  }
}

export default Scene;
