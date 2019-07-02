import Activity from './Activity';
import client from './client';
import serviceManager from './serviceManager';

/**
 * Base class to be extended in order to create the client-side of a custom
 * experience.
 *
 * The user defined `Experience` is the main component of a soundworks application.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Activity
 */
class Experience extends Activity {
  constructor() {
    super();
  }

  require(name, options = {}, dependencies = []) {
    return serviceManager.get(name, options, dependencies);
  }

  /**
   * Start the experience. This lifecycle method is called when all the
   * required services are `ready` and thus the experience can begin with all
   * the necessary informations and services ready to be consumed.
   */
  start() {
    super.start();

    client.socket.send('s:exp:enter');
  }
}

export default Experience;
