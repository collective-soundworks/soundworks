import Activity from './Activity';

// @todo - remove this...
import client from './client';

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
    super('experience');
  }

  /**
   * Start the experience. This lifecycle method is called when all the
   * required services are `ready` and thus the experience can begin with all
   * the necessary informations and services ready to be consumed.
   */
  start() {
    super.start();

    client.socket.send('s:exp:enter');
    // this.client.socket.send('enter');
  }
}

export default Experience;
